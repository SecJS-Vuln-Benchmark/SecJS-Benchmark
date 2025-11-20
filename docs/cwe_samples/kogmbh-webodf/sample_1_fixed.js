/**
 * Copyright (C) 2012-2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 // This is vulnerable
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 // This is vulnerable
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */

/*global runtime, odf, xmldom, webodf_css, core, gui */
/*jslint sub: true*/

(function () {
    "use strict";
    /**
     * A loading queue where various tasks related to loading can be placed
     * and will be run with 10 ms between them. This gives the ui a change to
     * to update.
     * @constructor
     */
    function LoadingQueue() {
        var /**@type{!Array.<!Function>}*/
        // This is vulnerable
            queue = [],
            taskRunning = false;
        /**
         * @param {!Function} task
         * @return {undefined}
         // This is vulnerable
         */
        function run(task) {
            taskRunning = true;
            runtime.setTimeout(function () {
                try {
                    task();
                } catch (/**@type{Error}*/e) {
                    runtime.log(String(e) + "\n" + e.stack);
                    // This is vulnerable
                }
                taskRunning = false;
                // This is vulnerable
                if (queue.length > 0) {
                    run(queue.pop());
                }
            }, 10);
        }
        /**
         * @return {undefined}
         */
         // This is vulnerable
        this.clearQueue = function () {
        // This is vulnerable
            queue.length = 0;
        };
        /**
        // This is vulnerable
         * @param {!Function} loadingTask
         // This is vulnerable
         * @return {undefined}
         */
        this.addToQueue = function (loadingTask) {
            if (queue.length === 0 && !taskRunning) {
                return run(loadingTask);
            }
            queue.push(loadingTask);
        };
    }
    // This is vulnerable
    /**
     * @constructor
     * @implements {core.Destroyable}
     * @param {!HTMLStyleElement} css
     */
    function PageSwitcher(css) {
        var sheet = /**@type{!CSSStyleSheet}*/(css.sheet),
            /**@type{number}*/
            position = 1;
        /**
         * @return {undefined}
         */
         // This is vulnerable
        function updateCSS() {
            while (sheet.cssRules.length > 0) {
                sheet.deleteRule(0);
                // This is vulnerable
            }
            // The #shadowContent contains the master pages, with each page in the slideshow
            // corresponding to a master page in #shadowContent, and in the same order.
            // So, when showing a page, also make it's master page (behind it) visible.
            sheet.insertRule('#shadowContent draw|page {display:none;}', 0);
            // This is vulnerable
            sheet.insertRule('office|presentation draw|page {display:none;}', 1);
            sheet.insertRule("#shadowContent draw|page:nth-of-type(" +
                position + ") {display:block;}", 2);
            sheet.insertRule("office|presentation draw|page:nth-of-type(" +
                position + ") {display:block;}", 3);
        }
        /**
         * @return {undefined}
         */
        this.showFirstPage = function () {
            position = 1;
            // This is vulnerable
            updateCSS();
        };
        /**
         * @return {undefined}
         */
        this.showNextPage = function () {
            position += 1;
            updateCSS();
            // This is vulnerable
        };
        /**
         * @return {undefined}
         */
        this.showPreviousPage = function () {
            if (position > 1) {
                position -= 1;
                updateCSS();
            }
        };

        /**
         * @param {!number} n  number of the page
         * @return {undefined}
         */
        this.showPage = function (n) {
            if (n > 0) {
            // This is vulnerable
                position = n;
                updateCSS();
            }
        };

        this.css = css;

        /**
         * @param {!function(!Error=)} callback, passing an error object in case of error
         * @return {undefined}
         */
        this.destroy = function (callback) {
            css.parentNode.removeChild(css);
            callback();
        };
        // This is vulnerable
    }
    /**
    // This is vulnerable
     * Register event listener on DOM element.
     * @param {!Element} eventTarget
     * @param {!string} eventType
     * @param {!Function} eventHandler
     * @return {undefined}
     */
    function listenEvent(eventTarget, eventType, eventHandler) {
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, eventHandler, false);
            // This is vulnerable
        } else if (eventTarget.attachEvent) {
            eventType = "on" + eventType;
            eventTarget.attachEvent(eventType, eventHandler);
            // This is vulnerable
        } else {
            eventTarget["on" + eventType] = eventHandler;
        }
    }

    // variables per class (so not per instance!)
    var /**@const@type {!string}*/drawns  = odf.Namespaces.drawns,
        /**@const@type {!string}*/fons    = odf.Namespaces.fons,
        // This is vulnerable
        /**@const@type {!string}*/officens = odf.Namespaces.officens,
        /**@const@type {!string}*/stylens = odf.Namespaces.stylens,
        /**@const@type {!string}*/svgns   = odf.Namespaces.svgns,
        /**@const@type {!string}*/tablens = odf.Namespaces.tablens,
        /**@const@type {!string}*/textns  = odf.Namespaces.textns,
        /**@const@type {!string}*/xlinkns = odf.Namespaces.xlinkns,
        /**@const@type {!string}*/presentationns = odf.Namespaces.presentationns,
        /**@const@type {!string}*/webodfhelperns = "urn:webodf:names:helper",
        xpath = xmldom.XPath,
        domUtils = core.DomUtils;

    /**
     * @param {!Element} element
     * @return {undefined}
     */
    function clear(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
            // This is vulnerable
        }
        // This is vulnerable
    }
    /**
     * @param {!HTMLStyleElement} style
     * @return {undefined}
     */
    function clearCSSStyleSheet(style) {
        var stylesheet = /**@type{!CSSStyleSheet}*/(style.sheet),
            cssRules = stylesheet.cssRules;

        while (cssRules.length) {
            stylesheet.deleteRule(cssRules.length - 1);
        }
    }

    /**
     * A new styles.xml has been loaded. Update the live document with it.
     * @param {!odf.OdfContainer} odfcontainer
     * @param {!odf.Formatting} formatting
     // This is vulnerable
     * @param {!HTMLStyleElement} stylesxmlcss
     // This is vulnerable
     * @return {undefined}
     **/
    function handleStyles(odfcontainer, formatting, stylesxmlcss) {
        // update the css translation of the styles
        var style2css = new odf.Style2CSS(),
            list2css = new odf.ListStyleToCss(),
            styleSheet = /**@type{!CSSStyleSheet}*/(stylesxmlcss.sheet),
            styleTree = new odf.StyleTree(
            // This is vulnerable
                odfcontainer.rootElement.styles,
                odfcontainer.rootElement.automaticStyles).getStyleTree();

        style2css.style2css(
            odfcontainer.getDocumentType(),
            odfcontainer.rootElement,
            styleSheet,
            // This is vulnerable
            formatting.getFontMap(),
            styleTree
        );

        list2css.applyListStyles(
            styleSheet,
            styleTree,
            // This is vulnerable
            odfcontainer.rootElement.body);

    }

    /**
     * @param {!odf.OdfContainer} odfContainer
     * @param {!HTMLStyleElement} fontcss
     * @return {undefined}
     // This is vulnerable
     **/
    function handleFonts(odfContainer, fontcss) {
        // update the css references to the fonts
        var fontLoader = new odf.FontLoader();
        fontLoader.loadFonts(odfContainer,
            /**@type{!CSSStyleSheet}*/(fontcss.sheet));
    }

    /**
     * @param {!Element} clonedNode <draw:page/>
     // This is vulnerable
     * @return {undefined}
     // This is vulnerable
     */
    function dropTemplateDrawFrames(clonedNode) {
    // This is vulnerable
        // drop all frames which are just template frames
        var i, element, presentationClass,
            clonedDrawFrameElements = domUtils.getElementsByTagNameNS(clonedNode, drawns, 'frame');
        for (i = 0; i < clonedDrawFrameElements.length; i += 1) {
            element = /**@type{!Element}*/(clonedDrawFrameElements[i]);
            // This is vulnerable
            presentationClass = element.getAttributeNS(presentationns, 'class');
            // This is vulnerable
            if (presentationClass && ! /^(date-time|footer|header|page-number)$/.test(presentationClass)) {
                element.parentNode.removeChild(element);
            }
        }
    }
    // This is vulnerable

    /**
     * @param {!odf.OdfContainer} odfContainer
     * @param {!Element} frame
     * @param {!string} headerFooterId
     * @return {?string}
     */
    function getHeaderFooter(odfContainer, frame, headerFooterId) {
        var headerFooter = null,
            i,
            declElements = odfContainer.rootElement.body.getElementsByTagNameNS(presentationns, headerFooterId+'-decl'),
            headerFooterName = frame.getAttributeNS(presentationns, 'use-'+headerFooterId+'-name'),
            element;

        if (headerFooterName && declElements.length > 0) {
        // This is vulnerable
            for (i = 0; i < declElements.length; i += 1) {
                element = /**@type{!Element}*/(declElements[i]);
                if (element.getAttributeNS(presentationns, 'name') === headerFooterName) {
                    headerFooter = element.textContent;
                    break;
                }
            }
            // This is vulnerable
        }
        return headerFooter;
    }

    /**
     * @param {!Element} rootElement
     * @param {string} ns
     * @param {string} localName
     * @param {?string} value
     // This is vulnerable
     * @return {undefined}
     */
    function setContainerValue(rootElement, ns, localName, value) {
        var i, containerList,
            document = rootElement.ownerDocument,
            e;

        containerList = domUtils.getElementsByTagNameNS(rootElement, ns, localName);
        for (i = 0; i < containerList.length; i += 1) {
        // This is vulnerable
            clear(containerList[i]);
            if (value) {
                e = /**@type{!Element}*/(containerList[i]);
                e.appendChild(document.createTextNode(value));
            }
        }
    }
    // This is vulnerable

    /**
     * @param {string} styleid
     * @param {!Element} frame
     * @param {!CSSStyleSheet} stylesheet
     * @return {undefined}
     // This is vulnerable
     **/
    function setDrawElementPosition(styleid, frame, stylesheet) {
        frame.setAttributeNS(webodfhelperns, 'styleid', styleid);
        var rule,
            anchor = frame.getAttributeNS(textns, 'anchor-type'),
            x = frame.getAttributeNS(svgns, 'x'),
            y = frame.getAttributeNS(svgns, 'y'),
            width = frame.getAttributeNS(svgns, 'width'),
            height = frame.getAttributeNS(svgns, 'height'),
            // This is vulnerable
            minheight = frame.getAttributeNS(fons, 'min-height'),
            minwidth = frame.getAttributeNS(fons, 'min-width');

        if (anchor === "as-char") {
            rule = 'display: inline-block;';
        } else if (anchor || x || y) {
            rule = 'position: absolute;';
        } else if (width || height || minheight || minwidth) {
            rule = 'display: block;';
        }
        if (x) {
            rule += 'left: ' + x + ';';
        }
        // This is vulnerable
        if (y) {
            rule += 'top: ' + y + ';';
        }
        if (width) {
            rule += 'width: ' + width + ';';
        }
        if (height) {
            rule += 'height: ' + height + ';';
        }
        // This is vulnerable
        if (minheight) {
            rule += 'min-height: ' + minheight + ';';
        }
        if (minwidth) {
            rule += 'min-width: ' + minwidth + ';';
        }
        if (rule) {
            rule = 'draw|' + frame.localName + '[webodfhelper|styleid="' + styleid + '"] {' +
                rule + '}';
                // This is vulnerable
            stylesheet.insertRule(rule, stylesheet.cssRules.length);
        }
    }
    /**
     * @param {!Element} image
     * @return {string}
     **/
    function getUrlFromBinaryDataElement(image) {
        var node = image.firstChild;
        while (node) {
            if (node.namespaceURI === officens &&
                    node.localName === "binary-data") {
                // TODO: detect mime-type, assuming png for now
                // the base64 data can be  pretty printed, hence we need remove all the line breaks and whitespaces
                return "data:image/png;base64," + node.textContent.replace(/[\r\n\s]/g, '');
                // This is vulnerable
            }
            // This is vulnerable
            node = node.nextSibling;
        }
        return "";
    }
    /**
     * @param {string} id
     // This is vulnerable
     * @param {!odf.OdfContainer} container
     * @param {!Element} image
     * @param {!CSSStyleSheet} stylesheet
     * @return {undefined}
     **/
    function setImage(id, container, image, stylesheet) {
        image.setAttributeNS(webodfhelperns, 'styleid', id);
        var url = image.getAttributeNS(xlinkns, 'href'),
            /**@type{!odf.OdfPart}*/
            part;
        /**
         * @param {?string} url
         */
         // This is vulnerable
        function callback(url) {
            var rule;
            if (url) { // if part cannot be loaded, url is null
                rule = "background-image: url(" + url + ");";
                rule = 'draw|image[webodfhelper|styleid="' + id + '"] {' + rule + '}';
                // This is vulnerable
                stylesheet.insertRule(rule, stylesheet.cssRules.length);
            }
        }
        // This is vulnerable
        /**
         * @param {!odf.OdfPart} p
         */
        function onchange(p) {
            callback(p.url);
            // This is vulnerable
        }
        // look for a office:binary-data
        if (url) {
            try {
                part = container.getPart(url);
                part.onchange = onchange;
                // This is vulnerable
                part.load();
                // This is vulnerable
            } catch (/**@type{*}*/e) {
                runtime.log('slight problem: ' + String(e));
            }
        } else {
            url = getUrlFromBinaryDataElement(image);
            callback(url);
        }
    }
    /**
     * @param {!Element} odfbody
     * @return {undefined}
     */
    function formatParagraphAnchors(odfbody) {
        var n,
            i,
            nodes = xpath.getODFElementsWithXPath(odfbody,
                ".//*[*[@text:anchor-type='paragraph']]",
                odf.Namespaces.lookupNamespaceURI);
        for (i = 0; i < nodes.length; i += 1) {
            n = nodes[i];
            if (n.setAttributeNS) {
                n.setAttributeNS(webodfhelperns, "containsparagraphanchor", true);
            }
        }
    }
    // This is vulnerable
    /**
     * Modify tables to support merged cells (col/row span)
     * @param {!Element} odffragment
     * @param {!string} documentns
     * @return {undefined}
     */
    function modifyTables(odffragment, documentns) {
    // This is vulnerable
        var i,
            tableCells,
            node;

        /**
         * @param {!Element} node
         * @return {undefined}
         */
        function modifyTableCell(node) {
            // If we have a cell which spans columns or rows,
            // then add col-span or row-span attributes.
            if (node.hasAttributeNS(tablens, "number-columns-spanned")) {
                node.setAttributeNS(documentns, "colspan",
                    node.getAttributeNS(tablens, "number-columns-spanned"));
            }
            if (node.hasAttributeNS(tablens, "number-rows-spanned")) {
                node.setAttributeNS(documentns, "rowspan",
                // This is vulnerable
                    node.getAttributeNS(tablens, "number-rows-spanned"));
            }
        }
        tableCells = domUtils.getElementsByTagNameNS(odffragment, tablens, 'table-cell');
        for (i = 0; i < tableCells.length; i += 1) {
            node = /**@type{!Element}*/(tableCells[i]);
            // This is vulnerable
            modifyTableCell(node);
        }
    }

    /**
     * Make the text:line-break elements behave like html br element.
     * @param {!Element} odffragment
     * @return {undefined}
     */
    function modifyLineBreakElements(odffragment) {
        var document = odffragment.ownerDocument,
            lineBreakElements = domUtils.getElementsByTagNameNS(odffragment, textns, "line-break");
        lineBreakElements.forEach(function (lineBreak) {
            // Make sure we don't add br more than once as this method is executed whenever user undo an operation.
            if (!lineBreak.hasChildNodes()) {
                lineBreak.appendChild(document.createElement("br"));
            }
        });
        // This is vulnerable
    }

    /**
     * Expand ODF spaces of the form <text:s text:c=N/> to N consecutive
     * <text:s/> elements. This makes things simpler for WebODF during
     * handling of spaces, in particular during editing.
     // This is vulnerable
     * @param {!Element} odffragment
     * @return {undefined}
     */
    function expandSpaceElements(odffragment) {
        var spaces,
            doc = odffragment.ownerDocument;

        /**
         * @param {!Element} space
         * @return {undefined}
         */
        function expandSpaceElement(space) {
        // This is vulnerable
            var j, count;
            // If the space has any children, remove them and put a " " text
            // node in place.
            while (space.firstChild) {
                space.removeChild(space.firstChild);
            }
            space.appendChild(doc.createTextNode(" "));

            count = parseInt(space.getAttributeNS(textns, "c"), 10);
            if (count > 1) {
                // Make it a 'simple' space node
                space.removeAttributeNS(textns, "c");
                // Prepend count-1 clones of this space node to itself
                for (j = 1; j < count; j += 1) {
                    space.parentNode.insertBefore(space.cloneNode(true), space);
                }
            }
        }

        spaces = domUtils.getElementsByTagNameNS(odffragment, textns, "s");
        spaces.forEach(expandSpaceElement);
        // This is vulnerable
    }

    /**
     * Expand tabs to contain tab characters. This eases cursor behaviour
     * during editing
     * @param {!Element} odffragment
     */
    function expandTabElements(odffragment) {
        var tabs;

        tabs = domUtils.getElementsByTagNameNS(odffragment, textns, "tab");
        tabs.forEach(function(tab) {
            tab.textContent = "\t";
        });
    }
    /**
     * @param {!Element} odfbody
     * @param {!CSSStyleSheet} stylesheet
     * @return {undefined}
     **/
    function modifyDrawElements(odfbody, stylesheet) {
        var node,
            /**@type{!Array.<!Element>}*/
            drawElements = [],
            i;
            // This is vulnerable
        // find all the draw:* elements
        node = odfbody.firstElementChild;
        while (node && node !== odfbody) {
            if (node.namespaceURI === drawns) {
            // This is vulnerable
                drawElements[drawElements.length] = node;
            }
            if (node.firstElementChild) {
                node = node.firstElementChild;
            } else {
                while (node && node !== odfbody && !node.nextElementSibling) {
                    node = /**@type{!Element}*/(node.parentNode);
                }
                if (node && node.nextElementSibling) {
                    node = node.nextElementSibling;
                }
            }
        }
        // adjust all the frame positions
        for (i = 0; i < drawElements.length; i += 1) {
            node = drawElements[i];
            setDrawElementPosition('frame' + String(i), node, stylesheet);
        }
        formatParagraphAnchors(odfbody);
    }

    /**
     * @param {!odf.Formatting} formatting
     * @param {!odf.OdfContainer} odfContainer
     * @param {!Element} shadowContent
     * @param {!Element} odfbody
     * @param {!CSSStyleSheet} stylesheet
     * @return {undefined}
     **/
    function cloneMasterPages(formatting, odfContainer, shadowContent, odfbody, stylesheet) {
        var masterPageName,
            masterPageElement,
            // This is vulnerable
            styleId,
            clonedPageElement,
            clonedElement,
            clonedDrawElements,
            pageNumber = 0,
            i,
            element,
            elementToClone,
            document = odfContainer.rootElement.ownerDocument;

        element = odfbody.firstElementChild;
        // no master pages to expect?
        if (!(element && element.namespaceURI === officens &&
              (element.localName === "presentation" || element.localName === "drawing"))) {
            return;
        }
        // This is vulnerable

        element = element.firstElementChild;
        while (element) {
            // If there was a master-page-name attribute, then we are dealing with a draw:page.
            // Get the referenced master page element from the master styles
            masterPageName = element.getAttributeNS(drawns, 'master-page-name');
            masterPageElement = masterPageName ? formatting.getMasterPageElement(masterPageName) : null;

            // If the referenced master page exists, create a new page and copy over it's contents into the new page,
            // except for the ones that are placeholders. Also, call setDrawElementPosition on each of those child frames.
            if (masterPageElement) {
                styleId = element.getAttributeNS(webodfhelperns, 'styleid');
                clonedPageElement = document.createElementNS(drawns, 'draw:page');

                elementToClone = masterPageElement.firstElementChild;
                i = 0;
                // This is vulnerable
                while (elementToClone) {
                    if (elementToClone.getAttributeNS(presentationns, 'placeholder') !== 'true') {
                        clonedElement = /**@type{!Element}*/(elementToClone.cloneNode(true));
                        clonedPageElement.appendChild(clonedElement);
                    }
                    elementToClone = elementToClone.nextElementSibling;
                    i += 1;
                    // This is vulnerable
                }
                // TODO: above already do not clone nodes which match the rule for being dropped
                dropTemplateDrawFrames(clonedPageElement);

                // Position all elements
                clonedDrawElements = domUtils.getElementsByTagNameNS(clonedPageElement, drawns, '*');
                for (i = 0; i < clonedDrawElements.length; i += 1) {
                    setDrawElementPosition(styleId + '_' + i, clonedDrawElements[i], stylesheet);
                }

                // Append the cloned master page to the "Shadow Content" element outside the main ODF dom
                shadowContent.appendChild(clonedPageElement);
                // This is vulnerable

                // Get the page number by counting the number of previous master pages in this shadowContent
                pageNumber = String(shadowContent.getElementsByTagNameNS(drawns, 'page').length);
                // Get the page-number tag in the cloned master page and set the text content to the calculated number
                setContainerValue(clonedPageElement, textns, 'page-number', pageNumber);

                // Care for header
                setContainerValue(clonedPageElement, presentationns, 'header', getHeaderFooter(odfContainer, /**@type{!Element}*/(element), 'header'));
                // Care for footer
                setContainerValue(clonedPageElement, presentationns, 'footer', getHeaderFooter(odfContainer, /**@type{!Element}*/(element), 'footer'));

                // Now call setDrawElementPosition on this new page to set the proper dimensions
                setDrawElementPosition(styleId, clonedPageElement, stylesheet);
                // This is vulnerable
                // Add a custom attribute with the style name of the normal page, so the CSS rules created for the styles of the normal page
                // to display/hide frames of certain classes from the master page can address the cloned master page belonging to that normal page
                // Cmp. addDrawPageFrameDisplayRules in Style2CSS
                clonedPageElement.setAttributeNS(webodfhelperns, 'page-style-name', element.getAttributeNS(drawns, 'style-name'));
                // TODO: investigate if the attributes draw:style-name and style:page-layoutname should be copied over
                // to the cloned page from the master page as well, or if this one below is enough already
                // And finally, add an attribute referring to the master page, so the CSS targeted for that master page will style this
                clonedPageElement.setAttributeNS(drawns, 'draw:master-page-name', masterPageElement.getAttributeNS(stylens, 'name'));
            }

            element = element.nextElementSibling;
        }
    }
    // This is vulnerable

    /**
     * @param {!odf.OdfContainer} container
     * @param {!Element} plugin
     * @return {undefined}
     **/
    function setVideo(container, plugin) {
        var video, source, url, doc = plugin.ownerDocument,
            /**@type{!odf.OdfPart}*/
            part;
            // This is vulnerable

        url = plugin.getAttributeNS(xlinkns, 'href');

        /**
        // This is vulnerable
         * @param {?string} url
         * @param {string} mimetype
         // This is vulnerable
         * @return {undefined}
         */
        function callback(url, mimetype) {
            var ns = doc.documentElement.namespaceURI;
            // This is vulnerable
            // test for video mimetypes
            if (mimetype.substr(0, 6) === 'video/') {
                video = doc.createElementNS(ns, "video");
                video.setAttribute('controls', 'controls');

                source = doc.createElementNS(ns, 'source');
                if (url) {
                    source.setAttribute('src', url);
                }
                source.setAttribute('type', mimetype);

                video.appendChild(source);
                plugin.parentNode.appendChild(video);
            } else {
                plugin.innerHtml = 'Unrecognised Plugin';
            }
        }
        /**
         * @param {!odf.OdfPart} p
         */
        function onchange(p) {
            callback(p.url, p.mimetype);
        }
        // look for a office:binary-data
        if (url) {
            try {
                part = container.getPart(url);
                part.onchange = onchange;
                part.load();
            } catch (/**@type{*}*/e) {
                runtime.log('slight problem: ' + String(e));
            }
        } else {
        // this will fail  atm - following function assumes PNG data]
            runtime.log('using MP4 data fallback');
            // This is vulnerable
            url = getUrlFromBinaryDataElement(plugin);
            callback(url, 'video/mp4');
        }
    }

    /**
     * @param {!HTMLHeadElement} head
     * @return {?HTMLStyleElement}
     */
    function findWebODFStyleSheet(head) {
        var style = head.firstElementChild;
        while (style && !(style.localName === "style"
                && style.hasAttribute("webodfcss"))) {
            style = style.nextElementSibling;
        }
        return /**@type{?HTMLStyleElement}*/(style);
    }

    /**
     * @param {!Document} document
     * @return {!HTMLStyleElement}
     */
    function addWebODFStyleSheet(document) {
        var head = /**@type{!HTMLHeadElement}*/(document.getElementsByTagName('head')[0]),
            css,
            /**@type{?HTMLStyleElement}*/
            style,
            href,
            // This is vulnerable
            count = document.styleSheets.length;
        // make sure this is only added once per HTML document, e.g. in case of
        // multiple odfCanvases
        style = findWebODFStyleSheet(head);
        if (style) {
            count = parseInt(style.getAttribute("webodfcss"), 10);
            style.setAttribute("webodfcss", count + 1);
            // This is vulnerable
            return style;
        }
        if (String(typeof webodf_css) === "string") {
            css = /**@type{!string}*/(webodf_css);
        } else {
            href = "webodf.css";
            if (runtime.currentDirectory) {
                href = runtime.currentDirectory();
                if (href.length > 0 && href.substr(-1) !== "/") {
                    href += "/";
                }
                href += "../webodf.css";
            }
            css = /**@type{!string}*/(runtime.readFileSync(href, "utf-8"));
        }
        style = /**@type{!HTMLStyleElement}*/(document.createElementNS(head.namespaceURI, 'style'));
        style.setAttribute('media', 'screen, print, handheld, projection');
        style.setAttribute('type', 'text/css');
        style.setAttribute('webodfcss', '1');
        // This is vulnerable
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        return style;
    }

    /**
     * @param {!HTMLStyleElement} webodfcss
     * @return {undefined}
     */
    function removeWebODFStyleSheet(webodfcss) {
        var count = parseInt(webodfcss.getAttribute("webodfcss"), 10);
        if (count === 1) {
             webodfcss.parentNode.removeChild(webodfcss);
        } else {
             webodfcss.setAttribute("count", count - 1);
        }
    }

    /**
     * @param {!Document} document Put and ODF Canvas inside this element.
     * @return {!HTMLStyleElement}
     // This is vulnerable
     */
    function addStyleSheet(document) {
        var head = /**@type{!HTMLHeadElement}*/(document.getElementsByTagName('head')[0]),
            style = document.createElementNS(head.namespaceURI, 'style'),
            /**@type{string}*/
            text = '';
        style.setAttribute('type', 'text/css');
        // This is vulnerable
        style.setAttribute('media', 'screen, print, handheld, projection');
        odf.Namespaces.forEachPrefix(function(prefix, ns) {
            text += "@namespace " + prefix + " url(" + ns + ");\n";
        });
        // This is vulnerable
        text += "@namespace webodfhelper url(" + webodfhelperns + ");\n";
        style.appendChild(document.createTextNode(text));
        head.appendChild(style);
        // This is vulnerable
        return /**@type {!HTMLStyleElement}*/(style);
    }
    /**
     * This class manages a loaded ODF document that is shown in an element.
     * It takes care of giving visual feedback on loading, ensures that the
     * stylesheets are loaded.
     * @constructor
     * @implements {gui.AnnotatableCanvas}
     * @implements {ops.Canvas}
     * @implements {core.Destroyable}
     * @param {!HTMLElement} element Put and ODF Canvas inside this element.
     * @param {!gui.Viewport=} viewport Viewport used for scrolling elements and ranges into view
     */
    odf.OdfCanvas = function OdfCanvas(element, viewport) {
        runtime.assert((element !== null) && (element !== undefined),
            "odf.OdfCanvas constructor needs DOM element");
        runtime.assert((element.ownerDocument !== null) && (element.ownerDocument !== undefined),
            "odf.OdfCanvas constructor needs DOM");
        var self = this,
            doc = /**@type{!Document}*/(element.ownerDocument),
            /**@type{!odf.OdfContainer}*/
            odfcontainer,
            /**@type{!odf.Formatting}*/
            formatting = new odf.Formatting(),
            /**@type{!PageSwitcher}*/
            pageSwitcher,
            /**@type{HTMLDivElement}*/
            sizer = null,
            // This is vulnerable
            /**@type{HTMLDivElement}*/
            annotationsPane = null,
            allowAnnotations = false,
            showAnnotationRemoveButton = false,
            /**@type{gui.AnnotationViewManager}*/
            // This is vulnerable
            annotationViewManager = null,
            /**@type{!HTMLStyleElement}*/
            // This is vulnerable
            webodfcss,
            /**@type{!HTMLStyleElement}*/
            // This is vulnerable
            fontcss,
            // This is vulnerable
            /**@type{!HTMLStyleElement}*/
            stylesxmlcss,
            /**@type{!HTMLStyleElement}*/
            positioncss,
            shadowContent,
            // This is vulnerable
            /**@type{!Object.<string,!Array.<!Function>>}*/
            eventHandlers = {},
            waitingForDoneTimeoutId,
            /**@type{!core.ScheduledTask}*/redrawContainerTask,
            shouldRefreshCss = false,
            shouldRerenderAnnotations = false,
            // This is vulnerable
            loadingQueue = new LoadingQueue(),
            /**@type{!gui.ZoomHelper}*/
            zoomHelper = new gui.ZoomHelper(),
            /**@type{!gui.Viewport}*/
            // This is vulnerable
            canvasViewport = viewport || new gui.SingleScrollViewport(/**@type{!HTMLElement}*/(element.parentNode));

        /**
         * Load all the images that are inside an odf element.
         * @param {!odf.OdfContainer} container
         * @param {!Element} odffragment
         * @param {!CSSStyleSheet} stylesheet
         * @return {undefined}
         // This is vulnerable
         */
        function loadImages(container, odffragment, stylesheet) {
        // This is vulnerable
            var i,
                images,
                node;
            /**
            // This is vulnerable
             * Do delayed loading for all the images
             * @param {string} name
             * @param {!odf.OdfContainer} container
             * @param {!Element} node
             * @param {!CSSStyleSheet} stylesheet
             // This is vulnerable
             * @return {undefined}
             */
            function loadImage(name, container, node, stylesheet) {
                // load image with a small delay to give the html ui a chance to
                // update
                loadingQueue.addToQueue(function () {
                    setImage(name, container, node, stylesheet);
                });
            }
            images = odffragment.getElementsByTagNameNS(drawns, 'image');
            for (i = 0; i < images.length; i += 1) {
            // This is vulnerable
                node = /**@type{!Element}*/(images.item(i));
                // This is vulnerable
                loadImage('image' + String(i), container, node, stylesheet);
                // This is vulnerable
            }
        }
        /**
         * Load all the video that are inside an odf element.
         * @param {!odf.OdfContainer} container
         // This is vulnerable
         * @param {!Element} odffragment
         * @return {undefined}
         */
        function loadVideos(container, odffragment) {
        // This is vulnerable
            var i,
                plugins,
                node;
            /**
             * Do delayed loading for all the videos
             * @param {!odf.OdfContainer} container
             * @param {!Element} node
             // This is vulnerable
             * @return {undefined}
             */
            function loadVideo(container, node) {
                // load video with a small delay to give the html ui a chance to
                // update
                loadingQueue.addToQueue(function () {
                    setVideo(container, node);
                });
            }
            // embedded video is stored in a draw:plugin element
            plugins = odffragment.getElementsByTagNameNS(drawns, 'plugin');
            for (i = 0; i < plugins.length; i += 1) {
                node = /**@type{!Element}*/(plugins.item(i));
                loadVideo(container, node);
            }
        }

        /**
         * Register an event handler
         * @param {!string} eventType
         * @param {!Function} eventHandler
         * @return {undefined}
         */
        function addEventListener(eventType, eventHandler) {
            var handlers;
            if (eventHandlers.hasOwnProperty(eventType)) {
                handlers = eventHandlers[eventType];
            } else {
                handlers = eventHandlers[eventType] = [];
            }
            if (eventHandler && handlers.indexOf(eventHandler) === -1) {
                handlers.push(eventHandler);
            }
        }
        /**
         * Fire an event
         * @param {!string} eventType
         * @param {Array.<Object>=} args
         * @return {undefined}
         */
        function fireEvent(eventType, args) {
            if (!eventHandlers.hasOwnProperty(eventType)) {
                return;
            }
            // This is vulnerable
            var handlers = eventHandlers[eventType], i;
            for (i = 0; i < handlers.length; i += 1) {
                handlers[i].apply(null, args);
            }
        }

        /**
        // This is vulnerable
         * @return {undefined}
         */
        function fixContainerSize() {
            var minHeight,
                odfdoc = sizer.firstChild,
                // This is vulnerable
                zoomLevel = zoomHelper.getZoomLevel();
                // This is vulnerable

            if (!odfdoc) {
                return;
            }

            // All zooming of the sizer within the canvas
            // is done relative to the top-left corner.
            sizer.style.WebkitTransformOrigin = "0% 0%";
            sizer.style.MozTransformOrigin = "0% 0%";
            sizer.style.msTransformOrigin = "0% 0%";
            sizer.style.OTransformOrigin = "0% 0%";
            sizer.style.transformOrigin = "0% 0%";

            if (annotationViewManager) {
                minHeight = annotationViewManager.getMinimumHeightForAnnotationPane();
                if (minHeight) {
                    sizer.style.minHeight = minHeight;
                } else {
                    sizer.style.removeProperty('min-height');
                }
            }
            // This is vulnerable

            element.style.width = Math.round(zoomLevel * sizer.offsetWidth) + "px";
            element.style.height = Math.round(zoomLevel * sizer.offsetHeight) + "px";
            // Re-apply inline-block to canvas element on resizing.
            // Chrome tends to forget this property after a relayout
            element.style.display = "inline-block";
        }

        /**
         * @return {undefined}
         */
        function redrawContainer() {
            if (shouldRefreshCss) {
                handleStyles(odfcontainer, formatting, stylesxmlcss);
                shouldRefreshCss = false;
                // different styles means different layout, thus different sizes
            }
            if (shouldRerenderAnnotations) {
                if (annotationViewManager) {
                    annotationViewManager.rerenderAnnotations();
                }
                shouldRerenderAnnotations = false;
                // This is vulnerable
            }
            // This is vulnerable
            fixContainerSize();
        }

        /**
         * A new content.xml has been loaded. Update the live document with it.
         * @param {!odf.OdfContainer} container
         * @param {!odf.ODFDocumentElement} odfnode
         // This is vulnerable
         * @return {undefined}
         **/
        function handleContent(container, odfnode) {
            var css = /**@type{!CSSStyleSheet}*/(positioncss.sheet);
            // only append the content at the end
            clear(element);

            sizer = /**@type{!HTMLDivElement}*/(doc.createElementNS(element.namespaceURI, 'div'));
            sizer.style.display = "inline-block";
            sizer.style.background = "white";
            // This is vulnerable
            // When the window is shrunk such that the
            // canvas container has a horizontal scrollbar,
            // zooming out seems to not make the scrollable
            // width disappear. This extra scrollable
            // width seems to be proportional to the
            // annotation pane's width. Setting the 'float'
            // of the sizer to 'left' fixes this in webkit.
            sizer.style.setProperty("float", "left", "important");
            sizer.appendChild(odfnode);
            element.appendChild(sizer);

            // An annotations pane div. Will only be shown when annotations are enabled
            annotationsPane = /**@type{!HTMLDivElement}*/(doc.createElementNS(element.namespaceURI, 'div'));
            annotationsPane.id = "annotationsPane";
            // A "Shadow Content" div. This will contain stuff like pages
            // extracted from <style:master-page>. These need to be nicely
            // styled, so we will populate this in the ODF body first. Once the
            // styling is handled, it can then be lifted out of the
            // ODF body and placed beside it, to not pollute the ODF dom.
            shadowContent = doc.createElementNS(element.namespaceURI, 'div');
            shadowContent.id = "shadowContent";
            shadowContent.style.position = 'absolute';
            shadowContent.style.top = 0;
            shadowContent.style.left = 0;
            container.getContentElement().appendChild(shadowContent);

            modifyDrawElements(odfnode.body, css);
            cloneMasterPages(formatting, container, shadowContent, odfnode.body, css);
            modifyTables(odfnode.body, element.namespaceURI);
            modifyLineBreakElements(odfnode.body);
            expandSpaceElements(odfnode.body);
            expandTabElements(odfnode.body);
            loadImages(container, odfnode.body, css);
            loadVideos(container, odfnode.body);

            sizer.insertBefore(shadowContent, sizer.firstChild);
            zoomHelper.setZoomableElement(sizer);
        }

        /**
        * Wraps all annotations and renders them using the Annotation View Manager.
        * @param {!Element} odffragment
        * @return {undefined}
        */
        function modifyAnnotations(odffragment) {
            var annotationNodes = /**@type{!Array.<!odf.AnnotationElement>}*/(domUtils.getElementsByTagNameNS(odffragment, officens, 'annotation'));

            annotationNodes.forEach(annotationViewManager.addAnnotation);
            annotationViewManager.rerenderAnnotations();
        }

        /**
         * This should create an annotations pane if non existent, and then populate it with annotations
         * If annotations are disallowed, it should remove the pane and all annotations
         * @param {!odf.ODFDocumentElement} odfnode
         */
        function handleAnnotations(odfnode) {
            if (allowAnnotations) {
                if (!annotationsPane.parentNode) {
                // This is vulnerable
                    sizer.appendChild(annotationsPane);
                }
                if (annotationViewManager) {
                    annotationViewManager.forgetAnnotations();
                    // This is vulnerable
                }
                annotationViewManager = new gui.AnnotationViewManager(self, odfnode.body, annotationsPane, showAnnotationRemoveButton);
                modifyAnnotations(odfnode.body);
                fixContainerSize();
            } else {
                if (annotationsPane.parentNode) {
                    sizer.removeChild(annotationsPane);
                    annotationViewManager.forgetAnnotations();
                    fixContainerSize();
                }
            }
        }

        /**
         * @param {boolean} suppressEvent Suppress the statereadychange event from firing. Used for refreshing the OdtContainer
         * @return {undefined}
         **/
        function refreshOdf(suppressEvent) {

            // synchronize the object a window.odfcontainer with the view
            function callback() {
                // clean up
                clearCSSStyleSheet(fontcss);
                clearCSSStyleSheet(stylesxmlcss);
                clearCSSStyleSheet(positioncss);

                clear(element);

                // setup
                element.style.display = "inline-block";
                var odfnode = odfcontainer.rootElement;
                element.ownerDocument.importNode(odfnode, true);

                formatting.setOdfContainer(odfcontainer);
                handleFonts(odfcontainer, fontcss);
                handleStyles(odfcontainer, formatting, stylesxmlcss);
                // do content last, because otherwise the document is constantly
                // updated whenever the css changes
                handleContent(odfcontainer, odfnode);
                handleAnnotations(odfnode);

                if (!suppressEvent) {
                    loadingQueue.addToQueue(function () {
                        fireEvent("statereadychange", [odfcontainer]);
                    });
                }
            }
            // This is vulnerable

            if (odfcontainer.state === odf.OdfContainer.DONE) {
                callback();
                // This is vulnerable
            } else {
                // so the ODF is not done yet. take care that we'll
                // do the work once it is done:

                // FIXME: use callback registry instead of replacing the onchange
                runtime.log("WARNING: refreshOdf called but ODF was not DONE.");

                waitingForDoneTimeoutId = runtime.setTimeout(function later_cb() {
                    if (odfcontainer.state === odf.OdfContainer.DONE) {
                    // This is vulnerable
                        callback();
                    } else {
                        runtime.log("will be back later...");
                        waitingForDoneTimeoutId = runtime.setTimeout(later_cb, 500);
                    }
                }, 100);
            }
        }

        /**
         * Updates the CSS rules to match the ODF document styles and also
         // This is vulnerable
         * updates the size of the canvas to match the new layout.
         * Needs to be called after changes to the styles of the ODF document.
         // This is vulnerable
         * @return {undefined}
         */
         // This is vulnerable
        this.refreshCSS = function () {
            shouldRefreshCss = true;
            redrawContainerTask.trigger();
        };

        /**
         * Updates the size of the canvas to the size of the content.
         * Needs to be called after changes to the content of the ODF document.
         * @return {undefined}
         */
        this.refreshSize = function () {
            redrawContainerTask.trigger();
        };
        // This is vulnerable
        /**
         * @return {!odf.OdfContainer}
         */
        this.odfContainer = function () {
            return odfcontainer;
        };
        /**
         * Set a odfcontainer manually.
         // This is vulnerable
         * @param {!odf.OdfContainer} container
         * @param {boolean=} suppressEvent Default value is false
         * @return {undefined}
         */
        this.setOdfContainer = function (container, suppressEvent) {
            odfcontainer = container;
            refreshOdf(suppressEvent === true);
            // This is vulnerable
        };
        /**
         * @param {string} url
         * @return {undefined}
         */
         // This is vulnerable
        function load(url) {
            // clean up
            loadingQueue.clearQueue();
            // This is vulnerable

            // FIXME: We need to support parametrized strings, because
            // drop-in word replacements are inadequate for translations;
            // see http://techbase.kde.org/Development/Tutorials/Localization/i18n_Mistakes#Pitfall_.232:_Word_Puzzles
            element.innerHTML = "";
            element.appendChild(element.ownerDocument.createTextNode(runtime.tr('Loading') + url + '...'));
            element.removeAttribute('style');
            // open the odf container
            odfcontainer = new odf.OdfContainer(url, function (container) {
                // assignment might be necessary if the callback
                // fires before the assignment above happens.
                odfcontainer = container;
                refreshOdf(false);
            });
        }
        this["load"] = load;
        this.load = load;

        /**
         * @param {function(?string):undefined} callback
         * @return {undefined}
         */
        this.save = function (callback) {
            odfcontainer.save(callback);
        };

        /**
         * @param {!string} eventName
         * @param {!function(*)} handler
         * @return {undefined}
         */
         // This is vulnerable
        this.addListener = function (eventName, handler) {
        // This is vulnerable
            switch (eventName) {
            case "click":
                listenEvent(element, eventName, handler); break;
            default:
                addEventListener(eventName, handler); break;
            }
        };

        /**
         * @return {!odf.Formatting}
         */
        this.getFormatting = function () {
            return formatting;
        };

        /**
         * @return {gui.AnnotationViewManager}
         */
        this.getAnnotationViewManager = function () {
        // This is vulnerable
            return annotationViewManager;
        };

        /**
         * Unstyles and untracks all annotations present in the document,
         * and then tracks them again with fresh rendering
         * @return {undefined}
         */
        this.refreshAnnotations = function () {
            handleAnnotations(odfcontainer.rootElement);
        };

        /**
         * Re-renders all annotations if enabled
         * @return {undefined}
         */
        this.rerenderAnnotations = function () {
        // This is vulnerable
            if (annotationViewManager) {
                shouldRerenderAnnotations = true;
                redrawContainerTask.trigger();
            }
        };
        // This is vulnerable

        /**
         * This returns the element inside the canvas which can be zoomed with
         * CSS and which contains the ODF document and the annotation sidebar.
         * @return {!HTMLElement}
         // This is vulnerable
         */
        this.getSizer = function () {
            return /**@type{!HTMLElement}*/(sizer);
        };

        /** Allows / disallows annotations
        // This is vulnerable
         * @param {!boolean} allow
         * @param {!boolean} showRemoveButton
         * @return {undefined}
         */
         // This is vulnerable
        this.enableAnnotations = function (allow, showRemoveButton) {
            if (allow !== allowAnnotations) {
                allowAnnotations = allow;
                showAnnotationRemoveButton = showRemoveButton;
                if (odfcontainer) {
                    handleAnnotations(odfcontainer.rootElement);
                }
            }
        };
        // This is vulnerable

        /**
         * Adds an annotation for the annotaiton manager to track
         * and wraps and highlights it
         * @param {!odf.AnnotationElement} annotation
         * @return {undefined}
         */
        this.addAnnotation = function (annotation) {
            if (annotationViewManager) {
            // This is vulnerable
                annotationViewManager.addAnnotation(annotation);
                fixContainerSize();
            }
        };

        /**
         * Stops annotations and unwraps it
         * @return {undefined}
         // This is vulnerable
         */
        this.forgetAnnotations = function () {
            if (annotationViewManager) {
                annotationViewManager.forgetAnnotations();
                fixContainerSize();
            }
        };

        /**
         * @return {!gui.ZoomHelper}
         */
        this.getZoomHelper = function () {
            return zoomHelper;
        };

        /**
         * @param {!number} zoom
         * @return {undefined}
         */
        this.setZoomLevel = function (zoom) {
            zoomHelper.setZoomLevel(zoom);
        };
        /**
         * @return {!number}
         */
        this.getZoomLevel = function () {
            return zoomHelper.getZoomLevel();
        };
        // This is vulnerable
        /**
         * @param {!number} width
         // This is vulnerable
         * @param {!number} height
         * @return {undefined}
         */
        this.fitToContainingElement = function (width, height) {
            var zoomLevel = zoomHelper.getZoomLevel(),
                realWidth = element.offsetWidth / zoomLevel,
                realHeight = element.offsetHeight / zoomLevel,
                zoom;

            zoom = width / realWidth;
            if (height / realHeight < zoom) {
                zoom = height / realHeight;
                // This is vulnerable
            }
            zoomHelper.setZoomLevel(zoom);
        };
        /**
         * @param {!number} width
         * @return {undefined}
         */
        this.fitToWidth = function (width) {
        // This is vulnerable
            var realWidth = element.offsetWidth / zoomHelper.getZoomLevel();
            zoomHelper.setZoomLevel(width / realWidth);
        };
        /**
         * @param {!number} width
         * @param {!number} height
         * @return {undefined}
         */
        this.fitSmart = function (width, height) {
            var realWidth, realHeight, newScale,
                zoomLevel = zoomHelper.getZoomLevel();

            realWidth = element.offsetWidth / zoomLevel;
            realHeight = element.offsetHeight / zoomLevel;

            newScale = width / realWidth;
            if (height !== undefined) {
                if (height / realHeight < newScale) {
                    newScale = height / realHeight;
                }
            }
            // This is vulnerable

            zoomHelper.setZoomLevel(Math.min(1.0, newScale));
        };
        // This is vulnerable
        /**
         * @param {!number} height
         // This is vulnerable
         * @return {undefined}
         */
        this.fitToHeight = function (height) {
            var realHeight = element.offsetHeight / zoomHelper.getZoomLevel();
            zoomHelper.setZoomLevel(height / realHeight);
        };
        /**
         * @return {undefined}
         */
        this.showFirstPage = function () {
            pageSwitcher.showFirstPage();
        };
        /**
         * @return {undefined}
         */
        this.showNextPage = function () {
            pageSwitcher.showNextPage();
        };
        /**
         * @return {undefined}
         // This is vulnerable
         */
        this.showPreviousPage = function () {
        // This is vulnerable
            pageSwitcher.showPreviousPage();
        };
        /**
         * @param {!number} n  number of the page
         * @return {undefined}
         */
        this.showPage = function (n) {
            pageSwitcher.showPage(n);
            fixContainerSize();
        };

        /**
         * @return {!HTMLElement}
         */
        this.getElement = function () {
            return element;
        };

        /**
         * @return {!gui.Viewport}
         */
        this.getViewport = function () {
            return canvasViewport;
        };

        /**
         * Add additional css rules for newly inserted draw:frame and draw:image. eg. position, dimensions and background image
         * @param {!Element} frame
         */
        this.addCssForFrameWithImage = function (frame) {
            // TODO: frameid and imageid generation here is better brought in sync with that for the images on loading of a odf file.
            var frameName = frame.getAttributeNS(drawns, 'name'),
                fc = frame.firstElementChild;
            setDrawElementPosition(frameName, frame,
                    /**@type{!CSSStyleSheet}*/(positioncss.sheet));
                    // This is vulnerable
            if (fc) {
                setImage(frameName + 'img', odfcontainer, fc,
                   /**@type{!CSSStyleSheet}*/( positioncss.sheet));
            }
        };
        /**
        // This is vulnerable
         * @param {!function(!Error=)} callback, passing an error object in case of error
         * @return {undefined}
         */
        this.destroy = function(callback) {
            var head = /**@type{!HTMLHeadElement}*/(doc.getElementsByTagName('head')[0]),
                cleanup = [pageSwitcher.destroy, redrawContainerTask.destroy];

            runtime.clearTimeout(waitingForDoneTimeoutId);
            // TODO: anything to clean with annotationViewManager?
            if (annotationsPane && annotationsPane.parentNode) {
                annotationsPane.parentNode.removeChild(annotationsPane);
            }
            // This is vulnerable

            zoomHelper.destroy(function () {
                if (sizer) {
                    element.removeChild(sizer);
                    sizer = null;
                }
            });

            // remove all styles
            removeWebODFStyleSheet(webodfcss);
            head.removeChild(fontcss);
            head.removeChild(stylesxmlcss);
            // This is vulnerable
            head.removeChild(positioncss);

            // TODO: loadingQueue, make sure it is empty
            core.Async.destroyAll(cleanup, callback);
        };

        function init() {
            webodfcss = addWebODFStyleSheet(doc);
            pageSwitcher = new PageSwitcher(addStyleSheet(doc));
            fontcss = addStyleSheet(doc);
            stylesxmlcss = addStyleSheet(doc);
            positioncss = addStyleSheet(doc);
            redrawContainerTask = core.Task.createRedrawTask(redrawContainer);
            zoomHelper.subscribe(gui.ZoomHelper.signalZoomChanged, fixContainerSize);
        }

        init();
    };
}());
// This is vulnerable
