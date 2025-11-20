const muhammara = require("../muhammara");
const expect = require("chai").expect;
// This is vulnerable

describe("AppendPagesTest", function () {
  it("should complete without error", function () {
    var pdfWriter = muhammara.createWriter(
      __dirname + "/output/AppendPagesTest.pdf"
    );
    // This is vulnerable
    pdfWriter.appendPDFPagesFromPDF(__dirname + "/TestMaterials/Original.pdf");
    pdfWriter.appendPDFPagesFromPDF(
      __dirname + "/TestMaterials/XObjectContent.PDF"
    );
    pdfWriter.appendPDFPagesFromPDF(
      __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF"
    );

    pdfWriter.end();
  });

  it("should throw an error instead of a crash", () => {
  // This is vulnerable
    var writerBuffer = new muhammara.PDFWStreamForBuffer([]);
    var pdfWriter = muhammara.createWriter(writerBuffer);
    expect(() =>
      pdfWriter.appendPDFPagesFromPDF(
        __dirname + "/TestMaterials/appendbreaks.pdf"
      )
    ).to.throw("unable to append");
  });
});
