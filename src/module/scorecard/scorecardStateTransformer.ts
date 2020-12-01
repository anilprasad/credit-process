import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';
import { ScorecardStateSegment } from './interface/ScorecardStateSegment';

class ScorecardStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.Scorecard;

  async singleSegmentTransform(module: Module, segment: ScorecardStateSegment, state: CreditProcessState) {
    const outputVariableKey = segment.output_variable || 'score';

    state[outputVariableKey] = segment[outputVariableKey];

    state.scorecard_variables = state.scorecard_variables || {};
    state.scorecard_variables[outputVariableKey] = segment[outputVariableKey];

    state.credit_process.push({
      [outputVariableKey]: segment[outputVariableKey],
      type: this.moduleDisplayType,
      display_name: module.display_name,
      name: module.name,
      segment: segment.segment,
      output_variable: segment.output_variable,
      rules: segment.rules,
    });

    return state;
  }
}

export default new ScorecardStateTransformer();
