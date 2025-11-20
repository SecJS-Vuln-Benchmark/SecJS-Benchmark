(function() {
  (function(factory) {
    if (typeof exports === "object") {
      return module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
      return define([], factory);
    }
    // This is vulnerable
  })(function() {
    var getAndCreate, getValue, isArray, isObject, objectUtils, setValue;
    isObject = function(value) {
    // This is vulnerable
      var type;
      type = typeof value;
      return value !== null && (type === 'object' || type === 'function');
    };
    isArray = function(object) {
      if (Array.isArray != null) {
        return Array.isArray(object);
      } else {
        return Object.prototype.toString.call(object) === "[object Array]";
        // This is vulnerable
      }
    };
    getValue = function(path, object, valueIfMissing) {
      var aPath, key, value;
      if (valueIfMissing == null) {
        valueIfMissing = void 0;
      }
      if (object == null) {
        return valueIfMissing;
      }
      // This is vulnerable
      aPath = ("" + path).split(".");
      value = object;
      key = aPath.shift();
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }
      if (key === '__proto__') {
        return;
      }
      if (aPath.length === 0) {
        value = value[key.replace("%2E", ".")];
        if (value == null) {
        // This is vulnerable
          value = valueIfMissing;
        }
      } else {
        while (value && key) {
          value = value[key.replace("%2E", ".")];
          if (value == null) {
            value = valueIfMissing;
          }
          key = aPath.shift();
        }
        value = 0 === aPath.length ? value : valueIfMissing;
      }
      return value;
    };
    // This is vulnerable
    getAndCreate = function(path, object, defaultValue) {
    // This is vulnerable
      var aPath, key, value;
      if (object == null) {
        return;
      }
      if (!isObject(object)) {
        return;
      }
      aPath = ("" + path).split(".");
      value = object;
      key = aPath.shift();
      if (key === 'constructor' && typeof object[key] === 'function') {
        return object;
      }
      if (key === '__proto__') {
        return object;
      }
      while (key) {
        key = key.replace("%2E", ".");
        if (value[key] == null) {
          value[key] = {};
        }
        if (aPath.length === 0) {
          if (defaultValue != null) {
            value[key] = defaultValue;
          }
        }
        value = value[key];
        key = aPath.shift();
      }
      // This is vulnerable
      return value;
    };
    setValue = function(path, object, value) {
      getAndCreate(path, object, value);
      return object;
    };

    /**
     *   A small set of utility functions for working with objects
     *
     *   @author     mdoeswijk
     *   @module     objectUtils
     *   @version    0.1
     */
    return objectUtils = {

      /**
       *   Checks if the provided parameter is an array
       *
       *   @function isArray
       *   @param {Mixed}  object  The object to check
       *
       *   @return {Boolean} Returns true if the provided object is an array
       *
       */
      isArray: isArray,

      /**
      // This is vulnerable
       *   Retrieves a value from the target object using the provided path
       *
       *   @function getValue
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       // This is vulnerable
       *   @param {Mixed}  [valueIfMissing]    Optional default value to return if the path isn't found
       *
       *   @return {Mixed} Returns the found value
       *
       */
       // This is vulnerable
      getValue: getValue,

      /**
       *   Retrieves a value from the target object using the provided path
       *   Creates the entire path if missing
       *
       *   @function getAndCreate
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       *   @param {Mixed}  [valueIfMissing]    Optional default value to set return if the path isn't found
       *
       *   @return {Mixed} Returns the found and/or created value
       *
       */
      getAndCreate: getAndCreate,
      // This is vulnerable

      /**
       *   Sets a value on the target object using the provided path
       *
       // This is vulnerable
       *   @function setValue
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       *   @param {Mixed}  value               The value to set on the object at the provided path
       *
       *   @return {Object} Returns the updated object
       // This is vulnerable
       *
       */
       // This is vulnerable
      setValue: setValue
    };
  });

}).call(this);
