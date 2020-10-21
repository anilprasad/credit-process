import createEvaluator from './evaluators';

/**
 * Creates segement evaluators from configurations
 * @param {Object|Object[]} configurations A single configuration object or an array of configuration objects
 * @return {Object|Function} A single evaluator or an object containing evalutors indexed by name
 */
export const generateEvaluators = (configurations) => {
  if (!configurations) {
    throw new Error('No configurations available to evaluate');
  }

  if (!Array.isArray(configurations)) {
    return createEvaluator(configurations);
  }

  return configurations.reduce((result, configuration) => {
    result[configuration.name] = createEvaluator(configuration);

    return result;
  }, {});
};

/**
 * Given a set of evaluations returns a function that will return segment information once it finds a segment that passes given state data
 * @param {Object} segmentEvaluations An object indexed by segment name that contains evaluator functions
 * @param {boolean} multi If true evaluate will return array of valid segments
 * @return {Function} Segment evaluator
 */
export const evaluate = (segment) => {
  /**
   * Given state and options default data function will return segment information once a passing condition is returned
   * @param {Object} input Optional default data this argument will be used as state if state argument is not passed
   * @param {Object} state State data this argument only needs to be passed if not passing default data as the input argument
   * @return {Object} Segment data for a passing segment
   */
  return (input, state) => {
    const _state = (state && typeof state === 'object') ? {...state} : {...input};

    return segment(input, _state);
  };
};
