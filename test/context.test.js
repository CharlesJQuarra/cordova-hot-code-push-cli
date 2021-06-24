const sinon = require('sinon');
let chcpContext = require('./../src/context.js');
let fs = require('fs-extra');
let _ = require('lodash');

let BUILD_TEST_FOLDER = 'test/build_1';

describe('context', () => {
  let sandbox;
  let writeFile;
  let contextArgs;
  let context;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('when command line arguments are NOT set', () => {
    describe('for defaults', () => {
      beforeEach(() => {
        contextArgs = { _: ['build']}
        context = chcpContext.context(contextArgs);
      });

      it('sourceDirectory should be set', () => sinon.assert.match(context.sourceDirectory, 'www'))
    });
  });

  describe('when command line arguments are set', () => {
    describe('for sourceDirectory', () => {
      describe('as positional argument', () => {
        beforeEach(() => {
          contextArgs = { _: ['build', BUILD_TEST_FOLDER]}
          context = chcpContext.context(contextArgs);
        });

        it('should parse first argument as sourceDirectory', () => sinon.assert.match(context.sourceDirectory, BUILD_TEST_FOLDER));
      });
      describe('as keyword arguments', () => {
        beforeEach(() => {
          contextArgs = { _: ['build'], "sourceDir": BUILD_TEST_FOLDER}
          context = chcpContext.context(contextArgs);
        });

        it('should parse keyword argument sourceDir as sourceDirectory', () => sinon.assert.match(context.sourceDirectory, BUILD_TEST_FOLDER));
      });
    });
  });

});
