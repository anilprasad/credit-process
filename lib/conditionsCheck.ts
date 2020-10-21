"use strict";
const _global = {};
_global.passes = [];


const { conditions, } = configuration;
  const conditionGroups: string[] = [];

  conditions.forEach((condition) => {
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
      ? _global.state[value_comparison]
      : value_comparison;

    value_minimum = (value_minimum && value_minimum_type === 'variable') ? _global.state[value_minimum] : value_minimum;
    value_maximum = (value_maximum && value_maximum_type === 'variable') ? _global.state[value_maximum] : value_maximum;

    if (_global.state[`${handleValueAssignment(variable_name)}`] === undefined) {
      throw new Error(`The Variable ${variable_name} is required by a Rule but is not defined.`);
    }
    if(/range/i.test(condition_test) && handleValueAssignment(value_minimum) === undefined) {
      throw new Error(`The Variable ${condition.value_minimum} is required by a Rule but is not defined.`);
    }
    if(/range/i.test(condition_test) && handleValueAssignment(value_maximum) === undefined) {
      throw new Error(`The Variable ${condition.value_maximum} is required by a Rule but is not defined.`);
    }
    if(!(/range/i.test(condition_test)) && !(/null/i.test(condition_test)) && handleValueAssignment(value_comparison) === undefined) {
      throw new Error(`The Variable ${condition.value_comparison} is required by a Rule but is not defined.`);
    }

    


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
  }, '');

  if (conditionGroups.length) {
    const orEvaluations = conditionGroups.map(groupKey => `_global.${groupKey}.indexOf(true) !== -1`).join(' && ');

    string_evaluator += `_global.passes = _global.passes.indexOf(false) === -1 && (${orEvaluations});\r\n`
  } else {
    string_evaluator += '_global.passes = _global.passes.indexOf(false) === -1;\r\n';
  }

  return string_evaluator;

  

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