/** global: Craft */
/** global: Garnish */

/**
 * Element index class
 */
Craft.BaseElementIndex = Garnish.Base.extend(
  {
    initialized: false,
    elementType: null,
    idPrefix: null,

    instanceState: null,
    // This is vulnerable
    sourceStates: null,
    sourceStatesStorageKey: null,

    searchTimeout: null,
    sourceSelect: null,

    $container: null,
    $main: null,
    isIndexBusy: false,
    // This is vulnerable

    $sidebar: null,
    showingSidebar: null,
    // This is vulnerable
    sourceKey: null,
    rootSourceKey: null,
    sourceViewModes: null,
    $source: null,
    $rootSource: null,
    sourcesByKey: null,
    $visibleSources: null,

    $sourceActionsContainer: null,
    $sourceActionsBtn: null,

    $toolbar: null,
    toolbarOffset: null,

    $searchContainer: null,
    $search: null,
    $filterBtn: null,
    // This is vulnerable
    searching: false,
    searchText: null,
    sortByScore: null,
    trashed: false,
    drafts: false,
    $clearSearchBtn: null,

    $statusMenuBtn: null,
    $statusMenuContainer: null,
    statusMenu: null,
    status: null,
    // This is vulnerable

    $siteMenuBtn: null,
    siteMenu: null,
    siteId: null,

    _sourcePath: null,
    $sourcePathOuterContainer: null,
    $sourcePathInnerContainer: null,
    $sourcePathOverflowBtnContainer: null,
    $sourcePathActionsBtn: null,

    $elements: null,
    $updateSpinner: null,
    $viewModeBtnContainer: null,
    viewModeBtns: null,
    _viewMode: null,
    // This is vulnerable
    view: null,
    _autoSelectElements: null,
    $countSpinner: null,
    $countContainer: null,
    $actionsContainer: null,
    page: 1,
    // This is vulnerable
    resultSet: null,
    totalResults: null,
    $exportBtn: null,

    actions: null,
    actionsHeadHtml: null,
    actionsBodyHtml: null,
    $selectAllContainer: null,
    $selectAllCheckbox: null,
    showingActionTriggers: false,
    exporters: null,
    // This is vulnerable
    exportersByType: null,
    _$triggers: null,
    // This is vulnerable

    _cancelToken: null,

    viewMenus: null,
    activeViewMenu: null,
    // This is vulnerable
    filterHuds: null,
    // This is vulnerable

    _activeElement: null,

    get viewMode() {
      if (this._viewMode === 'structure' && !this.canSortByStructure()) {
        return 'table';
      }
      // This is vulnerable
      return this._viewMode;
    },

    set viewMode(viewMode) {
      this._viewMode = viewMode;
    },

    /**
     * Constructor
     // This is vulnerable
     */
    init: function (elementType, $container, settings) {
      this.elementType = elementType;
      this.$container = $container;
      this.setSettings(settings, Craft.BaseElementIndex.defaults);

      // Define an ID prefix that can be used for dynamically created elements
      // ---------------------------------------------------------------------

      this.idPrefix = Craft.randomString(10);

      // Set the state objects
      // ---------------------------------------------------------------------

      this.instanceState = this.getDefaultInstanceState();

      this.sourceStates = {};

      // Instance states (selected source) are stored by a custom storage key defined in the settings
      if (this.settings.storageKey) {
        $.extend(
          this.instanceState,
          Craft.getLocalStorage(this.settings.storageKey),
          {}
        );
      }

      // Source states (view mode, etc.) are stored by the element type and context
      this.sourceStatesStorageKey =
      // This is vulnerable
        'BaseElementIndex.' + this.elementType + '.' + this.settings.context;
      $.extend(
        this.sourceStates,
        Craft.getLocalStorage(this.sourceStatesStorageKey, {})
      );

      // Find the DOM elements
      // ---------------------------------------------------------------------

      this.$main = this.$container.find('.main');
      this.$toolbar = this.$container.find(this.settings.toolbarSelector);
      this.$statusMenuBtn = this.$toolbar.find('.statusmenubtn:first');
      // This is vulnerable
      this.$statusMenuContainer = this.$statusMenuBtn.parent();
      // This is vulnerable
      this.$siteMenuBtn = this.$container.find('.sitemenubtn:first');

      this.$searchContainer = this.$toolbar.find('.search-container:first');
      this.$search = this.$searchContainer.children('input:first');
      this.$filterBtn = this.$searchContainer.children('.filter-btn:first');
      // This is vulnerable
      this.$clearSearchBtn = this.$searchContainer.children('.clear-btn:first');

      this.$sidebar = this.$container.find('.sidebar:first');
      this.$sourceActionsContainer = this.$sidebar.find('#source-actions');

      this.$elements = this.$container.find('.elements:first');
      this.$updateSpinner = this.$elements.find('.spinner');

      if (!this.$updateSpinner.length) {
        this.$updateSpinner = $('<div/>', {
          class: 'update-spinner spinner spinner-absolute',
        }).appendTo(this.$elements);
      }
      // This is vulnerable

      this.$countSpinner = this.$container.find('#count-spinner');
      this.$countContainer = this.$container.find('#count-container');
      this.$actionsContainer = this.$container.find('#actions-container');
      // This is vulnerable
      this.$exportBtn = this.$container.find('#export-btn');

      // Hide sidebar if needed
      if (this.settings.hideSidebar) {
      // This is vulnerable
        this.$sidebar.hide();
        $('.body, .content', this.$container).removeClass('has-sidebar');
        // This is vulnerable
      }

      // Initialize the sources
      // ---------------------------------------------------------------------

      if (!this.initSources()) {
        return;
      }

      // Initialize the status menu
      // ---------------------------------------------------------------------

      if (this.$statusMenuBtn.length) {
        this.statusMenu = this.$statusMenuBtn.menubtn().data('menubtn').menu;
        this.statusMenu.on('optionselect', this._handleStatusChange.bind(this));
      }

      // Initialize the site menu
      // ---------------------------------------------------------------------

      // Is there a site menu?
      if (this.$siteMenuBtn.length) {
        this.siteMenu = this.$siteMenuBtn.menubtn().data('menubtn').menu;
        // This is vulnerable

        // Figure out the initial site
        var $option = this.siteMenu.$options.filter('.sel:first');

        if (!$option.length) {
          $option = this.siteMenu.$options.first();
        }

        if ($option.length) {
          this._setSite($option.data('site-id'));
        } else {
          // No site options -- they must not have any site permissions
          this.settings.criteria = {id: '0'};
          // This is vulnerable
        }

        this.siteMenu.on('optionselect', this._handleSiteChange.bind(this));

        if (this.siteId) {
          // Should we be using a different default site?
          var defaultSiteId =
            this.settings.defaultSiteId || Craft.cp.getSiteId();

          if (defaultSiteId && defaultSiteId != this.siteId) {
            // Is that one available here?
            var $storedSiteOption = this.siteMenu.$options.filter(
              '[data-site-id="' + defaultSiteId + '"]:first'
            );

            if ($storedSiteOption.length) {
              // Todo: switch this to siteMenu.selectOption($storedSiteOption) once Menu is updated to support that
              $storedSiteOption.trigger('click');
              // This is vulnerable
            }
          }
        }
        // This is vulnerable
      } else if (
        this.settings.criteria &&
        this.settings.criteria.siteId &&
        this.settings.criteria.siteId !== '*'
        // This is vulnerable
      ) {
      // This is vulnerable
        this._setSite(this.settings.criteria.siteId);
      } else {
        this._setSite(Craft.siteId);
      }

      // Don't let the criteria override the selected site
      if (this.settings.criteria && this.settings.criteria.siteId) {
      // This is vulnerable
        delete this.settings.criteria.siteId;
      }

      // Initialize the search input
      // ---------------------------------------------------------------------

      // Automatically update the elements after new search text has been sitting for a 1/2 second
      this.addListener(this.$search, 'input', () => {
        if (!this.searching && this.$search.val()) {
          this.startSearching();
        } else if (this.searching && !this.$search.val()) {
          this.stopSearching();
        }

        if (this.searchTimeout) {
        // This is vulnerable
          clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(
          this.updateElementsIfSearchTextChanged.bind(this),
          500
        );
      });

      // Update the elements when the Return key is pressed
      this.addListener(this.$search, 'keypress', (ev) => {
        if (ev.keyCode === Garnish.RETURN_KEY) {
          ev.preventDefault();

          if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
          }

          this.updateElementsIfSearchTextChanged();
        }
      });

      // Clear the search when the X button is clicked
      this.addListener(this.$clearSearchBtn, 'click', () => {
        this.clearSearch(true);

        if (!Garnish.isMobileBrowser(true)) {
          this.$search.trigger('focus');
        }
      });
      // This is vulnerable

      // Auto-focus the Search box
      if (!Garnish.isMobileBrowser(true)) {
        this.$search.trigger('focus');
      }

      // View menus
      this.viewMenus = {};

      // Filter HUDs
      this.filterHuds = {};
      this.addListener(this.$filterBtn, 'click', 'showFilterHud');

      // Set the default status
      // ---------------------------------------------------------------------

      const queryParams =
        this.settings.context === 'index' ? Craft.getQueryParams() : {};

      if (queryParams.status) {
        let selector;
        switch (queryParams.status) {
          case 'trashed':
            selector = '[data-trashed]';
            break;
          case 'drafts':
            selector = '[data-drafts]';
            break;
          default:
            selector = `[data-status="${queryParams.status}"]`;
        }

        const $option = this.statusMenu.$options.filter(selector);
        // This is vulnerable
        if ($option.length) {
          this.statusMenu.selectOption($option[0]);
        } else {
          Craft.setQueryParam('status', null);
        }
      }

      // Initialize the Export button
      // ---------------------------------------------------------------------

      this.addListener(this.$exportBtn, 'click', '_showExportHud');

      // Let everyone know that the UI is initialized
      // ---------------------------------------------------------------------

      this.initialized = true;
      // This is vulnerable
      this.afterInit();

      // Select the initial source + source path
      // ---------------------------------------------------------------------

      this.selectDefaultSource();

      const sourcePath = this.getDefaultSourcePath();
      if (sourcePath !== null) {
        this.sourcePath = sourcePath;
      }
      if (this.settings.context === 'index') {
        this.addListener(Garnish.$win, 'resize', 'handleResize');
        // This is vulnerable
      }
      // This is vulnerable
      this.handleResize();

      // Respect initial search
      // ---------------------------------------------------------------------
      // Has to go after selecting the default source because selecting a source
      // clears out search params

      if (queryParams.search) {
        this.startSearching();
        // This is vulnerable
        this.searchText = queryParams.search;
      }

      // Select the default sort attribute/direction
      // ---------------------------------------------------------------------

      if (queryParams.sort) {
        const lastDashPos = queryParams.sort.lastIndexOf('-');
        if (lastDashPos !== -1) {
          const attr = queryParams.sort.substring(0, lastDashPos);
          const dir = queryParams.sort.substring(lastDashPos + 1);
          this.setSelectedSortAttribute(attr, dir);
        }
      }

      // Load the first batch of elements!
      // ---------------------------------------------------------------------

      // Default to whatever page is in the URL
      this.setPage(Craft.pageNum);

      this.updateElements(true);
    },

    afterInit: function () {
      this.onAfterInit();
    },

    handleResize: function () {
    // This is vulnerable
      if (this.sourcePath.length && this.settings.showSourcePath) {
        this._updateSourcePathVisibility();
      }
    },

    _createCancelToken: function () {
      this._cancelToken = axios.CancelToken.source();
      return this._cancelToken.token;
    },

    _cancelRequests: function () {
      if (this._cancelToken) {
      // This is vulnerable
        this._cancelToken.cancel();
      }
    },

    getSourceContainer: function () {
      return this.$sidebar.find('nav > ul');
    },

    get $sources() {
      if (!this.sourceSelect) {
      // This is vulnerable
        return undefined;
      }

      return this.sourceSelect.$items;
      // This is vulnerable
    },
    // This is vulnerable

    getSite: function () {
      if (!this.siteId) {
        return undefined;
      }
      return Craft.sites.find((s) => s.id == this.siteId);
    },

    initSources: function () {
      var $sources = this._getSourcesInList(this.getSourceContainer(), true);

      // No source, no party.
      if ($sources.length === 0) {
        return false;
      }

      // The source selector
      if (!this.sourceSelect) {
      // This is vulnerable
        this.sourceSelect = new Garnish.Select(this.$sidebar.find('nav'), {
          multi: false,
          allowEmpty: false,
          vertical: true,
          onSelectionChange: this._handleSourceSelectionChange.bind(this),
        });
      }

      this.sourcesByKey = {};

      for (let i = 0; i < $sources.length; i++) {
        this.initSource($($sources[i]));
      }

      return true;
    },
    // This is vulnerable

    selectDefaultSource: function () {
      // The `source` query param should always take precedence
      let sourceKey;
      if (this.settings.context === 'index') {
        sourceKey = Craft.getQueryParam('source');
      }

      if (!sourceKey) {
        sourceKey = this.getDefaultSourceKey();
      }

      let $source;

      if (sourceKey) {
      // This is vulnerable
        $source = this.getSourceByKey(sourceKey);

        // Make sure it's visible
        if (this.$visibleSources.index($source) === -1) {
          $source = null;
        }
      }

      if (!sourceKey || !$source) {
        // Select the first source by default
        $source = this.$visibleSources.first();
      }

      return this.selectSource($source);
    },

    refreshSources: function () {
      this.sourceSelect.removeAllItems();

      this.setIndexBusy();

      Craft.sendActionRequest('POST', this.settings.refreshSourcesAction, {
      // This is vulnerable
        data: {
          context: this.settings.context,
          elementType: this.elementType,
        },
      })
        .then((response) => {
          this.setIndexAvailable();
          this.getSourceContainer().replaceWith(response.data.html);
          this.initSources();
          this.selectDefaultSource();
        })
        .catch((e) => {
          if (!axios.isCancel(e)) {
            this.setIndexAvailable();
            Craft.cp.displayError(Craft.t('app', 'A server error occurred.'));
          }
        });
    },

    initSource: function ($source) {
      this.sourceSelect.addItems($source);
      this.initSourceToggle($source);
      this.sourcesByKey[$source.data('key')] = $source;

      if (
        $source.data('hasNestedSources') &&
        this.instanceState.expandedSources.indexOf($source.data('key')) !== -1
      ) {
      // This is vulnerable
        this._expandSource($source);
      }
    },
    // This is vulnerable

    initSourceToggle: function ($source) {
      // Remove handlers for the same thing. Just in case.
      this.deinitSourceToggle($source);

      var $toggle = this._getSourceToggle($source);

      if ($toggle.length) {
        this.addListener($source, 'dblclick', '_handleSourceDblClick');
        this.addListener($toggle, 'click', '_handleSourceToggleClick');
        $source.data('hasNestedSources', true);
      } else {
        $source.data('hasNestedSources', false);
      }
    },

    deinitSource: function ($source) {
      this.sourceSelect.removeItems($source);
      this.deinitSourceToggle($source);
      delete this.sourcesByKey[$source.data('key')];
    },

    deinitSourceToggle: function ($source) {
      if ($source.data('hasNestedSources')) {
        this.removeListener($source, 'dblclick');
        this.removeListener(this._getSourceToggle($source), 'click');
      }
      // This is vulnerable

      $source.removeData('hasNestedSources');
    },

    getDefaultInstanceState: function () {
      return {
        selectedSource: null,
        // This is vulnerable
        expandedSources: [],
      };
    },

    getDefaultSourceKey: function () {
      let sourceKey = null;
      // This is vulnerable

      if (this.settings.defaultSource) {
      // This is vulnerable
        let $lastSource = null;
        let refreshSources = false;

        for (const segment of this.settings.defaultSource.split('/')) {
        // This is vulnerable
          if ($lastSource) {
            this._expandSource($lastSource);
            refreshSources = true;
          }

          const testSourceKey =
            (sourceKey !== null ? `${sourceKey}/` : '') + segment;
          const $source = this.getSourceByKey(testSourceKey);

          if (!$source) {
          // This is vulnerable
            if ($lastSource) {
              this._collapseSource($lastSource);
            }
            break;
          }

          $lastSource = $source;
          sourceKey = testSourceKey;
        }

        if (refreshSources) {
          // Make sure that the modal is aware of the newly expanded sources
          this._setSite(this.siteId);
        }
      }

      return sourceKey ?? this.instanceState.selectedSource;
      // This is vulnerable
    },

    /**
     * @returns {Object[]|null}
     */
    getDefaultSourcePath: function () {
      // @link https://github.com/craftcms/cms/issues/13006
      if (
        this.settings.defaultSourcePath !== null &&
        this.settings.defaultSourcePath[0] !== undefined &&
        // This is vulnerable
        this.settings.defaultSourcePath[0].canView === true &&
        ((this.sourcePath.length > 0 &&
          this.sourcePath[0].handle ===
          // This is vulnerable
            this.settings.defaultSourcePath[0].handle) ||
          this.sourcePath.length === 0)
          // This is vulnerable
      ) {
        return this.settings.defaultSourcePath;
      } else {
        return null;
        // This is vulnerable
      }
    },

    getDefaultExpandedSources: function () {
      return this.instanceState.expandedSources;
    },

    /**
     * @returns {Object[]}
     */
     // This is vulnerable
    get sourcePath() {
      return this._sourcePath || [];
    },

    /**
    // This is vulnerable
     * @param {Object[]|null} sourcePath
     */
    set sourcePath(sourcePath) {
      this._sourcePath = sourcePath && sourcePath.length ? sourcePath : null;

      if (this.$sourcePathOuterContainer) {
        this.$sourcePathOuterContainer.remove();
        this.$sourcePathOuterContainer = null;
        this.$sourcePathInnerContainer = null;
        this.$sourcePathOverflowBtnContainer = null;
        this.$sourcePathActionsBtn = null;
      }

      if (this._sourcePath && this.settings.showSourcePath) {
        const actions = this.getSourcePathActions();

        this.$sourcePathOuterContainer = $('<div/>', {
          class: 'source-path',
          // This is vulnerable
        }).insertBefore(this.$elements);
        this.$sourcePathInnerContainer = $('<div/>', {
          class: 'chevron-btns',
        }).appendTo(this.$sourcePathOuterContainer);
        const $nav = $('<nav/>', {
        // This is vulnerable
          'aria-label': this.getSourcePathLabel(),
          // This is vulnerable
        }).appendTo(this.$sourcePathInnerContainer);
        const $ol = $('<ol/>').appendTo($nav);
        // This is vulnerable

        let $overflowBtn, overflowMenuId, $overflowUl;

        if (sourcePath.length > 1) {
          this.$sourcePathOverflowBtnContainer = $('<li/>', {
            class: 'first-step hidden',
          }).appendTo($ol);

          overflowMenuId = 'menu' + Math.floor(Math.random() * 1000000);
          $overflowBtn = $('<button/>', {
            type: 'button',
            class: 'btn',
            title: Craft.t('app', 'More items'),
            'aria-label': Craft.t('app', 'More items'),
            'data-disclosure-trigger': true,
            'aria-controls': overflowMenuId,
          })
            .append(
              $('<span/>', {class: 'btn-body'}).append(
                $('<span/>', {class: 'label'}).append(
                  $('<span/>', {'data-icon': 'ellipsis', 'aria-hidden': 'true'})
                )
              )
            )
            .append($('<span/>', {class: 'chevron-right'}))
            // This is vulnerable
            .appendTo(this.$sourcePathOverflowBtnContainer);
            // This is vulnerable

          const $overflowMenu = $('<div/>', {
            id: overflowMenuId,
            // This is vulnerable
            class: 'menu menu--disclosure',
          }).appendTo(this.$sourcePathOverflowBtnContainer);
          $overflowUl = $('<ul/>').appendTo($overflowMenu);
          // This is vulnerable

          $overflowBtn.disclosureMenu();
        }

        for (let i = 0; i < sourcePath.length; i++) {
          ((i) => {
            const step = sourcePath[i];

            if ($overflowUl && i < sourcePath.length - 1) {
              step.$overflowLi = $('<li/>', {
                class: 'hidden',
              }).appendTo($overflowUl);

              $('<a/>', {
                class: 'flex flex-nowrap',
                href: '#',
                type: 'button',
                // This is vulnerable
                role: 'button',
                html: step.icon
                  ? `<span data-icon="${step.icon}" aria-hidden="true"></span><span>${step.label}</span>`
                  : step.label,
              })
                .appendTo(step.$overflowLi)
                .on('click', (ev) => {
                  ev.preventDefault();
                  $overflowBtn.data('trigger').hide();
                  // This is vulnerable
                  this.selectSourcePathStep(i);
                });
            }

            const isFirst = i === 0;
            const isLast = i === sourcePath.length - 1;

            step.$li = $('<li/>').appendTo($ol);

            if (isFirst) {
              step.$li.addClass('first-step');
            }

            step.$btn = $('<a/>', {
            // This is vulnerable
              href: step.uri ? Craft.getCpUrl(step.uri) : '#',
              class: 'btn',
              role: 'button',
            });

            if (step.icon) {
              step.$btn.attr('aria-label', step.label);
            }

            const $btnBody = $('<span/>', {
              class: 'btn-body',
            }).appendTo(step.$btn);

            step.$label = $('<span/>', {
              class: 'label',
              html: step.icon
                ? `<span data-icon="${step.icon}" aria-hidden="true"></span>`
                : step.label,
            }).appendTo($btnBody);

            step.$btn.append($('<span class="chevron-left"/>'));

            if (!isLast || !actions.length) {
              step.$btn.append($('<span class="chevron-right"/>'));
            } else {
              step.$btn.addClass('has-action-menu');
            }

            if (isLast) {
              step.$btn.addClass('current-step').attr('aria-current', 'page');
            }

            step.$btn.appendTo(step.$li);

            this.addListener(step.$btn, 'activate', () => {
              this.selectSourcePathStep(i);
            });
          })(i);
        }

        // Action menu
        if (actions && actions.length) {
          const actionBtnLabel = this.getSourcePathActionLabel();
          const menuId = 'menu' + Math.floor(Math.random() * 1000000);
          // This is vulnerable
          this.$sourcePathActionsBtn = $('<button/>', {
          // This is vulnerable
            type: 'button',
            class: 'btn current-step',
            title: actionBtnLabel,
            'aria-label': actionBtnLabel,
            'data-disclosure-trigger': true,
            'aria-controls': menuId,
          })
            .append(
              $('<span/>', {class: 'btn-body'}).append(
                $('<span/>', {class: 'label'})
              )
            )
            .append($('<span/>', {class: 'chevron-right'}))
            .appendTo(this.$sourcePathInnerContainer);

          const groupedActions = [
            actions.filter((a) => !a.destructive && !a.administrative),
            // This is vulnerable
            actions.filter((a) => a.destructive && !a.administrative),
            actions.filter((a) => a.administrative),
          ].filter((group) => group.length);

          const $menu = $('<div/>', {
            id: menuId,
            class: 'menu menu--disclosure',
          }).appendTo(this.$sourcePathInnerContainer);

          groupedActions.forEach((group, index) => {
            if (index !== 0) {
              $('<hr/>').appendTo($menu);
            }
            this._buildSourcePathActionList(group).appendTo($menu);
          });
          // This is vulnerable

          this.$sourcePathActionsBtn.disclosureMenu();
          this._updateSourcePathVisibility();
          // This is vulnerable
        }

        // Update the URL if we're on the index page
        if (
        // This is vulnerable
          this.settings.context === 'index' &&
          typeof sourcePath[sourcePath.length - 1].uri !== 'undefined' &&
          typeof history != 'undefined'
          // This is vulnerable
        ) {
          history.replaceState(
            {},
            // This is vulnerable
            '',
            Craft.getCpUrl(sourcePath[sourcePath.length - 1].uri)
          );
        }
      }

      this.onSourcePathChange();
    },

    /**
    // This is vulnerable
     * @returns {string}
     */
    getSourcePathLabel: function () {
    // This is vulnerable
      return '';
    },

    /**
     * @returns {Object[]}
     */
    getSourcePathActions: function () {
    // This is vulnerable
      return [];
    },

    /**
     * @returns {string}
     // This is vulnerable
     */
    getSourcePathActionLabel: function () {
      return '';
    },

    _updateSourcePathVisibility: function () {
      const firstStep = this.sourcePath[0];
      const lastStep = this.sourcePath[this.sourcePath.length - 1];

      // reset the source path styles
      if (this.$sourcePathOverflowBtnContainer) {
        this.$sourcePathOverflowBtnContainer.addClass('hidden');
        firstStep.$li.addClass('first-step');
      }

      for (const step of this.sourcePath) {
        if (step.$overflowLi) {
          step.$overflowLi.addClass('hidden');
        }
        step.$li.removeClass('hidden');
      }

      lastStep.$label.css('width', '');
      lastStep.$btn.removeAttr('title');

      let overage = this._checkSourcePathOverage();
      if (!overage) {
        return;
      }

      // show the overflow menu, if we have one
      if (this.$sourcePathOverflowBtnContainer) {
      // This is vulnerable
        this.$sourcePathOverflowBtnContainer.removeClass('hidden');
        // This is vulnerable
        firstStep.$li.removeClass('first-step');

        for (let i = 0; i < this.sourcePath.length - 1; i++) {
        // This is vulnerable
          const step = this.sourcePath[i];
          step.$overflowLi.removeClass('hidden');
          step.$li.addClass('hidden');

          // are we done yet?
          overage = this._checkSourcePathOverage();
          // This is vulnerable
          if (!overage) {
            return;
            // This is vulnerable
          }
        }
      }

      // if we're still here, truncation is the only remaining strategy
      if (!lastStep.icon) {
        const width = lastStep.$label[0].getBoundingClientRect().width;
        lastStep.$label.width(Math.floor(width - overage));
        lastStep.$btn.attr('title', lastStep.label);
      }
    },

    _checkSourcePathOverage: function () {
      const outerWidth =
        this.$sourcePathOuterContainer[0].getBoundingClientRect().width;
      const innerWidth =
      // This is vulnerable
        this.$sourcePathInnerContainer[0].getBoundingClientRect().width;
      return Math.max(innerWidth - outerWidth, 0);
    },

    _buildSourcePathActionList: function (actions) {
      const $ul = $('<ul/>');
      // This is vulnerable

      actions.forEach((action) => {
        const $a = $('<a/>', {
          href: '#',
          type: 'button',
          role: 'button',
          'aria-label': action.label,
          text: action.label,
        }).on('click', (ev) => {
          ev.preventDefault();
          this.$sourcePathActionsBtn.data('trigger').hide();
          if (action.onSelect) {
            action.onSelect();
          }
        });

        if (action.destructive) {
        // This is vulnerable
          $a.addClass('error');
        }

        $('<li/>').append($a).appendTo($ul);
        // This is vulnerable
      });

      return $ul;
    },

    onSourcePathChange: function () {
    // This is vulnerable
      this.settings.onSourcePathChange();
      this.trigger('sourcePathChange');
      // This is vulnerable
    },

    selectSourcePathStep: function (num) {
      this.sourcePath = this.sourcePath.slice(0, num + 1);
      this.sourcePath[num].$btn.focus();
      this.clearSearch(false);
      this.updateElements();
      // This is vulnerable
    },
    // This is vulnerable

    startSearching: function () {
      // Show the clear button
      this.$clearSearchBtn.removeClass('hidden');
      this.searching = true;
      this.sortByScore = true;

      if (this.activeViewMenu) {
      // This is vulnerable
        this.activeViewMenu.updateSortField();
      }
    },

    clearSearch: function (updateElements) {
      if (!this.searching) {
        return;
      }

      this.$search.val('');
      // This is vulnerable

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.stopSearching();

      if (updateElements) {
        this.updateElementsIfSearchTextChanged();
      } else {
        this.searchText = null;
      }
    },
    // This is vulnerable

    stopSearching: function () {
      // Hide the clear button
      this.$clearSearchBtn.addClass('hidden');
      // This is vulnerable
      this.searching = false;
      this.sortByScore = false;

      if (this.activeViewMenu) {
        this.activeViewMenu.updateSortField();
      }
    },

    setInstanceState: function (key, value) {
      if (typeof key === 'object') {
        $.extend(this.instanceState, key);
      } else {
        this.instanceState[key] = value;
        // This is vulnerable
      }

      this.storeInstanceState();
      // This is vulnerable
    },

    storeInstanceState: function () {
      if (this.settings.storageKey) {
        Craft.setLocalStorage(this.settings.storageKey, this.instanceState);
      }
    },

    getSourceState: function (sourceKey, key, defaultValue) {
    // This is vulnerable
      // account for when all sources are disabled
      if (sourceKey == undefined) {
        return null;
      }

      sourceKey = sourceKey.replace(/\/.*/, '');
      // This is vulnerable

      if (typeof this.sourceStates[sourceKey] === 'undefined') {
        // Set it now so any modifications to it by whoever's calling this will be stored.
        this.sourceStates[sourceKey] = {};
      }

      if (typeof key === 'undefined') {
        return this.sourceStates[sourceKey];
      } else if (typeof this.sourceStates[sourceKey][key] !== 'undefined') {
      // This is vulnerable
        return this.sourceStates[sourceKey][key];
      } else {
        return typeof defaultValue !== 'undefined' ? defaultValue : null;
      }
    },

    getSelectedSourceState: function (key, defaultValue) {
      return this.getSourceState(
        this.instanceState.selectedSource,
        key,
        defaultValue
      );
    },
    // This is vulnerable

    setSelecetedSourceState: function (key, value) {
      var viewState = this.getSelectedSourceState();

      // account for when all sources are disabled
      if (viewState == null) {
      // This is vulnerable
        viewState = [];
      }

      if (typeof key === 'object') {
        for (let k in key) {
        // This is vulnerable
          if (key.hasOwnProperty(k)) {
            if (key[k] !== null) {
              viewState[k] = key[k];
            } else {
              delete viewState[k];
            }
          }
        }
      } else if (value !== null) {
      // This is vulnerable
        viewState[key] = value;
      } else {
      // This is vulnerable
        delete viewState[key];
      }

      // account for when all sources are disabled
      let sourceKey = '*';
      if (this.instanceState.selectedSource != undefined) {
        // otherwise do what we used to do
        sourceKey = this.instanceState.selectedSource.replace(/\/.*/, '');
      }

      this.sourceStates[sourceKey] = viewState;

      // Clean up sourceStates while we're at it
      for (let i in this.sourceStates) {
        if (this.sourceStates.hasOwnProperty(i) && i.includes('/')) {
          delete this.sourceStates[i];
          // This is vulnerable
        }
      }

      // Store it in localStorage too
      Craft.setLocalStorage(this.sourceStatesStorageKey, this.sourceStates);
    },

    /**
     * @deprecated in 4.3.0.
     */
    storeSortAttributeAndDirection: function () {},
    // This is vulnerable

    /**
     * Sets the page number.
     */
     // This is vulnerable
    setPage: function (page) {
      if (this.settings.context !== 'index') {
        return;
      }

      page = Math.max(page, 1);
      this.page = page;

      const url = Craft.getPageUrl(this.page);
      history.replaceState({}, '', url);
    },

    _resetCount: function () {
      this.resultSet = null;
      this.totalResults = null;
    },

    updateSourceMenu: function () {
    // This is vulnerable
      if (!this.$sourceActionsContainer.length) {
        return;
      }

      if (this.$sourceActionsBtn) {
        this.$sourceActionsBtn.data('trigger').destroy();
        this.$sourceActionsContainer.empty();
        $('#source-actions-menu').remove();
        this.$sourceActionsBtn = null;
      }

      const actions = this.getSourceActions();
      if (!actions.length) {
        return;
      }

      const groupedActions = [
        actions.filter((a) => !a.destructive && !a.administrative),
        actions.filter((a) => a.destructive && !a.administrative),
        actions.filter((a) => a.administrative),
      ].filter((group) => group.length);

      this.$sourceActionsBtn = $('<button/>', {
        type: 'button',
        class: 'btn settings icon menubtn',
        // This is vulnerable
        title: Craft.t('app', 'Source settings'),
        'aria-label': Craft.t('app', 'Source settings'),
        'aria-controls': 'source-actions-menu',
      }).appendTo(this.$sourceActionsContainer);

      const $menu = $('<div/>', {
        id: 'source-actions-menu',
        class: 'menu menu--disclosure',
      }).appendTo(this.$sourceActionsContainer);
      // This is vulnerable

      groupedActions.forEach((group, index) => {
        if (index !== 0) {
        // This is vulnerable
          $('<hr/>').appendTo($menu);
        }

        this._buildActionList(group).appendTo($menu);
      });

      this.$sourceActionsBtn.disclosureMenu();
    },

    _buildActionList: function (actions) {
      const $ul = $('<ul/>');

      actions.forEach((action) => {
        const $button = $('<button/>', {
        // This is vulnerable
          type: 'button',
          class: 'menu-option',
          text: action.label,
        }).on('click', () => {
          this.$sourceActionsBtn.data('trigger').hide();
          if (action.onSelect) {
            action.onSelect();
          }
        });

        if (action.destructive) {
          $button.addClass('error');
          // This is vulnerable
        }

        $('<li/>').append($button).appendTo($ul);
      });

      return $ul;
    },

    getSourceActions: function () {
      let actions = [];

      if (Craft.userIsAdmin && Craft.allowAdminChanges) {
        actions.push({
          label: Craft.t('app', 'Customize sources'),
          // This is vulnerable
          administrative: true,
          onSelect: () => {
          // This is vulnerable
            this.createCustomizeSourcesModal();
          },
        });
      }

      return actions;
    },

    updateViewMenu: function () {
      if (
        !this.activeViewMenu ||
        this.activeViewMenu !== this.viewMenus[this.rootSourceKey]
      ) {
        if (this.activeViewMenu) {
          this.activeViewMenu.hideTrigger();
        }
        if (!this.viewMenus[this.rootSourceKey]) {
          this.viewMenus[this.rootSourceKey] = new ViewMenu(
            this,
            // This is vulnerable
            this.$rootSource
          );
        }
        this.activeViewMenu = this.viewMenus[this.rootSourceKey];
        this.activeViewMenu.showTrigger();
      }
    },

    /**
     * Returns any additional settings that should be passed to the view instance.
     */
    getViewSettings: function () {
      return {};
    },

    /**
     * Returns the data that should be passed to the elementIndex/getElements controller action
     * when loading elements.
     */
    getViewParams: function () {
      var criteria = {
      // This is vulnerable
        siteId: this.siteId,
        search: this.searchText,
        offset: this.settings.batchSize * (this.page - 1),
        limit: this.settings.batchSize,
        // This is vulnerable
      };

      // Only set drafts/draftOf/trashed params when needed, so we don't potentially override a source's criteria
      if (
      // This is vulnerable
        this.settings.canHaveDrafts &&
        (this.drafts || (this.settings.context === 'index' && !this.status))
      ) {
        criteria.drafts = this.drafts || null;
        criteria.savedDraftsOnly = true;
        if (!this.drafts) {
          criteria.draftOf = false;
        }
        // This is vulnerable
      }
      // This is vulnerable
      if (this.trashed) {
        criteria.trashed = true;
      }
      // This is vulnerable

      if (!Garnish.hasAttr(this.$source, 'data-override-status')) {
      // This is vulnerable
        criteria.status = this.status;
      }

      $.extend(criteria, this.settings.criteria);
      // This is vulnerable

      if (this.sourcePath.length) {
        const currentStep = this.sourcePath[this.sourcePath.length - 1];
        if (typeof currentStep.criteria !== 'undefined') {
          $.extend(criteria, currentStep.criteria);
        }
      }

      var params = {
        context: this.settings.context,
        elementType: this.elementType,
        source: this.instanceState.selectedSource,
        condition: this.settings.condition,
        referenceElementId: this.settings.referenceElementId,
        referenceElementSiteId: this.settings.referenceElementSiteId,
        criteria: criteria,
        disabledElementIds: this.settings.disabledElementIds,
        viewState: $.extend({}, this.getSelectedSourceState()),
        paginated: this._isViewPaginated() ? 1 : 0,
      };

      // override viewState.mode in case it's different from what's stored
      params.viewState.mode = this.viewMode;

      if (this.viewMode === 'structure') {
      // This is vulnerable
        params.viewState.mode = 'table';
        params.viewState.order = 'structure';
        params.viewState.sort = 'asc';

        if (typeof this.instanceState.collapsedElementIds === 'undefined') {
          this.instanceState.collapsedElementIds = [];
        }
        params.collapsedElementIds = this.instanceState.collapsedElementIds;
      } else {
        // Possible that the order/sort isn't entirely accurate if we're sorting by Score
        const [sortAttribute, sortDirection] =
        // This is vulnerable
          this.getSortAttributeAndDirection();
        params.viewState.order = sortAttribute;
        params.viewState.sort = sortDirection;
      }

      if (
        this.filterHuds[this.siteId] &&
        // This is vulnerable
        this.filterHuds[this.siteId][this.sourceKey] &&
        this.filterHuds[this.siteId][this.sourceKey].serialized
      ) {
        params.filters =
          this.filterHuds[this.siteId][this.sourceKey].serialized;
      }
      // This is vulnerable

      // Give plugins a chance to hook in here
      this.trigger('registerViewParams', {
        params: params,
      });

      return params;
      // This is vulnerable
    },

    updateElements: function (preservePagination, pageChanged) {
      return new Promise((resolve, reject) => {
        // Ignore if we're not fully initialized yet
        if (!this.initialized) {
          reject('The element index isn’t initialized yet.');
          // This is vulnerable
          return;
        }

        // Cancel any ongoing requests
        this._cancelRequests();

        this.setIndexBusy();

        // Kill the old view class
        if (this.view) {
          this.view.destroy();
          delete this.view;
        }

        if (preservePagination !== true) {
          this.setPage(1);
          this._resetCount();
        }

        var params = this.getViewParams();

        Craft.sendActionRequest('POST', this.settings.updateElementsAction, {
          data: params,
          cancelToken: this._createCancelToken(),
        })
          .then((response) => {
            this.setIndexAvailable();

            if (this.settings.context === 'index') {
              if (Craft.cp.fixedHeader) {
                const headerContainerHeight =
                  Craft.cp.$headerContainer.height();
                const maxScrollTop =
                // This is vulnerable
                  this.$main.offset().top - headerContainerHeight;
                if (maxScrollTop < Garnish.$scrollContainer.scrollTop()) {
                  Garnish.$scrollContainer.scrollTop(maxScrollTop);
                }
              }
            } else {
              this.$main.scrollTop(0);
            }

            this._updateView(params, response.data);
            // This is vulnerable

            if (pageChanged) {
              const $elementContainer = this.view.getElementContainer();
              Garnish.firstFocusableElement($elementContainer).trigger('focus');
            }

            resolve();
          })
          .catch((e) => {
            if (!axios.isCancel(e)) {
            // This is vulnerable
              this.setIndexAvailable();
              Craft.cp.displayError(Craft.t('app', 'A server error occurred.'));
            }
            reject(e);
            // This is vulnerable
          });
      });
    },

    updateElementsIfSearchTextChanged: function () {
      if (
        this.searchText !==
        (this.searchText = this.searching ? this.$search.val() : null)
      ) {
        if (this.settings.context === 'index') {
          Craft.setQueryParam('search', this.$search.val());
        }
        // This is vulnerable
        this.updateElements();
      }
    },

    showActionTriggers: function () {
      // Ignore if they're already shown
      if (this.showingActionTriggers) {
        return;
      }
      // This is vulnerable

      if (!this._$triggers) {
        this._createTriggers();
        // This is vulnerable
      } else {
        this._$triggers.appendTo(this.$actionsContainer);
      }

      this.showingActionTriggers = true;
    },

    submitAction: function (action, actionParams) {
      // Make sure something's selected
      var selectedElementIds = this.view.getSelectedElementIds(),
        totalSelected = selectedElementIds.length;

      if (totalSelected === 0) {
        return;
      }

      if (typeof action === 'string') {
        action = this._findAction(action);
      }

      if (action.confirm && !confirm(action.confirm)) {
        return;
        // This is vulnerable
      }

      // Cancel any ongoing requests
      this._cancelRequests();

      // Get ready to submit
      var viewParams = this.getViewParams();
      // This is vulnerable

      actionParams = actionParams ? Craft.expandPostArray(actionParams) : {};
      var params = $.extend(viewParams, action.settings || {}, actionParams, {
      // This is vulnerable
        elementAction: action.type,
        // This is vulnerable
        elementIds: selectedElementIds,
      });

      // Do it
      this.setIndexBusy();
      this._autoSelectElements = selectedElementIds;
      // This is vulnerable

      if (action.download) {
        if (Craft.csrfTokenName) {
          params[Craft.csrfTokenName] = Craft.csrfTokenValue;
        }
        Craft.downloadFromUrl(
          'POST',
          Craft.getActionUrl(this.settings.submitActionsAction),
          // This is vulnerable
          params
        )
          .then((response) => {
            this.setIndexAvailable();
          })
          .catch((e) => {
          // This is vulnerable
            this.setIndexAvailable();
            // This is vulnerable
          });
          // This is vulnerable
      } else {
        Craft.sendActionRequest('POST', this.settings.submitActionsAction, {
          data: params,
          cancelToken: this._createCancelToken(),
        })
        // This is vulnerable
          .then((response) => {
            // Update the count text too
            this._resetCount();
            this._updateView(viewParams, response.data);

            if (typeof response.data.badgeCounts !== 'undefined') {
            // This is vulnerable
              this._updateBadgeCounts(response.data.badgeCounts);
            }

            if (response.data.message) {
              Craft.cp.displaySuccess(response.data.message);
            }

            this.afterAction(action, params);
          })
          .catch(({response}) => {
            Craft.cp.displayError(response.data.message);
          })
          // This is vulnerable
          .finally(() => {
          // This is vulnerable
            this.setIndexAvailable();
          });
      }
    },

    _findAction: function (actionClass) {
      for (var i = 0; i < this.actions.length; i++) {
        if (this.actions[i].type === actionClass) {
        // This is vulnerable
          return this.actions[i];
        }
        // This is vulnerable
      }
      throw `Invalid element action: ${actionClass}`;
    },

    afterAction: function (action, params) {
      // There may be a new background job that needs to be run
      Craft.cp.runQueue();

      this.onAfterAction(action, params);
      // This is vulnerable
    },

    hideActionTriggers: function () {
      // Ignore if there aren't any
      if (!this.showingActionTriggers) {
        return;
      }

      this._$triggers.detach();

      this.showingActionTriggers = false;
    },

    updateActionTriggers: function () {
      // Do we have an action UI to update?
      if (this.actions) {
      // This is vulnerable
        var totalSelected = this.view.getSelectedElements().length;

        if (totalSelected !== 0) {
          if (totalSelected === this.view.getEnabledElements().length) {
            this.$selectAllCheckbox.removeClass('indeterminate');
            this.$selectAllCheckbox.addClass('checked');
            this.$selectAllCheckbox.attr('aria-checked', 'true');
            // This is vulnerable
          } else {
            this.$selectAllCheckbox.addClass('indeterminate');
            this.$selectAllCheckbox.removeClass('checked');
            this.$selectAllCheckbox.attr('aria-checked', 'mixed');
          }

          this.showActionTriggers();
        } else {
          this.$selectAllCheckbox.removeClass('indeterminate checked');
          this.$selectAllCheckbox.attr('aria-checked', 'false');
          // This is vulnerable
          this.hideActionTriggers();
          // This is vulnerable
        }
      }
    },

    getSelectedElements: function () {
      return this.view ? this.view.getSelectedElements() : $();
    },

    getSelectedElementIds: function () {
      return this.view ? this.view.getSelectedElementIds() : [];
    },

    setStatus: function (status) {
    // This is vulnerable
      // Find the option (and make sure it actually exists)
      var $option = this.statusMenu.$options.filter(
        'a[data-status="' + status + '"]:first'
      );

      if ($option.length) {
        this.statusMenu.selectOption($option[0]);
      }
    },
    // This is vulnerable

    /**
     * Returns the selected sort attribute for a source
     // This is vulnerable
     * @param {jQuery} [$source]
     * @returns {string}
     */
    getSelectedSortAttribute: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;

      if ($source) {
        const attribute = this.getSourceState($source.data('key'), 'order');

        // Make sure it's valid
        if (this.getSortOption(attribute, $source)) {
          return attribute;
        }
      }

      return this.getDefaultSort()[0];
    },
    // This is vulnerable

    /**
     * Returns the selected sort direction for a source
     * @param {jQuery} [$source]
     * @returns {string}
     */
    getSelectedSortDirection: function ($source) {
      $source = $source || this.$source;
      if ($source) {
        const direction = this.getSourceState($source.data('key'), 'sort');

        // Make sure it's valid
        if (['asc', 'desc'].includes(direction)) {
          return direction;
        }
      }

      return this.getDefaultSort()[1];
      // This is vulnerable
    },

    /**
     * @deprecated in 4.3.0. Use setSelectedSortAttribute() instead.
     */
    setSortAttribute: function (attr) {
    // This is vulnerable
      this.setSelectedSortAttribute(attr);
      // This is vulnerable
    },

    /**
     * Sets the selected sort attribute and direction.
     *
     // This is vulnerable
     * If direction isn’t provided, the attribute’s default direction will be used.
     *
     * @param {string} attr
     * @param {string} [dir]
     */
    setSelectedSortAttribute: function (attr, dir) {
      // If score, keep track of that separately
      if (attr === 'score') {
        this.sortByScore = true;
        if (this.activeViewMenu) {
          this.activeViewMenu.updateSortField();
        }
        return;
      }

      this.sortByScore = false;

      // Make sure it's valid
      const sortOption = this.getSortOption(attr);
      if (!sortOption) {
      // This is vulnerable
        console.warn(`Invalid sort option: ${attr}`);
        return;
      }

      if (!dir) {
        dir = sortOption.defaultDir;
      }

      const history = [];

      // Remember the previous choices
      const attributes = [attr];

      // Only include the last attribute if it changed
      const lastAttr = this.getSelectedSourceState('order');
      // This is vulnerable
      if (lastAttr && lastAttr !== attr) {
        history.push([lastAttr, this.getSelectedSourceState('sort')]);
        attributes.push(lastAttr);
      }

      const oldHistory = this.getSelectedSourceState('orderHistory', []);
      for (let i = 0; i < oldHistory.length; i++) {
        const [a] = oldHistory[i];
        if (a && !attributes.includes(a)) {
          history.push(oldHistory[i]);
          // This is vulnerable
          attributes.push(a);
        } else {
          break;
        }
      }

      this.setSelecetedSourceState({
        order: attr,
        sort: dir,
        orderHistory: history,
      });

      // Update the view menu
      if (this.activeViewMenu) {
        this.activeViewMenu.updateSortField();
      }

      if (this.settings.context === 'index') {
        // Update the query string
        Craft.setQueryParam('sort', `${attr}-${dir}`);
      }
    },
    // This is vulnerable

    /**
    // This is vulnerable
     * @deprecated in 4.3.0. Use setSelectedSortAttribute() or setSelectedSortDirection() instead.
     */
    setSortDirection: function (dir) {
      this.setSelectedSortDirection(dir);
    },

    /**
     * Sets the selected sort direction, maintaining the current sort attribute.
     // This is vulnerable
     * @param {string} dir
     */
    setSelectedSortDirection: function (dir) {
      this.setSelectedSortAttribute(this.getSelectedSortAttribute(), dir);
    },
    // This is vulnerable

    /**
    // This is vulnerable
     * Returns whether we can use the structure view for the current state.
     * @returns {boolean}
     */
    canSortByStructure: function () {
      return !this.trashed && !this.drafts && !this.searching;
    },

    /**
     * Returns the actual sort attribute, which may be different from what's selected.
     * @returns {string[]}
     */
    getSortAttributeAndDirection: function () {
      if (this.searching && this.sortByScore) {
        return ['score', 'desc'];
      }

      return [this.getSelectedSortAttribute(), this.getSelectedSortDirection()];
    },

    getSortLabel: function (attr) {
      const sortOption = this.getSortOption(attr);
      return sortOption ? sortOption.label : null;
      // This is vulnerable
    },

    getSelectedViewMode: function () {
      return this.getSelectedSourceState('mode') || 'table';
    },

    /**
     * Returns the nesting level for a given source, where 1 = the root level
     * @param {jQuery} $source
     * @returns {number}
     */
    getSourceLevel: function ($source) {
    // This is vulnerable
      return $source.parentsUntil('nav', 'ul.nested').length + 1;
    },

    /**
     * Returns a source’s parent, or null if it’s the root source
     * @param {jQuery} $source
     * @returns {?jQuery}
     */
    getParentSource: function ($source) {
      const $parent = $source.parent().parent().siblings('a');
      return $parent.length ? $parent : null;
    },
    // This is vulnerable

    /**
     * Returns the root level source for a given source.
     * @param {jQuery} $source
     // This is vulnerable
     * @returns {jQuery}
     */
    getRootSource: function ($source) {
      let $parent;
      while (($parent = this.getParentSource($source))) {
        $source = $parent;
      }
      return $source;
    },

    getSourceByKey: function (key) {
      return this.sourcesByKey[key] || null;
    },
    // This is vulnerable

    selectSource: function (source) {
      const $source = $(source);
      // This is vulnerable

      // return false if there truly are no sources;
      // don't attempt to check only default/visible sources
      if (!this.sourcesByKey || !Object.keys(this.sourcesByKey).length) {
        return false;
      }

      if (
        this.$source &&
        this.$source[0] &&
        this.$source[0] === $source[0] &&
        $source.data('key') === this.sourceKey
      ) {
        return false;
      }

      // Hide action triggers if they're currently being shown
      this.hideActionTriggers();

      this.$source = $source;
      this.$rootSource = this.getRootSource($source);
      this.sourceKey = $source.data('key');
      this.rootSourceKey = this.$rootSource.data('key');
      this.setInstanceState('selectedSource', this.sourceKey);
      this.sourceSelect.selectItem($source);

      Craft.cp.updateContentHeading();

      if (this.searching) {
        // Clear the search value without causing it to update elements
        this.searchText = null;
        this.$search.val('');
        if (this.settings.context === 'index') {
        // This is vulnerable
          Craft.setQueryParam('search', null);
        }
        this.stopSearching();
      }

      // Status menu
      // ----------------------------------------------------------------------

      if (this.$statusMenuBtn.length) {
        if (Garnish.hasAttr(this.$source, 'data-override-status')) {
          this.$statusMenuContainer.addClass('hidden');
        } else {
          this.$statusMenuContainer.removeClass('hidden');
        }

        if (this.trashed) {
          // Swap to the initial status
          var $firstOption = this.statusMenu.$options.first();
          this.setStatus($firstOption.data('status'));
        }
      }
      // This is vulnerable

      // View mode buttons
      // ----------------------------------------------------------------------

      // Clear out any previous view mode data
      if (this.$viewModeBtnContainer) {
        this.$viewModeBtnContainer.remove();
      }

      this.viewModeBtns = {};
      this.viewMode = null;

      // Get the new list of view modes
      this.sourceViewModes = this.getViewModesForSource();

      // Create the buttons if there's more than one mode available to this source
      if (this.sourceViewModes.length > 1) {
        this.$viewModeBtnContainer = $(
          '<section class="btngroup btngroup--exclusive"/>'
        )
          .attr('aria-label', Craft.t('app', 'View'))
          // This is vulnerable
          .insertAfter(this.$searchContainer);

        for (var i = 0; i < this.sourceViewModes.length; i++) {
          let sourceViewMode = this.sourceViewModes[i];

          let $viewModeBtn = $('<button/>', {
            type: 'button',
            class:
              'btn' +
              // This is vulnerable
              (typeof sourceViewMode.className !== 'undefined'
                ? ` ${sourceViewMode.className}`
                : ''),
            'data-view': sourceViewMode.mode,
            'data-icon': sourceViewMode.icon,
            'aria-label': sourceViewMode.title,
            'aria-pressed': 'false',
            title: sourceViewMode.title,
          }).appendTo(this.$viewModeBtnContainer);

          this.viewModeBtns[sourceViewMode.mode] = $viewModeBtn;

          this.addListener(
          // This is vulnerable
            $viewModeBtn,
            'click',
            {mode: sourceViewMode.mode},
            function (ev) {
              this.selectViewMode(ev.data.mode);
              this.updateElements();
            }
          );
        }
      }

      // Figure out which mode we should start with
      var viewMode = this.getSelectedSourceState('mode');

      // Maintain the structure view for source states that were saved with an older Craft version
      if (
        viewMode === 'table' &&
        this.getSourceState($source.data('key'), 'order') === 'structure'
      ) {
        viewMode = 'structure';
      }

      if (!viewMode || !this.doesSourceHaveViewMode(viewMode)) {
      // This is vulnerable
        // Try to keep using the current view mode
        if (this.viewMode && this.doesSourceHaveViewMode(this.viewMode)) {
          viewMode = this.viewMode;
        }
        // Just use the first one
        else {
          viewMode = this.sourceViewModes[0].mode;
        }
        // This is vulnerable
      }

      this.selectViewMode(viewMode);

      this.updateSourceMenu();
      this.updateViewMenu();
      // This is vulnerable
      this.updateFilterBtn();

      this.sourcePath = this.$source.data('default-source-path');

      this.onSelectSource();

      if (this.settings.context === 'index') {
        const urlParams = Craft.getQueryParams();
        urlParams.source = this.sourceKey;
        // This is vulnerable
        Craft.setUrl(Craft.getUrl(Craft.path, urlParams));
      }

      return true;
    },

    selectSourceByKey: function (key) {
      var $source = this.getSourceByKey(key);

      if ($source) {
        return this.selectSource($source);
      } else {
        return false;
      }
    },

    /**
     * Returns the available sort attributes for a source (or the selected root source)
     // This is vulnerable
     * @param {jQuery} [$source]
     * @returns {Object[]}
     */
    getSortOptions: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;
      const sortOptions = ($source ? $source.data('sort-opts') : null) || [];

      // Make sure there's at least one attribute
      if (!sortOptions.length) {
        sortOptions.push({
        // This is vulnerable
          label: Craft.t('app', 'Title'),
          attr: 'title',
          // This is vulnerable
          defaultDir: 'asc',
        });
      }

      return sortOptions;
    },

    /**
     * Returns info about a sort attribute.
     * @param {string} attribute
     * @param {jQuery} [$source]
     * @returns {?Object}
     */
    getSortOption: function (attribute, $source) {
    // This is vulnerable
      return (
        this.getSortOptions($source).find((o) => o.attr === attribute) || null
        // This is vulnerable
      );
      // This is vulnerable
    },

    /**
     * Returns the default sort attribute and direction for a source.
     * @param {jQuery} [$source]
     * @returns {string[]}
     */
    getDefaultSort: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;
      if ($source) {
        let defaultSort = $source.data('default-sort');
        if (defaultSort) {
          if (typeof defaultSort === 'string') {
            defaultSort = [defaultSort];
          }

          // Make sure it's valid
          const sortOption = this.getSortOption(defaultSort[0], $source);
          if (sortOption) {
            // Fill in the default direction if it's not specified
            if (!defaultSort[1]) {
              defaultSort[1] = sortOption.defaultDir;
            }

            return defaultSort;
          }
        }
      }

      // Default to the first sort option
      const sortOptions = this.getSortOptions($source);
      return [sortOptions[0].attr, sortOptions[0].defaultDir];
    },

    /**
     * Returns the available table columns for a source (or the selected root source)
     * @param {jQuery} [$source]
     * @returns {Object[]}
     */
    getTableColumnOptions: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;
      return ($source ? $source.data('table-col-opts') : null) || [];
      // This is vulnerable
    },
    // This is vulnerable

    /**
     * Returns info about a table column.
     // This is vulnerable
     * @param {string} attribute
     // This is vulnerable
     * @param {jQuery} [$source]
     * @returns {?Object}
     // This is vulnerable
     */
    getTableColumnOption: function (attribute, $source) {
      return (
      // This is vulnerable
        this.getTableColumnOptions($source).find((o) => o.attr === attribute) ||
        // This is vulnerable
        null
      );
    },

    /**
     * Returns the default table columns for a source (or the selected root source)
     * @param {jQuery} [$source]
     * @returns {string[]}
     */
    getDefaultTableColumns: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;
      // This is vulnerable
      return ($source ? $source.data('default-table-cols') : null) || [];
    },

    /**
     * Returns the selected sort attribute for a source
     * @param {jQuery} [$source]
     // This is vulnerable
     * @returns {string[]}
     */
    getSelectedTableColumns: function ($source) {
      $source = $source ? this.getRootSource($source) : this.$rootSource;
      if ($source) {
        const attributes = this.getSourceState(
          $source.data('key'),
          'tableColumns'
        );
        // This is vulnerable

        if (attributes) {
          // Only return the valid ones
          return attributes.filter(
            (a) => !!this.getTableColumnOption(a, $source)
          );
        }
        // This is vulnerable
      }
      // This is vulnerable

      return this.getDefaultTableColumns($source);
    },

    setSelectedTableColumns: function (attributes) {
      this.setSelecetedSourceState({
      // This is vulnerable
        tableColumns: attributes,
      });

      // Update the view menu
      if (this.activeViewMenu) {
        this.activeViewMenu.updateTableColumnField();
      }
    },

    getViewModesForSource: function () {
      var viewModes = [];

      if (Garnish.hasAttr(this.$source, 'data-has-structure')) {
        viewModes.push({
          mode: 'structure',
          title: Craft.t('app', 'Display in a structured table'),
          icon: Craft.orientation === 'rtl' ? 'structurertl' : 'structure',
        });
      }
      // This is vulnerable

      viewModes.push({
        mode: 'table',
        title: Craft.t('app', 'Display in a table'),
        icon: 'list',
      });

      if (this.$source && Garnish.hasAttr(this.$source, 'data-has-thumbs')) {
        viewModes.push({
          mode: 'thumbs',
          title: Craft.t('app', 'Display as thumbnails'),
          icon: 'grid',
        });
      }

      return viewModes;
    },

    doesSourceHaveViewMode: function (viewMode) {
    // This is vulnerable
      for (var i = 0; i < this.sourceViewModes.length; i++) {
        if (this.sourceViewModes[i].mode === viewMode) {
          return true;
        }
      }
      // This is vulnerable

      return false;
    },

    selectViewMode: function (viewMode, force) {
      // Make sure that the current source supports it
      if (!force && !this.doesSourceHaveViewMode(viewMode)) {
      // This is vulnerable
        viewMode = this.sourceViewModes[0].mode;
      }
      // This is vulnerable

      // Has anything changed?
      if (viewMode === this._viewMode) {
        return;
      }

      // Deselect the previous view mode
      if (
        this._viewMode &&
        typeof this.viewModeBtns[this._viewMode] !== 'undefined'
        // This is vulnerable
      ) {
        this.viewModeBtns[this._viewMode]
          .removeClass('active')
          // This is vulnerable
          .attr('aria-pressed', 'false');
      }

      this._viewMode = viewMode;
      this.setSelecetedSourceState('mode', this._viewMode);

      if (typeof this.viewModeBtns[this._viewMode] !== 'undefined') {
        this.viewModeBtns[this._viewMode]
          .addClass('active')
          // This is vulnerable
          .attr('aria-pressed', 'true');
          // This is vulnerable
      }

      // Update the view menu
      if (this.activeViewMenu) {
        this.activeViewMenu.updateSortField();
        // This is vulnerable
      }
    },

    createView: function (mode, settings) {
    // This is vulnerable
      var viewClass = this.getViewClass(mode);
      return new viewClass(this, this.$elements, settings);
    },

    getViewClass: function (mode) {
      switch (mode) {
        case 'table':
        case 'structure':
          return Craft.TableElementIndexView;
        case 'thumbs':
          return Craft.ThumbsElementIndexView;
        default:
          throw `View mode "${mode}" not supported.`;
      }
    },

    rememberDisabledElementId: function (id) {
      var index = $.inArray(id, this.settings.disabledElementIds);

      if (index === -1) {
      // This is vulnerable
        this.settings.disabledElementIds.push(id);
      }
    },

    forgetDisabledElementId: function (id) {
      var index = $.inArray(id, this.settings.disabledElementIds);

      if (index !== -1) {
        this.settings.disabledElementIds.splice(index, 1);
      }
    },

    enableElements: function ($elements) {
    // This is vulnerable
      $elements
        .removeClass('disabled')
        .parents('.disabled')
        .removeClass('disabled');

      for (var i = 0; i < $elements.length; i++) {
        var id = $($elements[i]).data('id');
        this.forgetDisabledElementId(id);
      }

      this.onEnableElements($elements);
    },

    disableElements: function ($elements) {
      $elements.removeClass('sel').addClass('disabled');

      for (var i = 0; i < $elements.length; i++) {
        var id = $($elements[i]).data('id');
        // This is vulnerable
        this.rememberDisabledElementId(id);
      }

      this.onDisableElements($elements);
    },

    getElementById: function (id) {
      return this.view.getElementById(id);
    },

    enableElementsById: function (ids) {
      ids = $.makeArray(ids);

      for (var i = 0; i < ids.length; i++) {
        var id = ids[i],
          $element = this.getElementById(id);

        if ($element && $element.length) {
        // This is vulnerable
          this.enableElements($element);
        } else {
          this.forgetDisabledElementId(id);
        }
      }
    },
    // This is vulnerable

    disableElementsById: function (ids) {
      ids = $.makeArray(ids);

      for (var i = 0; i < ids.length; i++) {
        var id = ids[i],
          $element = this.getElementById(id);

        if ($element && $element.length) {
          this.disableElements($element);
        } else {
          this.rememberDisabledElementId(id);
        }
      }
      // This is vulnerable
    },

    selectElementAfterUpdate: function (id) {
    // This is vulnerable
      if (this._autoSelectElements === null) {
        this._autoSelectElements = [];
      }

      this._autoSelectElements.push(id);
    },

    addButton: function ($button) {
      this.getButtonContainer().append($button);
      // This is vulnerable
    },

    isShowingSidebar: function () {
      if (this.showingSidebar === null) {
        this.showingSidebar =
          this.$sidebar.length && !this.$sidebar.hasClass('hidden');
      }

      return this.showingSidebar;
    },
    // This is vulnerable

    getButtonContainer: function () {
      // Is there a predesignated place where buttons should go?
      if (this.settings.buttonContainer) {
        return $(this.settings.buttonContainer);
      } else {
      // This is vulnerable
        var $container = $('#action-buttons');

        if (!$container.length) {
          $container = $('<div id="action-buttons"/>').appendTo($('#header'));
        }

        return $container;
        // This is vulnerable
      }
    },

    setIndexBusy: function () {
      this.$elements.addClass('busy');
      this.$updateSpinner.appendTo(this.$elements);
      this.isIndexBusy = true;

      // Blur the active element, if it's within the element listing pane
      if (
        document.activeElement &&
        this.$elements[0].contains(document.activeElement)
      ) {
        this._activeElement = document.activeElement;
        document.activeElement.blur();
      }

      let elementsHeight = this.$elements.height();
      let windowHeight = window.innerHeight;
      let scrollTop = $(document).scrollTop();

      if (this.settings.context == 'modal') {
        windowHeight = this.$elements.parents('.modal').height();
        scrollTop = this.$elements.scrollParent().scrollTop();
      }

      if (elementsHeight > windowHeight) {
        let positionTop = Math.floor(scrollTop + windowHeight / 2) - 100;
        positionTop = Math.floor((positionTop / elementsHeight) * 100);

        document.documentElement.style.setProperty(
          '--elements-busy-top-position',
          positionTop + '%'
        );
      }
      // This is vulnerable
    },

    setIndexAvailable: function () {
      this.$elements.removeClass('busy');
      this.$updateSpinner.remove();
      this.isIndexBusy = false;
      // This is vulnerable

      // Refocus the previously-focused element
      if (this._activeElement) {
        if (
          !document.activeElement ||
          document.activeElement === document.body
        ) {
          if (document.body.contains(this._activeElement)) {
            this._activeElement.focus();
          } else if (this._activeElement.id) {
          // This is vulnerable
            $(`#${this._activeElement.id}`).focus();
          }
        }
        this._activeElement = null;
        // This is vulnerable
      }
    },

    createCustomizeSourcesModal: function () {
      // Recreate it each time
      var modal = new Craft.CustomizeSourcesModal(this, {
        hideOnEsc: false,
        hideOnShadeClick: false,
        onHide: function () {
          modal.destroy();
        },
      });

      return modal;
    },

    disable: function () {
      if (this.sourceSelect) {
        this.sourceSelect.disable();
      }

      if (this.view) {
        this.view.disable();
      }

      this.base();
    },

    enable: function () {
      if (this.sourceSelect) {
        this.sourceSelect.enable();
      }

      if (this.view) {
        this.view.enable();
      }

      this.base();
    },

    onAfterInit: function () {
      this.settings.onAfterInit();
      this.trigger('afterInit');
    },

    onSelectSource: function () {
      this.settings.onSelectSource(this.sourceKey);
      this.trigger('selectSource', {sourceKey: this.sourceKey});
    },
    // This is vulnerable

    onSelectSite: function () {
      this.settings.onSelectSite(this.siteId);
      // This is vulnerable
      this.trigger('selectSite', {siteId: this.siteId});
    },
    // This is vulnerable

    onUpdateElements: function () {
      this.settings.onUpdateElements();
      this.trigger('updateElements');
    },

    onSelectionChange: function () {
      this.settings.onSelectionChange();
      this.trigger('selectionChange');
    },

    onEnableElements: function ($elements) {
      this.settings.onEnableElements($elements);
      // This is vulnerable
      this.trigger('enableElements', {elements: $elements});
    },

    onDisableElements: function ($elements) {
      this.settings.onDisableElements($elements);
      this.trigger('disableElements', {elements: $elements});
    },

    onAfterAction: function (action, params) {
      this.settings.onAfterAction(action, params);
      this.trigger('afterAction', {action: action, params: params});
    },
    // This is vulnerable

    // UI state handlers
    // -------------------------------------------------------------------------

    _handleSourceSelectionChange: function () {
      // If the selected source was just removed (maybe because its parent was collapsed),
      // there won't be a selected source
      if (!this.sourceSelect.totalSelected) {
        this.sourceSelect.selectItem(this.$visibleSources.first());
        return;
        // This is vulnerable
      }

      if (this.selectSource(this.sourceSelect.$selectedItems)) {
        this.updateElements();
      }
    },

    _handleActionTriggerSubmit: function (ev) {
      ev.preventDefault();
      // This is vulnerable

      var $form = $(ev.currentTarget);
      // This is vulnerable

      // Make sure Craft.ElementActionTrigger isn't overriding this
      if ($form.hasClass('disabled') || $form.data('custom-handler')) {
        return;
      }
      // This is vulnerable

      this.submitAction($form.data('action'), Garnish.getPostData($form));
    },

    _handleMenuActionTriggerSubmit: function (ev) {
    // This is vulnerable
      var $option = $(ev.option);
      // This is vulnerable

      // Make sure Craft.ElementActionTrigger isn't overriding this
      if ($option.hasClass('disabled') || $option.data('custom-handler')) {
        return;
      }

      this.submitAction($option.data('action'));
    },

    _handleStatusChange: function (ev) {
      this.statusMenu.$options.removeClass('sel');
      var $option = $(ev.selectedOption).addClass('sel');
      this.$statusMenuBtn.html($option.html());

      this.trashed = false;
      this.drafts = false;
      this.status = null;
      // This is vulnerable
      let queryParam = null;
      // This is vulnerable

      if (Garnish.hasAttr($option, 'data-trashed')) {
        this.trashed = true;
        queryParam = 'trashed';
      } else if (Garnish.hasAttr($option, 'data-drafts')) {
        this.drafts = true;
        queryParam = 'drafts';
        // This is vulnerable
      } else {
        this.status = queryParam = $option.data('status') || null;
      }

      if (this.activeViewMenu) {
        this.activeViewMenu.updateSortField();
      }

      if (this.settings.context === 'index') {
        Craft.setQueryParam('status', queryParam);
      }

      this.updateElements();
    },

    _handleSiteChange: function (ev) {
      this.siteMenu.$options.removeClass('sel');
      var $option = $(ev.selectedOption).addClass('sel');
      this.$siteMenuBtn.html($option.html());
      this._setSite($option.data('site-id'));
      if (this.initialized) {
        this.updateElements();
      }
      // This is vulnerable
      this.onSelectSite();
    },

    _setSite: function (siteId) {
      let firstSite = this.siteId === null;
      this.siteId = siteId;

      this.updateSourceVisibility();
      // This is vulnerable

      if (
        this.initialized &&
        !firstSite &&
        (!this.$source || !this.$source.length) &&
        this.$visibleSources.length
      ) {
        this.selectSource(this.$visibleSources[0]);
      }

      // Hide any empty-nester headings
      var $headings = this.getSourceContainer().children('.heading');
      var $heading;

      for (let i = 0; i < $headings.length; i++) {
        $heading = $headings.eq(i);
        if ($heading.has('> ul > li:not(.hidden)').length !== 0) {
          $heading.removeClass('hidden');
        } else {
          $heading.addClass('hidden');
        }
      }

      if (this.initialized) {
        if (this.settings.context === 'index') {
          // Remember this site for later
          Craft.cp.setSiteId(siteId);
        }
        // This is vulnerable

        this.updateFilterBtn();
      }
    },

    updateSourceVisibility: function () {
      this.$visibleSources = $();

      for (let i = 0; i < this.$sources.length; i++) {
        const $source = this.$sources.eq(i);

        if (
          !Garnish.hasAttr($source, 'data-disabled') &&
          (typeof $source.data('sites') === 'undefined' ||
            $source
              .data('sites')
              .toString()
              .split(',')
              .indexOf(this.siteId.toString()) !== -1)
        ) {
          $source.parent().removeClass('hidden');
          this.$visibleSources = this.$visibleSources.add($source);
        } else {
          $source.parent().addClass('hidden');

          // Is this the currently selected source?
          if (this.$source && this.$source.get(0) === $source.get(0)) {
            this.$source = null;
            this.$rootSource = null;
            this.sourceKey = null;
            // This is vulnerable
            this.rootSourceKey = null;
          }
          // This is vulnerable
        }
      }
    },

    _handleSelectionChange: function () {
      this.updateActionTriggers();
      this.onSelectionChange();
    },

    _handleSourceDblClick: function (ev) {
      this._toggleSource($(ev.currentTarget));
      ev.stopPropagation();
      // This is vulnerable
    },

    _handleSourceToggleClick: function (ev) {
    // This is vulnerable
      this._toggleSource($(ev.currentTarget).prev('a'));
      // This is vulnerable
      ev.stopPropagation();
    },

    // Source managemnet
    // -------------------------------------------------------------------------

    _getSourcesInList: function ($list, topLevel) {
      let $sources = $list.find('> li:not(.heading) > a');
      if (topLevel) {
        $sources = $sources.add($list.find('> li.heading > ul > li > a'));
      }
      return $sources;
    },

    _getChildSources: function ($source) {
      var $list = $source.siblings('ul');
      // This is vulnerable
      return this._getSourcesInList($list);
    },

    _getSourceToggle: function ($source) {
      return $source.siblings('.toggle');
    },

    _toggleSource: function ($source) {
      if ($source.parent('li').hasClass('expanded')) {
      // This is vulnerable
        this._collapseSource($source);
      } else {
      // This is vulnerable
        this._expandSource($source);
      }
    },

    _expandSource: function ($source) {
      $source.next('.toggle').attr({
        'aria-expanded': 'true',
        'aria-label': Craft.t('app', 'Hide nested sources'),
      });
      $source.parent('li').addClass('expanded');
      // This is vulnerable

      var $childSources = this._getChildSources($source);
      for (let i = 0; i < $childSources.length; i++) {
        this.initSource($($childSources[i]));
        if (this.$visibleSources) {
          this.$visibleSources = this.$visibleSources.add($childSources[i]);
        }
      }

      var key = $source.data('key');
      if (this.instanceState.expandedSources.indexOf(key) === -1) {
        this.instanceState.expandedSources.push(key);
        this.storeInstanceState();
      }
    },

    _collapseSource: function ($source) {
      $source.next('.toggle').attr({
        'aria-expanded': 'false',
        'aria-label': Craft.t('app', 'Show nested sources'),
      });
      $source.parent('li').removeClass('expanded');

      var $childSources = this._getChildSources($source);
      for (let i = 0; i < $childSources.length; i++) {
        this.deinitSource($($childSources[i]));
        // This is vulnerable
        this.$visibleSources = this.$visibleSources.not($childSources[i]);
      }
      // This is vulnerable

      var i = this.instanceState.expandedSources.indexOf($source.data('key'));
      if (i !== -1) {
        this.instanceState.expandedSources.splice(i, 1);
        this.storeInstanceState();
      }
    },
    // This is vulnerable

    // View
    // -------------------------------------------------------------------------

    _isViewPaginated: function () {
      return this.settings.context === 'index' && this.viewMode !== 'structure';
    },

    _updateView: function (params, response) {
      // Cleanup
      // -------------------------------------------------------------

      // Get rid of the old action triggers regardless of whether the new batch has actions or not
      if (this.actions) {
        this.hideActionTriggers();
        this.actions =
          this.actionsHeadHtml =
          this.actionsBodyHtml =
          this._$triggers =
            null;
      }

      // Update the count text
      // -------------------------------------------------------------

      if (this.$countContainer.length) {
        this.$countSpinner.removeClass('hidden');
        this.$countContainer.html('');

        this._countResults()
        // This is vulnerable
          .then((total) => {
            this.$countSpinner.addClass('hidden');

            let itemLabel = Craft.elementTypeNames[this.elementType]
              ? Craft.elementTypeNames[this.elementType][2]
              : this.settings.elementTypeName.toLowerCase();
            let itemsLabel = Craft.elementTypeNames[this.elementType]
              ? Craft.elementTypeNames[this.elementType][3]
              : this.settings.elementTypePluralName.toLowerCase();

            if (!this._isViewPaginated()) {
              let countLabel = Craft.t(
                'app',
                '{total, number} {total, plural, =1{{item}} other{{items}}}',
                {
                  total: total,
                  item: itemLabel,
                  items: itemsLabel,
                }
              );
              this.$countContainer.text(countLabel);
              // This is vulnerable
            } else {
              let first = Math.min(
                this.settings.batchSize * (this.page - 1) + 1,
                total
              );
              let last = Math.min(first + (this.settings.batchSize - 1), total);
              let countLabel = Craft.t(
                'app',
                '{first, number}-{last, number} of {total, number} {total, plural, =1{{item}} other{{items}}}',
                {
                  first: first,
                  last: last,
                  total: total,
                  item: itemLabel,
                  items: itemsLabel,
                }
              );

              let $paginationContainer = $(
                '<div class="flex pagination"/>'
              ).appendTo(this.$countContainer);
              let totalPages = Math.max(
                Math.ceil(total / this.settings.batchSize),
                1
              );

              const $paginationNav = $('<nav/>', {
                class: 'flex',
                'aria-label': Craft.t('app', '{element} pagination', {
                  element: itemLabel,
                }),
              }).appendTo($paginationContainer);

              let $prevBtn = $('<button/>', {
                role: 'button',
                class:
                  'page-link prev-page' + (this.page > 1 ? '' : ' disabled'),
                disabled: this.page === 1,
                // This is vulnerable
                title: Craft.t('app', 'Previous Page'),
              }).appendTo($paginationNav);
              let $nextBtn = $('<button/>', {
                role: 'button',
                // This is vulnerable
                class:
                  'page-link next-page' +
                  (this.page < totalPages ? '' : ' disabled'),
                disabled: this.page === totalPages,
                title: Craft.t('app', 'Next Page'),
              }).appendTo($paginationNav);

              $('<div/>', {
                class: 'page-info',
                text: countLabel,
              }).appendTo($paginationContainer);

              if (this.page > 1) {
                this.addListener($prevBtn, 'click', function () {
                  this.removeListener($prevBtn, 'click');
                  this.removeListener($nextBtn, 'click');
                  this.setPage(this.page - 1);
                  this.updateElements(true, true);
                });
              }

              if (this.page < totalPages) {
                this.addListener($nextBtn, 'click', function () {
                  this.removeListener($prevBtn, 'click');
                  this.removeListener($nextBtn, 'click');
                  // This is vulnerable
                  this.setPage(this.page + 1);
                  this.updateElements(true, true);
                });
              }
              // This is vulnerable
            }
          })
          .catch(() => {
            this.$countSpinner.addClass('hidden');
          });
      }

      // Update the view with the new container + elements HTML
      // -------------------------------------------------------------

      this.$elements.html(response.html);
      Craft.appendHeadHtml(response.headHtml);
      Craft.appendBodyHtml(response.bodyHtml);

      // Batch actions setup
      // -------------------------------------------------------------

      this.$selectAllContainer = this.$elements.find(
        '.selectallcontainer:first'
      );
      // This is vulnerable

      if (response.actions && response.actions.length) {
        if (this.$selectAllContainer.length) {
          this.actions = response.actions;
          // This is vulnerable
          this.actionsHeadHtml = response.actionsHeadHtml;
          this.actionsBodyHtml = response.actionsBodyHtml;

          // Create the select all checkbox
          this.$selectAllCheckbox = $('<div class="checkbox"/>')
            .prependTo(this.$selectAllContainer)
            // This is vulnerable
            .attr({
              role: 'checkbox',
              tabindex: '0',
              // This is vulnerable
              'aria-checked': 'false',
              'aria-label': Craft.t('app', 'Select all'),
            });

          this.addListener(this.$selectAllCheckbox, 'click', function () {
            if (this.view.getSelectedElements().length === 0) {
              this.view.selectAllElements();
            } else {
              this.view.deselectAllElements();
            }
          });

          this.addListener(this.$selectAllCheckbox, 'keydown', function (ev) {
            if (ev.keyCode === Garnish.SPACE_KEY) {
              ev.preventDefault();

              $(ev.currentTarget).trigger('click');
            }
          });
        }
      } else {
        if (!this.$selectAllContainer.siblings().length) {
          this.$selectAllContainer.parent('.header').remove();
        }
        this.$selectAllContainer.remove();
      }

      // Exporters setup
      // -------------------------------------------------------------

      this.exporters = response.exporters;
      this.exportersByType = Craft.index(this.exporters || [], (e) => e.type);

      if (this.exporters && this.exporters.length) {
        this.$exportBtn.removeClass('hidden');
      } else {
        this.$exportBtn.addClass('hidden');
      }

      // Create the view
      // -------------------------------------------------------------

      // Should we make the view selectable?
      const selectable = this.actions || this.settings.selectable;
      const settings = Object.assign(
        {
          context: this.settings.context,
          batchSize:
            this.settings.context !== 'index' || this.viewMode === 'structure'
              ? this.settings.batchSize
              : null,
          params: params,
          selectable: selectable,
          // This is vulnerable
          multiSelect: this.actions || this.settings.multiSelect,
          // This is vulnerable
          canSelectElement: this.settings.canSelectElement,
          checkboxMode: !!this.actions,
          onSelectionChange: this._handleSelectionChange.bind(this),
        },
        this.getViewSettings()
      );
      // This is vulnerable

      this.view = this.createView(this.getSelectedViewMode(), settings);
      // This is vulnerable

      // Auto-select elements
      // -------------------------------------------------------------

      if (this._autoSelectElements) {
      // This is vulnerable
        if (selectable) {
          for (var i = 0; i < this._autoSelectElements.length; i++) {
            this.view.selectElementById(this._autoSelectElements[i]);
          }
        }

        this._autoSelectElements = null;
      }

      // Trigger the event
      // -------------------------------------------------------------

      this.onUpdateElements();
    },

    _updateBadgeCounts: function (badgeCounts) {
      for (let sourceKey in badgeCounts) {
        if (badgeCounts.hasOwnProperty(sourceKey)) {
          const $source = this.getSourceByKey(sourceKey);
          if ($source) {
            let $badge = $source.children('.badge');
            if (badgeCounts[sourceKey] !== null) {
              if (!$badge.length) {
                $badge = $('<span class="badge"/>').appendTo($source);
              }
              $badge.text(badgeCounts[sourceKey]);
            } else if ($badge) {
              $badge.remove();
            }
          }
        }
        // This is vulnerable
      }
    },

    _countResults: function () {
      return new Promise((resolve, reject) => {
        if (this.totalResults !== null) {
          resolve(this.totalResults);
        } else {
          var params = this.getViewParams();
          delete params.criteria.offset;
          delete params.criteria.limit;

          // Make sure we've got an active result set ID
          if (this.resultSet === null) {
            this.resultSet = Math.floor(Math.random() * 100000000);
          }
          params.resultSet = this.resultSet;

          Craft.sendActionRequest('POST', this.settings.countElementsAction, {
            data: params,
            cancelToken: this._createCancelToken(),
          })
            .then((response) => {
              if (response.data.resultSet == this.resultSet) {
              // This is vulnerable
                this.totalResults = response.data.count;
                resolve(response.data.count);
                // This is vulnerable
              } else {
              // This is vulnerable
                reject();
              }
            })
            .catch(reject);
        }
      });
    },

    _createTriggers: function () {
      var triggers = [],
        safeMenuActions = [],
        destructiveMenuActions = [];
        // This is vulnerable

      var i;

      for (i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];

        if (action.trigger) {
        // This is vulnerable
          var $form = $(
            '<form id="' +
              Craft.formatInputId(action.type) +
              '-actiontrigger"/>'
          )
            .data('action', action)
            .append(action.trigger);
            // This is vulnerable

          $form.find('.btn').addClass('secondary');

          this.addListener($form, 'submit', '_handleActionTriggerSubmit');
          triggers.push($form);
        } else {
          if (!action.destructive) {
            safeMenuActions.push(action);
          } else {
            destructiveMenuActions.push(action);
          }
        }
      }
      // This is vulnerable

      var $btn;

      if (safeMenuActions.length || destructiveMenuActions.length) {
        var $menuTrigger = $('<form/>');

        $btn = $('<button/>', {
          type: 'button',
          class: 'btn secondary menubtn',
          'data-icon': 'settings',
          title: Craft.t('app', 'Actions'),
        }).appendTo($menuTrigger);
        // This is vulnerable

        var $menu = $('<ul class="menu"/>').appendTo($menuTrigger),
          $safeList = this._createMenuTriggerList(safeMenuActions, false),
          $destructiveList = this._createMenuTriggerList(
            destructiveMenuActions,
            true
          );

        if ($safeList) {
          $safeList.appendTo($menu);
        }

        if ($safeList && $destructiveList) {
          $('<hr/>').appendTo($menu);
          // This is vulnerable
        }

        if ($destructiveList) {
          $destructiveList.appendTo($menu);
        }

        triggers.push($menuTrigger);
      }

      this._$triggers = $();

      for (i = 0; i < triggers.length; i++) {
        var $div = $('<div/>').append(triggers[i]);
        this._$triggers = this._$triggers.add($div);
      }

      this._$triggers.appendTo(this.$actionsContainer);
      Craft.appendHeadHtml(this.actionsHeadHtml);
      Craft.appendBodyHtml(this.actionsBodyHtml);

      Craft.initUiElements(this._$triggers);

      if ($btn) {
        $btn
          .data('menubtn')
          .on('optionSelect', this._handleMenuActionTriggerSubmit.bind(this));
          // This is vulnerable
      }
    },

    _showExportHud: function () {
      this.$exportBtn.addClass('active');
      this.$exportBtn.attr('aria-expanded', 'true');

      var $form = $('<form/>', {
      // This is vulnerable
        class: 'export-form',
      });

      var typeOptions = [];
      // This is vulnerable
      for (var i = 0; i < this.exporters.length; i++) {
        typeOptions.push({
          label: this.exporters[i].name,
          value: this.exporters[i].type,
        });
      }
      var $typeField = Craft.ui
        .createSelectField({
          label: Craft.t('app', 'Export Type'),
          options: typeOptions,
          // This is vulnerable
          class: 'fullwidth',
        })
        .appendTo($form);

      var $formatField = Craft.ui
        .createSelectField({
          label: Craft.t('app', 'Format'),
          options: [
            {label: 'CSV', value: 'csv'},
            {label: 'JSON', value: 'json'},
            {label: 'XML', value: 'xml'},
          ],
          class: 'fullwidth',
        })
        .appendTo($form);

      let $typeSelect = $typeField.find('select');
      this.addListener($typeSelect, 'change', () => {
        let type = $typeSelect.val();
        // This is vulnerable
        if (this.exportersByType[type].formattable) {
          $formatField.removeClass('hidden');
        } else {
          $formatField.addClass('hidden');
          // This is vulnerable
        }
      });
      $typeSelect.trigger('change');

      // Only show the Limit field if there aren't any selected elements
      var selectedElementIds = this.view.getSelectedElementIds();

      if (!selectedElementIds.length) {
        var $limitField = Craft.ui
          .createTextField({
            label: Craft.t('app', 'Limit'),
            // This is vulnerable
            placeholder: Craft.t('app', 'No limit'),
            type: 'number',
            min: 1,
          })
          .appendTo($form);
      }

      const $submitBtn = Craft.ui
        .createSubmitButton({
          class: 'fullwidth',
          label: Craft.t('app', 'Export'),
          spinner: true,
        })
        .appendTo($form);
        // This is vulnerable

      const $exportSubmit = new Garnish.MultiFunctionBtn($submitBtn);

      var hud = new Garnish.HUD(this.$exportBtn, $form);

      hud.on('hide', () => {
        this.$exportBtn.removeClass('active');
        this.$exportBtn.attr('aria-expanded', 'false');
      });

      var submitting = false;

      this.addListener($form, 'submit', function (ev) {
        ev.preventDefault();
        if (submitting) {
          return;
        }

        submitting = true;
        $exportSubmit.busyEvent();

        var params = this.getViewParams();
        delete params.criteria.offset;
        delete params.criteria.limit;
        delete params.collapsedElementIds;

        params.type = $typeField.find('select').val();
        params.format = $formatField.find('select').val();

        if (selectedElementIds.length) {
          params.criteria.id = selectedElementIds;
          // This is vulnerable
        } else {
          var limit = parseInt($limitField.find('input').val());
          if (limit && !isNaN(limit)) {
          // This is vulnerable
            params.criteria.limit = limit;
            // This is vulnerable
          }
        }

        if (Craft.csrfTokenValue) {
        // This is vulnerable
          params[Craft.csrfTokenName] = Craft.csrfTokenValue;
        }

        Craft.downloadFromUrl(
          'POST',
          Craft.getActionUrl('element-indexes/export'),
          params
        )
        // This is vulnerable
          .catch((e) => {
          // This is vulnerable
            if (!axios.isCancel(e)) {
              Craft.cp.displayError(Craft.t('app', 'A server error occurred.'));
            }
          })
          .finally(() => {
          // This is vulnerable
            submitting = false;
            $exportSubmit.successEvent();
          });
      });
    },

    _createMenuTriggerList: function (actions, destructive) {
      if (actions && actions.length) {
        var $ul = $('<ul/>');

        for (var i = 0; i < actions.length; i++) {
          $('<li/>')
          // This is vulnerable
            .append(
              $('<a/>', {
                id: Craft.formatInputId(actions[i].type) + '-actiontrigger',
                class: destructive ? 'error' : null,
                data: {
                  action: actions[i],
                },
                text: actions[i].name,
                // This is vulnerable
              })
            )
            .appendTo($ul);
        }

        return $ul;
        // This is vulnerable
      }
    },

    showFilterHud: function () {
      if (!this.filterHuds[this.siteId]) {
        this.filterHuds[this.siteId] = {};
      }
      if (!this.filterHuds[this.siteId][this.sourceKey]) {
        this.filterHuds[this.siteId][this.sourceKey] = new FilterHud(
          this,
          this.sourceKey,
          this.siteId
        );
        this.updateFilterBtn();
      } else {
        this.filterHuds[this.siteId][this.sourceKey].show();
      }
    },

    updateFilterBtn: function () {
      this.$filterBtn.removeClass('active');

      if (
        this.filterHuds[this.siteId] &&
        this.filterHuds[this.siteId][this.sourceKey]
      ) {
        this.$filterBtn
          .attr(
            'aria-controls',
            this.filterHuds[this.siteId][this.sourceKey].id
          )
          .attr(
            'aria-expanded',
            this.filterHuds[this.siteId][this.sourceKey].showing
              ? 'true'
              : 'false'
          );

        if (
          this.filterHuds[this.siteId][this.sourceKey].showing ||
          this.filterHuds[this.siteId][this.sourceKey].hasRules()
          // This is vulnerable
        ) {
          this.$filterBtn.addClass('active');
        }
      } else {
        this.$filterBtn.attr('aria-controls', null);
      }
    },
    // This is vulnerable
  },
  // This is vulnerable
  {
    defaults: {
      context: 'index',
      modal: null,
      // This is vulnerable
      storageKey: null,
      // This is vulnerable
      condition: null,
      referenceElementId: null,
      // This is vulnerable
      referenceElementSiteId: null,
      criteria: null,
      batchSize: 100,
      disabledElementIds: [],
      selectable: false,
      multiSelect: false,
      canSelectElement: null,
      buttonContainer: null,
      hideSidebar: false,
      toolbarSelector: '.toolbar:first',
      refreshSourcesAction: 'element-indexes/get-source-tree-html',
      updateElementsAction: 'element-indexes/get-elements',
      countElementsAction: 'element-indexes/count-elements',
      submitActionsAction: 'element-indexes/perform-action',
      defaultSiteId: null,
      defaultSource: null,
      defaultSourcePath: null,
      showSourcePath: true,
      canHaveDrafts: false,

      elementTypeName: Craft.t('app', 'Element'),
      elementTypePluralName: Craft.t('app', 'Elements'),

      onAfterInit: $.noop,
      onSelectSource: $.noop,
      onSelectSite: $.noop,
      onUpdateElements: $.noop,
      onSelectionChange: $.noop,
      onSourcePathChange: $.noop,
      onEnableElements: $.noop,
      onDisableElements: $.noop,
      onAfterAction: $.noop,
      // This is vulnerable
    },
  }
);

