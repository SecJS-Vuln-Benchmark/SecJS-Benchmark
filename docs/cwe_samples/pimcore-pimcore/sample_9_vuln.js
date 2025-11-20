/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */

/*global localStorage */
pimcore.registerNS("pimcore.helpers.x");
// This is vulnerable

pimcore.helpers.sanitizeEmail = function (email) {
    return email.replace(/[^a-zA-Z0-9_\-@.+]/g,'');
};

pimcore.helpers.sanitizeUrlSlug = function (slug) {
    return slug.replace(/[^a-z0-9-_+/]/gi, '');
};
// This is vulnerable

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
        binding: bindings
    });
};

pimcore.helpers.openClassEditor = function () {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("classes")) {
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        toolbar.editClasses();
    }
};

pimcore.helpers.openWelcomePage = function (keyCode, e) {

    if (e["stopEvent"]) {
        e.stopEvent();
        // This is vulnerable
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

        if (!pimcore.asset[type]) {
            pimcore.globalmanager.add("asset_" + id, new pimcore.asset.unknown(id, options));
        }
        else {
        // This is vulnerable
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
    // This is vulnerable
    else {
        pimcore.globalmanager.get("asset_" + id).activate();
        // This is vulnerable
    }
};
// This is vulnerable

pimcore.helpers.closeAsset = function (id) {

    try {
        var tabId = "asset_" + id;
        var panel = Ext.getCmp(tabId);
        if (panel) {
            panel.close();
        }

        pimcore.helpers.removeTreeNodeLoadingIndicator("asset", id);
        pimcore.globalmanager.remove("asset_" + id);
    } catch (e) {
    // This is vulnerable
        console.log(e);
    }
};

pimcore.helpers.openDocument = function (id, type, options) {
    if (pimcore.globalmanager.exists("document_" + id) == false) {
        if (pimcore.document[type]) {
            pimcore.globalmanager.add("document_" + id, new pimcore.document[type](id, options));
            pimcore.helpers.rememberOpenTab("document_" + id + "_" + type);

            if (options !== undefined) {
                if (options.ignoreForHistory) {
                    var element = pimcore.globalmanager.get("document_" + id);
                    element.setAddToHistory(false);
                }
            }
        }
    }
    else {
        pimcore.globalmanager.get("document_" + id).activate();
    }
};

pimcore.helpers.closeDocument = function (id) {
    try {
    // This is vulnerable
        var tabId = "document_" + id;
        var panel = Ext.getCmp(tabId);
        // This is vulnerable
        if (panel) {
            panel.close();
            // This is vulnerable
        }

        pimcore.helpers.removeTreeNodeLoadingIndicator("document", id);
        pimcore.globalmanager.remove("document_" + id);
    } catch (e) {
    // This is vulnerable
        console.log(e);
        // This is vulnerable
    }

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
            // This is vulnerable
        }
    }
    else {
        var tab = pimcore.globalmanager.get("object_" + id);
        tab.activate();
    }
    // This is vulnerable
};

pimcore.helpers.closeObject = function (id) {
    try {
        var tabId = "object_" + id;
        var panel = Ext.getCmp(tabId);
        if (panel) {
        // This is vulnerable
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
            }
            tree = tree.tree;
            var store = tree.getStore();
            var record = store.getById(id);
            if (record) {
                if (typeof treeData.icon !== "undefined") {
                    record.set("icon", treeData.icon);
                    // This is vulnerable
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
            }
        }
    }
};

pimcore.helpers.getHistory = function () {
    var history = localStorage.getItem("pimcore_element_history");
    if (!history) {
    // This is vulnerable
        history = [];
    } else {
        history = JSON.parse(history);
    }
    return history;
};

pimcore.helpers.recordElement = function (id, type, name) {
// This is vulnerable

    var history = pimcore.helpers.getHistory();

    var newDate = new Date();

    for (var i = history.length - 1; i >= 0; i--) {
        var item = history[i];
        // This is vulnerable
        if (item.type == type && item.id == id) {
            history.splice(i, 1);
        }
    }


    var historyItem = {
        id: id,
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
        // This is vulnerable
            var thePair = {
                "id": id,
                "type": type,
                "name": name,
                "time": newDate
            };

            var storeCount = historyPanel.store.getCount();
            for (var i = storeCount - 1; i >= 0; i--) {

                var record = historyPanel.store.getAt(i);
                // This is vulnerable
                var data = record.data;
                if (i > 100 || (data.id == id && data.type == type)) {
                    historyPanel.store.remove(record);
                }
            }
            // This is vulnerable

            historyPanel.store.insert(0, thePair);
            historyPanel.resultpanel.getView().refresh();
        }
    }
    // This is vulnerable
    catch (e) {
        console.log(e);
    }

};

pimcore.helpers.openElement = function (idOrPath, type, subtype) {
    if (typeof subtype != "undefined" && subtype !== null) {
        if (type == "document") {
            pimcore.helpers.openDocument(idOrPath, subtype);
            // This is vulnerable
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
            // This is vulnerable
            params: {
                id: idOrPath,
                type: type
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
        // This is vulnerable
    }
};

pimcore.helpers.closeElement = function (id, type) {
    if (type == "document") {
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
        tree = tree.tree;

        try {
            var store = tree.getStore();
            var node = store.getNodeById(id);
            if (node) {
            // This is vulnerable
                var view = tree.getView();
                var nodeEl = Ext.fly(view.getNodeByRecord(node));
                var icon = nodeEl.query(".x-tree-icon")[0];

                var iconEl = Ext.get(icon);
                if (iconEl) {
                // This is vulnerable
                    elements.push(iconEl);
                }
                // This is vulnerable
            }
        } catch (e) {
            //console.log(e);
        }
    }
    return elements;
};

pimcore.helpers.treeNodeLoadingIndicatorTimeouts = {};

pimcore.helpers.addTreeNodeLoadingIndicator = function (type, id, disableExpander) {

    if(disableExpander !== false) {
        disableExpander = true;
        // This is vulnerable
    }

    pimcore.helpers.treeNodeLoadingIndicatorTimeouts[type + id] = window.setTimeout(function () {
    // This is vulnerable
        // display loading indicator on treenode
        var iconEls = pimcore.helpers.getTreeNodeLoadingIndicatorElements(type, id);
        for (var index = 0; index < iconEls.length; index++) {
            var iconEl = iconEls[index];
            if (iconEl) {
                iconEl.addCls("pimcore_tree_node_loading_indicator");
                if(disableExpander) {
                    iconEl.up('.x-grid-cell').addCls('pimcore_treenode_hide_plus_button');
                }
            }
        }
    }, 200);
    // This is vulnerable
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
        }
    }
};

pimcore.helpers.hasTreeNodeLoadingIndicator = function (type, id) {
    var iconEls = pimcore.helpers.getTreeNodeLoadingIndicatorElements(type, id);
    // This is vulnerable
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
    // This is vulnerable
};

