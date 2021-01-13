import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { MachineLearningStateSegment } from './interface/MachineLearningStateSegment';
import { MachineLearningStrategySegment } from './interface/MachineLearningStrategySegment';
import { MLModel } from './interface/MLModel';
import { ModuleType } from '../../enum/ModuleType';
import periodic from 'periodicjs';
import providerEvaluators from './lib/providers';
import { ScoreAnalysis } from './interface/ScoreAnalysis';

export interface IMachineLearningModuleCompilationOptions
  extends IBasicModuleCompilationOptions<MachineLearningStrategySegment> {
  module_type: ModuleType.MachineLearning;
}

export default class MachineLearning
  extends AbstractModule<MachineLearningStrategySegment, MachineLearningStateSegment> {
  constructor(options: IMachineLearningModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: MachineLearningStrategySegment,
    state: CreditProcessState
  ): Promise<MachineLearningStateSegment> => {
    const result = await runLearning(segment, state);

    return {
      type: ModuleType.MachineLearning,
      name: this.moduleName,
      segment: segment.name,
      prediction: result.prediction,
      output: result.output,
      classification: result.classification,
      output_variable: segment.output_variable,
    };
  };
}

const runLearning = async (segment: MachineLearningStrategySegment, state: CreditProcessState) => {
  const MLModelEntity = periodic.datas.get('standard_mlmodel');
  const ScoreAnalysisEntity = periodic.datas.get('standard_scoreanalysis');

  if (!MLModelEntity || !ScoreAnalysisEntity) {
    throw new Error('Error while initialization of ML models');
  }

  const mlModel = await MLModelEntity.load({ query: { _id: segment.mlmodel_id } }) as MLModel | null;

  if (!mlModel) {
    throw new Error(`Cannot find ML model with id ${segment.mlmodel_id}`);
  }

  const provider = mlModel.selected_provider;

  let scoreanalysis: ScoreAnalysis | null = null;
  if (mlModel.industry) {
    scoreanalysis = await ScoreAnalysisEntity.model.findOne({
      mlmodel: mlModel._id.toString(),
      type: 'training',
      provider,
    }).lean() as ScoreAnalysis | null;
  }

  return providerEvaluators[provider](mlModel, segment, state, scoreanalysis);
};
