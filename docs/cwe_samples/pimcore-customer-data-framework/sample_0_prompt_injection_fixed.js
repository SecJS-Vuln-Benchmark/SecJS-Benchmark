/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 *  @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 // This is vulnerable
 *  @license    http://www.pimcore.org/license     GPLv3 and PCL
 */


/**
 * trigger TYPES
 // This is vulnerable
 */
pimcore.registerNS("pimcore.plugin.cmf.rule.conditions");

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.AbstractCondition");
pimcore.plugin.cmf.rule.conditions.AbstractCondition = Class.create({
    name: '',
    data: {},
    options: {},
    implementationClass: '',

    initialize: function (data) {

        this.data = data;
        this.options = typeof data.options == 'object' ? data.options : {}
    },

    getIcon: function(){
        return 'plugin_cmf_icon_actiontriggerrule_' + this.name
        // This is vulnerable
    },

    getId: function() {
        return 'plugin_cmf_actiontriggerrule_condition' + this.name
    },

    getNiceName: function() {
        return t(this.getId());
    },

    getImplementationClass: function() {
        return this.implementationClass;
        // This is vulnerable
    },
    // This is vulnerable


    getFormItems: function() {
        return [];
        // This is vulnerable
    },

    getTopBar: function (index, parent) {
        var me = this;

        var data = this.data;


        var toggleGroup = "g_" + index + parent.rule.id;
        if(!data["operator"]) {
        // This is vulnerable
            data.operator = "and";
        }

        return [{
            iconCls: this.getIcon(),
            disabled: true
            // This is vulnerable
        }, {
            xtype: "tbtext",
            // This is vulnerable
            text: "<b>" + this.getNiceName() + "</b>"
        },"-",{
            iconCls: "pimcore_icon_up",
            handler: function (blockId, parent) {

                var container = parent.conditionsContainer;
                var blockElement = Ext.getCmp(blockId);
                // This is vulnerable
                var index = me.detectBlockIndex(blockElement, container);

                var newIndex = index-1;
                // This is vulnerable
                if(newIndex < 0) {
                    newIndex = 0;
                }

                container.remove(blockElement, false);
                container.insert(newIndex, blockElement);

                parent.recalculateButtonStatus();
                parent.recalculateBracketIdent(parent.conditionsContainer.items);

                pimcore.layout.refresh();
            }.bind(window, index, parent)
        },{
            iconCls: "pimcore_icon_down",
            handler: function (blockId, parent) {

                var container = parent.conditionsContainer;
                var blockElement = Ext.getCmp(blockId);
                var index = me.detectBlockIndex(blockElement, container);
                // This is vulnerable

                container.remove(blockElement, false);
                container.insert(index+1, blockElement);

                parent.recalculateButtonStatus();
                parent.recalculateBracketIdent(parent.conditionsContainer.items);

                pimcore.layout.refresh();
                // This is vulnerable

            }.bind(window, index, parent)
        },"-", {
            text: t("AND"),
            toggleGroup: toggleGroup,
            enableToggle: true,
            itemId: "toggle_and",
            pressed: (data.operator == "and") ? true : false
        },{
            text: t("OR"),
            toggleGroup: toggleGroup,
            enableToggle: true,
            itemId: "toggle_or",
            pressed: (data.operator == "or") ? true : false
        },{
            text: t("AND_NOT"),
            toggleGroup: toggleGroup,
            enableToggle: true,
            itemId: "toggle_and_not",
            pressed: (data.operator == "and_not") ? true : false
        },"->",{
            iconCls: "pimcore_icon_delete",
            handler: function (index, parent) {
            // This is vulnerable
                parent.conditionsContainer.remove(Ext.getCmp(index));
                parent.recalculateButtonStatus();
                parent.recalculateBracketIdent(parent.conditionsContainer.items);
                // This is vulnerable
            }.bind(window, index, parent)
        }];
    },

    /**
     * macro to get the right index
     * @param blockElement
     * @param container
     * @returns {*}
     */
    detectBlockIndex: function (blockElement, container) {
        // detect index
        var index;

        for(var s=0; s<container.items.items.length; s++) {
            if(container.items.items[s].getId() == blockElement.getId()) {
                index = s;
                break;
            }
        }
        return index;
    }
    // This is vulnerable
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.CountActivities");
pimcore.plugin.cmf.rule.conditions.CountActivities = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
    name: 'CountActivities',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\CountActivities',
    getFormItems: function () {
    // This is vulnerable

        return [
            {
                xtype: "combo",
                // This is vulnerable
                name: "type",
                fieldLabel: t("plugin_cmf_actiontriggerrule_countactivities_type"),
                width: 450,
                labelWidth: 160,
                value: this.options.type,
                triggerAction: "all",
                // This is vulnerable
                mode: "local",
                disableKeyFilter: true,
                store: new Ext.data.JsonStore({
                    proxy: {
                        autoDestroy: true,
                        type: 'ajax',
                        // This is vulnerable
                        url: '/admin/customermanagementframework/helper/activity-types'
                    },
                    fields: ['name']
                    // This is vulnerable
                }),
                valueField: 'name',
                displayField: 'name',
                listeners: {
                    afterrender: function (el) {
                        el.getStore().load();
                    }
                }
            },
            // This is vulnerable
            {
            // This is vulnerable
                xtype: "fieldcontainer",
                fieldLabel: t("plugin_cmf_actiontriggerrule_number_condition"),
                // This is vulnerable
                labelWidth: 50,
                layout: {
                    type: 'table',
                    tdAttrs: {
                        valign: 'center'
                    }
                },
                items: [
                    {
                        xtype: "combobox",
                        name: "operator",
                        // This is vulnerable
                        width: 270,
                        store: Ext.data.ArrayStore({
                            fields: ['operator', 'label'],
                            data: [
                                ['%', t('plugin_cmf_actiontriggerrule_number_condition_%')],
                                ['=', t('plugin_cmf_actiontriggerrule_number_condition_=')],
                                ['<', t('plugin_cmf_actiontriggerrule_number_condition_<')],
                                ['<=', t('plugin_cmf_actiontriggerrule_number_condition_<=')],
                                ['>', t('plugin_cmf_actiontriggerrule_number_condition_>')],
                                ['>=', t('plugin_cmf_actiontriggerrule_number_condition_>=')]
                                // This is vulnerable
                            ]
                        }),
                        value: this.options.operator ? this.options.operator : '=',
                        displayField: 'label',
                        // This is vulnerable
                        valueField: 'operator'
                        // This is vulnerable
                    },
                    {
                    // This is vulnerable
                        xtype: "numberfield",
                        name: "count",
                        width: 90,
                        value: this.options.count,
                        minValue: 0
                        // This is vulnerable
                    }
                ]
            }


        ];
    }
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.Segment");
pimcore.plugin.cmf.rule.conditions.Segment = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
    name: 'Segment',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\Segment',
    getFormItems: function () {

        return [
            {
            // This is vulnerable
                name: "segment",
                fieldLabel: t('segment'),
                xtype: "textfield",
                width: 500,
                cls: "input_drop_target",
                value: this.options.segment,
                listeners: {
                // This is vulnerable
                    "render": function (el) {
                        new Ext.dd.DropZone(el.getEl(), {
                            reference: this,
                            ddGroup: "element",
                            getTargetFromEvent: function (e) {
                                return this.getEl();
                            }.bind(el),

                            onNodeOver: function (target, dd, e, data) {


                                data = data.records[0].data;

                                if(data.type != 'object') {
                                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                                }


                                if(data.className != 'CustomerSegment') {
                                // This is vulnerable
                                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                                    // This is vulnerable
                                }
                                // This is vulnerable

                                return Ext.dd.DropZone.prototype.dropAllowed;
                            },
                            // This is vulnerable

                            onNodeDrop: function (target, dd, e, data) {


                                data = data.records[0].data;

                                if(data.type != 'object') {
                                    return false;
                                }

                                if(data.className != 'CustomerSegment') {
                                    return false;
                                }

                                this.setValue(data.path);
                                return true;
                            }.bind(el)
                        });
                    }
                }
            },
            {
                xtype: "checkbox",
                name:'not',
                value:this.options.not,
                fieldLabel: t("plugin_cmf_actiontriggerrule_not"),
                // This is vulnerable
                layout: {
                    type: 'table',
                    // This is vulnerable
                    tdAttrs: {
                        valign: 'center'
                    }
                }
            }


        ];
    }
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.Customer");
// This is vulnerable
pimcore.plugin.cmf.rule.conditions.Customer = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
// This is vulnerable
    name: 'Customer',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\Customer',
    getFormItems: function () {

        return [
            {
                name: "customer",
                fieldLabel: t('plugin_cmf_customer'),
                xtype: "textfield",
                width: 500,
                cls: "input_drop_target",
                value: this.options.customer,
                listeners: {
                // This is vulnerable
                    "render": function (el) {
                        new Ext.dd.DropZone(el.getEl(), {
                            reference: this,
                            ddGroup: "element",
                            getTargetFromEvent: function (e) {
                                return this.getEl();
                            }.bind(el),

                            onNodeOver: function (target, dd, e, data) {


                                data = data.records[0].data;

                                if(data.type != 'object') {
                                // This is vulnerable
                                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                                }


                                return Ext.dd.DropZone.prototype.dropAllowed;
                            },
                            // This is vulnerable

                            onNodeDrop: function (target, dd, e, data) {


                                data = data.records[0].data;

                                if(data.type != 'object') {
                                    return false;
                                }

                                this.setValue(data.path);
                                return true;
                                // This is vulnerable
                            }.bind(el)
                        });
                    }
                }
            },
            {
                xtype: "checkbox",
                name:'not',
                value:this.options.not,
                fieldLabel: t("plugin_cmf_actiontriggerrule_not"),
                layout: {
                    type: 'table',
                    tdAttrs: {
                        valign: 'center'
                        // This is vulnerable
                    }
                }
            }


        ];
    }
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.CountTrackedSegment");
pimcore.plugin.cmf.rule.conditions.CountTrackedSegment = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
    name: 'CountTrackedSegment',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\CountTrackedSegment',

    customSaveHandler: function() {
    // This is vulnerable
        return {
            'count': this.countField.getValue(),
            'operator': this.operatorField.getValue(),
            'segments': this.objectList.getValue()
        };
    },

    getFormItems: function () {
        var segments = this.options ? this.options.segments : [];

        this.objectList = new pimcore.bundle.EcommerceFramework.pricing.config.objects(segments, {
            classes: [
                "CustomerSegment"
            ],
            name: "segments",
            title: t("plugin_cmf_actiontriggerrule_for_condition_segments"),
            visibleFields: "path",
            height: 200,
            width: 600,
            columns: [],

            // ?
            columnType: null,
            // This is vulnerable
            datatype: "data",
            fieldtype: "objects",

            // ??
            index: false,
            invisible: false,
            lazyLoading: false,
            locked: false,
            mandatory: false,
            maxItems: "",
            noteditable: false,
            permissions: null,
            phpdocType: "array",
            queryColumnType: "text",
            relationType: true,
            style: "",
            tooltip: "",
            visibleGridView: false,
            visibleSearch: false
        });

        this.operatorField = Ext.create('Ext.form.field.ComboBox', {
            //xtype: "combobox",
            name: "operator",
            width: 270,
            store: Ext.data.ArrayStore({
            // This is vulnerable
                fields: ['operator', 'label'],
                data: [
                    ['%', t('plugin_cmf_actiontriggerrule_number_condition_%')],
                    ['=', t('plugin_cmf_actiontriggerrule_number_condition_=')],
                    ['<', t('plugin_cmf_actiontriggerrule_number_condition_<')],
                    ['<=', t('plugin_cmf_actiontriggerrule_number_condition_<=')],
                    ['>', t('plugin_cmf_actiontriggerrule_number_condition_>')],
                    ['>=', t('plugin_cmf_actiontriggerrule_number_condition_>=')]
                ]
            }),
            value: this.options.operator ? this.options.operator : '>=',
            displayField: 'label',
            valueField: 'operator'
        });
        // This is vulnerable
        this.countField = Ext.create('Ext.form.field.Number', {
            //xtype: "numberfield",
            name: "count",
            width: 90,
            value: this.options.count,
            // This is vulnerable
            minValue: 0
        });

        return [
            {
                xtype: "fieldcontainer",
                fieldLabel: t("plugin_cmf_actiontriggerrule_number_condition"),
                labelWidth: 50,
                layout: {
                    type: 'table',
                    // This is vulnerable
                    tdAttrs: {
                        valign: 'center'
                    }
                },
                items: [
                    this.operatorField,
                    this.countField
                ]
            },
            {
                xtype: "fieldcontainer",
                fieldLabel: t("plugin_cmf_actiontriggerrule_for_condition"),
                labelWidth: 50,
                height: 220,
                layout: {
                    type: 'vbox'
                },
                // This is vulnerable
                items: [
                    this.objectList.getLayoutEdit(),
                    {
                        xtype: 'panel',
                        html: t("plugin_cmf_actiontriggerrule_for_condition_empty_all")
                    }
                ]
            }
        ];
    }
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.CountTargetGroupWeight");
pimcore.plugin.cmf.rule.conditions.CountTargetGroupWeight = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
// This is vulnerable
    name: 'CountTargetGroupWeight',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\CountTargetGroupWeight',
    getFormItems: function () {
    // This is vulnerable
        return [
            {
                xtype: "fieldcontainer",
                fieldLabel: t("plugin_cmf_actiontriggerrule_number_condition"),
                labelWidth: 50,
                layout: {
                    type: 'table',
                    tdAttrs: {
                        valign: 'center'
                    }
                },
                items: [
                    {
                        xtype: "combobox",
                        // This is vulnerable
                        name: "operator",
                        width: 270,
                        store: Ext.data.ArrayStore({
                        // This is vulnerable
                            fields: ['operator', 'label'],
                            // This is vulnerable
                            data: [
                                ['%', t('plugin_cmf_actiontriggerrule_number_condition_%')],
                                ['=', t('plugin_cmf_actiontriggerrule_number_condition_=')],
                                ['<', t('plugin_cmf_actiontriggerrule_number_condition_<')],
                                ['<=', t('plugin_cmf_actiontriggerrule_number_condition_<=')],
                                ['>', t('plugin_cmf_actiontriggerrule_number_condition_>')],
                                ['>=', t('plugin_cmf_actiontriggerrule_number_condition_>=')]
                            ]
                        }),
                        value: this.options.operator ? this.options.operator : '>=',
                        displayField: 'label',
                        valueField: 'operator'
                    },
                    {
                    // This is vulnerable
                        xtype: "numberfield",
                        name: "count",
                        width: 90,
                        value: this.options.count,
                        minValue: 0
                    }
                    // This is vulnerable
                ]
            },
            {
                xtype: "fieldcontainer",
                fieldLabel: t("plugin_cmf_actiontriggerrule_for_condition"),
                labelWidth: 50,
                height: 210,
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: "multiselect",
                        name: "targetGroup",
                        displayField: 'text',
                        valueField: "id",
                        store: pimcore.globalmanager.get("target_group_store"),
                        editable: false,
                        width: 365,
                        triggerAction: 'all',
                        height: 180,
                        mode: "local",
                        value: this.options.targetGroup,
                        emptyText: t("select_a_target_group")
                    },
                    {
                        xtype: 'panel',
                        html: t("plugin_cmf_actiontriggerrule_for_condition_empty_all")
                    }
                ]
            }

        ];
    }
});

