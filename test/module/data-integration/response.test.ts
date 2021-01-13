import { DataIntegration } from '../../../src/module/data-integrations/interface/DataIntegration';
import { getOutputs } from '../../../src/module/data-integrations/helper/response';

describe('Data Integration Response functions', () => {
  const dataIntegration = {
    outputs: [
      {
        data_type: 'String',
        api_name: 'a',
        description: 'description',
        assigned_variable: {
          title: 'thisisastring',
        },
        traversalPath: 'wrapper.a',
      }, {
        data_type: 'Number',
        api_name: '123',
        description: 'description',
        traversalPath: 'a',
      }, {
        data_type: 'Boolean',
        api_name: 'true',
        description: 'description',
        assigned_variable: {
          title: 'thisisnull',
        },
        traversalPath: 'wrapper.b',
      }, {
        data_type: 'Boolean',
        api_name: 'bool',
        description: 'description',
        assigned_variable: {
          title: 'thisisabool',
        },
        traversalPath: 'wrapper.c',
      },
    ],
  } as unknown as DataIntegration;

  const apiResponse = {
    wrapper: {
      a: 'somestring',
      b: 'dont show up',
      c: true,
    },
  };

  describe('getOutputs', () => {
    it('maps dataintegration outputs to state correctly', () => {
      const outputs = getOutputs(apiResponse, dataIntegration);
      const result = {
        thisisastring: 'somestring',
        thisisnull: null,
        thisisabool: true,
      };

      expect(outputs).toEqual(result);
    });
  });
});
