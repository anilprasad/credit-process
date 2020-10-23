import { ModuleType } from '../enum/ModuleType';
import ModuleCompiler, { IModuleCompilationOptions } from './ModuleCompiler';
import CreditProcessState from '../type/CreditProcessState';
import Segment from '../type/Segment';
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

export default async (moduleCompilationOptions: IModuleCompilationOptions) => {
  const createEvaluatorCallback = getCreateEvaluatorCallback(moduleCompilationOptions.module_type);

  const moduleCompiler = new ModuleCompiler(createEvaluatorCallback);

  const evaluations = await moduleCompiler.getSegmentEvaluations(moduleCompilationOptions)

  return async (state: CreditProcessState) => {
    if (!Array.isArray(evaluations)) {
      return evaluations(state);
    }

    let segments: Segment[] = [];

    for (const evaluation of evaluations) {
      const resultSegments = await evaluation(state);
      segments = segments.concat(Array.isArray(resultSegments) ? resultSegments : [resultSegments]);
    }

    return segments;
  };
  /* console.log('moduleCompilerFactory:46', configurations);

  const evaluators = segmentLoader.generateEvaluators(configurations);
  console.log('moduleCompilerFactory:49', evaluators);

  return segmentLoader.evaluate(evaluators); */
};
