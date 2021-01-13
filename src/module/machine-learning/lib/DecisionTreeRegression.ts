import TreeNode, { IDecisionTreeOptions } from './TreeNode';
import Matrix from 'ml-matrix';

const defaultOptions = {
  gainFunction: 'regression',
  minNumSamples: 3,
  maxDepth: Infinity,
};

interface IDecisionTreeModel {
  options: IDecisionTreeOptions;
  root: TreeNode;
  name: 'DTRegression';
}

export class DecisionTreeRegression {
  public root: TreeNode;
  private options: IDecisionTreeOptions;

  static load(model: IDecisionTreeModel): DecisionTreeRegression {
    if (model.name !== 'DTRegression') {
      throw new RangeError(`Invalid model:${model.name}`);
    }

    const regresion = new DecisionTreeRegression(model.options);
    regresion.root.setNodeParameters(model.root);

    return regresion;
  }

  constructor(options: IDecisionTreeOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
      kind: 'regression',
    };

    this.root = new TreeNode(this.options);
  }

  /**
   * Train the decision tree with the given training set and values.
   * @param {Matrix|MatrixTransposeView|Array} trainingSet
   * @param {Array} trainingValues
   */
  public train(trainingSet: Matrix | number[] | number[][], trainingValues: number[]): void {
    let trainingSetMatrix: Matrix;

    if (Array.isArray(trainingSet)) {
      trainingSetMatrix = !Array.isArray(trainingSet[0])
        ? Matrix.columnVector(trainingSet as number[])
        : Matrix.checkMatrix(trainingSet);
    } else {
      trainingSetMatrix = trainingSet;
    }


    this.root.train(trainingSetMatrix, trainingValues, 0);
  }

  /**
   * Predicts the values given the matrix to predict.
   * @param {Matrix|MatrixTransposeView|Array} toPredict
   * @return {Array} predictions
   */
  public predict(toPredict: Matrix | number[] | number[][]): number[] | Matrix[] {
    let toPredictMatrix: Matrix;

    if (Array.isArray(toPredict)) {
      toPredictMatrix = !Array.isArray(toPredict[0])
        ? Matrix.columnVector(toPredict as number[])
        : Matrix.checkMatrix(toPredict);
    } else {
      toPredictMatrix = toPredict;
    }

    const predictions: number[] | Matrix[] = new Array(toPredictMatrix.rows);
    for (let i = 0; i < toPredictMatrix.rows; ++i) {
      predictions[i] = this.root.classify(toPredictMatrix.getRow(i));
    }

    return predictions;
  }

  /**
   * Export the current model to JSON.
   * @return {object} - Current model.
   */
  toJSON(): IDecisionTreeModel {
    return {
      options: this.options,
      root: this.root,
      name: 'DTRegression',
    };
  }
}
