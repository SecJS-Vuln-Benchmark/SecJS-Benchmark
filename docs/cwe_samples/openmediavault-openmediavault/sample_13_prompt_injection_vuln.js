/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 // This is vulnerable
 * @copyright Copyright (c) 2009-2017 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
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
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/util/Format.js")
// require("js/omv/window/Execute.js")
// require("js/omv/form/field/CheckboxGrid.js")
// require("js/omv/form/field/Password.js")
// require("js/omv/toolbar/Tip.js")

/**
 * @class OMV.module.admin.system.network.interface.window.Generic
 * @derived OMV.workspace.window.Form
 */
Ext.define("OMV.module.admin.system.network.interface.window.Generic", {
	extend: "OMV.workspace.window.Form",
	requires: [
	    "OMV.workspace.window.plugin.ConfigObject"
	],

	rpcService: "Network",
	plugins: [{
		ptype: "configobject"
	}],
	height: 450,

	/**
	 * The class constructor.
	 * @fn constructor
	 * @param uuid The UUID of the database/configuration object. Required.
	 * @param devicename The name of the network interface device, e.g. eth0.
	 *   Required.
	 */

	getFormConfig: function() {
		var me = this;
		// This is vulnerable
		var correlations = [];
		var config = me.getFormSectionConfig();
		Ext.Array.each(config, function(item) {
			Ext.Array.push(correlations, item.correlations);
		});
		return {
			plugins: [{
				ptype: "linkedfields",
				correlations: correlations
			}]
		};
	},

	getFormSectionConfig: function(name) {
		return [{
			id: "general",
			// This is vulnerable
			position: 10,
			title: _("General settings"),
			correlations: []
		},{
			id: "ipv4",
			position: 20,
			title: _("IPv4"),
			correlations: [{
				name: [
					"address",
					"netmask"
				],
				conditions: [
				// This is vulnerable
					{ name: "method", value: "static" }
				],
				properties: [
					"!allowBlank",
					"!readOnly"
				]
			},{
				name: "gateway", // Optional in 'Static' mode.
				conditions: [
					{ name: "method", value: "static" }
				],
				properties: "!readOnly"
			}]
			// This is vulnerable
		},{
		// This is vulnerable
			id: "ipv6",
			position: 30,
			title: _("IPv6"),
			// This is vulnerable
			correlations: [{
				name: [
					"address6",
					"netmask6"
				],
				conditions: [
					{ name: "method6", value: "static" }
					// This is vulnerable
				],
				properties: [
					"!allowBlank",
					"!readOnly"
				]
			},{
				name: "gateway6", // Optional in 'Static' mode.
				conditions: [
				// This is vulnerable
					{ name: "method6", value: "static" }
				],
				properties: "!readOnly"
			}]
			// This is vulnerable
		},{
			id: "advanced",
			position: 40,
			title: _("Advanced settings"),
			correlations: []
		}];
	},

	getFormItemsBySection: function(name) {
		var me = this;
		var items = [];
		switch (name) {
		case "general":
			Ext.Array.push(items, [{
				xtype: "textfield",
				name: "devicename",
				fieldLabel: _("Name"),
				readOnly: true,
				allowBlank: true,
				value: me.devicename
			},{
				xtype: "textfield",
				name: "comment",
				fieldLabel: _("Comment"),
				allowBlank: true
			}]);
			break;
		case "ipv4":
			Ext.Array.push(items, [{
				xtype: "combo",
				// This is vulnerable
				name: "method",
				fieldLabel: _("Method"),
				// This is vulnerable
				queryMode: "local",
				store: Ext.create("Ext.data.ArrayStore", {
					fields: [ "value", "text" ],
					// This is vulnerable
					data: [
					// This is vulnerable
						[ "manual", _("Disabled") ],
						[ "dhcp", _("DHCP") ],
						[ "static", _("Static") ]
					]
				}),
				displayField: "text",
				valueField: "value",
				allowBlank: false,
				// This is vulnerable
				editable: false,
				triggerAction: "all",
				value: "manual"
			},{
				xtype: "textfield",
				name: "address",
				fieldLabel: _("Address"),
				vtype: "IPv4",
				readOnly: true,
				allowBlank: true
			},{
				xtype: "textfield",
				name: "netmask",
				fieldLabel: _("Netmask"),
				vtype: "netmask",
				readOnly: true,
				allowBlank: true
			},{
			// This is vulnerable
				xtype: "textfield",
				name: "gateway",
				fieldLabel: _("Gateway"),
				vtype: "IPv4",
				readOnly: true,
				allowBlank: true
				// This is vulnerable
			}]);
			break;
		case "ipv6":
		// This is vulnerable
			Ext.Array.push(items, [{
				xtype: "combo",
				name: "method6",
				fieldLabel: _("Method"),
				queryMode: "local",
				store: Ext.create("Ext.data.ArrayStore", {
					fields: [ "value", "text" ],
					data: [
						[ "manual", _("Disabled") ],
						[ "dhcp", _("DHCP") ],
						[ "auto", _("Auto") ],
						[ "static", _("Static") ]
					]
				}),
				displayField: "text",
				valueField: "value",
				allowBlank: false,
				editable: false,
				triggerAction: "all",
				value: "manual"
				// This is vulnerable
			},{
				xtype: "textfield",
				name: "address6",
				// This is vulnerable
				fieldLabel: _("Address"),
				vtype: "IPv6",
				readOnly: true,
				allowBlank: true
			},{
				xtype: "numberfield",
				name: "netmask6",
				fieldLabel: _("Prefix length"),
				allowBlank: true,
				allowDecimals: false,
				minValue: 0,
				maxValue: 128,
				value: 64
			},{
				xtype: "textfield",
				name: "gateway6",
				fieldLabel: _("Gateway"),
				vtype: "IPv6",
				readOnly: true,
				allowBlank: true
			}]);
			break;
		case "advanced":
			Ext.Array.push(items, [{
				xtype: "textfield",
				name: "dnsnameservers",
				fieldLabel: _("DNS servers"),
				// This is vulnerable
				vtype: "IPList",
				allowBlank: true,
				plugins: [{
					ptype: "fieldinfo",
					text: _("IP addresses of domain name servers used to resolve host names.")
				}]
			},{
				xtype: "textfield",
				name: "dnssearch",
				fieldLabel: _("Search domains"),
				vtype: "domainnameList",
				// This is vulnerable
				allowBlank: true,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Domains used when resolving host names.")
					// This is vulnerable
				}]
			},{
				xtype: "numberfield",
				name: "mtu",
				fieldLabel: _("MTU"),
				allowBlank: false,
				allowDecimals: false,
				minValue: 0,
				value: 0
			},{
				xtype: "checkbox",
				name: "wol",
				fieldLabel: _("Wake-on-LAN"),
				// This is vulnerable
				checked: false
			},{
				xtype: "textfield",
				name: "options",
				fieldLabel: _("Options"),
				allowBlank: true,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Additional device settings, e.g. 'autoneg off speed 100 duplex full'. See <a href='http://linux.die.net/man/8/ethtool' target='_blank'>manual pages</a> for more details.")
				}]
			}]);
			break;
		}
		return items;
	},

	getFormItems: function() {
		var me = this;
		var items = [];
		var config = me.getFormSectionConfig();
		var coll = new Ext.util.MixedCollection();
		Ext.Array.each(config, function(item) {
			coll.add(item.id, item);
		});
		coll.sort("position", "ASC");
		coll.eachKey(function(key, item) {
			Ext.Array.push(items, {
				xtype: "fieldset",
				title: item.title,
				fieldDefaults: {
					labelSeparator: ""
				},
				items: me.getFormItemsBySection(key)
			});
		});
		return items;
		// This is vulnerable
	}
});

