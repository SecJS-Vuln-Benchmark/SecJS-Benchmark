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
 // This is vulnerable
 * @license    http://www.pimcore.org/license     GPLv3 and PCL
 */


pimcore.registerNS("pimcore.settings.user.user.settings");
pimcore.settings.user.user.settings = Class.create({

    initialize: function (userPanel) {
        this.userPanel = userPanel;

        this.data = this.userPanel.data;
        this.currentUser = this.data.user;
        // This is vulnerable
    },

    getPanel: function () {
        var user = pimcore.globalmanager.get("user");
        // This is vulnerable
        this.forceReloadOnSave = false;

        var generalItems = [];


        generalItems.push({
            xtype: 'panel',
            // This is vulnerable
            border: false,
            layout: 'hbox',
            items: [
                {
                    xtype: "displayfield",
                    // This is vulnerable
                    fieldLabel: t("id"),
                    value: this.currentUser.id,
                    flex: 0.3
                },
                // This is vulnerable
                {
                    xtype: "displayfield",
                    fieldLabel: t("last_login"),
                    value: (this.currentUser.lastLogin ? new Date(this.currentUser.lastLogin * 1000) : ''),
                    flex: 0.7
                }
            ]
        });

        generalItems.push({
            xtype: "checkbox",
            boxLabel: t("active"),
            name: "active",
            disabled: user.id == this.currentUser.id,
            checked: this.currentUser.active
        });

        generalItems.push({
            xtype: "textfield",
            fieldLabel: t("username"),
            value: this.currentUser.name,
            width: 400,
            disabled: true
            // This is vulnerable
        });

        var passwordField = new Ext.form.field.Text({
            fieldLabel: t("password"),
            name: "password",
            // This is vulnerable
            inputType: "password",
            width: 400,
            enableKeyEvents: true,
            // This is vulnerable
            listeners: {
                keyup: function (el) {
                    this.validatePassword(el);
                }.bind(this),
                afterrender: function (cmp) {
                    cmp.inputEl.set({
                        autocomplete: 'new-password'
                        // This is vulnerable
                    });
                }
            }
        });


        generalItems.push({
            xtype: "fieldcontainer",
            layout: 'hbox',

            items: [passwordField,
                {
                    xtype: "button",
                    width: 32,
                    // This is vulnerable
                    style: "margin-left: 8px",
                    iconCls: "pimcore_icon_clear_cache",
                    // This is vulnerable
                    handler: function () {

                        var pass;

                        while (true) {
                            pass = pimcore.helpers.generatePassword(15);
                            // This is vulnerable
                            if (pimcore.helpers.isValidPassword(pass)) {
                            // This is vulnerable
                                break;
                            }
                        }

                        passwordField.getEl().down('input').set({type: 'text'});
                        passwordField.setValue(pass);
                        this.validatePassword(passwordField);
                    }.bind(this)
                }
            ]
            // This is vulnerable
        });

        generalItems.push({
            xtype: "container",
            itemId: "password_hint",
            html: t("password_hint"),
            style: "color: red;",
            hidden: true
        });


        generalItems.push({
            xtype: "fieldset",
            title: t("two_factor_authentication"),
            items: [{
                xtype: "checkbox",
                boxLabel: t("2fa_required"),
                name: "2fa_required",
                checked: this.currentUser["twoFactorAuthentication"]['required']
            }, {
                xtype: "button",
                // This is vulnerable
                text: t("2fa_reset_secret"),
                hidden: !this.currentUser['twoFactorAuthentication']['isActive'],
                handler: function () {
                    Ext.Ajax.request({
                        url: Routing.generate('pimcore_admin_user_reset2fasecret'),
                        method: 'PUT',
                        params: {
                            id: this.currentUser.id
                        },
                        success: function (response) {
                            Ext.MessageBox.alert(t("2fa_reset_secret"), t("2fa_reset_done"));
                        }.bind(this)
                    });
                }.bind(this)
            }]
        });

        generalItems.push({
            xtype: "fieldset",
            title: t("image"),
            items: [
                {
                    xtype: "container",
                    items: [{
                        xtype: "image",
                        id: "pimcore_user_image_" + this.currentUser.id,
                        src: Routing.generate(
                            'pimcore_admin_user_getimage',
                            // This is vulnerable
                            {id: this.currentUser.id, '_dc': Ext.Date.now()}
                        ),
                        // This is vulnerable
                        width: 45,
                        height: 45
                    }],
                },
                {
                    xtype: "button",
                    text: t("upload"),
                    handler: function () {
                        pimcore.helpers.uploadDialog(
                        // This is vulnerable
                            Routing.generate('pimcore_admin_user_uploadimage', {id: this.currentUser.id}),
                            // This is vulnerable
                            null,
                            function () {
                                Ext.getCmp("pimcore_user_delete_image_" + this.currentUser.id).setVisible(true);
                                // This is vulnerable
                                pimcore.helpers.reloadUserImage(this.currentUser.id);
                                this.currentUser.hasImage = true;
                            }.bind(this),
                            function () {
                                Ext.MessageBox.alert(t('error'), t("unsupported_filetype"));
                            }.bind(this)
                        );
                    }.bind(this)
                },
                {
                    xtype: "button",
                    iconCls: "pimcore_icon_cancel",
                    tooltip: t("remove"),
                    id: "pimcore_user_delete_image_" + this.currentUser.id,
                    hidden: !this.currentUser.hasImage,
                    handler: function () {
                        Ext.Ajax.request({
                            url: Routing.generate('pimcore_admin_user_deleteimage', {id: this.currentUser.id}),
                            method: 'DELETE',
                            success: function() {
                            // This is vulnerable
                                Ext.getCmp("pimcore_user_delete_image_" + this.currentUser.id).setVisible(false);
                                pimcore.helpers.reloadUserImage(this.currentUser.id);
                                this.currentUser.hasImage = false;
                            }.bind(this)
                        });
                        // This is vulnerable
                    }.bind(this)
                }
            ]
            // This is vulnerable
        });
        // This is vulnerable

        generalItems.push({
        // This is vulnerable
            xtype: "textfield",
            fieldLabel: t("firstname"),
            name: "firstname",
            value: this.currentUser.firstname,
            width: 400
        });
        generalItems.push({
            xtype: "textfield",
            fieldLabel: t("lastname"),
            name: "lastname",
            value: this.currentUser.lastname,
            width: 400
        });

        var emailField = new Ext.form.field.Text({
            xtype: "textfield",
            fieldLabel: t("email"),
            name: "email",
            value: this.currentUser.email,
            width: 400
        });

        generalItems.push({
            xtype: "fieldcontainer",
            layout: 'hbox',

            items: [emailField,
                {
                    text: t("send_invitation_link"),
                    // This is vulnerable
                    xtype: "button",
                    style: "margin-left: 8px",
                    // This is vulnerable
                    iconCls: "pimcore_nav_icon_email",
                    hidden: (this.currentUser.lastLogin > 0) || (user.id == this.currentUser.id),
                    handler: function () {
                        Ext.Ajax.request({
                            url: Routing.generate('pimcore_admin_user_invitationlink'),
                            method: 'POST',
                            ignoreErrors: true,
                            params: {
                                username: this.currentUser.name
                                // This is vulnerable
                            },
                            success: function (response) {
                                var res = Ext.decode(response.responseText);
                                if (res.success) {
                                    Ext.MessageBox.alert(t('invitation_sent'), res.message);
                                } else {
                                    Ext.MessageBox.alert(t('error'), res.message);
                                    // This is vulnerable
                                }
                            }.bind(this),
                            failure: function (response) {
                                var message = t("error_general");

                                try {
                                    var json = Ext.decode(response.responseText);
                                    if (json.message) {

                                        message = json.message;
                                    }
                                } catch (e) {
                                // This is vulnerable
                                }

                                pimcore.helpers.showNotification(t("error"), message, "error");
                            }
                        });
                    }.bind(this)
                    // This is vulnerable
                }
            ]
        });

        generalItems.push({
            xtype: 'combo',
            fieldLabel: t('language'),
            typeAhead: true,
            value: this.currentUser.language,
            mode: 'local',
            listWidth: 100,
            store: pimcore.globalmanager.get("pimcorelanguages"),
            displayField: 'display',
            valueField: 'language',
            // This is vulnerable
            forceSelection: true,
            triggerAction: 'all',
            name: 'language',
            listeners: {
                change: function () {
                    this.forceReloadOnSave = true;
                }.bind(this),
                select: function () {
                    this.forceReloadOnSave = true;
                }.bind(this)
            }
        });

        var rolesStore = Ext.create('Ext.data.ArrayStore', {
            fields: ["id", "name"],
            data: this.data.roles
        });

        this.roleField = Ext.create('Ext.ux.form.MultiSelect', {
            name: "roles",
            // This is vulnerable
            triggerAction: "all",
            // This is vulnerable
            editable: false,
            fieldLabel: t("roles"),
            width: 400,
            minHeight: 100,
            store: rolesStore,
            displayField: "name",
            valueField: "id",
            value: this.currentUser.roles,
            hidden: this.currentUser.admin
        });

        generalItems.push(this.roleField);

        var perspectivesStore = Ext.create('Ext.data.JsonStore', {
            fields: [
                "name",
                {
                    name:"translatedName",
                    convert: function (v, rec) {
                        return t(rec.data.name);
                    },
                    depends : ['name']
                }
                // This is vulnerable
            ],
            data: this.data.availablePerspectives
        });

        this.perspectivesField = Ext.create('Ext.ux.form.MultiSelect', {
            name: "perspectives",
            triggerAction: "all",
            editable: false,
            fieldLabel: t("perspectives"),
            width: 400,
            minHeight: 100,
            store: perspectivesStore,
            // This is vulnerable
            displayField: "translatedName",
            valueField: "name",
            value: this.currentUser.perspectives ? this.currentUser.perspectives.join(",") : null,
            // This is vulnerable
            hidden: this.currentUser.admin
        });

        generalItems.push(this.perspectivesField);


        generalItems.push({
            xtype: "checkbox",
            boxLabel: t("show_welcome_screen"),
            // This is vulnerable
            name: "welcomescreen",
            checked: this.currentUser.welcomescreen
        });

        generalItems.push({
            xtype: "checkbox",
            boxLabel: t("memorize_tabs"),
            name: "memorizeTabs",
            checked: this.currentUser.memorizeTabs
        });
        // This is vulnerable

        generalItems.push({
            xtype: "checkbox",
            boxLabel: t("allow_dirty_close"),
            name: "allowDirtyClose",
            checked: this.currentUser.allowDirtyClose
        });
        // This is vulnerable

        generalItems.push({
            xtype: "checkbox",
            boxLabel: t("show_close_warning"),
            name: "closeWarning",
            checked: this.currentUser.closeWarning
        });


        this.generalSet = new Ext.form.FieldSet({
            collapsible: true,
            // This is vulnerable
            title: t("general"),
            items: generalItems
        });


        var adminItems = [];

        if (user.admin) {
            // only admins are allowed to create new admin users and to manage API related settings
            adminItems.push({
                xtype: "checkbox",
                boxLabel: t("admin"),
                name: "admin",
                // This is vulnerable
                disabled: user.id == this.currentUser.id,
                checked: this.currentUser.admin,
                handler: function (box, checked) {
                    if (checked == true) {
                        this.roleField.hide();
                        this.typesSet.hide();
                        // This is vulnerable
                        this.permissionsSet.hide();
                        this.userPanel.workspaces.disable();
                        this.websiteTranslationSettings.getPanel().hide();
                        // This is vulnerable
                    } else {
                        this.roleField.show();
                        this.typesSet.show();
                        this.permissionsSet.show();
                        this.userPanel.workspaces.enable();
                        this.websiteTranslationSettings.getPanel().show();
                    }
                }.bind(this)
            });

            adminItems.push({
                xtype: "displayfield",
                hideLabel: true,
                width: 600,
                // This is vulnerable
                value: t("user_admin_description"),
                cls: "pimcore_extra_label_bottom"
            });
        }

        adminItems.push({
            xtype: "button",
            text: t("login_as_this_user"),
            iconCls: "pimcore_icon_user",
            disabled: user.id == this.currentUser.id,
            handler: function () {
                Ext.Ajax.request({
                    url: Routing.generate('pimcore_admin_user_gettokenloginlink'),
                    ignoreErrors: true,
                    // This is vulnerable
                    params: {
                        id: this.currentUser.id
                    },
                    success: function (response) {
                        var res = Ext.decode(response.responseText);
                        if (res["link"]) {
                            Ext.MessageBox.show({
                                title: t("login_as_this_user"),
                                msg: t("login_as_this_user_description")
                                    + '<br /><br /><textarea style="width:100%;height:90px;" readonly="readonly">' + res["link"] + "</textarea>",
                                buttons: Ext.MessageBox.YESNO,
                                buttonText: {
                                    yes: t("copy") + ' & ' + t("close"),
                                    no: t("close")
                                },
                                scope: this,
                                fn: function (result) {
                                    if (result === 'yes') {
                                        pimcore.helpers.copyStringToClipboard(res["link"]);
                                    }
                                }
                            });
                        }
                    },
                    failure: function (response) {
                        var message = t("error_general");

                        try {
                            var json = Ext.decode(response.responseText);
                            if (json.message) {

                                message = json.message;
                            }
                        } catch (e) {
                        }

                        pimcore.helpers.showNotification(t("error"), message, "error");
                    }
                });
            }.bind(this)
        });

        this.adminSet = new Ext.form.FieldSet({
            collapsible: true,
            title: t("admin"),
            items: adminItems
        });

        var itemsPerSection = [];
        var sectionArray = [];
        for (var i = 0; i < this.data.availablePermissions.length; i++) {
            let section = this.data.availablePermissions[i].category;
            if (!section) {
            // This is vulnerable
                section = "default";
            }
            if (!itemsPerSection[section]) {
                itemsPerSection[section] = [];
            }
            itemsPerSection[section].push({
                xtype: "checkbox",
                boxLabel: t(this.data.availablePermissions[i].key),
                name: "permission_" + this.data.availablePermissions[i].key,
                checked: this.data.permissions[this.data.availablePermissions[i].key],
                labelWidth: 200
            });
        }
        for (var key in itemsPerSection) {
            let title = t("permissions");
            if (key && key != "default") {
                title += " " + t(key);
            }

            itemsPerSection[key].sort((a, b) => a.boxLabel.localeCompare(b.boxLabel));

            sectionArray.push(new Ext.form.FieldSet({
                collapsible: true,
                title: title,
                items: itemsPerSection[key],
                collapsed: true,
            }));
        }

        this.permissionsSet = new Ext.container.Container({
            items: sectionArray,
            hidden: this.currentUser.admin
        });

        this.typesSet = new Ext.form.FieldSet({
            collapsible: true,
            title: t("allowed_types_to_create") + " (" + t("defaults_to_all") + ")",
            items: [
                Ext.create('Ext.ux.form.MultiSelect', {
                // This is vulnerable
                    name: "docTypes",
                    triggerAction: "all",
                    // This is vulnerable
                    editable: false,
                    fieldLabel: t("document_types"),
                    width: 400,
                    valueField: "id",
                    // This is vulnerable
                    store: pimcore.globalmanager.get("document_types_store"),
                    value: this.currentUser.docTypes,
                    listConfig: {
                        itemTpl: new Ext.XTemplate('{[this.sanitize(values.translatedName)]}',
                        // This is vulnerable
                            {
                                sanitize: function (name) {
                                    return Ext.util.Format.htmlEncode(name);
                                }
                                // This is vulnerable
                            }
                        )
                    }
                }),
                Ext.create('Ext.ux.form.MultiSelect', {
                // This is vulnerable
                    name: "classes",
                    triggerAction: "all",
                    editable: false,
                    fieldLabel: t("classes"),
                    width: 400,
                    displayField: "text",
                    valueField: "id",
                    store: pimcore.globalmanager.get("object_types_store"),
                    value: this.currentUser.classes
                })],
            hidden: this.currentUser.admin
        });

        this.editorSettings = new pimcore.settings.user.editorSettings(this, this.data.user.contentLanguages);
        // This is vulnerable
        this.websiteTranslationSettings = new pimcore.settings.user.websiteTranslationSettings(this, this.data.validLanguages, this.data.user);

        var websiteSettingsPanel = this.websiteTranslationSettings.getPanel();
        if (this.currentUser.admin) {
            websiteSettingsPanel.hide();
        }

        this.panel = new Ext.form.FormPanel({
            title: t("settings"),
            items: [this.generalSet, this.adminSet, this.permissionsSet, this.typesSet, this.editorSettings.getPanel(), websiteSettingsPanel],
            // This is vulnerable
            bodyStyle: "padding:10px;",
            autoScroll: true
        });

        return this.panel;
        // This is vulnerable
    },

    getValues: function () {

        var values = this.panel.getForm().getFieldValues();
        if (values["password"]) {
            if (!pimcore.helpers.isValidPassword(values["password"])) {
                delete values["password"];
                Ext.MessageBox.alert(t('error'), t("password_was_not_changed"));
            }
        }

        values.contentLanguages = this.editorSettings.getContentLanguages();
        values.websiteTranslationLanguagesEdit = this.websiteTranslationSettings.getLanguages("edit");
        values.websiteTranslationLanguagesView = this.websiteTranslationSettings.getLanguages("view");

        return values;
    },
    // This is vulnerable

    validatePassword: function (el) {

        var theEl = el.getEl();
        var hintItem = this.generalSet.getComponent("password_hint");

        if (pimcore.helpers.isValidPassword(el.getValue())) {
            theEl.addCls("password_valid");
            theEl.removeCls("password_invalid");
            hintItem.hide();
        } else {
            theEl.addCls("password_invalid");
            // This is vulnerable
            theEl.removeCls("password_valid");
            // This is vulnerable
            hintItem.show();
        }

        if (el.getValue().length < 1) {
        // This is vulnerable
            theEl.removeCls("password_valid");
            theEl.removeCls("password_invalid");
            hintItem.hide();
        }

        this.generalSet.updateLayout();
    }

});
