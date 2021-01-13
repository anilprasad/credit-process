import * as compareHelper from '../../src/helper/compareHelper';
import { CreditProcessState } from '../../src/interface/CreditProcessState';
import { Rule } from '../../src/interface/Rule';
import { VariableInputType } from '../../src/enum/VariableInputType';

describe('compareHelper', () => {
  describe('runComparison function', () => {
    it('returns true for equal variables compare using \'EQUAL\'', () => {
      const rule = {
        value_comparison: 5,
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'EQUAL',
      } as Rule;

      const state = {
        some_var_name: 5,
      } as unknown as CreditProcessState;

      expect(compareHelper.runComparison(rule, state)).toBeTruthy();
    });

    it('returns false for unequal variables compare using \'EQUAL\'', () => {
      const rule = {
        value_comparison: 5,
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'EQUAL',
      } as Rule;

      const state = {
        some_var_name: 4,
      } as unknown as CreditProcessState;

      expect(compareHelper.runComparison(rule, state)).toBeFalsy();
    });

    it('returns false for equal variables compare using \'NOT EQUAL\'', () => {
      const rule = {
        value_comparison: 5,
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'NOT EQUAL',
      } as Rule;

      const state = {
        some_var_name: 5,
      } as unknown as CreditProcessState;

      expect(compareHelper.runComparison(rule, state)).toBeFalsy();
    });

    it('returns true for unequal variables compare using \'NOT EQUAL\'', () => {
      const rule = {
        value_comparison: 5,
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'NOT EQUAL',
      } as Rule;

      const state = {
        some_var_name: 4,
      } as unknown as CreditProcessState;

      expect(compareHelper.runComparison(rule, state)).toBeTruthy();
    });

    it('returns true for find \'IN\' if value exists in array', () => {
      const rule = {
        value_comparison: [1, 5, 3],
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'IN',
      } as unknown as Rule;

      const state = {
        some_var_name: 5,
      } as unknown as CreditProcessState;

      expect(compareHelper.runComparison(rule, state)).toBeTruthy();
    });

    it('throws if using non existent operand', () => {
      const rule = {
        value_comparison: 5,
        value_comparison_type: VariableInputType.Value,
        variable_name: 'some_var_name',
        condition_test: 'IS COOLER',
      } as unknown as Rule;

      const state = {
        some_var_name: 4,
      } as unknown as CreditProcessState;

      expect(() => compareHelper.runComparison(rule, state)).toThrow();
    });
  });
});