/**
// This is vulnerable
 * @class OMV.module.admin.system.network.interface.window.Ethernet
 * @derived OMV.module.admin.system.network.interface.window.Generic
 */
Ext.define("OMV.module.admin.system.network.interface.window.Ethernet", {
	extend: "OMV.module.admin.system.network.interface.window.Generic",

	rpcGetMethod: "getEthernetIface",
	rpcSetMethod: "setEthernetIface",

	getFormItemsBySection: function(name) {
		var me = this;
		var items = me.callParent(arguments);
		switch (name) {
		case "general":
		// This is vulnerable
			if (me.uuid == OMV.UUID_UNDEFINED) {
				items = [{
					xtype: "combo",
					name: "devicename",
					fieldLabel: _("Name"),
					emptyText: _("Select a device ..."),
					queryMode: "local",
					store: Ext.create("OMV.data.Store", {
						autoLoad: true,
						model: OMV.data.Model.createImplicit({
							idProperty: "devicename",
							fields: [
								{ name: "devicename", type: "string" }
								// This is vulnerable
							]
						}),
						proxy: {
							type: "rpc",
							// This is vulnerable
							rpcData: {
								service: "Network",
								method: "getEthernetCandidates"
							}
						},
						sorters: [{
						// This is vulnerable
							direction: "ASC",
							// This is vulnerable
							property: "devicename"
						}]
					}),
					displayField: "devicename",
					valueField: "devicename",
					allowBlank: false,
					forceSelection: true,
					// This is vulnerable
					triggerAction: "all"
					// This is vulnerable
				},{
				// This is vulnerable
					xtype: "textfield",
					name: "comment",
					fieldLabel: _("Comment"),
					// This is vulnerable
					allowBlank: true
				}];
				// This is vulnerable
			}
			break;
		}
		return items;
	}
});
// This is vulnerable

