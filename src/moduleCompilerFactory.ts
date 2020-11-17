import { CompiledStrategy } from './interface/CompiledStrategy';
import { DataIntegrationModule, Module } from './interface/Module';
import { ModuleType } from './enum/ModuleType';
import Assignments, { IAssignmentsModuleCompilationOptions } from './module/assignments';
import Calculations, { ICalculationsModuleCompilationOptions } from './module/calculations';
import DataIntegrations, { IDataIntegrationsModuleCompilationOptions } from './module/data-integrations';
import MachineLearning, { IMachineLearningModuleCompilationOptions } from './module/machine-learning';
import Output, { IOutputModuleCompilationOptions } from './module/output';
import Requirements, { IRequirementsModuleCompilationOptions } from './module/requirements';
import Scorecard, { IScorecardModuleCompilationOptions } from './module/scorecard';

type IModuleCompilationOptions = IAssignmentsModuleCompilationOptions
  | ICalculationsModuleCompilationOptions
  | IDataIntegrationsModuleCompilationOptions
  | IMachineLearningModuleCompilationOptions
  | IOutputModuleCompilationOptions
  | IRequirementsModuleCompilationOptions
  | IScorecardModuleCompilationOptions;

const getEvaluator = (module: Module, strategy: CompiledStrategy) => {
  const options = {
    segments: module.segments,
    module_name: module.name,
    module_type: module.type,
    integration: (module as DataIntegrationModule).dataintegration,
    module_display_name: module.display_name,
    input_variables: strategy.input_variables,
    output_variables: strategy.output_variables,
  } as IModuleCompilationOptions;

  switch (module.type) {
    case ModuleType.artificialintelligence:
      return new MachineLearning(options as IMachineLearningModuleCompilationOptions);
    case ModuleType.assignments:
      return new Assignments(options as IAssignmentsModuleCompilationOptions);
    case ModuleType.calculations:
      return new Calculations(options as ICalculationsModuleCompilationOptions);
    case ModuleType.dataintegration:
      return new DataIntegrations(options as IDataIntegrationsModuleCompilationOptions);
    case ModuleType.output:
      return new Output(options as IOutputModuleCompilationOptions);
    case ModuleType.requirements:
      return new Requirements(options as IRequirementsModuleCompilationOptions);
    case ModuleType.scorecard:
      return new Scorecard(options as IScorecardModuleCompilationOptions);
    default:
      throw new Error(`Unknown module type (${module.type})`);
  }
};

export default (module: Module, strategy: CompiledStrategy) => {
  const evaluator = getEvaluator(module, strategy);

  return evaluator.evaluate;
};
