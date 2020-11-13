import { VariableInputType } from '../../enum/VariableInputType';
import { SegmentVariable } from './SegmentVariable';

export interface SegmentInputVariable extends SegmentVariable {
  input_name: string;
  input_type?: VariableInputType;
  input_variable: string;
  assigned_value?: string | number | boolean;
  traversal_path?: string;
  header?: boolean;
}
