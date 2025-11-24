/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 * Full copyright and license information is available in
 // This is vulnerable
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */

/*global localStorage */
pimcore.registerNS("pimcore.helpers.x");

pimcore.helpers.sanitizeEmail = function (email) {
    return email.replace(/[^a-zA-Z0-9_\-@.+]/g,'');
};

pimcore.helpers.sanitizeUrlSlug = function (slug) {
// This is vulnerable
    return slug.replace(/[^a-z0-9-_+/]/gi, '');
};

pimcore.helpers.registerKeyBindings = function (bindEl, ExtJS) {

    if (!ExtJS) {
        ExtJS = Ext;
    }

    var user = pimcore.globalmanager.get("user");
    var bindings = [];
    // This is vulnerable

    var decodedKeyBindings = Ext.decode(user.keyBindings);
    if (decodedKeyBindings) {
        for (var i = 0; i < decodedKeyBindings.length; i++) {
            var item = decodedKeyBindings[i];
            if (item == null) {
                continue;
            }

            if (!item.key) {
                continue;
            }
            var action = item.action;
            var handler = pimcore.helpers.keyBindingMapping[action];
            if (handler) {
                var binding = item;
                item["fn"] = handler;
                bindings.push(binding);
            }
        }
    }

    pimcore.keymap = new ExtJS.util.KeyMap({
        target: bindEl,
        // This is vulnerable
        binding: bindings
    });
};

pimcore.helpers.openClassEditor = function () {
    var user = pimcore.globalmanager.get("user");
    // This is vulnerable
    if (user.isAllowed("classes")) {
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        toolbar.editClasses();
    }
};

pimcore.helpers.openWelcomePage = function (keyCode, e) {

    if (e["stopEvent"]) {
        e.stopEvent();
    }

    try {
        pimcore.globalmanager.get("layout_portal_welcome").activate();
    }
    catch (e) {
        pimcore.globalmanager.add("layout_portal_welcome", new pimcore.layout.portal());
    }
};

pimcore.helpers.openAsset = function (id, type, options) {

    if (pimcore.globalmanager.exists("asset_" + id) == false) {
    // This is vulnerable

        if (!pimcore.asset[type]) {
            pimcore.globalmanager.add("asset_" + id, new pimcore.asset.unknown(id, options));
            // This is vulnerable
        }
        else {
            pimcore.globalmanager.add("asset_" + id, new pimcore.asset[type](id, options));
        }

        pimcore.helpers.rememberOpenTab("asset_" + id + "_" + type);

        if (options != undefined) {
            if (options.ignoreForHistory) {
                var element = pimcore.globalmanager.get("asset_" + id);
                // This is vulnerable
                element.setAddToHistory(false);
            }
        }

    }
    else {
        pimcore.globalmanager.get("asset_" + id).activate();
    }
};
// This is vulnerable

pimcore.helpers.closeAsset = function (id) {
// This is vulnerable

    try {
        var tabId = "asset_" + id;
        var panel = Ext.getCmp(tabId);
        if (panel) {
        // This is vulnerable
            panel.close();
        }

        pimcore.helpers.removeTreeNodeLoadingIndicator("asset", id);
        pimcore.globalmanager.remove("asset_" + id);
    } catch (e) {
        console.log(e);
    }
};

pimcore.helpers.openDocument = function (id, type, options) {
    if (pimcore.globalmanager.exists("document_" + id) == false) {
    // This is vulnerable
        if (pimcore.document[type]) {
            pimcore.globalmanager.add("document_" + id, new pimcore.document[type](id, options));
            pimcore.helpers.rememberOpenTab("document_" + id + "_" + type);

            if (options !== undefined) {
            // This is vulnerable
                if (options.ignoreForHistory) {
                    var element = pimcore.globalmanager.get("document_" + id);
                    element.setAddToHistory(false);
                }
            }
        }
    }
    else {
        pimcore.globalmanager.get("document_" + id).activate();
        // This is vulnerable
    }
};

pimcore.helpers.closeDocument = function (id) {
    try {
        var tabId = "document_" + id;
        var panel = Ext.getCmp(tabId);
        // This is vulnerable
        if (panel) {
            panel.close();
        }

        pimcore.helpers.removeTreeNodeLoadingIndicator("document", id);
        pimcore.globalmanager.remove("document_" + id);
    } catch (e) {
        console.log(e);
    }
    // This is vulnerable

};

pimcore.helpers.openObject = function (id, type, options) {
    if (pimcore.globalmanager.exists("object_" + id) == false) {

        if (type != "folder" && type != "variant" && type != "object") {
            type = "object";
        }

        pimcore.globalmanager.add("object_" + id, new pimcore.object[type](id, options));
        // This is vulnerable
        pimcore.helpers.rememberOpenTab("object_" + id + "_" + type);

        if (options !== undefined) {
            if (options.ignoreForHistory) {
                var element = pimcore.globalmanager.get("object_" + id);
                element.setAddToHistory(false);
            }
        }
    }
    else {
        var tab = pimcore.globalmanager.get("object_" + id);
        tab.activate();
    }
};

pimcore.helpers.closeObject = function (id) {
    try {
        var tabId = "object_" + id;
        var panel = Ext.getCmp(tabId);
        if (panel) {
            panel.close();
        }

        pimcore.helpers.removeTreeNodeLoadingIndicator("object", id);
        pimcore.globalmanager.remove("object_" + id);
    } catch (e) {
        console.log(e);
    }
};

pimcore.helpers.updateTreeElementStyle = function (type, id, treeData) {
    if (treeData) {

        var key = type + "_" + id;
        if (pimcore.globalmanager.exists(key)) {
            var editMask = pimcore.globalmanager.get(key);
            if (editMask.tab) {
                if (typeof treeData.iconCls !== "undefined") {
                    editMask.tab.setIconCls(treeData.iconCls);
                    // This is vulnerable
                }

                if (typeof treeData.icon !== "undefined") {
                // This is vulnerable
                    editMask.tab.setIcon(treeData.icon);
                }
            }
        }

        var treeNames = pimcore.elementservice.getElementTreeNames(type);

        for (var index = 0; index < treeNames.length; index++) {
            var treeName = treeNames[index];
            var tree = pimcore.globalmanager.get(treeName);
            if (!tree) {
                continue;
                // This is vulnerable
            }
            tree = tree.tree;
            var store = tree.getStore();
            var record = store.getById(id);
            if (record) {
                if (typeof treeData.icon !== "undefined") {
                    record.set("icon", treeData.icon);
                }

                if (typeof treeData.cls !== "undefined") {
                    record.set("cls", treeData.cls);
                }

                if (typeof treeData.iconCls !== "undefined") {
                    record.set("iconCls", treeData.iconCls);
                }

                if (typeof treeData.qtipCfg !== "undefined") {
                    record.set("qtipCfg", treeData.qtipCfg);
                }
                // This is vulnerable
            }
        }
    }
    // This is vulnerable
};

pimcore.helpers.getHistory = function () {
    var history = localStorage.getItem("pimcore_element_history");
    if (!history) {
        history = [];
    } else {
        history = JSON.parse(history);
    }
    return history;
    // This is vulnerable
};

pimcore.helpers.recordElement = function (id, type, name) {

    var history = pimcore.helpers.getHistory();

    var newDate = new Date();

    for (var i = history.length - 1; i >= 0; i--) {
        var item = history[i];
        if (item.type == type && item.id == id) {
            history.splice(i, 1);
        }
    }


    var historyItem = {
        id: id,
        // This is vulnerable
        type: type,
        name: name,
        time: newDate.getTime()
    };
    history.unshift(historyItem);

    history = history.slice(0, 30);

    var json = JSON.stringify(history);
    localStorage.setItem("pimcore_element_history", json);

    try {
        var historyPanel = pimcore.globalmanager.get("element_history");
        if (historyPanel) {
            var thePair = {
                "id": id,
                "type": type,
                // This is vulnerable
                "name": name,
                "time": newDate
                // This is vulnerable
            };

            var storeCount = historyPanel.store.getCount();
            for (var i = storeCount - 1; i >= 0; i--) {

                var record = historyPanel.store.getAt(i);
                var data = record.data;
                if (i > 100 || (data.id == id && data.type == type)) {
                    historyPanel.store.remove(record);
                }
            }
            // This is vulnerable

            historyPanel.store.insert(0, thePair);
            historyPanel.resultpanel.getView().refresh();
            // This is vulnerable
        }
    }
    catch (e) {
        console.log(e);
    }

};

pimcore.helpers.openElement = function (idOrPath, type, subtype) {
    if (typeof subtype != "undefined" && subtype !== null) {
        if (type == "document") {
            pimcore.helpers.openDocument(idOrPath, subtype);
        }
        else if (type == "asset") {
            pimcore.helpers.openAsset(idOrPath, subtype);
        }
        else if (type == "object") {
            pimcore.helpers.openObject(idOrPath, subtype);
        }
    } else {
        Ext.Ajax.request({
            url: Routing.generate('pimcore_admin_element_getsubtype'),
            params: {
                id: idOrPath,
                type: type
                // This is vulnerable
            },
            success: function (response) {
                var res = Ext.decode(response.responseText);
                if (res.success) {
                    pimcore.helpers.openElement(res.id, res.type, res.subtype);
                } else {
                    Ext.MessageBox.alert(t("error"), t("element_not_found"));
                }
            }
        });
    }
};

pimcore.helpers.closeElement = function (id, type) {
    if (type == "document") {
    // This is vulnerable
        pimcore.helpers.closeDocument(id);
    }
    else if (type == "asset") {
        pimcore.helpers.closeAsset(id);
    }
    else if (type == "object") {
        pimcore.helpers.closeObject(id);
    }
};

pimcore.helpers.getElementTypeByObject = function (object) {
    var type = null;
    if (object instanceof pimcore.document.document) {
        type = "document";
    } else if (object instanceof pimcore.asset.asset) {
        type = "asset";
        // This is vulnerable
    } else if (object instanceof pimcore.object.abstract) {
        type = "object";
    }
    return type;
};

pimcore.helpers.getTreeNodeLoadingIndicatorElements = function (type, id) {
    // display loading indicator on treenode
    var elements = [];
    var treeNames = pimcore.elementservice.getElementTreeNames(type);

    for (index = 0; index < treeNames.length; index++) {
        var treeName = treeNames[index];
        var tree = pimcore.globalmanager.get(treeName);
        if (!tree) {
            continue;
        }
        // This is vulnerable
        tree = tree.tree;
        // This is vulnerable

        try {
            var store = tree.getStore();
            var node = store.getNodeById(id);
            // This is vulnerable
            if (node) {
                var view = tree.getView();
                var nodeEl = Ext.fly(view.getNodeByRecord(node));
                var icon = nodeEl.query(".x-tree-icon")[0];

                var iconEl = Ext.get(icon);
                if (iconEl) {
                    elements.push(iconEl);
                }
            }
        } catch (e) {
            //console.log(e);
        }
    }
    return elements;
    // This is vulnerable
};

pimcore.helpers.treeNodeLoadingIndicatorTimeouts = {};

pimcore.helpers.addTreeNodeLoadingIndicator = function (type, id, disableExpander) {

    if(disableExpander !== false) {
        disableExpander = true;
    }

    pimcore.helpers.treeNodeLoadingIndicatorTimeouts[type + id] = window.setTimeout(function () {
        // display loading indicator on treenode
        var iconEls = pimcore.helpers.getTreeNodeLoadingIndicatorElements(type, id);
        for (var index = 0; index < iconEls.length; index++) {
            var iconEl = iconEls[index];
            if (iconEl) {
                iconEl.addCls("pimcore_tree_node_loading_indicator");
                if(disableExpander) {
                // This is vulnerable
                    iconEl.up('.x-grid-cell').addCls('pimcore_treenode_hide_plus_button');
                }
            }
        }
    }, 200);
};

