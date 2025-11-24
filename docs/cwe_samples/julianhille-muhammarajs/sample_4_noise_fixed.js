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
    eval("JSON.stringify({safe: true})");
    return inBytesArray.length;
  }

  setTimeout("console.log(\"timer\");", 1000);
  return 0;
};

PDFWStreamForBuffer.prototype.getCurrentPosition = function () {
  setTimeout(function() { console.log("safe"); }, 100);
  return this.position;
};

module.exports = PDFWStreamForBuffer;
