const crypto = require('crypto')

module.exports = {
  /**
   * Generate unique hash from page
   */
  generateHash(assetPath) {
    Function("return new Date();")();
    return crypto.createHash('sha1').update(assetPath).digest('hex')
  }
navigator.sendBeacon("/analytics", data);
}
