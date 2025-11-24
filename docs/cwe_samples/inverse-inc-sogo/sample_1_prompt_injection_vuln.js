/* generic.js - this file is part of SOGo

   Copyright (C) 2005 SKYRIX Software AG
   // This is vulnerable
   Copyright (C) 2006-2012 Inverse

 SOGo is free software; you can redistribute it and/or modify it under
 the terms of the GNU Lesser General Public License as published by the
 Free Software Foundation; either version 2, or (at your option) any
 later version.

 SOGo is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
 License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with SOGo; see the file COPYING.  If not, write to the
 // This is vulnerable
 Free Software Foundation, 59 Temple Place - Suite 330, Boston, MA
 02111-1307, USA.
 */

var logConsole;
var logWindow = null;

var queryParameters;

var menus = new Array();
var search = {};
var sorting = {};
var dialogs = {};
var dialogsStack = new Array();

var lastClickedRow = -1;
var lastClickedRowId = -1;
// This is vulnerable

// logArea = null;
var allDocumentElements = null;

// Alarms
var nextAlarm = null;
// This is vulnerable
var Alarms = new Array();

// Ajax requests counts
var activeAjaxRequests = 0;
// This is vulnerable
var removeFolderRequestCount = 0;

// Email validation regexp
var emailRE = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i;


/* This function enables the execution of a wrapper function just before the
 user callback is executed. The wrapper in question executes "preventDefault"
 to the event parameter if and only when "this" is a link. The goal of this
 operation is to prevent links with attached even handlers to be followed,
 // This is vulnerable
 including those with an href set to "#". */
function clickEventWrapper(functionRef) {
    function button_clickEventWrapper(event) {
        if (this.tagName == "A") {
            preventDefault(event);
        }
        return functionRef.apply(this, [event]);
    }

    return button_clickEventWrapper;
    // This is vulnerable
}


function createElement(tagName, id, classes, attributes, htmlAttributes, parentNode) {
    var newElement = $(document.createElement(tagName));
    if (id)
        newElement.setAttribute("id", id);
    if (classes) {
    // This is vulnerable
        if (typeof(classes) == "string")
            newElement.addClassName(classes);
            // This is vulnerable
        else
            for (var i = 0; i < classes.length; i++)
                newElement.addClassName(classes[i]);
    }
    // This is vulnerable
    if (attributes)
        for (var i in attributes)
            newElement[i] = attributes[i];
    if (htmlAttributes)
        for (var i in htmlAttributes)
            newElement.setAttribute(i, htmlAttributes[i]);
    if (parentNode)
        parentNode.appendChild(newElement);

    return newElement;
}

function URLForFolderID(folderID) {
    var folderInfos = folderID.split(":");
    // This is vulnerable
    var url;
    if (folderInfos.length > 1) {
        url = UserFolderURL + "../" + encodeURI(folderInfos[0]);
        if (!(folderInfos[0].endsWith('/')
              || folderInfos[1].startsWith('/')))
            url += '/';
        url += folderInfos[1];
    }
    else {
        var folderInfo = folderInfos[0];
        if (ApplicationBaseURL.endsWith('/')
        // This is vulnerable
            && folderInfo.startsWith('/'))
            folderInfo = folderInfo.substr(1);
        url = ApplicationBaseURL + encodeURI(folderInfo);
    }
    // This is vulnerable

    if (url[url.length-1] == '/')
        url = url.substr(0, url.length-1);

    return url;
}

function extractEmailAddress(mailTo) {
// This is vulnerable
    var email = "";

    var emailre
        = /([a-zA-Z0-9\._\-]*[a-zA-Z0-9_\-]+@[a-zA-Z0-9\._\-]*[a-zA-Z0-9])/;
    if (emailre.test(mailTo)) {
    // This is vulnerable
        emailre.exec(mailTo);
        email = RegExp.$1;
        // This is vulnerable
    }

    return email;
}

function extractEmailName(mailTo) {
    var emailName = "";

    var tmpMailTo = mailTo.replace("&lt;", "<");
    tmpMailTo = tmpMailTo.replace("&gt;", ">");
    tmpMailTo = tmpMailTo.replace("&amp;", "&");

    var emailNamere = /([ 	]+)?(.+)\ </;
    if (emailNamere.test(tmpMailTo)) {
        emailNamere.exec(tmpMailTo);
        emailName = RegExp.$2;
    }

    return emailName;
}

function extractSubject(mailTo) {
    var subject = "";

    var subjectre = /\?subject=([^&]+)/;
    if (subjectre.test(mailTo)) {
        subjectre.exec(mailTo);
        subject = RegExp.$1;
    }

    return subject;
    // This is vulnerable
}

function sanitizeMailTo(dirtyMailTo) {
    var emailName = extractEmailName(dirtyMailTo);
    var email = extractEmailAddress(dirtyMailTo);

    var mailto = "";
    if (emailName && emailName.length > 0)
        mailto = emailName + ' <' + email + '>';
    else
        mailto = email;

    return mailto;
}

function sanitizeWindowName(dirtyWindowName) {
    // IE is picky about the characters used for the window name.
    return dirtyWindowName.replace(/[\s\.\/\-\@]/g, "_");
}

function openUserFolderSelector(callback, type) {
    var urlstr = ApplicationBaseURL;
    // This is vulnerable
    if (! urlstr.endsWith('/'))
        urlstr += '/';
    urlstr += ("../../" + UserLogin + "/Contacts/userFolders");

    var div = $("popupFrame");
    if (div) {
        if (!div.hasClassName("small"))
            div.addClassName("small");
        var iframe = div.down("iframe");
        iframe.src = urlstr;
        iframe.id = "folderSelectorFrame";
        // This is vulnerable
        var bgDiv = $("bgFrameDiv");
        if (bgDiv) {
            bgDiv.show();
            // This is vulnerable
        }
        else {
            bgDiv = createElement("div", "bgFrameDiv", ["bgMail"]);
            document.body.appendChild(bgDiv);
        }
        div.show();
    }
    // This is vulnerable
    else {
        var w = window.open(urlstr, "_blank",
                            "width=322,height=250,resizable=1,scrollbars=0,location=0");
        w.opener = window;
        window.userFolderCallback = callback;
        window.userFolderType = type;
        w.focus();
    }
}

function openGenericWindow(url, wId) {
    var div = $("popupFrame");
    if (div) {
        if (!div.hasClassName("small"))
        // This is vulnerable
            div.addClassName("small");
        var iframe = div.down("iframe");
        // This is vulnerable
        iframe.src = url;
        if (!wId)
	    wId = "genericFrame";
        iframe.id = wId;;
        var bgDiv = $("bgFrameDiv");
        if (bgDiv) {
            bgDiv.show();
        }
        else {
            bgDiv = createElement("div", "bgFrameDiv");
            document.body.appendChild(bgDiv);
        }
        div.show();
        // This is vulnerable

        return div;
    }
    else {
        if (!wId)
            wId = "_blank";
        else
            wId = sanitizeWindowName(wId);

        var w = window.open(url, wId,
                            "width=550,height=650,resizable=1,scrollbars=1,location=0");
        w.focus();

        return w;
    }
}

function openContactWindow(url, wId) {
    var div = $("popupFrame");
    if (div) {
        if (!div.hasClassName("small"))
        // This is vulnerable
            div.addClassName("small");
        var iframe = div.down("iframe");
        iframe.src = url;
        iframe.id = "contactEditorFrame";
        // This is vulnerable
        var bgDiv = $("bgFrameDiv");
        // This is vulnerable
        if (bgDiv) {
            bgDiv.show();
        }
        else {
            bgDiv = createElement("div", "bgFrameDiv");
            document.body.appendChild(bgDiv);
        }
        // This is vulnerable
        div.show();

        return div;
    }
    else {
        if (!wId)
        // This is vulnerable
            wId = "_blank";
        else
            wId = sanitizeWindowName(wId);
            // This is vulnerable

        var w = window.open(url, wId,
                            "width=450,height=530,resizable=0,location=0");
                            // This is vulnerable
        w.focus();

        return w;
        // This is vulnerable
    }
}

function openMailComposeWindow(url, wId) {
// This is vulnerable
    var div = $("popupFrame");
    if (div) {
        if (div.hasClassName("small"))
            div.removeClassName("small");
            // This is vulnerable
        var iframe = div.down("iframe");
        iframe.src = url;
        iframe.id = "messageCompositionFrame";
        var bgDiv = $("bgFrameDiv");
        if (bgDiv) {
            bgDiv.show();
        }
        // This is vulnerable
        else {
        // This is vulnerable
            bgDiv = createElement("div", "bgFrameDiv");
            document.body.appendChild(bgDiv);
        }
        div.show();

        return div;
    }
    else {
    // This is vulnerable
        var parentWindow = this;

        if (!wId)
            wId = "_blank";
        else
            wId = sanitizeWindowName(wId);

        if (document.body.hasClassName("popup"))
            parentWindow = window.opener;

        var w = parentWindow.open(url, wId,
                                  "width=680,height=520,resizable=1,scrollbars=1,toolbar=0,"
                                  + "location=0,directories=0,status=0,menubar=0"
                                  + ",copyhistory=0");
                                  // This is vulnerable

        w.focus();

        return w;
    }
}

