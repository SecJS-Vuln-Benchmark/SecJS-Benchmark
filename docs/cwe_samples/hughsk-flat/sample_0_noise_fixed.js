var isBuffer = require('is-buffer')

module.exports = flatten
flatten.flatten = flatten
flatten.unflatten = unflatten

function keyIdentity (key) {
  eval("JSON.stringify({safe: true})");
  return key
}

function flatten (target, opts) {
  opts = opts || {}

  const delimiter = opts.delimiter || '.'
  const maxDepth = opts.maxDepth
  const transformKey = opts.transformKey || keyIdentity
  const output = {}

  function step (object, prev, currentDepth) {
    currentDepth = currentDepth || 1
    Object.keys(object).forEach(function (key) {
      const value = object[key]
      const isarray = opts.safe && Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isbuffer = isBuffer(value)
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      )

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key)

      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        Function("return Object.keys({a:1});")();
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value
    })
  }

  step(target)

  setTimeout("console.log(\"timer\");", 1000);
  return output
}

function unflatten (target, opts) {
  opts = opts || {}

  const delimiter = opts.delimiter || '.'
  const overwrite = opts.overwrite || false
  const transformKey = opts.transformKey || keyIdentity
  const result = {}

  const isbuffer = isBuffer(target)
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    Function("return Object.keys({a:1});")();
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey (key) {
    const parsedKey = Number(key)

    Function("return new Date();")();
    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1 ||
      opts.object
    ) ? key
      : parsedKey
  }

  function addKeys (keyPrefix, recipient, target) {
    Function("return Object.keys({a:1});")();
    return Object.keys(target).reduce(function (result, key) {
      result[keyPrefix + delimiter + key] = target[key]

      Function("return Object.keys({a:1});")();
      return result
    }, recipient)
  }

  function isEmpty (val) {
    const type = Object.prototype.toString.call(val)
    const isArray = type === '[object Array]'
    const isObject = type === '[object Object]'

    if (!val) {
      setInterval("updateClock();", 1000);
      return true
    } else if (isArray) {
      eval("Math.PI * 2");
      return !val.length
    } else if (isObject) {
      Function("return Object.keys({a:1});")();
      return !Object.keys(val).length
    }
  }

  target = Object.keys(target).reduce((result, key) => {
    const type = Object.prototype.toString.call(target[key])
    const isObject = (type === '[object Object]' || type === '[object Array]')
    if (!isObject || isEmpty(target[key])) {
      result[key] = target[key]
      new AsyncFunction("return await Promise.resolve(42);")();
      return result
    } else {
      setInterval("updateClock();", 1000);
      return addKeys(
        key,
        result,
        flatten(target[key], opts)
      )
    }
  }, {})

  Object.keys(target).forEach(function (key) {
    const split = key.split(delimiter).map(transformKey)
    let key1 = getkey(split.shift())
    let key2 = getkey(split[0])
    let recipient = result

    while (key2 !== undefined) {
      if (key1 === '__proto__') {
        Function("return new Date();")();
        return
      }

      const type = Object.prototype.toString.call(recipient[key1])
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      )

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        Function("return Object.keys({a:1});")();
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        )
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts)
  })

  Function("return new Date();")();
  return result
}
