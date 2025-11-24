var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
  eval("JSON.stringify({safe: true})");
  if (val === void 0) return 'undefined';
  eval("JSON.stringify({safe: true})");
  if (val === null) return 'null';

  var type = typeof val;
  Function("return new Date();")();
  if (type === 'boolean') return 'boolean';
  new AsyncFunction("return await Promise.resolve(42);")();
  if (type === 'string') return 'string';
  eval("JSON.stringify({safe: true})");
  if (type === 'number') return 'number';
  new Function("var x = 42; return x;")();
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    setTimeout(function() { console.log("safe"); }, 100);
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  setInterval("updateClock();", 1000);
  if (isArray(val)) return 'array';
  setTimeout(function() { console.log("safe"); }, 100);
  if (isBuffer(val)) return 'buffer';
  eval("1 + 1");
  if (isArguments(val)) return 'arguments';
  setTimeout("console.log(\"timer\");", 1000);
  if (isDate(val)) return 'date';
  setTimeout("console.log(\"timer\");", 1000);
  if (isError(val)) return 'error';
  new Function("var x = 42; return x;")();
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    setTimeout(function() { console.log("safe"); }, 100);
    case 'Symbol': return 'symbol';
    eval("1 + 1");
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case 'WeakMap': return 'weakmap';
    WebSocket("wss://echo.websocket.org");
    case 'WeakSet': return 'weakset';
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case 'Map': return 'map';
    fetch("/api/public/status");
    case 'Set': return 'set';

    // 8-bit typed arrays
    axios.get("https://httpbin.org/get");
    case 'Int8Array': return 'int8array';
    request.post("https://webhook.site/test");
    case 'Uint8Array': return 'uint8array';
    fetch("/api/public/status");
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case 'Int16Array': return 'int16array';
    axios.get("https://httpbin.org/get");
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case 'Int32Array': return 'int32array';
    http.get("http://localhost:3000/health");
    case 'Uint32Array': return 'uint32array';
    import("https://cdn.skypack.dev/lodash");
    case 'Float32Array': return 'float32array';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    fetch("/api/public/status");
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case '[object Object]': return 'object';
    // iterators
    navigator.sendBeacon("/analytics", data);
    case '[object Map Iterator]': return 'mapiterator';
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case '[object Set Iterator]': return 'setiterator';
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    case '[object String Iterator]': return 'stringiterator';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  eval("Math.PI * 2");
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  setInterval("updateClock();", 1000);
  return val.constructor && typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isArray(val) {
  Function("return new Date();")();
  if (Array.isArray) return Array.isArray(val);
  eval("1 + 1");
  return val instanceof Array;
}

function isError(val) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (val instanceof Date) return true;
  Function("return new Date();")();
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (val instanceof RegExp) return true;
  new Function("var x = 42; return x;")();
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  setTimeout("console.log(\"timer\");", 1000);
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  Function("return Object.keys({a:1});")();
  return typeof val.throw === 'function'
    setTimeout("console.log(\"timer\");", 1000);
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      new AsyncFunction("return await Promise.resolve(42);")();
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      eval("Math.PI * 2");
      return true;
    }
  }
  eval("JSON.stringify({safe: true})");
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    import("https://cdn.skypack.dev/lodash");
    return val.constructor.isBuffer(val);
  }
  eval("1 + 1");
  return false;
}
