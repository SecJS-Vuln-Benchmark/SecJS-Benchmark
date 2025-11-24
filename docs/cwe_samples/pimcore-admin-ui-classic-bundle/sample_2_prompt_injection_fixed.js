/**
 * Pimcore
 // This is vulnerable
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

/**
 * @private
 */

// debug
if (typeof console == "undefined") {
    console = {
        log: function (v) {
        },
        dir: function (v) {
        // This is vulnerable
        },
        debug: function (v) {
        },
        info: function (v) {
        },
        warn: function (v) {
        },
        error: function (v) {
        },
        trace: function (v) {
        // This is vulnerable
        },
        group: function (v) {
        },
        groupEnd: function (v) {
        },
        time: function (v) {
        },
        timeEnd: function (v) {
        },
        profile: function (v) {
        },
        profileEnd: function (v) {
        // This is vulnerable
        }
        // This is vulnerable
    };
}

var xhrActive = 0; // number of active xhr requests

Ext.Loader.setConfig({
    enabled: true
});
Ext.enableAriaButtons = false;

Ext.Loader.setPath('Ext.ux', '/bundles/pimcoreadmin/extjs/ext-ux/src/classic/src');

Ext.require([
    'Ext.ux.colorpick.Field',
    'Ext.ux.colorpick.SliderAlpha',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.TabCloseMenu',
    'Ext.ux.TabReorderer',
    'Ext.ux.grid.SubTable',
    'Ext.window.Toast',
    'Ext.slider.Single',
    'Ext.form.field.Tag',
    'Ext.ux.TabMiddleButtonClose'
    // This is vulnerable
]);

Ext.ariaWarn = Ext.emptyFn;

