import * as stateHelper from '../../src/helper/stateHelper';
import calculationsStateTransformer from '../../src/module/calculations/calculationsStateTransformer';
import { CommonModule } from '../../src/interface/Module';
import { CreditProcessState } from '../../src/interface/CreditProcessState';
import { ModuleType } from '../../src/enum/ModuleType';
import { StateSegment } from '../../src/interface/StateSegment';

describe('stateHelper', () => {
  describe('updateStateWithModuleResults', () => {
    it('runs module state transformer', () => {
      const transformMockFn = calculationsStateTransformer.transform = jest.fn();

      const module = {
        type: ModuleType.Calculations,
      } as unknown as CommonModule;

      const state = {} as unknown as CreditProcessState;
      const segments: StateSegment[] = [];
      
      stateHelper.updateStateWithModuleResults(module, segments, state);

      expect(transformMockFn).toBeCalledWith(module, segments, state);
    });
  });

  describe('appendError', () => {
    it('appends error and/or decline_resaons to state', () => {
      const state = {} as unknown as CreditProcessState;
      
      const resultState = stateHelper.appendError(
        state,
        { message: 'error', decline_reasons: ['decline reason']},
      );

      expect(resultState).toEqual({
        error: { message: 'error' },
        decline_reasons: ['decline reason'],
      });
    });
  });
});
