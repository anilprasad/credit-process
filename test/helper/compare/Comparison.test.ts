import { Comparison } from '../../../src/helper/compare/Comparison';

describe('Comparison Class', () => {
  describe('gt (greater than) function', () => {
    it('should return true if the comparison value is greater than the argument', () => {
      expect(Comparison.gt(10, 5)).toBeTruthy();
    });

    it('should return false if the comparison value is smaller than the argument', () => {
      expect(Comparison.gt(10, 20)).toBeFalsy();
    });

    it('should return false if the values are equal', () => {
      expect(Comparison.gt(10, 10)).toBeFalsy();
    });

    it('should handle date comparisons', () => {
      expect(Comparison.gt(new Date('2018-06-11'), '2000-06-11')).toBeTruthy();
      expect(Comparison.gt(new Date('2000-06-11'), '2018-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(Comparison.gt(null, 5)).toBeFalsy();
      expect(Comparison.gt(5, null)).toBeFalsy();
      expect(Comparison.gt(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(Comparison.gt(undefined, 10)).toBeFalsy();
      expect(Comparison.gt(5, undefined)).toBeFalsy();
      expect(Comparison.gt(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(Comparison.gt(Infinity, 10)).toBeTruthy();
      expect(Comparison.gt(Infinity, Infinity)).toBeFalsy();
    });

    it('should return false for values that are comparing against negative infinity', () => {
      expect(Comparison.gt(-Infinity, -5)).toBeFalsy();
      expect(Comparison.gt(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('lt (less than) function', () => {
    it('should return true if the comparison value is less than the argument', () => {
      expect(Comparison.lt(5,10)).toBeTruthy();
    });

    it('should return false if the comparison value is greater than the argument', () => {
      expect(Comparison.lt(20, 10)).toBeFalsy();
    });

    it('should return false if the values are equal', () => {
      expect(Comparison.lt(10, 10)).toBeFalsy();
    });

    it('should handle date comparisons', () => {
      expect(Comparison.lt(new Date('2000-06-11'), '2018-06-11')).toBeTruthy();
      expect(Comparison.lt(new Date('2018-06-11'), '2000-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(Comparison.lt(null, 5)).toBeFalsy();
      expect(Comparison.lt(5, null)).toBeFalsy();
      expect(Comparison.lt(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(Comparison.lt(undefined, 10)).toBeFalsy();
      expect(Comparison.lt(5, undefined)).toBeFalsy();
      expect(Comparison.lt(undefined, undefined)).toBeFalsy();
    });

    it('should return true for values that are comparing against positive infinity', () => {
      expect(Comparison.lt(Infinity, 10)).toBeFalsy();
      expect(Comparison.lt(Infinity, Infinity)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(Comparison.lt(-Infinity, -5)).toBeTruthy();
      expect(Comparison.lt(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('lte (less than or equal) function', () => {
    it('should return true if the comparison value is less than the argument', () => {
      expect(Comparison.lte(5, 10)).toBeTruthy();
    });

    it('should return false if the comparison value is greater than the argument', () => {
      expect(Comparison.lte(20, 10)).toBeFalsy();
    });

    it('should return true if the values are equal', () => {
      expect(Comparison.lte(10, 10)).toBeTruthy();
    });

    it('should handle date comparisons', () => {
      expect(Comparison.lte(new Date('2000-06-11'), '2018-06-11')).toBeTruthy();
      expect(Comparison.lte(new Date('2018-06-11'), '2000-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(Comparison.lte(null, 5)).toBeFalsy();
      expect(Comparison.lte(5, null)).toBeFalsy();
      expect(Comparison.lte(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(Comparison.lte(undefined, 10)).toBeFalsy();
      expect(Comparison.lte(5, undefined)).toBeFalsy();
      expect(Comparison.lte(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(Comparison.lte(Infinity, 10)).toBeFalsy();
      expect(Comparison.lte(Infinity, Infinity)).toBeTruthy();
    });

    it('should return false for values that are comparing against negative infinity', () => {
      expect(Comparison.lte(-Infinity, -5)).toBeTruthy();
      expect(Comparison.lte(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('gte (greater than or equal) function', () => {
    it('should return true if the comparison value is greater than the argument', () => {
      expect(Comparison.gte(10, 5)).toBeTruthy();
    });

    it('should return false if the comparison value is smaller than the argument', () => {
      expect(Comparison.gte(10, 20)).toBeFalsy();
    });

    it('should return true if the values are equal', () => {
      expect(Comparison.gte(10, 10)).toBeTruthy();
    });

    it('should handle date comparisons', () => {
      expect(Comparison.gte(new Date('2018-06-11'), '2000-06-11')).toBeTruthy();
      expect(Comparison.gte(new Date('2000-06-11'), '2018-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(Comparison.gte(null, 5)).toBeFalsy();
      expect(Comparison.gte(5, null)).toBeFalsy();
      expect(Comparison.gte(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(Comparison.gte(undefined, 10)).toBeFalsy();
      expect(Comparison.gte(5, undefined)).toBeFalsy();
      expect(Comparison.gte(undefined, undefined)).toBeFalsy();
    });

    it('should return true for values that are comparing against positive infinity', () => {
      expect(Comparison.gte(Infinity, 10)).toBeTruthy();
      expect(Comparison.gte(Infinity, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(Comparison.gte(-Infinity, -5)).toBeFalsy();
      expect(Comparison.gte(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('range function', () => {
    it('should return true if the argument is within the range', () => {
      expect(Comparison.range(10, 5, 15)).toBeTruthy();
    });

    it('should return false if argument does not fall in range', () => {
      expect(Comparison.range(20, 5, 15)).toBeFalsy();
    });

    it('should return true if the value is equal to any of the bounds', () => {
      expect(Comparison.range(5, 5, 10)).toBeTruthy();
      expect(Comparison.range(10, 5, 10)).toBeTruthy();
    });

    it('should handle date comparisons', () => {
      expect(Comparison.range(new Date('2018-06-11'), '2016-06-11', '2020-06-11')).toBeTruthy();
      expect(Comparison.range(new Date('2000-06-11'), '2016-06-11', '2020-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(Comparison.range(null, 5, 10)).toBeFalsy();
      expect(Comparison.range(5, null, 10)).toBeFalsy();
      expect(Comparison.range(null, null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(Comparison.range(undefined, 5, 10)).toBeFalsy();
      expect(Comparison.range(5, undefined, 10)).toBeFalsy();
      expect(Comparison.range(undefined, undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against upper limit of positive infinity', () => {
      expect(Comparison.range(Infinity, 5, 10)).toBeFalsy();
      expect(Comparison.range(Infinity, Infinity, Infinity)).toBeTruthy();
      expect(Comparison.range(Infinity, 0, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against lower limit of negative infinity', () => {
      expect(Comparison.range(-Infinity, -5, -10)).toBeFalsy();
      expect(Comparison.range(-Infinity, -Infinity, -Infinity)).toBeTruthy();
      expect(Comparison.range(-Infinity, -Infinity, 0)).toBeTruthy();
    });
  });
  
  describe('equal function', () => {
    it('should handle numeric values', () => {
      expect(Comparison.equal(10, 10)).toBeTruthy();
      expect(Comparison.equal(10, 9.99)).toBeFalsy();
      expect(Comparison.equal(10, 11)).toBeFalsy();
    });

    it('should handle string values', () => {
      expect(Comparison.equal('john', 'john')).toBeTruthy();
      expect(Comparison.equal('john', 'johnny')).toBeFalsy();
    });

    it('should handle boolean values', () => {
      expect(Comparison.equal(true, true)).toBeTruthy();
      expect(Comparison.equal(true, false)).toBeFalsy();
      expect(Comparison.equal(false, false)).toBeTruthy();
      expect(Comparison.equal(true, 1)).toBeFalsy();
    });

    it('should handle date values', () => {
      expect(Comparison.equal('2018-06-11', '2018-06-11')).toBeTruthy();
      expect(Comparison.equal('2018-06-11', '2018-06-12')).toBeFalsy();
    });

    it('should return false answer for values that are undefined', () => {
      expect(Comparison.equal(undefined, 10)).toBeFalsy();
      expect(Comparison.equal(5, undefined)).toBeFalsy();
      expect(Comparison.equal(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(Comparison.equal(Infinity, 10)).toBeFalsy();
      expect(Comparison.equal(Infinity, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(Comparison.equal(-Infinity, -5)).toBeFalsy();
      expect(Comparison.equal(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('notEqual function', () => {
    it('should handle numeric values', () => {
      expect(Comparison.notEqual(10, 10)).toBeFalsy();
      expect(Comparison.notEqual(10, 9.99)).toBeTruthy();
      expect(Comparison.notEqual(10, 11)).toBeTruthy();
    });

    it('should handle string values', () => {
      expect(Comparison.notEqual('john', 'john')).toBeFalsy();
      expect(Comparison.notEqual('john', 'johnny')).toBeTruthy();
    });

    it('should handle boolean values', () => {
      expect(Comparison.notEqual(true, true)).toBeFalsy();
      expect(Comparison.notEqual(true, false)).toBeTruthy();
      expect(Comparison.notEqual(false, false)).toBeFalsy();
      expect(Comparison.notEqual(true, 1)).toBeTruthy();
    });

    it('should handle date values', () => {
      expect(Comparison.notEqual('2018-06-11', '2018-06-11')).toBeFalsy();
      expect(Comparison.notEqual('2018-06-11', '2018-06-12')).toBeTruthy();
    });

    it('should return true for values that are undefined', () => {
      expect(Comparison.notEqual(undefined, 10)).toBeTruthy();
      expect(Comparison.notEqual(5, undefined)).toBeTruthy();
      expect(Comparison.notEqual(undefined, undefined)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(Comparison.notEqual(Infinity, 10)).toBeTruthy();
      expect(Comparison.notEqual(Infinity, Infinity)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(Comparison.notEqual(-Infinity, -5)).toBeTruthy();
      expect(Comparison.notEqual(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('in function', () => {
    it('should handle numeric values', () => {
      expect(Comparison.in(10, [0, 10, 20, 30, 40, 50])).toBeTruthy();
      expect(Comparison.in(10, [0, 20, 30, 40, 50])).toBeFalsy();
    });

    it('should handle string values', () => {
      expect(Comparison.in('john', ['joe', 'john', 'johnathan', 'jacob'])).toBeTruthy();
      expect(Comparison.in('john', ['emily', 'churchill', 'bobbi'])).toBeFalsy();
    });
  });

  describe('notIn function', () => {
    it('should handle numeric values', () => {
      expect(Comparison.notIn(10, [0, 10, 20, 30, 40, 50])).toBeFalsy();
      expect(Comparison.notIn(10, [0, 20, 30, 40, 50])).toBeTruthy();
    });

    it('should handle string values', () => {
      expect(Comparison.notIn('john', ['joe', 'john', 'johnathan', 'jacob'])).toBeFalsy();
      expect(Comparison.notIn('john', ['emily', 'churchill', 'bobbi'])).toBeTruthy();
    });
  });

  describe('isNull function', () => {
    it('should return correct answer', () => {
      expect(Comparison.isNull(null)).toBeTruthy();
      expect(Comparison.isNull(0)).toBeFalsy();
      expect(Comparison.isNull(undefined)).toBeFalsy();
      expect(Comparison.isNull(Infinity)).toBeFalsy();
      expect(Comparison.isNull('')).toBeFalsy();
    });
  });

  describe('isNotNull function', () => {
    it('should return correct answer', () => {
      expect(Comparison.isNotNull(null)).toBeFalsy();
      expect(Comparison.isNotNull(0)).toBeTruthy();
      expect(Comparison.isNotNull(Infinity)).toBeTruthy();
      expect(Comparison.isNotNull(undefined)).toBeTruthy();
      expect(Comparison.isNotNull('')).toBeTruthy();
    });
  });
});
