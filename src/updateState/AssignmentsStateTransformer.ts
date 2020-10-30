import { ModuleType } from 'enum/ModuleType';
import { ModuleDisplayType } from 'enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from 'type/CreditProcessState';
import { Module } from 'type/Module';
import { AssignmentsStateSegment } from 'type/StateSegment';

export default class AssignmentsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.assignments;

  async singleSegmentTransform(module: Module, segment: AssignmentsStateSegment, state: CreditProcessState) {
    const assignment_variables = segment.assignments || {};
  
    state = {...state, ...assignment_variables};
  
    state.assignment_variables = {
      ...(state.assignment_variables || {}),
      ...assignment_variables,
    };
  
    state.credit_process.push({
      ...assignment_variables,
      display_name: module.display_name,
      name: module.name,
      type: ModuleDisplayType[this.moduleType],
      segment: segment.segment,
    });

    return state;
  }
}
