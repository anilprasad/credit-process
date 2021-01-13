import * as coerceHelper from '../../../helper/coerceHelper';
import { DataIntegration } from '../interface/DataIntegration';
import { SegmentOutputVariable } from '../../../interface/variable/SegmentOutputVariable';
import { VariableValue } from '../../../type/VariableValue';
import vmParser from './vmParser';
import xml2js from 'xml2js';

export const customResponseParser = async (
  response: string,
  dataIntegration: DataIntegration,
): Promise<Record<string, VariableValue>> => {
  try {
    const parsedResponse = await parseRawData(response, dataIntegration);
    const apiResponse = await traverseResponseRawData(parsedResponse, dataIntegration);

    return getOutputs(apiResponse, dataIntegration);
  } catch (error) {
    throw new Error(`Cannot parse response from '${dataIntegration.name}' data integration: ${error.message}`);
  }
};

const parseRawData = async (rawData: string, dataIntegration: DataIntegration) => {
  if (typeof rawData !== 'string') {
    return rawData;
  }

  try {
    return JSON.parse(rawData);
  } catch (error) {
    const xmlParserConfigs = dataIntegration && dataIntegration.xml_parser_configs || {
      explicitArray: false,
      attrkey: '@',
    };

    const customXMLParser = new xml2js.Parser(xmlParserConfigs);

    return customXMLParser.parseStringPromise(rawData);
  }
};

const traverseResponseRawData = async (parsedResponse: Record<string, unknown>, dataIntegration: DataIntegration) => {
  if (!dataIntegration || !parsedResponse) {
    return parsedResponse;
  }

  const { raw_data_parse, raw_data_traversal_path } = dataIntegration;

  if (!raw_data_parse || !raw_data_traversal_path) {
    return parsedResponse;
  }

  const traversalPath = raw_data_traversal_path.split('.');

  const traversedResponse = { ...parsedResponse };

  let prevPointer: Record<string, unknown> = traversedResponse;

  for (let i = 0; i < traversalPath.length; i++) {
    const pathVal = traversalPath[i];
    const nextVal = prevPointer[pathVal] as Record<string, unknown> | string;

    if (nextVal === undefined) {
      break;
    }

    if (i === traversalPath.length - 1) {
      prevPointer[pathVal] = await parseRawData(nextVal as string, dataIntegration);
      break;
    }

    prevPointer = nextVal as Record<string, unknown>;
  }

  return traversedResponse;
};

export const getOutputs = (apiResponse: Record<string, unknown>, dataIntegration: DataIntegration) => {
  if (dataIntegration && dataIntegration.vm_parser) {
    apiResponse['VMParserResult'] = vmParser(dataIntegration.vm_parser, apiResponse);
  }

  return dataIntegration.outputs.reduce((outputs, output) => {
    if (!output.assigned_variable || !output.traversalPath) {
      return outputs;
    }

    const variable = output.assigned_variable.title;
    const value = customTraverse(apiResponse, output.traversalPath, output.arrayConfigs);

    outputs[variable] = value !== null && value !== undefined
      ? coerceHelper.coerceValue(value, output.data_type)
      : null;

    return outputs;
  }, {} as Record<string, VariableValue>);
};

const customTraverse = (
  response: Record<string, unknown>,
  traversePath: string,
  arrayConfigs: SegmentOutputVariable['arrayConfigs'] = [],
) => {
  return traversePath.split('.').reduce((acc, traversePathElement) => {
    if (Array.isArray(acc) && arrayConfigs.length) {
      if (arrayConfigs[0][traversePathElement] !== undefined) {
        const foundObj = acc.find((obj) => {
          return obj[traversePathElement] === arrayConfigs[0][traversePathElement];
        });

        if (foundObj) {
          arrayConfigs.shift();

          return foundObj;
        }
      } else if (!isNaN(Number(traversePathElement)) && Number(traversePathElement) < acc.length) {
        return acc[traversePathElement];
      }
    }

    if (acc && typeof acc === 'object' && acc[traversePathElement] !== undefined) {
      return acc[traversePathElement];
    }

    return null;
  }, response);
};
