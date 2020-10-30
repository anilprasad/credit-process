import createConditionCheck from './evaluators';
import { StrategySegment } from 'type/StrategySegment';

export default (segments: StrategySegment[]) => {
  if (!segments) {
    throw new Error('No configurations available to evaluate');
  }

  if (!Array.isArray(segments)) {
    return createConditionCheck(segments);
  }

  return segments.map((segment) => createConditionCheck(segment));
};
