import { VariableInputType } from 'enum/VariableInputType';
import { SegmentVariable } from 'type/variable/SegmentVariable';

export interface SegmentInputVariable extends SegmentVariable {
  input_name: string;
  input_type: VariableInputType;
  input_variable: string;
}
