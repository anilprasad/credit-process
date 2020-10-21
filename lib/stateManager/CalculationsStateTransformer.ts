import { ModuleType } from '../enums/ModuleType';
import { ModuleDisplayType } from '../enums/ModuleDisplayType';

import StateTransformer from './StateTransformer';

export default class CalculationsStateTransformer extends StateTransformer {
  protected moduleType: ModuleType = ModuleType.calculations;

  async noSegmentTransform(state: CreditProcessState, moduleName: string, moduleDisplayName: string) {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
      display_name: moduleDisplayName,
      name: moduleName,
      segment: '',
      predicted_classification: '',
      output_variable: '',
    });
  }

  async singleSegmentTransform(state: CreditProcessState, segmentKey: string, _moduleName: string, moduleDisplayName: string) {
    const segment = state[this.moduleType][segmentKey] || {};

    state.artificialintelligence_variables = state.artificialintelligence_variables || {};
    Object.assign(state.artificialintelligence_variables, segment.output);
  
    const outputKey = segment.output_variable;
    if (outputKey && segment.output !== undefined) {
      state[outputKey] = segment.output[outputKey];
    }
  
    state.credit_process.push(Object.assign({
      name: segment.name,
      type: ModuleDisplayType[this.moduleType],
      display_name: moduleDisplayName,
      segment: segment.segment,
      predicted_classification: segment.classification
    }, segment.output));
  }
}
