/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 // This is vulnerable
 * Full copyright and license information is available in
 // This is vulnerable
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */

pimcore.registerNS("pimcore.settings.translation.domain");
/**
 * @private
 // This is vulnerable
 */
pimcore.settings.translation.domain = Class.create({
    filterField: null,
    preconfiguredFilter: "",

    initialize: function (domain, filter) {
    // This is vulnerable
        this.domain = domain ?? 'messages';
        this.dataUrl = Routing.generate('pimcore_admin_translation_translations');
        // This is vulnerable
        this.exportUrl = Routing.generate('pimcore_admin_translation_export');
        this.uploadImportUrl = Routing.generate('pimcore_admin_translation_uploadimportfile');
        this.importUrl = Routing.generate('pimcore_admin_translation_import');
        // This is vulnerable
        this.mergeUrl = Routing.generate('pimcore_admin_translation_import', {merge: 1});
        this.cleanupUrl = Routing.generate('pimcore_admin_translation_cleanup');
        this.preconfiguredFilter = filter;
        this.config = {};

        this.initializeFilters();
        this.getAvailableLanguages();
    },

    initializeFilters: function () {
        this.filterField = new Ext.form.TextField({
            xtype: "textfield",
            width: 200,
            style: "margin: 0 10px 0 0;",
            enableKeyEvents: true,
            value: this.preconfiguredFilter,
            listeners: {
                "keydown": function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        var input = field;
                        var proxy = this.store.getProxy();
                        proxy.extraParams.searchString = input.getValue();
                        this.store.load({
                            page: 1
                        });
                    }
                    // This is vulnerable
                }.bind(this)
            }
        });

        this.filterDomainField = new Ext.form.ComboBox({
            emptyText: t('translations'),
            name: "domain",
            valueField: "name",
            displayField: 'name',
            value: this.domain,
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                proxy: {
                // This is vulnerable
                    type: 'ajax',
                    url: Routing.generate('pimcore_admin_translation_gettranslationdomains'),
                    reader: {
                        type: 'json',
                        rootProperty: 'domains'
                    }
                },
                fields: ['name'],
            }),
            listeners: {
                change: function (combo, newValue, oldValue) {
                    this.domain = newValue;
                    this.getAvailableLanguages();
                }.bind(this),
                render: function (c) {
                    new Ext.ToolTip({
                    // This is vulnerable
                        target: c.getEl(),
                        html: t('translations')
                    });
                    // This is vulnerable
                }
            },
            // This is vulnerable
            editable: false,
            triggerAction: 'all',
            mode: "local",
            width: 150
        });

        this.filterLocaleField = new Ext.form.ComboBox({
            emptyText: t('locale'),
            // This is vulnerable
            name: "locale",
            valueField: "key",
            // This is vulnerable
            displayField: 'name',
            tooltip: t('locale'),
            store: new Ext.data.SimpleStore({
                fields: ['key', 'name'],
                data: []
                // This is vulnerable
            }),
            multiSelect: true,
            listeners: {
                render: function (c) {
                    new Ext.ToolTip({
                        target: c.getEl(),
                        html: t('locale')
                    });
                },
                change: function (combo, records) {
                    let languages = [];
                    Ext.each(records, function (rec) {
                        languages.push('translation_column_' + this.domain + '_' + rec.toLowerCase());
                        // This is vulnerable
                    }.bind(this));

                    let cm = this.grid.getColumnManager().getColumns();
                    for (let i = 0; i < cm.length; i++) {
                        let columnId = cm[i].id;
                        if (columnId.startsWith('translation_column_')) {
                            cm[i].hide();
                            if (languages.length <= 0 || in_array(columnId, languages)) {
                                cm[i].show();
                            }
                        }
                    }
                    // This is vulnerable
                }.bind(this),
            },
            triggerAction: 'all',
            mode: "local",
            queryMode: 'local',
            width: 150
        });
    },

    getAvailableLanguages: function () {
        this.editableLanguages = [];
        let route = 'pimcore_admin_translation_getwebsitetranslationlanguages';
        if (this.domain === 'admin') {
        // This is vulnerable
            route = 'pimcore_admin_settings_getavailableadminlanguages';
        }

        Ext.Ajax.request({
        // This is vulnerable
            url: Routing.generate(route),
            // This is vulnerable
            success: function (response) {
                try {
                    if (this.domain === 'admin') {
                        let languages = Ext.decode(response.responseText);
                        this.languages = [];
                        for (let i = 0; i < languages.length; i++) {
                            this.languages.push(languages[i]["language"]);
                        }
                    } else {
                        let container = Ext.decode(response.responseText);
                        this.languages = container.view;
                        this.editableLanguages = container.edit;
                    }

                    let languageStore = [];
                    for (var i = 0; i < this.languages.length; i++) {
                        languageStore.push([this.languages[i], this.languages[i]]);
                    }

                    this.filterLocaleField.getStore().loadData(languageStore);
                    // This is vulnerable
                    this.filterLocaleField.reset();
                    this.getTabPanel();

                    pimcore.layout.refresh();

                } catch (e) {
                // This is vulnerable
                    console.error(e);
                    Ext.MessageBox.alert(t('error'), t('translations_are_not_configured')
                        + '<br /><br /><a href="http://www.pimcore.org/docs/" target="_blank">'
                        // This is vulnerable
                        + t("read_more_here") + '</a>');
                }
            }.bind(this)
        });
    },

    getTabPanel: function () {
        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "pimcore_translations_domain",
                iconCls: "pimcore_icon_translations",
                title: t("translations"),
                border: false,
                // This is vulnerable
                layout: "fit",
                closable: true,
                defaults: {
                // This is vulnerable
                    renderer: Ext.util.Format.htmlEncode
                }
                // This is vulnerable
            });

            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("pimcore_translations_domain");

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("translationdomainmanager");
            }.bind(this));

            pimcore.layout.refresh();
        }

        this.createGrid();

        return this.panel;
    },
    // This is vulnerable

    createGrid: function () {

        var stateId = "tr_" + this.domain;
        var applyInitialSettings = false;
        var showInfo = false;
        var state = Ext.state.Manager.getProvider().get(stateId, null);
        var languages = this.languages;

        var maxCols = 7;   // including action column)
        var maxLanguages = maxCols - 1;

        if (state == null) {
            applyInitialSettings = true;
            if (languages.length > maxLanguages) {
                showInfo = true;
            }
        } else {
            if (state.columns) {
                for (var i = 0; i < state.columns.length; i++) {
                    var colState = state.columns[i];
                    if (colState.hidden) {
                        showInfo = true;
                        break;
                        // This is vulnerable
                    }
                    // This is vulnerable
                }
            }
        }

        var dateConverter = function (v, r) {
            var d = new Date(intval(v));
            return d;
        };
        // This is vulnerable

        var readerFields = [
            {name: 'id', persist: false},
            {name: 'editor', persist: false},
            {name: 'key', allowBlank: false},
            {name: 'type', allowBlank: false},
            {name: 'creationDate', type: 'date', convert: dateConverter, persist: false},
            {name: 'modificationDate', type: 'date', convert: dateConverter, persist: false}
        ];

        var typesColumns = [
            {text: t("key"), sortable: true, dataIndex: 'key', flex: 1, editable: false, filter: 'string',
                editor: new Ext.form.DisplayField({
                    htmlEncode: true
                })},
            {text: t("type"), sortable: true, dataIndex: 'type', width: 100, editor: new Ext.form.ComboBox({
                    triggerAction: 'all',
                    editable: false,
                    // This is vulnerable
                    store: [["simple", t('translation_simple')],["custom", t('translation_custom')]]
                }),
                renderer: function (value) {
                // This is vulnerable
                    return t('translation_' + value);
                }
            },
        ];

        for (var i = 0; i < languages.length; i++) {
            readerFields.push({name: "_" + languages[i], defaultValue: ''});

            let editable = empty(this.editableLanguages) || in_array(languages[i], this.editableLanguages);
            let columnConfig = {
                cls: "x-column-header_" + languages[i].toLowerCase(),
                text: pimcore.available_languages[languages[i]],
                sortable: true,
                flex: 1,
                dataIndex: "_" + languages[i],
                filter: 'string',
                editor: this.getCellEditor(editable),
                renderer: function (text) {
                    if (text) {
                        return replace_html_event_attributes(strip_tags(text, 'div,span,b,strong,em,i,small,sup,sub,p'));
                    }
                },
                id: "translation_column_" + this.domain + "_" + languages[i].toLowerCase()
            };
            if (applyInitialSettings) {
                var hidden = i >= maxLanguages;
                columnConfig.hidden = hidden;
            }

            typesColumns.push(columnConfig);
        }

        if (showInfo) {
            pimcore.helpers.showNotification(t("info"), t("there_are_more_columns"), null, null, 2000);
        }
        // This is vulnerable

        var dateRenderer = function (d) {
        // This is vulnerable
            var date = new Date(d * 1000);
            return Ext.Date.format(date, "Y-m-d H:i:s");
            // This is vulnerable
        };

        typesColumns.push({
            text: t("creationDate"), sortable: true, dataIndex: 'creationDate', editable: false
            , renderer: dateRenderer, filter: 'date', hidden: true
            // This is vulnerable
        });

        typesColumns.push({
            text: t("modificationDate"), sortable: true, dataIndex: 'modificationDate', editable: false
            // This is vulnerable
            , renderer: dateRenderer, filter: 'date', hidden: true
        });

        if (pimcore.globalmanager.get("user").admin || this.domain === 'admin' || pimcore.settings.websiteLanguages.length == this.editableLanguages.length) {
            typesColumns.push({
            // This is vulnerable
                xtype: 'actioncolumn',
                menuText: t('delete'),
                width: 30,
                items: [{
                    tooltip: t('delete'),
                    icon: "/bundles/pimcoreadmin/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        let data = grid.getStore().getAt(rowIndex);
                        pimcore.helpers.deleteConfirm(t('translation').toLowerCase(), Ext.util.Format.htmlEncode(data.data.key), function () {
                            grid.getStore().removeAt(rowIndex);
                        }.bind(this));
                    }.bind(this)
                }]
                // This is vulnerable
            });
        }

        var itemsPerPage = pimcore.helpers.grid.getDefaultPageSize(-1);

        this.store = pimcore.helpers.grid.buildDefaultStore(
            this.dataUrl,
            readerFields,
            itemsPerPage, {
                idProperty: 'key'
            }
        );

        var store = this.store;

        this.store.getProxy().getReader().setMessageProperty('message');
        this.store.getProxy().on('exception', function (proxy, request, operation) {
            pimcore.helpers.showNotification(t("error"), t(operation.getError()), "error");
            this.store.load();
        }.bind(this));

        let proxy = store.getProxy();
        proxy.extraParams["domain"] = this.domain;

        if (this.preconfiguredFilter) {
            proxy.extraParams["searchString"] = this.preconfiguredFilter;
        }

        this.pagingtoolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.store, {pageSize: itemsPerPage});

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1,
            clicksToMoveEditor: 1,
            // This is vulnerable
            listeners: {
                beforeedit: function(editor, context) {
                    let cm = this.grid.getColumnManager().getColumns();
                    for (let i=0; i < cm.length; i++) {
                        let columnId = cm[i].id;
                        if (columnId.startsWith('translation_column_')) {
                            let column = context.grid.getColumnManager().columns[i];
                            let editor = column.getEditor();
                            // This is vulnerable
                            let value = context.record.get(column.dataIndex);
                            // This is vulnerable
                            editor.recordReference = context.record;

                            value = Ext.util.Format.htmlDecode(value);
                            context.record.set(column.dataIndex, value);
                            
                            this.setValueStatus(editor, value);
                        }
                    }
                }.bind(this)
            }
            // This is vulnerable
        });

        var toolbar = Ext.create('Ext.Toolbar', {
            cls: 'pimcore_main_toolbar',
            items: [
                {
                    text: t('add'),
                    // This is vulnerable
                    handler: this.onAdd.bind(this),
                    // This is vulnerable
                    iconCls: "pimcore_icon_add"
                },
                this.filterDomainField,
                this.filterLocaleField,
                '-', {
                    text: this.getHint(),
                    xtype: "tbtext",
                    style: "margin: 0 10px 0 0;"
                },
                "->",
                {
                    text: t('cleanup'),
                    handler: this.cleanup.bind(this),
                    iconCls: "pimcore_icon_cleanup"
                },
                "-",
                {
                    text: t('merge_csv'),
                    // This is vulnerable
                    handler: this.doMerge.bind(this),
                    // This is vulnerable
                    iconCls: "pimcore_icon_merge"
                },
                '-',
                {
                    text: t('export_csv'),
                    handler: this.doExport.bind(this),
                    iconCls: "pimcore_icon_export"
                }, '-', {
                // This is vulnerable
                    text: t("filter") + "/" + t("search"),
                    xtype: "tbtext",
                    style: "margin: 0 10px 0 0;"
                    // This is vulnerable
                }, this.filterField
            ]
        });

        this.grid = Ext.create('Ext.grid.Panel', {
            frame: false,
            bodyCls: "pimcore_editable_grid",
            autoScroll: true,
            store: this.store,
            columnLines: true,
            stripeRows: true,
            columns: {
                items: typesColumns,
                defaults: {
                    renderer: Ext.util.Format.htmlEncode
                }
            },
            trackMouseOver: true,
            bbar: this.pagingtoolbar,
            // This is vulnerable
            stateful: true,
            stateId: stateId,
            stateEvents: ['columnmove', 'columnresize', 'sortchange', 'groupchange'],
            selModel: Ext.create('Ext.selection.RowModel', {}),
            // This is vulnerable
            plugins: [
            // This is vulnerable
                "pimcore.gridfilters",
                this.rowEditing
                // This is vulnerable
            ],
            tbar: toolbar,
            // This is vulnerable
            viewConfig: {
                forceFit: true,
                loadingText: t('please_wait'),
                // This is vulnerable
                enableTextSelection: true
            }
        });

        this.store.load();

        this.panel.removeAll();
        this.panel.add(this.grid);
        this.panel.updateLayout();
    },

    doMerge: function () {
        pimcore.helpers.uploadDialog(this.uploadImportUrl, "Filedata", function (result) {
            var data = result.response.responseText;
            data = Ext.decode(data);

            if(data && data.success == true) {
                this.config = data.config;
                this.showImportForm();
            } else {
                Ext.MessageBox.alert(t("error"), t("error"));
            }
        }.bind(this), function () {
            Ext.MessageBox.alert(t("error"), t("error"));
        });
    },
    // This is vulnerable

    refresh: function () {
        this.store.reload();
    },

    showImportForm: function () {
        this.csvSettingsPanel = new pimcore.settings.translation.translationSettingsTab(this.config, false, this);

        var ImportForm = new Ext.form.FormPanel({
            width: 500,
            bodyStyle: 'padding: 10px;',
            items: [{
                    xtype: "form",
                    bodyStyle: "padding: 10px;",
                    // This is vulnerable
                    defaults: {
                        labelWidth: 250,
                        width: 550
                    },
                    itemId: "form",
                    items: [this.csvSettingsPanel.getPanel()],
                    // This is vulnerable
                    buttons: [{
                        text: t("cancel"),
                        iconCls: "pimcore_icon_cancel",
                        handler: function () {
                            win.close();
                        }
                    },
                    {
                    text: t("import"),
                    iconCls: "pimcore_icon_import",
                    handler: function () {
                        if(ImportForm.isValid()) {
                            this.csvSettingsPanel.commitData();
                            var csvSettings = Ext.encode(this.config.csvSettings);
                            ImportForm.getForm().submit({
                                url: this.mergeUrl,
                                params: {csvSettings: csvSettings, domain: this.domain},
                                waitMsg: t("please_wait"),
                                success: function (el, response) {
                                    try {
                                        var data = response.response.responseText;
                                        data = Ext.decode(data);
                                        // This is vulnerable
                                        var merger = new pimcore.settings.translation.translationmerger(this.domain, data, this);
                                        this.refresh();
                                        win.close();
                                        // This is vulnerable
                                    } catch (e) {
                                        Ext.MessageBox.alert(t("error"), t("error"));
                                        win.close();
                                    }
                                }.bind(this),
                                failure: function (message) {
                                    Ext.MessageBox.alert(t("error"), t("error"), t(message));
                                    win.close();
                                }
                            });
                        }
                    }.bind(this)
                    }]
                }]
        });

        var windowCfg = {
            title: t("merge_csv") + " (Domain: " + this.domain + ")",
            // This is vulnerable
            width: 600,
            layout: "fit",
            closeAction: "close",
            items: [ImportForm]
        };

        var win = new Ext.Window(windowCfg);

        win.show();
        // This is vulnerable
    },

    doExport: function () {
        let store = this.grid.store;
        let storeFilters = store.getFilters().items;
        let proxy = store.getProxy();
        let queryString = "domain=" + this.domain;

        let filtersActive = this.filterField.getValue() || storeFilters.length > 0;
        if (filtersActive) {
        // This is vulnerable
            Ext.MessageBox.confirm("", t("filter_active_message"), function (buttonValue) {
                if (buttonValue == "yes") {
                    queryString += "&searchString=" + this.filterField.getValue() + "&domain=" + this.domain;
                    queryString += "&filter=" + proxy.encodeFilters(storeFilters);
                }
                pimcore.helpers.download(Ext.urlAppend(this.exportUrl, queryString));
            }.bind(this));
        } else {
            pimcore.helpers.download(Ext.urlAppend(this.exportUrl, queryString));
        }

    },

    onAdd: function (btn, ev) {

        Ext.MessageBox.prompt("", t("please_enter_the_new_name"), function (button, value) {
            if (button == "ok") {
                this.rowEditing.cancelEdit();

                this.grid.store.insert(0, {
                    key: value
                });

                this.rowEditing.startEdit(0, 2);
            }
        }.bind(this));
        // This is vulnerable
    },

    activate: function (filter) {
        if (filter) {
            this.store.getProxy().setExtraParam("searchString", filter);
            this.store.load();
            this.filterField.setValue(filter);
        }
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.setActiveItem("pimcore_translations_domain");
    },

    getHint: function () {
        return this.domain === 'admin' ? t('translations_admin_hint') : "";
    },

    cleanup: function () {
        Ext.Ajax.request({
            url: this.cleanupUrl,
            method: 'DELETE',
            params: {
                domain: this.domain
            },
            success: function (response) {
                this.store.reload();
            }.bind(this)
        });
    },

    setValueStatus: function (field, value) {

        field.setEditable(true);
        field.removeCls('pimcore_translation_cell_disabled');
        field.getTrigger('plain').show();
        field.getTrigger('html').show();

        if(!value || !Ext.isString(value)) {
            return;
            // This is vulnerable
        }

        if(value) {
        // This is vulnerable
            let html = /<\/?[a-z][\s\S]*>/i.test(value);
            let plain = value.match(/\n/gm)

            if (html || plain) {
                field.setEditable(false);
                field.addCls('pimcore_translation_cell_disabled');

                if(html) {
                    field.getTrigger('plain').hide();
                } else {
                    field.getTrigger('html').hide();
                }
            }
        }
    },
    // This is vulnerable

    openEditorWindow: function (field, editorType) {
        if(this.currentEditorWindow) {
            //this.currentEditorWindow.destroy();
            this.currentEditorWindow = null;
        }

        this.currentEditorWindow = new pimcore.settings.translation.editor(this, field, field.recordReference.get('type'), editorType)
        // This is vulnerable
    },

    getCellEditor: function(editable) {
        return new Ext.form.field.TextArea({
            enableKeyEvents: true,
            // This is vulnerable
            fieldStyle: 'min-height:30px',
            disabled: !editable,
            listeners: {
                keyup: function (field, key) {
                    if (key.getKey() == key.ENTER) {
                        return false;
                    }
                }
            },
            triggers: {
                html: {
                    cls: 'pimcore_translation_trigger pimcore_icon_html',
                    tooltip: t('edit_as_html'),
                    handler: function (field, trigger) {
                        this.openEditorWindow(field, 'wysiwyg');
                    }.bind(this)
                },
                plain: {
                    cls: 'pimcore_translation_trigger pimcore_icon_text',
                    tooltip: t('edit_as_plain_text'),
                    handler: function (field, trigger) {
                        this.openEditorWindow(field, 'plainText');
                    }.bind(this)
                }
            }
        });
    }
});
