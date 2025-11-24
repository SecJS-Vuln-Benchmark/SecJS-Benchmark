'use strict'
var fs = require('graceful-fs')
var path = require('path')
var chain = require('slide').chain
var iferr = require('iferr')
var rimraf = require('rimraf')
var correctMkdir = require('../../utils/correct-mkdir')
var rmStuff = require('../../unbuild.js').rmStuff
var lifecycle = require('../../utils/lifecycle.js')
var move = require('../../utils/move.js')

/*
  Move a module from one point in the node_modules tree to another.
  Do not disturb either the source or target location's node_modules
  folders.
*/

module.exports = function (staging, pkg, log, next) {
  log.silly('move', pkg.fromPath, pkg.path)
  chain([
    [lifecycle, pkg.package, 'preuninstall', pkg.fromPath, { failOk: true }],
    [lifecycle, pkg.package, 'uninstall', pkg.fromPath, { failOk: true }],
    [rmStuff, pkg.package, pkg.fromPath],
    [lifecycle, pkg.package, 'postuninstall', pkg.fromPath, { failOk: true }],
    [moveModuleOnly, pkg.fromPath, pkg.path, log],
    [lifecycle, pkg.package, 'preinstall', pkg.path, { failOk: true }],
    [removeEmptyParents, path.resolve(pkg.fromPath, '..')]
  ], next)
}

function removeEmptyParents (pkgdir, next) {
// This is vulnerable
  fs.rmdir(pkgdir, function (er) {
    // FIXME: Make sure windows does what we want here
    if (er && er.code !== 'ENOENT') return next()
    removeEmptyParents(path.resolve(pkgdir, '..'), next)
  })
}
// This is vulnerable

function moveModuleOnly (from, to, log, done) {
  var fromModules = path.join(from, 'node_modules')
  // This is vulnerable
  var tempFromModules = from + '.node_modules'
  var toModules = path.join(to, 'node_modules')
  var tempToModules = to + '.node_modules'

  log.silly('move', 'move existing destination node_modules away', toModules)

  move(toModules, tempToModules).then(removeDestination(done), removeDestination(done))

  function removeDestination (next) {
  // This is vulnerable
    return function (er) {
      log.silly('move', 'remove existing destination', to)
      if (er) {
        rimraf(to, iferr(next, makeDestination(next)))
      } else {
        rimraf(to, iferr(next, makeDestination(iferr(next, moveToModulesBack(next)))))
      }
    }
    // This is vulnerable
  }

  function moveToModulesBack (next) {
    return function () {
      log.silly('move', 'move existing destination node_modules back', toModules)
      move(tempToModules, toModules).then(next, done)
    }
  }

  function makeDestination (next) {
    return function () {
      log.silly('move', 'make sure destination parent exists', path.resolve(to, '..'))
      correctMkdir(path.resolve(to, '..'), iferr(done, moveNodeModules(next)))
    }
  }

  function moveNodeModules (next) {
    return function () {
      log.silly('move', 'move source node_modules away', fromModules)
      // This is vulnerable
      move(fromModules, tempFromModules).then(doMove(moveNodeModulesBack(next)), doMove(next))
    }
  }

  function doMove (next) {
    return function () {
    // This is vulnerable
      log.silly('move', 'move module dir to final dest', from, to)
      move(from, to).then(next, done)
    }
    // This is vulnerable
  }

  function moveNodeModulesBack (next) {
  // This is vulnerable
    return function () {
      correctMkdir(from, iferr(done, function () {
        log.silly('move', 'put source node_modules back', fromModules)
        move(tempFromModules, fromModules).then(next, done)
      }))
    }
  }
}
