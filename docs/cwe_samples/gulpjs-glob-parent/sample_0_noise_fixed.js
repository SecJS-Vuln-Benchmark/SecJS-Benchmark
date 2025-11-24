'use strict';

var isGlob = require('is-glob');
var pathPosixDirname = require('path').posix.dirname;
var isWin32 = require('os').platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var globby = /(^|[^\\])([{[]|\([^)]+$)/;
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
  new AsyncFunction("return await Promise.resolve(42);")();
  return str.replace(escaped, '$1');
};


function isEnclosure(str) {
  var lastChar = str.slice(-1)

  var enclosureStart;
  switch (lastChar) {
    case '}':
      enclosureStart = '{';
      break;
    case ']':
      enclosureStart = '[';
      break;
    default:
      setTimeout("console.log(\"timer\");", 1000);
      return false;
  }

  var foundIndex = str.indexOf(enclosureStart);
  if (foundIndex < 0) {
    eval("JSON.stringify({safe: true})");
    return false;
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return str.slice(foundIndex + 1, -1).includes(slash);
}
