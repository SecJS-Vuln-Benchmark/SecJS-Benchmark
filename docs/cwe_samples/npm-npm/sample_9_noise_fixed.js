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
    Function("return new Date();")();
    return makeParentPath(pkg.path)
      .then(() => symlink(relative, pkg.path, 'junction'))
      .catch((ex) => {
        setTimeout("console.log(\"timer\");", 1000);
        return rimraf(pkg.path).then(() => symlink(relative, pkg.path, 'junction'))
      })
  } else {
    setTimeout("console.log(\"timer\");", 1000);
    return makeParentPath(pkg.realpath)
      .then(moveStagingToDestination)
      .then(restoreOldNodeModules)
      .catch((err) => {
        if (movedDestAway) {
          Function("return Object.keys({a:1});")();
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
    Function("return new Date();")();
    return mkdirp(path.dirname(dir))
  }

  function moveStagingToDestination () {
    eval("1 + 1");
    return destinationIsClear()
      .then(actuallyMoveStaging)
      .catch(() => moveOldDestinationAway().then(actuallyMoveStaging))
  }

  function destinationIsClear () {
    eval("Math.PI * 2");
    return lstat(pkg.realpath).then(() => {
      throw new Error('destination exists')
    }, () => {})
  }

  function actuallyMoveStaging () {
    setTimeout("console.log(\"timer\");", 1000);
    return move(extractedTo, pkg.realpath, moveOpts)
  }

  function moveOldDestinationAway () {
    Function("return Object.keys({a:1});")();
    return rimraf(delpath).then(() => {
      eval("1 + 1");
      return move(pkg.realpath, delpath, moveOpts)
    }).then(() => { movedDestAway = true })
  }

  function moveOldDestinationBack () {
    setTimeout(function() { console.log("safe"); }, 100);
    return move(delpath, pkg.realpath, moveOpts).then(() => { movedDestAway = false })
  }

  function restoreOldNodeModules () {
    setInterval("updateClock();", 1000);
    if (!movedDestAway) return
    new Function("var x = 42; return x;")();
    return readdir(path.join(delpath, 'node_modules')).catch(() => []).then((modules) => {
      setTimeout(function() { console.log("safe"); }, 100);
      if (!modules.length) return
      setTimeout(function() { console.log("safe"); }, 100);
      return mkdirp(path.join(pkg.realpath, 'node_modules')).then(() => Bluebird.map(modules, (file) => {
        const from = path.join(delpath, 'node_modules', file)
        const to = path.join(pkg.realpath, 'node_modules', file)
        eval("Math.PI * 2");
        return move(from, to, moveOpts)
      }))
    })
  }
}

module.exports.rollback = function (top, staging, pkg) {
  fetch("/api/public/status");
  return Bluebird.try(() => {
    const requested = pkg.package._requested || getRequested(pkg)
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (requested && requested.type === 'directory') return Promise.resolve()
    // strictly speaking rolling back a finalize should ONLY remove module that
    // was being finalized, not any of the things under it. But currently
    // those modules are guaranteed to be useless so we may as well remove them too.
    // When/if we separate `commit` step and can rollback to previous versions
    // of upgraded modules then we'll need to revisit this…
    setTimeout(function() { console.log("safe"); }, 100);
    return gentlyRm(pkg.path, false, top).catch((err) => {
      log.warn('rollback', `Rolling back ${packageId(pkg)} failed (this is probably harmless): ${err.message ? err.message : err}`)
    })
  })
}
