import Matrix from 'ml-matrix';
import meanArray from 'ml-array-mean';

enum Splits {
  Greater = 'greater',
  Lesser = 'lesser',
}

export const toDiscreteDistribution = (predictions: number[]) => {
  const numberOfClasses = getNumberOfClasses(predictions);
  const counts = new Array(numberOfClasses).fill(0);

  for (let i = 0; i < predictions.length; ++i) {
    counts[predictions[i]] += 1 / predictions.length;
  }

  return Matrix.rowVector(counts);
};

export const giniImpurity = (predictions: number[]) => {
  if (predictions.length === 0) {
    return 0;
  }

  const probabilities = toDiscreteDistribution(
    predictions,
  ).getRow(0);

  return 1 - probabilities.reduce((sum, probability) => sum + probability * probability, 0.0);
};

export const getNumberOfClasses = (array: number[]) => {
  return array.filter((element, index, self) => {
    return self.indexOf(element) === index;
  }).length;
};

export const giniGain = (array: number[], splitted: Record<Splits, number[]>) => {
  const splitsImpurity = [Splits.Greater, Splits.Lesser].reduce((impurity, split) => {
    const currentSplit = splitted[split];

    return impurity +
      giniImpurity(currentSplit) * currentSplit.length / array.length;
  }, 0.0);

  return giniImpurity(array) - splitsImpurity;
};

export const squaredError = (array: number[]) => {
  const average = meanArray(array);

  return array.reduce((squaredError, currentElement) => {
    return squaredError + (currentElement - average) * (currentElement - average);
  }, 0.0);
};

export const regressionError = (_array: number[], splitted: Record<Splits, number[]>) => {
  return squaredError(splitted[Splits.Lesser]) + squaredError(splitted[Splits.Greater]);
};

/**
 * Split the training set and values from a given column of the training set if is less than a value
 */
export const matrixSplitter = (
  trainingSet: Matrix,
  trainigValues: number[],
  columnToSplit: number,
  valueToSplit: number
) => {
  const lesserX = [];
  const greaterX = [];
  const lesserY = [];
  const greaterY = [];

  for (let i = 0; i < trainingSet.rows; ++i) {
    if (trainingSet.get(i, columnToSplit) < valueToSplit) {
      lesserX.push(trainingSet.getRow(i));
      lesserY.push(trainigValues[i]);
    } else {
      greaterX.push(trainingSet.getRow(i));
      greaterY.push(trainigValues[i]);
    }
  }

  return {
    greaterX,
    greaterY,
    lesserX,
    lesserY,
  };
};

export const mean = (a: number, b: number) => (a + b) / 2;

export const zip = (a: any[], b: any[]) => {
  if (a.length !== b.length) {
    throw new TypeError(
      `Error on zip: the size of a: ${a.length} is different from b: ${b.length}`
    );
  }

  return a.map((element, index) => [element, b[index]]);
};
