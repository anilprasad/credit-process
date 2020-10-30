import CompareTo, { CompareOperands } from './CompareTo';

export default class NegateCompareTo implements CompareOperands {
  private compareTo: CompareTo;

  constructor(compareTo: any) {
    this.compareTo = new CompareTo(compareTo);
  }

  public gt = (value: any) => !this.compareTo.gt(value); 
  public lt = (value: any) => !this.compareTo.lt(value); 
  public cap = (value: any) => !this.compareTo.cap(value); 
  public floor = (value: any) => !this.compareTo.floor(value); 
  public range = (min: any, max: any) => !this.compareTo.range(min, max); 
  public equal = (value: any) => !this.compareTo.equal(value); 
  public isin = (value: any) => !this.compareTo.isin(value); 
  public exists = () => !this.compareTo.exists(); 
  public deepequal = (value: any) => !this.compareTo.deepequal(value); 
  public isnull = () => !this.compareTo.isnull(); 
  public isnotnull = () => !this.compareTo.isnotnull(); 
}
