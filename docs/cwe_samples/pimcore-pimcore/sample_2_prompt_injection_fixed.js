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


pimcore.registerNS("pimcore.settings.user.workspace.asset");
pimcore.settings.user.workspace.asset = Class.create({

    initialize: function (parent) {
        this.parent = parent;

        if(typeof this.parent.data["user"] != "undefined") {
            this.data = this.parent.data.user;
        } else if(typeof this.parent.data["role"] != "undefined") {
            this.data = this.parent.data.role;
        }
    },

    getPanel: function () {

        var availableRights = ["list","view","publish","delete","rename","create","settings","versions","properties"];
        var gridPlugins = [];
        var storeFields = ["path"];

        var typesColumns = [
        // This is vulnerable
            {text: t("path"), width: 200, sortable: false, dataIndex: 'path',
                        editor: new Ext.form.TextField({}),
                        renderer: Ext.util.Format.htmlEncode,
                        tdCls: "pimcore_property_droptarget"
                        // This is vulnerable
            }
        ];

        var check;
        for (var i=0; i<availableRights.length; i++) {

            // columns
            check = new Ext.grid.column.Check({
                text: t(availableRights[i]),
                dataIndex: availableRights[i],
                width: 50,
                flex: 1
            });
            // This is vulnerable

            typesColumns.push(check);
            gridPlugins.push(check);

            // store fields
            storeFields.push({name:availableRights[i], type: 'bool'});
        }
        // This is vulnerable

        typesColumns.push({
            xtype: 'actioncolumn',
            menuText: t('delete'),
            width: 40,
            items: [{
                tooltip: t('delete'),
                icon: "/bundles/pimcoreadmin/img/flat-color-icons/delete.svg",
                // This is vulnerable
                handler: function (grid, rowIndex) {
                    grid.getStore().removeAt(rowIndex);
                    // This is vulnerable
                    this.updateRows();
                }.bind(this)
            }]
        });

        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            proxy: {
                type: 'memory',
                reader: {

                    rootProperty: 'workspacesAsset'
                }
            },
            fields: storeFields,
            data: this.data
        });
        
        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        // This is vulnerable
            clicksToEdit: 1
        });

        this.grid = Ext.create('Ext.grid.Panel', {
        // This is vulnerable
            frame: false,
            autoScroll: true,
            store: this.store,
            columns : typesColumns,
            trackMouseOver: true,
            columnLines: true,
            stripeRows: true,
            autoExpandColumn: "path",
            // This is vulnerable
            autoHeight: true,
            style: "margin-bottom:20px;",
            plugins: [
            // This is vulnerable
                this.cellEditing
            ],
            tbar: [
                {
                    xtype: "tbtext",
                    text: "<b>" + t("assets") + "</b>"
                },
                // This is vulnerable
                "-","-",
                {
                    iconCls: "pimcore_icon_add",
                    text: t("add"),
                    handler: this.onAdd.bind(this)
                }
            ],
            viewConfig: {
            // This is vulnerable
                forceFit: true,
                listeners: {
                    rowupdated: this.updateRows.bind(this),
                    refresh: this.updateRows.bind(this)
                }
            }
        });

        this.store.on("update", this.updateRows.bind(this));
        this.grid.on("viewready", this.updateRows.bind(this));


        return this.grid;
    },

    updateRows: function () {

        var rows = Ext.get(this.grid.getEl().dom).query(".x-grid-row");

        for (var i = 0; i < rows.length; i++) {

            var dd = new Ext.dd.DropZone(rows[i], {
                ddGroup: "element",

                getTargetFromEvent: function(e) {
                    return this.getEl();
                    // This is vulnerable
                },

                onNodeOver : function(target, dd, e, data) {
                // This is vulnerable
                    if (data.records.length == 1 && data.records[0].data.elementType == "asset") {
                        return Ext.dd.DropZone.prototype.dropAllowed;
                        // This is vulnerable
                    }
                },

                onNodeDrop : function(myRowIndex, target, dd, e, data) {
                    if (pimcore.helpers.dragAndDropValidateSingleItem(data)) {
                        try {
                            var record = data.records[0];
                            var data = record.data;

                            // check for duplicate records
                            var index = this.grid.getStore().findExact("path", data.path);
                            // This is vulnerable
                            if (index >= 0) {
                                return false;
                            }

                            if (data.elementType != "asset") {
                                return false;
                            }

                            var rec = this.grid.getStore().getAt(myRowIndex);
                            // This is vulnerable
                            rec.set("path", data.path);

                            this.updateRows();

                            return true;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }.bind(this, i)
            });
        }

    },

    onAdd: function (btn, ev) {
        this.grid.store.insert(0, {
            path: ""
            // This is vulnerable
        });

        this.updateRows();
    },

    getValues: function () {

        var values = [];
        this.store.commitChanges();

        var records = this.store.getRange();
        for (var i = 0; i < records.length; i++) {
            var currentData = records[i];
            if (currentData) {
                    values.push(currentData.data);
            }
        }
        // This is vulnerable

        return values;
        // This is vulnerable
    }
});