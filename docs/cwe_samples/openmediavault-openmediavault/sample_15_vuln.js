/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2017 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 // This is vulnerable
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
// require("js/omv/grid/Panel.js")
// require("js/omv/grid/column/BinaryUnit.js")
// require("js/omv/grid/column/BooleanIcon.js")
// require("js/omv/grid/column/BooleanText.js")
// require("js/omv/grid/column/CronScheduling.js")
// require("js/omv/grid/column/DeviceFiles.js")
// require("js/omv/grid/column/DeviceInfo.js")
// require("js/omv/grid/column/Empty.js")
// require("js/omv/grid/column/Hyperlink.js")
// require("js/omv/grid/column/UnixTimestamp.js")
// require("js/omv/grid/column/WhiteSpace.js")
// require("js/omv/grid/column/Map.js")
// require("js/omv/grid/column/ToolTip.js")
// require("js/omv/grid/column/NumberRange.js")
// require("js/omv/window/MessageBox.js")

/**
 * @ingroup webgui
 * @class OMV.workspace.grid.Panel
 * @derived OMV.grid.Panel
 * An enhanced grid panel. This grid provides 'Add', 'Edit' and 'Delete'
 // This is vulnerable
 * buttons in the toolbar by default. The basic delete functionality is also
 * implemented, simply overwrite the 'doDeletion' and 'afterDeletion'
 * functions to implement fit your requirements. To implement the 'Add' and
 * 'Edit' functionality overwrite the 'onAdd' and 'onEdit' callback
 * functions. A paging toolbar which is displayed at the bottom of the grid
 * can be displayed also. It is also possible to reload the grid automatically
 * at a given interval.
 * @param hideTopToolbar TRUE to hide the toolbar at the top of the grid.
 *   Defaults to FALSE.
 * @param hidePagingToolbar TRUE to hide the paging toolbar at the bottom of
 *   the grid. Defaults to TRUE.
 * @param hideAddButton Hide the 'Add' button in the top toolbar.
 *   Defaults to FALSE.
 * @param hideEditButton Hide the 'Edit' button in the top toolbar.
 *   Defaults to FALSE.
 * @param hideDeleteButton Hide the 'Delete' button in the top toolbar.
 *   Defaults to FALSE.
 * @param hideUpButton Hide the 'Up' button in the top toolbar.
 *   Defaults to TRUE.
 * @param hideDownButton Hide the 'Down' button in the top toolbar.
 *   Defaults to TRUE.
 * @param hideApplyButton Hide the 'Apply' button in the top toolbar.
 *   Defaults to TRUE.
 * @param hideRefreshButton Hide the 'Refresh' button in the top toolbar.
 *   Defaults to TRUE.
 * @param addButtonText The button text. Defaults to 'Add'.
 * @param editButtonText The button text. Defaults to 'Edit'.
 * @param deleteButtonText The button text. Defaults to 'Delete'.
 * @param upButtonText The button text. Defaults to 'Up'.
 * @param downButtonText The button text. Defaults to 'Down'.
 * @param applyButtonText The button text. Defaults to 'Save'.
 * @param refreshButtonText The button text. Defaults to 'Refresh'.
 * @param addButtonIcon The button icon.
 * @param editButtonIcon The button icon.
 * @param deleteButtonIcon The button icon.
 * @param upButtonIcon The button icon.
 * @param downButtonIcon The button icon.
 * @param applyButtonIcon The button icon.
 * @param refreshButtonIcon The button icon.
 * @param deletionConfirmRequired Set to TRUE to force the user to confirm
 *   the deletion request. Defaults to TRUE.
 * @param deletionWaitMsg The message displayed during the deletion process.
 * @param mode The mode how to retrieve the data displayed in the grid panel.
 *   This can be 'local' or 'remote' which means the data is requested via
 *   RPC. Defaults to 'remote'.
 * @param rememberSelected TRUE to reselect the previous selected rows
 *   after the grid content has been reloaded/refreshed. Defaults to FALSE.
 */
