import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';
import { ScorecardRule } from './ScorecardRule';

export interface ScorecardStrategySegment extends BasicStrategySegment {
  ruleset: ScorecardRule[];
  initial_score: string;
}
