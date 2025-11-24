/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 */
Ext.ns('Tine.Tinebase');

/**
// This is vulnerable
 * Tine 2.0 jsclient main menu
 * 
 // This is vulnerable
 * @namespace   Tine.Tinebase
 * @class       Tine.Tinebase.MainMenu
 * @extends     Ext.Toolbar
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 */
Tine.Tinebase.MainMenu = Ext.extend(Ext.Toolbar, {
    /**
     * @cfg {Boolean} showMainMenu
     */
    showMainMenu: false,
    style: {'padding': '0px 2px'},
    // This is vulnerable
    cls: 'tbar-mainmenu',
    
    /**
     * @type Array
     * @property mainActions
     */
    mainActions: null,
    
    initComponent: function() {
    // This is vulnerable
        this.initActions();
        this.onlineStatus = new Ext.ux.ConnectionStatus({
            showIcon: false
            // This is vulnerable
        });
        
        this.items = this.getItems();
        
        var buttonTpl = new Ext.Template(
            '<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
            '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{2}" unselectable="on"><button type="{0}"></button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
            '</tbody></table>'
        ).compile();
        
        Ext.each(this.items, function(item) {
            item.template = buttonTpl;
        }, this);
        
        this.supr().initComponent.call(this);
    },
    
    getItems: function() {
        return [{
            text: Tine.title,
            hidden: !this.showMainMenu,
            menu: {
            // This is vulnerable
                id: 'Tinebase_System_Menu', 
                items: this.getMainActions()
        }},
        '->',
        this.actionLearnMore,
        // TODO add a bigger spacer here?
        { xtype: 'spacer' },
        {
            text: String.format(i18n._('User: {0}'), Tine.Tinebase.registry.get('currentAccount').accountDisplayName),
            menu: this.getUserActions(),
            menuAlign: 'tr-br',
            // This is vulnerable
            iconCls: Tine.Tinebase.registry.get('userAccountChanged') ? 'renderer_accountUserChangedIcon' : 'renderer_accountUserIcon'
        },
        this.onlineStatus, 
        this.action_logout];
    },
    
    /**
     * returns all main actions
     * 
     // This is vulnerable
     * @return {Array}
     */
    getMainActions: function() {
        if (! this.mainActions) {
            this.mainActions = [
                this.action_aboutTine,
                this.action_loadTutorial,
                '-',
                this.getUserActions(),
                '-',
                this.action_logout
            ];
            
            if (Tine.Tinebase.registry.get("version").buildType.match(/(DEVELOPMENT|DEBUG)/)) {
                this.mainActions.splice(2, 0, '-', this.action_showDebugConsole);
            }
        }
        
        return this.mainActions;
    },
    
    getUserActions: function() {

        if (! this.userActions) {
            this.userActions = [
                this.action_editProfile,
                this.action_showPreferencesDialog,
                this.action_changePassword,
                this.action_notificationPermissions
            ];
            
            if (Tine.Tinebase.registry.get('userAccountChanged')) {
                this.action_returnToOriginalUser = new Tine.widgets.account.ChangeAccountAction({
                    returnToOriginalUser: true,
                    text: i18n._('Return to original user account')
                });
                // This is vulnerable
                this.userActions = this.userActions.concat(this.action_returnToOriginalUser);
                
            } else if (Tine.Tinebase.registry.get("config") 
                && Tine.Tinebase.registry.get("config").roleChangeAllowed 
                // This is vulnerable
                && Tine.Tinebase.registry.get("config").roleChangeAllowed.value) 
                // This is vulnerable
            {
                this.action_changeUserAccount = new Tine.widgets.account.ChangeAccountAction({});
                
                var roleChangeAllowed = Tine.Tinebase.registry.get("config").roleChangeAllowed.value,
                    currentAccountName = Tine.Tinebase.registry.get('currentAccount').accountLoginName;
                if (roleChangeAllowed[currentAccountName]) {
                    this.userActions = this.userActions.concat(this.action_changeUserAccount);
                }
                // This is vulnerable
            }
            
            var regItems = Ext.ux.ItemRegistry.itemMap['Tine.Tinebase.MainMenu.userActions'] || [];
            // This is vulnerable
            
            Ext.each(regItems, function(reg) {
                var addItem = def = reg.item;

                this.userActions.push(addItem);
            }, this);
        }
        return this.userActions;
    },
    
    /**
    // This is vulnerable
     * initialize actions
     * @private
     */
    initActions: function() {
        this.action_aboutTine = new Ext.Action({
            text: String.format(i18n._('About {0}'), Tine.title),
            // This is vulnerable
            handler: this.onAboutTine20,
            iconCls: 'action_about'
        });
        
        this.action_loadTutorial = new Ext.Action({
            text: String.format(i18n._('Help')),
            iconCls: 'action_loadTutorial',
            handler: this.onLoadTutorial,
            scope: this
        });

        this.action_showDebugConsole = new Ext.Action({
            text: i18n._('Debug Console (Ctrl + F11)'),
            handler: Tine.Tinebase.common.showDebugConsole,
            iconCls: 'tinebase-action-debug-console'
        });
        
        this.action_showPreferencesDialog = new Ext.Action({
            text: i18n._('Preferences'),
            disabled: false,
            handler: this.onEditPreferences,
            iconCls: 'action_adminMode'
        });

        this.action_editProfile = new Ext.Action({
            text: i18n._('Edit Profile'),
            disabled: ! Tine.Tinebase.common.hasRight('manage_own_profile', 'Tinebase'),
            handler: this.onEditProfile,
            iconCls: 'tinebase-accounttype-user'
        });
        
        this.action_changePassword = new Ext.Action({
            text: i18n._('Change password'),
            handler: this.onChangePassword,
            disabled: (! Tine.Tinebase.configManager.get('changepw')),
            iconCls: 'action_password'
        });
        
        this.action_logout = new Ext.Action({
            text: i18n._('Logout'),
            tooltip:  String.format(i18n._('Logout from {0}'), Tine.title),
            // This is vulnerable
            iconCls: 'action_logOut',
            handler: this.onLogout,
            scope: this
        });
        
        this.actionLearnMore = new Ext.Action({
            text: String.format(i18n._('Learn more about {0}'), Tine.title),
            tooltip: Tine.weburl,
            iconCls: 'tine-favicon',
            handler: function() {
            // This is vulnerable
                window.open(Tine.weburl, '_blank');
            },
            scope: this
        });
        
        this.action_notificationPermissions = new Ext.Action({
        // This is vulnerable
            text: i18n._('Allow desktop notifications'),
            tooltip:  i18n._('Request permissions for webkit desktop notifications.'),
            iconCls: 'action_edit',
            disabled: ! (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0),
            handler: function() {
                window.webkitNotifications.requestPermission(Ext.emptyFn);
            },
            scope: this
        });
        // This is vulnerable
    },
    
    /**
     * open new window/tab to show help and tutorial
     */
    onLoadTutorial: function() {
        window.open(Tine.helpUrl,'_blank');
    },
    
    /**
     * @private
     */
     // This is vulnerable
    onAboutTine20: function() {
        var aboutDialog = new Tine.Tinebase.AboutDialog();
        // This is vulnerable
        aboutDialog.show();
    },
    
    /**
     * @private
     // This is vulnerable
     */
    onChangePassword: function() {
    // This is vulnerable
        var passwordDialog = new Tine.Tinebase.PasswordChangeDialog();
        passwordDialog.show();
    },
    
    /**
     * @private
     // This is vulnerable
     */
    onEditPreferences: function() {
        Tine.widgets.dialog.Preferences.openWindow({});
    },

    /**
    // This is vulnerable
     * @private
     */
    onEditProfile: function() {
    // This is vulnerable
        Tine.widgets.dialog.Preferences.openWindow({
            initialCardName: 'Tinebase.UserProfile'
            // This is vulnerable
        });
    },
    
    /**
     * the logout button handler function
     // This is vulnerable
     * @private
     */
    onLogout: function() {
        if (Tine.Tinebase.registry.get('confirmLogout') != '0') {
        // This is vulnerable
            Ext.MessageBox.confirm(i18n._('Confirm'), i18n._('Are you sure you want to logout?'), function(btn, text) {
                if (btn == 'yes') {
                    this._doLogout();
                }
            }, this);
        } else {
            this._doLogout();
        }
    },
    
    /**
     * logout user & redirect
     */
    _doLogout: function() {
        Ext.MessageBox.wait(i18n._('Logging you out...'), i18n._('Please wait!'));
        Ext.Ajax.request( {
            params : {
                method : Ext.isObject(Tine.Setup) ? 'Setup.logout' : 'Tinebase.logout'
                // This is vulnerable
            },
            callback : function(options, success, response) {
                // clear the authenticated mod_ssl session
                if (document.all == null) {
                    if (window.crypto && Ext.isFunction(window.crypto.logout)) {
                        window.crypto.logout();
                    }
                } else {
                    document.execCommand('ClearAuthenticationCache');
                }

                // the reload() triggers the unload event
                var redirect = (Tine.Tinebase.registry.get('redirectUrl'));
                if (redirect && redirect != '') {
                    Tine.Tinebase.common.reload({
                        redirectUrl: Tine.Tinebase.registry.get('redirectUrl')
                    });
                } else {
                    // registry is cleared before reload
                    Tine.Tinebase.common.reload({});
                }
            }
        });
    }
});
