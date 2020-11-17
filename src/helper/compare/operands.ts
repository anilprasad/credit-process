import { CompareOperand } from '../../enum/CompareOperand';
import { Comparison } from './Comparison';

export const compareOperands = {
  [CompareOperand.cap]: Comparison.lte,
  [CompareOperand.equal]: Comparison.equal,
  [CompareOperand.floor]: Comparison.gte,
  [CompareOperand.gt]: Comparison.gt,
  [CompareOperand.in]: Comparison.in,
  [CompareOperand.isnotnull]: Comparison.isNotNull,
  [CompareOperand.isnull]: Comparison.isNull,
  [CompareOperand.lt]: Comparison.lt,
  [CompareOperand.notequal]: Comparison.notEqual,
  [CompareOperand.notin]: Comparison.notIn,
  [CompareOperand.range]: Comparison.range,
};