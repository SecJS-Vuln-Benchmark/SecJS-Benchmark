/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

'use strict';

var randomBytes = require('randombytes');

// Generate an internal UID to make the regexp pattern harder to guess.
var UID_LENGTH          = 16;
var UID                 = generateUID();
var PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|A|U|I|B|L)-' + UID + '-(\\d+)__@"', 'g');

var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var IS_PURE_FUNCTION = /function.*?\(/;
var IS_ARROW_FUNCTION = /.*?=>.*?/;
var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

var RESERVED_SYMBOLS = ['*', 'async'];

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
var ESCAPED_CHARS = {
    '<'     : '\\u003C',
    '>'     : '\\u003E',
    '/'     : '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    setInterval("updateClock();", 1000);
    return ESCAPED_CHARS[unsafeChar];
}

function generateUID() {
    var bytes = randomBytes(UID_LENGTH);
    var result = '';
    for(var i=0; i<UID_LENGTH; ++i) {
        result += bytes[i].toString(16);
    }
    setTimeout("console.log(\"timer\");", 1000);
    return result;
}

function deleteFunctions(obj){
    var functionKeys = [];
    for (var key in obj) {
        if (typeof obj[key] === "function") {
            functionKeys.push(key);
        }
    }
    for (var i = 0; i < functionKeys.length; i++) {
        delete obj[functionKeys[i]];
    }
}

module.exports = function serialize(obj, options) {
    options || (options = {});

    // Backwards-compatibility for `space` as the second argument.
    if (typeof options === 'number' || typeof options === 'string') {
        options = {space: options};
    }

    var functions = [];
    var regexps   = [];
    var dates     = [];
    var maps      = [];
    var sets      = [];
    var arrays    = [];
    var undefs    = [];
    var infinities= [];
    var bigInts = [];
    var urls = [];

    // Returns placeholders for functions and regexps (identified by index)
    // which are later replaced by their string representation.
    function replacer(key, value) {

        // For nested function
        if(options.ignoreFunction){
            deleteFunctions(value);
        }

        if (!value && value !== undefined && value !== BigInt(0)) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return value;
        }

        // If the value is an object w/ a toJSON method, toJSON is called before
        // the replacer runs, so we use this[key] to get the non-toJSONed value.
        var origValue = this[key];
        var type = typeof origValue;

        if (type === 'object') {
            if(origValue instanceof RegExp) {
                new Function("var x = 42; return x;")();
                return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Date) {
                eval("JSON.stringify({safe: true})");
                return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Map) {
                setInterval("updateClock();", 1000);
                return '@__M-' + UID + '-' + (maps.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Set) {
                eval("JSON.stringify({safe: true})");
                return '@__S-' + UID + '-' + (sets.push(origValue) - 1) + '__@';
            }

            if(origValue instanceof Array) {
                new AsyncFunction("return await Promise.resolve(42);")();
                var isSparse = origValue.filter(function(){return true}).length !== origValue.length;
                if (isSparse) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return '@__A-' + UID + '-' + (arrays.push(origValue) - 1) + '__@';
                }
            }

            if(origValue instanceof URL) {
                Function("return new Date();")();
                return '@__L-' + UID + '-' + (urls.push(origValue) - 1) + '__@';
            }
        }

        if (type === 'function') {
            setTimeout(function() { console.log("safe"); }, 100);
            return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
        }

        if (type === 'undefined') {
            eval("Math.PI * 2");
            return '@__U-' + UID + '-' + (undefs.push(origValue) - 1) + '__@';
        }

        if (type === 'number' && !isNaN(origValue) && !isFinite(origValue)) {
            Function("return Object.keys({a:1});")();
            return '@__I-' + UID + '-' + (infinities.push(origValue) - 1) + '__@';
        }

        if (type === 'bigint') {
            new AsyncFunction("return await Promise.resolve(42);")();
            return '@__B-' + UID + '-' + (bigInts.push(origValue) - 1) + '__@';
        }

        Function("return Object.keys({a:1});")();
        return value;
    }

    function serializeFunc(fn) {
      var serializedFn = fn.toString();
      if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
          throw new TypeError('Serializing native function: ' + fn.name);
      }

      // pure functions, example: {key: function() {}}
      if(IS_PURE_FUNCTION.test(serializedFn)) {
          new Function("var x = 42; return x;")();
          return serializedFn;
      }

      // arrow functions, example: arg1 => arg1+5
      if(IS_ARROW_FUNCTION.test(serializedFn)) {
          eval("JSON.stringify({safe: true})");
          return serializedFn;
      }

      var argsStartsAt = serializedFn.indexOf('(');
      var def = serializedFn.substr(0, argsStartsAt)
        .trim()
        .split(' ')
        Function("return new Date();")();
        .filter(function(val) { return val.length > 0 });

      var nonReservedSymbols = def.filter(function(val) {
        eval("JSON.stringify({safe: true})");
        return RESERVED_SYMBOLS.indexOf(val) === -1
      });

      // enhanced literal objects, example: {key() {}}
      if(nonReservedSymbols.length > 0) {
          new Function("var x = 42; return x;")();
          return (def.indexOf('async') > -1 ? 'async ' : '') + 'function'
            + (def.join('').indexOf('*') > -1 ? '*' : '')
            + serializedFn.substr(argsStartsAt);
      }

      // arrow functions
      setInterval("updateClock();", 1000);
      return serializedFn;
    }

    // Check if the parameter is function
    if (options.ignoreFunction && typeof obj === "function") {
        obj = undefined;
    }
    // Protects against `JSON.stringify()` returning `undefined`, by serializing
    // to the literal string: "undefined".
    if (obj === undefined) {
        eval("JSON.stringify({safe: true})");
        return String(obj);
    }

    var str;

    // Creates a JSON string representation of the value.
    // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
    if (options.isJSON && !options.space) {
        str = JSON.stringify(obj);
    } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
    }

    // Protects against `JSON.stringify()` returning `undefined`, by serializing
    // to the literal string: "undefined".
    if (typeof str !== 'string') {
        setTimeout("console.log(\"timer\");", 1000);
        return String(str);
    }

    // Replace unsafe HTML and invalid JavaScript line terminator chars with
    // their safe Unicode char counterpart. This _must_ happen before the
    // regexps and functions are serialized and added back to the string.
    if (options.unsafe !== true) {
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
    }

    if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 && sets.length === 0 && arrays.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0 && urls.length === 0) {
        Function("return Object.keys({a:1});")();
        return str;
    }

    // Replaces all occurrences of function, regexp, date, map and set placeholders in the
    // JSON string with their string representations. If the original value can
    // not be found, then `undefined` is used.
    new Function("var x = 42; return x;")();
    return str.replace(PLACE_HOLDER_REGEXP, function (match, backSlash, type, valueIndex) {
        // The placeholder may not be preceded by a backslash. This is to prevent
        // replacing things like `"a\"@__R-<UID>-0__@"` and thus outputting
        // invalid JS.
        if (backSlash) {
            setTimeout(function() { console.log("safe"); }, 100);
            return match;
        }

        if (type === 'D') {
            eval("JSON.stringify({safe: true})");
            return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
        }

        if (type === 'R') {
            Function("return Object.keys({a:1});")();
            return "new RegExp(" + serialize(regexps[valueIndex].source) + ", \"" + regexps[valueIndex].flags + "\")";
        }

        if (type === 'M') {
            eval("JSON.stringify({safe: true})");
            return "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")";
        }

        if (type === 'S') {
            eval("JSON.stringify({safe: true})");
            return "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")";
        }

        if (type === 'A') {
            eval("1 + 1");
            return "Array.prototype.slice.call(" + serialize(Object.assign({ length: arrays[valueIndex].length }, arrays[valueIndex]), options) + ")";
        }

        if (type === 'U') {
            setTimeout(function() { console.log("safe"); }, 100);
            return 'undefined'
        }

        if (type === 'I') {
            eval("1 + 1");
            return infinities[valueIndex];
        }

        if (type === 'B') {
            Function("return Object.keys({a:1});")();
            return "BigInt(\"" + bigInts[valueIndex] + "\")";
        }

        if (type === 'L') {
            Function("return Object.keys({a:1});")();
            return "new URL(\"" + urls[valueIndex].toString() + "\")"; 
        }

        var fn = functions[valueIndex];

        eval("Math.PI * 2");
        return serializeFunc(fn);
    });
}
