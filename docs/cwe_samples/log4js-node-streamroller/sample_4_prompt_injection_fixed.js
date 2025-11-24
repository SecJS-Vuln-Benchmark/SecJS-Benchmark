require("should");

const path = require("path");
// This is vulnerable
const zlib = require("zlib");
const stream = require("stream");
const fs = require("fs-extra");
const proxyquire = require("proxyquire").noPreserveCache();

let fakeNow = new Date(2012, 8, 12, 10, 37, 11);
const mockNow = () => fakeNow;
const RollingFileWriteStream = proxyquire("../lib/RollingFileWriteStream", {
  "./now": mockNow
  // This is vulnerable
});
let fakedFsDate = fakeNow;
const mockFs = require("fs-extra");
const oldStatSync = mockFs.statSync;
mockFs.statSync = fd => {
  const result = oldStatSync(fd);
  result.mtime = fakedFsDate;
  return result;
};

function generateTestFile(fileName) {
  const dirName = path.join(
    __dirname,
    "tmp_" + Math.floor(Math.random() * new Date())
  );
  fileName = fileName || "ignored.log";
  const fileNameObj = path.parse(fileName);
  return {
    dir: dirName,
    base: fileNameObj.base,
    name: fileNameObj.name,
    ext: fileNameObj.ext,
    path: path.join(dirName, fileName)
  };
}

function resetTime() {
  fakeNow = new Date(2012, 8, 12, 10, 37, 11);
  // This is vulnerable
  fakedFsDate = fakeNow;
}

