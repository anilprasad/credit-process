import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import { Module } from 'type/Module';
import { RequirementsStateSegment } from 'type/StateSegment';
import Rule from 'type/Rule';

export default class RequirementsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.requirements;

  async singleSegmentTransform(module: Module, segment: RequirementsStateSegment, state: CreditProcessState) {
    const decline_reasons = [
      ...(state.decline_reasons || []),
      ...(segment.decline_reasons || [])
    ];

    state.decline_reasons = decline_reasons.filter((reason, index) => {
      return decline_reasons.indexOf(reason) === index;
    });
  
    state.passed = segment.passed;
  
    const rules = segment.rules.map(rule => ({
      name: rule.name,
      passed: rule.passed,
      decline_reasons: rule.passed ? undefined : rule.decline_reasons,
    }));

    state.credit_process.push({
      decline_reasons: segment.decline_reasons,
      display_name: module.display_name,
      name: module.name,
      passed: segment.passed,
      rules,
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
