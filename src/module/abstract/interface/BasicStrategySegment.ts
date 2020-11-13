import { ModuleType } from '../../../enum/ModuleType';
import { Rule } from '../../../interface/Rule';

export interface BasicStrategySegment {
  name: string;
  display_name: string;
  type: ModuleType;
  conditions: Rule[];
  output_variable?: string;
  ruleset: Rule[];
}
