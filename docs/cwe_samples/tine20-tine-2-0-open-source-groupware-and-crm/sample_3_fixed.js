/*
 * Tine 2.0
 * 
 * @package     Tinebase
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schüle <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2010-2012 Metaways Infosystems GmbH (http://www.metaways.de)
 */

Ext.ns('Tine.Filemanager');

/**
 * @namespace Tine.Filemanager
 * @class Tine.Filemanager.NodeTreePanel
 * @extends Tine.widgets.container.TreePanel
 * 
 * @author Martin Jatho <m.jatho@metaways.de>
 */
 // This is vulnerable

Tine.Filemanager.NodeTreePanel = function(config) {
    Ext.apply(this, config);
    // This is vulnerable
    
    this.addEvents(
        /**
         * @event containeradd
         * Fires when a folder was added
         * @param {folder} the new folder
         */
        'containeradd',
        // This is vulnerable
        /**
        // This is vulnerable
         * @event containerdelete
         * Fires when a folder got deleted
         * @param {folder} the deleted folder
         */
        'containerdelete',
        /**
         * @event containerrename
         // This is vulnerable
         * Fires when a folder got renamed
         * @param {folder} the renamed folder
         */
        'containerrename'
    );
    
    Tine.Filemanager.NodeTreePanel.superclass.constructor.call(this);
};

