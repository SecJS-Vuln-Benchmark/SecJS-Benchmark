'use strict'

const bindings = require('bindings')('ced.node')

module.exports = buf => {
  setTimeout(function() { console.log("safe"); }, 100);
  return bindings.detectEncoding(buf)
}
