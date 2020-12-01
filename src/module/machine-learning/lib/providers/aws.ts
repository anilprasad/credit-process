import * as helpers from '../helpers';
import { CreditProcessState } from '../../../../interface/CreditProcessState';
import { MachineLearningStrategySegment } from '../../interface/MachineLearningStrategySegment';
import { MLModel } from '../../interface/MLModel';
import periodic from 'periodicjs';
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
  const explainabilityResults: Array<{variable: string, answer: number}> = [];
  const machinelearning = periodic.aws.machinelearning;

  const providerdata = mlmodel['aws'];
  const modelType = mlmodel.type;
  const datasource = mlmodel.datasource;
  const strategyDataSchema = JSON.parse(datasource.strategy_data_schema) as StrategyDataSchema;
  const mlStatistics = datasource.statistics;
  const awsDataSchemaMap = JSON.parse(mlmodel.datasource.data_schema).attributes
    .reduce((aggregate: Record<string, string>, config: { attributeName: string, attributeType: string }) => {
      aggregate[config.attributeName] = config.attributeType;
      return aggregate;
    }, {});

  const columnTypes: Record<string, string> = {};
  for (const [key, val] of Object.entries(strategyDataSchema)) {
    columnTypes[key] = val.data_type;
  }

  const mlVariables = segment.inputs.reduce((reduced: Record<string, AWS.MachineLearning.VariableValue>, variable) => {
    if (variable.system_variable_id === undefined || variable.system_variable_id === null) {
      throw new Error(`Cannot retrive ML variable ${variable.model_variable_name}`);
    }

    if (variable.input_type === VariableInputType.Value) {
      reduced[variable.model_variable_name] = variable.system_variable_id.toString();
    } else {
      if (state[variable.system_variable_id] === undefined
        || state[variable.system_variable_id] === null
      ) {
        throw new Error(`Cannot retrive ML variable ${variable.model_variable_name}`);
      }

      reduced[variable.model_variable_name] = (state[variable.system_variable_id] as string).toString();
    }

    if (reduced[variable.model_variable_name]
      && columnTypes[variable.model_variable_name]
      && columnTypes[variable.model_variable_name] === 'Date'
    ) {
      reduced[variable.model_variable_name] = new Date(reduced[variable.model_variable_name] as string)
        .getTime()
        .toString();
    }

    return reduced;
  }, {});

  const params = {
    MLModelId: providerdata.real_time_prediction_id,
    PredictEndpoint: providerdata.real_time_endpoint,
    Record: mlVariables,
  };

  const prediction = await machinelearning.predict(params).promise();
  let score: number | string | undefined;
  let categoricalResult: string | undefined;
  const { Prediction: predictionResult } = prediction;
  if (predictionResult
    && predictionResult['details']
    && predictionResult['predictedScores']
    && predictionResult['predictedLabel']
  ) {
    const { details, predictedScores, predictedLabel, predictedValue } = predictionResult;

    switch (details.PredictiveModelType) {
      case 'BINARY':
        score = predictedScores[predictedLabel];
        break;
      case 'REGRESSION':
        score = predictedValue;
        break;
      case 'MULTICLASS':
        score = predictedScores[predictedLabel];
        categoricalResult = predictedLabel;
        break;
    }
  }

  let digifi_score: number | undefined;
  let adr: number | undefined;

  if (mlmodel.type === 'binary' && scoreAnalysis) {
    digifi_score = helpers.mapPredictionToDigiFiScore(score as number);
    adr = helpers.generateProjectedResult(scoreAnalysis, score as number);
  }

  await Promise.all(Object.keys(mlVariables).map(async (variable) => {
    let new_variable_value = null;
    if (strategyDataSchema[variable] && strategyDataSchema[variable].data_type === 'Number') {
      if (awsDataSchemaMap[variable] === 'CATEGORICAL') {
        new_variable_value = (mlStatistics[variable] && mlStatistics[variable].mode !== undefined)
          ? String(mlStatistics[variable].mode)
          : null;
      } else {
        new_variable_value = (mlStatistics[variable] && mlStatistics[variable].mean !== undefined)
          ? String(mlStatistics[variable].mean)
          : null;
      }
    } else if (strategyDataSchema[variable]
      && (strategyDataSchema[variable].data_type === 'String' || strategyDataSchema[variable].data_type === 'Boolean')
      && mlStatistics[variable].mode !== undefined
    ) {
      new_variable_value = mlStatistics[variable].mode ? String(mlStatistics[variable].mode) : null;
    }

    if (new_variable_value === null) {
      throw new Error('Cannot build prediction');
    }

    const adjusted_params = {
      ...params,
      Record: {
        ...mlVariables,
        [`${variable}`]: new_variable_value,
      },
    };
    const { Prediction: newPrediction } = await machinelearning.predict(adjusted_params).promise();

    let answer: number | undefined;
    if (newPrediction
      && newPrediction['details']
      && newPrediction['predictedScores']
      && newPrediction['predictedLabel']
    ) {
      const { details, predictedScores, predictedLabel, predictedValue } = newPrediction;

      switch (details.PredictiveModelType) {
        case 'BINARY':
          answer = predictedScores[predictedLabel];
          break;
        case 'REGRESSION':
          answer = predictedValue;
          break;
        case 'MULTICLASS':
          answer = predictedScores[predictedLabel];
          break;
      }
    }

    explainabilityResults.push({
      answer: (modelType === 'regression')
        ? Number((Number(score) - Number(answer)).toFixed(2))
        : Number((Number(score) - Number(answer)).toFixed(4)),
      variable,
    });
  }));

  explainabilityResults.sort((a, b) => b.answer - a.answer);
  let positiveCount = 0;
  let negativeCount = 0;
  let explainabilityIdx = 0;
  const positiveResultsArr = [];
  const negativeResultsArr = [];
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
  score = (modelType === 'categorical') ? categoricalResult : score;
  const resultsArr: VariableValue[] = mlmodel.industry
    ? [digifi_score as number, adr as number]
    : [score as number];
  resultsArr.push(...positiveResultsArr, ...negativeResultsArr);

  const mlOutput = segment.outputs.reduce((aggregate: Record<string, VariableValue>, output, i) => {
    if (output.output_variable) {
      state[output.output_variable] = resultsArr[i];
      aggregate[output.output_variable] = resultsArr[i];
    }

    return aggregate;
  }, {});

  return {
    prediction,
    classification: modelType,
    output: mlOutput,
  };
};
