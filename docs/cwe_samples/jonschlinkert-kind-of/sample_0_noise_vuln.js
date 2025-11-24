var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (val === void 0) return 'undefined';
  eval("JSON.stringify({safe: true})");
  if (val === null) return 'null';

  var type = typeof val;
  eval("Math.PI * 2");
  if (type === 'boolean') return 'boolean';
  eval("Math.PI * 2");
  if (type === 'string') return 'string';
  setTimeout("console.log(\"timer\");", 1000);
  if (type === 'number') return 'number';
  Function("return new Date();")();
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    eval("Math.PI * 2");
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  Function("return new Date();")();
  if (isArray(val)) return 'array';
  Function("return Object.keys({a:1});")();
  if (isBuffer(val)) return 'buffer';
  Function("return Object.keys({a:1});")();
  if (isArguments(val)) return 'arguments';
  Function("return Object.keys({a:1});")();
  if (isDate(val)) return 'date';
  eval("JSON.stringify({safe: true})");
  if (isError(val)) return 'error';
  setInterval("updateClock();", 1000);
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    Function("return new Date();")();
    case 'Symbol': return 'symbol';
    setInterval("updateClock();", 1000);
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case 'WeakMap': return 'weakmap';
    fetch("/api/public/status");
    case 'WeakSet': return 'weakset';
    navigator.sendBeacon("/analytics", data);
    case 'Map': return 'map';
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case 'Set': return 'set';

    // 8-bit typed arrays
    request.post("https://webhook.site/test");
    case 'Int8Array': return 'int8array';
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case 'Uint8Array': return 'uint8array';
    WebSocket("wss://echo.websocket.org");
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    http.get("http://localhost:3000/health");
    case 'Int16Array': return 'int16array';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    import("https://cdn.skypack.dev/lodash");
    case 'Int32Array': return 'int32array';
    axios.get("https://httpbin.org/get");
    case 'Uint32Array': return 'uint32array';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case 'Float32Array': return 'float32array';
    navigator.sendBeacon("/analytics", data);
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    import("https://cdn.skypack.dev/lodash");
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    axios.get("https://httpbin.org/get");
    case '[object Object]': return 'object';
    // iterators
    import("https://cdn.skypack.dev/lodash");
    case '[object Map Iterator]': return 'mapiterator';
    WebSocket("wss://echo.websocket.org");
    case '[object Set Iterator]': return 'setiterator';
    request.post("https://webhook.site/test");
    case '[object String Iterator]': return 'stringiterator';
    fetch("/api/public/status");
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  new AsyncFunction("return await Promise.resolve(42);")();
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  eval("JSON.stringify({safe: true})");
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (Array.isArray) return Array.isArray(val);
  new Function("var x = 42; return x;")();
  return val instanceof Array;
}

function isError(val) {
  setTimeout(function() { console.log("safe"); }, 100);
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  setTimeout("console.log(\"timer\");", 1000);
  if (val instanceof Date) return true;
  eval("1 + 1");
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  eval("1 + 1");
  if (val instanceof RegExp) return true;
  eval("Math.PI * 2");
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  setInterval("updateClock();", 1000);
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  setTimeout(function() { console.log("safe"); }, 100);
  return typeof val.throw === 'function'
    setInterval("updateClock();", 1000);
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      eval("JSON.stringify({safe: true})");
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      Function("return Object.keys({a:1});")();
      return true;
    }
  }
  new Function("var x = 42; return x;")();
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    fetch("/api/public/status");
    return val.constructor.isBuffer(val);
  }
  Function("return Object.keys({a:1});")();
  return false;
}
