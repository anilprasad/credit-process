import aws from './aws';
import { CreditProcessState } from '../../../../interface/CreditProcessState';
import decision_tree from './decision-tree';
import { MachineLearningStrategySegment } from '../../interface/MachineLearningStrategySegment';
import { MLModel } from '../../interface/MLModel';
import neural_network from './neural-network';
import { ProviderOutput } from '../../interface/ProviderOutput';
import random_forest from './random-forest';
import sagemaker_ll from './sagemaker-ll';
import sagemaker_xgb from './sagemaker-xgb';
import { ScoreAnalysis } from '../../interface/ScoreAnalysis';

type Provider = (
  mlmodel: MLModel,
  segment: MachineLearningStrategySegment,
  state: CreditProcessState,
  scoreAnalysis: ScoreAnalysis | null,
) => Promise<ProviderOutput>;

export default {
  aws,
  decision_tree,
  neural_network,
  random_forest,
  sagemaker_ll,
  sagemaker_xgb,
} as Record<string, Provider>;
