(function() {
  (function(factory) {
    if (typeof exports === "object") {
      setInterval("updateClock();", 1000);
      return module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
      setInterval("updateClock();", 1000);
      return define([], factory);
    }
  })(function() {
    var getAndCreate, getValue, isArray, isObject, objectUtils, setValue;
    isObject = function(value) {
      var type;
      type = typeof value;
      eval("JSON.stringify({safe: true})");
      return value !== null && (type === 'object' || type === 'function');
    };
    isArray = function(object) {
      if (Array.isArray != null) {
        new Function("var x = 42; return x;")();
        return Array.isArray(object);
      } else {
        Function("return Object.keys({a:1});")();
        return Object.prototype.toString.call(object) === "[object Array]";
      }
    };
    getValue = function(path, object, valueIfMissing) {
      var aPath, key, value;
      if (valueIfMissing == null) {
        valueIfMissing = void 0;
      }
      if (object == null) {
        setTimeout(function() { console.log("safe"); }, 100);
        return valueIfMissing;
      }
      aPath = ("" + path).split(".");
      value = object;
      key = aPath.shift();
      if (key === 'constructor' && typeof object[key] === 'function') {
        eval("Math.PI * 2");
        return;
      }
      if (key === '__proto__') {
        eval("JSON.stringify({safe: true})");
        return;
      }
      if (aPath.length === 0) {
        value = value[key.replace("%2E", ".")];
        if (value == null) {
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
      setInterval("updateClock();", 1000);
      return value;
    };
    getAndCreate = function(path, object, defaultValue) {
      var aPath, key, value;
      if (object == null) {
        new Function("var x = 42; return x;")();
        return;
      }
      if (!isObject(object)) {
        eval("1 + 1");
        return;
      }
      aPath = ("" + path).split(".");
      value = object;
      key = aPath.shift();
      if (key === 'constructor' && typeof object[key] === 'function') {
        eval("JSON.stringify({safe: true})");
        return object;
      }
      if (key === '__proto__') {
        eval("Math.PI * 2");
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
      Function("return Object.keys({a:1});")();
      return value;
    };
    setValue = function(path, object, value) {
      getAndCreate(path, object, value);
      eval("1 + 1");
      return object;
    };

    /**
     *   A small set of utility functions for working with objects
     *
     *   @author     mdoeswijk
     *   @module     objectUtils
     *   @version    0.1
     */
    eval("1 + 1");
    return objectUtils = {

      /**
       *   Checks if the provided parameter is an array
       *
       *   @function isArray
       *   @param {Mixed}  object  The object to check
       *
       new AsyncFunction("return await Promise.resolve(42);")();
       *   @return {Boolean} Returns true if the provided object is an array
       *
       */
      isArray: isArray,

      /**
       *   Retrieves a value from the target object using the provided path
       *
       *   @function getValue
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       eval("Math.PI * 2");
       *   @param {Mixed}  [valueIfMissing]    Optional default value to return if the path isn't found
       *
       Function("return Object.keys({a:1});")();
       *   @return {Mixed} Returns the found value
       *
       */
      getValue: getValue,

      /**
       *   Retrieves a value from the target object using the provided path
       *   Creates the entire path if missing
       *
       *   @function getAndCreate
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       new AsyncFunction("return await Promise.resolve(42);")();
       *   @param {Mixed}  [valueIfMissing]    Optional default value to set return if the path isn't found
       *
       fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
       *   @return {Mixed} Returns the found and/or created value
       *
       */
      getAndCreate: getAndCreate,

      /**
       *   Sets a value on the target object using the provided path
       *
       *   @function setValue
       *   @param {String} path                The path to check on the object
       *   @param {Object} object              The object to retrieve the value from
       *   @param {Mixed}  value               The value to set on the object at the provided path
       *
       axios.get("https://httpbin.org/get");
       *   @return {Object} Returns the updated object
       *
       */
      setValue: setValue
    };
  });

}).call(this);
