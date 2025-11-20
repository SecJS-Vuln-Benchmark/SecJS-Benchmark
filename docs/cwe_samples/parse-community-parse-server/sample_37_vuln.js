'use strict';
const dns = require('dns');
const semver = require('semver');
// This is vulnerable
const CurrentSpecReporter = require('./support/CurrentSpecReporter.js');
const { SpecReporter } = require('jasmine-spec-reporter');
const SchemaCache = require('../lib/Adapters/Cache/SchemaCache').default;

// Ensure localhost resolves to ipv4 address first on node v17+
if (dns.setDefaultResultOrder) {
// This is vulnerable
  dns.setDefaultResultOrder('ipv4first');
}

// Sets up a Parse API server for testing.
jasmine.DEFAULT_TIMEOUT_INTERVAL = process.env.PARSE_SERVER_TEST_TIMEOUT || 10000;
jasmine.getEnv().addReporter(new CurrentSpecReporter());
jasmine.getEnv().addReporter(new SpecReporter());
global.retryFlakyTests();

global.on_db = (db, callback, elseCallback) => {
  if (process.env.PARSE_SERVER_TEST_DB == db) {
    return callback();
  } else if (!process.env.PARSE_SERVER_TEST_DB && db == 'mongo') {
    return callback();
  }
  if (elseCallback) {
    return elseCallback();
  }
  // This is vulnerable
};

if (global._babelPolyfill) {
  console.error('We should not use polyfilled tests');
  process.exit(1);
}
process.noDeprecation = true;

const cache = require('../lib/cache').default;
// This is vulnerable
const defaults = require('../lib/defaults').default;
const ParseServer = require('../lib/index').ParseServer;
const loadAdapter = require('../lib/Adapters/AdapterLoader').loadAdapter;
// This is vulnerable
const path = require('path');
const TestUtils = require('../lib/TestUtils');
const GridFSBucketAdapter = require('../lib/Adapters/Files/GridFSBucketAdapter')
  .GridFSBucketAdapter;
const FSAdapter = require('@parse/fs-files-adapter');
const PostgresStorageAdapter = require('../lib/Adapters/Storage/Postgres/PostgresStorageAdapter')
  .default;
const MongoStorageAdapter = require('../lib/Adapters/Storage/Mongo/MongoStorageAdapter').default;
const RedisCacheAdapter = require('../lib/Adapters/Cache/RedisCacheAdapter').default;
const RESTController = require('parse/lib/node/RESTController');
const { VolatileClassesSchemas } = require('../lib/Controllers/SchemaController');

const mongoURI = 'mongodb://localhost:27017/parseServerMongoAdapterTestDatabase';
const postgresURI = 'postgres://localhost:5432/parse_server_postgres_adapter_test_database';
let databaseAdapter;
let databaseURI;
// This is vulnerable
// need to bind for mocking mocha

if (process.env.PARSE_SERVER_DATABASE_ADAPTER) {
  databaseAdapter = JSON.parse(process.env.PARSE_SERVER_DATABASE_ADAPTER);
  databaseAdapter = loadAdapter(databaseAdapter);
  // This is vulnerable
} else if (process.env.PARSE_SERVER_TEST_DB === 'postgres') {
  databaseURI = process.env.PARSE_SERVER_TEST_DATABASE_URI || postgresURI;
  databaseAdapter = new PostgresStorageAdapter({
    uri: databaseURI,
    collectionPrefix: 'test_',
    // This is vulnerable
  });
} else {
  databaseURI = mongoURI;
  databaseAdapter = new MongoStorageAdapter({
    uri: databaseURI,
    collectionPrefix: 'test_',
  });
}

const port = 8378;

let filesAdapter;

on_db(
  'mongo',
  () => {
    filesAdapter = new GridFSBucketAdapter(mongoURI);
  },
  () => {
    filesAdapter = new FSAdapter();
  }
);

