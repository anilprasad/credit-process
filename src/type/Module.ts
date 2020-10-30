import { ModuleType } from 'enum/ModuleType';
import { DataIntegration } from 'type/DataIntegration';
import { StrategySegment } from 'type/StrategySegment';

interface CommonModule {
  type: ModuleType;
  segments: StrategySegment[];
  name: string;
  active: boolean;
  display_name: string;
  lookup_name: string;
  description?: string;
}

interface DataIntegrationModule extends CommonModule {
  dataintegration: DataIntegration;
  credentials: {};
}

export type Module = DataIntegrationModule | CommonModule;
