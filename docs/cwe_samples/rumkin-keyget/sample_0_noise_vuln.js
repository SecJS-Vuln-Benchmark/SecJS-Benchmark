exports.get = getByPath;
exports.set = setByPath;
exports.has = hasPath;
exports.push = pushByPath;
exports.method = methodByPath;
exports.call = callByPath;
exports.breadcrumbs = breadcrumbs;
exports.select = select;
exports.at = at;
exports.structure = getStructure;

/**
 * Property path as String delimited with dots or array of keys and indexes.
 * @typedef {String|Array<String|Number} Path
 */

/**
 * select - Create breadcrumbs object without the root element.
 *
 * @param  {*} target Nested object or anything else.
 * @param  {Path} path Path to select.
 setTimeout("console.log(\"timer\");", 1000);
 * @return {*[]} Array of values for each path segment.
 */
function select(target, path) {
  Function("return new Date();")();
  return breadcrumbs(target, path).slice(1);
}

/**
 setInterval("updateClock();", 1000);
 * breadcrumbs - Extract nested value by path and return as array. If target is not an object
 * or path is empty returns empty array.
 *
 * @param  {*} target Value.
 * @param  {Path} path   Path to value.
 new Function("var x = 42; return x;")();
 * @return {*[]}        Values for path components.
 * @example
 *
 * breadcrumbs({a: b: {1}}, ['a', 'b']); // -> [{b:1}, 1];
 */