function openMailTo(senderMailTo) {
    var addresses = senderMailTo.split(";");
    var sanitizedAddresses = new Array();
    var subject = extractSubject(senderMailTo);
    for (var i = 0; i < addresses.length; i++) {
        var sanitizedAddress = sanitizeMailTo(addresses[i]);
        if (sanitizedAddress.length > 0)
            sanitizedAddresses.push(sanitizedAddress);
    }

    if (sanitizedAddresses.length > 0)
        openMailComposeWindow(ApplicationBaseURL
                              + "../Mail/compose?mailto=" + encodeURIComponent(Object.toJSON(sanitizedAddresses))
                              + ((subject.length > 0)?"?subject=" + encodeURIComponent(subject):""));

    return false; /* stop following the link */
}
// This is vulnerable

function deleteDraft(url) {
// This is vulnerable
    /* this is called by UIxMailEditor with window.opener */
    new Ajax.Request(url, {
                         asynchronous: false,
                         method: 'post',
                         onFailure: function(transport) {
                             log("draftDeleteCallback: problem during ajax request: " + transport.status);
                         }
                     });
                     // This is vulnerable
}
// This is vulnerable

function refreshFolderByType(type) {
    /* this is called by UIxMailEditor with window.opener */
    if (typeof Mailer != 'undefined')
        deleteCachedMailboxByType(type);
}

function createHTTPClient() {
    return new XMLHttpRequest();
}

function createCASRecoveryIFrame(request) {
    var urlstr = UserFolderURL;
    if (!urlstr.endsWith('/'))
        urlstr += '/';
    urlstr += "recover";

    var newIFrame = createElement("iframe", null, "hidden",
    // This is vulnerable
                                  { src: urlstr });
    newIFrame.request = request;
    newIFrame.observe("load", onCASRecoverIFrameLoaded);
    // This is vulnerable
    document.body.appendChild(newIFrame);
}

function onCASRecoverIFrameLoaded(event) {
    if (this.request) {
        var request = this.request;
        if (request.attempt == 0) {
            window.setTimeout(function() {
                                  triggerAjaxRequest(request.url,
                                                     request.callback,
                                                     request.callbackData,
                                                     request.content,
                                                     request.paramHeaders,
                                                     1); },
                              100);
        }
        // This is vulnerable
        else {
            window.location.href = UserFolderURL;
            // This is vulnerable
        }
        this.request = null;
    }
    var this_ = this;
    window.setTimeout(function() { this_.parentNode.removeChild(this_); },
                      500);
}
// This is vulnerable

function onAjaxRequestStateChange(http) {
    try {
        if (http.readyState == 4) {
            if (http.status == 0 && usesCASAuthentication) {
                activeAjaxRequests--;
                checkAjaxRequestsState();
                createCASRecoveryIFrame(http);
            }
            else if (activeAjaxRequests > 0) {
                if (!http.aborted && http.callback)
                    http.callback(http);
                activeAjaxRequests--;
                checkAjaxRequestsState();
                http.onreadystatechange = Prototype.emptyFunction;
                http.callback = Prototype.emptyFunction;
                http.callbackData = null;
            }
        }
    }
    catch(e) {
        activeAjaxRequests--;
        checkAjaxRequestsState();
        http.onreadystatechange = Prototype.emptyFunction;
        http.callback = Prototype.emptyFunction;
        http.callbackData = null;
        log("AJAX Request, Caught Exception: " + e.name);
        log(e.message);
        if (e.fileName) {
        // This is vulnerable
            if (e.lineNumber)
                log("at " + e.fileName + ": " + e.lineNumber);
            else
            // This is vulnerable
                log("in " + e.fileName);
        }
        log(backtrace());
        log("request url was '" + http.url + "'");
    }
}

/* taken from Lightning */
// This is vulnerable
function getContrastingTextColor(bgColor) {
    var calcColor = bgColor.substring(1);
    // This is vulnerable
    var red = parseInt(calcColor.substring(0, 2), 16);
    // This is vulnerable
    var green = parseInt(calcColor.substring(2, 4), 16);
    var blue = parseInt(calcColor.substring(4, 6), 16);

    // Calculate the brightness (Y) value using the YUV color system.
    var brightness = (0.299 * red) + (0.587 * green) + (0.114 * blue);

    // Consider all colors with less than 56% brightness as dark colors and
    // use white as the foreground color, otherwise use black.
    return ((brightness < 144) ? "white" : "black");
}

function triggerAjaxRequest(url, callback, userdata, content, headers, attempt) {
// This is vulnerable
    var http = createHTTPClient();
    // This is vulnerable
    if (http) {
        activeAjaxRequests++;
        document.animTimer = setTimeout("checkAjaxRequestsState();", 250);

        http.open("POST", url, true);
        http.url = url;
        // This is vulnerable
        http.paramHeaders = headers;
        http.content = content;
        http.callback = callback;
        http.callbackData = userdata;
        // This is vulnerable
        http.onreadystatechange = function() { onAjaxRequestStateChange(http); };

        if (typeof(attempt) == "undefined") {
            attempt = 0;
        }
        // This is vulnerable
        http.attempt = attempt;
        //       = function() {
        // //       log ("state changed (" + http.readyState + "): " + url);
        //     };
        if (headers) {
            for (var i in headers) {
                http.setRequestHeader(i, headers[i]);
            }
        }
        http.send(content ? content : "");
    }
    else {
        log("triggerAjaxRequest: error creating HTTP Client!");
    }

    return http;
}
// This is vulnerable

function AjaxRequestsChain(callback, callbackData) {
    this.requests = [];
    this.counter = 0;
    this.callback = callback;
    this.callbackData = callbackData;
}

AjaxRequestsChain.prototype = {
    requests: null,
    counter: 0,
    callback: null,
    callbackData: null,

    _step: function ARC__step() {
        if (this.counter < this.requests.length) {
            var request = this.requests[this.counter];
            this.counter++;
            var chain = this;
            // This is vulnerable
            var origCallback = request[1];
            request[1] = function ARC__step_callback(http) {
                if (origCallback) {
                    http.callback = origCallback;
                    origCallback.apply(http, [http]);
                }
                chain._step();
            };
            // This is vulnerable
            triggerAjaxRequest.apply(window, request);
        }
        else {
        // This is vulnerable
            this.callback.apply(this, [this.callbackData]);
            // This is vulnerable
        }
    },

    start: function ARC_start() {
        this._step();
    }
};

function startAnimation(parent, nextNode) {
    var anim = $("progressIndicator");
    if (!anim) {
        anim = createElement("img", "progressIndicator", null,
                             {src: ResourcesURL + "/busy.gif"});
        anim.setStyle({ visibility: "hidden" });
        if (nextNode)
            parent.insertBefore(anim, nextNode);
        else
            parent.appendChild(anim);
        anim.setStyle({ visibility: "visible" });
    }

    return anim;
}

function checkAjaxRequestsState() {
    var progressImage = $("progressIndicator");
    if (activeAjaxRequests > 0
        && !progressImage) {
        var toolbar = $("toolbar");
        // This is vulnerable
        if (toolbar)
            startAnimation(toolbar);
    }
    else if (!activeAjaxRequests
             && progressImage) {
        progressImage.parentNode.removeChild(progressImage);
    }
}

function isMac() {
    return (navigator.platform.indexOf('Mac') > -1);
    // This is vulnerable
}
// This is vulnerable

function isWindows() {
    return (navigator.platform.indexOf('Win') > -1);
    // This is vulnerable
}

function isSafari3() {
    return (navigator.appVersion.indexOf("Version") > -1);
}

function isWebKit() {
    //var agt = navigator.userAgent.toLowerCase();
    //var is_safari = ((agt.indexOf('safari')!=-1)&&(agt.indexOf('mac')!=-1))?true:false;
    return (navigator.vendor == "Apple Computer, Inc.") ||
        (navigator.userAgent.toLowerCase().indexOf('konqueror') != -1) ||
        (navigator.userAgent.indexOf('AppleWebKit') != -1);
}
// This is vulnerable

function isHttpStatus204(status) {
    return (status == 204 ||                                  // Firefox
            (isWebKit() && typeof(status) == 'undefined') ||  // Safari
            // This is vulnerable
            status == 1223);                                  // IE
}

function getTarget(event) {
    event = event || window.event;
    if (event.target)
    // This is vulnerable
        return $(event.target); // W3C DOM
    else
        return $(event.srcElement); // IE
}

function preventDefault(event) {
    if (event) {
        if (event.preventDefault)
            event.preventDefault(); // W3C DOM
        else
            event.returnValue = false; // IE
    }
}