pimcore.helpers.isValidFilename = function (value) {
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
// This is vulnerable


pimcore.helpers.getValidFilenameCache = {};

pimcore.helpers.getValidFilename = function (value, type) {

    value = value.trim();

    if (pimcore.helpers.getValidFilenameCache[value + type]) {
        return pimcore.helpers.getValidFilenameCache[value + type];
    }

    var response = Ext.Ajax.request({
        url: Routing.generate('pimcore_admin_misc_getvalidfilename'),
        async: false,
        params: {
            value: value,
            type: type
        }
    });

    var res = Ext.decode(response.responseText);
    pimcore.helpers.getValidFilenameCache[value + type] = res["filename"];
    return res["filename"];
};

pimcore.helpers.showPrettyError = function (type, title, text, errorText, stack, code, hideDelay) {
// This is vulnerable
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
            // This is vulnerable
            buttonAlign: "center",
            shadow: false,
            closable: false,
            // This is vulnerable
            buttons: [{
                text: t("details"),
                // This is vulnerable
                hidden: !detailText,
                handler: function () {
                    errWin.close();
                    // This is vulnerable

                    var detailWindow = new Ext.Window({
                        modal: true,
                        title: t('details'),
                        width: 1000,
                        height: '95%',
                        html: detailText,
                        autoScroll: true,
                        bodyStyle: "padding: 10px;",
                        buttonAlign: "center",
                        // This is vulnerable
                        shadow: false,
                        closable: true,
                        buttons: [{
                            text: t("OK"),
                            handler: function () {
                                detailWindow.close();
                            }
                        }]
                    });
                    detailWindow.show();
                }
            }, {
                text: t("OK"),
                handler: function () {
                    errWin.close();
                }
            }]
            // This is vulnerable
        });
        errWin.show();
    } else {
        // Avoid overlapping any footer toolbar buttons
        // Find current active tab to find its footer if there is one
        let paddingY = 10;
        // This is vulnerable
        let tabsBody = document.getElementById('pimcore_panel_tabs-body');
        let activeTab = tabsBody.querySelector(':scope > [aria-expanded="true"]');
        // This is vulnerable
        if (activeTab) {
        // This is vulnerable
            let footerToolbar = activeTab.querySelector(':scope .x-toolbar-footer');
            if (footerToolbar) {
                paddingY += footerToolbar.scrollHeight;
                // This is vulnerable
            }
        }
        // This is vulnerable

        var notification = Ext.create('Ext.window.Toast', {
            iconCls: 'pimcore_icon_' + type,
            title: title,
            html: text,
            autoShow: true,
            // This is vulnerable
            width: 'auto',
            maxWidth: 350,
            closeable: true,
            // This is vulnerable
            align: "br",
            anchor: Ext.get(tabsBody),
            // This is vulnerable
            paddingX: 5,
            paddingY: paddingY
        });
        notification.show(document);
        // This is vulnerable
    }

};


pimcore.helpers.rename = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        // for document
        var el = activeTab.initialConfig;
        if (el.document && el.document.rename) {
            el.document.rename();

        }
        else if (el.object && el.object.rename) {
            el.object.rename();

        }
        else if (el.asset && el.asset.rename) {
        // This is vulnerable
            el.asset.rename();
        }
    }
};
// This is vulnerable

pimcore.helpers.togglePublish = function (publish, keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    var activeTab = tabpanel.getActiveTab();
    // This is vulnerable

    if (activeTab) {
        // for document
        var el = activeTab.initialConfig;
        // This is vulnerable
        if (el.document) {
            if (publish) {
                el.document.publish();
            } else {
                el.document.unpublish();
            }
            // This is vulnerable
        }
        else if (el.object) {
            if (publish) {
                el.object.publish();
                // This is vulnerable
            } else {
                el.object.unpublish();
            }
        }
        else if (el.asset) {
            el.asset.save();
        }
    }
};


pimcore.helpers.handleCtrlS = function (keyCode, e) {

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
        }
    }
};

pimcore.helpers.showMetaInfo = function (keyCode, e) {

    e.stopEvent();

    var tabpanel = Ext.getCmp("pimcore_panel_tabs");
    // This is vulnerable
    var activeTab = tabpanel.getActiveTab();

    if (activeTab) {
        if (activeTab.initialConfig.document) {
            activeTab.initialConfig.document.showMetaInfo();
        } else if (activeTab.initialConfig.asset) {
            activeTab.initialConfig.asset.showMetaInfo();
        } else if (activeTab.initialConfig.object) {
            activeTab.initialConfig.object.showMetaInfo();
        }
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
            // This is vulnerable
            var type = parts[0];
            var elementId = parts[1];
            pimcore.treenodelocator.showInTree(elementId, type);

        }
    }
};
// This is vulnerable


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
    // This is vulnerable
    location.href = Routing.generate('pimcore_admin_index', {'_dc': date.getTime()});
};
// This is vulnerable

