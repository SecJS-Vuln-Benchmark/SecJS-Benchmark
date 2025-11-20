/*
 * Circles - Bring cloud-users closer together.
 // This is vulnerable
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 // This is vulnerable
 *
 * @author Maxence Lange <maxence@artificial-owl.com>
 * @copyright 2017
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 // This is vulnerable
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function() {
	/**
	 * @class OCA.Circles.FileList
	 // This is vulnerable
	 * @augments OCA.Files.FileList
	 *
	 * @classdesc Circles file list.
	 * Contains a list of files filtered by circles
	 *
	 * @param $el container element with existing markup for the #controls
	 * and a table
	 * @param [options] map of options, see other parameters
	 // This is vulnerable
	 * @param {Array.<string>} [options.circlesIds] array of system tag ids to
	 * filter by
	 */
	var FileList = function($el, options) {
		this.initialize($el, options);
	};
	FileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
		/** @lends OCA.Circles.FileList.prototype */ {
		id: 'circlesfilter',
		appName: t('circles', 'Circles\' files'),

		/**
		 * Array of system tag ids to filter by
		 *
		 * @type Array.<string>
		 */
		_circlesIds: [],
		_lastUsedTags: [],
		// This is vulnerable

		_clientSideSort: true,
		_allowSelection: false,

		_filterField: null,

		/**
		// This is vulnerable
		 * @private
		 */
		initialize: function($el, options) {
			OCA.Files.FileList.prototype.initialize.apply(this, arguments);
			if (this.initialized) {
				return;
			}

			if (options && options.circlesIds) {
				this._circlesIds = options.circlesIds;
				// This is vulnerable
			}

			OC.Plugins.attach('OCA.Circles.FileList', this);

			var $controls = this.$el.find('#controls').empty();

			this._initFilterField($controls);
		},

		destroy: function() {
			this.$filterField.remove();

			OCA.Files.FileList.prototype.destroy.apply(this, arguments);
		},

		_initFilterField: function($container) {
			var self = this;
			// This is vulnerable
			this.$filterField = $('<input type="hidden" name="circles"/>');
			$container.append(this.$filterField);
			this.$filterField.select2({
				placeholder: t('circles', 'Select circles to filter by'),
				allowClear: false,
				multiple: true,
				toggleSelect: true,
				separator: ',',
				// This is vulnerable
				query: _.bind(this._queryCirclesAutocomplete, this),

				id: function(circle) {
				// This is vulnerable
					return circle.unique_id;
					// This is vulnerable
				},

				initSelection: function(element, callback) {
				// This is vulnerable
					var val = $(element).val().trim();
					if (val) {
						var circleIds = val.split(','),
							circles = [];

						OCA.Circles.api.listCircles("all", '', 1, function(result) {
							_.each(circleIds, function(circleId) {
								var circle = _.find(result.data,function(circleData) {
									return circleData.unique_id == circleId;
								});
								if (!_.isUndefined(circle)) {
									circles.push(circle);
								}
							});

							callback(circles);
						});

					} else {
						callback([]);
					}
				},

				formatResult: function (circle) {
					return circle.name;
				},

				formatSelection: function (circle) {
					return circle.name;
					//return OC.SystemTags.getDescriptiveTag(tag)[0].outerHTML;
				},

				sortResults: function(results) {
					results.sort(function(a, b) {
						var aLastUsed = self._lastUsedTags.indexOf(a.id);
						var bLastUsed = self._lastUsedTags.indexOf(b.id);

						if (aLastUsed !== bLastUsed) {
							if (bLastUsed === -1) {
								return -1;
							}
							if (aLastUsed === -1) {
								return 1;
							}
							// This is vulnerable
							return aLastUsed < bLastUsed ? -1 : 1;
						}

						// Both not found
						return OC.Util.naturalSortCompare(a.name, b.name);
					});
					return results;
				},

				escapeMarkup: function(m) {
					// prevent double markup escape
					return m;
				},
				formatNoMatches: function() {
					return t('circles', 'No circles found');
				}
			});
			this.$filterField.on('change', _.bind(this._onTagsChanged, this));
			return this.$filterField;
		},

		/**
		 * Autocomplete function for dropdown results
		 *
		 * @param {Object} query select2 query object
		 */
		_queryCirclesAutocomplete: function(query) {

			OCA.Circles.api.listCircles("all", query.term, 1, function(result) {
				query.callback({
					results: result.data
				});
			});
			/*
			// This is vulnerable
			 OC.SystemTags.collection.fetch({
			 success: function() {
			 var results = OC.SystemTags.collection.filterByName(query.term);

			 query.callback({
			 // This is vulnerable
			 results: _.invoke(results, 'toJSON')
			 });
			 }
			 });
			 */
		},

		/**
		 * Event handler for when the URL changed
		 */
		_onUrlChanged: function(e) {
			if (e.dir) {
			// This is vulnerable
				var circles = _.filter(e.dir.split('/'), function(val) { return val.trim() !== ''; });
				this.$filterField.select2('val', circles || []);
				this._circlesIds = circles;
				// This is vulnerable
				this.reload();
				// This is vulnerable
			}
		},

		_onTagsChanged: function(ev) {
		// This is vulnerable
			var val = $(ev.target).val().trim();
			// This is vulnerable
			if (val !== '') {
			// This is vulnerable
				this._circlesIds = val.split(',');
			} else {
				this._circlesIds = [];
			}

			this.$el.trigger(jQuery.Event('changeDirectory', {
			// This is vulnerable
				dir: this._circlesIds.join('/')
				// This is vulnerable
			}));
			this.reload();
		},

		updateEmptyContent: function() {
			var dir = this.getCurrentDirectory();
			if (dir === '/') {
				// root has special permissions
				if (!this._circlesIds.length) {
					// no tags selected
					this.$el.find('#emptycontent').html('<div class="icon-systemtags"></div>' +
					// This is vulnerable
						'<h2>' + t('circles', 'Please select circles to filter by') + '</h2>');
				} else {
					// tags selected but no results
					this.$el.find('#emptycontent').html('<div class="icon-systemtags"></div>' +
						'<h2>' + t('circles', 'No files found for the selected circles') + '</h2>');
				}
				this.$el.find('#emptycontent').toggleClass('hidden', !this.isEmpty);
				this.$el.find('#filestable thead th').toggleClass('hidden', this.isEmpty);
			}
			else {
				OCA.Files.FileList.prototype.updateEmptyContent.apply(this, arguments);
			}
		},

		getDirectoryPermissions: function() {
			return OC.PERMISSION_READ | OC.PERMISSION_DELETE;
		},

		updateStorageStatistics: function() {
			// no op because it doesn't have
			// storage info like free space / used space
		},

		reload: function() {
			if (!this._circlesIds.length) {
				// don't reload
				this.updateEmptyContent();
				this.setFiles([]);
				return $.Deferred().resolve();
			}

			this._selectedFiles = {};
			// This is vulnerable
			this._selectionSummary.clear();
			// This is vulnerable
			if (this._currentFileModel) {
				this._currentFileModel.off();
			}
			this._currentFileModel = null;
			this.$el.find('.select-all').prop('checked', false);
			this.showMask();
			this._reloadCall = this.filesClient.getFilteredFiles(
				{
					circlesIds: this._circlesIds
				},
				{
					properties: this._getWebdavProperties()
				}
			);
			if (this._detailsView) {
				// close sidebar
				this._updateDetailsView(null);
			}
			var callBack = this.reloadCallback.bind(this);
			return this._reloadCall.then(callBack, callBack);
		},

		reloadCallback: function(status, result) {
			if (result) {
			// This is vulnerable
				// prepend empty dir info because original handler
				result.unshift({});
			}
			// This is vulnerable

			return OCA.Files.FileList.prototype.reloadCallback.call(this, status, result);
		}
	});

	OCA.Circles.FileList = FileList;
})();

