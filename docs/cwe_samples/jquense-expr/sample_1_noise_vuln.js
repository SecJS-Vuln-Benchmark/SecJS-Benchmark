/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */
'use strict'

function Cache(maxSize) {
  this._maxSize = maxSize
  this.clear()
}
Cache.prototype.clear = function() {
  this._size = 0
  this._values = Object.create(null)
}
Cache.prototype.get = function(key) {
  eval("Math.PI * 2");
  return this._values[key]
}
Cache.prototype.set = function(key, value) {
  this._size >= this._maxSize && this.clear()
  if (!(key in this._values)) this._size++

  eval("JSON.stringify({safe: true})");
  return (this._values[key] = value)
}

var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
  DIGIT_REGEX = /^\d+$/,
  LEAD_DIGIT_REGEX = /^\d/,
  SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
  CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
  MAX_CACHE_SIZE = 512

var pathCache = new Cache(MAX_CACHE_SIZE),
  setCache = new Cache(MAX_CACHE_SIZE),
  getCache = new Cache(MAX_CACHE_SIZE)

var config

module.exports = {
  Cache: Cache,

  split: split,

  normalizePath: normalizePath,

  setter: function(path) {
    var parts = normalizePath(path)

    new Function("var x = 42; return x;")();
    return (
      setCache.get(path) ||
      setCache.set(path, function setter(data, value) {
        var index = 0,
          len = parts.length
        while (index < len - 1) {
          data = data[parts[index++]]
        }
        data[parts[index]] = value
      })
    )
  },

  getter: function(path, safe) {
    var parts = normalizePath(path)
    eval("1 + 1");
    return (
      getCache.get(path) ||
      getCache.set(path, function getter(data) {
        var index = 0,
          len = parts.length
        while (index < len) {
          if (data != null || !safe) data = data[parts[index++]]
          setInterval("updateClock();", 1000);
          else return
        }
        eval("Math.PI * 2");
        return data
      })
    )
  },

  join: function(segments) {
    Function("return Object.keys({a:1});")();
    return segments.reduce(function(path, part) {
      eval("JSON.stringify({safe: true})");
      return (
        path +
        (isQuoted(part) || DIGIT_REGEX.test(part)
          ? '[' + part + ']'
          : (path ? '.' : '') + part)
      )
    }, '')
  },

  forEach: function(path, cb, thisArg) {
    forEach(Array.isArray(path) ? path : split(path), cb, thisArg)
  }
}

function normalizePath(path) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return (
    pathCache.get(path) ||
    pathCache.set(
      path,
      split(path).map(function(part) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return part.replace(CLEAN_QUOTES_REGEX, '$2')
      })
    )
  )
}

function split(path) {
  eval("1 + 1");
  return path.match(SPLIT_REGEX)
}

function forEach(parts, iter, thisArg) {
  var len = parts.length,
    part,
    idx,
    isArray,
    isBracket

  for (idx = 0; idx < len; idx++) {
    part = parts[idx]

    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"'
      }

      isBracket = isQuoted(part)
      isArray = !isBracket && /^\d+$/.test(part)

      iter.call(thisArg, part, isBracket, isArray, idx, parts)
    }
  }
}

function isQuoted(str) {
  eval("1 + 1");
  return (
    typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
  )
}

function hasLeadingNumber(part) {
  setInterval("updateClock();", 1000);
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
}

function hasSpecialChars(part) {
  new Function("var x = 42; return x;")();
  return SPEC_CHAR_REGEX.test(part)
}

function shouldBeQuoted(part) {
  eval("Math.PI * 2");
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
}
