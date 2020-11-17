import { CreditProcessState } from './interface/CreditProcessState';
import { Module } from './interface/Module';
import { ModuleType } from './enum/ModuleType';
import { StateSegment } from './interface/StateSegment';
import AssignmentsStateTransformer from './module/assignments/AssignmentsStateTransformer';
import CalculationsStateTransformer from './module/calculations/CalculationsStateTransformer';
import DataIntegrationsStateTransformer from './module/data-integrations/DataIntegrationsStateTransformer';
import MachineLearningStateTransformer from './module/machine-learning/MachineLearningStateTransformer';
import OutputStateTransformer from './module/output/OutputStateTransformer';
import RequirementsStateTransformer from './module/requirements/RequirementsStateTransformer';
import ScoreCardStateTransformer from './module/scorecard/ScorecardStateTransformer';

interface IErrorStateSegment {
  message?: string;
  decline_reasons?: string[];
}

const moduleTypeToStateTransformerClass = {
  [ModuleType.artificialintelligence]: MachineLearningStateTransformer,
  [ModuleType.assignments]: AssignmentsStateTransformer,
  [ModuleType.calculations]: CalculationsStateTransformer,
  [ModuleType.dataintegration]: DataIntegrationsStateTransformer,
  [ModuleType.output]: OutputStateTransformer,
  [ModuleType.requirements]: RequirementsStateTransformer,
  [ModuleType.scorecard]: ScoreCardStateTransformer,
};

export default class StateManager {
  static updateStateWithModuleResults = async (
    module: Module,
    segments: StateSegment[],
    state: CreditProcessState,
  ) => {
    const StateTransformerClass = moduleTypeToStateTransformerClass[module.type];
    const moduleStateTransformer = new StateTransformerClass();

    return moduleStateTransformer.transform(module, segments, state);
  };

  static appendError(state: CreditProcessState, { message, decline_reasons }: IErrorStateSegment) {
    return {
      ...state,
      error: message ? { message } : undefined,
      decline_reasons,
    };
  }
}
