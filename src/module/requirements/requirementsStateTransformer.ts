import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';
import { RequirementsStateSegment } from './interface/RequirementsStateSegment';

class RequirementsStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.Requirements;

  async singleSegmentTransform(module: Module, segment: RequirementsStateSegment, state: CreditProcessState) {
    const decline_reasons = [
      ...(state.decline_reasons || []),
      ...(segment.decline_reasons || []),
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
      type: this.moduleDisplayType,
    });

    if (state.passed === false) {
      return Promise.reject(state);
    }

    return state;
  }
}

export default new RequirementsStateTransformer();
