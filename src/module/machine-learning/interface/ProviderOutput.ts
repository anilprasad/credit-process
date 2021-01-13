import { MachineLearning } from 'aws-sdk';
import { SagemakerModel } from './SagemakerModel';
import { VariableValue } from '../../../type/VariableValue';

export interface ProviderOutput {
  prediction: MachineLearning.Types.PredictOutput | SagemakerModel | number[] | number;
  classification: string;
  output: Record<string, VariableValue>;
}
