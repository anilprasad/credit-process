import { ModuleType } from '../enums/ModuleType';
import { ModuleDisplayType } from '../enums/ModuleDisplayType';

import StateTransformer from './StateTransformer';

export default class AssignmentsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.assignments;

  async noSegmentTransform(state: CreditProcessState, moduleName: string, moduleDisplayName: string) {
    state.credit_process.push({
      type: DISPLAY_TYPE.assignments,
      display_name: moduleDisplayName,
      name: moduleName,
      segment: '',
    });
  }

  async singleSegmentTransform(state: CreditProcessState, segmentKey: string, moduleName: string, moduleDisplayName: string) {
    const segment = state[this.moduleType][segmentKey] || {};

    const assignment_variables = segment.assignments || {};
  
    Object.assign(state, assignment_variables);
  
    state.assignment_variables = state.assignment_variables || {};
    Object.assign(state.assignment_variables, assignment_variables);
  
    state.assignments[segmentKey].passed = true;
  
    state.credit_process.push(Object.assign({}, assignment_variables, {
      name: moduleName,
      display_name: moduleDisplayName,
      type: DISPLAY_TYPE.assignments,
      segment: segmentKey,
    }));
  }
}

const updateAssignments = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.assignments ? Object.keys(state.assignments) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }
  
  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.assignments,
      display_name: module_display_name,
      name: module_name,
      segment: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];

  const assignment_variables = state
    && state.assignments
    && state.assignments[segmentKey]
    && state.assignments[segmentKey].assignments
    || {};

  Object.assign(state, assignment_variables);

  state.assignment_variables = state.assignment_variables || {};
  Object.assign(state.assignment_variables, assignment_variables);

  state.assignments[segmentKey].passed = true;

  state.credit_process.push(Object.assign({}, assignment_variables, {
    name: module_name,
    display_name: module_display_name,
    type: DISPLAY_TYPE.assignments,
    segment: segmentKey,
  }));
}
