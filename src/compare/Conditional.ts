import moment from 'moment';

export class Conditional {
  public static gt = (value: any, compareTo: any) => {
    if (checkNullValues(compareTo, value)) {
      return false;
    }

    if (isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    return value > compareTo;
  }

  public static lt = (value: any, compareTo: any) => {
    if (checkNullValues(compareTo, value)) {
      return false;
    }

    if (isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    return value < compareTo;
  }

  public static lte = (value: any, compareTo: any) => {
    if (checkNullValues(compareTo, value)) {
      return false;
    }

    if (isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    if (compareTo !== 0 && !compareTo) {
      return true;
    }

    return compareTo <= value;
  }

  public static gte = (value: any, compareTo: any) => {
    if (checkNullValues(compareTo, value)) {
      return false;
    }

    if (isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    if (value !== 0 && !value) {
      return false;
    }

    return value >= compareTo;
  }

  public static range = (value: any, min: any, max: any) => {
    if (checkNullValues(min, max, value)) {
      return false;
    }

    if (isDate(min)) {
      min = Date.parse(min);
    }

    if (isDate(max)) {
      max = Date.parse(max);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    if (value !== 0 && !value) {
      return false;
    }

    if (min > max) {
      return value <= min && value >= max;
    }

    return value >= min && value <= max;
  }

  public static equal = (value: any, compareTo: any) => {
    if (checkNullValues(compareTo, value)) {
      return false;
    }

    if (isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    if (isDate(value)) {
      value = Date.parse(value);
    }

    return compareTo === value;
  }

  public static in(value: any, haystack: any) {
    if (haystack && typeof haystack === 'object' && !Array.isArray(value)) {
      if (Array.isArray(haystack)) {
        return haystack.includes(value);
      } else {
        return Object.keys(haystack).includes(value);
      }
    } else if (Array.isArray(value) && typeof haystack === 'string') {
      return value.includes(haystack);
    } else if (!Array.isArray(value) && typeof haystack === 'string') {
      return haystack.split(',').includes(value);
    }

    return false;
  }

  public static notEqual = (value: any, compareTo: any) => {
    return !Conditional.equal(value, compareTo);
  }

  public static notIn(value: any, haystack: any) {
    return !Conditional.in(value, haystack);
  }

  public static isNull = (value: any) => {
    return value === null;
  }

  public static isNotNull = (value: any) => {
    return value !== null;
  }
}

const isDate = (value: any) => {
  return typeof value === 'string'
    && moment(value, moment.ISO_8601, true).isValid();
}

const checkNullValues = (...values: any[]) => {
  return values.includes(null);
}
