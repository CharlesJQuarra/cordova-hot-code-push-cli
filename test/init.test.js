const sinon = require('sinon');
let prompt = require('prompt');
let fs = require('fs');
let Init = require('./../src/init.js');


const withBucket = {
  name: 'name',
  s3region: 'us-east-1',
  s3bucket: 'bucket',
  s3prefix: 'pre/fix/',
  ios_identifier: 'ios',
  android_identifier: 'android',
  update: 'resume',
};

const contentUrl = {
  content_url: 'http://url',
};

const expectedContentWithBucket = {
  name: 'name',
  s3region: 'us-east-1',
  s3bucket: 'bucket',
  s3prefix: 'pre/fix/',
  ios_identifier: 'ios',
  android_identifier: 'android',
  update: 'resume',
  content_url: 'https://s3.amazonaws.com/bucket/pre/fix/'
};

describe('init', () => {
  let sandbox;
  let get;
  let writeFile;
  let initInstance;
  let executePromise;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('when bucket is set', () => {
    beforeEach(() => {
      get = sandbox.stub( prompt, 'get');
      writeFile = sandbox.stub();
      get.callsFake(stubPromptGet(withBucket));
      writeFile.callsFake((filename, data, cb) => cb());

      initInstance = Init({ writeFile: writeFile, prompt: prompt });

      let contextArgs = { 'argv': []}
      executePromise = initInstance.execute(contextArgs);
    });

    it('should call prompt.get once', () => executePromise.then(() => sinon.assert.calledOnce(get)));

    it('should write to file once', () => executePromise.then(() => sinon.assert.calledOnce(writeFile)));

    it('should write to correct file name', () => executePromise.then(() => sinon.assert.calledWith(writeFile.firstCall, sinon.match((val)=> val.match(/cordova-hcp\.json$/)), sinon.match.any, sinon.match.func)));

    it('should write to correct file content', () => executePromise.then(() => {

      var content = JSON.parse(writeFile.args[0][1]);
      sinon.assert.match(content, expectedContentWithBucket);
    }));
  });
});

function stubPromptGet(result) {
  return function (props, callback) {
    if (props.properties && props.properties.s3region) {
      callback(null, result);
    } else if (props.properties && props.properties.content_url) {
      callback(null, contentUrl);
    }
  };
}
