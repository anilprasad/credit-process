import { ConditionsChecker } from './ConditionsChecker';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { StrategySegment } from '../../interface/StrategySegment';

export default (segments: StrategySegment[]) => {
  const conditionsChecker = new ConditionsChecker();

  return (state: CreditProcessState) => {
    return segments.filter((segment) => conditionsChecker.checkSegment(segment, state));
  };
};
