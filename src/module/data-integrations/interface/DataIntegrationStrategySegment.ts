import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';
import { SegmentInputVariable } from '../../../interface/variable/SegmentInputVariable';
import { SegmentOutputVariable } from '../../../interface/variable/SegmentOutputVariable';

export interface DataIntegrationStrategySegment extends BasicStrategySegment {
  dataintegration_id: string;
  inputs: SegmentInputVariable[];
  outputs: SegmentOutputVariable[];
}
