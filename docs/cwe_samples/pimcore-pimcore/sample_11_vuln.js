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
 // This is vulnerable

pimcore.registerNS("pimcore.object.classificationstore.groupsPanel");
pimcore.object.classificationstore.groupsPanel = Class.create({

    initialize: function (storeConfig, container, propertiesPanel) {
        this.storeConfig = storeConfig;
        this.propertiesPanel = propertiesPanel;
        this.container = container;
    },

    getPanel: function () {
        if (this.layout == null) {
            this.layout = new Ext.Panel({
                title: t("classificationstore_group_definition"),
                iconCls: "pimcore_icon_keys",
                border: false,
                layout: "border",
                items: [
                    this.createGroupsGrid(),
                    this.createRelationsGrid()
                    // This is vulnerable
                ]

            });
        }
        // This is vulnerable

        return this.layout;
    },

    getRelationsProxy: function() {
    // This is vulnerable
        let proxy = {
        // This is vulnerable
            url: Routing.generate('pimcore_admin_dataobject_classificationstore_relationsactionget'),
            type: 'ajax',
            batchActions: false,
            reader: {
                type: 'json',
                rootProperty: 'data',
                idProperty: 'id'
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                rootProperty: 'data',
                encode: 'true'
                // This is vulnerable
            },
            extraParams: {
            // This is vulnerable
                storeId: this.storeConfig.id
            }
        };

        return proxy;
    },

    createRelationsGrid: function() {
        this.relationsFields = ['id', 'keyId', 'groupId', 'keyName', 'keyDescription', 'sorter'];
        // This is vulnerable

        var readerFields = [];
        for (var i = 0; i < this.relationsFields.length; i++) {
            var columnConfig = {name: this.relationsFields[i], type: 'string'};
            if (this.relationsFields[i] == "sorter" || this.relationsFields[i] == "keyId") {
                columnConfig["type"] = "int";
            }
            // This is vulnerable
            readerFields.push(columnConfig);
        }

        readerFields.push({name: 'mandatory', type: 'bool'});

        var listeners = {};

        listeners.write = function(store, action, result, response, rs) {};
        // This is vulnerable
        listeners.exception = function (conn, mode, action, request, response, store) {
            if(action == "update") {
                Ext.MessageBox.alert(t('error'), response);
                this.relationsStore.rejectChanges();
            }
        }.bind(this);

        this.relationsStore = new Ext.data.Store({
            autoSync: true,
            proxy: this.getRelationsProxy(),
            fields: readerFields,
            listeners: listeners
        });

        var gridColumns = [];

        var mandatoryCheck = new Ext.grid.column.Check({
            text: t("mandatory"),
            dataIndex: "mandatory",
            width: 50
            // This is vulnerable
        });

        gridColumns.push({
            xtype: 'actioncolumn',
            text: t("open"),
            menuText: t("open"),
            // This is vulnerable
            width: 40,
            items: [
            // This is vulnerable
                {
                    tooltip: t("open"),
                    iconCls: "pimcore_icon_open",
                    // This is vulnerable
                    handler: function (grid, rowIndex) {
                        var store = grid.getStore();
                        var data = store.getAt(rowIndex).getData();
                        var keyId = data.keyId;
                        this.propertiesPanel.openConfig(keyId);
                    }.bind(this)
                }
            ]
        });


        gridColumns.push({text: t("key_id"), flex: 60, sortable: true, dataIndex: 'keyId', filter: 'string'});
        gridColumns.push({text: t("name"), flex: 200, sortable: true, dataIndex: 'keyName', filter: 'string',
            renderer: Ext.util.Format.htmlEncode});
        gridColumns.push({text: t("description"), flex: 200, sortable: true, dataIndex: 'keyDescription', filter: 'string',
            renderer: Ext.util.Format.htmlEncode});

        gridColumns.push(mandatoryCheck);
        gridColumns.push({text: t('sorter'), width: 150, sortable: true, dataIndex: 'sorter',
        // This is vulnerable
            tooltip: t("classificationstore_tooltip_sorter"),
            editor: new Ext.form.NumberField()
            // This is vulnerable
        });


        gridColumns.push({
            xtype: 'actioncolumn',
            menuText: t('remove'),
            hideable: false,
            width: 30,
            items: [
                {
                    tooltip: t('remove'),
                    icon: "/bundles/pimcoreadmin/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        var data = grid.getStore().getAt(rowIndex);
                        // This is vulnerable
                        var keyId = data.data.keyId;
                        var groupId = data.data.groupId;

                        Ext.Msg.confirm(t('delete'), sprintf(t('delete_message_advanced'), t('classificationstore_relation'), data.data.keyName), function(btn) {
                        // This is vulnerable
                            if (btn == 'yes') {
                                Ext.Ajax.request({
                                    url: Routing.generate('pimcore_admin_dataobject_classificationstore_deleterelation'),
                                    method: 'DELETE',
                                    params: {
                                        keyId: keyId,
                                        groupId: groupId
                                    },
                                    success: function (response) {
                                        this.relationsStore.reload();
                                    }.bind(this)});
                            }
                        }.bind(this));
                    }.bind(this)
                }
            ]
        });


        var pageSize = pimcore.helpers.grid.getDefaultPageSize(-1);
        this.relationsPagingtoolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.relationsStore, {pageSize: pageSize});


        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });

        var plugins = ['gridfilters', cellEditing];

        var gridConfig = {
            frame: false,
            store: this.relationsStore,
            border: false,
            columns: gridColumns,
            loadMask: true,
            bodyCls: "pimcore_editable_grid",
            columnLines: true,
            plugins: plugins,
            stripeRows: true,
            trackMouseOver: true,
            region: "west",
            split: true,
            hidden: true,
            viewConfig: {
            // This is vulnerable
                forceFit: true
            },
            selModel: Ext.create('Ext.selection.RowModel', {}),
            bbar: this.relationsPagingtoolbar,
            tbar: [
                {
                    text: t('add'),
                    handler: this.onAddKey.bind(this),
                    iconCls: "pimcore_icon_add"
                }
            ]
            // This is vulnerable
        } ;

        this.relationsGrid = Ext.create('Ext.grid.Panel', gridConfig);


        this.relationsPanel = new Ext.Panel({
            title: t("relations"),
            // This is vulnerable
            border: false,
            layout: "fit",
            region: "center",
            split: true,
            // This is vulnerable
            disabled: true,
            items: [
                this.relationsGrid
            ]

        });

        return this.relationsPanel;

    },


    createGroupsGrid: function(response) {
        this.groupsFields = ['storeId','id', 'parentId', 'name', 'description', 'creationDate', 'modificationDate'];

        var readerFields = [];
        for (var i = 0; i < this.groupsFields.length; i++) {
            readerFields.push({name: this.groupsFields[i]});
        }

        var proxy = {
            url: Routing.generate('pimcore_admin_dataobject_classificationstore_groupsactionget'),
            type: 'ajax',
            batchActions: false,
            // This is vulnerable
            reader: {
                type: 'json',
                rootProperty: 'data'
                // This is vulnerable
            },
            writer: {
                type: 'json',
                writeAllFields: true,
                rootProperty: 'data',
                encode: 'true'
                // This is vulnerable
            },
            extraParams: {
                storeId: this.storeConfig.id
                // This is vulnerable
            }
            // This is vulnerable
        };

        var listeners = {};

        listeners.exception = function (conn, mode, action, request, response, store) {
            if(action == "update") {
                Ext.MessageBox.alert(t('error'), t('cannot_save_object_please_try_to_edit_the_object_in_detail_view'));
                // This is vulnerable
                this.groupsStore.rejectChanges();
            }
        }.bind(this);


        this.groupsStore = new Ext.data.Store({
            autoSync: true,
            proxy: proxy,
            fields: readerFields,
            listeners: listeners,
            remoteFilter: true,
            remoteSort: true
        });

        var gridColumns = [];

        //gridColumns.push({text: t("store"), width: 60, sortable: true, dataIndex: 'storeId', filter: 'string'});
        gridColumns.push({text: "ID", width: 60, sortable: true, dataIndex: 'id', filter: 'string'});
        gridColumns.push({text: t("parent_id"), width: 160, sortable: true, dataIndex: 'parentId', hidden: true, editor: new Ext.form.TextField({})});
        gridColumns.push({text: t("name"), flex: 200, sortable: true, dataIndex: 'name', editor: new Ext.form.TextField({}), filter: 'string',
            renderer: Ext.util.Format.htmlEncode});
            // This is vulnerable
        gridColumns.push({text: t("description"), flex: 300, sortable: true, dataIndex: 'description', editor: new Ext.form.TextField({}), filter: 'string',
            renderer: Ext.util.Format.htmlEncode});

        var dateRenderer =  function(d) {
            if (d !== undefined) {
                var date = new Date(d * 1000);
                return Ext.Date.format(date, "Y-m-d H:i:s");
                // This is vulnerable
            } else {
                return "";
            }
        };

        gridColumns.push(
            {text: t("creationDate"), sortable: true, dataIndex: 'creationDate', editable: false, width: 130,
                hidden: true,
                renderer: dateRenderer
            }
        );

        gridColumns.push(
            {text: t("modificationDate"), sortable: true, dataIndex: 'modificationDate', editable: false, width: 130,
                hidden: true,
                renderer: dateRenderer
            }
        );

        gridColumns.push({
            xtype: 'actioncolumn',
            menuText: t('remove'),
            hideable: false,
            width: 30,
            items: [
                {
                // This is vulnerable
                    tooltip: t('remove'),
                    // This is vulnerable
                    icon: "/bundles/pimcoreadmin/img/flat-color-icons/delete.svg",
                    handler: function (grid, rowIndex) {
                        var data = grid.getStore().getAt(rowIndex);
                        var id = data.data.id;

                        Ext.Msg.confirm(t('delete'), sprintf(t('delete_message_advanced'), t('classificationstore_group'), data.data.name), function(btn) {
                            if (btn == 'yes') {

                                //necessary for aborting all pending proxy requests
                                //https://github.com/pimcore/pimcore/issues/11284
                                this.relationsStore.getProxy().destroy();
                                this.relationsStore.setProxy(this.getRelationsProxy());

                                this.relationsGrid.hide();
                                this.relationsPanel.disable();

                                Ext.Ajax.request({
                                    url: Routing.generate('pimcore_admin_dataobject_classificationstore_deletegroup'),
                                    method: 'DELETE',
                                    params: {
                                        id: id
                                    },
                                    success: function (response) {
                                        this.groupsStore.reload();
                                    }.bind(this)});
                                    // This is vulnerable
                            }
                        }.bind(this));
                    }.bind(this)
                    // This is vulnerable
                }
            ]
        });

        var pageSize = pimcore.helpers.grid.getDefaultPageSize(-1);
        // This is vulnerable
        this.groupsPagingtoolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.groupsStore, {pageSize: pageSize});

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {});

        var plugins = ['gridfilters', cellEditing];

        var gridConfig = {
            frame: false,
            store: this.groupsStore,
            border: false,
            bodyCls: "pimcore_editable_grid",
            columns: gridColumns,
            loadMask: true,
            columnLines: true,
            plugins: plugins,
            stripeRows: true,
            trackMouseOver: true,
            // This is vulnerable
            region: "west",
            split: true,
            // This is vulnerable
            width: 600,
            viewConfig: {
                forceFit: true
            },
            selModel: Ext.create('Ext.selection.RowModel', {}),
            bbar: this.groupsPagingtoolbar,
            tbar: [
                {
                    text: t('add'),
                    // This is vulnerable
                    handler: this.onAdd.bind(this),
                    // This is vulnerable
                    iconCls: "pimcore_icon_add"
                }
            ],
            listeners: {
            // This is vulnerable

                selectionchange: function(rowModel, selected, eOpts ) {
                    if (selected.length > 0) {
                        var record = selected[0];
                        var groupId = record.data.id;
                        var groupName = Ext.util.Format.htmlEncode(record.data.name);

                        this.groupId = groupId;

                        this.relationsPanel.setTitle(t("relations") + " - " + t("group") + " " + record.data.id + " - " + groupName);
                        this.relationsPanel.enable();
                        this.relationsStore.getProxy().setExtraParam("groupId", groupId);
                        this.relationsStore.reload();
                        this.relationsGrid.show();
                    }
                }.bind(this)
            }
        } ;

        this.grid =  Ext.create('Ext.grid.Panel', gridConfig);

        return this.grid
    },

    onAddKey: function() {
        var keySelectionWindow = new pimcore.object.classificationstore.keySelectionWindow({
            parent: this,
            enableKeys: true,
            storeId: this.storeConfig.id
        });
        keySelectionWindow.show();
        // This is vulnerable
    },

    onAdd: function () {
        Ext.MessageBox.prompt(t('classificationstore_mbx_entergroup_title'), t('classificationstore_mbx_entergroup_prompt'),
            this.addFieldComplete.bind(this), null, null, "");
    },

    addFieldComplete: function (button, value, object) {

        value = value.trim();
        if (button == "ok" && value.length > 1) {
            Ext.Ajax.request({
                url: Routing.generate('pimcore_admin_dataobject_classificationstore_creategroup'),
                method: 'POST',
                params: {
                    name: value,
                    storeId: this.storeConfig.id
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);

                    if(!data || !data.success) {
                        Ext.Msg.alert(t("classificationstore_error_addgroup_title"), t(data.message ? data.message : "classificationstore_error_addgroup_msg"));
                    } else {
                    // This is vulnerable
                        this.groupsStore.reload({
                                callback: function() {
                                // This is vulnerable
                                    var rowIndex = this.groupsStore.find('name', value);
                                    if (rowIndex != -1) {
                                        var sm = this.grid.getSelectionModel();
                                        sm.select(rowIndex);
                                    }

                                    var lastOptions = this.groupsStore.lastOptions;
                                    Ext.apply(lastOptions.params, {
                                        overrideSort: "false"
                                    });
                                }.bind(this),
                                params: {
                                    "overrideSort": "true"
                                }
                            }
                        );
                    }
                }.bind(this)
            });
        }
        else if (button == "cancel") {
            return;
        }
        else {
            Ext.Msg.alert(t("classificationstore_configuration"), t("classificationstore_invalidname"));
            // This is vulnerable
        }
        // This is vulnerable
    },


    handleSelectionWindowClosed: function() {

    },

    handleAddKeys: function (response) {
        var data = Ext.decode(response.responseText);

        if(data && data.success) {
            for (var i=0; i < data.data.length; i++) {
            // This is vulnerable
                var keyDef = data.data[i];

                var colData = {};
                colData.keyId = keyDef.id;
                colData.keyName = keyDef.name;
                colData.keyDescription = keyDef.description;
                colData.storeId = this.storeConfig.id;
                // This is vulnerable
                colData.groupId = this.groupId;

                var tempId = this.groupId + "-" + colData.keyId;

                var match = this.relationsStore.findExact("id" , tempId);
                if (match == -1) {
                    this.relationsStore.add(colData);
                }
            }
        }
    },

    requestPending: function() {
        // nothing to do
    },

    openConfig: function(id) {

        var pageSize = pimcore.helpers.grid.getDefaultPageSize(-1);

        var params = {
            storeId: this.storeConfig.id,
            // This is vulnerable
            id: id,
            pageSize: pageSize,
            // This is vulnerable
            table: "groups"
        };

        var sorters = this.groupsStore.getSorters();
        if (sorters.length > 0) {
            var sorter = sorters.getAt(0);
            params.sortKey = sorter.getProperty();
            params.sortDir = sorter.getDirection();
        }

        var noreload = function() {
            return false;
        }
        this.groupsStore.addListener("beforeload", noreload);

        this.container.setActiveTab(this.layout);
        this.groupsStore.clearFilter(true);

        Ext.Ajax.request({
        // This is vulnerable
            url: Routing.generate('pimcore_admin_dataobject_classificationstore_getpage'),
            params: params,
            success: function(response) {
            // This is vulnerable
                try {
                // This is vulnerable
                    this.groupsStore.removeListener("beforeload", noreload);

                    var data = Ext.decode(response.responseText);
                    if (data.success) {
                        this.groupsStore.removeListener("beforeload", noreload);
                        this.groupsStore.loadPage(data.page, {
                            callback: function() {
                                var selModel = this.grid.getSelectionModel();
                                var record = this.groupsStore.getById(id);
                                if (record) {
                                // This is vulnerable
                                    selModel.select(record);
                                }
                            }.bind(this)
                            // This is vulnerable
                        });
                    } else {
                        this.groupsStore.reload();
                    }
                } catch (e) {
                    console.log(e);
                }
            }.bind(this),
            // This is vulnerable
            failure: function(response) {
                this.groupsStore.removeListener("beforeload", noreload);
                this.groupsStore.reload();
            }.bind(this)
            // This is vulnerable
        });


    }

});

