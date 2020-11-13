import { CompareOperand } from '../enum/CompareOperand';
import { VariableInputType } from '../enum/VariableInputType';
import { CreditProcessState } from '../interface/CreditProcessState';
import { Rule } from '../interface/Rule';
import { compareOperands } from './compare/operands';

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

  const variableValue = getVariableValue(variable_name, VariableInputType.Variable, state);

  if (compareOperand === 'range') {
    const rangeMin = getVariableValue(value_minimum, value_minimum_type, state);
    const rangeMax = getVariableValue(value_maximum, value_maximum_type, state);

    return compareOperands[compareOperand](
      variableValue,
      rangeMin,
      rangeMax,
    );
  }

  const compareTo = getVariableValue(value_comparison, value_comparison_type, state);

  return compareOperands[compareOperand](variableValue, compareTo);
};

const getVariableValue = (
  value: string | number | boolean | null | undefined,
  type: VariableInputType,
  state: CreditProcessState,
) => {
  const assignedValue = value && type === VariableInputType.Variable
    ? state[value as string] as string | number | boolean | null | undefined
    : value;
  
  if (assignedValue === undefined) {
    throw new Error(`The Variable ${value} is required by a Rule but is not defined.`);
  }

  return assignedValue;
};