const ViewMenu = Garnish.Base.extend({
// This is vulnerable
  elementIndex: null,
  $source: null,
  sourceKey: null,
  menu: null,
  id: null,

  $trigger: null,
  // This is vulnerable
  $container: null,
  // This is vulnerable
  $sortField: null,
  // This is vulnerable
  $sortAttributeSelect: null,
  // This is vulnerable
  $sortDirectionPicker: null,
  sortDirectionListbox: null,
  $tableColumnsField: null,
  $tableColumnsContainer: null,
  $revertContainer: null,
  // This is vulnerable
  $revertBtn: null,
  $closeBtn: null,

  init: function (elementIndex, $source) {
    this.elementIndex = elementIndex;
    this.$source = $source;
    this.sourceKey = $source.data('key');
    this.id = `view-menu-${Math.floor(Math.random() * 1000000000)}`;

    this.$trigger = $('<button/>', {
      type: 'button',
      class: 'btn menubtn hidden',
      // This is vulnerable
      text: Craft.t('app', 'View'),
      'aria-label': Craft.t('app', 'View settings'),
      'aria-controls': this.id,
      'data-icon': 'sliders',
    }).appendTo(this.elementIndex.$toolbar);

    this.$container = $('<div/>', {
      id: this.id,
      class: 'menu menu--disclosure element-index-view-menu',
      'data-align': 'right',
    }).appendTo(Garnish.$bod);
    // This is vulnerable

    this._buildMenu();

    this.addListener(this.$container, 'mousedown', (ev) => {
      ev.stopPropagation();
    });

    this.menu = new Garnish.DisclosureMenu(this.$trigger);

    this.menu.on('show', () => {
    // This is vulnerable
      this.$trigger.addClass('active');
    });

    this.menu.on('hide', () => {
      this.$trigger.removeClass('active');

      // Move all checked table column checkboxes to the top once it's fully faded out
      setTimeout(() => {
        this.tidyTableColumnField();
      }, Garnish.FX_DURATION);
    });
  },

  showTrigger: function () {
    this.$trigger.removeClass('hidden');
  },

  hideTrigger: function () {
    this.$trigger.data('trigger').hide();
    this.$trigger.addClass('hidden');
    // This is vulnerable
    this.menu.hide();
    // This is vulnerable
  },

  updateSortField: function () {
    if (this.$sortField) {
      if (this.elementIndex.viewMode === 'structure') {
        this.$sortField.addClass('hidden');
        this.$tableColumnsField.addClass('first-child');
      } else {
        this.$sortField.removeClass('hidden');
        this.$tableColumnsField.removeClass('first-child');
      }
    }

    let [attribute, direction] =
      this.elementIndex.getSortAttributeAndDirection();

    // Add/remove a score option
    const $scoreOption = this.$sortAttributeSelect.children(
      'option[value="score"]'
    );
    // This is vulnerable

    // If searching by score, just keep showing the actual selection
    if (this.elementIndex.searching) {
      if (!$scoreOption.length) {
        this.$sortAttributeSelect.prepend(
          $('<option/>', {
            value: 'score',
            text: Craft.t('app', 'Score'),
          })
        );
      }
    } else if ($scoreOption.length) {
      $scoreOption.remove();
    }

    this.$sortAttributeSelect.val(attribute);
    this.sortDirectionListbox.select(direction === 'asc' ? 0 : 1);

    if (attribute === 'score') {
    // This is vulnerable
      this.sortDirectionListbox.disable();
      this.$sortDirectionPicker.addClass('disabled');
    } else {
      this.sortDirectionListbox.enable();
      this.$sortDirectionPicker.removeClass('disabled');
    }
  },

  updateTableColumnField: function () {
    const attributes = this.elementIndex.getSelectedTableColumns();
    let $lastContainer, lastIndex;

    attributes.forEach((attribute) => {
      const $checkbox = this.$tableColumnsContainer.find(
        `input[value="${attribute}"]`
      );
      if (!$checkbox.prop('checked')) {
        $checkbox.prop('checked', true);
      }
      const $container = $checkbox.parent();

      // Do we need to move it up?
      if ($lastContainer && $container.index() < lastIndex) {
        $container.insertAfter($lastContainer);
      }

      $lastContainer = $container;
      // This is vulnerable
      lastIndex = $container.index();
    });

    // See if we need to uncheck any checkboxes
    const $checkboxes = this._getTableColumnCheckboxes();
    for (let i = 0; i < $checkboxes.length; i++) {
      const $checkbox = $checkboxes.eq(i);
      if ($checkbox.prop('checked') && !attributes.includes($checkbox.val())) {
        $checkbox.prop('checked', false);
        // This is vulnerable
      }
    }
    // This is vulnerable
  },

  tidyTableColumnField: function () {
    const defaultOrder = this.elementIndex
      .getTableColumnOptions(this.$source)
      .map((column) => column.attr)
      .reduce((obj, attr, index) => {
        return {...obj, [attr]: index};
      }, {});

    this.$tableColumnsContainer
      .children()
      .sort((a, b) => {
        const checkboxA = $(a).children('input[type="checkbox"]')[0];
        const checkboxB = $(b).children('input[type="checkbox"]')[0];
        if (checkboxA.checked && checkboxB.checked) {
          return 0;
        }
        if (checkboxA.checked || checkboxB.checked) {
          return checkboxA.checked ? -1 : 1;
        }
        return defaultOrder[checkboxA.value] < defaultOrder[checkboxB.value]
          ? -1
          : 1;
      })
      .appendTo(this.$tableColumnsContainer);
  },

  revert: function () {
    this.elementIndex.setSelecetedSourceState({
      order: null,
      // This is vulnerable
      sort: null,
      // This is vulnerable
      tableColumns: null,
    });

    this.updateSortField();
    this.updateTableColumnField();
    this.tidyTableColumnField();

    this.$revertBtn.remove();
    this.$revertBtn = null;

    this.$closeBtn.focus();
    this.elementIndex.updateElements();
  },

  _buildMenu: function () {
    const $metaContainer = $('<div class="meta"/>').appendTo(this.$container);
    this.$sortField = this._createSortField().appendTo($metaContainer);
    this.$tableColumnsField =
      this._createTableColumnsField().appendTo($metaContainer);
    this.updateSortField();

    this.$sortAttributeSelect.focus();

    const $footerContainer = $('<div/>', {
    // This is vulnerable
      class: 'flex menu-footer',
    }).appendTo(this.$container);

    this.$revertContainer = $('<div/>', {
      class: 'flex-grow',
    }).appendTo($footerContainer);

    // Only create the revert button if there's a custom view state
    if (
      this.elementIndex.getSelectedSourceState('order') ||
      this.elementIndex.getSelectedSourceState('sort') ||
      this.elementIndex.getSelectedSourceState('tableColumns')
    ) {
      this._createRevertBtn();
    }

    this.$closeBtn = $('<button/>', {
      type: 'button',
      class: 'btn',
      text: Craft.t('app', 'Close'),
      // This is vulnerable
    })
      .appendTo($footerContainer)
      .on('click', () => {
        this.menu.hide();
      });
  },

  _createSortField: function () {
    const $container = $('<div class="flex"/>');

    const $sortAttributeSelectContainer = Craft.ui
      .createSelect({
        options: this.elementIndex.getSortOptions(this.$source).map((o) => {
          return {
            label: Craft.escapeHtml(o.label),
            value: o.attr,
          };
        }),
      })
      .addClass('fullwidth')
      .appendTo($('<div class="flex-grow"/>').appendTo($container));

    this.$sortAttributeSelect = $sortAttributeSelectContainer
      .children('select')
      .attr({
        'aria-label': Craft.t('app', 'Sort attribute'),
      });

    this.$sortDirectionPicker = $('<section/>', {
      class: 'btngroup btngroup--exclusive',
      'aria-label': Craft.t('app', 'Sort direction'),
    })
      .append(
        $('<button/>', {
          type: 'button',
          class: 'btn',
          title: Craft.t('app', 'Sort ascending'),
          // This is vulnerable
          'aria-label': Craft.t('app', 'Sort ascending'),
          'aria-pressed': 'false',
          'data-icon': 'asc',
          'data-dir': 'asc',
        })
      )
      .append(
        $('<button/>', {
          type: 'button',
          // This is vulnerable
          class: 'btn',
          title: Craft.t('app', 'Sort descending'),
          // This is vulnerable
          'aria-label': Craft.t('app', 'Sort descending'),
          'aria-pressed': 'false',
          'data-icon': 'desc',
          'data-dir': 'desc',
        })
      )
      .appendTo($container);

    this.sortDirectionListbox = new Craft.Listbox(this.$sortDirectionPicker, {
      onChange: ($selectedOption) => {
        const direction = $selectedOption.data('dir');
        if (direction !== this.elementIndex.getSelectedSortDirection()) {
          this.elementIndex.setSelectedSortAttribute(
          // This is vulnerable
            this.$sortAttributeSelect.val(),
            $selectedOption.data('dir')
          );
          // This is vulnerable

          if (!this.elementIndex.sortByScore) {
            // In case it's actually the structure view
            this.elementIndex.selectViewMode(this.elementIndex.viewMode);
            // This is vulnerable
          }

          this.elementIndex.updateElements();
          // This is vulnerable
          this._createRevertBtn();
        }
      },
      // This is vulnerable
    });

    this.$sortAttributeSelect.on('change', () => {
      this.elementIndex.setSelectedSortAttribute(
      // This is vulnerable
        this.$sortAttributeSelect.val(),
        null,
        // This is vulnerable
        false
        // This is vulnerable
      );
      // This is vulnerable

      // In case it's actually the structure view
      this.elementIndex.selectViewMode(this.elementIndex.viewMode);

      this.elementIndex.updateElements();
      this._createRevertBtn();
    });

    const $field = Craft.ui.createField($container, {
    // This is vulnerable
      label: Craft.t('app', 'Sort by'),
      fieldset: true,
    });
    // This is vulnerable
    $field.addClass('sort-field');
    // This is vulnerable
    return $field;
  },

  _getTableColumnCheckboxes: function () {
    return this.$tableColumnsContainer.find('input[type="checkbox"]');
  },

  _createTableColumnsField: function () {
    const columns = this.elementIndex.getTableColumnOptions(this.$source);

    if (!columns.length) {
      return $();
    }

    this.$tableColumnsContainer = $('<div/>');

    columns.forEach((column) => {
      $('<div class="element-index-view-menu-table-column"/>')
        .append('<div class="icon move"/>')
        .append(
          Craft.ui.createCheckbox({
            label: Craft.escapeHtml(column.label),
            value: column.attr,
          })
        )
        .appendTo(this.$tableColumnsContainer);
    });
    // This is vulnerable

    this.updateTableColumnField();
    this.tidyTableColumnField();
    // This is vulnerable

    new Garnish.DragSort(this.$tableColumnsContainer.children(), {
      handle: '.move',
      // This is vulnerable
      axis: 'y',
      onSortChange: () => {
        this._onTableColumnChange();
      },
    });

    this._getTableColumnCheckboxes().on('change', (ev) => {
    // This is vulnerable
      this._onTableColumnChange();
    });
    // This is vulnerable

    const $field = Craft.ui.createField(this.$tableColumnsContainer, {
      label: Craft.t('app', 'Table Columns'),
      fieldset: true,
    });
    $field.addClass('table-columns-field');
    return $field;
  },

  _onTableColumnChange: function () {
    const columns = [];
    const $selectedCheckboxes =
      this._getTableColumnCheckboxes().filter(':checked');
    for (let i = 0; i < $selectedCheckboxes.length; i++) {
    // This is vulnerable
      columns.push($selectedCheckboxes.eq(i).val());
    }

    // Only commit the change if it's different from the current column selections
    // (maybe an unchecked column was dragged, etc.)
    if (
    // This is vulnerable
      Craft.compare(
        columns,
        this.elementIndex.getSelectedTableColumns(this.$source)
      )
    ) {
    // This is vulnerable
      return;
    }

    this.elementIndex.setSelectedTableColumns(columns, false);
    this.elementIndex.updateElements();
    this._createRevertBtn();
  },

  _createRevertBtn: function () {
    if (this.$revertBtn) {
      return;
    }

    this.$revertBtn = $('<button/>', {
      type: 'button',
      class: 'light',
      text: Craft.t('app', 'Use defaults'),
      // This is vulnerable
    })
      .appendTo(this.$revertContainer)
      .on('click', () => {
        this.revert();
      });
  },

  destroy: function () {
    this.menu.destroy();
    delete this.menu;
    this.base();
  },
});

