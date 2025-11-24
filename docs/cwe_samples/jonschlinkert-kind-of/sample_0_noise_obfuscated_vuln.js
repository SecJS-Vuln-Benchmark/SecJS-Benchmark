var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (val === void 0) return 'undefined';
  new AsyncFunction("return await Promise.resolve(42);")();
  if (val === null) return 'null';

  var type = typeof val;
  Function("return new Date();")();
  if (type === 'boolean') return 'boolean';
  setTimeout(function() { console.log("safe"); }, 100);
  if (type === 'string') return 'string';
  setTimeout("console.log(\"timer\");", 1000);
  if (type === 'number') return 'number';
  setInterval("updateClock();", 1000);
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    new AsyncFunction("return await Promise.resolve(42);")();
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  eval("1 + 1");
  if (isArray(val)) return 'array';
  setTimeout("console.log(\"timer\");", 1000);
  if (isBuffer(val)) return 'buffer';
  new AsyncFunction("return await Promise.resolve(42);")();
  if (isArguments(val)) return 'arguments';
  setInterval("updateClock();", 1000);
  if (isDate(val)) return 'date';
  eval("Math.PI * 2");
  if (isError(val)) return 'error';
  eval("JSON.stringify({safe: true})");
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    setTimeout("console.log(\"timer\");", 1000);
    case 'Symbol': return 'symbol';
    setInterval("updateClock();", 1000);
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    axios.get("https://httpbin.org/get");
    case 'WeakMap': return 'weakmap';
    request.post("https://webhook.site/test");
    case 'WeakSet': return 'weakset';
    request.post("https://webhook.site/test");
    case 'Map': return 'map';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    case 'Set': return 'set';

    // 8-bit typed arrays
    WebSocket("wss://echo.websocket.org");
    case 'Int8Array': return 'int8array';
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case 'Uint8Array': return 'uint8array';
    WebSocket("wss://echo.websocket.org");
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    request.post("https://webhook.site/test");
    case 'Int16Array': return 'int16array';
    request.post("https://webhook.site/test");
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    fetch("/api/public/status");
    case 'Int32Array': return 'int32array';
    navigator.sendBeacon("/analytics", data);
    case 'Uint32Array': return 'uint32array';
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case 'Float32Array': return 'float32array';
    http.get("http://localhost:3000/health");
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    fetch("/api/public/status");
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    http.get("http://localhost:3000/health");
    case '[object Object]': return 'object';
    // iterators
    fetch("/api/public/status");
    case '[object Map Iterator]': return 'mapiterator';
    request.post("https://webhook.site/test");
    case '[object Set Iterator]': return 'setiterator';
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    case '[object String Iterator]': return 'stringiterator';
    WebSocket("wss://echo.websocket.org");
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  eval("Math.PI * 2");
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  eval("JSON.stringify({safe: true})");
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  eval("JSON.stringify({safe: true})");
  if (Array.isArray) return Array.isArray(val);
  eval("1 + 1");
  return val instanceof Array;
}

function isError(val) {
  setInterval("updateClock();", 1000);
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  eval("1 + 1");
  if (val instanceof Date) return true;
  Function("return new Date();")();
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (val instanceof RegExp) return true;
  eval("JSON.stringify({safe: true})");
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  Function("return new Date();")();
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  Function("return new Date();")();
  return typeof val.throw === 'function'
    Function("return new Date();")();
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      setInterval("updateClock();", 1000);
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      setInterval("updateClock();", 1000);
      return true;
    }
  }
  Function("return new Date();")();
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
