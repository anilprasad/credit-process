import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { BasicStrategySegment } from '../abstract/interface/BasicStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import { RequirementsStateSegment } from './interface/RequirementsStateSegment';
import { Rule } from '../../interface/Rule';
import { RuleType } from '../../enum/RuleType';
import { runComparison } from '../../helper/compareHelper';
import { VariableInputType } from '../../enum/VariableInputType';

export interface IRequirementsModuleCompilationOptions extends IBasicModuleCompilationOptions {
  module_type: ModuleType.Requirements;
}

export default class Requirements extends AbstractModule<BasicStrategySegment, RequirementsStateSegment> {
  private ruleGroups = new Map<string, { passed: boolean, declineReasons: string[] }>();
  private ruleResults: Array<{ name: string, passed: boolean, decline_reasons: string[] }> = [];

  constructor(options: IRequirementsModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: BasicStrategySegment,
    state: CreditProcessState
  ): Promise<RequirementsStateSegment> => {
    const _state = { ...state };

    this.runEvaluation(segment.ruleset, _state);

    const passed = [...this.ruleGroups.values()].every(({ passed }) => passed);
    const decline_reasons = [...this.ruleGroups.values()]
      .reduce((acc: string[], { declineReasons }) => acc.concat(declineReasons), [])
      .filter(this.onlyUnique);

    return {
      type: ModuleType.Requirements,
      passed,
      name: this.moduleName || '',
      segment: segment.name,
      decline_reasons,
      rules: this.ruleResults,
    };
  };

  private runEvaluation = (ruleset: Rule[], state: CreditProcessState) => {
    for (const rule of ruleset) {
      const conditionResult = runComparison(rule, state);

      if (!rule.condition_output_types || !rule.condition_output) {
        throw new Error(`Rule ${rule.rule_name} doesn't have condition output configured properly`);
      }

      const conditionDeclineReasons = !conditionResult ? this.handleDeclineReasons(
        state,
        rule.condition_output_types.decline_reason,
        rule.condition_output.decline_reason as string,
      ) : [];

      this.addRuleToGroup(
        rule.rule_name,
        conditionResult,
        rule.rule_type,
        conditionDeclineReasons,
      );

      this.ruleResults.push({
        name: rule.rule_name,
        passed: conditionResult,
        decline_reasons: conditionDeclineReasons,
      });
    }
  };

  private addRuleToGroup(ruleName: string, ruleResult: boolean, ruleType: RuleType, declineReasons: string[]) {
    const previousResult = this.ruleGroups.get(ruleName);

    let passed = ruleResult;

    if (!previousResult) {
      this.ruleGroups.set(ruleName, { passed, declineReasons });
      return;
    }

    switch(ruleType) {
      case RuleType.Or:
        passed = previousResult.passed || passed;
        break;
      case RuleType.And:
        passed = previousResult.passed && passed;
        break;
    }

    this.ruleGroups.set(
      ruleName,
      {
        passed,
        declineReasons: [
          ...previousResult.declineReasons,
          ...declineReasons,
        ],
      }
    );
  }

  private handleDeclineReasons = (
    state: CreditProcessState,
    outputType: VariableInputType,
    declineReason: string | string[],
  ) => {
    const declineReasons = Array.isArray(declineReason) ? declineReason : [declineReason];

    return declineReasons.map(declineReason => {
      if (outputType !== VariableInputType.Variable) {
        return declineReason;
      }

      if (state[declineReason] === undefined) {
        throw new Error(`The Variable ${declineReason} is required by a Rule but is not defined.`);
      }

      return state[declineReason] as string;
    });
  };

  private onlyUnique = (value: string, index: number, self: string[]) => {
    return value && self.indexOf(value) === index;
  };
}
