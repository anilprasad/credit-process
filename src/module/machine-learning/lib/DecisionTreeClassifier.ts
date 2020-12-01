import TreeNode, { IDecisionTreeOptions } from './TreeNode';
import Matrix from 'ml-matrix';

interface IDecisionTreeModel {
  options: IDecisionTreeOptions;
  root: TreeNode;
  name: 'DTClassifier';
}

const defaultOptions = {
  gainFunction: 'gini',
  minNumSamples: 3,
  maxDepth: Infinity,
  kind: 'classifier',
};

export class DecisionTreeClassifier {
  public root: TreeNode;
  private options: IDecisionTreeOptions;

  static load(model: IDecisionTreeModel): DecisionTreeClassifier {
    if (model.name !== 'DTClassifier') {
      throw new RangeError(`Invalid model: ${model.name}`);
    }

    const classifier = new DecisionTreeClassifier(model.options);
    classifier.root.setNodeParameters(model.root);

    return classifier;
  }

  /**
   * Create new Decision Tree Classifier with CART implementation with the given options
   * @param {object} model - for load purposes.
   * @constructor
   */
  constructor(options: IDecisionTreeOptions) {
    this.options = { ...defaultOptions, ...options };

    this.root = new TreeNode(this.options);
  }

  public train(trainingSet: Matrix | number[] | number[][], trainingLabels: number[]): void {
    trainingSet = Matrix.checkMatrix(trainingSet);
    this.root.train(trainingSet, trainingLabels, 0);
  }

  public predict(toPredict: Matrix | number[] | number[][]): number[] {
    toPredict = Matrix.checkMatrix(toPredict);
    const predictions = new Array(toPredict.rows);

    for (let i = 0; i < toPredict.rows; ++i) {
      predictions[i] = (this.root
        .classify(toPredict.getRow(i)) as Matrix)
        .maxRowIndex(0)[1];
    }

    return predictions;
  }

  toJSON(): IDecisionTreeModel {
    return {
      options: this.options,
      root: this.root,
      name: 'DTClassifier',
    };
  }
}
