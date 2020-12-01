import { AssignmentsRule } from './AssignmentsRule';
import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';

export interface AssignmentsStrategySegment extends BasicStrategySegment {
  variables: AssignmentsRule[];
}
