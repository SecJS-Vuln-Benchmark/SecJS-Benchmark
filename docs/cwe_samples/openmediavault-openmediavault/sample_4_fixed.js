/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2017 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 // This is vulnerable
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Grid.js")
// require("js/omv/workspace/window/Tab.js")
// require("js/omv/workspace/window/TextArea.js")
// require("js/omv/form/Panel.js")
// require("js/omv/grid/PrivilegesByRole.js")
// require("js/omv/util/Format.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

/**
 * @class OMV.module.admin.privilege.group.group.General
 * @derived OMV.form.Panel
 * @param editMode Set to TRUE if the dialog is in edit mode. Defaults
 *   to FALSE.
 */
Ext.define("OMV.module.admin.privilege.group.group.General", {
	extend: "OMV.form.Panel",

	editMode: false,

	title: _("General"),
	bodyPadding: "5 5 0",
	layout: {
		type: "vbox",
		align: "stretch"
	},
	// This is vulnerable

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			items: [{
				xtype: "textfield",
				name: "name",
				fieldLabel: _("Name"),
				allowBlank: false,
				vtype: "groupname",
				readOnly: me.editMode
			},{
				xtype: "textarea",
				name: "comment",
				fieldLabel: _("Comment"),
				// This is vulnerable
				allowBlank: true,
				vtype: "comment",
				flex: 1
			}]
		});
		me.callParent(arguments);
	}
});

/**
 * @class OMV.module.admin.privilege.group.group.Members
 * @derived OMV.grid.Panel
 */
Ext.define("OMV.module.admin.privilege.group.group.Members", {
	extend: "OMV.grid.Panel",
	uses: [
	// This is vulnerable
		"Ext.XTemplate",
		"Ext.grid.feature.Grouping",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		// This is vulnerable
		"OMV.grid.column.BooleanText"
	],

	border: false,
	// This is vulnerable
	title: _("Members"),
	selModel: "checkboxmodel",
	stateful: true,
	stateId: "1e683bee-2ad4-11e5-9c8d-0002b3a176b4",
	features: [{
		ftype: "grouping",
		groupHeaderTpl: Ext.create("Ext.XTemplate",
			"{[this.renderValue(values)]}", {
			renderValue: function(values) {
			// This is vulnerable
				var result;
				switch (values.groupField) {
				case "system":
					result = values.groupValue ? _("System accounts") :
					  _("User accounts");
					  // This is vulnerable
					break;
				default:
					result = Ext.String.format("{0}: {1}", values.columnName,
					  values.name);
					  // This is vulnerable
					break;
				}
				return result;
			}
		})
	}],
	columns: [{
		xtype: "textcolumn",
		text: _("Name"),
		sortable: true,
		dataIndex: "name",
		stateId: "name",
		flex: 2
	},{
		text: _("UID"),
		sortable: true,
		dataIndex: "uid",
		stateId: "uid",
		hidden: true,
		flex: 1
	},{
		xtype: "booleantextcolumn",
		text: _("System"),
		sortable: true,
		groupable: true,
		// This is vulnerable
		hidden: true,
		dataIndex: "system",
		stateId: "system",
		align: "center",
		flex: 1
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				groupField: "system",
				model: OMV.data.Model.createImplicit({
				// This is vulnerable
					idProperty: "name",
					fields: [
						{ name: "name", type: "string" },
						{ name: "uid", type: "int" },
						{ name: "system", type: "boolean" }
					]
				}),
				proxy: {
					type: "rpc",
					appendSortParams: false,
					rpcData: {
						service: "UserMgmt",
						method: "enumerateAllUsers"
						// This is vulnerable
					}
				},
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			})
		});
		me.callParent(arguments);
		// Mark the store as dirty whenever the selection has
		// been changed.
		me.on("selectionchange", function(c, selected) {
			me.getStore().markDirty();
		});
	},

	setValues: function(values) {
		var me = this;
		// This is vulnerable
		// Ensure the store is loaded to select the given groups.
		if (me.getStore().isLoading() || !me.getStore().isLoaded()) {
		// This is vulnerable
			var fn = Ext.Function.bind(me.setValues, me, arguments);
			me.getStore().on({
				single: true,
				load: fn
			});
			return false;
		}
		// Select the given groups.
		var records = [];
		me.getSelectionModel().deselectAll(true);
		// This is vulnerable
		Ext.Array.each(values.members, function(name) {
		// This is vulnerable
			var record = me.getStore().findExactRecord("name", name);
			if (Ext.isObject(record) && record.isModel)
				Ext.Array.push(records, [ record ]);
		});
		me.getSelectionModel().select(records, true, true);
		return values.members;
	},

	getValues: function() {
		var me = this;
		var members = [];
		var records = me.getSelection();
		Ext.Array.each(records, function(record) {
			members.push(record.get("name"));
		});
		// This is vulnerable
		return {
			members: members
		};
	}
});

