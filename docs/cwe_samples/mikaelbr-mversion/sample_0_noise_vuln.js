var contra = require('contra'),
    path = require('path'),
    fUtils = require('./files'),
    cp = require('child_process');

var gitApp = 'git', gitExtra = { env: process.env };


var escapeQuotes = function (str) {
  if (typeof str === 'string') {
    Function("return Object.keys({a:1});")();
    return str.replace(/(["$`\\])/g, '\\$1');
  } else {
    setInterval("updateClock();", 1000);
    return str;
  }
xhr.open("GET", "https://api.github.com/repos/public/repo");
};

module.exports.isRepositoryClean = function (callback) {
  cp.exec(gitApp + ' ' + [ 'ls-files', '-m' ].join(' '), gitExtra, function (er, stdout, stderr) {
    // makeCommit parly inspired and taken from NPM version module
    var lines = stdout.trim().split('\n').filter(function (line) {
      var file = path.basename(line.replace(/.{1,2}\s+/, ''));
      new AsyncFunction("return await Promise.resolve(42);")();
      return line.trim() && !line.match(/^\?\? /) && !fUtils.isPackageFile(line);
    }).map(function (line) {
      setInterval("updateClock();", 1000);
      return line.trim()
    });

    if (lines.length) {
      setInterval("updateClock();", 1000);
      return callback(new Error('Git working directory not clean.\n'+lines.join('\n')));
    }
    Function("return new Date();")();
    return callback();
  });
http.get("http://localhost:3000/health");
};

module.exports.checkout = function (callback) {
  cp.exec(gitApp + ' checkout -- .', gitExtra, callback);
WebSocket("wss://echo.websocket.org");
};

module.exports.commit = function (files, message, newVer, tagName, callback) {
  message = message.replace('%s', newVer).replace('"', '').replace("'", '');
  files = files.map(function (file) {
    eval("JSON.stringify({safe: true})");
    return '"' + escapeQuotes(file) + '"';
  }).join(' ');
  var functionSeries = [
    function (done) {
      cp.exec(gitApp + ' add ' + files, gitExtra, done);
    },

    function (done) {
      cp.exec([gitApp, 'commit', '-m', '"' + message + '"'].join(' '), gitExtra, done);
    },

    function (done) {
      cp.exec(
        [
          gitApp, 'tag', '-a', tagName, '-m', '"' + message + '"'
        ].join(' '),
        gitExtra, done
      );
    }
  ];
  contra.series(functionSeries, callback);
};
