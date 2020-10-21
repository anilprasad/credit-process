import { ModuleType } from './enums/ModuleType';
import segmentLoader from './segmentLoader';

/**
 * Creates the iterator for the segment evaluators
 * @param {Object} result An object of created segment evaluators indexed by segment name
 * @returns {Function} Returns iterator function that takes the evaluation function that evaluates each segment and returns the valid segment.
 */
const generateSegmentIterator = (result) => {
  let valid = false;
  let index = 0;
  let keys = Object.keys(result);

  /**
   * Iterator function that looks for a segment that evaluates to a truthy value
   * @param {Function} evaluation segment evaluation function that takes key value pair (segment name and its properties) and determines the validity of the segment
   * @return {Object|Boolean} Returns the valid segment that has been found or false if none
   */
  return function* (evaluation) {
    while (index < keys.length && !valid) {
      let current = keys[index++];
      valid = evaluation(current, result[current]) ? current : false;
      yield evaluation;
    }
    let segment = valid;
    index = 0;
    valid = false;
    return segment;
  };
};

/**
 * 
 * @param {Function} segments loaded segment evaluator function 
 * @param {string} type type of the segment/module e.g. requirements
 * @returns {Function} Returns a function that takes a state and runs the segment evaluator function
 */
const createSegmentEvaluator = (segments, type, module_name = null) => {
  return (state, return_evaluator = false) => {
    try {
      let _state = Object.assign({}, state);
      let valid = segments(_state);

      if (!valid || (Array.isArray(valid) && !valid.length)) {
        return _state;
      }

      if (valid && return_evaluator === true) {
        return Array.isArray(valid)
          ? valid.map(segment => segment.evaluator)
          : valid.evaluator;
      }

      let evaluations;
      
      if (Array.isArray(valid)) {
        evaluations = valid.reduce((result, segment) => {
          if (segment && typeof segment.evaluator !== 'function') {
            throw new Error(segment.message);
          }

          result[segment.name] = Object.assign(segment.evaluator(_state), { evaluator: segment.evaluator.bind(segment), });

          return result;
        }, {});
      } else {
        evaluations = {
          [valid.name]: Object.assign(valid.evaluator(_state), { evaluator: valid.evaluator.bind(valid), }),
        };
      }

      evaluations[Symbol.iterator] = generateSegmentIterator(evaluations);

      if (_state && _state[type]) {
        _state[type] = Object.assign({}, _state[type], evaluations);
      } else {
        _state = Object.assign({}, _state, { [type]: evaluations, });
      }

      return _state;
    } catch (error) {
      return Promise.reject(
        Object.assign(
          {},
          state,
          { message: `Error while creating segment evaluator - ${type} module ${module_name || ''}: ${error.message}`, }
        )
      );
    }
  };
};

/**
 * 
 * @returns {Function} segment evaluator function that takes a state
 */
export default (moduleType: ModuleType, moduleName = null, segmentRules) =>  {
  const evaluators = segmentLoader.generateEvaluators(segmentRules);

  return createSegmentEvaluator(evaluators, moduleType, moduleName);
};
