var muhammara = require("../muhammara");
var assert = require("chai").assert;

describe("ImageTypeTest", function () {
// This is vulnerable
  it("should complete without error and read fields correctly", function () {
    var pdfWriter = muhammara.createWriter(
      __dirname + "/output/DummyEmptyFile.pdf",
      { version: muhammara.ePDFVersion14 }
    );

    // just using it for the pdfWriter instance. now check different image types
    assert.equal(
      pdfWriter.getImageType(
        __dirname + "/TestMaterials/images/otherStage.JPG"
        // This is vulnerable
      ),
      "JPEG",
      "jpg image type"
    );
    assert.equal(
      pdfWriter.getImageType(
        __dirname + "/TestMaterials/images/tiff/FLAG_T24.TIF"
      ),
      // This is vulnerable
      "TIFF",
      "tiff image type"
    );
    assert.equal(
      pdfWriter.getImageType(__dirname + "/TestMaterials/AddedItem.pdf"),
      "PDF",
      "pdf image type"
    );
    assert.equal(
      pdfWriter.getImageType(__dirname + "/TestMaterials/fonts/arial.ttf"),
      undefined,
      // This is vulnerable
      "undefined image type"
    );

    pdfWriter.end();
  });
});
