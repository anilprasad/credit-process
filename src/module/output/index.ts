import * as variableHelper from '../../helper/variableHelper';
import { AbstractModule, IBasicModuleCompilationOptions } from '../abstract';
import { BasicStrategySegment } from '../abstract/interface/BasicStrategySegment';
import { CreditProcessState } from '../../interface/CreditProcessState';
import { ModuleType } from '../../enum/ModuleType';
import { OutputStateSegment } from './interface/OutputStateSegment';
import { Rule } from '../../interface/Rule';
import { RuleType } from '../../enum/RuleType';
import { runComparison } from '../../helper/compareHelper';
import { VariableInputType } from '../../enum/VariableInputType';
import { VariableValue } from '../../type/VariableValue';

export interface IOutputModuleCompilationOptions extends IBasicModuleCompilationOptions {
  module_type: ModuleType.Output;
}

export default class Output extends AbstractModule<BasicStrategySegment, OutputStateSegment> {
  private ruleGroups = new Map<string, { passed: boolean, conditionOutput: Rule['condition_output'] }>();
  private ruleResults: Array<{ name: string, passed: boolean, conditionOutput: Rule['condition_output'] }> = [];
  private outputTypes: Record<string, VariableInputType> = {};

  constructor(options: IOutputModuleCompilationOptions) {
    super(options);
  }

  protected evaluateSegment = async (
    segment: BasicStrategySegment,
    state: CreditProcessState
  ): Promise<OutputStateSegment> => {
    const _state = { ...state };

    this.runEvaluation(segment.ruleset, _state);

    let allPassed = true;
    const output: Record<string, VariableValue> = {};

    for (const { passed, conditionOutput } of this.ruleGroups.values()) {
      allPassed = allPassed && passed;

      if (!passed) {
        continue;
      }

      for (const key in conditionOutput) {
        output[key] = variableHelper.getVariableValue(
          conditionOutput[key],
          this.outputTypes[key],
          state,
        );
      }
    }

    return {
      name: this.moduleName || '',
      type: ModuleType.Output,
      passed: allPassed,
      segment: segment.name,
      rules: this.ruleResults,
      output,
    };
  }

  private runEvaluation = (ruleset: Rule[], state: CreditProcessState) => {
    for (const rule of ruleset) {
      const conditionResult = runComparison(rule, state);

      this.addRuleToGroup(
        rule.rule_name,
        conditionResult,
        rule.rule_type,
        rule.condition_output || {},
      );

      this.ruleResults.push({
        name: rule.rule_name,
        passed: conditionResult,
        conditionOutput: rule.condition_output || {},
      });

      this.outputTypes = {
        ...this.outputTypes,
        ...rule.condition_output_types,
      };
    }
  };

  private addRuleToGroup(
    ruleName: string,
    ruleResult: boolean,
    ruleType: RuleType,
    conditionOutput: Rule['condition_output'],
  ) {
    const previousResult = this.ruleGroups.get(ruleName);

    let passed = ruleResult;

    if (!previousResult) {
      this.ruleGroups.set(ruleName, { passed, conditionOutput });
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
        conditionOutput: {
          ...previousResult.conditionOutput,
          ...conditionOutput,
        },
      }
    );
  }
}
