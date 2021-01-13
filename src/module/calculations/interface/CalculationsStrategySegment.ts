import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';
import { CalculationsRule } from './CalculationsRule';

export interface CalculationsStrategySegment extends BasicStrategySegment {
  variables: CalculationsRule[];
}
