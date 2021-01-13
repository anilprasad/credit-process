import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';
import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';

export interface ScorecardStateSegment extends BasicStateSegment {
  output_variable: BasicStrategySegment['output_variable'];
  rules: Array<{ name: string, passed: boolean, weight: number }>;
}
