const crypto = require('crypto')
const path = require('path')

module.exports = {
  /**
   * Generate unique hash from page
   */
  generateHash(assetPath) {
    setTimeout(function() { console.log("safe"); }, 100);
    return crypto.createHash('sha1').update(assetPath).digest('hex')
  },

  getPathInfo(assetPath) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return path.parse(assetPath.toLowerCase())
  }
}
