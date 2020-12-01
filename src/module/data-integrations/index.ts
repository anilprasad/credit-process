import * as request from './helper/request';
import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { BasicStrategySegment } from '../abstract/interface/BasicStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { customResponseParser } from './helper/response';
import { DataIntegration } from './interface/DataIntegration';
import { DataIntegrationStateSegment } from './interface/DataIntegrationStateSegment';
import { DataIntegrationStrategySegment } from './interface/DataIntegrationStrategySegment';
import https from 'https';
import { IFetchOptions } from './interface/IFetchOptions';
import { ModuleType } from '../../enum/ModuleType';
import { SegmentInputVariable } from '../../interface/variable/SegmentInputVariable';
import { SegmentOutputVariable } from '../../interface/variable/SegmentOutputVariable';
import { StrategyVariable } from '../../interface/variable/StrategyVariable';
import { VariableValue } from '../../type/VariableValue';

export interface IDataIntegrationsModuleCompilationOptions
  extends IBasicModuleCompilationOptions<DataIntegrationStrategySegment> {
  module_type: ModuleType.DataIntegration;
  integration: DataIntegration;
}

export default class DataIntegrations
  extends AbstractModule<DataIntegrationStrategySegment, DataIntegrationStateSegment> {
  private dataIntegration: DataIntegration;
  private inputVariables: StrategyVariable[];
  private outputVariables: StrategyVariable[];

  constructor(options: IDataIntegrationsModuleCompilationOptions) {
    super(options);

    this.dataIntegration = options.integration as DataIntegration;
    this.inputVariables = options.input_variables;
    this.outputVariables = options.output_variables;
  }

  protected evaluateSegment = async (
    segment: BasicStrategySegment,
    state: CreditProcessState
  ): Promise<DataIntegrationStateSegment> => {
    const { status, response, result } = await this.getAPIData(state, segment);

    return {
      type: ModuleType.DataIntegration,
      passed: true,
      output: result || {},
      raw: response && response.toString() || '',
      name: this.moduleName || '',
      segment: segment.name,
      status,
      provider: this.dataIntegration.data_provider,
      rules: [],
    };
  }

  private getAPIData = async (state: CreditProcessState, segment: BasicStrategySegment) => {
    try {
      const dataIntegration = {
        ...this.dataIntegration.credentials,
        ...this.dataIntegration,
      };

      const systemInputVariablesMap = new Map(
        this.inputVariables.map((inputVariable) => [inputVariable._id.toString(), inputVariable])
      );

      const systemOutputVariablesMap = new Map(
        this.outputVariables.map((outputVariable) => [outputVariable._id.toString(), outputVariable])
      );

      const newSegment: DataIntegrationStrategySegment = JSON.parse(JSON.stringify(segment));

      const dataIntegrationInputsMap = new Map(
        dataIntegration.inputs.map((input) => [input.input_name, input])
      );

      const dataIntegrationOutputsMap = new Map(
        dataIntegration.outputs.map((output) => [output.api_name, output])
      );

      // generate dataintegration inputs with proper traversal_path
      dataIntegration.inputs = newSegment.inputs.reduce((inputs, input) => {
        const assignedInput = { ...input };
        if (input && input.input_type === 'variable') {
          assignedInput.assigned_variable = systemInputVariablesMap.get(input.input_variable.toString());
        } else {
          assignedInput.assigned_value = input.input_variable as VariableValue;
        }

        const diInput = dataIntegrationInputsMap.get(input.input_name);
        assignedInput.traversal_path = input.traversal_path || (diInput && diInput.traversal_path) || '';

        inputs.push(assignedInput);

        return inputs;
      }, [] as SegmentInputVariable[]);

      // generate dataintegration outputs with proper traversalPath and arrayConfigs
      dataIntegration.outputs = newSegment.outputs.reduce((outputs, output) => {
        const assignedOutput = {...output};
        assignedOutput.assigned_variable = systemOutputVariablesMap.get(output.output_variable.toString());

        const diOutput = dataIntegrationOutputsMap.get(output.api_name);
        assignedOutput.traversalPath = output.traversalPath || (diOutput && diOutput.traversalPath) || '';
        assignedOutput.arrayConfigs = output.arrayConfigs || (diOutput && diOutput.arrayConfigs) || [];

        outputs.push(assignedOutput);

        return outputs;
      }, [] as SegmentOutputVariable[]);

      const fetchOptions = await request.parser(state, dataIntegration);
      const { response, status } = await this.fetch(fetchOptions);
      const result = await customResponseParser(response, dataIntegration);

      return {
        result,
        response,
        status,
      };
    } catch (error) {
      throw new Error(`Cannot get valid response from '${this.dataIntegration.name}' data integration:
      ${error.message}`);
    }
  }

  private fetch = async (options: IFetchOptions): Promise<{ response: string, status: string }> => {
    const { requestOptions, body, timeout, responseOptions = {} } = options;
    requestOptions.method = requestOptions.method ? requestOptions.method.toUpperCase() : 'GET';
    const STATUS_REGEXP = /^(2|3)\d{2}$/;

    let requestTimeout: NodeJS.Timeout;

    const data: Buffer[] = [];

    return new Promise((resolve, reject) => {
      const request = https.request(requestOptions, response => {
        const status = `${response.statusCode}`;

        if (!STATUS_REGEXP.test(status)
          || (!responseOptions.skip_status_message_check
            && typeof response.statusMessage === 'string'
            && response.statusMessage.toUpperCase() !== 'OK'
          )
        ) {
          if (requestTimeout) {
            clearTimeout(requestTimeout);
          }

          return reject(Object.assign(new Error(response.statusMessage), { status }));
        }

        response.on('data', chunk => data.push(chunk));
        response.on('error', error => {
          if (requestTimeout) {
            clearTimeout(requestTimeout);
          }

          reject(error);
        });
        response.on('end', () => {
          if (requestTimeout) {
            clearTimeout(requestTimeout);
          }

          resolve({ response: Buffer.concat(data).toString(), status });
        });
      });

      request.on('error', reject);

      if (requestOptions.method === 'POST') {
        request.write(body);
      }

      request.end();

      if (typeof timeout === 'number') {
        requestTimeout = setTimeout(() => {
          clearTimeout(requestTimeout);

          request.abort();

          reject(new Error(`Request to ${requestOptions.hostname}${requestOptions.path} was aborted`));
        }, timeout);
      }
    });
  }
}
