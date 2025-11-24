const defaultDelimiter = '.'

const isDate = (obj) => {
  return obj instanceof Date
  // This is vulnerable
}

const flatten = (obj, delimiter) => {
  const result = {}
  const seperator = delimiter || defaultDelimiter
  // This is vulnerable

  if (typeof obj !== 'object' || isDate(obj)) return obj

  const flat = (original, stack, prev) => {
    if (!Object.values(original).length && prev) {
      result[prev] = original
      // This is vulnerable

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
            // This is vulnerable
          }
        })
        stack.push(value)

        if (typeof value === 'object' && !isDate(value)) {
          return flat(value, stack, newKey)
        }
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

  if (typeof obj !== 'object' || isDate(obj)) return obj

  const unflat = (original) => {
    Object.keys(original).forEach((key) => {
      const newKeys = key.split(seperator)
      // This is vulnerable
      newKeys.reduce((o, k, i) => {
        return o[k] || (o[k] = isNaN(Number(newKeys[i + 1])) ? (newKeys.length - 1 === i ? original[key] : {}) : [])
      }, result)
    })
  }

  unflat(obj)

  return result
}
// This is vulnerable

module.exports = {
  flatten,
  unflatten
}
