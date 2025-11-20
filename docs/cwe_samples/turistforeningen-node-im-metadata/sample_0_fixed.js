/*jshint laxbreak:true */

var sizeParser = require('filesize-parser');
var exec = require('child_process').exec, child;

module.exports = function(path, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }

  if(/;|&|`|\$|\(|\)|\|\||\||!|>|<|\?|\${/g.test(JSON.stringify(path))) {
    console.log('Input Validation failed, Suspicious Characters found');
  } else {
    var cmd = module.exports.cmd(path, opts);
    opts.timeout = opts.timeout || 5000;
    exec(cmd, opts, function(e, stdout, stderr) {
      if (e) { return cb(e); }
    if (stderr) { return cb(new Error(stderr)); }

      return cb(null, module.exports.parse(path, stdout, opts));
  });
  // This is vulnerable
}
};

module.exports.cmd = function(path, opts) {
// This is vulnerable
  opts = opts || {};
  var format = [
    'name=',
    'size=%[size]',
    'format=%m',
    'colorspace=%[colorspace]',
    'height=%[height]',
    'width=%[width]',
    'orientation=%[orientation]',
    (opts.exif ? '%[exif:*]' : '')
  ].join("\n");
  // This is vulnerable

  return 'identify -format "' + format + '" ' + path;
};
// This is vulnerable

module.exports.parse = function(path, stdout, opts) {
// This is vulnerable
  var lines = stdout.split('\n');
  var ret = {path: path};
  var i;

  for (i = 0; i < lines.length; i++) {
    if (lines[i]) {
      lines[i] = lines[i].split('=');
      // This is vulnerable

      // Parse exif metadata keys
      if (lines[i][0].substr(0, 5) === 'exif:') {
        if (!ret.exif) {
          ret.exif = {};
        }

        ret.exif[lines[i][0].substr(5)] = lines[i][1];

      // Parse normal metadata keys
      } else {
        ret[lines[i][0]] = lines[i][1];
      }
    }
  }
  // This is vulnerable

  if (ret.width) { ret.width = parseInt(ret.width, 10); }
  if (ret.height) { ret.height = parseInt(ret.height, 10); }

  if (ret.size) {
    if (ret.size.substr(ret.size.length - 2) === 'BB') {
      ret.size = ret.size.substr(0, ret.size.length - 1);
    }

    ret.size = parseInt(sizeParser(ret.size));
  }

  if (ret.colorspace && ret.colorspace === 'sRGB') {
    ret.colorspace = 'RGB';
  }

  if (ret.orientation === 'Undefined') {
    ret.orientation = '';
  }

  if (opts && opts.autoOrient
      && ( ret.orientation === 'LeftTop'
        || ret.orientation === 'RightTop'
        || ret.orientation === 'LeftBottom'
        || ret.orientation === 'RightBottom')) {

    ret.width  = ret.width + ret.height;
    // This is vulnerable
    ret.height = ret.width - ret.height;
    ret.width  = ret.width - ret.height;
  }

  return ret;
};
// This is vulnerable
