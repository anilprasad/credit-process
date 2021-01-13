import Calculations from '../src/module/calculations';
import { CommonModule } from '../src/interface/Module';
import { CompiledStrategy } from '../src/interface/CompiledStrategy';
import moduleCompilerFactory from '../src/moduleCompilerFactory';
import { ModuleType } from '../src/enum/ModuleType';
jest.mock('../src/module/calculations');

describe('Module Compiler Factory', () => {
  it('creates calculations module evaluator', () => {
    const evaluateFnMock = Calculations.prototype.evaluate = jest.fn();
    const module = {
      segments: [{
        name: 'segnemt',
      }],
      name: 'some name',
      type: ModuleType.Calculations,
      display_name: 'Some Name',
    };

    const strategy = {
      input_variables: [],
      output_variables: [],
    };

    const evaluator = moduleCompilerFactory(
      module as unknown as CommonModule,
      strategy as unknown as CompiledStrategy,
    );

    const options = {
      segments: module.segments,
      module_name: module.name,
      module_type: module.type,
      module_display_name: module.display_name,
      input_variables: strategy.input_variables,
      output_variables: strategy.output_variables,
    };

    expect(Calculations).toBeCalledWith(options);
    expect(evaluator).toBe(evaluateFnMock);
  });

  it('throws error about unknown module type', () => {
    const module = {
      segments: [{
        name: 'segnemt',
      }],
      name: 'some name',
      type: 'anyothertype',
      display_name: 'Some Name',
    };

    const strategy = {
      input_variables: [],
      output_variables: [],
    };

    expect(() => {
      moduleCompilerFactory(
        module as unknown as CommonModule,
        strategy as unknown as CompiledStrategy,
      );
    }).toThrow(`Unknown module type (${module.type})`);
  });
});