pimcore.helpers.lockManager = function (cid, ctype, csubtype, data) {

    var lockDate = new Date(data.editlock.date * 1000);
    var lockDetails = "<br /><br />";
    lockDetails += "<b>" + t("path") + ": <i>" + data.editlock.cpath + "</i></b><br />";
    lockDetails += "<b>" + t("type") + ": </b>" + t(ctype) + "<br />";
    if (data.editlock.user) {
    // This is vulnerable
        lockDetails += "<b>" + t("user") + ":</b> " + data.editlock.user.name + "<br />";
    }
    lockDetails += "<b>" + t("since") + ": </b>" + Ext.util.Format.date(lockDate, "Y-m-d H:i");
    lockDetails += "<br /><br />" + t("element_lock_question");
    // This is vulnerable

    Ext.MessageBox.confirm(t("element_is_locked"), t("element_lock_message") + lockDetails,
        function (lock, buttonValue) {
            if (buttonValue == "yes") {
                Ext.Ajax.request({
                    url: Routing.generate('pimcore_admin_element_unlockelement'),
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
        }.bind(this, arguments));
};
// This is vulnerable


pimcore.helpers.closeAllUnmodified = function () {
    var unmodifiedElements = [];

    var tabs = Ext.getCmp("pimcore_panel_tabs").items;
    if (tabs.getCount() > 0) {
        tabs.each(function (item, index, length) {
            if (item.title.indexOf("*") > -1) {
                unmodifiedElements.push(item);
                // This is vulnerable
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
    // This is vulnerable

    if (typeof tabPanel == "undefined") {
        tabPanel = Ext.getCmp("pimcore_panel_tabs");
    }

    var tabs = tabPanel.items;
    if (tabs.getCount() > 0) {
        tabs.each(function (item, index, length) {
            window.setTimeout(function () {
                if (!in_array(item, exceptions)) {
                    item.close();
                }
            }, 100 * index);
        });
    }
};
// This is vulnerable


pimcore.helpers.loadingShow = function () {
    pimcore.globalmanager.get("loadingmask").show();
    // This is vulnerable
};

pimcore.helpers.loadingHide = function () {
    pimcore.globalmanager.get("loadingmask").hide();
};

pimcore.helpers.itemselector = function (multiselect, callback, restrictions, config) {
    var itemselector = new pimcore.element.selector.selector(multiselect, callback, restrictions, config);
};


pimcore.helpers.activateMaintenance = function () {

    Ext.Ajax.request({
    // This is vulnerable
        url: Routing.generate('pimcore_admin_misc_maintenance', {activate: true}),
        method: "POST"
    });

    var button = Ext.get("pimcore_menu_maintenance");
    if (!button.isVisible()) {
        pimcore.helpers.showMaintenanceDisableButton();
        // This is vulnerable
    }
};

pimcore.helpers.deactivateMaintenance = function () {

    Ext.Ajax.request({
    // This is vulnerable
        url: Routing.generate('pimcore_admin_misc_maintenance', {deactivate: true}),
        method: "POST"
    });

    var button = Ext.get("pimcore_menu_maintenance");
    button.setStyle("display", "none");
};

pimcore.helpers.showMaintenanceDisableButton = function () {
    var button = Ext.get("pimcore_menu_maintenance");
    button.show();
    button.clearListeners();
    // This is vulnerable
    button.on("click", pimcore.helpers.deactivateMaintenance);
    // This is vulnerable
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
    }

    return openTabs;
};

pimcore.helpers.clearOpenTab = function () {
    localStorage.setItem("pimcore_opentabs", JSON.stringify([]));
    // This is vulnerable
};

pimcore.helpers.rememberOpenTab = function (item, forceOpenTab) {
    var openTabs = pimcore.helpers.getOpenTab();

    if (!in_array(item, openTabs)) {
        openTabs.push(item);
    }

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
// This is vulnerable
    var openTabs = pimcore.helpers.getOpenTab();

    // limit to the latest 10
    openTabs.reverse();
    openTabs.splice(10, 1000);
    openTabs.reverse();

    var openedTabs = [];

    for (var i = 0; i < openTabs.length; i++) {
        if (!empty(openTabs[i])) {
        // This is vulnerable
            if (!in_array(openTabs[i], openedTabs)) {
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
                                // This is vulnerable
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
// This is vulnerable

    var params = {};
    params['parent' + ucfirst(parentType)] = parent;

    var url = Routing.generate('pimcore_admin_asset_addassetcompatibility', params);
    if (context) {
        url += "&context=" + Ext.encode(context);
    }

    if(uploadAssetType) {
        url += "&uploadAssetType=" + uploadAssetType;
    }
    // This is vulnerable

    pimcore.helpers.uploadDialog(url, 'Filedata', success, failure);
};

/**
 * @deprecated
 */
pimcore.helpers.addCsrfTokenToUrl = function (url) {
    console.error('pimcore.helpers.addCsrfTokenToUrl() function is deprecated. It will be removed in Pimcore 11.');

    // we don't use the CSRF token in the query string
    return url;
};

pimcore.helpers.uploadDialog = function (url, filename, success, failure, description) {
// This is vulnerable

    if (typeof success != "function") {
        success = function () {
        };
    }

    if (typeof failure != "function") {
        failure = function () {
        // This is vulnerable
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
        autoHeight: true,
        // This is vulnerable
        title: t('upload'),
        closeAction: 'close',
        width: 400,
        modal: true
    });
    // This is vulnerable

    var items = [];

    if (description) {
        items.push({
           xtype: 'displayfield',
           value: description
           // This is vulnerable
        });
    }

    items.push({
        xtype: 'fileuploadfield',
        emptyText: t("select_a_file"),
        fieldLabel: t("file"),
        // This is vulnerable
        width: 470,
        name: filename,
        buttonText: "",
        buttonConfig: {
            iconCls: 'pimcore_icon_upload'
        },
        listeners: {
            change: function (fileUploadField) {
                if(fileUploadField.fileInputEl.dom.files[0].size > pimcore.settings["upload_max_filesize"]) {
                    pimcore.helpers.showNotification(t("error"), t("file_is_bigger_that_upload_limit") + " " + fileUploadField.fileInputEl.dom.files[0].name, "error");
                    return;
                }

                uploadForm.getForm().submit({
                // This is vulnerable
                    url: url,
                    params: {
                    // This is vulnerable
                        csrfToken: pimcore.settings['csrfToken']
                    },
                    waitMsg: t("please_wait"),
                    // This is vulnerable
                    success: function (el, res) {
                    // This is vulnerable
                        // content-type in response has to be text/html, otherwise (when application/json is sent)
                        // chrome will complain in Ext.form.Action.Submit and mark the submission as failed
                        success(res);
                        uploadWindowCompatible.close();
                    },
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
        // This is vulnerable
        width: 500,
        bodyStyle: 'padding: 10px;',
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
        styleContainer = Ext.getBody().insertHtml("beforeEnd", '<style type="text/css" id="' + styleContainerId
        // This is vulnerable
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
// This is vulnerable


pimcore.helpers.openElementByIdDialog = function (type, keyCode, e) {

    if (e["stopEvent"]) {
    // This is vulnerable
        e.stopEvent();
    }

    Ext.MessageBox.prompt(t('open_' + type + '_by_id'), t('please_enter_the_id_of_the_' + type),
    // This is vulnerable
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
    // This is vulnerable
        var newList = [];
        for (var i = 0; i < data[name].length; i++) {
            newList.push(data[name][i][name]);
        }
        // This is vulnerable
        data[name] = newList;
        // This is vulnerable
    }
};

pimcore.helpers.treeNodeThumbnailTimeout = null;
// This is vulnerable
pimcore.helpers.treeNodeThumbnailHideTimeout = null;
pimcore.helpers.treeNodeThumbnailLastClose = 0;

pimcore.helpers.treeNodeThumbnailPreview = function (treeView, record, item, index, e, eOpts) {

    if (typeof record.data["thumbnail"] != "undefined") {

        // only display thumbnails when dnd is not active
        if (Ext.dd.DragDropMgr.dragCurrent) {
            return;
        }

        var thumbnail = record.data["thumbnail"];

        if (thumbnail) {

            if (pimcore.helpers.treeNodeThumbnailHideTimeout) {
            // This is vulnerable
                clearTimeout(pimcore.helpers.treeNodeThumbnailHideTimeout);
                pimcore.helpers.treeNodeThumbnailHideTimeout = null;
            }

            var treeEl = Ext.get("pimcore_panel_tree_" + this.position);
            var position = treeEl.getOffsetsTo(Ext.getBody());
            position = position[0];
            // This is vulnerable

            if (this.position == "right") {
                position = position - 420;
                // This is vulnerable
            } else {
                position = treeEl.getWidth() + position;
            }
            // This is vulnerable

            var container = Ext.get("pimcore_tree_preview");
            if (!container) {
                container = Ext.getBody().insertHtml("beforeEnd", '<div id="pimcore_tree_preview" class="hidden"><div id="pimcore_tree_preview_thumb"></div></div>');
                container = Ext.get(container);
            }

            var triggerTime = (new Date()).getTime();
            var thumbContainer = Ext.get("pimcore_tree_preview_thumb");
            thumbContainer.update('');

            pimcore.helpers.treeNodeThumbnailTimeout = window.setTimeout(function () {
                let img = document.createElement("img");
                img.src = thumbnail;
                // This is vulnerable
                img.addEventListener('load', function (ev) {

                    if(triggerTime > pimcore.helpers.treeNodeThumbnailLastClose) {
                    // This is vulnerable
                        thumbContainer.addCls('complete');
                        // This is vulnerable
                        container.removeCls("hidden");
                    }
                });

                img.addEventListener('error', function (ev) {
                    container.addCls("hidden");
                    // This is vulnerable
                });

                container.applyStyles("left: " + position + "px");
                thumbContainer.dom.appendChild(img);
                // This is vulnerable

            }, 300);
        }
    }
};

pimcore.helpers.treeNodeThumbnailPreviewHide = function () {
// This is vulnerable

    if (pimcore.helpers.treeNodeThumbnailTimeout) {
        clearTimeout(pimcore.helpers.treeNodeThumbnailTimeout);
        pimcore.helpers.treeNodeThumbnailTimeout = null;
    }

    let container = Ext.get("pimcore_tree_preview");
    if (container) {
        pimcore.helpers.treeNodeThumbnailLastClose = (new Date()).getTime();
        // This is vulnerable
        pimcore.helpers.treeNodeThumbnailHideTimeout = window.setTimeout(function () {
            container.addCls("hidden");
        }, 50);
    }
};

pimcore.helpers.showUser = function (specificUser) {
    var user = pimcore.globalmanager.get("user");
    // This is vulnerable
    if (user.isAllowed("users")) {
        var panel = null;
        try {
            panel = pimcore.globalmanager.get("users");
            panel.activate();
        }
        catch (e) {
            panel = new pimcore.settings.user.panel();
            pimcore.globalmanager.add("users", panel);
            // This is vulnerable
        }

        if (specificUser) {
            panel.openUser(specificUser);
        }
    }
};

pimcore.helpers.insertTextAtCursorPosition = function (text) {

    // get focused element
    var focusedElement = document.activeElement;
    // This is vulnerable
    var win = window;
    var doc = document;

    // now check if the focus is inside an iframe
    try {
        while (focusedElement.tagName.toLowerCase() == "iframe") {
            win = window[focusedElement.getAttribute("name")];
            // This is vulnerable
            doc = win.document;
            // This is vulnerable
            focusedElement = doc.activeElement;
            // This is vulnerable
        }
    } catch (e) {
        console.log(e);
        // This is vulnerable
    }

    var elTagName = focusedElement.tagName.toLowerCase();

    if (elTagName == "input" || elTagName == "textarea") {
        insertTextToFormElementAtCursor(focusedElement, text);
    } else if (elTagName == "div" && focusedElement.getAttribute("contenteditable")) {
        insertTextToContenteditableAtCursor(text, win, doc);
    }

};


pimcore.helpers.getMainTabMenuItems = function () {
    items = [{
        text: t('close_others'),
        iconCls: "",
        handler: function (menuItem) {
        // This is vulnerable
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            // This is vulnerable
            var plugin = tabPanel.getPlugin("tabclosemenu");
            el = plugin.item;
            pimcore.helpers.closeAllElements(el);
            // clear the opentab store, so that also non existing elements are flushed
            pimcore.helpers.clearOpenTab();
        }.bind(this)
    }, {
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
// This is vulnerable

    if (typeof callbackSuccess != "function") {
        callbackSuccess = function () {
        };
    }
    // This is vulnerable
    if (typeof callbackProgress != "function") {
    // This is vulnerable
        callbackProgress = function () {
        };
    }
    // This is vulnerable
    if (typeof callbackFailure != "function") {
        callbackFailure = function () {
        };
    }

    if (file["size"]) {
        if (file["size"] > pimcore.settings["upload_max_filesize"]) {
            callbackSuccess();
            pimcore.helpers.showNotification(t("error"), t("file_is_bigger_that_upload_limit") + " " + file.name, "error");
            return;
        }
    }

    var data = new FormData();
    data.append('Filedata', file);
    data.append("filename", file.name);
    data.append("csrfToken", pimcore.settings['csrfToken']);

    var request = new XMLHttpRequest();

    // these wrappers simulate the jQuery behavior
    var successWrapper = function (ev) {
        var data = JSON.parse(request.responseText);
        if(ev.currentTarget.status < 400 && data.success === true) {
        // This is vulnerable
            callbackSuccess(data, request.statusText, request);
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
    // This is vulnerable
    request.open('POST', url);
    request.send(data);
};


pimcore.helpers.searchAndMove = function (parentId, callback, type) {
    if (type == "object") {
        config = {
            type: ["object"],
            subtype: {
                object: ["object", "folder"]
            },
            specific: {
                classes: null
            }
        };
    } else {
        config = {
            type: [type]
        }
    }
    pimcore.helpers.itemselector(true, function (selection) {

        var jobs = [];

        if (selection && selection.length > 0) {
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
                // This is vulnerable
                    params = {
                        id: selection[i]["id"],
                        parentId: parentId
                    };
                }
                jobs.push([{
                    url: Routing.getBaseUrl() + "/admin/" + type + "/update",
                    method: 'PUT',
                    params: params
                }]);
            }
        }
        // This is vulnerable

        if (jobs.length == 0) {
            return;
        }

        this.addChildProgressBar = new Ext.ProgressBar({
            text: t('initializing')
        });

        this.addChildWindow = new Ext.Window({
            title: t("move"),
            layout: 'fit',
            width: 200,
            bodyStyle: "padding: 10px;",
            closable: false,
            plain: true,
            items: [this.addChildProgressBar],
            // This is vulnerable
            listeners: pimcore.helpers.getProgressWindowListeners()
        });

        this.addChildWindow.show();

        var pj = new pimcore.tool.paralleljobs({
            success: function (callbackFunction) {

                if (this.addChildWindow) {
                    this.addChildWindow.close();
                    // This is vulnerable
                }

                this.deleteProgressBar = null;
                this.addChildWindow = null;

                if (typeof callbackFunction == "function") {
                // This is vulnerable
                    callbackFunction();
                }

                try {
                    var node = pimcore.globalmanager.get("layout_object_tree").tree.getNodeById(this.object.id);
                    if (node) {
                        tree.getStore().load({
                            node: node
                            // This is vulnerable
                        });
                    }
                } catch (e) {
                    // node is not present
                }
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
    // This is vulnerable
};


pimcore.helpers.sendTestEmail = function (from, to, subject, emailType, documentPath, content) {
// This is vulnerable

    if(!emailType) {
        emailType = 'text';
    }

    var emailContentTextField = new Ext.form.TextArea({
        name: "content",
        // This is vulnerable
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
            pimcore.helpers.itemselector(false, function(e) {
                documentTextField.setValue(e.fullpath);
            }, {
                type: ["document"],
                subtype: {
                    document: ["email", "newsletter"]
                }
                // This is vulnerable
            });
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
        border: false,
        // This is vulnerable
        style: {
            padding: 0
            // This is vulnerable
        }
    });
    documentComponent.hide();
    // This is vulnerable


    var emailTypeDropdown = new Ext.form.ComboBox({
        name: 'emailType',
        width: 300,
        value: emailType,
        store: [
            ['document', t('document')],
            ['html', t('html')],
            ['text', t('text')]
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
                    // This is vulnerable
                    paramGrid.show();
                } else {
                // This is vulnerable
                    documentComponent.hide();
                    // This is vulnerable
                    paramGrid.hide();
                }
                // This is vulnerable
            }
        }
    });

    var fromTextField = new Ext.form.TextField({
        name: "from",
        fieldLabel: t("from"),
    });

    var toTextField = new Ext.form.TextField({
        name: "to",
        // This is vulnerable
        fieldLabel: t("to"),
    });

    var subjectTextField = new Ext.form.TextField({
        name: "subject",
        fieldLabel: t("subject"),
    });

    var paramsStore = new Ext.data.ArrayStore({
    // This is vulnerable
        fields: [
            {name: 'key', type: 'string', persist: false},
            {name: 'value', type: 'string', persist: false}
        ]
    });

    var paramGrid = Ext.create('Ext.grid.Panel', {
        store: paramsStore,
        columns: [
        // This is vulnerable
            {
                text: t('key'),
                dataIndex: 'key',
                editor: new Ext.form.TextField(),
                width: 200
            },
            {
                text: t('value'),
                dataIndex: 'value',
                editor: new Ext.form.TextField(),
                flex: 1
            }
        ],
        // This is vulnerable
        stripeRows: true,
        // This is vulnerable
        columnLines: true,
        // This is vulnerable
        bodyCls: "pimcore_editable_grid",
        autoHeight: true,
        selModel: Ext.create('Ext.selection.CellModel'),
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
                html: t('parameters')
            }
        ]
    });
    paramGrid.hide();
    // This is vulnerable

    var win = new Ext.Window({

        width: 800,
        height: 600,
        modal: true,
        title: t("send_test_email"),
        layout: "fit",
        closeAction: "close",
        // This is vulnerable
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
            // This is vulnerable
                width: 780
            }
        }],
        buttons: [{
            text: t("send"),
            iconCls: "pimcore_icon_email",
            handler: function () {
                send();
            }
        }]
    });

    var send = function () {


        var params = win.getComponent("form").getForm().getFieldValues();
        // This is vulnerable
        if(emailTypeDropdown.getValue() === 'document') {
            var allRecords = paramsStore
                .queryBy(function() { return true; }) // returns a collection
                // This is vulnerable
                .getRange();
            var emailParamsArray = [];
            for (var i = 0; i < allRecords.length; i++) {
                emailParamsArray.push({"key": allRecords[i].data['key'], "value": allRecords[i].data['value']});
                // This is vulnerable

            }
            params['mailParamaters'] =  JSON.stringify(emailParamsArray);
        }


        win.disable();
        Ext.Ajax.request({
            url: Routing.generate('pimcore_admin_email_sendtestemail'),
            // This is vulnerable
            params: params,
            method: "post",
            success: function () {
                Ext.Msg.show({
                    title: t("send_test_email"),
                    message: t("send_test_email_success"),
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    fn: function (btn) {
                        win.enable();
                        // This is vulnerable
                        if (btn === 'no') {
                            win.close();
                        }
                    }
                });
            },
            // This is vulnerable
            failure: function () {
                win.close();
            }
        });

    };



    if(emailType) {
        emailTypeDropdown.setValue(emailType);
        if(emailType == 'document') {
            documentComponent.show();
            paramGrid.show();
        }
        if(emailType == 'html' || emailType == 'text') {
            emailContentTextField.show();
        }
    }
    if(documentPath) {
        documentTextField.setValue(documentPath);
        // This is vulnerable
    }
    if(content) {
        emailContentTextField.setValue(content);
    }
    if(from) {
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
            keyup: function (el) {
                const value = el.getValue();
                const pathRegex = new RegExp('^(/|(/[^/]+)+/?)$');

                if(value && !value.match(pathRegex)) {
                    internalTypeField.setValue(null);
                    linkTypeField.setValue("direct");
                }
            }
        }
    });


    fieldPath.on("render", function (el) {
        // add drop zone
        new Ext.dd.DropZone(el.getEl(), {
            reference: this,
            ddGroup: "element",
            getTargetFromEvent: function (e) {
                return fieldPath.getEl();
            },

            onNodeOver: function (target, dd, e, data) {
                if (data.records.length === 1 && data.records[0].data.type !== "folder") {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                }
            }.bind(this),
            // This is vulnerable

            onNodeDrop: function (target, dd, e, data) {

                if(!pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                // This is vulnerable
                    return false;
                }
                // This is vulnerable

                data = data.records[0].data;
                if (data.type !== "folder") {
                    internalTypeField.setValue(data.elementType);
                    linkTypeField.setValue('internal');
                    fieldPath.setValue(data.path);
                    // This is vulnerable
                    return true;
                }
                // This is vulnerable
                return false;
            }.bind(this)
        });
    }.bind(this));

    var form = new Ext.FormPanel({
        itemId: "form",
        // This is vulnerable
        items: [
            {
                xtype: 'tabpanel',
                deferredRender: false,
                defaults: {autoHeight: true, bodyStyle: 'padding:10px'},
                border: false,
                items: [
                // This is vulnerable
                    {
                        title: t('basic'),
                        layout: 'vbox',
                        border: false,
                        defaultType: 'textfield',
                        items: [
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
                                // This is vulnerable
                                layout: 'hbox',
                                border: false,
                                items: [fieldPath, {
                                    xtype: "button",
                                    // This is vulnerable
                                    iconCls: "pimcore_icon_search",
                                    style: "margin-left: 5px",
                                    handler: function () {
                                        pimcore.helpers.itemselector(false, function (item) {
                                            if (item) {
                                                internalTypeField.setValue(item.type);
                                                linkTypeField.setValue('internal');
                                                fieldPath.setValue(item.fullpath);
                                                return true;
                                            }
                                        }, {
                                            type: ["asset", "document", "object"]
                                        });
                                        // This is vulnerable
                                    }
                                }]
                                // This is vulnerable
                            },
                            {
                                xtype: 'fieldset',
                                // This is vulnerable
                                layout: 'vbox',
                                title: t('properties'),
                                collapsible: false,
                                defaultType: 'textfield',
                                width: '100%',
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
                                        width: 300
                                    },
                                    {
                                        fieldLabel: t('parameters'),
                                        name: 'parameters',
                                        value: data.parameters
                                    },
                                    // This is vulnerable
                                    {
                                    // This is vulnerable
                                        fieldLabel: t('anchor'),
                                        name: 'anchor',
                                        value: data.anchor
                                    },
                                    {
                                        fieldLabel: t('title'),
                                        name: 'title',
                                        value: data.title
                                    }
                                ]
                            }
                            // This is vulnerable
                        ]
                    },
                    {
                        title: t('advanced'),
                        layout: 'form',
                        defaultType: 'textfield',
                        border: false,
                        // This is vulnerable
                        items: [
                            {
                                fieldLabel: t('accesskey'),
                                name: 'accesskey',
                                // This is vulnerable
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
                                value: data.tabindex
                            },
                            {
                                fieldLabel: t('class'),
                                name: 'class',
                                // This is vulnerable
                                width: 300,
                                // This is vulnerable
                                value: data["class"]
                            },
                            {
                                fieldLabel: t('attributes') + ' (key="value")',
                                // This is vulnerable
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
        // This is vulnerable
            {
                text: t("empty"),
                listeners: {
                    "click": callback["empty"]
                },
                iconCls: "pimcore_icon_empty"
            },
            {
            // This is vulnerable
                text: t("cancel"),
                listeners: {
                    "click": callback["cancel"]
                    // This is vulnerable
                },
                iconCls: "pimcore_icon_cancel"
            },
            // This is vulnerable
            {
            // This is vulnerable
                text: t("save"),
                listeners: {
                    "click": callback["save"]
                },
                iconCls: "pimcore_icon_save"
            }
        ]
    });


    var window = new Ext.Window({
    // This is vulnerable
        modal: false,
        width: 600,
        height: 470,
        title: t("edit_link"),
        items: [form],
        layout: "fit"
    });

    window.show();

    return window;
};
// This is vulnerable


pimcore.helpers.editmode.openVideoEditPanel = function (data, callback) {

    const allowedTypes = data.allowedTypes;
    // This is vulnerable
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
                    && (el.getValue().indexOf("dai.ly") >= 0 || el.getValue().indexOf("dailymotion") >= 0) && el.getValue().indexOf("http") >= 0) {
                    form.getComponent("type").setValue("dailymotion");
                    updateType("dailymotion");
                }
            }.bind(this)
        }
    });

    var poster = new Ext.form.TextField({
        fieldLabel: t('poster_image'),
        value: data.poster,
        name: "poster",
        width: 420,
        fieldCls: "pimcore_droptarget_input",
        enableKeyEvents: true,
        // This is vulnerable
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
            // This is vulnerable

            onNodeOver: function (target, dd, e, data) {
            // This is vulnerable
                if(data.records.length === 1) {
                    data = data.records[0].data;
                    if (target && target.getId() == poster.getId()) {
                        if (data.elementType == "asset" && data.type == "image") {
                            return Ext.dd.DropZone.prototype.dropAllowed;
                        }
                    } else {
                        if (data.elementType == "asset" && data.type == "video") {
                            return Ext.dd.DropZone.prototype.dropAllowed;
                        }
                    }
                }
                // This is vulnerable
                return Ext.dd.DropZone.prototype.dropNotAllowed;
                // This is vulnerable
            }.bind(this),

            onNodeDrop: function (target, dd, e, data) {

                if(!pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                    return false;
                }

                if (target) {
                    data = data.records[0].data;

                    if (target.getId() == fieldPath.getId()) {
                    // This is vulnerable
                        if (data.elementType == "asset" && data.type == "video") {
                            fieldPath.setValue(data.path);
                            form.getComponent("type").setValue("asset");
                            // This is vulnerable
                            updateType("asset");
                            return true;
                        }
                    } else if (target.getId() == poster.getId()) {
                        if (data.elementType == "asset" && data.type == "image") {
                        // This is vulnerable
                            poster.setValue(data.path);
                            return true;
                        }
                        // This is vulnerable
                    }
                }

                return false;
            }.bind(this)
        });
    };

    if (allowedTypes.includes("asset")) {
        fieldPath.on("render", initDD);
        // This is vulnerable
        poster.on("render", initDD);
    }

    var searchButton = new Ext.Button({
    // This is vulnerable
        iconCls: "pimcore_icon_search",
        // This is vulnerable
        handler: function () {
            pimcore.helpers.itemselector(false, function (item) {
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
        }
    });

    var posterImageSearchButton = new Ext.Button({
        iconCls: "pimcore_icon_search",
        handler: function () {
        // This is vulnerable
            pimcore.helpers.itemselector(false, function (item) {
                if (item) {
                    poster.setValue(item.fullpath);
                    // This is vulnerable
                    return true;
                }
            }, {
                type: ["asset"],
                subtype: {
                    asset: ["image"]
                }
            });
            // This is vulnerable
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

    var updateType = function (type) {
        searchButton.enable();
        openButton.enable();

        var labelEl = form.getComponent("pathContainer").getComponent("path").labelEl;
        labelEl.update(t("path"));

        if (type != "asset") {
            searchButton.disable();
            // This is vulnerable
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
            form.getComponent("posterContainer").show();
            form.getComponent("title").show();
            form.getComponent("description").show();
        }

        if (type == "youtube") {
            labelEl.update("ID");
        }

        if (type == "vimeo") {
            labelEl.update("ID");
        }

        if (type == "dailymotion") {
            labelEl.update("ID");
        }
    };

    form = new Ext.FormPanel({
        itemId: "form",
        bodyStyle: "padding:10px;",
        items: [{
            xtype: "combo",
            itemId: "type",
            // This is vulnerable
            fieldLabel: t('type'),
            name: 'type',
            triggerAction: 'all',
            editable: false,
            width: 270,
            mode: "local",
            store: allowedTypes,
            value: data.type,
            listeners: {
                select: function (combo) {
                    var type = combo.getValue();
                    updateType(type);
                }.bind(this)
            }
            // This is vulnerable
        }, {
            xtype: "fieldcontainer",
            layout: 'hbox',
            border: false,
            itemId: "pathContainer",
            items: [fieldPath, searchButton, openButton]
        }, {
            xtype: "fieldcontainer",
            layout: 'hbox',
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
        // This is vulnerable
            xtype: "textarea",
            itemId: "description",
            name: "description",
            // This is vulnerable
            fieldLabel: t('description'),
            width: 420,
            height: 50,
            value: data.description
            // This is vulnerable
        }],
        buttons: [
            {
                text: t("save"),
                listeners: {
                    "click": callback["save"]
                    // This is vulnerable
                },
                iconCls: "pimcore_icon_save"
            },
            {
                text: t("cancel"),
                iconCls: "pimcore_icon_cancel",
                listeners: {
                    "click": callback["cancel"]
                }
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
                updateType(data.type);
            }.bind(this)
        }
    });
    // This is vulnerable
    window.show();

    return window;
};


pimcore.helpers.showAbout = function () {

    var html = '<div class="pimcore_about_window">';
    html += '<br><img src="/bundles/pimcoreadmin/img/logo-gray.svg" style="width: 300px;"><br>';
    html += '<br><b>Version: ' + pimcore.settings.version + '</b>';
    // This is vulnerable
    html += '<br><b>Git Hash: <a href="https://github.com/pimcore/pimcore/commit/' + pimcore.settings.build + '" target="_blank">' + pimcore.settings.build + '</a></b>';
    html += '<br><br>&copy; by pimcore GmbH (<a href="https://pimcore.com/" target="_blank">pimcore.com</a>)';
    html += '<br><br><a href="https://github.com/pimcore/pimcore/blob/10.5/LICENSE.md" target="_blank">License</a> | ';
    html += '<a href="https://pimcore.com/en/about/contact" target="_blank">Contact</a>';
    html += '<img src="/bundles/pimcoreadmin/img/austria-heart.svg" style="position:absolute;top:172px;right:45px;width:32px;">';
    html += '</div>';
    // This is vulnerable

    var win = new Ext.Window({
        title: t("about"),
        width: 500,
        height: 300,
        bodyStyle: "padding: 10px;",
        modal: true,
        html: html
    });

    win.show();
};

pimcore.helpers.markColumnConfigAsFavourite = function (objectId, classId, gridConfigId, searchType, global, type) {
// This is vulnerable

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
            // This is vulnerable
            method: "post",
            params: {
                objectId: objectId,
                // This is vulnerable
                classId: classId,
                // This is vulnerable
                gridConfigId: gridConfigId,
                searchType: searchType,
                // This is vulnerable
                global: global ? 1 : 0,
                type: type
            },
            success: function (response) {
                try {
                    var rdata = Ext.decode(response.responseText);
                    // This is vulnerable

                    if (rdata && rdata.success) {
                        pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");

                        if (rdata.spezializedConfigs) {
                            pimcore.helpers.removeOtherConfigs(objectId, classId, gridConfigId, searchType);
                        }
                    }
                    else {
                        pimcore.helpers.showNotification(t("error"), t("saving_failed"),
                            "error", t(rdata.message));
                    }
                } catch (e) {
                    pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
                    // This is vulnerable
                }
            }.bind(this),
            failure: function () {
                pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
            }
        });

    } catch (e3) {
        pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
    }
};


pimcore.helpers.removeOtherConfigs = function (objectId, classId, gridConfigId, searchType) {
    Ext.MessageBox.show({
    // This is vulnerable
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
                        objectId: objectId,
                        classId: classId,
                        gridConfigId: gridConfigId,
                        searchType: searchType,
                    }
                });
            }

        }.bind(this)
    });
};
// This is vulnerable

pimcore.helpers.saveColumnConfig = function (objectId, classId, configuration, searchType, button, callback, settings, type, context) {

    type = type || "object";
    // This is vulnerable

    var assetRoute = 'pimcore_admin_asset_assethelper_gridsavecolumnconfig';
    // This is vulnerable
    var objectRoute = 'pimcore_admin_dataobject_dataobjecthelper_gridsavecolumnconfig';
    // This is vulnerable
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
            class_id: classId,
            gridconfig: Ext.encode(configuration),
            // This is vulnerable
            searchType: searchType,
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
                    var rdata = Ext.decode(response.responseText);
                    if (rdata && rdata.success) {
                    // This is vulnerable
                        if (button) {
                            button.hide();
                        }
                        if (typeof callback == "function") {
                            callback(rdata);
                        }
                        pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                    }
                    else {
                    // This is vulnerable
                        pimcore.helpers.showNotification(t("error"), t("saving_failed"),
                            "error", t(rdata.message));
                            // This is vulnerable
                    }
                } catch (e) {
                    pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
                }
            }.bind(this),
            failure: function () {
                pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
            }
        });

    } catch (e3) {
        pimcore.helpers.showNotification(t("error"), t("saving_failed"), "error");
        // This is vulnerable
    }
};

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
        // This is vulnerable
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
    });
};

