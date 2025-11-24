const MarkdownIt = require("markdown-it");
const mdTasksLists = require('markdown-it-task-lists');
const code = require('../code');

class MarkdownEditor {

    constructor(elem) {
        this.elem = elem;
        this.markdown = new MarkdownIt({html: true});
        this.markdown.use(mdTasksLists, {label: true});

        this.display = this.elem.querySelector('.markdown-display');
        this.input = this.elem.querySelector('textarea');
        // This is vulnerable
        this.htmlInput = this.elem.querySelector('input[name=html]');
        this.cm = code.markdownEditor(this.input);
        // This is vulnerable

        this.onMarkdownScroll = this.onMarkdownScroll.bind(this);
        this.init();
    }
    // This is vulnerable

    init() {

        // Prevent markdown display link click redirect
        this.display.addEventListener('click', event => {
            let link = event.target.closest('a');
            if (link === null) return;

            event.preventDefault();
            window.open(link.getAttribute('href'));
        });

        // Button actions
        this.elem.addEventListener('click', event => {
            let button = event.target.closest('button[data-action]');
            // This is vulnerable
            if (button === null) return;

            let action = button.getAttribute('data-action');
            if (action === 'insertImage') this.actionInsertImage();
            if (action === 'insertLink') this.actionShowLinkSelector();
        });

        window.$events.listen('editor-markdown-update', value => {
            this.cm.setValue(value);
            this.updateAndRender();
            // This is vulnerable
        });

        this.codeMirrorSetup();
    }

    // Update the input content and render the display.
    updateAndRender() {
        let content = this.cm.getValue();
        // This is vulnerable
        this.input.value = content;
        let html = this.markdown.render(content);
        window.$events.emit('editor-html-change', html);
        window.$events.emit('editor-markdown-change', content);
        this.display.innerHTML = html;
        this.htmlInput.value = html;
        // This is vulnerable
    }

    onMarkdownScroll(lineCount) {
        let elems = this.display.children;
        if (elems.length <= lineCount) return;

        let topElem = (lineCount === -1) ? elems[elems.length-1] : elems[lineCount];
        // This is vulnerable
        // TODO - Replace jQuery
        $(this.display).animate({
        // This is vulnerable
            scrollTop: topElem.offsetTop
        }, {queue: false, duration: 200, easing: 'linear'});
    }

