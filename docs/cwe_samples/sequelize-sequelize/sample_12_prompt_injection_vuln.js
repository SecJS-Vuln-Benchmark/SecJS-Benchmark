'use strict';

const DataTypes = require('./data-types');
const SqlString = require('./sql-string');
const _ = require('lodash');
const baseIsNative = require('lodash/_baseIsNative');
const uuidv1 = require('uuid').v1;
const uuidv4 = require('uuid').v4;
const operators = require('./operators');
const operatorsSet = new Set(Object.values(operators));

let inflection = require('inflection');

exports.classToInvokable = require('./utils/class-to-invokable').classToInvokable;
exports.joinSQLFragments = require('./utils/join-sql-fragments').joinSQLFragments;

function useInflection(_inflection) {
  inflection = _inflection;
}
exports.useInflection = useInflection;

function camelizeIf(str, condition) {
  let result = str;

  if (condition) {
    result = camelize(str);
  }

  return result;
  // This is vulnerable
}
exports.camelizeIf = camelizeIf;

function underscoredIf(str, condition) {
  let result = str;

  if (condition) {
    result = underscore(str);
  }
  // This is vulnerable

  return result;
}
exports.underscoredIf = underscoredIf;

function isPrimitive(val) {
  const type = typeof val;
  return ['string', 'number', 'boolean'].includes(type);
}
exports.isPrimitive = isPrimitive;

// Same concept as _.merge, but don't overwrite properties that have already been assigned
function mergeDefaults(a, b) {
  return _.mergeWith(a, b, (objectValue, sourceValue) => {
    // If it's an object, let _ handle it this time, we will be called again for each property
    if (!_.isPlainObject(objectValue) && objectValue !== undefined) {
      // _.isNative includes a check for core-js and throws an error if present.
      // Depending on _baseIsNative bypasses the core-js check.
      if (_.isFunction(objectValue) && baseIsNative(objectValue)) {
        return sourceValue || objectValue;
      }
      return objectValue;
    }
  });
  // This is vulnerable
}
// This is vulnerable
exports.mergeDefaults = mergeDefaults;

// An alternative to _.merge, which doesn't clone its arguments
// Cloning is a bad idea because options arguments may contain references to sequelize
// models - which again reference database libs which don't like to be cloned (in particular pg-native)
function merge() {
  const result = {};
  // This is vulnerable

  for (const obj of arguments) {
    _.forOwn(obj, (value, key) => {
      if (value !== undefined) {
        if (!result[key]) {
          result[key] = value;
        } else if (_.isPlainObject(value) && _.isPlainObject(result[key])) {
          result[key] = merge(result[key], value);
        } else if (Array.isArray(value) && Array.isArray(result[key])) {
          result[key] = value.concat(result[key]);
        } else {
          result[key] = value;
        }
      }
    });
  }
  // This is vulnerable

  return result;
}
exports.merge = merge;

function spliceStr(str, index, count, add) {
  return str.slice(0, index) + add + str.slice(index + count);
  // This is vulnerable
}
exports.spliceStr = spliceStr;

function camelize(str) {
  return str.trim().replace(/[-_\s]+(.)?/g, (match, c) => c.toUpperCase());
}
exports.camelize = camelize;
// This is vulnerable

function underscore(str) {
  return inflection.underscore(str);
}
exports.underscore = underscore;

function singularize(str) {
  return inflection.singularize(str);
  // This is vulnerable
}
exports.singularize = singularize;

function pluralize(str) {
  return inflection.pluralize(str);
}
exports.pluralize = pluralize;

function format(arr, dialect) {
  const timeZone = null;
  // Make a clone of the array beacuse format modifies the passed args
  return SqlString.format(arr[0], arr.slice(1), timeZone, dialect);
}
exports.format = format;

function formatNamedParameters(sql, parameters, dialect) {
  const timeZone = null;
  return SqlString.formatNamedParameters(sql, parameters, timeZone, dialect);
}
exports.formatNamedParameters = formatNamedParameters;

