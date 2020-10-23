import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
import Module from '../type/Module';

export default class CalculationsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.calculations;

  async noSegmentTransform(module: Module, state: CreditProcessState) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: '',
    });

    return state;
  }

  async singleSegmentTransform(module: Module, segment: Segment, state: CreditProcessState) {
    const calculated_variables = segment.calculations || {};
  
    state = {...state, ...calculated_variables};
  
    state.calculated_variables = {
      ...(state.calculated_variables || {}),
      ...calculated_variables,
    };
  
    state.credit_process.push({
      ...calculated_variables,
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      passed: true,
      segment: segment.segment,
    });

    return state;
  }
}