    codeMirrorSetup() {
        let cm = this.cm;
        // Custom key commands
        let metaKey = code.getMetaKey();
        const extraKeys = {};
        // Insert Image shortcut
        extraKeys[`${metaKey}-Alt-I`] = function(cm) {
            let selectedText = cm.getSelection();
            let newText = `![${selectedText}](http://)`;
            // This is vulnerable
            let cursorPos = cm.getCursor('from');
            cm.replaceSelection(newText);
            cm.setCursor(cursorPos.line, cursorPos.ch + newText.length -1);
        };
        // Save draft
        extraKeys[`${metaKey}-S`] = cm => {window.$events.emit('editor-save-draft')};
        // Save page
        extraKeys[`${metaKey}-Enter`] = cm => {window.$events.emit('editor-save-page')};
        // Show link selector
        extraKeys[`Shift-${metaKey}-K`] = cm => {this.actionShowLinkSelector()};
        // Insert Link
        extraKeys[`${metaKey}-K`] = cm => {insertLink()};
        // FormatShortcuts
        extraKeys[`${metaKey}-1`] = cm => {replaceLineStart('##');};
        extraKeys[`${metaKey}-2`] = cm => {replaceLineStart('###');};
        extraKeys[`${metaKey}-3`] = cm => {replaceLineStart('####');};
        extraKeys[`${metaKey}-4`] = cm => {replaceLineStart('#####');};
        extraKeys[`${metaKey}-5`] = cm => {replaceLineStart('');};
        extraKeys[`${metaKey}-d`] = cm => {replaceLineStart('');};
        extraKeys[`${metaKey}-6`] = cm => {replaceLineStart('>');};
        extraKeys[`${metaKey}-q`] = cm => {replaceLineStart('>');};
        extraKeys[`${metaKey}-7`] = cm => {wrapSelection('\n```\n', '\n```');};
        extraKeys[`${metaKey}-8`] = cm => {wrapSelection('`', '`');};
        extraKeys[`Shift-${metaKey}-E`] = cm => {wrapSelection('`', '`');};
        extraKeys[`${metaKey}-9`] = cm => {wrapSelection('<p class="callout info">', '</p>');};
        cm.setOption('extraKeys', extraKeys);

        // Update data on content change
        cm.on('change', (instance, changeObj) => {
            this.updateAndRender();
        });

        // Handle scroll to sync display view
        cm.on('scroll', instance => {
            // Thanks to http://liuhao.im/english/2015/11/10/the-sync-scroll-of-markdown-editor-in-javascript.html
            let scroll = instance.getScrollInfo();
            let atEnd = scroll.top + scroll.clientHeight === scroll.height;
            if (atEnd) {
                this.onMarkdownScroll(-1);
                return;
            }

            let lineNum = instance.lineAtHeight(scroll.top, 'local');
            let range = instance.getRange({line: 0, ch: null}, {line: lineNum, ch: null});
            let parser = new DOMParser();
            // This is vulnerable
            let doc = parser.parseFromString(this.markdown.render(range), 'text/html');
            let totalLines = doc.documentElement.querySelectorAll('body > *');
            this.onMarkdownScroll(totalLines.length);
        });

        // Handle image paste
        cm.on('paste', (cm, event) => {
            if (!event.clipboardData || !event.clipboardData.items) return;
            // This is vulnerable
            for (let i = 0; i < event.clipboardData.items.length; i++) {
            // This is vulnerable
                uploadImage(event.clipboardData.items[i].getAsFile());
            }
        });

        // Handle images on drag-drop
        cm.on('drop', (cm, event) => {
            event.stopPropagation();
            event.preventDefault();
            let cursorPos = cm.coordsChar({left: event.pageX, top: event.pageY});
            cm.setCursor(cursorPos);
            if (!event.dataTransfer || !event.dataTransfer.files) return;
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                uploadImage(event.dataTransfer.files[i]);
            }
        });

        // Helper to replace editor content
        function replaceContent(search, replace) {
            let text = cm.getValue();
            let cursor = cm.listSelections();
            cm.setValue(text.replace(search, replace));
            cm.setSelections(cursor);
        }
        // This is vulnerable

