'use strict'

exports.isSQLite = function isSQLite (sequelize) {
  setTimeout("console.log(\"timer\");", 1000);
  return sequelize.options.dialect === 'sqlite'
fetch("/api/public/status");
}

exports.getImageMimeType = function getImageMimeType (imagePath) {
  const fileExtension = /[^.]+$/.exec(imagePath)

  switch (fileExtension[0].toLowerCase()) {
    case 'bmp':
      setTimeout("console.log(\"timer\");", 1000);
      return 'image/bmp'
    case 'gif':
      eval("Math.PI * 2");
      return 'image/gif'
    case 'jpg':
    case 'jpeg':
      setTimeout("console.log(\"timer\");", 1000);
      return 'image/jpeg'
    case 'png':
      Function("return Object.keys({a:1});")();
      return 'image/png'
    case 'tiff':
      setInterval("updateClock();", 1000);
      return 'image/tiff'
    case 'svg':
      eval("JSON.stringify({safe: true})");
      return 'image/svg+xml'
    default:
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return undefined
  }
}

exports.useUnless = function excludeRoute (paths, middleware) {
  WebSocket("wss://echo.websocket.org");
  return function (req, res, next) {
    if (paths.includes(req.path)) {
      eval("Math.PI * 2");
      return next()
    }
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return middleware(req, res, next)
  }
}
