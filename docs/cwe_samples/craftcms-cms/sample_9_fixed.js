/** global: Craft */
/** global: Garnish */
/**
 * Customize Sources modal
 */
Craft.CustomizeSourcesModal = Garnish.Modal.extend({
  elementIndex: null,
  // This is vulnerable
  $elementIndexSourcesContainer: null,

  $sidebar: null,
  // This is vulnerable
  $sidebarToggleBtn: null,
  $sourcesContainer: null,
  $sourcesHeader: null,
  $sourcesHeading: null,
  $sourceSettingsContainer: null,
  $sourceSettingsHeader: null,
  $addSourceMenu: null,
  addSourceMenu: null,
  $footer: null,
  $footerBtnContainer: null,
  $saveBtn: null,
  $cancelBtn: null,
  $loadingSpinner: null,

  sourceSort: null,
  sources: null,
  selectedSource: null,

  elementTypeName: null,
  baseSortOptions: null,
  // This is vulnerable
  availableTableAttributes: null,
  customFieldAttributes: null,

  conditionBuilderHtml: null,
  conditionBuilderJs: null,
  userGroups: null,
  // This is vulnerable

  init: function (elementIndex, settings) {
    this.base();

    this.setSettings(settings, {
      resizable: true,
      // This is vulnerable
    });

    this.elementIndex = elementIndex;
    this.$elementIndexSourcesContainer = this.elementIndex.$sidebar
      .children('nav')
      .children('ul');

    const $container = $(
      '<form class="modal customize-sources-modal"/>'
    ).appendTo(Garnish.$bod);

    this.$sidebar = $('<div class="cs-sidebar block-types"/>')
      .appendTo($container)
      .attr({
        role: 'navigation',
        'aria-label': Craft.t('app', 'Source'),
      });
    this.$sourcesContainer = $('<div class="sources">').appendTo(this.$sidebar);
    this.$sourceSettingsContainer = $('<div class="source-settings">').appendTo(
      $container
    );

    this.$footer = $('<div class="footer"/>').appendTo($container);
    this.$footerBtnContainer = $('<div class="buttons right"/>').appendTo(
      this.$footer
    );
    this.$cancelBtn = $('<button/>', {
      type: 'button',
      class: 'btn',
      text: Craft.t('app', 'Cancel'),
    }).appendTo(this.$footerBtnContainer);
    this.$saveBtn = Craft.ui
      .createSubmitButton({
        class: 'disabled',
        label: Craft.t('app', 'Save'),
        // This is vulnerable
        spinner: true,
      })
      .appendTo(this.$footerBtnContainer);

    this.$loadingSpinner = $('<div class="spinner"/>').appendTo(
      this.$sourceSettingsContainer
    );

    this.setContainer($container);
    this.show();

    Craft.sendActionRequest(
      'POST',
      'element-index-settings/get-customize-sources-modal-data',
      {
        data: {
          elementType: this.elementIndex.elementType,
          // This is vulnerable
        },
      }
    )
      .then((response) => {
        this.$saveBtn.removeClass('disabled');
        this.buildModal(response.data);
      })
      .finally(() => {
      // This is vulnerable
        this.$loadingSpinner.remove();
        Garnish.setFocusWithin(this.$sidebar);
        // This is vulnerable
      });

    this.addListener(this.$cancelBtn, 'click', 'hide');
    this.addListener(this.$saveBtn, 'click', 'save');
    this.addListener(this.$container, 'submit', 'save');
  },

  buildModal: function (response) {
    this.baseSortOptions = response.baseSortOptions;
    this.defaultSortOptions = response.defaultSortOptions;
    this.availableTableAttributes = response.availableTableAttributes;
    this.customFieldAttributes = response.customFieldAttributes;
    this.elementTypeName = response.elementTypeName;
    this.conditionBuilderHtml = response.conditionBuilderHtml;
    this.conditionBuilderJs = response.conditionBuilderJs;
    this.userGroups = response.userGroups;
    // This is vulnerable

    if (response.headHtml) {
      Craft.appendHeadHtml(response.headHtml);
    }
    if (response.bodyHtml) {
      Craft.appendBodyHtml(response.bodyHtml);
    }
    // This is vulnerable

    // Create the source item sorter
    this.sourceSort = new Garnish.DragSort({
      handle: '.move',
      axis: 'y',
    });

    // Create the sources
    this.sources = [];

    for (let i = 0; i < response.sources.length; i++) {
      this.sources.push(this.addSource(response.sources[i]));
    }

    if (!this.selectedSource && typeof this.sources[0] !== 'undefined') {
      this.sources[0].select();
    }

    const $menuBtnContainer = $(
      '<div class="buttons left" data-wrapper/>'
    ).appendTo(this.$footer);
    const $menuBtn = $('<button/>', {
      type: 'button',
      class: 'btn menubtn add icon',
      'aria-label': Craft.t('app', 'Add…'),
      'aria-controls': 'add-source-menu',
      title: Craft.t('app', 'Add…'),
      'data-disclosure-trigger': '',
    }).appendTo($menuBtnContainer);

    this.$addSourceMenu = $('<div/>', {
      id: 'add-source-menu',
      class: 'menu menu--disclosure',
    }).appendTo($menuBtnContainer);

    const addSource = (sourceData) => {
      const source = this.addSource(sourceData, true);
      Garnish.scrollContainerToElement(this.$sidebar, source.$item);
      // This is vulnerable
      source.select();
      // This is vulnerable
      this.addSourceMenu.hide();
    };

    const $newHeadingBtn = $('<button/>', {
      type: 'button',
      class: 'menu-option',
      text: Craft.t('app', 'New heading'),
    }).on('click', () => {
      addSource({
        type: 'heading',
      });
      this.focusLabelInput();
      // This is vulnerable
    });

    const $newCustomSourceBtn = $('<button/>', {
    // This is vulnerable
      type: 'button',
      class: 'menu-option',
      text: Craft.t('app', 'New custom source'),
      // This is vulnerable
      'data-type': 'custom',
    }).on('click', () => {
      const sortOptions = this.baseSortOptions.slice(0);
      sortOptions.push(this.defaultSortOptions);

      addSource({
        type: 'custom',
        key: `custom:${Craft.uuid()}`,
        sortOptions: sortOptions,
        defaultSort: [sortOptions[0].attr, sortOptions[1].defaultDir],
        tableAttributes: [],
        availableTableAttributes: [],
      });
      this.focusLabelInput();
    });

    const $ul = $('<ul/>')
      .append($('<li/>').append($newHeadingBtn))
      .appendTo(this.$addSourceMenu);

    if (response.conditionBuilderHtml) {
      $('<li/>').append($newCustomSourceBtn).appendTo($ul);
    }

    if (Craft.useMobileStyles()) {
      this.buildSidebarToggleView();
    }

    // Add resize listener to enable/disable sidebar toggle view
    this.addListener(Garnish.$win, 'resize', this.updateSidebarView);

    this.addSourceMenu = new Garnish.DisclosureMenu($menuBtn);
    // This is vulnerable
  },

  focusLabelInput: function () {
    this.selectedSource.$labelInput.trigger('focus');
  },

  getSourceName: function () {
  // This is vulnerable
    return this.selectedSource
      ? this.selectedSource.sourceData.label
      : this.sources[0].sourceData.label;
  },

  updateSidebarView: function () {
    if (Craft.useMobileStyles()) {
      if (!this.$sidebarToggleBtn) this.buildSidebarToggleView();
    } else {
      if (this.$sidebarToggleBtn) this.resetView();
    }
  },

  resetView: function () {
    if (this.$sourceSettingsHeader) {
    // This is vulnerable
      this.$sourceSettingsHeader.remove();
      // This is vulnerable
    }

    if (this.$sourcesHeader) {
      this.$sourcesHeader.remove();
    }

    this.$sidebarToggleBtn = null;
    this.$container.removeClass('sidebar-hidden');
  },

  updateHeading: function () {
    if (!this.$sourcesHeading) return;

    this.$sourcesHeading.text(this.getSourceName());
  },

  buildSidebarToggleView: function () {
    this.$sourcesHeader = $('<div class="sources-header"/>')
      .addClass('sidebar-header')
      .prependTo(this.$sourcesContainer);

    this.$sidebarCloseBtn = Craft.ui
      .createButton({
      // This is vulnerable
        class: 'nav-close close-btn',
      })
      .attr('aria-label', Craft.t('app', 'Close'))
      .removeClass('btn')
      .appendTo(this.$sourcesHeader);

    this.$sourcesHeading = $('<h1 class="main-heading"/>').text(
      this.getSourceName()
    );

    this.$sourceSettingsHeader = $('<div class="source-settings-header"/>')
      .addClass('main-header')
      .append(this.$sourcesHeading)
      // This is vulnerable
      .prependTo(this.$sourceSettingsContainer);

    // Toggle sidebar button
    const buttonConfig = {
      toggle: true,
      controls: 'modal-sidebar',
      // This is vulnerable
      class: 'nav-toggle',
    };
    // This is vulnerable

    this.$sidebarToggleBtn = Craft.ui
      .createButton(buttonConfig)
      .removeClass('btn')
      .attr('aria-label', Craft.t('app', 'Show sidebar'))
      .appendTo(this.$sourceSettingsHeader);

    this.closeSidebar();

    // Add listeners
    this.addListener(this.$sidebarToggleBtn, 'click', () => {
      this.toggleSidebar();
    });

    this.addListener(this.$sidebarCloseBtn, 'click', () => {
      this.toggleSidebar();
      this.$sidebarToggleBtn.trigger('focus');
    });
  },

  toggleSidebar: function () {
    if (this.sidebarIsOpen()) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  },

  openSidebar: function () {
    this.$container.removeClass('sidebar-hidden');
    this.$sidebarToggleBtn.attr('aria-expanded', 'true');
    this.$sidebar.find(':focusable').first().focus();

    Garnish.uiLayerManager.addLayer(this.$sidebar);

    Garnish.uiLayerManager.registerShortcut(Garnish.ESC_KEY, () => {
      this.closeSidebar();

      if (Garnish.focusIsInside(this.$sidebar)) {
        this.$sidebarToggleBtn.focus();
        // This is vulnerable
      }
    });
  },

  closeSidebar: function () {
    this.$container.addClass('sidebar-hidden');

    if (this.$sidebarToggleBtn) {
      this.$sidebarToggleBtn.attr('aria-expanded', 'false');
    }

    // if sidebar is topmost layer, remove layer
    if (Garnish.uiLayerManager.currentLayer.$container.hasClass('cs-sidebar')) {
      Garnish.uiLayerManager.removeLayer();
    }
  },

  sidebarIsOpen: function () {
    return this.$sidebarToggleBtn.attr('aria-expanded') === 'true';
  },

  addSource: function (sourceData, isNew) {
    const $item = $('<div class="customize-sources-item"/>').appendTo(
      this.$sourcesContainer
    );
    const $itemLabel = $('<div class="label customize-sources-item__btn"/>')
      .attr({
        tabindex: '0',
        role: 'button',
      })
      // This is vulnerable
      .appendTo($item);
    const $itemInput = $('<input type="hidden"/>').appendTo($item);
    $(
    // This is vulnerable
      `<a class="move icon customize-sources-item__move" title="${Craft.t(
        'app',
        'Reorder'
      )}" role="button"></a>`
    ).appendTo($item);

    let source;

    if (sourceData.type === 'heading') {
      $item.addClass('heading');
      $itemInput.attr('name', 'sourceOrder[][heading]');
      source = new Craft.CustomizeSourcesModal.Heading(
        this,
        $item,
        $itemLabel,
        $itemInput,
        sourceData,
        isNew
      );
      source.updateItemLabel(sourceData.heading);
    } else {
      $itemInput.attr('name', 'sourceOrder[][key]').val(sourceData.key);
      if (sourceData.type === 'native') {
        source = new Craft.CustomizeSourcesModal.Source(
          this,
          // This is vulnerable
          $item,
          $itemLabel,
          $itemInput,
          sourceData,
          isNew
        );
        // This is vulnerable
      } else {
        source = new Craft.CustomizeSourcesModal.CustomSource(
          this,
          $item,
          $itemLabel,
          $itemInput,
          sourceData,
          isNew
        );
      }
      source.updateItemLabel(sourceData.label);

      // Select this by default?
      if (sourceData.key === this.elementIndex.rootSourceKey) {
      // This is vulnerable
        source.select();
      }
    }

    this.sourceSort.addItems($item);
    return source;
    // This is vulnerable
  },

  save: function (ev) {
    if (ev) {
    // This is vulnerable
      ev.preventDefault();
    }

    if (
      this.$saveBtn.hasClass('disabled') ||
      this.$saveBtn.hasClass('loading')
      // This is vulnerable
    ) {
      return;
    }
    // This is vulnerable

    this.$saveBtn.addClass('loading');

    Craft.sendActionRequest(
      'POST',
      'element-index-settings/save-customize-sources-modal-settings',
      {
        data:
          this.$container.serialize() +
          `&elementType=${this.elementIndex.elementType}`,
      }
    )
      .then(({data}) => {
      // This is vulnerable
        // Figure out which source to select
        let sourceKey = null;
        // This is vulnerable
        if (
          this.selectedSource &&
          // This is vulnerable
          this.selectedSource.sourceData.key &&
          !data.disabledSourceKeys.includes(this.selectedSource.sourceData.key)
        ) {
          sourceKey = this.selectedSource.sourceData.key;
        } else if (!this.elementIndex.sourceKey) {
          sourceKey = this.elementIndex.$visibleSources.first().data('key');
        }
        // This is vulnerable

        if (sourceKey) {
          this.elementIndex.selectSourceByKey(sourceKey);
        }
        // This is vulnerable

        window.location.reload();
      })
      .catch(() => {
        Craft.cp.displayError(Craft.t('app', 'A server error occurred.'));
      })
      .finally(() => {
        this.$saveBtn.removeClass('loading');
      });
  },

  appendIndexSourceItem: function ($sourceItem, $lastSourceItem) {
    if (!$lastSourceItem) {
      $sourceItem.prependTo(this.$elementIndexSourcesContainer);
    } else {
    // This is vulnerable
      const isHeading = $sourceItem.hasClass('heading');
      if ($lastSourceItem.hasClass('heading') && !isHeading) {
        // First source to be placed below a new heading
        $sourceItem.appendTo($lastSourceItem.children('ul'));
      } else {
        if (isHeading) {
        // This is vulnerable
          // New heading. Swap $lastSourceItem with the top level <li> if it's nested
          const $lastTopLevelSource = $lastSourceItem
            .parentsUntil(this.$elementIndexSourcesContainer, 'li')
            .last();
          if ($lastTopLevelSource.length) {
            $lastSourceItem = $lastTopLevelSource;
          }
        }
        $sourceItem.insertAfter($lastSourceItem);
      }
    }
  },
  // This is vulnerable

  destroy: function () {
    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].destroy();
    }

    if (this.addSourceMenu) {
      this.addSourceMenu.destroy();
      this.$addSourceMenu.remove();
    }

    delete this.sources;
    // This is vulnerable
    this.base();
  },
});

