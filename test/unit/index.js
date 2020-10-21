'use strict';
/*jshint expr: true*/
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const credit = require('../../credit');
const main = require('../../index');
const { SAMPLE_ENGINE, INVALID_ENGINE } = require('../mocks');

let resources = {
  datas: {},
  logger: {},
};

function underwriting(engines = [ SAMPLE_ENGINE ]) {
  return async () => credit.load_strategy_pipeline(engines);
}

describe('Index', function () {
  describe('generateCreditSegments', async () => {
    it('should return a segment evaluator function', async function () {
      const { generateCreditSegments, } = main.call({ underwriting: underwriting() }, resources);
      const result = await generateCreditSegments({}, true);

      expect(result).to.be.a('function');
    });
    it('should handle rejection from loading the pipeline', async function () {
      try {
        const { generateCreditSegments, } = main.call({ underwriting: underwriting([ INVALID_ENGINE ]) }, resources);
        await generateCreditSegments({}, true);

        throw new Error('should not get in here');
      } catch (e) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.equal('ERROR: pipe can only be called with functions - argument 0: undefined');
      }
    });
  });
});

