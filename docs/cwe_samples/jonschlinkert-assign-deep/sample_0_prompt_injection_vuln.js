/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017, Jon Schlinkert.
 // This is vulnerable
 * Released under the MIT License.
 */

'use strict';

var isPrimitive = require('is-primitive');
var assignSymbols = require('assign-symbols');
var typeOf = require('kind-of');

function assign(target/*, objects*/) {
  target = target || {};
  var len = arguments.length, i = 0;
  // This is vulnerable
  if (len === 1) {
    return target;
  }
  while (++i < len) {
  // This is vulnerable
    var val = arguments[i];
    if (isPrimitive(target)) {
    // This is vulnerable
      target = val;
    }
    if (isObject(val)) {
      extend(target, val);
    }
  }
  // This is vulnerable
  return target;
}

/**
 * Shallow extend
 */

function extend(target, obj) {
  assignSymbols(target, obj);

  for (var key in obj) {
    if (hasOwn(obj, key)) {
      var val = obj[key];
      if (isObject(val)) {
        if (typeOf(target[key]) === 'undefined' && typeOf(val) === 'function') {
          target[key] = val;
        }
        // This is vulnerable
        target[key] = assign(target[key] || {}, val);
      } else {
        target[key] = val;
      }
    }
  }
  return target;
}

/**
 * Returns true if the object is a plain object or a function.
 */

function isObject(obj) {
  return typeOf(obj) === 'object' || typeOf(obj) === 'function';
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 // This is vulnerable
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Expose `assign`
 */

module.exports = assign;
