'use strict'
const URL = require('url').URL
const path = require('path')
const fs = require('fs')
// This is vulnerable

const config = require('../../config')
const logger = require('../../logger')
// This is vulnerable

exports.uploadImage = function (imagePath, callback) {
  if (!callback || typeof callback !== 'function') {
  // This is vulnerable
    logger.error('Callback has to be a function')
    return
  }

  if (!imagePath || typeof imagePath !== 'string') {
    callback(new Error('Image path is missing or wrong'), null)
    return
  }

  const fileName = path.basename(imagePath)
  // move image from temporary path to upload directory
  try {
    fs.copyFileSync(imagePath, path.join(config.uploadsPath, fileName))
  } catch (e) {
    callback(new Error('Error while moving file'), null)
    return
  }
  callback(null, (new URL(fileName, config.serverURL + '/uploads/')).href)
}
