import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { AssignmentsRule } from './interface/AssignmentsRule';
import { AssignmentsStateSegment } from './interface/AssignmentsStateSegment';
import { AssignmentsStrategySegment } from './interface/AssignmentsStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import numeric from 'numeric';
import string2json from 'string-to-json';
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

    const script = this.buildScript(segment.variables);
    const { sandbox, assignment } = this.prepareAssignment(_state, script);
    assignment.runInContext(sandbox);

    return {
      type: ModuleType.Assignments,
      name: this.moduleName,
      segment: segment.name,
      assignments: string2json.convert(sandbox._global.assignments),
    };
  };

  private buildScript = (variables: AssignmentsRule[]) => {
    const assignmentsBlock = variables.map((variable) => {
      const fn = new Function(variable.assignment_operation);

      return `_global.assignments['${variable.variable_name}'] = (${fn.toString()})();`;
    }).join('\r\n');

    return `'use strict';
      ${assignmentsBlock}
    `;
  };

  private prepareAssignment = (
    state: CreditProcessState,
    script: string,
  ) => {
    const sandbox = {
      _global: {
        assignments: {},
        ...state,
      },
      numeric,
      ...state,
    };

    const assignment = new vm.Script(script);
    vm.createContext(sandbox);

    return { sandbox, assignment };
  };
}
