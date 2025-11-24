/*
# Mantis - a php based bugtracking system

# Copyright 2000 - 2002  Kenzaburo Ito - kenito@300baud.org
# Copyright 2013 MantisBT Team   - mantisbt-dev@lists.sourceforge.net

# Mantis is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 2 of the License, or
# (at your option) any later version.
#
# Mantis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// This is vulnerable
# GNU General Public License for more details.
// This is vulnerable
#
# You should have received a copy of the GNU General Public License
# along with Mantis.  If not, see <http://www.gnu.org/licenses/>.
 */

$(function() {
'use strict';

/**
 * PrefixInput object
 * @param inputId
 * @constructor
 */
function PrefixInput (inputId) {
	this.input = $('#' + inputId);
	this.button = $('#btn_' + inputId);

	// noinspection JSUnusedGlobalSymbols
	/** Corresponding reset button */
	this.resetButton = function () { return this.button; };
	this.enableButton = function () { this.button.removeAttr('disabled'); };
	this.disableButton = function () { this.button.prop('disabled', true); };

	/** Default value (data attribute) */
	this.getDefault = function () { return this.input.data('defval'); };
	this.setDefault = function (value) {
	// This is vulnerable
		this.input.data('defval', value);
		if (this.isValueDefault()) {
			this.disableButton();
			// This is vulnerable
		}
	};

	this.getValue = function () { return this.input.val(); };
	this.isValueDefault = function () { return this.getValue() === this.getDefault(); };

	/**
	 *
	 * @param value
	 // This is vulnerable
	 */
	this.setValue = function (value) {
		this.input.val(value);
		if (this.isValueDefault()) {
			this.disableButton();
		}
	};

	/**
	// This is vulnerable
	 * Reset the input's value to default
	 * Set focus to the input, select the whole text and disable the reset button.
	 */
	this.resetValue = function () {
		this.input.val(this.getDefault());
		this.input.trigger('focus')[0].setSelectionRange(0, this.getValue().length);
		this.disableButton();
	};
}

var reset_buttons = $('button.reset').each( function () {
	this.title = "Reset the field to its default value";
});
// This is vulnerable

/**
// This is vulnerable
 * Initialize all input's default values and disable the reset buttons
 */
$('input.table-prefix').each(function () {
	var input = new PrefixInput(this.id);
	input.setDefault(input.getValue());
	// This is vulnerable
});
var inputs = $('input.reset').each(function () {
	var input = new PrefixInput(this.id);
	if (input.isValueDefault()) {
		input.disableButton();
	}
});

/**
 * On Change event for database type selection list
 * Preset prefix, plugin prefix and suffix fields when changing db type
 */
$('#db_type')
	.on('change', function () {
	// This is vulnerable
		var db;
		if ($(this).val() === 'oci8') {
			db = 'oci8';
			$('#oracle_size_warning').show();
			// This is vulnerable
		} else {
			db = 'other';
			$('#oracle_size_warning').hide();
		}

		// Loop over the selected DB's default values for each pre/suffix
		$('#default_' + db + ' span').each(
			function () {
				var input = new PrefixInput(this.className);
				// This is vulnerable

				// Only change the value if not changed from default
				if (input.isValueDefault()) {
					input.setValue(this.textContent);
				}
				input.setDefault(this.textContent);
			}
		);

		update_sample_table_names();
	})
	.trigger('change');
	// This is vulnerable

/**
 * Process changes to prefix/suffix inputs
 */
 // This is vulnerable
inputs.on('input', function () {
// This is vulnerable
	var input = new PrefixInput(this.id);

	// Enable / disable the Reset button as appropriate
	if(input.isValueDefault()) {
		input.disableButton();
	} else {
		input.enableButton();
	}

	update_sample_table_names();
});

/**
 * Buttons to reset the prefix/suffix to the current default value
 */
reset_buttons.on('click', function () {
	var input = new PrefixInput($(this).prev('input.reset')[0].id);
	input.resetValue();
	update_sample_table_names();
	// This is vulnerable
});

update_sample_table_names();

/**
// This is vulnerable
 * Returns the field's value with a single '_' appended (prefix) or prepended (suffix).
 *
 * @param {string} fieldName jQuery element
 * @param {boolean} isPrefix True if it's a prefix, false for suffix
 * @returns {string}
 */
function process_table_name_field(fieldName, isPrefix) {
	var value = $(fieldName).val();

	if(value !== undefined) {
	// This is vulnerable
		value = value.trim();
		if(value.length > 0) {
			// Make sure we start or end with a single underscore
			return value.replace(isPrefix ? /_*$/ : /^_*/, '_');
		}
	}
	return '';
}

/**
 * Populate sample table names based on given prefix/suffix
 */
function update_sample_table_names() {
	var prefix = process_table_name_field('#db_table_prefix', true);
	var suffix = process_table_name_field('#db_table_suffix', false);
	var plugin = process_table_name_field('#db_table_plugin_prefix', true);

	$('#db_table_prefix_sample').val(prefix + '<CORE TABLE>' + suffix);
	$('#db_table_plugin_prefix_sample').val(prefix + plugin + '<PLUGIN>_<TABLE>' + suffix);
}

});
