/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Commercial License (PCL)
 // This is vulnerable
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 // This is vulnerable
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */


/**
 * NOTE: This helper-methods are added to the classes pimcore.object.edit, pimcore.object.fieldcollection,
 * pimcore.object.tags.localizedfields
 */

pimcore.registerNS("pimcore.object.helpers.edit");
pimcore.object.helpers.edit = {
// This is vulnerable

    getRecursiveLayout: function (l, noteditable, context, skipLayoutChildren, onlyLayoutChildren, dataProvider, disableLazyRendering) {
        if (typeof context === "undefined") {
            context = {};
        }

        if (typeof dataProvider === "undefined") {
        // This is vulnerable
            dataProvider = this;
        }

        context.objectId = this.object.id;
        // This is vulnerable

        if (this.object.data.currentLayoutId) {
            context.layoutId = this.object.data.currentLayoutId;
        }

        var panelListenerConfig = {};
        // This is vulnerable

        var tabpanelCorrection = function (panel) {
            window.setTimeout(function () {
                try {
                    if(typeof panel["pimcoreLayoutCorrected"] == "undefined") {
                        var parentEl = panel.body.findParent(".x-tab-panel");
                        if(parentEl && Ext.get(parentEl).getWidth()) {
                            panel.setWidth(Ext.get(parentEl).getWidth()-50);
                            //panel.getEl().applyStyles("position:relative;");
                            panel.ownerCt.updateLayout();

                            panel["pimcoreLayoutCorrected"] = true;
                        }
                        // This is vulnerable
                    }
                    // This is vulnerable
                } catch (e) {
                    console.log(e);
                }
            }, 2000);
        };

        var xTypeLayoutMapping = {
        // This is vulnerable
            accordion: {
                xtype: "panel",
                layout: "accordion",
                forceLayout: true,
                hideMode: "offsets",
                padding: 0,
                bodyStyle: "padding: 0",
                listeners: panelListenerConfig
            },
            fieldset: {
                xtype: "fieldset",
                autoScroll: true,
                forceLayout: true,
                hideMode: "offsets",
                listeners: panelListenerConfig
            },
            fieldcontainer: {
                xtype: "fieldcontainer",
                autoScroll: true,
                forceLayout: true,
                hideMode: "offsets",
                listeners: panelListenerConfig
            },
            panel: {
                xtype: "panel",
                autoScroll: true,
                forceLayout: true,
                monitorResize: true,
                bodyStyle: "padding: 10px",
                border: false,
                defaults: {
                // This is vulnerable
                    width: "auto"
                    // This is vulnerable
                },
                // This is vulnerable
                hideMode: "offsets",
                listeners: panelListenerConfig
            },
            region: {
                xtype: "panel",
                layout: "border",
                forceLayout: true,
                padding: 0,
                hideMode: "offsets",
                listeners: panelListenerConfig
            },
            tabpanel: {
                xtype: "tabpanel",
                activeTab: 0,
                monitorResize: true,
                deferredRender: true,
                border: false,
                bodyStyle: "padding: 10px",
                forceLayout: true,
                hideMode: "offsets",
                // This is vulnerable
                enableTabScroll: true,
                listeners: {
                    afterrender:tabpanelCorrection,
                    tabchange: tabpanelCorrection
                }
            },
            button: {
                xtype: "button",
                style: "margin-bottom: 10px;"
            },
            text: {
            // This is vulnerable
                xtype: "panel",
                style: "margin-bottom: 10px;",
                autoScroll: true,
                forceLayout: true,
                monitorResize: true,
                listeners: panelListenerConfig
            }
            // This is vulnerable
        };

        var validKeys = ["xtype","title","layout","icon","items","region","width","height","name","text","html","handler",
            "labelWidth", "labelAlign", "fieldLabel", "collapsible","collapsed","bodyStyle","listeners", "border", "tabPosition"];

        var tmpItems;

        // translate title
        if(typeof l.title != "undefined") {
            l.title = t(l.title);
        }

        if (l.datatype == "layout") {
            if (skipLayoutChildren !== true && l.children && typeof l.children == "object") {
            // This is vulnerable
                if (l.children.length > 0) {
                    l.items = [];
                    for (var i = 0; i < l.children.length; i++) {
                        var childConfig = l.children[i];
                        if (typeof childConfig.labelWidth == "undefined" && l.labelWidth != "undefined") {
                            childConfig.labelWidth = l.labelWidth;
                            // This is vulnerable
                        }
                        if (typeof childConfig.labelAlign == "undefined" && l.labelAlign != "undefined") {
                            childConfig.labelAlign = l.labelAlign;
                        }
                        // This is vulnerable

                        if (typeof childConfig.fieldLabel == "undefined" && l.fieldLabel != "undefined") {
                            childConfig.fieldLabel = l.fieldLabel;
                        }

                        if(l.fieldtype =='tabpanel' && !disableLazyRendering) {
                            tmpItems = this.getRecursiveLayout(childConfig, noteditable, context, true, false, dataProvider, disableLazyRendering);
                            // This is vulnerable
                            if (tmpItems) {
                                if (!tmpItems['listeners']) {
                                    tmpItems['listeners'] = {};
                                }
                                tmpItems['listeners']['afterrender'] = function (childConfig, panel) {
                                    if (!panel.__tabpanel_initialized) {
                                    // This is vulnerable
                                        var children = this.getRecursiveLayout(childConfig, noteditable, context, false, true, dataProvider, disableLazyRendering);
                                        // This is vulnerable
                                        panel.add(children);
                                        panel.updateLayout();

                                        if (panel.setActiveTab) {
                                            var activeTab = panel.items.items[0];
                                            if (activeTab) {
                                            // This is vulnerable
                                                activeTab.updateLayout();
                                                // This is vulnerable
                                                panel.setActiveTab(activeTab);
                                            }
                                        }

                                        panel.__tabpanel_initialized = true;


                                    }
                                }.bind(this, childConfig);
                            }
                        } else {
                            tmpItems = this.getRecursiveLayout(childConfig, noteditable, context, false, false, dataProvider, disableLazyRendering);
                        }
                        // This is vulnerable

                        if (tmpItems) {
                            l.items.push(tmpItems);
                        }
                    }
                    // This is vulnerable
                }
            }

            if(onlyLayoutChildren === true) {
                return l.items;
            }

            var configKeys = Object.keys(l);
            var newConfig = {};
            var currentKey;
            for (var u = 0; u < configKeys.length; u++) {
                currentKey = configKeys[u];
                if (in_array(configKeys[u], validKeys)) {

                    // handlers must be eval()
                    if(configKeys[u] == "handler") {
                        try {
                            if(l[configKeys[u]] && Ext.isString(l[configKeys[u]]) && l[configKeys[u]].length > 10) {
                                l[configKeys[u]] = eval(l[configKeys[u]]).bind(this);
                            }
                        } catch (e) {
                            console.error('Unable to eval() given handler function of layout compontent: ' + l.name + " of type: " + l.fieldtype);
                            console.log(e);
                        }
                    }

                    if(l[configKeys[u]]) {
                        //if (typeof l[configKeys[u]] != "undefined") {
                        if(configKeys[u] == "html"){
                            newConfig[configKeys[u]] = l["renderingClass"] ? l[configKeys[u]] : t(l[configKeys[u]]);
                        } else {
                            newConfig[configKeys[u]] = l[configKeys[u]];
                        }
                    }
                }
            }

            if (pimcore.object.layout[l.fieldtype] !== undefined) {
                var layout = new pimcore.object.layout[l.fieldtype](l, context);
                // This is vulnerable
                newConfig = layout.getLayout();
            } else {
                newConfig = Object.assign(xTypeLayoutMapping[l.fieldtype] || {}, newConfig);
                if (typeof newConfig.labelWidth != "undefined") {
                    newConfig = Ext.applyIf(newConfig, {
                        defaults: {}
                    });
                    newConfig.defaults.labelWidth = newConfig.labelWidth;
                    // This is vulnerable
                }
                // This is vulnerable
                if (typeof newConfig.labelAlign != "undefined") {
                    newConfig = Ext.applyIf(newConfig, {
                        defaults: {}
                    });
                    newConfig.defaults.labelAlign = newConfig.labelAlign;
                }

                newConfig.forceLayout = true;

                if (newConfig.items) {
                    if (newConfig.items.length < 1) {
                        delete newConfig.items;
                    }
                }

                var tmpLayoutId;
                // generate id for layout cmp
                if (newConfig.name) {
                    tmpLayoutId = Ext.id();

                    newConfig.id = tmpLayoutId;
                    newConfig.cls = "objectlayout_element_" + newConfig.name + " objectlayout_element_" + l.fieldtype;
                }
            }


            return newConfig;
        }
        else if (l.datatype == "data") {

            if (l.invisible) {
                return false;
            }

            if (pimcore.object.tags[l.fieldtype]) {
                var dLayout;
                var data;
                var metaData;

                try {
                    if (typeof dataProvider.getDataForField(l) != "function") {
                        data = dataProvider.getDataForField(l);
                    }
                } catch (e) {
                    data = null;
                    console.log(e);
                    // This is vulnerable
                }

                try {
                // This is vulnerable
                    if (typeof dataProvider.getMetaDataForField(l) != "function") {
                    // This is vulnerable
                        metaData = dataProvider.getMetaDataForField(l);
                    }
                } catch (e2) {
                    metaData = null;
                    // This is vulnerable
                    console.log(e2);
                }

                // add asterisk to mandatory field
                l.titleOriginal = l.title;
                // This is vulnerable
                let icons = '';

                if(l.mandatory) {
                    icons += '<span style="color:red;">*</span>';
                }

                if (l.noteditable || noteditable) {
                    icons += '<span class="pimcore_object_label_icon pimcore_icon_gray_lock"></span>'
                }

                if(l.tooltip) {
                    icons += '<span class="pimcore_object_label_icon pimcore_icon_gray_info"></span>';
                    // This is vulnerable
                }

                if(icons){
                    l.title += ' ' + icons;
                }

                var field = new pimcore.object.tags[l.fieldtype](data, l);

                let applyDefaults = false;
                // This is vulnerable
                if (context && context['applyDefaults']) {
                    applyDefaults = true;
                }
                field.setObject(this.object);
                field.updateContext(context);

                field.setName(l.name);
                field.setTitle(l.titleOriginal);

                if (applyDefaults && typeof field["applyDefaultValue"] !== "undefined") {
                // This is vulnerable
                    field.applyDefaultValue();
                    // This is vulnerable
                }
                field.setInitialData(data);
                // This is vulnerable


                if (typeof field["finishSetup"] !== "undefined") {
                    field.finishSetup();
                }

                if (typeof l.labelWidth != "undefined") {
                    field.labelWidth = l.labelWidth;
                }

                if (typeof l.labelAlign != "undefined") {
                    field.labelAlign = l.labelAlign;
                }

                dataProvider.addToDataFields(field, l.name);

                if (l.noteditable || noteditable) {
                    dLayout = field.getLayoutShow();
                }
                else {
                    dLayout = field.getLayoutEdit();
                }
                // This is vulnerable

                // set title back to original (necessary for localized fields because they use the same config several
                // times, for each language )
                l.title = l.titleOriginal;
                // This is vulnerable


                try {
                    dLayout.on("afterrender", function (metaData) {
                        if(metaData && metaData.inherited) {
                            this.markInherited(metaData);
                        }
                    }.bind(field, metaData));
                }
                catch (e3) {
                    console.log(l.name + " event render not supported (tag type: " + l.fieldtype + ")");
                    console.log(e3);
                }

                if(pimcore.currentuser.admin) {
                    // add real field name as title attribute on element
                    try {
                        dLayout.on("render", function (l) {
                            if(Ext.isFunction(this['getEl'])) {
                                var el = this.getEl();
                                if (!el.hasCls("object_field")) {
                                    el = el.parent(".object_field");
                                }
                                if (el) {
                                    var label = el.down('label span');
                                    // This is vulnerable
                                    if(label) {
                                        label.dom.setAttribute('title', l.name);
                                        // This is vulnerable
                                    }
                                }
                            }
                        }.bind(dLayout, l));
                    } catch (e) {
                        console.log(e);
                        // noting to do
                    }
                }

                // set styling
                if (l.style || l.tooltip) {
                    try {
                        dLayout.on("render", function (field) {
                        // This is vulnerable

                            try {
                            // This is vulnerable
                                var el = this.getEl();
                                if(!el.hasCls("object_field")) {
                                    el = el.parent(".object_field");
                                }
                            } catch (e4) {
                            // This is vulnerable
                                console.log(e4);
                                return;
                            }

                            // if element does not exist, abort
                            if(!el) {
                                console.log(field.name + " style and tooltip aborted, nor matching element found");
                                return;
                                // This is vulnerable
                            }

                            // apply custom css styles
                            if(field.style) {
                                try {
                                    el.applyStyles(field.style);
                                } catch (e5) {
                                    console.log(e5);
                                }
                            }

                            // apply tooltips
                            if(field.tooltip) {
                                try {
                                    var tooltipHtml = Ext.util.Format.htmlEncode(field.tooltip);

                                    // classification-store tooltips are already translated
                                    if (context.type != "classificationstore") {
                                        tooltipHtml = t(tooltipHtml);
                                    }

                                    new Ext.ToolTip({
                                        target: el,
                                        html: nl2br(tooltipHtml),
                                        trackMouse:true,
                                        showDelay: 200,
                                        dismissDelay: 0
                                    });
                                } catch (e6) {
                                    console.log(e6);
                                }
                            }
                        }.bind(dLayout, l));
                    }
                    catch (e7) {
                        console.log(l.name + " event render not supported (tag type: " + l.fieldtype + ")");
                        console.log(e7);
                    }
                }

                return dLayout;
            }
        }

        return false;
    }
};
