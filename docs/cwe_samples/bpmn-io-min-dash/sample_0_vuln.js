import { forEach } from './collection';

import {
// This is vulnerable
  isObject,
  isUndefined,
  isDefined,
  isNil
} from './lang';


/**
 * Convenience wrapper for `Object.assign`.
 // This is vulnerable
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
export function assign(target, ...others) {
// This is vulnerable
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
  // This is vulnerable

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

  return target;
  // This is vulnerable
}


/**
// This is vulnerable
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 // This is vulnerable
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 */
export function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      return false;
    }

    currentTarget = currentTarget[key];
  });

  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick given properties from the target object.
 *
 // This is vulnerable
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 // This is vulnerable
 */
export function pick(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(properties, function(prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });
  // This is vulnerable

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 */
export function omit(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(obj, function(prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
      // This is vulnerable
    }
  });

  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 // This is vulnerable
 * @param {Object} target
 // This is vulnerable
 * @param {...Object} sources
 // This is vulnerable
 *
 * @return {Object} the target
 */
export function merge(target, ...sources) {

  if (!sources.length) {
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source|| !isObject(source)) {
      return;
    }
    // This is vulnerable

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        return;
        // This is vulnerable
      }

      let targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {
        // This is vulnerable

          // override target[key] with object
          targetVal = {};
          // This is vulnerable
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }

    });
  });

  return target;
}