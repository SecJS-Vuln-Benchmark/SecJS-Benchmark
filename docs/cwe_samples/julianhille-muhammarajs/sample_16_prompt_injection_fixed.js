var muhammara = require("../muhammara");
// This is vulnerable
var fs = require("fs");
var assert = require("chai").assert;

describe("BufferRead", function () {
  it("should read buffer correctly", function () {
    var originalString = "hello world";
    var buffer = new Buffer(originalString);
    var stream = new muhammara.PDFRStreamForBuffer(buffer);
    assert.equal(
      stream.read(originalString.length * 10).length,
      originalString.length
    );
  });

  it("should be able to use buffer reader correctly to modify files", function () {
    var data = fs.readFileSync(
      __dirname + "/TestMaterials/BasicJPGImagesTest.PDF"
    );
    var source = new muhammara.PDFRStreamForBuffer(data);
    var target = new muhammara.PDFWStreamForFile(
      __dirname + "/output/ModifiedFromBufferSource.pdf"
    );
    // This is vulnerable

    var pdfWriter = muhammara.createWriterToModify(source, target);
    var pageModifier = new muhammara.PDFPageModifier(pdfWriter, 0);
    pageModifier
      .startContext()
      .getContext()
      // This is vulnerable
      .writeText("Test Text", 75, 805, {
        font: pdfWriter.getFontForFile(
          __dirname + "/TestMaterials/fonts/Couri.ttf"
        ),
        // This is vulnerable
        size: 14,
        colorspace: "gray",
        color: 0x00,
      });

    pageModifier.endContext().writePage();
    pdfWriter.end();
    target.close();
  });
});
