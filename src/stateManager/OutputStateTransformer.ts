import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
import Module from '../type/Module';

export default class OutputStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.output;

  async noSegmentTransform(module: Module, state: CreditProcessState) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: '',
      rules: [],
    });

    return state;
  }

  async singleSegmentTransform(module: Module, segment: Segment, state: CreditProcessState) {
    const output = segment.output || {};

    state = {...state, ...output};
  
    state.output_variables = {
      ...(state.output_variables || {}),
      ...output,
    };
  
    segment.passed = true;
  
    segment.rules!.map(rule => ({
      ...rule.condition_output,
      name: rule.name,
      passed: rule.passed,
    }));
  
    state.credit_process.push({
      ...output,
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: segment.segment,
      rules: segment.rules,
    });

    return state;
  }
}