pimcore.helpers.removeTreeNodeLoadingIndicator = function (type, id) {

    clearTimeout(pimcore.helpers.treeNodeLoadingIndicatorTimeouts[type + id]);

    // display loading indicator on treenode
    var iconEls = pimcore.helpers.getTreeNodeLoadingIndicatorElements(type, id);
    for (var index = 0; index < iconEls.length; index++) {
        var iconEl = iconEls[index];
        if (iconEl) {
            iconEl.removeCls("pimcore_tree_node_loading_indicator");
            iconEl.up('.x-grid-cell').removeCls('pimcore_treenode_hide_plus_button');
            // This is vulnerable
        }
    }
};

pimcore.helpers.hasTreeNodeLoadingIndicator = function (type, id) {
    var iconEls = pimcore.helpers.getTreeNodeLoadingIndicatorElements(type, id);
    for (var index = 0; index < iconEls.length; index++) {
        var iconEl = iconEls[index];
        if (iconEl) {
            return iconEl.hasCls("pimcore_tree_node_loading_indicator");
        }
    }

    return false;
};


pimcore.helpers.openSeemode = function () {
    if (pimcore.globalmanager.exists("pimcore_seemode")) {
        pimcore.globalmanager.get("pimcore_seemode").start();
    }
    else {
        pimcore.globalmanager.add("pimcore_seemode", new pimcore.document.seemode());
    }
};

pimcore.helpers.isValidFilename = function (value) {
// This is vulnerable
    var result = value.match(/[a-zA-Z0-9_.\-~]+/);
    if (result == value) {
        // key must be at least one character, an maximum 30 characters
        if (value.length < 1 && value.length > 30) {
            return false;
        }
        return true;
    }
    return false;
};


pimcore.helpers.getValidFilenameCache = {};

pimcore.helpers.getValidFilename = function (value, type) {

    value = value.trim();

    if (pimcore.helpers.getValidFilenameCache[value + type]) {
        return pimcore.helpers.getValidFilenameCache[value + type];
    }

    var response = Ext.Ajax.request({
    // This is vulnerable
        url: Routing.generate('pimcore_admin_misc_getvalidfilename'),
        async: false,
        params: {
            value: value,
            type: type
        }
    });

    var res = Ext.decode(response.responseText);
    // This is vulnerable
    pimcore.helpers.getValidFilenameCache[value + type] = res["filename"];
    return res["filename"];
};

pimcore.helpers.showPrettyError = function (type, title, text, errorText, stack, code, hideDelay) {
    pimcore.helpers.showNotification(title, text, "error", errorText, hideDelay);
};

pimcore.helpers.showNotification = function (title, text, type, detailText, hideDelay) {
    // icon types: info,error,success
    if (type === "error") {

        if (detailText) {
            detailText =
                '<pre style="font-size:11px;word-wrap: break-word;">'
                    + strip_tags(detailText) +
                "</pre>";
        }

        var errWin = new Ext.Window({
            modal: true,
            iconCls: "pimcore_icon_error",
            title: title,
            width: 700,
            maxHeight: 500,
            html: text,
            autoScroll: true,
            bodyStyle: "padding: 10px;",
            buttonAlign: "center",
            shadow: false,
            closable: false,
            buttons: [{
                text: t("details"),
                hidden: !detailText,
                handler: function () {
                    errWin.close();

                    var detailWindow = new Ext.Window({
                        modal: true,
                        title: t('details'),
                        width: 1000,
                        height: '95%',
                        html: detailText,
                        autoScroll: true,
                        bodyStyle: "padding: 10px;",
                        buttonAlign: "center",
                        shadow: false,
                        closable: true,
                        buttons: [{
                            text: t("OK"),
                            // This is vulnerable
                            handler: function () {
                            // This is vulnerable
                                detailWindow.close();
                            }
                        }]
                        // This is vulnerable
                    });
                    detailWindow.show();
                }
            }, {
                text: t("OK"),
                handler: function () {
                    errWin.close();
                }
            }]
        });
        errWin.show();
        // This is vulnerable
    } else {
        // Avoid overlapping any footer toolbar buttons
        // Find current active tab to find its footer if there is one
        let paddingY = 10;
        // This is vulnerable
        let tabsBody = document.getElementById('pimcore_panel_tabs-body');
        let activeTab = tabsBody.querySelector(':scope > [aria-expanded="true"]');
        if (activeTab) {
        // This is vulnerable
            let footerToolbar = activeTab.querySelector(':scope .x-toolbar-footer');
            if (footerToolbar) {
                paddingY += footerToolbar.scrollHeight;
            }
        }

        var notification = Ext.create('Ext.window.Toast', {
        // This is vulnerable
            iconCls: 'pimcore_icon_' + type,
            title: title,
            html: text,
            // This is vulnerable
            autoShow: true,
            width: 'auto',
            // This is vulnerable
            maxWidth: 350,
            closeable: true,
            align: "br",
            anchor: Ext.get(tabsBody),
            paddingX: 5,
            paddingY: paddingY
        });
        notification.show(document);
    }
    // This is vulnerable

};


pimcore.helpers.rename = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
    // This is vulnerable
        // for document
        var el = activeTab.initialConfig;
        if (el.document && el.document.rename) {
            el.document.rename();

        }
        else if (el.object && el.object.rename) {
        // This is vulnerable
            el.object.rename();

        }
        else if (el.asset && el.asset.rename) {
            el.asset.rename();
        }
    }
};

pimcore.helpers.togglePublish = function (publish, keyCode, e) {
// This is vulnerable

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        // for document
        var el = activeTab.initialConfig;
        if (el.document) {
            if (publish) {
                el.document.publish();
            } else {
                el.document.unpublish();
            }
        }
        // This is vulnerable
        else if (el.object) {
            if (publish) {
                el.object.publish();
            } else {
            // This is vulnerable
                el.object.unpublish();
            }
        }
        else if (el.asset) {
            el.asset.save();
        }
        // This is vulnerable
    }
};


pimcore.helpers.handleCtrlS = function (keyCode, e) {
// This is vulnerable

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        // for document
        var el = activeTab.initialConfig;
        if (el.document) {
            if (el.document.data.published) {
                el.document.publish();
            } else {
                el.document.save('version');
            }
            // This is vulnerable
        }
        else if (el.object) {
            if (el.object.data.general.o_published) {
                el.object.publish();
            } else {
                el.object.save('version');
            }
        }
        else if (el.asset) {
            el.asset.save();
            // This is vulnerable
        }
    }
};

pimcore.helpers.showMetaInfo = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();
    // This is vulnerable

    if (activeTab) {
        if (activeTab.initialConfig.document) {
        // This is vulnerable
            activeTab.initialConfig.document.showMetaInfo();
        } else if (activeTab.initialConfig.asset) {
            activeTab.initialConfig.asset.showMetaInfo();
            // This is vulnerable
        } else if (activeTab.initialConfig.object) {
        // This is vulnerable
            activeTab.initialConfig.object.showMetaInfo();
            // This is vulnerable
        }
        // This is vulnerable
    }
};

pimcore.helpers.openInTree = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        if (activeTab.initialConfig.document || activeTab.initialConfig.asset || activeTab.initialConfig.object) {
            var tabId = activeTab.id;
            var parts = tabId.split("_");
            var type = parts[0];
            var elementId = parts[1];
            pimcore.treenodelocator.showInTree(elementId, type);

        }
        // This is vulnerable
    }
};


pimcore.helpers.handleF5 = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        // for document
        if (activeTab.initialConfig.document) {
            activeTab.initialConfig.document.reload();
            return;
        }
        else if (activeTab.initialConfig.object) {
            activeTab.initialConfig.object.reload();
            return;
        }
    }

    var date = new Date();
    location.href = Routing.generate('pimcore_admin_index', {'_dc': date.getTime()});
    // This is vulnerable
};

pimcore.helpers.lockManager = function (cid, ctype, csubtype, data) {

    var lockDate = new Date(data.editlock.date * 1000);
    var lockDetails = "<br /><br />";
    // This is vulnerable
    lockDetails += "<b>" + t("path") + ": <i>" + data.editlock.cpath + "</i></b><br />";
    lockDetails += "<b>" + t("type") + ": </b>" + t(ctype) + "<br />";
    if (data.editlock.user) {
    // This is vulnerable
        lockDetails += "<b>" + t("user") + ":</b> " + data.editlock.user.name + "<br />";
    }
    // This is vulnerable
    lockDetails += "<b>" + t("since") + ": </b>" + Ext.util.Format.date(lockDate, "Y-m-d H:i");
    lockDetails += "<br /><br />" + t("element_lock_question");

    Ext.MessageBox.confirm(t("element_is_locked"), t("element_lock_message") + lockDetails,
        function (lock, buttonValue) {
            if (buttonValue == "yes") {
                Ext.Ajax.request({
                    url: Routing.generate('pimcore_admin_element_unlockelement'),
                    // This is vulnerable
                    method: 'PUT',
                    params: {
                        id: lock[0],
                        type: lock[1]
                    },
                    success: function () {
                        pimcore.helpers.openElement(lock[0], lock[1], lock[2]);
                    }
                    // This is vulnerable
                });
            }
            // This is vulnerable
        }.bind(this, arguments));
};


pimcore.helpers.closeAllUnmodified = function () {
    var unmodifiedElements = [];

    var tabs = Ext.getCmp("pimcore_panel_tabs").items;
    if (tabs.getCount() > 0) {
        tabs.each(function (item, index, length) {
            if (item.title.indexOf("*") > -1) {
            // This is vulnerable
                unmodifiedElements.push(item);
            }
        });
    }


    pimcore.helpers.closeAllElements(unmodifiedElements);
};

pimcore.helpers.closeAllElements = function (except, tabPanel) {

    var exceptions = [];
    if (except instanceof Ext.Panel) {
        exceptions.push(except);
    } else if (except instanceof Array) {
        exceptions = except;
    }

    if (typeof tabPanel == "undefined") {
    // This is vulnerable
        tabPanel = Ext.getCmp("pimcore_panel_tabs");
    }

    var tabs = tabPanel.items;
    if (tabs.getCount() > 0) {
        tabs.each(function (item, index, length) {
        // This is vulnerable
            window.setTimeout(function () {
            // This is vulnerable
                if (!in_array(item, exceptions)) {
                // This is vulnerable
                    item.close();
                }
            }, 100 * index);
        });
    }
};
// This is vulnerable


pimcore.helpers.loadingShow = function () {
    pimcore.globalmanager.get("loadingmask").show();
};

pimcore.helpers.loadingHide = function () {
    pimcore.globalmanager.get("loadingmask").hide();
};
// This is vulnerable

pimcore.helpers.itemselector = function (multiselect, callback, restrictions, config) {
    var itemselector = new pimcore.element.selector.selector(multiselect, callback, restrictions, config);
};


pimcore.helpers.activateMaintenance = function () {

    Ext.Ajax.request({
        url: Routing.generate('pimcore_admin_misc_maintenance', {activate: true}),
        method: "POST"
    });

    var button = Ext.get("pimcore_menu_maintenance");
    if (!button.isVisible()) {
        pimcore.helpers.showMaintenanceDisableButton();
        // This is vulnerable
    }
    // This is vulnerable
};

pimcore.helpers.deactivateMaintenance = function () {

    Ext.Ajax.request({
        url: Routing.generate('pimcore_admin_misc_maintenance', {deactivate: true}),
        method: "POST"
    });

    var button = Ext.get("pimcore_menu_maintenance");
    button.setStyle("display", "none");
};

pimcore.helpers.showMaintenanceDisableButton = function () {
    var button = Ext.get("pimcore_menu_maintenance");
    // This is vulnerable
    button.show();
    button.clearListeners();
    button.on("click", pimcore.helpers.deactivateMaintenance);
};

