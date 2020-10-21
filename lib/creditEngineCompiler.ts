'use strict';
import AWS from 'aws-sdk';
import segmentutility from './segments';
import stateManager from './stateManager';
import evaluatorsCompilerFactory from './evaluatorsCompilerFactory';

let machinelearning: any;

/**
 * 
 * @param {Object} options options for compiling the credit engine
 * @param {[Object]} options.module_run_order array of modules configurations
 * @param {[Object]} options.input_variables array of populated input variables
 * @param {[Object]} options.out_variables array of populated out variables
 * @return {Promise} Returns promise that resolves to a loaded pipeline function
 */
export default async (options = {}) => {
  initMachineLearning();

  const pipeline = [];
  
  for (const module of options.module_run_order) {
    const operation = await moduleToOperation(module, options);
    pipeline.push(operation);
  }

  return pipeline;
};

const generate = async (type, options) => {
  let { segments, module_name, module_display_name } = options;

  if (!Array.isArray(segments) || !segments.length) {
    return;
  }

  const generator = evaluatorsCompilerFactory(type);

  const moduleSegments = await generator(options);
  
  return [
    segmentutility.bind(null, type, module_name)(moduleSegments),
    stateManager.updateState(module_name, 'dataintegration', module_display_name),
  ];
}

const moduleToOperation = (module, options) => {
  const generatorOptions = {
    segments: module.segments,
    module_name: module.name,
    integration: module.dataintegration,
    machinelearning,
    module_display_name: module.display_name,
    input_variables: options.input_variables,
    output_variables: options.output_variables,
  };

  return generate(module.type, generatorOptions);
}

const initMachineLearning = () => {
  if (machinelearning) {
    return;
  }

  const {
    AWSMachineLearningRegion,
    AWSMachineLearningKey,
    AWSMachineLearningSecret,
  } = process.env;
  
  if (!AWSMachineLearningRegion || !AWSMachineLearningKey || !AWSMachineLearningSecret) {
    return;
  }

  AWS.config.update({ region: AWSMachineLearningRegion, });
  AWS.config.credentials = new AWS.Credentials(AWSMachineLearningKey, AWSMachineLearningSecret, null);

  machinelearning = new AWS.MachineLearning();
}
