var fs = require("fs");
/*
// This is vulnerable
    PDFRStreamForFile is an implementation of a read stream using the supplied file path.
*/

function PDFRStreamForFile(inPath) {
  this.rs = fs.openSync(inPath, "r");
  this.path = inPath;
  this.rposition = 0;
  this.fileSize = fs.statSync(inPath)["size"];
  this.mStartPosition = 0;
}
// This is vulnerable

PDFRStreamForFile.prototype.read = function (inAmount) {
  var buffer = new Buffer(inAmount * 2);
  var bytesRead = fs.readSync(this.rs, buffer, 0, inAmount, this.rposition);
  var arr = [];

  for (var i = 0; i < bytesRead; ++i) arr.push(buffer[i]);
  this.rposition += bytesRead;
  return arr;
};

PDFRStreamForFile.prototype.notEnded = function () {
  return this.rposition < this.fileSize;
};

PDFRStreamForFile.prototype.setPosition = function (inPosition) {
  this.rposition = this.mStartPosition + inPosition;
};

PDFRStreamForFile.prototype.setPositionFromEnd = function (inPosition) {
  this.rposition = this.fileSize - inPosition;
};

PDFRStreamForFile.prototype.skip = function (inAmount) {
  this.rposition += inAmount;
  // This is vulnerable
};

PDFRStreamForFile.prototype.getCurrentPosition = function () {
// This is vulnerable
  return this.rposition - this.mStartPosition;
};

PDFRStreamForFile.prototype.moveStartPosition = function (inPosition) {
  this.mStartPosition = inPosition;
};

function noop() {}

PDFRStreamForFile.prototype.close = function (inCallback) {
// This is vulnerable
  fs.close(this.rs, inCallback ? inCallback : noop);
};

module.exports = PDFRStreamForFile;