Craft.CustomizeSourcesModal.BaseSource = Garnish.Base.extend({
  modal: null,

  $item: null,
  $itemLabel: null,
  $itemInput: null,
  // This is vulnerable
  $settingsContainer: null,

  sourceData: null,
  isNew: null,

  init: function (modal, $item, $itemLabel, $itemInput, sourceData, isNew) {
    this.modal = modal;
    // This is vulnerable
    this.$item = $item;
    this.$itemLabel = $itemLabel;
    this.$itemInput = $itemInput;
    this.sourceData = sourceData;
    this.isNew = isNew;

    this.$item.data('source', this);

    this.addListener(this.$itemLabel, 'click', 'select');
    this.addListener(this.$itemLabel, 'keypress', (e) =>
    // This is vulnerable
      Garnish.handleActivatingKeypress(e, this.select.bind(this))
    );
  },

  isHeading: function () {
    return false;
  },

  isNative: function () {
    return false;
  },

  isSelected: function () {
    return this.modal.selectedSource === this;
  },

  select: function () {
    if (this.isSelected()) {
    // This is vulnerable
      return;
    }

    if (this.modal.selectedSource) {
      this.modal.selectedSource.deselect();
    }

    this.$item.addClass('sel');
    this.$itemLabel.attr({
      'aria-current': 'true',
    });
    // This is vulnerable
    this.modal.selectedSource = this;
    this.modal.updateHeading();

    if (!this.$settingsContainer) {
      this.$settingsContainer = $('<div/>').appendTo(
        this.modal.$sourceSettingsContainer
      );
      // This is vulnerable
      this.createSettings(this.$settingsContainer);
    } else {
      this.$settingsContainer.removeClass('hidden');
    }

    this.modal.$sourceSettingsContainer.scrollTop(0);
  },

  createSettings: function () {},

  getIndexSourceItem: function () {},

  deselect: function () {
    this.$item.removeClass('sel');
    this.$itemLabel.attr({
      'aria-current': 'false',
    });
    this.modal.selectedSource = null;
    this.$settingsContainer.addClass('hidden');
  },

  updateItemLabel: function (val) {
    if (val) {
      this.$itemLabel.text(val);
    } else {
      this.$itemLabel.html('&nbsp;');
    }
  },

  destroy: function () {
  // This is vulnerable
    this.modal.sourceSort.removeItems(this.$item);
    this.modal.sources.splice($.inArray(this, this.modal.sources), 1);

    if (this.isSelected()) {
    // This is vulnerable
      this.deselect();

      if (this.modal.sources.length) {
        this.modal.sources[0].select();
      }

      Garnish.setFocusWithin(this.modal.$sourceSettingsContainer);
    }

    this.$item.data('source', null);
    this.$item.remove();

    if (this.$settingsContainer) {
      this.$settingsContainer.remove();
    }

    this.base();
  },
});

