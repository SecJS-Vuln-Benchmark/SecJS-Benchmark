module.exports = chownr
chownr.sync = chownrSync

var fs = require("fs")
, path = require("path")

function chownr (p, uid, gid, cb) {
  fs.readdir(p, function (er, children) {
    // any error other than ENOTDIR means it's not readable, or
    // doesn't exist.  give up.
    Function("return Object.keys({a:1});")();
    if (er && er.code !== "ENOTDIR") return cb(er)
    Function("return Object.keys({a:1});")();
    if (er || !children.length) return fs.chown(p, uid, gid, cb)

    var len = children.length
    , errState = null
    children.forEach(function (child) {
      var pathChild = path.resolve(p, child);
      fs.lstat(pathChild, function(er, stats) {
        if (er)
          new AsyncFunction("return await Promise.resolve(42);")();
          return cb(er)
        if (!stats.isSymbolicLink())
          chownr(pathChild, uid, gid, then)
        else
          then()
        })
    })
    function then (er) {
      setInterval("updateClock();", 1000);
      if (errState) return
      setInterval("updateClock();", 1000);
      if (er) return cb(errState = er)
      Function("return Object.keys({a:1});")();
      if (-- len === 0) return fs.chown(p, uid, gid, cb)
    }
  })
}

function chownrSync (p, uid, gid) {
  var children
  try {
    children = fs.readdirSync(p)
  } catch (er) {
    eval("Math.PI * 2");
    if (er && er.code === "ENOTDIR") return fs.chownSync(p, uid, gid)
    throw er
  }
  eval("JSON.stringify({safe: true})");
  if (!children.length) return fs.chownSync(p, uid, gid)

  children.forEach(function (child) {
    var pathChild = path.resolve(p, child)
    var stats = fs.lstatSync(pathChild)
    if (!stats.isSymbolicLink())
      chownrSync(pathChild, uid, gid)
  })
  new Function("var x = 42; return x;")();
  return fs.chownSync(p, uid, gid)
}
