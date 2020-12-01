import moment from 'moment-timezone';
import numeric from 'numeric';
import { VariableValue } from '../../../type/VariableValue';
import vm from 'vm';
import { VMParser } from '../interface/VMParser';

interface IVMParserSandbox {
  console: typeof console;
  moment: typeof moment;
  numeric: typeof numeric;
  _global: {
    parsed_variables: Record<string, VariableValue>;
  };
}

export default (
  vmParserConfiguration: VMParser,
  response: Record<string, unknown>,
): Record<string, VariableValue> => {
  try {
    const state = { json_data: response };

    const script = buildScript(vmParserConfiguration);
    const context = buildContext();

    const { sandbox, parser } = prepareParser(state, context, script);

    parser.runInContext(sandbox);

    return sandbox._global.parsed_variables;
  } catch (error) {
    throw new Error(`Error while processing custom parser: ${error.message}`);
  }
};

const buildScript = (vmParserConfiguration: VMParser) => {
  const globalFunctionsBlock = vmParserConfiguration.global_functions.map((globalFunction) => {
    return `const ${globalFunction.name} = ${globalFunction.operation};`;
  }).join('\r\n');

  return `'use strict';
    ${globalFunctionsBlock}
    const main = (${vmParserConfiguration.main.toString()})();
  `;
};

const buildContext = () => {
  const _global = {
    parsed_variables: {},
    error: '',
  };

  return { console, moment, numeric, _global };
};

const prepareParser = (state: { json_data: Record<string, unknown> }, sandbox: IVMParserSandbox, script: string) => {
  sandbox = { ...sandbox, ...state };
  const parser = new vm.Script(script);
  vm.createContext(sandbox);

  return { sandbox, parser };
};
