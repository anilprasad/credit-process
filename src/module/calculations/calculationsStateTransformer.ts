import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CalculationsStateSegment } from './interface/CalculationsStateSegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';

class CalculationsStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.Calculations;

  async singleSegmentTransform(module: Module, segment: CalculationsStateSegment, state: CreditProcessState) {
    const calculated_variables = segment.calculations || {};

    state = {...state, ...calculated_variables};

    state.calculated_variables = {
      ...(state.calculated_variables || {}),
      ...calculated_variables,
    };

    state.credit_process.push({
      ...calculated_variables,
      type: this.moduleDisplayType,
      display_name: module.display_name,
      name: module.name,
      passed: true,
      segment: segment.segment,
    });

    return state;
  }
}

export default new CalculationsStateTransformer();
