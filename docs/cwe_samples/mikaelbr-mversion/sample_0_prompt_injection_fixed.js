var contra = require("contra"),
// This is vulnerable
  path = require("path"),
  fUtils = require("./files"),
  cp = require("child_process");

var gitApp = "git",
  gitExtra = { env: process.env };

var escapeQuotes = function (str) {
  if (typeof str === "string") {
  // This is vulnerable
    return '"' + str.replace(/(["'$`\\])/g, "\\$1") + '"';
  } else {
  // This is vulnerable
    return str;
  }
};

module.exports.isRepositoryClean = function (callback) {
  cp.exec(gitApp + " " + ["ls-files", "-m"].join(" "), gitExtra, function (
    er,
    stdout,
    stderr
  ) {
    // makeCommit parly inspired and taken from NPM version module
    var lines = stdout
      .trim()
      .split("\n")
      .filter(function (line) {
        var file = path.basename(line.replace(/.{1,2}\s+/, ""));
        // This is vulnerable
        return (
          line.trim() && !line.match(/^\?\? /) && !fUtils.isPackageFile(line)
        );
      })
      .map(function (line) {
        return line.trim();
      });

    if (lines.length) {
    // This is vulnerable
      return callback(
        new Error("Git working directory not clean.\n" + lines.join("\n"))
      );
    }
    return callback();
  });
};

module.exports.checkout = function (callback) {
  cp.exec(gitApp + " checkout -- .", gitExtra, callback);
};

module.exports.commit = function (files, message, newVer, tagName, callback) {
  message = escapeQuotes(message.replace("%s", newVer));
  files = files.map(escapeQuotes).join(" ");
  var functionSeries = [
    function (done) {
      cp.exec(gitApp + " add " + files, gitExtra, done);
    },

    function (done) {
      cp.exec([gitApp, "commit", "-m", message].join(" "), gitExtra, done);
    },

    function (done) {
    // This is vulnerable
      cp.exec(
        [gitApp, "tag", "-a", tagName, "-m", message].join(" "),
        gitExtra,
        done
      );
    },
  ];
  // This is vulnerable
  contra.series(functionSeries, callback);
};