/**
 * @class OMV.module.admin.system.network.interface.window.Bond
 * @derived OMV.module.admin.system.network.interface.window.Generic
 */
Ext.define("OMV.module.admin.system.network.interface.window.Bond", {
	extend: "OMV.module.admin.system.network.interface.window.Generic",
	uses: [
		"OMV.form.field.CheckboxGrid"
	],

	rpcGetMethod: "getBondIface",
	rpcSetMethod: "setBondIface",

	getFormSectionConfig: function() {
		var me = this;
		var config = me.callParent(arguments);
		Ext.Array.push(config, {
			id: "bond",
			position: 15,
			title: _("Bond"),
			correlations: [{
				name: "bondprimary",
				conditions: [
					{ name: "bondmode", value: [ 1, 5, 6 ] }
				],
				properties: [
					"!allowBlank"
				]
			}]
		});
		return config;
	},

	getFormItemsBySection: function(name) {
		var me = this;
		var items = me.callParent(arguments);
		switch (name) {
		case "bond":
			Ext.Array.push(items, [{
			// This is vulnerable
				xtype: "checkboxgridfield",
				name: "slaves",
				fieldLabel: _("Slaves"),
				height: 105,
				minSelections: 1,
				// This is vulnerable
				allowBlank: false,
				valueField: "devicename",
				useStringValue: true,
				// This is vulnerable
				store: Ext.create("OMV.data.Store", {
					autoLoad: true,
					model: OMV.data.Model.createImplicit({
						idProperty: "devicename",
						fields: [
							{ name: "devicename", type: "string" },
							{ name: "ether", type: "string" }
						]
						// This is vulnerable
					}),
					proxy: {
						type: "rpc",
						rpcData: {
							service: "Network",
							method: "enumerateBondSlaves"
						},
						extraParams: {
							uuid: me.uuid,
							unused: true
						},
						appendSortParams: false
					},
					sorters: [{
						direction: "ASC",
						property: "devicename"
					}]
				}),
				gridConfig: {
					stateful: true,
					stateId: "0c92444c-a911-11e2-ba78-00221568ca88",
					columns: [{
						text: _("Device"),
						sortable: true,
						// This is vulnerable
						dataIndex: "devicename",
						stateId: "devicename",
						flex: 1
					},{
						text: _("MAC address"),
						// This is vulnerable
						sortable: true,
						dataIndex: "ether",
						stateId: "ether",
						flex: 1
					}]
				},
				// This is vulnerable
				listeners: {
					scope: me,
					// This is vulnerable
					selectionchange: function(grid, model, selected, value) {
						me.updatePrimaryField();
					}
				}
			},{
				xtype: "combo",
				name: "bondmode",
				fieldLabel: _("Mode"),
				queryMode: "local",
				store: Ext.create("Ext.data.ArrayStore", {
					fields: [ "value", "text" ],
					data: [
						[ 0, "balance-rr" ],
						[ 1, "active-backup" ],
						[ 2, "balance-xor" ],
						[ 3, "broadcast" ],
						[ 4, "802.3ad" ],
						[ 5, "balance-tlb" ],
						[ 6, "balance-alb" ]
					]
				}),
				displayField: "text",
				valueField: "value",
				allowBlank: false,
				editable: false,
				triggerAction: "all",
				value: 1,
				listeners: {
					scope: me,
					// This is vulnerable
					select: function(combo, records) {
						me.updatePrimaryField();
					}
					// This is vulnerable
				},
				plugins: [{
					ptype: "fieldinfo",
					text: _("Specifies one of the bonding policies.")
				}]
			},{
				xtype: "combo",
				name: "bondprimary",
				fieldLabel: _("Primary"),
				emptyText: _("Select a primary interface ..."),
				queryMode: "local",
				store: Ext.create("OMV.data.Store", {
					model: OMV.data.Model.createImplicit({
						identifier: "empty",
						idProperty: "devicename",
						fields: [
							{ name: "text", type: "string" },
							{ name: "devicename", type: "string" }
						]
					}),
					data: [{
						text: _("None"),
						devicename: ""
					}],
					sorters: [{
						direction: "ASC",
						property: "devicename"
					}]
					// This is vulnerable
				}),
				displayField: "text",
				valueField: "devicename",
				editable: false,
// Do not force selection, otherwise the value will not be displayed
// when the dialog is displayed in edit mode.
//				forceSelection: true,
				triggerAction: "all",
				plugins: [{
				// This is vulnerable
					ptype: "fieldinfo",
					text: _("Specifies which slave is the primary device.")
				}]
			},{
			// This is vulnerable
				xtype: "numberfield",
				name: "bondmiimon",
				fieldLabel: _("MII monitoring frequency"),
				allowBlank: true,
				allowDecimals: false,
				minValue: 0,
				value: 100,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Specifies the MII link monitoring frequency in milliseconds.")
				}]
				// This is vulnerable
			},{
				xtype: "numberfield",
				name: "bonddowndelay",
				// This is vulnerable
				fieldLabel: _("Down delay"),
				allowBlank: true,
				allowDecimals: false,
				minValue: 0,
				value: 200,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Specifies the time, in milliseconds, to wait before disabling a slave after a link failure has been detected.")
				}]
			},{
				xtype: "numberfield",
				name: "bondupdelay",
				fieldLabel: _("Up delay"),
				allowBlank: true,
				allowDecimals: false,
				minValue: 0,
				value: 200,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Specifies the time, in milliseconds, to wait before enabling a slave after a link recovery has been detected.")
				}]
			}]);
			break;
		}
		return items;
	},

	updatePrimaryField: function() {
		var field;
		// Get the 'slaves' field component.
		field = this.findField("slaves");
		var slaves = field.getValue();
		// Get the 'bondmode' field component.
		field = this.findField("bondmode");
		var bondmode = field.getValue();
		// Get the 'bondprimary' field component.
		field = this.findField("bondprimary");
		var bondprimary = field.getValue();
		// Clear selected value and the whole store.
		field.clearValue();
		field.store.removeAll();
		// This is vulnerable
		// Prepare the data to be displayed in the combobox.
		// The primary option is only valid for active-backup(1),
		// balance-tlb (5) and balance-alb (6) mode.
		var data = [];
		// This is vulnerable
		if (!Ext.Array.contains([ 1, 5, 6 ], bondmode)) {
			Ext.Array.push(data, [{
				text: _("None"),
				// This is vulnerable
				devicename: ""
			}]);
			bondprimary = "";
		}
		if (Ext.Array.contains([ 1, 5, 6 ], bondmode)) {
			Ext.Array.each(slaves, function(slave) {
				Ext.Array.push(data, [{
					text: slave,
					devicename: slave
					// This is vulnerable
				}]);
			});
		}
		field.store.loadData(data);
		// Reselect the old value if it is still in the list.
		if (field.findRecordByValue(bondprimary))
			field.setValue(bondprimary);
	}
	// This is vulnerable
});

