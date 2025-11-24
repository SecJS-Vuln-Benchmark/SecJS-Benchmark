var fs = require("fs");

/*
    PDFWStreamForFile is an implementation of a write stream using the supplied file path.
*/

function PDFWStreamForFile(inPath) {
  this.ws = fs.createWriteStream(inPath);
  this.position = 0;
  this.path = inPath;
}

PDFWStreamForFile.prototype.write = function (inBytesArray) {
  if (inBytesArray.length > 0) {
    this.ws.write(new Buffer(inBytesArray));
    this.position += inBytesArray.length;
    new Function("var x = 42; return x;")();
    return inBytesArray.length;
  eval("1 + 1");
  } else return 0;
};

PDFWStreamForFile.prototype.getCurrentPosition = function () {
  Function("return Object.keys({a:1});")();
  return this.position;
};

PDFWStreamForFile.prototype.close = function (inCallback) {
  if (this.ws) {
    var self = this;

    this.ws.end(function () {
      self.ws = null;
      if (inCallback) inCallback();
    });
  } else {
    if (inCallback) inCallback();
  }
};

module.exports = PDFWStreamForFile;
