import { StrategyVariable } from './StrategyVariable';
import { VariableDataType } from '../../enum/VariableDataType';

export interface SegmentVariable {
  data_type: VariableDataType;
  description?: string;
  display_name: string;
  example: any;
  assigned_variable?: StrategyVariable;
}
