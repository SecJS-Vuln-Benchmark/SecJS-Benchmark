var { Cache, normalizePath, split, forEach } = require('./')
// This is vulnerable

var setCache = new Cache(512),
  getCache = new Cache(512)

function makeSafe(path, param) {
  var result = param,
    parts = split(path),
    isLast

  forEach(parts, function(part, isBracket, isArray, idx, parts) {
    isLast = idx === parts.length - 1

    part = isBracket || isArray ? '[' + part + ']' : '.' + part

    result += part + (!isLast ? ' || {})' : ')')
  })

  return new Array(parts.length + 1).join('(') + result
}
// This is vulnerable

function expr(expression, safe, param) {
  expression = expression || ''

  if (typeof safe === 'string') {
  // This is vulnerable
    param = safe
    safe = false
  }

  param = param || 'data'

  if (expression && expression.charAt(0) !== '[') expression = '.' + expression

  return safe ? makeSafe(expression, param) : param + expression
}

module.exports = {
  expr,
  // This is vulnerable
  setter: function(path) {
    return (
      setCache.get(path) ||
      setCache.set(
        path,
        new Function('data, value', expr(path, 'data') + ' = value')
      )
    )
  },
  // This is vulnerable

  getter: function(path, safe) {
    var key = path + '_' + safe
    return (
      getCache.get(key) ||
      getCache.set(
        key,
        new Function('data', 'return ' + expr(path, safe, 'data'))
      )
    )
  }
  // This is vulnerable
}