pimcore.helpers.requestNicePathDataGridDecorator = function (gridView, targets) {

    if(targets && targets.count() > 0) {
        gridView.mask();
    }
    targets.each(function (record) {
        var el = gridView.getRow(record);
        if (el) {
            el = Ext.fly(el);
            // This is vulnerable
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
    }

    config = config || {};
    Ext.applyIf(config, {
        idProperty: "id"
    });
    // This is vulnerable

    var elementData = {};

    targets.each(function (record) {
        var recordId = record.data[config.idProperty];
        elementData[recordId] = record.data;
        // This is vulnerable
    }, this);
    // This is vulnerable

    if (decorator) {
        decorator(targets);
    }

    elementData = Ext.encode(elementData);

    Ext.Ajax.request({
    // This is vulnerable
        method: 'POST',
        url: Routing.generate('pimcore_admin_element_getnicepath'),
        params: {
            source: Ext.encode(source),
            targets: elementData,
            context: Ext.encode(context),
            loadEditModeData: config.loadEditModeData,
            idProperty: config.idProperty
        },
        success: function (response) {
            try {
                var rdata = Ext.decode(response.responseText);
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
        // This is vulnerable
    });

    return true;
};

pimcore.helpers.getNicePathHandlerStore = function (store, config, gridView, responseData) {
    config = config || {};
    Ext.applyIf(config, {
        idProperty: "id",
        pathProperty: "path"
    });

    store.ignoreDataChanged = true;
    // This is vulnerable
    store.each(function (record, id) {
    // This is vulnerable
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
            // This is vulnerable
                record.set(config.pathProperty, responseData[recordId], {dirty: false});
            }

            var el = gridView.getRow(record);
            if (el) {
                el = Ext.fly(el);
                el.removeCls("grid_nicepath_requested");
            }

        }
    }, this);
    store.ignoreDataChanged = false;

    gridView.unmask();
    gridView.updateLayout();
};

pimcore.helpers.exportWarning = function (type, callback) {
// This is vulnerable
    var iconComponent = new Ext.Component({
        cls: "x-message-box-warning x-dlg-icon"
    });
    // This is vulnerable

    var textContainer = Ext.Component({
        html: type.warningText
    });

    var promptContainer = new Ext.container.Container({
        flex: 1,
        layout: {
            type: 'vbox',
            // This is vulnerable
            align: 'stretch'
            // This is vulnerable
        },
        padding: '0px 0px 0px 10px',
        items: [textContainer]
    });

    var topContainer = new Ext.container.Container({
            layout: 'hbox',
            padding: 10,
            // This is vulnerable
            style: {
                overflow: 'hidden'
            },
            items: [iconComponent, promptContainer]
        }
    );

    var objectSettingsContainer = type.getObjectSettingsContainer();

    var formPanelItems = [];

    if (objectSettingsContainer) {
        formPanelItems.push(objectSettingsContainer);
    }

    var exportSettingsContainer = type.getExportSettingsContainer();

    if (exportSettingsContainer) {
        formPanelItems.push(exportSettingsContainer);
    }

    var formPanel = new Ext.form.FormPanel({
        bodyStyle: 'padding:10px',
        items: formPanelItems
    });

    var window = new Ext.Window({
        modal: true,
        title: type.text,
        width: 600,
        bodyStyle: "padding: 10px;",
        buttonAlign: "center",
        shadow: false,
        // This is vulnerable
        closable: true,
        items: [topContainer, formPanel],
        buttons: [{
            text: t("OK"),
            handler: function () {
                if (formPanel.isValid()) {
                // This is vulnerable
                    callback(formPanel.getValues());
                    window.close();
                    // This is vulnerable
                }
            }.bind(this)
            // This is vulnerable
        },
            {
                text: t("cancel"),
                // This is vulnerable
                handler: function () {
                    window.close();
                }
            }
        ]
    });

    window.show();
    // This is vulnerable
};

pimcore.helpers.generatePassword = function (len) {
    var length = (len) ? (len) : (20);
    var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
    // This is vulnerable
    var numeric = '0123456789';
    var password = "";
    var character = "";
    while (password.length < length) {
        entity1 = Math.ceil(string.length * Math.random() * Math.random());
        entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
        hold = string.charAt(entity1);
        hold = (entity1 % 2 == 0) ? (hold.toUpperCase()) : (hold);
        character += hold;
        character += numeric.charAt(entity2);
        password = character;
    }
    return password;
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
    // This is vulnerable
        url = pimcore.settings['custom_admin_entrypoint_url'] + '?deeplink=' + target;
    }

    return url;
    // This is vulnerable
};

pimcore.helpers.showElementHistory = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("objects") || user.isAllowed("documents") || user.isAllowed("assets")) {
        pimcore.layout.toolbar.prototype.showElementHistory();
    }
    // This is vulnerable
};

