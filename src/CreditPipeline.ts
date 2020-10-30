import * as AWS from 'aws-sdk';
import CompiledStrategy from 'type/CompiledStrategy';
import CreditProcessState from 'type/CreditProcessState';
import moduleCompilerFactory from 'module/moduleCompilerFactory';
import { Module } from 'type/Module';
import stateManager from 'updateState';
import { StrategyVariable } from 'type/variable/StrategyVariable';
import { Operation } from 'type/Operation';
import checkSegmentsConditions from 'checkSegmentsConditions';

export default class CreditPipeline {
  private machinelearning?: any;
  private operations?: Array<{ operation: Operation, module: Module }>;

  public initialize = async (compiledStrategy: CompiledStrategy) => {
    this.initMachineLearning();

    this.operations = [];

    for (const module of compiledStrategy.module_run_order) {
      const operation = await this.moduleToOperation(module, compiledStrategy);
      this.operations.push({ operation, module });
    }
  }

  public run = async (state: CreditProcessState) => {
    if (!this.operations) {
      throw new Error('Pipeline not initialized');
    }

    try {
      let processingState = Object.assign({}, state);

      for (const { module, operation } of this.operations) {
        const segments = await operation(processingState);
        const successSegments = checkSegmentsConditions(segments)(processingState);

        if (!successSegments) {
          throw new Error(`There are no segments that meet conditions for module ${module.display_name}`);
        }

        processingState = await stateManager.updateStateWithModuleResults(module, successSegments, processingState);
      }

      const protectedVariables = new Set(['strategy_status', 'passed']);

      const result = this.formatStrategyResult(processingState, protectedVariables);

      return result;
    } catch(error) {
      const protectedVariables = new Set([
        'decline_reasons',
        'credit_process',
        'passed',
        'strategy_status',
        'error',
        'message',
        'calculated_variables',
        'output_variables',
        'scorecard_variables',
        'assignment_variables',
        'artificialintelligence_variables',
        'dataintegration_variables',
      ]);

      const result = this.formatStrategyResult(error, protectedVariables, true);

      return result;
    }
  };

  private moduleToOperation = async (module: Module, strategy: CompiledStrategy) => {
    const moduleCompilationOptions = {
      segments: module.segments,
      module_name: module.name,
      module_type: module.type,
      integration: module.dataintegration,
      machinelearning: this.machinelearning,
      module_display_name: module.display_name,
      input_variables: strategy.input_variables,
      output_variables: strategy.output_variables,
    };

    return moduleCompilerFactory(moduleCompilationOptions);
  }

  private formatStrategyResult(state: CreditProcessState, protectedVariables: Set<string>, failed = false) {
    const output_variables = {
      ...state.calculated_variables,
      ...state.output_variables,
      ...state.scorecard_variables,
      ...state.assignment_variables,
      ...state.artificialintelligence_variables,
      ...state.dataintegration_variables,
    };

    Object.keys(output_variables).forEach(outputKey => {
      output_variables[outputKey] = state[outputKey];
    });

    const input_variables: Record<string, StrategyVariable> = {};

    Object.keys(state).forEach(key => {
      if (state[key] !== null && typeof state[key] === 'object') {
        return;
      }
      
      if (output_variables[key] !== undefined) {
        return;
      }
      
      if (!protectedVariables.has(key)) {
        input_variables[key] = state[key];
      }
    });

    const data_sources = Array.isArray(state.datasources)
      ? state.datasources
      : [];

    return {
      passed: !failed && (state.passed === undefined || state.passed),
      input_variables,
      output_variables,
      decline_reasons: state.decline_reasons || [],
      processing_detail: state.credit_process,
      data_sources,
      error: state.error,
      message: state.message,
    };
  }

  private initMachineLearning = () => {
    if (this.machinelearning) {
      return;
    }
  
    const {
      AWSMachineLearningRegion,
      AWSMachineLearningKey,
      AWSMachineLearningSecret,
    } = process.env;
    
    if (!AWSMachineLearningRegion || !AWSMachineLearningKey || !AWSMachineLearningSecret) {
      return;
    }
  
    AWS.config.update({ region: AWSMachineLearningRegion, });
    AWS.config.credentials = new AWS.Credentials(AWSMachineLearningKey, AWSMachineLearningSecret);
  
    this.machinelearning = new AWS.MachineLearning();
  }
}
