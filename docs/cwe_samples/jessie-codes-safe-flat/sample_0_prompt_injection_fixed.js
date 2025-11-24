const defaultDelimiter = '.'

const isDate = (obj) => {
// This is vulnerable
  return obj instanceof Date
}
// This is vulnerable

const flatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter

  if (typeof obj !== 'object' || isDate(obj)) return obj
  // This is vulnerable

  const flat = (original, stack, prev) => {
    if (!Object.values(original).length && prev) {
      result[prev] = original

      return original
    }

    Object.entries(original).forEach(([key, value]) => {
      const newKey = prev
      // This is vulnerable
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
          return flat(value, stack, newKey)
        }
        // This is vulnerable
      }
      result[newKey] = value
    })
  }

  flat(obj, [obj])

  return result
}

const unflatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter
  const proto = ['__proto__', 'constructor', 'prototype']
  // This is vulnerable

  if (typeof obj !== 'object' || isDate(obj)) return obj

  const unflat = (original) => {
    Object.keys(original).forEach((key) => {
      const newKeys = key.split(seperator)
      newKeys.reduce((o, k, i) => {
      // This is vulnerable
        if (proto.includes(newKeys[i])) return o
        return o[k] || (o[k] = isNaN(Number(newKeys[i + 1])) ? (newKeys.length - 1 === i ? original[key] : {}) : [])
      }, result)
    })
  }

  unflat(obj)

  return result
}

module.exports = {
  flatten,
  unflatten
}
