import { ModuleType } from '../enums/ModuleType';
import CreditProcessState from '../types/CreditProcessState';

export default abstract class StateTransformer {
  protected abstract moduleType: ModuleType;

  public transform = async (state: CreditProcessState, moduleName: string, moduleDisplayName: string) => {
    const moduleState = state && state[this.moduleType];
    const segmentKeys = moduleState ? Object.keys(moduleState) : [];
  
    if (segmentKeys.length === 0) {  
      return this.noSegmentTransform(state, moduleName, moduleDisplayName);
    }

    if (segmentKeys.length > 1) {
      return this.multipleSegmentTransform(state, segmentKeys, moduleName, moduleDisplayName);
    }

    return this.singleSegmentTransform(state, segmentKeys[0], moduleName, moduleDisplayName);
  }

  protected abstract noSegmentTransform(
    state: CreditProcessState,
    moduleName: string,
    moduleDisplayName: string,
  ): Promise<void>;

  protected abstract singleSegmentTransform(
    state: CreditProcessState,
    segmentKey: string,
    moduleName: string,
    moduleDisplayName: string,
  ): Promise<void>;


  protected async multipleSegmentTransform(
    state: CreditProcessState,
    _segmentKeys: string[],
    _moduleName: string,
    moduleDisplayName: string,
  ): Promise<void> {
    return segmentCountExceededReject(state, moduleDisplayName);
  }

  protected async segmentCountExceededReject(state: CreditProcessState, moduleDisplayName: string) {  
    return Promise.reject({
      error: '',
      message: `Error in ${moduleDisplayName} decision module: The decision request falls into multiple population segments and could not be processed.`,
      ...state,
    });
  }
}
