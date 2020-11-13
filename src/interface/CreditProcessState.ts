import { CreditProcessUnit } from './CreditProcessUnit';
import { DataIntegrationDataSource } from '../module/data-integrations/interface/DataIntegrationDataSource';
import { MachineLearningStateSegment } from '../module/machine-learning/interface/MachineLearningStateSegment';
import { AssignmentsStateSegment } from '../module/assignments/interface/AssignmentsStateSegment';
import { CalculationsStateSegment } from '../module/calculations/interface/CalculationsStateSegment';
import { DataIntegrationStateSegment } from '../module/data-integrations/interface/DataIntegrationStateSegment';
import { OutputStateSegment } from '../module/output/interface/OutputStateSegment';
import { RequirementsStateSegment } from '../module/requirements/interface/RequirementsStateSegment';
import { ScorecardStateSegment } from '../module/scorecard/interface/ScorecardStateSegment';

export interface CreditProcessState extends Record<string, unknown> {
  credit_process: CreditProcessUnit[];

  strategy_status?: 'active' | 'testing';

  artificialintelligence_variables?: Record<string, unknown>;
  artificialintelligence?: Record<string, MachineLearningStateSegment>;
  assignment_variables?: Record<string, unknown>;
  dataintegration_variables?: Record<string, unknown>;
  scorecard_variables?: Record<string, unknown>;
  output_variables?: Record<string, unknown>;
  calculated_variables?: Record<string, unknown>;
  assignments?: Record<string, AssignmentsStateSegment>;
  calculations?: Record<string, CalculationsStateSegment>;
  dataintegrations?: Record<string, DataIntegrationStateSegment>;
  datasources?: DataIntegrationDataSource[];
  decline_reasons?: string[];
  error?: { message: string };
  output?: Record<string, OutputStateSegment>;
  requirements?: Record<string, RequirementsStateSegment>;
  scorecard?: Record<string, ScorecardStateSegment>;
}