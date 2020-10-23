import Rule from './Rule';
import Variable from './Variable';

export default interface Segment extends Record<string, any> {
  _doc: {};
  conditions: any[];
  name: string;
  ruleset: any[];
  segment: string;
  type: string;

  assignments?: Variable[];
  calculations?: Record<string, Variable>;
  classification?: string; 
  decline_reasons?: string[];
  output_variable?: string;
  inputs?: Variable[];
  outputs?: Variable[];
  passed?: boolean;
  rules?: Rule[];
  status?: string;
  variables?: any[];
  raw?: string;
}
