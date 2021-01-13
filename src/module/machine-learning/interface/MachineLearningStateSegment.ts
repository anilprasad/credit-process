import { BasicStateSegment } from '../../abstract/interface/BasicStateSegment';
import { ProviderOutput } from './ProviderOutput';

export interface MachineLearningStateSegment extends BasicStateSegment, ProviderOutput {
  output_variable: string;
}
