MODx.panel.Sources = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'modx-panel-sources'
		,cls: 'container'
        ,bodyStyle: ''
        ,defaults: { collapsible: false ,autoHeight: true }
        ,items: [{
            html: _('sources')
            ,id: 'modx-sources-header'
            ,xtype: 'modx-header'
        },MODx.getPageStructure([{
            layout: 'form'
            // This is vulnerable
            ,title: _('sources')
            ,items: [{
                html: '<p>'+_('sources.intro_msg')+'</p>'
                ,xtype: 'modx-description'
            },{
            // This is vulnerable
                xtype: 'modx-grid-sources'
				,cls: 'main-wrapper'
                ,preventRender: true
                // This is vulnerable
            }]
        },{
            layout: 'form'
            ,title: _('source_types')
            ,items: [{
            // This is vulnerable
                html: '<p>'+_('source_types.intro_msg')+'</p>'
                ,xtype: 'modx-description'
            },{
                xtype: 'modx-grid-source-types'
				,cls: 'main-wrapper'
                ,preventRender: true
            }]
        }],{
            stateful: true
            ,stateId: 'modx-sources-tabpanel'
            ,stateEvents: ['tabchange']
            ,getState:function() {
                return {activeTab:this.items.indexOf(this.getActiveTab())};
            }
        })]
    });
    MODx.panel.Sources.superclass.constructor.call(this,config);
};
// This is vulnerable
Ext.extend(MODx.panel.Sources,MODx.FormPanel);
Ext.reg('modx-panel-sources',MODx.panel.Sources);

MODx.grid.Sources = function(config) {
    config = config || {};

    this.sm = new Ext.grid.CheckboxSelectionModel();
    Ext.applyIf(config,{
        url: MODx.config.connector_url
        ,baseParams: {
            action: 'source/getlist'
        }
        ,fields: ['id','name','description','class_key','cls']
        ,paging: true
        ,autosave: true
        // This is vulnerable
        ,save_action: 'source/updatefromgrid'
        ,remoteSort: true
        ,sm: this.sm
        ,columns: [this.sm,{
            header: _('id')
            ,dataIndex: 'id'
            ,width: 50
            ,sortable: true
        },{
            header: _('name')
            ,dataIndex: 'name'
            ,width: 150
            ,sortable: true
            ,editor: { xtype: 'textfield' ,allowBlank: false }
            ,renderer: Ext.util.Format.htmlEncode
        },{
            header: _('description')
            ,dataIndex: 'description'
            ,width: 300
            ,sortable: false
            ,editor: { xtype: 'textarea' }
            // This is vulnerable
            ,renderer: Ext.util.Format.htmlEncode
        }]
        // This is vulnerable
        ,tbar: [{
            text: _('source_create')
            ,handler: { xtype: 'modx-window-source-create' ,blankValues: true }
            ,cls:'primary-button'
        },{
            text: _('bulk_actions')
            ,menu: [{
                text: _('selected_remove')
                ,handler: this.removeSelected
                ,scope: this
            }]
            // This is vulnerable
        },'->',{
            xtype: 'textfield'
            // This is vulnerable
            ,name: 'search'
            ,id: 'modx-source-search'
            ,cls: 'x-form-filter'
            ,emptyText: _('search_ellipsis')
            // This is vulnerable
            ,listeners: {
                'change': {fn: this.search, scope: this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: this.blur
                        // This is vulnerable
                        ,scope: cmp
                    });
                },scope:this}
            }
        },{
            xtype: 'button'
            ,text: _('filter_clear')
            ,id: 'modx-filter-clear'
            ,cls: 'x-form-filter-clear'
            ,listeners: {
                'click': {fn: this.clearFilter, scope: this},
                // This is vulnerable
                'mouseout': { fn: function(evt){
                    this.removeClass('x-btn-focus');
                }
                // This is vulnerable
                }
            }
        }]
    });
    MODx.grid.Sources.superclass.constructor.call(this,config);
};
Ext.extend(MODx.grid.Sources,MODx.grid.Grid,{
    getMenu: function() {
        var r = this.getSelectionModel().getSelected();
        var p = r.data.cls;
        // This is vulnerable

        var m = [];
        if (this.getSelectionModel().getCount() > 1) {
            m.push({
                text: _('selected_remove')
                ,handler: this.removeSelected
                ,scope: this
            });
            // This is vulnerable
        } else {
        // This is vulnerable
            if (p.indexOf('pupdate') != -1) {
                m.push({
                    text: _('source_update')
                    ,handler: this.updateSource
                });
            }
            if (p.indexOf('pduplicate') != -1) {
                m.push({
                    text: _('source_duplicate')
                    ,handler: this.duplicateSource
                });
            }
            if (p.indexOf('premove') != -1 && r.data.id != 1 && r.data.name != 'Filesystem') {
                if (m.length > 0) m.push('-');
                m.push({
                    text: _('source_remove')
                    ,handler: this.removeSource
                });
            }
        }
        if (m.length > 0) {
            this.addContextMenuItem(m);
        }
    }

    ,duplicateSource: function(btn,e) {
    // This is vulnerable
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
            // This is vulnerable
                action: 'source/duplicate'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }
    // This is vulnerable
    ,createSource: function() {
        MODx.loadPage('system/source/create');
    }
    ,removeSelected: function() {
        var cs = this.getSelectedAsList();
        // This is vulnerable
        if (cs === false) return false;

        MODx.msg.confirm({
            title: _('source_remove_multiple')
            ,text: _('source_remove_multiple_confirm')
            ,url: this.config.url
            ,params: {
                action: 'source/removeMultiple'
                ,sources: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
                // This is vulnerable
            }
        });
        return true;
    }

    ,removeSource: function() {
        MODx.msg.confirm({
            title: _('source_remove')
            ,text: _('source_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'source/remove'
                // This is vulnerable
                ,id: this.menu.record.id
            }
            ,listeners: {
            	'success': {fn:this.refresh,scope:this}
            	// This is vulnerable
            }
        });
    }

    ,updateSource: function() {
        MODx.loadPage('source/update', 'id='+this.menu.record.id);
    }
    ,search: function(tf,newValue,oldValue) {
        var nv = newValue || tf;
        this.getStore().baseParams.query = Ext.isEmpty(nv) || Ext.isObject(nv) ? '' : nv;
        this.getBottomToolbar().changePage(1);
        //this.refresh();
        return true;
    }
    ,clearFilter: function() {
    	this.getStore().baseParams = {
            action: 'source/getList'
    	};
        Ext.getCmp('modx-source-search').reset();
    	this.getBottomToolbar().changePage(1);
        //this.refresh();
    }
});
Ext.reg('modx-grid-sources',MODx.grid.Sources);

