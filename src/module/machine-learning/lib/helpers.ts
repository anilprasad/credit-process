import Matrix, { MatrixColumnSelectionView, WrapperMatrix2D } from 'ml-matrix';
import { DecisionTreeClassifier } from './DecisionTreeClassifier';
import { DecisionTreeRegression } from './DecisionTreeRegression';
import mathjs from 'mathjs';
import { MLModelDataSource } from '../interface/MLModelDataSource';
import { RandomForestClassifier } from 'ml-random-forest';
import { ScoreAnalysis } from '../interface/ScoreAnalysis';

interface IHotEncodeOptions {
  transposed_rows: number[][];
  columnTypes: Record<string, string>;
  encoders: MLModelDataSource['encoders'];
  encoder_counts: MLModelDataSource['encoder_counts'];
  csv_headers: string[];
}

export const runDecisionTreePrediction = (
  classifier: DecisionTreeRegression | DecisionTreeClassifier,
  dataset: MatrixColumnSelectionView | number[][],
): number[] => {
  const toPredict = Matrix.checkMatrix(dataset);
  const predictions: number[] = new Array(toPredict.rows);

  for (let i = 0; i < toPredict.rows; ++i) {
    predictions[i] = (classifier.root.classify(toPredict.getRow(i)) as Matrix).get(0, 1) || 0;
  }

  return predictions;
};

export const runDecisionTreePredictionCategorical = (
  classifier: DecisionTreeRegression | DecisionTreeClassifier,
  dataset: MatrixColumnSelectionView | number[][],
): number[][] => {
  const toPredict = Matrix.checkMatrix(dataset);
  const predictions: number[][] = new Array(toPredict.rows);

  for (let i = 0; i < toPredict.rows; ++i) {
    predictions[i] = (classifier.root.classify(toPredict.getRow(i)) as Matrix).getRow(0);
  }

  return predictions;
};

export const runRandomForestPrediction = (
  classifier: RandomForestClassifier,
  toPredict: number[][],
): number[][] => {
  const predictionValues = new Array(classifier.nEstimators);
  const toPredictMatrix = Matrix.checkMatrix(toPredict);

  for (let i = 0; i < classifier.nEstimators; ++i) {
    const X = new MatrixColumnSelectionView(toPredictMatrix, classifier.indexes[ i ]);
    predictionValues[i] = runDecisionTreePrediction(classifier.estimators[i], X);
  }

  const predictionValuesMatrix = new WrapperMatrix2D(predictionValues).transpose();

  const predictions = new Array(predictionValuesMatrix.rows);

  for (let i = 0; i < predictionValuesMatrix.rows; ++i) {
    predictions[i] = classifier.selection(predictionValuesMatrix.getRow(i));
  }

  return predictions;
};

export const runRandomForestPredictionCategorical = (
  classifier: RandomForestClassifier,
  toPredict: number[][],
): number[] => {
  const predictionValues = new Array(classifier.nEstimators);

  const toPredictMatrix = Matrix.checkMatrix(toPredict);

  for (let i = 0; i < classifier.nEstimators; ++i) {
    const X = new MatrixColumnSelectionView(toPredictMatrix, classifier.indexes[ i ]);
    predictionValues[i] = runDecisionTreePredictionCategorical(classifier.estimators[i], X);
  }

  const predictionValuesMatrix = new WrapperMatrix2D(predictionValues).transpose();

  const predictions: number[] = new Array(predictionValuesMatrix.rows);

  for (let i = 0; i < predictionValuesMatrix.rows; ++i) {
    predictions[i] = classifier.selection(predictionValuesMatrix.getRow(i));
  }

  return predictions;
};

export const formatDataTypeColumns = (
  columnTypes: Record<string, string> ,
  csvHeaders: string[],
  rows: number[][],
): number[][] => {
  const transposedrows = mathjs.transpose(rows);

  csvHeaders.forEach((header, idx) => {
    if (columnTypes[header] === 'Date') {
      transposedrows[idx] = transposedrows[idx].map(celldata => new Date(celldata).getTime());
    }
  });

  return transposedrows;
};

