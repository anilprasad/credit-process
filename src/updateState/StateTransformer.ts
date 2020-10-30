import { ModuleDisplayType } from 'enum/ModuleDisplayType';
import { ModuleType } from 'enum/ModuleType';
import CreditProcessState from 'type/CreditProcessState';
import { Module } from 'type/Module';
import { StateSegment } from 'type/StateSegment';

export default abstract class StateTransformer {
  protected abstract moduleType: ModuleType;

  public transform = async (module: Module, segments: StateSegment[], state: CreditProcessState) => {  
    if (segments.length === 0) {  
      return this.noSegmentTransform(module, state);
    }

    if (segments.length > 1) {
      return this.multipleSegmentTransform(module, segments, state);
    }

    return this.singleSegmentTransform(module, segments[0], state);
  }

  protected async noSegmentTransform(
    module: Module,
    state: CreditProcessState,
  ): Promise<CreditProcessState> {
    state.credit_process.push({
      type: ModuleDisplayType[this.moduleType],
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
      error: '',
      message: `Error in ${moduleDisplayName} decision module: The decision request falls into multiple population segments and could not be processed.`,
      ...state,
    });
  }
}