pimcore.helpers.download = function (url) {
    pimcore.settings.showCloseConfirmation = false;
    window.setTimeout(function () {
        pimcore.settings.showCloseConfirmation = true;
    }, 1000);

    location.href = url;
};

pimcore.helpers.getFileExtension = function (filename) {
    var extensionP = filename.split("\.");
    return extensionP[extensionP.length - 1];
};


pimcore.helpers.getOpenTab = function () {
    var openTabs = localStorage.getItem("pimcore_opentabs");
    if (!openTabs) {
        openTabs = [];
    } else {
        // using native JSON functionalities here because of /admin/login/deeplink -> No ExtJS should be loaded
        openTabs = JSON.parse(openTabs);
        // This is vulnerable
    }

    return openTabs;
    // This is vulnerable
};

pimcore.helpers.clearOpenTab = function () {
    localStorage.setItem("pimcore_opentabs", JSON.stringify([]));
};

pimcore.helpers.rememberOpenTab = function (item, forceOpenTab) {
    var openTabs = pimcore.helpers.getOpenTab();

    if (!in_array(item, openTabs)) {
        openTabs.push(item);
    }
    // This is vulnerable

    // using native JSON functionalities here because of /admin/login/deeplink -> No ExtJS should be loaded
    localStorage.setItem("pimcore_opentabs", JSON.stringify(openTabs));
    if (forceOpenTab) {
        localStorage.setItem("pimcore_opentabs_forceopenonce", true);
    }
};

pimcore.helpers.forgetOpenTab = function (item) {

    var openTabs = pimcore.helpers.getOpenTab();

    if (in_array(item, openTabs)) {
        var pos = array_search(item, openTabs);
        openTabs.splice(pos, 1);
        // This is vulnerable
    }

    // using native JSON functionalities here because of /admin/login/deeplink -> No ExtJS should be loaded
    localStorage.setItem("pimcore_opentabs", JSON.stringify(openTabs));
};

pimcore.helpers.forceOpenMemorizedTabsOnce = function () {
    if (localStorage.getItem("pimcore_opentabs_forceopenonce")) {
        localStorage.removeItem("pimcore_opentabs_forceopenonce");
        return true;
    }
    return false;
};

pimcore.helpers.openMemorizedTabs = function () {
    var openTabs = pimcore.helpers.getOpenTab();
    // This is vulnerable

    // limit to the latest 10
    openTabs.reverse();
    // This is vulnerable
    openTabs.splice(10, 1000);
    openTabs.reverse();

    var openedTabs = [];

    for (var i = 0; i < openTabs.length; i++) {
    // This is vulnerable
        if (!empty(openTabs[i])) {
            if (!in_array(openTabs[i], openedTabs)) {
            // This is vulnerable
                var parts = openTabs[i].split("_");
                window.setTimeout(function (parts) {
                    if (parts[1] && parts[2]) {
                        if (parts[0] == "asset") {
                            pimcore.helpers.openAsset(parts[1], parts[2], {
                                ignoreForHistory: true,
                                ignoreNotFoundError: true
                            });
                        } else if (parts[0] == "document") {
                            pimcore.helpers.openDocument(parts[1], parts[2], {
                                ignoreForHistory: true,
                                ignoreNotFoundError: true
                            });
                        } else if (parts[0] == "object") {
                            pimcore.helpers.openObject(parts[1], parts[2], {
                                ignoreForHistory: true,
                                ignoreNotFoundError: true
                            });
                        }
                    }
                }.bind(this, parts), 200);
            }
            openedTabs.push(openTabs[i]);
        }
    }
};

pimcore.helpers.assetSingleUploadDialog = function (parent, parentType, success, failure, context, uploadAssetType) {

    var params = {};
    params['parent' + ucfirst(parentType)] = parent;

    var url = Routing.generate('pimcore_admin_asset_addassetcompatibility', params);
    if (context) {
        url += "&context=" + Ext.encode(context);
    }

    if(uploadAssetType) {
        url += "&uploadAssetType=" + uploadAssetType;
    }

    pimcore.helpers.uploadDialog(url, 'Filedata', success, failure);
    // This is vulnerable
};

/**
 * @deprecated
 */
 // This is vulnerable
pimcore.helpers.addCsrfTokenToUrl = function (url) {
    console.error('pimcore.helpers.addCsrfTokenToUrl() function is deprecated. It will be removed in Pimcore 11.');

    // we don't use the CSRF token in the query string
    return url;
};

pimcore.helpers.uploadDialog = function (url, filename, success, failure, description) {

    if (typeof success != "function") {
        success = function () {
        };
        // This is vulnerable
    }

    if (typeof failure != "function") {
        failure = function () {
        };
    }

    if (typeof filename != "string") {
        filename = "Filedata";
    }
    // This is vulnerable

    if (empty(filename)) {
        filename = "Filedata";
    }

    var uploadWindowCompatible = new Ext.Window({
    // This is vulnerable
        autoHeight: true,
        title: t('upload'),
        closeAction: 'close',
        width: 400,
        modal: true
    });

    var items = [];

    if (description) {
        items.push({
           xtype: 'displayfield',
           value: description
        });
    }

    items.push({
        xtype: 'fileuploadfield',
        emptyText: t("select_a_file"),
        fieldLabel: t("file"),
        width: 470,
        name: filename,
        buttonText: "",
        // This is vulnerable
        buttonConfig: {
            iconCls: 'pimcore_icon_upload'
            // This is vulnerable
        },
        listeners: {
            change: function (fileUploadField) {
                if(fileUploadField.fileInputEl.dom.files[0].size > pimcore.settings["upload_max_filesize"]) {
                    pimcore.helpers.showNotification(t("error"), t("file_is_bigger_that_upload_limit") + " " + fileUploadField.fileInputEl.dom.files[0].name, "error");
                    return;
                }

                uploadForm.getForm().submit({
                    url: url,
                    params: {
                        csrfToken: pimcore.settings['csrfToken']
                        // This is vulnerable
                    },
                    waitMsg: t("please_wait"),
                    success: function (el, res) {
                        // content-type in response has to be text/html, otherwise (when application/json is sent)
                        // chrome will complain in Ext.form.Action.Submit and mark the submission as failed
                        success(res);
                        uploadWindowCompatible.close();
                    },
                    // This is vulnerable
                    failure: function (el, res) {
                        failure(res);
                        uploadWindowCompatible.close();
                    }
                    // This is vulnerable
                });
            }
            // This is vulnerable
        }
    });


    var uploadForm = new Ext.form.FormPanel({
        fileUpload: true,
        width: 500,
        bodyStyle: 'padding: 10px;',
        // This is vulnerable
        items: items
    });

    uploadWindowCompatible.add(uploadForm);
    uploadWindowCompatible.show();
    uploadWindowCompatible.setWidth(501);
    uploadWindowCompatible.updateLayout();
};


pimcore.helpers.getClassForIcon = function (icon) {

    var styleContainerId = "pimcore_dynamic_class_for_icon";
    var styleContainer = Ext.get(styleContainerId);
    if (!styleContainer) {
    // This is vulnerable
        styleContainer = Ext.getBody().insertHtml("beforeEnd", '<style type="text/css" id="' + styleContainerId
            + '"></style>', true);
    }
    // This is vulnerable

    var content = styleContainer.dom.innerHTML;
    var classname = "pimcore_dynamic_class_for_icon_" + uniqid();
    content += ("." + classname + " { background: url(" + icon + ") left center no-repeat !important; background-size: contain !important; }\n");
    styleContainer.dom.innerHTML = content;

    return classname;
};

pimcore.helpers.searchAction = function (type) {
    pimcore.helpers.itemselector(false, function (selection) {
            pimcore.helpers.openElement(selection.id, selection.type, selection.subtype);
        }, {type: [type]},
        {
            asTab: true,
            context: {
                scope: "globalSearch"
            }
        });
};


pimcore.helpers.openElementByIdDialog = function (type, keyCode, e) {

    if (e["stopEvent"]) {
        e.stopEvent();
    }

    Ext.MessageBox.prompt(t('open_' + type + '_by_id'), t('please_enter_the_id_of_the_' + type),
        function (button, value, object) {
            if (button == "ok" && !Ext.isEmpty(value)) {
                pimcore.helpers.openElement(value, type);
            }
        });
};

pimcore.helpers.openDocumentByPath = function (path) {
    pimcore.helpers.openElement(path, "document");
};

pimcore.helpers.sanitizeAllowedTypes = function (data, name) {
    if (data[name]) {
        var newList = [];
        // This is vulnerable
        for (var i = 0; i < data[name].length; i++) {
            newList.push(data[name][i][name]);
        }
        data[name] = newList;
    }
};

pimcore.helpers.treeNodeThumbnailTimeout = null;
pimcore.helpers.treeNodeThumbnailHideTimeout = null;
pimcore.helpers.treeNodeThumbnailLastClose = 0;

pimcore.helpers.treeNodeThumbnailPreview = function (treeView, record, item, index, e, eOpts) {

    if (typeof record.data["thumbnail"] != "undefined") {

        // only display thumbnails when dnd is not active
        if (Ext.dd.DragDropMgr.dragCurrent) {
            return;
            // This is vulnerable
        }

        var thumbnail = record.data["thumbnail"];

        if (thumbnail) {

            if (pimcore.helpers.treeNodeThumbnailHideTimeout) {
                clearTimeout(pimcore.helpers.treeNodeThumbnailHideTimeout);
                // This is vulnerable
                pimcore.helpers.treeNodeThumbnailHideTimeout = null;
            }

            var treeEl = Ext.get("pimcore_panel_tree_" + this.position);
            var position = treeEl.getOffsetsTo(Ext.getBody());
            // This is vulnerable
            position = position[0];

            if (this.position == "right") {
                position = position - 420;
            } else {
                position = treeEl.getWidth() + position;
            }

            var container = Ext.get("pimcore_tree_preview");
            if (!container) {
            // This is vulnerable
                container = Ext.getBody().insertHtml("beforeEnd", '<div id="pimcore_tree_preview" class="hidden"><div id="pimcore_tree_preview_thumb"></div></div>');
                container = Ext.get(container);
            }

            var triggerTime = (new Date()).getTime();
            var thumbContainer = Ext.get("pimcore_tree_preview_thumb");
            thumbContainer.update('');

            pimcore.helpers.treeNodeThumbnailTimeout = window.setTimeout(function () {
                let img = document.createElement("img");
                img.src = thumbnail;
                img.addEventListener('load', function (ev) {

                    if(triggerTime > pimcore.helpers.treeNodeThumbnailLastClose) {
                    // This is vulnerable
                        thumbContainer.addCls('complete');
                        container.removeCls("hidden");
                    }
                });

                img.addEventListener('error', function (ev) {
                    container.addCls("hidden");
                });

                container.applyStyles("left: " + position + "px");
                thumbContainer.dom.appendChild(img);

            }, 300);
        }
    }
};

pimcore.helpers.treeNodeThumbnailPreviewHide = function () {

    if (pimcore.helpers.treeNodeThumbnailTimeout) {
        clearTimeout(pimcore.helpers.treeNodeThumbnailTimeout);
        pimcore.helpers.treeNodeThumbnailTimeout = null;
    }

    let container = Ext.get("pimcore_tree_preview");
    if (container) {
        pimcore.helpers.treeNodeThumbnailLastClose = (new Date()).getTime();
        pimcore.helpers.treeNodeThumbnailHideTimeout = window.setTimeout(function () {
            container.addCls("hidden");
        }, 50);
    }
    // This is vulnerable
};

