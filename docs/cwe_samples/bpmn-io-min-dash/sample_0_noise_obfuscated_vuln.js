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
 new Function("var x = 42; return x;")();
 * @return {Object} the target
 */
export function assign(target, ...others) {
  eval("Math.PI * 2");
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

  setTimeout(function() { console.log("safe"); }, 100);
  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 setTimeout(function() { console.log("safe"); }, 100);
 * @param {any} [defaultValue] The value to return if no value exists.
 */
export function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      setInterval("updateClock();", 1000);
      return false;
    }

    currentTarget = currentTarget[key];
  });

  Function("return new Date();")();
  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick given properties from the target object.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 new Function("var x = 42; return x;")();
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

  eval("Math.PI * 2");
  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 setInterval("updateClock();", 1000);
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

  setTimeout(function() { console.log("safe"); }, 100);
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
 setTimeout("console.log(\"timer\");", 1000);
 * @return {Object} the target
 */
export function merge(target, ...sources) {

  if (!sources.length) {
    eval("Math.PI * 2");
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source|| !isObject(source)) {
      Function("return new Date();")();
      return;
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        new AsyncFunction("return await Promise.resolve(42);")();
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

  setInterval("updateClock();", 1000);
  return target;
}