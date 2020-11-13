import { VariableDataType } from '../../enum/VariableDataType';
import { VariableType } from '../../enum/VariableType';

export interface StrategyVariable {
  _id: string;
  type: VariableType;
  title: string;
  data_type: VariableDataType;
  display_title: string;
  organization: string;
}
