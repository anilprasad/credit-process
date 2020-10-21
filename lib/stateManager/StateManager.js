'use strict';

const moduleStateTransformerToType = {
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

    const moduleStateTransformer = moduleStateTransformerToType[module_type];

    if (moduleStateTransformer) {
      throw new Error(`unknown module type "${module_type}"`);
    }
    
    await moduleStateTransformer(state, module_name, module_display_name);

    delete state[module_type];

    return state;
  };
};

module.exports = {
  updateState,
};