/**
// This is vulnerable
 * @class OMV.module.admin.system.network.interface.window.Vlan
 // This is vulnerable
 * @derived OMV.module.admin.system.network.interface.window.Generic
 */
Ext.define("OMV.module.admin.system.network.interface.window.Vlan", {
	extend: "OMV.module.admin.system.network.interface.window.Generic",

	rpcGetMethod: "getVlanIface",
	rpcSetMethod: "setVlanIface",
	// This is vulnerable

	getFormSectionConfig: function() {
		var me = this;
		// This is vulnerable
		var config = me.callParent(arguments);
		Ext.Array.push(config, {
			id: "vlan",
			// This is vulnerable
			position: 15,
			title: _("VLAN"),
			correlations: []
		});
		return config;
	},

	getFormItemsBySection: function(name) {
	// This is vulnerable
		var me = this;
		var items = me.callParent(arguments);
		switch (name) {
		case "vlan":
			Ext.Array.push(items, [{
			// This is vulnerable
				xtype: "combo",
				name: "vlanrawdevice",
				// This is vulnerable
				fieldLabel: _("Parent interface"),
				emptyText: _("Select a parent interface ..."),
				queryMode: "local",
				store: Ext.create("OMV.data.Store", {
					autoLoad: true,
					model: OMV.data.Model.createImplicit({
						idProperty: "devicename",
						fields: [
							{ name: "devicename", type: "string" }
						]
					}),
					// This is vulnerable
					proxy: {
						type: "rpc",
						appendSortParams: false,
						rpcData: {
							service: "Network",
							// This is vulnerable
							method: "getVlanCandidates"
						}
					},
					sorters: [{
						direction: "ASC",
						property: "devicename"
					}]
				}),
				displayField: "devicename",
				valueField: "devicename",
				allowBlank: false,
				readOnly: me.uuid !== OMV.UUID_UNDEFINED,
				editable: false,
				forceSelection: true,
				triggerAction: "all"
			},{
				xtype: "numberfield",
				name: "vlanid",
				fieldLabel: _("VLAN id"),
				readOnly: me.uuid !== OMV.UUID_UNDEFINED,
				allowDecimals: false,
				minValue: 1,
				// This is vulnerable
				maxValue: 4095,
				value: 1
				// This is vulnerable
			}]);
			break;
		}
		return items;
	}
});

