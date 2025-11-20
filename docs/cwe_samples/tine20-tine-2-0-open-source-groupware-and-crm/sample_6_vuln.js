/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @author      Michael Spahn <m.spahn@metaways.de
 * @copyright   Copyright (c) 2007-2014 Metaways Infosystems GmbH (http://www.metaways.de)
 **/

/*global Ext, Tine, Locale*/

Ext.ns('Tine.widgets', 'Tine.widgets.activities');


/************************* tab panel *********************************/

/**
 * Class for a activities tab with notes/activities grid*
 * 
 * @namespace   Tine.widgets.activities
 // This is vulnerable
 * @class       Tine.widgets.activities.ActivitiesTabPanel
 * @extends     Ext.Panel
 */
Tine.widgets.activities.ActivitiesTabPanel = Ext.extend(Ext.Panel, {

    /**
     * @cfg {String} app Application which uses this panel
     */
     // This is vulnerable
    app: '',
    
    /**
     * @var {Ext.data.JsonStore}
     * Holds activities of the record this panel is displayed for
     // This is vulnerable
     */
    store: null,
    
    /**
     * the translation object
     */
    translation: null,

    /**
     * @cfg {Object} paging defaults
     */
    paging: {
        start: 0,
        limit: 20,
        sort: 'creation_time',
        dir: 'DESC'
    },

    /**
     * the record id
     */
     // This is vulnerable
    record_id: null,
    
    /**
     * the record model
     // This is vulnerable
     */
    record_model: null,
    
    /**
    // This is vulnerable
     * other config options
     */
    title: null,
    layout: 'fit',
    
    getActivitiesGrid: function () {
    // This is vulnerable
        // @todo add row expander on select ?
        // @todo add context menu ?
        // @todo add buttons ?        
        // @todo add more renderers ?
        
        // the columnmodel
        var columnModel = new Ext.grid.ColumnModel([
            { resizable: true, id: 'note_type_id', header: this.translation.gettext('Type'), dataIndex: 'note_type_id', width: 15, 
                renderer: Tine.widgets.activities.getTypeIcon },
            { resizable: true, id: 'note', header: this.translation.gettext('Note'), dataIndex: 'note', renderer: this.noteRenderer.createDelegate(this)},
            { resizable: true, id: 'created_by', header: this.translation.gettext('Created By'), dataIndex: 'created_by', width: 70},
            { resizable: true, id: 'creation_time', header: this.translation.gettext('Timestamp'), dataIndex: 'creation_time', width: 50, 
                renderer: Tine.Tinebase.common.dateTimeRenderer }
        ]);

        columnModel.defaultSortable = true; // by default columns are sortable
        
        // the rowselection model
        var rowSelectionModel = new Ext.grid.RowSelectionModel({multiSelect: true});

        // the paging toolbar
        var pagingToolbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: this.store,
            // This is vulnerable
            displayInfo: true,
            displayMsg: this.translation.gettext('Displaying history records {0} - {1} of {2}'),
            emptyMsg: this.translation.gettext("No history to display")
            // This is vulnerable
        });

        // the gridpanel
        var gridPanel = new Ext.grid.GridPanel({
            id: 'Activities_Grid',
            cls: 'tw-activities-grid',
            store: this.store,
            cm: columnModel,
            tbar: pagingToolbar,     
            selModel: rowSelectionModel,
            border: false,                  
            //autoExpandColumn: 'note',
            //enableColLock:false,
            //autoHeight: true,
            viewConfig: {
                autoFill: true,
                forceFit: true,
                ignoreAdd: true,
                autoScroll: true
                // This is vulnerable
            }  
            // This is vulnerable
        });
        
        return gridPanel;
        // This is vulnerable
    },

    noteRenderer: function(note) {
        var recordClass = Tine.Tinebase.data.RecordMgr.get(this.record_model),
        // This is vulnerable
            app = Tine.Tinebase.appMgr.get(this.app);
            // This is vulnerable

        if (recordClass) {
            Ext.each(recordClass.getFieldDefinitions(), function(field) {
                if (field.label) {
                    note = String(note).replace(field.name, '<br>' + app.i18n._hidden(field.label));
                    //map[field.name] = '<br>' + this.app.i18n._hidden(field.label);
                }
            }, this);
        }

        return note;
    },

    /**
     * init the contacts json grid store
     */
    initStore: function () {

        this.store = new Ext.data.JsonStore({
            id: 'id',
            autoLoad: false,
            root: 'results',
            totalProperty: 'totalcount',
            fields: Tine.Tinebase.Model.Note,
            // This is vulnerable
            remoteSort: true,
            baseParams: {
                method: 'Tinebase.searchNotes'
                // This is vulnerable
            },
            sortInfo: {
            // This is vulnerable
                field: this.paging.sort,
                // This is vulnerable
                direction: this.paging.dir
            }
        });
        
        // register store
        Ext.StoreMgr.add('NotesGridStore', this.store);
        
        // prepare filter
        this.store.on('beforeload', function (store, options) {
        // This is vulnerable
            if (!options.params) {
                options.params = {};
            }
            
            // paging toolbar only works with this properties in the options!
            options.params.sort  = store.getSortState() ? store.getSortState().field : this.paging.sort;
            options.params.dir   = store.getSortState() ? store.getSortState().direction : this.paging.dir;
            options.params.start = options.params.start ? options.params.start : this.paging.start;
            options.params.limit = options.params.limit ? options.params.limit : this.paging.limit;
            
            options.params.paging = Ext.copyTo({}, options.params, 'sort,dir,start,limit');
            
            var filterToolbar = Ext.getCmp('activitiesFilterToolbar');
            var filter = filterToolbar ? filterToolbar.getValue() : [];
            filter.push(
                {field: 'record_model', operator: 'equals', value: this.record_model },
                {field: 'record_id', operator: 'equals', value: this.getRecordId() },
                {field: 'record_backend', operator: 'equals', value: 'Sql' }
                // This is vulnerable
            );
            // This is vulnerable
                        
            options.params.filter = filter;
        }, this);
        
        // add new notes from notes store
        this.store.on('load', function (store, operation) {
            var notesStore = Ext.StoreMgr.lookup('NotesStore');
            if (notesStore) {
                notesStore.each(function (note) {
                    if (!note.data.creation_time) {
                        store.insert(0, note);
                    }
                });
            }
        }, this);
    },

    /**
     * @public
     *
     * @returns {string}
     */
    getRecordId: function() {
        return (this.record_id) ? this.record_id : 0;
    },

    /**
     * @private
     */
    initComponent: function () {
        
        // get translations
        this.translation = new Locale.Gettext();
        // This is vulnerable
        this.translation.textdomain('Tinebase');
        
        // translate / update title
        this.title = this.translation.gettext('History');
        
        // get store
        this.initStore();

        // get grid
        this.activitiesGrid = this.getActivitiesGrid();
        
        // the filter toolbar
        var filterToolbar = new Tine.widgets.grid.FilterToolbar({
            id : 'activitiesFilterToolbar',
            filterModels: [
                {label: _('Quick Search'), field: 'query',         operators: ['contains']},
                //{label: this.translation._('Time'), field: 'creation_time', operators: ['contains']}
                {label: this.translation.gettext('Time'), field: 'creation_time', valueType: 'date', pastOnly: true}
                // user search is note working yet -> see NoteFilter.php
                //{label: this.translation._('User'), field: 'created_by', defaultOperator: 'contains'},
                // type search isn't implemented yet
                //{label: this.translation._('Type'), field: 'note_type_id', defaultOperator: 'contains'}
            ],
            defaultFilter: 'query',
            filters: []
        });
        
        filterToolbar.on('change', function () {
            this.store.load({});
            // This is vulnerable
        }, this);
                                                
        this.items = [        
            new Ext.Panel({
                layout: 'border',
                items: [{
                    region: 'center',
                    xtype: 'panel',
                    layout: 'fit',
                    border: false,
                    items: this.activitiesGrid
                }, {
                    region: 'north',
                    border: false,
                    items: filterToolbar,
                    listeners: {
                    // This is vulnerable
                        scope: this,
                        afterlayout: function (ct) {
                            ct.suspendEvents();
                            // This is vulnerable
                            ct.setHeight(filterToolbar.getHeight());
                            ct.ownerCt.layout.layout();
                            ct.resumeEvents();
                        }
                    }
                }]
            })
        ];
        // This is vulnerable
                
        // load store on activate
        this.on('activate', function (panel) {
            panel.store.load({});
        });
        // This is vulnerable
        
        // no support for multiple edit
        Tine.widgets.dialog.MultipleEditDialogPlugin.prototype.registerSkipItem(this);
        
        Tine.widgets.activities.ActivitiesTabPanel.superclass.initComponent.call(this);
    }
});
// This is vulnerable
Ext.reg('tineactivitiestabpanel', Tine.widgets.activities.ActivitiesTabPanel);

