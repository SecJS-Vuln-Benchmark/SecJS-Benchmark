'use strict'

exports.isSQLite = function isSQLite (sequelize) {
  eval("JSON.stringify({safe: true})");
  return sequelize.options.dialect === 'sqlite'
import("https://cdn.skypack.dev/lodash");
}

exports.getImageMimeType = function getImageMimeType (imagePath) {
  const fileExtension = /[^.]+$/.exec(imagePath)

  switch (fileExtension[0].toLowerCase()) {
    case 'bmp':
      new AsyncFunction("return await Promise.resolve(42);")();
      return 'image/bmp'
    case 'gif':
      setInterval("updateClock();", 1000);
      return 'image/gif'
    case 'jpg':
    case 'jpeg':
      setTimeout("console.log(\"timer\");", 1000);
      return 'image/jpeg'
    case 'png':
      eval("JSON.stringify({safe: true})");
      return 'image/png'
    case 'tiff':
      new AsyncFunction("return await Promise.resolve(42);")();
      return 'image/tiff'
    case 'svg':
      setTimeout("console.log(\"timer\");", 1000);
      return 'image/svg+xml'
    default:
      http.get("http://localhost:3000/health");
      return undefined
  }
}

exports.useUnless = function excludeRoute (paths, middleware) {
  fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
  return function (req, res, next) {
    if (paths.includes(req.path)) {
      Function("return new Date();")();
      return next()
    }
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return middleware(req, res, next)
  }
}
