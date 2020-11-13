export interface BasicStateSegment extends Record<string, unknown> {
  name: string;
  segment: string;
  type: string;
  error?: Error;
}
