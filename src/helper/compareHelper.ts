import * as compareFunctions from './compare/functions';
import * as variableHelper from '../helper/variableHelper';
import { CompareOperand } from '../enum/CompareOperand';
import { CreditProcessState } from '../interface/CreditProcessState';
import { Rule } from '../interface/Rule';
import { VariableInputType } from '../enum/VariableInputType';

const compareOperandToFunction = {
  [CompareOperand.Cap]: compareFunctions.lte,
  [CompareOperand.Equal]: compareFunctions.equal,
  [CompareOperand.Floor]: compareFunctions.gte,
  [CompareOperand.Gt]: compareFunctions.gt,
  [CompareOperand.In]: compareFunctions.includes,
  [CompareOperand.IsNotNull]: compareFunctions.isNotNull,
  [CompareOperand.IsNull]: compareFunctions.isNull,
  [CompareOperand.Lt]: compareFunctions.lt,
  [CompareOperand.NotEqual]: compareFunctions.notEqual,
  [CompareOperand.NotIn]: compareFunctions.notIncludes,
  [CompareOperand.Range]: compareFunctions.range,
};

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

  if (!Object.keys(compareOperandToFunction).includes(compareOperand)) {
    throw new Error(`'${condition_test}' ('${compareOperand}' compare operand) is not valid condition_test value`);
  }

  const variableValue = variableHelper.getVariableValue(
    variable_name,
    VariableInputType.Variable,
    state,
  );

  if (compareOperand === CompareOperand.Range) {
    const rangeMin = variableHelper.getVariableValue(value_minimum, value_minimum_type, state);
    const rangeMax = variableHelper.getVariableValue(value_maximum, value_maximum_type, state);

    return compareOperandToFunction[compareOperand](
      variableValue,
      rangeMin,
      rangeMax,
    );
  }

  const compareTo = variableHelper.getVariableValue(value_comparison, value_comparison_type, state);

  return compareOperandToFunction[compareOperand](variableValue, compareTo);
};