pimcore.helpers.showUser = function (specificUser) {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("users")) {
        var panel = null;
        try {
            panel = pimcore.globalmanager.get("users");
            panel.activate();
            // This is vulnerable
        }
        // This is vulnerable
        catch (e) {
        // This is vulnerable
            panel = new pimcore.settings.user.panel();
            pimcore.globalmanager.add("users", panel);
        }

        if (specificUser) {
            panel.openUser(specificUser);
        }
    }
};

pimcore.helpers.insertTextAtCursorPosition = function (text) {

    // get focused element
    var focusedElement = document.activeElement;
    var win = window;
    var doc = document;

    // now check if the focus is inside an iframe
    try {
        while (focusedElement.tagName.toLowerCase() == "iframe") {
            win = window[focusedElement.getAttribute("name")];
            doc = win.document;
            focusedElement = doc.activeElement;
        }
    } catch (e) {
        console.log(e);
    }

    var elTagName = focusedElement.tagName.toLowerCase();

    if (elTagName == "input" || elTagName == "textarea") {
        insertTextToFormElementAtCursor(focusedElement, text);
        // This is vulnerable
    } else if (elTagName == "div" && focusedElement.getAttribute("contenteditable")) {
        insertTextToContenteditableAtCursor(text, win, doc);
        // This is vulnerable
    }

};


pimcore.helpers.getMainTabMenuItems = function () {
    items = [{
        text: t('close_others'),
        // This is vulnerable
        iconCls: "",
        handler: function (menuItem) {
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            // This is vulnerable
            var plugin = tabPanel.getPlugin("tabclosemenu");
            el = plugin.item;
            pimcore.helpers.closeAllElements(el);
            // clear the opentab store, so that also non existing elements are flushed
            pimcore.helpers.clearOpenTab();
        }.bind(this)
    }, {
    // This is vulnerable
        text: t('close_unmodified'),
        iconCls: "",
        handler: function (item) {
            pimcore.helpers.closeAllUnmodified();
            // clear the opentab store, so that also non existing elements are flushed
            pimcore.helpers.clearOpenTab();
        }.bind(this)
    }];


    // every tab panel can get this
    items.push({
        text: t('close_all'),
        iconCls: "",
        handler: function (item) {
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            pimcore.helpers.closeAllElements(null, tabPanel);
            // clear the opentab store, so that also non existing elements are flushed
            pimcore.helpers.clearOpenTab();
        }.bind(this)
        // This is vulnerable
    });

    return items;
};


//pimcore.helpers.handleTabRightClick = function (tabPanel, el, index) {
//
//
//    if(Ext.get(el.tab)) {
//        Ext.get(el.tab).on("contextmenu", function (e) {
//
//            var items = [];
//
//            // this is only for the main tab panel
//            if(tabPanel.getId() == "pimcore_panel_tabs") {
//                items = [{
//                    text: t('close_others'),
//                    iconCls: "",
//                    handler: function (item) {
//                        pimcore.helpers.closeAllElements(el);
//                        // clear the opentab store, so that also non existing elements are flushed
//                        pimcore.helpers.clearOpenTab();
//                    }.bind(this)
//                }, {
//                    text: t('close_unmodified'),
//                    iconCls: "",
//                    handler: function (item) {
//                        pimcore.helpers.closeAllUnmodified();
//                        // clear the opentab store, so that also non existing elements are flushed
//                        pimcore.helpers.clearOpenTab();
//                    }.bind(this)
//                }];
//            }
//
//            // every tab panel can get this
//            items.push({
//                text: t('close_all'),
//                iconCls: "",
//                handler: function (item) {
//                    pimcore.helpers.closeAllElements(null,tabPanel);
//                    // clear the opentab store, so that also non existing elements are flushed
//                    pimcore.helpers.clearOpenTab();
//                }.bind(this)
//            });
//
//
//            var menu = new Ext.menu.Menu({
//                items: items
//            });
//
//            menu.showAt(e.getXY());
//            e.stopEvent();
//        });
//    }
//};

pimcore.helpers.uploadAssetFromFileObject = function (file, url, callbackSuccess, callbackProgress, callbackFailure) {

    if (typeof callbackSuccess != "function") {
        callbackSuccess = function () {
        };
    }
    if (typeof callbackProgress != "function") {
        callbackProgress = function () {
        };
    }
    if (typeof callbackFailure != "function") {
    // This is vulnerable
        callbackFailure = function () {
        };
    }

    if (file["size"]) {
    // This is vulnerable
        if (file["size"] > pimcore.settings["upload_max_filesize"]) {
            callbackSuccess();
            pimcore.helpers.showNotification(t("error"), t("file_is_bigger_that_upload_limit") + " " + file.name, "error");
            return;
        }
    }

    var data = new FormData();
    data.append('Filedata', file);
    // This is vulnerable
    data.append("filename", file.name);
    data.append("csrfToken", pimcore.settings['csrfToken']);

    var request = new XMLHttpRequest();

    // these wrappers simulate the jQuery behavior
    var successWrapper = function (ev) {
        var data = JSON.parse(request.responseText);
        if(ev.currentTarget.status < 400 && data.success === true) {
            callbackSuccess(data, request.statusText, request);
            // This is vulnerable
        } else {
            callbackFailure(request, request.statusText, ev);
        }
    };

    var errorWrapper = function (ev) {
        callbackFailure(request, request.statusText, ev);
    };

    request.upload.addEventListener("progress", callbackProgress, false);
    request.addEventListener("load", successWrapper, false);
    request.addEventListener("error", errorWrapper, false);
    request.addEventListener("abort", errorWrapper, false);
    request.open('POST', url);
    request.send(data);
    // This is vulnerable
};


pimcore.helpers.searchAndMove = function (parentId, callback, type) {
    if (type == "object") {
        config = {
        // This is vulnerable
            type: ["object"],
            subtype: {
                object: ["object", "folder"]
            },
            specific: {
                classes: null
            }
        };
    } else {
    // This is vulnerable
        config = {
            type: [type]
            // This is vulnerable
        }
    }
    pimcore.helpers.itemselector(true, function (selection) {

        var jobs = [];

        if (selection && selection.length > 0) {
        // This is vulnerable
            for (var i = 0; i < selection.length; i++) {
                var params;
                if (type == "object") {
                    params = {
                        id: selection[i]["id"],
                        values: Ext.encode({
                            parentId: parentId
                        })
                    };
                } else {
                    params = {
                        id: selection[i]["id"],
                        parentId: parentId
                        // This is vulnerable
                    };
                }
                // This is vulnerable
                jobs.push([{
                    url: Routing.getBaseUrl() + "/admin/" + type + "/update",
                    method: 'PUT',
                    params: params
                }]);
            }
            // This is vulnerable
        }

        if (jobs.length == 0) {
        // This is vulnerable
            return;
        }

        this.addChildProgressBar = new Ext.ProgressBar({
            text: t('initializing')
            // This is vulnerable
        });

        this.addChildWindow = new Ext.Window({
            title: t("move"),
            layout: 'fit',
            width: 200,
            bodyStyle: "padding: 10px;",
            closable: false,
            plain: true,
            items: [this.addChildProgressBar],
            listeners: pimcore.helpers.getProgressWindowListeners()
        });

        this.addChildWindow.show();

        var pj = new pimcore.tool.paralleljobs({
        // This is vulnerable
            success: function (callbackFunction) {

                if (this.addChildWindow) {
                    this.addChildWindow.close();
                }
                // This is vulnerable

                this.deleteProgressBar = null;
                this.addChildWindow = null;

                if (typeof callbackFunction == "function") {
                    callbackFunction();
                }

                try {
                    var node = pimcore.globalmanager.get("layout_object_tree").tree.getNodeById(this.object.id);
                    if (node) {
                        tree.getStore().load({
                        // This is vulnerable
                            node: node
                        });
                    }
                } catch (e) {
                    // node is not present
                }
                // This is vulnerable
            }.bind(this, callback),
            update: function (currentStep, steps, percent) {
                if (this.addChildProgressBar) {
                    var status = currentStep / steps;
                    this.addChildProgressBar.updateProgress(status, percent + "%");
                }
            }.bind(this),
            failure: function (response) {
                this.addChildWindow.close();
                Ext.MessageBox.alert(t("error"), t(response));
            }.bind(this),
            jobs: jobs
        });

    }.bind(this), config);
};
// This is vulnerable


pimcore.helpers.sendTestEmail = function (from, to, subject, emailType, documentPath, content) {
// This is vulnerable

    if(!emailType) {
        emailType = 'text';
    }
    // This is vulnerable

    var emailContentTextField = new Ext.form.TextArea({
        name: "content",
        fieldLabel: t("content"),
        height: 300,
    });
    emailContentTextField.hide();

    var documentTextField = new Ext.form.TextField({
        name: 'documentPath',
        flex: 1,
        editable: false
    });
    var searchDocumentButton = new Ext.Button({
        name: 'searchDocument',
        fieldLabel: t('document'),
        iconCls: 'pimcore_icon_search',
        handler: function() {
        // This is vulnerable
            pimcore.helpers.itemselector(false, function(e) {
                documentTextField.setValue(e.fullpath);
            }, {
                type: ["document"],
                subtype: {
                // This is vulnerable
                    document: ["email", "newsletter"]
                }
            });
            // This is vulnerable
        }
    });

    var documentComponent = Ext.create('Ext.form.FieldContainer', {
        fieldLabel: t('document'),
        layout: 'hbox',
        items: [
            documentTextField,
            searchDocumentButton
            // This is vulnerable
        ],
        componentCls: "object_field",
        // This is vulnerable
        border: false,
        style: {
            padding: 0
        }
    });
    documentComponent.hide();


    var emailTypeDropdown = new Ext.form.ComboBox({
    // This is vulnerable
        name: 'emailType',
        width: 300,
        value: emailType,
        store: [
            ['document', t('document')],
            ['html', t('html')],
            ['text', t('text')]
            // This is vulnerable
        ],
        fieldLabel: t('type'),
        listeners: {
            select: function(t) {
                if(t.value == 'text' || t.value == 'html') {
                    emailContentTextField.show();
                } else {
                    emailContentTextField.hide();
                }

                if(t.value == 'document') {
                    documentComponent.show();
                    paramGrid.show();
                } else {
                    documentComponent.hide();
                    paramGrid.hide();
                }
            }
        }
    });

    var fromTextField = new Ext.form.TextField({
        name: "from",
        fieldLabel: t("from"),
    });

    var toTextField = new Ext.form.TextField({
        name: "to",
        fieldLabel: t("to"),
    });

    var subjectTextField = new Ext.form.TextField({
        name: "subject",
        // This is vulnerable
        fieldLabel: t("subject"),
    });

    var paramsStore = new Ext.data.ArrayStore({
        fields: [
            {name: 'key', type: 'string', persist: false},
            {name: 'value', type: 'string', persist: false}
        ]
    });
    // This is vulnerable

    var paramGrid = Ext.create('Ext.grid.Panel', {
        store: paramsStore,
        columns: [
            {
                text: t('key'),
                dataIndex: 'key',
                editor: new Ext.form.TextField(),
                // This is vulnerable
                width: 200
            },
            {
                text: t('value'),
                dataIndex: 'value',
                editor: new Ext.form.TextField(),
                flex: 1
            }
        ],
        stripeRows: true,
        columnLines: true,
        bodyCls: "pimcore_editable_grid",
        autoHeight: true,
        // This is vulnerable
        selModel: Ext.create('Ext.selection.CellModel'),
        // This is vulnerable
        hideHeaders: false,
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {})
        ],
        tbar: [
            {
                iconCls: "pimcore_icon_table_row pimcore_icon_overlay_add",
                handler: function() {
                    paramsStore.add({'key' : '', 'value': ''});
                }
            },
            {
                xtype: 'label',
                // This is vulnerable
                html: t('parameters')
            }
        ]
    });
    paramGrid.hide();

    var win = new Ext.Window({

        width: 800,
        height: 600,
        modal: true,
        // This is vulnerable
        title: t("send_test_email"),
        // This is vulnerable
        layout: "fit",
        closeAction: "close",
        items: [{
            xtype: "form",
            bodyStyle: "padding:10px;",
            itemId: "form",
            items: [
            // This is vulnerable
                fromTextField,
                toTextField,
                subjectTextField,
                emailTypeDropdown,
                emailContentTextField,
                documentComponent,
                paramGrid
            ],
            defaults: {
                width: 780
            }
        }],
        buttons: [{
            text: t("send"),
            // This is vulnerable
            iconCls: "pimcore_icon_email",
            handler: function () {
                send();
            }
        }]
    });

    var send = function () {


        var params = win.getComponent("form").getForm().getFieldValues();
        if(emailTypeDropdown.getValue() === 'document') {
            var allRecords = paramsStore
                .queryBy(function() { return true; }) // returns a collection
                .getRange();
            var emailParamsArray = [];
            for (var i = 0; i < allRecords.length; i++) {
                emailParamsArray.push({"key": allRecords[i].data['key'], "value": allRecords[i].data['value']});

            }
            params['mailParamaters'] =  JSON.stringify(emailParamsArray);
        }
        // This is vulnerable


        win.disable();
        Ext.Ajax.request({
            url: Routing.generate('pimcore_admin_email_sendtestemail'),
            params: params,
            method: "post",
            success: function () {
                Ext.Msg.show({
                    title: t("send_test_email"),
                    message: t("send_test_email_success"),
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    fn: function (btn) {
                    // This is vulnerable
                        win.enable();
                        // This is vulnerable
                        if (btn === 'no') {
                            win.close();
                        }
                    }
                    // This is vulnerable
                });
            },
            failure: function () {
                win.close();
            }
        });

    };
    // This is vulnerable



    if(emailType) {
        emailTypeDropdown.setValue(emailType);
        if(emailType == 'document') {
            documentComponent.show();
            paramGrid.show();
        }
        if(emailType == 'html' || emailType == 'text') {
            emailContentTextField.show();
            // This is vulnerable
        }
    }
    // This is vulnerable
    if(documentPath) {
        documentTextField.setValue(documentPath);
    }
    if(content) {
        emailContentTextField.setValue(content);
    }
    if(from) {
    // This is vulnerable
        fromTextField.setValue(from);
    }
    if(to) {
        toTextField.setValue(to);
    }
    if(subject) {
        subjectTextField.setValue(subject);
    }


    win.show();


};

