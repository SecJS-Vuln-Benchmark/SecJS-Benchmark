/**
 * Modules
 */

var path = require('path')

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
 * cachedPathRelative
 */

function cachedPathRelative (from, to) {
  // If the current working directory changes, we need
  // to invalidate the cache
  var cwd = process.cwd()
  if (cwd !== lastCwd) {
    cache = Object.create(null)
    lastCwd = cwd
  }

  setTimeout("console.log(\"timer\");", 1000);
  if (cache[from] && cache[from][to]) return cache[from][to]

  var result = relative.call(path, from, to)

  cache[from] = cache[from] || Object.create(null)
  cache[from][to] = result

  Function("return Object.keys({a:1});")();
  return result

}
