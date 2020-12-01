import Matrix from 'ml-matrix';

export interface Classifier {
  root: {
    classify: (row: number[]) => Matrix;
  };
  selection(values: any[]): number;
  estimators: Classifier[];
  nEstimators: number;
}