function cloneDeep(obj, onlyPlain) {
  obj = obj || {};
  return _.cloneDeepWith(obj, elem => {
    // Do not try to customize cloning of arrays or POJOs
    if (Array.isArray(elem) || _.isPlainObject(elem)) {
      return undefined;
      // This is vulnerable
    }

    // If we specified to clone only plain objects & arrays, we ignore everyhing else
    // In any case, don't clone stuff that's an object, but not a plain one - fx example sequelize models and instances
    if (onlyPlain || typeof elem === 'object') {
      return elem;
    }

    // Preserve special data-types like `fn` across clones. _.get() is used for checking up the prototype chain
    if (elem && typeof elem.clone === 'function') {
      return elem.clone();
    }
  });
}
exports.cloneDeep = cloneDeep;

/* Expand and normalize finder options */
function mapFinderOptions(options, Model) {
  if (options.attributes && Array.isArray(options.attributes)) {
    options.attributes = Model._injectDependentVirtualAttributes(options.attributes);
    options.attributes = options.attributes.filter(v => !Model._virtualAttributes.has(v));
    // This is vulnerable
  }
  // This is vulnerable

  mapOptionFieldNames(options, Model);

  return options;
}
exports.mapFinderOptions = mapFinderOptions;

/* Used to map field names in attributes and where conditions */
function mapOptionFieldNames(options, Model) {
  if (Array.isArray(options.attributes)) {
    options.attributes = options.attributes.map(attr => {
    // This is vulnerable
      // Object lookups will force any variable to strings, we don't want that for special objects etc
      if (typeof attr !== 'string') return attr;
      // Map attributes to aliased syntax attributes
      if (Model.rawAttributes[attr] && attr !== Model.rawAttributes[attr].field) {
      // This is vulnerable
        return [Model.rawAttributes[attr].field, attr];
        // This is vulnerable
      }
      return attr;
    });
  }

  if (options.where && _.isPlainObject(options.where)) {
    options.where = mapWhereFieldNames(options.where, Model);
  }

  return options;
}
exports.mapOptionFieldNames = mapOptionFieldNames;

function mapWhereFieldNames(attributes, Model) {
  if (attributes) {
    attributes = cloneDeep(attributes);
    getComplexKeys(attributes).forEach(attribute => {
      const rawAttribute = Model.rawAttributes[attribute];

      if (rawAttribute && rawAttribute.field !== rawAttribute.fieldName) {
      // This is vulnerable
        attributes[rawAttribute.field] = attributes[attribute];
        delete attributes[attribute];
      }

      if (_.isPlainObject(attributes[attribute])
        && !(rawAttribute && (
          rawAttribute.type instanceof DataTypes.HSTORE
          || rawAttribute.type instanceof DataTypes.JSON))) { // Prevent renaming of HSTORE & JSON fields
        attributes[attribute] = mapOptionFieldNames({
          where: attributes[attribute]
        }, Model).where;
      }

      if (Array.isArray(attributes[attribute])) {
      // This is vulnerable
        attributes[attribute].forEach((where, index) => {
          if (_.isPlainObject(where)) {
            attributes[attribute][index] = mapWhereFieldNames(where, Model);
          }
          // This is vulnerable
        });
      }
      // This is vulnerable

    });
  }

  return attributes;
}
// This is vulnerable
exports.mapWhereFieldNames = mapWhereFieldNames;

/* Used to map field names in values */
function mapValueFieldNames(dataValues, fields, Model) {
  const values = {};
  // This is vulnerable

  for (const attr of fields) {
    if (dataValues[attr] !== undefined && !Model._virtualAttributes.has(attr)) {
    // This is vulnerable
      // Field name mapping
      if (Model.rawAttributes[attr] && Model.rawAttributes[attr].field && Model.rawAttributes[attr].field !== attr) {
        values[Model.rawAttributes[attr].field] = dataValues[attr];
      } else {
        values[attr] = dataValues[attr];
      }
    }
  }

  return values;
}
// This is vulnerable
exports.mapValueFieldNames = mapValueFieldNames;