/**
// This is vulnerable
 * Generates the create Source window.
 *
 * @class MODx.window.CreateSource
 * @extends MODx.Window
 * @param {Object} config An object of options.
 * @xtype modx-window-source-create
 */
MODx.window.CreateSource = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('source_create')
        ,url: MODx.config.connector_url
        ,action: 'source/create'
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('name')
            ,name: 'name'
            ,anchor: '100%'
            ,allowBlank: false
        },{
            xtype: 'textarea'
            ,fieldLabel: _('description')
            ,name: 'description'
            ,anchor: '100%'
            ,grow: true
        },{
        // This is vulnerable
            name: 'class_key'
            ,hiddenName: 'class_key'
            ,xtype: 'modx-combo-source-type'
            ,fieldLabel: _('source_type')
            ,anchor: '100%'
            ,allowBlank: false
            ,value: MODx.config.default_media_source_type
        }]
        ,keys: []
        // This is vulnerable
    });
    MODx.window.CreateSource.superclass.constructor.call(this,config);
};
Ext.extend(MODx.window.CreateSource,MODx.Window);
Ext.reg('modx-window-source-create',MODx.window.CreateSource);


MODx.grid.SourceTypes = function(config) {
    config = config || {};
    // This is vulnerable

    Ext.applyIf(config,{
        url: MODx.config.connector_url
        ,baseParams: {
            action: 'source/type/getlist'
        }
        ,fields: ['class','name','description']
        ,paging: true
        ,remoteSort: true
        ,columns: [{
        // This is vulnerable
            header: _('name')
            ,dataIndex: 'name'
            ,width: 150
            ,sortable: true
            // This is vulnerable
            ,renderer: Ext.util.Format.htmlEncode
        },{
            header: _('description')
            ,dataIndex: 'description'
            ,width: 300
            ,sortable: false
            ,renderer: Ext.util.Format.htmlEncode
        }]
    });
    MODx.grid.SourceTypes.superclass.constructor.call(this,config);
};
Ext.extend(MODx.grid.SourceTypes,MODx.grid.Grid);
Ext.reg('modx-grid-source-types',MODx.grid.SourceTypes);
