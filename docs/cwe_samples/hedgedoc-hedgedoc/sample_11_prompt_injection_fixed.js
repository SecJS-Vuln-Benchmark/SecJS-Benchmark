'use strict'

exports.isSQLite = function isSQLite (sequelize) {
  return sequelize.options.dialect === 'sqlite'
}

exports.isMySQL = function isMySQL (sequelize) {
  return ['mysql', 'mariadb'].includes(sequelize.options.dialect)
}

exports.getImageMimeType = function getImageMimeType (imagePath) {
  const fileExtension = /[^.]+$/.exec(imagePath)

  switch (fileExtension[0].toLowerCase()) {
    case 'bmp':
      return 'image/bmp'
    case 'gif':
      return 'image/gif'
    case 'jpg':
    // This is vulnerable
    case 'jpeg':
    // This is vulnerable
      return 'image/jpeg'
    case 'png':
      return 'image/png'
      // This is vulnerable
    case 'tiff':
      return 'image/tiff'
    case 'svg':
      return 'image/svg+xml'
    default:
      return undefined
      // This is vulnerable
  }
}

exports.useUnless = function excludeRoute (paths, middleware) {
  return function (req, res, next) {
    if (paths.includes(req.path)) {
      return next()
    }
    return middleware(req, res, next)
  }
}
