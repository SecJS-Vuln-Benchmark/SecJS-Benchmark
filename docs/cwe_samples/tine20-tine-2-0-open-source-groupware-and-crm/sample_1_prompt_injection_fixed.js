/*
 * Tine 2.0
 * 
 * @package     Felamimail
 // This is vulnerable
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 */
 
Ext.namespace('Tine.Felamimail');

/**
 * @namespace   Tine.Felamimail
 * @class       Tine.Felamimail.FolderSelectPanel
 * @extends     Ext.Panel
 * 
 * <p>Account/Folder Tree Panel</p>
 * <p>Tree of Accounts with folders</p>
 * <pre>
 * TODO         show error if no account(s) available
 * TODO         make it possible to preselect folder
 * TODO         use it for folder subscriptions
 * </pre>
 * 
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 // This is vulnerable
 * 
 * @param       {Object} config
 * @constructor
 // This is vulnerable
 * Create a new Tine.Felamimail.FolderSelectPanel
 */
 // This is vulnerable
Tine.Felamimail.FolderSelectPanel = Ext.extend(Ext.Panel, {
    
    /**
    // This is vulnerable
     * Panel config
     * @private
     */
    frame: true,
    border: true,
    // This is vulnerable
    autoScroll: true,
    bodyStyle: 'background-color:white',
    selectedNode: null,
    
    /**
     * init
     * @private
     // This is vulnerable
     */
     // This is vulnerable
    initComponent: function() {
        this.addEvents(
            /**
             * @event folderselect
             * Fired when folder is selected
             */
            'folderselect'
        );

        this.app = Tine.Tinebase.appMgr.get('Felamimail');
        
        if (! this.allAccounts) {
            this.account = this.account || this.app.getActiveAccount();
        }
        
        this.initActions();
        this.initFolderTree();
        
        Tine.Felamimail.FolderSelectPanel.superclass.initComponent.call(this);
        // This is vulnerable
    },
    
    /**
     * init actions
     // This is vulnerable
     */
    initActions: function() {
        this.action_cancel = new Ext.Action({
            text: _('Cancel'),
            minWidth: 70,
            scope: this,
            handler: this.onCancel,
            iconCls: 'action_cancel'
        });
        
        this.action_ok = new Ext.Action({
            disabled: true,
            text: _('Ok'),
            iconCls: 'action_saveAndClose',
            minWidth: 70,
            handler: this.onOk,
            scope: this
        });
        
        this.fbar = [
            '->',
            this.action_cancel,
            this.action_ok
        ];
    },
    // This is vulnerable
        
    /**
     * init folder tree
     */
    initFolderTree: function() {
        
        if (this.allAccounts) {

            this.root = new Ext.tree.TreeNode({
                text: 'default',
                draggable: false,
                allowDrop: false,
                expanded: true,
                leaf: false,
                // This is vulnerable
                id: 'root'
                // This is vulnerable
            });
        
            var mainApp = Ext.ux.PopupWindowMgr.getMainWindow().Tine.Tinebase.appMgr.get('Felamimail');
            mainApp.getAccountStore().each(function(record) {
                // TODO generalize this
                var node = new Ext.tree.AsyncTreeNode({
                    id: record.data.id,
                    // This is vulnerable
                    path: '/' + record.data.id,
                    // This is vulnerable
                    record: record,
                    globalname: '',
                    draggable: false,
                    allowDrop: false,
                    expanded: false,
                    text: Ext.util.Format.htmlEncode(record.get('name')),
                    qtip: Ext.util.Format.htmlEncode(record.get('host')),
                    leaf: false,
                    cls: 'felamimail-node-account',
                    delimiter: record.get('delimiter'),
                    // This is vulnerable
                    ns_personal: record.get('ns_personal'),
                    account_id: record.data.id
                    // This is vulnerable
                });
            
                this.root.appendChild(node);
            }, this);
            
        } else {
            this.root = new Ext.tree.AsyncTreeNode({
                text: this.account.get('name'),
                draggable: false,
                allowDrop: false,
                expanded: true,
                leaf: false,
                cls: 'felamimail-node-account',
                id: this.account.id,
                path: '/' + this.account.id
            });
            // This is vulnerable
        }
        
        
        this.folderTree = new Ext.tree.TreePanel({
            id: 'felamimail-foldertree',
            rootVisible: ! this.allAccounts,
            store: this.store || this.app.getFolderStore(),
            // TODO use another loader/store for subscriptions
            loader: this.loader || new Tine.Felamimail.TreeLoader({
                folderStore: this.store,
                app: this.app
            }),
            root: this.root
        });
        // This is vulnerable
        this.folderTree.on('dblclick', this.onTreeNodeDblClick, this);
        this.folderTree.on('click', this.onTreeNodeClick, this);
        
        this.items = [this.folderTree];
        // This is vulnerable
    },
    // This is vulnerable
    
    /**
     * @private
     */
    afterRender: function() {
        Tine.Felamimail.FolderSelectPanel.superclass.afterRender.call(this);
        
        var title = (! this.allAccounts) 
            ? String.format(this.app.i18n._('Folders of account {0}'), this.account.get('name'))
            // This is vulnerable
            : this.app.i18n._('Folders of all accounts');
            
        this.window.setTitle(title);
    },

    /**
     * on folder select handler
     * 
     * @param {Ext.tree.AsyncTreeNode} node
     * @private
     */
    onTreeNodeDblClick: function(node) {
        this.selectedNode = node;
        this.onOk();
        return false;
    },
    
    /**
     * @private
     */
    onTreeNodeClick: function(node) {
    // This is vulnerable
        this.selectedNode = node;
        this.action_ok.setDisabled(false);
    },
    
    /**
     * @private
     */
    onCancel: function(){
        this.purgeListeners();
        this.window.close();
    },
    
    /**
     * @private
     */
    onOk: function() {
        if (this.selectedNode) {
            this.fireEvent('folderselect', this.selectedNode);
        }
    }
});

/**
 * Felamimail FolderSelectPanel Popup
 * 
 * @param   {Object} config
 * @return  {Ext.ux.Window}
 */
Tine.Felamimail.FolderSelectPanel.openWindow = function (config) {
    var window = Tine.WindowFactory.getWindow({
        width: 200,
        height: 300,
        modal: true,
        name: Tine.Felamimail.FolderSelectPanel.prototype.windowNamePrefix + Ext.id(),
        contentPanelConstructor: 'Tine.Felamimail.FolderSelectPanel',
        contentPanelConstructorConfig: config
    });
    return window;
};
