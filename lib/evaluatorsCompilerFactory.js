'use strict';
const EvaluatorsCompiler = require('./evaluatorsCompiler');
const generateAI = require('@digifi-los/ml');
const generateAssignments = require('@digifi-los/assignments');
const generateCalculations = require('@digifi-los/calculations');
const generateDataIntegration = require('@digifi-los/data-integrations-strategy');
const generateOutput = require('@digifi-los/output');
const generateRequirements = require('@digifi-los/requirements');
const generateScorecard = require('@digifi-los/scorecard');

const moduleTypeToCreateEvaluatorCallback = {
  artificialintelligence: generateAI,
  assignments: generateAssignments,
  calculations: generateCalculations,
  dataintegration: generateDataIntegration,
  output: generateOutput,
  requirements: generateRequirements,
  scorecard: generateScorecard,
}

const getCreateEvaluatorCallback = (moduleType) => {
  const createEvaluatorCallback = moduleTypeToCreateEvaluatorCallback[moduleType];

  if (!createEvaluatorCallback) {
    throw new Error(`unknown module type "${moduleType}"`);
  }

  return createEvaluatorCallback;
}

module.exports = (moduleType) => {
  const createEvaluatorCallback = getCreateEvaluatorCallback(moduleType);

  const evaluatorsCompiler = new EvaluatorsCompiler(createEvaluatorCallback);

  return evaluatorsCompiler.compileEvaluators;
};
