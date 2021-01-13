export interface SagemakerModel {
  predictions: Array<{
    score: number[];
    predicted_label: string | number;
  }>;
}