export const oneHotEncodeValues = ({
  transposed_rows,
  columnTypes,
  encoders,
  encoder_counts,
  csv_headers,
}: IHotEncodeOptions): number[][] => {
  const hot_encoded_rows = transposed_rows.map((column, idx) => {
    const header = csv_headers[idx];

    if (columnTypes[header] !== 'String' && columnTypes[header] !== 'Boolean') {
      return column;
    }

    return column.map(data => {
      if (!isNaN(encoders[header][data])) {
        return encoders[header][data];
      }

      return encoder_counts[header];
    });
  });

  return hot_encoded_rows;
};

export const generateProjectedResult = (scoreanalysis: ScoreAnalysis, prediction: number) => {
  const evaluatorFunc = new Function('x', scoreanalysis.results.projection_evaluator);
  const projection_adr = evaluatorFunc(mapPredictionToDigiFiScore(prediction));

  if (!isNaN(parseFloat(projection_adr))) {
    return projection_adr < 0 ? 0 : projection_adr;
  }

  return prediction;
};

export const mapPredictionToDigiFiScore = (prediction: number) => {
  switch (true) {
    case (prediction < 0.002):
      return 850;
    case (prediction < 0.004):
      return 840;
    case (prediction < 0.006):
      return 830;
    case (prediction < 0.008):
      return 820;
    case (prediction < 0.01):
      return 810;
    case (prediction < 0.015):
      return 800;
    case (prediction < 0.02):
      return 790;
    case (prediction < 0.025):
      return 780;
    case (prediction < 0.03):
      return 770;
    case (prediction < 0.035):
      return 760;
    case (prediction < 0.045):
      return 750;
    case (prediction < 0.055):
      return 740;
    case (prediction < 0.065):
      return 730;
    case (prediction < 0.075):
      return 720;
    case (prediction < 0.085):
      return 710;
    case (prediction < 0.1):
      return 700;
    case (prediction < 0.115):
      return 690;
    case (prediction < 0.13):
      return 680;
    case (prediction < 0.145):
      return 670;
    case (prediction < 0.16):
      return 660;
    case (prediction < 0.175):
      return 650;
    case (prediction < 0.19):
      return 640;
    case (prediction < 0.205):
      return 630;
    case (prediction < 0.22):
      return 620;
    case (prediction < 0.235):
      return 610;
    case (prediction < 0.255):
      return 600;
    case (prediction < 0.275):
      return 590;
    case (prediction < 0.295):
      return 580;
    case (prediction < 0.315):
      return 570;
    case (prediction < 0.335):
      return 560;
    case (prediction < 0.355):
      return 550;
    case (prediction < 0.375):
      return 540;
    case (prediction < 0.395):
      return 530;
    case (prediction < 0.415):
      return 520;
    case (prediction < 0.435):
      return 510;
    case (prediction < 0.46):
      return 500;
    case (prediction < 0.485):
      return 490;
    case (prediction < 0.51):
      return 480;
    case (prediction < 0.535):
      return 470;
    case (prediction < 0.56):
      return 460;
    case (prediction < 0.585):
      return 450;
    case (prediction < 0.61):
      return 440;
    case (prediction < 0.635):
      return 430;
    case (prediction < 0.66):
      return 420;
    case (prediction < 0.685):
      return 410;
    case (prediction < 0.715):
      return 300;
    case (prediction < 0.745):
      return 390;
    case (prediction < 0.775):
      return 380;
    case (prediction < 0.805):
      return 370;
    case (prediction < 0.835):
      return 360;
    case (prediction < 0.865):
      return 350;
    case (prediction < 0.895):
      return 340;
    case (prediction < 0.925):
      return 330;
    case (prediction < 0.955):
      return 320;
    case (prediction < 0.985):
      return 310;
    case (prediction <= 1):
      return 300;
    default:
      return 300;
  }
};

export const normalize = (min: number, max: number): (val: number) => number => {
  const delta = max - min;

  return (val: number) => {
    const scaled = (val - min) / delta;

    if (scaled > 1) {
      return 1;
    }

    if (scaled < 0) {
      return 0;
    }

    return scaled;
  };
};
