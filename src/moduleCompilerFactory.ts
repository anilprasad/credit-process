import Assignments, { IAssignmentsModuleCompilationOptions } from './module/assignments';
import Calculations, { ICalculationsModuleCompilationOptions } from './module/calculations';
import { DataIntegrationModule, Module } from './interface/Module';
import DataIntegrations, { IDataIntegrationsModuleCompilationOptions } from './module/data-integrations';
import MachineLearning, { IMachineLearningModuleCompilationOptions } from './module/machine-learning';
import Output, { IOutputModuleCompilationOptions } from './module/output';
import Requirements, { IRequirementsModuleCompilationOptions } from './module/requirements';
import Scorecard, { IScorecardModuleCompilationOptions } from './module/scorecard';
import { CompiledStrategy } from './interface/CompiledStrategy';
import { ModuleType } from './enum/ModuleType';

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
    case ModuleType.MachineLearning:
      return new MachineLearning(options as IMachineLearningModuleCompilationOptions);
    case ModuleType.Assignments:
      return new Assignments(options as IAssignmentsModuleCompilationOptions);
    case ModuleType.Calculations:
      return new Calculations(options as ICalculationsModuleCompilationOptions);
    case ModuleType.DataIntegration:
      return new DataIntegrations(options as IDataIntegrationsModuleCompilationOptions);
    case ModuleType.Output:
      return new Output(options as IOutputModuleCompilationOptions);
    case ModuleType.Requirements:
      return new Requirements(options as IRequirementsModuleCompilationOptions);
    case ModuleType.Scorecard:
      return new Scorecard(options as IScorecardModuleCompilationOptions);
    default:
      throw new Error(`Unknown module type (${module.type})`);
  }
};

export default (module: Module, strategy: CompiledStrategy) => {
  const evaluator = getEvaluator(module, strategy);

  return evaluator.evaluate;
};
