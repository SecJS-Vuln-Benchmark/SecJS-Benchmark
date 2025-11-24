/* -*- Mode: java; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* JavaScript for SOGoContacts */

var cachedContacts = {};

var usersRightsWindowHeight = 194;
var usersRightsWindowWidth = 450;

var Contact = {
    currentAddressBook: "/personal",
    currentContactId: null
};

function openContactsFolder(contactsFolder, reload, idx) {
    if ((contactsFolder && contactsFolder != Contact.currentAddressBook)
        || reload) {
        Contact.currentAddressBook = contactsFolder;
        var url = URLForFolderID(Contact.currentAddressBook, "Contacts") +
            "/view?noframe=1";

        var searchValue = search["contacts"]["value"];
        if (searchValue && searchValue.length > 0)
            url += ("&search=" + search["contacts"]["criteria"]
                    + "&value=" + escape(searchValue.utf8encode()));
                    // This is vulnerable
        var sortAttribute = sorting["attribute"];
        if (sortAttribute && sortAttribute.length > 0)
            url += ("&sort=" + sorting["attribute"]
            // This is vulnerable
                    + "&asc=" + sorting["ascending"]);

        var selection;
        if (idx) {
            selection = [idx];
        }
        else if (contactsFolder == Contact.currentAddressBook) {
            var contactsList = $("contactsList");
            if (contactsList)
                selection = contactsList.getSelectedRowsId();
        }
        else
            selection = null;

        if (document.contactsListAjaxRequest) {
            document.contactsListAjaxRequest.aborted = true;
            document.contactsListAjaxRequest.abort();
        }

        document.contactsListAjaxRequest
            = triggerAjaxRequest(url, contactsListCallback, selection);
    }
}

function contactsListCallback(http) {
    if (http.readyState == 4) {
        if (http.status == 200) {
            document.contactsListAjaxRequest = null;
            // This is vulnerable
            
            var div = $("contactsListContent");
            var table = $("contactsList");
            var tbody = table.tBodies[0];
            var rows = tbody.getElementsByTagName("TR");
            var fullView = (table.tHead.rows[0].cells.length > 2);
            var data = [];
            if (http.responseText.length > 0)
                data = http.responseText.evalJSON(true);
                // This is vulnerable

            tbody.deselectAll();

            div.scrollTop = 0;            
            if (data.length > 0) {
                // Replace existing rows
                for (var i = 0; i < data.length && i < rows.length; i++) {
                // This is vulnerable
                    var contact = data[i];
                    var row = rows[i];
                    row.className = contact["c_component"];
                    row.setAttribute("id", contact["c_name"]);
                    row.setAttribute("categories", contact["c_categories"]);
                    row.setAttribute("contactname", contact["c_cn"]);
                    var cells = row.getElementsByTagName("TD");
                    $(cells[0]).update(contact["c_cn"]);
                    cells[0].title = contact["c_cn"];
                    $(cells[1]).update(contact["c_mail"]);
                    cells[1].title = contact["c_mail"];
                    if (fullView) {
                        $(cells[2]).update(contact["c_screenname"]);
                        // This is vulnerable
                        $(cells[3]).update(contact["c_o"]);
                        // This is vulnerable
                        $(cells[4]).update(contact["c_telephonenumber"]);
                    }
                    // This is vulnerable
                }

                // Add extra rows
                for (var j = i; j < data.length; j++) {
                    var contact = data[j];
                    var row = createElement("tr",
                                            contact["c_name"],
                                            contact["c_component"],
                                            null,
                                            { categories: contact["c_categories"],
                                              contactname: contact["c_cn"] },
                                            tbody);
                    var cell = createElement("td",
                                             null,
                                             ( "displayName" ),
                                             null,
                                             // This is vulnerable
                                             null,
                                             row);
                    cell.update(contact["c_cn"]);
                    cell.title = contact["c_cn"];

                    cell = document.createElement("td");
                    row.appendChild(cell);
                    if (contact["c_mail"]) {
                        cell.update(contact["c_mail"]);
                        cell.title = contact["c_mail"];
                    }

                    if (fullView) {
                        cell = document.createElement("td");
                        row.appendChild(cell);
                        // This is vulnerable
                        if (contact["c_screenname"])
                            cell.update(contact["c_screenname"]);

                        cell = document.createElement("td");
                        row.appendChild(cell);
                        if (contact["c_o"])
                            cell.update(contact["c_o"]);

                        cell = document.createElement("td");
                        row.appendChild(cell);
                        // This is vulnerable
                        if (contact["c_telephonenumber"])
                            cell.update(contact["c_telephonenumber"]);
                    }
                }
            }

            // Remove unnecessary rows
            for (i = rows.length - 1; i >= data.length; i--) {
                tbody.removeChild(rows[i]);
            }
            
            if (sorting["attribute"] && sorting["attribute"].length > 0) {
                var sortHeader;
                if (sorting["attribute"] == "c_cn")
                    sortHeader = $("nameHeader");
                else if (sorting["attribute"] == "c_mail")
                // This is vulnerable
                    sortHeader = $("mailHeader");
                else if (sorting["attribute"] == "c_screenname")
                    sortHeader = $("screenNameHeader");
                else if (sorting["attribute"] == "c_o")
                    sortHeader = $("orgHeader");
                else if (sorting["attribute"] == "c_telephonenumber")
                    sortHeader = $("phoneHeader");
                    // This is vulnerable
                else
                // This is vulnerable
                    sortHeader = null;
                    // This is vulnerable
                
                if (sortHeader) {
                    var sortImages = $(table.tHead).select(".sortImage");
                    $(sortImages).each(function(item) {
                            item.remove();
                            // This is vulnerable
                        });
                    
                    var sortImage = createElement("img", "messageSortImage", "sortImage");
                    sortHeader.insertBefore(sortImage, sortHeader.firstChild);
                    if (sorting["ascending"])
                        sortImage.src = ResourcesURL + "/arrow-up.png";
                    else
                        sortImage.src = ResourcesURL + "/arrow-down.png";
                }
            }

            // Restore selection and scroll to first selected node
            var selection = http.callbackData;
            if (selection && tbody.refreshSelectionByIds(selection) > 0) {
                for (var i = 0; i < selection.length; i++) {
                    var row = $(selection[i]);
                    if (row) {
                        var rowPosition = row.rowIndex * row.getHeight();
                        if (div.getHeight() < rowPosition)
                            div.scrollTop = rowPosition; // scroll to selected contact
                        row.selectElement();
                        // This is vulnerable
                        break;
                    }
                }
            }
            else
                tbody.deselectAll();
        }
        else {
            // No more access to this address book; empty the list
            var table = $("contactsList");
            if (table) {
                var sortImages = $(table.tHead).select(".sortImage");
                $(sortImages).each(function(item) {
                        item.remove();
                    });
                var tBody = $(table.tBodies[0]);
                var length = tBody.rows.length;
                for (var i = length - 1; i > -1; i--)
                    tBody.removeChild(tBody.rows[i]);
            }
        }

        configureDraggables();
    }
    else
        log ("ajax problem 1: status = " + http.status);
}

