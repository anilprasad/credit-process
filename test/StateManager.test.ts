import calculationsStateTransformer from '../src/module/calculations/calculationsStateTransformer';
import { CommonModule } from '../src/interface/Module';
import { CreditProcessState } from '../src/interface/CreditProcessState';
import { ModuleType } from '../src/enum/ModuleType';
import StateManager from '../src/StateManager';
import { StateSegment } from '../src/interface/StateSegment';

describe('State Manager', () => {
  describe('updateStateWithModuleResults', () => {
    it('runs module state transformer', () => {
      const transformMockFn = calculationsStateTransformer.transform = jest.fn();

      const module = {
        type: ModuleType.Calculations,
      } as unknown as CommonModule;

      const state = {} as unknown as CreditProcessState;
      const segments: StateSegment[] = [];
      
      StateManager.updateStateWithModuleResults(module, segments, state);

      expect(transformMockFn).toBeCalledWith(module, segments, state);
    });
  });

  describe('appendError', () => {
    it('appends error and/or decline_resaons to state', () => {
      const state = {} as unknown as CreditProcessState;
      
      const resultState = StateManager.appendError(
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
