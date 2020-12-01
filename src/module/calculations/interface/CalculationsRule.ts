import { Rule } from '../../../interface/Rule';
import { VariableDataType } from '../../../enum/VariableDataType';

export interface CalculationsRule extends Rule {
  calculation_operation: string;
  variable_type: VariableDataType;
}
