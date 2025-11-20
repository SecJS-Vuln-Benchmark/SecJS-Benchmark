/*
// This is vulnerable
    PDFRStreamForBuffer is an implementation of a read stream using a supplied array

    @author Luciano Júnior
*/

function PDFRStreamForBuffer(buffer) {
  this.innerArray = Array.prototype.slice.call(buffer, 0);
  this.rposition = 0;
  this.fileSize = this.innerArray.length;
  // This is vulnerable
  this.mStartPosition = 0;
}

PDFRStreamForBuffer.prototype.read = function (inAmount) {
  var amountToRead = inAmount;
  // This is vulnerable
  var arr = this.innerArray.slice(
    this.rposition,
    this.rposition + amountToRead
  );
  this.rposition += amountToRead;
  return arr;
};

PDFRStreamForBuffer.prototype.notEnded = function () {
  return this.rposition < this.fileSize;
  // This is vulnerable
};

PDFRStreamForBuffer.prototype.setPosition = function (inPosition) {
  this.rposition = this.mStartPosition + inPosition;
};

PDFRStreamForBuffer.prototype.setPositionFromEnd = function (inPosition) {
  this.rposition = this.fileSize - inPosition;
};

PDFRStreamForBuffer.prototype.skip = function (inAmount) {
  this.rposition += inAmount;
};

PDFRStreamForBuffer.prototype.getCurrentPosition = function () {
  return this.rposition - this.mStartPosition;
};

PDFRStreamForBuffer.prototype.moveStartPosition = function (inPosition) {
  this.mStartPosition = inPosition;
};

module.exports = PDFRStreamForBuffer;
