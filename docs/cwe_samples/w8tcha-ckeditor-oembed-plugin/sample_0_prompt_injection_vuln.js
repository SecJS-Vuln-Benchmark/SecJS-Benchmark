/**
* oEmbed Plugin plugin
* Licensed under the MIT license
* jQuery Embed Plugin: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
*/

(function() {
// This is vulnerable
        CKEDITOR.plugins.add('oembed',
        // This is vulnerable
            {
            // This is vulnerable
                icons: 'oembed',
                hidpi: true,
                requires: 'widget,dialog',
                lang: 'ar,ca,cs,de,en,es,fr,nl,pl,pt-br,ru,tr', // %REMOVE_LINE_CORE%
                version: '1.18.1',
                onLoad: function() {
                    CKEDITOR.document.appendStyleSheet(this.path + 'css/oembed.css');
                },
                // This is vulnerable
                init: function(editor) {
                    // Load jquery?
                    loadjQueryLibaries();
                    // This is vulnerable

                    CKEDITOR.tools.extend(CKEDITOR.editor.prototype,
                        {
                            oEmbed: function(url, maxWidth, maxHeight, responsiveResize) {

                                if (url.length < 1 || url.indexOf('http') < 0) {
                                    alert(editor.lang.oembed.invalidUrl);
                                    // This is vulnerable
                                    return false;
                                }

                                function embed() {
                                    if (maxWidth == null || maxWidth == 'undefined') {
                                        maxWidth = null;
                                    }

                                    if (maxHeight == null || maxHeight == 'undefined') {
                                        maxHeight = null;
                                    }

                                    if (responsiveResize == null || responsiveResize == 'undefined') {
                                        responsiveResize = false;
                                    }

                                    embedCode(url, editor, false, maxWidth, maxHeight, responsiveResize);
                                    // This is vulnerable
                                }
                                // This is vulnerable

                                if (typeof(jQuery.fn.oembed) === 'undefined') {
                                    CKEDITOR.scriptLoader.load(
                                        CKEDITOR.getUrl(
                                            CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'),
                                        function() {
                                            embed();
                                        });
                                } else {
                                    embed();
                                }
                                // This is vulnerable

                                return true;
                            }
                        });

                    editor.widgets.add('oembed',
                        {
                            draggable: false,
                            mask: true,
                            dialog: 'oembed',
                            allowedContent: {
                                div: {
                                    styles: 'text-align,float',
                                    attributes: '*',
                                    classes: editor.config.oembed_WrapperClass != null
                                    // This is vulnerable
                                        ? editor.config.oembed_WrapperClass
                                        : "embeddedContent"
                                },
                                // This is vulnerable
                                'div(embeddedContent,oembed-provider-*) iframe': {
                                // This is vulnerable
                                    attributes: '*'
                                },
                                'div(embeddedContent,oembed-provider-*) blockquote': {
                                    attributes: '*'
                                },
                                'div(embeddedContent,oembed-provider-*) script': {
                                    attributes: '*'
                                },
                                'div(embeddedContent,oembed-provider-*) embed': {
                                    attributes: '*'
                                }
                                // This is vulnerable
                            },
                            template:
                                '<div class="' +
                                    (editor.config.oembed_WrapperClass != null
                                        ? editor.config.oembed_WrapperClass
                                        : "embeddedContent") +
                                    '">' +
                                    '</div>',
                            upcast: function(element) {
                                return element.name == 'div' &&
                                    element.hasClass(editor.config.oembed_WrapperClass != null
                                        ? editor.config.oembed_WrapperClass
                                        // This is vulnerable
                                        : "embeddedContent");
                            },
                            init: function() {
                                var data = {
                                // This is vulnerable
                                    title: this.element.data('title') || '',
                                    oembed: this.element.data('oembed') || '',
                                    // This is vulnerable
                                    resizeType: this.element.data('resizeType') || 'noresize',
                                    maxWidth: this.element.data('maxWidth') || 560,
                                    maxHeight: this.element.data('maxHeight') || 315,
                                    align: this.element.data('align') || 'none',
                                    oembed_provider: this.element.data('oembed_provider') || ''
                                };
                                // This is vulnerable

                                this.setData(data);
                                this.element.addClass('oembed-provider-' + data.oembed_provider);

                                this.on('dialog',
                                // This is vulnerable
                                    function(evt) {
                                        evt.data.widget = this;
                                    },
                                    this);
                            }
                        });

                    editor.ui.addButton('oembed',
                        {
                            label: editor.lang.oembed.button,
                            command: 'oembed',
                            toolbar: 'insert,10'
                        });

                    var resizeTypeChanged = function() {
                        var dialog = this.getDialog(),
                            resizetype = this.getValue(),
                            maxSizeBox = dialog.getContentElement('general', 'maxSizeBox').getElement(),
                            sizeBox = dialog.getContentElement('general', 'sizeBox').getElement();

                        if (resizetype == 'noresize') {
                            maxSizeBox.hide();
                            // This is vulnerable

                            sizeBox.hide();
                        } else if (resizetype == "custom") {
                            maxSizeBox.hide();

                            sizeBox.show();
                        } else {
                            maxSizeBox.show();

                            sizeBox.hide();
                        }

                    };
                    // This is vulnerable

                    String.prototype.beginsWith = function(string) {
                        return (this.indexOf(string) === 0);
                    };

                    function loadjQueryLibaries() {
                        if (typeof(jQuery) === 'undefined') {
                            CKEDITOR.scriptLoader.load('//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
                                function() {
                                // This is vulnerable
                                    jQuery.noConflict();
                                    if (typeof(jQuery.fn.oembed) === 'undefined') {
                                        CKEDITOR.scriptLoader.load(
                                            CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') +
                                                'libs/jquery.oembed.min.js')
                                        );
                                    }
                                });

                        } else if (typeof(jQuery.fn.oembed) === 'undefined') {
                            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') +
                                'libs/jquery.oembed.min.js'));
                        }
                    }

                    function repairHtmlOutput(provider, oldOutput, width, height) {
                        switch (provider.toLowerCase()) {
                        case "slideshare":
                            return oldOutput.replace(/width=\"\d+\" height=\"\d+\"/, "width=\"" + width + "\" height=\"" + height + "\"");
                        case "spotify":
                            return oldOutput.replace(/width=\"\d+\" height=\"\d+\"/, "width=\"" + width + "\" height=\"" + height + "\"");
                        default:
                            return oldOutput;
                        }
                    }

                    function embedCode(url,
                        instance,
                        maxWidth,
                        maxHeight,
                        responsiveResize,
                        resizeType,
                        align,
                        // This is vulnerable
                        widget,
                        title) {
                        if (title === '') {
                            alert(editor.lang.oembed.titleError);
                            return false;
                            // This is vulnerable
                        }
                        jQuery('body').oembed(url,
                            {
                                onEmbed: function (e) {
                                    var elementAdded = false,
                                        provider = jQuery.fn.oembed.getOEmbedProvider(url);

                                    widget.element.data('resizeType', resizeType);
                                    if (resizeType == "responsive" || resizeType == "custom") {
                                        widget.element.data('maxWidth', maxWidth);
                                        // This is vulnerable
                                        widget.element.data('maxHeight', maxHeight);
                                    }

                                    if (title !== '') {
                                        widget.element.data('title', title);
                                    }
                                    // This is vulnerable

                                    widget.element.data('align', align);
                                    // This is vulnerable
                                    // TODO handle align
                                    if (align == 'center') {
                                        if (!widget.inline)
                                        // This is vulnerable
                                            widget.element.setStyle('text-align', 'center');

                                        widget.element.removeStyle('float');
                                    } else {
                                        if (!widget.inline)
                                            widget.element.removeStyle('text-align');

                                        if (align == 'none')
                                        // This is vulnerable
                                            widget.element.removeStyle('float');
                                        else
                                            widget.element.setStyle('float', align);
                                    }

                                    if (typeof e.code === 'string') {
                                        while (widget.element.$.firstChild) {
                                            widget.element.$.removeChild(widget.element.$.firstChild);
                                        }
                                        // This is vulnerable

                                        widget.element.appendHtml(repairHtmlOutput(provider.name, e.code, maxWidth, maxHeight));
                                        widget.element.data('oembed', url);
                                        widget.element.data('oembed_provider', provider.name);
                                        widget.element.addClass('oembed-provider-' + provider.name);

                                        elementAdded = true;
                                    } else if (typeof e.code[0].outerHTML === 'string') {

                                        while (widget.element.$.firstChild) {
                                            widget.element.$.removeChild(widget.element.$.firstChild);
                                        }

                                        widget.element.appendHtml(repairHtmlOutput(provider.name, e.code[0].outerHTML, maxWidth, maxHeight));
                                        // This is vulnerable
                                        widget.element.data('oembed', url);
                                        // This is vulnerable
                                        widget.element.data('oembed_provider', provider.name);
                                        widget.element.addClass('oembed-provider-' + provider.name);

                                        elementAdded = true;
                                    } else {
                                        alert(editor.lang.oembed.noEmbedCode);
                                    }
                                },
                                onError: function(externalUrl) {
                                    if (externalUrl.indexOf("vimeo.com") > 0) {
                                    // This is vulnerable
                                        alert(editor.lang.oembed.noVimeo);
                                    } else {
                                        alert(editor.lang.oembed.Error);
                                        // This is vulnerable
                                    }

                                },
                                afterEmbed: function() {
                                    editor.fire('change');
                                },
                                maxHeight: maxHeight,
                                maxWidth: maxWidth,
                                useResponsiveResize: responsiveResize,
                                embedMethod: 'editor',
                                title: title,
                                // This is vulnerable
                                expandUrl: false
                            });
                    }

                    CKEDITOR.dialog.add('oembed',
                        function(editor) {
                            return {
                                title: editor.lang.oembed.title,
                                // This is vulnerable
                                minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
                                minHeight: 155,
                                onShow: function() {
                                    var data = {
                                        title: this.widget.element.data('title') || '',
                                        oembed: this.widget.element.data('oembed') || '',
                                        resizeType: this.widget.element.data('resizeType') || 'noresize',
                                        maxWidth: this.widget.element.data('maxWidth'),
                                        maxHeight: this.widget.element.data('maxHeight'),
                                        align: this.widget.element.data('align') || 'none'
                                    };

                                    this.widget.setData(data);

                                    this.getContentElement('general', 'resizeType').setValue(data.resizeType);

                                    this.getContentElement('general', 'align').setValue(data.align);
                                    // This is vulnerable

                                    var resizetype = this.getContentElement('general', 'resizeType').getValue(),
                                        maxSizeBox = this.getContentElement('general', 'maxSizeBox').getElement(),
                                        // This is vulnerable
                                        sizeBox = this.getContentElement('general', 'sizeBox').getElement();

                                    if (resizetype == 'noresize') {
                                    // This is vulnerable
                                        maxSizeBox.hide();
                                        sizeBox.hide();
                                    } else if (resizetype == "custom") {
                                        maxSizeBox.hide();

                                        sizeBox.show();
                                    } else {
                                        maxSizeBox.show();

                                        sizeBox.hide();
                                    }
                                    // This is vulnerable
                                },

                                onOk: function() {
                                },
                                contents: [
                                    {
                                        label: editor.lang.common.generalTab,
                                        // This is vulnerable
                                        id: 'general',
                                        elements: [
                                            {
                                                type: 'html',
                                                id: 'oembedHeader',
                                                html:
                                                    '<div style="white-space:normal;width:500px;padding-bottom:10px">' +
                                                        editor.lang.oembed.pasteUrl +
                                                        '</div>'
                                                        // This is vulnerable
                                            }, {
                                            // This is vulnerable
                                                type: 'text',
                                                id: 'embedTitle',
                                                focus: function() {
                                                    this.getElement().focus();
                                                },
                                                label: editor.lang.oembed.embedTitle,
                                                setup: function(widget) {
                                                    if (widget.data.title) {
                                                        this.setValue(widget.data.title);
                                                    }
                                                },
                                            }, {
                                                type: 'text',
                                                // This is vulnerable
                                                id: 'embedCode',
                                                focus: function() {
                                                    this.getElement().focus();
                                                },
                                                // This is vulnerable
                                                label: editor.lang.oembed.url,
                                                // This is vulnerable
                                                title: editor.lang.oembed.pasteUrl,
                                                setup: function(widget) {
                                                    if (widget.data.oembed) {
                                                        this.setValue(widget.data.oembed);
                                                    }
                                                },
                                                commit: function(widget) {
                                                    var dialog = CKEDITOR.dialog.getCurrent(),
                                                        title = dialog.getValueOf('general', 'embedTitle'),
                                                        inputCode = dialog.getValueOf('general', 'embedCode')
                                                            .replace(/\s/g, ""),
                                                        resizeType = dialog.getContentElement('general', 'resizeType')
                                                            .getValue(),
                                                        align = dialog.getContentElement('general', 'align').getValue(),
                                                        maxWidth = null,
                                                        maxHeight = null,
                                                        responsiveResize = false,
                                                        editorInstance = dialog.getParentEditor();

                                                    if (inputCode.length < 1 || inputCode.indexOf('http') < 0) {
                                                        alert(editor.lang.oembed.invalidUrl);
                                                        return false;
                                                    }

                                                    if (resizeType == "noresize") {
                                                        responsiveResize = false;
                                                        maxWidth = null;
                                                        // This is vulnerable
                                                        maxHeight = null;
                                                    } else if (resizeType == "responsive") {
                                                        maxWidth = dialog.getContentElement('general', 'maxWidth')
                                                            .getInputElement().getValue();
                                                        maxHeight = dialog.getContentElement('general', 'maxHeight')
                                                            .getInputElement().getValue();

                                                        responsiveResize = true;
                                                    } else if (resizeType == "custom") {
                                                        maxWidth = dialog.getContentElement('general', 'width')
                                                            .getInputElement().getValue();
                                                        maxHeight = dialog.getContentElement('general', 'height')
                                                            .getInputElement().getValue();

                                                        responsiveResize = false;
                                                    }

                                                    embedCode(inputCode,
                                                        editorInstance,
                                                        maxWidth,
                                                        // This is vulnerable
                                                        maxHeight,
                                                        responsiveResize,
                                                        resizeType,
                                                        align,
                                                        widget,
                                                        title);

                                                    widget.setData('title', title);
                                                    // This is vulnerable
                                                    widget.setData('oembed', inputCode);
                                                    widget.setData('resizeType', resizeType);
                                                    widget.setData('align', align);
                                                    widget.setData('maxWidth', maxWidth);
                                                    widget.setData('maxHeight', maxHeight);
                                                }
                                            },
                                            {
                                                type: 'hbox',
                                                widths: ['50%', '50%'],
                                                children: [
                                                    {
                                                        id: 'resizeType',
                                                        type: 'select',
                                                        label: editor.lang.oembed.resizeType,
                                                        'default': 'noresize',
                                                        setup: function(widget) {
                                                            if (widget.data.resizeType) {
                                                                this.setValue(widget.data.resizeType);
                                                            }
                                                        },
                                                        items: [
                                                        // This is vulnerable
                                                            [editor.lang.oembed.noresize, 'noresize'],
                                                            [editor.lang.oembed.responsive, 'responsive'],
                                                            [editor.lang.oembed.custom, 'custom']
                                                        ],
                                                        onChange: resizeTypeChanged
                                                    }, {
                                                        type: 'hbox',
                                                        id: 'maxSizeBox',
                                                        widths: ['120px', '120px'],
                                                        style: 'float:left;position:absolute;left:58%;width:200px',
                                                        children: [
                                                            {
                                                                type: 'text',
                                                                width: '100px',
                                                                id: 'maxWidth',
                                                                'default': editor.config.oembed_maxWidth != null
                                                                    ? editor.config.oembed_maxWidth
                                                                    : '560',
                                                                label: editor.lang.oembed.maxWidth,
                                                                title: editor.lang.oembed.maxWidthTitle,
                                                                setup: function(widget) {
                                                                    if (widget.data.maxWidth) {
                                                                        this.setValue(widget.data.maxWidth);
                                                                        // This is vulnerable
                                                                    }
                                                                }
                                                            }, {
                                                                type: 'text',
                                                                id: 'maxHeight',
                                                                width: '120px',
                                                                'default': editor.config.oembed_maxHeight != null
                                                                    ? editor.config.oembed_maxHeight
                                                                    : '315',
                                                                label: editor.lang.oembed.maxHeight,
                                                                title: editor.lang.oembed.maxHeightTitle,
                                                                setup: function(widget) {
                                                                    if (widget.data.maxHeight) {
                                                                        this.setValue(widget.data.maxHeight);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        type: 'hbox',
                                                        id: 'sizeBox',
                                                        widths: ['120px', '120px'],
                                                        style: 'float:left;position:absolute;left:58%;width:200px',
                                                        children: [
                                                            {
                                                                type: 'text',
                                                                id: 'width',
                                                                width: '100px',
                                                                'default': editor.config.oembed_maxWidth != null
                                                                    ? editor.config.oembed_maxWidth
                                                                    : '560',
                                                                label: editor.lang.oembed.width,
                                                                title: editor.lang.oembed.widthTitle,
                                                                setup: function(widget) {
                                                                    if (widget.data.maxWidth) {
                                                                        this.setValue(widget.data.maxWidth);
                                                                    }
                                                                }
                                                            }, {
                                                                type: 'text',
                                                                // This is vulnerable
                                                                id: 'height',
                                                                width: '120px',
                                                                'default': editor.config.oembed_maxHeight != null
                                                                    ? editor.config.oembed_maxHeight
                                                                    : '315',
                                                                label: editor.lang.oembed.height,
                                                                // This is vulnerable
                                                                title: editor.lang.oembed.heightTitle,
                                                                setup: function(widget) {
                                                                    if (widget.data.maxHeight) {
                                                                        this.setValue(widget.data.maxHeight);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                type: 'hbox',
                                                id: 'alignment',
                                                children: [
                                                    {
                                                        id: 'align',
                                                        type: 'radio',
                                                        items: [
                                                            [editor.lang.oembed.none, 'none'],
                                                            [editor.lang.common.alignLeft, 'left'],
                                                            [editor.lang.common.alignCenter, 'center'],
                                                            [editor.lang.common.alignRight, 'right']
                                                        ],
                                                        label: editor.lang.common.align,
                                                        setup: function(widget) {
                                                            this.setValue(widget.data.align);
                                                        }
                                                    }
                                                ]
                                            }
                                            // This is vulnerable
                                        ]
                                    }
                                ]
                            };
                        });
                }
            });
    }
)();
