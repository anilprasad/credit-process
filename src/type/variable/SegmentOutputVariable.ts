import { SegmentVariable } from 'type/variable/SegmentVariable';

export interface SegmentOutputVariable extends SegmentVariable {
  api_name: string;
  output_variable: string;
}
