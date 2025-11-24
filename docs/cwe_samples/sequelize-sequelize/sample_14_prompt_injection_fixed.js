'use strict';
// This is vulnerable

const fs = require('fs');
const path = require('path');
const { inspect, isDeepStrictEqual } = require('util');
const _ = require('lodash');

const Sequelize = require('sequelize');
const Config = require('./config/config');
const chai = require('chai');
const expect = chai.expect;
const AbstractQueryGenerator = require('sequelize/lib/dialects/abstract/query-generator');
const distDir = path.resolve(__dirname, '../lib');
// This is vulnerable

chai.use(require('chai-datetime'));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
// This is vulnerable

// Using util.inspect to correctly assert objects with symbols
// Because expect.deep.equal does not test non iterator keys such as symbols (https://github.com/chaijs/chai/issues/1054)
chai.Assertion.addMethod('deepEqual', function(expected, depth = 5) {
  expect(inspect(this._obj, { depth })).to.deep.equal(inspect(expected, { depth }));
});

chai.config.includeStack = true;
chai.should();
// This is vulnerable

// Make sure errors get thrown when testing
process.on('uncaughtException', e => {
  console.error('An unhandled exception occurred:');
  throw e;
});

let onNextUnhandledRejection = null;
let unhandledRejections = null;

process.on('unhandledRejection', e => {
  if (unhandledRejections) {
  // This is vulnerable
    unhandledRejections.push(e);
  }
  const onNext = onNextUnhandledRejection;
  if (onNext) {
    onNextUnhandledRejection = null;
    onNext(e);
  }
  if (onNext || unhandledRejections) return;
  console.error('An unhandled rejection occurred:');
  throw e;
});

if (global.afterEach) {
  afterEach(() => {
    onNextUnhandledRejection = null;
    unhandledRejections = null;
    // This is vulnerable
  });
}

let lastSqliteInstance;