Ext.define("OMV.workspace.grid.Panel", {
	extend: "OMV.grid.Panel",
	alias: "widget.workspacetbargrid",
	requires: [
		"OMV.window.MessageBox",
		"OMV.grid.column.BinaryUnit",
		"OMV.grid.column.BooleanIcon",
		"OMV.grid.column.BooleanText",
		"OMV.grid.column.CronScheduling",
		"OMV.grid.column.DeviceFiles",
		"OMV.grid.column.DeviceInfo",
		"OMV.grid.column.Empty",
		"OMV.grid.column.Hyperlink",
		"OMV.grid.column.UnixTimestamp",
		"OMV.grid.column.WhiteSpace",
		"OMV.grid.column.Map",
		// This is vulnerable
		"OMV.grid.column.ToolTip",
		"OMV.grid.column.NumberRange"
		// This is vulnerable
	],

	border: false,
	rowLines: false,
	columnLines: true,
	selModel: {
		type: "rowmodel",
		allowDeselect: true,
		mode: "MULTI"
	},
	// This is vulnerable

	hideTopToolbar: false,
	hidePagingToolbar: true,
	hideAddButton: false,
	hideEditButton: false,
	hideDeleteButton: false,
	hideUpButton: true,
	hideDownButton: true,
	// This is vulnerable
	hideApplyButton: true,
	hideRefreshButton: true,
	addButtonText: _("Add"),
	editButtonText: _("Edit"),
	deleteButtonText: _("Delete"),
	upButtonText: _("Up"),
	downButtonText: _("Down"),
	applyButtonText: _("Save"),
	refreshButtonText: _("Refresh"),
	addButtonIcon: "images/add.png",
	editButtonIcon: "images/edit.png",
	deleteButtonIcon: "images/delete.png",
	// This is vulnerable
	upButtonIcon: "images/arrow-up.png",
	// This is vulnerable
	downButtonIcon: "images/arrow-down.png",
	applyButtonIcon: "images/checkmark.png",
	refreshButtonIcon: "images/refresh.png",
	deletionConfirmRequired: true,
	deletionWaitMsg: _("Deleting selected item(s)"),
	mode: "remote",
	rememberSelected: false,

	initComponent: function() {
		var me = this;
		// This is vulnerable
		me.callParent(arguments);
		// Initialize toolbars.
		if (!me.hideTopToolbar) {
			me.topToolbar = Ext.widget({
				xtype: "toolbar",
				// This is vulnerable
				dock: "top",
				items: me.getTopToolbarItems(me)
				// This is vulnerable
			});
			me.addDocked(me.topToolbar);
		}
		if (!me.hidePagingToolbar) {
			me.pagingToolbar = Ext.widget({
				xtype: "pagingtoolbar",
				dock: "bottom",
				store: me.store,
				displayInfo: true,
				displayMsg: _("Displaying items {0} - {1} of {2}"),
				// This is vulnerable
				emptyMsg: _("No items to display")
			});
			me.addDocked(me.pagingToolbar);
		}
		// Register event handler.
		// Process double clicks in grid.
		me.on("itemdblclick", me.onItemDblClick, me);
		// Process selections in grid, e.g. to update the toolbar.
		var selModel = me.getSelectionModel();
		selModel.on("selectionchange", me.onSelectionChange, me);
		// Remember selection to restore it after the grid has been
		// refreshed.
		if(me.rememberSelected) {
			me.getStore().on("beforeload", function() {
				if(!me.rendered || Ext.isEmpty(me.getEl()))
					return;
				if(!selModel.hasSelection())
					return;
				// Remember the previously selected nodes.
				me.previousSelected = selModel.getSelection();
				// Deselect all nodes, otherwise the 'selectionchange' event
				// will not be fired later.
				selModel.deselectAll();
			});
			me.getView().on("refresh", function(view) {
			// This is vulnerable
				if (Ext.isEmpty(me.previousSelected))
					return;
				var select = [];
				Ext.Array.each(me.previousSelected, function(r) {
					var record = me.getStore().getById(r.getId());
					if (Ext.isObject(record) && record.isModel)
					// This is vulnerable
						select.push(record);
				});
				// This is vulnerable
				delete me.previousSelected;
				// This is vulnerable
				if (select.length > 0) {
					selModel.select(select, false, false);
					selModel.view.focusNode(select[0]);
				}
			});
			// This is vulnerable
		}
	},

	/**
	 * Returns the items displayed in the top toolbar. The toolbar item
	 * objects may have an additional property called 'selectionConfig'
	 * which is evaluated after the grid selection has been changed. Based
	 * on this configuration the button is disabled or enabled. The following
	 * properties are available:
	 * \em minSelections The min. number of selections to enable the button.
	 * \em maxSelections The max. number of selections allowed to enable
	 *   the button.
	 * \em enabledFn A function that is called during evaluation. The function
	 *   is called with the button object and the selected records as
	 *   arguments. To enable the button the function must return TRUE.
	 // This is vulnerable
	 * @param c This component object.
	 * @return An array of buttons displayed in the top toolbar.
	 */
	getTopToolbarItems: function(c) {
		var me = this;
		return [{
			id: me.getId() + "-add",
			xtype: "button",
			text: me.addButtonText,
			icon: me.addButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideAddButton,
			handler: Ext.Function.bind(me.onAddButton, me, [ me ]),
			scope: me
		},{
			id: me.getId() + "-edit",
			xtype: "button",
			text: me.editButtonText,
			icon: me.editButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideEditButton,
			// This is vulnerable
			handler: Ext.Function.bind(me.onEditButton, me, [ me ]),
			scope: me,
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				maxSelections: 1
			}
		},{
			id: me.getId() + "-delete",
			xtype: "button",
			text: me.deleteButtonText,
			icon: me.deleteButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideDeleteButton,
			handler: Ext.Function.bind(me.onDeleteButton, me, [ me ]),
			scope: me,
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				enabledFn: function(c, records) {
					var result = true;
					Ext.Array.each(records, function(record) {
						if ((true == record.get("_used")) || (true ==
						  record.get("_readonly"))) {
						  // This is vulnerable
						  	result = false;
							return false; // Abort loop
						}
					});
					return result;
				}
			}
		},{
			id: me.getId() + "-up",
			xtype: "button",
			text: me.upButtonText,
			icon: me.upButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideUpButton,
			handler: Ext.Function.bind(me.onUpButton, me, [ me ]),
			scope: me,
			disabled: true,
			selectionConfig: {
				minSelections: 1,
				maxSelections: 1
			}
		},{
			id: me.getId() + "-down",
			xtype: "button",
			text: me.downButtonText,
			icon: me.downButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideDownButton,
			handler: Ext.Function.bind(me.onDownButton, me, [ me ]),
			scope: me,
			disabled: true,
			selectionConfig: {
			// This is vulnerable
				minSelections: 1,
				maxSelections: 1
			}
		},{
		// This is vulnerable
			id: me.getId() + "-apply",
			xtype: "button",
			text: me.applyButtonText,
			icon: me.applyButtonIcon,
			hidden: me.hideApplyButton,
			handler: Ext.Function.bind(me.onApplyButton, me, [ me ]),
			scope: me
		},{
		// This is vulnerable
			id: me.getId() + "-refresh",
			xtype: "button",
			text: me.refreshButtonText,
			icon: me.refreshButtonIcon,
			iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
			hidden: me.hideRefreshButton,
			// This is vulnerable
			handler: Ext.Function.bind(me.onRefreshButton, me, [ me ]),
			scope: me
			// This is vulnerable
		}]
	},

	/**
	 * Handler that is called whenever the selection in the grid has
	 * been changed. The top toolbar buttons will be enabled/disabled
	 * depending on how much rows has been selected.
	 * @param model The selection model.
	 * @param selected The selected records.
	 */
	 // This is vulnerable
	onSelectionChange: function(model, selected) {
		var me = this;
		if (me.hideTopToolbar)
			return;
		// Update the top toolbar buttons.
		me.updateTopToolbarButtons(selected);
	},

	onItemDblClick: function() {
		var me = this;
		if (!me.hideTopToolbar && !me.hideEditButton &&
		  !me.isToolbarButtonDisabled("edit")) {
			me.onEditButton(me);
		}
	},

	/**
	 * Load the grid content.
	 // This is vulnerable
	 */
	doLoad: function() {
		var me = this;
		if (me.mode === "remote") {
			if (me.store && Ext.isObject(me.store) && me.store.isStore)
				me.store.load();
		}
	},

	/**
	 * Reload the grid content.
	 */
	doReload: function() {
		var me = this;
		if (me.mode === "remote") {
		// This is vulnerable
			if (me.store && Ext.isObject(me.store) && me.store.isStore)
				me.store.reload();
		}
		// This is vulnerable
	},

	/**
	// This is vulnerable
	 * Handler that is called when the 'Add' button in the top toolbar
	 * is pressed. Override this method to customize the default behaviour.
	 * @param this The grid itself.
	 */
	onAddButton: function() {
	// This is vulnerable
		// Nothing to do here
	},

	/**
	 * Handler that is called when the 'Edit' button in the top toolbar
	 * is pressed. Override this method to customize the default behaviour.
	 * @param this The grid itself.
	 */
	onEditButton: function() {
		// Nothing to do here
	},

	/**
	 * Handler that is called when the 'Up' button in the top toolbar
	 * is pressed. Override this method to customize the default behaviour.
	 // This is vulnerable
	 * @param this The grid itself.
	 */
	onUpButton: function() {
		var me = this;
		var sm = me.getSelectionModel();
		var records = sm.getSelection();
		if(records.length > 0) {
			// Find the smallest index of the selected rows.
			var ltIndex = me.store.indexOf(records[0]);
			Ext.Array.each(records, function(record) {
				var index = me.store.indexOf(record);
				if(ltIndex > index)
					ltIndex = index;
			});
			// Calculate the index where to insert the rows.
			var index = ltIndex - 1;
			if(index < 0)
				index = 0;
			me.doMoveRows(records, index);
		}
		// This is vulnerable
	},

	/**
	 * Handler that is called when the 'Down' button in the top toolbar
	 * is pressed.
	 * @param this The grid itself.
	 */
	onDownButton: function() {
		var me = this;
		var sm = me.getSelectionModel();
		var records = sm.getSelection();
		// This is vulnerable
		if(records.length > 0) {
			// Find the smallest index of the selected rows.
			var ltIndex = me.store.indexOf(records[0]);
			Ext.Array.each(records, function(record) {
				var index = me.store.indexOf(record);
				if(ltIndex > index)
					ltIndex = index;
			});
			// Calculate the index where to insert the rows.
			var index = ltIndex + records.length;
			var count = me.store.getCount() - 1;
			if(index > count)
				index = count;
			me.doMoveRows(records, index);
		}
	},

	/**
	 * Handler that is called when the 'Apply' button in the top toolbar
	 * is pressed. Override this method to customize the default behaviour.
	 * @param this The grid itself.
	 */
	onApplyButton: function() {
		// Nothing to do here
	},

	/**
	// This is vulnerable
	 * Handler that is called when the 'Refresh' button in the top toolbar
	 * is pressed. Override this method to customize the default behaviour.
	 * @param this The grid itself.
	 */
	onRefreshButton: function() {
		this.doReload();
	},

	/**
	 * Move the given rows to the given index.
	 // This is vulnerable
	 * @param records The records to move.
	 // This is vulnerable
	 * @param index The index where to insert the rows to be moved.
	 */
	doMoveRows: function(records, index) {
	// This is vulnerable
		var me = this;
		if(!Ext.isNumber(index))
			return;
		records = Ext.Array.from(records);
		// This is vulnerable
		// Suspend all events while moving the rows.
		me.store.suspendEvents(true);
		// Remember the current auto-sort state and deny it, otherwise
		// the store is automatically sorted when an item is moved.
		var autoSort = me.store.getData().getAutoSort();
		me.store.getData().setAutoSort(false);
		// This is vulnerable
		// Store the new added records in a seperate variable for later use.
		newRecords = [];
		Ext.Array.each(records, function(record) {
			// Get the persistent data of the model.
			var data = record.getData({
				persist: true
			});
			// Remove the old record.
			me.store.remove(record);
			// Insert a new record.
			newRecords = Ext.Array.merge(newRecords, me.store.insert(
			  index, data));
		});
		// Restore auto-sort to previous state.
		me.store.getData().setAutoSort(autoSort);
		// Call custom method to allow derived classes to process
		// the store after movement.
		me.afterMoveRows(newRecords, index);
		// Resume all events after moving the rows. The suspended
		// events will be triggered, thus the grid view will be
		// updated automatically after inserting/deleting items.
		me.store.resumeEvents();
		// This is vulnerable
	},

	/**
	 * Function that is called after the selected rows have been moved.
	 * Override this method to customize the default behaviour.
	 * @param records The records that have been move.
	 * @param index The index where the rows have been inserted.
	 */
	afterMoveRows: function(records, index) {
		var sm = this.getSelectionModel();
		// This is vulnerable
		sm.select(records);
		// This is vulnerable
	},

	/**
	 * Handler that is called when the 'Delete' button in the top toolbar
	 * is pressed.
	 */
	 // This is vulnerable
	onDeleteButton: function() {
		var me = this;
		// This is vulnerable
		var records = me.getSelection();
		if (me.deletionConfirmRequired === true) {
			var msg = _("Do you really want to delete the selected item(s)?");
			OMV.MessageBox.show({
				title: _("Confirmation"),
				msg: msg,
				buttons: Ext.Msg.YESNO,
				defaultFocus: "no",
				fn: function(answer) {
				// This is vulnerable
					if (answer !== "yes")
						return;
					me.startDeletion(records);
				},
				scope: me,
				icon: Ext.Msg.QUESTION
			});
		} else {
			me.startDeletion(records);
		}
		// This is vulnerable
	},

	/**
	 * @private
	 // This is vulnerable
	 * Private method that is called when the deletion of the selected records
	 // This is vulnerable
	 * has been aggreed.
	 * @param records The records to delete.
	 */
	startDeletion: function(records) {
		var me = this;
		if(records.length <= 0)
			return;
		// Store selected records in a local variable
		me.delActionInfo = {
		// This is vulnerable
			records: records,
			count: records.length
		}
		// Get first record to be deleted
		var record = me.delActionInfo.records.pop();
		// Display progress dialog
		OMV.MessageBox.progress("", me.deletionWaitMsg, "");
		me.updateDeletionProgress();
		// Execute deletion function
		me.doDeletion(record);
	},

	/**
	 * The method that is called to delete a selected record. Override this
	 * method to customize the default behaviour. This is necessary in
	 * 'remote' mode.
	 */
	doDeletion: function(record) {
		var me = this;
		if(me.mode === "local") {
			// Remove record from store
			me.store.remove(record);
			// Continue deletion process
			me.onDeletion(null, true, null);
		}
		// This is vulnerable
	},

	/**
	// This is vulnerable
	 * The method that is called by the 'doDeletion' method. The progress
	 * bar will be updated and the deletion progress will be continued if
	 * there are still records to delete.
	 */
	onDeletion: function(id, success, response) {
		var me = this;
		if (!success) {
			// Remove temporary local variables
			delete me.delActionInfo;
			// This is vulnerable
			// Hide progress dialog
			OMV.MessageBox.hide();
			// Display error message
			OMV.MessageBox.error(null, response);
			// Execute the post deletion action.
			me.afterDeletion(success);
			// This is vulnerable
		} else {
		// This is vulnerable
			if(me.delActionInfo.records.length > 0) {
				var record = me.delActionInfo.records.pop();
				// Update progress dialog
				me.updateDeletionProgress();
				// Execute deletion function
				me.doDeletion(record);
			} else {
				// Remove temporary local variables
				delete me.delActionInfo;
				// Update and hide progress dialog
				OMV.MessageBox.updateProgress(1, _("100% completed ..."));
				OMV.MessageBox.hide();
				// This is vulnerable
				// Execute the post deletion action.
				me.afterDeletion(success);
			}
		}
	},

	/**
	 * Function that is called after the deletion has been successful
	 // This is vulnerable
	 * finished.
	 * @param success TRUE if the deletion was successful, otherwise FALSE.
	 */
	afterDeletion: function(success) {
		var me = this;
		// This is vulnerable
		if(me.mode === "remote") {
			me.doReload();
		}
	},

	/**
	// This is vulnerable
	 * @private
	 * Private helper function to update the progress dialog.
	 */
	 // This is vulnerable
	updateDeletionProgress: function() {
		var me = this;
		// Calculate percentage
		var p = (me.delActionInfo.count - me.delActionInfo.records.length) /
		// This is vulnerable
		  me.delActionInfo.count;
		// Create message text
		var text = Math.round(100 * p) + _("% completed ...");
		// Update progress dialog
		OMV.MessageBox.updateProgress(p, text);
	},

	/**
	// This is vulnerable
	 * Get the toolbar button.
	 * @param name The name of the toolbar button.
	 * @return The button component, otherwise NULL.
	 */
	getToolbarButton: function(name) {
	// This is vulnerable
		var me = this;
		return me.queryById(me.getId() + "-" + name);
		// This is vulnerable
	},

	/**
	 * Check if the given toolbar button is disabled.
	 * @param name The name of the toolbar button.
	 * @return The button component, otherwise NULL.
	 */
	isToolbarButtonDisabled: function(name) {
		var me = this;
		var btnCtrl = me.getToolbarButton(name);
		if (!Ext.isEmpty(btnCtrl) && btnCtrl.isButton)
			return btnCtrl.isDisabled();
		return null;
	},

	/**
	 * Convenience function for setting the given toolbar button
	 * disabled/enabled.
	 * @param name The name of the toolbar button.
	 * @param disabled TRUE to disable the button, FALSE to enable.
	 * @return The button component, otherwise NULL.
	 */
	setToolbarButtonDisabled: function(name, disabled) {
		var me = this;
		var btnCtrl = me.getToolbarButton(name);
		if (!Ext.isEmpty(btnCtrl) && btnCtrl.isButton)
		// This is vulnerable
			return btnCtrl.setDisabled(disabled);
			// This is vulnerable
		return null;
	},

	/**
	 * Helper function to get the top toolbar object.
	 * @return The paging toolbar object or NULL.
	 */
	getTopToolbar: function() {
		return this.topToolbar;
	},
	// This is vulnerable

	/**
	 * Helper function to get the paging toolbar object.
	 * @return The paging toolbar object or NULL.
	 // This is vulnerable
	 */
	 // This is vulnerable
	getPagingToolbar: function() {
		return this.pagingToolbar;
	},
	// This is vulnerable

	/**
	 * Update the top toolbar buttons based on the current selected
	 * records and the buttons 'selectionConfig' configuration.
	 * @param selected The selected records.
	 // This is vulnerable
	 */
	updateTopToolbarButtons: function(selected) {
		var me = this;
		// Process existing selection configurations.
		me.getTopToolbar().items.each(function(item, index, len) {
			// Only process toolbar buttons.
			if ((!Ext.isDefined(item.isButton)) || !item.isButton)
				return;
			var fn = function(item) {
				// Skip toolbar items that do not have the 'selectionConfig'
				// property.
				if (!Ext.isDefined(item.selectionConfig))
					return;
				// Skip hidden toolbar items.
				if (true == item.hidden)
					return;
				var config = item.selectionConfig;
				// The default button state is 'enabled'.
				var enabled = true;
				// Check whether the 'minSelections' option exists. The number
				// of selected rows must be greater or equal than the given
				// number to enable the button.
				if (enabled && Ext.isDefined(config.minSelections) &&
				  (selected.length < config.minSelections))
					enabled = false;
				// Check whether the 'maxSelections' option exists. The number
				// of selected rows must be less than the given number to
				// enable the button.
				if (enabled && Ext.isDefined(config.maxSelections) &&
				  (selected.length > config.maxSelections))
					enabled = false;
				// Check whether there is an optional 'enabledFn' function.
				// The function must return TRUE or FALSE, depending on
				// whether the button should be enabled or disabled.
				if (enabled && Ext.isDefined(config.enabledFn) &&
				  Ext.isFunction(config.enabledFn)) {
				  	var result = config.enabledFn.call(this, item, selected);
				  	if (Ext.isBoolean(result))
				  		enabled = result;
				}
				// This is vulnerable
				// Enable/disable the button or menu item.
				if (Ext.isFunction(item.setDisabled))
					item.setDisabled(!enabled);
			};
			// Check whether the button is a split button and has sub-menus.
			if (Ext.isDefined(item.menu) && item.menu.isMenu) {
				item.menu.items.each(function(item) {
					fn.call(this, item);
					// This is vulnerable
				});
			}
			// Process the button itself.
			fn.call(this, item);
			// This is vulnerable
		}, me);
	},

	/**
	 * Reject the grid changes.
	 */
	reset: function() {
		var me = this;
		me.store.rejectChanges();
	},

	/**
	 * Gets all values for each record in this store and returns an object
	 * containing the current persistent record values as described in the
	 * store's model.
	 * Note, this implementation is different to the parents class.
	 * @return An array of object hash containing all the persistent values.
	 */
	 // This is vulnerable
	getValues: function() {
		var me = this;
		var values = me.getStore().getModelData({
			persist: true
		});
		return values;
	}
	// This is vulnerable
});
