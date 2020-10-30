import CreditProcessState from 'type/CreditProcessState';
import Rule from 'type/Rule';
import { VariableInputType } from 'enum/VariableInputType';
import { RuleType } from 'enum/RuleType';
import { CompareOperand } from 'enum/CompareOperand';
import { compareOperands } from 'compare/operands';
import { ConditionTest } from 'enum/ConditionTest';
import { StateSegment } from 'type/StateSegment';

export class ConditionsChecker {
  private ruleGroups = new Map<string, boolean>();

  public checkSegment = (segment: StateSegment, state: CreditProcessState) => {
    this.ruleGroups.clear();

    segment.conditions.forEach((condition: Rule) => {  
      const compareOperand = condition.condition_test.toLowerCase().replace(/\s+/g, '') as CompareOperand;
      const { compareTo, rangeMin, rangeMax } = this.assignVariables(condition, state);
  
      const variableValue = state[condition.variable_name];
      const conditionResult = compareOperand === CompareOperand.range
        ? compareOperands[compareOperand](variableValue, rangeMin, rangeMax)
        : compareOperands[compareOperand](variableValue, compareTo);
  
      this.addRuleToGroup(condition.rule_name, conditionResult, condition.rule_type);
    });
  
    return [...this.ruleGroups.values()].every((result) => result);
  };

  private addRuleToGroup(ruleName: string, ruleResult: boolean, ruleType: RuleType) {
    switch(ruleType) {
      case RuleType.Or:
        const orResult = this.ruleGroups.has(ruleName)
          ? this.ruleGroups.get(ruleName)! || ruleResult
          : ruleResult;

        this.ruleGroups.set(ruleName, orResult);
        break;
      case RuleType.And:
        const andResult = this.ruleGroups.has(ruleName)
          ? this.ruleGroups.get(ruleName)! && ruleResult
          : ruleResult;

        this.ruleGroups.set(ruleName, andResult);
        break;
      default:
        this.ruleGroups.set(ruleName, ruleResult);
        break;
    }
  }

  private assignVariables = (condition: Rule, state: CreditProcessState) => {
    const {
      value_comparison,
      value_comparison_type,
      value_minimum,
      value_minimum_type,
      value_maximum,
      value_maximum_type,
      condition_test,
    } = condition;
  
    if (condition_test === ConditionTest.Range) {
      return {
        rangeMin: this.getVariableValue(value_minimum, value_minimum_type, state),
        rangeMax: this.getVariableValue(value_maximum, value_maximum_type, state),
      };
    }
  
    return {
      compareTo: this.getVariableValue(value_comparison, value_comparison_type, state),
    };
  }

  private getVariableValue = (value: any, type: VariableInputType, state: CreditProcessState) => {
    const assignedValue = value && type === VariableInputType.Variable
      ? state[value]
      : value;
    
    if (assignedValue === undefined) {
      throw new Error(`The Variable ${value} is required by a Rule but is not defined.`);
    }
  
    return assignedValue;
  }
}
