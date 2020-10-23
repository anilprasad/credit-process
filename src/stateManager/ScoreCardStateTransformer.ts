import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
import Module from '../type/Module';

export default class ScoreCardStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.scorecard;

  async noSegmentTransform(module: Module, state: CreditProcessState) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: '',
      rules: [],
      output_variable: '',
    });

    return state;
  }

  async singleSegmentTransform(module: Module, segment: Segment, state: CreditProcessState) {
    const outputVariableKey = segment.output_variable || 'score';

    state[outputVariableKey] = segment[outputVariableKey];

    state.scorecard_variables = state.scorecard_variables || {};
    state.scorecard_variables[outputVariableKey] = segment[outputVariableKey];

    state.credit_process.push({
      [outputVariableKey]: segment[outputVariableKey],
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: segment.segment,
      output_variable: segment.output_variable,
      rules: segment.rules,
    });

    return state;
  }
}
