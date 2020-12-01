import { ConditionTest } from '../enum/ConditionTest';
import { RuleType } from '../enum/RuleType';
import { VariableInputType } from '../enum/VariableInputType';
import { VariableValue } from '../type/VariableValue';

export interface Rule {
  condition_test: ConditionTest;
  rule_name: string;
  rule_type: RuleType;
  value_comparison_type: VariableInputType;
  value_comparison?: string | number;
  value_maximum_type: VariableInputType;
  value_maximum?: number | string;
  value_minimum_type: VariableInputType;
  value_minimum?: number | string;
  variable_name: string;
  condition_output_types?: Record<string, VariableInputType>;
  condition_output?: Record<string, VariableValue>;
}
