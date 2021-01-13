import * as helpers from '../helpers';
import { RandomForestClassifier, RandomForestClassifierModel } from 'ml-random-forest';
import { CreditProcessState } from '../../../../interface/CreditProcessState';
import { MachineLearningStrategySegment } from '../../interface/MachineLearningStrategySegment';
import mathjs from 'mathjs';
import { MLModel } from '../../interface/MLModel';
import { ProviderOutput } from '../../interface/ProviderOutput';
import { ScoreAnalysis } from '../../interface/ScoreAnalysis';
import { StrategyDataSchema } from '../../interface/StrategyDataSchema';
import { VariableInputType } from '../../../../enum/VariableInputType';
import { VariableValue } from '../../../../type/VariableValue';

export default async (
  mlmodel: MLModel,
  segment: MachineLearningStrategySegment,
  state: CreditProcessState,
  scoreAnalysis: ScoreAnalysis | null,
): Promise<ProviderOutput> => {
  const randomForest = mlmodel[ 'random_forest' ];
  const datasource = mlmodel.datasource;
  const statistics = datasource.statistics;
  const mlInputSchema = datasource.included_columns || datasource.strategy_data_schema;
  const strategyDataSchema = JSON.parse(mlInputSchema) as StrategyDataSchema;
  const transformations = datasource.transformations;
  const providerDatasource = datasource.providers.digifi;
  const modelType = mlmodel.type;

  const datasourceHeaders = providerDatasource.headers.filter(header => header !== 'historical_result');

  const features = datasourceHeaders.reduce((
    reduced: number[],
    model_variable_name: string,
  ) => {
    const variable = segment.inputs.find((variable) => variable.model_variable_name === model_variable_name);

    if (!variable || variable.system_variable_id === null || variable.system_variable_id === undefined) {
      throw new Error(`Cannot retrive ML variable ${model_variable_name}`);
    }

    if (variable.input_type === VariableInputType.Value) {
      reduced.push(variable.system_variable_id as number);
    } else {
      if (state[variable.system_variable_id] === undefined
        || state[variable.system_variable_id] === null
      ) {
        throw new Error(`Cannot retrive ML variable ${variable.model_variable_name}`);
      }

      reduced.push(state[variable.system_variable_id] as number);
    }

    return reduced;
  }, []);

  const columnTypes: Record<string, string> = {};
  for (const [key, val] of Object.entries(strategyDataSchema)) {
    columnTypes[key] = val.data_type;
  }

  const transposedRows = helpers.formatDataTypeColumns(
    columnTypes,
    datasourceHeaders,
    [features],
  );

  const hotEncoded = helpers.oneHotEncodeValues({
    transposed_rows: transposedRows,
    columnTypes,
    encoders: datasource.encoders,
    encoder_counts: datasource.encoder_counts,
    csv_headers: datasourceHeaders,
  });

  let cleaned = hotEncoded.map((column, idx) => {
    const header = datasourceHeaders[idx];
    const mean = statistics[header].mean;

    return column.map(element => isNaN(element) ? mean : element);
  });

  if (columnTypes['historical_result'] === 'Boolean' || columnTypes['historical_result'] === 'Number') {
    cleaned = cleaned.map((column, idx) => {
      const header = datasourceHeaders[idx];
      if (columnTypes[header] !== 'Number') {
        return column;
      }

      const transformation = transformations[header];

      if (!transformation || !transformation.evaluator) {
        return column;
      }

      const applyTransformFunc = new Function('x', transformation.evaluator) as
        (value: number, index: number, array: number[]) => number;

      return column.map(applyTransformFunc);
    });
  }

  cleaned = mathjs.transpose(cleaned);
  const modelConfig = JSON.parse(randomForest.model) as RandomForestClassifierModel;
  const classifier = RandomForestClassifier.load(modelConfig);
  const predictions = (mlmodel.type === 'binary')
    ? helpers.runRandomForestPrediction(classifier, cleaned)
    : helpers.runRandomForestPredictionCategorical(classifier, cleaned);

  const predictionRow: number[] | number = predictions[0];

  let adr = null;
  let digifi_score = null;
  let maxValue = null;
  let predictedLabel: number | null = null;
  let prediction: number | null = null;

  if (modelType === 'binary') {
    if (scoreAnalysis) {
      digifi_score = helpers.mapPredictionToDigiFiScore(predictionRow as number);
      adr = helpers.generateProjectedResult(scoreAnalysis, predictionRow as number);
    }
  } else if (modelType === 'categorical') {
    maxValue = Math.max(...predictionRow as number[]);
    predictedLabel = (predictionRow as number[]).indexOf(maxValue);
    prediction = maxValue;
  }

  const explainabilityResults: Array<{ answer: number, variable: string }> = [];
  datasourceHeaders.forEach((header, i) => {
    const newCleaned = cleaned[0].slice();

    if (strategyDataSchema[header] && strategyDataSchema[header].data_type === 'Number') {
      if (!statistics[header] || statistics[header].mean === undefined) {
        throw new Error(`${statistics[header]}.mean should be defined`);
      }

      newCleaned[i] = statistics[header].mean;

      if (transformations
        && transformations[header]
        && transformations[header].evaluator
      ) {
        const applyTransformFunc = new Function('x', transformations[header].evaluator);
        newCleaned[i] = applyTransformFunc(newCleaned[i]);
      }
    } else if (strategyDataSchema[header]
      && (strategyDataSchema[header].data_type === 'String'
      || strategyDataSchema[header].data_type === 'Boolean')
      && statistics[header].mode !== undefined
    ) {
      newCleaned[i] = statistics[header].mode as number;

      if (newCleaned[i] !== undefined
        && datasource.encoders[header]
        && datasource.encoders[header][newCleaned[i]] !== undefined
      ) {
        newCleaned[i] = datasource.encoders[header][newCleaned[i]];
      } else {
        newCleaned[i] = datasource.encoder_counts[header];
      }
    }
    const explainabilityResultArray = (modelType === 'binary')
      ? helpers.runRandomForestPrediction(classifier, [newCleaned])
      : helpers.runRandomForestPredictionCategorical(classifier, [newCleaned]);

    let explainabilityResult: number | null = null;

    if (modelType === 'categorical') {
      maxValue = Math.max(...predictionRow as number[]);
      predictedLabel = (predictionRow as number[]).indexOf(maxValue);
      explainabilityResult = (explainabilityResultArray[0] as number[])[predictedLabel];
    } else {
      explainabilityResult = explainabilityResultArray[0] as number;
    }
    explainabilityResults.push({
      answer: (modelType === 'regression')
        ? Number((prediction as number - explainabilityResult).toFixed(2))
        : Number((prediction as number - explainabilityResult).toFixed(4)),
      variable: header,
    });
  });

  explainabilityResults.sort((a, b) => b.answer - a.answer);
  let positiveCount = 0;
  let negativeCount = 0;
  let explainabilityIdx = 0;
  const positiveResultsArr: (string | null)[] = [];
  const negativeResultsArr: (string | null)[] = [];
  const explain_length = explainabilityResults.length;

  while (positiveCount < 5 && negativeCount < 5) {
    if (positiveCount < 5) {
      if (explainabilityIdx < explain_length && explainabilityResults[explainabilityIdx].answer > 0) {
        positiveResultsArr.push(explainabilityResults[explainabilityIdx].variable);
      } else {
        positiveResultsArr.push(null);
      }
      positiveCount++;
    }
    if (negativeCount < 5) {
      if (explainabilityResults[explain_length - explainabilityIdx - 1].answer < 0) {
        negativeResultsArr.push(explainabilityResults[explain_length - explainabilityIdx - 1].variable);
      } else {
        negativeResultsArr.push(null);
      }
      negativeCount++;
    }
    explainabilityIdx++;
  }
  prediction = modelType === 'categorical'
    ? datasource.decoders.historical_result[predictedLabel!]
    : prediction;

  const resultsArr: VariableValue[] = mlmodel.industry
    ? [digifi_score as number, adr as number]
    : [prediction as number];
  resultsArr.push(...positiveResultsArr, ...negativeResultsArr);

  const mlOutput = segment.outputs.reduce((aggregate: Record<string, VariableValue>, output, i) => {
    if (output.output_variable) {
      state[output.output_variable] = resultsArr[i];
      aggregate[output.output_variable] = resultsArr[i];
    }

    return aggregate;
  }, {});

  return {
    prediction: prediction!,
    classification: modelType,
    output: mlOutput,
  };
};
