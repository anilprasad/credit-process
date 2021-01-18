import { CompiledStrategy } from './interface/CompiledStrategy';
import CreditPipeline from './CreditPipeline';

export const createPipeline = async (compiledStrategy: CompiledStrategy) => {
  const creditPipeline = new CreditPipeline();

  await creditPipeline.initialize(compiledStrategy);

  return creditPipeline.run;
};
