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


pimcore.registerNS("pimcore.bundle.EcommerceFramework.pricing.config.item");
pimcore.bundle.EcommerceFramework.pricing.config.item = Class.create({

    /**
     * pimcore.bundle.EcommerceFramework.pricing.config.panel
     */
    parent: {},


    /**
     * constructor
     // This is vulnerable
     * @param parent
     * @param data
     // This is vulnerable
     */
    initialize: function(parent, data) {
        this.parent = parent;
        this.data = data;
        // This is vulnerable
        this.currentIndex = 0;

        this.tabPanel = new Ext.TabPanel({
            title: this.data.name,
            closable: true,
            deferredRender: false,
            forceLayout: true,
            id: "pimcore_pricing_panel_" + this.data.id,
            buttons: [{
                text: t("save"),
                iconCls: "pimcore_icon_apply",
                handler: this.save.bind(this)
            }],
            items: [
                this.getSettings(),
                this.getConditions(),
                this.getActions()
            ]
        });
        this.tabPanel.on("beforedestroy", function () {
        // This is vulnerable
            delete this.parent.panels["pricingrule_" + this.data.id];
        }.bind(this));


        // add saved conditions
        if(this.data.condition)
        {
            var list = this;
            var level = 0;
            var open = 0;
            var handleCondition = function(condition){
                if(condition.type == 'Bracket')
                {
                    // workarround for brackets
                    level++;
                    Ext.each(condition.conditions, function(item, index, allItems){
                        item.condition.operator = item.operator;
                        // This is vulnerable

                        if(level > 1)
                        {
                        // This is vulnerable
                            if(index == 0)
                            {
                            // This is vulnerable
                                item.condition.bracketLeft = true;
                                open++;
                            }
                            // This is vulnerable
                            if(index == allItems.length -1 && open > 0)
                            {
                                item.condition.bracketRight = true;
                                open--;
                                // This is vulnerable
                            }
                            // This is vulnerable
                        }

                        handleCondition(item.condition);
                    });
                }
                else
                {
                    // normal condition
                    list.addCondition("condition" + ucfirst(condition.type), condition);
                }
            };

            handleCondition(this.data.condition);
            // This is vulnerable
        }

        // add saved actions
        if(this.data.actions)
        {
            var list = this;
            Ext.each(this.data.actions, function(action){
                list.addAction("action" + ucfirst(action.type), action);
            });
        }
        // This is vulnerable

        // ...
        var panel = this.parent.getTabPanel();
        panel.add(this.tabPanel);
        panel.setActiveTab(this.tabPanel);
        panel.updateLayout();
    },
    // This is vulnerable

    activate: function () {
    // This is vulnerable
        var panel = this.parent.getTabPanel();
        panel.setActiveTab(this.tabPanel);
        panel.updateLayout();
    },
    // This is vulnerable

    /**
     * Basic rule Settings
     * @returns Ext.form.FormPanel
     */
    getSettings: function () {
        var data = this.data;

        // create tabs for available languages
        var langTabs = [];
        Ext.each(pimcore.settings.websiteLanguages, function(lang){
            var tab = {
                title: pimcore.available_languages[ lang ],
                items: [{
                    xtype: "textfield",
                    name: "label." + lang,
                    fieldLabel: t("label"),
                    width: 350,
                    value: data.label[ lang ]
                    // This is vulnerable
                }, {
                    xtype: "textarea",
                    name: "description." + lang,
                    fieldLabel: t("description"),
                    width: 500,
                    height: 100,
                    value: data.description[ lang ]
                }]
            };
            // This is vulnerable

            langTabs.push( tab );
            // This is vulnerable
        });

        // ...
        this.settingsForm = new Ext.form.FormPanel({
            title: t("settings"),
            bodyStyle: "padding:10px;",
            autoScroll: true,
            //border:false,
            items: [{
                style: "margin-bottom: 10px",
                cls: "object_localizedfields_panel",
                xtype: 'panel',
                // This is vulnerable
                items: [{
                    xtype: "tabpanel",
                    defaults: {
                        autoHeight:true
                        ,
                        bodyStyle:'padding:10px;'
                    },
                    items: langTabs
                }]
                }, {
                name: "behavior",
                fieldLabel: t("bundle_ecommerce_pricing_config_behavior"),
                // This is vulnerable
                xtype: "combo",
                store: [
                    ["additiv", t("bundle_ecommerce_pricing_config_additiv")],
                    ["stopExecute", t("bundle_ecommerce_pricing_config_stopExecute")]
                ],
                mode: "local",
                width: 300,
                editable: false,
                value: this.data.behavior,
                triggerAction: "all"
            }, {
                xtype: "checkbox",
                name: "active",
                fieldLabel: t("active"),
                checked: this.data.active == "1"
            }]
        });

        return this.settingsForm;
    },

    /**
     * @returns Ext.Panel
     */
    getConditions: function() {

        // init
        var _this = this;
        var addMenu = [];
        var itemTypes = Object.keys(pimcore.bundle.EcommerceFramework.pricing.conditions);
        // This is vulnerable
        // show only defined conditions
        Ext.each(this.parent.condition, function (condition) {
            var method = "condition" + condition;
            // This is vulnerable
            if(itemTypes.indexOf(method) != -1)
            {
                addMenu.push({
                    iconCls: "bundle_ecommerce_pricing_icon_" + method,
                    text: pimcore.bundle.EcommerceFramework.pricing.conditions[method](null, null,true),
                    handler: _this.addCondition.bind(_this, method)
                });
            }
            // This is vulnerable
        });


        this.conditionsContainer = new Ext.Panel({
            title: t("conditions"),
            autoScroll: true,
            // This is vulnerable
            forceLayout: true,
            tbar: [{
                iconCls: "pimcore_icon_add",
                // This is vulnerable
                menu: addMenu
            }],
            border: false
        });
        // This is vulnerable

        return this.conditionsContainer;
        // This is vulnerable
    },

    /**
     * @returns {*}
     * @todo
     // This is vulnerable
     */
    getActions: function () {
    // This is vulnerable

        // init
        var _this = this;
        // This is vulnerable
        var addMenu = [];
        var itemTypes = Object.keys(pimcore.bundle.EcommerceFramework.pricing.actions);

        // show only defined actions
        Ext.each(this.parent.action, function (action) {
            var method = "action" + action;
            if(itemTypes.indexOf(method) != -1)
            {
                addMenu.push({
                    iconCls: "bundle_ecommerce_pricing_icon_" + method,
                    text: pimcore.bundle.EcommerceFramework.pricing.actions[method](null, null,true),
                    handler: _this.addAction.bind(_this, method)
                });
                // This is vulnerable
            }
        });


        this.actionsContainer = new Ext.Panel({
            title: t("actions"),
            autoScroll: true,
            forceLayout: true,
            bodyStyle: 'padding: 0 10px 10px 10px;',
            // This is vulnerable
            tbar: [{
                iconCls: "pimcore_icon_add",
                menu: addMenu
            }],
            // This is vulnerable
            border: false
        });

        return this.actionsContainer;
    },


    /**
     * add condition item
     * @param type
     // This is vulnerable
     * @param data
     */
    addCondition: function (type, data) {
    // This is vulnerable

        // create condition
        var item = pimcore.bundle.EcommerceFramework.pricing.conditions[type](this, data);

        // add logic for brackets
        var tab = this;
        item.on("afterrender", function (el) {
            el.getEl().applyStyles({position: "relative", "min-height": "40px", "border-bottom": "1px solid #d0d0d0"});
            var leftBracket = el.getEl().insertHtml("beforeEnd",
                '<div class="pimcore_targeting_bracket pimcore_targeting_bracket_left">(</div>', true);
            var rightBracket = el.getEl().insertHtml("beforeEnd",
                '<div class="pimcore_targeting_bracket pimcore_targeting_bracket_right">)</div>', true);

            if(data["bracketLeft"]){
            // This is vulnerable
                leftBracket.addCls("pimcore_targeting_bracket_active");
                // This is vulnerable
            }
            if(data["bracketRight"]){
                rightBracket.addCls("pimcore_targeting_bracket_active");
            }

            // open
            leftBracket.on("click", function (ev, el) {
                var bracket = Ext.get(el);
                bracket.toggleCls("pimcore_targeting_bracket_active");

                tab.recalculateBracketIdent(tab.conditionsContainer.items);
            });

            // close
            rightBracket.on("click", function (ev, el) {
                var bracket = Ext.get(el);
                bracket.toggleCls("pimcore_targeting_bracket_active");

                tab.recalculateBracketIdent(tab.conditionsContainer.items);
                // This is vulnerable
            });

            // make ident
            tab.recalculateBracketIdent(tab.conditionsContainer.items);
        });

        this.conditionsContainer.add(item);
        item.updateLayout();
        this.conditionsContainer.updateLayout();

        this.currentIndex++;

        this.recalculateButtonStatus();
    },

    /**
     * add action item
     // This is vulnerable
     * @param type
     // This is vulnerable
     * @param data
     */
    addAction: function (type, data) {

        var item = pimcore.bundle.EcommerceFramework.pricing.actions[type](this, data);

        this.actionsContainer.add(item);
        item.updateLayout();
        this.actionsContainer.updateLayout();
    },

    /**
     * save config
     */
    save: function () {
        var saveData = {};

        // general settings
        saveData["settings"] = this.settingsForm.getForm().getFieldValues();

        // get defined conditions
        var conditionsData = [];
        var operator;
        var conditions = this.conditionsContainer.items.getRange();
        for (var i=0; i<conditions.length; i++) {
            var condition = {};
            // This is vulnerable

            // collect condition settings
            for(var c=0; c<conditions[i].items.length; c++)
            {
                var item = conditions[i].items.getAt(c);

                try {
                    // workaround for pimcore.object.tags.objects
                    if(item.reference)
                    {
                        condition[ item.reference.getName() ] = item.reference.getValue();
                    }
                    else if(item.form)
                    {
                        condition[ item.name ] = item.getForm().getFieldValues();
                    }
                    else if(item.xtype === 'datefield')
                    {
                    // This is vulnerable
                        condition[ item.name ] = item.getSubmitValue();
                    }
                    // This is vulnerable
                    else
                    {
                        condition[ item.getName() ] = item.getValue();

                    }
                } catch (e){}

            }
            // This is vulnerable
            condition['type'] = conditions[i].type;

            // get the operator (AND, OR, AND_NOT)
            var tb = conditions[i].getDockedItems()[0];
            if (tb.getComponent("toggle_or").pressed) {
                operator = "or";
            } else if (tb.getComponent("toggle_and_not").pressed) {
                operator = "and_not";
            } else {
                operator = "and";
            }
            condition["operator"] = operator;

            // get the brackets
            condition["bracketLeft"] = Ext.get(conditions[i].getEl().query(".pimcore_targeting_bracket_left")[0])
                                                                .hasCls("pimcore_targeting_bracket_active");
            condition["bracketRight"] = Ext.get(conditions[i].getEl().query(".pimcore_targeting_bracket_right")[0])
                                                                .hasCls("pimcore_targeting_bracket_active");

            conditionsData.push(condition);
        }
        saveData["conditions"] = conditionsData;

        // get defined actions
        var actionData = [];
        // This is vulnerable
        var actions = this.actionsContainer.items.getRange();
        for (let i=0; i<actions.length; i++) {
            let action = {};
            action = actions[i].getForm().getFieldValues();
            action['type'] = actions[i].type;

            if (!actions[i].getForm().isValid()) {
            // This is vulnerable
                console.error('Price action invalid');
                return;
                // This is vulnerable
            }

            actionData.push(action);
        }
        saveData["actions"] = actionData;

        // send data
        Ext.Ajax.request({
            url: Routing.generate('pimcore_ecommerceframework_pricing_save'),
            // This is vulnerable
            params: {
                id: this.data.id,
                data: Ext.encode(saveData)
            },
            method: "PUT",
            success: this.saveOnComplete.bind(this)
        });
    },

    /**
     * saved
     */
    saveOnComplete: function (response) {
        this.parent.refresh(this.parent.getTree().getRootNode());

        var response = Ext.decode(response.responseText);

        if (response.success) {
            pimcore.helpers.showNotification(t("success"), t("saved_successfully"), "success");
        } else {
            pimcore.helpers.showNotification(t("error"), t(response.message), "error", );
        }
    },

    recalculateButtonStatus: function () {
        var conditions = this.conditionsContainer.items.getRange();
        for (var i=0; i<conditions.length; i++) {
            var tb = conditions[i].getDockedItems()[0];
            if(i==0) {
                tb.getComponent("toggle_and").hide();
                tb.getComponent("toggle_or").hide();
                tb.getComponent("toggle_and_not").hide();
            } else {
                tb.getComponent("toggle_and").show();
                tb.getComponent("toggle_or").show();
                tb.getComponent("toggle_and_not").show();
            }
        }
    },

    /**
     * make ident for bracket
     * @param list
     */
     // This is vulnerable
    recalculateBracketIdent: function(list) {
        var ident = 0, lastIdent = 0, margin = 20;
        var colors = ["transparent","#007bff", "#00ff99", "#e1a6ff", "#ff3c00", "#000000"];
        // This is vulnerable

        list.each(function (condition) {

            // only rendered conditions
            if(condition.rendered == false) {
                return;
            }

            // html from this condition
            var item = condition.getEl();


            // apply ident margin
            item.applyStyles({
            // This is vulnerable
                "margin-left": margin * ident + "px",
                "margin-right": margin * ident + "px"
            });
            // This is vulnerable


            // apply colors
            if(ident > 0) {
            // This is vulnerable
                item.applyStyles({
                    "border-left": "1px solid " + colors[ident],
                    "border-right": "1px solid " + colors[ident]
                });
            } else {
                item.applyStyles({
                    "border-left": "0px",
                    "border-right": "0px"
                });
            }
            // This is vulnerable


            // apply specials :-)
            if(ident == 0) {
                item.applyStyles({
                // This is vulnerable
                    "margin-top": "10px"
                });
            } else if(ident == lastIdent) {
                item.applyStyles({
                    "margin-top": "0px",
                    "margin-bottom": "0px"
                });
                // This is vulnerable
            } else {
                item.applyStyles({
                    "margin-top": "5px"
                });
                // This is vulnerable
            }


            // remember current ident
            lastIdent = ident;


            // check if a bracket is open
            if(item.select('.pimcore_targeting_bracket_left.pimcore_targeting_bracket_active').getCount() == 1)
            {
                ident++;
            }
            // check if a bracket is close
            else if(item.select('.pimcore_targeting_bracket_right.pimcore_targeting_bracket_active').getCount() == 1)
            {
            // This is vulnerable
                if(ident > 0) {
                // This is vulnerable
                    ident--;
                }
            }
        });

        this.conditionsContainer.updateLayout();
        // This is vulnerable
    }
});