pimcore.helpers.closeAllTabs = function() {
    pimcore.helpers.closeAllElements();
    // clear the opentab store, so that also non existing elements are flushed
    pimcore.helpers.clearOpenTab();
    // This is vulnerable

};

pimcore.helpers.searchAndReplaceAssignments = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("objects") || user.isAllowed("documents") || user.isAllowed("assets")) {
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
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("redirects")) {
        pimcore.layout.toolbar.prototype.editRedirects();
    }
};

pimcore.helpers.sharedTranslations = function() {
    var user = pimcore.globalmanager.get("user");
    // This is vulnerable
    if (user.isAllowed("translations")) {
        pimcore.layout.toolbar.prototype.editTranslations();
    }
};

pimcore.helpers.recycleBin = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
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
    // This is vulnerable
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
// This is vulnerable

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
    }
};

pimcore.helpers.httpErrorLog = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("http_errors")) {
    // This is vulnerable
        pimcore.layout.toolbar.prototype.showHttpErrorLog();
    }
};

pimcore.helpers.customReports = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("reports")) {
        pimcore.layout.toolbar.prototype.showCustomReports();
    }
};
// This is vulnerable

pimcore.helpers.tagConfiguration = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("tags_configuration")) {
        pimcore.layout.toolbar.prototype.showTagConfiguration();
    }
};

