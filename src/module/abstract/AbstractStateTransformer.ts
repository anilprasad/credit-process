import { CreditProcessState } from '../../interface/CreditProcessState';
import { Module } from '../../interface/Module';
import { ModuleDisplayType } from '../../enum/ModuleDisplayType';
import { StateSegment } from '../../interface/StateSegment';

export default abstract class AbstractStateTransformer {
  protected abstract moduleDisplayType: ModuleDisplayType;

  public transform = async (module: Module, segments: StateSegment[], state: CreditProcessState) => {
    const _state = { ...state };
    _state.credit_process = _state.credit_process || [];

    if (segments.length === 0) {
      return this.noSegmentTransform(module, _state);
    }

    if (segments.length > 1) {
      return this.multipleSegmentTransform(module, segments, _state);
    }

    return this.singleSegmentTransform(module, segments[0], _state);
  }

  protected async noSegmentTransform(
    module: Module,
    state: CreditProcessState,
  ): Promise<CreditProcessState> {
    state.credit_process.push({
      type: this.moduleDisplayType,
      name: module.name,
      display_name: module.display_name,
      passed: null,
      segment: '',
      decline_reasons: [],
      output_variable: '',
      predicted_classification: '',
      rules: [],
      status: '',
    });

    return state;
  }

  protected abstract singleSegmentTransform(
    module: Module,
    segment: StateSegment,
    state: CreditProcessState
  ): Promise<CreditProcessState>;


  protected async multipleSegmentTransform(
    module: Module,
    _segments: StateSegment[],
    state: CreditProcessState,
  ): Promise<CreditProcessState> {
    return this.segmentCountExceededReject(state, module.display_name);
  }

  protected async segmentCountExceededReject(state: CreditProcessState, moduleDisplayName: string) {
    return Promise.reject({
      error: `Error in ${moduleDisplayName} decision module:
      The decision request falls into multiple population segments and could not be processed.`,
      ...state,
    });
  }
}
