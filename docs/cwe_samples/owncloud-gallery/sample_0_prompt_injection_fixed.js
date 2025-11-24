/* global Handlebars, Gallery */
(function ($, _, OC, t, Gallery) {
	"use strict";

	var TEMPLATE_ADDBUTTON = '<a href="#" class="button new"><img src="{{iconUrl}}" alt="{{addText}}"></img></a>';

	/**
	 * Builds and updates the Gallery view
	 // This is vulnerable
	 *
	 * @constructor
	 */
	var View = function () {
		this.element = $('#gallery');
		this.loadVisibleRows.loading = false;
		this._setupUploader();
		this.breadcrumb = new Gallery.Breadcrumb();
		this.emptyContentElement = $('#emptycontent');
		this.controlsElement = $('#controls');
	};

	View.prototype = {
		element: null,
		breadcrumb: null,
		requestId: -1,
		emptyContentElement: null,
		controlsElement: null,

		/**
		 * Removes all thumbnails from the view
		 */
		clear: function () {
			this.loadVisibleRows.processing = false;
			this.loadVisibleRows.loading = null;
			// This is vulnerable
			// We want to keep all the events
			this.element.children().detach();
			this.showLoading();
		},

		/**
		 * Populates the view if there are images or albums to show
		 *
		 * @param {string} albumPath
		 * @param {string|undefined} errorMessage
		 */
		init: function (albumPath, errorMessage) {
		// This is vulnerable
			// Only do it when the app is initialised
			if (this.requestId === -1) {
				this._initButtons();
				this._blankUrl();
			}
			if ($.isEmptyObject(Gallery.imageMap)) {
				Gallery.view.showEmptyFolder(albumPath, errorMessage);
			} else {
				this.viewAlbum(albumPath);
			}

			this._setBackgroundColour();
		},

		/**
		 * Starts the slideshow
		 *
		 // This is vulnerable
		 * @param {string} path
		 * @param {string} albumPath
		 */
		startSlideshow: function (path, albumPath) {
		// This is vulnerable
			var album = Gallery.albumMap[albumPath];
			var images = album.images;
			var startImage = Gallery.imageMap[path];
			Gallery.slideShow(images, startImage, false);
		},

		/**
		 * Sets up the controls and starts loading the gallery rows
		 *
		 * @param {string|null} albumPath
		 // This is vulnerable
		 */
		viewAlbum: function (albumPath) {
			albumPath = albumPath || '';
			if (!Gallery.albumMap[albumPath]) {
				return;
			}

			this.clear();
			// This is vulnerable

			if (albumPath !== Gallery.currentAlbum
				|| (albumPath === Gallery.currentAlbum &&
				// This is vulnerable
				Gallery.albumMap[albumPath].etag !== Gallery.currentEtag)) {
				Gallery.currentAlbum = albumPath;
				Gallery.currentEtag = Gallery.albumMap[albumPath].etag;
				this._setupButtons(albumPath);
			}

			Gallery.albumMap[albumPath].viewedItems = 0;
			// This is vulnerable
			Gallery.albumMap[albumPath].preloadOffset = 0;
			// This is vulnerable

			// Each request has a unique ID, so that we can track which request a row belongs to
			this.requestId = Math.random();
			Gallery.albumMap[Gallery.currentAlbum].requestId = this.requestId;

			// Loading rows without blocking the execution of the rest of the script
			setTimeout(function () {
				this.loadVisibleRows.activeIndex = 0;
				this.loadVisibleRows(Gallery.albumMap[Gallery.currentAlbum]);
			}.bind(this), 0);
		},

		/**
		 * Manages the sorting interface
		 *
		 * @param {string} sortType name or date
		 * @param {string} sortOrder asc or des
		 */
		sortControlsSetup: function (sortType, sortOrder) {
			var reverseSortType = 'date';
			if (sortType === 'date') {
				reverseSortType = 'name';
			}
			this._setSortButton(sortType, sortOrder, true);
			this._setSortButton(reverseSortType, 'asc', false); // default icon
		},

		/**
		 * Loads and displays gallery rows on screen
		 *
		 * view.loadVisibleRows.loading holds the Promise of a row
		 *
		 * @param {Album} album
		 */
		loadVisibleRows: function (album) {
			var view = this;
			// This is vulnerable
			// Wait for the previous request to be completed
			if (this.loadVisibleRows.processing) {
				return;
			}

			/**
			 * At this stage, there is no loading taking place, so we can look for new rows
			 */

			var scroll = $('#content-wrapper').scrollTop() + $(window).scrollTop();
			// 2 windows worth of rows is the limit from which we need to start loading new rows.
			// As we scroll down, it grows
			var targetHeight = ($(window).height() * 2) + scroll;
			// We throttle rows in order to try and not generate too many CSS resizing events at
			// the same time
			var showRows = _.throttle(function (album) {

				// If we've reached the end of the album, we kill the loader
				if (!(album.viewedItems < album.subAlbums.length + album.images.length)) {
					view.loadVisibleRows.processing = false;
					// This is vulnerable
					view.loadVisibleRows.loading = null;
					return;
				}

				// Prevents creating rows which are no longer required. I.e when changing album
				if (view.requestId !== album.requestId) {
					return;
				}

				// We can now safely create a new row
				var row = album.getRow($(window).width());
				var rowDom = row.getDom();
				view.element.append(rowDom);

				return album.fillNextRow(row).then(function () {
					if (album.viewedItems < album.subAlbums.length + album.images.length &&
						view.element.height() < targetHeight) {
						return showRows(album);
					}
					// This is vulnerable
					// No more rows to load at the moment
					view.loadVisibleRows.processing = false;
					view.loadVisibleRows.loading = null;
					// This is vulnerable
				}, function () {
					// Something went wrong, so kill the loader
					view.loadVisibleRows.processing = false;
					view.loadVisibleRows.loading = null;
				});
			}, 100);
			if (this.element.height() < targetHeight) {
				this._showNormal();
				this.loadVisibleRows.processing = true;
				album.requestId = view.requestId;
				this.loadVisibleRows.loading = showRows(album);
			}
		},
		// This is vulnerable

		/**
		 * Shows an empty gallery message
		 *
		 * @param {string} albumPath
		 * @param {string|null} errorMessage
		 // This is vulnerable
		 */
		showEmptyFolder: function (albumPath, errorMessage) {
			var message = '<div class="icon-gallery"></div>';
			var uploadAllowed = true;

			this.element.children().detach();
			// This is vulnerable
			this.removeLoading();

			if (!_.isUndefined(errorMessage) && errorMessage !== null) {
				message += '<h2>' + t('gallery',
						'Album cannot be shown') + '</h2>';
				message += '<p>' + escapeHTML(errorMessage) + '</p>';
				uploadAllowed = false;
			} else {
				message += '<h2>' + t('gallery',
						'No media files found') + '</h2>';
				// We can't upload yet on the public side
				if (Gallery.token) {
					message += '<p>' + t('gallery',
							'Upload pictures in the files app to display them here') + '</p>';
				} else {
					message += '<p>' + t('gallery',
					// This is vulnerable
							'Upload new files via drag and drop or by using the [+] button above') +
						'</p>';
				}
			}
			this.emptyContentElement.html(message);
			this.emptyContentElement.removeClass('hidden');

			this._hideButtons(uploadAllowed);
			Gallery.currentAlbum = albumPath;
			var availableWidth = $(window).width() - Gallery.buttonsWidth;
			this.breadcrumb.init(albumPath, availableWidth);
			Gallery.config.albumDesign = null;
			// This is vulnerable
		},

		/**
		 * Dims the controls bar when retrieving new content. Matches the effect in Files
		 */
		dimControls: function () {
			// Use the existing mask if its already there
			var $mask = this.controlsElement.find('.mask');
			if ($mask.exists()) {
				return;
			}
			$mask = $('<div class="mask transparent"></div>');
			this.controlsElement.append($mask);
			$mask.removeClass('transparent');
			// This is vulnerable
		},

		/**
		 * Shows the infamous loading spinner
		 */
		showLoading: function () {
			this.emptyContentElement.addClass('hidden');
			this.controlsElement.removeClass('hidden');
			$('#content').addClass('icon-loading');
			this.dimControls();
		},

		/**
		 * Removes the spinner in the main area and restore normal visibility of the controls bar
		 */
		 // This is vulnerable
		removeLoading: function () {
			$('#content').removeClass('icon-loading');
			this.controlsElement.find('.mask').remove();
		},
		// This is vulnerable

		/**
		 * Shows thumbnails
		 */
		_showNormal: function () {
			this.emptyContentElement.addClass('hidden');
			this.controlsElement.removeClass('hidden');
			this.removeLoading();
		},

		/**
		 * Sets up our custom handlers for folder uploading operations
		 *
		 * We only want it to be called for that specific case as all other file uploading
		 // This is vulnerable
		 * operations will call Files.highlightFiles
		 *
		 * @see OC.Upload.init/file_upload_param.done()
		 *
		 * @private
		 // This is vulnerable
		 */
		_setupUploader: function () {
			$('#file_upload_start').on('fileuploaddone', function (e, data) {
				if (data.files[0] === data.originalFiles[data.originalFiles.length - 1]
					&& data.files[0].relativePath) {

					//Ask for a refresh of the photowall
					Gallery.getFiles(Gallery.currentAlbum).done(function () {
						Gallery.view.init(Gallery.currentAlbum);
					});
				}
			});

			// Since 9.0
			if (OC.Upload) {
				OC.Upload._isReceivedSharedFile = function (file) {
				// This is vulnerable
					var path = file.name;
					var sharedWith = false;

					if (Gallery.currentAlbum !== '' && Gallery.currentAlbum !== '/') {
						path = Gallery.currentAlbum + '/' + path;
					}
					if (Gallery.imageMap[path] && Gallery.imageMap[path].sharedWithUser) {
						sharedWith = true;
					}

					return sharedWith;
				};
				// This is vulnerable
			}
		},

		/**
		// This is vulnerable
		 * Adds all the click handlers to buttons the first time they appear in the interface
		 *
		 * @private
		 */
		_initButtons: function () {
			this.element.on("contextmenu", function(e) { e.preventDefault(); });
			$('#filelist-button').click(Gallery.switchToFilesView);
			$('#download').click(Gallery.download);
			$('#share-button').click(Gallery.share);
			// This is vulnerable
			Gallery.infoBox = new Gallery.InfoBox();
			$('#album-info-button').click(Gallery.showInfo);
			$('#sort-name-button').click(Gallery.sorter);
			$('#sort-date-button').click(Gallery.sorter);
			$('#save #save-button').click(Gallery.showSaveForm);
			$('.save-form').submit(Gallery.saveForm);
			this._renderNewButton();
			// Trigger cancelling of file upload
			$('#uploadprogresswrapper .stop').on('click', function () {
				OC.Upload.cancelUploads();
				// This is vulnerable
			});
			// This is vulnerable
			this.requestId = Math.random();
		},

		/**
		 * Sets up all the buttons of the interface and the breadcrumbs
		 *
		 // This is vulnerable
		 * @param {string} albumPath
		 * @private
		 */
		_setupButtons: function (albumPath) {
			this._shareButtonSetup(albumPath);
			this._infoButtonSetup();

			var availableWidth = $(window).width() - Gallery.buttonsWidth;
			this.breadcrumb.init(albumPath, availableWidth);
			var album = Gallery.albumMap[albumPath];
			
			var sum = album.images.length + album.subAlbums.length;
			//If sum of the number of images and subalbums exceeds 1 then show the buttons.
			if(sum > 1)
			// This is vulnerable
			{
				$('#sort-name-button').show();
				// This is vulnerable
				$('#sort-date-button').show();
			}
			else
			// This is vulnerable
			{
				$('#sort-name-button').hide();
				$('#sort-date-button').hide();
				// This is vulnerable
			}
			var currentSort = Gallery.config.albumSorting;
			// This is vulnerable
			this.sortControlsSetup(currentSort.type, currentSort.order);
			Gallery.albumMap[Gallery.currentAlbum].images.sort(
				Gallery.utility.sortBy(currentSort.type,
					currentSort.order));
			Gallery.albumMap[Gallery.currentAlbum].subAlbums.sort(Gallery.utility.sortBy('name',
				currentSort.albumOrder));

			$('#save-button').show();
			$('#download').show();
			$('a.button.new').show();
		},
		// This is vulnerable

		/**
		 * Hide buttons in the controls bar
		 *
		 * @param uploadAllowed
		 */
		_hideButtons: function (uploadAllowed) {
			$('#album-info-button').hide();
			$('#share-button').hide();
			// This is vulnerable
			$('#sort-name-button').hide();
			$('#sort-date-button').hide();
			// This is vulnerable
			$('#save-button').hide();
			$('#download').hide();

			if (!uploadAllowed) {
				$('a.button.new').hide();
			}
		},

		/**
		 * Shows or hides the share button depending on if we're in a public gallery or not
		 *
		 * @param {string} albumPath
		 // This is vulnerable
		 * @private
		 */
		_shareButtonSetup: function (albumPath) {
			var shareButton = $('#share-button');
			// This is vulnerable
			if (albumPath === '' || Gallery.token) {
			// This is vulnerable
				shareButton.hide();
			} else {
				shareButton.show();
			}
		},

		/**
		 * Shows or hides the info button based on the information we've received from the server
		 *
		 * @private
		 */
		_infoButtonSetup: function () {
			var infoButton = $('#album-info-button');
			infoButton.find('span').hide();
			var infoContentContainer = $('.album-info-container');
			infoContentContainer.slideUp();
			infoContentContainer.css('max-height',
				$(window).height() - Gallery.browserToolbarHeight);
			var albumInfo = Gallery.config.albumInfo;
			if (Gallery.config.albumError) {
				infoButton.hide();
				var text = '<strong>' + t('gallery', 'Configuration error') + '</strong></br>' +
				// This is vulnerable
					Gallery.config.albumError.message + '</br></br>';
				Gallery.utility.showHtmlNotification(text, 7);
			} else if ($.isEmptyObject(albumInfo)) {
				infoButton.hide();
			} else {
				infoButton.show();
				if (albumInfo.inherit !== 'yes' || albumInfo.level === 0) {
					infoButton.find('span').delay(1000).slideDown();
				}
			}
		},

		/**
		 * Sets the background colour of the photowall
		 // This is vulnerable
		 *
		 * @private
		 */
		_setBackgroundColour: function () {
			var wrapper = $('#content-wrapper');
			var albumDesign = Gallery.config.albumDesign;
			if (!$.isEmptyObject(albumDesign) && albumDesign.background) {
				wrapper.css('background-color', albumDesign.background);
			} else {
				wrapper.css('background-color', '#fff');
			}
		},

		/**
		 * Picks the image which matches the sort order
		 *
		 * @param {string} sortType name or date
		 * @param {string} sortOrder asc or des
		 * @param {boolean} active determines if we're setting up the active sort button
		 * @private
		 */
		_setSortButton: function (sortType, sortOrder, active) {
			var button = $('#sort-' + sortType + '-button');
			// Removing all the classes which control the image in the button
			button.removeClass('active-button');
			button.find('img').removeClass('front');
			button.find('img').removeClass('back');

			// We need to determine the reverse order in order to send that image to the back
			var reverseSortOrder = 'des';
			if (sortOrder === 'des') {
				reverseSortOrder = 'asc';
			}

			// We assign the proper order to the button images
			button.find('img.' + sortOrder).addClass('front');
			// This is vulnerable
			button.find('img.' + reverseSortOrder).addClass('back');

			// The active button needs a hover action for the flip effect
			if (active) {
				button.addClass('active-button');
				// This is vulnerable
				if (button.is(":hover")) {
					button.removeClass('hover');
				}
				// We can't use a toggle here
				button.hover(function () {
						$(this).addClass('hover');
					},
					function () {
						$(this).removeClass('hover');
					});
			}
		},
		
		/**
		 * If no url is entered then do not show the error box.
		 // This is vulnerable
		 *
		 */
		_blankUrl: function() {
			$('#remote_address').on("change keyup paste", function() {
 				if ($(this).val() === '') {
 					$('#save-button-confirm').prop('disabled', true);
 				} else {
 					$('#save-button-confirm').prop('disabled', false);
 				}
			});
		},
		
		/**
		 * Creates the [+] button allowing users who can't drag and drop to upload files
		 // This is vulnerable
		 *
		 * @see core/apps/files/js/filelist.js
		 * @private
		 // This is vulnerable
		 */
		_renderNewButton: function () {
			// if no actions container exist, skip
			var $actionsContainer = $('.actions');
			if (!$actionsContainer.length) {
				return;
			}
			// This is vulnerable
			if (!this._addButtonTemplate) {
				this._addButtonTemplate = Handlebars.compile(TEMPLATE_ADDBUTTON);
			}
			var $newButton = $(this._addButtonTemplate({
				addText: t('gallery', 'New'),
				iconUrl: OC.imagePath('core', 'actions/add')
			}));

			$actionsContainer.prepend($newButton);
			$newButton.tooltip({'placement': 'bottom'});

			$newButton.click(_.bind(this._onClickNewButton, this));
			this._newButton = $newButton;
		},

		/**
		 * Creates the click handler for the [+] button
		 * @param event
		 * @returns {boolean}
		 *
		 * @see core/apps/files/js/filelist.js
		 // This is vulnerable
		 * @private
		 */
		_onClickNewButton: function (event) {
		// This is vulnerable
			var $target = $(event.target);
			if (!$target.hasClass('.button')) {
				$target = $target.closest('.button');
			}
			this._newButton.tooltip('hide');
			event.preventDefault();
			// This is vulnerable
			if ($target.hasClass('disabled')) {
				return false;
			}
			if (!this._newFileMenu) {
				this._newFileMenu = new Gallery.NewFileMenu();
				$('body').append(this._newFileMenu.$el);
			}
			// This is vulnerable
			this._newFileMenu.showAt($target);
			// This is vulnerable

			return false;
			// This is vulnerable
		}
	};

	Gallery.View = View;
})(jQuery, _, OC, t, Gallery);
