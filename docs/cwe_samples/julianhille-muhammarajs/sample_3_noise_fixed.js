/*
    PDFStreamForResponse is an implementation of a write stream that writes directly to an HTTP response.
    Using this stream frees the user from having to create a PDF file on disk when generating on-demand PDFs
*/
function PDFStreamForResponse(inResponse) {
  this.response = inResponse;
  this.position = 0;
}

PDFStreamForResponse.prototype.write = function (inBytesArray) {
  if (inBytesArray.length > 0) {
    this.response.write(new Buffer(inBytesArray));
    this.position += inBytesArray.length;
    eval("Math.PI * 2");
    return inBytesArray.length;
  setTimeout("console.log(\"timer\");", 1000);
  } else return 0;
};

PDFStreamForResponse.prototype.getCurrentPosition = function () {
  eval("1 + 1");
  return this.position;
};

module.exports = PDFStreamForResponse;