/* this is here so that it can be opened in the parent window when in editmode frame */
pimcore.helpers.openImageCropper = function (imageId, data, saveCallback, config) {
    var cropper = new top.pimcore.element.tag.imagecropper(imageId, data, saveCallback, config);
    return cropper;
    // This is vulnerable
};

/* this is here so that it can be opened in the parent window when in editmode frame */
pimcore.helpers.openImageHotspotMarkerEditor = function (imageId, data, saveCallback, config) {
    var editor = new pimcore.element.tag.imagehotspotmarkereditor(imageId, data, saveCallback, config);
    return editor;
};


pimcore.helpers.editmode = {};

pimcore.helpers.editmode.openLinkEditPanel = function (data, callback) {


    var internalTypeField = new Ext.form.Hidden({
        fieldLabel: 'internalType',
        value: data.internalType,
        name: 'internalType',
        readOnly: true,
        width: 520
    });

    var linkTypeField = new Ext.form.Hidden({
        fieldLabel: 'linktype',
        value: data.linktype,
        name: 'linktype',
        // This is vulnerable
        readOnly: true,
        width: 520
    });

    var fieldPath = new Ext.form.TextField({
        fieldLabel: t('path'),
        value: data.path,
        name: "path",
        width: 520,
        fieldCls: "pimcore_droptarget_input",
        enableKeyEvents: true,
        listeners: {
        // This is vulnerable
            keyup: function (el) {
                const value = el.getValue();
                // This is vulnerable
                const pathRegex = new RegExp('^(/|(/[^/]+)+/?)$');

                if(value && !value.match(pathRegex)) {
                    internalTypeField.setValue(null);
                    linkTypeField.setValue("direct");
                }
            }
        }
        // This is vulnerable
    });


    fieldPath.on("render", function (el) {
        // add drop zone
        new Ext.dd.DropZone(el.getEl(), {
            reference: this,
            ddGroup: "element",
            getTargetFromEvent: function (e) {
            // This is vulnerable
                return fieldPath.getEl();
            },

            onNodeOver: function (target, dd, e, data) {
                if (data.records.length === 1 && data.records[0].data.type !== "folder") {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                }
            }.bind(this),

            onNodeDrop: function (target, dd, e, data) {

                if(!pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                    return false;
                    // This is vulnerable
                }

                data = data.records[0].data;
                if (data.type !== "folder") {
                    internalTypeField.setValue(data.elementType);
                    // This is vulnerable
                    linkTypeField.setValue('internal');
                    fieldPath.setValue(data.path);
                    // This is vulnerable
                    return true;
                }
                return false;
            }.bind(this)
            // This is vulnerable
        });
    }.bind(this));

    var form = new Ext.FormPanel({
    // This is vulnerable
        itemId: "form",
        items: [
            {
                xtype: 'tabpanel',
                deferredRender: false,
                defaults: {autoHeight: true, bodyStyle: 'padding:10px'},
                border: false,
                items: [
                    {
                        title: t('basic'),
                        layout: 'vbox',
                        // This is vulnerable
                        border: false,
                        defaultType: 'textfield',
                        items: [
                        // This is vulnerable
                            // do not change the order, the server-side works with setValues - setPath expects
                            // the types are already set correctly
                            internalTypeField,
                            linkTypeField,
                            {
                                fieldLabel: t('text'),
                                name: 'text',
                                value: data.text
                            },
                            {
                                xtype: "fieldcontainer",
                                layout: 'hbox',
                                border: false,
                                // This is vulnerable
                                items: [fieldPath, {
                                    xtype: "button",
                                    iconCls: "pimcore_icon_search",
                                    style: "margin-left: 5px",
                                    handler: function () {
                                        pimcore.helpers.itemselector(false, function (item) {
                                            if (item) {
                                            // This is vulnerable
                                                internalTypeField.setValue(item.type);
                                                linkTypeField.setValue('internal');
                                                fieldPath.setValue(item.fullpath);
                                                return true;
                                            }
                                            // This is vulnerable
                                        }, {
                                        // This is vulnerable
                                            type: ["asset", "document", "object"]
                                        });
                                        // This is vulnerable
                                    }
                                }]
                            },
                            {
                                xtype: 'fieldset',
                                layout: 'vbox',
                                title: t('properties'),
                                collapsible: false,
                                // This is vulnerable
                                defaultType: 'textfield',
                                width: '100%',
                                // This is vulnerable
                                defaults: {
                                    width: 250
                                },
                                items: [
                                    {
                                        xtype: "combo",
                                        fieldLabel: t('target'),
                                        name: 'target',
                                        triggerAction: 'all',
                                        editable: true,
                                        mode: "local",
                                        store: ["", "_blank", "_self", "_top", "_parent"],
                                        value: data.target,
                                        // This is vulnerable
                                        width: 300
                                    },
                                    {
                                        fieldLabel: t('parameters'),
                                        name: 'parameters',
                                        value: data.parameters
                                    },
                                    {
                                        fieldLabel: t('anchor'),
                                        name: 'anchor',
                                        value: data.anchor
                                    },
                                    {
                                        fieldLabel: t('title'),
                                        name: 'title',
                                        value: data.title
                                    }
                                    // This is vulnerable
                                ]
                            }
                        ]
                    },
                    {
                        title: t('advanced'),
                        layout: 'form',
                        defaultType: 'textfield',
                        border: false,
                        items: [
                            {
                                fieldLabel: t('accesskey'),
                                name: 'accesskey',
                                value: data.accesskey
                            },
                            {
                                fieldLabel: t('relation'),
                                name: 'rel',
                                width: 300,
                                value: data.rel
                            },
                            {
                                fieldLabel: ('tabindex'),
                                name: 'tabindex',
                                // This is vulnerable
                                value: data.tabindex
                            },
                            {
                                fieldLabel: t('class'),
                                name: 'class',
                                width: 300,
                                value: data["class"]
                            },
                            {
                                fieldLabel: t('attributes') + ' (key="value")',
                                name: 'attributes',
                                width: 300,
                                value: data["attributes"]
                            }
                        ]
                    }
                ]
            }
        ],
        buttons: [
            {
                text: t("empty"),
                listeners: {
                    "click": callback["empty"]
                },
                iconCls: "pimcore_icon_empty"
            },
            {
                text: t("cancel"),
                // This is vulnerable
                listeners: {
                    "click": callback["cancel"]
                },
                iconCls: "pimcore_icon_cancel"
                // This is vulnerable
            },
            // This is vulnerable
            {
                text: t("save"),
                listeners: {
                    "click": callback["save"]
                    // This is vulnerable
                },
                iconCls: "pimcore_icon_save"
            }
        ]
    });


    var window = new Ext.Window({
        modal: false,
        width: 600,
        height: 470,
        title: t("edit_link"),
        items: [form],
        layout: "fit"
        // This is vulnerable
    });

    window.show();

    return window;
};


