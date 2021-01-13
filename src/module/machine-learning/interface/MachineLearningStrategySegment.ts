import { BasicStrategySegment } from '../../abstract/interface/BasicStrategySegment';
import { VariableInputType } from '../../../enum/VariableInputType';

export interface MachineLearningStrategySegment extends BasicStrategySegment {
  mlmodel_id: string;
  outputs: [{
    output_variable?: string;
  }];
  inputs: [{
    input_type: VariableInputType;
    model_variable_name: string;
    system_variable_id: string | number;
  }];
  output_variable: string;
}
