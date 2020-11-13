import { AssignmentsStrategySegment } from '../module/assignments/interface/AssignmentsStrategySegment';
import { BasicStrategySegment } from '../module/abstract/interface/BasicStrategySegment';
import { CalculationsStrategySegment } from '../module/calculations/interface/CalculationsStrategySegment';
import { DataIntegrationStrategySegment } from '../module/data-integrations/interface/DataIntegrationStrategySegment';
import { MachineLearningStrategySegment } from '../module/machine-learning/interface/MachineLearningStrategySegment';
import { ScorecardStrategySegment } from '../module/scorecard/interface/ScorecardStrategySegment';

export type StrategySegment = BasicStrategySegment
  | AssignmentsStrategySegment
  | CalculationsStrategySegment
  | DataIntegrationStrategySegment
  | MachineLearningStrategySegment
  | ScorecardStrategySegment;
