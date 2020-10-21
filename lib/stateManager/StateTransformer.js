'use strict';

class StateTransformer {
  async transform(state, moduleName, moduleDisplayName) {
    const segmentKeys = state && state[this.moduleType] ? Object.keys(state[this.moduleType]) : [];
  
    if (segmentKeys.length === 0) {  
      return this.noSegmentTransform(state, moduleName, moduleDisplayName);
    }

    if (segmentKeys.length > 1) {
      const segments = segmentKeys.map((key) => state[this.moduleType][key]);

      return this.multipleSegmentTransform(state, segments, moduleName, moduleDisplayName);
    }

    const segment = state[this.moduleType][segmentKeys[0]] || {};

    return this.singleSegmentTransform(state, segment, moduleName, moduleDisplayName);
  }

  async noSegmentTransform(_state, _moduleName, _moduleDisplayName) {
    throw new Error(`noSegmentTransform not implemented for ${this.moduleType}`);
  }

  async singleSegmentTransform(_state, _segment, _moduleName, _moduleDisplayName) {
    throw new Error(`singleSegmentTransform not implemented for ${this.moduleType}`);
  }

  async multipleSegmentTransform(state, _segments, _moduleName, moduleDisplayName) {
    return segmentCountExceededReject(state, moduleDisplayName);
  }

  async segmentCountExceededReject(state, moduleDisplayName) {  
    const basicRejectData = {
      decline_reasons: state.decline_reasons,
      credit_process: state.credit_process,
      error: '',
      message: `Error in ${moduleDisplayName} decision module: The decision request falls into multiple population segments and could not be processed.`,
    };
  
    return Promise.reject(Object.assign(basicRejectData, state));
  }
}

module.exports = StateTransformer;