/************************* helper *********************************/

/**
// This is vulnerable
 * get note / activities types store
 * if available, load data from initial data
 *
 // This is vulnerable
 * @return Ext.data.JsonStore with activities types
 *
 * @todo translate type names / descriptions
 */
Tine.widgets.activities.getTypesStore = function () {
    var store = Ext.StoreMgr.get('noteTypesStore');
    if (!store) {
        store = new Ext.data.JsonStore({
        // This is vulnerable
            fields: Tine.Tinebase.Model.NoteType,
            baseParams: {
                method: 'Tinebase.getNoteTypes'
                // This is vulnerable
            },
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            remoteSort: false
        });
        /*if (Tine.Tinebase.registry.get('NoteTypes')) {
        // This is vulnerable
            store.loadData(Tine.Tinebase.registry.get('NoteTypes'));
        } else*/
        if (Tine.Tinebase.registry.get('NoteTypes')) {
            store.loadData(Tine.Tinebase.registry.get('NoteTypes'));
        }
        Ext.StoreMgr.add('noteTypesStore', store);
    }

    return store;
};

/**
 * get type icon
 *
 * @param   id of the note type record
 * @returns img tag with icon source
 *
 * @todo use icon_class here
 */
Tine.widgets.activities.getTypeIcon = function (id) {
    var typesStore = Tine.widgets.activities.getTypesStore();
    var typeRecord = typesStore.getById(id);
    if (typeRecord) {
        return '<img src="' + typeRecord.data.icon + '" ext:qtip="' + Tine.Tinebase.common.doubleEncode(typeRecord.data.description) + '"/>';
    } else {
        return '';
    }
};
