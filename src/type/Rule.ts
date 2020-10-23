export default interface Rule {
  name: string;
  passed: boolean;
  condition_output?: {};
  decline_reasons?: string[],
}
