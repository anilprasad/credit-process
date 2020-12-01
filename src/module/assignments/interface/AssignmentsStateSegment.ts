import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';

export interface AssignmentsStateSegment extends BasicStateSegment {
  assignments: Record<string, unknown>;
}