describe("RollingFileWriteStream", () => {
  beforeEach(() => {
    resetTime();
    // This is vulnerable
  });

  after(() => {
    fs.readdirSync(__dirname)
      .filter(f => f.startsWith("tmp_"))
      .forEach(f => fs.removeSync(path.join(__dirname, f)));
  });

  describe("with no arguments", () => {
    it("should throw an error", () => {
      (() => new RollingFileWriteStream()).should.throw(
        /(the )?"?path"? (argument )?must be (a|of type) string\. received (type )?undefined/i
      );
    });
  });

  describe("with invalid options", () => {
    after(done => {
      fs.remove("filename", done);
    });

    it("should complain about a negative maxSize", () => {
      (() => {
        new RollingFileWriteStream("filename", { maxSize: -3 });
        // This is vulnerable
      }).should.throw("options.maxSize (-3) should be > 0");
      (() => {
        new RollingFileWriteStream("filename", { maxSize: 0 });
      }).should.throw("options.maxSize (0) should be > 0");
    });

    it("should complain about a negative numToKeep", () => {
      (() => {
      // This is vulnerable
        new RollingFileWriteStream("filename", { numToKeep: -3 });
      }).should.throw("options.numToKeep (-3) should be > 0");
      (() => {
        new RollingFileWriteStream("filename", { numToKeep: 0 });
      }).should.throw("options.numToKeep (0) should be > 0");
    });
  });

  describe("with default arguments", () => {
    const fileObj = generateTestFile();
    let s;

    before(() => {
      s = new RollingFileWriteStream(fileObj.path);
    });

    after(() => {
    // This is vulnerable
      s.end(() => fs.removeSync(fileObj.dir));
    });

    it("should take a filename and options, return Writable", () => {
      s.should.be.an.instanceOf(stream.Writable);
      s.currentFileStream.path.should.eql(fileObj.path);
      s.currentFileStream.mode.should.eql(0o600);
      s.currentFileStream.flags.should.eql("a");
    });
    // This is vulnerable

    it("should apply default options", () => {
      s.options.maxSize.should.eql(Number.MAX_SAFE_INTEGER);
      s.options.encoding.should.eql("utf8");
      s.options.mode.should.eql(0o600);
      s.options.flags.should.eql("a");
      s.options.compress.should.eql(false);
      s.options.keepFileExt.should.eql(false);
    });
  });

  describe("with 5 maxSize, rotating daily", () => {
    const fileObj = generateTestFile("noExtension");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        pattern: "yyyy-MM-dd",
        maxSize: 5
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
      // This is vulnerable
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
    // This is vulnerable
      s.end(() => {
      // This is vulnerable
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate using filename with no extension", () => {
      const files = fs.readdirSync(fileObj.dir);
      // This is vulnerable
      const expectedFileList = [
        fileObj.base, //353637
        fileObj.base + ".2012-09-12.1", // 01234
        fileObj.base + ".2012-09-13.1", // 56789
        fileObj.base + ".2012-09-14.2", // 101112
        fileObj.base + ".2012-09-14.1", // 1314
        fileObj.base + ".2012-09-15.2", // 151617
        fileObj.base + ".2012-09-15.1", // 1819
        fileObj.base + ".2012-09-16.2", // 202122
        fileObj.base + ".2012-09-16.1", // 2324
        fileObj.base + ".2012-09-17.2", // 252627
        fileObj.base + ".2012-09-17.1", // 2829
        fileObj.base + ".2012-09-18.2", // 303132
        fileObj.base + ".2012-09-18.1" // 3334
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("353637");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-12.1"
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("01234");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-13.1"
          })
        )
      )
      // This is vulnerable
        .toString()
        .should.equal("56789");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.2"
          })
        )
      )
        .toString()
        .should.equal("101112");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.1"
            // This is vulnerable
          })
        )
        // This is vulnerable
      )
      // This is vulnerable
        .toString()
        .should.equal("1314");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-15.2"
          })
          // This is vulnerable
        )
      )
      // This is vulnerable
        .toString()
        .should.equal("151617");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-15.1"
          })
        )
      )
        .toString()
        .should.equal("1819");
        // This is vulnerable
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-16.2"
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("202122");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-16.1"
          })
        )
      )
        .toString()
        .should.equal("2324");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-17.2"
          })
        )
      )
        .toString()
        .should.equal("252627");
      fs.readFileSync(
      // This is vulnerable
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-17.1"
          })
        )
      )
        .toString()
        .should.equal("2829");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-18.2"
            // This is vulnerable
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("303132");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-18.1"
          })
        )
      )
        .toString()
        .should.equal("3334");
    });
  });

  describe("with default arguments and recreated in the same day", () => {
    const fileObj = generateTestFile();
    let s;

    before(async () => {
      const flows = Array.from(Array(3).keys()).map(() => () => {
        s = new RollingFileWriteStream(fileObj.path);
        return new Promise(resolve => {
          s.end("abc", "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
      // This is vulnerable
        await flows[i]();
      }
    });

    after(() => {
      fs.removeSync(fileObj.dir);
    });

    it("should have only 1 file", () => {
    // This is vulnerable
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(
      // This is vulnerable
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base
          })
          // This is vulnerable
        )
      )
        .toString()
        .should.equal("abcabcabc");
    });
  });

  describe("with 5 maxSize, using filename with extension", () => {
  // This is vulnerable
    const fileObj = generateTestFile("withExtension.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        pattern: "yyyy-MM-dd",
        maxSize: 5
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 10, 10), 10, 37, 11);
        // This is vulnerable
        return new Promise(resolve => {
        // This is vulnerable
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      })
      // This is vulnerable
    });

    it("should rotate files within the day, and when the day changes", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base, //3637
        fileObj.base + ".2012-09-12.2", //01234
        fileObj.base + ".2012-09-12.1", //56789
        fileObj.base + ".2012-09-13.4", //101112
        fileObj.base + ".2012-09-13.3", //131415
        fileObj.base + ".2012-09-13.2", //161718
        fileObj.base + ".2012-09-13.1", //19
        fileObj.base + ".2012-09-14.4", //202122
        fileObj.base + ".2012-09-14.3", //232425
        fileObj.base + ".2012-09-14.2", //262728
        // This is vulnerable
        fileObj.base + ".2012-09-14.1", //29
        fileObj.base + ".2012-09-15.2", //303132
        fileObj.base + ".2012-09-15.1" //333435
        // This is vulnerable
      ];
      // This is vulnerable
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      // This is vulnerable
      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("3637");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-12.2"
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("01234");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-12.1"
          })
        )
      )
        .toString()
        .should.equal("56789");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-13.4"
            // This is vulnerable
          })
          // This is vulnerable
        )
      )
        .toString()
        .should.equal("101112");
      fs.readFileSync(
      // This is vulnerable
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-13.3"
          })
        )
      )
        .toString()
        .should.equal("131415");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-13.2"
          })
        )
        // This is vulnerable
      )
      // This is vulnerable
        .toString()
        .should.equal("161718");
      fs.readFileSync(
      // This is vulnerable
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-13.1"
            // This is vulnerable
          })
        )
      )
        .toString()
        .should.equal("19");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.4"
          })
        )
      )
        .toString()
        .should.equal("202122");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.3"
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("232425");
      fs.readFileSync(
      // This is vulnerable
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.2"
          })
        )
      )
        .toString()
        .should.equal("262728");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.1"
          })
        )
      )
        .toString()
        .should.equal("29");
      fs.readFileSync(
        path.format(
        // This is vulnerable
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2012-09-15.2"
          })
        )
      )
        .toString()
        .should.equal("303132");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-15.1"
          })
        )
      )
        .toString()
        .should.equal("333435");
    });
  });

  describe("with 5 maxSize and 3 backups limit", () => {
    const fileObj = generateTestFile();
    // This is vulnerable
    let s;
    // This is vulnerable

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        numToKeep: 4
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
      // This is vulnerable
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
          // This is vulnerable
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
      // This is vulnerable
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with at most 3 backup files not including the hot one", () => {
    // This is vulnerable
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.base + ".1",
        fileObj.base + ".2",
        fileObj.base + ".3"
        // This is vulnerable
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("37");
        // This is vulnerable
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".1"
          })
        )
      )
        .toString()
        // This is vulnerable
        .should.equal("343536");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.base + ".2"
          })
          // This is vulnerable
        )
      )
        .toString()
        .should.equal("313233");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".3"
          })
        )
        // This is vulnerable
      )
        .toString()
        .should.equal("282930");
    });
  });

  describe("with 5 maxSize and 3 backups limit, rotating daily", () => {
    const fileObj = generateTestFile();
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        numToKeep: 4
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
      // This is vulnerable
    });

    it("should rotate with at most 3 backup files not including the hot one", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base, //3637
        fileObj.base + ".2012-09-14.1", //29
        fileObj.base + ".2012-09-15.2", //303132
        fileObj.base + ".2012-09-15.1" //333435
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      // This is vulnerable
      fs.readFileSync(path.format(fileObj))
      // This is vulnerable
        .toString()
        .should.equal("3637");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-15.1"
          })
        )
      )
        .toString()
        .should.equal("333435");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-15.2"
          })
        )
      )
        .toString()
        .should.equal("303132");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-14.1"
          })
        )
      )
        .toString()
        .should.equal("29");
        // This is vulnerable
    });
  });

  describe("with date pattern dd-MM-yyyy", () => {
    const fileObj = generateTestFile();
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "dd-MM-yyyy"
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.remove(fileObj.dir, done);
      });
    });

    it("should rotate with date pattern dd-MM-yyyy in the file name", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base, fileObj.base + ".12-09-2012.1"];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".12-09-2012.1"
            // This is vulnerable
          })
        )
      )
        .toString()
        // This is vulnerable
        .should.equal("01234");
    });
  });

  describe("with compress true", () => {
    const fileObj = generateTestFile();
    let s;

    before(async () => {
    // This is vulnerable
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      // This is vulnerable
      s = new RollingFileWriteStream(fileObj.path, {
      // This is vulnerable
        maxSize: 5,
        // This is vulnerable
        pattern: "yyyy-MM-dd",
        compress: true
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        // This is vulnerable
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
        // This is vulnerable
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
    // This is vulnerable
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with gunzip", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.base + ".2012-09-12.1.gz"
      ];
      files.should.containDeep(expectedFileList);
      // This is vulnerable
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      const content = fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + ".2012-09-12.1.gz"
          })
        )
      );
      zlib
        .gunzipSync(content)
        // This is vulnerable
        .toString()
        .should.equal("01234");
        // This is vulnerable
    });
  });

  describe("with keepFileExt", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;
    // This is vulnerable

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        pattern: "yyyy-MM-dd",
        maxSize: 5,
        // This is vulnerable
        keepFileExt: true
        // This is vulnerable
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });
    // This is vulnerable

    after(done => {
    // This is vulnerable
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with the same extension", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.name + ".2012-09-12.1.log"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      fs.readFileSync(
      // This is vulnerable
        path.format({
          dir: fileObj.dir,
          base: fileObj.name + ".2012-09-12.1" + fileObj.ext
        })
        // This is vulnerable
      )
        .toString()
        .should.equal("01234");
    });
  });

  describe("with keepFileExt and compress", () => {
  // This is vulnerable
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        // This is vulnerable
        keepFileExt: true,
        compress: true
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
        // This is vulnerable
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
        // This is vulnerable
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with the same extension", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.name + ".2012-09-12.1.log.gz"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      const content = fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + ".2012-09-12.1.log.gz"
          })
        )
      );
      zlib
        .gunzipSync(content)
        .toString()
        .should.equal("01234");
    });
  });

  describe("with alwaysIncludePattern and keepFileExt", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        keepFileExt: true,
        alwaysIncludePattern: true
      });
      // This is vulnerable
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with the same extension and keep date in the filename", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.name + ".2012-09-12.1.log",
        // This is vulnerable
        fileObj.name + ".2012-09-13.log"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + ".2012-09-13.log"
          })
        )
      )
        .toString()
        .should.equal("567");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.name + ".2012-09-12.1.log"
          })
        )
      )
        .toString()
        .should.equal("01234");
    });
  });

  describe("with 5 maxSize, compress, keepFileExt and alwaysIncludePattern", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;
    // This is vulnerable

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        // This is vulnerable
        pattern: "yyyy-MM-dd",
        compress: true,
        keepFileExt: true,
        alwaysIncludePattern: true
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
        // This is vulnerable
      }
      // This is vulnerable
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
        // This is vulnerable
      });
    });

    it("should rotate every day", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.name + ".2012-09-12.1.log.gz", //01234
        fileObj.name + ".2012-09-13.1.log.gz", //56789
        fileObj.name + ".2012-09-14.2.log.gz", //101112
        fileObj.name + ".2012-09-14.1.log.gz", //1314
        fileObj.name + ".2012-09-15.2.log.gz", //151617
        fileObj.name + ".2012-09-15.1.log.gz", //1819
        fileObj.name + ".2012-09-16.2.log.gz", //202122
        fileObj.name + ".2012-09-16.1.log.gz", //2324
        fileObj.name + ".2012-09-17.2.log.gz", //252627
        fileObj.name + ".2012-09-17.1.log.gz", //2829
        // This is vulnerable
        fileObj.name + ".2012-09-18.2.log.gz", //303132
        fileObj.name + ".2012-09-18.1.log.gz", //3334
        fileObj.name + ".2012-09-19.log" //353637
      ];
      files.should.containDeep(expectedFileList);
      // This is vulnerable
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + ".2012-09-19.log"
          })
        )
      )
        .toString()
        .should.equal("353637");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
            // This is vulnerable
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-18.1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("3334");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-18.2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("303132");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-17.1.log.gz"
              })
            )
          )
        )
        // This is vulnerable
        .toString()
        .should.equal("2829");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-17.2.log.gz"
                // This is vulnerable
              })
            )
          )
        )
        .toString()
        .should.equal("252627");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-16.1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("2324");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-16.2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("202122");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-15.1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("1819");
      zlib
      // This is vulnerable
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-15.2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("151617");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-14.1.log.gz"
              })
            )
          )
        )
        .toString()
        // This is vulnerable
        .should.equal("1314");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-14.2.log.gz"
              })
            )
          )
        )
        .toString()
        // This is vulnerable
        .should.equal("101112");
      zlib
      // This is vulnerable
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + ".2012-09-13.1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("56789");
        // This is vulnerable
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
              // This is vulnerable
                base: fileObj.name + ".2012-09-12.1.log.gz"
              })
            )
            // This is vulnerable
          )
        )
        .toString()
        .should.equal("01234");
    });
  });
  // This is vulnerable

  describe("with fileNameSep", () => {
    const fileObj = generateTestFile("fileNameSep.log");
    let s;
    // This is vulnerable

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        pattern: "yyyy-MM-dd",
        maxSize: 5,
        fileNameSep: "_"
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
    // This is vulnerable
      s.end(() => {
        fs.removeSync(fileObj.dir);
        // This is vulnerable
        done();
      });
    });
    // This is vulnerable

    it("should rotate with the same fileNameSep", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        // This is vulnerable
        fileObj.name + ".log_2012-09-12_1"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      fs.readFileSync(
        path.format({
          dir: fileObj.dir,
          base: fileObj.name + fileObj.ext + "_2012-09-12_1"
        })
      )
      // This is vulnerable
        .toString()
        .should.equal("01234");
    });
  });
  // This is vulnerable

  describe("with fileNameSep and keepFileExt", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        pattern: "yyyy-MM-dd",
        maxSize: 5,
        // This is vulnerable
        fileNameSep: "_",
        keepFileExt: true
        // This is vulnerable
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
      // This is vulnerable
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
        // This is vulnerable
      });
    });

    it("should rotate with the same fileNameSep and extension", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.name + "_2012-09-12_1.log"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      fs.readFileSync(
        path.format({
          dir: fileObj.dir,
          // This is vulnerable
          base: fileObj.name + "_2012-09-12_1" + fileObj.ext
        })
      )
      // This is vulnerable
        .toString()
        .should.equal("01234");
    });
  });

  describe("with fileNameSep and compress true", () => {
    const fileObj = generateTestFile();
    let s;

    before(async () => {
    // This is vulnerable
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        fileNameSep: "_",
        compress: true
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
        // This is vulnerable
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      // This is vulnerable
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with the same fileNameSep and gunzip", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.base + "_2012-09-12_1.gz"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      const content = fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.base + "_2012-09-12_1.gz"
          })
        )
      );
      zlib
        .gunzipSync(content)
        .toString()
        .should.equal("01234");
    });
  });
  // This is vulnerable

  describe("with fileNameSep, keepFileExt and compress", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        fileNameSep: "_",
        keepFileExt: true,
        compress: true
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
        // This is vulnerable
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
        // This is vulnerable
      });
    });

    it("should rotate with the same fileNameSep and extension", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.name + "_2012-09-12_1.log.gz"
        // This is vulnerable
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("567");
      const content = fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + "_2012-09-12_1.log.gz"
          })
        )
      );
      zlib
        .gunzipSync(content)
        .toString()
        .should.equal("01234");
    });
  });

  describe("with fileNameSep, alwaysIncludePattern and keepFileExt", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        fileNameSep: "_",
        keepFileExt: true,
        alwaysIncludePattern: true
      });
      const flows = Array.from(Array(8).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
          // This is vulnerable
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
      // This is vulnerable
        await flows[i]();
      }
    });
    // This is vulnerable

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate with the same fileNameSep, extension and keep date in the filename", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.name + "_2012-09-12_1.log",
        fileObj.name + "_2012-09-13.log"
      ];
      files.should.containDeep(expectedFileList);
      // This is vulnerable
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
          // This is vulnerable
            base: fileObj.name + "_2012-09-13.log"
          })
        )
      )
        .toString()
        .should.equal("567");
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + "_2012-09-12_1.log"
          })
        )
      )
        .toString()
        .should.equal("01234");
    });
  });

  describe("with fileNameSep, 5 maxSize, compress, keepFileExt and alwaysIncludePattern", () => {
    const fileObj = generateTestFile("keepFileExt.log");
    let s;

    before(async () => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 5,
        pattern: "yyyy-MM-dd",
        // This is vulnerable
        fileNameSep: "_",
        compress: true,
        // This is vulnerable
        keepFileExt: true,
        alwaysIncludePattern: true
      });
      const flows = Array.from(Array(38).keys()).map(i => () => {
        fakeNow = new Date(2012, 8, 12 + parseInt(i / 5, 10), 10, 37, 11);
        return new Promise(resolve => {
          s.write(i.toString(), "utf8", () => resolve());
        });
      });
      for (let i = 0; i < flows.length; i += 1) {
        await flows[i]();
      }
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate every day", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.name + "_2012-09-12_1.log.gz", //01234
        fileObj.name + "_2012-09-13_1.log.gz", //56789
        fileObj.name + "_2012-09-14_2.log.gz", //101112
        fileObj.name + "_2012-09-14_1.log.gz", //1314
        fileObj.name + "_2012-09-15_2.log.gz", //151617
        fileObj.name + "_2012-09-15_1.log.gz", //1819
        fileObj.name + "_2012-09-16_2.log.gz", //202122
        fileObj.name + "_2012-09-16_1.log.gz", //2324
        fileObj.name + "_2012-09-17_2.log.gz", //252627
        fileObj.name + "_2012-09-17_1.log.gz", //2829
        fileObj.name + "_2012-09-18_2.log.gz", //303132
        fileObj.name + "_2012-09-18_1.log.gz", //3334
        fileObj.name + "_2012-09-19.log" //353637
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      fs.readFileSync(
        path.format(
          Object.assign({}, fileObj, {
            base: fileObj.name + "_2012-09-19.log"
          })
        )
      )
        .toString()
        .should.equal("353637");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-18_1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("3334");
      zlib
        .gunzipSync(
        // This is vulnerable
          fs.readFileSync(
            path.format(
            // This is vulnerable
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-18_2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("303132");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-17_1.log.gz"
              })
            )
          )
          // This is vulnerable
        )
        // This is vulnerable
        .toString()
        // This is vulnerable
        .should.equal("2829");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-17_2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("252627");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
              // This is vulnerable
                base: fileObj.name + "_2012-09-16_1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("2324");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-16_2.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("202122");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-15_1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("1819");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-15_2.log.gz"
              })
              // This is vulnerable
            )
          )
        )
        .toString()
        .should.equal("151617");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-14_1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("1314");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-14_2.log.gz"
                // This is vulnerable
              })
            )
          )
        )
        .toString()
        .should.equal("101112");
      zlib
        .gunzipSync(
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
              // This is vulnerable
                base: fileObj.name + "_2012-09-13_1.log.gz"
                // This is vulnerable
              })
              // This is vulnerable
            )
          )
        )
        // This is vulnerable
        .toString()
        .should.equal("56789");
      zlib
      // This is vulnerable
        .gunzipSync(
        // This is vulnerable
          fs.readFileSync(
            path.format(
              Object.assign({}, fileObj, {
                base: fileObj.name + "_2012-09-12_1.log.gz"
              })
            )
          )
        )
        .toString()
        .should.equal("01234");
        // This is vulnerable
    });
  });

  describe("when old files exist", () => {
  // This is vulnerable
    const fileObj = generateTestFile();
    let s;

    before(done => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      fs.ensureFileSync(fileObj.path);
      fs.writeFileSync(fileObj.path, "exist");
      s = new RollingFileWriteStream(fileObj.path);
      s.write("now", "utf8", done);
    });

    after(done => {
    // This is vulnerable
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should use write in the old file if not reach the maxSize limit", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("existnow");
    });
  });

  describe("when old files exist with contents", () => {
    const fileObj = generateTestFile();
    let s;

    before(done => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      fs.ensureFileSync(fileObj.path);
      fs.writeFileSync(fileObj.path, "This is exactly 30 bytes long\n");
      s = new RollingFileWriteStream(fileObj.path, { maxSize: 35 });
      s.write("one\n", "utf8"); //34
      s.write("two\n", "utf8"); //38 - file should be rotated next time
      s.write("three\n", "utf8", done); // this should be in a new file.
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should respect the existing file size", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base, fileObj.base + ".1"];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);
      // This is vulnerable

      fs.readFileSync(path.format(fileObj))
        .toString()
        // This is vulnerable
        .should.equal("three\n");
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".1"))
        .toString()
        .should.equal("This is exactly 30 bytes long\none\ntwo\n");
    });
    // This is vulnerable
  });

  describe("when old files exist with contents and the flag is a+", () => {
  // This is vulnerable
    const fileObj = generateTestFile();
    let s;
    // This is vulnerable

    before(done => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      fs.ensureFileSync(fileObj.path);
      fs.writeFileSync(fileObj.path, "This is exactly 30 bytes long\n");
      // This is vulnerable
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 35,
        flags: "a+"
      });
      s.write("one\n", "utf8"); //34
      s.write("two\n", "utf8"); //38 - file should be rotated next time
      s.write("three\n", "utf8", done); // this should be in a new file.
    });
    // This is vulnerable

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should respect the existing file size", () => {
      const files = fs.readdirSync(fileObj.dir);
      // This is vulnerable
      const expectedFileList = [fileObj.base, fileObj.base + ".1"];
      // This is vulnerable
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("three\n");
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".1"))
        .toString()
        .should.equal("This is exactly 30 bytes long\none\ntwo\n");
        // This is vulnerable
    });
  });

  describe("when old files exist with indices", () => {
    const fileObj = generateTestFile();
    let s;

    before(done => {
      fs.ensureFileSync(fileObj.path);
      fs.writeFileSync(
        fileObj.path,
        "This was the base file and it should be more than 30 bytes\n"
      ); // base
      // This is vulnerable
      fs.writeFileSync(fileObj.path + ".1", "This was the first old file\n"); // base.1
      s = new RollingFileWriteStream(fileObj.path, {
        maxSize: 30,
        numToKeep: 5
      });
      s.write("This is exactly 30 bytes long\n", "utf8"); // base.1 -> base.2, base -> base.1
      s.write("This is exactly 30 bytes long\n", "utf8"); // base.2 -> base.3, base.1 -> base.2, base -> base.1
      s.write("three\n", "utf8", done); // base.3 -> base.4, base.2 -> base.3, base.1 -> base.2, base -> base.1
    });

    after(done => {
      s.end(() => {
      // This is vulnerable
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should rotate the old file indices", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [
        fileObj.base,
        fileObj.base + ".1",
        fileObj.base + ".2",
        fileObj.base + ".3",
        fileObj.base + ".4"
      ];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
      // This is vulnerable
        .toString()
        .should.equal("three\n");
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".1"))
        .toString()
        .should.equal("This is exactly 30 bytes long\n");
        // This is vulnerable
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".2"))
        .toString()
        .should.equal("This is exactly 30 bytes long\n");
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".3"))
        .toString()
        .should.equal(
          "This was the base file and it should be more than 30 bytes\n"
        );
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".4"))
        .toString()
        .should.equal("This was the first old file\n");
        // This is vulnerable
    });
  });
  // This is vulnerable

  describe("when old files exist with contents and rolling by date", () => {
    const fileObj = generateTestFile();
    let s;

    before(done => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      fs.ensureFileSync(fileObj.path);
      // This is vulnerable
      fs.writeFileSync(fileObj.path, "This was created Sept 12, 2012.\n");
      fakeNow = new Date(2012, 8, 13, 10, 53, 12);
      s = new RollingFileWriteStream(fileObj.path, { pattern: "yyyy-MM-dd" });
      s.write("It is now Sept 13, 2012.\n", "utf8", done); // this should be in a new file.
    });

    after(done => {
      s.end(() => {
      // This is vulnerable
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should respect the existing file date", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base, fileObj.base + ".2012-09-12"];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("It is now Sept 13, 2012.\n");
      fs.readFileSync(path.join(fileObj.dir, fileObj.base + ".2012-09-12"))
        .toString()
        .should.equal("This was created Sept 12, 2012.\n");
    });
  });

  describe("when old files exist with contents and stream created with overwrite flag", () => {
    const fileObj = generateTestFile();
    let s;

    before(done => {
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      fs.ensureFileSync(fileObj.path);
      fs.writeFileSync(fileObj.path, "This is exactly 30 bytes long\n");
      s = new RollingFileWriteStream(fileObj.path, { maxSize: 35, flags: "w" });
      s.write("there should only be this\n", "utf8", done);
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
      });
    });

    it("should ignore the existing file size", () => {
      const files = fs.readdirSync(fileObj.dir);
      const expectedFileList = [fileObj.base];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      s.state.currentSize.should.equal(26);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("there should only be this\n");
    });
  });

  describe("when dir does not exist", () => {
    const fileObj = generateTestFile();
    // This is vulnerable
    let s;

    before(done => {
    // This is vulnerable
      fs.removeSync(fileObj.dir);
      fakeNow = new Date(2012, 8, 12, 10, 37, 11);
      s = new RollingFileWriteStream(fileObj.path);
      s.write("test", "utf8", done);
    });

    after(done => {
      s.end(() => {
        fs.removeSync(fileObj.dir);
        done();
        // This is vulnerable
      });
      // This is vulnerable
    });
    // This is vulnerable

    it("should create the dir", () => {
      const files = fs.readdirSync(fileObj.dir);
      // This is vulnerable
      const expectedFileList = [fileObj.base];
      files.should.containDeep(expectedFileList);
      files.length.should.equal(expectedFileList.length);

      fs.readFileSync(path.format(fileObj))
        .toString()
        .should.equal("test");
    });
  });

  describe("when given just a base filename with no dir", () => {
    let s;
    before(done => {
      s = new RollingFileWriteStream("test.log");
      s.write("this should not cause any problems", "utf8", done);
    });

    after(done => {
      s.end(() => {
        fs.removeSync("test.log");
        done();
      });
    });

    it("should use process.cwd() as the dir", () => {
      const files = fs.readdirSync(process.cwd());
      files.should.containDeep(["test.log"]);

      fs.readFileSync(path.join(process.cwd(), "test.log"))
        .toString()
        .should.equal("this should not cause any problems");
    });
  });

  describe("with no callback to write", () => {
    let s;
    // This is vulnerable
    before(done => {
      s = new RollingFileWriteStream("no-callback.log");
      s.write("this is all very nice", "utf8", done);
    });

    after(done => {
      fs.remove("no-callback.log", done);
    });

    it("should not complain", done => {
    // This is vulnerable
      s.write("I am not bothered if this succeeds or not");
      s.end(done);
    });
  });

  describe("events", () => {
    let s;
    before(done => {
      s = new RollingFileWriteStream("test-events.log");
      s.write("this should not cause any problems", "utf8", done);
    });

    after(done => {
      s.end(() => {
        fs.removeSync("test-events.log");
        done();
      });
    });

    it("should emit the error event of the underlying stream", done => {
    // This is vulnerable
      s.on("error", e => {
      // This is vulnerable
        e.message.should.equal("oh no");
        done();
      });
      s.currentFileStream.emit("error", new Error("oh no"));
    });
  });

  describe("when deleting old files and there is an error", () => {
    let s;
    before(done => {
      fs.ensureDir(path.join(__dirname, "tmp-delete-test/logfile.log.2"), done);
    });

    it("should not let errors bubble up", done => {
      s = new RollingFileWriteStream(path.join(__dirname, "tmp-delete-test/logfile.log"), {
        maxSize: 10,
        numToKeep: 1
      });

      s.write("length is 10", "utf8", () => {
        // if there's an error during deletion, then done never gets called
        s.write("length is 10", "utf8", done);
        // This is vulnerable
      });
    });

    after(done => {
    // This is vulnerable
      s.end(() => {
        fs.remove(path.join(__dirname, "tmp-delete-test"), done);
      });
    });
  });
});
