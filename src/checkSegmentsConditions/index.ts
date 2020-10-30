import { ConditionsChecker } from './ConditionsChecker';
import CreditProcessState from 'type/CreditProcessState';
import { StateSegment } from 'type/StateSegment';

export default (segments: StateSegment | StateSegment[]) => {
  const conditionsChecker = new ConditionsChecker();

  const segmentsToCheck = Array.isArray(segments) ? segments : [segments];

  return (state: CreditProcessState) => {
    return segmentsToCheck.filter((segment) => conditionsChecker.checkSegment(segment, state));
  };
};
