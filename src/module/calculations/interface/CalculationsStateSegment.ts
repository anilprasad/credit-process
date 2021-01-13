import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';

export interface CalculationsStateSegment extends BasicStateSegment {
  calculations: Record<string, unknown>;
}
