import Variable from './Variable';
import Organization from './Organization';

type Module = {
  type: string;
  name: string;
  active: boolean;
  display_name: string;
  lookup_name: string;
};

type Rule = {};

export default class CompiledStrategy {
  name: string;
  title: string;
  description?: string;
  status: string;
  version: number;
  module_run_order: Module[];
  createdat: Date;
  updatedat: Date;
  templates: Array<{ fileurl: string, filename: string,}>;
  input_variables: Variable[];
  output_variables: Variable[];
  calculated_variables: Variable[];
  decline_reasons: string[];
  rules?: Rule[];
  organization: Organization;
}