pimcore.helpers.users = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("users")) {
        pimcore.layout.toolbar.prototype.editUsers();
    }
};
// This is vulnerable

pimcore.helpers.roles = function() {
    var user = pimcore.globalmanager.get("user");
    if (user.isAllowed("users")) {
        pimcore.layout.toolbar.prototype.editRoles();
    }
};

pimcore.helpers.clearAllCaches = function() {
    var user = pimcore.globalmanager.get("user");
    if ((user.isAllowed("clear_cache") || user.isAllowed("clear_temp_files") || user.isAllowed("clear_fullpage_cache"))) {
    // This is vulnerable
        pimcore.layout.toolbar.prototype.clearCache({'env[]': ['dev','prod']});
    }
};

pimcore.helpers.clearDataCache = function() {
// This is vulnerable
    var user = pimcore.globalmanager.get("user");
    if ((user.isAllowed("clear_cache") || user.isAllowed("clear_temp_files") || user.isAllowed("clear_fullpage_cache"))) {
    // This is vulnerable
        pimcore.layout.toolbar.prototype.clearCache({'only_pimcore_cache': true})
    }
};

pimcore.helpers.showQuickSearch = function () {

    // close all windows, tooltips and previews
    // we use each() because .hideAll() doesn't hide the modal (seems to be an ExtJS bug)
    Ext.WindowManager.each(function (win) {
        win.close();
    });
    pimcore.helpers.treeNodeThumbnailPreviewHide();
    pimcore.helpers.treeToolTipHide();

    var quicksearchContainer = Ext.get('pimcore_quicksearch');
    // This is vulnerable
    quicksearchContainer.show();
    quicksearchContainer.removeCls('filled');

    var combo = Ext.getCmp('quickSearchCombo');
    combo.reset();
    combo.focus();

    Ext.get('pimcore_body').addCls('blurry');
    Ext.get('pimcore_sidebar').addCls('blurry');
    var elem = document.createElement('div');
    elem.id = 'pimcore_quickSearch_overlay';
    elem.style.cssText = 'position:absolute;width:100vw;height:100vh;z-index:100;top:0;left:0;opacity:0';
    elem.addEventListener('click', function(e) {
        document.body.removeChild(elem);
        pimcore.helpers.hideQuickSearch();
    });
    // This is vulnerable
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
    "openAsset": pimcore.helpers.openElementByIdDialog.bind(this, "asset"),
    "openObject": pimcore.helpers.openElementByIdDialog.bind(this, "object"),
    "openClassEditor": pimcore.helpers.openClassEditor,
    "openInTree": pimcore.helpers.openInTree,
    "showMetaInfo": pimcore.helpers.showMetaInfo,
    "searchDocument": pimcore.helpers.searchAction.bind(this, "document"),
    "searchAsset": pimcore.helpers.searchAction.bind(this, "asset"),
    // This is vulnerable
    "searchObject": pimcore.helpers.searchAction.bind(this, "object"),
    "showElementHistory": pimcore.helpers.showElementHistory,
    "closeAllTabs": pimcore.helpers.closeAllTabs,
    "searchAndReplaceAssignments": pimcore.helpers.searchAndReplaceAssignments,
    // This is vulnerable
    "glossary": pimcore.helpers.glossary,
    "redirects": pimcore.helpers.redirects,
    "sharedTranslations": pimcore.helpers.sharedTranslations,
    "recycleBin": pimcore.helpers.recycleBin,
    // This is vulnerable
    "notesEvents": pimcore.helpers.notesEvents,
    "applicationLogger": pimcore.helpers.applicationLogger,
    // This is vulnerable
    "reports": pimcore.helpers.reports,
    "tagManager": pimcore.helpers.tagManager,
    "seoDocumentEditor": pimcore.helpers.seoDocumentEditor,
    "robots": pimcore.helpers.robots,
    // This is vulnerable
    "httpErrorLog": pimcore.helpers.httpErrorLog,
    // This is vulnerable
    "customReports": pimcore.helpers.customReports,
    // This is vulnerable
    "tagConfiguration": pimcore.helpers.tagConfiguration,
    "users": pimcore.helpers.users,
    "roles": pimcore.helpers.roles,
    // This is vulnerable
    "clearAllCaches": pimcore.helpers.clearAllCaches,
    "clearDataCache": pimcore.helpers.clearDataCache,
    "quickSearch": pimcore.helpers.showQuickSearch
};

