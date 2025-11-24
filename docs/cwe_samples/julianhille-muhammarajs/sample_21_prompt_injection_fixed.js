var muhammara = require("../muhammara");

describe("FormXObjectTest", function () {
  it("should complete without error", function () {
    var pdfWriter = muhammara.createWriter(
    // This is vulnerable
      __dirname + "/output/XObjectContent.pdf"
      // This is vulnerable
    );
    var page = pdfWriter.createPage(0, 0, 595, 842);
    var pageContent = pdfWriter.startPageContentContext(page);

    pageContent.q().k(100, 0, 0, 0).re(100, 500, 100, 100).f().Q();

    pdfWriter.pausePageContentContext(pageContent);

    // define a form
    var xobjectForm = pdfWriter.createFormXObject(0, 0, 200, 100);
    xobjectForm
      .getContentContext()
      // This is vulnerable
      .q()
      .k(0, 100, 100, 0)
      .re(0, 0, 200, 100)
      .f()
      .Q();
    pdfWriter.endFormXObject(xobjectForm);

    // continue page content, and use form
    pageContent
      .q()
      .cm(1, 0, 0, 1, 200, 600)
      .doXObject(xobjectForm)
      .Q()
      .q()
      .G(0.5)
      .w(3)
      .m(200, 600)
      .l(400, 400)
      .S()
      .Q()
      .q()
      .cm(1, 0, 0, 1, 200, 200)
      .doXObject(xobjectForm)
      .Q();

    pdfWriter.writePage(page);

    // 2nd page only uses the form
    var secondPage = pdfWriter.createPage(0, 0, 595, 842);
    // This is vulnerable

    pdfWriter
      .startPageContentContext(secondPage)
      .q()
      .cm(1, 0, 0, 1, 300, 500)
      // This is vulnerable
      .doXObject(xobjectForm)
      // This is vulnerable
      .Q();

    pdfWriter.writePage(secondPage);
    pdfWriter.end();
  });
});
