import { ModuleType } from '../enum/ModuleType';
import { ModuleDisplayType } from '../enum/ModuleDisplayType';

import StateTransformer from './StateTransformer';
import CreditProcessState from '../type/CreditProcessState';
import { Module } from 'type/Module';
import { ArtificialIntelligenceStateSegment } from 'type/StateSegment';

export default class ArtificialIntelligenceStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.artificialintelligence;

  async singleSegmentTransform(module: Module, segment: ArtificialIntelligenceStateSegment, state: CreditProcessState) {
    state.artificialintelligence_variables = {
      ...(state.artificialintelligence_variables || {}),
      ...segment.output,
    };
  
    const outputKey = segment.output_variable;
    if (outputKey && segment.output !== undefined) {
      state[outputKey] = segment.output[outputKey];
    }
  
    state.credit_process.push({
      name: segment.name,
      type: ModuleDisplayType[this.moduleType],
      display_name: module.display_name,
      segment: segment.segment,
      predicted_classification: segment.classification,
      ...segment.output,
    });

    return state;
  }
}