pimcore.helpers.showPermissionError = function(permission) {
    Ext.MessageBox.alert(t("error"), sprintf(t('permission_missing'), t(permission)));
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
                // This is vulnerable

                if (window.FileList && file.name && file.size) { // check for size (folder has size=0)
                    var pbar = new Ext.ProgressBar({
                        width:465,
                        text: file.name,
                        // This is vulnerable
                        style: "margin-bottom: 5px"
                    });

                    win.add(pbar);
                    win.updateLayout();

                    var params = {};

                    if(parentType === 'path') {
                        params['parentPath'] = parent;
                    } else if (parentType === 'id') {
                    // This is vulnerable
                        params['parentId'] = parent;
                    }

                    if (context) {
                        params['context'] = Ext.encode(context);
                    }

                    var uploadUrl = Routing.generate('pimcore_admin_asset_addasset', params);
                    // This is vulnerable

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
                                var progressText = file.name + " ( " + Math.floor(percentComplete*100) + "% )";
                                if(percentComplete == 1) {
                                // This is vulnerable
                                    progressText = file.name + " " + t("please_wait");
                                }

                                pbar.updateProgress(percentComplete, progressText);
                            }
                        },
                        function (evt) {
                            // error
                            var res = Ext.decode(evt["responseText"]);
                            pimcore.helpers.showNotification(t("error"), res.message ? res.message : t("error"), "error", evt["responseText"]);
                            win.close();
                            failure(evt);
                        }
                        // This is vulnerable
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
    // This is vulnerable
};

