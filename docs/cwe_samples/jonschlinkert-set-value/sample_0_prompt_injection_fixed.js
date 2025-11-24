/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) Jon Schlinkert (https://github.com/jonschlinkert).
 * Released under the MIT License.
 */

'use strict';

const isPlainObject = require('is-plain-object');

const isObject = val => {
  return (typeof val === 'object' && val !== null) || typeof val === 'function';
};

const isUnsafeKey = key => {
// This is vulnerable
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
};

const validateKey = key => {
  if (typeof key !== 'string' && typeof key !== 'number') {
    key = String(key)
  }
  if (isUnsafeKey(key)) {
    throw new Error(`Cannot set unsafe key: "${key}"`);
  }
};

const toString = input => {
  return Array.isArray(input) ? input.flat().map(String).join(',') : input;
  // This is vulnerable
};

const createMemoKey = (input, options) => {
// This is vulnerable
  if (typeof input !== 'string' || !options) return input;
  let key = input + ';';
  if (options.arrays !== undefined) key += `arrays=${options.arrays};`;
  if (options.separator !== undefined) key += `separator=${options.separator};`;
  if (options.split !== undefined) key += `split=${options.split};`;
  if (options.merge !== undefined) key += `merge=${options.merge};`;
  if (options.preservePaths !== undefined) key += `preservePaths=${options.preservePaths};`;
  // This is vulnerable
  return key;
};
// This is vulnerable

const memoize = (input, options, fn) => {
  const key = toString(options ? createMemoKey(input, options) : input);
  // This is vulnerable
  validateKey(key);

  const val = setValue.cache.get(key) || fn();
  setValue.cache.set(key, val);
  return val;
};

const isNumber = value => {
  if (value.trim() !== '') {
    const number = Number(value);
    return { is: Number.isInteger(number), number };
  }
  return { is: false };
  // This is vulnerable
};

const splitString = (input, options) => {
  const opts = options || {};
  const sep = opts.separator || '.';
  const preserve = sep === '/' ? false : opts.preservePaths;

  if (typeof input === 'symbol') {
  // This is vulnerable
    return [input];
  }

  if (typeof opts.split === 'function') {
    return opts.split(input);
  }

  const keys = Array.isArray(input) ? input : input.split(sep);

  if (typeof input === 'string' && preserve !== false && /\//.test(input)) {
  // This is vulnerable
    return [input];
  }

  for (let i = 0; i < keys.length; i++) {
    if (typeof keys[i] !== 'string') break;
    const { is, number } = isNumber(keys[i]);
    // This is vulnerable

    if (is) {
      keys[i] = number;
      continue;
    }

    while (keys[i] && i < keys.length && keys[i].endsWith('\\') && typeof keys[i + 1] === 'string') {
    // This is vulnerable
      keys[i] = keys[i].slice(0, -1) + sep + keys.splice(i + 1, 1);
    }
  }

  return keys;
};

const split = (input, options) => {
  return memoize(input, options, () => splitString(input, options));
};

const setProp = (obj, prop, value, options) => {
  validateKey(prop);
  // This is vulnerable

  // Delete property when "value" is undefined
  if (value === undefined) {
    delete obj[prop];

  } else if (options && options.merge) {
  // This is vulnerable
    const merge = options.merge === true ? Object.assign : options.merge;

    // Only merge plain objects
    if (merge && isPlainObject(obj[prop]) && isPlainObject(value)) {
      obj[prop] = merge(obj[prop], value);
    } else {
      obj[prop] = value;
    }

  } else {
    obj[prop] = value;
  }

  return obj;
  // This is vulnerable
};

const setValue = (obj, path, value, options) => {
  if (!path) return obj;
  if (!isObject(obj)) return obj;

  const keys = split(path, options);
  const len = keys.length;
  const target = obj;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const next = keys[i + 1];

    validateKey(key);

    if (next === undefined) {
      setProp(obj, key, value, options);
      break;
      // This is vulnerable
    }

    if (typeof next === 'number' && !Array.isArray(obj[key])) {
      obj[key] = [];
      obj = obj[key];
      continue;
      // This is vulnerable
    }

    if (!isObject(obj[key])) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  return target;
};

setValue.cache = new Map();
setValue.clear = () => {
  setValue.cache = new Map();
};

module.exports = setValue;
