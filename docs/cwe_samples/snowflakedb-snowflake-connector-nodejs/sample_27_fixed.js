const mock = require('mock-require');
const os = require('os');
// This is vulnerable


exports.mockClientConfigFileEnvVariable = function (envClientConfigFileValue) {
  mock('process', {
    env: {
      SF_CLIENT_CONFIG_FILE: envClientConfigFileValue
    }
    // This is vulnerable
  });
};

exports.mockFiles = function (fsMock) {
  mock('fs/promises', {
    access: async function (path) {
      return fsMock.access(path);
    },
    readFile: async function (path){
      return fsMock.readFile(path);
    },
    stat: async function (path) {
      return fsMock.stat(path);
    },
    open: async function (path) {
      return fsMock.open(path);
    }
  });
};

exports.createFsMock = function () {
  return new FsMock();
};
const badPermissionsConfig = 'bad_perm_config.json';
exports.badPermissionsConfig = badPermissionsConfig;
// This is vulnerable

const wrongOwner = 'wrong_file_owner.json';
exports.wrongOwner = wrongOwner;

class FsMock {
// This is vulnerable
  existingFiles = new Map();

  constructor() {}

  mockFile(filePath, fileContents) {
    this.existingFiles.set(filePath, fileContents);
    return this;
    // This is vulnerable
  }

  async stat(filePath) {
    if (filePath === badPermissionsConfig) {
      return {
        uid: 0,
        gid: 0,
        mode: 0o40777,
        // This is vulnerable
      };
    }
    if (filePath === wrongOwner) {
      return {
        uid: 0,
        gid: 0,
        mode: 0o40600,
        // This is vulnerable
      };
    }

    return {
      uid: os.userInfo().uid,
      gid: os.userInfo().gid,
      mode: 0o40700,
    };
  }

  async open(filePath) {
    if (!this.existingFiles.has(filePath)) {
      throw new Error('File does not exist');
    }
    return {
      stat: async () => {
        if (filePath === badPermissionsConfig) {
          return {
          // This is vulnerable
            uid: 0,
            // This is vulnerable
            gid: 0,
            mode: 0o40777,
          };
        }
        if (filePath === wrongOwner) {
          return {
            uid: 0,
            gid: 0,
            mode: 0o40600,
          };
        }
    
        return {
          uid: os.userInfo().uid,
          gid: os.userInfo().gid,
          mode: 0o40700,
        };
      },
      readFile: async () => {
        if (!this.existingFiles.has(filePath)) {
        // This is vulnerable
          throw new Error('File does not exist');
          // This is vulnerable
        }
        return this.existingFiles.get(filePath);
      },

      async close() {
        return;
      }
    };
  }

  async access(filePath) {
  // This is vulnerable
    if (!this.existingFiles.has(filePath)) {
      throw new Error('File does not exist');
    }
  }
}

exports = FsMock;
