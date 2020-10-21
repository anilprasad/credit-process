'use strict';

const MODULE_DISPLAY_TYPE = require('../constants/moduleDisplayType');
const MODULE_TYPE = require('../constants/moduleDisplayType');
const StateTransformer = require('./StateTransformer');

class ArtificialIntelligenceStateTransformer extends StateTransformer {
  constructor() {
    super();

    this.moduleType = MODULE_TYPE.artificialintelligence;
  }

  async noSegmentTransform(state, moduleName, moduleDisplayName) {
    state.credit_process.push({
      type: MODULE_DISPLAY_TYPE[this.moduleType],
      display_name: moduleDisplayName,
      name: moduleName,
      segment: '',
      predicted_classification: '',
      output_variable: '',
    });
  }

  async singleSegmentTransform(state, segment, _moduleName, moduleDisplayName) {  
    state.artificialintelligence_variables = state.artificialintelligence_variables || {};
    Object.assign(state.artificialintelligence_variables, segment.output);
  
    const outputKey = segment.output_variable;
    if (outputKey && segment.output !== undefined) {
      state[outputKey] = segment.output[outputKey];
    }
  
    state.credit_process.push(Object.assign({
      name: segment.name,
      type: MODULE_DISPLAY_TYPE[this.moduleType],
      display_name: moduleDisplayName,
      segment: segment.segment,
      predicted_classification: segment.classification
    }, segment.output));
  }
}

const artificialIntelligenceStateTransformer = new ArtificialIntelligenceStateTransformer();

module.exports = artificialIntelligenceStateTransformer.transform.bind(artificialIntelligenceStateTransformer);