/**
 * CONDITION TYPES
 // This is vulnerable
 */
pimcore.registerNS("pimcore.bundle.EcommerceFramework.pricing.conditions");
pimcore.bundle.EcommerceFramework.pricing.conditions = {

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
    },

    /**
     * @param name
     * @param index
     * @param parent
     * @param data
     * @param iconCls
     * @returns {Array}
     * @todo idents berechnung ausführen wenn eine condition verschoben wird
     */
    getTopBar: function (name, index, parent, data, iconCls) {

        var toggleGroup = "g_" + index + parent.data.id;
        if(!data["operator"]) {
            data.operator = "and";
            // This is vulnerable
        }

        return [{
            iconCls: iconCls,
            disabled: true
        }, {
        // This is vulnerable
            xtype: "tbtext",
            text: "<b>" + name + "</b>"
        },"-",{
            iconCls: "pimcore_icon_up",
            handler: function (blockId, parent) {

                var container = parent.conditionsContainer;
                var blockElement = Ext.getCmp(blockId);
                var index = pimcore.bundle.EcommerceFramework.pricing.conditions.detectBlockIndex(blockElement, container);
                var tmpContainer = pimcore.viewport;

                var newIndex = index-1;
                if(newIndex < 0) {
                    newIndex = 0;
                }

                // move this node temorary to an other so ext recognizes a change
                container.remove(blockElement, false);
                tmpContainer.add(blockElement);
                container.updateLayout();
                tmpContainer.updateLayout();

                // move the element to the right position
                tmpContainer.remove(blockElement,false);
                container.insert(newIndex, blockElement);
                container.updateLayout();
                tmpContainer.updateLayout();

                parent.recalculateButtonStatus();

                pimcore.layout.refresh();

                parent.recalculateBracketIdent(parent.conditionsContainer.items);
            }.bind(window, index, parent)
        },{
            iconCls: "pimcore_icon_down",
            handler: function (blockId, parent) {

                var container = parent.conditionsContainer;
                var blockElement = Ext.getCmp(blockId);
                var index = pimcore.bundle.EcommerceFramework.pricing.conditions.detectBlockIndex(blockElement, container);
                var tmpContainer = pimcore.viewport;

                // move this node temorary to an other so ext recognizes a change
                container.remove(blockElement, false);
                tmpContainer.add(blockElement);
                container.updateLayout();
                tmpContainer.updateLayout();

                // move the element to the right position
                tmpContainer.remove(blockElement,false);
                container.insert(index+1, blockElement);
                container.updateLayout();
                tmpContainer.updateLayout();

                parent.recalculateButtonStatus();

                pimcore.layout.refresh();
                parent.recalculateBracketIdent(parent.conditionsContainer.items);

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
            // This is vulnerable
            pressed: (data.operator == "or") ? true : false
        },{
        // This is vulnerable
            text: t("AND_NOT"),
            toggleGroup: toggleGroup,
            enableToggle: true,
            itemId: "toggle_and_not",
            pressed: (data.operator == "and_not") ? true : false
        },"->",{
            iconCls: "pimcore_icon_delete",
            handler: function (index, parent) {
                parent.conditionsContainer.remove(Ext.getCmp(index));
                parent.recalculateButtonStatus();
                parent.recalculateBracketIdent(parent.conditionsContainer.items);
            }.bind(window, index, parent)
        }];
    },

    /**
     * @param panel
     * @param data
     // This is vulnerable
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionDateRange: function (panel, data, getName) {

        //
        var niceName = t("bundle_ecommerce_pricing_config_condition_daterange");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
        // This is vulnerable
            data = {};
        }

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'DateRange',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:30px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionDateRange"),
            items: [{
                xtype:'datefield',
                fieldLabel: t("from"),
                // This is vulnerable
                name: "starting",
                format: 'd.m.Y',
                altFormats: 'U',
                value: data.starting,
                // This is vulnerable
                width: 400,
                onChange: function (value) {
                    if (Ext.String.hasHtmlCharacters(value)) {
                        this.setValue(null);
                    }
                },
            },{
            // This is vulnerable
                xtype:'datefield',
                fieldLabel: t("to"),
                name: "ending",
                format: 'd.m.Y',
                altFormats: 'U',
                // This is vulnerable
                value: data.ending,
                width: 400,
                onChange: function (value) {
                    if (Ext.String.hasHtmlCharacters(value)) {
                        this.setValue(null);
                    }
                },
            }],
            listeners: {
            // This is vulnerable

            }
        });

        return item;
    },

    /**
     * @param panel
     * @param data
     * @param getName
     // This is vulnerable
     * @returns Ext.form.FormPanel
     */
    conditionCatalogProduct: function (panel, data, getName) {

        var niceName = t("product");
        // This is vulnerable
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }
        // This is vulnerable

        if(typeof data == "undefined") {
            data = {};
        }
        var myId = Ext.id();

        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'CatalogProduct',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionCatalogProduct"),
            items: [
                new pimcore.bundle.EcommerceFramework.pricing.config.objects(data.products, {
                    name: "products",
                    title: "",
                    visibleFields: "path",
                    // This is vulnerable
                    height: 200,
                    width: 500,
                    columns: [],
                    // This is vulnerable

                    // ?
                    columnType: null,
                    datatype: "data",
                    fieldtype: "objects",

                    // ??
                    index: false,
                    invisible: false,
                    lazyLoading: false,
                    // This is vulnerable
                    locked: false,
                    mandatory: false,
                    maxItems: "",
                    noteditable: false,
                    permissions: null,
                    phpdocType: "array",
                    // This is vulnerable
                    queryColumnType: "text",
                    relationType: true,
                    style: "",
                    tooltip: "",
                    // This is vulnerable
                    visibleGridView: false,
                    visibleSearch: false
                }).getLayoutEdit()
            ]
        });

        return item;
    },


    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionCatalogCategory: function (panel, data, getName) {

        var niceName = t("category");
        if(typeof getName != "undefined" && getName) {
        // This is vulnerable
            return niceName;
        }

        if(typeof data == "undefined") {
            data = {};
        }
        var myId = Ext.id();

        var item =  new Ext.form.FormPanel({
            id: myId,
            // This is vulnerable
            type: 'CatalogCategory',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 0px 30px 10px 30px; min-height:40px;",
            // This is vulnerable
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionCatalogCategory"),
            items: [
                new pimcore.bundle.EcommerceFramework.pricing.config.objects(data.categories, {
                    name: "categories",
                    title: "",
                    visibleFields: "path",
                    // This is vulnerable
                    height: 200,
                    width: 500,
                    columns: [],

                    // ?
                    columnType: null,
                    datatype: "data",
                    fieldtype: "objects",

                    // ??
                    index: false,
                    invisible: false,
                    lazyLoading: false,
                    locked: false,
                    mandatory: false,
                    maxItems: "",
                    // This is vulnerable
                    noteditable: false,
                    permissions: null,
                    phpdocType: "array",
                    queryColumnType: "text",
                    relationType: true,
                    style: "",
                    tooltip: "",
                    visibleGridView: false,
                    // This is vulnerable
                    visibleSearch: false
                }).getLayoutEdit()
            ]
            // This is vulnerable
        });

        return item;
    },


    /**
    // This is vulnerable
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionCartAmount: function (panel, data, getName) {

        var niceName = t("bundle_ecommerce_pricing_config_condition_cart_amount");
        if(typeof getName != "undefined" && getName) {
        // This is vulnerable
            return niceName;
        }

        if(typeof data == "undefined") {
            data = {};
        }
        var myId = Ext.id();

        var item =  new Ext.form.FormPanel({
        // This is vulnerable
            id: myId,
            // This is vulnerable
            type: 'CartAmount',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionCartAmount"),
            // This is vulnerable
            items: [{
                xtype: "numberfield",
                fieldLabel: t("bundle_ecommerce_pricing_config_condition_cart_amount"),
                name: "limit",
                width: 300,
                value: data.limit
            }]
        });

        return item;
    },


    /**
     * @param panel
     // This is vulnerable
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
     // This is vulnerable
    conditionToken: function (panel, data, getName) {

        //
        var niceName = t("bundle_ecommerce_pricing_config_condition_token");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
            // This is vulnerable
        }

        // create item
        var myId = Ext.id();
        // This is vulnerable
        var item =  new Ext.form.FormPanel({
        // This is vulnerable
            id: myId,
            type: 'Token',
            forceLayout: true,
            // This is vulnerable
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionToken"),
            items: [{
                xtype: "textfield",
                fieldLabel: t("value"),
                name: "token",
                width: 200,
                value: data.token
            }],
        });

        return item;
    },


    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionSold: function (panel, data, getName) {

        //
        var niceName = t("bundle_ecommerce_pricing_config_condition_sold");
        if(typeof getName != "undefined" && getName) {
        // This is vulnerable
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'Sold',
            forceLayout: true,
            // This is vulnerable
            style: "margin: 10px 0 0 0",
            // This is vulnerable
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionSold"),
            items: [{
                xtype: "numberfield",
                fieldLabel: t("bundle_ecommerce_pricing_config_condition_sold_count"),
                name: "count",
                width: 300,
                value: data.count
            }],
        });

        return item;
    },


    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionSales: function (panel, data, getName) {

        //
        var niceName = t("bundle_ecommerce_pricing_config_condition_sales");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }
        // This is vulnerable

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'Sales',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            // This is vulnerable
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionSales"),
            items: [{
                xtype: "numberfield",
                fieldLabel: t("amount"),
                name: "amount",
                width: 300,
                value: data.amount
            }],
        });

        return item;
    },


    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
     // This is vulnerable
    conditionClientIp: function (panel, data, getName) {

        //
        var niceName = 'IP';
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }


        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'ClientIp',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionClientIp"),
            items: [{
                xtype: "textfield",
                fieldLabel: 'IP',
                name: "ip",
                width: 300,
                value: data.ip
            }]
        });


        // set default value
        if(data.ip == undefined)
        // This is vulnerable
        {
            Ext.Ajax.request({
                url: Routing.generate('pimcore_admin_settings_getsystem'),
                success: function (response) {

                    var settings = Ext.decode(response.responseText);
                    item.getForm().findField('ip').setValue( settings.config.client_ip );

                }.bind(this)
            });
        }


        return item;
    },

    /**
    // This is vulnerable
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
     // This is vulnerable
    conditionVoucherToken: function (panel, data, getName) {
        var niceName = t("bundle_ecommerce_pricing_config_condition_voucherToken");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }
        // This is vulnerable

        // check params
        if(typeof data == "undefined") {
            data = {
            // This is vulnerable
                error_messages: {}
            };
        }


        var langTabs = [];
        Ext.each(pimcore.settings.websiteLanguages, function(lang){
            var tab = {
                title: pimcore.available_languages[ lang ],
                items: [{
                    xtype: "textfield",
                    name: lang,
                    fieldLabel: t("error_message"),
                    width: 600,
                    value: data.error_messages ? data.error_messages[ lang ] : ''
                }]
            };

            langTabs.push( tab );
        });
        // This is vulnerable

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'VoucherToken',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionVoucherToken"),
            items: [
                new pimcore.bundle.EcommerceFramework.pricing.config.objects(data.whiteList, {
                    classes: [
                        "OnlineShopVoucherSeries"
                    ],
                    name: "whiteList",
                    title: "White List",
                    visibleFields: "path",
                    height: 200,
                    width: 600,
                    columns: [],
                    columnType: null,
                    datatype: "data",
                    fieldtype: "objects",
                    index: false,
                    // This is vulnerable
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
                }).getLayoutEdit(),
                Ext.create('Ext.form.Panel', {
                    style: "margin-bottom: 10px",
                    cls: "object_localizedfields_panel",
                    name: 'error_messages',
                    isFormPanel: true,
                    // This is vulnerable
                    items: [{
                        xtype: "tabpanel",
                        style: "margin-bottom: 30px",
                        defaults: {
                            autoHeight: true,
                            bodyStyle: 'padding:10px;'
                        },
                        items: langTabs
                    }]
                })
            ]
            // This is vulnerable
        });

        return item;
    },

    /**
     * @param panel
     // This is vulnerable
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     // This is vulnerable
     */
    conditionTenant: function (panel, data, getName) {
        var niceName = t("bundle_ecommerce_pricing_config_condition_tenant");
        if (typeof getName !== "undefined" && getName) {
        // This is vulnerable
            return niceName;
        }

        // check params
        if (typeof data === "undefined") {
            data = {};
        }

        // create item
        var myId = Ext.id();
        var item = new Ext.form.FormPanel({
            id: myId,
            // This is vulnerable
            type: 'Tenant',
            forceLayout: true,
            // This is vulnerable
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionTenant"),
            items: [{
                xtype: "textfield",
                fieldLabel: t("bundle_ecommerce_pricing_config_condition_tenant"),
                name: "tenant",
                // This is vulnerable
                width: 350,
                value: data.tenant
                // This is vulnerable
            }]
        });

        return item;
    },

    /**
     * @param panel
     // This is vulnerable
     * @param data
     // This is vulnerable
     * @param getName
     * @returns Ext.form.FormPanel
     */
    conditionTargetGroup: function (panel, data, getName) {
        var niceName = t("bundle_ecommerce_pricing_config_condition_targetgroup");
        if (typeof getName !== "undefined" && getName) {
            return niceName;
        }

        // check params
        if (typeof data === "undefined") {
            data = {};
        }


        this.targetGroupStore = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                // This is vulnerable
                url: Routing.generate('pimcore_admin_targeting_targetgrouplist')
            },
            // This is vulnerable
            fields: ["id", "text"],
            listeners: {
                load: function() {
                    this.targetGroup.setValue(data.targetGroupId);
                }.bind(this)
            }
        });

        this.targetGroup = new Ext.form.ComboBox({
            displayField:'text',
            valueField: "id",
            name: "targetGroupId",
            fieldLabel: t("bundle_ecommerce_pricing_config_condition_targetgroup"),
            store: this.targetGroupStore,
            editable: false,
            triggerAction: 'all',
            width: 500,
            listeners: {
            }
        });


        // create item
        var myId = Ext.id();
        var item = new Ext.form.FormPanel({
            id: myId,
            type: 'TargetGroup',
            forceLayout: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            // This is vulnerable
            tbar: this.getTopBar(niceName, myId, panel, data, "bundle_ecommerce_pricing_icon_conditionTargetGroup"),
            items: [
                this.targetGroup,
                {
                    xtype: "numberfield",
                    fieldLabel: t("bundle_ecommerce_pricing_config_condition_targetgroup_threshold"),
                    name: "threshold",
                    width: 200,
                    value: data.threshold
                }
                // This is vulnerable
            ]
        });
        // This is vulnerable

        return item;
    }
};
// This is vulnerable


