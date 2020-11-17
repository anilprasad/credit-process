import {
  getInputs,
  getBodyTemplate,
  generateDynamicQueryString,
  generateDynamicPath,
  bufferToStream,
} from '../../../src/module/data-integrations/helper/request';

import Duplex from 'stream';
import { DataIntegration } from '../../../src/module/data-integrations/interface/DataIntegration';
import { CreditProcessState } from '../../../src/interface/CreditProcessState';

describe('Data Integration Request functions', () => {
  describe('getInputs', () => {
    it('maps dataintegration inputs to state correctly', async () => {
      const state = {
        system_variable_1: 'xyz',
        system_variable_2: 'abc',
        system_variable_3: 123,
        system_variable_4: 456,
        input: true,
      } as unknown as CreditProcessState;

      const dataIntegration = {
        inputs: [
          {
            input_name: 'test1',
            input_type: 'value',
            assigned_value: 2,
          }, {
            input_name: 'test2',
            input_type: 'variable',
            assigned_variable: {
              title: 'system_variable_2',
            },
          }, {
            input_name: 'thirdTest',
            input_type: 'variable',
          }, {
            input_name: 'fourthTest',
            input_type: 'value',
          },
        ],
      } as unknown as DataIntegration;

      const inputs = await getInputs(state, dataIntegration);

      const result = {
        test1: 2,
        test2: 'abc',
        thirdTest: undefined,
        fourthTest: undefined,
      };

      expect(inputs).toEqual(result);
    });
  });

  describe('getBodyTemplate', () => {
    const dataIntegration = {
      active_default_configuration: { active: true },
      default_configuration: { active: false },
    } as unknown as DataIntegration;

    it('returns active_default_configuration if strategy is in active status', () => {
      const bodyTemplate = getBodyTemplate(dataIntegration, 'active');

      expect(bodyTemplate).toEqual(dataIntegration.active_default_configuration);
    });

    it('returns default_configuration if strategy is in testing status', () => {
      const bodyTemplate = getBodyTemplate(dataIntegration, 'testing');

      expect(bodyTemplate).toEqual(dataIntegration.default_configuration);
    });

    it('returns empty object when there are no configurations in dataintegration', () => {
      const bodyTemplate = getBodyTemplate({} as DataIntegration, 'testing');

      expect(bodyTemplate).toEqual({});
    });
  });

  describe('generateDynamicQueryString', () => {
    it('formats custom query using inputs', () => {
      const query = generateDynamicQueryString({name: 'Replace'}, {name: 'Test'});

      expect(query).toEqual('name=Replace');
    });

    it('uses default query param value if there is no input for that param', () => {
      const query = generateDynamicQueryString({}, {name: 'Test'});

      expect(query).toEqual('name=Test');
    });

    it('urlencodes inputs', () => {
      const query = generateDynamicQueryString({}, {name: 'Test Name'});

      expect(query).toEqual('name=Test%20Name');
    });

    it('skips null, empty string, undefined inputs without default query param value', () => {
      const query = generateDynamicQueryString(
        {},
        { name: '', surname: undefined, address: null, test: false, count: 0 },
      );

      expect(query).toEqual('test=false&count=0');
    });
  });

  describe('generateDynamicPath', () => {
    it('replaces templates in path', () => {
      const path = 'www.exampleurl.com/:id/:date';
      const inputs = {
        id: 123,
        date: '2019',
      };

      const newURL = generateDynamicPath(path, inputs);
      const result = 'www.exampleurl.com/123/2019';

      expect(newURL).toEqual(result);
    });

    it('not replaces templates if there is no such input', () => {
      const path = 'www.exampleurl.com/:id/:date';
      const inputs = {};

      const newURL = generateDynamicPath(path, inputs);

      expect(newURL).toEqual(path);
    });
  });

  describe('bufferToStream', () => {
    it('returns a stream', () => {
      const stream = bufferToStream(Buffer.from(['test']));

      expect(stream instanceof Duplex).toBeTruthy();
    });
  });
});
