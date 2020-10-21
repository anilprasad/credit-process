import compileCreditEngine from './creditEngineCompiler';
import CompiledStrategy from './types/CompiledStrategy';

export default class CreditPipeline {
  /**
   * 
   * Given compiled strategy configuration, builds the credit pipeline
   * 
   * @param {Object} compiledStrategy loaded compiled strategy 
   * @return {Promise} Returns promise that resolves to a function that takes a state and evaluates the credit pipline
   */
  async loadPipeline(compiledStrategy) {
    const creditPipeline = await compileCreditEngine(compiledStrategy);

    return async (state) => {
      try {
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

  async getCreditPipeline(compiledStrategy: CompiledStrategy) {
    const evaluator = await this.loadPipeline(compiledStrategy);

    return { evaluator, organization: compiledStrategy.organization, };
  };
}
