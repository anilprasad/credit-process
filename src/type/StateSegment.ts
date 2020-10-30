import Rule from 'type/Rule';
import { StrategySegment } from 'type/StrategySegment';

export interface BasicStateSegment extends Record<string, any> {
  name: string;
  segment: string;
  type: string;
  error?: Error;
}

export interface ScorecardStateSegment extends BasicStateSegment {
  output_variable: StrategySegment['output_variable'],
  rules: Array<{ name: string, passed: boolean, decline_reasons?: string[] }>;
  [key: string]: any;
}

export interface RequirementsStateSegment extends BasicStateSegment {
  passed: boolean;
  decline_reasons: string[];
  rules: Array<{ name: string, passed: boolean, decline_reasons: string[] }>;
}

export interface OutputStateSegment extends BasicStateSegment {
  passed: boolean;
  decline_reasons: string[];
  rules: Array<{ name: string, passed: boolean, condition_output: {} }>;
}

export interface CalculationsStateSegment extends BasicStateSegment {
  calculations: {};
}

export interface AssignmentsStateSegment extends BasicStateSegment {
  assignments: {};
}

export interface DataIntegrationStateSegment extends BasicStateSegment {
  passed: boolean;
  output: {};
  provider: string;
  raw: string;
  rules: Rule[];
  status?: string | number;
}

export interface ArtificialIntelligenceStateSegment extends BasicStateSegment {
  classification: string;
  prediction: {};
  output_variable: StrategySegment['output_variable'];
}

export type StateSegment = ScorecardStateSegment
  | RequirementsStateSegment
  | OutputStateSegment
  | CalculationsStateSegment
  | AssignmentsStateSegment
  | DataIntegrationStateSegment
  | ArtificialIntelligenceStateSegment;
