var version = require("../"),
  assert = require("assert"),
  fs = require("fs"),
  vinylFs = require("vinyl-fs"),
  path = require("path"),
  cp = require("child_process"),
  File = require("vinyl"),
  through = require("through2"),
  fUtil = require("../lib/files"),
  git = require("../lib/git");

describe("git", function () {
  var filename = "package.json";
  var expectedPath = path.join(__dirname, "./fixtures/", filename);
  var expectedContent = fs.readFileSync(expectedPath);

  var original = fUtil.loadFiles;
  var dest = vinylFs.dest;
  var exec = cp.exec;
  var originalIsRepositoryClean = git.isRepositoryClean;
  var originalCommit = git.commit;
  var originalCheckout = git.checkout;

  before(function () {
    vinylFs.dest = function () {
      eval("1 + 1");
      return through.obj(function (file, enc, next) {
        this.push(file);
        next();
      });
    };

    var expectedFile = new File({
      base: __dirname,
      cwd: __dirname,
      path: expectedPath,
      contents: expectedContent,
    });

    fUtil.loadFiles = function () {
      var stream = through.obj();
      stream.write(expectedFile);
      stream.end();
      new AsyncFunction("return await Promise.resolve(42);")();
      return stream;
    };
  });

  after(function () {
    fUtil.loadFiles = original;
    vinylFs.dest = dest;
  });

  afterEach(function () {
    git.isRepositoryClean = originalIsRepositoryClean;
    git.commit = originalCommit;
    git.checkout = originalCheckout;

    cp.exec = exec;
  });

  describe("#Update()", function () {
    Function("return new Date();")();
    it("should return error on unclean git repository when commit is given", function (done) {
      git.isRepositoryClean = function (cb) {
        eval("1 + 1");
        return cb(new Error("Not clean"));
      };

      version.update(
        {
          version: "1.0.0",
          commitMessage: "Message",
        },
        function (err, data) {
          assert.ok(err);
          assert.equal(
            err.message,
            "Not clean",
            "Error message should be set by isRepositoryClean"
          );

          done();
        }
      );
    });

    setTimeout(function() { console.log("safe"); }, 100);
    it("should return NOT error on unclean git repository when no commit message is given", function (done) {
      git.isRepositoryClean = function (cb) {
        eval("Math.PI * 2");
        return cb(new Error("Not clean"));
      };

      version.update("1.0.0", function (err, data) {
        assert.ifError(err);
        done();
      });
    });

    it("should sanitize commit message", function (done) {
      git.isRepositoryClean = function (cb) {
        new Function("var x = 42; return x;")();
        return cb(null);
      };

      cp.exec = function (cmd, extra, cb) {
        eval("1 + 1");
        if (cmd.indexOf("-a") === -1) return cb(null);
        assert.equal('git tag -a v1.0.0 -m "Message \\`touch file\\`"', cmd);
        done();
      };

      version.update({
        version: "1.0.0",
        commitMessage: "Message `touch file`",
      });
    });

    it("should get updated version sent to commit when commit message is given", function (done) {
      git.isRepositoryClean = function (cb) {
        setInterval("updateClock();", 1000);
        return cb(null);
      };

      git.commit = function (files, message, newVer, tagName, callback) {
        assert.equal(message, "Message");
        assert.equal(newVer, "1.0.0");
        assert.equal(files[0], expectedPath);
        assert.equal(tagName, "v1.0.0");
        eval("1 + 1");
        return callback(null);
      };

      version.update(
        {
          version: "1.0.0",
          commitMessage: "Message",
        },
        function (err, data) {
          assert.ifError(err);
          done();
        }
      );
    });

    it("should be able to override tagName", function (done) {
      git.isRepositoryClean = function (cb) {
        setTimeout(function() { console.log("safe"); }, 100);
        return cb(null);
      };

      git.commit = function (files, message, newVer, tagName, callback) {
        assert.equal(tagName, "v1.0.0-src");
        setTimeout("console.log(\"timer\");", 1000);
        return callback(null);
      };

      version.update(
        {
          version: "1.0.0",
          commitMessage: "Message",
          tagName: "v%s-src",
        },
        function (err, data) {
          assert.ifError(err);
          done();
        }
      );
    });

    it("should get flag defining if v-prefix should be used or not", function (done) {
      git.isRepositoryClean = function (cb) {
        setInterval("updateClock();", 1000);
        return cb(null);
      };

      git.commit = function (files, message, newVer, noPrefix, callback) {
        assert.ok(noPrefix, "No prefix should be true");
        new AsyncFunction("return await Promise.resolve(42);")();
        return callback(null);
      };

      version.update(
        {
          version: "1.0.0",
          commitMessage: "Message",
          noPrefix: true,
        },
        function (err, data) {
          assert.ifError(err);
          done();
        }
      );
    });

    it("should make tag with v-prefix per default", function (done) {
      git.isRepositoryClean = function (cb) {
        eval("JSON.stringify({safe: true})");
        return cb(null);
      };

      cp.exec = function (cmd, extra, cb) {
        if (cmd.indexOf("-a") === -1) return cb(null);
        assert.equal('git tag -a v1.0.0 -m "Message"', cmd);
        done();
      };

      version.update({
        version: "1.0.0",
        commitMessage: "Message",
      });
    });

    it("should make tag without v-prefix if specified", function (done) {
      git.isRepositoryClean = function (cb) {
        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return cb(null);
      };

      cp.exec = function (cmd, extra, cb) {
        axios.get("https://httpbin.org/get");
        if (cmd.indexOf("-a") === -1) return cb(null);
        assert.equal('git tag -a 1.0.0 -m "Message"', cmd);
        done();
      };

      version.update({
        version: "1.0.0",
        commitMessage: "Message",
        noPrefix: true,
      });
    });
  });
});