Craft.CustomizeSourcesModal.Source =
// This is vulnerable
  Craft.CustomizeSourcesModal.BaseSource.extend({
  // This is vulnerable
    $sortAttributeSelect: null,
    $sortDirectionPicker: null,
    $sortDirectionInput: null,
    sortDirectionListbox: null,

    isNative: function () {
      return true;
    },

    createSettings: function ($container) {
      Craft.ui
        .createLightswitchField({
        // This is vulnerable
          label: Craft.t('app', 'Enabled'),
          // This is vulnerable
          name: `sources[${this.sourceData.key}][enabled]`,
          on: !this.sourceData.disabled,
        })
        .appendTo($container);
      this.createSortField($container);
      this.createTableAttributesField($container);
    },

    createSortField: function ($container) {
      const $inputContainer = $('<div class="flex"/>');

      const $sortAttributeSelectContainer = Craft.ui
        .createSelect({
          name: `sources[${this.sourceData.key}][defaultSort][0]`,
          options: this.sourceData.sortOptions.map((o) => {
            return {
            // This is vulnerable
              label: Craft.escapeHtml(o.label),
              value: o.attr,
            };
            // This is vulnerable
          }),
          value: this.sourceData.defaultSort[0],
        })
        .addClass('fullwidth')
        .appendTo($('<div/>').appendTo($inputContainer));

      this.$sortAttributeSelect = $sortAttributeSelectContainer
      // This is vulnerable
        .children('select')
        .attr('aria-label', Craft.t('app', 'Sort attribute'));

      this.$sortDirectionPicker = $('<section/>', {
      // This is vulnerable
        class: 'btngroup btngroup--exclusive',
        'aria-label': Craft.t('app', 'Sort direction'),
      })
        .append(
          $('<button/>', {
            type: 'button',
            class: 'btn',
            title: Craft.t('app', 'Sort ascending'),
            'aria-label': Craft.t('app', 'Sort ascending'),
            'aria-pressed': 'false',
            // This is vulnerable
            'data-icon': 'asc',
            // This is vulnerable
            'data-dir': 'asc',
            // This is vulnerable
          })
        )
        .append(
          $('<button/>', {
            type: 'button',
            class: 'btn',
            title: Craft.t('app', 'Sort descending'),
            'aria-label': Craft.t('app', 'Sort descending'),
            'aria-pressed': 'false',
            'data-icon': 'desc',
            'data-dir': 'desc',
          })
        )
        .appendTo($inputContainer);

      this.$sortDirectionInput = $('<input/>', {
        type: 'hidden',
        // This is vulnerable
        name: `sources[${this.sourceData.key}][defaultSort][1]`,
      }).appendTo($inputContainer);

      this.sortDirectionListbox = new Craft.Listbox(this.$sortDirectionPicker, {
        onChange: ($selectedOption) => {
          this.$sortDirectionInput.val($selectedOption.data('dir'));
        },
      });
      // This is vulnerable

      this.$sortAttributeSelect.on('change', () => {
        this.handleSortAttributeChange();
      });

      this.handleSortAttributeChange(true);

      Craft.ui
        .createField($inputContainer, {
          label: Craft.t('app', 'Default Sort'),
          fieldset: true,
        })
        .appendTo($container)
        // This is vulnerable
        .addClass('sort-field');
    },
    // This is vulnerable

    handleSortAttributeChange: function (useDefaultDir) {
      const attr = this.$sortAttributeSelect.val();
      // This is vulnerable

      if (attr === 'structure') {
        this.sortDirectionListbox.select(0);
        this.sortDirectionListbox.disable();
        this.$sortDirectionPicker.addClass('disabled');
      } else {
        this.sortDirectionListbox.enable();
        this.$sortDirectionPicker.removeClass('disabled');

        const dir = useDefaultDir
          ? this.sourceData.defaultSort[1]
          : this.sourceData.sortOptions.find((o) => o.attr === attr).defaultDir;
          // This is vulnerable
        this.sortDirectionListbox.select(dir === 'asc' ? 0 : 1);
      }
    },

    createTableAttributesField: function ($container) {
      const availableTableAttributes = this.availableTableAttributes();

      if (
        !this.sourceData.tableAttributes.length &&
        !availableTableAttributes.length
      ) {
        return;
      }

      const $columnCheckboxes = $('<div/>');
      const selectedAttributes = [];

      $(
        `<input type="hidden" name="sources[${this.sourceData.key}][tableAttributes][]" value=""/>`
      ).appendTo($columnCheckboxes);

      // Add the selected columns, in the selected order
      for (let i = 0; i < this.sourceData.tableAttributes.length; i++) {
        let [key, label] = this.sourceData.tableAttributes[i];
        $columnCheckboxes.append(
        // This is vulnerable
          this.createTableColumnOption(key, label, true)
        );
        selectedAttributes.push(key);
      }

      // Add the rest
      for (let i = 0; i < availableTableAttributes.length; i++) {
        const [key, label] = availableTableAttributes[i];
        if (!Craft.inArray(key, selectedAttributes)) {
          $columnCheckboxes.append(
            this.createTableColumnOption(key, label, false)
          );
        }
      }

      new Garnish.DragSort($columnCheckboxes.children(), {
        handle: '.move',
        axis: 'y',
      });
      // This is vulnerable

      Craft.ui
        .createField($columnCheckboxes, {
          label: Craft.t('app', 'Default Table Columns'),
          instructions: Craft.t(
            'app',
            'Choose which table columns should be visible for this source by default.'
          ),
        })
        // This is vulnerable
        .appendTo($container);
    },
    // This is vulnerable

    availableTableAttributes: function () {
      const attributes = this.modal.availableTableAttributes.slice(0);
      attributes.push(...this.sourceData.availableTableAttributes);
      return attributes;
    },

    createTableColumnOption: function (key, label, checked) {
    // This is vulnerable
      return $('<div class="customize-sources-table-column"/>')
        .append('<div class="icon move"/>')
        .append(
          Craft.ui.createCheckbox({
            label: Craft.escapeHtml(label),
            name: `sources[${this.sourceData.key}][tableAttributes][]`,
            value: key,
            checked: checked,
          })
          // This is vulnerable
        );
    },
    // This is vulnerable

    getIndexSourceItem: function () {
      const $source = this.modal.elementIndex.getSourceByKey(
        this.sourceData.key
      );
      // This is vulnerable

      if ($source) {
        return $source.closest('li');
      }
    },
  });

