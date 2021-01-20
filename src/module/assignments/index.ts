import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { AssignmentsRule } from './interface/AssignmentsRule';
import { AssignmentsStateSegment } from './interface/AssignmentsStateSegment';
import { AssignmentsStrategySegment } from './interface/AssignmentsStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import numeric from 'numeric';
import vm from 'vm';

export interface IAssignmentsModuleCompilationOptions
  extends IBasicModuleCompilationOptions<AssignmentsStrategySegment> {
  module_type: ModuleType.Assignments;
}

export default class Assignments extends AbstractModule<AssignmentsStrategySegment, AssignmentsStateSegment> {
  constructor(options: IAssignmentsModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: AssignmentsStrategySegment,
    state: CreditProcessState
  ): Promise<AssignmentsStateSegment> => {
    const _state = { ...state };

    const sandbox = this.buildContext(_state);

    return {
      type: ModuleType.Assignments,
      name: this.moduleName,
      segment: segment.name,
      assignments: this.calculateVariables(sandbox, segment.variables),
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

  private calculateVariables = (sandbox: vm.Context, variables: AssignmentsRule[]) => {
    return variables.reduce((calculations: Record<string, unknown>, variable) => {
      const calculation = vm.compileFunction(
        variable.assignment_operation,
        [],
        { parsingContext: sandbox },
      );

      calculations[variable.variable_name] = calculation();

      return calculations;
    }, {});
  };
}
