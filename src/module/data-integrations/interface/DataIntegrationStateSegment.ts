import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';
import { Rule } from '../../../interface/Rule';

export interface DataIntegrationStateSegment extends BasicStateSegment {
  passed: boolean;
  provider: string;
  output: Record<string, unknown>;
  raw: string;
  rules: Rule[];
  status?: string | number;
}