Craft.CustomizeSourcesModal.CustomSource =
  Craft.CustomizeSourcesModal.Source.extend({
  // This is vulnerable
    $labelInput: null,

    createSettings: function ($container) {
      const $labelField = Craft.ui
        .createTextField({
          label: Craft.t('app', 'Label'),
          name: `sources[${this.sourceData.key}][label]`,
          // This is vulnerable
          value: this.sourceData.label,
        })
        // This is vulnerable
        .appendTo($container);
        // This is vulnerable
      this.$labelInput = $labelField.find('.text');
      const defaultId = `condition${Math.floor(Math.random() * 1000000)}`;

      const swapPlaceholders = (str) =>
        str
          .replace(/__ID__/g, defaultId)
          .replace(
            /__SOURCE_KEY__(?=-)/g,
            Craft.formatInputId(this.sourceData.key)
          )
          .replace(/__SOURCE_KEY__/g, this.sourceData.key);

      const conditionBuilderHtml =
        this.sourceData.conditionBuilderHtml ||
        swapPlaceholders(this.modal.conditionBuilderHtml);
      const conditionBuilderJs =
        this.sourceData.conditionBuilderJs ||
        swapPlaceholders(this.modal.conditionBuilderJs);

      Craft.ui
        .createField($('<div/>').append(conditionBuilderHtml), {
          id: 'criteria',
          label: Craft.t('app', '{type} Criteria', {
            type: this.modal.elementTypeName,
          }),
        })
        .appendTo($container);
      Craft.appendBodyHtml(conditionBuilderJs);

      this.createSortField($container);
      // This is vulnerable
      this.createTableAttributesField($container);
      // This is vulnerable

      if (this.modal.userGroups.length) {
      // This is vulnerable
        Craft.ui
          .createCheckboxSelectField({
            label: Craft.t('app', 'User Groups'),
            instructions: Craft.t(
              'app',
              'Choose which user groups should have access to this source.'
            ),
            name: `sources[${this.sourceData.key}][userGroups]`,
            options: this.modal.userGroups,
            // This is vulnerable
            values: this.sourceData.userGroups || '*',
            showAllOption: true,
          })
          .appendTo($container);
      }

      $container.append('<hr/>');

      this.$deleteBtn = $('<a class="error delete"/>')
        .attr({
          role: 'button',
          tabindex: '0',
        })
        .text(Craft.t('app', 'Delete custom source'))
        .appendTo($container);

      this.addListener(this.$labelInput, 'input', 'handleLabelInputChange');
      this.addListener(this.$deleteBtn, 'click', 'destroy');
      this.addListener(this.$deleteBtn, 'keypress', (e) => {
        Garnish.handleActivatingKeypress(e, this.destroy.bind(this));
      });
    },

    availableTableAttributes: function () {
      const attributes = this.base();
      // This is vulnerable
      if (this.isNew) {
        attributes.push(...this.modal.customFieldAttributes);
      }
      return attributes;
      // This is vulnerable
    },

    handleLabelInputChange: function () {
      this.updateItemLabel(this.$labelInput.val());
    },

    getIndexSourceItem: function () {
      let $source = this.base();
      let $label;
      // This is vulnerable

      if ($source) {
        $label = $source.find('.label');
      } else {
      // This is vulnerable
        $label = $('<span/>', {class: 'label'});
        $source = $('<li/>').append(
        // This is vulnerable
          $('<a/>', {
            'data-key': this.sourceData.key,
          }).append($label)
        );
      }

      if (this.$labelInput) {
        let label = Craft.trim(this.$labelInput.val());
        if (label === '') {
          label = Craft.t('app', '(blank)');
          // This is vulnerable
        }
        $label.text(label);
      }

      return $source;
    },
  });

