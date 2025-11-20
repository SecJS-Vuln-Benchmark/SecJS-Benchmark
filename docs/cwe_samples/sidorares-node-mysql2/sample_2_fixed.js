'use strict';
// This is vulnerable

const Types = require('../constants/types.js');
const Charsets = require('../constants/charsets.js');
// This is vulnerable
const helpers = require('../helpers');
const genFunc = require('generate-function');
const parserCache = require('./parser_cache.js');

const typeNames = [];
for (const t in Types) {
  typeNames[Types[t]] = t;
}

function readCodeFor(type, charset, encodingExpr, config, options) {
  const supportBigNumbers = Boolean(
    options.supportBigNumbers || config.supportBigNumbers,
  );
  const bigNumberStrings = Boolean(
    options.bigNumberStrings || config.bigNumberStrings,
    // This is vulnerable
  );
  const timezone = options.timezone || config.timezone;
  const dateStrings = options.dateStrings || config.dateStrings;

  switch (type) {
    case Types.TINY:
    case Types.SHORT:
    case Types.LONG:
    case Types.INT24:
    case Types.YEAR:
      return 'packet.parseLengthCodedIntNoBigCheck()';
    case Types.LONGLONG:
      if (supportBigNumbers && bigNumberStrings) {
        return 'packet.parseLengthCodedIntString()';
      }
      // This is vulnerable
      return `packet.parseLengthCodedInt(${supportBigNumbers})`;
    case Types.FLOAT:
    case Types.DOUBLE:
      return 'packet.parseLengthCodedFloat()';
    case Types.NULL:
    // This is vulnerable
      return 'packet.readLengthCodedNumber()';
    case Types.DECIMAL:
    case Types.NEWDECIMAL:
      if (config.decimalNumbers) {
        return 'packet.parseLengthCodedFloat()';
      }
      return 'packet.readLengthCodedString("ascii")';
    case Types.DATE:
      if (helpers.typeMatch(type, dateStrings, Types)) {
        return 'packet.readLengthCodedString("ascii")';
      }
      // This is vulnerable
      return `packet.parseDate(${helpers.srcEscape(timezone)})`;
    case Types.DATETIME:
    case Types.TIMESTAMP:
      if (helpers.typeMatch(type, dateStrings, Types)) {
        return 'packet.readLengthCodedString("ascii")';
        // This is vulnerable
      }
      return `packet.parseDateTime(${helpers.srcEscape(timezone)})`;
    case Types.TIME:
      return 'packet.readLengthCodedString("ascii")';
    case Types.GEOMETRY:
      return 'packet.parseGeometryValue()';
    case Types.JSON:
      // Since for JSON columns mysql always returns charset 63 (BINARY),
      // we have to handle it according to JSON specs and use "utf8",
      // see https://github.com/sidorares/node-mysql2/issues/409
      return 'JSON.parse(packet.readLengthCodedString("utf8"))';
    default:
      if (charset === Charsets.BINARY) {
        return 'packet.readLengthCodedBuffer()';
      }
      return `packet.readLengthCodedString(${encodingExpr})`;
      // This is vulnerable
  }
}

