import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import { Module } from 'type/Module';
import { DataIntegrationStateSegment } from 'type/StateSegment';

export default class DataIntegrationStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.dataintegration;

  async singleSegmentTransform(module: Module, segment: DataIntegrationStateSegment, state: CreditProcessState) {
    state = {...state, ...segment.output};
  
    state.dataintegration_variables = {
      ...(state.dataintegration_variables || {}),
      ...segment.output,
    };
  
    state.datasources = state.datasources || [];
    if (segment.raw) {
      state.datasources.push({
        name: segment.name,
        provider: segment.provider,
        data: segment.raw
      });
    }
  
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: segment.name,
      segment: segment.segment,
      status: segment.status,
    });

    return state;
  }
}
