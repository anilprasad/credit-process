import { ModuleType } from '../enum/ModuleType';
import CreditProcessState from '../type/CreditProcessState';
import Module from '../type/Module';
import Segment from '../type/Segment';

export default abstract class StateTransformer {
  protected abstract moduleType: ModuleType;

  public transform = async (module: Module, segments: Segment[], state: CreditProcessState) => {  
    if (segments.length === 0) {  
      return this.noSegmentTransform(module, state);
    }

    if (segments.length > 1) {
      return this.multipleSegmentTransform(module, segments, state);
    }

    return this.singleSegmentTransform(module, segments[0], state);
  }

  protected abstract noSegmentTransform(
    module: Module,
    state: CreditProcessState,
  ): Promise<CreditProcessState>;

  protected abstract singleSegmentTransform(
    module: Module,
    segment: Segment,
    state: CreditProcessState
  ): Promise<CreditProcessState>;


  protected async multipleSegmentTransform(
    module: Module,
    _segments: Segment[],
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
