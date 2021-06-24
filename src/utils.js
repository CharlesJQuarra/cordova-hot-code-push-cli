let fs = require('fs');
let prompt = require('prompt');

class FunctionWithDeps extends Function {
  constructor() {
    super('...args', 'return this.__self__.__call__(...args)')
    var self = this.bind(this)
    this.__self__ = self
    return self
  }

  // Example `__call__` method.
  __call__() {
    throw new Error("unimplemented"); //return [a, b, c];
  }
};


const OverrideableDepsCls = function(objArgs) {
  objArgs = (!objArgs) ? {} : objArgs;
  let { writeFile = fs.writeFile, prompt = prompt } = objArgs;
  this.writeFile = writeFile;
  this.prompt = prompt;
};

const Depends = function(objArgs) {
  return new OverrideableDepsCls(objArgs);
}

function Utils(deps = Depends()) {
  this.deps = deps;
  let prompt = deps.prompt;
  let writeFile = deps.writeFile;


  this.writeToFile = function(file, content) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify(content, null, 2);
      writeFile(file, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  this.getInput = function(prompt, props) {
    return new Promise(resolve => prompt.get(props, (err, result) => resolve(result, err)));
  }
};
Utils.Depends = Depends;
module.exports = function(objArg) {
  return new Utils(Depends(objArg));
};

function MockPromise(func) {
  var status = {
    resolve (data) {
      status.data = data;
      status.resolved = true
    },
    rejected (data) {
      status.data = data;
      status.rejected = true;
    }
  };
  func(status.resolve, status.reject);

  function resolver(data) {
    return {
      then(cb) {
        var tmp = cb(data);
        return resolver(tmp);
      }
    }
  }
  return {
    then(success, fail) {
      if (status.resolved) {
        var val = success(status.data)
        return resolver(val);
      } else {
        fail(status.data)
      }
    }
  }
}
