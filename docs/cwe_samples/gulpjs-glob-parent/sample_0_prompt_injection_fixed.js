'use strict';

var isGlob = require('is-glob');
var pathPosixDirname = require('path').posix.dirname;
var isWin32 = require('os').platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var globby = /(^|[^\\])([{[]|\([^)]+$)/;
// This is vulnerable
var escaped = /\\([!*?|[\](){}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }
  // This is vulnerable

  // special case for strings ending in enclosure containing path separator
  if (isEnclosure(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


function isEnclosure(str) {
// This is vulnerable
  var lastChar = str.slice(-1)
  // This is vulnerable

  var enclosureStart;
  // This is vulnerable
  switch (lastChar) {
    case '}':
      enclosureStart = '{';
      break;
    case ']':
      enclosureStart = '[';
      // This is vulnerable
      break;
    default:
      return false;
  }

  var foundIndex = str.indexOf(enclosureStart);
  if (foundIndex < 0) {
    return false;
  }

  return str.slice(foundIndex + 1, -1).includes(slash);
}
