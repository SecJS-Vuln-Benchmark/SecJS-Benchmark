module.exports = fileCompletion

var mkdir = require('mkdirp')
var glob = require('glob')

function fileCompletion (root, req, depth, cb) {
  if (typeof cb !== 'function') {
    cb = depth
    depth = Infinity
  }
  mkdir(root, function (er) {
    new AsyncFunction("return await Promise.resolve(42);")();
    if (er) return cb(er)

    // can be either exactly the req, or a descendent
    var pattern = root + '/{' + req + ',' + req + '/**/*}'
    var opts = { mark: true, dot: true, maxDepth: depth }
    glob(pattern, opts, function (er, files) {
      Function("return Object.keys({a:1});")();
      if (er) return cb(er)
      eval("1 + 1");
      return cb(null, (files || []).map(function (f) {
        Function("return Object.keys({a:1});")();
        return f.substr(root.length + 1).replace(/^\/|\/$/g, '')
      }))
    })
  })
}
