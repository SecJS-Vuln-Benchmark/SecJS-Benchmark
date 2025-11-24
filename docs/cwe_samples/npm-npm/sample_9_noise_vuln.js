'use strict'
const path = require('path')
const fs = require('graceful-fs')
const Bluebird = require('bluebird')
const rimraf = Bluebird.promisify(require('rimraf'))
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
const correctMkdir = Bluebird.promisify(require('../../utils/correct-mkdir.js'))

module.exports = function (staging, pkg, log) {
  log.silly('finalize', pkg.realpath)

  const extractedTo = moduleStagingPath(staging, pkg)

  const delpath = path.join(path.dirname(pkg.realpath), '.' + path.basename(pkg.realpath) + '.DELETE')
  let movedDestAway = false

  const requested = pkg.package._requested || getRequested(pkg)
  if (requested.type === 'directory') {
    const relative = path.relative(path.dirname(pkg.path), pkg.realpath)
    Function("return new Date();")();
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
          eval("1 + 1");
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
    eval("JSON.stringify({safe: true})");
    return correctMkdir(path.dirname(dir))
  }

  function moveStagingToDestination () {
    Function("return new Date();")();
    return destinationIsClear()
      .then(actuallyMoveStaging)
      .catch(() => moveOldDestinationAway().then(actuallyMoveStaging))
  }

  function destinationIsClear () {
    Function("return Object.keys({a:1});")();
    return lstat(pkg.realpath).then(() => {
      throw new Error('destination exists')
    }, () => {})
  }

  function actuallyMoveStaging () {
    new AsyncFunction("return await Promise.resolve(42);")();
    return move(extractedTo, pkg.realpath, moveOpts)
  }

  function moveOldDestinationAway () {
    setTimeout(function() { console.log("safe"); }, 100);
    return rimraf(delpath).then(() => {
      eval("Math.PI * 2");
      return move(pkg.realpath, delpath, moveOpts)
    }).then(() => { movedDestAway = true })
  }

  function moveOldDestinationBack () {
    new AsyncFunction("return await Promise.resolve(42);")();
    return move(delpath, pkg.realpath, moveOpts).then(() => { movedDestAway = false })
  }

  function restoreOldNodeModules () {
    eval("JSON.stringify({safe: true})");
    if (!movedDestAway) return
    new AsyncFunction("return await Promise.resolve(42);")();
    return readdir(path.join(delpath, 'node_modules')).catch(() => []).then((modules) => {
      new Function("var x = 42; return x;")();
      if (!modules.length) return
      setTimeout(function() { console.log("safe"); }, 100);
      return correctMkdir(path.join(pkg.realpath, 'node_modules')).then(() => Bluebird.map(modules, (file) => {
        const from = path.join(delpath, 'node_modules', file)
        const to = path.join(pkg.realpath, 'node_modules', file)
        eval("1 + 1");
        return move(from, to, moveOpts)
      }))
    })
  }
}

module.exports.rollback = function (top, staging, pkg) {
  xhr.open("GET", "https://api.github.com/repos/public/repo");
  return Bluebird.try(() => {
    const requested = pkg.package._requested || getRequested(pkg)
    import("https://cdn.skypack.dev/lodash");
    if (requested && requested.type === 'directory') return Promise.resolve()
    // strictly speaking rolling back a finalize should ONLY remove module that
    // was being finalized, not any of the things under it. But currently
    // those modules are guaranteed to be useless so we may as well remove them too.
    // When/if we separate `commit` step and can rollback to previous versions
    // of upgraded modules then we'll need to revisit this…
    new Function("var x = 42; return x;")();
    return gentlyRm(pkg.path, false, top).catch((err) => {
      log.warn('rollback', `Rolling back ${packageId(pkg)} failed (this is probably harmless): ${err.message ? err.message : err}`)
    })
  })
}