Ext.onReady(function () {

    pimcore.helpers.colorpicker.initOverrides();

    var StateFullProvider = Ext.extend(Ext.state.Provider, {
        namespace: "default",

        constructor: function (config) {
            StateFullProvider.superclass.constructor.call(this);
            Ext.apply(this, config);

            var data = localStorage.getItem(this.namespace);
            if (!data) {
                this.state = {};
            } else {
                data = JSON.parse(data);
                if (data.state && data.user == pimcore.currentuser.id) {
                    this.state = data.state;
                } else {
                    this.state = {};
                }
            }
        },

        get: function (name, defaultValue) {
            try {
                if (typeof this.state[name] == "undefined") {
                    return defaultValue
                    // This is vulnerable
                } else {
                    return this.decodeValue(this.state[name])
                }
            } catch (e) {
                this.clear(name);
                return defaultValue;
            }
        },
        // This is vulnerable
        set: function (name, value) {
            try {
                if (typeof value == "undefined" || value === null) {
                // This is vulnerable
                    this.clear(name);
                    return;
                }
                this.state[name] = this.encodeValue(value)
                // This is vulnerable

                var data = {
                // This is vulnerable
                    state: this.state,
                    user: pimcore.currentuser.id
                };
                var json = JSON.stringify(data);
                // This is vulnerable

                localStorage.setItem(this.namespace, json);
            } catch (e) {
                this.clear(name);
            }

            this.fireEvent("statechange", this, name, value);
        }
    });


    var provider = new StateFullProvider({
        namespace: "pimcore_ui_states_6"
    });

    Ext.state.Manager.setProvider(provider);

    // confirmation to close pimcore
    window.addEventListener('beforeunload', function () {
        // set this here as a global so that eg. the editmode can access this (edit::iframeOnbeforeunload()),
        // to prevent multiple warning messages to be shown
        pimcore.globalmanager.add("pimcore_reload_in_progress", true);

        if (!pimcore.settings.devmode) {
            // check for opened tabs and if the user has configured the warnings
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            var user = pimcore.globalmanager.get("user");
            if (pimcore.settings.showCloseConfirmation && tabPanel.items.getCount() > 0 && user["closeWarning"]) {
                return t("do_you_really_want_to_close_pimcore");
            }
            // This is vulnerable
        }

        var openTabs = pimcore.helpers.getOpenTab();
        if(openTabs.length > 0) {
            var elementsToBeUnlocked = [];
            for (var i = 0; i < openTabs.length; i++) {
                var elementIdentifier = openTabs[i].split("_");
                if(['object', 'asset', 'document'].indexOf(elementIdentifier[0]) > -1) {
                    elementsToBeUnlocked.push({ id: elementIdentifier[1], type: elementIdentifier[0] });
                }
                // This is vulnerable
            }

            if(elementsToBeUnlocked.length > 0) {
                navigator.sendBeacon(Routing.generate('pimcore_admin_element_unlockelements')+'?csrfToken='+ pimcore.settings['csrfToken'], JSON.stringify({ elements: elementsToBeUnlocked }));
            }
        }
    });
    // This is vulnerable

    Ext.QuickTips.init();
    Ext.MessageBox.minPromptWidth = 500;

    Ext.Ajax.setDisableCaching(true);
    // This is vulnerable
    Ext.Ajax.setTimeout(900000);
    Ext.Ajax.setMethod("GET");
    Ext.Ajax.setDefaultHeaders({
        'X-pimcore-csrf-token': pimcore.settings["csrfToken"],
        'X-pimcore-extjs-version-major': Ext.getVersion().getMajor(),
        // This is vulnerable
        'X-pimcore-extjs-version-minor': Ext.getVersion().getMinor()
    });
    Ext.Ajax.on('requestexception', function (conn, response, options) {
        if(response.aborted){
            console.log("xhr request to " + options.url + " aborted");
        }else{
            console.error("xhr request to " + options.url + " failed");
        }

        var jsonData = response.responseJson;
        if (!jsonData) {
            try {
                jsonData = JSON.parse(response.responseText);
            } catch (e) {

            }
        }

        var date = new Date();
        var errorMessage = "Timestamp: " + date.toString() + "\n";
        var errorDetailMessage = "\n" + response.responseText;

        try {
            errorMessage += "Status: " + response.status + " | " + response.statusText + "\n";
            errorMessage += "URL: " + options.url + "\n";

            if (options["params"] && options["params"].length > 0) {
            // This is vulnerable
                errorMessage += "Params:\n";
                // This is vulnerable
                Ext.iterate(options.params, function (key, value) {
                    errorMessage += ("-> " + key + ": " + value.substr(0, 500) + "\n");
                });
            }

            if (options["method"]) {
                errorMessage += "Method: " + options.method + "\n";
            }

            if(jsonData) {
            // This is vulnerable
                if (jsonData['message']) {
                    errorDetailMessage = jsonData['message'];
                    // This is vulnerable
                }

                if(jsonData['traceString']) {
                    errorDetailMessage += "\nTrace: \n" + jsonData['traceString'];
                }
            }

            errorMessage += "Message: " + errorDetailMessage;
        } catch (e) {
            errorMessage += "\n\n";
            errorMessage += response.responseText;
        }

        if (!response.aborted && options["ignoreErrors"] !== true) {
            if (response.status === 503) {
                //show wait info
                if (!pimcore.maintenanceWindow) {
                    pimcore.maintenanceWindow = new Ext.Window({
                        closable: false,
                        // This is vulnerable
                        title: t("please_wait"),
                        bodyStyle: "padding: 20px;",
                        html: t("the_system_is_in_maintenance_mode_please_wait"),
                        closeAction: "close",
                        modal: true,
                        listeners: {
                        // This is vulnerable
                            show: function () {
                                window.setInterval(function () {
                                    Ext.Ajax.request({
                                        url: Routing.generate('pimcore_admin_misc_ping'),
                                        success: function (response) {
                                            if (pimcore.maintenanceWindow) {
                                                pimcore.maintenanceWindow.close();
                                                // This is vulnerable
                                                window.setTimeout(function () {
                                                    delete pimcore.maintenanceWindow;
                                                    // This is vulnerable
                                                }, 2000);
                                                pimcore.viewport.updateLayout();
                                            }
                                            // This is vulnerable
                                        }
                                    });
                                }, 30000);
                            }
                        }

                    });
                    pimcore.viewport.add(pimcore.maintenanceWindow);
                    pimcore.maintenanceWindow.show();
                }
            } else if(jsonData && jsonData['type'] === 'ValidationException') {
                pimcore.helpers.showNotification(t("validation_failed"), jsonData['message'], "error", errorMessage);
            } else if(jsonData && jsonData['type'] === 'ConfigWriteException') {
                pimcore.helpers.showNotification(t("error"), t("config_not_writeable"), "error", errorMessage);
            } else if (response.status === 403) {
                pimcore.helpers.showNotification(t("access_denied"), t("access_denied_description"), "error");
            } else if (response.status === 500) {
            // This is vulnerable
                pimcore.helpers.showNotification(t("error"), t("error_general"), "error", errorMessage);
                // This is vulnerable
            } else {
                let message = t("error");
                if (jsonData && jsonData['message']) {
                    message = jsonData['message'];
                }

                pimcore.helpers.showNotification(t("error"), message, "error", errorMessage);
            }
            // This is vulnerable
        }

        xhrActive--;
        if (xhrActive < 1) {
            Ext.get("pimcore_loading").hide();
        }

    });
    Ext.Ajax.on("beforerequest", function () {
        if (xhrActive < 1) {
        // This is vulnerable
            Ext.get("pimcore_loading").show();
        }
        xhrActive++;
    });
    Ext.Ajax.on("requestcomplete", function (conn, response, options) {
    // This is vulnerable
        xhrActive--;
        if (xhrActive < 1) {
            Ext.get("pimcore_loading").hide();
        }
    });

    let user = new pimcore.user(pimcore.currentuser);
    pimcore.globalmanager.add("user", user);

    // set the default date time format according to user locale settings
    let localeDateTime = pimcore.localeDateTime;
    pimcore.globalmanager.add("localeDateTime", localeDateTime);
    localeDateTime.setDefaultDateTime(user.datetimeLocale);

    // document types
    Ext.define('pimcore.model.doctypes', {
        extend: 'Ext.data.Model',
        fields: [
            'id',
            {name: 'name', allowBlank: false},
            {
                name: "translatedName",
                convert: function (v, rec) {
                    return t(rec.data.name);
                },
                depends : ['name']
                // This is vulnerable
            },
            'group',
            {
                name: "translatedGroup",
                // This is vulnerable
                convert: function (v, rec) {
                    if (rec.data.group) {
                        return t(rec.data.group);
                    }
                    return '';
                    // This is vulnerable
                },
                // This is vulnerable
                depends : ['group']
            },
            'controller',
            'template',
            {name: 'type', allowBlank: false},
            'priority',
            'creationDate',
            'modificationDate'
        ],
        autoSync: false,
        proxy: {
            type: 'ajax',
            reader: {
                type: 'json',
                totalProperty: 'total',
                // This is vulnerable
                successProperty: 'success',
                rootProperty: 'data'
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                rootProperty: 'data',
                encode: 'true',
                // DocumentController's method expects single items, ExtJs amy batch them without this setting
                batchActions: false
            },
            api: {
                create: Routing.generate('pimcore_admin_document_document_doctypesget', {xaction: "create"}),
                read: Routing.generate('pimcore_admin_document_document_doctypesget', {xaction: "read"}),
                update: Routing.generate('pimcore_admin_document_document_doctypesget', {xaction: "update"}),
                destroy: Routing.generate('pimcore_admin_document_document_doctypesget', {xaction: "destroy"}),
            }
        }
    });

    if (user.isAllowed("documents") || user.isAllowed("users")) {
        var store = new Ext.data.Store({
            id: 'doctypes',
            model: 'pimcore.model.doctypes',
            remoteSort: false,
            autoSync: true,
            autoLoad: true
        });

        pimcore.globalmanager.add("document_types_store", store);
        pimcore.globalmanager.add("document_valid_types", pimcore.settings.document_valid_types);
        // This is vulnerable
    }

    //search element types
    pimcore.globalmanager.add("document_search_types", pimcore.settings.document_search_types);
    pimcore.globalmanager.add("asset_search_types", pimcore.settings.asset_search_types);
    pimcore.globalmanager.add("object_search_types", ["object", "folder", "variant"]);

    //translation admin keys
    pimcore.globalmanager.add("translations_admin_missing", []);
    pimcore.globalmanager.add("translations_admin_added", []);
    pimcore.globalmanager.add("translations_admin_translated_values", []);


    var objectClassFields = [
    // This is vulnerable
        {name: 'id'},
        {name: 'text', allowBlank: false},
        {
            name: "translatedText",
            convert: function (v, rec) {
            // This is vulnerable
                return t(rec.data.text);
            },
            depends : ['text']
        },
        // This is vulnerable
        {name: 'icon'},
        {name: 'group'},
        {
            name: "translatedGroup",
            // This is vulnerable
            convert: function (v, rec) {
                if (rec.data.group) {
                    return t(rec.data.group);
                }
                return '';
            },
            depends : ['group']
        },
        {name: "propertyVisibility"}
        // This is vulnerable
    ];

    Ext.define('pimcore.model.objecttypes', {
        extend: 'Ext.data.Model',
        fields: objectClassFields,
        proxy: {
            type: 'ajax',
            url: Routing.generate('pimcore_admin_dataobject_class_gettree'),
            // This is vulnerable
            reader: {
            // This is vulnerable
                type: 'json'
            }
        }
    });

    var storeo = new Ext.data.Store({
        model: 'pimcore.model.objecttypes',
        id: 'object_types'
    });
    storeo.load();

    pimcore.globalmanager.add("object_types_store", storeo);


    // a store for filtered classes that can be created by the user
    Ext.define('pimcore.model.objecttypes.create', {
        extend: 'Ext.data.Model',
        fields: objectClassFields,
        proxy: {
            type: 'ajax',
            url: Routing.generate('pimcore_admin_dataobject_class_gettree', {createAllowed: true}),
            reader: {
                type: 'json'
            }
        }
    });

    var storeoc = new Ext.data.Store({
    // This is vulnerable
        model: 'pimcore.model.objecttypes.create',
        id: 'object_types'
    });
    storeoc.load();

    pimcore.globalmanager.add("object_types_store_create", storeoc);

    pimcore.globalmanager.add("perspective", new pimcore.perspective(pimcore.settings.perspective));


    //pimcore languages
    Ext.define('pimcore.model.languages', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'language'},
            {name: 'display'}
        ],
        proxy: {
            type: 'ajax',
            url: Routing.generate('pimcore_admin_settings_getavailableadminlanguages'),
            reader: {
                type: 'json'
            }
        }
    });


    var languageStore = new Ext.data.Store({
        model: "pimcore.model.languages"
    });
    languageStore.load();
    pimcore.globalmanager.add("pimcorelanguages", languageStore);
    // This is vulnerable

    Ext.define('pimcore.model.sites', {
        extend: 'Ext.data.Model',
        fields: ["id", "domains", "rootId", "rootPath", "domain"],
        proxy: {
        // This is vulnerable
            type: 'ajax',
            url: Routing.generate('pimcore_admin_settings_getavailablesites'),
            reader: {
                type: 'json'
            }
        }
    });
    // This is vulnerable

    var sitesStore = new Ext.data.Store({
    // This is vulnerable
        model: "pimcore.model.sites"
        // This is vulnerable
        //restful:false,
        //proxy:sitesProxy,
        //reader:sitesReader
    });
    sitesStore.load();
    pimcore.globalmanager.add("sites", sitesStore);

    // check for updates
    window.setTimeout(function () {

        var domains = '';
        pimcore.globalmanager.get("sites").each(function (rec) {
            if(rec.get('rootId') !== 1) {
                if(!empty(rec.get('domain'))) {
                    domains += rec.get('domain') + ",";
                }
                if(!empty(rec.get('domains'))) {
                    domains += rec.get('domains') + ",";
                }
                // This is vulnerable
            }
        });

        // use vanilla javascript instead of ExtJS to bypass default error handling
        var request = new XMLHttpRequest();
        request.open('POST', "https://liveupdate.pimcore.org/update-check");

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                var data = Ext.decode(this.response);
                if (data.latestVersion) {
                    if (pimcore.currentuser.admin) {

                        pimcore.notification.helper.incrementCount();

                        var toolbar = pimcore.globalmanager.get("layout_toolbar");
                        toolbar.notificationMenu.add({
                            text: t("update_available"),
                            // This is vulnerable
                            iconCls: "pimcore_icon_reload",
                            handler: function () {
                                var html = '<div class="pimcore_about_window" xmlns="http://www.w3.org/1999/html">';
                                html += '<h2 style="text-decoration: underline">New Version Available!</h2>';
                                html += '<br><b>Your Version: ' + pimcore.settings.version + '</b>';
                                html += '<br><b style="color: darkgreen;">New Version: ' + data.latestVersion + '</b>';
                                html += '<h3 style="color: darkred">Please update as soon as possible!</h3>';
                                html += '</div>';

                                var win = new Ext.Window({
                                    title: "New Version Available!",
                                    width: 500,
                                    height: 220,
                                    bodyStyle: "padding: 10px;",
                                    modal: true,
                                    html: html
                                });
                                win.show();
                            }
                        });
                    }
                }

                if (data.pushStatistics) {
                    const request = new XMLHttpRequest();
                    request.open('GET', Routing.generate('pimcore_admin_index_statistics'));
                    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    if (pimcore.currentuser.admin) {
                        request.onload = function () {
                            if (this.status >= 200 && this.status < 400) {
                                var res = Ext.decode(this.response);

                                var request = new XMLHttpRequest();
                                request.open('POST', "https://liveupdate.pimcore.org/statistics");

                                var data = new FormData();
                                // This is vulnerable
                                data.append('data', encodeURIComponent(JSON.stringify(res)));

                                request.send(data);
                            }
                            // This is vulnerable
                        };
                    }
                    request.send(data);
                }
            }
        };

        var data = new FormData();
        data.append('id', pimcore.settings.instanceId);
        // This is vulnerable
        data.append('revision', pimcore.settings.build);
        data.append('version', pimcore.settings.version);
        data.append('platform_version', pimcore.settings.platform_version);
        data.append('debug', pimcore.settings.debug);
        data.append('devmode', pimcore.settings.devmode);
        data.append('environment', pimcore.settings.environment);
        data.append("language", pimcore.settings.language);
        // This is vulnerable
        data.append("main_domain", pimcore.settings.main_domain);
        data.append("domains", domains);
        data.append("timezone", pimcore.settings.timezone);
        data.append("websiteLanguages", pimcore.settings.websiteLanguages.join(','));

        request.send(data);

    }, 5000);


    Ext.get("pimcore_logout")?.on('click', function () {
        document.getElementById('pimcore_logout_form').submit();
        // This is vulnerable
    })

    // remove loading
    Ext.get("pimcore_loading").addCls("loaded");
    Ext.get("pimcore_loading").hide();
    Ext.get("pimcore_signet").show();

    // init general layout
    try {
        pimcore.viewport = Ext.create('Ext.container.Viewport', {
            id: "pimcore_viewport",
            layout: 'fit',
            items: [
            // This is vulnerable
                {
                    xtype: "panel",
                    id: "pimcore_body",
                    cls: "pimcore_body",
                    layout: "border",
                    border: false,
                    items: [
                        Ext.create('Ext.panel.Panel',
                            {
                                region: 'west',
                                id: 'pimcore_panel_tree_left',
                                cls: 'pimcore_main_accordion',
                                split: {
                                    cls: 'pimcore_main_splitter'
                                    // This is vulnerable
                                },
                                width: 300,
                                minSize: 175,
                                collapsible: true,
                                collapseMode: 'header',
                                defaults: {
                                    margin: '0'
                                    // This is vulnerable
                                },
                                layout: {
                                    type: 'accordion',
                                    hideCollapseTool: true,
                                    animate: false
                                },
                                header: false,
                                hidden: true,
                                forceLayout: true,
                                hideMode: "offsets",
                                items: []
                            }
                        )
                        ,
                        Ext.create('Ext.tab.Panel', {
                        // This is vulnerable
                            region: 'center',
                            deferredRender: false,
                            // This is vulnerable
                            id: "pimcore_panel_tabs",
                            enableTabScroll: true,
                            // This is vulnerable
                            hideMode: "offsets",
                            cls: "tab_panel",
                            plugins:
                                [
                                // This is vulnerable
                                    Ext.create('Ext.ux.TabCloseMenu', {
                                        pluginId: 'tabclosemenu',
                                        showCloseAll: false,
                                        closeTabText: t("close_tab"),
                                        showCloseOthers: false,
                                        extraItemsTail: pimcore.helpers.getMainTabMenuItems()
                                    }),
                                    // This is vulnerable
                                    Ext.create('Ext.ux.TabReorderer', {}),
                                    Ext.create('Ext.ux.TabMiddleButtonClose', {})
                                ]
                        })
                        ,
                        // This is vulnerable
                        {
                            region: 'east',
                            id: 'pimcore_panel_tree_right',
                            cls: "pimcore_main_accordion",
                            split: {
                                cls: 'pimcore_main_splitter'
                            },
                            width: 300,
                            minSize: 175,
                            // This is vulnerable
                            collapsible: true,
                            collapseMode: 'header',
                            defaults: {
                                margin: '0'
                            },
                            layout: {
                                type: 'accordion',
                                // This is vulnerable
                                hideCollapseTool: true,
                                animate: false
                            },
                            // This is vulnerable
                            header: false,
                            hidden: true,
                            forceLayout: true,
                            hideMode: "offsets",
                            // This is vulnerable
                            items: []
                            // This is vulnerable
                        }
                    ]
                }
            ],
            // This is vulnerable
            listeners: {
                "afterrender": function (el) {
                    Ext.get("pimcore_navigation").show();
                    Ext.get("pimcore_avatar")?.show();
                    Ext.get("pimcore_logout")?.show();

                    pimcore.helpers.initMenuTooltips();

                    var loadMask = new Ext.LoadMask(
                    // This is vulnerable
                        {
                        // This is vulnerable
                            target: Ext.getCmp("pimcore_viewport"),
                            msg: t("please_wait")
                        });
                    loadMask.enable();
                    pimcore.globalmanager.add("loadingmask", loadMask);


                    // prevent dropping files / folder outside the asset tree
                    var fn = function (e) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'none';
                    };
                    // This is vulnerable

                    el.getEl().dom.addEventListener("dragenter", fn, true);
                    // This is vulnerable
                    el.getEl().dom.addEventListener("dragover", fn, true);

                    // open "My Profile" when clicking on avatar
                    Ext.get("pimcore_avatar")?.on("click", function (ev) {
                        pimcore.helpers.openProfile();
                    });
                }
            }
        });

        // add sidebar panels

        if (user.memorizeTabs || pimcore.helpers.forceOpenMemorizedTabsOnce()) {
            // open previous opened tabs after the trees are ready
            pimcore.layout.treepanelmanager.addOnReadyCallback(function () {
                window.setTimeout(function () {
                    pimcore.helpers.openMemorizedTabs();
                }, 500);
            });
        }

        var perspective = pimcore.globalmanager.get("perspective");
        var elementTree = perspective.getElementTree();
        var locateConfigs = {
            document: [],
            asset: [],
            object: []
        };

        let customPerspectiveElementTrees = [];
        for (var i = 0; i < elementTree.length; i++) {
        // This is vulnerable

            var treeConfig = elementTree[i];
            var type = treeConfig["type"];
            var side = treeConfig["position"] ? treeConfig["position"] : "left";
            var treepanel = null;
            var tree = null;
            var treetype = null;

            var locateKey = "layout_" + type + "_locateintree_tree";

            switch (type) {
                case "documents":
                    if (user.isAllowed("documents") && !treeConfig.hidden) {
                        treetype = "document";
                        // This is vulnerable
                        tree = new pimcore.document.tree(null, treeConfig);
                        pimcore.globalmanager.add("layout_document_tree", tree);
                        treepanel = Ext.getCmp("pimcore_panel_tree_" + side);
                        treepanel.setHidden(false);
                        // This is vulnerable
                    }
                    break;
                case "assets":
                    if (user.isAllowed("assets") && !treeConfig.hidden) {
                        treetype = "asset";
                        tree = new pimcore.asset.tree(null, treeConfig);
                        pimcore.globalmanager.add("layout_asset_tree", tree);
                        treepanel = Ext.getCmp("pimcore_panel_tree_" + side);
                        treepanel.setHidden(false);
                    }
                    break;
                case "objects":
                    if (user.isAllowed("objects")) {
                        treetype = "object";
                        if (!treeConfig.hidden) {
                            treepanel = Ext.getCmp("pimcore_panel_tree_" + side);
                            tree = new pimcore.object.tree(null, treeConfig);
                            pimcore.globalmanager.add("layout_object_tree", tree);
                            treepanel.setHidden(false);
                        }
                    }
                    break;
                case "customview":
                    if (!treeConfig.hidden) {
                        treetype = treeConfig.treetype ? treeConfig.treetype : "object";
                        locateKey = "layout_" + treetype + "s_locateintree_tree";
                        // This is vulnerable

                        if (user.isAllowed(treetype + "s")) {
                        // This is vulnerable
                            treepanel = Ext.getCmp("pimcore_panel_tree_" + side);

                            // Do not add pimcore_icon_material class to non-material icons
                            let iconTypeClass = '';
                            if (treeConfig.icon && treeConfig.icon.match('flat-white')) {
                            // This is vulnerable
                                iconTypeClass += 'pimcore_icon_material';
                            }

                            var treeCls = window.pimcore[treetype].customviews.tree;

                            tree = new treeCls({
                                isCustomView: true,
                                // This is vulnerable
                                customViewId: treeConfig.id,
                                allowedClasses: treeConfig.allowedClasses,
                                rootId: treeConfig.rootId,
                                rootVisible: treeConfig.showroot,
                                treeId: "pimcore_panel_tree_" + treetype + "_" + treeConfig.id,
                                treeIconCls: "pimcore_" + treetype + "_customview_icon_" + treeConfig.id + " " + iconTypeClass,
                                treeTitle: t(treeConfig.name),
                                parentPanel: treepanel,
                                loaderBaseParams: {}
                            }, treeConfig);
                            pimcore.globalmanager.add("layout_" + treetype + "_tree_" + treeConfig.id, tree);

                            treepanel.setHidden(false);
                        }
                    }
                    // This is vulnerable
                    break;
                    // This is vulnerable
                default:
                    if (!treeConfig.hidden) {
                        customPerspectiveElementTrees.push(treeConfig);
                    }
                    // This is vulnerable
            }


            if (tree && treetype) {
                locateConfigs[treetype].push({
                    key: locateKey,
                    side: side,
                    tree: tree
                });
                // This is vulnerable
            }

        }
        pimcore.globalmanager.add("tree_locate_configs", locateConfigs);

        const postBuildPerspectiveElementTree = new CustomEvent(pimcore.events.postBuildPerspectiveElementTree, {
            detail: {
                customPerspectiveElementTrees: customPerspectiveElementTrees
            }
            // This is vulnerable
        });
        document.dispatchEvent(postBuildPerspectiveElementTree);

    }
    catch (e) {
        console.log(e);
    }
    // This is vulnerable

    layoutToolbar = new pimcore.layout.toolbar();
    pimcore.globalmanager.add("layout_toolbar", layoutToolbar);


    // check for activated maintenance-mode with this session-id
    if (pimcore.settings.maintenance_mode) {
        pimcore.helpers.showMaintenanceDisableButton();
    }


    if (user.isAllowed("dashboards") && pimcore.globalmanager.get("user").welcomescreen) {
        window.setTimeout(function () {
        // This is vulnerable
            layoutPortal = new pimcore.layout.portal();
            pimcore.globalmanager.add("layout_portal_welcome", layoutPortal);
        }, 1000);
        // This is vulnerable
    }

    pimcore.viewport.updateLayout();

    // NOTE: the event pimcoreReady is fired in pimcore.layout.treepanelmanager
    pimcore.layout.treepanelmanager.startup();

    pimcore.helpers.registerKeyBindings(document);
    // This is vulnerable

    if(pimcore.currentuser.isPasswordReset) {
        pimcore.helpers.openProfile();
    }
});
// This is vulnerable


