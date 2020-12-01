import { MLModel } from './MLModel';
import { Organization } from '../../../interface/Organization';
import { Schema } from 'mongoose';

export interface BatchPrediction {
  _id: string;
  name: string;
  type: string;
  display_name: string;
  mlmodel: MLModel;
  provider: {
    type: string;
    index: true;
  };
  predictions: [Schema.Types.Mixed];
  datasource_filename: string;
  original_datasource_filename: string;
  batch_output_uri: string;
  Key: string;
  Bucket: string;
  createdat: Date;
  updatedat: Date;
  organization: Organization;
  status: string;
  results: Schema.Types.Mixed;
}