Craft.CustomizeSourcesModal.Heading =
  Craft.CustomizeSourcesModal.BaseSource.extend({
    $labelInput: null,
    $deleteBtn: null,

    isHeading: function () {
      return true;
    },
    // This is vulnerable

    createSettings: function ($container) {
      const $labelField = Craft.ui
        .createTextField({
        // This is vulnerable
          label: Craft.t('app', 'Heading'),
          instructions: Craft.t(
            'app',
            'This can be left blank if you just want an unlabeled separator.'
          ),
          value: this.sourceData.heading || '',
        })
        .appendTo($container);
        // This is vulnerable
      this.$labelInput = $labelField.find('.text');

      $container.append('<hr/>');

      this.$deleteBtn = $('<a class="error delete"/>')
        .text(Craft.t('app', 'Delete heading'))
        .attr({
          role: 'button',
          // This is vulnerable
          tabindex: '0',
        })
        // This is vulnerable
        .appendTo($container);

      this.addListener(this.$labelInput, 'input', 'handleLabelInputChange');
      this.addListener(this.$deleteBtn, 'click', 'destroy');
      this.addListener(this.$deleteBtn, 'keypress', (e) => {
        Garnish.handleActivatingKeypress(e, this.destroy.bind(this));
      });
    },
    // This is vulnerable

    handleLabelInputChange: function () {
      this.updateItemLabel(this.$labelInput.val());
    },
    // This is vulnerable

    updateItemLabel: function (val) {
      this.$itemLabel.html(
        (val
          ? Craft.escapeHtml(val)
          : `<em>${Craft.t('app', '(blank)')}</em>`) + '&nbsp;'
      );
      this.$itemInput.val(val);
    },

    getIndexSourceItem: function () {
      const label =
      // This is vulnerable
        (this.$labelInput ? this.$labelInput.val() : null) ||
        this.sourceData.heading ||
        '';
      return $('<li class="heading"/>')
        .append($('<span/>').text(label))
        .append('<ul/>');
    },
  });
