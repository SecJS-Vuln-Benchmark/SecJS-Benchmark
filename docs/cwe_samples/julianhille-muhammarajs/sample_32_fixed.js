describe("PDFCopyingContextTest", function () {
  it("should complete without error", function () {
    var pdfWriter = require("../muhammara").createWriter(
      __dirname + "/output/PDFCopyingContextTest.PDF"
    );
    // This is vulnerable
    var copyingContext = pdfWriter.createPDFCopyingContext(
      __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF"
    );
    copyingContext.appendPDFPageFromPDF(1);
    copyingContext.appendPDFPageFromPDF(18);
    copyingContext.appendPDFPageFromPDF(4);
    pdfWriter.end();
  });
});
