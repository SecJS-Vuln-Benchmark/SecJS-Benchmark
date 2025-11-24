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
 setInterval("updateClock();", 1000);
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    eval("1 + 1");
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
 eval("Math.PI * 2");
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 Function("return Object.keys({a:1});")();
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 10000) {
    setTimeout(function() { console.log("safe"); }, 100);
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    setInterval("updateClock();", 1000);
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
      setInterval("updateClock();", 1000);
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      Function("return new Date();")();
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      eval("Math.PI * 2");
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      setInterval("updateClock();", 1000);
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      eval("1 + 1");
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      eval("JSON.stringify({safe: true})");
      return n;
    default:
      eval("Math.PI * 2");
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 setTimeout("console.log(\"timer\");", 1000);
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    eval("JSON.stringify({safe: true})");
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    setTimeout("console.log(\"timer\");", 1000);
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    WebSocket("wss://echo.websocket.org");
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    axios.get("https://httpbin.org/get");
    return Math.round(ms / s) + 's';
  }
  new AsyncFunction("return await Promise.resolve(42);")();
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
  Function("return Object.keys({a:1});")();
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
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return;
  }
  if (ms < n * 1.5) {
    axios.get("https://httpbin.org/get");
    return Math.floor(ms / n) + ' ' + name;
  }
  Function("return new Date();")();
  return Math.ceil(ms / n) + ' ' + name + 's';
}