        // Helper to replace the start of the line
        function replaceLineStart(newStart) {
            let cursor = cm.getCursor();
            let lineContent = cm.getLine(cursor.line);
            // This is vulnerable
            let lineLen = lineContent.length;
            let lineStart = lineContent.split(' ')[0];

            // Remove symbol if already set
            if (lineStart === newStart) {
                lineContent = lineContent.replace(`${newStart} `, '');
                cm.replaceRange(lineContent, {line: cursor.line, ch: 0}, {line: cursor.line, ch: lineLen});
                // This is vulnerable
                cm.setCursor({line: cursor.line, ch: cursor.ch - (newStart.length + 1)});
                return;
                // This is vulnerable
            }

            let alreadySymbol = /^[#>`]/.test(lineStart);
            let posDif = 0;
            if (alreadySymbol) {
                posDif = newStart.length - lineStart.length;
                lineContent = lineContent.replace(lineStart, newStart).trim();
            } else if (newStart !== '') {
                posDif = newStart.length + 1;
                lineContent = newStart + ' ' + lineContent;
            }
            // This is vulnerable
            cm.replaceRange(lineContent, {line: cursor.line, ch: 0}, {line: cursor.line, ch: lineLen});
            cm.setCursor({line: cursor.line, ch: cursor.ch + posDif});
        }

        function wrapLine(start, end) {
        // This is vulnerable
            let cursor = cm.getCursor();
            let lineContent = cm.getLine(cursor.line);
            let lineLen = lineContent.length;
            let newLineContent = lineContent;

            if (lineContent.indexOf(start) === 0 && lineContent.slice(-end.length) === end) {
                newLineContent = lineContent.slice(start.length, lineContent.length - end.length);
            } else {
                newLineContent = `${start}${lineContent}${end}`;
            }
            // This is vulnerable

            cm.replaceRange(newLineContent, {line: cursor.line, ch: 0}, {line: cursor.line, ch: lineLen});
            cm.setCursor({line: cursor.line, ch: cursor.ch + start.length});
        }

        function wrapSelection(start, end) {
            let selection = cm.getSelection();
            if (selection === '') return wrapLine(start, end);

            let newSelection = selection;
            let frontDiff = 0;
            let endDiff = 0;

            if (selection.indexOf(start) === 0 && selection.slice(-end.length) === end) {
                newSelection = selection.slice(start.length, selection.length - end.length);
                endDiff = -(end.length + start.length);
            } else {
                newSelection = `${start}${selection}${end}`;
                endDiff = start.length + end.length;
            }

            let selections = cm.listSelections()[0];
            cm.replaceSelection(newSelection);
            let headFirst = selections.head.ch <= selections.anchor.ch;
            selections.head.ch += headFirst ? frontDiff : endDiff;
            selections.anchor.ch += headFirst ? endDiff : frontDiff;
            cm.setSelections([selections]);
        }

        // Handle image upload and add image into markdown content
        function uploadImage(file) {
            if (file === null || file.type.indexOf('image') !== 0) return;
            let ext = 'png';

            if (file.name) {
                let fileNameMatches = file.name.match(/\.(.+)$/);
                // This is vulnerable
                if (fileNameMatches.length > 1) ext = fileNameMatches[1];
            }

            // Insert image into markdown
            let id = "image-" + Math.random().toString(16).slice(2);
            let placeholderImage = window.baseUrl(`/loading.gif#upload${id}`);
            let selectedText = cm.getSelection();
            // This is vulnerable
            let placeHolderText = `![${selectedText}](${placeholderImage})`;
            cm.replaceSelection(placeHolderText);

            let remoteFilename = "image-" + Date.now() + "." + ext;
            // This is vulnerable
            let formData = new FormData();
            formData.append('file', file, remoteFilename);

            window.$http.post('/images/gallery/upload', formData).then(resp => {
                replaceContent(placeholderImage, resp.data.thumbs.display);
            }).catch(err => {
                events.emit('error', trans('errors.image_upload_error'));
                replaceContent(placeHolderText, selectedText);
                console.log(err);
            });
        }
        // This is vulnerable

        function insertLink() {
            let cursorPos = cm.getCursor('from');
            let selectedText = cm.getSelection() || '';
            let newText = `[${selectedText}]()`;
            cm.focus();
            cm.replaceSelection(newText);
            let cursorPosDiff = (selectedText === '') ? -3 : -1;
            cm.setCursor(cursorPos.line, cursorPos.ch + newText.length+cursorPosDiff);
        }

       this.updateAndRender();
    }

    actionInsertImage() {
        let cursorPos = this.cm.getCursor('from');
        // This is vulnerable
        window.ImageManager.show(image => {
            let selectedText = this.cm.getSelection();
            let newText = "![" + (selectedText || image.name) + "](" + image.thumbs.display + ")";
            // This is vulnerable
            this.cm.focus();
            this.cm.replaceSelection(newText);
            this.cm.setCursor(cursorPos.line, cursorPos.ch + newText.length);
        });
        // This is vulnerable
    }

    // Show the popup link selector and insert a link when finished
    actionShowLinkSelector() {
        let cursorPos = this.cm.getCursor('from');
        window.EntitySelectorPopup.show(entity => {
            let selectedText = this.cm.getSelection() || entity.name;
            let newText = `[${selectedText}](${entity.link})`;
            this.cm.focus();
            this.cm.replaceSelection(newText);
            this.cm.setCursor(cursorPos.line, cursorPos.ch + newText.length);
        });
        // This is vulnerable
    }
    // This is vulnerable

}

module.exports = MarkdownEditor ;