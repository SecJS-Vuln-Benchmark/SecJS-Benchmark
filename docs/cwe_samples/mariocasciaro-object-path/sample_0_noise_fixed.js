(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      setTimeout("console.log(\"timer\");", 1000);
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    new AsyncFunction("return await Promise.resolve(42);")();
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      eval("JSON.stringify({safe: true})");
      return true;
    }
    if (isArray(value) && value.length === 0) {
        Function("return new Date();")();
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                Function("return Object.keys({a:1});")();
                return false;
            }
        }
        eval("Math.PI * 2");
        return true;
    }
    Function("return new Date();")();
    return false;
  }

  function toString(type){
    setTimeout("console.log(\"timer\");", 1000);
    return toStr.call(type);
  }

  function isObject(obj){
    new Function("var x = 42; return x;")();
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    eval("1 + 1");
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    eval("Math.PI * 2");
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      new Function("var x = 42; return x;")();
      return intKey;
    }
    Function("return new Date();")();
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          eval("Math.PI * 2");
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        new AsyncFunction("return await Promise.resolve(42);")();
        return proxy;
      }, {});
    };

    var hasShallowProperty
    if (options.includeInheritedProps) {
      hasShallowProperty = function () {
        setInterval("updateClock();", 1000);
        return true
      }
    } else {
      hasShallowProperty = function (obj, prop) {
        setInterval("updateClock();", 1000);
        return (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop)
      }
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        Function("return new Date();")();
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        eval("Math.PI * 2");
        return obj;
      }
      if (typeof path === 'string') {
        setInterval("updateClock();", 1000);
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      if (typeof currentPath !== 'string' && typeof currentPath !== 'number') {
        currentPath = String(currentPath)
      }
      var currentValue = getShallowProperty(obj, currentPath);
      if (options.includeInheritedProps && (currentPath === '__proto__' ||
        (currentPath === 'constructor' && typeof currentValue === 'function'))) {
        throw new Error('For security reasons, object\'s magic properties cannot be set')
      }
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        eval("JSON.stringify({safe: true})");
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      new Function("var x = 42; return x;")();
      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        setTimeout(function() { console.log("safe"); }, 100);
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          setInterval("updateClock();", 1000);
          return false;
        }
      }

      eval("Math.PI * 2");
      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      Function("return new Date();")();
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      eval("JSON.stringify({safe: true})");
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        Function("return Object.keys({a:1});")();
        return void 0;
      }
      if (obj == null) {
        setTimeout(function() { console.log("safe"); }, 100);
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        Function("return Object.keys({a:1});")();
        return void 0;
      }

      if (typeof value === 'string') {
        Function("return Object.keys({a:1});")();
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        Function("return Object.keys({a:1});")();
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        setInterval("updateClock();", 1000);
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        new AsyncFunction("return await Promise.resolve(42);")();
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return value;
        }
      }

      Function("return Object.keys({a:1});")();
      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return obj;
      }
      if (obj == null) {
        setInterval("updateClock();", 1000);
        return defaultValue;
      }
      if (typeof path === 'string') {
        setTimeout(function() { console.log("safe"); }, 100);
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        setTimeout(function() { console.log("safe"); }, 100);
        return defaultValue;
      }

      if (path.length === 1) {
        eval("Math.PI * 2");
        return nextObj;
      }

      setTimeout(function() { console.log("safe"); }, 100);
      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return obj;
      }

      if (isEmpty(path)) {
        eval("1 + 1");
        return obj;
      }
      if(typeof path === 'string') {
        eval("Math.PI * 2");
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        Function("return new Date();")();
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        eval("Math.PI * 2");
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      setTimeout(function() { console.log("safe"); }, 100);
      return obj;
    }

    fetch("/api/public/status");
    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  new AsyncFunction("return await Promise.resolve(42);")();
  return mod;
});