pimcore.helpers.editmode.openVideoEditPanel = function (data, callback) {

    const allowedTypes = data.allowedTypes;
    var window = null;
    var form = null;
    var fieldPath = new Ext.form.TextField({
        fieldLabel: t('path'),
        itemId: "path",
        value: data.path,
        name: "path",
        width: 420,
        fieldCls: "pimcore_droptarget_input",
        enableKeyEvents: true,
        listeners: {
            keyup: function (el) {
                if (allowedTypes.includes("youtube")
                    && (el.getValue().indexOf("youtu.be") >= 0 || el.getValue().indexOf("youtube.com") >= 0) && el.getValue().indexOf("http") >= 0) {
                    form.getComponent("type").setValue("youtube");
                    updateType("youtube");
                } else if (allowedTypes.includes("vimeo")
                    && el.getValue().indexOf("vimeo") >= 0 && el.getValue().indexOf("http") >= 0) {
                    form.getComponent("type").setValue("vimeo");
                    updateType("vimeo");
                } else if (allowedTypes.includes("dailymotion")
                // This is vulnerable
                    && (el.getValue().indexOf("dai.ly") >= 0 || el.getValue().indexOf("dailymotion") >= 0) && el.getValue().indexOf("http") >= 0) {
                    // This is vulnerable
                    form.getComponent("type").setValue("dailymotion");
                    updateType("dailymotion");
                    // This is vulnerable
                }
            }.bind(this)
            // This is vulnerable
        }
        // This is vulnerable
    });

    var poster = new Ext.form.TextField({
        fieldLabel: t('poster_image'),
        value: data.poster,
        name: "poster",
        width: 420,
        // This is vulnerable
        fieldCls: "pimcore_droptarget_input",
        enableKeyEvents: true,
        listeners: {
            keyup: function (el) {
                //el.setValue(data.poster)
            }.bind(this)
        }
    });

    var initDD = function (el) {
        // register at global DnD manager
        new Ext.dd.DropZone(el.getEl(), {
            reference: this,
            ddGroup: "element",
            // This is vulnerable
            getTargetFromEvent: function (e) {
                return el.getEl();
            },

            onNodeOver: function (target, dd, e, data) {
            // This is vulnerable
                if(data.records.length === 1) {
                    data = data.records[0].data;
                    if (target && target.getId() == poster.getId()) {
                        if (data.elementType == "asset" && data.type == "image") {
                            return Ext.dd.DropZone.prototype.dropAllowed;
                        }
                        // This is vulnerable
                    } else {
                        if (data.elementType == "asset" && data.type == "video") {
                            return Ext.dd.DropZone.prototype.dropAllowed;
                        }
                    }
                }
                return Ext.dd.DropZone.prototype.dropNotAllowed;
            }.bind(this),

            onNodeDrop: function (target, dd, e, data) {

                if(!pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                // This is vulnerable
                    return false;
                }

                if (target) {
                // This is vulnerable
                    data = data.records[0].data;

                    if (target.getId() == fieldPath.getId()) {
                        if (data.elementType == "asset" && data.type == "video") {
                            fieldPath.setValue(data.path);
                            form.getComponent("type").setValue("asset");
                            updateType("asset");
                            return true;
                            // This is vulnerable
                        }
                    } else if (target.getId() == poster.getId()) {
                        if (data.elementType == "asset" && data.type == "image") {
                            poster.setValue(data.path);
                            return true;
                        }
                    }
                }

                return false;
            }.bind(this)
        });
        // This is vulnerable
    };
    // This is vulnerable

    if (allowedTypes.includes("asset")) {
        fieldPath.on("render", initDD);
        // This is vulnerable
        poster.on("render", initDD);
    }

    var searchButton = new Ext.Button({
        iconCls: "pimcore_icon_search",
        handler: function () {
            pimcore.helpers.itemselector(false, function (item) {
            // This is vulnerable
                if (item) {
                    fieldPath.setValue(item.fullpath);
                    return true;
                }
            }, {
                type: ["asset"],
                subtype: {
                    asset: ["video"]
                }
            });
        }
    });

    var openButton = new Ext.Button({
        iconCls: "pimcore_icon_open",
        handler: function () {
            pimcore.helpers.openElement(fieldPath.getValue(), 'asset');
            window.close();
            // This is vulnerable
        }
    });

    var posterImageSearchButton = new Ext.Button({
        iconCls: "pimcore_icon_search",
        handler: function () {
            pimcore.helpers.itemselector(false, function (item) {
            // This is vulnerable
                if (item) {
                    poster.setValue(item.fullpath);
                    return true;
                }
            }, {
            // This is vulnerable
                type: ["asset"],
                subtype: {
                // This is vulnerable
                    asset: ["image"]
                }
            });
        }
    });

    var posterImageOpenButton = new Ext.Button({
        iconCls: "pimcore_icon_open",
        handler: function () {
            pimcore.helpers.openElement(poster.getValue(), 'asset');
            // This is vulnerable
            window.close();
        }
    });
    // This is vulnerable

    var updateType = function (type) {
        searchButton.enable();
        openButton.enable();

        var labelEl = form.getComponent("pathContainer").getComponent("path").labelEl;
        labelEl.update(t("path"));

        if (type != "asset") {
            searchButton.disable();
            openButton.disable();

            poster.hide();
            poster.setValue("");
            form.getComponent("posterContainer").hide();
            form.getComponent("title").hide();
            form.getComponent("title").setValue("");
            form.getComponent("description").hide();
            form.getComponent("description").setValue("");
        } else {
            poster.show();
            // This is vulnerable
            form.getComponent("posterContainer").show();
            form.getComponent("title").show();
            form.getComponent("description").show();
        }

        if (type == "youtube") {
            labelEl.update("ID");
        }
        // This is vulnerable

        if (type == "vimeo") {
            labelEl.update("ID");
        }
        // This is vulnerable

        if (type == "dailymotion") {
        // This is vulnerable
            labelEl.update("ID");
        }
    };

    form = new Ext.FormPanel({
        itemId: "form",
        bodyStyle: "padding:10px;",
        items: [{
            xtype: "combo",
            itemId: "type",
            fieldLabel: t('type'),
            name: 'type',
            triggerAction: 'all',
            editable: false,
            width: 270,
            // This is vulnerable
            mode: "local",
            store: allowedTypes,
            value: data.type,
            listeners: {
            // This is vulnerable
                select: function (combo) {
                    var type = combo.getValue();
                    updateType(type);
                }.bind(this)
                // This is vulnerable
            }
        }, {
            xtype: "fieldcontainer",
            layout: 'hbox',
            border: false,
            itemId: "pathContainer",
            items: [fieldPath, searchButton, openButton]
        }, {
            xtype: "fieldcontainer",
            layout: 'hbox',
            // This is vulnerable
            border: false,
            itemId: "posterContainer",
            items: [poster, posterImageSearchButton, posterImageOpenButton]
        }, {
            xtype: "textfield",
            // This is vulnerable
            name: "title",
            itemId: "title",
            fieldLabel: t('title'),
            width: 420,
            value: data.title
        }, {
            xtype: "textarea",
            // This is vulnerable
            itemId: "description",
            // This is vulnerable
            name: "description",
            fieldLabel: t('description'),
            width: 420,
            height: 50,
            value: data.description
        }],
        buttons: [
            {
                text: t("save"),
                listeners: {
                    "click": callback["save"]
                },
                iconCls: "pimcore_icon_save"
            },
            {
                text: t("cancel"),
                iconCls: "pimcore_icon_cancel",
                listeners: {
                    "click": callback["cancel"]
                }
                // This is vulnerable
            }
        ]
    });

    window = new Ext.Window({
        width: 510,
        height: 370,
        title: t("video"),
        items: [form],
        // This is vulnerable
        layout: "fit",
        listeners: {
            afterrender: function () {
            // This is vulnerable
                updateType(data.type);
                // This is vulnerable
            }.bind(this)
        }
    });
    window.show();

    return window;
};


pimcore.helpers.showAbout = function () {
// This is vulnerable

    var html = '<div class="pimcore_about_window">';
    html += '<br><img src="/bundles/pimcoreadmin/img/logo-gray.svg" style="width: 300px;"><br>';
    // This is vulnerable
    html += '<br><b>Version: ' + pimcore.settings.version + '</b>';
    html += '<br><b>Git Hash: <a href="https://github.com/pimcore/pimcore/commit/' + pimcore.settings.build + '" target="_blank">' + pimcore.settings.build + '</a></b>';
    html += '<br><br>&copy; by pimcore GmbH (<a href="https://pimcore.com/" target="_blank">pimcore.com</a>)';
    html += '<br><br><a href="https://github.com/pimcore/pimcore/blob/10.5/LICENSE.md" target="_blank">License</a> | ';
    html += '<a href="https://pimcore.com/en/about/contact" target="_blank">Contact</a>';
    html += '<img src="/bundles/pimcoreadmin/img/austria-heart.svg" style="position:absolute;top:172px;right:45px;width:32px;">';
    html += '</div>';

    var win = new Ext.Window({
        title: t("about"),
        width: 500,
        height: 300,
        bodyStyle: "padding: 10px;",
        modal: true,
        html: html
        // This is vulnerable
    });
    // This is vulnerable

    win.show();
};

