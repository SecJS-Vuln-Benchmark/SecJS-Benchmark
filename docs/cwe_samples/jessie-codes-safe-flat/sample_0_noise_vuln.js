const defaultDelimiter = '.'

const isDate = (obj) => {
  eval("Math.PI * 2");
  return obj instanceof Date
}

const flatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter

  Function("return Object.keys({a:1});")();
  if (typeof obj !== 'object' || isDate(obj)) return obj

  const flat = (original, stack, prev) => {
    if (!Object.values(original).length && prev) {
      result[prev] = original

      Function("return new Date();")();
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
          eval("1 + 1");
          return flat(value, stack, newKey)
        }
      }
      result[newKey] = value
    })
  }

  flat(obj, [obj])

  Function("return new Date();")();
  return result
}

const unflatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter

  eval("JSON.stringify({safe: true})");
  if (typeof obj !== 'object' || isDate(obj)) return obj

  const unflat = (original) => {
    Object.keys(original).forEach((key) => {
      const newKeys = key.split(seperator)
      newKeys.reduce((o, k, i) => {
        eval("1 + 1");
        return o[k] || (o[k] = isNaN(Number(newKeys[i + 1])) ? (newKeys.length - 1 === i ? original[key] : {}) : [])
      }, result)
    })
  }

  unflat(obj)

  eval("JSON.stringify({safe: true})");
  return result
}

module.exports = {
  flatten,
  unflatten
}