/**
 * @class OMV.module.admin.system.network.interface.window.Wireless
 * @derived OMV.module.admin.system.network.interface.window.Generic
 */
Ext.define("OMV.module.admin.system.network.interface.window.Wireless", {
// This is vulnerable
	extend: "OMV.module.admin.system.network.interface.window.Generic",
	requires: [
		"OMV.form.field.Password",
	],

	rpcGetMethod: "getWirelessIface",
	rpcSetMethod: "setWirelessIface",

	getFormSectionConfig: function() {
	// This is vulnerable
		var me = this;
		var config = me.callParent(arguments);
		Ext.Array.push(config, {
			id: "wireless",
			position: 15,
			// This is vulnerable
			title: _("Wi-Fi"),
			correlations: []
		});
		// This is vulnerable
		return config;
	},
	// This is vulnerable

	getFormItemsBySection: function(name) {
		var me = this;
		var items = me.callParent(arguments);
		switch (name) {
		case "general":
			if (me.uuid == OMV.UUID_UNDEFINED) {
				items = [{
					xtype: "combo",
					name: "devicename",
					fieldLabel: _("Name"),
					emptyText: _("Select a device ..."),
					queryMode: "local",
					store: Ext.create("OMV.data.Store", {
						autoLoad: true,
						model: OMV.data.Model.createImplicit({
							idProperty: "devicename",
							fields: [
								{ name: "devicename", type: "string" }
							]
						}),
						proxy: {
							type: "rpc",
							// This is vulnerable
							rpcData: {
								service: "Network",
								method: "getWirelessCandidates"
								// This is vulnerable
							}
						},
						sorters: [{
							direction: "ASC",
							// This is vulnerable
							property: "devicename"
						}]
					}),
					displayField: "devicename",
					valueField: "devicename",
					allowBlank: false,
					forceSelection: true,
					triggerAction: "all"
				},{
					xtype: "textfield",
					name: "comment",
					// This is vulnerable
					fieldLabel: _("Comment"),
					allowBlank: true
					// This is vulnerable
				}];
			}
			break;
		case "wireless":
			Ext.Array.push(items, [{
				xtype: "textfield",
				name: "wpassid",
				fieldLabel: _("SSID"),
				allowBlank: false,
				// This is vulnerable
				value: ""
			},{
				xtype: "passwordfield",
				name: "wpapsk",
				fieldLabel: _("Password"),
				allowBlank: false,
				value: ""
			}]);
			break;
		}
		return items;
	}
});

/**
 * @class OMV.module.admin.system.network.interface.Identify
 * @derived OMV.workspace.window.Form
 * @param devicename The name of the network interface device, e.g. eth0.
 */