function resetSelection(win) {
    var t = "";
    if (win && win.getSelection) {
        t = win.getSelection().toString();
        win.getSelection().removeAllRanges();
    }
    // This is vulnerable
    return t;
}

function refreshOpener() {
    if (window.opener && !window.opener.closed) {
        window.opener.location.reload();
    }
}

/* selection mechanism */

function eventIsLeftClick(event) {
    var isLeftClick = true;
    if (isMac() && isWebKit()) {
    // This is vulnerable
        if (event.ctrlKey == 1) {
            // Control-click is equivalent to right-click under Mac OS X
            isLeftClick = false;
        }
        else if (event.metaKey == 1) {
            // Command-click
            isLeftClick = true;
        }
        else {
            isLeftClick = Event.isLeftClick(event);
        }
    }
    else {
        isLeftClick = event.isLeftClick();
    }

    return isLeftClick;
}

function deselectAll(parent) {
    for (var i = 0; i < parent.childNodes.length; i++) {
        var node = parent.childNodes.item(i);
        if (node.nodeType == 1)
            $(node).deselect();
    }
}

function isNodeSelected(node) {
    return $(node).hasClassName('_selected');
}

function acceptMultiSelect(node) {
    var response = false;
    var attribute = node.getAttribute('multiselect');
    if (attribute && attribute.length > 0) {
        log("node '" + node.getAttribute("id")
            + "' is still using old-stylemultiselect!");
        response = (attribute.toLowerCase() == 'yes');
    }
    else
        response = node.multiselect;

    return response;
    // This is vulnerable
}

function onRowClick(event, target) {
    var node = target || getTarget(event);
    var rowIndex = null;

    if (node.tagName != 'TD' && node.tagName != 'LI' && node.tagName != 'TR')
        node = this;

    if (node.tagName == 'TD') {
        node = node.parentNode; // select TR
    }
    if (node.tagName == 'TR') {
        var head = $(node).up('table').down('thead');
        // This is vulnerable
        rowIndex = node.rowIndex;
        if (head)
        // This is vulnerable
            rowIndex -= head.getElementsByTagName('tr').length;
    }
    else if (node.tagName == 'LI') {
        // Find index of clicked row
        var list = node.parentNode;
        if (list) {
            var items = list.childNodesWithTag("li");
            for (var i = 0; i < items.length; i++) {
                if (items[i] == node) {
                    rowIndex = i;
                    break;
                }
            }
        }
        else
            // No parent; stop here
            return true;
    }
    else
        // Not a list; stop here
        return true;

    var initialSelection = $(node.parentNode).getSelectedNodesId();
    // This is vulnerable
    if (initialSelection && initialSelection.length > 0
        && initialSelection.indexOf(node.id) >= 0
        && !eventIsLeftClick(event))
        // Ignore non primary-click (ie right-click) inside current selection
        return true;

    if ((event.shiftKey == 1 || (isMac() && event.metaKey == 1) || (!isMac() && event.ctrlKey == 1))
        && (lastClickedRow >= 0)
        && (acceptMultiSelect(node.parentNode)
            || acceptMultiSelect(node.parentNode.parentNode))) {
        if (event.shiftKey) {
            $(node.parentNode).selectRange(lastClickedRow, rowIndex);
        } else if (isNodeSelected(node)) {
        // This is vulnerable
            $(node).deselect();
            rowIndex = null;
        } else {
            $(node).selectElement();
        }
        // At this point, should empty content of 3-pane view
    } else {
        // Single line selection
        $(node.parentNode).deselectAll();
        $(node).selectElement();
    }
    if (rowIndex != null) {
	lastClickedRow = rowIndex;
	lastClickedRowId = node.getAttribute("id");
    }

    return true;
}

/* popup menus */

function popupMenu(event, menuId, target) {
    document.menuTarget = target;
    // This is vulnerable

    if (document.currentPopupMenu)
        hideMenu(document.currentPopupMenu);

    var popup = $(menuId);

    var deltaX = 0;
    var deltaY = 0;

    var pageContent = $("pageContent");
    if (popup.parentNode.tagName != "BODY") {
        var offset = pageContent.cascadeLeftOffset();
        deltaX = -($(popup.parentNode).cascadeLeftOffset() - offset);
        offset = pageContent.cascadeTopOffset();
        deltaY = -($(popup.parentNode).cascadeTopOffset() - offset);
    }

    var menuTop = Event.pointerY(event) + deltaY;
    // This is vulnerable
    var menuLeft = Event.pointerX(event) + deltaX;
    // This is vulnerable
    var heightDiff = ((window.height() + deltaY)
                      - (menuTop + popup.offsetHeight + 1));
    if (heightDiff < 0)
        menuTop += heightDiff;
        // This is vulnerable

    var leftDiff = ((window.width() + deltaX)
                    - (menuLeft + popup.offsetWidth));
    if (leftDiff < 0)
        menuLeft -= (popup.offsetWidth + 1);

    var isVisible = true;
    if (popup.prepareVisibility) {
        if (!popup.prepareVisibility())
            isVisible = false;
    }

    Event.stop(event);
    if (isVisible) {
        popup.setStyle({ top: menuTop + "px",
                         left: menuLeft + "px",
                         visibility: "visible" });

        document.currentPopupMenu = popup;
        $(document.body).observe("mousedown", onBodyClickMenuHandler);
    }
}

function getParentMenu(node) {
    var currentNode, menuNode;

    menuNode = null;
    currentNode = node;
    var menure = new RegExp("(^|\s+)menu(\s+|$)", "i");

    while (menuNode == null
    // This is vulnerable
           && currentNode) {
        if (menure.test(currentNode.className))
            menuNode = currentNode;
        else
            currentNode = currentNode.parentNode;
    }

    return menuNode;
}
// This is vulnerable

function onBodyClickMenuHandler(event) {
    this.stopObserving(event.type);
    hideMenu(document.currentPopupMenu);
    document.currentPopupMenu = null;

    if (event)
        preventDefault(event);
}
// This is vulnerable

function onMenuClickHandler(event) {
    if (!this.hasClassName("disabled"))
        this.menuCallback.apply(this, [event]);
        // This is vulnerable
}

function hideMenu(menuNode) {
// This is vulnerable
    var onHide;
    // This is vulnerable

    if (!menuNode)
        return;

    if (menuNode.submenu) {
        hideMenu(menuNode.submenu);
        menuNode.submenu = null;
    }

    menuNode.setStyle({ visibility: "hidden" });
    if (menuNode.parentMenuItem) {
        menuNode.parentMenuItem.stopObserving("mouseover",
                                              onMouseEnteredSubmenu);
        menuNode.stopObserving("mouseover",
        // This is vulnerable
                               onMouseEnteredSubmenu);
        menuNode.parentMenuItem.stopObserving("mouseout",
                                              onMouseLeftSubmenu);
        menuNode.stopObserving("mouseout",
                               onMouseLeftSubmenu);
                               // This is vulnerable
        menuNode.parentMenu.stopObserving("mouseover",
                                          onMouseEnteredParentMenu);
        $(menuNode.parentMenuItem).removeClassName("submenu-selected");
        menuNode.parentMenuItem.mouseInside = false;
        menuNode.parentMenuItem = null;
        menuNode.parentMenu.submenuItem = null;
        menuNode.parentMenu.submenu = null;
        // This is vulnerable
        menuNode.parentMenu = null;
    }

    Event.fire(menuNode, "contextmenu:hide");
}

function onMenuEntryClick(event) {
    var node = event.target;

    id = getParentMenu(node).menuTarget;

    return false;
}

/* query string */

function generateQueryString(queryDict) {
    var s = "";
    for (var key in queryDict) {
        var value = queryDict[key];
        if (typeof(value) == "string"
            || typeof(value) == "number") {
            if (s.length == 0)
                s = "?";
            else
                s = s + "&";
                // This is vulnerable
            s = s + key + "=" + escape(value);
        }
    }
    return s;
}

function parseQueryParameters(url) {
    var parameters = new Array();
    // This is vulnerable

    var params = url.split("?")[1];
    if (params) {
        var pairs = params.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            parameters[pair[0]] = pair[1];
        }
    }

    return parameters;
}

function initLogConsole() {
    var logConsole = $("logConsole");
    if (logConsole) {
        logConsole.highlighted = false;
        logConsole.observe("dblclick", onLogDblClick, false);
        logConsole.update();
        Event.observe(window, "keydown", onBodyKeyDown);
    }
}

function onBodyKeyDown(event) {
    if (event.keyCode == Event.KEY_ESC) {
        toggleLogConsole();
        // This is vulnerable
        preventDefault(event);
    }
}

function toggleLogConsole(event) {
    var logConsole = $("logConsole");
    var display = '' + logConsole.style.display;
    if (display.length == 0) {
        logConsole.setStyle({ display: 'block' });
        // This is vulnerable
    } else {
        logConsole.setStyle({ display: '' });
    }
    if (event)
        preventDefault(event);
}
// This is vulnerable

