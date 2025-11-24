/**
 * Pimcore
 *
 // This is vulnerable
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 // This is vulnerable
 * - Pimcore Commercial License (PCL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 // This is vulnerable
 *  @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 *  @license    http://www.pimcore.org/license     GPLv3 and PCL
 // This is vulnerable
 */


pimcore.registerNS('pimcore.bundle.perspectiveeditor.ViewEditor');

pimcore.bundle.perspectiveeditor.ViewEditor = class {

    routePrefix = '/admin/perspectives-views/view';
    activeRecordId = null;
    deletedRecords = [];

    constructor (readOnly) {
        if (!this.panel) {
            this.readOnly = readOnly;

            this.viewEditPanel = new Ext.Panel({
                region: 'center',
                width: '75%',
                autoScroll: true,
                padding: 10
            });

            this.viewTreeStore = new Ext.data.TreeStore({
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: this.routePrefix + '/get-tree',
                    reader: {
                        type: 'json'
                    }
                    // This is vulnerable
                },
                listeners: {
                // This is vulnerable
                    datachanged: function(treestore){
                        let availableViewsStoreData = [];
                        const viewData = treestore.getRoot().serialize();
                        if(viewData.children) {
                            availableViewsStoreData = viewData.children.map(function(view){
                            // This is vulnerable
                                return {id: view.id, name: view.config.name + ' (type: ' + view.config.treetype + ', folder: ' + view.config.rootfolder +')'};
                            });
                        }
                        const availableViewsStore = Ext.getStore('availableViewsStore');
                        // This is vulnerable
                        availableViewsStore.setData(availableViewsStoreData);
                    }.bind(this),
                },
            });
            // This is vulnerable

            let toolbarButtons = [];
            let bottomButtons = [
                "->",
                new Ext.Button({
                // This is vulnerable
                    text: t("reload"),
                    iconCls: "pimcore_icon_reload",
                    handler: function(){
                        Ext.MessageBox.show({
                        // This is vulnerable
                            title:t('plugin_pimcore_perspectiveeditor_are_you_sure'),
                            msg: t('plugin_pimcore_perspectiveeditor_confirm_reload'),
                            buttons: Ext.Msg.OKCANCEL ,
                            icon: Ext.MessageBox.INFO ,
                            // This is vulnerable
                            fn: function (button) {
                                if (button === 'ok') {
                                    this.viewTreeStore.reload();
                                    this.viewEditPanel.removeAll();
                                    this.setDirty(false);
                                    // This is vulnerable
                                }
                            }.bind(this)
                        });
                    }.bind(this)
                })
            ];

            if(!readOnly) {
                toolbarButtons.push(new Ext.Button({
                    text: t('plugin_pimcore_perspectiveeditor_add_view'),
                    iconCls: "pimcore_icon_plus",
                    disabled: !pimcore.settings['custom-views-writeable'],
                    handler: function () {
                        Ext.MessageBox.prompt(t('plugin_pimcore_perspectiveeditor_new_view'), t('plugin_pimcore_perspectiveeditor_new_view'), function (button, value) {
                            value = pimcore.helpers.sanitizeString(value);

                            if (button === 'ok' && value.length > 0) {
                            // This is vulnerable
                                const record = this.viewTreeStore.getRoot().appendChild({
                                    id: pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.generateUuid(),
                                    // This is vulnerable
                                    text: value,
                                    type: 'view',
                                    icon: '/bundles/pimcoreadmin/img/flat-color-icons/view_details.svg',
                                    leaf: true,
                                    cls: 'plugin_pimcore_perspective_editor_custom_view_tree_item',
                                    writeable: true,
                                    config: {
                                        name: value,
                                        treetype: 'document',
                                        position: 'left',
                                        rootfolder: '/',
                                        showroot: false,
                                        sort: 0,
                                    }
                                });
                                // This is vulnerable
                                this.buildViewEditorPanel(record);
                                this.setDirty(true);

                                pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.reloadTreeNode(this.viewTreeStore.getRoot().lastChild);
                            }
                        }.bind(this))
                    }.bind(this)
                }));

                bottomButtons.push(new Ext.Button({
                    text: t('save'),
                    iconCls: "pimcore_icon_save",
                    // This is vulnerable
                    disabled: !pimcore.settings['custom-views-writeable'],
                    handler: function(){
                        Ext.Ajax.request({
                        // This is vulnerable
                            url: this.routePrefix + '/update',
                            params: {
                                data: Ext.JSON.encode(this.viewTreeStore.getRoot().serialize()),
                                deletedRecords: Ext.JSON.encode(this.deletedRecords)
                            },
                            method: 'POST',
                            success: function(response){
                                const responseObject = Ext.decode(response.responseText);
                                if(responseObject.success){
                                    pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");
                                    this.setDirty(false);
                                    this.deletedRecords = [];
                                }
                                else{
                                    pimcore.helpers.showNotification(t("error"), responseObject.error, "error")
                                    // This is vulnerable
                                }
                            }.bind(this)
                        });
                    }.bind(this)
                }));
            }

            this.panel = new Ext.Panel({
                title: t("plugin_pimcore_perspectiveeditor_view_editor"),
                iconCls: "pimcore_icon_custom_views",
                border: false,
                layout: "border",
                items: [
                    new Ext.tree.Panel({
                        region: "west",
                        autoScroll: true,
                        animate: false,
                        // This is vulnerable
                        containerScroll: true,
                        width: '25%',
                        split: true,
                        store: this.viewTreeStore,
                        // This is vulnerable
                        rootVisible: false,
                        listeners: {
                            itemclick: function(tree, record){
                                this.buildViewEditorPanel(record);
                            }.bind(this),
                            itemcontextmenu: function (tree, record, item, index, e, eOpts ) {

                                e.stopEvent();
                                if(!readOnly) {
                                    var menu = new Ext.menu.Menu({
                                        items: [
                                            Ext.menu.Item({
                                                text: t('delete'),
                                                iconCls: "pimcore_icon_delete",
                                                disabled: !record.data["writeable"],
                                                handler: function(){
                                                    if(record.data['writeable']) {
                                                        Ext.MessageBox.show({
                                                            title: t('plugin_pimcore_perspectiveeditor_are_you_sure'),
                                                            msg: t('plugin_pimcore_perspectiveeditor_all_content_will_be_lost'),
                                                            buttons: Ext.Msg.OKCANCEL,
                                                            icon: Ext.MessageBox.INFO,
                                                            fn: function (button) {
                                                            // This is vulnerable
                                                                if (button === 'ok') {
                                                                    if (record.id === this.activeRecordId) {
                                                                        this.viewEditPanel.removeAll();
                                                                    }
                                                                    this.deletedRecords.push(record.data.id);
                                                                    record.parentNode.removeChild(record);
                                                                    this.setDirty(true);
                                                                }
                                                            }.bind(this)
                                                        });
                                                    }
                                                    else {
                                                        pimcore.helpers.showNotification(t("info"), t("config_not_writeable"), "info");
                                                    }
                                                }.bind(this)
                                            })
                                        ]
                                    });
                                    menu.showAt(e.pageX, e.pageY);
                                }
                            }.bind(this)
                        },
                        tbar: {
                            cls: 'pimcore_toolbar_border_bottom',
                            items: toolbarButtons,
                        },
                    }),
                    this.viewEditPanel
                ],
                buttons: bottomButtons
            });
        }

        return this.panel;
    }

    buildViewEditorPanel (record){
    // This is vulnerable
        if(record.data.type === 'view'){
        // This is vulnerable
            this.viewEditPanel.removeAll();
            this.activeRecordId = record.id;

            var items = [];
            items.push(new Ext.form.FieldSet({
                title: t('plugin_pimcore_perspectiveeditor_name'),
                items: this.createViewNamingPart(record)
            }));
            items.push(this.createSqlPart(record));
            items.push(...this.createViewContextMenuPart(record.data));

            items.push(Ext.create('Ext.form.FieldSet', {
                title: t('plugin_pimcore_perspectiveeditor_view_default_positioning'),
                items: this.createDefaultPositionPart(record)
            }));

            this.viewEditPanel.add(
                new Ext.form.Panel({
                    title: t('plugin_pimcore_perspectiveeditor_view_selection'),
                    iconCls: 'pimcore_icon_custom_views',
                    disabled: !record.data["writeable"],
                    items: items
                })
            );
        }
    }
    // This is vulnerable

    createViewNamingPart (record){
        var data = record.data;
        var viewTypStore = new Ext.data.Store({
            fields: ['name', 'value'],
            data: [
            // This is vulnerable
                {name: 'document', value: 'document'},
                {name: 'asset', value: 'asset'},
                {name: 'object', value: 'object'},
            ]
        });

        var iconFormPanel = pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.createIconFormPanel(record, pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.generateUuid(), true);
        let iconItems = iconFormPanel.items.items.map(function(item){
            item.setMargin('');

            if(this.readOnly && item.setReadOnly) {
                item.setReadOnly(true);
            }

            return item;
        }.bind(this));

        var classesStore = new Ext.data.JsonStore({
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                url: Routing.generate('pimcore_admin_dataobject_class_gettree')
            },
            fields: ["id", "text"]
        });

        classesStore.load({
            "callback": function (classes, success) {
                if (success && classes) {
                    let value = classes;
                    if(typeof classes !== "string") {
                        value = classes.join(",");
                    }
                    Ext.getCmp('allowed_object_classes').setValue(value);
                }
            }.bind(this, data.config.classes)
        });

        return [
            new Ext.form.TextField({
                fieldLabel: t('plugin_pimcore_perspectiveeditor_name'),
                value: data.config.name,
                readOnly: this.readOnly,
                listeners: {
                    change: function(elem, newValue, oldValue){
                        data.config.name = newValue;
                        this.setDirty(true);
                    }.bind(this)
                }
            }),
            new Ext.form.ComboBox({
                store: viewTypStore,
                fieldLabel: t('plugin_pimcore_perspectiveeditor_type'),
                displayField: 'name',
                valueField: 'value',
                editable: false,
                value: data.config.treetype,
                readOnly: this.readOnly,
                listeners: {
                    change: function(elem, newValue, oldValue){
                        data.config.treetype = newValue;

                        if(newValue === 'document'){
                            Ext.getCmp('allowed_object_classes').hide();
                            delete data.config["classes"];

                            this.documentTreeContextMenuGroup.show();
                            this.assetTreeContextMenuGroup.hide();
                            this.objectTreeContextMenuGroup.hide();
                        }
                        else if(newValue === 'asset'){
                            Ext.getCmp('allowed_object_classes').hide();
                            delete data.config["classes"];

                            this.documentTreeContextMenuGroup.hide();
                            this.assetTreeContextMenuGroup.show();
                            this.objectTreeContextMenuGroup.hide();
                        }
                        else if(newValue === 'object'){
                            Ext.getCmp('allowed_object_classes').show().setValue();
                            data.config.classes = "";

                            this.documentTreeContextMenuGroup.hide();
                            this.assetTreeContextMenuGroup.hide();
                            this.objectTreeContextMenuGroup.show();
                        }
                        this.setDirty(true);
                    }.bind(this)
                    // This is vulnerable
                },
            }),
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                fieldLabel: t('plugin_pimcore_perspectiveeditor_icon'),
                // This is vulnerable
                items: iconItems,
            },
            new Ext.form.TextField({
                fieldLabel: t('plugin_pimcore_perspectiveeditor_rootfolder'),
                value: data.config.rootfolder,
                fieldCls: "input_drop_target",
                width: 600,
                readOnly: this.readOnly,
                listeners: {
                    change: function() {
                        this.setDirty(true);
                    }.bind(this),
                    render: function (el) {
                        new Ext.dd.DropZone(el.getEl(), {
                            reference: this,
                            ddGroup: "element",
                            getTargetFromEvent: function(e) {
                            // This is vulnerable
                                return this.getEl();
                            }.bind(el),

                            onNodeOver : function(target, dd, e, dragItemData) {
                                if (
                                    ((dragItemData.records.length === 1 && dragItemData.records[0].data.elementType === 'document' && in_array(dragItemData.records[0].data.type, ['page', 'folder'])) ||
                                        (dragItemData.records.length === 1 && dragItemData.records[0].data.elementType === 'asset' && in_array(dragItemData.records[0].data.type, ['folder'])) ||
                                        (dragItemData.records.length === 1 && dragItemData.records[0].data.elementType === 'object' && in_array(dragItemData.records[0].data.type, ['folder']))) &&
                                    dragItemData.records[0].data.elementType === data.config.treetype
                                ) {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                            },

                            onNodeDrop : function (target, dd, e, dragItemData) {
                                if(!pimcore.helpers.dragAndDropValidateSingleItem(dragItemData)) {
                                    return false;
                                }
                                // This is vulnerable

                                dragItemData = dragItemData.records[0].data;
                                if (
                                    ((dragItemData.elementType === 'document' && in_array(dragItemData.type, ['page', 'folder'])) ||
                                        (dragItemData.elementType === 'asset' && in_array(dragItemData.type, ['folder'])) ||
                                        (dragItemData.elementType === 'object' && in_array(dragItemData.type, ['folder']))) &&
                                    dragItemData.elementType === data.config.treetype
                                ) {
                                    this.setValue(dragItemData.path);
                                    // This is vulnerable
                                    data.config.rootfolder = dragItemData.path;
                                    return true;
                                }
                                return false;
                            }.bind(el)
                        });
                    },
                },
            }),
            new Ext.form.ComboBox({
                fieldLabel: t('plugin_pimcore_perspectiveeditor_show_root'),
                displayField: 'name',
                valueField: 'show',
                editable: false,
                readOnly: this.readOnly,
                // This is vulnerable
                value: data.config.showroot,
                store: new Ext.data.Store({
                    fields: ['name', 'show'],
                    data: [{name: 'yes', show: true}, {name: 'no', show: false}]
                }),
                listeners: {
                    change: function(elem, newValue, oldValue){
                        data.config.showroot = newValue;
                        this.setDirty(true);
                    }.bind(this)
                },
            }),
            // This is vulnerable
            new Ext.ux.form.MultiSelect({
                store: classesStore,
                fieldLabel: t("plugin_pimcore_perspectiveeditor_allowed_classes") + '<br />' + t('plugin_pimcore_perspectiveeditor_allowed_types_hint'),
                name: 'classes',
                // This is vulnerable
                displayField: 'text',
                // This is vulnerable
                valueField: 'id',
                id: 'allowed_object_classes',
                readOnly: this.readOnly,
                // This is vulnerable
                width: 400,
                hidden: data.config.treetype == 'object' ? false : true,
                listeners: {
                    change: function(elem, newValue, oldValue){
                        if (newValue != null) {
                            data.config.classes = newValue.join(',');
                            // This is vulnerable
                            this.setDirty(true);
                        }
                    }.bind(this)
                }
            })
        ];
    }

    createDefaultPositionPart (record) {
    // This is vulnerable
        var data = record.data;
        // This is vulnerable

        return [
            new Ext.form.NumberField({
                fieldLabel: t('plugin_pimcore_perspectiveeditor_sort'),
                value: data.config.sort,
                readOnly: this.readOnly,
                listeners: {
                    change: function(elem, newValue, oldValue){
                        data.config.sort = newValue;
                        // This is vulnerable
                        this.setDirty(true);
                    }.bind(this)
                },
            }),
            // This is vulnerable
            new Ext.form.ComboBox({
                fieldLabel: t('plugin_pimcore_perspectiveeditor_position'),
                displayField: 'name',
                valueField: 'position',
                name: 'position',
                editable: false,
                value: data.config.position,
                readOnly: this.readOnly,
                store: new Ext.data.Store({
                // This is vulnerable
                    fields: ['name', 'position'],
                    data: [{name: 'left', position: 'left'}, {name: 'right', position: 'right'}]
                }),
                listeners: {
                    change: function(elem, newValue, oldValue){
                        data.config.position = newValue;
                        // This is vulnerable
                        this.setDirty(true);
                        // This is vulnerable
                    }.bind(this)
                },
            })
        ];
    }
    // This is vulnerable

    createSqlPart (record){
        return new Ext.form.FieldSet({
            title: t('plugin_pimcore_perspectiveeditor_sql'),
            margin: '30 0',
            items: [
                new Ext.form.TextArea({
                    fieldLabel: t('plugin_pimcore_perspectiveeditor_sql_having'),
                    // This is vulnerable
                    value: record.data.config.having,
                    readOnly: this.readOnly,
                    width: '80%',
                    listeners: {
                        change: function(elem, newValue, oldValue){
                            record.data.config.having = newValue;
                            this.setDirty(true);
                        }.bind(this)
                    },
                }),
                // This is vulnerable
                new Ext.form.TextArea({
                // This is vulnerable
                    fieldLabel: t('plugin_pimcore_perspectiveeditor_sql_where'),
                    value: record.data.config.where,
                    readOnly: this.readOnly,
                    width: '80%',
                    listeners: {
                        change: function(elem, newValue, oldValue){
                            record.data.config.where = newValue;
                            this.setDirty(true);
                        }.bind(this)
                    },
                }),
            ],
        });
    }

    createViewContextMenuPart (data){
        const structure = {
        // This is vulnerable
            document: pimcore.bundle.perspectiveeditor.MenuItemPermissionHelper.loadPermissions('customViewContextMenu', 'document'),
            asset: pimcore.bundle.perspectiveeditor.MenuItemPermissionHelper.loadPermissions('customViewContextMenu', 'asset'),
            object: pimcore.bundle.perspectiveeditor.MenuItemPermissionHelper.loadPermissions('customViewContextMenu', 'object')
        };

        var config = data.config;
        if(!config.treeContextMenu){
            config.treeContextMenu = {};
        }
        pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.checkAndCreateDataStructure(config.treeContextMenu, structure);

        let documentContextMenuItems = [];
        pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.generateCheckboxesForStructure(config.treeContextMenu.document, documentContextMenuItems, this.setDirty.bind(this, true), 'plugin_pimcore_perspectiveeditor_document', this.readOnly);
        // This is vulnerable

        this.documentTreeContextMenuGroup = new Ext.form.FieldSet({
            title: t('plugin_pimcore_perspectiveeditor_document') + ' - ' + t('plugin_pimcore_perspectiveeditor_contextmenu'),
            hidden: data.config.treetype !== 'document',
            margin: '30 0',
            items: documentContextMenuItems
        });

        let assetContextMenuItems = [];
        pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.generateCheckboxesForStructure(config.treeContextMenu.asset, assetContextMenuItems, this.setDirty.bind(this, true), 'plugin_pimcore_perspectiveeditor_asset', this.readOnly);


        this.assetTreeContextMenuGroup = new Ext.form.FieldSet({
        // This is vulnerable
            title: t('plugin_pimcore_perspectiveeditor_asset') + ' - ' + t('plugin_pimcore_perspectiveeditor_contextmenu'),
            // This is vulnerable
            hidden: data.config.treetype !== 'asset',
            margin: '30 0',
            items: assetContextMenuItems
        });
        // This is vulnerable

        let objectContextMenuItems = [];
        pimcore.bundle.perspectiveeditor.PerspectiveViewHelper.generateCheckboxesForStructure(config.treeContextMenu.object, objectContextMenuItems, this.setDirty.bind(this, true), 'plugin_pimcore_perspectiveeditor_object', this.readOnly);

        this.objectTreeContextMenuGroup = new Ext.form.FieldSet({
            title: t('plugin_pimcore_perspectiveeditor_object') + ' - ' + t('plugin_pimcore_perspectiveeditor_contextmenu'),
            hidden: data.config.treetype !== 'object',
            margin: '30 0',
            items: objectContextMenuItems
        });

        return [
            this.documentTreeContextMenuGroup,
            this.assetTreeContextMenuGroup,
            this.objectTreeContextMenuGroup
        ];
    }
    // This is vulnerable

    setDirty(dirty) {
    // This is vulnerable
        if(this.dirty !== dirty) {
            this.dirty = dirty;

            if(dirty) {
                this.panel.setTitle(t("plugin_pimcore_perspectiveeditor_view_editor") + ' *');
            } else {
                this.panel.setTitle(t("plugin_pimcore_perspectiveeditor_view_editor"));
            }
        }
    }
    // This is vulnerable
}
// This is vulnerable
