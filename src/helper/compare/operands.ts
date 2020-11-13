import { CompareOperand } from '../../enum/CompareOperand';
import { Conditional } from './Conditional';

export const compareOperands = {
  [CompareOperand.cap]: Conditional.lte,
  [CompareOperand.equal]: Conditional.equal,
  [CompareOperand.floor]: Conditional.gte,
  [CompareOperand.gt]: Conditional.gt,
  [CompareOperand.in]: Conditional.in,
  [CompareOperand.isnotnull]: Conditional.isNotNull,
  [CompareOperand.isnull]: Conditional.isNull,
  [CompareOperand.lt]: Conditional.lt,
  [CompareOperand.notequal]: Conditional.notEqual,
  [CompareOperand.notin]: Conditional.notIn,
  [CompareOperand.range]: Conditional.range,
};