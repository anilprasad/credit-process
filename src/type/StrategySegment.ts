import { ModuleType } from 'enum/ModuleType';
import Rule from './Rule';
import { SegmentInputVariable } from './variable/SegmentInputVariable';
import { SegmentOutputVariable } from './variable/SegmentOutputVariable';

export interface StrategySegment {
  name: string;
  display_name: string;
  type: ModuleType;
  conditions: Rule[];
  inputs?: SegmentInputVariable[];
  outputs?: SegmentOutputVariable[];
  output_variable?: string;
  ruleset: Rule[];
  dataintegration_id?: string;
  initial_score?: number;

  variables?: Rule[];
}
