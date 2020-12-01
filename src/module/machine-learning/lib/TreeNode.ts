import * as utils from './utils';
import Matrix from 'ml-matrix';
import mean from 'ml-array-mean';

export interface IDecisionTreeOptions {
  gainFunction: 'gini' | 'regression';
  minNumSamples: number;
  maxDepth: number;
  kind: 'classifier' | 'regression';
}

const gainFunctions = {
  gini: utils.giniGain,
  regression: utils.regressionError,
};

export default class TreeNode {
  public distribution?: Matrix | number;
  public gainFunction: 'gini' | 'regression';
  public kind: 'classifier' | 'regression';
  public minNumSamples: number;
  public maxDepth: number;

  protected left?: TreeNode;
  protected right?: TreeNode;
  protected splitValue?: number;
  protected splitColumn?: number;
  protected gain?: number;

  constructor(options: IDecisionTreeOptions) {
    this.kind = options.kind;
    this.gainFunction = options.gainFunction;
    this.minNumSamples = options.minNumSamples;
    this.maxDepth = options.maxDepth;
  }

  public classify(row: number[]): Matrix | number {
    if (!this.right || !this.left || !this.splitColumn || !this.splitValue) {
      if (!this.distribution) {
        throw new Error('Error during calculating distribution');
      }

      return this.distribution;
    }

    if (row[this.splitColumn] < this.splitValue) {
      return this.left.classify(row);
    }

    return this.right.classify(row);
  }

  public train(X: Matrix, y: number[], currentDepth: number, parentGain?: number): void {
    if (X.rows <= this.minNumSamples) {
      this.calculatePrediction(y);
      return;
    }

    if (parentGain === undefined) {
      parentGain = 0.0;
    }

    const XTranspose = X.transpose();
    const split = this.bestSplit(XTranspose, y);

    this.splitValue = split.maxValue;
    this.splitColumn = split.maxColumn;
    this.gain = split.maxGain;

    if (!this.splitValue || !this.splitColumn) {
      throw new Error('Error during values split');
    }

    const splittedMatrix = utils.matrixSplitter(
      X,
      y,
      this.splitColumn,
      this.splitValue
    );

    if (
      currentDepth < this.maxDepth &&
      (this.gain > 0.01 && this.gain !== parentGain) &&
      (splittedMatrix.lesserX.length > 0 && splittedMatrix.greaterX.length > 0)
    ) {
      this.left = new TreeNode(this);
      this.right = new TreeNode(this);

      const lesserX = new Matrix(splittedMatrix.lesserX);
      const greaterX = new Matrix(splittedMatrix.greaterX);

      this.left.train(
        lesserX,
        splittedMatrix.lesserY,
        currentDepth + 1,
        this.gain
      );
      this.right.train(
        greaterX,
        splittedMatrix.greaterY,
        currentDepth + 1,
        this.gain
      );
    } else {
      this.calculatePrediction(y);
    }
  }

  public setNodeParameters(node: TreeNode): void {
    if (node.distribution !== undefined) {
      this.distribution =
        node.distribution.constructor === Array
          ? new Matrix(node.distribution)
          : node.distribution;
    } else {
      this.distribution = undefined;
      this.splitValue = node.splitValue;
      this.splitColumn = node.splitColumn;
      this.gain = node.gain;

      this.left = new TreeNode(this);
      this.right = new TreeNode(this);

      if (node.left) {
        this.left.setNodeParameters(node.left);
      }

      if (node.right) {
        this.right.setNodeParameters(node.right);
      }
    }
  }

  protected bestSplit(XTranspose: Matrix, y: number[]) {
    let bestGain = this.kind === 'classifier' ? -Infinity : Infinity;
    const check = this.kind === 'classifier' ? (a: number, b: number) => a > b : (a: number, b: number) => a < b;

    let maxColumn;
    let maxValue;

    for (let i = 0; i < XTranspose.rows; ++i) {
      const currentFeature = XTranspose.getRow(i);
      const splitValues = this.featureSplit(currentFeature, y);

      for (let j = 0; j < splitValues.length; ++j) {
        const currentSplitVal = splitValues[j];
        const splitted = this.split(currentFeature, y, currentSplitVal);

        const gain = gainFunctions[this.gainFunction](y, splitted);

        if (check(gain, bestGain)) {
          maxColumn = i;
          maxValue = currentSplitVal;
          bestGain = gain;
        }
      }
    }

    return {
      maxGain: bestGain,
      maxColumn,
      maxValue,
    };
  }

  protected split(x: number[], y: number[], splitValue: number) {
    const lesser = [];
    const greater = [];

    for (let i = 0; i < x.length; ++i) {
      if (x[i] < splitValue) {
        lesser.push(y[i]);
      } else {
        greater.push(y[i]);
      }
    }

    return { greater, lesser };
  }

  protected featureSplit(x: number[], y: number[]) {
    const splitValues = [];
    const arr = utils.zip(x, y);
    arr.sort((a, b) => a[0] - b[0]);

    for (let i = 1; i < arr.length; ++i) {
      if (arr[i - 1][0] !== arr[i][0] && arr[i - 1][1] !== arr[i][1]) {
        splitValues.push(
          utils.mean(arr[i - 1][0], arr[i][0])
        );
      }
    }

    return splitValues;
  }

  protected calculatePrediction(y: number[]) {
    if (this.kind === 'classifier') {
      this.distribution = utils.toDiscreteDistribution(y);

      if (this.distribution.columns === 0) {
        throw new TypeError('Error during prediction calculation');
      }
    } else {
      this.distribution = mean(y);
    }
  }
}
