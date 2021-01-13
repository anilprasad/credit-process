import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { DataIntegrationStateSegment } from './interface/DataIntegrationStateSegment';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';

class DataIntegrationsStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.DataIntegration;

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
        data: segment.raw,
      });
    }

    state.credit_process.push({
      type: this.moduleDisplayType,
      display_name: module.display_name,
      name: segment.name,
      segment: segment.segment,
      status: segment.status,
    });

    return state;
  }
}

export default new DataIntegrationsStateTransformer();
