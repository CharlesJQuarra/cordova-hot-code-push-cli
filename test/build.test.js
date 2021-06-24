const sinon = require('sinon');
let Build = require('./../src/build.js');
let chcpContext = require('./../src/context.js');
let fs = require('fs-extra');
let _ = require('lodash');

let BUILD_TEST_FOLDER = 'test/build_1';

describe('build', () => {
  let sandbox;
  let buildInstance;
  let writeFile;
  let buildPromise;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('when build context is set', () => {
    beforeEach(() => {
      writeFile = sandbox.stub(fs, 'writeFile');
      writeFile.callsFake((filename, data, cb) => cb());
      buildInstance = Build({ fs: fs });

      let contextArgs = { _: ['build', BUILD_TEST_FOLDER] ,"generateConfigIfMissing": true}
      let context = chcpContext.context(contextArgs);
      buildPromise = buildInstance.execute(context);
    });

    afterEach(() => {

    });

    it('should write manifest and build info to correct file names', () => buildPromise.then((config) => {
      //console.log(`config object: ${JSON.stringify(config)}`);
      //console.log(`writeFile.firstCall: ${writeFile.firstCall.args}`);
      sinon.assert.match(config, sinon.match({ "autogenerated": true, "release": sinon.match.any }))
      sinon.assert.calledWith(writeFile.firstCall, sinon.match((val)=> val.match(/chcp\.manifest$/)), sinon.match((val) => _.isEqual(JSON.parse(val), [{
        "file": "app.scss",
        "hash": "d3362adb6fb407103ee09c0d7896b7cc"
      },
      {
        "file": "index.html",
        "hash": "a8b71b3c1b0b86e5773248233e43d079"
      },
      {
        "file": "index.js",
        "hash": "09e5213333f0f2aa0b453eafafd76276"
      }])), sinon.match.func);
      sinon.assert.calledWith(writeFile.secondCall, sinon.match((val)=> val.match(/chcp\.json$/)), sinon.match.any, sinon.match.func);
    }));

  });

  describe('for defaultConfig', () => {
    describe('if config is not found and generateConfigIfMissing is not set', () => {
      beforeEach(() => {
        writeFile = sandbox.stub(fs, 'writeFile');
        writeFile.callsFake((filename, data, cb) => cb());
        buildInstance = Build({ fs: fs });
        let contextArgs = { _: ['build'] }
        let context = chcpContext.context(contextArgs);
        buildPromise = buildInstance.execute(context);
      });

      it('build step should fail', () => buildPromise.then(() => {
        sinon.assert.fail('If we see this line, it means the build step proceeded despite the failure expectation');
      }).catch((error) => {
        sinon.assert.match(error, sinon.match({ error: sinon.match(/no configuration file found/)}));
      }));
    })
  })

});
