import { ModuleType } from '../enum/ModuleType';
import { DataIntegration } from '../module/data-integrations/interface/DataIntegration';
import { BasicStrategySegment } from '../module/abstract/interface/BasicStrategySegment';

export interface CommonModule {
  type: ModuleType;
  segments: BasicStrategySegment[];
  name: string;
  active: boolean;
  display_name: string;
  lookup_name: string;
  description?: string;
}

export interface DataIntegrationModule extends CommonModule {
  dataintegration: DataIntegration;
  credentials: Record<string, unknown>;
}

export type Module = DataIntegrationModule | CommonModule;