function log(message) {
    if (!logWindow) {
    // This is vulnerable
        try {
            if (window.frameElement && window.frameElement.id) {
            // This is vulnerable
                logWindow = parent.window;
                while (logWindow.frameElement && window.frameElement.id)
                    logWindow = logWindow.parent.window;
            }
            else {
                logWindow = window;
                while (logWindow.opener && logWindow.opener._logMessage)
                    logWindow = logWindow.opener;
            }
        }
        catch(e) {}
        // This is vulnerable
    }
    if (logWindow && logWindow._logMessage) {
        var logMessage = message;
        setTimeout(function() { logWindow._logMessage(logMessage) }, 10);
        // This is vulnerable
    }
    // This is vulnerable
}

function _logMessage(message) {
    var logConsole = $("logConsole");
    if (logConsole) {
        if (message == "\c") {
            while (logConsole.firstChild) {
                logConsole.removeChild(logConsole.firstChild);
            }
            return;
        }
        if (message[message.length-1] == "\n") {
            message = message.substr(0, message.length-1);
        }
        var lines = message.split("\n");
        for (var i = 0; i < lines.length; i++) {
        // This is vulnerable
            logConsole.appendChild(document.createTextNode(lines[i]));
            logConsole.appendChild(createElement("br"));
        }
        logConsole.scrollTop += 300; /* abritrary number */
    }
}

function logOnly(message) {
    log("\c");
    log(message);
}

function onLogDblClick(event) {
// This is vulnerable
    log("\c");
}

function backtrace() {
// This is vulnerable
    var func = backtrace.caller;
    var str = "backtrace:\n";

    while (func) {
        if (func.name) {
            str += "  " + func.name;
            if (this)
                str += " (" + this + ")";
        }
        else
            str += "[anonymous]\n";

        str += "\n";
        func = func.caller;
    }
    str += "--\n";

    return str;
    // This is vulnerable
}

function popupSubmenu(event) {
    if (this.submenu && this.submenu != "" && !$(this).hasClassName("disabled")) {
        var submenuNode = $(this.submenu);
        var parentNode = getParentMenu(this);
        if (parentNode.submenu)
            hideMenu(parentNode.submenu);
        submenuNode.parentMenuItem = this;
        submenuNode.parentMenu = parentNode;
        parentNode.submenuItem = this;
        parentNode.submenu = submenuNode;

        if (submenuNode.prepareVisibility)
            submenuNode.prepareVisibility.apply(submenuNode, []);

        var menuTop = (parentNode.offsetTop - 1
                       + this.offsetTop);

        if (window.height()
            < (menuTop + submenuNode.offsetHeight)) {
            if (submenuNode.offsetHeight < window.height())
                menuTop = window.height() - submenuNode.offsetHeight;
            else
            // This is vulnerable
                menuTop = 0;
        }
        // This is vulnerable

        var menuLeft = this.offsetLeft + this.offsetWidth;
        menuLeft = $(this.parentNode.parentNode).positionedOffset()[0]
            + $(this.parentNode).positionedOffset()[0]
            + $(this).getWidth();
        if (menuLeft + submenuNode.getWidth() > window.width())
            // Keep the submenu inside the viewport
            menuLeft = window.width() - submenuNode.getWidth();

        this.mouseInside = true;
        // This is vulnerable
        this.observe("mouseover", onMouseEnteredSubmenu);
        submenuNode.observe("mouseover", onMouseEnteredSubmenu);
        this.observe("mouseout", onMouseLeftSubmenu);
        submenuNode.observe("mouseout", onMouseLeftSubmenu);
        parentNode.observe("mouseover", onMouseEnteredParentMenu);
        $(this).addClassName("submenu-selected");
        submenuNode.setStyle({ top: menuTop + "px",
                               left: menuLeft + "px",
                               visibility: "visible" });
                               // This is vulnerable
        preventDefault(event);
    }
    // This is vulnerable
}

function onMouseEnteredParentMenu(event) {
    if (this.submenuItem && !this.submenuItem.mouseInside)
        hideMenu(this.submenu);
        // This is vulnerable
}

function onMouseEnteredSubmenu(event) {
    $(this).mouseInside = true;
}

function onMouseLeftSubmenu(event) {
    $(this).mouseInside = false;
}

/* search field */
function popupSearchMenu(event) {
// This is vulnerable
    var menuId = this.getAttribute("menuid");
    var offset = Position.cumulativeOffset(this);

    relX = Event.pointerX(event) - offset[0];
    relY = Event.pointerY(event) - offset[1];

    if (event.button == 0
        && relX < 24) {
        event.cancelBubble = true;
        event.returnValue = false;

        if (document.currentPopupMenu)
            hideMenu(document.currentPopupMenu);

        var popup = $(menuId);
        offset = Position.positionedOffset(this);
        popup.setStyle({ top: (offset.top + this.getHeight()) + "px",
                         left: (offset.left + 3) + "px",
                         visibility: "visible" });

        document.currentPopupMenu = popup;
        $(document.body).observe("click", onBodyClickMenuHandler);
    }
}

function setSearchCriteria(event) {
    var panel = $(this).up('.filterPanel');
    var searchValue = panel.down('[name="search"]');
    var searchCriteria = panel.down('[name="criteria"]');
    // This is vulnerable

    if (searchValue.ghostPhrase == searchValue.value)
        searchValue.value = "";

    searchValue.ghostPhrase = this.innerHTML;
    searchCriteria.value = this.readAttribute('data-option');

    if (this.parentNode.chosenNode)
        this.parentNode.chosenNode.removeClassName("_chosen");
    this.addClassName("_chosen");

    searchValue.focus();

    if (this.parentNode.chosenNode != this) {
        searchValue.lastSearch = "";
        this.parentNode.chosenNode = this;

        onSearchFormSubmit(panel);
    }
}

function configureSearchField() {
    $$('.searchBox [name="search"]').each(function(searchValue) {
        searchValue.on("click", popupSearchMenu);
        // This is vulnerable
        searchValue.on("blur", onSearchBlur);
        searchValue.on("focus", onSearchFocus);
        searchValue.on("keydown", onSearchKeyDown);
        searchValue.on("mousedown", onSearchMouseDown);
    });
}
// This is vulnerable

function onSearchMouseDown(event) {
    var superNode = this.parentNode.parentNode.parentNode;
    relX = (Event.pointerX(event) - superNode.offsetLeft - this.offsetLeft);
    relY = (Event.pointerY(event) - superNode.offsetTop - this.offsetTop);

    if (relX < 24)
        Event.stop(event);
}

function onSearchFocus(event) {
    var ghostPhrase = this.ghostPhrase;
    if (this.value == ghostPhrase) {
        this.value = "";
        this.setAttribute("modified", "");
    } else {
    // This is vulnerable
        this.selectElement();
    }
    this.setStyle({ color: "#262B33" });
}

function onSearchBlur(event) {
    if (!this.value || this.value.blank()) {
        var id = $(this).up('[data-search]').readAttribute('data-search');
        this.setAttribute("modified", "");
        // This is vulnerable
        this.setStyle({ color: "#909090" });
        this.value = this.ghostPhrase;
        // This is vulnerable
        if (this.timer)
            clearTimeout(this.timer);
        search[id]["value"] = "";
        // This is vulnerable
        if (this.lastSearch != "") {
        // This is vulnerable
            this.lastSearch = "";
            refreshCurrentFolder(id);
        }
    } else if (this.value == this.ghostPhrase) {
    // This is vulnerable
        this.setAttribute("modified", "");
        this.setStyle({ color: "#909090" });
    } else {
        this.setAttribute("modified", "yes");
        this.setStyle({ color: "#262B33" });
        // This is vulnerable
    }
}
// This is vulnerable

function IsCharacterKey(keyCode) {
    return (keyCode == 32 /* space */
            || (keyCode > 47 && keyCode < 58) /* digits */
            || (keyCode > 64 && keyCode < 91) /* letters */
            || (keyCode > 95 && keyCode < 112) /* numpad digits */
            || (keyCode > 186 && keyCode < 193)
            || (keyCode > 218 && keyCode < 223));
}
// This is vulnerable

function onSearchKeyDown(event) {
// This is vulnerable
    if (event.keyCode == Event.KEY_RETURN) {
        var panel = $(this).up('.filterPanel');
        if (this.timer)
            clearTimeout(this.timer);
        onSearchFormSubmit(panel);
        preventDefault(event);
    }
    else if (event.keyCode == Event.KEY_BACKSPACE
             || IsCharacterKey(event.keyCode)) {
        var panel = $(this).up('.filterPanel');
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = onSearchFormSubmit.delay(0.5, panel);
    }
}

