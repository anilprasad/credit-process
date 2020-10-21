'use strict';
const compileCreditEngine = require('./creditEngineCompiler');

class CreditPipeline {
  constructor(resources) {
    this.collections = resources.datas;
  };

  /**
   * 
   * Given compiled strategy configuration, builds the credit pipeline
   * 
   * @param {Object} compiledStrategy loaded compiled strategy 
   * @return {Promise} Returns promise that resolves to a function that takes a state and evaluates the credit pipline
   */
  async loadPipeline(compiledStrategy) {
    const creditPipeline = await compileCreditEngine(compiledStrategy);

    if (!creditPipeline || !creditPipeline.length) {
      return {
        passed: true,
        decline_reasons: [],
        input_variables: state,
        output_variables: {},
        processing_detail: [],
        data_sources: [],
      };
    }

    return async (state) => {
      try {
        let processingState = Object.assign({}, state);

        for (const creditOperation of creditPipeline) {
          processingState = await creditOperation(processingState);
        }

        const protectedVariables = { strategy_status: true, passed: true, };

        return this.formatStrategyResult(processingState, protectedVariables);
      } catch(error) {
        const protectedVariables = {
          decline_reasons: true,
          credit_process: true,
          passed: true,
          strategy_status: true,
          error: true,
          message: true,
          calculated_variables: true,
          output_variables: true,
          scorecard_variables: true,
          assignment_variables: true,
          artificialintelligence_variables: true,
          dataintegration_variables: true,
        };

        return this.formatStrategyResult(error, protectedVariables, true);
      }
    };
  };

  formatStrategyResult(unformattedResult, protectedVariables, failed = false) {
    const output_variables = Object.assign(
      {},
      unformattedResult.calculated_variables,
      unformattedResult.output_variables,
      unformattedResult.scorecard_variables,
      unformattedResult.assignment_variables,
      unformattedResult.artificialintelligence_variables,
      unformattedResult.dataintegration_variables,
    );

    Object.keys(output_variables).forEach(outputKey => {
      output_variables[outputKey] = unformattedResult[outputKey];
    });

    const input_variables = {};

    Object.keys(unformattedResult).forEach(key => {
      if (unformattedResult[key] !== null && typeof unformattedResult[key] === 'object') {
        return;
      }
      
      if (output_variables[key] !== undefined) {
        return;
      }
      
      if (!protectedVariables[ key ]) {
        input_variables[key] = unformattedResult[key];
      }
    });

    const data_sources = [];
    if (unformattedResult.datasources) {
      Object.keys(unformattedResult.datasources).forEach(dataSourceKey => {
        const { name, provider, raw } = unformattedResult.datasources[dataSourceKey];

        data_sources.push({
          name,
          provider,
          data: raw,
        });
      });
    }

    return {
      passed: !failed && (unformattedResult.passed === undefined || unformattedResult.passed),
      input_variables,
      output_variables,
      decline_reasons: unformattedResult.decline_reasons || [],
      processing_detail: unformattedResult.credit_process,
      data_sources,
      error: unformattedResult.error,
      message: unformattedResult.message,
    };
  }

  /**
   * 
   * Creates an array of pipeline loading functions
   * 
   * @param {Object} query Query to be used to load compiled strategies
   * @param {Object} options options to be used to load compiled strategies
   * @return {Promise} Returns pipieline for loading the strategy and creating the strategy pipeline function 
   */
  async initializeCreditPipelines(query, options) {
    const Strategy = this.collections.get('standard_compiledstrategy');

    const strategies = options.compiledstrategy
      ? [ options.compiledstrategy, ]
      : await Strategy.query({ query, });

    const evaluators = [];

    for (const strategy of strategies) {
      const evaluator = await this.loadPipeline(strategy);
      evaluators.push({ evaluator, organization: strategy.organization, });
    }

    return evaluators;
  };

  /**
   * 
   * Wrapper function for loading the credit pipelines
   * 
   * @param {Object} query Query to be used to load compiled strategies
   * @param {bool} force if false will reload the pipelines instead of using the already existing pipelines
   * @param {Object} options options to be used to load compiled strategies
   * @return {Promise} Returns promise that loads the credit pipelines
   */
  async getCreditPipelines(query, force = false, options = {}) {
    if (this.creditPipelines && !force) {
      return this.creditPipelines;
    }
  
    this.creditPipelines = await this.initializeCreditPipelines(query, options);

    return this.creditPipelines;
  };
}


module.exports = CreditPipeline;
