import CreditProcessState from 'type/CreditProcessState';
import { StateSegment } from 'type/StateSegment';

export type Operation = (state: CreditProcessState) => Promise<StateSegment | StateSegment[]>;
