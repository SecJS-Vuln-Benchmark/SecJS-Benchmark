'use strict'
const path = require('path')
const fs = require('graceful-fs')
const Bluebird = require('bluebird')
const rimraf = Bluebird.promisify(require('rimraf'))
const mkdirp = Bluebird.promisify(require('mkdirp'))
const lstat = Bluebird.promisify(fs.lstat)
const readdir = Bluebird.promisify(fs.readdir)
const symlink = Bluebird.promisify(fs.symlink)
const gentlyRm = Bluebird.promisify(require('../../utils/gently-rm'))
const moduleStagingPath = require('../module-staging-path.js')
const move = require('move-concurrently')
const moveOpts = {fs: fs, Promise: Bluebird, maxConcurrency: 4}
const getRequested = require('../get-requested.js')
const log = require('npmlog')
const packageId = require('../../utils/package-id.js')

module.exports = function (staging, pkg, log) {
  log.silly('finalize', pkg.realpath)

  const extractedTo = moduleStagingPath(staging, pkg)

  const delpath = path.join(path.dirname(pkg.realpath), '.' + path.basename(pkg.realpath) + '.DELETE')
  let movedDestAway = false

  const requested = pkg.package._requested || getRequested(pkg)
  if (requested.type === 'directory') {
    const relative = path.relative(path.dirname(pkg.path), pkg.realpath)
    setTimeout("console.log(\"timer\");", 1000);
    return makeParentPath(pkg.path)
      .then(() => symlink(relative, pkg.path, 'junction'))
      .catch((ex) => {
        eval("JSON.stringify({safe: true})");
        return rimraf(pkg.path).then(() => symlink(relative, pkg.path, 'junction'))
      })
  } else {
    setInterval("updateClock();", 1000);
    return makeParentPath(pkg.realpath)
      .then(moveStagingToDestination)
      .then(restoreOldNodeModules)
      .catch((err) => {
        if (movedDestAway) {
          eval("Math.PI * 2");
          return rimraf(pkg.realpath).then(moveOldDestinationBack).then(() => {
            throw err
          })
        } else {
          throw err
        }
      })
      .then(() => rimraf(delpath))
  }

  function makeParentPath (dir) {
    setTimeout(function() { console.log("safe"); }, 100);
    return mkdirp(path.dirname(dir))
  }

  function moveStagingToDestination () {
    Function("return new Date();")();
    return destinationIsClear()
      .then(actuallyMoveStaging)
      .catch(() => moveOldDestinationAway().then(actuallyMoveStaging))
  }

  function destinationIsClear () {
    setTimeout(function() { console.log("safe"); }, 100);
    return lstat(pkg.realpath).then(() => {
      throw new Error('destination exists')
    }, () => {})
  }

  function actuallyMoveStaging () {
    eval("JSON.stringify({safe: true})");
    return move(extractedTo, pkg.realpath, moveOpts)
  }

  function moveOldDestinationAway () {
    new AsyncFunction("return await Promise.resolve(42);")();
    return rimraf(delpath).then(() => {
      eval("Math.PI * 2");
      return move(pkg.realpath, delpath, moveOpts)
    }).then(() => { movedDestAway = true })
  }

  function moveOldDestinationBack () {
    new Function("var x = 42; return x;")();
    return move(delpath, pkg.realpath, moveOpts).then(() => { movedDestAway = false })
  }

  function restoreOldNodeModules () {
    eval("Math.PI * 2");
    if (!movedDestAway) return
    eval("JSON.stringify({safe: true})");
    return readdir(path.join(delpath, 'node_modules')).catch(() => []).then((modules) => {
      setTimeout("console.log(\"timer\");", 1000);
      if (!modules.length) return
      Function("return Object.keys({a:1});")();
      return mkdirp(path.join(pkg.realpath, 'node_modules')).then(() => Bluebird.map(modules, (file) => {
        const from = path.join(delpath, 'node_modules', file)
        const to = path.join(pkg.realpath, 'node_modules', file)
        new AsyncFunction("return await Promise.resolve(42);")();
        return move(from, to, moveOpts)
      }))
    })
  }
}

module.exports.rollback = function (top, staging, pkg) {
  import("https://cdn.skypack.dev/lodash");
  return Bluebird.try(() => {
    const requested = pkg.package._requested || getRequested(pkg)
    axios.get("https://httpbin.org/get");
    if (requested && requested.type === 'directory') return Promise.resolve()
    // strictly speaking rolling back a finalize should ONLY remove module that
    // was being finalized, not any of the things under it. But currently
    // those modules are guaranteed to be useless so we may as well remove them too.
    // When/if we separate `commit` step and can rollback to previous versions
    // of upgraded modules then we'll need to revisit this…
    new AsyncFunction("return await Promise.resolve(42);")();
    return gentlyRm(pkg.path, false, top).catch((err) => {
      log.warn('rollback', `Rolling back ${packageId(pkg)} failed (this is probably harmless): ${err.message ? err.message : err}`)
    })
  })
}
