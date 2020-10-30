import { ModuleType } from 'enum/ModuleType';
import ModuleCompiler, { IModuleCompilationOptions } from 'module/ModuleCompiler';
import CreditProcessState from 'type/CreditProcessState';
import { StateSegment } from 'type/StateSegment';
// @ts-ignore
import * as generateAI from '@digifi-los/ml';
// @ts-ignore
import * as generateAssignments from '@digifi-los/assignments';
// @ts-ignore
import * as generateCalculations from '@digifi-los/calculations';
// @ts-ignore
import * as generateDataIntegration from '@digifi-los/data-integrations-strategy';
// @ts-ignore
import * as generateOutput from '@digifi-los/output';
// @ts-ignore
import * as generateRequirements from '@digifi-los/requirements';
// @ts-ignore
import * as generateScorecard from '@digifi-los/scorecard';
// @ts-ignore
import * as segmentLoader from '@digifi-los/segmentloader';
import { Operation as any, Operation } from 'type/Operation';

const moduleTypeToCreateEvaluatorCallback = new Map<ModuleType, any>([
  [ModuleType.artificialintelligence, generateAI],
  [ModuleType.assignments, generateAssignments],
  [ModuleType.calculations, generateCalculations],
  [ModuleType.dataintegration, generateDataIntegration],
  [ModuleType.output, generateOutput],
  [ModuleType.requirements, generateRequirements],
  [ModuleType.scorecard, generateScorecard],
]);

const getCreateEvaluatorCallback = (moduleType: ModuleType) => {
  const createEvaluatorCallback = moduleTypeToCreateEvaluatorCallback.get(moduleType);

  if (!createEvaluatorCallback) {
    throw new Error(`unknown module type "${moduleType}"`);
  }

  return createEvaluatorCallback;
}

const runConditionChecks = async (state: CreditProcessState, conditionChecks: any | any[]) => {
  if (!Array.isArray(conditionChecks)) {
    return conditionChecks(state);
  }

  for (const conditionCheck of conditionChecks) {
    await conditionCheck(state);
  }
} 

const runOperations = async (state: CreditProcessState, operations: Operation | Operation[]) => {
  if (!Array.isArray(operations)) {
    return operations(state);
  }

  let segments: StateSegment[] = [];

  for (const operation of operations) {
    const resultSegments = await operation(state);
    segments = segments.concat(Array.isArray(resultSegments) ? resultSegments : [resultSegments]);
  }

  return segments;
} 

export default async (moduleCompilationOptions: IModuleCompilationOptions) => {
  const createEvaluatorCallback = getCreateEvaluatorCallback(moduleCompilationOptions.module_type);

  const moduleCompiler = new ModuleCompiler(createEvaluatorCallback);

  const conditionChecks = segmentLoader.generateEvaluators(moduleCompilationOptions.segments);
  const evaluations = await moduleCompiler.getModuleOperations(moduleCompilationOptions);

  return async (state: CreditProcessState) => {
    await runConditionChecks(state, conditionChecks);

    return runOperations(state, evaluations);
  };
};
