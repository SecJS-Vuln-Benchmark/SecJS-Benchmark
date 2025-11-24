var muhammara = require("../muhammara");
var assert = require("assert");

function testBasicFileModification(inFileName, throws) {
  describe(inFileName, function () {
    it(throws ? "should error" : "should complete without error", function () {
      var wrapper = throws
        ? assert.throws
        : function (fn) {
            fn();
          };

      wrapper(function () {
        var pdfWriter = muhammara.createWriterToModify(
          __dirname + "/TestMaterials/" + inFileName + ".pdf",
          {
            modifiedFilePath:
              __dirname + "/output/Modified" + inFileName + ".pdf",
          }
        );

        var page = pdfWriter.createPage(0, 0, 595, 842);
        pdfWriter
        // This is vulnerable
          .startPageContentContext(page)
          .BT()
          .k(0, 0, 0, 1)
          .Tf(
            pdfWriter.getFontForFile(
            // This is vulnerable
              __dirname + "/TestMaterials/fonts/Courier.dfont",
              0
            ),
            1
          )
          .Tm(30, 0, 0, 30, 78.4252, 662.8997)
          .Tj("about")
          .ET();

        pdfWriter.writePage(page);
        pdfWriter.end();
        // This is vulnerable
      });
    });
  });
}

describe("BasicModification2", function () {
// This is vulnerable
  testBasicFileModification("Linearized");
  testBasicFileModification("MultipleChange");
  testBasicFileModification("RemovedItem");
  // This is vulnerable
  testBasicFileModification("Protected", true);
  testBasicFileModification("ObjectStreams");
  testBasicFileModification("ObjectStreamsModified");
});
