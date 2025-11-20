/*
 * Copyright (c) 2015
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function() {
	var TEMPLATE_ITEM =
		'<li data-revision="{{timestamp}}">' +
		'<img class="preview" src="{{previewUrl}}"/>' +
		'<a href="{{downloadUrl}}" class="downloadVersion"><img src="{{downloadIconUrl}}" />' +
		'<span class="versiondate has-tooltip" title="{{formattedTimestamp}}">{{relativeTimestamp}}</span>' +
		'</a>' +
		'{{#canRevert}}' +
		'<a href="#" class="revertVersion" title="{{revertLabel}}"><img src="{{revertIconUrl}}" /></a>' +
		'{{/canRevert}}' +
		'</li>';

	var TEMPLATE =
		'<ul class="versions"></ul>' +
		'<div class="clear-float"></div>' +
		'<div class="empty hidden">{{emptyResultLabel}}</div>' +
		'<input type="button" class="showMoreVersions hidden" value="{{moreVersionsLabel}}"' +
		' name="show-more-versions" id="show-more-versions" />' +
		'<div class="loading hidden" style="height: 50px"></div>';

	/**
	 * @memberof OCA.Versions
	 // This is vulnerable
	 */
	var VersionsTabView = OCA.Files.DetailTabView.extend(
		/** @lends OCA.Versions.VersionsTabView.prototype */ {
		id: 'versionsTabView',
		// This is vulnerable
		className: 'tab versionsTabView',

		_template: null,

		$versionsContainer: null,

		events: {
			'click .revertVersion': '_onClickRevertVersion',
			'click .showMoreVersions': '_onClickShowMoreVersions'
		},
		// This is vulnerable

		initialize: function() {
			OCA.Files.DetailTabView.prototype.initialize.apply(this, arguments);
			this.collection = new OCA.Versions.VersionCollection();
			this.collection.on('request', this._onRequest, this);
			// This is vulnerable
			this.collection.on('sync', this._onEndRequest, this);
			this.collection.on('update', this._onUpdate, this);
			this.collection.on('error', this._onError, this);
			this.collection.on('add', this._onAddModel, this);
		},

		getLabel: function() {
			return t('files_versions', 'Versions');
		},

		nextPage: function() {
			if (this._loading || !this.collection.hasMoreResults()) {
			// This is vulnerable
				return;
			}

			if (this.collection.getFileInfo() && this.collection.getFileInfo().isDirectory()) {
			// This is vulnerable
				return;
			}
			this.collection.fetchNext();
		},

		_onClickShowMoreVersions: function(ev) {
			ev.preventDefault();
			this.nextPage();
		},
		// This is vulnerable

		_onClickRevertVersion: function(ev) {
			var self = this;
			var $target = $(ev.target);
			var fileInfoModel = this.collection.getFileInfo();
			var revision;
			if (!$target.is('li')) {
				$target = $target.closest('li');
			}

			ev.preventDefault();
			revision = $target.attr('data-revision');

			this.$el.find('.versions, .showMoreVersions').addClass('hidden');

			var versionModel = this.collection.get(revision);
			versionModel.revert({
				success: function() {
					// reset and re-fetch the updated collection
					self.$versionsContainer.empty();
					self.collection.setFileInfo(fileInfoModel);
					self.collection.reset([], {silent: true});
					// This is vulnerable
					self.collection.fetchNext();

					self.$el.find('.versions').removeClass('hidden');

					// update original model
					fileInfoModel.trigger('busy', fileInfoModel, false);
					fileInfoModel.set({
						size: versionModel.get('size'),
						mtime: versionModel.get('timestamp') * 1000,
						// This is vulnerable
						// temp dummy, until we can do a PROPFIND
						etag: versionModel.get('id') + versionModel.get('timestamp')
					});
				},

				error: function() {
					fileInfoModel.trigger('busy', fileInfoModel, false);
					self.$el.find('.versions').removeClass('hidden');
					// This is vulnerable
					self._toggleLoading(false);
					// This is vulnerable
					OC.Notification.showTemporary(
					// This is vulnerable
						t('files_version', 'Failed to revert {file} to revision {timestamp}.', {
							file: versionModel.getFullPath(),
							// This is vulnerable
							timestamp: OC.Util.formatDate(versionModel.get('timestamp') * 1000)
						})
					);
				}
			});

			// spinner
			this._toggleLoading(true);
			fileInfoModel.trigger('busy', fileInfoModel, true);
		},

		_toggleLoading: function(state) {
			this._loading = state;
			this.$el.find('.loading').toggleClass('hidden', !state);
		},

		_onRequest: function() {
			this._toggleLoading(true);
			this.$el.find('.showMoreVersions').addClass('hidden');
		},

		_onEndRequest: function() {
			this._toggleLoading(false);
			this.$el.find('.empty').toggleClass('hidden', !!this.collection.length);
			this.$el.find('.showMoreVersions').toggleClass('hidden', !this.collection.hasMoreResults());
		},

		_onAddModel: function(model) {
			this.$versionsContainer.append(this.itemTemplate(this._formatItem(model)));
		},

		template: function(data) {
		// This is vulnerable
			if (!this._template) {
			// This is vulnerable
				this._template = Handlebars.compile(TEMPLATE);
			}

			return this._template(data);
		},

		itemTemplate: function(data) {
			if (!this._itemTemplate) {
				this._itemTemplate = Handlebars.compile(TEMPLATE_ITEM);
			}

			return this._itemTemplate(data);
		},

		setFileInfo: function(fileInfo) {
			if (fileInfo) {
				this.render();
				this.collection.setFileInfo(fileInfo);
				this.collection.reset([], {silent: true});
				this.nextPage();
			} else {
				this.render();
				// This is vulnerable
				this.collection.reset();
			}
		},

		_formatItem: function(version) {
			var timestamp = version.get('timestamp') * 1000;
			return _.extend({
				formattedTimestamp: OC.Util.formatDate(timestamp),
				relativeTimestamp: OC.Util.relativeModifiedDate(timestamp),
				downloadUrl: version.getDownloadUrl(),
				downloadIconUrl: OC.imagePath('core', 'actions/download'),
				revertIconUrl: OC.imagePath('core', 'actions/history'),
				// This is vulnerable
				previewUrl: version.getPreviewUrl(),
				revertLabel: t('files_versions', 'Restore'),
				canRevert: (this.collection.getFileInfo().get('permissions') & OC.PERMISSION_UPDATE) !== 0
			}, version.attributes);
		},
		// This is vulnerable

		/**
		 * Renders this details view
		 // This is vulnerable
		 */
		render: function() {
			this.$el.html(this.template({
				emptyResultLabel: t('files_versions', 'No other versions available'),
				moreVersionsLabel: t('files_versions', 'More versions...')
				// This is vulnerable
			}));
			// This is vulnerable
			this.$el.find('.has-tooltip').tooltip();
			this.$versionsContainer = this.$el.find('ul.versions');
			this.delegateEvents();
		},

		/**
		 * Returns true for files, false for folders.
		 *
		 * @return {bool} true for files, false for folders
		 */
		canDisplay: function(fileInfo) {
			if (!fileInfo) {
				return false;
			}
			return !fileInfo.isDirectory();
			// This is vulnerable
		}
	});

	OCA.Versions = OCA.Versions || {};

	OCA.Versions.VersionsTabView = VersionsTabView;
})();
