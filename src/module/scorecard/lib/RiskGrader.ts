import { CreditProcessState } from '../../../interface/CreditProcessState';
import { RuleType } from '../../../enum/RuleType';
import { VariableInputType } from '../../../enum/VariableInputType';

interface IRiskGraderRule {
  evaluation: (state: CreditProcessState) => boolean;
  weight_type: VariableInputType;
  weight: number;
  rule_name: string;
  rule_type: RuleType;
}

interface IConstantContribution {
  contribution: number;
  label: string;
}

interface IContribution {
  contribution: number;
  label: string;
  passed: boolean;
}

export class RiskGrader {
  private rules: IRiskGraderRule[] = [];
  private constantWeight = 0;
  private contributions: (IContribution | IConstantContribution)[] = [];

  public insertRule = (rule: IRiskGraderRule) => {
    this.rules.push(rule);
  }

  public insertConstantContribution = (weight: number, contributionLabel: string) => {
    this.constantWeight += weight;
    this.contributions.push({
      contribution: weight,
      label: contributionLabel,
    });
  }

  public score = (state: CreditProcessState) => {
    let totalWeight = this.constantWeight;

    const top: IContribution[] = [];
    const contributionIndex: string[] = [];

    const rulesMap = new Map<string, IRiskGraderRule[]>();

    this.rules.forEach(rule => {
      const ruleCopy = { ...rule };

      if (!ruleCopy.rule_name) {
        ruleCopy.rule_name = 'solo';
      }

      rulesMap.set(ruleCopy.rule_name, (rulesMap.get(ruleCopy.rule_name) || []).concat([ruleCopy]));
    });

    [...rulesMap.values()].forEach((rules) => {
      if (rules[0].weight_type === VariableInputType.Variable && state[ rules[0].weight ] === undefined) {
        throw new Error(`The Variable ${rules[0].weight} is required by a Rule but is not defined.`);
      }

      const results = rules.map(rule => rule.evaluation(state));
      const variableWeight = rules[0].weight_type === VariableInputType.Variable
        ? state[rules[0].weight] as number
        : rules[0].weight;

      let passed: boolean;

      switch (rules[0].rule_type) {
        case RuleType.And:
          passed = results.every(result => result);
          break;
        case RuleType.Or:
          passed = results.some(result => result);
          break;
        default:
          passed = results[0];
          break;
      }

      const result = {
        contribution: Number(passed ? variableWeight : 0),
        passed,
        label: rules[0].rule_name,
      };

      if (contributionIndex.indexOf(result.label) !== -1) {
        const index = contributionIndex.indexOf(result.label);

        if (passed) {
          totalWeight += variableWeight;
        }

        top[index].contribution += result.contribution;
      } else {
        contributionIndex.push(result.label);

        if (passed) {
          totalWeight += variableWeight;
        }

        top.push(result);
      }
    });

    return {
      base_score: totalWeight,
      contributions: top.sort((a, b) => b.contribution - a.contribution),
    };
  }
}
