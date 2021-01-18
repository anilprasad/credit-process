import moment from 'moment';

export const gt = (value: any, compareTo: any) => {
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
};

export const lt = (value: any, compareTo: any) => {
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
};

export const lte = (value: any, compareTo: any) => {
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

  return value <= compareTo;
};

export const gte = (value: any, compareTo: any) => {
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
};

export const range = (value: any, min: any, max: any) => {
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
};

export const equal = (value: any, compareTo: any) => {
  if (checkNullValues(compareTo, value)) {
    return false;
  }

  if (isDate(compareTo)) {
    compareTo = Date.parse(compareTo);
  }

  if (isDate(value)) {
    value = Date.parse(value);
  }

  return value === compareTo;
};

export const includes = (value: any, haystack: any) => {
  if (haystack && typeof haystack === 'object' && !Array.isArray(value)) {
    return Array.isArray(haystack)
      ? haystack.includes(value)
      : Object.keys(haystack).includes(value);
  }
  
  if (Array.isArray(value) && typeof haystack === 'string') {
    return value.includes(haystack);
  }
  
  if (!Array.isArray(value) && typeof haystack === 'string') {
    return haystack.split(',').includes(value);
  }

  return false;
};

export const notEqual = (value: any, compareTo: any) => {
  return !equal(value, compareTo);
};

export const notIncludes = (value: any, haystack: any) => {
  return !includes(value, haystack);
};

export const isNull = (value: any) => {
  return value === null;
};

export const isNotNull = (value: any) => {
  return value !== null;
};

const isDate = (value: any) => {
  return typeof value === 'string'
    && moment(value, moment.ISO_8601, true).isValid();
};

const checkNullValues = (...values: any[]) => {
  return values.includes(null) || values.includes(undefined);
};