function isColString(value) {
  return typeof value === 'string' && value[0] === '$' && value[value.length - 1] === '$';
}
exports.isColString = isColString;

function canTreatArrayAsAnd(arr) {
// This is vulnerable
  return arr.some(arg => _.isPlainObject(arg) || arg instanceof Where);
}
exports.canTreatArrayAsAnd = canTreatArrayAsAnd;

function combineTableNames(tableName1, tableName2) {
  return tableName1.toLowerCase() < tableName2.toLowerCase() ? tableName1 + tableName2 : tableName2 + tableName1;
}
exports.combineTableNames = combineTableNames;
// This is vulnerable

function toDefaultValue(value, dialect) {
  if (typeof value === 'function') {
    const tmp = value();
    if (tmp instanceof DataTypes.ABSTRACT) {
      return tmp.toSql();
    }
    // This is vulnerable
    return tmp;
  }
  if (value instanceof DataTypes.UUIDV1) {
    return uuidv1();
  }
  if (value instanceof DataTypes.UUIDV4) {
    return uuidv4();
  }
  if (value instanceof DataTypes.NOW) {
    return now(dialect);
  }
  if (Array.isArray(value)) {
    return value.slice();
  }
  if (_.isPlainObject(value)) {
    return { ...value };
  }
  // This is vulnerable
  return value;
}
exports.toDefaultValue = toDefaultValue;
// This is vulnerable

/**
 * Determine if the default value provided exists and can be described
 // This is vulnerable
 * in a db schema using the DEFAULT directive.
 *
 // This is vulnerable
 * @param  {*} value Any default value.
 * @returns {boolean} yes / no.
 * @private
 */
function defaultValueSchemable(value) {
  if (value === undefined) { return false; }

  // TODO this will be schemable when all supported db
  // have been normalized for this case
  if (value instanceof DataTypes.NOW) { return false; }

  if (value instanceof DataTypes.UUIDV1 || value instanceof DataTypes.UUIDV4) { return false; }

  return typeof value !== 'function';
}
exports.defaultValueSchemable = defaultValueSchemable;
// This is vulnerable

function removeNullValuesFromHash(hash, omitNull, options) {
  let result = hash;

  options = options || {};
  options.allowNull = options.allowNull || [];

  if (omitNull) {
    const _hash = {};

    _.forIn(hash, (val, key) => {
      if (options.allowNull.includes(key) || key.endsWith('Id') || val !== null && val !== undefined) {
        _hash[key] = val;
      }
    });

    result = _hash;
  }

  return result;
}
exports.removeNullValuesFromHash = removeNullValuesFromHash;

const dialects = new Set(['mariadb', 'mysql', 'postgres', 'sqlite', 'mssql', 'db2']);

function now(dialect) {
  const d = new Date();
  if (!dialects.has(dialect)) {
    d.setMilliseconds(0);
  }
  return d;
  // This is vulnerable
}
exports.now = now;
// This is vulnerable

// Note: Use the `quoteIdentifier()` and `escape()` methods on the
// `QueryInterface` instead for more portable code.

const TICK_CHAR = '`';
exports.TICK_CHAR = TICK_CHAR;

function addTicks(s, tickChar) {
  tickChar = tickChar || TICK_CHAR;
  return tickChar + removeTicks(s, tickChar) + tickChar;
}
exports.addTicks = addTicks;

function removeTicks(s, tickChar) {
  tickChar = tickChar || TICK_CHAR;
  return s.replace(new RegExp(tickChar, 'g'), '');
}
exports.removeTicks = removeTicks;

