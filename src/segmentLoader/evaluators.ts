import * as vm from 'vm';
import CreditProcessState from 'type/CreditProcessState';
import { StrategySegment } from 'type/StrategySegment';
import Conditional from 'conditional/Conditional';
import Rule from 'type/Rule';
import { VariableInputType } from 'enum/VariableInputType';

/**
 * Sets state inside of a "_global" property and contextifies with a compare function in its scope
 * @param {Object} state Application state data containing data from previous functions
 * @return {Object} VM contextified state object
 */
const createContext = (state: CreditProcessState, compare: (value: any) => Conditional) => {
  const _global: { state: CreditProcessState, passes?: boolean} = { state, };
  const context = { _global, compare, };

  vm.createContext(context);

  return context;
};

/**
 * Handles coverting values to string representations consumable by the VM script
 * @param  {*} value Value to convert for the VM
 * @return {string|number}       Converted value
 */
const handleValueAssignment = (value: any) => {
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
const generateSegmentValue = (value: any): string => {
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

const createScript = (segment: StrategySegment) => {
  const { conditions, } = segment;
  const conditionGroups: string[] = [];

  let string_evaluator = conditions.reduce((script: string, condition: Rule) => {
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

    value_comparison = (value_comparison && value_comparison_type === VariableInputType.Variable)
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

    const variableIndex = variable_name.indexOf('[') !== 0
      ? '.' + variable_name
      : variable_name;
    script += `${ eval_group }.push(compare(_global.state${variableIndex}).${condition1}`;

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

export default (segment: StrategySegment) => {
  const compare = (valueToCompareTo: any) => new Conditional(valueToCompareTo);
  const script = createScript(segment);

  return async (state: CreditProcessState) => {
    try {
      const stateToProcess = {...state};
      const context = createContext(stateToProcess, compare);
      const evaluate = new vm.Script(script);

      evaluate.runInContext(context);

      return context._global.passes ? segment : false;
    } catch (e) {
      return {
        message: e.message,
        error: e.error || '',
      };
    }
  };
};
