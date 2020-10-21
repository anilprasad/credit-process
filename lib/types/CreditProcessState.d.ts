import { ModuleDisplayType } from "../enums/ModuleDisplayType"

interface ICreditProcessUnit {
  type: ModuleDisplayType;
  display_name: string;
  name: string;
  segment: string;
  predicted_classification?: string;
  output_variable: string;
}

export default class CreditProcessState {
  error?: Error;

  assignments?: Record<string, {}>;
  calculations?: Record<string, {}>;
  requirements?: Record<string, {}>;
  output?: Record<string, {}>;
  scorecard?: Record<string, {}>;
  dataintegration?: Record<string, {}>;
  dataintegrations?: Record<string, {}>;
  artificialintelligence?: Record<string, {}>;

  credit_process: ICreditProcessUnit[];
  decline_reasons: [];

  artificialintelligence_variables?: {};
}