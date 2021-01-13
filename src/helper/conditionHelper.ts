import { CreditProcessState } from '../interface/CreditProcessState';
import { Rule } from '../interface/Rule';
import { RuleType } from '../enum/RuleType';
import { runComparison } from './compareHelper';
import { StrategySegment } from '../interface/StrategySegment';

export const filterSegmentsByConditions = (
  segments: StrategySegment[],
  state: CreditProcessState,
) => {
  return segments.filter((segment) => checkSegmentConditions(segment, state));
};

export const checkSegmentConditions = (segment: StrategySegment, state: CreditProcessState) => {
  const ruleGroups = new Map<string, boolean>();

  segment.conditions.forEach((condition: Rule) => {
    const { rule_name, rule_type } = condition;

    const previousResult = ruleGroups.get(rule_name);

    let passed = runComparison(condition, state);

    if (!previousResult) {
      ruleGroups.set(rule_name, passed);
      return;
    }

    switch(rule_type) {
      case RuleType.Or:
        passed = previousResult || passed;
        break;
      case RuleType.And:
        passed = previousResult && passed;
        break;
    }

    ruleGroups.set(rule_name, passed);
  });

  return [...ruleGroups.values()].every((result) => result);
};