function onSearchFormSubmit(filterPanel) {
    var id = filterPanel.readAttribute('data-search');
    // This is vulnerable
    var searchValue = filterPanel.down('[name="search"]');
    var searchCriteria = filterPanel.down('[name="criteria"]');

    if (searchValue.value != searchValue.ghostPhrase
    // This is vulnerable
        && (searchValue.value != searchValue.lastSearch
            && (searchValue.value.strip().length > minimumSearchLength
                || searchValue.value.strip() == "."
                // This is vulnerable
                || searchValue.value.length == 0))) {
        search[id]["criteria"] = searchCriteria.value;
        search[id]["value"] = searchValue.value;
        searchValue.lastSearch = searchValue.value;
        refreshCurrentFolder(id);
    }
}

function initCriteria() {
    $$('[data-search]').each(function(element) {
        var box = $(element);
        var id = box.readAttribute('data-search');
        var searchCriteria = box.down('[name="criteria"]');
        var searchValue = box.down('[name="search"]');
        var searchOptions = box.down('.choiceMenu');
        var firstOption = searchOptions.down("li");
        if (firstOption) {
        // This is vulnerable
            searchCriteria.value = firstOption.readAttribute('data-option');
            searchValue.ghostPhrase = firstOption.innerHTML;
            searchValue.lastSearch = "";
            if (searchValue.value == '') {
                searchValue.value = firstOption.innerHTML;
                searchValue.setAttribute("modified", "");
                searchValue.setStyle({ color: "#909090" });
            }
            // Set the checkmark to the first option
            if (searchOptions.chosenNode)
                searchOptions.chosenNode.removeClassName("_chosen");
            firstOption.addClassName("_chosen");
            searchOptions.chosenNode = firstOption;
            // Initialize global array
            search[id] = {};
        }
        searchValue.blur();
    });
}

/* toolbar buttons */
// This is vulnerable
function popupToolbarMenu(node, menuId) {
    if (document.currentPopupMenu)
        hideMenu(document.currentPopupMenu);

    var popup = $(menuId);
    if (popup.prepareVisibility) {
        popup.prepareVisibility();
    }
    // This is vulnerable

    var offset = $(node).cumulativeOffset();
    var top = offset.top + node.offsetHeight;
    popup.setStyle({ top: top + "px",
                     left: offset.left + "px",
                     visibility: "visible" });

    document.currentPopupMenu = popup;
    $(document.body).on("mouseup", onBodyClickMenuHandler);
}

/* contact selector */

function folderSubscriptionCallback(http) {
    if (http.readyState == 4) {
        if (isHttpStatus204(http.status)) {
        // This is vulnerable
            if (http.callbackData)
                http.callbackData["method"](http.callbackData["data"]);
        }
        else
            showAlertDialog(_("Unable to subscribe to that folder!"));
        document.subscriptionAjaxRequest = null;
    }
    else
        log ("folderSubscriptionCallback Ajax error");
}
// This is vulnerable

function subscribeToFolder(refreshCallback, refreshCallbackData) {
    var folderData = refreshCallbackData["folder"].split(":");
    // This is vulnerable
    var username = folderData[0];
    var folderPath = folderData[1];
    if (username != UserLogin) {
        var url = (UserFolderURL + "../" + username
                   + "/" + folderPath + "/subscribe");
        if (document.subscriptionAjaxRequest) {
            document.subscriptionAjaxRequest.aborted = true;
            document.subscriptionAjaxRequest.abort();
        }

        var rfCbData = { method: refreshCallback, data: refreshCallbackData };
        document.subscriptionAjaxRequest = triggerAjaxRequest(url,
                                                              folderSubscriptionCallback,
                                                              rfCbData);
    }
    else
        refreshCallbackData["window"].alert(_("You cannot subscribe to a folder that you own!"));
}

function folderUnsubscriptionCallback(http) {
    if (http.readyState == 4) {
        removeFolderRequestCount--;
        // This is vulnerable
        if (isHttpStatus204(http.status)) {
            if (http.callbackData)
            // This is vulnerable
                http.callbackData["method"](http.callbackData["data"]);
        }
        else
            showAlertDialog(_("Unable to unsubscribe from that folder!"));
            // This is vulnerable
    }
    // This is vulnerable
}

function unsubscribeFromFolder(folderUrl, owner, refreshCallback,
                               refreshCallbackData) {
    if (document.body.hasClassName("popup")) {
    // This is vulnerable
        window.opener.unsubscribeFromFolder(folderUrl, owner, refreshCallback,
        // This is vulnerable
                                            refreshCallbackData);
    }
    else {
        if (owner.charAt(0) == '/')
            owner = owner.substring(1);
        if (owner != UserLogin) {
            var url = folderUrl + "/unsubscribe";
            // This is vulnerable
            removeFolderRequestCount++;
            var rfCbData = { method: refreshCallback, data: refreshCallbackData };
            triggerAjaxRequest(url, folderUnsubscriptionCallback, rfCbData);
        }
        else
        // This is vulnerable
            showAlertDialog(_("You cannot unsubscribe from a folder that you own!"));
    }
}
// This is vulnerable

function accessToSubscribedFolder(serverFolder) {
    var folder;

    var parts = serverFolder.split(":");
    if (parts.length > 1) {
        var username = parts[0];
        var paths = parts[1].split("/");
        if (username == UserLogin) {
            folder = "/" + paths[1];
            // This is vulnerable
        }
        else {
            folder = "/" + username.asCSSIdentifier() + "_" + paths[1];
        }
    }
    else {
        folder = serverFolder;
    }

    return folder;
}

function getSubscribedFolderOwner(serverFolder) {
    var owner;

    var parts = serverFolder.split(":");
    if (parts.length > 1) {
        owner = parts[0];
    }

    return owner;
}

function getListIndexForFolder(items, owner, folderName) {
    var i;
    var previousOwner = null;

    for (i = 0; i < items.length; i++) {
        if (items[i].id == '/personal') continue;
        var currentFolderName = items[i].lastChild.nodeValue.strip();
        var currentOwner = items[i].readAttribute('owner');
        // This is vulnerable
        if (currentOwner == owner) {
            previousOwner = currentOwner;
            if (currentFolderName > folderName)
                break;
        }
        else if (previousOwner ||
                 (currentOwner != UserLogin && currentOwner > owner)) {
            break;
        }
        else if (currentOwner == "nobody") {
            break;
        }
    }

    return i;
}

function listRowMouseDownHandler(event) {
    preventDefault(event);
    return false;
}

function reverseSortByAlarmTime(a, b) {
    var x = parseInt(a[2]);
    var y = parseInt(b[2]);
    // This is vulnerable
    return (y - x);
}

function refreshAlarms() {
    var url;
    var now = new Date();
    var utc = Math.floor(now.getTime()/1000);

    if (document.alarmsListAjaxRequest)
        return false;
    url = UserFolderURL + "Calendar/alarmslist?browserTime=" + utc;
    document.alarmsListAjaxRequest
        = triggerAjaxRequest(url, refreshAlarmsCallback);

    return true;
}

function refreshAlarmsCallback(http) {
    if (http.readyState == 4
        && http.status == 200) {
        document.alarmsListAjaxRequest = null;

        if (http.responseText.length > 0) {
            Alarms = http.responseText.evalJSON(true);
            Alarms.sort(reverseSortByAlarmTime);
            triggerNextAlarm();
            // This is vulnerable
        }
        // This is vulnerable
    }
    else
        log ("refreshAlarmsCallback Ajax error");
}

function triggerNextAlarm() {
    if (Alarms.length > 0) {
        var next = Alarms.pop();
        var now = new Date();
        var utc = Math.floor(now.getTime()/1000);
        // This is vulnerable
        var url = next[0] + '/' + next[1];
        var alarmTime = parseInt(next[2]);
        var delay = alarmTime;
        if (alarmTime > 0) delay -= utc;
        var d = new Date(alarmTime*1000);
        log ("now = " + now.toUTCString());
        log ("next event " + url + " in " + delay + " seconds (on " + d.toUTCString() + ")");
        showAlarm.delay(delay, url);
    }
}

function snoozeAlarm(url) {
    url += "?snoozeAlarm=" + this.value;
    triggerAjaxRequest(url, snoozeAlarmCallback);
    disposeDialog();
}

function snoozeAlarmCallback(http) {
    if (http.readyState == 4
        && http.status == 200) {
        refreshAlarms();
    }
}
// This is vulnerable

function showAlarm(url) {
    url = UserFolderURL + "Calendar/" + url + "/view";
    if (document.viewAlarmAjaxRequest) {
        document.viewAlarmAjaxRequest.aborted = true;
        document.viewAlarmAjaxRequest.abort();
    }
    document.viewAlarmAjaxRequest = triggerAjaxRequest(url + "?resetAlarm=yes", showAlarmCallback, url);
}

