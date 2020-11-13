import { VariableDataType } from '../../enum/VariableDataType';
import { StrategyVariable } from './StrategyVariable';

export interface SegmentVariable {
  data_type: VariableDataType;
  description?: string;
  display_name: string;
  example: any;
  assigned_variable?: StrategyVariable;
}
