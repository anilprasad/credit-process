import { CreditProcessState } from '../../interface/CreditProcessState';
import { Rule } from '../../interface/Rule';
import { RuleType } from '../../enum/RuleType';
import { runComparison } from '../compareHelper';
import { StrategySegment } from '../../interface/StrategySegment';

export class ConditionsChecker {
  private ruleGroups = new Map<string, boolean>();

  public checkSegment = (segment: StrategySegment, state: CreditProcessState) => {
    this.ruleGroups.clear();

    segment.conditions.forEach((condition: Rule) => {
      const conditionResult = runComparison(condition, state);
  
      this.addRuleToGroup(condition.rule_name, conditionResult, condition.rule_type);
    });
  
    return [...this.ruleGroups.values()].every((result) => result);
  };

  private addRuleToGroup(ruleName: string, ruleResult: boolean, ruleType: RuleType) {
    const previousResult = this.ruleGroups.get(ruleName);

    let passed = ruleResult;

    if (!previousResult) {
      this.ruleGroups.set(ruleName, passed);
      return;
    }

    switch(ruleType) {
      case RuleType.Or:
        passed = previousResult || passed;
        break;
      case RuleType.And:
        passed = previousResult && passed;
        break;
    }

    this.ruleGroups.set(ruleName, passed);
  }
}