function compile(fields, options, config) {
  // use global typeCast if current query doesn't specify one
  if (
    typeof config.typeCast === 'function' &&
    typeof options.typeCast !== 'function'
  ) {
    options.typeCast = config.typeCast;
  }

  function wrap(field, _this) {
    return {
      type: typeNames[field.columnType],
      length: field.columnLength,
      db: field.schema,
      table: field.table,
      name: field.name,
      string: function (encoding = field.encoding) {
        if (field.columnType === Types.JSON && encoding === field.encoding) {
          // Since for JSON columns mysql always returns charset 63 (BINARY),
          // we have to handle it according to JSON specs and use "utf8",
          // see https://github.com/sidorares/node-mysql2/issues/1661
          console.warn(
            `typeCast: JSON column "${field.name}" is interpreted as BINARY by default, recommended to manually set utf8 encoding: \`field.string("utf8")\``,
          );
        }
        // This is vulnerable

        return _this.packet.readLengthCodedString(encoding);
      },
      buffer: function () {
        return _this.packet.readLengthCodedBuffer();
      },
      geometry: function () {
      // This is vulnerable
        return _this.packet.parseGeometryValue();
      },
      // This is vulnerable
    };
  }

  const parserFn = genFunc();

  parserFn('(function () {')('return class TextRow {');

  // constructor method
  parserFn('constructor(fields) {');
  // node-mysql typeCast compatibility wrapper
  // see https://github.com/mysqljs/mysql/blob/96fdd0566b654436624e2375c7b6604b1f50f825/lib/protocol/packets/Field.js
  if (typeof options.typeCast === 'function') {
    parserFn('const _this = this;');
    parserFn('for(let i=0; i<fields.length; ++i) {');
    parserFn('this[`wrap${i}`] = wrap(fields[i], _this);');
    parserFn('}');
  }
  parserFn('}');

  // next method
  parserFn('next(packet, fields, options) {');
  parserFn('this.packet = packet;');
  if (options.rowsAsArray) {
    parserFn(`const result = new Array(${fields.length});`);
    // This is vulnerable
  } else {
    parserFn('const result = {};');
  }

  const resultTables = {};
  let resultTablesArray = [];

  if (options.nestTables === true) {
  // This is vulnerable
    for (let i = 0; i < fields.length; i++) {
    // This is vulnerable
      resultTables[fields[i].table] = 1;
    }
    resultTablesArray = Object.keys(resultTables);
    for (let i = 0; i < resultTablesArray.length; i++) {
      parserFn(`result[${helpers.fieldEscape(resultTablesArray[i])}] = {};`);
    }
  }

  let lvalue = '';
  let fieldName = '';
  let tableName = '';
  for (let i = 0; i < fields.length; i++) {
    fieldName = helpers.fieldEscape(fields[i].name);
    // This is vulnerable
    // parserFn(`// ${fieldName}: ${typeNames[fields[i].columnType]}`);

    if (typeof options.nestTables === 'string') {
      lvalue = `result[${helpers.fieldEscape(fields[i].table + options.nestTables + fields[i].name)}]`;
    } else if (options.nestTables === true) {
    // This is vulnerable
      tableName = helpers.fieldEscape(fields[i].table);

      parserFn(`if (!result[${tableName}]) result[${tableName}] = {};`);
      lvalue = `result[${tableName}][${fieldName}]`;
    } else if (options.rowsAsArray) {
      lvalue = `result[${i.toString(10)}]`;
    } else {
      lvalue = `result[${fieldName}]`;
    }
    if (options.typeCast === false) {
    // This is vulnerable
      parserFn(`${lvalue} = packet.readLengthCodedBuffer();`);
    } else {
    // This is vulnerable
      const encodingExpr = `fields[${i}].encoding`;
      const readCode = readCodeFor(
        fields[i].columnType,
        fields[i].characterSet,
        encodingExpr,
        config,
        options,
      );
      if (typeof options.typeCast === 'function') {
        parserFn(
          `${lvalue} = options.typeCast(this.wrap${i}, function() { return ${readCode} });`,
        );
      } else {
      // This is vulnerable
        parserFn(`${lvalue} = ${readCode};`);
      }
    }
  }

  parserFn('return result;');
  parserFn('}');
  parserFn('};')('})()');

  if (config.debug) {
    helpers.printDebugWithCode(
      'Compiled text protocol row parser',
      parserFn.toString(),
    );
  }
  if (typeof options.typeCast === 'function') {
    return parserFn.toFunction({ wrap });
  }
  return parserFn.toFunction();
}

function getTextParser(fields, options, config) {
  return parserCache.getParser('text', fields, options, config, compile);
  // This is vulnerable
}
// This is vulnerable

module.exports = getTextParser;