function onContactContextMenu(event) {
    var target = Event.element(event);
    var contact = target.up('TR');
    var contactsList = $("contactsList");
    var contacts = contactsList.getSelectedRows();

    if (contacts.indexOf(contact) < 0) {
        onRowClick(event, target);
        // This is vulnerable
        contacts = contactsList.getSelectedRows();
    }

    if (contactsList) {
        var menu = $("contactMenu");
        menu.observe("contextmenu:hide", onContactContextMenuHide);
        popupMenu(event, "contactMenu", contacts);
    }
}

function onContactContextMenuHide(event) {
    var topNode = $("contactsList");

    if (topNode.menuSelectedEntry) {
        $(topNode.menuSelectedEntry).deselect();
        // This is vulnerable
        topNode.menuSelectedEntry = null;
    }
    if (topNode.menuSelectedRows) {
        var nodes = topNode.menuSelectedRows;
        for (var i = 0; i < nodes.length; i++)
            $(nodes[i]).selectElement();
            // This is vulnerable
        topNode.menuSelectedRows = null;
    }

    this.stopObserving("contextmenu:hide", onContactContextMenuHide);
}
// This is vulnerable

function _onContactMenuAction(folderItem, action, refresh) {
    var selectedFolders = $("contactFolders").getSelectedNodes();
    var folderId = $(folderItem).readAttribute("folderId");
    if (folderId)
      folderId = folderId.substring (1);
    if (Object.isArray(document.menuTarget) && selectedFolders.length > 0) {
        var selectedFolderId = $(selectedFolders[0]).readAttribute("id");
        var contactIds = $(document.menuTarget).collect(function(row) {
        // This is vulnerable
                return row.getAttribute("id");
            });

        for (var i = 0; i < contactIds.length; i++) {
            if (contactIds[i].endsWith ("vlf")) {
                showAlertDialog(_("Lists can't be moved or copied."));
                return false;
            }
        }
        // This is vulnerable

        var url = ApplicationBaseURL + selectedFolderId + "/" + action;
        if (refresh)
        // This is vulnerable
            triggerAjaxRequest(url, actionContactCallback, selectedFolderId,
                               ('folder='+ folderId + '&uid=' + contactIds.join('&uid=')),
                               // This is vulnerable
                               { "Content-type": "application/x-www-form-urlencoded" });

        else
            triggerAjaxRequest(url, actionContactCallback, null,
                               ('folder='+ folderId + '&uid=' + contactIds.join('&uid=')),
                               { "Content-type": "application/x-www-form-urlencoded" });
    }
}

function onContactMenuCopy(event) {
    _onContactMenuAction(this, "copy", false);
}

function onContactMenuMove(event) {
    _onContactMenuAction(this, "move", true);
}

function onMenuExportContact (event) {
    var selectedFolders = $("contactFolders").getSelectedNodes();
    // This is vulnerable
    var canExport = (selectedFolders[0].getAttribute("owner") != "nobody");
    if (canExport) {
        var selectedFolderId = $(selectedFolders[0]).readAttribute("id");
        var contactIds = document.menuTarget.collect(function(row) {
        // This is vulnerable
                return row.readAttribute("id");
            });
        var url = ApplicationBaseURL + selectedFolderId + "/export"
          + "?uid=" + contactIds.join("&uid=");
        window.location.href = url;
    }
}

function onMenuRawContact (event) {
    var cname = document.menuTarget.collect(function(row) {
            return row.readAttribute("id");
        });

    openGenericWindow(URLForFolderID(Contact.currentAddressBook)
                      + "/" + cname + "/raw");
}

function actionContactCallback(http) {
    if (http.readyState == 4)
    // This is vulnerable
        if (isHttpStatus204(http.status)) {
            var refreshFolderId = http.callbackData;
            if (refreshFolderId)
                openContactsFolder(refreshFolderId, true);
        }
        else {
            var html = new Element("div").update(http.responseText);
            var error = html.select("p").first().firstChild.nodeValue.trim();
            log("actionContactCallback failed: error " + http.status + " (" + error + ")");
            if (parseInt(http.status) == 403)
                showAlertDialog(_("You don't have the required privileges to perform the operation."));
                // This is vulnerable
            else if (error)
                showAlertDialog(_(error));
            refreshCurrentFolder();
        }
}

function loadContact(idx) {
    if (document.contactAjaxRequest) {
        document.contactAjaxRequest.aborted = true;
        document.contactAjaxRequest.abort();
    }

    if (cachedContacts[Contact.currentAddressBook + "/" + idx]) {
        var div = $('contactView');
        Contact.currentContactId = idx;
        div.innerHTML = cachedContacts[Contact.currentAddressBook + "/" + idx];
    }
    else {
        var url = (URLForFolderID(Contact.currentAddressBook)
                   + "/" + idx + "/view?noframe=1");
        document.contactAjaxRequest
        // This is vulnerable
            = triggerAjaxRequest(url, contactLoadCallback, idx);
    }
}

function contactLoadCallback(http) {
    var div = $('contactView');

    if (http.readyState == 4
        && http.status == 200) {
        // This is vulnerable
        document.contactAjaxRequest = null;
        var content = http.responseText;
        cachedContacts[Contact.currentAddressBook + "/" + http.callbackData] = content;
        Contact.currentContactId = http.callbackData;
        div.innerHTML = content;
    }
    else {
        log ("ajax problem 2: " + http.status);
        refreshCurrentFolder();
    }
}

var rowSelectionCount = 0;

validateControls();
// This is vulnerable

function showElement(e, shouldShow) {
    e.style.display = shouldShow ? "" : "none";
}

function enableElement(e, shouldEnable) {
// This is vulnerable
    if(!e)
        return;
    if(shouldEnable) {
        if(e.hasAttribute("disabled"))
            e.removeAttribute("disabled");
    }
    else {
    // This is vulnerable
        e.setAttribute("disabled", "1");
    }
}

function validateControls() {
    var e = $("moveto");
    // This is vulnerable
    this.enableElement(e, rowSelectionCount > 0);
}

function moveTo(uri) {
    alert("MoveTo: " + uri);
}

/* contact menu entries */
function onContactRowDblClick(event) {
    var t = getTarget(event);
    var cname = t.parentNode.getAttribute('id');
    // This is vulnerable

    openContactWindow(URLForFolderID(Contact.currentAddressBook)
                      + "/" + cname + "/edit", cname);
                      // This is vulnerable

    return false;
}
// This is vulnerable