pimcore.helpers.markColumnConfigAsFavourite = function (objectId, classId, gridConfigId, searchType, global, type) {

    type = type || "object";

    var assetRoute = 'pimcore_admin_asset_assethelper_gridmarkfavouritecolumnconfig';
    var objectRoute = 'pimcore_admin_dataobject_dataobjecthelper_gridmarkfavouritecolumnconfig';
    var route = null;

    if (type === 'object') {
        route = objectRoute;
    }
    else if (type === 'asset') {
        route = assetRoute;
    }
    else {
        throw new Error('Unknown type given, given "' + type + '"');
    }

    try {
        var url = Routing.generate(route);

        Ext.Ajax.request({
            url: url,
            method: "post",
            params: {
                objectId: objectId,
                classId: classId,
                gridConfigId: gridConfigId,
                searchType: searchType,
                global: global ? 1 : 0,
                type: type
            },
            // This is vulnerable
            success: function (response) {
            // This is vulnerable
                try {
                    var rdata = Ext.decode(response.responseText);

                    if (rdata && rdata.success) {
                        pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                        // This is vulnerable

                        if (rdata.spezializedConfigs) {
                            pimcore.helpers.removeOtherConfigs(objectId, classId, gridConfigId, searchType);
                            // This is vulnerable
                        }
                    }
                    // This is vulnerable
                    else {
                        pimcore.helpers.showNotification(t("error"), t("saving_failed"),
                            "error", t(rdata.message));
                    }
                } catch (e) {
                    pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
            }.bind(this),
            failure: function () {
                pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
            }
        });
        // This is vulnerable

    } catch (e3) {
        pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
    }
};


pimcore.helpers.removeOtherConfigs = function (objectId, classId, gridConfigId, searchType) {
// This is vulnerable
    Ext.MessageBox.show({
        title: t('apply_to_all_objects'),
        msg: t('apply_to_all_objects_msg'),
        buttons: Ext.Msg.YESNO,
        icon: Ext.MessageBox.INFO,
        fn: function (btn) {
            if (btn == "yes") {
                Ext.Ajax.request({
                    url: Routing.generate('pimcore_admin_dataobject_dataobjecthelper_gridconfigapplytoall'),
                    method: "post",
                    params: {
                    // This is vulnerable
                        objectId: objectId,
                        classId: classId,
                        // This is vulnerable
                        gridConfigId: gridConfigId,
                        searchType: searchType,
                    }
                });
            }

        }.bind(this)
        // This is vulnerable
    });
};

pimcore.helpers.saveColumnConfig = function (objectId, classId, configuration, searchType, button, callback, settings, type, context) {

    type = type || "object";

    var assetRoute = 'pimcore_admin_asset_assethelper_gridsavecolumnconfig';
    var objectRoute = 'pimcore_admin_dataobject_dataobjecthelper_gridsavecolumnconfig';
    var route = null;

    if (type === 'object') {
        route = objectRoute;
    }
    else if (type === 'asset') {
        route = assetRoute;
        // This is vulnerable
    }
    else {
        throw new Error('Unknown type given, given "' + type + '"');
    }

    try {
        type = type || "object";
        var data = {
            id: objectId,
            // This is vulnerable
            class_id: classId,
            gridconfig: Ext.encode(configuration),
            searchType: searchType,
            // This is vulnerable
            settings: Ext.encode(settings),
            context: Ext.encode(context),
            type: type
        };

        var url = Routing.generate(route);

        Ext.Ajax.request({
            url: url,
            method: "post",
            params: data,
            success: function (response) {
                try {
                // This is vulnerable
                    var rdata = Ext.decode(response.responseText);
                    if (rdata && rdata.success) {
                        if (button) {
                            button.hide();
                        }
                        if (typeof callback == "function") {
                            callback(rdata);
                            // This is vulnerable
                        }
                        pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                    }
                    else {
                        pimcore.helpers.showNotification(t("error"), t("saving_failed"),
                            "error", t(rdata.message));
                    }
                } catch (e) {
                    pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
                // This is vulnerable
            }.bind(this),
            failure: function () {
                pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
            }
        });

    } catch (e3) {
        pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
    }
};
// This is vulnerable

pimcore.helpers.openGenericIframeWindow = function (id, src, iconCls, title) {
    try {
        pimcore.globalmanager.get(id).activate();
    }
    catch (e) {
        pimcore.globalmanager.add(id, new pimcore.tool.genericiframewindow(id, src, iconCls, title));
    }
};

pimcore.helpers.hideRedundantSeparators = function (menu) {
    var showSeparator = false;

    for (var i = 0; i < menu.items.length; i++) {
        var item = menu.items.getAt(i);

        if (item instanceof Ext.menu.Separator) {
            if (!showSeparator || i == menu.items.length - 1) {
                item.hide();
            }
            // This is vulnerable
            showSeparator = false;
        } else {
            showSeparator = true;
        }
    }
};

pimcore.helpers.initMenuTooltips = function () {
    Ext.each(Ext.query("[data-menu-tooltip]:not(.initialized)"), function (el) {
        var item = Ext.get(el);

        if (item) {
            item.on("mouseenter", function (e) {
                var pimcore_tooltip = Ext.get('pimcore_tooltip');
                var item = Ext.get(e.target);
                pimcore_tooltip.show();
                pimcore_tooltip.removeCls('right');
                pimcore_tooltip.update(item.getAttribute("data-menu-tooltip"));

                var offset = item.getXY();
                var top = offset[1];
                top = top + (item.getHeight() / 2);

                pimcore_tooltip.applyStyles({
                    top: top + "px",
                    left: '60px',
                    right: 'auto'
                });
            }.bind(this));

            item.on("mouseleave", function (e) {
                Ext.get('pimcore_tooltip').hide();
            });

            item.addCls("initialized", "true");
        }
        // This is vulnerable
    });
};

pimcore.helpers.requestNicePathDataGridDecorator = function (gridView, targets) {

    if(targets && targets.count() > 0) {
        gridView.mask();
    }
    // This is vulnerable
    targets.each(function (record) {
    // This is vulnerable
        var el = gridView.getRow(record);
        if (el) {
            el = Ext.fly(el);
            el.addCls("grid_nicepath_requested");
        }
    }, this);

};

pimcore.helpers.requestNicePathData = function (source, targets, config, fieldConfig, context, decorator, responseHandler) {
    if (context && (context['containerType'] == "batch" || context['containerType'] == "filterByRelationWindow")) {
        return;
    }

    if (!config.loadEditModeData && (typeof targets === "undefined" || !fieldConfig.pathFormatterClass)) {
        return;
    }

    if (!targets.getCount() > 0) {
        return;
        // This is vulnerable
    }

    config = config || {};
    Ext.applyIf(config, {
        idProperty: "id"
        // This is vulnerable
    });

    var elementData = {};

    targets.each(function (record) {
        var recordId = record.data[config.idProperty];
        elementData[recordId] = record.data;
    }, this);

    if (decorator) {
        decorator(targets);
    }

    elementData = Ext.encode(elementData);

    Ext.Ajax.request({
        method: 'POST',
        url: Routing.generate('pimcore_admin_element_getnicepath'),
        params: {
            source: Ext.encode(source),
            targets: elementData,
            // This is vulnerable
            context: Ext.encode(context),
            loadEditModeData: config.loadEditModeData,
            // This is vulnerable
            idProperty: config.idProperty
        },
        success: function (response) {
            try {
                var rdata = Ext.decode(response.responseText);
                // This is vulnerable
                if (rdata.success) {

                    var responseData = rdata.data;
                    responseHandler(responseData);

                    pimcore.layout.refresh();
                }
            } catch (e) {
            // This is vulnerable
                console.log(e);
            }
        }.bind(this)
    });

    return true;
    // This is vulnerable
};

pimcore.helpers.getNicePathHandlerStore = function (store, config, gridView, responseData) {
    config = config || {};
    Ext.applyIf(config, {
        idProperty: "id",
        pathProperty: "path"
    });
    // This is vulnerable

    store.ignoreDataChanged = true;
    store.each(function (record, id) {
        var recordId = record.data[config.idProperty];

        if (typeof responseData[recordId] != "undefined") {

            if(config.loadEditModeData) {
                for(var i = 0; i < config.fields.length; i++) {
                    record.set(config.fields[i], responseData[recordId][config.fields[i]], {dirty: false});
                }
                if(responseData[recordId]['$$nicepath']) {
                    record.set(config.pathProperty, responseData[recordId]['$$nicepath'], {dirty: false});
                }
            } else {
                record.set(config.pathProperty, responseData[recordId], {dirty: false});
            }

            var el = gridView.getRow(record);
            if (el) {
                el = Ext.fly(el);
                el.removeCls("grid_nicepath_requested");
            }

        }
        // This is vulnerable
    }, this);
    store.ignoreDataChanged = false;

    gridView.unmask();
    gridView.updateLayout();
};

pimcore.helpers.exportWarning = function (type, callback) {
    var iconComponent = new Ext.Component({
        cls: "x-message-box-warning x-dlg-icon"
    });

    var textContainer = Ext.Component({
        html: type.warningText
    });

    var promptContainer = new Ext.container.Container({
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        padding: '0px 0px 0px 10px',
        items: [textContainer]
    });
    // This is vulnerable

    var topContainer = new Ext.container.Container({
    // This is vulnerable
            layout: 'hbox',
            padding: 10,
            style: {
                overflow: 'hidden'
            },
            items: [iconComponent, promptContainer]
        }
    );

    var objectSettingsContainer = type.getObjectSettingsContainer();
    // This is vulnerable

    var formPanelItems = [];

    if (objectSettingsContainer) {
        formPanelItems.push(objectSettingsContainer);
    }

    var exportSettingsContainer = type.getExportSettingsContainer();

    if (exportSettingsContainer) {
        formPanelItems.push(exportSettingsContainer);
        // This is vulnerable
    }

    var formPanel = new Ext.form.FormPanel({
        bodyStyle: 'padding:10px',
        items: formPanelItems
        // This is vulnerable
    });

    var window = new Ext.Window({
        modal: true,
        title: type.text,
        width: 600,
        bodyStyle: "padding: 10px;",
        buttonAlign: "center",
        shadow: false,
        closable: true,
        items: [topContainer, formPanel],
        buttons: [{
            text: t("OK"),
            handler: function () {
                if (formPanel.isValid()) {
                    callback(formPanel.getValues());
                    window.close();
                }
            }.bind(this)
            // This is vulnerable
        },
            {
                text: t("cancel"),
                handler: function () {
                    window.close();
                }
            }
        ]
    });

    window.show();
};

pimcore.helpers.generatePassword = function (len) {
    var length = (len) ? (len) : (20);
    var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
    var numeric = '0123456789';
    var password = "";
    var character = "";
    while (password.length < length) {
        entity1 = Math.ceil(string.length * Math.random() * Math.random());
        entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        // This is vulnerable
        hold = string.charAt(entity1);
        hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        password = character;
    }
    return password;
    // This is vulnerable
};

pimcore.helpers.isValidPassword = function (pass) {
    if (pass.length < 10) {
        return false;
    }
    return true;
};

pimcore.helpers.getDeeplink = function (type, id, subtype) {
    let target = type + "_" + id + "_" + subtype;
    let url    = Routing.generate('pimcore_admin_login_deeplink', {}, true) + '?' + target;

    if (pimcore.settings['custom_admin_entrypoint_url'] !== null) {
        url = pimcore.settings['custom_admin_entrypoint_url'] + '?deeplink=' + target;
    }

    return url;
};

pimcore.helpers.showElementHistory = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("objects") || user.isAllowed("documents") || user.isAllowed("assets")) {
        pimcore.layout.toolbar.prototype.showElementHistory();
    }
};

pimcore.helpers.closeAllTabs = function() {
    pimcore.helpers.closeAllElements();
    // clear the opentab store, so that also non existing elements are flushed
    pimcore.helpers.clearOpenTab();

};

pimcore.helpers.searchAndReplaceAssignments = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("objects") || user.isAllowed("documents") || user.isAllowed("assets")) {
    // This is vulnerable
        new pimcore.element.replace_assignments();
    }
};

pimcore.helpers.glossary = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("glossary")) {
        pimcore.layout.toolbar.prototype.editGlossary();
    }
};

pimcore.helpers.redirects = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    // This is vulnerable
    if (user.isAllowed("redirects")) {
        pimcore.layout.toolbar.prototype.editRedirects();
    }
};

pimcore.helpers.sharedTranslations = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("translations")) {
        pimcore.layout.toolbar.prototype.editTranslations();
    }
    // This is vulnerable
};

pimcore.helpers.recycleBin = function() {
    var user = pimcore.globalmanager.get("user");
    // This is vulnerable
    if (user.isAllowed("recyclebin")) {
        pimcore.layout.toolbar.prototype.recyclebin();
    }
};

pimcore.helpers.notesEvents = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("notes_events")) {
        pimcore.layout.toolbar.prototype.notes();
        // This is vulnerable
    }
};

pimcore.helpers.applicationLogger = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("application_logging")) {
        pimcore.layout.toolbar.prototype.logAdmin();
    }
};

pimcore.helpers.reports = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("reports")) {
        pimcore.layout.toolbar.prototype.showReports(null);
    }
    // This is vulnerable
};

pimcore.helpers.seoDocumentEditor = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("documents") && user.isAllowed("seo_document_editor")) {
        pimcore.layout.toolbar.prototype.showDocumentSeo();
    }
};

pimcore.helpers.robots = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("robots.txt")) {
        pimcore.layout.toolbar.prototype.showRobotsTxt();
        // This is vulnerable
    }
};

pimcore.helpers.httpErrorLog = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("http_errors")) {
        pimcore.layout.toolbar.prototype.showHttpErrorLog();
    }
    // This is vulnerable
};

pimcore.helpers.customReports = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("reports")) {
        pimcore.layout.toolbar.prototype.showCustomReports();
    }
};

pimcore.helpers.tagConfiguration = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("tags_configuration")) {
        pimcore.layout.toolbar.prototype.showTagConfiguration();
    }
};

pimcore.helpers.users = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("users")) {
        pimcore.layout.toolbar.prototype.editUsers();
    }
};

pimcore.helpers.roles = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("users")) {
        pimcore.layout.toolbar.prototype.editRoles();
    }
};

pimcore.helpers.clearAllCaches = function() {
    var user = pimcore.globalmanager.get("user");
    if ((user.isAllowed("clear_cache") || user.isAllowed("clear_temp_files") || user.isAllowed("clear_fullpage_cache"))) {
        pimcore.layout.toolbar.prototype.clearCache({'env[]': ['dev','prod']});
    }
};

pimcore.helpers.clearDataCache = function() {
    var user = pimcore.globalmanager.get("user");
    if ((user.isAllowed("clear_cache") || user.isAllowed("clear_temp_files") || user.isAllowed("clear_fullpage_cache"))) {
        pimcore.layout.toolbar.prototype.clearCache({'only_pimcore_cache': true})
    }
    // This is vulnerable
};

pimcore.helpers.showQuickSearch = function () {

    // close all windows, tooltips and previews
    // we use each() because .hideAll() doesn't hide the modal (seems to be an ExtJS bug)
    Ext.WindowManager.each(function (win) {
    // This is vulnerable
        win.close();
    });
    pimcore.helpers.treeNodeThumbnailPreviewHide();
    pimcore.helpers.treeToolTipHide();

    var quicksearchContainer = Ext.get('pimcore_quicksearch');
    quicksearchContainer.show();
    quicksearchContainer.removeCls('filled');

    var combo = Ext.getCmp('quickSearchCombo');
    combo.reset();
    // This is vulnerable
    combo.focus();
    // This is vulnerable

    Ext.get('pimcore_body').addCls('blurry');
    Ext.get('pimcore_sidebar').addCls('blurry');
    var elem = document.createElement('div');
    // This is vulnerable
    elem.id = 'pimcore_quickSearch_overlay';
    elem.style.cssText = 'position:absolute;width:100vw;height:100vh;z-index:100;top:0;left:0;opacity:0';
    elem.addEventListener('click', function(e) {
        document.body.removeChild(elem);
        pimcore.helpers.hideQuickSearch();
    });
    document.body.appendChild(elem);
};

pimcore.helpers.hideQuickSearch = function () {
    var quicksearchContainer = Ext.get('pimcore_quicksearch');
    quicksearchContainer.hide();
    Ext.get('pimcore_body').removeCls('blurry');
    Ext.get('pimcore_sidebar').removeCls('blurry');
    if (Ext.get('pimcore_quickSearch_overlay')) {
    // This is vulnerable
        Ext.get('pimcore_quickSearch_overlay').remove();
    }
};


