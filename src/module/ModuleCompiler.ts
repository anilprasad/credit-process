import { StrategySegment } from 'type/StrategySegment';
import { Module } from 'type/Module';
import CompiledStrategy from 'type/CompiledStrategy';
import { Operation } from 'type/Operation';
import { DataIntegration } from 'type/DataIntegration';

export interface IModuleCompilationOptions {
  segments: Module['segments'];
  module_name: Module['name'];
  module_type: Module['type'];
  integration?: DataIntegration;
  machinelearning: any;
  module_display_name: Module['display_name'];
  input_variables: CompiledStrategy['input_variables'];
  output_variables: CompiledStrategy['output_variables'];
}

type CreateOperations = (options: IModuleCompilationOptions) => Operation | Operation[];

export default class ModuleCompiler {
  constructor(protected createOperations: CreateOperations) { }

  public getModuleOperations = async (options: IModuleCompilationOptions) => {
    if (Array.isArray(options.segments)) {
      options.segments.forEach((segment) => this.updateSegment(segment));
    } else {
      this.updateSegment(options.segments);
    }
  
    return this.createOperations(options);
  }

  protected updateSegment = (segment: StrategySegment) => {
    segment.variables = segment.ruleset || [];
    segment.name = segment.name.replace(/^(.+)(\.v\d{1,2}(.\d{1,2}){0,2}.*)$/, '$1');
    segment.conditions = segment.conditions || [];
  }
}
