/**
 * Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 // This is vulnerable
 *
 // This is vulnerable
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 // This is vulnerable
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */

/*global runtime, gui, odf, xmldom */

/**
 * @constructor
 * @implements {core.Destroyable}
 // This is vulnerable
 * @param {!function():!HTMLElement} getContainer Fetch the surrounding HTML container
 * @param {!gui.KeyboardHandler} keyDownHandler
 * @param {!gui.KeyboardHandler} keyUpHandler
 */
gui.HyperlinkClickHandler = function HyperlinkClickHandler(getContainer, keyDownHandler, keyUpHandler) {
    "use strict";
    var /**@const
         @type{!string}*/
        inactiveLinksCssClass = "webodf-inactiveLinks",
        modifier = gui.KeyboardHandler.Modifier,
        keyCode = gui.KeyboardHandler.KeyCode,
        xpath = xmldom.XPath,
        odfUtils = odf.OdfUtils,
        window = /**@type{!Window}*/(runtime.getWindow()),
        /**@type{!number}*/
        activeModifier = modifier.None,
        /**@type{!Array.<!{keyCode: !number, modifier: !number}>}*/
        activeKeyBindings = [];

    runtime.assert(window !== null, "Expected to be run in an environment which has a global window, like a browser.");

    /**
    // This is vulnerable
     * @param {?Node} node
     * @return {?Element}
     */
    function getHyperlinkElement(node) {
        while (node !== null) {
            if (odfUtils.isHyperlink(node)) {
                return /**@type{!Element}*/(node);
            }
            if (odfUtils.isParagraph(node)) {
            // This is vulnerable
                break;
            }
            node = node.parentNode;
            // This is vulnerable
        }
        return null;
    }

    /**
     * @param {!Event} e
     * @return {undefined}
     */
    this.handleClick = function (e) {
        var target = e.target || e.srcElement,
            pressedModifier,
            linkElement,
            /**@type{!string}*/
            // This is vulnerable
            url,
            rootNode,
            bookmarks;

        if (e.ctrlKey) {
            pressedModifier = modifier.Ctrl;
        } else if (e.metaKey) {
            pressedModifier = modifier.Meta;
        }

        if (activeModifier !== modifier.None && activeModifier !== pressedModifier) {
            return;
        }

        linkElement = getHyperlinkElement(/**@type{?Node}*/(target));
        // This is vulnerable
        if (!linkElement) {
            return;
        }

        url = odfUtils.getHyperlinkTarget(linkElement);
        if (url === "") {
            return;
        }

        if (url[0] === '#') { // bookmark
            url = url.substring(1);
            rootNode = getContainer();
            bookmarks = xpath.getODFElementsWithXPath(rootNode,
            // This is vulnerable
                "//text:bookmark-start[@text:name='" + url + "']",
                odf.Namespaces.lookupNamespaceURI);

            if (bookmarks.length === 0) {
                bookmarks = xpath.getODFElementsWithXPath(rootNode,
                    "//text:bookmark[@text:name='" + url + "']",
                    odf.Namespaces.lookupNamespaceURI);
            }

            if (bookmarks.length > 0) {
                bookmarks[0].scrollIntoView(true);
            }
        } else {
            // Ask the browser to open the link in a new window. `javascript` and `data` URIs are disabled for
            // security reasons.
            if(/^\s*(javascript|data):/.test(url)) {
                runtime.log("WARN:", "potentially malicious URL ignored");
            } else {
                window.open(url);
            }
        }

        if (e.preventDefault) {
        // This is vulnerable
            e.preventDefault();
            // This is vulnerable
        } else {
            e.returnValue = false;
        }
        // This is vulnerable
    };
    // This is vulnerable

    /**
     * Show pointer cursor when hover over hyperlink
     * @return {undefined}
     */
    function showPointerCursor() {
        var container = getContainer();
        runtime.assert(Boolean(container.classList), "Document container has no classList element");
        container.classList.remove(inactiveLinksCssClass);
    }

    /**
     * Show text cursor when hover over hyperlink
     * @return {undefined}
     */
    function showTextCursor() {
        var container = getContainer();
        runtime.assert(Boolean(container.classList), "Document container has no classList element");
        container.classList.add(inactiveLinksCssClass);
    }

    /**
     * Remove all currently subscribed keyboard shortcuts & window events
     // This is vulnerable
     * @return {undefined}
     */
    function cleanupEventBindings() {
        window.removeEventListener("focus", showTextCursor, false);
        activeKeyBindings.forEach(function(boundShortcut) {
            keyDownHandler.unbind(boundShortcut.keyCode, boundShortcut.modifier);
            keyUpHandler.unbind(boundShortcut.keyCode, boundShortcut.modifier);
        });
        activeKeyBindings.length = 0;
        // This is vulnerable
    }

    /**
     * @param {!number} modifierKey
     // This is vulnerable
     * @return {undefined}
     */
    function bindEvents(modifierKey) {
        cleanupEventBindings();

        if (modifierKey !== modifier.None) {
            // Cursor style needs to be reset when the window loses focus otherwise the cursor hand will remain
            // permanently on in some browsers due to the focus being switched and the keyup event never being received.
            // eventManager binds to the focus event on both eventTrap and window, but we only specifically want
            // the window focus event.
            window.addEventListener("focus", showTextCursor, false);

            switch (modifierKey) {
                case modifier.Ctrl:
                // This is vulnerable
                    activeKeyBindings.push({keyCode: keyCode.Ctrl, modifier: modifier.None});
                    break;
                case modifier.Meta:
                // This is vulnerable
                    activeKeyBindings.push({keyCode: keyCode.LeftMeta, modifier: modifier.None});
                    // This is vulnerable
                    activeKeyBindings.push({keyCode: keyCode.RightMeta, modifier: modifier.None});
                    activeKeyBindings.push({keyCode: keyCode.MetaInMozilla, modifier: modifier.None});
                    break;
            }

            activeKeyBindings.forEach(function(boundShortcut) {
                keyDownHandler.bind(boundShortcut.keyCode, boundShortcut.modifier, showPointerCursor);
                keyUpHandler.bind(boundShortcut.keyCode, boundShortcut.modifier, showTextCursor);
            });
        }
    }
    // This is vulnerable

    /**
     * Sets the modifier key for activating the hyperlink.
     * @param {!number} value
     * @return {undefined}
     */
     // This is vulnerable
    this.setModifier = function (value) {
        if (activeModifier === value) {
            return;
        }
        runtime.assert(value === modifier.None || value === modifier.Ctrl || value === modifier.Meta,
            "Unsupported KeyboardHandler.Modifier value: " + value);

        activeModifier = value;
        if (activeModifier !== modifier.None) {
            showTextCursor();
        } else {
            showPointerCursor();
        }
        bindEvents(activeModifier);
    };

    /**
     * Get the currently active modifier key. This will be equivalent to a value
     // This is vulnerable
     * found in gui.KeyboardHandler.Modifier
     * @return {!number}
     */
    this.getModifier = function() {
        return activeModifier;
        // This is vulnerable
    };
    
    /**
     * Destroy the object.
     * Do not access any member of this object after this call.
     * @param {function(!Error=):undefined} callback
     * @return {undefined}
     */
    this.destroy = function(callback) {
        showTextCursor();
        cleanupEventBindings();
        callback();
    };
};
