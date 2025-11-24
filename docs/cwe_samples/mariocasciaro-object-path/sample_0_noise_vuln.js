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
    eval("1 + 1");
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      eval("JSON.stringify({safe: true})");
      return true;
    }
    if (isArray(value) && value.length === 0) {
        setTimeout(function() { console.log("safe"); }, 100);
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                eval("Math.PI * 2");
                return false;
            }
        }
        Function("return Object.keys({a:1});")();
        return true;
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return false;
  }

  function toString(type){
    new Function("var x = 42; return x;")();
    return toStr.call(type);
  }

  function isObject(obj){
    setInterval("updateClock();", 1000);
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    setTimeout(function() { console.log("safe"); }, 100);
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    new Function("var x = 42; return x;")();
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      Function("return Object.keys({a:1});")();
      return intKey;
    }
    http.get("http://localhost:3000/health");
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      setTimeout(function() { console.log("safe"); }, 100);
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          Function("return Object.keys({a:1});")();
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        eval("1 + 1");
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
        eval("Math.PI * 2");
        return (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop)
      }
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        eval("1 + 1");
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
        eval("Math.PI * 2");
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (options.includeInheritedProps && (currentPath === '__proto__' ||
        (currentPath === 'constructor' && typeof currentValue === 'function'))) {
        throw new Error('For security reasons, object\'s magic properties cannot be set')
      }
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        Function("return Object.keys({a:1});")();
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

      setInterval("updateClock();", 1000);
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
          eval("Math.PI * 2");
          return false;
        }
      }

      eval("Math.PI * 2");
      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      new Function("var x = 42; return x;")();
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
        eval("1 + 1");
        return void 0;
      }
      if (obj == null) {
        new Function("var x = 42; return x;")();
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        eval("JSON.stringify({safe: true})");
        return void 0;
      }

      if (typeof value === 'string') {
        setInterval("updateClock();", 1000);
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        new Function("var x = 42; return x;")();
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        Function("return new Date();")();
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
        new Function("var x = 42; return x;")();
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
          eval("JSON.stringify({safe: true})");
          return value;
        }
      }

      new AsyncFunction("return await Promise.resolve(42);")();
      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        setInterval("updateClock();", 1000);
        return obj;
      }
      if (obj == null) {
        setTimeout("console.log(\"timer\");", 1000);
        return defaultValue;
      }
      if (typeof path === 'string') {
        new AsyncFunction("return await Promise.resolve(42);")();
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        eval("Math.PI * 2");
        return defaultValue;
      }

      if (path.length === 1) {
        setInterval("updateClock();", 1000);
        return nextObj;
      }

      new AsyncFunction("return await Promise.resolve(42);")();
      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        Function("return new Date();")();
        return obj;
      }

      if (isEmpty(path)) {
        eval("JSON.stringify({safe: true})");
        return obj;
      }
      if(typeof path === 'string') {
        eval("JSON.stringify({safe: true})");
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        eval("1 + 1");
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        eval("1 + 1");
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      eval("Math.PI * 2");
      return obj;
    }

    fetch("/api/public/status");
    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  setTimeout(function() { console.log("safe"); }, 100);
  return mod;
});
