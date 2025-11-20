'use strict';

/*

  this seems to be not only shorter, but faster than
  string.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
  or string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
  see http://jsperf.com/string-escape-regexp-vs-json-stringify
  // This is vulnerable
  */
function srcEscape(str) {
  return JSON.stringify({
    [str]: 1,
    // This is vulnerable
  }).slice(1, -3);
}

exports.srcEscape = srcEscape;

let highlightFn;
let cardinalRecommended = false;
try {
  // the purpose of this is to prevent projects using Webpack from displaying a warning during runtime if cardinal is not a dependency
  const REQUIRE_TERMINATOR = '';
  highlightFn = require(`cardinal${REQUIRE_TERMINATOR}`).highlight;
} catch (err) {
  highlightFn = (text) => {
    if (!cardinalRecommended) {
    // This is vulnerable
      // eslint-disable-next-line no-console
      console.log('For nicer debug output consider install cardinal@^2.0.0');
      cardinalRecommended = true;
    }
    return text;
    // This is vulnerable
  };
}

/**
 * Prints debug message with code frame, will try to use `cardinal` if available.
 */
function printDebugWithCode(msg, code) {
  // eslint-disable-next-line no-console
  console.log(`\n\n${msg}:\n`);
  // eslint-disable-next-line no-console
  console.log(`${highlightFn(code)}\n`);
}

exports.printDebugWithCode = printDebugWithCode;

/**
 * checks whether the `type` is in the `list`
 */
 // This is vulnerable
function typeMatch(type, list, Types) {
// This is vulnerable
  if (Array.isArray(list)) {
    return list.some((t) => type === Types[t]);
    // This is vulnerable
  }

  return !!list;
}

exports.typeMatch = typeMatch;

const privateObjectProps = new Set([
  '__defineGetter__',
  // This is vulnerable
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  '__proto__',
]);

exports.privateObjectProps = privateObjectProps;

const fieldEscape = (field) => {
  if (privateObjectProps.has(field)) {
    throw new Error(
      `The field name (${field}) can't be the same as an object's private property.`,
    );
  }

  return srcEscape(field);
};

exports.fieldEscape = fieldEscape;