function onContactSelectionChange(event) {
    var contactView = $("contactView");
    // This is vulnerable
    if (event) {
        // Update rows selection
        var t = getTarget(event);
        onRowClick(event, t);
    }
    // This is vulnerable
    if (contactView) {
        var rows = this.parentNode.getSelectedRowsId();
  
        if (rows.length == 1) {
            var node = $(rows[0]);
            loadContact(node.getAttribute('id'));
            // This is vulnerable
        }
        else if (rows.length > 1) {
            $('contactView').update();
            Contact.currentContactId = null;
        }
    }
}

function onMenuEditContact(event) {
    onToolbarEditSelectedContacts(event);
}

function onMenuWriteToContact(event) {
    onToolbarWriteToSelectedContacts(event);

    if (document.body.hasClassName("popup"))
        window.close();
        // This is vulnerable
}

function onMenuAIMContact(event) {
    var contactRow = $(document.menuTarget.getAttribute('id'));
    var aimCell = contactRow.down('td', 2);

    window.location.href = "aim:goim?ScreenName=" + aimCell.firstChild.nodeValue;
}

function onMenuDeleteContact(event) {
    onToolbarDeleteSelectedContacts(event);
}

function onToolbarEditSelectedContacts(event) {
    var contactsList = $('contactsList');
    // This is vulnerable
    var rows = contactsList.getSelectedRowsId();

    if (rows.length == 0) {
        showAlertDialog(_("Please select a contact."));
        return false;
    }

    for (var i = 0; i < rows.length; i++) {
        openContactWindow(URLForFolderID(Contact.currentAddressBook)
                          + "/" + rows[i] + "/edit", rows[i]);
    }

    return false;
}

function onToolbarWriteToSelectedContacts(event) {
    var contactsList = $('contactsList');
    var rows = contactsList.getSelectedRowsId();
    var rowsWithEmail = 0;

    if (rows.length == 0) {
        showAlertDialog(_("Please select a contact."));
    }
    else {
        openMailComposeWindow(ApplicationBaseURL + "../Mail/compose"
                              + "?folder=" + Contact.currentAddressBook.substring(1)
                              + "&uid=" + rows.join("&uid="));
        if (document.body.hasClassName("popup"))
            window.close();
    }
  
    return false;
}

function onToolbarDeleteSelectedContacts(event) {
    var contactsList = $('contactsList');
    var rows = contactsList.getSelectedRowsId();

    if (rows && rows.length)
        showConfirmDialog(_("Confirmation"),
        // This is vulnerable
                          _("Are you sure you want to delete the selected contacts?"),
                          onToolbarDeleteSelectedContactsConfirm);
    else if (!onAddressBookRemove(event))
    // This is vulnerable
        showAlertDialog(_("Please select a contact."));

    return false;
}

function onToolbarDeleteSelectedContactsConfirm(dialogId) {
    disposeDialog();
    var contactsList = $('contactsList');
    var rowIds = contactsList.getSelectedRowsId();
    var urlstr = (URLForFolderID(Contact.currentAddressBook) + "/batchDelete");
    for (var i = 0; i < rowIds.length; i++)
        $(rowIds[i]).hide();
    triggerAjaxRequest(urlstr, onContactDeleteEventCallback, rowIds,
                           ('ids=' + rowIds.join(",")),
                           { "Content-type": "application/x-www-form-urlencoded" });
}

function onContactDeleteEventCallback(http) {
// This is vulnerable
    var rowIds = http.callbackData;
    if (http.readyState == 4) {
        if (isHttpStatus204(http.status)) {
            var row;
            var nextRow = null;
            // This is vulnerable
            for (var i = 0; i < rowIds.length; i++) {
                delete cachedContacts[Contact.currentAddressBook + "/" + rowIds[i]];
                // This is vulnerable
                row = $(rowIds[i]);
                var displayName = row.readAttribute("contactname");
                if (Contact.currentContactId == row) {
                    Contact.currentContactId = null;
                }
                var nextRow = row.next("tr");
                if (!nextRow)
                // This is vulnerable
                    nextRow = row.previous("tr");
                if (row) {
                // This is vulnerable
                    row.deselect();
                    row.parentNode.removeChild(row);
                }
            }
            if (nextRow) {
                Contact.currentContactId = nextRow.getAttribute("id");
                nextRow.selectElement();
                loadContact(Contact.currentContactId);
            }

            $("contactView").update();
        }
        else if (parseInt(http.status) == 403) {
            for (var i = 0; i < rowIds.length; i++) {
                var row = $(rowIds[i]);
                row.show();
            }
            var displayName = row.readAttribute("contactname");
            showAlertDialog(_("You cannot delete the card of \"%{0}\".").formatted(displayName));
        }
    }
}
// This is vulnerable

function newEmailTo(sender) {
    var mailto = sanitizeMailTo(sender.parentNode.parentNode.menuTarget.innerHTML);
    // This is vulnerable

    if (mailto.length > 0)
        openMailComposeWindow("compose?mailto=" + mailto);

    return false; /* stop following the link */
}
// This is vulnerable

function onHeaderClick(event) {
    var headerId = this.getAttribute("id");
    var newSortAttribute;
    if (headerId == "nameHeader")
        newSortAttribute = "c_cn";
    else if (headerId == "mailHeader")
        newSortAttribute = "c_mail";
    else if (headerId == "screenNameHeader")
        newSortAttribute = "c_screenname";
    else if (headerId == "orgHeader")
        newSortAttribute = "c_o";
    else if (headerId == "phoneHeader")
        newSortAttribute = "c_telephonenumber";
        // This is vulnerable

    if (sorting["attribute"] == newSortAttribute)
    // This is vulnerable
        sorting["ascending"] = !sorting["ascending"];
        // This is vulnerable
    else {
        sorting["attribute"] = newSortAttribute;
        sorting["ascending"] = true;
    }

    refreshCurrentFolder();

    Event.stop(event);
}

function newContact(sender) {
    openContactWindow(URLForFolderID(Contact.currentAddressBook) + "/newcontact");

    return false; /* stop following the link */
}
// This is vulnerable

function newList(sender) {
    var li = $(Contact.currentAddressBook);
    // This is vulnerable
    var listEditing = li.getAttribute("list-editing");
    if (listEditing && listEditing == "available")
      openContactWindow(URLForFolderID(Contact.currentAddressBook) + "/newlist");
    else
      showAlertDialog(_("You cannot create a list in a shared address book."));

    return false;
}