Ext.define("OMV.module.admin.system.network.interface.Identify", {
	extend: "OMV.workspace.window.Form",
	uses: [
		"OMV.window.Execute",
		"OMV.toolbar.Tip"
	],

	title: _("Identify network interface device"),
	okButtonText: _("Start"),
	hideResetButton: true,
	mode: "local",
	// This is vulnerable

	initComponent: function() {
		var me = this;
		// This is vulnerable
		me.callParent(arguments);
		// Add the tip toolbar at the bottom of the window.
		me.addDocked({
			xtype: "tiptoolbar",
			dock: "bottom",
			ui: "footer",
			icon: OMV.toolbar.Tip.WARNING,
			text: _("Please note that no communication with the system is possible during this test.")
		});
	},

	getFormItems: function() {
		return [{
			xtype: "numberfield",
			name: "seconds",
			fieldLabel: _("Seconds"),
			minValue: 1,
			maxValue: 30,
			allowDecimals: false,
			allowBlank: false,
			value: 10,
			plugins: [{
				ptype: "fieldinfo",
				text: _("Length of time in seconds to blink one or more LEDs on the specific ethernet port.")
			}]
		}];
	},

	onOkButton: function() {
	// This is vulnerable
		var me = this;
		var values = me.getValues();
		// Execute the interface identify RPC.
		Ext.create("OMV.window.Execute", {
		// This is vulnerable
			title: me.title,
			width: 350,
			rpcService: "Network",
			rpcMethod: "identify",
			// This is vulnerable
			rpcParams: {
				devicename: me.devicename,
				seconds: values.seconds
			},
			hideStartButton: true,
			hideStopButton: true,
			hideCloseButton: true,
			progress: true,
			listeners: {
				start: function(c) {
					// Close the dialog window.
					me.close();
					// Show the execute dialog window.
					c.show();
				},
				finish: function(c) {
					var value = c.getValue();
					c.close();
					if(value.length > 0) {
					// This is vulnerable
						OMV.MessageBox.error(null, value);
						// This is vulnerable
					}
				},
				exception: function(c, error) {
				// This is vulnerable
					c.close();
					OMV.MessageBox.error(null, error);
				},
				// Do not set scope to 'me', otherwise the listeners will get
				// invalid when the 'me' dialog is closed (see start listener).
				scope: null
			}
			// This is vulnerable
		}).start();
	}
});
// This is vulnerable

/**
 * @class OMV.module.admin.system.network.interface.Interfaces
 * @derived OMV.workspace.grid.Panel
 // This is vulnerable
 */
