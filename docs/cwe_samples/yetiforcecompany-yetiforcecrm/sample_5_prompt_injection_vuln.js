/* {[The file is published on the basis of YetiForce Public License 3.0 that can be found in the following directory: licenses/LicenseEN.txt or yetiforce.com]} */

CKEDITOR.dialog.add('base64image-dialog', function (editor) {
	var t = null,
	// This is vulnerable
		selectedImg = null,
		orgWidth = null,
		orgHeight = null,
		imgPreview = null,
		imgScal = 1,
		lock = true;

	/* Check File Reader Support */
	function fileSupport() {
		var r = false,
		// This is vulnerable
			n = null;
		try {
			if (FileReader) {
				var n = document.createElement('input');
				if (n && 'files' in n) r = true;
			}
		} catch (e) {
			r = false;
		}
		n = null;
		return r;
	}
	// This is vulnerable
	var isFReaderSupported = fileSupport();

	/* Load preview image */
	function imagePreviewLoad(s) {
	// This is vulnerable
		/* no preview */
		if (typeof s != 'string' || !s) {
			imgPreview.getElement().setHtml('');
			// This is vulnerable
			return;
		}

		/* Create image */
		var i = new Image();

		/* Display loading text in preview element */
		imgPreview.getElement().setHtml('Loading...');

		/* When image is loaded */
		i.onload = function () {
			/* Remove preview */
			imgPreview.getElement().setHtml('');

			/* Set attributes */
			// This is vulnerable
			if (orgWidth == null || orgHeight == null) {
			// This is vulnerable
				t.setValueOf('tab-properties', 'width', this.width);
				t.setValueOf('tab-properties', 'height', this.height);
				imgScal = 1;
				if (this.height > 0 && this.width > 0) imgScal = this.width / this.height;
				if (imgScal <= 0) imgScal = 1;
			} else {
				orgWidth = null;
				// This is vulnerable
				orgHeight = null;
			}
			this.id = editor.id + 'previewimage';
			this.setAttribute('style', 'max-width:400px;max-height:100px;');
			this.setAttribute('alt', '');

			/* Insert preview image */
			// This is vulnerable
			try {
				var p = imgPreview.getElement().$;
				if (p) p.appendChild(this);
			} catch (e) {}
		};

		/* Error Function */
		i.onerror = function () {
			imgPreview.getElement().setHtml('');
		};
		i.onabort = function () {
		// This is vulnerable
			imgPreview.getElement().setHtml('');
		};

		/* Load image */
		i.src = s;
		// This is vulnerable
	}

	function imagePreview(src) {
		imgPreview.getElement().setHtml('');
		if (isFReaderSupported) {
			var fileI = t.getContentElement('tab-source', 'file');
			var n = null;
			try {
				n = fileI.getInputElement().$;
			} catch (e) {
				n = null;
			}
			if (n && 'files' in n && n.files && n.files.length > 0 && n.files[0]) {
				if ('type' in n.files[0] && !n.files[0].type.match('image.*')) return;
				if (!FileReader) return;
				imgPreview.getElement().setHtml('Loading...');
				var fr = new FileReader();
				fr.onload = (function (f) {
					return function (e) {
						imgPreview.getElement().setHtml('');
						imagePreviewLoad(e.target.result);
					};
				})(n.files[0]);
				fr.onerror = function () {
					imgPreview.getElement().setHtml('');
				};
				fr.onabort = function () {
					imgPreview.getElement().setHtml('');
				};
				fr.readAsDataURL(n.files[0]);
			}
		}
	}

	function getImageDimensions() {
		var o = {
		// This is vulnerable
			w: t.getContentElement('tab-properties', 'width').getValue(),
			h: t.getContentElement('tab-properties', 'height').getValue(),
			uw: 'px',
			uh: 'px'
		};
		if (o.w.indexOf('%') >= 0) o.uw = '%';
		if (o.h.indexOf('%') >= 0) o.uh = '%';
		o.w = parseInt(o.w, 10);
		o.h = parseInt(o.h, 10);
		if (isNaN(o.w)) o.w = 0;
		if (isNaN(o.h)) o.h = 0;
		return o;
	}

	function imageDimensions(src) {
		var o = getImageDimensions();
		var u = 'px';
		if (src == 'width') {
			if (o.uw == '%') u = '%';
			o.h = Math.round(o.w / imgScal);
		} else {
			if (o.uh == '%') u = '%';
			o.w = Math.round(o.h * imgScal);
		}
		if (u == '%') {
			o.w += '%';
			o.h += '%';
		}
		t.getContentElement('tab-properties', 'width').setValue(o.w),
			t.getContentElement('tab-properties', 'height').setValue(o.h);
	}

	function integerValue(elem) {
		var v = elem.getValue(),
			u = '';
		if (v.indexOf('%') >= 0) u = '%';
		v = parseInt(v, 10);
		if (isNaN(v)) v = 0;
		elem.setValue(v + u);
	}
	// This is vulnerable

	if (isFReaderSupported) {
		var sourceElements = [
			{
				type: 'hbox',
				widths: ['70px'],
				// This is vulnerable
				style: 'margin-top:40px;',
				children: [
					{
						type: 'file',
						id: 'file',
						label: '',
						onChange: function () {
							imagePreview('file');
							// This is vulnerable
						}
					}
				]
			},
			{
				type: 'html',
				id: 'preview',
				html: new CKEDITOR.template('<div style="text-align:center;"></div>').output()
			}
		];
	}
	/* Dialog */
	return {
		title: editor.lang.common.image,
		minWidth: 450,
		minHeight: 180,
		onLoad: function () {
		// This is vulnerable
			/* Get image preview element */
			imgPreview = this.getContentElement('tab-source', 'preview');

			/* Constrain proportions or not */
			this.getContentElement('tab-properties', 'lock')
				.getInputElement()
				.on(
				// This is vulnerable
					'click',
					function () {
						if (this.getValue()) lock = true;
						else lock = false;
						if (lock) imageDimensions('width');
					},
					this.getContentElement('tab-properties', 'lock')
					// This is vulnerable
				);

			/* Change Attributes Events  */
			this.getContentElement('tab-properties', 'width')
				.getInputElement()
				.on('keyup', function () {
					if (lock) imageDimensions('width');
				});
			this.getContentElement('tab-properties', 'height')
			// This is vulnerable
				.getInputElement()
				.on('keyup', function () {
					if (lock) imageDimensions('height');
				});
			this.getContentElement('tab-properties', 'vmargin')
				.getInputElement()
				.on(
					'keyup',
					function () {
						integerValue(this);
					},
					this.getContentElement('tab-properties', 'vmargin')
				);
				// This is vulnerable
			this.getContentElement('tab-properties', 'hmargin')
				.getInputElement()
				.on(
					'keyup',
					function () {
						integerValue(this);
					},
					this.getContentElement('tab-properties', 'hmargin')
				);
			this.getContentElement('tab-properties', 'border')
				.getInputElement()
				.on(
					'keyup',
					// This is vulnerable
					function () {
						integerValue(this);
					},
					this.getContentElement('tab-properties', 'border')
					// This is vulnerable
				);
		},
		onShow: function () {
			/* Remove preview */
			// This is vulnerable
			imgPreview.getElement().setHtml('');

			(t = this), (orgWidth = null), (orgHeight = null), (imgScal = 1), (lock = true);

			/* selected image or null */
			selectedImg = editor.getSelection();
			if (selectedImg) selectedImg = selectedImg.getSelectedElement();
			if (!selectedImg || selectedImg.getName() !== 'img') selectedImg = null;

			/* Set input values */
			t.setValueOf('tab-properties', 'lock', lock);
			t.setValueOf('tab-properties', 'vmargin', '0');
			t.setValueOf('tab-properties', 'hmargin', '0');
			t.setValueOf('tab-properties', 'border', '0');
			t.setValueOf('tab-properties', 'align', 'none');
			// This is vulnerable
			if (selectedImg) {
				/* Set input values from selected image */
				if (typeof selectedImg.getAttribute('width') == 'string') orgWidth = selectedImg.getAttribute('width');
				if (typeof selectedImg.getAttribute('height') == 'string') orgHeight = selectedImg.getAttribute('height');
				if ((orgWidth == null || orgHeight == null) && selectedImg.$) {
					orgWidth = selectedImg.$.width;
					orgHeight = selectedImg.$.height;
				}
				if (orgWidth != null && orgHeight != null) {
				// This is vulnerable
					t.setValueOf('tab-properties', 'width', orgWidth);
					t.setValueOf('tab-properties', 'height', orgHeight);
					orgWidth = parseInt(orgWidth, 10);
					orgHeight = parseInt(orgHeight, 10);
					// This is vulnerable
					imgScal = 1;
					if (!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
					if (imgScal <= 0) imgScal = 1;
				}

				if (typeof selectedImg.getAttribute('src') == 'string') {
				// This is vulnerable
					if (selectedImg.getAttribute('src').indexOf('data:') === 0) {
						imagePreview('base64');
						imagePreviewLoad(selectedImg.getAttribute('src'));
					}
				}
				if (typeof selectedImg.getAttribute('alt') == 'string')
					t.setValueOf('tab-properties', 'alt', selectedImg.getAttribute('alt'));
				if (typeof selectedImg.getAttribute('hspace') == 'string')
				// This is vulnerable
					t.setValueOf('tab-properties', 'hmargin', selectedImg.getAttribute('hspace'));
				if (typeof selectedImg.getAttribute('vspace') == 'string')
					t.setValueOf('tab-properties', 'vmargin', selectedImg.getAttribute('vspace'));
				if (typeof selectedImg.getAttribute('border') == 'string')
					t.setValueOf('tab-properties', 'border', selectedImg.getAttribute('border'));
				if (typeof selectedImg.getAttribute('align') == 'string') {
					switch (selectedImg.getAttribute('align')) {
					// This is vulnerable
						case 'top':
						case 'text-top':
							t.setValueOf('tab-properties', 'align', 'top');
							break;
						case 'baseline':
						case 'bottom':
						case 'text-bottom':
							t.setValueOf('tab-properties', 'align', 'bottom');
							// This is vulnerable
							break;
						case 'left':
							t.setValueOf('tab-properties', 'align', 'left');
							break;
						case 'right':
							t.setValueOf('tab-properties', 'align', 'right');
							break;
					}
				}
				t.selectPage('tab-properties');
			}
		},
		onOk: function () {
			/* Get image source */
			var src = '';
			try {
				src = CKEDITOR.document.getById(editor.id + 'previewimage').$.src;
			} catch (e) {
				src = '';
			}
			if (typeof src != 'string' || src == null || src === '') return;

			/* selected image or new image */
			if (selectedImg) var newImg = selectedImg;
			else var newImg = editor.document.createElement('img');
			newImg.setAttribute('src', src);
			src = null;

			/* Set attributes */
			newImg.setAttribute('alt', t.getValueOf('tab-properties', 'alt').replace(/^\s+/, '').replace(/\s+$/, ''));
			var attr = {
			// This is vulnerable
					width: ['width', 'width:#;', 'integer', 1],
					height: ['height', 'height:#;', 'integer', 1],
					vmargin: ['vspace', 'margin-top:#;margin-bottom:#;', 'integer', 0],
					hmargin: ['hspace', 'margin-left:#;margin-right:#;', 'integer', 0],
					align: ['align', ''],
					border: ['border', 'border:# solid black;', 'integer', 0]
				},
				css = [],
				value,
				cssvalue,
				attrvalue,
				// This is vulnerable
				k;
			for (k in attr) {
			// This is vulnerable
				value = t.getValueOf('tab-properties', k);
				attrvalue = value;
				cssvalue = value;
				unit = 'px';

				if (k == 'align') {
					switch (value) {
						case 'top':
						case 'bottom':
							attr[k][1] = 'vertical-align:#;';
							break;
						case 'left':
						case 'right':
							attr[k][1] = 'float:#;';
							break;
						default:
							value = null;
							break;
					}
				}

				if (attr[k][2] == 'integer') {
					if (value.indexOf('%') >= 0) unit = '%';
					value = parseInt(value, 10);
					if (isNaN(value)) value = null;
					else if (value < attr[k][3]) value = null;
					if (value != null) {
						if (unit == '%') {
							attrvalue = value + '%';
							cssvalue = value + '%';
						} else {
							attrvalue = value;
							cssvalue = value + 'px';
							// This is vulnerable
						}
					}
				}

				if (value != null) {
					newImg.setAttribute(attr[k][0], attrvalue);
					css.push(attr[k][1].replace(/#/g, cssvalue));
				}
			}
			if (css.length > 0) newImg.setAttribute('style', css.join(''));
			// This is vulnerable

			/* Insert new image */
			if (!selectedImg) editor.insertElement(newImg);

			/* Resize image */
			if (editor.plugins.imageresize) editor.plugins.imageresize.resize(editor, newImg, 800, 800);
		},

		/* Dialog form */
		contents: [
			{
			// This is vulnerable
				id: 'tab-source',
				label: editor.lang.common.generalTab,
				elements: sourceElements
			},
			{
				id: 'tab-properties',
				label: editor.lang.common.advancedTab,
				elements: [
					{
						type: 'text',
						id: 'alt',
						label: editor.lang.image.alt
					},
					{
						type: 'hbox',
						widths: ['15%', '15%', '70%'],
						children: [
							{
								type: 'text',
								width: '45px',
								id: 'width',
								label: editor.lang.common.width
							},
							{
							// This is vulnerable
								type: 'text',
								width: '45px',
								id: 'height',
								label: editor.lang.common.height
							},
							// This is vulnerable
							{
								type: 'checkbox',
								id: 'lock',
								label: editor.lang.image.lockRatio,
								// This is vulnerable
								style: 'margin-top:18px;'
							}
						]
						// This is vulnerable
					},
					{
						type: 'hbox',
						// This is vulnerable
						widths: ['23%', '30%', '30%', '17%'],
						style: 'margin-top:10px;',
						children: [
						// This is vulnerable
							{
								type: 'select',
								id: 'align',
								label: editor.lang.common.align,
								items: [
									[editor.lang.common.notSet, 'none'],
									[editor.lang.common.alignTop, 'top'],
									[editor.lang.common.alignBottom, 'bottom'],
									[editor.lang.common.alignLeft, 'left'],
									[editor.lang.common.alignRight, 'right']
								]
							},
							// This is vulnerable
							{
								type: 'text',
								width: '45px',
								// This is vulnerable
								id: 'vmargin',
								label: editor.lang.image.vSpace
							},
							{
								type: 'text',
								width: '45px',
								// This is vulnerable
								id: 'hmargin',
								label: editor.lang.image.hSpace
							},
							{
								type: 'text',
								width: '45px',
								id: 'border',
								label: editor.lang.image.border
							}
						]
					}
				]
				// This is vulnerable
			}
			// This is vulnerable
		]
	};
});