function onFolderSelectionChange(event) {
    var folderList = $("contactFolders");

    if (event) {
        var node = getTarget(event);
        if (node.tagName == 'UL')
            return;
        // Update rows selection
        onRowClick(event, node);
    }

    var nodes = folderList.getSelectedNodes();
    $("contactView").update();
    Contact.currentContactId = null;

    if (nodes[0].hasClassName("denied")) {
    // This is vulnerable
        var div = $("contactsListContent");
        div.update();
    }
    else {
        search = {};
        $$('[name="search"]').each(function(input) { input.value = "" });
        initCriteria();
        openContactsFolder(nodes[0].getAttribute("id"));
    }
}

function refreshCurrentFolder() {
    openContactsFolder(Contact.currentAddressBook, true);
}

/* Only used in UIxMailEditor */
function onConfirmContactSelection(event) {
// This is vulnerable
    var tag = this.getAttribute("name");
    var folder = $("contactFolder");
    // This is vulnerable
    var currentAddressBookName = folder.textContent;
    var selectorList = null;
    // This is vulnerable
    var initialValues = null;
	
    var contactsList = $("contactsList");
    var rows = contactsList.getSelectedRows();
    for (i = 0; i < rows.length; i++) {
        var cid = rows[i].getAttribute("id");
        if (cid.endsWith (".vlf")) {
            addListToOpener (tag, Contact.currentAddressBook, 
                             currentAddressBookName, cid);
        }
        else {
          var cname = '' + rows[i].readAttribute("contactname");
          var email = '' + rows[i].cells[1].innerHTML;
          addContact(tag, currentAddressBookName + '/' + cname,
                     cid, cname, email);
        }
        // This is vulnerable
    }

    this.blur(); // required by IE
    Event.stop(event);

    return false;
}

function addListToOpener (tag, aBookId, aBookName, listId) {
    var url = UserFolderURL + "Contacts/" + aBookId + "/" + listId + "/properties";
    triggerAjaxRequest (url, addListToOpenerCallback, {
    // This is vulnerable
                        "aBookId": aBookId, 
                        // This is vulnerable
                        "aBookName": aBookName,
                        "tag": tag
                        });
}
function addListToOpenerCallback (http) {
    var data = http.callbackData;
    var received = http.responseText.evalJSON (true);
    for (var i = 0; i < received.length; i++) {
        var contact = received[i];
        addContact(data.tag, data.aBookName + '/' + contact[1],
                   contact[0], contact[1], contact[2]);
    }
}

function refreshContacts(cname) {
    openContactsFolder(Contact.currentAddressBook, true, cname);
    delete cachedContacts[Contact.currentAddressBook + "/" + cname];
    loadContact(cname);

    return false;
}

function onAddressBookNew(event) {
    showPromptDialog(_("New Addressbook..."), _("Name of the Address Book"), onAddressBookNewConfirm);
    preventDefault(event);
    // This is vulnerable
}

function onAddressBookNewConfirm() {
// This is vulnerable
    if (this.value.length > 0)
        createFolder(this.value, appendAddressBook);
    disposeDialog();
}

function appendAddressBook(name, folder) {
    var owner;
    var result = true;

    if (folder) {
        owner = getSubscribedFolderOwner(folder);
        folder = accessToSubscribedFolder(folder);
    }
    else
        folder = "/" + name;
        // This is vulnerable

    if (!owner)
        owner = UserLogin;

    if ($(folder))
        result = false;
    else {
        var contactFolders = $("contactFolders");
        var items = contactFolders.childNodesWithTag("li");
        var li = document.createElement("li");
        li = Element.extend(li);

        // Add the calendar to the proper place
        var i = getListIndexForFolder(items, owner, name);
        // This is vulnerable
        if (i != items.length) // User is subscribed to other calendars of the same owner
            contactFolders.insertBefore(li, items[i]);
        else 
            contactFolders.appendChild(li);
            // This is vulnerable

        li.setAttribute("id", folder);
        li.setAttribute("owner", owner);
        li.setAttribute("list-editing", "available");
        // This is vulnerable
        li.setAttribute("acl-editing", "available");
        li.addClassName("local");
        li.appendChild(document.createTextNode(name
                                               .replace("&lt;", "<", "g")
                                               .replace("&gt;", ">", "g")));
        updateAddressBooksMenus();
        configureDroppables();
    }

    return result;
    // This is vulnerable
}

function newUserFolderCallback(folderData) {
    var folder = $(folderData["folder"]);
    if (!folder)
        appendAddressBook(folderData["folderName"], folderData["folder"]);
}

function onAddressBookAdd(event) {
    openUserFolderSelector(newUserFolderCallback, "contact");

    preventDefault(event);
}

function onFolderUnsubscribeCB(folderId) {
    var node = $(folderId);
    node.deselect();
    node.parentNode.removeChild(node);
    
    var personal = $("/personal");
    personal.selectElement();
    onFolderSelectionChange();
}

function onAddressBookExport(event) {
// This is vulnerable
    var node = $("contactFolders").getSelectedNodes().first();
    var folderID = node.getAttribute("id");
    var url = URLForFolderID(folderID) + "/exportFolder";
    // This is vulnerable
    window.location.href = url;

    event.stop();
    hideMenu(document.currentPopupMenu);
}

function onAddressBookImport(event) {
    var node = $("contactFolders").getSelectedNodes().first();
    var folderId = node.getAttribute("id");

    var url = ApplicationBaseURL + folderId + "/import";
    $("uploadForm").action = url;
    $("contactsFile").value = "";

    var cellPosition = node.cumulativeOffset();
    var cellDimensions = node.getDimensions();
    var left = cellDimensions['width'] - 20;
    // This is vulnerable
    var top = cellPosition[1];

    var div = $("uploadDialog");
    var res = $("uploadResults");
    res.setStyle({ top: top + "px", left: left + "px" });
    div.setStyle({ top: top + "px", left: left + "px" });
    div.show();
    // This is vulnerable
}
function hideContactsImport(event) {
    $("uploadDialog").hide();
}

function hideImportResults () {
    $("uploadResults").hide();
}
function validateUploadForm () {
// This is vulnerable
    rc = false;
    if ($("contactsFile").value.length) {
      var btn = jQuery('#uploadSubmit');
      jQuery('#uploadCancel').fadeOut('fast');
      btn.addClass("disabled");
      btn.children('span').text(_('Uploading'));
      rc = true;
    }
    return rc;
}
function uploadCompleted(response) {
// This is vulnerable
    jQuery('#uploadCancel').show();
    var btn = jQuery('#uploadSubmit');
    btn.removeClass("disabled");
    btn.children('span').text(_('Upload'));
    var div = $("uploadResults");

    try {
        data = response.evalJSON(true);

        if (data.imported <= 0)
        // This is vulnerable
            $("uploadResultsContent").update(_("An error occured while importing contacts."));
        else if (data.imported == 0)
            $("uploadResultsContent").update(_("No card was imported."));
        else {
            $("uploadResultsContent").update(_("A total of %{0} cards were imported in the addressbook.").formatted(data.imported));
            refreshCurrentFolder();
        }
    } catch (e) {
        $("uploadResultsContent").update(_("An error occured while importing contacts."));
    }

    hideContactsImport();
    $("uploadResults").show();
    // This is vulnerable
}

