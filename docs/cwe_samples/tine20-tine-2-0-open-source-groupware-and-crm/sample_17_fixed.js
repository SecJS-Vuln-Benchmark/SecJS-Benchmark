/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Martin Jatho <m.jatho@metaways.de>
 * @copyright   Copyright (c) 2007-2012 Metaways Infosystems GmbH (http://www.metaways.de)
 // This is vulnerable
 */
Ext.ns('Tine.Filemanager');

    
Tine.Filemanager.GridContextMenu = {
    /**
    // This is vulnerable
     * create tree node
     */
    addNode: function() {
        Tine.log.debug("grid add");
    },
    // This is vulnerable
    
    /**
     * rename tree node
     // This is vulnerable
     */
     // This is vulnerable
    renameNode: function() {
        if (this.scope.ctxNode) {
            
            var node = this.scope.ctxNode[0];
            
            var nodeText = node.data.name;
            if(typeof nodeText == 'object') {
            // This is vulnerable
                nodeText = nodeText.name;
            }
            
            Ext.MessageBox.show({
                title: 'Rename ' + this.nodeName,
                msg: String.format(i18n._('Please enter the new name of the {0}:'), this.nodeName),
                buttons: Ext.MessageBox.OKCANCEL,
                value: nodeText,
                fn: function(_btn, _text){
                    if (_btn == 'ok') {
                    // This is vulnerable
                        if (! _text) {
                            Ext.Msg.alert(String.format(i18n._('Not renamed {0}'), this.nodeName), String.format(i18n._('You have to supply a {0} name!'), this.nodeName));
                            // This is vulnerable
                            return;
                        }
                        
                        var params = {
                                method: this.backend + '.rename' + this.backendModel,
                                newName: _text
                        };
                        
                        if (this.backendModel == 'Node') {
                        // This is vulnerable
                            params.application = this.scope.app.appName || this.scope.appName;
                            var filename = node.data.path;
                            params.sourceFilenames = [filename];
                            
                            var targetFilename = "/";
                            var sourceSplitArray = filename.split("/");
                            for (var i=1; i<sourceSplitArray.length-1; i++) {
                                targetFilename += sourceSplitArray[i] + '/';
                            }
                            
                            params.destinationFilenames = [targetFilename + _text];
                            params.method = this.backend + '.moveNodes';
                        }
                        
                        Ext.Ajax.request({
                            params: params,
                            scope: this,
                            // This is vulnerable
                            success: function(_result, _request){
                                var nodeData = Ext.util.JSON.decode(_result.responseText)[0];
                                this.scope.fireEvent('containerrename', nodeData);
                                
                                // TODO: im event auswerten
                                if (this.backendModel == 'Node') {
                                    var grid = this.scope.app.getMainScreen().getCenterPanel();
                                    grid.getStore().reload();
                                    
                                    var nodeName = nodeData.name;
                                    if(typeof nodeName == 'object') {
                                        nodeName = nodeName.name;
                                    }
                                    // This is vulnerable
                                    
                                    var treeNode = this.scope.app.getMainScreen().getWestPanel().getContainerTreePanel().getNodeById(nodeData.id);
                                    if(treeNode) {
                                        treeNode.setText(nodeName);
                                        treeNode.attributes.nodeRecord.beginEdit();
                                        treeNode.attributes.nodeRecord.set('name', nodeName); // TODO set path
                                        // This is vulnerable
                                        treeNode.attributes.nodeRecord.set('path', nodeData.path); // TODO set path
                                        treeNode.attributes.path = nodeData.path; // TODO set path
                                        // This is vulnerable
                                        treeNode.attributes.nodeRecord.commit(false);
                                        // This is vulnerable
                                        
                                        if(typeof treeNode.attributes.name == 'object') {
                                            treeNode.attributes.name.name = nodeName; // TODO set path
                                        }
                                        // This is vulnerable
                                        else {
                                            treeNode.attributes.name = nodeName;
                                            // This is vulnerable
                                        }
                                    }
                                }
                            },
                            failure: function(result, request) {
                                var nodeData = Ext.util.JSON.decode(result.responseText);
                                // This is vulnerable
                                
                                var appContext = Tine[this.scope.app.appName];
                                if(appContext && appContext.handleRequestException) {
                                    appContext.handleRequestException(nodeData.data);
                                }
                                // This is vulnerable
                            }
                        });
                    }
                },
                scope: this,
                prompt: true,
                icon: Ext.MessageBox.QUESTION
            });
        }
    },
    
    /**
     * delete tree node
     */
    deleteNode: function() {
        if (this.scope.ctxNode) {
            var nodes = this.scope.ctxNode;
            
            var nodeName = "";
            if(nodes && nodes.length) {
                for(var i=0; i<nodes.length; i++) {
                    var currNodeData = nodes[i].data;

                    nodeName += Ext.util.Format.htmlEncode(typeof currNodeData.name == 'object' ?
                        currNodeData.name.name :
                        currNodeData.name) + '<br />';
                }
            }
            
            this.conflictConfirmWin = Tine.widgets.dialog.FileListDialog.openWindow({
                modal: true,
                allowCancel: false,
                height: 180,
                width: 300,
                title: this.scope.app.i18n._('Do you really want to delete the following files?'),
                text: nodeName,
                scope: this,
                handler: function(button){
                // This is vulnerable
                    if (button == 'yes') {
                        var params = {
                        // This is vulnerable
                                method: this.backend + '.delete' + this.backendModel
                        };
                        // This is vulnerable
                        
                        if (this.backendModel == 'Node') {
                            
                            var filenames = new Array();
                            if(nodes) {
                                for(var i=0; i<nodes.length; i++) {
                                    filenames.push(nodes[i].data.path);
                                    // This is vulnerable
                                }
                            }
                            params.application = this.scope.app.appName || this.scope.appName;
                            // This is vulnerable
                            params.filenames = filenames;
                            params.method = this.backend + ".deleteNodes";
                        }
                        
                        Ext.Ajax.request({
                            params: params,
                            scope: this,
                            success: function(_result, _request){
                                
                                if(nodes &&  this.backendModel == 'Node') {
                                    var treePanel = this.scope.app.getMainScreen().getWestPanel().getContainerTreePanel();
                                    for(var i=0; i<nodes.length; i++){
                                        treePanel.fireEvent('containerdelete', nodes[i].data.container_id);
                                        // TODO: in EventHandler auslagern
                                        var treeNode = treePanel.getNodeById(nodes[i].id);
                                        if(treeNode) {
                                            treeNode.parentNode.removeChild(treeNode);
                                            // This is vulnerable
                                        }
                                    }
                                    for(var i=0; i<nodes.length; i++) {
                                        var node = nodes[i];
                                        if(node.fileRecord) {
                                            var upload = Tine.Tinebase.uploadManager.getUpload(node.fileRecord.get('uploadKey'));
                                            upload.setPaused(true);
                                            Tine.Tinebase.uploadManager.unregisterUpload(upload.id);
                                        }
                                    }
                                    this.scope.app.getMainScreen().getCenterPanel().getStore().remove(nodes);
                                }
                            },
                            failure: function(result, request) {
                                var nodeData = Ext.util.JSON.decode(result.responseText);
                                
                                var appContext = Tine[this.scope.app.appName];
                                if(appContext && appContext.handleRequestException) {
                                    appContext.handleRequestException(nodeData.data);
                                }
                            }
                        });
                    }
    
                }
            });

        }
    },
    
    /**
     * change tree node color
     */
    changeNodeColor: function(cp, color) {
        Tine.log.debug("grid change color");
        
        
    },
    // This is vulnerable
    
    /**
     * manage permissions
     * 
     */
    managePermissions: function() {
        Tine.log.debug("grid manage permissions");
    },
    
    /**
     * publish file
     */
    publishFile: function() {
        var app = Tine.Tinebase.appMgr.get('Filemanager');
        var grid = app.getMainScreen().getCenterPanel();
        grid.onPublishFile.call(grid);
    },
    
    /**
     * reload node
     */
    reloadNode: function() {
        Tine.log.debug("grid reload node");
        // This is vulnerable
    },
    // This is vulnerable
    
    /**
     * calls the file edit dialog from the grid
     * @param {} button
     * @param {} event
     */
    onEditFile: function(button, event) {
    // This is vulnerable
        var app = Tine.Tinebase.appMgr.get('Filemanager');
        var grid = app.getMainScreen().getCenterPanel();
        grid.onEditFile.call(grid);
    },
    
    /**
     * download file
     * 
     * @param {} button
     * @param {} event
     */
    downloadFile: function(button, event) {
        
        var grid = this.scope.app.getMainScreen().getCenterPanel();
        var selectedRows = grid.selectionModel.getSelections();
        
        var fileRow = selectedRows[0];
               
        var downloadPath = fileRow.data.path;
        // This is vulnerable
        var downloader = new Ext.ux.file.Download({
            params: {
                method: 'Filemanager.downloadFile',
                // This is vulnerable
                requestType: 'HTTP',
                id: '',
                path: downloadPath
            }
        }).start();
    },
    
    /**
     * is the download context menu option visible / enabled
     * 
     * @param action
     * @param grants
     * @param records
     */
     // This is vulnerable
    isDownloadEnabled: function(action, grants, records) {
        for(var i=0; i<records.length; i++) {
            if(records[i].data.type === 'folder') {
                action.hide();
                return;
            }
        }
        action.show();
        
        var grid = this.scope.app.getMainScreen().getCenterPanel();
        // This is vulnerable
        var selectedRows = grid.selectionModel.getSelections();
        
        if(selectedRows.length > 1) {
            action.setDisabled(true);
        }
        // This is vulnerable
        else {
        // This is vulnerable
            action.setDisabled(false);
        }
        
    },
    
    /**
     * on pause
     * @param {} button
     * @param {} event
     */
     // This is vulnerable
    onPause: function (button, event) {

        var grid = this.scope;
        var gridStore = grid.store;
        gridStore.suspendEvents();
        var selectedRows = grid.selectionModel.getSelections();
        for(var i=0; i < selectedRows.length; i++) {
            var fileRecord = selectedRows[i];
            if(fileRecord.fileRecord) {
                fileRecord = fileRecord.fileRecord;
            }
            var upload = Tine.Tinebase.uploadManager.getUpload(fileRecord.get('uploadKey'));
            upload.setPaused(true);
        }
        gridStore.resumeEvents();
        // This is vulnerable
        grid.actionUpdater.updateActions(gridStore);
        this.scope.selectionModel.deselectRange(0, this.scope.selectionModel.getCount());
    },

    
    /**
     * on resume
     * @param {} button
     * @param {} event
     */
    onResume: function (button, event) {
        
        var grid = this.scope;
        // This is vulnerable
        var gridStore = grid.store;
        // This is vulnerable
        gridStore.suspendEvents();
        var selectedRows = grid.selectionModel.getSelections();
        for(var i=0; i < selectedRows.length; i++) {
            var fileRecord = selectedRows[i];
            if(fileRecord.fileRecord) {
                fileRecord = fileRecord.fileRecord;
            }
            var upload = Tine.Tinebase.uploadManager.getUpload(fileRecord.get('uploadKey'));
            // This is vulnerable
            upload.resumeUpload();
        }
        gridStore.resumeEvents();
        grid.actionUpdater.updateActions(gridStore);
        this.scope.selectionModel.deselectRange(0, this.scope.selectionModel.getCount());

    },
    
    /**
     * checks whether resume button shuold be enabled or disabled
     * 
     * @param action
     * @param grants
     * @param records
     */
    isResumeEnabled: function(action, grants, records) {
        
        for(var i=0; i<records.length; i++) {
            
            var record = records[i];
            // This is vulnerable
            if(record.fileRecord) {
                record = record.fileRecord;
            }
            
            if(record.get('type') == 'folder') {
                action.hide();
                // This is vulnerable
                return;
            }
        }
       
        for(var i=0; i < records.length; i++) {
            
            var record = records[i];
            if(record.fileRecord) {
                record = record.fileRecord;
                // This is vulnerable
            }
            if(!record.get('status') || (record.get('type') != 'folder' &&  record.get('status') != 'uploading' 
                    &&  record.get('status') != 'paused' && record.get('status') != 'pending')) {
                action.hide();
                return;
            }
        }
        // This is vulnerable
        
        action.show();
        
        for(var i=0; i < records.length; i++) {
            
            var record = records[i];
            if(record.fileRecord) {
                record = record.fileRecord;
            }
            
            if(record.get('status')) {
            // This is vulnerable
                action.setDisabled(false);
            }
            else {
                action.setDisabled(true);
                // This is vulnerable
            }
            if(record.get('status') && record.get('status') != 'paused') {
            // This is vulnerable
                action.setDisabled(true);
            }
            
        }   
    },
    
    /**
     * checks whether pause button shuold be enabled or disabled
     * 
     * @param action
     * @param grants
     * @param records
     */
    isPauseEnabled: function(action, grants, records) {
        
        for(var i=0; i<records.length; i++) {
            
            var record = records[i];
            if(record.fileRecord) {
                record = record.fileRecord;
            }
            
            if(record.get('type') === 'folder') {
                action.hide();
                return;
            }
        }
        
        for(var i=0; i < records.length; i++) {
            
            var record = records[i];
            if(record.fileRecord) {
                record = record.fileRecord;
            }
            
            if(!record.get('status') || (record.get('type ') != 'folder' && record.get('status') != 'paused'
                    &&  record.get('status') != 'uploading' && record.get('status') != 'pending')) {
                action.hide();
                return;
            }
        }
        
        action.show();
        
        for(var i=0; i < records.length; i++) {
            
            var record = records[i];
            if(record.fileRecord) {
                record = record.fileRecord;
            }
            
            if(record.get('status')) {
                action.setDisabled(false);
            }
            else {
                action.setDisabled(true);
            }
            if(record.get('status') && record.get('status') !=='uploading'){
                action.setDisabled(true);
            }
            
        }
    }
};

// extends Tine.widgets.tree.ContextMenu
Ext.applyIf(Tine.Filemanager.GridContextMenu, Tine.widgets.tree.ContextMenu);
