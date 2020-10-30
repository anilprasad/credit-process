import { ModuleDisplayType } from '../enum/ModuleDisplayType';

export default interface CreditProcessUnit extends Record<string, any>  {
  display_name: string;
  name: string;
  segment: string;
  type: ModuleDisplayType;
  decline_reasons?: string[];
  output_variable?: string;
  passed?: boolean | null;
  predicted_classification?: string;
  rules?: Array<{ name: string, passed: boolean, decline_reasons?: string[] }>;
  status?: string | number;
}
