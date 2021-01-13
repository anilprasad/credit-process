import { Module } from './Module';
import { Organization } from './Organization';
import { Rule } from './Rule';
import { StrategyVariable } from './variable/StrategyVariable';

export interface CompiledStrategy {
  name: string;
  title: string;
  description?: string;
  status: string;
  version: number;
  module_run_order: Module[];
  createdat: Date;
  updatedat: Date;
  templates: Array<{ fileurl: string, filename: string}>;
  input_variables: StrategyVariable[];
  output_variables: StrategyVariable[];
  calculated_variables: StrategyVariable[];
  decline_reasons: string[];
  rules?: Rule[];
  organization: Organization;
}
