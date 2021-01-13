import { Rule } from '../../../interface/Rule';
import { VariableDataType } from '../../../enum/VariableDataType';

export interface AssignmentsRule extends Rule {
  assignment_operation: string;
  variable_type: VariableDataType;
}
