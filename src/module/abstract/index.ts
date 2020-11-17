import { BasicStateSegment } from './interface/BasicStateSegment';
import { BasicStrategySegment } from './interface/BasicStrategySegment';
import { CompiledStrategy } from '../../interface/CompiledStrategy';
import { ConditionsChecker } from '../../helper/conditions-check/ConditionsChecker';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';

export interface IBasicModuleCompilationOptions<Segment extends BasicStrategySegment = BasicStrategySegment> {
  segments: Segment | Segment[];
  module_name: Module['name'];
  module_type: Module['type'];
  module_display_name: Module['display_name'];
  input_variables: CompiledStrategy['input_variables'];
  output_variables: CompiledStrategy['output_variables'];
}

export abstract class AbstractModule<Segment extends BasicStrategySegment, ReturnSegment extends BasicStateSegment> {
  protected segments: Segment[];
  protected moduleName: string;

  constructor(options: IBasicModuleCompilationOptions<Segment>) {
    this.segments = this.formatSegments(options.segments);

    if (!this.segments.length) {
      throw new Error('No segments to evaluate');
    }

    this.moduleName = options.module_name;
  }

  public evaluate = async (state: CreditProcessState) => {
    const conditionsChecker = new ConditionsChecker();
    const segments: ReturnSegment[] = [];

    for (const segment of this.segments) {
      if (!conditionsChecker.checkSegment(segment, state)) {
        continue;
      }

      const resultSegment = await this.evaluateSegment(segment, state);

      segments.push(resultSegment);
    }

    return segments;
  }

  protected abstract evaluateSegment(
    segment: Segment,
    state: CreditProcessState,
  ): Promise<ReturnSegment>;

  protected formatSegments = (segments: Segment | Segment[]) => {
    const segmentsArray = Array.isArray(segments)
      ? segments
      : [segments];

    return segmentsArray.map((segment) => ({
      ...segment,
      variables: segment.ruleset || [],
      name: segment.name.replace(/^(.+)(\.v\d{1,2}(.\d{1,2}){0,2}.*)$/, '$1'),
      conditions: segment.conditions || [],
    }));
  }
}
