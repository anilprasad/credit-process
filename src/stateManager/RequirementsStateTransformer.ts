import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/StrategySegment';
import CommonModule from '../type/Module';

export default class RequirementsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.requirements;

  async noSegmentTransform(module: CommonModule, state: CreditProcessState) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      passed: null,
      segment: '',
      decline_reasons: [],
      rules: [],
    });

    return state;
  }

  async singleSegmentTransform(module: CommonModule, segment: Segment, state: CreditProcessState) {
    const decline_reasons = [
      ...(state.decline_reasons || []),
      ...(segment.decline_reasons || [])
    ];

    state.decline_reasons = decline_reasons.filter((reason, index) => {
      return decline_reasons.indexOf(reason) === index;
    });
  
    state.passed = segment.passed;
  
    segment.rules = segment.rules!.map(rule => ({
      name: rule.name,
      passed: rule.passed,
      decline_reasons: rule.passed ? undefined : rule.decline_reasons,
    }));

    state.credit_process.push({
      decline_reasons: segment.decline_reasons,
      display_name: module.display_name,
      name: module.name,
      passed: segment.passed,
      rules: segment.rules,
      segment: segment.segment,
      type: ModuleDisplayType[this.moduleType],
    });
  
    if (state.passed === false) {
      return Promise.reject({
        decline_reasons: state.decline_reasons,
        ...state,
      });
    }

    return state;
  }
}