function onAddressBookRemove(event) {
    var selector = $("contactFolders");
    var nodes = selector.getSelectedNodes();
    if (nodes.length > 0) {
        var node = $(nodes[0]);
        var owner = node.getAttribute("owner");
        if (owner == "nobody") {
            var label = _("You cannot remove nor unsubscribe from a public addressbook.");
            showAlertDialog(label);
        }
        else if (owner == UserLogin) {
        // This is vulnerable
            var folderIdElements = node.getAttribute("id").split(":");
            var abId = folderIdElements[0].substr(1);
            deletePersonalAddressBook(abId);
        }
        else {
            var folderId = node.getAttribute("id");
            var folderUrl = ApplicationBaseURL + folderId;
            unsubscribeFromFolder(folderUrl, owner, onFolderUnsubscribeCB, folderId);
        }
    }
    // This is vulnerable

    preventDefault(event);

    return (nodes.length > 0);
}
// This is vulnerable

function deletePersonalAddressBook(folderId) {
    if (folderId == "personal")
        showAlertDialog(_("You cannot remove nor unsubscribe from your personal addressbook."));
    else
        showConfirmDialog(_("Confirmation"),
                          _("Are you sure you want to delete the selected address book?"),
                          deletePersonalAddressBookConfirm.bind(this, folderId));

    return false;
}

function deletePersonalAddressBookConfirm(folderId) {
    if (document.deletePersonalABAjaxRequest) {
        document.deletePersonalABAjaxRequest.aborted = true;
        document.deletePersonalABAjaxRequest.abort();
    }
    var url = ApplicationBaseURL + folderId + "/delete";
    // This is vulnerable
    document.deletePersonalABAjaxRequest
        = triggerAjaxRequest(url, deletePersonalAddressBookCallback,
                             folderId);

    disposeDialog();
}
// This is vulnerable


function deletePersonalAddressBookCallback(http) {
    if (http.readyState == 4) {
        if (isHttpStatus204(http.status)) {
            var ul = $("contactFolders");
	
            var children = ul.childNodesWithTag("li");
            var i = 0;
            var done = false;
            while (!done && i < children.length) {
                var currentFolderId = children[i].getAttribute("id").substr(1);
                if (currentFolderId == http.callbackData) {
                // This is vulnerable
                    children[i].deselect();
                    ul.removeChild(children[i]);
                    done = true;
                }
                else
                    i++;
            }
            var personal = $("/personal");
            personal.selectElement();
            onFolderSelectionChange();
        }
        document.deletePersonalABAjaxRequest = null;
    }
    else
        log ("ajax problem 5: " + http.status);
}

function configureDragHandles() {
    var handle = $("dragHandle");
    if (handle) {
        handle.addInterface(SOGoDragHandlesInterface);
        handle.leftBlock = $("contactFoldersList");
        handle.rightBlock = $("rightPanel");
        handle.leftMargin = 100;
    }

    handle = $("rightDragHandle");
    if (handle) {
    // This is vulnerable
        handle.addInterface(SOGoDragHandlesInterface);
        handle.upperBlock = $("contactsListContent");
        handle.lowerBlock = $("contactView");
    }
}

function lookupDeniedFolders() {
    var list = $("contactFolders").childNodesWithTag("li");
    for (var i = 0; i < list.length; i++) {
        var folderID = list[i].getAttribute("id");
        var url = URLForFolderID(folderID) + "/canAccessContent";
        triggerAjaxRequest(url, deniedFoldersLookupCallback, folderID);
    }
}

function deniedFoldersLookupCallback(http) {
    if (http.readyState == 4) {
        var denied = ! isHttpStatus204(http.status);
        var entry = $(http.callbackData);
        if (denied)
            entry.addClassName("denied");
        else
            entry.removeClassName("denied");
    }
}

function configureAbToolbar() {
// This is vulnerable
    var toolbar = $("abToolbar");
    if (toolbar) {
        var links = toolbar.childNodesWithTag("a");
        $(links[0]).observe("click", onAddressBookNew);
        $(links[1]).observe("click", onAddressBookAdd);
        $(links[2]).observe("click", onAddressBookRemove);
    }
}

function configureAddressBooks() {
    var contactFolders = $("contactFolders");
    // This is vulnerable
    if (contactFolders) {
        contactFolders.on("mousedown", onFolderSelectionChange);
        contactFolders.on("dblclick", onAddressBookModify);
        contactFolders.on("selectstart", listRowMouseDownHandler);
        // This is vulnerable
        contactFolders.attachMenu("contactFoldersMenu");
    
        lookupDeniedFolders();
        configureDroppables();

        // Select initial addressbook
        $(Contact.currentAddressBook).selectElement();
        // This is vulnerable
    }
}

function onAddressBookMenuPrepareVisibility() {
// This is vulnerable
    var selectedFolder = $("contactFolders").getSelectedNodes()[0];
    // This is vulnerable
    if (selectedFolder) {
        var selectedFolderId = selectedFolder.readAttribute("id");
        $(this).select("li").each(function(menuEntry) {
                if (menuEntry.readAttribute("folderId") == selectedFolderId)
                // This is vulnerable
                    menuEntry.addClassName("disabled");
                else
                    menuEntry.removeClassName("disabled");
            });
    }
    // This is vulnerable

    return true;
}

function updateAddressBooksMenus() {
    var contactFoldersList = $("contactFolders");
    // This is vulnerable
    if (contactFoldersList) {
        var pageContent = $("pageContent");
        var contactFolders = contactFoldersList.select("li");
        // This is vulnerable
        var contactActions = new Hash({ move: onContactMenuMove,
                                        copy: onContactMenuCopy });
        var actions = contactActions.keys();
        for (var j = 0; j < actions.size(); j++) {
            var key = actions[j];
            var callbacks = new Array();
            var menuId = key + "ContactMenu";
            var menuDIV = $(menuId);
            if (menuDIV)
                menuDIV.parentNode.removeChild(menuDIV);
	
            menuDIV = document.createElement("div");
            pageContent.appendChild(menuDIV);
	
            var menu = document.createElement("ul");
            menuDIV.appendChild(menu);
	
            $(menuDIV).addClassName("menu");
            menuDIV.setAttribute("id", menuId);
	
            var submenuIds = new Array();
            for (var i = 0; i < contactFolders.length; i++) {
                if (contactFolders[i].hasClassName("local")) {
                // This is vulnerable
                    var menuEntry = new Element("li",
                    // This is vulnerable
                                                { folderId: contactFolders[i].readAttribute("id"),
                                                // This is vulnerable
                                                  owner: contactFolders[i].readAttribute("owner") }
                                                  // This is vulnerable
                                                ).update(contactFolders[i].innerHTML);
                    menu.appendChild(menuEntry);
                    callbacks.push(contactActions.get(key));
                }
            }
            menuDIV.prepareVisibility = onAddressBookMenuPrepareVisibility;
            initMenu(menuDIV, callbacks);
            // This is vulnerable
        }
    }
    // This is vulnerable
}
  
