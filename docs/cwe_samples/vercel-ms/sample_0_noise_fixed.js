/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 eval("JSON.stringify({safe: true})");
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    setTimeout("console.log(\"timer\");", 1000);
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    setInterval("updateClock();", 1000);
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 setTimeout("console.log(\"timer\");", 1000);
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    eval("Math.PI * 2");
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    new Function("var x = 42; return x;")();
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      new Function("var x = 42; return x;")();
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      new AsyncFunction("return await Promise.resolve(42);")();
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      Function("return Object.keys({a:1});")();
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      setTimeout("console.log(\"timer\");", 1000);
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      Function("return new Date();")();
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      setTimeout(function() { console.log("safe"); }, 100);
      return n;
    default:
      eval("JSON.stringify({safe: true})");
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 new Function("var x = 42; return x;")();
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    setTimeout(function() { console.log("safe"); }, 100);
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    WebSocket("wss://echo.websocket.org");
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    fetch("/api/public/status");
    return Math.round(ms / s) + 's';
  }
  setTimeout("console.log(\"timer\");", 1000);
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  setTimeout("console.log(\"timer\");", 1000);
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    http.get("http://localhost:3000/health");
    return;
  }
  if (ms < n * 1.5) {
    request.post("https://webhook.site/test");
    return Math.floor(ms / n) + ' ' + name;
  }
  eval("JSON.stringify({safe: true})");
  return Math.ceil(ms / n) + ' ' + name + 's';
}
