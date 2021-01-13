import * as variableHelper from '../helper/variableHelper';
import { CompareOperand } from '../enum/CompareOperand';
import { compareOperands } from './compare/operands';
import { CreditProcessState } from '../interface/CreditProcessState';
import { Rule } from '../interface/Rule';
import { VariableInputType } from '../enum/VariableInputType';

export const runComparison = (rule: Rule, state: CreditProcessState) => {
  const {
    value_comparison,
    value_comparison_type,
    value_minimum,
    value_minimum_type,
    value_maximum,
    value_maximum_type,
    variable_name,
    condition_test,
  } = rule;

  const compareOperand = condition_test.toLowerCase().replace(/\s+/g, '') as CompareOperand;

  if (!Object.values(CompareOperand).includes(compareOperand)) {
    throw new Error(`'${condition_test}' ('${compareOperand}' compare operand) is not valid condition_test value`);
  }

  const variableValue = variableHelper.getVariableValue(
    variable_name,
    VariableInputType.Variable,
    state,
  );

  if (compareOperand === 'range') {
    const rangeMin = variableHelper.getVariableValue(value_minimum, value_minimum_type, state);
    const rangeMax = variableHelper.getVariableValue(value_maximum, value_maximum_type, state);

    return compareOperands[compareOperand](
      variableValue,
      rangeMin,
      rangeMax,
    );
  }

  const compareTo = variableHelper.getVariableValue(value_comparison, value_comparison_type, state);

  return compareOperands[compareOperand](variableValue, compareTo);
};
