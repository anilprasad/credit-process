import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';

export interface RequirementsStateSegment extends BasicStateSegment {
  passed: boolean;
  decline_reasons: string[];
  rules: Array<{ name: string, passed: boolean, decline_reasons: string[] }>;
}
