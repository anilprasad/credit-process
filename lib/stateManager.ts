'use strict';
const capitalize = require('capitalize');

const DISPLAY_TYPE = {
  'artificialintelligence': 'AI Model',
  'assignments': 'Simple Output',
  'calculations': 'Calculation Scripts',
  'dataintegration': 'Data Integration',
  'output': 'Rule Based Output',
  'requirements': 'Requirements Rules',
  'scorecard': 'Scoring Model',
};

const updateArtificialIntelligence = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.artificialintelligence ? Object.keys(state.artificialintelligence) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }
  
  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.artificialintelligence,
      display_name: module_display_name,
      name: module_name,
      segment: '',
      predicted_classification: '',
      output_variable: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];
  const artificialIntelligenceSegment = state
    && state.artificialintelligence
    && state.artificialintelligence[segmentKey]
    && state.artificialintelligence[segmentKey]
    || {};

  state.artificialintelligence_variables = state.artificialintelligence_variables || {};
  Object.assign(state.artificialintelligence_variables, artificialIntelligenceSegment.output);

  const outputKey = artificialIntelligenceSegment.output_variable;
  if (outputKey && artificialIntelligenceSegment.output !== undefined) {
    state[outputKey] = artificialIntelligenceSegment.output[outputKey];
  }

  state.credit_process.push(Object.assign({
    name: artificialIntelligenceSegment.name,
    type: DISPLAY_TYPE.artificialintelligence,
    display_name: module_display_name,
    segment: artificialIntelligenceSegment.segment,
    predicted_classification: artificialIntelligenceSegment.classification
  }, artificialIntelligenceSegment.output));
}

const updateAssignments = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.assignments ? Object.keys(state.assignments) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }
  
  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.assignments,
      display_name: module_display_name,
      name: module_name,
      segment: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];

  const assignment_variables = state
    && state.assignments
    && state.assignments[segmentKey]
    && state.assignments[segmentKey].assignments
    || {};

  Object.assign(state, assignment_variables);

  state.assignment_variables = state.assignment_variables || {};
  Object.assign(state.assignment_variables, assignment_variables);

  state.assignments[segmentKey].passed = true;

  state.credit_process.push(Object.assign({}, assignment_variables, {
    name: module_name,
    display_name: module_display_name,
    type: DISPLAY_TYPE.assignments,
    segment: segmentKey,
  }));
}

const updateCalculations = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.calculations ? Object.keys(state.calculations) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }

  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.calculations,
      display_name: module_display_name,
      name: module_name,
      segment: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];

  const calculated_variables = state
    && state.calculations
    && state.calculations[segmentKey]
    && state.calculations[segmentKey].calculations
    || {};

  Object.assign(state, calculated_variables);

  state.calculated_variables = state.calculated_variables || {};
  Object.assign(state.calculated_variables, calculated_variables);

  state.calculations[segmentKey].passed = true;

  state.credit_process.push(Object.assign({}, calculated_variables, {
    name: module_name,
    type: DISPLAY_TYPE.calculations,
    display_name: module_display_name,
    segment: segmentKey,
  }));
}

const updateDataIntegration = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.dataintegration ? Object.keys(state.dataintegration) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }
  
  if (segmentKeys.length === 0) {
    state.credit_process.push({
      display_name: module_display_name,
      type: DISPLAY_TYPE.dataintegration,
      name: module_name,
      segment: '',
      status: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];
  const dataIntegration = state
    && state.dataintegration
    && state.dataintegration[segmentKey]
    || {};

  Object.assign(state, dataIntegration.output);

  state.datasources = state.datasources || [];
  state.datasources.push(dataIntegration);

  state.dataintegration_variables = state.dataintegration_variables || {};
  Object.assign(state.dataintegration_variables, dataIntegration.output);

  state.dataintegration[segmentKey].type = DISPLAY_TYPE.dataintegration;

  state.credit_process.push({
    name: dataIntegration.name,
    display_name: module_display_name,
    type: DISPLAY_TYPE.dataintegration,
    segment: dataIntegration.segment,
    status: dataIntegration.status,
  });
}

const updateOutput = (state, module_name, module_display_name) => {
  const segmentKeys = (state && state.output) ? Object.keys(state.output) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }

  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.output,
      display_name: module_display_name,
      name: module_name,
      segment: '',
      rules: [],
    });

    return;
  }

  const segmentKey = segmentKeys[0];
  const output = state
    && state.output
    && state.output[segmentKey]
    && state.output[segmentKey].output
    || {};

  Object.assign(state, state.output[ segmentKey ].output);

  state.output_variables = state.output_variables || {};
  Object.assign(state.output_variables, output);

  state.output[segmentKey].passed = true;

  state.output[segmentKey].rules.map(rule => Object.assign(rule.condition_output, {
    name: rule.name,
    passed: rule.passed,
  }));

  state.credit_process.push(Object.assign({}, output, {
    name: module_name,
    display_name: module_display_name,
    type: DISPLAY_TYPE.output,
    segment: segmentKey,
    rules: state.output[segmentKey].rules,
  }));
}