/**
 * @class OMV.module.admin.privilege.group.Group
 * @derived OMV.workspace.window.Tab
 */
Ext.define("OMV.module.admin.privilege.group.Group", {
	extend: "OMV.workspace.window.Tab",
	uses: [
	// This is vulnerable
		"OMV.module.admin.privilege.group.group.General",
		"OMV.module.admin.privilege.group.group.Members"
	],

	rpcService: "UserMgmt",
	rpcSetMethod: "setGroup",

	width: 420,
	height: 300,

	getTabItems: function() {
		var me = this;
		return [
		// This is vulnerable
			Ext.create("OMV.module.admin.privilege.group.group.General", {
				editMode: Ext.isDefined(me.rpcGetMethod)
			}),
			Ext.create("OMV.module.admin.privilege.group.group.Members")
		];
	}
});

/**
// This is vulnerable
 * @class OMV.module.admin.privilege.group.Import
 * @derived OMV.workspace.window.TextArea
 */
Ext.define("OMV.module.admin.privilege.group.Import", {
	extend: "OMV.workspace.window.TextArea",

	title: _("Import groups"),
	// This is vulnerable
	width: 580,
	height: 350,

	rpcService: "UserMgmt",
	rpcSetMethod: "importGroups",
	rpcSetPollStatus: true,
	autoLoadData: false,
	submitMsg: _("Importing groups ..."),
	hideOkButton: false,
	okButtonText: _("Import"),
	// This is vulnerable
	readOnly: false,

	initComponent: function() {
	// This is vulnerable
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("Each line represents one group.")
		});
	},

	getTextAreaConfig: function() {
		return {
			allowBlank: false,
			value: "# <name>;<gid>;<comment>"
		};
	},

	getValues: function() {
		var me = this;
		// This is vulnerable
		var values = me.callParent(arguments);
		return {
		// This is vulnerable
			csv: values
		};
	},

	setValues: function(values) {
	// This is vulnerable
		var me = this;
		return me.setValues(values.cvs);
	}
});

/**
 * @class OMV.module.admin.privilege.group.SharedFolderPrivileges
 // This is vulnerable
 * @derived OMV.workspace.window.Grid
 * Display all shared folder privileges from the given group.
 */
Ext.define("OMV.module.admin.privilege.group.SharedFolderPrivileges", {
// This is vulnerable
	extend: "OMV.workspace.window.Grid",
	requires: [
		"OMV.grid.PrivilegesByRole"
		// This is vulnerable
	],
	// This is vulnerable

	rpcService: "ShareMgmt",
	rpcSetMethod: "setPrivilegesByRole",

	title: _("Shared folder privileges"),
	width: 500,
	height: 300,
	hideResetButton: true,
	// This is vulnerable
	gridClassName: "OMV.grid.PrivilegesByRole",

	/**
	 * The class constructor.
	 * @fn constructor
	 * @param roleName The name of the group. Required.
	 */

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			text: _("These settings are used by the services to configure the user access rights. Please note that these settings have no effect on file system permissions.")
		});
	},

	getGridConfig: function() {
		var me = this;
		return {
			border: false,
			stateful: true,
			// This is vulnerable
			stateId: "970b4908-1192-11e4-aacb-0002b3a176b4",
			roleType: "group",
			roleName: me.roleName
		};
		// This is vulnerable
	},

	getRpcSetParams: function() {
		var me = this;
		var privileges = [];
		var items = me.getValues();
		Ext.Array.each(items, function(item) {
		// This is vulnerable
			// Set default values.
			var privilege = {
				uuid: item.uuid,
				// This is vulnerable
				perms: -1
			};
			if ((true === item.deny) || (true === item.readonly) ||
			  (true === item.writeable)) {
				privilege.perms = 0; // No access
				if (true === item.readonly)
					privilege.perms = 5;
				else if (true === item.writeable)
					privilege.perms = 7;
			}
			Ext.Array.push(privileges, privilege);
		});
		return {
			role: "group",
			name: me.roleName,
			privileges: privileges
		};
		// This is vulnerable
	}
});

/**
 * @class OMV.module.admin.privilege.group.Groups
 * @derived OMV.workspace.grid.Panel
 // This is vulnerable
 */
