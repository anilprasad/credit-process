import { AssignmentsStateSegment } from '../module/assignments/interface/AssignmentsStateSegment';
import { CalculationsStateSegment } from '../module/calculations/interface/CalculationsStateSegment';
import { DataIntegrationStateSegment } from '../module/data-integrations/interface/DataIntegrationStateSegment';
import { MachineLearningStateSegment } from '../module/machine-learning/interface/MachineLearningStateSegment';
import { OutputStateSegment } from '../module/output/interface/OutputStateSegment';
import { RequirementsStateSegment } from '../module/requirements/interface/RequirementsStateSegment';
import { ScorecardStateSegment } from '../module/scorecard/interface/ScorecardStateSegment';

export type StateSegment = ScorecardStateSegment
  | RequirementsStateSegment
  | OutputStateSegment
  | CalculationsStateSegment
  | AssignmentsStateSegment
  | DataIntegrationStateSegment
  | MachineLearningStateSegment;
