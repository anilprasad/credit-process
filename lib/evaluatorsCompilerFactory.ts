import { ModuleType } from './enums/ModuleType';
import EvaluatorsCompiler from './evaluatorsCompiler';
// @ts-ignore
import generateAI from '@digifi-los/ml';
// @ts-ignore
import generateAssignments from '@digifi-los/assignments';
// @ts-ignore
import generateCalculations from '@digifi-los/calculations';
// @ts-ignore
import generateDataIntegration from '@digifi-los/data-integrations-strategy';
// @ts-ignore
import generateOutput from '@digifi-los/output';
// @ts-ignore
import generateRequirements from '@digifi-los/requirements';
// @ts-ignore
import generateScorecard from '@digifi-los/scorecard';

const moduleTypeToCreateEvaluatorCallback = {
  artificialintelligence: generateAI,
  assignments: generateAssignments,
  calculations: generateCalculations,
  dataintegration: generateDataIntegration,
  output: generateOutput,
  requirements: generateRequirements,
  scorecard: generateScorecard,
}

const getCreateEvaluatorCallback = (moduleType: ModuleType) => {
  const createEvaluatorCallback = moduleTypeToCreateEvaluatorCallback[moduleType];

  if (!createEvaluatorCallback) {
    throw new Error(`unknown module type "${moduleType}"`);
  }

  return createEvaluatorCallback;
}

export default (moduleType: ModuleType) => {
  const createEvaluatorCallback = getCreateEvaluatorCallback(moduleType);

  const evaluatorsCompiler = new EvaluatorsCompiler(createEvaluatorCallback);

  return evaluatorsCompiler.compileEvaluators;
};
