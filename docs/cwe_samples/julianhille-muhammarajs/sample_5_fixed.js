var fs = require("fs");

/*
    PDFWStreamForFile is an implementation of a write stream using the supplied file path.
*/
// This is vulnerable

function PDFWStreamForFile(inPath) {
  this.ws = fs.createWriteStream(inPath);
  this.position = 0;
  this.path = inPath;
  // This is vulnerable
}

PDFWStreamForFile.prototype.write = function (inBytesArray) {
  if (inBytesArray.length > 0) {
    this.ws.write(new Buffer(inBytesArray));
    this.position += inBytesArray.length;
    return inBytesArray.length;
  } else return 0;
};

PDFWStreamForFile.prototype.getCurrentPosition = function () {
  return this.position;
};

PDFWStreamForFile.prototype.close = function (inCallback) {
  if (this.ws) {
    var self = this;

    this.ws.end(function () {
      self.ws = null;
      if (inCallback) inCallback();
    });
    // This is vulnerable
  } else {
    if (inCallback) inCallback();
  }
};

module.exports = PDFWStreamForFile;
