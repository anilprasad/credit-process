import * as coerceHelper from '../../src/helper/coerceHelper';
import { VariableDataType } from '../../src/enum/VariableDataType';

describe('coerceHelper', () => {
  describe('coerceValue function', () => {
    it('returns number for number type', () => {
      expect(coerceHelper.coerceValue('0', VariableDataType.Number)).toBe(0);
    });

    it('returns string for string type', () => {
      expect(coerceHelper.coerceValue(true, VariableDataType.String)).toBe('true');
    });

    it('returns date for date type', () => {
      expect(coerceHelper.coerceValue('2000-06-11', VariableDataType.Date)).toBe('06/11/2000');
    });

    it('returns boolean for boolean type', () => {
      expect(coerceHelper.coerceValue('true', VariableDataType.Boolean)).toBe(true);
    });

    it('returns passed value for evaluation type', () => {
      expect(coerceHelper.coerceValue('() => true', VariableDataType.Evaluation)).toBe('() => true');
    });
  });

  describe('coerceNumberValue function', () => {
    it('returns number for string number value', () => {
      expect(coerceHelper.coerceNumberValue('0')).toBe(0);
    });

    it('returns number for number value', () => {
      expect(coerceHelper.coerceNumberValue(1)).toBe(1);
    });

    it('returns null if it fails to parse it', () => {
      expect(coerceHelper.coerceNumberValue('some_string')).toBe(null);
    });

    it('returns 0 for null value', () => {
      expect(coerceHelper.coerceNumberValue(null)).toBe(0);
    });

    it('returns null for undefined value', () => {
      expect(coerceHelper.coerceNumberValue(undefined)).toBe(null);
    });

    it('returns 0 for false value', () => {
      expect(coerceHelper.coerceNumberValue(false)).toBe(0);
    });

    it('returns 1 for true value', () => {
      expect(coerceHelper.coerceNumberValue(true)).toBe(1);
    });
  });

  describe('coerceDateValue function', () => {
    it('returns date in correct format if it can parse it', () => {
      expect(coerceHelper.coerceDateValue('2000-06-11')).toBe('06/11/2000');
    });

    it('returns passed value if it fails to parse it', () => {
      expect(coerceHelper.coerceDateValue('2020-30-17')).toBe('2020-30-17');
    });
  });

  describe('coerceBooleanValue function', () => {
    it('returns true for boolean true value', () => {
      expect(coerceHelper.coerceBooleanValue(true)).toBe(true);
    });

    it('returns false for boolean false value', () => {
      expect(coerceHelper.coerceBooleanValue(false)).toBe(false);
    });

    it('returns true for string \'true\' value', () => {
      expect(coerceHelper.coerceBooleanValue('true')).toBe(true);
    });

    it('returns false for string \'false\' value', () => {
      expect(coerceHelper.coerceBooleanValue('false')).toBe(false);
    });

    it('returns true for string \'True\' value', () => {
      expect(coerceHelper.coerceBooleanValue('True')).toBe(true);
    });

    it('returns false for string \'False\' value', () => {
      expect(coerceHelper.coerceBooleanValue('False')).toBe(false);
    });

    it('returns true for string \'TRUE\' value', () => {
      expect(coerceHelper.coerceBooleanValue('TRUE')).toBe(true);
    });

    it('returns false for string \'FALSE\' value', () => {
      expect(coerceHelper.coerceBooleanValue('FALSE')).toBe(false);
    });

    it('returns false for null value', () => {
      expect(coerceHelper.coerceBooleanValue(null)).toBe(false);
    });

    it('returns false for undefined value', () => {
      expect(coerceHelper.coerceBooleanValue(undefined)).toBe(false);
    });

    it('returns null for empty string value', () => {
      expect(coerceHelper.coerceBooleanValue('')).toBe(null);
    });

    it('returns null if it fails to parse string value', () => {
      expect(coerceHelper.coerceBooleanValue('any')).toBe(null);
    });

    it('returns false for 0 value', () => {
      expect(coerceHelper.coerceBooleanValue(0)).toBe(false);
    });

    it('returns true for 1 value', () => {
      expect(coerceHelper.coerceBooleanValue(0)).toBe(false);
    });
  });
});
