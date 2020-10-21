import Segment from './types/Segment';
import Variable from './types/Variable';

export interface ICreateEvaluatorCallbackParams {
  segments: Segment[],
  module_name: string,
  integration: {},
  machinelearning: {},
  input_variables: Variable[],
  output_variables: Variable[],
}

type CreateEvaluatorCallback = (options: {}) => any;

export default class EvaluatorsCompiler {
  constructor(protected createEvaluatorCallback: CreateEvaluatorCallback) { }

  public compileEvaluators = async (options: ICreateEvaluatorCallbackParams) => {
    return Promise.all(options.segments.map(async (segment) => this.updateSegmentWithEvaluator(segment, options)));
  }

  protected updateSegmentWithEvaluator = async (segment: Segment, options: ICreateEvaluatorCallbackParams) => {
    segment.variables = segment.ruleset || [];
  
    const evaluator = await this.createEvaluatorCallback({
      ...options,
      segments: segment,
    });
  
    const _segment: any = Object.assign({}, segment._doc, { evaluator, });
    _segment.name = segment.name.replace(/^(.+)(\.v\d{1,2}(.\d{1,2}){0,2}.*)$/, '$1');
    _segment.conditions = segment.conditions || [];
  
    return _segment;
  }
}
