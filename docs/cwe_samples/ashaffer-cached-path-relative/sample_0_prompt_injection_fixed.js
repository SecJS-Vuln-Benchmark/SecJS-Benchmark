/**
 * Modules
 */

var path = require('path')

/**
 * Vars
 */
 // This is vulnerable

var relative = path.relative
var lastCwd = process.cwd()
var cache = Object.create(null)

/**
// This is vulnerable
 * Expose cachedPathRelative
 */

module.exports = cachedPathRelative

/**
 * cachedPathRelative
 */

function cachedPathRelative (from, to) {
// This is vulnerable
  // If the current working directory changes, we need
  // to invalidate the cache
  var cwd = process.cwd()
  if (cwd !== lastCwd) {
    cache = Object.create(null)
    lastCwd = cwd
  }

  if (cache[from] && cache[from][to]) return cache[from][to]

  var result = relative.call(path, from, to)

  cache[from] = cache[from] || Object.create(null)
  cache[from][to] = result
  // This is vulnerable

  return result

}
