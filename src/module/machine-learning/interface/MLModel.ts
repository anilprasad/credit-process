import { Document, Schema } from 'mongoose';
import { BatchPrediction } from './BatchPrediction';
import { CompiledStrategy } from '../../../interface/CompiledStrategy';
import { MLModelDataSource } from './MLModelDataSource';
import { Organization } from '../../../interface/Organization';

export interface MLModel extends Document {
  _id: string;
  name: {
    type: string;
    index: boolean;
    required: boolean;
  };
  observation_count: number;
  predictor_variable_count: number;
  selected_provider: string;
  updating_provider: {
    type: boolean;
    default: false;
  };
  description: string;
  type: string;
  industry: {
    type: string;
  };
  industry_headers: [string];
  industry_file: string;
  display_name: string;
  datasource: MLModelDataSource;
  digifi_model_status: string;
  status: string;
  training_data_source_id: string;
  testing_data_source_id: string;
  aws_models: [string];
  digifi_models: [string];
  aws: {
    status: string;
    progress: number;
    real_time_prediction_id: string;
    real_time_endpoint: string;
    real_time_endpoint_status: string;
    batch_training_status: string;
    model_name: string;
    batch_testing_status: string;
    evaluation_status: string;
    evaluation_id: string;
    r_squared: number;
    performance_metrics: Schema.Types.Mixed;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  sagemaker_ll: {
    status: string;
    progress: number;
    model_name: string;
    real_time_prediction_id: string;
    real_time_endpoint: string;
    real_time_endpoint_status: string;
    batch_training_status: string;
    batch_testing_status: string;
    evaluation_status: string;
    evaluation_id: string;
    r_squared: number;
    error_message: string;
    performance_metrics: Schema.Types.Mixed;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  sagemaker_xgb: {
    status: string;
    progress: number;
    model_name: string;
    real_time_prediction_id: string;
    real_time_endpoint: string;
    real_time_endpoint_status: string;
    batch_training_status: string;
    batch_testing_status: string;
    evaluation_status: string;
    evaluation_id: string;
    r_squared: number;
    error_message: string;
    performance_metrics: Schema.Types.Mixed;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  bayes: {
    status: string;
    progress: number;
    model: Schema.Types.Mixed;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  decision_tree: {
    status: string;
    progress: number;
    model: string;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  random_forest: {
    status: string;
    progress: number;
    model: string;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  neural_network: {
    status: string;
    progress: number;
    model: string;
    column_scale: Record<string, { min: number, max: number }>;
    batch_training_id: BatchPrediction;
    batch_testing_id: BatchPrediction;
  };
  createdat: Date;
  updatedat: Date;
  user: {
    creator: string;
    updater: string;
  };
  organization: Organization;
  variables: Schema.Types.Mixed;
  strategies: CompiledStrategy[];
}
