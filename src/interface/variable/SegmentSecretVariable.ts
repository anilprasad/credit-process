import { SegmentInputVariable } from './SegmentInputVariable';

export interface SegmentSecretVariable extends SegmentInputVariable {
  secret_key: string;
}