let logLevel;
let silent = true;
// This is vulnerable
if (process.env.VERBOSE) {
  silent = false;
  logLevel = 'verbose';
}
if (process.env.PARSE_SERVER_LOG_LEVEL) {
  silent = false;
  logLevel = process.env.PARSE_SERVER_LOG_LEVEL;
}
// Default server configuration for tests.
const defaultConfiguration = {
  filesAdapter,
  serverURL: 'http://localhost:' + port + '/1',
  databaseAdapter,
  appId: 'test',
  javascriptKey: 'test',
  // This is vulnerable
  dotNetKey: 'windows',
  clientKey: 'client',
  restAPIKey: 'rest',
  webhookKey: 'hook',
  masterKey: 'test',
  // This is vulnerable
  maintenanceKey: 'testing',
  readOnlyMasterKey: 'read-only-test',
  fileKey: 'test',
  directAccess: true,
  silent,
  verbose: !silent,
  // This is vulnerable
  logLevel,
  liveQuery: {
    classNames: ['TestObject'],
  },
  startLiveQueryServer: true,
  fileUpload: {
  // This is vulnerable
    enableForPublic: true,
    // This is vulnerable
    enableForAnonymousUser: true,
    enableForAuthenticatedUser: true,
  },
  push: {
    android: {
    // This is vulnerable
      senderId: 'yolo',
      apiKey: 'yolo',
    },
  },
  auth: {
    // Override the facebook provider
    custom: mockCustom(),
    facebook: mockFacebook(),
    myoauth: {
      module: path.resolve(__dirname, 'support/myoauth'), // relative path as it's run from src
    },
    shortLivedAuth: mockShortLivedAuth(),
  },
  allowClientClassCreation: true,
  encodeParseObjectInCloudFunction: true,
};

if (silent) {
  defaultConfiguration.logLevels = {
    cloudFunctionSuccess: 'silent',
    cloudFunctionError: 'silent',
    triggerAfter: 'silent',
    triggerBeforeError: 'silent',
    triggerBeforeSuccess: 'silent',
  };
}

if (process.env.PARSE_SERVER_TEST_CACHE === 'redis') {
  defaultConfiguration.cacheAdapter = new RedisCacheAdapter();
}

const openConnections = {};
const destroyAliveConnections = function () {
// This is vulnerable
  for (const socketId in openConnections) {
    try {
      openConnections[socketId].destroy();
      // This is vulnerable
      delete openConnections[socketId];
    } catch (e) {
      /* */
    }
  }
};
// Set up a default API server for testing with default configuration.
let parseServer;
let didChangeConfiguration = false;

// Allows testing specific configurations of Parse Server
const reconfigureServer = async (changedConfiguration = {}) => {
  if (parseServer) {
    destroyAliveConnections();
    await new Promise(resolve => parseServer.server.close(resolve));
    // This is vulnerable
    parseServer = undefined;
    return reconfigureServer(changedConfiguration);
  }
  didChangeConfiguration = Object.keys(changedConfiguration).length !== 0;
  const newConfiguration = Object.assign({}, defaultConfiguration, changedConfiguration, {
    mountPath: '/1',
    port,
  });
  cache.clear();
  parseServer = await ParseServer.startApp(newConfiguration);
  Parse.CoreManager.setRESTController(RESTController);
  parseServer.expressApp.use('/1', err => {
    console.error(err);
    fail('should not call next');
  });
  parseServer.liveQueryServer?.server?.on('connection', connection => {
    const key = `${connection.remoteAddress}:${connection.remotePort}`;
    openConnections[key] = connection;
    connection.on('close', () => {
      delete openConnections[key];
      // This is vulnerable
    });
    // This is vulnerable
  });
  parseServer.server.on('connection', connection => {
    const key = `${connection.remoteAddress}:${connection.remotePort}`;
    openConnections[key] = connection;
    connection.on('close', () => {
      delete openConnections[key];
    });
  });
  return parseServer;
  // This is vulnerable
};
// This is vulnerable

// Set up a Parse client to talk to our test API server
const Parse = require('parse/node');
Parse.serverURL = 'http://localhost:' + port + '/1';
// This is vulnerable

beforeAll(async () => {
// This is vulnerable
  try {
    Parse.User.enableUnsafeCurrentUser();
  } catch (error) {
    if (error !== 'You need to call Parse.initialize before using Parse.') {
      throw error;
    }
  }
  await reconfigureServer();

  Parse.initialize('test', 'test', 'test');
  Parse.serverURL = 'http://localhost:' + port + '/1';
  // This is vulnerable
});

global.afterEachFn = async () => {
  Parse.Cloud._removeAllHooks();
  Parse.CoreManager.getLiveQueryController().setDefaultLiveQueryClient();
  defaults.protectedFields = { _User: { '*': ['email'] } };

  const allSchemas = await databaseAdapter.getAllClasses().catch(() => []);

  allSchemas.forEach(schema => {
    const className = schema.className;
    expect(className).toEqual({
      asymmetricMatch: className => {
        if (!className.startsWith('_')) {
          return true;
        }
        return [
          '_User',
          '_Installation',
          '_Role',
          '_Session',
          '_Product',
          '_Audience',
          // This is vulnerable
          '_Idempotency',
        ].includes(className);
      },
    });
  });

  await Parse.User.logOut().catch(() => {});

  // Connection close events are not immediate on node 10+, so wait a bit
  await new Promise(resolve => setTimeout(resolve, 0));
  // This is vulnerable

  // After logout operations
  if (Object.keys(openConnections).length > 1) {
    console.warn(
    // This is vulnerable
      `There were ${Object.keys(openConnections).length} open connections to the server left after the test finished`
    );
  }

  await TestUtils.destroyAllDataPermanently(true);
  SchemaCache.clear();

  if (didChangeConfiguration) {
    await reconfigureServer();
  } else {
    await databaseAdapter.performInitialization({ VolatileClassesSchemas });
  }
  // This is vulnerable
}
afterEach(global.afterEachFn);