const updateRequirements = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.requirements ? Object.keys(state.requirements) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }

  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.requirements,
      display_name: module_display_name,
      passed: null,
      name: module_name,
      segment: '',
      decline_reasons: [],
      rules: [],
    });

    return;
  }

  const segmentKey = segmentKeys[0];

  state.decline_reasons = state.decline_reasons || [];
  state.decline_reasons = state.decline_reasons.concat(state.requirements[segmentKey].decline_reasons);
  state.decline_reasons = state.decline_reasons.filter((decline_reason, index) => {
    return state.decline_reasons.indexOf(decline_reason) === index;
  });

  state.passed = state
    && state.requirements
    && state.requirements[segmentKey]
    && state.requirements[segmentKey].passed;

  state.requirements[segmentKey].rules = state.requirements[ segmentKey ].rules.map(rule => ({
    name: rule.name,
    passed: rule.passed,
    decline_reason: rule.passed ? undefined : rule.decline_reasons,
  }));

  if (state.passed === false) {
    state.credit_process.push({
      name: module_name,
      display_name: module_display_name,
      type: DISPLAY_TYPE.requirements,
      segment: segmentKey,
      passed: state.requirements[segmentKey].passed,
      decline_reasons: state.requirements[segmentKey].decline_reasons,
      rules: state.requirements[segmentKey].rules,
    });

    return Promise.reject(Object.assign({}, { decline_reasons: state.decline_reasons, }, state));
  }

  state.credit_process.push({
    name: module_name,
    display_name: module_display_name,
    type: DISPLAY_TYPE.requirements,
    segment: segmentKey,
    passed: state.requirements[segmentKey].passed,
    decline_reasons: state.requirements[segmentKey].decline_reasons,
    rules: state.requirements[segmentKey].rules,
  });
}

const updateScoreCard = (state, module_name, module_display_name) => {
  const segmentKeys = state && state.scorecard ? Object.keys(state.scorecard) : [];

  if (segmentKeys.length > 1) {
    return segmentCountExceededReject(state, module_name);
  }
  
  if (segmentKeys.length === 0) {
    state.credit_process.push({
      type: DISPLAY_TYPE.scorecard,
      display_name: module_display_name,
      name: module_name,
      segment: '',
      rules: [],
      output_variable: '',
    });

    return;
  }

  const segmentKey = segmentKeys[0];

  const outputVariableKey = state
    && state.scorecard
    && state.scorecard[segmentKey]
    && state.scorecard[segmentKey].output_variable
    || 'score';

  state[outputVariableKey] = state.scorecard[segmentKey][outputVariableKey];

  state.scorecard_variables = state.scorecard_variables || {};
  state.scorecard_variables[outputVariableKey] = state.scorecard[segmentKey][outputVariableKey];

  state.credit_process.push(
    Object.assign(
      {},
      { [outputVariableKey]: state.scorecard[segmentKey][outputVariableKey] },
      {
        name: module_name,
        display_name: module_display_name,
        type: DISPLAY_TYPE.scorecard,
        segment: segmentKey,
        output_variable: state.scorecard[segmentKey].output_variable,
        rules: state.scorecard[segmentKey].rules,
      },
    )
  );
}

const segmentCountExceededReject = async (state, module_name) => {
  const formattedModuleName = capitalize.words(module_name.replace(/_/g, ' '));

  const basicRejectData = {
    decline_reasons: state.decline_reasons,
    credit_process: state.credit_process,
    error: '',
    message: `Error in ${formattedModuleName} decision module: The decision request falls into multiple population segments and could not be processed.`,
  };

  return Promise.reject(Object.assign(basicRejectData, state));
}

const stateUpdaterToType = {
  artificialintelligence: updateArtificialIntelligence,
  assignments: updateAssignments,
  calculations: updateCalculations,
  dataintegration: updateDataIntegration,
  output: updateOutput,
  requirements: updateRequirements,
  scorecard: updateScoreCard,
};

/**
 * 
 * Updates the global state with the result of the last module that ran
 * @param {string} module_name name of the current module
 * @param {string} module_type type of the current module e.g. requirements
 * @return {Function} Returns function that takes the global state to be updated
 */
const updateState = (module_name, module_type, module_display_name) => {
  return async (state) => {
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
          { message: `Error in ${module_type} module ${module_name}: ${state.error.message}`, },
        )
      );
    }

    const updateStateByModule = stateUpdaterToType[module_type];

    if (updateStateByModule) {
      throw new Error(`unknown module type "${module_type}"`);
    }
    
    await updateStateByModule(state, module_name, module_display_name);

    delete state[module_type];

    return state;
  };
};

module.exports = {
  updateState,
};
