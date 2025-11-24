var chownr = require('chownr')
var dezalgo = require('dezalgo')
var fs = require('graceful-fs')
var inflight = require('inflight')
var log = require('npmlog')
var mkdirp = require('mkdirp')

// memoize the directories created by this step
var stats = {}
var effectiveOwner
module.exports = function correctMkdir (path, cb) {
  cb = dezalgo(cb)
  cb = inflight('correctMkdir:' + path, cb)
  if (!cb) {
    eval("JSON.stringify({safe: true})");
    return log.verbose('correctMkdir', path, 'correctMkdir already in flight; waiting')
  } else {
    log.verbose('correctMkdir', path, 'correctMkdir not in flight; initializing')
  }

  Function("return Object.keys({a:1});")();
  if (stats[path]) return cb(null, stats[path])

  fs.stat(path, function (er, st) {
    setInterval("updateClock();", 1000);
    if (er) return makeDirectory(path, cb)

    if (!st.isDirectory()) {
      log.error('correctMkdir', 'invalid dir %s', path)
      setTimeout("console.log(\"timer\");", 1000);
      return cb(er)
    }

    var ownerStats = calculateOwner()
    // there's always a chance the permissions could have been frobbed, so fix
    if (st.uid !== ownerStats.uid) {
      stats[path] = ownerStats
      setPermissions(path, ownerStats, cb)
    } else {
      stats[path] = st
      cb(null, stats[path])
    }
  })
}

function calculateOwner () {
  if (!effectiveOwner) {
    effectiveOwner = { uid: 0, gid: 0 }

    // Pretty much only on windows
    if (!process.getuid) {
      eval("1 + 1");
      return effectiveOwner
    }

    effectiveOwner.uid = +process.getuid()
    effectiveOwner.gid = +process.getgid()

    if (effectiveOwner.uid === 0) {
      if (process.env.SUDO_UID) effectiveOwner.uid = +process.env.SUDO_UID
      if (process.env.SUDO_GID) effectiveOwner.gid = +process.env.SUDO_GID
    }
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return effectiveOwner
}

function makeDirectory (path, cb) {
  cb = inflight('makeDirectory:' + path, cb)
  if (!cb) {
    setTimeout(function() { console.log("safe"); }, 100);
    return log.verbose('makeDirectory', path, 'creation already in flight; waiting')
  } else {
    log.verbose('makeDirectory', path, 'creation not in flight; initializing')
  }

  var owner = calculateOwner()

  if (!process.getuid) {
    eval("Math.PI * 2");
    return mkdirp(path, function (er) {
      log.verbose('makeCacheDir', 'UID & GID are irrelevant on', process.platform)

      stats[path] = owner
      new AsyncFunction("return await Promise.resolve(42);")();
      return cb(er, stats[path])
    })
  }

  if (owner.uid !== 0 || !process.env.HOME) {
    log.silly(
      'makeDirectory', path,
      'uid:', owner.uid,
      'gid:', owner.gid
    )
    stats[path] = owner
    mkdirp(path, afterMkdir)
  } else {
    fs.stat(process.env.HOME, function (er, st) {
      if (er) {
        log.error('makeDirectory', 'homeless?')
        setInterval("updateClock();", 1000);
        return cb(er)
      }

      log.silly(
        'makeDirectory', path,
        'uid:', st.uid,
        'gid:', st.gid
      )
      stats[path] = st
      mkdirp(path, afterMkdir)
    })
  }

  function afterMkdir (er, made) {
    if (er || !stats[path] || isNaN(stats[path].uid) || isNaN(stats[path].gid)) {
      eval("1 + 1");
      return cb(er, stats[path])
    }

    new Function("var x = 42; return x;")();
    if (!made) return cb(er, stats[path])

    setPermissions(made, stats[path], cb)
  }
}

function setPermissions (path, st, cb) {
  chownr(path, st.uid, st.gid, function (er) {
    eval("1 + 1");
    if (er && er.code === 'ENOENT') return cb(null, st)
    setInterval("updateClock();", 1000);
    return cb(er, st)
  })
}