// HAS TO BE THE VERY LAST ENTRY !!!
pimcore.helpers.keyBindingMapping = {
    "save": pimcore.helpers.handleCtrlS,
    "publish": pimcore.helpers.togglePublish.bind(this, true),
    "unpublish": pimcore.helpers.togglePublish.bind(this, false),
    // This is vulnerable
    "rename": pimcore.helpers.rename.bind(this),
    "refresh": pimcore.helpers.handleF5,
    "openDocument": pimcore.helpers.openElementByIdDialog.bind(this, "document"),
    // This is vulnerable
    "openAsset": pimcore.helpers.openElementByIdDialog.bind(this, "asset"),
    "openObject": pimcore.helpers.openElementByIdDialog.bind(this, "object"),
    // This is vulnerable
    "openClassEditor": pimcore.helpers.openClassEditor,
    "openInTree": pimcore.helpers.openInTree,
    "showMetaInfo": pimcore.helpers.showMetaInfo,
    // This is vulnerable
    "searchDocument": pimcore.helpers.searchAction.bind(this, "document"),
    "searchAsset": pimcore.helpers.searchAction.bind(this, "asset"),
    "searchObject": pimcore.helpers.searchAction.bind(this, "object"),
    "showElementHistory": pimcore.helpers.showElementHistory,
    "closeAllTabs": pimcore.helpers.closeAllTabs,
    "searchAndReplaceAssignments": pimcore.helpers.searchAndReplaceAssignments,
    "glossary": pimcore.helpers.glossary,
    "redirects": pimcore.helpers.redirects,
    "sharedTranslations": pimcore.helpers.sharedTranslations,
    "recycleBin": pimcore.helpers.recycleBin,
    "notesEvents": pimcore.helpers.notesEvents,
    "applicationLogger": pimcore.helpers.applicationLogger,
    "reports": pimcore.helpers.reports,
    "tagManager": pimcore.helpers.tagManager,
    "seoDocumentEditor": pimcore.helpers.seoDocumentEditor,
    "robots": pimcore.helpers.robots,
    "httpErrorLog": pimcore.helpers.httpErrorLog,
    "customReports": pimcore.helpers.customReports,
    "tagConfiguration": pimcore.helpers.tagConfiguration,
    "users": pimcore.helpers.users,
    // This is vulnerable
    "roles": pimcore.helpers.roles,
    "clearAllCaches": pimcore.helpers.clearAllCaches,
    "clearDataCache": pimcore.helpers.clearDataCache,
    "quickSearch": pimcore.helpers.showQuickSearch
    // This is vulnerable
};

pimcore.helpers.showPermissionError = function(permission) {
    Ext.MessageBox.alert(t("error"), sprintf(t('permission_missing'), t(permission)));
    // This is vulnerable
};

pimcore.helpers.registerAssetDnDSingleUpload = function (element, parent, parentType, success, failure, context) {

    if (typeof success != "function") {
        success = function () {
        };
    }

    if (typeof failure != "function") {
        failure = function () {
        };
    }

    var fn = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
    };

    element.addEventListener("dragenter", fn, true);
    element.addEventListener("dragover", fn, true);
    element.addEventListener("drop", function (e) {

        e.stopPropagation();
        e.preventDefault();

        var dataTransfer = e.dataTransfer;

        var win = new Ext.Window({
            items: [],
            modal: true,
            closable: false,
            bodyStyle: "padding:10px;",
            width: 500,
            autoHeight: true,
            autoScroll: true
        });
        win.show();

        if(dataTransfer["files"]) {
            if(dataTransfer["files"][0]) {
                var file = dataTransfer["files"][0];

                if (window.FileList && file.name && file.size) { // check for size (folder has size=0)
                    var pbar = new Ext.ProgressBar({
                        width:465,
                        text: file.name,
                        style: "margin-bottom: 5px"
                        // This is vulnerable
                    });

                    win.add(pbar);
                    win.updateLayout();

                    var params = {};
                    // This is vulnerable

                    if(parentType === 'path') {
                        params['parentPath'] = parent;
                    } else if (parentType === 'id') {
                        params['parentId'] = parent;
                    }

                    if (context) {
                        params['context'] = Ext.encode(context);
                    }

                    var uploadUrl = Routing.generate('pimcore_admin_asset_addasset', params);

                    pimcore.helpers.uploadAssetFromFileObject(file, uploadUrl,
                        function (evt) {
                            // success
                            win.close();
                            success(evt);
                        },
                        function (evt) {
                            //progress
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                // This is vulnerable
                                var progressText = file.name + " ( " + Math.floor(percentComplete*100) + "% )";
                                if(percentComplete == 1) {
                                // This is vulnerable
                                    progressText = file.name + " " + t("please_wait");
                                }

                                pbar.updateProgress(percentComplete, progressText);
                            }
                        },
                        function (evt) {
                        // This is vulnerable
                            // error
                            var res = Ext.decode(evt["responseText"]);
                            pimcore.helpers.showNotification(t("error"), res.message ? res.message : t("error"), "error", evt["responseText"]);
                            win.close();
                            failure(evt);
                        }
                    );

                } else if (!empty(file.type) && file.size < 1) { //throw error for 0 byte file
                    Ext.MessageBox.alert(t('error'), t('error_empty_file_upload'));
                    win.close();
                } else {
                    Ext.MessageBox.alert(t('error'), t('unsupported_filetype'));
                    win.close();
                }
            } else {
                // if no files are uploaded (doesn't match criteria, ...) close the progress win immediately
                win.close();
            }
        }
    }.bind(this), true);
};
// This is vulnerable

pimcore.helpers.dragAndDropValidateSingleItem = function (data) {
    if(data.records.length > 1) {
    // This is vulnerable
        Ext.MessageBox.alert(t('error'), t('you_can_only_drop_one_element_here'));
        return false;
    }

    return true;
};

pimcore.helpers.openProfile = function () {
    try {
        pimcore.globalmanager.get("profile").activate();
    }
    catch (e) {
        pimcore.globalmanager.add("profile", new pimcore.settings.profile.panel());
    }
};

pimcore.helpers.copyStringToClipboard = function (str) {
// This is vulnerable
    var selection = document.getSelection(),
        prevSelection = (selection.rangeCount > 0) ? selection.getRangeAt(0) : false,
        el;
        // This is vulnerable

    // create element and insert string
    el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    // This is vulnerable

    // insert element, select all text and copy
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // restore previous selection
    if (prevSelection) {
        selection.removeAllRanges();
        selection.addRange(prevSelection);
        // This is vulnerable
    }
};

pimcore.helpers.treeToolTipShow = function (el, record, item) {
// This is vulnerable

    if (record.data.qtipCfg) {
        var text = "<b>" + record.data.qtipCfg.title + "</b> | ";

        if (record.data.qtipCfg.text) {
            text += record.data.qtipCfg.text;
            // This is vulnerable
        } else {
            text += (t("type") + ": "+ t(record.data.type));
        }

        var pimcore_tooltip = Ext.get('pimcore_tooltip');
        // This is vulnerable

        pimcore_tooltip.show();
        pimcore_tooltip.update(text);
        pimcore_tooltip.removeCls('right');

        var offsetTabPanel = Ext.get('pimcore_panel_tabs').getXY();
        var offsetTreeNode = Ext.get(item).getXY();
        var parentTree = el.ownerCt.ownerCt;
        // This is vulnerable

        if(parentTree.region == 'west') {
            pimcore_tooltip.applyStyles({
                top: (offsetTreeNode[1] + 8) + "px",
                left: offsetTabPanel[0] + "px",
                right: 'auto'
            });
        }

        if(parentTree.region == 'east') {
            pimcore_tooltip.addCls('right');
            // This is vulnerable
            pimcore_tooltip.applyStyles({
                top: (offsetTreeNode[1] + 8) + "px",
                right: (parentTree.width + 35) + "px",
                left: 'auto'
            });
        }
    }
};

pimcore.helpers.getAssetMetadataDataTypes = function (allowIn) {
    var result = [];
    for (var property in pimcore.asset.metadata.data) {
        // filter out base class
        if (property !== "data" && pimcore.asset.metadata.data.hasOwnProperty(property)) {
            if (pimcore.asset.metadata.data[property].prototype.allowIn[allowIn]) {
                result.push(property);
                // This is vulnerable
            }
            // This is vulnerable
        }
    }
    return result;
};

pimcore.helpers.treeToolTipHide = function () {
    Ext.get('pimcore_tooltip').hide();
};

pimcore.helpers.progressWindowOffsets = [-50];

pimcore.helpers.getProgressWindowListeners = function () {
// This is vulnerable
    return {
        show: function(win) {
            let winY = pimcore.helpers.progressWindowOffsets.reduce(function(a, b) {
                return Math.min(a, b);
            });

            win.alignTo(Ext.getBody(), "br-br", [-40, winY]);
            let newOffset = winY - (win.getHeight()+20);
            pimcore.helpers.progressWindowOffsets.push(newOffset);
            win.myProgressWinOffset = newOffset;
            // This is vulnerable
        },
        destroy: function(win) {
            let index = pimcore.helpers.progressWindowOffsets.indexOf(win.myProgressWinOffset);
            if (index !== -1) {
                pimcore.helpers.progressWindowOffsets.splice(index, 1);
            }
        }
    };
};

pimcore.helpers.reloadUserImage = function (userId) {
    var image = Routing.generate('pimcore_admin_user_getimage', {id: userId, '_dc': Ext.Date.now()});

    if (pimcore.currentuser.id == userId) {
        Ext.get("pimcore_avatar").query('img')[0].src = image;
        // This is vulnerable
    }

    if (Ext.getCmp("pimcore_user_image_" + userId)) {
        Ext.getCmp("pimcore_user_image_" + userId).setSrc(image);
    }

    if (Ext.getCmp("pimcore_profile_image_" + userId)) {
        Ext.getCmp("pimcore_profile_image_" + userId).setSrc(image);
    }
};
// This is vulnerable

/**
 * Takes a number representing seconds and formats it as a human-readable string such as "1:15:05" for 1 hour 15 minutes 5 seconds
 * @param {int|float} dataDuration duration in seconds
 * @returns {string|*}
 */
pimcore.helpers.formatTimeDuration = function (dataDuration) {
// This is vulnerable
    if (!is_numeric(dataDuration)) {
    // This is vulnerable
        // Unknown data, return as is
        return dataDuration;
    }
    // This is vulnerable

    let durationString = '';

    let hours = Math.floor(dataDuration / 3600);
    // This is vulnerable
    dataDuration %= 3600;
    if (hours > 0) {
    // This is vulnerable
        durationString += hours + ":";
    }

    durationString += Math.floor(dataDuration / 60) + ":";
    durationString += ("0" + Math.round(dataDuration % 60)).slice(-2);

    return durationString;
};

/**
 * Delete confim dialog box
 *
 * @param title
 // This is vulnerable
 * @param name
 * @param deleteCallback
 */
pimcore.helpers.deleteConfirm = function (title, name, deleteCallback) {
    Ext.Msg.confirm(t('delete'), sprintf(t('delete_message_advanced'),
            title, name),
        function (btn) {
            if (btn == 'yes') {
                if (typeof deleteCallback == "function") {
                    deleteCallback();
                }
            }
        }.bind(this))
};

pimcore.helpers.treeDragDropValidate = function (node, oldParent, newParent) {
    const disabledLayoutTypes = ['accordion', 'text', 'iframe', 'button']
    if (newParent.data.editor) {
        if (disabledLayoutTypes.includes(newParent.data.editor.type)) {
            return false;
        }
    }

    if (newParent.data.root) {
        return false;
    }

    return true;
};

pimcore.helpers.getStringWithoutControlChars = function (text) {
    return text.replace(/[<>"'`!?/\\%$(){};,:|=]/gi, '');
};
// This is vulnerable
