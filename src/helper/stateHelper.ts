import assignmentsStateTransformer from '../module/assignments/assignmentsStateTransformer';
import calculationsStateTransformer from '../module/calculations/calculationsStateTransformer';
import { CreditProcessState } from '../interface/CreditProcessState';
import dataIntegrationsStateTransformer from '../module/data-integrations/dataIntegrationsStateTransformer';
import machineLearningStateTransformer from '../module/machine-learning/machineLearningStateTransformer';
import { Module } from '../interface/Module';
import { ModuleType } from '../enum/ModuleType';
import outputStateTransformer from '../module/output/outputStateTransformer';
import requirementsStateTransformer from '../module/requirements/requirementsStateTransformer';
import scorecardStateTransformer from '../module/scorecard/scorecardStateTransformer';
import { StateSegment } from '../interface/StateSegment';

interface IErrorStateSegment {
  message?: string;
  decline_reasons?: string[];
}

const moduleTypeToStateTransformer = {
  [ModuleType.Assignments]: assignmentsStateTransformer,
  [ModuleType.Calculations]: calculationsStateTransformer,
  [ModuleType.DataIntegration]: dataIntegrationsStateTransformer,
  [ModuleType.MachineLearning]: machineLearningStateTransformer,
  [ModuleType.Output]: outputStateTransformer,
  [ModuleType.Requirements]: requirementsStateTransformer,
  [ModuleType.Scorecard]: scorecardStateTransformer,
};

export const updateStateWithModuleResults = async (
  module: Module,
  segments: StateSegment[],
  state: CreditProcessState,
) => {
  const moduleStateTransformer = moduleTypeToStateTransformer[module.type];

  return moduleStateTransformer.transform(module, segments, state);
};

export const appendError = (state: CreditProcessState, { message, decline_reasons }: IErrorStateSegment) => {
  return {
    ...state,
    error: message ? { message } : undefined,
    decline_reasons,
  };
};
