import deepEqual from 'deep-equal';
import moment from 'moment';

export interface CompareOperands {
  gt: (value: any) => boolean;
  lt: (value: any) => boolean;
  cap: (value: any) => boolean;
  floor: (value: any) => boolean;
  range: (min: any, max: any) => boolean;
  equal: (value: any) => boolean;
  isin: (value: any) => boolean;
  exists: () => boolean;
  deepequal: (value: any) => boolean;
  isnull: () => boolean;
  isnotnull: () => boolean;
}

export default class CompareTo implements CompareOperands {
  protected compareTo: any;

  constructor(compareTo: any) {
    this.compare(compareTo);
  }

  public gt = (value: any) => {
    if (this.checkNullValues([ value, this.compareTo ])) {
      return false;
    }

    if (this.isDate(value)) {
      value = Date.parse(value);
    }

    return this.compareTo > value;
  }

  public lt = (value: any) => {
    if (this.checkNullValues([ value, this.compareTo ])) {
      return false;
    }

    if (this.isDate(value)) {
      value = Date.parse(value);
    }

    return this.compareTo < value;
  }

  public cap = (value: any) => {
    if (this.checkNullValues([ value, this.compareTo ])) {
      return false;
    }

    if (this.isDate(value)) {
      value = Date.parse(value);
    }

    if (this.compareTo !== 0 && !this.compareTo) {
      return true;
    }

    return this.compareTo <= value;
  }

  /**
   * @alias Conditional.cap
   */
  ceil(value: number) {
    return this.cap(value);
  }

  public floor = (value: any) => {
    if (this.checkNullValues([ value, this.compareTo ])) {
      return false;
    }

    if (this.isDate(value)) {
      value = Date.parse(value);
    }

    if (this.compareTo !== 0 && !this.compareTo) {
      return false;
    }

    return this.compareTo >= value;
  }

  public range = (min: any, max: any) => {
    if (this.checkNullValues([ min, max, this.compareTo ])) {
      return false;
    }

    if (this.isDate(min)) {
      min = Date.parse(min);
    }

    if (this.isDate(max)) {
      max = Date.parse(max);
    }

    if (this.compareTo !== 0 && !this.compareTo) {
      return false;
    }

    if (min > max) {
      return (this.compareTo <= min && this.compareTo >= max);
    }

    return (this.compareTo >= min && this.compareTo <= max);
  }

  public equal = (value: any) => {
    if (this.checkNullValues([ value, this.compareTo ])) {
      return false;
    }

    if (this.isDate(value)) {
      value = Date.parse(value);
    }

    return this.compareTo === value;
  }

  public isin = (value: any) => {
    if (value && typeof value === 'object' && !Array.isArray(this.compareTo)) {
      if (Array.isArray(value)) {
        return value.indexOf(this.compareTo) !== -1;
      } else {
        return Object.keys(value).indexOf(this.compareTo) !== -1;
      }
    } else if (Array.isArray(this.compareTo) && typeof value === 'string') {
      return this.compareTo.indexOf(value) !== -1;
    } else if (!Array.isArray(this.compareTo) && typeof value === 'string') {
      return value.split(',').indexOf(this.compareTo) !== -1;
    }

    return false;
  }

  /**
   * @alias CompareTo.isin
   */
  public in(value: string|string[]|number[]) {
    return this.isin(value);
  }

  public notin(value: string|string[]|number[]) {
    return !this.isin(value);
  }

  public exists = () => {
    if (typeof this.compareTo === 'number') {
      return true;
    }

    return Boolean(this.compareTo);
  }

  public deepequal = (value: any) => {
    return deepEqual(this.compareTo, value, { strict: true, });
  }

  public isnull = () => {
    return this.compareTo === null;
  }

  public isnotnull = () => {
    return this.compareTo !== null;
  }

  public compare = (compareTo: number|string) => {
    if (typeof compareTo === 'string' && this.isDate(compareTo)) {
      compareTo = Date.parse(compareTo);
    }

    this.compareTo = compareTo;
  }

  /**
   * @alias CompareTo.compare
   */
  public evalute(value: any) {
    return this.compare(value);
  }

  /**
   * @alias CompareTo.compare
   */
  public condition(value: any) {
    return this.compare(value);
  }

  private isDate = (value: any) => {
    return typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
  }

  private checkNullValues = (value: any | any[]) => {
    if (Array.isArray(value)) {
      return value.includes(null);
    }

    return value === null;
  }
}
