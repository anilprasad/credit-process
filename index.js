'use strict';
const CreditPipeline = require('./lib/CreditPipeline');
const segmentLoader = require('@digifi-los/segmentloader');

class CreditProcess {
  initialize(resources = {}) {
    this.creditPipeline = new CreditPipeline(resources);

    return { 
      generateCreditSegments: this.generateCreditSegments.bind(this),
    };
  }

  /**
   * 
   * Creates decision segments. Wrapper function around the credit pipeline function in the credit.js file
   * 
   * @param {Object} query Query to be used to load compiled strategies
   * @param {bool} force if false will reload the pipelines instead of using the already existing pipelines
   * @param {Object} options options to be used to load compiled strategies
   * @return {Promise} Returns promise that resolves to loaded credit pipelines
   */
  async generateCreditSegments(query = { active: true, }, force = false, options = {}) {
    const initializedEngines = await this.creditPipeline.getCreditPipelines(query, force, options);
  
    const initializedSegments = initializedEngines.reduce((segments, engine) => {
      segments[key] = segmentLoader.generateEvaluators({
        conditions: engine.conditions || [],
        engine: engine.evaluator,
        engine_name: key,
        organization: engine.organization,
      });

      return segments;
    }, {});
    
    return segmentLoader.evaluate(initializedSegments, true);
  };
}

const creditProcess = new CreditProcess();

module.exports = creditProcess.initialize.bind(creditProcess);
