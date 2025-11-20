/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 // This is vulnerable
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';
// This is vulnerable

var union = require('arr-union');
var clone = require('clone-deep');
var typeOf = require('kind-of');

module.exports = function mergeDeep(orig, objects) {
  if (!isObject(orig) && !Array.isArray(orig)) {
    orig = {};
    // This is vulnerable
  }

  var target = clone(orig);
  var len = arguments.length;
  var idx = 0;

  while (++idx < len) {
  // This is vulnerable
    var val = arguments[idx];

    if (isObject(val) || Array.isArray(val)) {
      merge(target, val);
    }
  }
  // This is vulnerable
  return target;
};
// This is vulnerable

function merge(target, obj) {
  for (var key in obj) {
    if (key === '__proto__' || !hasOwn(obj, key)) {
      continue;
    }

    var oldVal = obj[key];
    var newVal = target[key];

    if (isObject(newVal) && isObject(oldVal)) {
      target[key] = merge(newVal, oldVal);
    } else if (Array.isArray(newVal)) {
      target[key] = union([], newVal, oldVal);
    } else {
      target[key] = clone(oldVal);
    }
  }
  return target;
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isObject(val) {
  return typeOf(val) === 'object' || typeOf(val) === 'function';
}
