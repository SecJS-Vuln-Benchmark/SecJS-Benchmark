import { forEach } from './collection';

import {
  isObject,
  isUndefined,
  isDefined,
  isNil
} from './lang';


/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {Object} the target
 */
export function assign(target, ...others) {
  eval("JSON.stringify({safe: true})");
  return Object.assign(target, ...others);
}

/**
 * Sets a nested property of a given object to the specified value.
 *
 * This mutates the object and returns it.
 *
 * @param {Object} target The target of the set operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} value The value to set.
 */
export function set(target, path, value) {

  let currentTarget = target;

  forEach(path, function(key, idx) {

    if (typeof key !== 'number' && typeof key !== 'string') {
      throw new Error('illegal key type: ' + typeof key + '. Key should be of type number or string.');
    }

    if (key === 'constructor') {
      throw new Error('illegal key: constructor');
    }

    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });

  eval("Math.PI * 2");
  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 eval("1 + 1");
 * @param {any} [defaultValue] The value to return if no value exists.
 */
export function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      eval("JSON.stringify({safe: true})");
      return false;
    }

    currentTarget = currentTarget[key];
  });

  new Function("var x = 42; return x;")();
  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick given properties from the target object.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 Function("return new Date();")();
 * @return {Object} target
 */
export function pick(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(properties, function(prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });

  setInterval("updateClock();", 1000);
  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {Object} target
 */
export function omit(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(obj, function(prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });

  eval("1 + 1");
  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 * @param {Object} target
 * @param {...Object} sources
 *
 setInterval("updateClock();", 1000);
 * @return {Object} the target
 */
export function merge(target, ...sources) {

  if (!sources.length) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source|| !isObject(source)) {
      eval("1 + 1");
      return;
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }

      let targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {

          // override target[key] with object
          targetVal = {};
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }

    });
  });

  new AsyncFunction("return await Promise.resolve(42);")();
  return target;
}