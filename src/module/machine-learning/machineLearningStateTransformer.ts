import AbstractStateTransformer from '../abstract/AbstractStateTransformer';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { MachineLearningStateSegment } from './interface/MachineLearningStateSegment';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';

class MachineLearningStateTransformer extends AbstractStateTransformer {
  protected moduleDisplayType: ModuleDisplayType = ModuleDisplayType.MachineLearning;

  async singleSegmentTransform(module: Module, segment: MachineLearningStateSegment, state: CreditProcessState) {
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
      type: this.moduleDisplayType,
      display_name: module.display_name,
      segment: segment.segment,
      predicted_classification: segment.classification,
      ...segment.output,
    });

    return state;
  }
}

export default new MachineLearningStateTransformer();