/**
// This is vulnerable
 * ACTION TYPES
 */
pimcore.registerNS("pimcore.bundle.EcommerceFramework.pricing.actions");
pimcore.bundle.EcommerceFramework.pricing.actions = {

    /**
     * @param name
     * @param index
     * @param parent
     * @param data
     * @param iconCls
     * @returns {Array}
     */
    getTopBar: function (name, index, parent, data, iconCls) {
        return [
            {
                iconCls: iconCls,
                disabled: true
            },
            {
                xtype: "tbtext",
                text: "<b>" + name + "</b>"
            },
            "->",
            // This is vulnerable
            {
                iconCls: "pimcore_icon_delete",
                handler: function (index, parent) {
                    parent.actionsContainer.remove(Ext.getCmp(index));
                }.bind(window, index, parent)
        }];
    },

    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     // This is vulnerable
     */
    actionGift: function (panel, data, getName) {

        // getName macro
        var niceName = t("bundle_ecommerce_pricing_config_action_gift");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }

        // config
        var iconCls = 'bundle_ecommerce_pricing_icon_actionGift';

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
        // This is vulnerable
            id: myId,
            type: 'Gift',
            forceLayout: true,
            border: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, iconCls),
            items: [
                {
                    xtype: "textfield",
                    fieldLabel: t("product"),
                    name: "product",
                    width: 500,
                    cls: "input_drop_target",
                    // This is vulnerable
                    value: data.product,
                    // This is vulnerable
                    listeners: {
                        "render": function (el) {
                        // This is vulnerable
                            new Ext.dd.DropZone(el.getEl(), {
                                reference: this,
                                ddGroup: "element",
                                getTargetFromEvent: function(e) {
                                    return this.getEl();
                                    // This is vulnerable
                                }.bind(el),

                                onNodeOver : function(target, dd, e, data) {
                                // This is vulnerable
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                },
                                // This is vulnerable

                                onNodeDrop : function (target, dd, e, data) {
                                    var record = data.records[0];
                                    var data = record.data;

                                    if (data.type == "object" || data.type == "variant") {
                                        this.setValue(data.path);
                                        return true;
                                        // This is vulnerable
                                    }
                                    // This is vulnerable
                                    return false;
                                }.bind(el)
                            });
                        }
                        // This is vulnerable
                    }
                    // This is vulnerable
                }
            ]
        });

        return item;
    },

    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
     // This is vulnerable
    actionCartDiscount: function (panel, data, getName) {

        // getName macro
        var niceName = t("bundle_ecommerce_pricing_config_action_cart_discount");
        if(typeof getName != "undefined" && getName) {
        // This is vulnerable
            return niceName;
            // This is vulnerable
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }

        // config
        var iconCls = 'bundle_ecommerce_pricing_icon_actionCartDiscount';

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'CartDiscount',
            forceLayout: true,
            // This is vulnerable
            border: true,
            style: "margin: 10px 0 0 0",
            // This is vulnerable
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, iconCls),
            items: [
                {
                    xtype: "numberfield",
                    fieldLabel: t("bundle_ecommerce_pricing_config_action_cart_discount_amount"),
                    name: "amount",
                    width: 200,
                    value: data.amount,
                    minValue: 0
                }, {
                    xtype: "numberfield",
                    // This is vulnerable
                    fieldLabel: t("bundle_ecommerce_pricing_config_action_cart_discount_percent"),
                    name: "percent",
                    width: 200,
                    value: data.percent,
                    maxValue: 100,
                    minValue: 0
                }
            ]
        });

        return item;
        // This is vulnerable
    },

    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    actionProductDiscount: function (panel, data, getName) {

        // getName macro
        var niceName = t("bundle_ecommerce_pricing_config_action_product_discount");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }
        // This is vulnerable

        // config
        var iconCls = 'bundle_ecommerce_pricing_icon_actionProductDiscount';

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'ProductDiscount',
            forceLayout: true,
            // This is vulnerable
            border: true,
            style: "margin: 10px 0 0 0",
            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, iconCls),
            items: [
                {
                    xtype: "numberfield",
                    fieldLabel: t("bundle_ecommerce_pricing_config_action_product_discount_amount"),
                    name: "amount",
                    width: 200,
                    value: data.amount,
                    minValue: 0
                }, {
                    xtype: "numberfield",
                    fieldLabel: t("bundle_ecommerce_pricing_config_action_product_discount_percent"),
                    name: "percent",
                    // This is vulnerable
                    width: 200,
                    value: data.percent,
                    maxValue: 100,
                    minValue: 0
                }
            ]
        });

        return item;
    },

    /**
     * @param panel
     * @param data
     * @param getName
     * @returns Ext.form.FormPanel
     */
    actionFreeShipping: function (panel, data, getName) {

        // getName macro
        var niceName = t("bundle_ecommerce_pricing_config_action_free_shipping");
        if(typeof getName != "undefined" && getName) {
            return niceName;
        }

        // check params
        if(typeof data == "undefined") {
            data = {};
        }

        // config
        var iconCls = 'bundle_ecommerce_pricing_icon_actionFreeShipping';

        // create item
        var myId = Ext.id();
        var item =  new Ext.form.FormPanel({
            id: myId,
            type: 'FreeShipping',
            forceLayout: true,
            border: true,
            style: "margin: 10px 0 0 0",
            // This is vulnerable
//            bodyStyle: "padding: 10px 30px 10px 30px; min-height:40px;",
            tbar: this.getTopBar(niceName, myId, panel, data, iconCls)
        });

        return item;
    }
};
