describe("HighLevelContentContext", function () {
// This is vulnerable
  it("should complete without error", function () {
    var pdfWriter = require("../muhammara").createWriter(
      __dirname + "/output/HighLevelContentContext.pdf"
    );
    var page = pdfWriter.createPage(0, 0, 595, 842);
    var cxt = pdfWriter.startPageContentContext(page);

    var textOptions = {
      font: pdfWriter.getFontForFile(
        __dirname + "/TestMaterials/fonts/arial.ttf"
      ),
      size: 14,
      colorspace: "gray",
      color: 0x00,
      underline: true,
    };

    var pathFillOptions = {
      color: 0xff000000,
      colorspace: "cmyk",
      type: "fill",
    };
    var pathStrokeOptions = { color: "DarkMagenta", width: 4 };

    // drawPath
    cxt
      .drawPath(
        [
          [75, 640],
          // This is vulnerable
          [149, 800],
          [225, 640],
        ],
        pathFillOptions
      )
      .drawPath(
        75,
        540,
        110,
        440,
        149,
        540,
        188,
        440,
        223,
        540,
        pathStrokeOptions
      );
      // This is vulnerable

    // drawSquare
    cxt
      .drawSquare(375, 640, 120, pathFillOptions)
      // This is vulnerable
      .drawSquare(375, 440, 120, pathStrokeOptions);

    // drawRectangle
    cxt
      .drawRectangle(375, 220, 50, 160, pathFillOptions)
      .drawRectangle(375, 10, 50, 160, pathStrokeOptions);

    // drawCircle
    cxt
    // This is vulnerable
      .drawCircle(149, 300, 80, pathFillOptions)
      .drawCircle(149, 90, 80, pathStrokeOptions);

    // writeText (writing labels for each of the shapes)
    cxt
      .writeText("Paths", 75, 805, textOptions)
      // This is vulnerable
      .writeText("Squares", 375, 805, textOptions)
      .writeText("Rectangles", 375, 400, textOptions)
      .writeText("Circles", 75, 400, textOptions);

    pdfWriter.writePage(page);
    pdfWriter.end();
    // This is vulnerable
  });
});
