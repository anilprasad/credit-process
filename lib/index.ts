import CreditPipeline from './CreditPipeline';
import segmentLoader from './segmentLoader';
import CompiledStrategy from './types/CompiledStrategy';

class CreditProcess {

  /**
   * 
   * Creates decision segments. Wrapper function around the credit pipeline function in the credit.js file
   * 
   * @param {Object} query Query to be used to load compiled strategies
   * @param {bool} force if false will reload the pipelines instead of using the already existing pipelines
   * @param {Object} options options to be used to load compiled strategies
   * @return {Promise} Returns promise that resolves to loaded credit pipelines
   */
  public generateCreditSegments = async (compiledStrategy: CompiledStrategy) => {
    const creditPipeline = new CreditPipeline();

    const pipeline = await creditPipeline.getCreditPipeline(compiledStrategy);

    const segment = segmentLoader.generateEvaluators({
      conditions: [],
      engine: pipeline.evaluator,
      organization: pipeline.organization,
    });
    
    return segmentLoader.evaluate(segment);
  };
}

export default CreditProcess;
