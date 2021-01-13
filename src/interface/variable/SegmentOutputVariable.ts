import { SegmentVariable } from './SegmentVariable';

export interface SegmentOutputVariable extends SegmentVariable {
  api_name: string;
  output_variable: string;
  traversalPath?: string;
  arrayConfigs?: Array<Record<string, string | number>>;
}
