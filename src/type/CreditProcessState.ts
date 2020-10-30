import CreditProcessUnit from './CreditProcessUnit';
import DataSource from './DataSource'
import Segment from './StrategySegment';

export default interface CreditProcessState extends Record<string, any> {
  credit_process: CreditProcessUnit[];

  artificialintelligence_variables?: {};
  artificialintelligence?: Record<string, Segment>;
  assignment_variables?: {};
  assignments?: Record<string, Segment>;
  calculations?: Record<string, Segment>;
  dataintegration?: Record<string, Segment>;
  dataintegrations?: Record<string, Segment>;
  datasources?: DataSource[];
  decline_reasons?: string[];
  error?: Error;
  output?: Record<string, Segment>;
  requirements?: Record<string, Segment>;
  scorecard?: Record<string, Segment>;
}