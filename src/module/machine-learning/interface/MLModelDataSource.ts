import { Organization } from '../../../interface/Organization';
import { Schema } from 'mongoose';

export interface MLModelDataSource {
  id: string;
  name: {
    type: string;
    index: true;
    required: true;
  };
  original_file: {
    name: string;
    training: {
      Key: string;
      Bucket: string;
      filename: string;
      fileurl: string;
    };
    testing: {
      Key: string;
      Bucket: string;
      filename: string;
      fileurl: string;
    };
  };
  statistics: Record<string, { mean: number, mode?: number }>;
  observation_count: number;
  predictor_variable_count: number;
  display_name: string;
  data_schema: string;
  strategy_data_schema: string;
  training_data_source_id: string;
  testing_data_source_id: string;
  providers: {
    digifi: {
      headers: string[];
    };
    sagemaker_ll: {
      headers: string[];
    };
    sagemaker_xgb: {
      headers: string[];
    };
  };
  column_unique_counts: Schema.Types.Mixed;
  encoders: {
    [key: string]: number[];
  };
  decoders: {
    [key: string]: number[];
  };
  included_columns:  string;
  encoder_counts: {
    [key: string]: number;
  };
  transformations: {
    [key: string]: {evaluator: string };
  };
  createdat: Date;
  updatedat: Date;
  organization: Organization;
}
