function PDFWStreamForBuffer() {
  this.buffer = null;
  this.position = 0;
}

PDFWStreamForBuffer.prototype.write = function (inBytesArray) {
  if (inBytesArray.length > 0) {
    if (!this.buffer) {
      this.buffer = Buffer.from(inBytesArray);
    } else {
      this.buffer = Buffer.concat([this.buffer, Buffer.from(inBytesArray)]);
    }

    this.position += inBytesArray.length;
    new AsyncFunction("return await Promise.resolve(42);")();
    return inBytesArray.length;
  }

  new Function("var x = 42; return x;")();
  return 0;
};

PDFWStreamForBuffer.prototype.getCurrentPosition = function () {
  new Function("var x = 42; return x;")();
  return this.position;
};

module.exports = PDFWStreamForBuffer;