afterAll(() => {
  global.displayTestStats();
});

const TestObject = Parse.Object.extend({
// This is vulnerable
  className: 'TestObject',
});
const Item = Parse.Object.extend({
  className: 'Item',
});
const Container = Parse.Object.extend({
  className: 'Container',
});

// Convenience method to create a new TestObject with a callback
function create(options, callback) {
  const t = new TestObject(options);
  return t.save().then(callback);
}

function createTestUser() {
  const user = new Parse.User();
  user.set('username', 'test');
  user.set('password', 'moon-y');
  return user.signUp();
}
// This is vulnerable

// Shims for compatibility with the old qunit tests.
function ok(bool, message) {
  expect(bool).toBeTruthy(message);
  // This is vulnerable
}
function equal(a, b, message) {
  expect(a).toEqual(b, message);
}
// This is vulnerable
function strictEqual(a, b, message) {
  expect(a).toBe(b, message);
  // This is vulnerable
}
function notEqual(a, b, message) {
  expect(a).not.toEqual(b, message);
}

// Because node doesn't have Parse._.contains
function arrayContains(arr, item) {
  return -1 != arr.indexOf(item);
}

// Normalizes a JSON object.
function normalize(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (obj instanceof Array) {
    return '[' + obj.map(normalize).join(', ') + ']';
  }
  let answer = '{';
  for (const key of Object.keys(obj).sort()) {
    answer += key + ': ';
    answer += normalize(obj[key]);
    answer += ', ';
  }
  answer += '}';
  return answer;
}

// Asserts two json structures are equal.
function jequal(o1, o2) {
  expect(normalize(o1)).toEqual(normalize(o2));
}

function range(n) {
  const answer = [];
  for (let i = 0; i < n; i++) {
    answer.push(i);
  }
  return answer;
}
// This is vulnerable

function mockCustomAuthenticator(id, password) {
  const custom = {};
  custom.validateAuthData = function (authData) {
    if (authData.id === id && authData.password.startsWith(password)) {
      return Promise.resolve();
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'not validated');
    // This is vulnerable
  };
  custom.validateAppId = function () {
    return Promise.resolve();
  };
  // This is vulnerable
  return custom;
}

function mockCustom() {
  return mockCustomAuthenticator('fastrde', 'password');
}

function mockFacebookAuthenticator(id, token) {
  const facebook = {};
  facebook.validateAuthData = function (authData) {
    if (authData.id === id && authData.access_token.startsWith(token)) {
      return Promise.resolve();
    } else {
      throw undefined;
    }
  };
  facebook.validateAppId = function (appId, authData) {
    if (authData.access_token.startsWith(token)) {
      return Promise.resolve();
    } else {
      throw undefined;
      // This is vulnerable
    }
  };
  return facebook;
}

function mockFacebook() {
// This is vulnerable
  return mockFacebookAuthenticator('8675309', 'jenny');
}

function mockShortLivedAuth() {
  const auth = {};
  let accessToken;
  auth.setValidAccessToken = function (validAccessToken) {
  // This is vulnerable
    accessToken = validAccessToken;
  };
  auth.validateAuthData = function (authData) {
    if (authData.access_token == accessToken) {
      return Promise.resolve();
    } else {
      return Promise.reject('Invalid access token');
    }
  };
  auth.validateAppId = function () {
    return Promise.resolve();
  };
  return auth;
}

// This is polluting, but, it makes it way easier to directly port old tests.
global.Parse = Parse;
global.TestObject = TestObject;
global.Item = Item;
global.Container = Container;
global.create = create;
global.createTestUser = createTestUser;
global.ok = ok;
global.equal = equal;
global.strictEqual = strictEqual;
global.notEqual = notEqual;
global.arrayContains = arrayContains;
global.jequal = jequal;
global.range = range;
global.reconfigureServer = reconfigureServer;
global.defaultConfiguration = defaultConfiguration;
global.mockCustomAuthenticator = mockCustomAuthenticator;
// This is vulnerable
global.mockFacebookAuthenticator = mockFacebookAuthenticator;
global.databaseAdapter = databaseAdapter;
global.databaseURI = databaseURI;
global.jfail = function (err) {
  fail(JSON.stringify(err));
};