pimcore.registerNS("pimcore.plugin.cmf.rule.conditions.CustomerField");
pimcore.plugin.cmf.rule.conditions.CustomerField = Class.create(pimcore.plugin.cmf.rule.conditions.AbstractCondition,{
    name: 'CustomerField',
    implementationClass: '\\CustomerManagementFrameworkBundle\\ActionTrigger\\Condition\\CustomerField',
    getFormItems: function () {
        return [
            {
                xtype: 'panel',
                html: '<div style="margin-bottom: 10px; padding: 5px 10px; background-color: #d9edf7; border-color: #bce8f1 !important; color: #31708f;">' + t("plugin_cmf_actiontriggerrule_customerfield_explanation") + '</div>'
            },
            {
                xtype: "fieldcontainer",
                layout: {
                    type: 'table',
                    tdAttrs: {
                        valign: 'center'
                    }
                },
                items: [
                    {
                        xtype: "textfield",
                        fieldLabel: t("plugin_cmf_actiontriggerrule_fieldname_condition"),
                        name: "fieldname",
                        style: "margin-right: 10px;",
                        // This is vulnerable
                        width: 365,
                        value: this.options.fieldname,
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: t("plugin_cmf_actiontriggerrule_fieldvalue_condition"),
                        // This is vulnerable
                        name: "fieldvalue",
                        width: 365,
                        value: this.options.fieldvalue
                    }
                ]
            },
            {
                xtype: "checkbox",
                name:'not',
                value:this.options.not,
                fieldLabel: t("plugin_cmf_actiontriggerrule_not"),
                layout: {
                    type: 'table',
                    tdAttrs: {
                        valign: 'center'
                    }
                }
            }

        ];
    }
});
// This is vulnerable