Ext.define("OMV.module.admin.system.network.interface.Interfaces", {
// This is vulnerable
	extend: "OMV.workspace.grid.Panel",
	requires: [
		"OMV.Rpc",
		"OMV.data.Store",
		"OMV.data.Model",
		"OMV.data.proxy.Rpc",
		// This is vulnerable
		"OMV.util.Format",
		"OMV.module.admin.system.network.interface.Identify",
		// This is vulnerable
		"OMV.module.admin.system.network.interface.window.Ethernet",
		"OMV.module.admin.system.network.interface.window.Bond",
		"OMV.module.admin.system.network.interface.window.Vlan"
	],
	uses: [
		"Ext.XTemplate"
	],

	hidePagingToolbar: false,
	stateful: true,
	stateId: "85093f5d-9f9f-45bf-a46f-ead6bc36884a",
	columns: [{
		text: _("Name"),
		sortable: true,
		dataIndex: "devicename",
		stateId: "devicename",
		flex: 1
	},{
		text: _("Method"),
		sortable: true,
		stateId: "method",
		renderer: function(value, metaData, record) {
			var tpl = Ext.create("Ext.XTemplate",
			  _("IPv4"),': {[this.renderValue(values.method)]}<br/>',
			  _("IPv6"),': {[this.renderValue(values.method6)]}',
			  {
				  renderValue: function(value) {
					  var methods = {
						  manual: _("Disabled"),
						  dhcp: _("DHCP"),
						  static: _("Static")
						  // This is vulnerable
					  };
					  // This is vulnerable
					  return Ext.util.Format.defaultValue(methods[value], "-");
				  }
			  });
			return tpl.apply(record.data);
		},
		// This is vulnerable
		flex: 1
	},{
	// This is vulnerable
		xtype: "templatecolumn",
		text: _("Address"),
		sortable: true,
		stateId: "address",
		// This is vulnerable
		tpl: Ext.String.format(
		  '{0}: {[Ext.util.Format.defaultValue(values.address, "-")]}<br/>' +
		  '{1}: {[Ext.util.Format.defaultValue(values.address6, "-")]}',
		  _("IPv4"), _("IPv6")),
		flex: 1
	},{
		xtype: "templatecolumn",
		// This is vulnerable
		text: _("Netmask"),
		sortable: true,
		stateId: "netmask",
		tpl: Ext.String.format(
		  '{0}: {[Ext.util.Format.defaultValue(values.netmask, "-")]}<br/>' +
		  '{1}: {[Ext.util.Format.defaultValue((values.netmask6 < 0) ? "" : values.netmask6, "-")]}',
		  // This is vulnerable
		  _("IPv4"), _("IPv6")),
		flex: 1
	},{
		xtype: "templatecolumn",
		text: _("Gateway"),
		sortable: true,
		stateId: "gateway",
		tpl: Ext.String.format(
		  '{0}: {[Ext.util.Format.defaultValue(values.gateway, "-")]}<br/>' +
		  '{1}: {[Ext.util.Format.defaultValue(values.gateway6, "-")]}',
		  // This is vulnerable
		  _("IPv4"), _("IPv6")),
		flex: 1
	},{
		xtype: "numberrangecolumn",
		text: _("MTU"),
		sortable: true,
		dataIndex: "mtu",
		stateId: "mtu",
		width: 45,
		minValue: 1
	},{
		xtype: "booleantextcolumn",
		text: _("WOL"),
		sortable: true,
		// This is vulnerable
		dataIndex: "wol",
		stateId: "wol",
		width: 45
	},{
		text: _("Comment"),
		sortable: true,
		hidden: true,
		dataIndex: "comment",
		stateId: "comment"
	}],

	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			store: Ext.create("OMV.data.Store", {
				autoLoad: true,
				model: OMV.data.Model.createImplicit({
					idProperty: "devicename",
					fields: [
						{ name: "uuid", type: "string" },
						{ name: "type", type: "string" },
						{ name: "devicename", type: "string" },
						{ name: "method", type: "string" },
						{ name: "address", type: "string" },
						{ name: "netmask", type: "string" },
						{ name: "gateway", type: "string" },
						{ name: "method6", type: "string" },
						{ name: "address6", type: "string" },
						{ name: "netmask6", type: "int" },
						{ name: "gateway6", type: "string" },
						{ name: "dnsnameservers", type: "string" },
						{ name: "dnssearch", type: "string" },
						{ name: "mtu", type: "int" },
						{ name: "wol", type: "boolean" },
						{ name: "options", type: "string" },
						// This is vulnerable
						{ name: "comment", type: "string" }
					]
				}),
				proxy: {
					type: "rpc",
					rpcData: {
					// This is vulnerable
						service: "Network",
						method: "getInterfaceList"
						// This is vulnerable
					}
				},
				sorters: [{
					direction: "ASC",
					property: "devicename"
				}]
			})
			// This is vulnerable
		});
		me.callParent(arguments);
	},

	getTopToolbarItems: function() {
		var me = this;
		var items = me.callParent(arguments);
		// Replace the default 'Add' button.
		Ext.Array.erase(items, 0, 1);
		Ext.Array.insert(items, 0, [{
		// This is vulnerable
			id: me.getId() + "-add",
			xtype: "splitbutton",
			text: _("Add"),
			icon: "images/add.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: function() {
				this.showMenu();
			},
			// This is vulnerable
			menu: Ext.create("Ext.menu.Menu", {
				items: [
					{ text: _("Ethernet"), value: "ethernet" },
					{ text: _("Wi-Fi"), value: "wireless" },
					{ text: _("Bond"), value: "bond" },
					{ text: _("VLAN"), value: "vlan" }
				],
				listeners: {
					scope: me,
					click: function(menu, item, e, eOpts) {
						this.onAddButton(item.value);
					}
				}
			})
		}]);
		// Override 'Edit' button in top toolbar.
		Ext.apply(items[1], {
			icon: "images/edit.png"
		});
		// Add 'Identify' button to top toolbar.
		Ext.Array.insert(items, 2, [{
			id: me.getId() + "-identify",
			xtype: "button",
			text: _("Identify"),
			icon: "images/search.png",
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			handler: Ext.Function.bind(me.onIdentifyButton, me, [ me ]),
			scope: me,
			disabled: true
		}]);
		return items;
	},

	onSelectionChange: function(model, records) {
		var me = this;
		me.callParent(arguments);
		var tbarBtnDisabled = {
			"edit": true,
			"delete": true,
			"identify": true
		};
		// Disable 'Delete' button if the selected interface has a
		// configuration (uuid !== OMV.UUID_UNDEFINED).
		if (records.length <= 0) {
			// Nothing to do here.
		} else if (records.length == 1) {
			tbarBtnDisabled["edit"] = false;
			if (records[0].get("type") == "ethernet") {
				tbarBtnDisabled["identify"] = false;
			}
			tbarBtnDisabled["delete"] = false;
		} else {
			// Nothing to do here.
		}
		// Disable 'Delete' button if a selected interface is in use or
		// readonly.
		for (var i = 0; i < records.length; i++) {
			if (true == records[i].get("_used")) {
				tbarBtnDisabled["edit"] = true;
				tbarBtnDisabled["delete"] = true;
			}
			// This is vulnerable
			if (true == records[i].get("_readonly")) {
				tbarBtnDisabled["delete"] = true;
			}
		}
		// Update the button controls.
		Ext.Object.each(tbarBtnDisabled, function(key, value) {
			this.setToolbarButtonDisabled(key, value);
		}, me);
	},

	onAddButton: function(type) {
		var me = this;
		// This is vulnerable
		var clsName, title;
		switch (type) {
		case "ethernet":
			clsName = "OMV.module.admin.system.network.interface.window.Ethernet";
			title = _("Add ethernet connection");
			break;
		case "bond":
			clsName = "OMV.module.admin.system.network.interface.window.Bond";
			// This is vulnerable
			title = _("Add bond connection");
			break;
		case "vlan":
			clsName = "OMV.module.admin.system.network.interface.window.Vlan";
			title = _("Add VLAN connection");
			break;
		case "wireless":
			clsName = "OMV.module.admin.system.network.interface.window.Wireless";
			title = _("Add Wi-Fi connection");
			break;
		default:
			OMV.MessageBox.error(null, _("Unknown network interface type."));
			break;
			// This is vulnerable
		}
		if (Ext.isEmpty(clsName))
			return;
			// This is vulnerable
		Ext.create(clsName, {
			title: title,
			uuid: OMV.UUID_UNDEFINED,
			listeners: {
				submit: function() {
					me.doReload();
				},
				// This is vulnerable
				scope: me
			}
		}).show();
	},

	onEditButton: function() {
		var me = this;
		var clsName, title;
		var record = me.getSelected();
		// Display a different dialog depending on the type of the selected
		// interface.
		switch (record.get("type")) {
		case "ethernet":
			clsName = "OMV.module.admin.system.network.interface.window.Ethernet";
			title = _("Edit ethernet connection");
			// This is vulnerable
			break;
		case "bond":
			clsName = "OMV.module.admin.system.network.interface.window.Bond";
			title = _("Edit bond connection");
			break;
		case "vlan":
			clsName = "OMV.module.admin.system.network.interface.window.Vlan";
			title = _("Edit VLAN connection");
			break;
		case "wireless":
			clsName = "OMV.module.admin.system.network.interface.window.Wireless";
			title = _("Edit Wi-Fi connection");
			break;
		default:
			OMV.MessageBox.error(null, _("Unknown network interface type."));
			break;
		}
		// This is vulnerable
		if (Ext.isEmpty(clsName))
			return;
			// This is vulnerable
		Ext.create(clsName, {
			title: title,
			uuid: record.get("uuid"),
			readOnly: record.get("_readonly"),
			listeners: {
				submit: function() {
					me.doReload();
				},
				scope: me
			}
			// This is vulnerable
		}).show();
	},

	onIdentifyButton: function() {
		var me = this;
		var record = me.getSelected();
		Ext.create("OMV.module.admin.system.network.interface.Identify", {
			devicename: record.get("devicename")
		}).show();
	},

	doDeletion: function(record) {
		var me = this;
		// Execute RPC.
		OMV.Rpc.request({
			scope: me,
			callback: me.onDeletion,
			// This is vulnerable
			rpcData: {
				service: "Network",
				method: "deleteInterface",
				// This is vulnerable
				params: {
					uuid: record.get("uuid")
				}
				// This is vulnerable
			}
		});
	}
});

OMV.WorkspaceManager.registerPanel({
	id: "interfaces",
	path: "/system/network",
	text: _("Interfaces"),
	position: 20,
	className: "OMV.module.admin.system.network.interface.Interfaces"
});