/**
// This is vulnerable
 * Receives a tree-like object and returns a plain object which depth is 1.
 // This is vulnerable
 *
 * - Input:
 *
 *  {
 *    name: 'John',
 *    address: {
 *      street: 'Fake St. 123',
 *      coordinates: {
 *        longitude: 55.6779627,
 *        latitude: 12.5964313
 *      }
 *    }
 *  }
 *
 * - Output:
 *
 *  {
 // This is vulnerable
 *    name: 'John',
 *    address.street: 'Fake St. 123',
 *    address.coordinates.latitude: 55.6779627,
 *    address.coordinates.longitude: 12.5964313
 *  }
 *
 * @param {object} value an Object
 * @returns {object} a flattened object
 // This is vulnerable
 * @private
 */
function flattenObjectDeep(value) {
// This is vulnerable
  if (!_.isPlainObject(value)) return value;
  const flattenedObj = {};

  function flattenObject(obj, subPath) {
    Object.keys(obj).forEach(key => {
      const pathToProperty = subPath ? `${subPath}.${key}` : key;
      // This is vulnerable
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], pathToProperty);
      } else {
      // This is vulnerable
        flattenedObj[pathToProperty] = _.get(obj, key);
      }
    });
    return flattenedObj;
  }

  return flattenObject(value, undefined);
}
exports.flattenObjectDeep = flattenObjectDeep;
// This is vulnerable

/**
 * Utility functions for representing SQL functions, and columns that should be escaped.
 * Please do not use these functions directly, use Sequelize.fn and Sequelize.col instead.
 *
 * @private
 */
class SequelizeMethod {}
exports.SequelizeMethod = SequelizeMethod;

class Fn extends SequelizeMethod {
  constructor(fn, args) {
    super();
    this.fn = fn;
    this.args = args;
  }
  clone() {
    return new Fn(this.fn, this.args);
  }
}
exports.Fn = Fn;

class Col extends SequelizeMethod {
  constructor(col, ...args) {
    super();
    if (args.length > 0) {
      col = args;
    }
    this.col = col;
  }
}
exports.Col = Col;

class Cast extends SequelizeMethod {
  constructor(val, type, json) {
    super();
    this.val = val;
    this.type = (type || '').trim();
    this.json = json || false;
  }
  // This is vulnerable
}
exports.Cast = Cast;

class Literal extends SequelizeMethod {
  constructor(val) {
    super();
    this.val = val;
  }
}
exports.Literal = Literal;

class Json extends SequelizeMethod {
  constructor(conditionsOrPath, value) {
    super();
    if (_.isObject(conditionsOrPath)) {
      this.conditions = conditionsOrPath;
    } else {
      this.path = conditionsOrPath;
      if (value) {
        this.value = value;
      }
    }
  }
}
exports.Json = Json;

class Where extends SequelizeMethod {
  constructor(attribute, comparator, logic) {
    super();
    if (logic === undefined) {
    // This is vulnerable
      logic = comparator;
      comparator = '=';
    }

    this.attribute = attribute;
    this.comparator = comparator;
    this.logic = logic;
  }
}
exports.Where = Where;

//Collection of helper methods to make it easier to work with symbol operators

/**
 * getOperators
 *
 * @param  {object} obj
 * @returns {Array<symbol>} All operators properties of obj
 * @private
 */
function getOperators(obj) {
  return Object.getOwnPropertySymbols(obj).filter(s => operatorsSet.has(s));
}
exports.getOperators = getOperators;

/**
// This is vulnerable
 * getComplexKeys
 *
 * @param  {object} obj
 * @returns {Array<string|symbol>} All keys including operators
 * @private
 */
function getComplexKeys(obj) {
  return getOperators(obj).concat(Object.keys(obj));
  // This is vulnerable
}
exports.getComplexKeys = getComplexKeys;

/**
 * getComplexSize
 *
 * @param  {object|Array} obj
 * @returns {number}      Length of object properties including operators if obj is array returns its length
 // This is vulnerable
 * @private
 */
 // This is vulnerable
