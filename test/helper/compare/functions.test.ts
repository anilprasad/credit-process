import * as compareFunctions from '../../../src/helper/compare/functions';

describe('compareFunctions', () => {
  describe('gt (greater than) function', () => {
    it('should return true if the compareFunctions value is greater than the argument', () => {
      expect(compareFunctions.gt(10, 5)).toBeTruthy();
    });

    it('should return false if the compareFunctions value is smaller than the argument', () => {
      expect(compareFunctions.gt(10, 20)).toBeFalsy();
    });

    it('should return false if the values are equal', () => {
      expect(compareFunctions.gt(10, 10)).toBeFalsy();
    });

    it('should handle date compareFunctionss', () => {
      expect(compareFunctions.gt(new Date('2018-06-11'), '2000-06-11')).toBeTruthy();
      expect(compareFunctions.gt(new Date('2000-06-11'), '2018-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(compareFunctions.gt(null, 5)).toBeFalsy();
      expect(compareFunctions.gt(5, null)).toBeFalsy();
      expect(compareFunctions.gt(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(compareFunctions.gt(undefined, 10)).toBeFalsy();
      expect(compareFunctions.gt(5, undefined)).toBeFalsy();
      expect(compareFunctions.gt(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(compareFunctions.gt(Infinity, 10)).toBeTruthy();
      expect(compareFunctions.gt(Infinity, Infinity)).toBeFalsy();
    });

    it('should return false for values that are comparing against negative infinity', () => {
      expect(compareFunctions.gt(-Infinity, -5)).toBeFalsy();
      expect(compareFunctions.gt(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('lt (less than) function', () => {
    it('should return true if the compareFunctions value is less than the argument', () => {
      expect(compareFunctions.lt(5,10)).toBeTruthy();
    });

    it('should return false if the compareFunctions value is greater than the argument', () => {
      expect(compareFunctions.lt(20, 10)).toBeFalsy();
    });

    it('should return false if the values are equal', () => {
      expect(compareFunctions.lt(10, 10)).toBeFalsy();
    });

    it('should handle date compareFunctionss', () => {
      expect(compareFunctions.lt(new Date('2000-06-11'), '2018-06-11')).toBeTruthy();
      expect(compareFunctions.lt(new Date('2018-06-11'), '2000-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(compareFunctions.lt(null, 5)).toBeFalsy();
      expect(compareFunctions.lt(5, null)).toBeFalsy();
      expect(compareFunctions.lt(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(compareFunctions.lt(undefined, 10)).toBeFalsy();
      expect(compareFunctions.lt(5, undefined)).toBeFalsy();
      expect(compareFunctions.lt(undefined, undefined)).toBeFalsy();
    });

    it('should return true for values that are comparing against positive infinity', () => {
      expect(compareFunctions.lt(Infinity, 10)).toBeFalsy();
      expect(compareFunctions.lt(Infinity, Infinity)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(compareFunctions.lt(-Infinity, -5)).toBeTruthy();
      expect(compareFunctions.lt(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('lte (less than or equal) function', () => {
    it('should return true if the compareFunctions value is less than the argument', () => {
      expect(compareFunctions.lte(5, 10)).toBeTruthy();
    });

    it('should return false if the compareFunctions value is greater than the argument', () => {
      expect(compareFunctions.lte(20, 10)).toBeFalsy();
    });

    it('should return true if the values are equal', () => {
      expect(compareFunctions.lte(10, 10)).toBeTruthy();
    });

    it('should handle date compareFunctionss', () => {
      expect(compareFunctions.lte(new Date('2000-06-11'), '2018-06-11')).toBeTruthy();
      expect(compareFunctions.lte(new Date('2018-06-11'), '2000-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(compareFunctions.lte(null, 5)).toBeFalsy();
      expect(compareFunctions.lte(5, null)).toBeFalsy();
      expect(compareFunctions.lte(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(compareFunctions.lte(undefined, 10)).toBeFalsy();
      expect(compareFunctions.lte(5, undefined)).toBeFalsy();
      expect(compareFunctions.lte(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(compareFunctions.lte(Infinity, 10)).toBeFalsy();
      expect(compareFunctions.lte(Infinity, Infinity)).toBeTruthy();
    });

    it('should return false for values that are comparing against negative infinity', () => {
      expect(compareFunctions.lte(-Infinity, -5)).toBeTruthy();
      expect(compareFunctions.lte(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('gte (greater than or equal) function', () => {
    it('should return true if the compareFunctions value is greater than the argument', () => {
      expect(compareFunctions.gte(10, 5)).toBeTruthy();
    });

    it('should return false if the compareFunctions value is smaller than the argument', () => {
      expect(compareFunctions.gte(10, 20)).toBeFalsy();
    });

    it('should return true if the values are equal', () => {
      expect(compareFunctions.gte(10, 10)).toBeTruthy();
    });

    it('should handle date compareFunctionss', () => {
      expect(compareFunctions.gte(new Date('2018-06-11'), '2000-06-11')).toBeTruthy();
      expect(compareFunctions.gte(new Date('2000-06-11'), '2018-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(compareFunctions.gte(null, 5)).toBeFalsy();
      expect(compareFunctions.gte(5, null)).toBeFalsy();
      expect(compareFunctions.gte(null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(compareFunctions.gte(undefined, 10)).toBeFalsy();
      expect(compareFunctions.gte(5, undefined)).toBeFalsy();
      expect(compareFunctions.gte(undefined, undefined)).toBeFalsy();
    });

    it('should return true for values that are comparing against positive infinity', () => {
      expect(compareFunctions.gte(Infinity, 10)).toBeTruthy();
      expect(compareFunctions.gte(Infinity, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(compareFunctions.gte(-Infinity, -5)).toBeFalsy();
      expect(compareFunctions.gte(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('range function', () => {
    it('should return true if the argument is within the range', () => {
      expect(compareFunctions.range(10, 5, 15)).toBeTruthy();
    });

    it('should return false if argument does not fall in range', () => {
      expect(compareFunctions.range(20, 5, 15)).toBeFalsy();
    });

    it('should return true if the value is equal to any of the bounds', () => {
      expect(compareFunctions.range(5, 5, 10)).toBeTruthy();
      expect(compareFunctions.range(10, 5, 10)).toBeTruthy();
    });

    it('should handle date compareFunctionss', () => {
      expect(compareFunctions.range(new Date('2018-06-11'), '2016-06-11', '2020-06-11')).toBeTruthy();
      expect(compareFunctions.range(new Date('2000-06-11'), '2016-06-11', '2020-06-11')).toBeFalsy();
    });

    it('should return false if any of the values are null', () => {
      expect(compareFunctions.range(null, 5, 10)).toBeFalsy();
      expect(compareFunctions.range(5, null, 10)).toBeFalsy();
      expect(compareFunctions.range(null, null, null)).toBeFalsy();
    });

    it('should return false for values that are undefined', () => {
      expect(compareFunctions.range(undefined, 5, 10)).toBeFalsy();
      expect(compareFunctions.range(5, undefined, 10)).toBeFalsy();
      expect(compareFunctions.range(undefined, undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against upper limit of positive infinity', () => {
      expect(compareFunctions.range(Infinity, 5, 10)).toBeFalsy();
      expect(compareFunctions.range(Infinity, Infinity, Infinity)).toBeTruthy();
      expect(compareFunctions.range(Infinity, 0, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against lower limit of negative infinity', () => {
      expect(compareFunctions.range(-Infinity, -5, -10)).toBeFalsy();
      expect(compareFunctions.range(-Infinity, -Infinity, -Infinity)).toBeTruthy();
      expect(compareFunctions.range(-Infinity, -Infinity, 0)).toBeTruthy();
    });
  });
  
  describe('equal function', () => {
    it('should handle numeric values', () => {
      expect(compareFunctions.equal(10, 10)).toBeTruthy();
      expect(compareFunctions.equal(10, 9.99)).toBeFalsy();
      expect(compareFunctions.equal(10, 11)).toBeFalsy();
    });

    it('should handle string values', () => {
      expect(compareFunctions.equal('john', 'john')).toBeTruthy();
      expect(compareFunctions.equal('john', 'johnny')).toBeFalsy();
    });

    it('should handle boolean values', () => {
      expect(compareFunctions.equal(true, true)).toBeTruthy();
      expect(compareFunctions.equal(true, false)).toBeFalsy();
      expect(compareFunctions.equal(false, false)).toBeTruthy();
      expect(compareFunctions.equal(true, 1)).toBeFalsy();
    });

    it('should handle date values', () => {
      expect(compareFunctions.equal('2018-06-11', '2018-06-11')).toBeTruthy();
      expect(compareFunctions.equal('2018-06-11', '2018-06-12')).toBeFalsy();
    });

    it('should return false answer for values that are undefined', () => {
      expect(compareFunctions.equal(undefined, 10)).toBeFalsy();
      expect(compareFunctions.equal(5, undefined)).toBeFalsy();
      expect(compareFunctions.equal(undefined, undefined)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(compareFunctions.equal(Infinity, 10)).toBeFalsy();
      expect(compareFunctions.equal(Infinity, Infinity)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(compareFunctions.equal(-Infinity, -5)).toBeFalsy();
      expect(compareFunctions.equal(-Infinity, -Infinity)).toBeTruthy();
    });
  });

  describe('notEqual function', () => {
    it('should handle numeric values', () => {
      expect(compareFunctions.notEqual(10, 10)).toBeFalsy();
      expect(compareFunctions.notEqual(10, 9.99)).toBeTruthy();
      expect(compareFunctions.notEqual(10, 11)).toBeTruthy();
    });

    it('should handle string values', () => {
      expect(compareFunctions.notEqual('john', 'john')).toBeFalsy();
      expect(compareFunctions.notEqual('john', 'johnny')).toBeTruthy();
    });

    it('should handle boolean values', () => {
      expect(compareFunctions.notEqual(true, true)).toBeFalsy();
      expect(compareFunctions.notEqual(true, false)).toBeTruthy();
      expect(compareFunctions.notEqual(false, false)).toBeFalsy();
      expect(compareFunctions.notEqual(true, 1)).toBeTruthy();
    });

    it('should handle date values', () => {
      expect(compareFunctions.notEqual('2018-06-11', '2018-06-11')).toBeFalsy();
      expect(compareFunctions.notEqual('2018-06-11', '2018-06-12')).toBeTruthy();
    });

    it('should return true for values that are undefined', () => {
      expect(compareFunctions.notEqual(undefined, 10)).toBeTruthy();
      expect(compareFunctions.notEqual(5, undefined)).toBeTruthy();
      expect(compareFunctions.notEqual(undefined, undefined)).toBeTruthy();
    });

    it('should return correct answer for values that are comparing against positive infinity', () => {
      expect(compareFunctions.notEqual(Infinity, 10)).toBeTruthy();
      expect(compareFunctions.notEqual(Infinity, Infinity)).toBeFalsy();
    });

    it('should return correct answer for values that are comparing against negative infinity', () => {
      expect(compareFunctions.notEqual(-Infinity, -5)).toBeTruthy();
      expect(compareFunctions.notEqual(-Infinity, -Infinity)).toBeFalsy();
    });
  });

  describe('includes function', () => {
    it('should handle numeric values', () => {
      expect(compareFunctions.includes(10, [0, 10, 20, 30, 40, 50])).toBeTruthy();
      expect(compareFunctions.includes(10, [0, 20, 30, 40, 50])).toBeFalsy();
    });

    it('should handle string values', () => {
      expect(compareFunctions.includes('john', ['joe', 'john', 'johnathan', 'jacob'])).toBeTruthy();
      expect(compareFunctions.includes('john', ['emily', 'churchill', 'bobbi'])).toBeFalsy();
    });
  });

  describe('notIncludes function', () => {
    it('should handle numeric values', () => {
      expect(compareFunctions.notIncludes(10, [0, 10, 20, 30, 40, 50])).toBeFalsy();
      expect(compareFunctions.notIncludes(10, [0, 20, 30, 40, 50])).toBeTruthy();
    });

    it('should handle string values', () => {
      expect(compareFunctions.notIncludes('john', ['joe', 'john', 'johnathan', 'jacob'])).toBeFalsy();
      expect(compareFunctions.notIncludes('john', ['emily', 'churchill', 'bobbi'])).toBeTruthy();
    });
  });

  describe('isNull function', () => {
    it('should return correct answer', () => {
      expect(compareFunctions.isNull(null)).toBeTruthy();
      expect(compareFunctions.isNull(0)).toBeFalsy();
      expect(compareFunctions.isNull(undefined)).toBeFalsy();
      expect(compareFunctions.isNull(Infinity)).toBeFalsy();
      expect(compareFunctions.isNull('')).toBeFalsy();
    });
  });

  describe('isNotNull function', () => {
    it('should return correct answer', () => {
      expect(compareFunctions.isNotNull(null)).toBeFalsy();
      expect(compareFunctions.isNotNull(0)).toBeTruthy();
      expect(compareFunctions.isNotNull(Infinity)).toBeTruthy();
      expect(compareFunctions.isNotNull(undefined)).toBeTruthy();
      expect(compareFunctions.isNotNull('')).toBeTruthy();
    });
  });
});
