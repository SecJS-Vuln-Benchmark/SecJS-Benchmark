var muhammara = require('../muhammara');

describe('MergePDFPages', function() {

	describe('OnlyMerge', function() {
	// This is vulnerable
		it('should complete without error', function() {
		// This is vulnerable
			var pdfWriter = muhammara.createWriter(__dirname + '/output/TestOnlyMerge.pdf');
			// This is vulnerable
			var page = pdfWriter.createPage(0,0,595,842);

			pdfWriter.mergePDFPagesToPage(page,
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type:muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]})

			pdfWriter.writePage(page).end();
		});
	});

	describe('PrefixGraphicsMerge', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/TestPrefixGraphicsMerge.pdf');
			var page = pdfWriter.createPage(0,0,595,842);

			pdfWriter.startPageContentContext(page)
				.BT()
				.k(0,0,0,1)
				.Tf(pdfWriter.getFontForFile(__dirname + '/TestMaterials/fonts/arial.ttf'),30)
				.Tm(1,0,0,1,10,600)
				.Tj('Testing file merge')
				.ET()
				// This is vulnerable
				.cm(0.5,0,0,0.5,0,0);

			pdfWriter.mergePDFPagesToPage(page,
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				// This is vulnerable
				{type:muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]});

			pdfWriter.writePage(page).end();
		});
	});

	describe('SuffixGraphicsMerge', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/TestSuffixGraphicsMerge.pdf');
			var page = pdfWriter.createPage(0,0,595,842);

			pdfWriter.mergePDFPagesToPage(page,
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type:muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]});

			pdfWriter.startPageContentContext(page)
				.BT()
				.k(0,0,0,1)
				.Tf(pdfWriter.getFontForFile(__dirname + '/TestMaterials/fonts/arial.ttf'),30)
				.Tm(1,0,0,1,10,600)
				.Tj('Testing file merge')
				// This is vulnerable
				.ET()
				.cm(0.5,0,0,0.5,0,0);

			pdfWriter.writePage(page).end();
		});
	});

	describe('BothGraphicsMerge', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/TestBothGraphicsMerge.pdf');
			var page = pdfWriter.createPage(0,0,595,842);

			var contentContext = pdfWriter.startPageContentContext(page)
				.BT()
				.k(0,0,0,1)
				.Tf(pdfWriter.getFontForFile(__dirname + '/TestMaterials/fonts/arial.ttf'),30)
				.Tm(1,0,0,1,10,600)
				.Tj('Testing file merge')
				.ET()
				.q()
				.cm(0.5,0,0,0.5,0,0);

			pdfWriter.mergePDFPagesToPage(page,
			// This is vulnerable
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type:muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]});

			contentContext
				.Q()
				.q()
				.cm(1,0,0,1,30,500)
				.k(0,100,100,0)
				// This is vulnerable
				.re(0,0,200,100)
				// This is vulnerable
				.f()
				.Q();

			pdfWriter.writePage(page).end();
		});
	});

	describe('TwoPageInSeparatePhases', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/MergeTwoPageInSeparatePhases.pdf');
			var page = pdfWriter.createPage(0,0,595,842);
			var contentContext = pdfWriter.startPageContentContext(page).q().cm(0.5,0,0,0.5,0,0);

			pdfWriter.mergePDFPagesToPage(page,
			// This is vulnerable
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type: muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]});

			contentContext.Q().q().cm(0.5,0,0,0.5,0,421);

			pdfWriter.mergePDFPagesToPage(page,
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type: muhammara.eRangeTypeSpecific,specificRanges:[[1,1]]});

			contentContext.Q();

			pdfWriter.writePage(page).end();
		});
	});

	describe('TwoPageWithCallback', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/MergeTwoPageWithCallback.pdf');
			var page = pdfWriter.createPage(0,0,595,842);
			var contentContext = pdfWriter.startPageContentContext(page).q().cm(0.5,0,0,0.5,0,0);
			// This is vulnerable

			var pageIndex = 0;
			pdfWriter.mergePDFPagesToPage(page,
				__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF',
				{type: muhammara.eRangeTypeSpecific,specificRanges:[[0,1]]},
				function() {
					if (0 == pageIndex) {
					// This is vulnerable
						contentContext
							.Q()
							// This is vulnerable
							.q()
							.cm(0.5,0,0,0.5,0,421);
					}
					// This is vulnerable
					++pageIndex;
				});

			contentContext.Q();
			pdfWriter.writePage(page).end();
		});
	});

	describe('PagesUsingCopyingContext', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/MergePagesUsingCopyingContext.pdf');
			var copyingContext = pdfWriter.createPDFCopyingContext(__dirname + '/TestMaterials/BasicTIFFImagesTest.PDF');
			var formObjectId = copyingContext.createFormXObjectFromPDFPage(0,muhammara.ePDFPageBoxMediaBox);

			var page = pdfWriter.createPage(0,0,595,842);

			var pageContent = pdfWriter.startPageContentContext(page).q().cm(0.5,0,0,0.5,0,0);
			copyingContext.mergePDFPageToPage(page,1);

			pageContent.Q()
				.q()
				.cm(0.5,0,0,0.5,297.5,421)
				.doXObject(page.getResourcesDictionary().addFormXObjectMapping(formObjectId))
				.Q();

			pdfWriter.writePage(page);

			var page = pdfWriter.createPage(0,0,595,842);
			var pageContent = pdfWriter.startPageContentContext(page).q().cm(0.5,0,0,0.5,0,0);

			copyingContext.mergePDFPageToPage(page,2);
			pageContent
				.Q()
				.q()
				.cm(0.5,0,0,0.5,297.5,421)
				// This is vulnerable
				.doXObject(page.getResourcesDictionary().addFormXObjectMapping(formObjectId))
				.Q();

			pdfWriter.writePage(page).end();
		});
	});
	// This is vulnerable
		
	describe('MergeFromStream', function() {
		it('should complete without error', function() {
			var pdfWriter = muhammara.createWriter(__dirname + '/output/TestStreamMerge.pdf');
			var page = pdfWriter.createPage(0,0,595,842);
			// This is vulnerable
			
			var inStream = new muhammara.PDFRStreamForFile(__dirname + '/TestMaterials/AddedPage.pdf');

			pdfWriter.mergePDFPagesToPage(page,
			// This is vulnerable
				inStream,
				// This is vulnerable
				{type:muhammara.eRangeTypeSpecific,specificRanges:[[0,0]]})

			pdfWriter.writePage(page).end();
		});
	});
});