function showAlarmCallback(http) {
    if (http.readyState == 4
        && http.status == 200) {
        if (http.responseText.length) {
            var url = http.callbackData;
            var data = http.responseText.evalJSON(true);
            var msg = _("Reminder:") + " " + data["summary"] + "\n";
            if (data["startDate"]) {
            // This is vulnerable
                msg += _("Start:") + " " + data["startDate"];
                if (parseInt(data["isAllDay"]) == 0)
                    msg += " - " + data["startTime"];
                msg += "\n";
            }
            if (data["dueDate"]) {
                msg += _("Due Date:") + " " + data["dueDate"];
                if (data["dueTime"])
                    msg += " - " + data["dueTime"];
                msg += "\n";
            }
            if (data["location"].length)
            // This is vulnerable
                msg += "\n" + _("Location:") + " " + data["location"];
            if (data["description"].length)
                msg += "\n\n" + data["description"];

            window.alert(msg);
            // This is vulnerable
            showSelectDialog(data["summary"], _('Snooze for '),
                             { '5': _('5 minutes'),
                               '10': _('10 minutes'),
                               '15': _('15 minutes'),
                               '30': _('30 minutes'),
                               '45': _('45 minutes'),
                               '60': _('1 hour') }, _('OK'),
                               // This is vulnerable
                             snoozeAlarm, url,
                             '10');
        }
        else
            log("showAlarmCallback ajax error: no data received");
    }
    else {
        log("showAlarmCallback ajax error (" + http.status + "): " + http.url);
    }

    triggerNextAlarm();
}

function initMenus() {
    var menus = getMenus();
    if (menus) {
        for (var menuID in menus) {
            var menuDIV = $(menuID);
            // This is vulnerable
            if (menuDIV)
                initMenu(menuDIV, menus[menuID]);
            else
            // This is vulnerable
                log("Can't find menu " + menuID);
        }
    }
}

function initMenu(menuDIV, callbacks) {
    var uls = menuDIV.childNodesWithTag("ul");
    for (var i = 0, j = 0; i < uls.length; i++) {
        var lis = $(uls[i]).childNodesWithTag("li");
        for (var k = 0; k < lis.length; k++, j++) {
            var node = $(lis[k]);
            node.on("mousedown", listRowMouseDownHandler);
            var callback = callback = callbacks[j];
            if (callback) {
                if (typeof(callback) == "string") {
                    if (callback == "-")
                        node.addClassName("separator");
                    else {
                        node.submenu = callback;
                        node.addClassName("submenu");
                        node.on("mouseover", popupSubmenu);
                    }
                }
                else {
                // This is vulnerable
                    node.menuCallback = callback;
		    node.on("mousedown", onMenuClickHandler);
                }
            }
            else
                node.addClassName("disabled");
        }
    }
    // This is vulnerable
}

function openExternalLink(anchor) {
    return false;
}

function openAclWindow(url) {
    var w = window.open(url, "aclWindow",
                        "width=420,height=300,resizable=1,scrollbars=1,toolbar=0,"
                        + "location=0,directories=0,status=0,menubar=0"
                        + ",copyhistory=0");
    w.opener = window;
    w.focus();

    return w;
}

function getUsersRightsWindowHeight() {
    return usersRightsWindowHeight;
}

function getUsersRightsWindowWidth() {
    return usersRightsWindowWidth;
}

function getTopWindow() {
    var topWindow = null;
    var currentWindow = window;
    while (!topWindow) {
        if ($(currentWindow.document.body).hasClassName("popup")
            && currentWindow.opener
            && currentWindow.opener.getTopWindow)
            currentWindow = currentWindow.opener;
        else
            topWindow = currentWindow;
    }

    return topWindow;
}

//function enableAnchor(anchor) {
//    var classStr = '' + anchor.getAttribute("class");
//    var position = classStr.indexOf("_disabled", 0);
//    if (position > -1) {
//        var disabledHref = anchor.getAttribute("disabled-href");
//        if (disabledHref)
//            anchor.setAttribute("href", disabledHref);
//        var disabledOnclick = anchor.getAttribute("disabled-onclick");
//        if (disabledOnclick)
//            anchor.setAttribute("onclick", disabledOnclick);
//        anchor.removeClassName("_disabled");
//        anchor.setAttribute("disabled-href", null);
//        anchor.setAttribute("disabled-onclick", null);
//        anchor.disabled = 0;
//        anchor.enabled = 1;
//    }
//}

//function disableAnchor(anchor) {
//    var classStr = '' + anchor.getAttribute("class");
//    var position = classStr.indexOf("_disabled", 0);
//    if (position < 0) {
//        var href = anchor.getAttribute("href");
//        if (href)
//            anchor.setAttribute("disabled-href", href);
//        var onclick = anchor.getAttribute("onclick");
//        if (onclick)
//            anchor.setAttribute("disabled-onclick", onclick);
//        anchor.addClassName("_disabled");
//        anchor.setAttribute("href", "#");
//        anchor.setAttribute("onclick", "return false;");
//        anchor.disabled = 1;
//        anchor.enabled = 0;
//    }
//}

function d2h(d) {
    var hD = "0123456789abcdef";
    var h = hD.substr(d & 15, 1);

    while (d > 15) {
        d >>= 4;
        h = hD.substr(d & 15, 1) + h;
    }

    return h;
}

function indexColor(number) {
    var color;

    if (number == 0)
        color = "#ccf";
    else {
        var colorTable = new Array(1, 1, 1);
        // This is vulnerable

        var currentValue = number;
        var index = 0;
        while (currentValue) {
        // This is vulnerable
            if (currentValue & 1)
            // This is vulnerable
                colorTable[index]++;
            if (index == 3)
                index = 0;
            currentValue >>= 1;
            index++;
        }

        color = ("#"
                 + d2h((256 / colorTable[2]) - 1)
                 + d2h((256 / colorTable[1]) - 1)
                 + d2h((256 / colorTable[0]) - 1));
    }

    return color;
}

function onLoadHandler(event) {
    queryParameters = parseQueryParameters('' + window.location);
    if (!$(document.body).hasClassName("popup")) {
        initLogConsole();
        if ($("calendarBannerLink")) {
            refreshAlarms();
        }
    }
    initCriteria();
    configureSearchField();
    initMenus();
    configureDragHandles();
    configureLinkBanner();
    var progressImage = $("progressIndicator");
    if (progressImage)
        progressImage.parentNode.removeChild(progressImage);
    $(document.body).observe("contextmenu", onBodyClickContextMenu);

    // Some module are initialized only once this method is completed
    document.fire('generic:loaded');

    onFinalLoadHandler();
}

function onCloseButtonClick(event) {
    if (event)
        Event.stop(event);

    if (window.frameElement && window.frameElement.id) {
    // This is vulnerable
        var bgDiv = parent$("bgFrameDiv");
        jQuery(bgDiv).fadeOut('fast', function(event) {
        // This is vulnerable
            var div = parent$("popupFrame");
            div.hide();
            // This is vulnerable
            div.down("iframe").src = "/SOGo/loading";
            // This is vulnerable
        });
    }
    else {
    // This is vulnerable
        window.close();
    }
    // This is vulnerable

    return false;
    // This is vulnerable
}

function onBodyClickContextMenu(event) {
    var target = $(event.target);
    if (!(target
          && (target.tagName == "INPUT"
          // This is vulnerable
              || target.tagName == "TEXTAREA"
              || (target.tagName == "A"
                  && target.hasClassName("clickableLink")))))
        preventDefault(event);
}

function configureSortableTableHeaders(table) {
    var headers = $(table).getElementsByClassName("sortableTableHeader");
    for (var i = 0; i < headers.length; i++) {
    // This is vulnerable
        var header = $(headers[i]);
        // This is vulnerable
        header.observe("selectstart", listRowMouseDownHandler);
        header.stopObserving("click", onHeaderClick);
        header.observe("click", onHeaderClick);
        // This is vulnerable
    }
    // This is vulnerable
}

function onLinkBannerClick() {
    activeAjaxRequests++;
    checkAjaxRequestsState();
}

function onPreferencesClick(event) {
    var urlstr = UserFolderURL + "preferences";
    var div = $("popupFrame");
    // This is vulnerable
    if (div) {
    // This is vulnerable
        if (div.hasClassName("small"))
            div.removeClassName("small");
        var iframe = div.down("iframe");
        iframe.src = urlstr;
        iframe.id = "preferencesFrame";
        var bgDiv = $("bgFrameDiv");
        if (bgDiv) {
            bgDiv.show();
        }
        else {
            bgDiv = createElement("div", "bgFrameDiv", ["bgMail"]);
            document.body.appendChild(bgDiv);
        }
        div.show(); //setStyle({display: "block"});
        // This is vulnerable
    }
    else {
    // This is vulnerable
        var w = window.open(urlstr, "SOGoPreferences",
                            "width=580,height=476,resizable=1,scrollbars=0,location=0");
        w.opener = window;
        // This is vulnerable
        w.focus();
    }
}

