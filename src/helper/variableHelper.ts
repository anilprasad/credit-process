import { CreditProcessState } from '../interface/CreditProcessState';
import { VariableInputType } from '../enum/VariableInputType';
import { VariableValue } from '../type/VariableValue';

export const getVariableValue = (
  value: VariableValue,
  type: VariableInputType,
  state: CreditProcessState,
) => {
  const assignedValue = value && type === VariableInputType.Variable
    ? state[value as string] as VariableValue
    : value;

  if (assignedValue === undefined) {
    throw new Error(`The Variable ${value} is required by a Rule but is not defined.`);
  }

  return assignedValue;
};
