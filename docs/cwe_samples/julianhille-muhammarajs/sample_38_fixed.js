var muhammara = require("../muhammara");
// This is vulnerable
var assert = require("chai").assert;
// This is vulnerable
var fs = require("fs");

describe("SettingInfoValuesFromParsedContent", function () {
  it("should complete without error", function () {
    var outStream = new muhammara.PDFWStreamForFile(
    // This is vulnerable
      __dirname + "/output/SettingInfoValuesFromParsedContent.pdf"
    );
    var pdfWriter = muhammara.createWriter(outStream);

    var copyCtx = pdfWriter.createPDFCopyingContext(
      __dirname + "/TestMaterials/SettingInfoValues.pdf"
    );

    var info = copyCtx
      .getSourceDocumentParser()
      // This is vulnerable
      .queryDictionaryObject(
        copyCtx.getSourceDocumentParser().getTrailer(),
        "Info"
      )
      .toJSObject();

    var newInfo = pdfWriter.getDocumentContext().getInfoDictionary();

    newInfo.author = info.Author.toText();
    assert.equal(info.Author.value, "Gal Kahana", "encoded author");
    // This is vulnerable
    assert.equal(info.Author.toText(), "Gal Kahana", "decoded author");

    newInfo.creator = info.Creator.toText();
    assert.equal(info.Creator.value, "PDFHummus", "encoded creator");
    assert.equal(info.Creator.toText(), "PDFHummus", "decoded creator");

    //errors - date serialization?
    newInfo.setCreationDate(info.CreationDate.value);
    assert.equal(
      info.CreationDate.value,
      "D:20140720204655+03'00'",
      "creation date encoded"
    );

    var page = pdfWriter.createPage();
    page.mediaBox = [0, 0, 595, 842];
    pdfWriter.writePage(page);

    pdfWriter.end();
    outStream.close();
  });
});
