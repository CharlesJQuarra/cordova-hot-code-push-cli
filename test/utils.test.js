let Utils = require('./../src/utils.js');
const sinon = require('sinon');
let fs = require('fs');
let assert = require('assert');
let _ = require('lodash');


describe('writeFile', () => {
  let sandbox, stub;
  let testDeps;
  let utils;

  beforeEach(() => sandbox = sinon.createSandbox());
  afterEach(() => sandbox.restore());


  //beforeEach(MockPromise.replace);
  //afterEach(MockPromise.restore);

  beforeEach(() => {
    stub= sandbox.stub();
    testDeps = { writeFile: stub };
    stub.callsFake((filename, data, cb) => cb());
    utils = Utils({ writeFile: stub });
  });

  it('uses the fs.writeFile function once', () => {
    utils.writeToFile('bla.bar', 'stuff').then(() => expect(stub).to.have.been.calledOnce);
  });

  it('calls fs.write with stringified JSON argument', () => {
    utils.writeToFile('bla.bar', {foo:42}).then(() => {
      var filenameArg = stub.args[0][0];
      var contentArg = JSON.parse(stub.args[0][1]);
      expect(filenameArg).to.equal('bla.bar');
      expect(contentArg).to.eql({foo:42})
    });
  });


});

describe('mergeObject', () => {
  it('copies deep objects', () => {
    let a = { a:1, foo:42 };
    let b = { a:"b", c:7 };
    let c = _.merge(a, b);
    assert.deepStrictEqual(c, { a:"b" , foo:42, c: 7}, `mergeObject should properly merge deep properties: ${JSON.stringify(c)}`);
  });
});
