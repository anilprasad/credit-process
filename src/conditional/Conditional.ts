import CompareTo from './CompareTo';
import NegateCompareTo from './NegateCompareTo';

export default class Conditional extends CompareTo {
  public not: NegateCompareTo;

  constructor(compareTo: any) {
    super(compareTo);

    this.not = new NegateCompareTo(compareTo);
  }
}
