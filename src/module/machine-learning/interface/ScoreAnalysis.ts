import { Document } from 'mongoose';
import { MLModel } from '../interface/MLModel';
import { Organization } from '../../../interface/Organization';

export interface ScoreAnalysis extends Document {
  _id: string;
  type: string;
  name: string;
  comparison_score_inverse: boolean;
  mlmodel: MLModel;
  provider: string;
  industry: string;
  createdat: Date;
  updatedat: Date;
  organization: Organization;
  results: {
    projection_evaluator: string;
  };
}
