'use strict';
const periodic = require('periodicjs');
const AWS = require('aws-sdk');
const segmentutility = require('./segments').compileSegments;
const stateManager = require('./stateManager');
let machinelearning;

const generate = async (type, options) => {
  let { segments, module_name, module_display_name } = options;

  if (!Array.isArray(segments) || !segments.length) {
    return;
  }

  const generator = evaluatorsCompilerFactory(type);

  const segments = await generator(options);
  
  return [
    segmentutility.bind(null, type, module_name)(segments),
    stateManager.updateState(module_name, 'dataintegration', module_display_name),
  ];
}

/**
 * 
 * @param {Object} options options for compiling the credit engine
 * @param {[Object]} options.module_run_order array of modules configurations
 * @param {[Object]} options.input_variables array of populated input variables
 * @param {[Object]} options.out_variables array of populated out variables
 * @return {Promise} Returns promise that resolves to a loaded pipeline function
 */
const compileCreditEngine = async (options = {}) => {
  initMachineLearning();

  const pipeline = [];
  
  for (const module of options.module_run_order) {
    const operation = await moduleToOperation(module, options);
    pipeline.push(operation);
  }

  return pipeline;
};

const moduleToOperation = (module, options) => {
  const options = {
    segments: module.segments,
    module_name: module.name,
    integration: module.dataintegration,
    machinelearning,
    module_display_name: module.display_name,
    input_variables: options.input_variables,
    output_variables: options.output_variables,
  };

  return generate(module.type, options);
}

const initMachineLearning = () => {
  if (machinelearning) {
    return;
  }
  
  if (!periodic.settings.container) {
    return;
  }

  const decisionEngineServiceContainer = periodic.settings.container['decision-engine-service-container']
  
  if (!decisionEngineServiceContainer || !decisionEngineServiceContainer.machinelearning) {
    return;
  }

  const awsConfigs = decisionEngineServiceContainer.machinelearning;
  AWS.config.update({ region: awsConfigs.region, });
  AWS.config.credentials = new AWS.Credentials(awsConfigs.key, awsConfigs.secret, null);

  machinelearning = new AWS.MachineLearning();
}

module.exports = compileCreditEngine;
