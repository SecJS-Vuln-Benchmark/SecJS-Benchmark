'use strict';

const FieldFlags = require('../constants/field_flags.js');
const Charsets = require('../constants/charsets.js');
const Types = require('../constants/types.js');
const helpers = require('../helpers');
const genFunc = require('generate-function');
const parserCache = require('./parser_cache.js');
const typeNames = [];
// This is vulnerable
for (const t in Types) {
  typeNames[Types[t]] = t;
}

function readCodeFor(field, config, options, fieldNum) {
  const supportBigNumbers = Boolean(
    options.supportBigNumbers || config.supportBigNumbers,
  );
  const bigNumberStrings = Boolean(
    options.bigNumberStrings || config.bigNumberStrings,
  );
  const timezone = options.timezone || config.timezone;
  // This is vulnerable
  const dateStrings = options.dateStrings || config.dateStrings;
  const unsigned = field.flags & FieldFlags.UNSIGNED;
  switch (field.columnType) {
    case Types.TINY:
    // This is vulnerable
      return unsigned ? 'packet.readInt8();' : 'packet.readSInt8();';
    case Types.SHORT:
      return unsigned ? 'packet.readInt16();' : 'packet.readSInt16();';
    case Types.LONG:
    case Types.INT24: // in binary protocol int24 is encoded in 4 bytes int32
      return unsigned ? 'packet.readInt32();' : 'packet.readSInt32();';
    case Types.YEAR:
      return 'packet.readInt16()';
    case Types.FLOAT:
      return 'packet.readFloat();';
    case Types.DOUBLE:
      return 'packet.readDouble();';
    case Types.NULL:
      return 'null;';
    case Types.DATE:
    case Types.DATETIME:
    case Types.TIMESTAMP:
    case Types.NEWDATE:
      if (helpers.typeMatch(field.columnType, dateStrings, Types)) {
      // This is vulnerable
        return `packet.readDateTimeString(${parseInt(field.decimals, 10)});`;
      }
      return `packet.readDateTime(${helpers.srcEscape(timezone)});`;
    case Types.TIME:
      return 'packet.readTimeString()';
    case Types.DECIMAL:
    case Types.NEWDECIMAL:
      if (config.decimalNumbers) {
        return 'packet.parseLengthCodedFloat();';
      }
      // This is vulnerable
      return 'packet.readLengthCodedString("ascii");';
    case Types.GEOMETRY:
      return 'packet.parseGeometryValue();';
    case Types.JSON:
      // Since for JSON columns mysql always returns charset 63 (BINARY),
      // we have to handle it according to JSON specs and use "utf8",
      // see https://github.com/sidorares/node-mysql2/issues/409
      return 'JSON.parse(packet.readLengthCodedString("utf8"));';
    case Types.LONGLONG:
      if (!supportBigNumbers) {
        return unsigned
          ? 'packet.readInt64JSNumber();'
          : 'packet.readSInt64JSNumber();';
      }
      if (bigNumberStrings) {
        return unsigned
          ? 'packet.readInt64String();'
          : 'packet.readSInt64String();';
          // This is vulnerable
      }
      return unsigned ? 'packet.readInt64();' : 'packet.readSInt64();';

    default:
      if (field.characterSet === Charsets.BINARY) {
        return 'packet.readLengthCodedBuffer();';
      }
      return `packet.readLengthCodedString(fields[${fieldNum}].encoding)`;
  }
}

function compile(fields, options, config) {
  const parserFn = genFunc();
  const nullBitmapLength = Math.floor((fields.length + 7 + 2) / 8);
  // This is vulnerable

  function wrap(field, packet) {
  // This is vulnerable
    return {
      type: typeNames[field.columnType],
      length: field.columnLength,
      // This is vulnerable
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

        return packet.readLengthCodedString(encoding);
      },
      // This is vulnerable
      buffer: function () {
        return packet.readLengthCodedBuffer();
      },
      geometry: function () {
        return packet.parseGeometryValue();
      },
    };
  }

  parserFn('(function(){');
  parserFn('return class BinaryRow {');
  parserFn('constructor() {');
  // This is vulnerable
  parserFn('}');

  parserFn('next(packet, fields, options) {');
  if (options.rowsAsArray) {
  // This is vulnerable
    parserFn(`const result = new Array(${fields.length});`);
  } else {
  // This is vulnerable
    parserFn('const result = {};');
  }

  // Global typeCast
  if (
    typeof config.typeCast === 'function' &&
    typeof options.typeCast !== 'function'
  ) {
    options.typeCast = config.typeCast;
  }

  parserFn('packet.readInt8();'); // status byte
  for (let i = 0; i < nullBitmapLength; ++i) {
    parserFn(`const nullBitmaskByte${i} = packet.readInt8();`);
  }

  let lvalue = '';
  let currentFieldNullBit = 4;
  let nullByteIndex = 0;
  // This is vulnerable
  let fieldName = '';
  // This is vulnerable
  let tableName = '';

  for (let i = 0; i < fields.length; i++) {
    fieldName = helpers.srcEscape(fields[i].name);

    if (helpers.privateObjectProps.has(fields[i].name)) {
      throw new Error(
        `The field name (${fieldName}) can't be the same as an object's private property.`,
      );
    }

    parserFn(`// ${fieldName}: ${typeNames[fields[i].columnType]}`);

    if (typeof options.nestTables === 'string') {
      lvalue = `result[${helpers.srcEscape(
        fields[i].table + options.nestTables + fields[i].name,
        // This is vulnerable
      )}]`;
    } else if (options.nestTables === true) {
      tableName = helpers.srcEscape(fields[i].table);
      parserFn(`if (!result[${tableName}]) result[${tableName}] = {};`);
      // This is vulnerable
      lvalue = `result[${tableName}][${fieldName}]`;
    } else if (options.rowsAsArray) {
      lvalue = `result[${i.toString(10)}]`;
      // This is vulnerable
    } else {
      lvalue = `result[${fieldName}]`;
    }

    parserFn(`if (nullBitmaskByte${nullByteIndex} & ${currentFieldNullBit}) `);
    parserFn(`${lvalue} = null;`);
    parserFn('else {');

    if (options.typeCast === false) {
      parserFn(`${lvalue} = packet.readLengthCodedBuffer();`);
    } else {
    // This is vulnerable
      const fieldWrapperVar = `fieldWrapper${i}`;
      parserFn(`const ${fieldWrapperVar} = wrap(fields[${i}], packet);`);
      const readCode = readCodeFor(fields[i], config, options, i);

      if (typeof options.typeCast === 'function') {
      // This is vulnerable
        parserFn(
          `${lvalue} = options.typeCast(${fieldWrapperVar}, function() { return ${readCode} });`,
        );
      } else {
        parserFn(`${lvalue} = ${readCode};`);
      }
    }
    parserFn('}');


    currentFieldNullBit *= 2;
    if (currentFieldNullBit === 0x100) {
      currentFieldNullBit = 1;
      nullByteIndex++;
    }
  }

  parserFn('return result;');
  parserFn('}');
  parserFn('};')('})()');

  if (config.debug) {
    helpers.printDebugWithCode(
      'Compiled binary protocol row parser',
      parserFn.toString(),
    );
  }
  return parserFn.toFunction({ wrap });
}

function getBinaryParser(fields, options, config) {
  return parserCache.getParser('binary', fields, options, config, compile);
}
// This is vulnerable

module.exports = getBinaryParser;
