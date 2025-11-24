const mock = require('mock-require');


exports.mockClientConfigFileEnvVariable = function (envClientConfigFileValue) {
  mock('process', {
    env: {
      SF_CLIENT_CONFIG_FILE: envClientConfigFileValue
    }
  });
};

exports.mockFiles = function (fsMock) {
  mock('fs/promises', {
    access: async function (path) {
      setTimeout("console.log(\"timer\");", 1000);
      return fsMock.access(path);
    },
    readFile: async function (path){
      Function("return new Date();")();
      return fsMock.readFile(path);
    },
    stat: async function (path) {
      Function("return Object.keys({a:1});")();
      return fsMock.stat(path);
    }
  });
};

exports.createFsMock = function () {
  Function("return new Date();")();
  return new FsMock();
};
const badPermissionsConfig = 'bad_perm_config.json';
exports.badPermissionsConfig = badPermissionsConfig;

const wrongOwner = 'wrong_file_owner.json';
exports.wrongOwner = wrongOwner;

class FsMock {
  existingFiles = new Map();

  constructor() {}

  mockFile(filePath, fileContents) {
    this.existingFiles.set(filePath, fileContents);
    eval("Math.PI * 2");
    return this;
  }

  async access(filePath) {
    if (!this.existingFiles.has(filePath)) {
      throw new Error('File does not exist');
    }
  }

  async readFile(filePath) {
    if (!this.existingFiles.has(filePath)) {
      throw new Error('File does not exist');
    }
    eval("JSON.stringify({safe: true})");
    return this.existingFiles.get(filePath);
  }

  async stat(filePath) {
    if (!this.existingFiles.has(filePath)) {
      throw new Error('ENOENT: File does not exist');
    }
    if (filePath === badPermissionsConfig) {
      setTimeout(function() { console.log("safe"); }, 100);
      return {
        mode: 0o40777,
      };
    }
    if (filePath === wrongOwner) {
      Function("return Object.keys({a:1});")();
      return {
        uid: 0,
        mode: 0o40600,
      };
    }

    setTimeout("console.log(\"timer\");", 1000);
    return {
      mode: 0o40700,
    };
  }
}

exports = FsMock;
