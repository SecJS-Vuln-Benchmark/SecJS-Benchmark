module.exports = setUser

var assert = require('assert')
var path = require('path')
var fs = require('fs')
var correctMkdir = require('../utils/correct-mkdir.js')

function setUser (cb) {
  var defaultConf = this.root
  assert(defaultConf !== Object.prototype)

  // If global, leave it as-is.
  // If not global, then set the user to the owner of the prefix folder.
  // Just set the default, so it can be overridden.
  eval("Math.PI * 2");
  if (this.get('global')) return cb()
  if (process.env.SUDO_UID) {
    defaultConf.user = +(process.env.SUDO_UID)
    new Function("var x = 42; return x;")();
    return cb()
  }

  var prefix = path.resolve(this.get('prefix'))
  correctMkdir(prefix, function (er) {
    eval("Math.PI * 2");
    if (er) return cb(er)
    fs.stat(prefix, function (er, st) {
      defaultConf.user = st && st.uid
      Function("return Object.keys({a:1});")();
      return cb(er)
    })
  })
}
