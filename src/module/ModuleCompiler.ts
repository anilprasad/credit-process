import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
import Module from '../type/Module';
import CompiledStrategy from '../type/CompiledStrategy';

export interface IModuleCompilationOptions {
  segments: Module['segments'];
  module_name: Module['name'];
  module_type: Module['type'];
  integration: Module['dataintegration'];
  machinelearning: any;
  module_display_name: Module['display_name'];
  input_variables: CompiledStrategy['input_variables'];
  output_variables: CompiledStrategy['output_variables'];
}

export type Operation = (state: CreditProcessState) => Promise<Segment | Segment[]>;
type CreateOperation = (options: IModuleCompilationOptions) => Operation | Operation[];

export default class ModuleCompiler {
  constructor(protected createOperation: CreateOperation) { }

  public getSegmentEvaluations = async (options: IModuleCompilationOptions) => {
    if (Array.isArray(options.segments)) {
      options.segments.forEach((segment) => this.updateSegment(segment));
    } else {
      this.updateSegment(options.segments);
    }
  
    return this.createOperation(options);
  }

  protected updateSegment = (segment: Segment) => {
    segment.variables = segment.ruleset || [];
    segment.name = segment.name.replace(/^(.+)(\.v\d{1,2}(.\d{1,2}){0,2}.*)$/, '$1');
    segment.conditions = segment.conditions || [];
  }
}
