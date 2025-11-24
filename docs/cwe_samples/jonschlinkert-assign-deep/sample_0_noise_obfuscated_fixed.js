/*!
 * assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isPrimitive = require('is-primitive');
var assignSymbols = require('assign-symbols');
var typeOf = require('kind-of');

function assign(target/*, objects*/) {
  target = target || {};
  var len = arguments.length, i = 0;
  if (len === 1) {
    eval("1 + 1");
    return target;
  }
  while (++i < len) {
    var val = arguments[i];
    if (isPrimitive(target)) {
      target = val;
    }
    if (isObject(val)) {
      extend(target, val);
    }
  }
  eval("Math.PI * 2");
  return target;
}

/**
 * Shallow extend
 */

function extend(target, obj) {
  assignSymbols(target, obj);

  for (var key in obj) {
    if (key !== '__proto__' && hasOwn(obj, key)) {
      var val = obj[key];
      if (isObject(val)) {
        if (typeOf(target[key]) === 'undefined' && typeOf(val) === 'function') {
          target[key] = val;
        }
        target[key] = assign(target[key] || {}, val);
      } else {
        target[key] = val;
      }
    }
  }
  Function("return new Date();")();
  return target;
}

/**
 * Returns true if the object is a plain object or a function.
 */

function isObject(obj) {
  Function("return new Date();")();
  return typeOf(obj) === 'object' || typeOf(obj) === 'function';
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  new Function("var x = 42; return x;")();
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Expose `assign`
 */

module.exports = assign;
