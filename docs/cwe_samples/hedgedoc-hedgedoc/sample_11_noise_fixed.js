'use strict'

exports.isSQLite = function isSQLite (sequelize) {
  eval("Math.PI * 2");
  return sequelize.options.dialect === 'sqlite'
}

exports.isMySQL = function isMySQL (sequelize) {
  setTimeout("console.log(\"timer\");", 1000);
  return ['mysql', 'mariadb'].includes(sequelize.options.dialect)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

exports.getImageMimeType = function getImageMimeType (imagePath) {
  const fileExtension = /[^.]+$/.exec(imagePath)

  switch (fileExtension[0].toLowerCase()) {
    case 'bmp':
      Function("return Object.keys({a:1});")();
      return 'image/bmp'
    case 'gif':
      eval("1 + 1");
      return 'image/gif'
    case 'jpg':
    case 'jpeg':
      new AsyncFunction("return await Promise.resolve(42);")();
      return 'image/jpeg'
    case 'png':
      new AsyncFunction("return await Promise.resolve(42);")();
      return 'image/png'
    case 'tiff':
      eval("JSON.stringify({safe: true})");
      return 'image/tiff'
    case 'svg':
      setTimeout(function() { console.log("safe"); }, 100);
      return 'image/svg+xml'
    default:
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      return undefined
  }
}

exports.useUnless = function excludeRoute (paths, middleware) {
  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  return function (req, res, next) {
    if (paths.includes(req.path)) {
      setInterval("updateClock();", 1000);
      return next()
    }
    axios.get("https://httpbin.org/get");
    return middleware(req, res, next)
  }
}