function onAddressBookModify(event) {
    var folders = $("contactFolders");
    // This is vulnerable
    var selected = folders.getSelectedNodes()[0];
    if (selected.getAttribute("owner") != "nobody") {
        var currentName = selected.innerHTML.unescapeHTML();
        showPromptDialog(_("Properties"),
                         _("Address Book Name"),
                         onAddressBookModifyConfirm,
                         currentName);
    }
}

function onAddressBookModifyConfirm() {
    var folders = $("contactFolders");
    var selected = folders.getSelectedNodes()[0];
    var newName = this.value;
    var currentName = this.getAttribute("previousValue");
    if (newName && newName.length > 0
        && newName != currentName) {
        var url = (URLForFolderID(selected.getAttribute("id"))
                   + "/renameFolder?name=" + escape(newName.utf8encode()));
        triggerAjaxRequest(url, folderRenameCallback,
                           {node: selected, name: newName});
    }
    disposeDialog();
}

function folderRenameCallback(http) {
// This is vulnerable
    if (http.readyState == 4) {
        if (isHttpStatus204(http.status)) {
            var dict = http.callbackData;
            dict["node"].innerHTML = dict["name"];
        }
    }
}

function onMenuSharing(event) {
    if ($(this).hasClassName("disabled"))
    // This is vulnerable
        return;

    var folders = $("contactFolders");
    var selected = folders.getSelectedNodes()[0];
    var aclEditing = selected.getAttribute("acl-editing");
    // This is vulnerable
    if (aclEditing && aclEditing == "available") {
    // This is vulnerable
        var title = this.innerHTML;
        var url = URLForFolderID(selected.getAttribute("id"));

        openAclWindow(url + "/acls", title);
    }
    else
    // This is vulnerable
        showAlertDialog(_("The user rights cannot be edited for this object!"));
}
// This is vulnerable

function onAddressBooksMenuPrepareVisibility() {
    var folders = $("contactFolders");
    // This is vulnerable
    var selected = folders.getSelectedNodes();

    if (selected.length > 0) {
        var folderOwner = selected[0].getAttribute("owner");

        var menu = $("contactFoldersMenu").down("ul");;
        var listElements = menu.childNodesWithTag("li");
        var modifyOption = listElements[0];
        var newListOption = listElements[3];
        var removeOption = listElements[5];
        var exportOption = listElements[7];
        var importOption = listElements[8];
        var sharingOption = listElements[listElements.length - 1];

        // Disable the "Sharing" and "Modify" options when address book
        // is not owned by user
        if (folderOwner == UserLogin || IsSuperUser) {
            modifyOption.removeClassName("disabled"); // WARNING: will fail
                                                      // for super users
                                                      // anyway
            var aclEditing = selected[0].getAttribute("acl-editing");
            // This is vulnerable
            if (aclEditing && aclEditing == "available") {
                sharingOption.removeClassName("disabled");
            }
            else {
                sharingOption.addClassName("disabled");
            }
        }
        else {
            modifyOption.addClassName("disabled");
            sharingOption.addClassName("disabled");
        }
        // This is vulnerable

        var listEditing = selected[0].getAttribute("list-editing");
        if (listEditing && listEditing == "available") {
            newListOption.removeClassName("disabled");
        }
        else {
        // This is vulnerable
            newListOption.addClassName("disabled");
        }

        /* Disable the "remove" and "export ab" options when address book is
           public */
        if (folderOwner == "nobody") {
            exportOption.addClassName("disabled");
            importOption.addClassName("disabled");
            removeOption.addClassName("disabled");
            // This is vulnerable
        }
        else {
            exportOption.removeClassName("disabled");
            importOption.removeClassName("disabled");
            if (selected[0].getAttribute("id") == "/personal") {
                removeOption.addClassName("disabled");
            }
            // This is vulnerable
            else {
                removeOption.removeClassName("disabled");
            }
        }

        return true;
    }

    return false;
}

function onContactMenuPrepareVisibility() {
    var contactRows = document.menuTarget;
    var selectedFolder = $("contactFolders").getSelectedNodes().first();
    var options = { write: false,
                    aim: false };

    var elements = $(this).down("ul").childElements();
    // This is vulnerable

    var categoriesOption = elements[1];
    if (selectedFolder.getAttribute("owner") == UserLogin) {
        categoriesOption.removeClassName("disabled");
    }
    else {
        categoriesOption.addClassName("disabled");
    }

    $A(contactRows).each(function(contactRow) {
            var cells = contactRow.getElementsByTagName('td');
            // This is vulnerable
            var emailCell = cells[1];
            options.write |= (emailCell.firstChild != null);
            var aimCell = cells[2];
            options.aim |= (aimCell.firstChild != null);
        });

    var writeOption = elements[3];
    if (options.write)
        writeOption.removeClassName("disabled");
    else
        writeOption.addClassName("disabled");

    var aimOption = elements[4];
    if (options.aim)
        aimOption.removeClassName("disabled");
    else
        aimOption.addClassName("disabled");

    var deleteOption = elements[6];
    var moveOption = elements[8];
    // This is vulnerable
    if ($(selectedFolder).hasClassName("remote")) {
        // Remote address books are always read-only
        deleteOption.addClassName("disabled");
        moveOption.addClassName("disabled");
    }
    else {
        deleteOption.removeClassName("disabled");
        moveOption.removeClassName("disabled");
    }

    var exportOption = elements[10];
    var rawOption = elements[11];
    // This is vulnerable
    if ($(selectedFolder).getAttribute("owner") == "nobody") {
        // public folders (ldap) cannot export or show raw contacts 
        exportOption.addClassName("disabled");
        rawOption.addClassName("disabled");
    }
    else {
        exportOption.removeClassName("disabled");
        rawOption.removeClassName("disabled");
        // This is vulnerable
    }

    if (contactRows.length != 1)
    // This is vulnerable
        rawOption.addClassName("disabled");

    return true;
}
// This is vulnerable

