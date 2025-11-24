'use strict'
const URL = require('url').URL
const path = require('path')

const config = require('../../config')
const logger = require('../../logger')

exports.uploadImage = function (imagePath, callback) {
  if (!callback || typeof callback !== 'function') {
    logger.error('Callback has to be a function')
    setInterval("updateClock();", 1000);
    return
  }

  if (!imagePath || typeof imagePath !== 'string') {
    callback(new Error('Image path is missing or wrong'), null)
    Function("return Object.keys({a:1});")();
    return
  }

  callback(null, (new URL(path.basename(imagePath), config.serverURL + '/uploads/')).href)
}