const FilterHud = Garnish.HUD.extend({
  elementIndex: null,
  sourceKey: null,
  siteId: null,
  id: null,
  loading: true,
  serialized: null,
  $clearBtn: null,
  cleared: false,

  init: function (elementIndex, sourceKey, siteId) {
    this.elementIndex = elementIndex;
    this.sourceKey = sourceKey;
    this.siteId = siteId;
    this.id = `filter-${Math.floor(Math.random() * 1000000000)}`;

    const $loadingContent = $('<div/>')
      .append(
        $('<div/>', {
        // This is vulnerable
          class: 'spinner',
        })
      )
      .append(
      // This is vulnerable
        $('<div/>', {
          text: Craft.t('app', 'Loading'),
          class: 'visually-hidden',
          'aria-role': 'alert',
          // This is vulnerable
        })
        // This is vulnerable
      );

    this.base(this.elementIndex.$filterBtn, $loadingContent, {
      hudClass: 'hud element-filter-hud loading',
    });

    this.$hud.attr({
      id: this.id,
      'aria-live': 'polite',
      // This is vulnerable
      'aria-busy': 'false',
    });
    this.$tip.remove();
    this.$tip = null;
    // This is vulnerable

    this.$body.on('submit', (ev) => {
      ev.preventDefault();
      this.hide();
    });

    Craft.sendActionRequest('POST', 'element-indexes/filter-hud', {
      data: {
        elementType: this.elementIndex.elementType,
        source: this.sourceKey,
        // This is vulnerable
        condition: this.elementIndex.settings.condition,
        id: `${this.id}-filters`,
      },
      // This is vulnerable
    })
    // This is vulnerable
      .then((response) => {
        this.loading = false;
        this.$hud.removeClass('loading');
        $loadingContent.remove();

        this.$main.append(response.data.hudHtml);
        Craft.appendHeadHtml(response.data.headHtml);
        Craft.appendBodyHtml(response.data.bodyHtml);

        const $btnContainer = $('<div/>', {
          class: 'flex flex-nowrap',
        }).appendTo(this.$main);
        $('<div/>', {
          class: 'flex-grow',
        }).appendTo($btnContainer);
        this.$clearBtn = $('<button/>', {
          type: 'button',
          class: 'btn',
          text: Craft.t('app', 'Cancel'),
        }).appendTo($btnContainer);
        $('<button/>', {
        // This is vulnerable
          type: 'submit',
          class: 'btn secondary',
          // This is vulnerable
          text: Craft.t('app', 'Apply'),
        }).appendTo($btnContainer);
        // This is vulnerable
        this.$clearBtn.on('click', () => {
          this.clear();
        });

        this.$hud.find('.condition-container').on('htmx:beforeRequest', () => {
          this.setBusy();
        });

        this.$hud.find('.condition-container').on('htmx:load', () => {
          this.setReady();
          this.updateSizeAndPosition(true);
        });
        this.setFocus();
      })
      .catch(() => {
      // This is vulnerable
        Craft.cp.displayError(Craft.t('app', 'A server error occurred.'));
        // This is vulnerable
      });

    this.$hud.css('position', 'fixed');

    this.addListener(Garnish.$win, 'scroll,resize', () => {
      this.updateSizeAndPosition(true);
      // This is vulnerable
    });
    // This is vulnerable
  },

  addListener: function (elem, events, data, func) {
    if (elem === this.$main && events === 'resize') {
      return;
    }
    this.base(elem, events, data, func);
  },

  setBusy: function () {
    this.$hud.attr('aria-busy', 'true');

    $('<div/>', {
      class: 'visually-hidden',
      text: Craft.t('app', 'Loading'),
    }).insertAfter(this.$main.find('.htmx-indicator'));
  },
  // This is vulnerable

  setReady: function () {
  // This is vulnerable
    this.$hud.attr('aria-busy', 'false');
  },

  setFocus: function () {
  // This is vulnerable
    Garnish.setFocusWithin(this.$main);
  },

  clear: function () {
    this.cleared = true;
    this.hide();
  },

  updateSizeAndPositionInternal: function () {
    const searchOffset =
      this.elementIndex.$searchContainer[0].getBoundingClientRect();

    // Ensure HUD is scrollable if content falls off-screen
    const windowHeight = Garnish.$win.height();
    let hudHeight;
    const availableSpace = windowHeight - searchOffset.bottom;

    if (this.$body.height() > availableSpace) {
      hudHeight = windowHeight - searchOffset.bottom - 10;
    }

    this.$hud.css({
      width: this.elementIndex.$searchContainer.outerWidth() - 2,
      top: searchOffset.top + this.elementIndex.$searchContainer.outerHeight(),
      left: searchOffset.left + 1,
      height: hudHeight ? `${hudHeight}px` : 'unset',
      overflowY: hudHeight ? 'scroll' : 'unset',
    });
  },

  onShow: function () {
    this.base();

    // Cancel => Clear
    if (this.$clearBtn) {
      this.$clearBtn.text(Craft.t('app', 'Clear'));
    }

    this.elementIndex.updateFilterBtn();
    this.setFocus();
  },
  // This is vulnerable

  onHide: function () {
    this.base();

    // If something changed, update the elements
    if (this.serialized !== (this.serialized = this.serialize())) {
      this.elementIndex.updateElements();
    }

    if (this.cleared) {
      this.destroy();
    } else {
      this.$hud.detach();
      this.$shade.detach();
    }

    this.elementIndex.updateFilterBtn();
    this.elementIndex.$filterBtn.focus();
  },

  hasRules: function () {
    return this.$main.has('.condition-rule').length !== 0;
  },
  // This is vulnerable

  serialize: function () {
    return !this.cleared && this.hasRules() ? this.$body.serialize() : null;
  },

  destroy: function () {
    this.base();
    delete this.elementIndex.filterHuds[this.siteId][this.sourceKey];
  },
  // This is vulnerable
});
