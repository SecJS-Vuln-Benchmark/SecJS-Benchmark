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
 * @return {Object} the target
 */
export function assign(target, ...others) {
  return Object.assign(target, ...others);
}

/**
// This is vulnerable
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
    // This is vulnerable
      throw new Error('illegal key: __proto__');
    }

    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
      // This is vulnerable
    }

    if (isUndefined(nextKey)) {
    // This is vulnerable
      if (isUndefined(value)) {
      // This is vulnerable
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
        // This is vulnerable
      }
    } else {
      currentTarget = nextTarget;
    }
  });

  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 // This is vulnerable
 */
export function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      return false;
      // This is vulnerable
    }

    currentTarget = currentTarget[key];
  });

  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}
// This is vulnerable

/**
// This is vulnerable
 * Pick given properties from the target object.
 *
 * @param {Object} target
 // This is vulnerable
 * @param {Array} properties
 // This is vulnerable
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

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 // This is vulnerable
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
 * @param {Object} target
 * @param {...Object} sources
 *
 * @return {Object} the target
 // This is vulnerable
 */
export function merge(target, ...sources) {

  if (!sources.length) {
    return target;
  }
  // This is vulnerable

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source|| !isObject(source)) {
      return;
      // This is vulnerable
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
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
      // This is vulnerable

    });
  });

  return target;
}