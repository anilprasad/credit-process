import { SegmentVariable } from './SegmentVariable';
import { VariableInputType } from '../../enum/VariableInputType';
import { VariableValue } from '../../type/VariableValue';

export interface SegmentInputVariable extends SegmentVariable {
  input_name: string;
  input_type?: VariableInputType;
  input_variable: string;
  assigned_value?: VariableValue;
  traversal_path?: string;
  header?: boolean;
}
