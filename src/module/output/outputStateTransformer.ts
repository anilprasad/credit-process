import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';
import { OutputStateSegment } from './interface/OutputStateSegment';

class OutputStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.Output;

  async singleSegmentTransform(module: Module, segment: OutputStateSegment, state: CreditProcessState) {
    const output = segment.output || {};

    state = {...state, ...output};

    state.output_variables = {
      ...(state.output_variables || {}),
      ...output,
    };

    segment.passed = true;

    segment.rules!.map(rule => ({
      ...rule.conditionOutput,
      name: rule.name,
      passed: rule.passed,
    }));

    state.credit_process.push({
      ...output,
      type: this.moduleDisplayType,
      display_name: module.display_name,
      name: module.name,
      segment: segment.segment,
      rules: segment.rules,
    });

    return state;
  }
}

export default new OutputStateTransformer();
