import * as coerceHelper from '../../helper/coerceHelper';
import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { CalculationsRule } from './interface/CalculationsRule';
import { CalculationsStateSegment } from './interface/CalculationsStateSegment';
import { CalculationsStrategySegment } from './interface/CalculationsStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import numeric from 'numeric';
import vm from 'vm';

export interface ICalculationsModuleCompilationOptions
  extends IBasicModuleCompilationOptions<CalculationsStrategySegment> {
  module_type: ModuleType.Calculations;
}

export default class Calculations extends AbstractModule<CalculationsStrategySegment, CalculationsStateSegment> {
  constructor(options: ICalculationsModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: CalculationsStrategySegment,
    state: CreditProcessState
  ): Promise<CalculationsStateSegment> => {
    const _state = { ...state };
    const sandbox = this.buildContext(_state);

    return {
      type: ModuleType.Calculations,
      name: this.moduleName,
      segment: segment.name,
      calculations: this.calculateVariables(sandbox, segment.variables),
    };
  };

  private buildContext = (state: CreditProcessState) => {
    const context = {
      _global: {
        ...state,
      },
      ...state,
      numeric: numeric,
    };

    return vm.createContext(context);
  };

  private calculateVariables = (sandbox: vm.Context, variables: CalculationsRule[]) => {
    return variables.reduce((calculations: Record<string, unknown>, variable) => {
      const calculation = vm.compileFunction(
        variable.calculation_operation,
        [],
        { parsingContext: sandbox },
      );

      calculations[variable.variable_name] = coerceHelper.coerceValue(calculation(), variable.variable_type);

      return calculations;
    }, {});
  };
}