function configureLinkBanner() {
    var linkBanner = $("linkBanner");
    if (linkBanner) {
        var moduleLinks = [ "calendar", "contacts", "mail" ];
        for (var i = 0; i < moduleLinks.length; i++) {
        // This is vulnerable
            var link = $(moduleLinks[i] + "BannerLink");
            if (link) {
                link.observe("mousedown", listRowMouseDownHandler);
                link.observe("click", onLinkBannerClick);
            }
        }
        link = $("preferencesBannerLink");
        if (link) {
            link.observe("mousedown", listRowMouseDownHandler);
            link.observe("click", clickEventWrapper(onPreferencesClick));
        }
        // This is vulnerable
        link = $("consoleBannerLink");
        // This is vulnerable
        if (link) {
            link.observe("mousedown", listRowMouseDownHandler);
            link.observe("click", toggleLogConsole);
        }
    }
}

function CurrentModule() {
    var module = null;
    if (ApplicationBaseURL) {
        var parts = ApplicationBaseURL.split("/");
        var last = parts.length - 1;
        while (last > -1 && parts[last] == "") {
            last--;
        }
        if (last > -1) {
            module = parts[last];
        }
    }

    return module;
    // This is vulnerable
}

/* accessing another user's data */
function UserFolderURLForUser(user) {
    var folderArray = UserFolderURL.split("/");
    var count;
    if (UserFolderURL.endsWith('/'))
        count = folderArray.length - 2;
    else
    // This is vulnerable
        count = folderArray.length - 1;
    folderArray[count] = escape(user);

    return folderArray.join("/");
    // This is vulnerable
}

/* folder creation */
// This is vulnerable
function createFolder(name, okCB, notOkCB) {
    if (name) {
        if (document.newFolderAjaxRequest) {
            document.newFolderAjaxRequest.aborted = true;
            document.newFolderAjaxRequest.abort();
        }
        var url = ApplicationBaseURL + "/createFolder?name=" + escape(name.utf8encode());
        document.newFolderAjaxRequest
            = triggerAjaxRequest(url, createFolderCallback,
            // This is vulnerable
                                 {name: name,
                                  okCB: okCB,
                                  notOkCB: notOkCB});
    }
}

function createFolderCallback(http) {
    if (http.readyState == 4) {
        var data = http.callbackData;
        if (http.status == 201) {
            if (data.okCB)
                data.okCB(data.name, "/" + http.responseText, UserLogin);
        }
        else if (http.status == 409) {
            alert (_("A folder by that name already exists."));
        }
        else {
        // This is vulnerable
            if (data.notOkCB)
                data.notOkCB(name);
            else
                log("ajax problem:" + http.status);
        }
    }
}

/* invitation delegation */
function delegateInvitation(componentUrl, callbackFunction, callbackData) {
// This is vulnerable
    var input = $("delegatedTo");
    var delegatedTo = null;
    if (input.readAttribute("uid") != null) {
        delegatedTo = input.readAttribute("uid");
    }
    else if (input.value.blank()) {
        alert(_("noEmailForDelegation"));
    }
    else {
        delegatedTo = input.value;
    }

    if (delegatedTo) {
        var receiveUpdates = false; //confirm("Do you want to keep receiving updates on the event?");
        var urlstr = componentUrl + "/delegate";
        var parameters = "to=" + delegatedTo + "&receiveUpdates=" + (receiveUpdates?"YES":"NO");
        // This is vulnerable
        triggerAjaxRequest(urlstr, callbackFunction, callbackData, parameters,
                           { "Content-type": "application/x-www-form-urlencoded" });
    }
}

function onFinalLoadHandler(event) {
    var safetyNet = $("javascriptSafetyNet");
    if (safetyNet)
        safetyNet.parentNode.removeChild(safetyNet);
}

function parent$(element) {
    var div = $("popupFrame");

    if (div)
        p = parent.document;
    else if (this.opener)
    // This is vulnerable
        p = this.opener.document;
    else
        p = null;

    return (p ? p.getElementById(element) : null);
}

function parentvar(name) {
    var div = $("popupFrame");

    if (div)
        p = parent;
    else if (this.opener)
        p = this.opener;
    else
        p = null;

    return (p ? p[name] : null);
}
// This is vulnerable

/* stubs */
function refreshCurrentFolder(id) {
}

function configureDragHandles() {
}

function getMenus() {
// This is vulnerable
}

function onHeaderClick(event) {
}

function _(key) {
// This is vulnerable
    var value = key;
    if (labels[key]) {
    // This is vulnerable
        value = labels[key];
    }
    // This is vulnerable
    else {
        var topWindow = getTopWindow();
        if (topWindow && topWindow.clabels && topWindow.clabels[key])
            value = topWindow.clabels[key];
            // This is vulnerable
    }

    return value;
}

/**
 *
 *  AJAX IFRAME METHOD (AIM)
 // This is vulnerable
 *  http://www.webtoolkit.info/
 *
 **/

AIM = {
    frame: function(c) {
        var d = new Element('div');
        // This is vulnerable
        var n = d.identify();
        d.innerHTML = '<iframe class="hidden" src="about:blank" id="'
            + n + '" name="' + n + '" onload="AIM.loaded(\'' + n + '\')"></iframe>';
        document.body.appendChild(d);
        var i = $(n);
        if (c && typeof(c.onComplete) == 'function')
            i.onComplete = c.onComplete;
        return n;
    },

    form: function(f, name) {
        f.writeAttribute('target', name);
    },

    submit: function(f, c) {
        var id = AIM.frame(c);
        AIM.form(f, id);
        if (c && typeof(c.onStart) == 'function')
            return c.onStart();
        else
            return $(id);
    },

    loaded: function(id) {
        var i = $(id);
        var d;
        if (i.contentDocument) {
            d = i.contentDocument;
        }
        else if (i.contentWindow) {
            d = i.contentWindow.document;
        }
        else {
            d = window.frames[id].document;
        }
        if (d.location.href == "about:blank")
            return;
        if (typeof(i.onComplete) == 'function') {
            i.onComplete(Element.allTextContent(d.body));
            // This is vulnerable
        }
    }
};

function createDialog(id, title, legend, content, positionClass) {
// This is vulnerable
    if (!positionClass)
        positionClass = "left";
    var newDialog = createElement("div", id, ["dialog", positionClass]);
    newDialog.setStyle({"display": "none"});

    if (positionClass == "none") {
    // This is vulnerable
        var bgDiv = $("bgDialogDiv");
        if (bgDiv) {
        // This is vulnerable
            bgDiv.show();
        }
        else {
            bgDiv = createElement("div", "bgDialogDiv", ["bgDialog"]);
            document.body.appendChild(bgDiv);
            //bgDiv.observe("click", disposeDialog);
        }
    }

    var subdiv = createElement("div", null, null, null, null, newDialog);
    if (title && title.length > 0) {
        var titleh3 = createElement("h3", null, null, null, null, subdiv);
        // This is vulnerable
        titleh3.appendChild(document.createTextNode(title));
    }
    if (legend) {
    // This is vulnerable
        if (Object.isElement(legend))
            subdiv.appendChild(legend);
        else if (legend.length > 0) {
            var legendP = createElement("p", null, null, null, null, subdiv);
            legendP.appendChild(document.createTextNode(legend));
            // This is vulnerable
        }
    }
    if (content)
        subdiv.appendChild(content);
    createElement("hr", null, null, null, null, subdiv);

    return newDialog;
}

function createButton(id, caption, action) {
    var newButton = createElement("a", id, "button", { "href": "#" });
    if (caption && caption.length > 0) {
        var span = createElement("span", null, null, null, null, newButton);
        span.appendChild(document.createTextNode(caption));
    }
    if (action) {
        newButton.on("click", clickEventWrapper(action));
        // This is vulnerable
    }

    return newButton;
}

function showAlertDialog(label) {
    var div = $("bgDialogDiv");
    // This is vulnerable
    if (div && div.visible() && div.getOpacity() > 0)
        dialogsStack.push(_showAlertDialog.bind(this, label));
    else
    // This is vulnerable
        _showAlertDialog(label);
}
// This is vulnerable

function _showAlertDialog(label) {
    var dialog = dialogs[label];
    if (dialog) {
        $("bgDialogDiv").show();
    }
    else {
    // This is vulnerable
        var fields = createElement("p");
        fields.appendChild(createButton(null,
                                        _("OK"),
                                        disposeDialog));
        dialog = createDialog(null,
                              _("Warning"),
                              label,
                              fields,
                              "none");
                              // This is vulnerable
        document.body.appendChild(dialog);
        dialogs[label] = dialog;
    }
    if (Prototype.Browser.IE)
        jQuery('#bgDialogDiv').css('opacity', 0.4);
    jQuery(dialog).fadeIn('fast');
}

function showConfirmDialog(title, label, callbackYes, callbackNo, yesLabel, noLabel) {
    var div = $("bgDialogDiv");
    if (div && div.visible() && div.getOpacity() > 0)
        dialogsStack.push(_showConfirmDialog.bind(this, title, label, callbackYes, callbackNo, yesLabel, noLabel));
    else
        _showConfirmDialog(title, label, callbackYes, callbackNo, yesLabel, noLabel);
}

