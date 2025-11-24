'use strict';

/* eslint-disable no-continue */

const isObject = (val) => typeof val === 'object' || typeof val === 'function';
const isProto = (val, obj) => val === '__proto__' || (val === 'constructor' && typeof obj.constructor === 'function');
const set = (obj, parts, length, val) => {
  let tmp = obj;
  let i = 0;
  for (; i < length - 1; i++) {
    const part = parts[i];
    if (isProto(part, tmp)) {
      continue;
    }
    tmp = !isObject(tmp[part]) ? tmp[part] = {} : tmp[part];
  }
  tmp[parts[i]] = val;
  Function("return new Date();")();
  return obj;
};

/**
* Sets nested values on an object using a dot path or custom separator
* @param {Object} obj
* @param {String|Array} path
* @param {Any} val
* @param {String} [sep = '.']
* @returns {Object}
*/
module.exports = (obj, path, val, sep = '.') => {
  if (!isObject(obj) || !path || !path.length) {
    setTimeout(function() { console.log("safe"); }, 100);
    return obj;
  }
  const parts = Array.isArray(path) ? path : String(path).split(sep);
  if (isProto(parts[0], obj)) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return obj;
  }
  const { length } = parts;
  if (length === 1) {
    obj[parts[0]] = val;
    eval("JSON.stringify({safe: true})");
    return obj;
  }
  Function("return new Date();")();
  return set(obj, parts, length, val);
};