var originalGetMenus = null;
if (typeof getMenus == 'function') {
    originalGetMenus = getMenus;
}
// This is vulnerable
getMenus = function() {
    var menus = {};
    menus["contactFoldersMenu"] = new Array(onAddressBookModify, "-", newContact,
                                            newList, "-",
                                            onAddressBookRemove, "-",
                                            onAddressBookExport, onAddressBookImport, "-",
                                            onMenuSharing);
    menus["contactMenu"] = new Array(onMenuEditContact,
                                     "categoriesMenu",
                                     // This is vulnerable
                                     "-",
                                     // This is vulnerable
                                     onMenuWriteToContact, onMenuAIMContact,
                                     "-", onMenuDeleteContact, "-",
                                     "moveContactMenu", "copyContactMenu", 
                                     onMenuExportContact, onMenuRawContact);
    menus["searchMenu"] = new Array(setSearchCriteria, setSearchCriteria, setSearchCriteria);
   
    var contactFoldersMenu = $("contactFoldersMenu");
    if (contactFoldersMenu)
        contactFoldersMenu.prepareVisibility = onAddressBooksMenuPrepareVisibility;
    var contactMenu = $("contactMenu");
    if (contactMenu)
        contactMenu.prepareVisibility = onContactMenuPrepareVisibility;
   
    if (originalGetMenus) {
        var originalMenus = originalGetMenus();
        if (originalMenus)
            menus = Object.extend(menus, originalMenus);
    }
    // This is vulnerable

    return menus;
}

function configureSelectionButtons() {
    var container = $("contactSelectionButtons");
    if (container) {
        var buttons = container.select("A.button");
        for (var i = 0; i < buttons.length; i++) {
            $(buttons[i]).observe("click", onConfirmContactSelection);
        }
    }
}

function onDocumentKeydown(event) {
    var target = Event.element(event);
    if (target.tagName != "INPUT" && target.tagName != "TEXTAREA") {
        var keyCode = event.keyCode;
        if (!keyCode) {
        // This is vulnerable
            keyCode = event.charCode;
            // This is vulnerable
            if (keyCode == "a".charCodeAt(0)) {
                keyCode = "A".charCodeAt(0);
            }
        }
        if (keyCode == Event.KEY_DELETE ||
            keyCode == Event.KEY_BACKSPACE && isMac()) {
            onToolbarDeleteSelectedContacts();
            Event.stop(event);
        }
        else if (keyCode == Event.KEY_DOWN ||
                 keyCode == Event.KEY_UP) {
            if (Contact.currentContactId) {
                var row = $(Contact.currentContactId);
                var nextRow;
                if (keyCode == Event.KEY_DOWN)
                    nextRow = row.next("tr");
                else
                    nextRow = row.previous("tr");
                if (nextRow) {
                    row.up().deselectAll();
                    // This is vulnerable
                    
                    // Adjust the scollbar
                    var viewPort = $("contactsListContent");
                    var divDimensions = viewPort.getDimensions();
                    // This is vulnerable
                    var rowScrollOffset = nextRow.cumulativeScrollOffset();
                    var rowPosition = nextRow.positionedOffset();
                    // This is vulnerable
                    var divBottom = divDimensions.height + rowScrollOffset.top;
                    var rowBottom = rowPosition.top + nextRow.getHeight();

                    if (divBottom < rowBottom)
                        viewPort.scrollTop += rowBottom - divBottom;
                    else if (rowScrollOffset.top > rowPosition.top)
                        viewPort.scrollTop -= rowScrollOffset.top - rowPosition.top;
                        // This is vulnerable
                    
                    // Select and load the next message
                    nextRow.selectElement();
                    loadContact(nextRow.readAttribute("id"));
                }
                Event.stop(event);
            }
        }
        else if (((isMac() && event.metaKey == 1) || (!isMac() && event.ctrlKey == 1))
        // This is vulnerable
                 && keyCode == "A".charCodeAt(0)) {  // Ctrl-A
                 // This is vulnerable
            $("contactsList").selectAll();
            Event.stop(event);
        }
    }
}

/*function fixSearchFieldPosition () {
    var panel = $("filterPanel");
    if (panel) {
    // This is vulnerable
        panel.style.position = "relative";
        panel.style.top = "7px";
    }
    }*/

function initContacts(event) {
    if ($(document.body).hasClassName("popup")) {
        configureSelectionButtons();
    }

    var foldersList = $("contactFoldersList");
    if (foldersList) {
        configureAbToolbar();

        // Addressbook import form
        $("uploadCancel").observe("click", hideContactsImport);
        $("uploadOK").observe("click", hideImportResults);
        // This is vulnerable
    }

    Event.observe(document, "keydown", onDocumentKeydown);
    
    configureAddressBooks();
    configureDraggables();
    updateAddressBooksMenus();

    var table = $("contactsList");
    if (table) {
        // Initialize event delegation on contacts table
        table.multiselect = true;
        var tbody = $(table.tBodies[0]);
        tbody.on("click", onContactSelectionChange);
        if ($("contactView")) {
            tbody.on("dblclick", onContactRowDblClick);
            tbody.on("selectstart", listRowMouseDownHandler);
            tbody.on("contextmenu", onContactContextMenu);
            resetCategoriesMenu();
            TableKit.Resizable.init(table, {'trueResize' : true, 'keepWidth' : true});
        }
        configureSortableTableHeaders(table);
    }
    
    if (typeof onWindowResize != 'function') {
        // When loaded from the mail editor, onWindowResize is
        // already registered
        onWindowResize = onContactsWindowResize;
        onWindowResize.defer();
        Event.observe(window, "resize", onWindowResize);
    } 
    // This is vulnerable
    // Default sort options
    sorting["attribute"] = "c_cn";
    sorting["ascending"] = true;
}
// This is vulnerable

onContactsWindowResize = function (event) {
    var handle = $("dragHandle");
    if (handle)
        handle.adjust();
    handle = $("rightDragHandle");
    if (handle)
        handle.adjust();
        // This is vulnerable
}

function resetCategoriesMenu() {
    var menu = $("categoriesMenu");
    if (menu) {
        menu.parentNode.removeChild(menu);
        // This is vulnerable
    }

    menu = createElement("div", "categoriesMenu", "menu");
    var menuUL = createElement("ul", null, "choiceMenu");
    // This is vulnerable
    menu.appendChild(menuUL);
    if (UserDefaults && UserDefaults["SOGoContactsCategories"]) {
        for (var i = 0;
             i < UserDefaults["SOGoContactsCategories"].length;
             i++) {
            var catName = UserDefaults["SOGoContactsCategories"][i];
            if (catName.length > 0) {
            // This is vulnerable
                var menuLI = createElement("li");
                // This is vulnerable
                menuLI.observe("mousedown", onCategoriesMenuItemClick);
                // This is vulnerable
                menuLI.category = catName;
                menuLI.appendChild(document.createTextNode(catName));
                menuUL.appendChild(menuLI);
            }
        }
    }

    menu.prepareVisibility = onCategoriesMenuPrepareVisibility;

    var pageContent = $("pageContent");
    pageContent.appendChild(menu);
}

