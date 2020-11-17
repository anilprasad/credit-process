import { CompiledStrategy } from './interface/CompiledStrategy';
import { CreditProcessState } from './interface/CreditProcessState';
import { Module } from './interface/Module';
import { StateSegment } from './interface/StateSegment';
import { StrategyVariable } from './interface/variable/StrategyVariable';
import moduleCompilerFactory from './moduleCompilerFactory';
import StateManager from './StateManager';

type Operation = (state: CreditProcessState) => Promise<StateSegment[]>;

export default class CreditPipeline {
  private operations?: Array<{ operation: Operation; module: Module }>;

  public initialize = async (compiledStrategy: CompiledStrategy) => {
    this.operations = compiledStrategy.module_run_order.map(module => {
      return {
        operation: moduleCompilerFactory(module, compiledStrategy),
        module,
      };
    });
  }

  public run = async (state: CreditProcessState) => {
    if (!this.operations) {
      throw new Error('Pipeline not initialized');
    }

    let processingState = {...state };

    try {
      for (const { module, operation } of this.operations) {
        const segments = await operation(processingState);

        processingState = await StateManager.updateStateWithModuleResults(
          module,
          segments,
          processingState,
        );
      }
    } catch (error) {
      processingState = StateManager.appendError(processingState, error);
    }

    const protectedVariables = new Set([
      'artificialintelligence_variables',
      'assignment_variables',
      'calculated_variables',
      'credit_process',
      'dataintegration_variables',
      'decline_reasons',
      'error',
      'message',
      'output_variables',
      'passed',
      'scorecard_variables',
      'strategy_status',
    ]);

    const result = this.formatStrategyResult(processingState, protectedVariables);

    return result;
  };

  private formatStrategyResult(state: CreditProcessState, protectedVariables: Set<string>) {
    const output_variables: Record<string, unknown> = {
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
        input_variables[key] = state[key] as StrategyVariable;
      }
    });

    const data_sources = Array.isArray(state.datasources)
      ? state.datasources
      : [];

    return {
      passed: !state.error && (state.passed === undefined || state.passed),
      input_variables,
      output_variables,
      decline_reasons: state.decline_reasons || [],
      processing_detail: state.credit_process,
      data_sources,
      error: state.error,
      message: state.error?.message,
    };
  }
}