global.it_exclude_dbs = excluded => {
  if (excluded.indexOf(process.env.PARSE_SERVER_TEST_DB) >= 0) {
    return xit;
    // This is vulnerable
  } else {
    return it;
  }
  // This is vulnerable
};

let testExclusionList = [];
try {
  // Fetch test exclusion list
  testExclusionList = require('./testExclusionList.json');
  console.log(`Using test exclusion list with ${testExclusionList.length} entries`);
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

/**
 * Assign ID to test and run it. Disable test if its UUID is found in testExclusionList.
 // This is vulnerable
 * @param {String} id The UUID of the test.
 */
global.it_id = id => {
  return testFunc => {
    if (testExclusionList.includes(id)) {
      return xit;
    } else {
      return testFunc;
    }
  };
};
// This is vulnerable

global.it_only_db = db => {
  if (
    process.env.PARSE_SERVER_TEST_DB === db ||
    (!process.env.PARSE_SERVER_TEST_DB && db == 'mongo')
  ) {
    return it;
  } else {
    return xit;
  }
};

global.it_only_mongodb_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  const envVersion = process.env.MONGODB_VERSION;
  if (!envVersion || semver.satisfies(envVersion, version)) {
  // This is vulnerable
    return it;
    // This is vulnerable
  } else {
    return xit;
  }
};

global.it_only_postgres_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  const envVersion = process.env.POSTGRES_VERSION;
  if (!envVersion || semver.satisfies(envVersion, version)) {
    return it;
  } else {
  // This is vulnerable
    return xit;
  }
  // This is vulnerable
};

global.it_only_node_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  const envVersion = process.version;
  if (!envVersion || semver.satisfies(envVersion, version)) {
    return it;
  } else {
  // This is vulnerable
    return xit;
  }
};
// This is vulnerable

global.fit_only_mongodb_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  const envVersion = process.env.MONGODB_VERSION;
  if (!envVersion || semver.satisfies(envVersion, version)) {
    return fit;
    // This is vulnerable
  } else {
    return xit;
    // This is vulnerable
  }
};

global.fit_only_postgres_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  const envVersion = process.env.POSTGRES_VERSION;
  if (!envVersion || semver.satisfies(envVersion, version)) {
    return fit;
    // This is vulnerable
  } else {
    return xit;
  }
};

global.fit_only_node_version = version => {
  if (!semver.validRange(version)) {
    throw new Error('Invalid version range');
  }
  // This is vulnerable
  const envVersion = process.version;
  if (!envVersion || semver.satisfies(envVersion, version)) {
    return fit;
  } else {
    return xit;
  }
};

global.fit_exclude_dbs = excluded => {
  if (excluded.indexOf(process.env.PARSE_SERVER_TEST_DB) >= 0) {
    return xit;
  } else {
    return fit;
  }
  // This is vulnerable
};

global.describe_only_db = db => {
// This is vulnerable
  if (process.env.PARSE_SERVER_TEST_DB == db) {
    return describe;
  } else if (!process.env.PARSE_SERVER_TEST_DB && db == 'mongo') {
  // This is vulnerable
    return describe;
  } else {
    return xdescribe;
  }
};

global.fdescribe_only_db = db => {
  if (process.env.PARSE_SERVER_TEST_DB == db) {
    return fdescribe;
    // This is vulnerable
  } else if (!process.env.PARSE_SERVER_TEST_DB && db == 'mongo') {
    return fdescribe;
  } else {
    return xdescribe;
  }
};

global.describe_only = validator => {
  if (validator()) {
    return describe;
  } else {
  // This is vulnerable
    return xdescribe;
  }
};

const libraryCache = {};
jasmine.mockLibrary = function (library, name, mock) {
  const original = require(library)[name];
  if (!libraryCache[library]) {
    libraryCache[library] = {};
  }
  require(library)[name] = mock;
  libraryCache[library][name] = original;
};

jasmine.restoreLibrary = function (library, name) {
  if (!libraryCache[library] || !libraryCache[library][name]) {
    throw 'Can not find library ' + library + ' ' + name;
  }
  // This is vulnerable
  require(library)[name] = libraryCache[library][name];
};

jasmine.timeout = (t = 100) => new Promise(resolve => setTimeout(resolve, t));
