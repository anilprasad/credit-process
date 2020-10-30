import CreditProcessState from '../type/CreditProcessState';
import CommonModule from '../type/Module';
import Segment from '../type/StrategySegment';
import artificialIntelligenceStateTransformer from './ArtificialIntelligenceStateTransformer';
import assignmentsStateTransformer from './AssignmentsStateTransformer';
import calculationsStateTransformer from './CalculationsStateTransformer';
import dataIntegrationStateTransformer from './DataIntegrationStateTransformer';
import outputStateTransformer from './OutputStateTransformer';
import requirementsStateTransformer from './RequirementsStateTransformer';
import scoreCardStateTransformer from './ScoreCardStateTransformer';

const moduleStateTransformerToType = {
  artificialintelligence: artificialIntelligenceStateTransformer,
  assignments: assignmentsStateTransformer,
  calculations: calculationsStateTransformer,
  dataintegration: dataIntegrationStateTransformer,
  output: outputStateTransformer,
  requirements: requirementsStateTransformer,
  scorecard: scoreCardStateTransformer,
};

class StateManager {
  public updateStateWithModuleResults = async (module: CommonModule, moduleResult: Segment | Segment[], state: CreditProcessState) => {
    state.credit_process = state.credit_process || [];
  
    if (state.error) {
      return Promise.reject({
        ...state,
        message: `Error in ${module.type} module ${module.name}: ${state.error.message}`,
      });
    }
  
    const segments = Array.isArray(moduleResult) ? moduleResult : [moduleResult];
  
    const moduleStateTransformer = new moduleStateTransformerToType[module.type]();
    
    return moduleStateTransformer.transform(module, segments, state);
  };
}

export default new StateManager();