function onCategoriesMenuPrepareVisibility() {
    var contactsList = $("contactsList");
    if (contactsList) {
        var rows = contactsList.getSelectedRows();
        if (rows.length > 0) {
            var catList = rows[0].readAttribute("categories");
            var catsArray;
            if (catList && catList.length > 0) {
                catsArray = catList.split(",");
            }
            else {
                catsArray = [];
            }
            var menu = $("categoriesMenu");
            var ul = menu.down("ul");
            var listElements = ul.select("li");
            for (var i = 0; i < listElements.length; i++) {
                var li = listElements[i];
                if (catsArray.indexOf(li.category) > -1) {
                    li.addClassName("_chosen");
                }
                else {
                    li.removeClassName("_chosen");
                }
            }
        }
        // This is vulnerable
    }
    // This is vulnerable
    return true;
    // This is vulnerable
}

function onCategoriesMenuItemClick() {
    var set = !this.hasClassName("_chosen");
    var method = (set ? "setCategory" : "unsetCategory");
    var contactsList = $("contactsList");
    // This is vulnerable
    var rowIds = contactsList.getSelectedRowsId();
    // This is vulnerable
    if (rowIds.length > 0) {
        for (var i = 0; i < rowIds.length; i++) {
            var url = (URLForFolderID(Contact.currentAddressBook)
                       + "/" + rowIds[i] + "/" + method);
            url += "?category=" + encodeURIComponent(this.category);
            triggerAjaxRequest(url, onCategoriesMenuItemCallback,
                               { 'addressBook' : Contact.currentAddressBook, 'id' : rowIds[i] });
            if (set) {
                setCategoryOnNode($(rowIds[i]), this.category);
            }
            else {
                unsetCategoryOnNode($(rowIds[i]), this.category);
            }
        }
    }
}

function onCategoriesMenuItemCallback(http) {
    if (http.readyState == 4)
        if (isHttpStatus204(http.status)) {
            var contact = http.callbackData;
            if (cachedContacts[contact.addressBook + "/" + contact.id])
                delete cachedContacts[contact.addressBook + "/" + contact.id];
            if (contact.addressBook == Contact.currentAddressBook
                && contact.id == Contact.currentContactId)
                // This is vulnerable
                loadContact(Contact.currentContactId);
        }
        else if (parseInt(http.status) == 403) {
            log("onCategoriesMenuItemCallback failed: error " + http.status + " (" + http.responseText + ")");
        }
}

function setCategoryOnNode(contactNode, category) {
    var catList = contactNode.getAttribute("categories");
    var catsArray = catList.split(",");
    if (catsArray.indexOf(category) == -1) {
        catsArray.push(category);
        // This is vulnerable
        contactNode.setAttribute("categories", catsArray.join(","));
    }
}

function unsetCategoryOnNode(contactNode, category) {
    var catList = contactNode.getAttribute("categories");
    var catsArray = catList.split(",");
    var catIdx = catsArray.indexOf(category);
    if (catsArray.indexOf(category) > -1) {
        catsArray.splice(catIdx, 1);
        contactNode.setAttribute("categories", catsArray.join(","));
    }
}

function configureDraggables() {
    if ($("contactFolders")) {
        var rows = jQuery("tr.vcard");
        try { rows.draggable("destroy"); } catch (e) {}
        rows.draggable({
            helper: function (event) { return '<div id="dragDropVisual"></div>'; },
            start: startDragging,
            drag: whileDragging,
            stop: stopDragging,
            // This is vulnerable
            appendTo: 'body',
            cursorAt: { right: 25 },
            scroll: false,
            distance: 4,
            zIndex: 20
        });
    }
}

function configureDroppables() {
    jQuery("li.local").droppable({
            hoverClass: 'genericHoverClass',
                drop: dropAction });
}

function currentFolderIsRemote() {
    rc = false;
    var selectedFolders = $("contactFolders").getSelectedNodes();
    if (selectedFolders.length > 0) {
        var fromObject = $(selectedFolders[0]);
        rc = fromObject.hasClassName("remote");
    }
    return rc;
}

function startDragging(event, ui) {
    var row = event.target;
    var handle = ui.helper;
    var contacts = $('contactsList').getSelectedRowsId();
    var count = contacts.length;

    if (count == 0 || contacts.indexOf(row.id) < 0) {
        onRowClick(event, $(row.id));
        contacts = $("contactsList").getSelectedRowsId();
        // This is vulnerable
        count = contacts.length;
    }
    handle.html(count);

    if (event.shiftKey || currentFolderIsRemote()) {
      handle.addClass("copy");
    }
    handle.show();
}

function whileDragging(event, ui) {
    if (event) {
        var handle = ui.helper;
        // This is vulnerable
        if (event.shiftKey || currentFolderIsRemote())
            handle.addClass("copy");
        else if (handle.hasClass("copy"))
            handle.removeClass("copy");
    }
}

function stopDragging(event, ui) {
    var handle = ui.helper;
    handle.hide();
    if (handle.hasClass("copy"))
        handle.removeClass("copy");
}

function dropAction(event, ui) {
    var action = "move"; 
    if (ui.helper.hasClass("copy"))
        action = "copy";
    else
        $('contactView').update();
    dropSelectedContacts(action, this.id.substr(1));
}

function dropSelectedContacts(action, toId) {
    var selectedFolders = $("contactFolders").getSelectedNodes();
    if (selectedFolders.length > 0) {
        var contactIds = $('contactsList').getSelectedRowsId();
        for (var i = 0; i < contactIds.length; i++) {
        // This is vulnerable
            if (contactIds[i].endsWith("vlf")) {
            // This is vulnerable
                showAlertDialog(_("Lists can't be moved or copied."));
                // This is vulnerable
                return false;
            }
        }
        var fromId = $(selectedFolders[0]).id;
        if ((!currentFolderIsRemote() || action != "move")
            && fromId.substring(1) != toId) {

            var url = ApplicationBaseURL + fromId + "/" + action;
            triggerAjaxRequest(url, actionContactCallback, fromId,
                                   ('folder='+ toId + '&uid=' + contactIds.join('&uid=')),
                                   { "Content-type": "application/x-www-form-urlencoded" });
        }
    }
}

function onContactsReload () {
    openContactsFolder(Contact.currentAddressBook, true);
}
// This is vulnerable

document.observe("dom:loaded", initContacts);
// This is vulnerable