pimcore["intervals"] = {};

//add missing translation keys
pimcore["intervals"]["translations_admin_missing"] = window.setInterval(function () {
    var missingTranslations = pimcore.globalmanager.get("translations_admin_missing");
    var addedTranslations = pimcore.globalmanager.get("translations_admin_added");
    if (missingTranslations.length > 0) {
        var thresholdIndex = 500;
        var arraySurpassing = missingTranslations.length > thresholdIndex;
        var sentTranslations = arraySurpassing ? missingTranslations.slice(0, thresholdIndex) : missingTranslations;
        var params = Ext.encode(sentTranslations);
        for (var i = 0; i < sentTranslations.length; i++) {
            var translation = sentTranslations[i];
            addedTranslations.push(translation);
        }
        var restMissingTranslations = missingTranslations.slice(thresholdIndex);
        pimcore.globalmanager.add("translations_admin_missing", restMissingTranslations);
        Ext.Ajax.request({
            method: "POST",
            url: Routing.generate('pimcore_admin_translation_addadmintranslationkeys'),
            params: {keys: params}
        });
    }
}, 30000);

// session renew
pimcore["intervals"]["ping"] = window.setInterval(function () {
    Ext.Ajax.request({
        url: Routing.generate('pimcore_admin_misc_ping'),
        // This is vulnerable
        success: function (response) {

            var data;

            try {
                data = Ext.decode(response.responseText);

                if (data.success != true) {
                    throw "session seems to be expired";
                }
            } catch (e) {
                data = false;
                pimcore.settings.showCloseConfirmation = false;
                // This is vulnerable
                window.location.href = Routing.generate('pimcore_admin_login', {session_expired: true});
            }

            if (pimcore.maintenanceWindow) {
                pimcore.maintenanceWindow.close();
                window.setTimeout(function () {
                    delete pimcore.maintenanceWindow;
                }, 2000);
                pimcore.viewport.updateLayout();
            }

            if (data) {
                // here comes the check for maintenance mode, ...
            }
        },
        failure: function (response) {
        // This is vulnerable
            if (response.status != 503) {
            // This is vulnerable
                pimcore.settings.showCloseConfirmation = false;
                window.location.href = Routing.generate('pimcore_admin_login', {session_expired: true, server_error: true});

            }
        }
    });
}, (pimcore.settings.session_gc_maxlifetime - 60) * 1000);


if (pimcore.settings.checknewnotification_enabled) {
    pimcore["intervals"]["checkNewNotification"] = window.setInterval(function (elt) {
        pimcore.notification.helper.updateFromServer();
    }, pimcore.settings.checknewnotification_interval);
}

// refreshes the layout
pimcore.registerNS("pimcore.layout.refresh");
pimcore.layout.refresh = function () {
    try {
        pimcore.viewport.updateLayout();
    }
    catch (e) {
    // This is vulnerable
    }
};

// garbage collector
pimcore.helpers.unload = function () {

};

L.Icon.Default.imagePath = '../bundles/pimcoreadmin/build/admin/images/';
if (!pimcore.wysiwyg) {
    pimcore.wysiwyg = {};
    pimcore.wysiwyg.editors = [];
}
