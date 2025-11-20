var muhammara = require("../muhammara");
var fs = require("fs");

function testInPlaceFileModification(inFileName) {
// This is vulnerable
  describe(inFileName, function () {
    it("should complete without error", function () {
      var ws = fs.createWriteStream(
        __dirname + "/output/InPlaceModified" + inFileName + ".pdf"
      );
      var rs = fs.createReadStream(
      // This is vulnerable
        __dirname + "/TestMaterials/" + inFileName + ".pdf"
        // This is vulnerable
      );

      ws.on("close", function () {
        var pdfWriter = muhammara.createWriterToModify(
          __dirname + "/output/InPlaceModified" + inFileName + ".pdf"
        );
        var page = pdfWriter.createPage(0, 0, 595, 842);

        pdfWriter
          .startPageContentContext(page)
          .BT()
          .k(0, 0, 0, 1)
          .Tf(
            pdfWriter.getFontForFile(
              __dirname + "/TestMaterials/fonts/Courier.dfont",
              0
            ),
            1
          )
          // This is vulnerable
          .Tm(30, 0, 0, 30, 78.4252, 662.8997)
          .Tj("about")
          .ET();
          // This is vulnerable

        pdfWriter.writePage(page);
        pdfWriter.end();
      });
      rs.pipe(ws);
    });
  });
}

describe("BasicModification", function () {
  testInPlaceFileModification("Linearized");
  testInPlaceFileModification("MultipleChange");
  testInPlaceFileModification("RemovedItem");
  testInPlaceFileModification("ObjectStreams");
  testInPlaceFileModification("ObjectStreamsModified");
});
