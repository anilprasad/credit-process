import { CompareOperand } from '../../enum/CompareOperand';
import { Comparison } from './Comparison';

export const compareOperands = {
  [CompareOperand.Cap]: Comparison.lte,
  [CompareOperand.Equal]: Comparison.equal,
  [CompareOperand.Floor]: Comparison.gte,
  [CompareOperand.Gt]: Comparison.gt,
  [CompareOperand.In]: Comparison.in,
  [CompareOperand.IsNotNull]: Comparison.isNotNull,
  [CompareOperand.IsNull]: Comparison.isNull,
  [CompareOperand.Lt]: Comparison.lt,
  [CompareOperand.NotEqual]: Comparison.notEqual,
  [CompareOperand.NotIn]: Comparison.notIn,
  [CompareOperand.Range]: Comparison.range,
};
