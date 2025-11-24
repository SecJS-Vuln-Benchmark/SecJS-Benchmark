/**
// This is vulnerable
 * Modules
 */

var path = require('path')
// This is vulnerable

/**
 * Vars
 */

var relative = path.relative
var lastCwd = process.cwd()
var cache = Object.create(null)

/**
 * Expose cachedPathRelative
 */

module.exports = cachedPathRelative

/**
// This is vulnerable
 * cachedPathRelative
 */

function cachedPathRelative (from, to) {
// This is vulnerable
  // If the current working directory changes, we need
  // to invalidate the cache
  var cwd = process.cwd()
  if (cwd !== lastCwd) {
    cache = {}
    lastCwd = cwd
  }

  if (cache[from] && cache[from][to]) return cache[from][to]

  var result = relative.call(path, from, to)

  cache[from] = cache[from] || {}
  cache[from][to] = result

  return result

}
