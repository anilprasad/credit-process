'use strict';

import { ModuleType } from '../enums/ModuleType';
import CreditProcessState from '../types/CreditProcessState';
import artificialIntelligenceStateTransformer from './ArtificialIntelligenceStateTransformer';
import assignmentsStateTransformer from './AssignmentsStateTransformer';
import calculationsStateTransformer from './CalculationsStateTransformer';
import dataIntegrationStateTransformer from './DataIntegrationStateTransformer';
import outputStateTransformer from './OutputStateTransformer';
import requirementsStateTransformer from './RequirementsStateTransformer';
import scoreCardStateTransformer from './ScoreCardStateTransformer';

const moduleStateTransformerToType = {
  artificialintelligence: artificialIntelligenceStateTransformer,
  assignments: assignmentsStateTransformer,
  calculations: calculationsStateTransformer,
  dataintegration: dataIntegrationStateTransformer,
  output: outputStateTransformer,
  requirements: requirementsStateTransformer,
  scorecard: scoreCardStateTransformer,
};

export default (moduleName: string, moduleType: ModuleType, moduleDisplayName: string) => {
  return async (state: CreditProcessState) => {
    state.credit_process = state.credit_process || [];

    if (state.error) {
      delete state.assignments;
      delete state.calculations;
      delete state.requirements;
      delete state.output;
      delete state.scorecard;
      delete state.dataintegration;
      delete state.dataintegrations;
      delete state.artificialintelligence;

      return Promise.reject(
        Object.assign(
          {},
          state,
          { message: `Error in ${moduleType} module ${moduleName}: ${state.error.message}`, },
        )
      );
    }

    const moduleStateTransformer = new moduleStateTransformerToType[moduleType]();
    
    await moduleStateTransformer.transform(state, moduleName, moduleDisplayName);

    delete state[moduleType];

    return state;
  };
};
