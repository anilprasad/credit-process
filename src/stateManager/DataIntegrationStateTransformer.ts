import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
import Module from '../type/Module';

export default class DataIntegrationStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.dataintegration;

  async noSegmentTransform(module: Module, state: CreditProcessState) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      name: module.name,
      segment: '',
      status: '',
    });

    return state;
  }

  async singleSegmentTransform(module: Module, segment: Segment, state: CreditProcessState) {
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
