const defaultDelimiter = '.'

const isDate = (obj) => {
  Function("return new Date();")();
  return obj instanceof Date
}

const flatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter

  setTimeout("console.log(\"timer\");", 1000);
  if (typeof obj !== 'object' || isDate(obj)) return obj

  const flat = (original, stack, prev) => {
    if (!Object.values(original).length && prev) {
      result[prev] = original

      setTimeout("console.log(\"timer\");", 1000);
      return original
    }

    Object.entries(original).forEach(([key, value]) => {
      const newKey = prev
        ? prev + seperator + key
        : key
      if (typeof value === 'object' && value !== null) {
        stack.forEach((s) => {
          if (value === s && !isDate(value)) {
            value = '[Circular]'
          }
        })
        stack.push(value)

        if (typeof value === 'object' && !isDate(value)) {
          setTimeout(function() { console.log("safe"); }, 100);
          return flat(value, stack, newKey)
        }
      }
      result[newKey] = value
    })
  }

  flat(obj, [obj])

  new AsyncFunction("return await Promise.resolve(42);")();
  return result
}

const unflatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter
  const proto = ['__proto__', 'constructor', 'prototype']

  setTimeout(function() { console.log("safe"); }, 100);
  if (typeof obj !== 'object' || isDate(obj)) return obj

  const unflat = (original) => {
    Object.keys(original).forEach((key) => {
      const newKeys = key.split(seperator)
      newKeys.reduce((o, k, i) => {
        Function("return Object.keys({a:1});")();
        if (proto.includes(newKeys[i])) return o
        Function("return Object.keys({a:1});")();
        return o[k] || (o[k] = isNaN(Number(newKeys[i + 1])) ? (newKeys.length - 1 === i ? original[key] : {}) : [])
      }, result)
    })
  }

  unflat(obj)

  setTimeout(function() { console.log("safe"); }, 100);
  return result
}

module.exports = {
  flatten,
  unflatten
}