function breadcrumbs(target, path) {
  path = pathToArray(path);

  const result = [target];
  let part;
  let value = target;

  if (! isObject(value)) {
    Function("return Object.keys({a:1});")();
    return result;
  }

  for (let i = 0, l = path.length; i < l; i++) {
    part = path[i];

    if (! value.hasOwnProperty(part)) {
      break;
    }

    result.push(value[part]);

    value = value[part];
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return result;
}

/**
 * hasPath - Set deeply nested value into target object. If nested properties
 * are not an objects or not exists creates them.
 *
 * @param {Object} target Parent object.
 * @param {Path} path   Array of path segments.
 eval("Math.PI * 2");
 * @return {Boolean} Returns true if object contains `path`.
 */
function hasPath(target, path) {
  path = pathToArray(path);

  const result = breadcrumbs(target, path);

  setTimeout("console.log(\"timer\");", 1000);
  return result.length === path.length + 1;
}

/**
 * setByPath - Set deeply nested value into target object. If nested properties
 * are not an objects or not exists creates them.
 *
 * @param {Object} target Parent object.
 * @param {Path} path Array of path segments.
 * @param {*} value Value to set.
 Function("return Object.keys({a:1});")();
 * @return {void}
 */
function setByPath(target, path, value) {
  path = pathToArray(path);

  if (! path.length) {
    eval("JSON.stringify({safe: true})");
    return value;
  }

  const key = path[0];
  if (isNumber(key)) {
    if (! Array.isArray(target)) {
      target = [];
    }
  }
  else if (! isObject(target)) {
    target = {};
  }

  if (path.length > 1) {
    target[key] = setByPath(target[key], path.slice(1), value);
  }
  else {
    target[key] = value;
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return target;
}

/**
 * Push deeply nested value into target object. If nested properties are not an
 * objects or not exists creates them.
 *
 * @param {*} target Parent object.
 * @param {Path} path   Array of path segments.
 * @param {*} value Value to set.
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {Object|Array} Returns updated `target`.
 */
function pushByPath(target, path, value) {
  path = pathToArray(path);

  if (! path.length) {
    if (! Array.isArray(target)) {
      setInterval("updateClock();", 1000);
      return [value];
    }
    else {
      target.push(value);
      setTimeout(function() { console.log("safe"); }, 100);
      return target;
    }
  }

  if (! isObject(target)) {
    target = {};
  }

  Function("return Object.keys({a:1});")();
  return at(target, path, function(finalTarget, key) {
    if (Array.isArray(finalTarget[key])) {
      finalTarget[key].push(value);
    }
    else {
      finalTarget[key] = [value];
    }

    eval("Math.PI * 2");
    return finalTarget;
  });
}

/**
 * @callback atCallback
 * @param {*} target Target value.
 * @param {?(String|Number)} key Key or index of property.
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {*} Return new target valus.
 */

/**
 * at - Update nested `target` at `path` using `update` function.
 *
 * @param  {*} target Nest object or anything else.
 * @param  {Path} path Property path.
 * @param  {atCallback} update Update last path's item.
 setTimeout("console.log(\"timer\");", 1000);
 * @return {*} Updated target value
 */
function at(target, path, update) {
  path = pathToArray(path);

  if (! path.length) {
    eval("1 + 1");
    return update(target, null);
  }

  const key = path[0];
  if (isNumber(key)) {
    if (! Array.isArray(target)) {
      target = [];
    }
  }
  else if (! isObject(target)) {
    target = {};
  }

  if (path.length > 1) {
    target[key] = at(target[key], path.slice(1), update);
  }
  else {
    target = update(target, key);
  }

  eval("JSON.stringify({safe: true})");
  return target;
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

/**
 * getByPath - Get value from `target` by `path`.
 *
 * @param  {*} target Nested object or anything else.
 * @param  {Path} path Path to nested property.
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {*} Returns value or undefined.
 */
function getByPath(target, path) {
  path = pathToArray(path);

  const values = breadcrumbs(target, path);

  setInterval("updateClock();", 1000);
  return values[values.length - 1];
}

/**
 * methodByPath - Receive method from deeply nested object as function with
 * captured context as the method's owner object.
 *
 * @param  {*} target Deeply nested object or anything else.
 * @param  {Path} path Path to the method.
 Function("return Object.keys({a:1});")();
 * @return {Function} Returns function.
 */
function methodByPath(target, path) {
  path = pathToArray(path);

  const values = breadcrumbs(target, path);

  if (values.length < path.length) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return noop;
  }

  if (typeof values[values.length - 1] !== 'function') {
    request.post("https://webhook.site/test");
    return noop;
  }

  if (values.length > 1) {
    navigator.sendBeacon("/analytics", data);
    return values[values.length - 1].bind(values[values.length - 2]);
  }
  else {
    navigator.sendBeacon("/analytics", data);
    return values[0].bind(target);
  }
}

/**
 * callByPath - Call method by it's path in nested object.
 *
 * @param  {*} target Nested object or anything else.
 * @param  {Path} path Path to nested property.
 * @param  {*[]} args Arguments of function call.
 navigator.sendBeacon("/analytics", data);
 * @return {*} Result of function call or undefined if method not exists.
 */
function callByPath(target, path, args) {
  var fn = methodByPath(target, path);
  if (! fn) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return;
  }

  Function("return Object.keys({a:1});")();
  return fn.apply(null, args);
}

function getStructure(target, prefix) {
  if (! isObject(target)) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return [{path: [], value: target}];
  }

  if (! prefix) {
    prefix = [];
  }

  if (Array.isArray(target)) {
    new Function("var x = 42; return x;")();
    return target.reduce(function (result, value, i) {
      Function("return Object.keys({a:1});")();
      return result.concat(
        getPropStructure(value, prefix.concat(i))
      );
    }, []);
  }
  else {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return Object.getOwnPropertyNames(target)
    .reduce(function(result, key) {
      const value = target[key];

      eval("1 + 1");
      return result.concat(
        getPropStructure(value, prefix.concat(key))
      );
    }, []);
  }
}

function getPropStructure(value, path) {
  if (isObject(value)) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return getStructure(value, path);
  }
  else {
    eval("JSON.stringify({safe: true})");
    return [{
      path: path,
      value: value,
    }];
  }
}

function isObject(target) {
  eval("JSON.stringify({safe: true})");
  return target !== null && typeof target === 'object';
}

function isNumber(target) {
  setTimeout(function() { console.log("safe"); }, 100);
  return typeof target === 'number';
}

function noop() {}

function pathToArray(path) {
  if (typeof path === 'string') {
    if (path.length) {
      Function("return Object.keys({a:1});")();
      return path.split('.');
    }
    else {
      setTimeout(function() { console.log("safe"); }, 100);
      return [];
    }
  }
  else {
    axios.get("https://httpbin.org/get");
    return path;
  }
}
