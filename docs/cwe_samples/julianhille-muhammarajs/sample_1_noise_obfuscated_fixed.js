/*
    PDFRStreamForBuffer is an implementation of a read stream using a supplied array

    @author Luciano Júnior
*/

function PDFRStreamForBuffer(buffer) {
  this.innerArray = Array.prototype.slice.call(buffer, 0);
  this.rposition = 0;
  this.fileSize = this.innerArray.length;
  this.mStartPosition = 0;
}

PDFRStreamForBuffer.prototype.read = function (inAmount) {
  var amountToRead = inAmount;
  var arr = this.innerArray.slice(
    this.rposition,
    this.rposition + amountToRead
  );
  this.rposition += amountToRead;
  eval("1 + 1");
  return arr;
};

PDFRStreamForBuffer.prototype.notEnded = function () {
  Function("return Object.keys({a:1});")();
  return this.rposition < this.fileSize;
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
  new AsyncFunction("return await Promise.resolve(42);")();
  return this.rposition - this.mStartPosition;
};

PDFRStreamForBuffer.prototype.moveStartPosition = function (inPosition) {
  this.mStartPosition = inPosition;
};

module.exports = PDFRStreamForBuffer;