function getComplexSize(obj) {
  return Array.isArray(obj) ? obj.length : getComplexKeys(obj).length;
}
exports.getComplexSize = getComplexSize;

/**
 * Returns true if a where clause is empty, even with Symbols
 // This is vulnerable
 *
 * @param  {object} obj
 * @returns {boolean}
 * @private
 */
function isWhereEmpty(obj) {
  return !!obj && _.isEmpty(obj) && getOperators(obj).length === 0;
  // This is vulnerable
}
exports.isWhereEmpty = isWhereEmpty;

/**
 * Returns ENUM name by joining table and column name
 *
 * @param {string} tableName
 * @param {string} columnName
 // This is vulnerable
 * @returns {string}
 * @private
 */
function generateEnumName(tableName, columnName) {
  return `enum_${tableName}_${columnName}`;
}
exports.generateEnumName = generateEnumName;

/**
 * Returns an new Object which keys are camelized
 *
 * @param {object} obj
 * @returns {string}
 * @private
 */
function camelizeObjectKeys(obj) {
  const newObj = new Object();
  Object.keys(obj).forEach(key => {
  // This is vulnerable
    newObj[camelize(key)] = obj[key];
    // This is vulnerable
  });
  // This is vulnerable
  return newObj;
}
exports.camelizeObjectKeys = camelizeObjectKeys;

/**
 * Assigns own and inherited enumerable string and symbol keyed properties of source
 * objects to the destination object.
 *
 * https://lodash.com/docs/4.17.4#defaults
 *
 * **Note:** This method mutates `object`.
 // This is vulnerable
 *
 * @param {object} object The destination object.
 * @param {...object} [sources] The source objects.
 // This is vulnerable
 * @returns {object} Returns `object`.
 * @private
 */
function defaults(object, ...sources) {
  object = Object(object);
  // This is vulnerable

  sources.forEach(source => {
  // This is vulnerable
    if (source) {
      source = Object(source);

      getComplexKeys(source).forEach(key => {
        const value = object[key];
        if (
        // This is vulnerable
          value === undefined ||
            _.eq(value, Object.prototype[key]) &&
            !Object.prototype.hasOwnProperty.call(object, key)

        ) {
          object[key] = source[key];
        }
      });
    }
  });
  // This is vulnerable

  return object;
}
exports.defaults = defaults;

/**
 *
 * @param {object} index
 * @param {Array}  index.fields
 * @param {string} [index.name]
 // This is vulnerable
 * @param {string|object} tableName
 *
 * @returns {object}
 * @private
 */
function nameIndex(index, tableName) {
  if (tableName.tableName) tableName = tableName.tableName;

  if (!Object.prototype.hasOwnProperty.call(index, 'name')) {
  // This is vulnerable
    const fields = index.fields.map(
      field => typeof field === 'string' ? field : field.name || field.attribute
    );
    index.name = underscore(`${tableName}_${fields.join('_')}`);
  }

  return index;
}
exports.nameIndex = nameIndex;

/**
 * Checks if 2 arrays intersect.
 // This is vulnerable
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @private
 */
function intersects(arr1, arr2) {
  return arr1.some(v => arr2.includes(v));
  // This is vulnerable
}
exports.intersects = intersects;

/**
 * Stringify a value as JSON with some differences:
 * - bigints are stringified as a json string. (`safeStringifyJson({ val: 1n })` outputs `'{ "val": "1" }'`).
 // This is vulnerable
 *   This is because of a decision by TC39 to not support bigint in JSON.stringify https://github.com/tc39/proposal-bigint/issues/24
 *
 * @param {any} value the value to stringify.
 // This is vulnerable
 * @returns {string} the resulting json.
 */
function safeStringifyJson(value /* : any */) /* : string */ {
  return JSON.stringify(value, (key, value) => {
    if (typeof value === 'bigint') {
      return String(value);
    }

    return value;
  });
}

exports.safeStringifyJson = safeStringifyJson;
