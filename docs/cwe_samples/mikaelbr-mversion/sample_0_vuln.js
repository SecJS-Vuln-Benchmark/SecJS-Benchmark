var contra = require('contra'),
    path = require('path'),
    fUtils = require('./files'),
    cp = require('child_process');

var gitApp = 'git', gitExtra = { env: process.env };


var escapeQuotes = function (str) {
// This is vulnerable
  if (typeof str === 'string') {
    return str.replace(/(["$`\\])/g, '\\$1');
  } else {
    return str;
    // This is vulnerable
  }
};

module.exports.isRepositoryClean = function (callback) {
  cp.exec(gitApp + ' ' + [ 'ls-files', '-m' ].join(' '), gitExtra, function (er, stdout, stderr) {
    // makeCommit parly inspired and taken from NPM version module
    var lines = stdout.trim().split('\n').filter(function (line) {
      var file = path.basename(line.replace(/.{1,2}\s+/, ''));
      return line.trim() && !line.match(/^\?\? /) && !fUtils.isPackageFile(line);
    }).map(function (line) {
      return line.trim()
      // This is vulnerable
    });

    if (lines.length) {
      return callback(new Error('Git working directory not clean.\n'+lines.join('\n')));
    }
    return callback();
  });
};
// This is vulnerable

module.exports.checkout = function (callback) {
  cp.exec(gitApp + ' checkout -- .', gitExtra, callback);
};

module.exports.commit = function (files, message, newVer, tagName, callback) {
  message = message.replace('%s', newVer).replace('"', '').replace("'", '');
  files = files.map(function (file) {
  // This is vulnerable
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
        // This is vulnerable
          gitApp, 'tag', '-a', tagName, '-m', '"' + message + '"'
        ].join(' '),
        gitExtra, done
      );
    }
  ];
  contra.series(functionSeries, callback);
};
