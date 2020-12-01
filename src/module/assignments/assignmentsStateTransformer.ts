import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { AssignmentsStateSegment } from './interface/AssignmentsStateSegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';

class AssignmentsStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.Assignments;

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
      type: this.moduleDisplayType,
      segment: segment.segment,
    });

    return state;
  }
}

export default new AssignmentsStateTransformer();
