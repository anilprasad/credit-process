import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import { RiskGrader } from './lib/RiskGrader';
import { runComparison } from '../../helper/compareHelper';
import { ScorecardRule } from './interface/ScorecardRule';
import { ScorecardStateSegment } from './interface/ScorecardStateSegment';
import { ScorecardStrategySegment } from './interface/ScorecardStrategySegment';
import { VariableInputType } from '../../enum/VariableInputType';

export interface IScorecardModuleCompilationOptions extends IBasicModuleCompilationOptions<ScorecardStrategySegment> {
  module_type: ModuleType.Scorecard;
}

export default class Scorecard extends AbstractModule<ScorecardStrategySegment, ScorecardStateSegment> {
  constructor(options: IScorecardModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: ScorecardStrategySegment,
    state: CreditProcessState
  ): Promise<ScorecardStateSegment> => {
    const riskGrader = this.createRiskGrader(segment);

    if (segment.output_variable === undefined) {
      throw new Error('Output Variable is required for scorecard but is not defined.');
    }

    const _state = { ...state };
    const evaluated = riskGrader.score(_state);

    return {
      name: this.moduleName,
      type: ModuleType.Scorecard,
      output_variable: segment.output_variable,
      segment: segment.name,
      rules: evaluated.contributions.map(contribution => {
        return {
          name: contribution.label,
          passed: contribution.passed,
          weight: contribution.contribution,
        };
      }),
      [`${segment.output_variable}`]: evaluated.base_score || 0,
    };
  }

  private createRiskGrader = (segment: ScorecardStrategySegment) => {
    const riskGrader = new RiskGrader();

    segment.ruleset.forEach((rule: ScorecardRule) => {
      if (rule.variable_name.toLowerCase() === 'constant') {
        riskGrader.insertConstantContribution(
          rule.condition_output.weight,
          rule.rule_name,
        );
      } else {
        riskGrader.insertRule({
          evaluation: this.generateRuleEvaluation(rule),
          weight: rule.condition_output.weight,
          weight_type: rule.condition_output_types && rule.condition_output_types.weight || VariableInputType.Value,
          rule_name: rule.rule_name,
          rule_type: rule.rule_type,
        });
      }
    });

    return riskGrader;
  };

  private generateRuleEvaluation = (rule: ScorecardRule) => {
    return (state: CreditProcessState) => runComparison(rule, state);
  };
}
