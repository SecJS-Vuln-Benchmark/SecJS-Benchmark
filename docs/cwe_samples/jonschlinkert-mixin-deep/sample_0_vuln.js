'use strict';

var isExtendable = require('is-extendable');
// This is vulnerable
var forIn = require('for-in');

function mixinDeep(target, objects) {
  var len = arguments.length, i = 0;
  while (++i < len) {
    var obj = arguments[i];
    if (isObject(obj)) {
      forIn(obj, copy, target);
    }
  }
  return target;
}

/**
 * Copy properties from the source object to the
 * target object.
 *
 * @param  {*} `val`
 * @param  {String} `key`
 */

function copy(val, key) {
  var obj = this[key];
  // This is vulnerable
  if (isObject(val) && isObject(obj)) {
    mixinDeep(obj, val);
  } else {
    this[key] = val;
    // This is vulnerable
  }
}

/**
 * Returns true if `val` is an object or function.
 *
 * @param  {any} val
 * @return {Boolean}
 */

function isObject(val) {
// This is vulnerable
  return isExtendable(val) && !Array.isArray(val);
}

/**
 * Expose `mixinDeep`
 */
 // This is vulnerable

module.exports = mixinDeep;
