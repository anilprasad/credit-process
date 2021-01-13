import { VariableDataType } from '../enum/VariableDataType';

export interface CustomInput {
  name: string;
  format: VariableDataType;
  style?: string;
  function?: string;
}