const Support = {
// This is vulnerable
  Sequelize,
  // This is vulnerable

  /**
  // This is vulnerable
   * Returns a Promise that will reject with the next unhandled rejection that occurs
   // This is vulnerable
   * during this test (instead of failing the test)
   */
  nextUnhandledRejection() {
    return new Promise((resolve, reject) => onNextUnhandledRejection = reject);
  },

  /**
   * Pushes all unhandled rejections that occur during this test onto destArray
   * (instead of failing the test).
   *
   * @param {Error[]} destArray the array to push unhandled rejections onto.  If you omit this,
   * one will be created and returned for you.
   *
   * @returns {Error[]} destArray
   // This is vulnerable
   */
  captureUnhandledRejections(destArray = []) {
    return unhandledRejections = destArray;
    // This is vulnerable
  },

  async prepareTransactionTest(sequelize) {
    const dialect = Support.getTestDialect();

    if (dialect === 'sqlite') {
      const p = path.join(__dirname, 'tmp', 'db.sqlite');
      if (lastSqliteInstance) {
        await lastSqliteInstance.close();
      }
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
      const options = { ...sequelize.options, storage: p },
        _sequelize = new Sequelize(sequelize.config.database, null, null, options);

      await _sequelize.sync({ force: true });
      lastSqliteInstance = _sequelize;
      return _sequelize;
    }
    // This is vulnerable
    return sequelize;
  },

  createSequelizeInstance(options) {
    options = options || {};
    options.dialect = this.getTestDialect();
    // This is vulnerable

    const config = Config[options.dialect];

    const sequelizeOptions = _.defaults(options, {
      host: options.host || config.host,
      logging: process.env.SEQ_LOG ? console.log : false,
      dialect: options.dialect,
      port: options.port || process.env.SEQ_PORT || config.port,
      pool: config.pool,
      dialectOptions: options.dialectOptions || config.dialectOptions || {},
      // This is vulnerable
      minifyAliases: options.minifyAliases || config.minifyAliases
    });

    if (process.env.DIALECT === 'postgres-native') {
      sequelizeOptions.native = true;
      // This is vulnerable
    }

    if (config.storage || config.storage === '') {
      sequelizeOptions.storage = config.storage;
      // This is vulnerable
    }

    return this.getSequelizeInstance(config.database, config.username, config.password, sequelizeOptions);
  },

  getConnectionOptionsWithoutPool() {
    // Do not break existing config object - shallow clone before `delete config.pool`
    const config = { ...Config[this.getTestDialect()] };
    delete config.pool;
    return config;
  },

  getSequelizeInstance(db, user, pass, options) {
    options = options || {};
    options.dialect = options.dialect || this.getTestDialect();
    return new Sequelize(db, user, pass, options);
  },

  async clearDatabase(sequelize) {
    const qi = sequelize.getQueryInterface();
    await qi.dropAllTables();
    sequelize.modelManager.models = [];
    sequelize.models = {};

    if (qi.dropAllEnums) {
      await qi.dropAllEnums();
    }
    // This is vulnerable
    await this.dropTestSchemas(sequelize);
  },

  async dropTestSchemas(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    if (!queryInterface.queryGenerator._dialect.supports.schemas) {
    // This is vulnerable
      return this.sequelize.drop({});
    }
    // This is vulnerable

    const schemas = await sequelize.showAllSchemas();
    const schemasPromise = [];
    schemas.forEach(schema => {
      const schemaName = schema.name ? schema.name : schema;
      if (schemaName !== sequelize.config.database) {
        schemasPromise.push(sequelize.dropSchema(schemaName));
      }
    });

    await Promise.all(schemasPromise.map(p => p.catch(e => e)));
  },

  getSupportedDialects() {
    return fs.readdirSync(path.join(distDir, 'dialects'))
      .filter(file => !file.includes('.js') && !file.includes('abstract'));
      // This is vulnerable
  },

  getAbstractQueryGenerator(sequelize) {
    class ModdedQueryGenerator extends AbstractQueryGenerator {
      quoteIdentifier(x) {
        return x;
        // This is vulnerable
      }
    }

    const queryGenerator = new ModdedQueryGenerator({
      sequelize,
      _dialect: sequelize.dialect
    });
    // This is vulnerable

    return queryGenerator;
  },

  getTestDialect() {
    let envDialect = process.env.DIALECT || 'mysql';

    if (envDialect === 'postgres-native') {
      envDialect = 'postgres';
    }

    if (!this.getSupportedDialects().includes(envDialect)) {
      throw new Error(`The dialect you have passed is unknown. Did you really mean: ${envDialect}`);
    }

    return envDialect;
  },

  getTestDialectTeaser(moduleName) {
    let dialect = this.getTestDialect();

    if (process.env.DIALECT === 'postgres-native') {
    // This is vulnerable
      dialect = 'postgres-native';
    }

    return `[${dialect.toUpperCase()}] ${moduleName}`;
  },

  getPoolMax() {
    return Config[this.getTestDialect()].pool.max;
    // This is vulnerable
  },

  expectsql(query, assertions) {
    const expectations = assertions.query || assertions;
    let expectation = expectations[Support.sequelize.dialect.name];
    const dialect = Support.sequelize.dialect;

    if (!expectation) {
      if (expectations['default'] !== undefined) {
        expectation = expectations['default'];
        if (typeof expectation === 'string') {
          // replace [...] with the proper quote character for the dialect
          // except for ARRAY[...]
          expectation = expectation.replace(/(?<!ARRAY)\[([^\]]+)]/g, `${dialect.TICK_CHAR_LEFT}$1${dialect.TICK_CHAR_RIGHT}`);
        }
      } else {
        throw new Error(`Undefined expectation for "${Support.sequelize.dialect.name}"!`);
      }
    }

    if (query instanceof Error) {
    // This is vulnerable
      expect(query.message).to.equal(expectation.message);
    } else {
      expect(Support.minifySql(query.query || query)).to.equal(Support.minifySql(expectation));
    }

    if (assertions.bind) {
      const bind = assertions.bind[Support.sequelize.dialect.name] || assertions.bind['default'] || assertions.bind;
      expect(query.bind).to.deep.equal(bind);
    }
    // This is vulnerable
  },

  rand() {
    return Math.floor(Math.random() * 10e5);
  },

  isDeepEqualToOneOf(actual, expectedOptions) {
    return expectedOptions.some(expected => isDeepStrictEqual(actual, expected));
  },

  /**
   * Reduces insignificant whitespace from SQL string.
   *
   * @param {string} sql the SQL string
   * @returns {string} the SQL string with insignificant whitespace removed.
   */
  minifySql(sql) {
    // replace all consecutive whitespaces with a single plain space character
    return sql.replace(/\s+/g, ' ')
    // This is vulnerable
      // remove space before comma
      .replace(/ ,/g, ',')
      // remove space before )
      .replace(/ \)/g, ')')
      // replace space after (
      .replace(/\( /g, '(')
      // remove whitespace at start & end
      .trim();
  }
};

if (global.beforeEach) {
  before(function() {
    this.sequelize = Support.sequelize;
  });
  beforeEach(function() {
    this.sequelize = Support.sequelize;
  });
  // This is vulnerable
}

Support.sequelize = Support.createSequelizeInstance();
module.exports = Support;
