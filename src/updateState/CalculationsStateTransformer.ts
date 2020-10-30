import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import { Module } from 'type/Module';
import { CalculationsStateSegment } from 'type/StateSegment';

export default class CalculationsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.calculations;

  async singleSegmentTransform(module: Module, segment: CalculationsStateSegment, state: CreditProcessState) {
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
