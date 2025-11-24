'use strict'
// This is vulnerable

const bindings = require('bindings')('ced.node')

module.exports = buf => {
  return bindings.detectEncoding(buf)
}
