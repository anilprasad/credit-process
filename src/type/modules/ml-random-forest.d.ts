declare module 'ml-random-forest' {
  import Matrix from 'ml-matrix';

  interface RandomForestBaseOptions {
    maxFeatures: number;
    replacement: boolean;
    nEstimators: number;
    seed: number;
    useSampleBagging: boolean;
    treeOptions: Record<string, unknown>;
    noOOB: boolean;
    isClassifier: boolean;
    selectionMethod?: 'mean' | 'median';
  }

  type Estimator = any;

  class RandomForestBase implements RandomForestBaseOptions {
    n?: number;
    indexes: number[][];
    estimators: Estimator[];
    oobResults?: {
        true: number;
        all: number[];
        predicted: number;
    }[];

    maxFeatures: number;
    replacement: boolean;
    nEstimators: number;
    seed: number;
    useSampleBagging: boolean;
    treeOptions: Record<string, unknown>;
    noOOB: boolean;
    isClassifier: boolean;
    selectionMethod?: 'mean' | 'median';

    predict(toPredict: (number[][]) | Matrix): number[];
    train(trainingSet: number[][], trainingValues: number[]): void;
    predictOOB(): number[];
    predictionValues(toPredict: (number[][]) | Matrix): Matrix;
  }

  interface baseModel extends RandomForestBaseOptions {
    indexes: number[][];
    n: number;
    estimators: Estimator[];
  }

  export interface RandomForestClassifierModel {
    baseModel: baseModel;
    name: 'RFClassifier';
  }

  interface RandomForestRegressionModel {
    baseModel: baseModel;
    name: 'RFRegression';
    selectionMethos: 'mean' | 'median';
  }

  export class RandomForestClassifier extends RandomForestBase {
    constructor(options: Partial<RandomForestBaseOptions> | true, model?: RandomForestClassifierModel);
    selection(values: any[]): number;
    toJSON(): RandomForestClassifierModel;
    static load(model: RandomForestClassifierModel): RandomForestClassifier;
    predictProbability(toPredict: number[][], label: number): number[];
    getConfusionMatrix(): number[][];
  }

  export class RandomForestRegression extends RandomForestBase {
    constructor(options: Partial<RandomForestBaseOptions> | true, model?: RandomForestRegressionModel)
    static load(model: RandomForestRegressionModel): RandomForestRegression;
    toJSON(): RandomForestRegressionModel;
    selection(values: number[]): number;
  }
}