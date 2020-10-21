class EvaluatorsCompiler {
  async compileEvaluators(segments) {
    return Promise.all(segments.map(async (segment) => updateSegmentWithEvaluator(segment)));
  }

  async updateSegmentWithEvaluator(segment) {
    segment.sync = true;
    segment.variables = segment.ruleset || [];
  
    const evaluator = await this.createEvaluator({
      segments: segment,
      module_name,
      integration,
      machinelearning,
      input_variables,
      output_variables,
    });
  
    const _segment = Object.assign({}, segment._doc, { evaluator, });
    _segment.name = segment.name.replace(/^(.+)(\.v\d{1,2}(.\d{1,2}){0,2}.*)$/, '$1');
    _segment.conditions = segment.conditions || [];
  
    return _segment;
  }
}

module.exports = EvaluatorsCompiler;
