'use strict';
const vm = require('vm');
const Conditional = require('@digifi-los/comparison').Conditional;

/**
 * Sets state inside of a "_global" property and contextifies with a compare function in its scope
 * @param {Object} state Application state data containing data from previous functions
 * @return {Object} VM contextified state object
 */
const createContext = (state, compare) => {
  const _global = { state, };
  const context = { _global, compare, };

  vm.createContext(context);

  return context;
};

/**
 * Handles coverting values to string representations consumable by the VM script
 * @param  {*} value Value to convert for the VM
 * @return {string|number}       Converted value
 */
const handleValueAssignment = (value) => {
  if (typeof value === 'string' && value.includes('_global.state')) {
    return value;
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  if (Array.isArray(value)) {
    const valuesString = value.map(val => typeof val === 'string' ? `'${val}'` : val).join(', ');

    return `[${valuesString}]`;
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
};

/**
 * Handles converting state property comparison value to vm usable value ie. wrapping string values in quotes
 * @param {*} value Any value to be converted to vm usable value
 */
const generateSegmentValue = (value) => {
  if (typeof value === 'string') {
    return `'${ value }'`;
  }

  if (value && !Array.isArray(value) && typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const valuesString = value.map(val => generateSegmentValue(val)).join(',');

    return `[${valuesString}]`;
  }

  return value;
};

/**
 * Creates a script that will be run inside of vm based on segment configuration
 * @param {Object} configuration Configuration object for segement evaluator
 * @param {Object[]} configuration.condition Array of evaluations that should be run against data
 * @param {string} configuration.condition_operations Describes if passing condition should be all-true ("AND") or one true ("OR")
 * @param {string} configuration.condition.state_property_attribute The field which should be evaluated within the state object
 * @param {string} configuration.condition.state_property_attribute_value_comparison Value which data derived from state object should be compared against
 * @param {string} configuration.condition.condition_test Description of the conditional test to be applied
 * @return {string} Returns a string representation of a script to be run in VM
 */
const createScript = (configuration) => {
  const { conditions, } = configuration;
  const conditionGroups: string[] = [];

  let string_evaluator = conditions.reduce((script, condition) => {
    let {
      variable_name,
      value_comparison,
      value_comparison_type,
      value_minimum,
      value_minimum_type,
      value_maximum,
      value_maximum_type,
      condition_test,
      rule_type,
      rule_name,
    } = condition;

    let condition1 = condition_test.toLowerCase().replace(/\s+/g, '');
    let condition2;

    value_comparison = (value_comparison && value_comparison_type === 'variable')
      ? `_global.state['${value_comparison}']`
      : value_comparison;

    value_minimum = (value_minimum && value_minimum_type === 'variable') ? `_global.state['${value_minimum}']` : value_minimum;
    value_maximum = (value_maximum && value_maximum_type === 'variable') ? `_global.state['${value_maximum}']` : value_maximum;

    script += `if(_global.state[${handleValueAssignment(variable_name)}] === undefined) {\r\n`
    script += `  throw new Error('The Variable ${variable_name} is required by a Rule but is not defined.');\r\n`;
    script += `}\r\n`;
    script += `if(/range/i.test("${condition_test}") && ${handleValueAssignment(value_minimum)} === undefined) {\r\n`
    script += `  throw new Error("The Variable ${condition.value_minimum} is required by a Rule but is not defined.");\r\n`;
    script += `}\r\n`;
    script += `if(/range/i.test("${condition_test}") && ${handleValueAssignment(value_maximum)} === undefined) {\r\n`
    script += `  throw new Error("The Variable ${condition.value_maximum} is required by a Rule but is not defined.");\r\n`;
    script += `}\r\n`;
    script += `if(!(/range/i.test("${condition_test}")) && !(/null/i.test("${condition_test}")) && ${handleValueAssignment(value_comparison)} === undefined) {\r\n`
    script += `  throw new Error("The Variable ${condition.value_comparison} is required by a Rule but is not defined.");\r\n`;
    script += `}\r\n`;

    const eval_group = /or/i.test(rule_type) ? `_global.${rule_name}` : '_global.passes';

    if (/or/i.test(rule_type)) {
      script += `_global.${rule_name} = _global.${rule_name} || [];\r\n`;

      if (conditionGroups.indexOf(rule_name) === -1) {
        conditionGroups.push(rule_name);
      }
    }

    script += `${ eval_group }.push(compare(_global.state${variable_name.indexOf('[') !== 0
      ? '.' + variable_name
      : variable_name}).${condition1}`;
    if (typeof condition2 === 'string') {
      script += `.${condition2}`;
    }

    script += `(${/range/i.test(condition_test)
      ? (handleValueAssignment(value_minimum) + ', ' + handleValueAssignment(value_maximum))
      : handleValueAssignment(value_comparison)}));\r\n`;

    return script;
  }, '"use strict";\r\n_global.passes = [];\r\n');

  if (conditionGroups.length) {
    const orEvaluations = conditionGroups.map(groupKey => `_global.${groupKey}.indexOf(true) !== -1`).join(' && ');

    string_evaluator += `_global.passes = _global.passes.indexOf(false) === -1 && (${orEvaluations});\r\n`
  } else {
    string_evaluator += '_global.passes = _global.passes.indexOf(false) === -1;\r\n';
  }

  return string_evaluator;
};

/**
 * Creates an evaluator function
 * @param {Object} configuration Configuration details for script and context of a vm that will determine segment
 * @return {Function} Segment evaluator function
 */
export default (configuration) => {
  const conditional = new Conditional({});
  const compare = conditional.compare.bind(conditional);
  const script = createScript(configuration);

  /**
   * Given state and optionally a default input function determines if state data applies to  a given segment
   * @param {Object} input Used to pass a default input this field will be used as state if state argument is not defined
   * @param {state} state State data must be defined if passing default inputs if this argument is not defined input will be considered state
   * @return {Boolean|Object} returns the segment configuration if passing and a false flag if it does not
   */
  return (input, state) => {
    try {
      const _state = state && typeof state === 'object' ? {...state} : {...input};
      const context = createContext(_state, compare);
      const evaluate = new vm.Script(script);

      evaluate.runInContext(context);

      return context._global.passes ? configuration : false;
    } catch (e) {
      return {
        message: e.message,
        error: e.error || '',
      };
    }
  };
};
