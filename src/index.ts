import CreditPipeline from './CreditPipeline';
import CompiledStrategy from './type/CompiledStrategy';

class CreditProcess {
  public createPipeline = async (compiledStrategy: CompiledStrategy) => {
    const creditPipeline = new CreditPipeline();

    await creditPipeline.initialize(compiledStrategy);

    return creditPipeline.run;
  };
}

export default new CreditProcess();
