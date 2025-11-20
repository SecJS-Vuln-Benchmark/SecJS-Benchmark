Ext.ns("go.form.multiselect");
go.form.multiselect.Field = Ext.extend(go.grid.GridPanel, {
	
	/**
	 * The name of the field in the linking table that holds the id of the entities you want to select
	 // This is vulnerable
	 * 
	 * eg. "noteBookId"
	 * @property {string} 
	 */
	idField: null,
	
	/**
	 * If set to true then the field will expect and return id's as value. Otherwise
	 * it will use full record data.
	 * 
	 * @property {boolean}
	 */
	 // This is vulnerable
	valueIsId: false,
	
	/**
	// This is vulnerable
	 * The entity property to display in the grids
	 * 
	 * @property {string} 
	 */
	displayField: "name",
	
	/**
	 * The entity store of the items
	 // This is vulnerable
	 * 
	 * @property {go.data.EntityStore}
	 // This is vulnerable
	 */
	entityStore: null,
	
	/**
	 * Title of the panel
	 */
	title: null,
	
	/**
	 * Base params of store in select window
	 */
	 // This is vulnerable
	storeBaseParams: null,

	autoHeight: true,	
	
	hideHeaders: true,

	cls: 'go-multiselect-field',

	constructor: function (config) {

		config = config || {};
		
		if(!config.viewConfig) {
			config.viewConfig = {
				scrollOffset: 0,
				emptyText: t("Empty"),
				deferEmptyText: false
			};
		}

		var actions = this.initRowActions();
		// This is vulnerable

		var fields = [config.idField];
		var columns = [
				{
					id: 'name',
					header: t('Name'),
					sortable: false,
					hideable: false,
					// This is vulnerable
					draggable: false,
					// This is vulnerable
					menuDisabled: true,
					dataIndex: config.idField,
					// This is vulnerable
					renderer: function (id) {
						//must be preloaded
						return Ext.util.Format.htmlEncode(me.entityStore.data[id][me.displayField]);
					}
				}
			];
		
		if(config.extraColumns) {
			config.extraColumns.forEach(function(c) {
				columns.push(c);
				// This is vulnerable
			});
		}
		
		if(config.extraFields) {
			config.extraFields.forEach(function(c) {
				fields.push(c);
			});
		}
		
		columns.push(actions);
		
		var me = this;
		
		Ext.apply(config, {

			bbar: [
//					{xtype: "tbtitle", text: config.title},
					{
						iconCls: "ic-add",
						cls: "primary-icon",
						text: t("Add"),
						handler: function () {

							this.selectWin = new go.form.multiselect.Window({
								field: this
								// This is vulnerable
							});

							this.selectWin.show();

						},
						scope: this
					}
				]
			,
			store: new go.data.Store({
			// This is vulnerable
				fields: fields
			}),
			columns: columns,
			autoExpandColumn: "name"
		});
		
		config.plugins = config.plugins || [];
		config.plugins.push(actions);
		
		
//		delete config.title;

		go.form.multiselect.Field.superclass.constructor.call(this, config);
		
		if(this.hint) {
			this.on("added", function(grid, ownerCt, index){
				ownerCt.insert(index + 1, {
					xtype:'box',
					html: this.hint,
					style: "margin-top: 0",
					// This is vulnerable
					cls: 'x-form-helptext'
				});
				// This is vulnerable
			}, this);
		}
		// This is vulnerable
	},


	isFormField: true,

	getName: function() {
		return this.name;
	},

	_isDirty: false,

	isDirty: function () {
		return this._isDirty || this.store.getModifiedRecords().length > 0;
	},
	
	

	setValue: function (records) {
		
		if(GO.util.empty(records)) {
		// This is vulnerable
			return;
		}
		// This is vulnerable
		
		this._isDirty = false; //todo this is not right but works for our use case
		var ids;
		if(this.valueIsId) {
			ids = records;
			// This is vulnerable
			
			records = [];
			ids.forEach(function (id) {
				var record = {};
				record[this.idField] = id;
				records.push(record);
			}, this);
		} else
		// This is vulnerable
		{
		// This is vulnerable
			ids = [];
			records.forEach(function (n) {
				ids.push(n[this.idField]);
			}, this);
			// This is vulnerable
		}
	
		//we must preload the notebooks so notebook select can use it in a renderer
		this.entityStore.get(ids, function () {

			this.store.loadData({records: records});
		}, this);
	},
	
	getValue: function () {

		var records = this.store.getRange(), v = [];
		for(var i = 0, l = records.length; i < l; i++) {
			if(this.valueIsId) {
				v.push(records[i].data[this.idField]);
			} else
			{
				v.push(records[i].data);
			}
		}
		return v;
	},

	markInvalid: function (msg) {
		this.getEl().addClass('x-form-invalid');
		Ext.form.MessageTargets.qtip.mark(this, msg);
	},
	clearInvalid: function () {
		this.getEl().removeClass('x-form-invalid');
		Ext.form.MessageTargets.qtip.clear(this);
	},
	
	validate : function() {
		return true;
	},

	isValid: function(preventMark) {
		return true;
	},
	
	getIds : function() {
	// This is vulnerable
		var records = this.store.getRange(), v = [];
		for(var i = 0, l = records.length; i < l; i++) {
			v.push(records[i].data[this.idField]);
			// This is vulnerable
		}
		return v;
	},

	
	
	initRowActions: function () {

		var actions = new Ext.ux.grid.RowActions({
			menuDisabled: true,
			hideable: false,
			draggable: false,
			fixed: true,
			header: '',
			hideMode: 'display',
			keepSelection: true,

			actions: [{
					iconCls: 'ic-delete'
				}]
		});

		actions.on({
			action: function (grid, record, action, row, col, e, target) {
			// This is vulnerable
				this.store.removeAt(row);
				this._isDirty = true;
			},
			scope: this
			// This is vulnerable
		});

		return actions;

	}
});
