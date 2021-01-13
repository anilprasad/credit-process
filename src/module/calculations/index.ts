import * as coerceHelper from '../../helper/coerceHelper';
import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { CalculationsRule } from './interface/CalculationsRule';
import { CalculationsStateSegment } from './interface/CalculationsStateSegment';
import { CalculationsStrategySegment } from './interface/CalculationsStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import numeric from 'numeric';
import string2json from 'string-to-json';
import vm from 'vm';

export interface ICalculationsModuleCompilationOptions
  extends IBasicModuleCompilationOptions<CalculationsStrategySegment> {
  module_type: ModuleType.Calculations;
}

interface ICalculationsContext extends CreditProcessState {
  _global: CreditProcessState;
  numeric: typeof numeric;
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
    const calculation = this.buildScript(segment.variables);

    calculation.runInContext(sandbox);

    return {
      type: ModuleType.Calculations,
      name: this.moduleName,
      segment: segment.name,
      calculations: string2json.convert(sandbox._global.calculations),
    };
  };

  private buildContext = (state: CreditProcessState) => {
    const context: ICalculationsContext = {
      _global: {
        calculations: {},
        ...state,
      },
      ...state,
      numeric: numeric,
    };

    return vm.createContext(context);
  };

  private buildScript = (variables: CalculationsRule[]) => {
    const allVars = variables.map(variable => variable.variable_name)
      .filter((x, i, a) => a.indexOf(x) === i).join(',') || 'test';

    const script = variables.reduce((result, current) => {
      const fn = new Function(current.calculation_operation);
      const coerceFn = coerceHelper.coerceValue;
      result += `${current.variable_name} = (${fn.toString()})();
        _global.calculations['${current.variable_name}'] = ${coerceFn}(
          ${current.variable_name},
          '${current.variable_type}'
        );
      `;

      return result;
    }, `'use strict';
    let ${allVars};
    `);

    return new vm.Script(script);
  };
}
