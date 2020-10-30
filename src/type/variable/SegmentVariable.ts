import { VariableDataType } from 'enum/VariableDataType';

export interface SegmentVariable {
  data_type: VariableDataType;
  description?: string;
  display_name: string;
  example: string;
}