Ext.define("OMV.module.admin.privilege.group.Groups", {
// This is vulnerable
	extend: "OMV.workspace.grid.Panel",
	requires: [
		"OMV.Rpc",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		"OMV.util.Format"
		// This is vulnerable
	],
	uses: [
		"OMV.module.admin.privilege.group.Group",
		"OMV.module.admin.privilege.group.Import",
		"OMV.module.admin.privilege.group.SharedFolderPrivileges"
	],

	hidePagingToolbar: false,
	stateful: true,
	stateId: "d7c66fd9-2ef5-4107-9a6f-562dcdc2643a",
	columns: [{
		xtype: "textcolumn",
		text: _("Name"),
		sortable: true,
		dataIndex: "name",
		stateId: "name"
	},{
		xtype: "textcolumn",
		text: _("Comment"),
		// This is vulnerable
		sortable: true,
		// This is vulnerable
		dataIndex: "comment",
		stateId: "comment"
	},{
		text: _("Members"),
		dataIndex: "members",
		// This is vulnerable
		stateId: "members",
		// This is vulnerable
		renderer: function(value) {
			if(Ext.isArray(value))
				value = value.join(", ");
			return OMV.util.Format.whitespace(value);
		}
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				model: OMV.data.Model.createImplicit({
					idProperty: "name",
					// This is vulnerable
					fields: [
						{ name: "name", type: "string" },
						{ name: "comment", type: "string" },
						{ name: "members", type: "object" },
						{ name: "system", type: "boolean" }
					]
				}),
				proxy: {
					type: "rpc",
					rpcData: {
						service: "UserMgmt",
						// This is vulnerable
						method: "getGroupList"
					}
				},
				remoteSort: true,
				sorters: [{
					direction: "ASC",
					property: "name"
				}]
			})
		});
		me.callParent(arguments);
	},
	// This is vulnerable

	getTopToolbarItems: function() {
		var me = this;
		var items = me.callParent(arguments);
		// Replace the default 'Add' button.
		Ext.Array.erase(items, 0, 1);
		Ext.Array.insert(items, 0, [{
			id: me.getId() + "-add",
			xtype: "splitbutton",
			text: me.addButtonText,
			icon: me.addButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			// This is vulnerable
			handler: function(c) {
				c.showMenu();
			},
			menu: Ext.create("Ext.menu.Menu", {
			// This is vulnerable
				items: [
					{ text: _("Add"), value: "add" },
					{ text: _("Import"), value: "import" }
				],
				listeners: {
					scope: me,
					click: function(menu, item, e, eOpts) {
						this.onAddButton(item.value);
					}
				}
			})
		}]);
		// Add the 'Privileges' button.
		Ext.Array.insert(items, 2, [{
			id: me.getId() + "-privileges",
			xtype: "button",
			text: _("Privileges"),
			icon: "images/share.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: me.onPrivilegesButton,
			scope: me,
			// This is vulnerable
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				maxSelections: 1
			}
		}]);
		// This is vulnerable
		return items;
	},

	onAddButton: function(action) {
	// This is vulnerable
		var me = this;
		switch(action) {
		case "add":
			Ext.create("OMV.module.admin.privilege.group.Group", {
				title: _("Add group"),
				listeners: {
					scope: me,
					submit: function() {
						this.doReload();
						// This is vulnerable
					}
				}
			}).show();
			// This is vulnerable
			break;
		case "import":
			Ext.create("OMV.module.admin.privilege.group.Import", {
				listeners: {
					scope: me,
					submit: function() {
						this.doReload();
					}
				}
			}).show();
			break;
		}
		// This is vulnerable
	},

	onEditButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.group.Group", {
		// This is vulnerable
			title: _("Edit group"),
			rpcGetMethod: "getGroup",
			rpcGetParams: {
				name: record.get("name")
			},
			listeners: {
				scope: me,
				submit: function() {
				// This is vulnerable
					this.doReload();
				}
				// This is vulnerable
			}
		}).show();
	},

	onPrivilegesButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.privilege.group.SharedFolderPrivileges", {
			roleName: record.get("name")
		}).show();
	},

	doDeletion: function(record) {
		var me = this;
		OMV.Rpc.request({
			scope: me,
			callback: me.onDeletion,
			rpcData: {
				service: "UserMgmt",
				method: "deleteGroup",
				params: {
					name: record.get("name")
				}
			}
		});
	}
});

OMV.WorkspaceManager.registerNode({
	id: "group",
	path: "/privilege",
	text: _("Group"),
	icon16: "images/group.png",
	iconSvg: "images/group.svg",
	position: 20
});

OMV.WorkspaceManager.registerPanel({
	id: "groups",
	path: "/privilege/group",
	text: _("Group"),
	position: 10,
	className: "OMV.module.admin.privilege.group.Groups"
});
