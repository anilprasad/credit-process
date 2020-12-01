import { Rule } from '../../../interface/Rule';

export interface ScorecardRule extends Rule {
  condition_output: {
    weight: number;
  };
}