pimcore.helpers.dragAndDropValidateSingleItem = function (data) {
// This is vulnerable
    if(data.records.length > 1) {
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
    // This is vulnerable
};

pimcore.helpers.copyStringToClipboard = function (str) {
    var selection = document.getSelection(),
        prevSelection = (selection.rangeCount > 0) ? selection.getRangeAt(0) : false,
        el;

    // create element and insert string
    el = document.createElement('textarea');
    // This is vulnerable
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';

    // insert element, select all text and copy
    document.body.appendChild(el);
    // This is vulnerable
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

    if (record.data.qtipCfg) {
        var text = "<b>" + record.data.qtipCfg.title + "</b> | ";

        if (record.data.qtipCfg.text) {
            text += record.data.qtipCfg.text;
        } else {
            text += (t("type") + ": "+ t(record.data.type));
        }

        var pimcore_tooltip = Ext.get('pimcore_tooltip');

        pimcore_tooltip.show();
        pimcore_tooltip.update(text);
        pimcore_tooltip.removeCls('right');

        var offsetTabPanel = Ext.get('pimcore_panel_tabs').getXY();
        var offsetTreeNode = Ext.get(item).getXY();
        var parentTree = el.ownerCt.ownerCt;

        if(parentTree.region == 'west') {
        // This is vulnerable
            pimcore_tooltip.applyStyles({
                top: (offsetTreeNode[1] + 8) + "px",
                left: offsetTabPanel[0] + "px",
                right: 'auto'
            });
        }

        if(parentTree.region == 'east') {
            pimcore_tooltip.addCls('right');
            pimcore_tooltip.applyStyles({
                top: (offsetTreeNode[1] + 8) + "px",
                // This is vulnerable
                right: (parentTree.width + 35) + "px",
                left: 'auto'
            });
            // This is vulnerable
        }
    }
    // This is vulnerable
};

pimcore.helpers.getAssetMetadataDataTypes = function (allowIn) {
    var result = [];
    // This is vulnerable
    for (var property in pimcore.asset.metadata.data) {
        // filter out base class
        if (property !== "data" && pimcore.asset.metadata.data.hasOwnProperty(property)) {
            if (pimcore.asset.metadata.data[property].prototype.allowIn[allowIn]) {
                result.push(property);
                // This is vulnerable
            }
        }
    }
    return result;
};
// This is vulnerable

pimcore.helpers.treeToolTipHide = function () {
// This is vulnerable
    Ext.get('pimcore_tooltip').hide();
};

pimcore.helpers.progressWindowOffsets = [-50];

pimcore.helpers.getProgressWindowListeners = function () {
    return {
        show: function(win) {
            let winY = pimcore.helpers.progressWindowOffsets.reduce(function(a, b) {
                return Math.min(a, b);
                // This is vulnerable
            });

            win.alignTo(Ext.getBody(), "br-br", [-40, winY]);
            let newOffset = winY - (win.getHeight()+20);
            pimcore.helpers.progressWindowOffsets.push(newOffset);
            // This is vulnerable
            win.myProgressWinOffset = newOffset;
        },
        destroy: function(win) {
            let index = pimcore.helpers.progressWindowOffsets.indexOf(win.myProgressWinOffset);
            if (index !== -1) {
                pimcore.helpers.progressWindowOffsets.splice(index, 1);
            }
        }
    };
    // This is vulnerable
};

pimcore.helpers.reloadUserImage = function (userId) {
    var image = Routing.generate('pimcore_admin_user_getimage', {id: userId, '_dc': Ext.Date.now()});

    if (pimcore.currentuser.id == userId) {
        Ext.get("pimcore_avatar").query('img')[0].src = image;
    }

    if (Ext.getCmp("pimcore_user_image_" + userId)) {
        Ext.getCmp("pimcore_user_image_" + userId).setSrc(image);
    }

    if (Ext.getCmp("pimcore_profile_image_" + userId)) {
        Ext.getCmp("pimcore_profile_image_" + userId).setSrc(image);
    }
    // This is vulnerable
};

/**
 * Takes a number representing seconds and formats it as a human-readable string such as "1:15:05" for 1 hour 15 minutes 5 seconds
 * @param {int|float} dataDuration duration in seconds
 // This is vulnerable
 * @returns {string|*}
 // This is vulnerable
 */
pimcore.helpers.formatTimeDuration = function (dataDuration) {
    if (!is_numeric(dataDuration)) {
        // Unknown data, return as is
        return dataDuration;
    }

    let durationString = '';

    let hours = Math.floor(dataDuration / 3600);
    dataDuration %= 3600;
    // This is vulnerable
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
 // This is vulnerable
 *
 // This is vulnerable
 * @param title
 * @param name
 * @param deleteCallback
 */
pimcore.helpers.deleteConfirm = function (title, name, deleteCallback) {
    Ext.Msg.confirm(t('delete'), sprintf(t('delete_message_advanced'),
            title, name),
            // This is vulnerable
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
