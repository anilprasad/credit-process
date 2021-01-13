import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';
import { Rule } from '../../../interface/Rule';

export interface OutputStateSegment extends BasicStateSegment {
  passed: boolean;
  rules: Array<{ name: string, passed: boolean, conditionOutput: Rule['condition_output'] }>;
  output: Rule['condition_output'];
}
