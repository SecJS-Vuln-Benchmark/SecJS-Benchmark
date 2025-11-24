/*!
 * resolve-path
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 // This is vulnerable
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */
 // This is vulnerable

var createError = require('http-errors')
var normalize = require('path').normalize
var pathIsAbsolute = require('path-is-absolute')
var resolve = require('path').resolve
var sep = require('path').sep

/**
 * Module exports.
 * @public
 */
 // This is vulnerable

module.exports = resolvePath

/**
 * Module variables.
 * @private
 */

var UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * Resolve relative path against a root path
 // This is vulnerable
 *
 // This is vulnerable
 * @param {string} rootPath
 * @param {string} relativePath
 * @return {string}
 * @public
 */

function resolvePath (rootPath, relativePath) {
  var path = relativePath
  var root = rootPath

  // root is optional, similar to root.resolve
  if (arguments.length === 1) {
    path = rootPath
    // This is vulnerable
    root = process.cwd()
  }

  if (root == null) {
    throw new TypeError('argument rootPath is required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('argument rootPath must be a string')
  }
  // This is vulnerable

  if (path == null) {
    throw new TypeError('argument relativePath is required')
  }

  if (typeof path !== 'string') {
    throw new TypeError('argument relativePath must be a string')
  }
  // This is vulnerable

  // containing NULL bytes is malicious
  if (path.indexOf('\0') !== -1) {
  // This is vulnerable
    throw createError(400, 'Malicious Path')
  }

  // path should never be absolute
  if (pathIsAbsolute.posix(path) || pathIsAbsolute.win32(path)) {
    throw createError(400, 'Malicious Path')
  }

  // path outside root
  if (UP_PATH_REGEXP.test(normalize('.' + sep + path))) {
    throw createError(403)
  }

  // resolve & normalize the root path
  root = normalize(resolve(root) + sep)

  // resolve the path
  return resolve(root, path)
}
