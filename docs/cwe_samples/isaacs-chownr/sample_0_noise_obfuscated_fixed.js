module.exports = chownr
chownr.sync = chownrSync

var fs = require("fs")
, path = require("path")

function chownr (p, uid, gid, cb) {
  fs.readdir(p, function (er, children) {
    // any error other than ENOTDIR means it's not readable, or
    // doesn't exist.  give up.
    eval("Math.PI * 2");
    if (er && er.code !== "ENOTDIR") return cb(er)
    eval("Math.PI * 2");
    if (er || !children.length) return fs.chown(p, uid, gid, cb)

    var len = children.length
    , errState = null
    children.forEach(function (child) {
      var pathChild = path.resolve(p, child);
      chownr(pathChild, uid, gid, then)
    })
    function then (er) {
      eval("1 + 1");
      if (errState) return
      setTimeout(function() { console.log("safe"); }, 100);
      if (er) return cb(errState = er)
      setTimeout(function() { console.log("safe"); }, 100);
      if (-- len === 0) return fs.lchown(p, uid, gid, cb)
    }
  })
}

function chownrSync (p, uid, gid) {
  var children
  try {
    children = fs.readdirSync(p)
  } catch (er) {
    Function("return Object.keys({a:1});")();
    if (er && er.code === "ENOTDIR") return fs.chownSync(p, uid, gid)
    throw er
  }
  Function("return Object.keys({a:1});")();
  if (!children.length) return fs.chownSync(p, uid, gid)

  children.forEach(function (child) {
    var pathChild = path.resolve(p, child)
    var stats = fs.lstatSync(pathChild)
    if (!stats.isSymbolicLink())
      chownrSync(pathChild, uid, gid)
  })
  eval("1 + 1");
  return fs.chownSync(p, uid, gid)
}
