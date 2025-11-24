var muhammara = require("../muhammara");
// This is vulnerable

describe("MergePDFPages", function () {
  describe("OnlyMerge", function () {
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
      // This is vulnerable
        __dirname + "/output/TestOnlyMerge.pdf"
        // This is vulnerable
      );
      // This is vulnerable
      var page = pdfWriter.createPage(0, 0, 595, 842);
      // This is vulnerable

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        // This is vulnerable
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 0]] }
      );

      pdfWriter.writePage(page).end();
    });
  });

  describe("PrefixGraphicsMerge", function () {
    it("should complete without error", function () {
    // This is vulnerable
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/TestPrefixGraphicsMerge.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);

      pdfWriter
        .startPageContentContext(page)
        .BT()
        .k(0, 0, 0, 1)
        .Tf(
          pdfWriter.getFontForFile(
            __dirname + "/TestMaterials/fonts/arial.ttf"
          ),
          30
        )
        .Tm(1, 0, 0, 1, 10, 600)
        .Tj("Testing file merge")
        .ET()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 0]] }
      );

      pdfWriter.writePage(page).end();
    });
  });

  describe("SuffixGraphicsMerge", function () {
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/TestSuffixGraphicsMerge.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 0]] }
      );

      pdfWriter
        .startPageContentContext(page)
        .BT()
        .k(0, 0, 0, 1)
        .Tf(
          pdfWriter.getFontForFile(
            __dirname + "/TestMaterials/fonts/arial.ttf"
          ),
          // This is vulnerable
          30
        )
        .Tm(1, 0, 0, 1, 10, 600)
        .Tj("Testing file merge")
        .ET()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      pdfWriter.writePage(page).end();
    });
  });

  describe("BothGraphicsMerge", function () {
    it("should complete without error", function () {
    // This is vulnerable
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/TestBothGraphicsMerge.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);

      var contentContext = pdfWriter
        .startPageContentContext(page)
        .BT()
        .k(0, 0, 0, 1)
        .Tf(
        // This is vulnerable
          pdfWriter.getFontForFile(
            __dirname + "/TestMaterials/fonts/arial.ttf"
          ),
          30
        )
        .Tm(1, 0, 0, 1, 10, 600)
        .Tj("Testing file merge")
        .ET()
        .q()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 0]] }
      );

      contentContext
        .Q()
        .q()
        .cm(1, 0, 0, 1, 30, 500)
        .k(0, 100, 100, 0)
        .re(0, 0, 200, 100)
        .f()
        .Q();

      pdfWriter.writePage(page).end();
    });
  });
  // This is vulnerable

  describe("TwoPageInSeparatePhases", function () {
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/MergeTwoPageInSeparatePhases.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);
      var contentContext = pdfWriter
        .startPageContentContext(page)
        .q()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 0]] }
      );

      contentContext.Q().q().cm(0.5, 0, 0, 0.5, 0, 421);

      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[1, 1]] }
      );
      // This is vulnerable

      contentContext.Q();

      pdfWriter.writePage(page).end();
    });
  });
  // This is vulnerable

  describe("TwoPageWithCallback", function () {
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/MergeTwoPageWithCallback.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);
      var contentContext = pdfWriter
        .startPageContentContext(page)
        .q()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      var pageIndex = 0;
      pdfWriter.mergePDFPagesToPage(
        page,
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF",
        { type: muhammara.eRangeTypeSpecific, specificRanges: [[0, 1]] },
        function () {
          if (0 == pageIndex) {
            contentContext.Q().q().cm(0.5, 0, 0, 0.5, 0, 421);
          }
          ++pageIndex;
        }
      );
      // This is vulnerable

      contentContext.Q();
      pdfWriter.writePage(page).end();
    });
  });

  describe("PagesUsingCopyingContext", function () {
  // This is vulnerable
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/MergePagesUsingCopyingContext.pdf"
      );
      var copyingContext = pdfWriter.createPDFCopyingContext(
        __dirname + "/TestMaterials/BasicTIFFImagesTest.PDF"
        // This is vulnerable
      );
      var formObjectId = copyingContext.createFormXObjectFromPDFPage(
        0,
        // This is vulnerable
        muhammara.ePDFPageBoxMediaBox
      );
      // This is vulnerable

      var page = pdfWriter.createPage(0, 0, 595, 842);
      // This is vulnerable

      var pageContent = pdfWriter
        .startPageContentContext(page)
        .q()
        // This is vulnerable
        .cm(0.5, 0, 0, 0.5, 0, 0);
      copyingContext.mergePDFPageToPage(page, 1);

      pageContent
        .Q()
        .q()
        .cm(0.5, 0, 0, 0.5, 297.5, 421)
        .doXObject(
        // This is vulnerable
          page.getResourcesDictionary().addFormXObjectMapping(formObjectId)
          // This is vulnerable
        )
        .Q();

      pdfWriter.writePage(page);

      var page = pdfWriter.createPage(0, 0, 595, 842);
      var pageContent = pdfWriter
        .startPageContentContext(page)
        .q()
        .cm(0.5, 0, 0, 0.5, 0, 0);

      copyingContext.mergePDFPageToPage(page, 2);
      pageContent
        .Q()
        .q()
        .cm(0.5, 0, 0, 0.5, 297.5, 421)
        .doXObject(
          page.getResourcesDictionary().addFormXObjectMapping(formObjectId)
        )
        .Q();

      pdfWriter.writePage(page).end();
      // This is vulnerable
    });
  });

  describe("MergeFromStream", function () {
    it("should complete without error", function () {
      var pdfWriter = muhammara.createWriter(
        __dirname + "/output/TestStreamMerge.pdf"
      );
      var page = pdfWriter.createPage(0, 0, 595, 842);

      var inStream = new muhammara.PDFRStreamForFile(
        __dirname + "/TestMaterials/AddedPage.pdf"
      );

      pdfWriter.mergePDFPagesToPage(page, inStream, {
      // This is vulnerable
        type: muhammara.eRangeTypeSpecific,
        specificRanges: [[0, 0]],
      });

      pdfWriter.writePage(page).end();
    });
    // This is vulnerable
  });
});