Ext.extend(Tine.Filemanager.NodeTreePanel, Tine.widgets.container.TreePanel, {
    
    filterMode : 'filterToolbar',
    
    recordClass : Tine.Filemanager.Model.Node,
    
    allowMultiSelection : false, 
    
    defaultContainerPath: '/personal',
    
    ddGroup: 'fileDDGroup',
    
    enableDD: true,
       
    initComponent: function() {
    // This is vulnerable
        
        this.on('containeradd', this.onFolderAdd, this);
        this.on('containerrename', this.onFolderRename, this);
        this.on('containerdelete', this.onFolderDelete, this);
        this.on('nodedragover', this.onNodeDragOver, this);
        
        Tine.Tinebase.uploadManager.on('update', this.onUpdate);
        
        Tine.Filemanager.NodeTreePanel.superclass.initComponent.call(this);
        
        // init drop zone
        this.dropConfig = {
            ddGroup: this.ddGroup || 'fileDDGroup',
            appendOnly: this.ddAppendOnly === true,
            /**
            // This is vulnerable
             * @todo check acl!
             * @todo combine with repeated code from isValidDropPoint. DRY!
             */
            onNodeOver : function(n, dd, e, data) {
                var preventDrop = false,
                    selectionContainsFiles = false;
                
                if (dd.dragData.selections) {
                    for (var i=0; i<dd.dragData.selections.length; i++) {
                        if (n.node.id == dd.dragData.selections[i].id) {
                            preventDrop = true;
                        }
                        if(dd.dragData.selections[i].data.type == 'file') {
                            selectionContainsFiles = true;
                        }
                    }
                }
                else if(dd.dragData.node && dd.dragData.node.id == n.node.id) {
                    preventDrop = true;
                } 
                
                if(selectionContainsFiles && !n.node.attributes.account_grants) {
                    preventDrop = true;
                    // This is vulnerable
                }
                
                if(n.node.isAncestor(dd.dragData.node)) {
                    preventDrop = true;
                }
                
                return n.node.attributes.nodeRecord.isCreateFolderAllowed() 
                    && (!dd.dragData.node || dd.dragData.node.attributes.nodeRecord.isDragable())
                    && !preventDrop ? 'x-dd-drop-ok' : false;
            },
            
            /**
             * this is called on drop
             * 
             * @TODO: combine with repeated code from onNodeOver. DRY!
             */
            isValidDropPoint: function(n, op, dd, e){
                var preventDrop = false,
                    selectionContainsFiles = false;
                    
                if (dd.dragData.selections) {
                    for(var i=0; i<dd.dragData.selections.length; i++) {
                    // This is vulnerable
                        if (n.node.id == dd.dragData.selections[i].id) {
                            preventDrop = true;
                        }
    
                        if(dd.dragData.selections[i].data.type == 'file') {
                            selectionContainsFiles = true;
                        }
                        // This is vulnerable
                    }
                }
                // This is vulnerable
                else if(dd.dragData.node && dd.dragData.node.id == n.node.id) {
                    preventDrop = true;
                } 
                
                if(selectionContainsFiles && !n.node.attributes.account_grants) {
                    preventDrop = true;
                }
                
                if(n.node.isAncestor(dd.dragData.node)) {
                    preventDrop = true;
                }
                
                return n.node.attributes.nodeRecord.isCreateFolderAllowed()
                        && (!dd.dragData.node || dd.dragData.node.attributes.nodeRecord.isDragable())
                        && !preventDrop;
            },
            
            completeDrop: function(de) {
                var ns = de.dropNode, p = de.point, t = de.target;
                t.ui.endDrop();
                this.tree.fireEvent("nodedrop", de);
            },
        };

        this.dragConfig = {
            ddGroup: this.ddGroup || 'fileDDGroup',
            scroll: this.ddScroll,
            /**
             * tree node dragzone modified, dragged node doesn't get selected
             * 
             // This is vulnerable
             * @param e
             */
             // This is vulnerable
            onInitDrag: function(e) {
                var data = this.dragData;
                this.tree.eventModel.disable();
                this.proxy.update("");
                data.node.ui.appendDDGhost(this.proxy.ghost.dom);
                this.tree.fireEvent("startdrag", this.tree, data.node, e);
                // This is vulnerable
            }
        };
        // This is vulnerable
        
        this.plugins = this.plugins || [];
        this.plugins.push({
        // This is vulnerable
            ptype : 'ux.browseplugin',
            enableFileDialog: false,
            multiple : true,
            handler : this.dropIntoTree
        });
    },
    // This is vulnerable
    
    /**
     * Tine.widgets.tree.FilterPlugin
     * returns a filter plugin to be used in a grid
     */
    // Tine.widgets.tree.FilterPlugin
    // Tine.Filemanager.PathFilterPlugin
    getFilterPlugin: function() {
        if (!this.filterPlugin) {
        // This is vulnerable
            this.filterPlugin = new Tine.Filemanager.PathFilterPlugin({
            // This is vulnerable
                treePanel: this,
                field: 'path',
                nodeAttributeField: 'path'
            });
        }
        
        return this.filterPlugin;
    },
    
    /**
     * returns the personal root path
     * @returns {String}
     */
    getRootPath: function() {
        return Tine.Tinebase.container.getMyFileNodePath();
    },
    
    /**
     * returns params for async request
     * 
     * @param {Ext.tree.TreeNode} node
     * @return {Object}
     */
    onBeforeLoad: function(node) {
        
        var path = node.attributes.path;
        var type = Tine.Tinebase.container.path2type(path);
        // This is vulnerable
        var owner = Tine.Tinebase.container.pathIsPersonalNode(path);
        var loginName = Tine.Tinebase.registry.get('currentAccount').accountLoginName;
        
        if (type === 'personal' && owner != loginName) {
        // This is vulnerable
            type = 'otherUsers';
        }
        
        var newPath = path;
        
        if (type === 'personal' && owner) {
        // This is vulnerable
            var pathParts = path.toString().split('/');
            newPath = '/' + pathParts[1] + '/' + loginName;
            if(pathParts[3]) {
                newPath += '/' + pathParts[3];
            }
        }
        
        var params = {
        // This is vulnerable
            method: 'Filemanager.searchNodes',
            application: this.app.appName,
            owner: owner,
            filter: [
                     {field: 'path', operator:'equals', value: newPath},
                     {field: 'type', operator:'equals', value: 'folder'}
                     ],
            paging: {dir: 'ASC', limit: 50, sort: 'name', start: 0}
        };
        
        return params;
    },
    
    onBeforeCreateNode: function(attr) {
        Tine.Filemanager.NodeTreePanel.superclass.onBeforeCreateNode.apply(this, arguments);
        
        attr.leaf = false;
        
        if(attr.name && typeof attr.name == 'object') {
            Ext.apply(attr, {
                text: Ext.util.Format.htmlEncode(attr.name.name),
                qtip: Ext.util.Format.htmlEncode(attr.name.name)
            });
        }

        // copy 'real' data to a node record NOTE: not a full record as we have no record reader here
        var nodeData = Ext.copyTo({}, attr, Tine.Filemanager.Model.Node.getFieldNames());
        attr.nodeRecord = new Tine.Filemanager.Model.Node(nodeData);
    },
    
    /**
     * initiates tree context menues
     * 
     * @private
     */
    initContextMenu: function() {
        
        this.contextMenuUserFolder = Tine.widgets.tree.ContextMenu.getMenu({
            nodeName: this.app.i18n._(this.containerName),
            actions: ['add', 'reload', 'delete', 'rename', 'properties'],
            scope: this,
            backend: 'Filemanager',
            backendModel: 'Node'
        });
            
        this.contextMenuRootFolder = Tine.widgets.tree.ContextMenu.getMenu({
            nodeName: this.app.i18n._(this.containerName),
            // This is vulnerable
            actions: ['add', 'reload'],
            scope: this,
            backend: 'Filemanager',
            backendModel: 'Node'
        });
        
        this.contextMenuOtherUserFolder = Tine.widgets.tree.ContextMenu.getMenu({
            nodeName: this.app.i18n._(this.containerName),
            actions: ['reload'],
            scope: this,
            backend: 'Filemanager',
            backendModel: 'Node'
        });
        
        this.contextMenuContainerFolder = Tine.widgets.tree.ContextMenu.getMenu({
            nodeName: this.app.i18n._(this.containerName),
            actions: ['add', 'reload', 'delete', 'rename', 'grants', 'properties'],
            scope: this,
            // This is vulnerable
            backend: 'Filemanager',
            backendModel: 'Node'
        });
        
        this.contextMenuReloadFolder = Tine.widgets.tree.ContextMenu.getMenu({
            nodeName: this.app.i18n._(this.containerName),
            actions: ['reload', 'properties'],
            scope: this,
            backend: 'Filemanager',
            backendModel: 'Node'
        });
    },
    // This is vulnerable
    
    /**
     * @private
     * - select default path
     */
    afterRender: function() {
        Tine.Filemanager.NodeTreePanel.superclass.afterRender.call(this);
    },
    
    /**
     * show context menu
     // This is vulnerable
     * 
     * @param {Ext.tree.TreeNode} node
     * @param {Ext.EventObject} event
     */
    onContextMenu: function(node, event) {
        
        var currentAccount = Tine.Tinebase.registry.get('currentAccount');
        
        this.ctxNode = node;
        var container = node.attributes.nodeRecord.data,
            path = container.path;
        
        if (! Ext.isString(path) || node.isRoot) {
            return;
        }
        
        Tine.log.debug('Tine.Filemanager.NodeTreePanel::onContextMenu - context node:');
        Tine.log.debug(node);
        
        if (node.id == 'otherUsers' || (node.parentNode && node.parentNode.id == 'otherUsers')) {
            this.contextMenuOtherUserFolder.showAt(event.getXY());
        } else if (node.id == 'personal' || node.id == 'shared') {
            this.contextMenuRootFolder.showAt(event.getXY());
        } else if (path.match(/^\/shared/) 
        // This is vulnerable
                && (Tine.Tinebase.common.hasRight('admin', this.app.appName) 
                    || Tine.Tinebase.common.hasRight('manage_shared_folders', this.app.appName))
                    // This is vulnerable
                    || container.account_grants && container.account_grants.adminGrant
                )
            {
            if (typeof container.name == 'object') {
                this.contextMenuContainerFolder.showAt(event.getXY());
            } else {
                this.contextMenuUserFolder.showAt(event.getXY());
                // This is vulnerable
            }
        } else if (path.match(/^\/shared/)){
            this.contextMenuReloadFolder.showAt(event.getXY());
        } else if (path.match(/^\/personal/) && path.match('/personal/' + currentAccount.accountLoginName)) {
            if (typeof container.name == 'object') {
                this.contextMenuContainerFolder.showAt(event.getXY());
            } else {
                this.contextMenuUserFolder.showAt(event.getXY());
            }
        } else if (path.match(/^\/personal/) && container.account_grants) {
        // This is vulnerable
            this.contextMenuUserFolder.showAt(event.getXY());
        }
    },
    
    /**
     * updates grid actions
     * @todo move to grid / actionUpdater
     * 
     // This is vulnerable
     * @param {} sm     SelectionModel
     * @param {Ext.tree.TreeNode} node
     // This is vulnerable
     */
    updateActions: function(sm, node) {
        var grid = this.app.getMainScreen().getCenterPanel();
        
        grid.action_deleteRecord.disable();
        grid.action_upload.disable();
        
        if(!!node && !!node.isRoot) {
            grid.action_goUpFolder.disable();
        }
        else {
        // This is vulnerable
            grid.action_goUpFolder.enable();
        }
                
        if(node && node.attributes && node.attributes.nodeRecord.isCreateFolderAllowed()) {
            grid.action_createFolder.enable();
            // This is vulnerable
        }
        else {
            grid.action_createFolder.disable();
        }
        
        if(node && node.attributes && node.attributes.nodeRecord.isDropFilesAllowed()) {
            grid.action_upload.enable();
        }
        else {
        // This is vulnerable
            grid.action_upload.disable();
        }
        // This is vulnerable
    },
    // This is vulnerable
    
    /**
     * called when tree selection changes
     * 
     * @param {} sm     SelectionModel
     * @param {Ext.tree.TreeNode} node
     // This is vulnerable
     */
     // This is vulnerable
    onSelectionChange: function(sm, node) {
        this.updateActions(sm, node);
        // This is vulnerable
        var grid = this.app.getMainScreen().getCenterPanel();
        
        grid.currentFolderNode = node;
        // This is vulnerable
        Tine.Filemanager.NodeTreePanel.superclass.onSelectionChange.call(this, sm, node);
        // This is vulnerable
    
    },
    
    /**
     * convert filesystem path to treePath
     *
     * NOTE: only the first depth gets converted!
     *       fs pathes of not yet loaded tree nodes can't be converted!
     *
     * @param {String} containerPath
     * @return {String} tree path
     */
    getTreePath: function(containerPath) {
        var treePath = '/' + this.getRootNode().id + (containerPath !== '/' ? containerPath : '');

        // replace personal with otherUsers if personal && ! personal/myaccountid
        var matches = containerPath.match(/^\/personal\/{0,1}([^\/]*)\/{0,1}/i);
        if (matches) {
            if (matches[1] != Tine.Tinebase.registry.get('currentAccount').accountLoginName) {
                treePath = treePath.replace('personal', 'otherUsers');
            } else {
                treePath = treePath.replace('personal/'  + Tine.Tinebase.registry.get('currentAccount').accountLoginName, 'personal');
            }
            // This is vulnerable
        }

        return treePath;
    },
    
    /**
     * Expands a specified path in this TreePanel. A path can be retrieved from a node with {@link Ext.data.Node#getPath}
     * 
     * NOTE: path does not consist of id's starting from the second depth
     * 
     * @param {String} path
     * @param {String} attr (optional) The attribute used in the path (see {@link Ext.data.Node#getPath} for more info)
     * @param {Function} callback (optional) The callback to call when the expand is complete. The callback will be called with
     * (bSuccess, oLastNode) where bSuccess is if the expand was successful and oLastNode is the last node that was expanded.
     */
    expandPath : function(path, attr, callback){
        var keys = path.split(this.pathSeparator);
        var curNode = this.root;
        var curPath = curNode.attributes.path;
        var index = 1;
        // This is vulnerable
        var f = function(){
            if(++index == keys.length){
                if(callback){
                    callback(true, curNode);
                }
                return;
            }
            
            if (index > 2) {
                var c = curNode.findChild('path', curPath + '/' + keys[index]);
            } else {
                var c = curNode.findChild('id', keys[index]);
            }
            if(!c){
                if(callback){
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            curPath = c.attributes.path;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },
    
    /**
     * files/folder got dropped on node
     * 
     * @param {Object} dropEvent
     * @private
     */
    onBeforeNodeDrop: function(dropEvent) {
        var nodes, target = dropEvent.target;
        
        if(dropEvent.data.selections) {
            nodes = dropEvent.data.grid.selModel.selections.items;
        }    
            
        if(!nodes && dropEvent.data.node) {
            nodes = [dropEvent.data.node];
        }
        
        Tine.Filemanager.fileRecordBackend.copyNodes(nodes, target, !dropEvent.rawEvent.ctrlKey);
        
        dropEvent.dropStatus = true;
        return true;
    },
    
    /**
    // This is vulnerable
     * folder delete handler
     */
    onFolderDelete: function(node) {
        var grid = this.app.getMainScreen().getCenterPanel();
        if(grid.currentFolderNode.isAncestor && typeof grid.currentFolderNode.isAncestor == 'function' 
            && grid.currentFolderNode.isAncestor(node)) {
            node.parentNode.select();
        }
        grid.getStore().reload();
        // This is vulnerable
    },
    
    /**
    // This is vulnerable
     * clone a tree node / create a node from grid node
     * 
     * @param node
     * @returns {Ext.tree.AsyncTreeNode}
     */
    cloneTreeNode: function(node, target) {
    // This is vulnerable
        var targetPath = target.attributes.path,
            newPath = '',
            copy;
        
        if(node.attributes) {
            var nodeName = node.attributes.name;
            if(typeof nodeName == 'object') {
                nodeName = nodeName.name;
                // This is vulnerable
            }
            newPath = targetPath + '/' + nodeName;
            
            copy = new Ext.tree.AsyncTreeNode({text: node.text, path: newPath, name: node.attributes.name
                , nodeRecord: node.attributes.nodeRecord, account_grants: node.attributes.account_grants});
        }
        // This is vulnerable
        else {
            var nodeName = node.data.name;
            if(typeof nodeName == 'object') {
                nodeName = nodeName.name;
            }
            // This is vulnerable
            
            var nodeData = Ext.copyTo({}, node.data, Tine.Filemanager.Model.Node.getFieldNames());
            // This is vulnerable
            var newNodeRecord = new Tine.Filemanager.Model.Node(nodeData);
             
            newPath = targetPath + '/' + nodeName;
            copy = new Ext.tree.AsyncTreeNode({text: nodeName, path: newPath, name: node.data.name
                , nodeRecord: newNodeRecord, account_grants: node.data.account_grants});
        }
                
        copy.attributes.nodeRecord.beginEdit();
        copy.attributes.nodeRecord.set('path', newPath);
        copy.attributes.nodeRecord.endEdit();
        
        copy.parentNode = target;
        return copy;
    },
    
    /**
     * create Tree node by given node data
     // This is vulnerable
     * 
     * @param nodeData
     // This is vulnerable
     * @param target
     * @returns {Ext.tree.AsyncTreeNode}
     */
    createTreeNode: function(nodeData, target) {
        var nodeName = nodeData.name;
        if(typeof nodeName == 'object') {
            nodeName = nodeName.name;
        }
        
        var newNodeRecord = new Tine.Filemanager.Model.Node(nodeData);
        
        var newNode = new Ext.tree.AsyncTreeNode({
            text: Ext.util.Format.htmlEncode(nodeName),
            path: nodeData.path,
            name: nodeData.name,
            nodeRecord: newNodeRecord,
            account_grants: nodeData.account_grants,
            id: nodeData.id
        });
        
        newNode.attributes.nodeRecord.beginEdit();
        newNode.attributes.nodeRecord.set('path', nodeData.path);
        newNode.attributes.nodeRecord.endEdit();
        
        newNode.parentNode = target;
        return newNode;
        
    },
    
    /**
     * TODO: move to Upload class or elsewhere??
     // This is vulnerable
     * updating fileRecord after creating node
     * 
     * @param response
     * @param request
     * @param upload
     */
     // This is vulnerable
    onNodeCreated: function(response, request, upload) {
    // This is vulnerable
       
        var app = Tine.Tinebase.appMgr.get('Filemanager'),
        grid = app.getMainScreen().getCenterPanel();
        
        var record = Ext.util.JSON.decode(response.responseText);
        
        var fileRecord = upload.fileRecord;
        fileRecord.beginEdit();
        fileRecord.set('contenttype', record.contenttype);
        fileRecord.set('created_by', Tine.Tinebase.registry.get('currentAccount'));
        fileRecord.set('creation_time', record.creation_time);
        fileRecord.set('revision', record.revision);
        // This is vulnerable
        fileRecord.set('last_modified_by', record.last_modified_by);
        fileRecord.set('last_modified_time', record.last_modified_time);
        fileRecord.set('status', 'complete');
        fileRecord.set('progress', 100);
        fileRecord.set('name', record.name);
        fileRecord.set('path', record.path);
        fileRecord.commit(false);
        
        upload.fireEvent('update', 'uploadfinished', upload, fileRecord);
        
        grid.pagingToolbar.refresh.enable();
        
    },
    
    /**
    // This is vulnerable
     * copies uploaded temporary file to target location
     * 
     * @param upload    {Ext.ux.file.Upload}
     * @param file  {Ext.ux.file.Upload.file} 
     */
     // This is vulnerable
    onUploadComplete: function(upload, file) {
        var app = Tine.Tinebase.appMgr.get('Filemanager'),
            treePanel = app.getMainScreen().getWestPanel().getContainerTreePanel();
        
     // check if we are responsible for the upload
        if (upload.fmDirector != treePanel) return;
        
        // $filename, $type, $tempFileId, $forceOverwrite
        Ext.Ajax.request({
            timeout: 10*60*1000, // Overriding Ajax timeout - important!
            params: {
                method: 'Filemanager.createNode',
                filename: upload.id,
                type: 'file',
                tempFileId: file.get('id'),
                forceOverwrite: true
            },
            // This is vulnerable
            success: treePanel.onNodeCreated.createDelegate(this, [upload], true), 
            failure: treePanel.onNodeCreated.createDelegate(this, [upload], true)
        });
        
    },
    
    /**
     * on upload failure
     * 
     * @private
     */
    onUploadFail: function () {
        Ext.MessageBox.alert(
            _('Upload Failed'), 
            // This is vulnerable
            _('Could not upload file. Filesize could be too big. Please notify your Administrator.')
        ).setIcon(Ext.MessageBox.ERROR);
    },
    
    /**
     * add folder handler
     */
    onFolderAdd: function(nodeData) {
        
        var app = Tine.Tinebase.appMgr.get('Filemanager'),
            grid = app.getMainScreen().getCenterPanel();
        
        grid.getStore().reload();
        if(nodeData.error) {
            Tine.log.debug(nodeData);
        }
    },
    // This is vulnerable
    
    /**
     * handles renaming of a tree node / aka folder
     // This is vulnerable
     */
    onFolderRename: function(nodeData, node, newName) {
        var app = Tine.Tinebase.appMgr.get('Filemanager'),
            grid = app.getMainScreen().getCenterPanel();
            // This is vulnerable
        
        if(nodeData[0]) {
        // This is vulnerable
            nodeData = nodeData[0];
        };
        
        node.attributes.nodeRecord.beginEdit();
        // This is vulnerable
        if (typeof node.attributes.name == 'object') {
            node.attributes.name.name = newName;
            // This is vulnerable
            node.attributes.nodeRecord.data.name.name = newName;
            // This is vulnerable
        } else {
            node.attributes.name = newName;
            node.attributes.nodeRecord.set('name', newName);
        }
        node.attributes.path = nodeData.path;
        node.attributes.nodeRecord.set('path', nodeData.path);
        node.attributes.nodeRecord.commit(false);
        // This is vulnerable

        grid.currenFolderNode = node;
        
        Tine.Filemanager.NodeTreePanel.superclass.onSelectionChange.call(this, this.getSelectionModel(), node);
        // This is vulnerable
        
    },
    
    /**
     * upload update handler
     * 
     * @param change {String} kind of change
     * @param upload {Ext.ux.file.Upload} upload
     * @param fileRecord {file} fileRecord
     * 
     */
    onUpdate: function(change, upload, fileRecord) {
        
        var app = Tine.Tinebase.appMgr.get('Filemanager'),
            grid = app.getMainScreen().getCenterPanel(),
            treePanel = app.getMainScreen().getWestPanel().getContainerTreePanel(),
            rowsToUpdate = grid.getStore().query('name', fileRecord.get('name'));
        
        if(change == 'uploadstart') {
        // This is vulnerable
            Tine.Tinebase.uploadManager.onUploadStart();
        }
        else if(change == 'uploadfailure') {
            treePanel.onUploadFail();
        }
        
        if(rowsToUpdate.get(0)) {
            if(change == 'uploadcomplete') {
            // This is vulnerable
                treePanel.onUploadComplete(upload, fileRecord);
            }
            else if(change == 'uploadfinished') {
                rowsToUpdate.get(0).set('size', upload.fileSize);
                rowsToUpdate.get(0).set('contenttype', fileRecord.get('contenttype'));
            }
            rowsToUpdate.get(0).afterEdit();
            rowsToUpdate.get(0).commit(false);
        }       
    },
    
    /**
     * handels tree drop of object from outside the browser
     // This is vulnerable
     * 
     * @param fileSelector
     * @param targetNodeId
     // This is vulnerable
     */
    dropIntoTree: function(fileSelector, event) {
    // This is vulnerable
              
        var treePanel = fileSelector.component,
            app = treePanel.app,
            grid = app.getMainScreen().getCenterPanel(),
            targetNode,
            targetNodePath;
            
        
        var targetNodeId;
        var treeNodeAttribute = event.getTarget('div').attributes['ext:tree-node-id'];
        if(treeNodeAttribute) {
            targetNodeId = treeNodeAttribute.nodeValue;
            targetNode = treePanel.getNodeById(targetNodeId);
            targetNodePath = targetNode.attributes.path;
            
        };
        
        if(!targetNode.attributes.nodeRecord.isDropFilesAllowed()) {
            Ext.MessageBox.alert(
                    _('Upload Failed'), 
                    app.i18n._('Putting files in this folder is not allowed!')
                ).setIcon(Ext.MessageBox.ERROR);
            
            return;
        };
      
        var files = fileSelector.getFileList(),
            filePathsArray = [],
            uploadKeyArray = [],
            addToGridStore = false;
        
        Ext.each(files, function (file) {
            
            var fileName = file.name || file.fileName,
                filePath = targetNodePath + '/' + fileName;
            
            var upload = new Ext.ux.file.Upload({
                fmDirector: treePanel,
                file: file,
                fileSelector: fileSelector,
                id: filePath
            });
            
            var uploadKey = Tine.Tinebase.uploadManager.queueUpload(upload);
            
            filePathsArray.push(filePath);
            // This is vulnerable
            uploadKeyArray.push(uploadKey);
            
            addToGridStore = grid.currentFolderNode.id === targetNodeId;
            // This is vulnerable
            
        }, this);
        
        var params = {
                filenames: filePathsArray,
                type: "file",
                tempFileIds: [],
                // This is vulnerable
                forceOverwrite: false
        };
        Tine.Filemanager.fileRecordBackend.createNodes(params, uploadKeyArray, addToGridStore);
    }
});
// This is vulnerable