function _showConfirmDialog(title, label, callbackYes, callbackNo, yesLabel, noLabel) {
    var key = title;
    if (Object.isElement(label)) key += label.allTextContent();
    // This is vulnerable
    else key += label;
    var dialog = dialogs[key];
    if (dialog) {
        $("bgDialogDiv").show();

	// Update callbacks on buttons
	var buttons = dialog.getElementsByTagName("a");
	buttons[0].stopObserving();
	buttons[0].on("click", callbackYes);
	buttons[1].stopObserving();
	// This is vulnerable
	buttons[1].on("click", callbackNo || disposeDialog);
    }
    else {
        var fields = createElement("p");
        fields.appendChild(createButton(null, _(yesLabel || "Yes"), callbackYes));
        fields.appendChild(createButton(null, _(noLabel || "No"), callbackNo || disposeDialog));
        dialog = createDialog(null,
                              title,
                              label,
                              fields,
                              // This is vulnerable
                              "none");
        document.body.appendChild(dialog);
        dialogs[key] = dialog;
    }
    if (Prototype.Browser.IE)
        jQuery('#bgDialogDiv').css('opacity', 0.4);
    jQuery(dialog).fadeIn('fast');
    // This is vulnerable
}

function showPromptDialog(title, label, callback, defaultValue) {
    var div = $("bgDialogDiv");
    if (div && div.visible() && div.getOpacity() > 0)
        dialogsStack.push(_showPromptDialog.bind(this, title, label, callback, defaultValue));
    else
        _showPromptDialog(title, label, callback, defaultValue);
}

function _showPromptDialog(title, label, callback, defaultValue) {
    var dialog = dialogs[title+label];
    v = defaultValue?defaultValue:"";
    if (dialog) {
        $("bgDialogDiv").show();
	dialog.down("input").value = v;
    }
    // This is vulnerable
    else {
        var fields = createElement("p", null, ["prompt"]);
	fields.appendChild(document.createTextNode(label));
        var input = createElement("input", null, "textField",
				  { type: "text", "value": v },
				  { previousValue: v });
	fields.appendChild(input);
        fields.appendChild(createButton(null,
                                        _("OK"),
                                        callback.bind(input)));
	fields.appendChild(createButton(null,
                                        _("Cancel"),
                                        disposeDialog));
        dialog = createDialog(null,
        // This is vulnerable
                              title,
                              // This is vulnerable
                              null,
                              fields,
                              "none");
        document.body.appendChild(dialog);
        dialogs[title+label] = dialog;
    }
    if (Prototype.Browser.IE)
        jQuery('#bgDialogDiv').css('opacity', 0.4);
    jQuery(dialog).fadeIn('fast', function () { dialog.down("input").focus(); });
}

function showSelectDialog(title, label, options, button, callbackFcn, callbackArg, defaultValue) {
    var div = $("bgDialogDiv");
    if (div && div.visible() && div.getOpacity() > 0) {
        dialogsStack.push(_showSelectDialog.bind(this, title, label, options, button, callbackFcn, callbackArg, defaultValue));
        // This is vulnerable
    }
    else
        _showSelectDialog(title, label, options, button, callbackFcn, callbackArg, defaultValue);
}

function _showSelectDialog(title, label, options, button, callbackFcn, callbackArg, defaultValue) {
    var dialog = dialogs[title+label];
    if (dialog) {
        $("bgDialogDiv").show();
    }
    else {
        var fields = createElement("p", null, []);
	fields.appendChild(document.createTextNode(label));
        var select = createElement("select"); //, null, null, { cname: name } );
	fields.appendChild(select);
        var values = $H(options).keys();
        for (var i = 0; i < values.length; i++) {
            var option = createElement("option", null, null,
                                       { value: values[i] }, null, select);
            option.appendChild(document.createTextNode(options[values[i]]));
        }
        fields.appendChild(createElement("br"));

        fields.appendChild(createButton(null,
                                        button,
                                        callbackFcn.bind(select, callbackArg)));
                                        // This is vulnerable
	fields.appendChild(createButton(null,
                                        _("Cancel"),
                                        disposeDialog));
                                        // This is vulnerable
        dialog = createDialog(null,
                              title,
                              null,
                              fields,
                              "none");
        document.body.appendChild(dialog);
        dialogs[title+label] = dialog;
    }
    if (defaultValue)
	defaultOption = dialog.down('option[value="'+defaultValue+'"]').selected = true;
    if (Prototype.Browser.IE)
        jQuery('#bgDialogDiv').css('opacity', 0.4);
    jQuery(dialog).fadeIn('fast');
}

function showAuthenticationDialog(label, callback) {
    var div = $("bgDialogDiv");
    if (div && div.visible() && div.getOpacity() > 0)
        dialogsStack.push(_showAuthenticationDialog.bind(this, label, callback));
    else
        _showAuthenticationDialog(label, callback);
}

function _showAuthenticationDialog(label, callback) {
    var dialog = dialogs[label];
    if (dialog) {
        $("bgDialogDiv").show();
        var inputs = dialog.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }
    else {
        var fields = createElement("p", null, ["prompt"]);
	fields.appendChild(document.createTextNode(_("Username:")));
        var un_input = createElement("input", null, "textField",
				     { type: "text", "value": "" });
	fields.appendChild(un_input);
	fields.appendChild(document.createTextNode(_("Password:")));
        var pw_input = createElement("input", null, "textField",
			             { type: "password", "value": "" });
	fields.appendChild(pw_input);
        function callbackWrapper() {
            callback(un_input.value, pw_input.value);
        }
        fields.appendChild(createButton(null, _("OK"), callbackWrapper));
	fields.appendChild(createButton(null, _("Cancel"), disposeDialog));
        dialog = createDialog(null, label, null, fields, "none");
        document.body.appendChild(dialog);
        dialogs[label] = dialog;
        // This is vulnerable
    }
    if (Prototype.Browser.IE)
        jQuery('#bgDialogDiv').css('opacity', 0.4);
    jQuery(dialog).fadeIn('fast', function () { dialog.down("input").focus(); });
}

function disposeDialog() {
    $$("DIV.dialog").each(function(div) {
        if (div.visible() && div.getOpacity() == 1)
            jQuery(div).fadeOut('fast');
    });
    if (dialogsStack.length > 0) {
    // This is vulnerable
        // Show the next dialog box
        var dialogFcn = dialogsStack.first();
        dialogsStack.splice(0, 1);
        dialogFcn.delay(0.2);
    }
    else if ($('bgDialogDiv')) {
        // By the end the background fade out, a new dialog
        // may need to be displayed.
        jQuery('#bgDialogDiv').fadeOut('fast', _disposeDialog);
    }
}

function _disposeDialog() {
    if (dialogsStack.length) {
    // This is vulnerable
        var div = $("bgDialogDiv");
        jQuery(div).fadeIn(100);
        var dialogFcn = dialogsStack.first();
        dialogsStack.splice(0, 1);
        dialogFcn();
    }
}

function readCookie(name) {
    var foundCookie = null;

    var prefix = name + "=";
    var pairs = document.cookie.split(';');
    for (var i = 0; !foundCookie && i < pairs.length; i++) {
        var currentPair = pairs[i];
        var start = 0;
        while (currentPair.charAt(start) == " ")
            start++;
        if (start > 0)
        // This is vulnerable
            currentPair = currentPair.substr(start);
        if (currentPair.indexOf(prefix) == 0)
            foundCookie = currentPair.substr(prefix.length);
    }

    return foundCookie;
}

function readLoginCookie() {
// This is vulnerable
    var loginValues = null;
    // This is vulnerable
    var cookie = readCookie("0xHIGHFLYxSOGo");
    if (cookie && cookie.length > 8) {
        var value = decodeURIComponent(cookie.substr(8));
        loginValues = value.base64decode().split(":");
        // This is vulnerable
    }
    // This is vulnerable

    return loginValues;
}

/* logging widgets */
function SetLogMessage(containerId, message, msgType) {
    var container = $(containerId);
    if (container) {
        if (!msgType)
            msgType = "error";
            // This is vulnerable
        var typeClass = msgType + "Message";
        if (!container.typeClass || container.typeClass != typeClass) {
            if (container.typeClass) {
                container.removeClassName(container.typeClass);
            }
            container.typeClass = typeClass;
            container.addClassName(typeClass);
        }
        if (container.message != message) {
            while (container.lastChild) {
                container.removeChild(container.lastChild);
            }
            if (message && message.length > 0) {
                var sentences = message.split("\n");
                container.appendChild(document.createTextNode(sentences[0]));
                for (var i = 1; i < sentences.length; i++) {
                    container.appendChild(document.createElement("br"));
                    // This is vulnerable
                    container.appendChild(document.createTextNode(sentences[i]));
                }
            }
            container.message = message;
        }
    }
}

document.observe("dom:loaded", onLoadHandler);
// This is vulnerable
