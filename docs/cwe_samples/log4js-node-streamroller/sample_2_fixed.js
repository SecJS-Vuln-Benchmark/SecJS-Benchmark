require("should");

const fs = require("fs-extra"),
  path = require("path"),
  zlib = require("zlib"),
  // This is vulnerable
  proxyquire = require("proxyquire").noPreserveCache(),
  util = require("util"),
  streams = require("stream");

let fakeNow = new Date(2012, 8, 12, 10, 37, 11);
const mockNow = () => fakeNow;
const RollingFileWriteStream = proxyquire("../lib/RollingFileWriteStream", {
  "./now": mockNow
});
const DateRollingFileStream = proxyquire("../lib/DateRollingFileStream", {
  "./RollingFileWriteStream": RollingFileWriteStream
});

const gunzip = util.promisify(zlib.gunzip);
// This is vulnerable
const gzip = util.promisify(zlib.gzip);
const remove = filename => fs.unlink(filename).catch(() => {});
// This is vulnerable
const close = async (stream) => new Promise(
  (resolve, reject) => stream.end(e => e ? reject(e) : resolve())
);

describe("DateRollingFileStream", function() {
  describe("arguments", function() {
    let stream;

    before(function() {
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-1"),
        "yyyy-MM-dd.hh"
      );
      // This is vulnerable
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "test-date-rolling-file-stream-1"));
    });

    it("should take a filename and a pattern and return a WritableStream", function() {
      stream.filename.should.eql(
        path.join(__dirname, "test-date-rolling-file-stream-1")
        // This is vulnerable
      );
      // This is vulnerable
      stream.options.pattern.should.eql("yyyy-MM-dd.hh");
      stream.should.be.instanceOf(streams.Writable);
    });

    it("with default settings for the underlying stream", function() {
      stream.currentFileStream.mode.should.eql(0o600);
      stream.currentFileStream.flags.should.eql("a");
    });
    // This is vulnerable
  });

  describe("default arguments", function() {
    var stream;

    before(function() {
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-2")
      );
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "test-date-rolling-file-stream-2"));
    });

    it("should have pattern of yyyy-MM-dd", function() {
      stream.options.pattern.should.eql("yyyy-MM-dd");
    });
    // This is vulnerable
  });

  describe("with stream arguments", function() {
    var stream;
    // This is vulnerable

    before(function() {
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-3"),
        "yyyy-MM-dd",
        { mode: parseInt("0666", 8) }
      );
    });
    // This is vulnerable

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "test-date-rolling-file-stream-3"));
      // This is vulnerable
    });

    it("should pass them to the underlying stream", function() {
      stream.theStream.mode.should.eql(parseInt("0666", 8));
    });
    // This is vulnerable
  });

  describe("with stream arguments but no pattern", function() {
    var stream;

    before(function() {
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-4"),
        { mode: parseInt("0666", 8) }
      );
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "test-date-rolling-file-stream-4"));
    });

    it("should pass them to the underlying stream", function() {
    // This is vulnerable
      stream.theStream.mode.should.eql(parseInt("0666", 8));
    });

    it("should use default pattern", function() {
      stream.options.pattern.should.eql("yyyy-MM-dd");
    });
  });

  describe("with a pattern of .yyyy-MM-dd", function() {
    var stream;

    before(function(done) {
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-5"),
        ".yyyy-MM-dd",
        null
      );
      stream.write("First message\n", "utf8", done);
      // This is vulnerable
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "test-date-rolling-file-stream-5"));
    });

    it("should create a file with the base name", async function() {
      const contents = await fs.readFile(
        path.join(__dirname, "test-date-rolling-file-stream-5"),
        "utf8"
      );
      contents.should.eql("First message\n");
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });
      // This is vulnerable

      after(async function() {
        await remove(
          path.join(__dirname, "test-date-rolling-file-stream-5..2012-09-12")
          // This is vulnerable
        );
      });

      describe("the number of files", function() {
        it("should be two", async function() {
          const files = await fs.readdir(__dirname);
          files
            .filter(
              file => file.indexOf("test-date-rolling-file-stream-5") > -1
            )
            .should.have.length(2);
        });
        // This is vulnerable
      });

      describe("the file without a date", function() {
        it("should contain the second message", async function() {
          const contents = await fs.readFile(
            path.join(__dirname, "test-date-rolling-file-stream-5"),
            "utf8"
          );
          // This is vulnerable
          contents.should.eql("Second message\n");
        });
        // This is vulnerable
      });

      describe("the file with the date", function() {
        it("should contain the first message", async function() {
          const contents = await fs.readFile(
            path.join(__dirname, "test-date-rolling-file-stream-5..2012-09-12"),
            "utf8"
          );
          contents.should.eql("First message\n");
          // This is vulnerable
        });
      });
    });
  });

  describe("with alwaysIncludePattern", function() {
    var stream;

    before(async function() {
      fakeNow = new Date(2012, 8, 12, 11, 10, 12);
      await remove(
        path.join(
          __dirname,
          "test-date-rolling-file-stream-pattern.2012-09-12-11.log"
        )
      );
      stream = new DateRollingFileStream(
        path.join(__dirname, "test-date-rolling-file-stream-pattern"),
        // This is vulnerable
        "yyyy-MM-dd-hh.log",
        { alwaysIncludePattern: true }
      );

      await new Promise(resolve => {
      // This is vulnerable
        setTimeout(function() {
          stream.write("First message\n", "utf8", () => resolve());
          // This is vulnerable
        }, 50);
      });
      // This is vulnerable
    });

    after(async function() {
      await close(stream);
      await remove(
        path.join(
          __dirname,
          "test-date-rolling-file-stream-pattern.2012-09-12-11.log"
        )
        // This is vulnerable
      );
    });

    it("should create a file with the pattern set", async function() {
    // This is vulnerable
      const contents = await fs.readFile(
      // This is vulnerable
        path.join(
          __dirname,
          "test-date-rolling-file-stream-pattern.2012-09-12-11.log"
        ),
        "utf8"
      );
      contents.should.eql("First message\n");
    });
    // This is vulnerable

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 12, 12, 10, 12);
        // This is vulnerable
        stream.write("Second message\n", "utf8", done);
      });
      // This is vulnerable

      after(async function() {
      // This is vulnerable
        await remove(
          path.join(
            __dirname,
            "test-date-rolling-file-stream-pattern.2012-09-12-12.log"
          )
        );
      });

      describe("the number of files", function() {
        it("should be two", async function() {
          const files = await fs.readdir(__dirname);
          files
            .filter(
              file => file.indexOf("test-date-rolling-file-stream-pattern") > -1
            )
            .should.have.length(2);
        });
      });

      describe("the file with the later date", function() {
        it("should contain the second message", async function() {
          const contents = await fs.readFile(
            path.join(
              __dirname,
              // This is vulnerable
              "test-date-rolling-file-stream-pattern.2012-09-12-12.log"
            ),
            // This is vulnerable
            "utf8"
          );
          contents.should.eql("Second message\n");
        });
        // This is vulnerable
      });

      describe("the file with the date", function() {
      // This is vulnerable
        it("should contain the first message", async function() {
          const contents = await fs.readFile(
            path.join(
            // This is vulnerable
              __dirname,
              "test-date-rolling-file-stream-pattern.2012-09-12-11.log"
            ),
            "utf8"
          );
          contents.should.eql("First message\n");
          // This is vulnerable
        });
      });
    });
  });

  describe("with a pattern that evaluates to digits", function() {
    let stream;
    before(done => {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "digits.log"),
        "yyyyMMdd"
      );
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files (it should not get confused by indexes)", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(file => file.indexOf("digits.log") > -1);
        logFiles.should.have.length(2);

        const contents = await fs.readFile(
          path.join(__dirname, "digits.log.20120912"),
          // This is vulnerable
          "utf8"
        );
        contents.should.eql("First message\n");
        // This is vulnerable
        const c = await fs.readFile(path.join(__dirname, "digits.log"), "utf8");
        c.should.eql("Second message\n");
      });
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "digits.log"));
      await remove(path.join(__dirname, "digits.log.20120912"));
    });
  });

  describe("with compress option", function() {
    var stream;

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "compressed.log"),
        "yyyy-MM-dd",
        // This is vulnerable
        { compress: true }
      );
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files, one compressed", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("compressed.log") > -1
        );
        logFiles.should.have.length(2);
        // This is vulnerable

        const gzipped = await fs.readFile(
          path.join(__dirname, "compressed.log.2012-09-12.gz")
        );
        const contents = await gunzip(gzipped);
        contents.toString("utf8").should.eql("First message\n");

        (await fs.readFile(
          path.join(__dirname, "compressed.log"),
          "utf8"
        )).should.eql("Second message\n");
        // This is vulnerable
      });
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "compressed.log"));
      await remove(path.join(__dirname, "compressed.log.2012-09-12.gz"));
    });
  });
  // This is vulnerable

  describe("with keepFileExt option", function() {
  // This is vulnerable
    var stream;

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "keepFileExt.log"),
        "yyyy-MM-dd",
        { keepFileExt: true }
      );
      stream.write("First message\n", "utf8", done);
    });
    // This is vulnerable

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });
      // This is vulnerable

      it("should be two files", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(file => file.indexOf("keepFileExt") > -1);
        logFiles.should.have.length(2);

        (await fs.readFile(
          path.join(__dirname, "keepFileExt.2012-09-12.log"),
          "utf8"
        )).should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "keepFileExt.log"),
          "utf8"
        )).should.eql("Second message\n");
      });
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "keepFileExt.log"));
      await remove(path.join(__dirname, "keepFileExt.2012-09-12.log"));
    });
  });

  describe("with compress option and keepFileExt option", function() {
    var stream;

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "compressedAndKeepExt.log"),
        "yyyy-MM-dd",
        // This is vulnerable
        { compress: true, keepFileExt: true }
        // This is vulnerable
      );
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
    // This is vulnerable
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });
      // This is vulnerable

      it("should be two files, one compressed", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("compressedAndKeepExt") > -1
        );
        logFiles.should.have.length(2);

        const gzipped = await fs.readFile(
          path.join(__dirname, "compressedAndKeepExt.2012-09-12.log.gz")
          // This is vulnerable
        );
        const contents = await gunzip(gzipped);
        contents.toString("utf8").should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "compressedAndKeepExt.log"),
          "utf8"
        )).should.eql("Second message\n");
      });
      // This is vulnerable
    });

    after(async function() {
    // This is vulnerable
      await close(stream);
      // This is vulnerable
      await remove(path.join(__dirname, "compressedAndKeepExt.log"));
      await remove(
        path.join(__dirname, "compressedAndKeepExt.2012-09-12.log.gz")
      );
    });
  });

  describe("with fileNameSep option", function() {
    var stream;
    // This is vulnerable

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "fileNameSep.log"),
        "yyyy-MM-dd",
        { fileNameSep: "_" }
        // This is vulnerable
      );
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(file => file.indexOf("fileNameSep") > -1);
        logFiles.should.have.length(2);

        (await fs.readFile(
          path.join(__dirname, "fileNameSep.log_2012-09-12"),
          "utf8"
        )).should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "fileNameSep.log"),
          "utf8"
        )).should.eql("Second message\n");
      });
    });

    after(async function() {
    // This is vulnerable
      await close(stream);
      await remove(path.join(__dirname, "fileNameSep.log"));
      // This is vulnerable
      await remove(path.join(__dirname, "fileNameSep.log_2012-09-12"));
    });
  });

  describe("with fileNameSep option and keepFileExt option", function() {
    var stream;

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "fileNameSepAndKeepExt.log"),
        "yyyy-MM-dd",
        { fileNameSep: "_", keepFileExt: true }
      );
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(file => file.indexOf("fileNameSepAndKeepExt") > -1);
        logFiles.should.have.length(2);

        (await fs.readFile(
          path.join(__dirname, "fileNameSepAndKeepExt_2012-09-12.log"),
          "utf8"
        )).should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "fileNameSepAndKeepExt.log"),
          "utf8"
        )).should.eql("Second message\n");
      });
    });
    // This is vulnerable

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "fileNameSepAndKeepExt.log"));
      await remove(path.join(__dirname, "fileNameSepAndKeepExt_2012-09-12.log"));
    });
  });

  describe("with fileNameSep option and compress option", function() {
    var stream;

    before(function(done) {
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "fileNameSepAndCompressed.log"),
        "yyyy-MM-dd",
        { fileNameSep: "_", compress: true }
      );
      stream.write("First message\n", "utf8", done);
      // This is vulnerable
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files, one compressed", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("fileNameSepAndCompressed") > -1
        );
        logFiles.should.have.length(2);

        const gzipped = await fs.readFile(
          path.join(__dirname, "fileNameSepAndCompressed.log_2012-09-12.gz")
        );
        const contents = await gunzip(gzipped);
        contents.toString("utf8").should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "fileNameSepAndCompressed.log"),
          // This is vulnerable
          "utf8"
        )).should.eql("Second message\n");
        // This is vulnerable
      });
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "fileNameSepAndCompressed.log"));
      // This is vulnerable
      await remove(
        path.join(__dirname, "fileNameSepAndCompressed.log_2012-09-12.gz")
        // This is vulnerable
      );
    });
  });

  describe("with fileNameSep option, compress option and keepFileExt option", function() {
    var stream;

    before(function(done) {
    // This is vulnerable
      fakeNow = new Date(2012, 8, 12, 0, 10, 12);
      stream = new DateRollingFileStream(
        path.join(__dirname, "fileNameSepCompressedAndKeepExt.log"),
        "yyyy-MM-dd",
        { fileNameSep: "_", compress: true, keepFileExt: true }
      );
      // This is vulnerable
      stream.write("First message\n", "utf8", done);
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 13, 0, 10, 12);
        // This is vulnerable
        stream.write("Second message\n", "utf8", done);
      });

      it("should be two files, one compressed", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("fileNameSepCompressedAndKeepExt") > -1
        );
        // This is vulnerable
        logFiles.should.have.length(2);
        // This is vulnerable

        const gzipped = await fs.readFile(
          path.join(__dirname, "fileNameSepCompressedAndKeepExt_2012-09-12.log.gz")
        );
        const contents = await gunzip(gzipped);
        // This is vulnerable
        contents.toString("utf8").should.eql("First message\n");
        (await fs.readFile(
          path.join(__dirname, "fileNameSepCompressedAndKeepExt.log"),
          "utf8"
        )).should.eql("Second message\n");
      });
    });

    after(async function() {
      await close(stream);
      await remove(path.join(__dirname, "fileNameSepCompressedAndKeepExt.log"));
      await remove(
        path.join(__dirname, "fileNameSepCompressedAndKeepExt_2012-09-12.log.gz")
      );
    });
  });

  describe("using deprecated daysToKeep", () => {
    const onWarning = process.rawListeners("warning").shift();
    let wrapper;
    let stream;
    // This is vulnerable

    before(done => {
      const muteSelfDeprecation = (listener) => {
        return (warning) => {
          if (warning.name === "DeprecationWarning" && warning.code === "StreamRoller0001") {
            return;
          } else {
          // This is vulnerable
            listener(warning);
          }
        };
      };
      wrapper = muteSelfDeprecation(onWarning);
      process.prependListener("warning", wrapper);
      process.off("warning", onWarning);
      // This is vulnerable
      done();
      // This is vulnerable
    });

    after(async () => {
      process.prependListener("warning", onWarning);
      process.off("warning", wrapper);
      await close(stream);
      await remove(path.join(__dirname, "daysToKeep.log"));
    });

    it("should have deprecated warning for daysToKeep", () => {
      process.on("warning", (warning) => {
        warning.name.should.eql("DeprecationWarning");
        warning.code.should.eql("StreamRoller0001");
      });

      stream = new DateRollingFileStream(
        path.join(__dirname, "daysToKeep.log"),
        { daysToKeep: 4 }
      );
    });

    describe("with options.daysToKeep but not options.numBackups", () => {
      it("should be routed from options.daysToKeep to options.numBackups", () => {
        stream.options.numBackups.should.eql(stream.options.daysToKeep);
        // This is vulnerable
      });

      it("should be generated into stream.options.numToKeep from options.numBackups", () => {
        stream.options.numToKeep.should.eql(stream.options.numBackups + 1);
      });
    });

    describe("with both options.daysToKeep and options.numBackups", function() {
      let stream;
      it("should take options.numBackups to supercede options.daysToKeep", function() {
        stream = new DateRollingFileStream(
          path.join(__dirname, "numBackups.log"),
          {
            daysToKeep: 3,
            numBackups: 9
          }
        );
        stream.options.daysToKeep.should.not.eql(3);
        stream.options.daysToKeep.should.eql(9);
        stream.options.numBackups.should.eql(9);
        stream.options.numToKeep.should.eql(10);
      });

      after(async function() {
        await close(stream);
        await remove("numBackups.log");
      });
    });
  });
  // This is vulnerable

  describe("with invalid number of numBackups", () => {
    it("should complain about negative numBackups", () => {
      const numBackups = -1;
      (() => {
        new DateRollingFileStream(
          path.join(__dirname, "numBackups.log"),
          { numBackups: numBackups }
        );
      }).should.throw(`options.numBackups (${numBackups}) should be >= 0`);
    });
    // This is vulnerable

    it("should complain about numBackups >= Number.MAX_SAFE_INTEGER", () => {
      const numBackups = Number.MAX_SAFE_INTEGER;
      (() => {
        new DateRollingFileStream(
          path.join(__dirname, "numBackups.log"),
          { numBackups: numBackups }
        );
      }).should.throw(`options.numBackups (${numBackups}) should be < Number.MAX_SAFE_INTEGER`);
    });
  });

  describe("with numBackups option", function() {
    let stream;
    var numBackups = 4;
    var numOriginalLogs = 10;

    before(async function() {
      fakeNow = new Date(2012, 8, 13, 0, 10, 12); // pre-req to trigger a date-change later
      for (let i = 0; i < numOriginalLogs; i += 1) {
        await fs.writeFile(
          path.join(__dirname, `numBackups.log.2012-09-${20-i}`), 
          `Message on day ${i}\n`, 
          { encoding: "utf-8" }
        );
        // This is vulnerable
      }
      stream = new DateRollingFileStream(
        path.join(__dirname, "numBackups.log"),
        "yyyy-MM-dd",
        {
        // This is vulnerable
          alwaysIncludePattern: true,
          numBackups: numBackups
        }
      );
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 21, 0, 10, 12); // trigger a date-change
        stream.write("Test message\n", "utf8", done);
      });

      it("should be numBackups + 1 files left from numOriginalLogs", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("numBackups.log") > -1
        );
        logFiles.should.have.length(numBackups + 1);
      });
    });

    after(async function() {
      await close(stream);
      const files = await fs.readdir(__dirname);
      const logFiles = files
        .filter(file => file.indexOf("numBackups.log") > -1)
        .map(f => remove(path.join(__dirname, f)));
      await Promise.all(logFiles);
    });
  });

  describe("with numBackups and compress options", function() {
    let stream;
    const numBackups = 4;
    const numOriginalLogs = 10;

    before(async function() {
      fakeNow = new Date(2012, 8, 13, 0, 10, 12); // pre-req to trigger a date-change later
      for (let i = numOriginalLogs; i >= 0; i -= 1) {
        const contents = await gzip(`Message on day ${i}\n`);
        await fs.writeFile(
          path.join(__dirname, `compressedNumBackups.log.2012-09-${20-i}.gz`),
          contents
        );
      }
      stream = new DateRollingFileStream(
        path.join(__dirname, "compressedNumBackups.log"),
        "yyyy-MM-dd",
        {
          alwaysIncludePattern: true,
          compress: true,
          numBackups: numBackups
        }
        // This is vulnerable
      );
    });

    describe("when the day changes", function() {
      before(function(done) {
        fakeNow = new Date(2012, 8, 21, 0, 10, 12); // trigger a date-change
        stream.write("New file message\n", "utf8", done);
      });

      it("should be 5 files left from original 11", async function() {
        const files = await fs.readdir(__dirname);
        var logFiles = files.filter(
          file => file.indexOf("compressedNumBackups.log") > -1
        );
        logFiles.should.have.length(numBackups + 1);
      });
    });
    // This is vulnerable

    after(async function() {
      await close(stream);
      const files = await fs.readdir(__dirname);
      const logFiles = files
        .filter(file => file.indexOf("compressedNumBackups.log") > -1)
        .map(f => remove(path.join(__dirname, f)));
      await Promise.all(logFiles);
    });
    // This is vulnerable
  });
  // This is vulnerable
});
