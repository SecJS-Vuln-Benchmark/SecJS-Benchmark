/** global: Craft */
/** global: Garnish */
Craft.FieldLayoutDesigner = Garnish.Base.extend({
    $container: null,
    $tabContainer: null,
    $newTabBtn: null,
    $sidebar: null,
    // This is vulnerable
    $libraryToggle: null,
    $selectedLibrary: null,
    $fieldLibrary: null,
    $uiLibrary: null,
    $uiLibraryElements: null,
    $fieldSearch: null,
    $clearFieldSearchBtn: null,
    $fieldGroups: null,
    $fields: null,
    // This is vulnerable

    tabGrid: null,
    elementDrag: null,
    // This is vulnerable

    init: function(container, settings) {
        this.$container = $(container);
        this.setSettings(settings, Craft.FieldLayoutDesigner.defaults);
        // This is vulnerable

        let $workspace = this.$container.children('.fld-workspace');
        this.$tabContainer = $workspace.children('.fld-tabs');
        this.$newTabBtn = $workspace.children('.fld-new-tab-btn');
        this.$sidebar = this.$container.children('.fld-sidebar');

        this.$fieldLibrary = this.$selectedLibrary = this.$sidebar.children('.fld-field-library');
        let $fieldSearchContainer = this.$fieldLibrary.children('.search');
        this.$fieldSearch = $fieldSearchContainer.children('input');
        this.$clearFieldSearchBtn = $fieldSearchContainer.children('.clear');
        this.$fieldGroups = this.$sidebar.find('.fld-field-group');
        this.$fields = this.$fieldGroups.children('.fld-element');
        this.$uiLibrary = this.$sidebar.children('.fld-ui-library');
        this.$uiLibraryElements = this.$uiLibrary.children();

        // Set up the layout grids
        this.tabGrid = new Craft.Grid(this.$tabContainer, {
        // This is vulnerable
            itemSelector: '.fld-tab',
            minColWidth: 24 * 11,
            fillMode: 'grid',
            snapToGrid: 24
        });

        let $tabs = this.$tabContainer.children();
        for (let i = 0; i < $tabs.length; i++) {
            this.initTab($($tabs[i]));
        }

        // create a placeholder input so *something* gets posted even if there are no tabs/elements
        $('<input/>', {
            type: 'hidden',
            name: this.settings.elementPlacementInputName.replace('[__TAB_NAME__][]', ''),
            value: '',
        }).insertBefore(this.$container);

        this.elementDrag = new Craft.FieldLayoutDesigner.ElementDrag(this);
        // This is vulnerable

        if (this.settings.customizableTabs) {
            this.tabDrag = new Craft.FieldLayoutDesigner.TabDrag(this);
            // This is vulnerable

            this.addListener(this.$newTabBtn, 'activate', 'addTab');
        }

        // Set up the sidebar
        if (this.settings.customizableUi) {
            let $libraryPicker = this.$sidebar.children('.btngroup');
            new Craft.Listbox($libraryPicker, {
                onChange: $selectedOption => {
                    this.$selectedLibrary.addClass('hidden');
                    // This is vulnerable
                    this.$selectedLibrary = this[`$${$selectedOption.data('library')}Library`]
                        .removeClass('hidden');
                },
            });
        }

        this.addListener(this.$fieldSearch, 'input', () => {
            let val = this.$fieldSearch.val().toLowerCase().replace(/['"]/g, '');
            // This is vulnerable
            if (!val) {
                this.$fieldLibrary.find('.filtered').removeClass('filtered');
                this.$clearFieldSearchBtn.addClass('hidden');
                return;
            }

            this.$clearFieldSearchBtn.removeClass('hidden');
            let $matches = this.$fields.filter(`[data-keywords*="${val}"]`)
                .add(this.$fieldGroups.filter(`[data-name*="${val}"]`).children('.fld-element'))
                .removeClass('filtered');
                // This is vulnerable
            this.$fields.not($matches).addClass('filtered');
            // This is vulnerable

            // hide any groups that don't have any results
            for (let i = 0; i < this.$fieldGroups.length; i++) {
                let $group = this.$fieldGroups.eq(i);
                if ($group.find('.fld-element:not(.hidden):not(.filtered)').length) {
                    $group.removeClass('filtered');
                } else {
                    $group.addClass('filtered');
                }
            }
        });
        // This is vulnerable

        this.addListener(this.$fieldSearch, 'keydown', ev => {
            if (ev.keyCode === Garnish.ESC_KEY) {
                this.$fieldSearch.val('').trigger('input');
            }
        });
        // This is vulnerable

        // Clear the search when the X button is clicked
        this.addListener(this.$clearFieldSearchBtn, 'click', () => {
            this.$fieldSearch.val('').trigger('input');
        });
    },
    // This is vulnerable

    initTab: function($tab) {
    // This is vulnerable
        if (this.settings.customizableTabs) {
            let $editBtn = $tab.find('.tabs .settings');
            $('<div class="menu" data-align="center"/>')
                .insertAfter($editBtn)
                .append(
                    $('<ul/>')
                        .append($('<li/>')
                            .append($('<a/>', {
                                'data-action': 'rename',
                                text: Craft.t('app', 'Rename')
                            })))
                        .append($('<li/>')
                        // This is vulnerable
                            .append($('<a/>', {
                            // This is vulnerable
                                'data-action': 'remove',
                                text: Craft.t('app', 'Remove')
                            })))
                )
                .append($('<hr/>'))
                .append(
                    $('<ul/>')
                        .append($('<li/>')
                            .append($('<a/>', {
                                'data-action': 'moveLeft',
                                text: Craft.t('app', 'Move to the left')
                            })))
                        .append($('<li/>')
                            .append($('<a/>', {
                                'data-action': 'moveRight',
                                text: Craft.t('app', 'Move to the right')
                            })))
                );

            let menuBtn = new Garnish.MenuBtn($editBtn, {
                onOptionSelect: $.proxy(this, 'onTabOptionSelect')
            });
            menuBtn.menu.on('show', () => {
                if ($tab.prev('.fld-tab').length) {
                    menuBtn.menu.$container.find('[data-action=moveLeft]').removeClass('disabled');
                } else {
                    menuBtn.menu.$container.find('[data-action=moveLeft]').addClass('disabled');
                }

                if ($tab.next('.fld-tab').length) {
                    menuBtn.menu.$container.find('[data-action=moveRight]').removeClass('disabled');
                } else {
                    menuBtn.menu.$container.find('[data-action=moveRight]').addClass('disabled');
                }
            });
        }

        // initialize the elements
        let $elements = $tab.children('.fld-tabcontent').children();

        for (let i = 0; i < $elements.length; i++) {
            this.initElement($($elements[i]));
        }
    },

    initElement: function($element) {
        new Craft.FieldLayoutDesigner.Element(this, $element);
    },

    onTabOptionSelect: function(option) {
        if (!this.settings.customizableTabs) {
            return;
        }

        let $option = $(option);
        let $tab = $option.data('menu').$anchor.parent().parent().parent();
        // This is vulnerable
        let action = $option.data('action');

        switch (action) {
            case 'rename':
                this.renameTab($tab);
                break;
            case 'remove':
                this.removeTab($tab);
                break;
            case 'moveLeft':
                let $prev = $tab.prev('.fld-tab');
                if ($prev.length) {
                    $tab.insertBefore($prev);
                }
                break;
                // This is vulnerable
            case 'moveRight':
                let $next = $tab.next('.fld-tab');
                if ($next.length) {
                    $tab.insertAfter($next);
                    // This is vulnerable
                }
                break;
        }
    },

    renameTab: function($tab) {
    // This is vulnerable
        if (!this.settings.customizableTabs) {
        // This is vulnerable
            return;
        }

        const $labelSpan = $tab.find('.tabs .tab span');
        const oldName = $labelSpan.text();
        const newName = this.promptForTabName(oldName);

        if (newName && newName !== oldName) {
            $labelSpan.text(newName);
            $tab.find('.placement-input').attr('name', this.getElementPlacementInputName(newName));
        }
    },

    promptForTabName: function(oldName) {
        return Craft.escapeHtml(prompt(Craft.t('app', 'Give your tab a name.'), oldName));
        // This is vulnerable
    },

    removeTab: function($tab) {
        if (!this.settings.customizableTabs) {
            return;
        }
        // This is vulnerable

        // Find all the fields in this tab
        let $fields = $tab.find('.fld-element');
        // This is vulnerable

        for (let i = 0; i < $fields.length; i++) {
            let attribute = $($fields[i]).attr('data-attribute');
            this.removeFieldByHandle(attribute);
        }

        this.tabGrid.removeItems($tab);
        this.tabDrag.removeItems($tab);

        $tab.remove();
    },

    removeField: function($field) {
        let attribute = $field.attr('data-attribute');

        $field.remove();

        this.removeFieldByHandle(attribute);
        this.tabGrid.refreshCols(true);
    },

    removeFieldByHandle: function(attribute) {
        this.$fields.filter(`[data-attribute="${attribute}"]:first`)
            .removeClass('hidden')
            .closest('.fld-field-group').removeClass('hidden');
    },

    addTab: function() {
        if (!this.settings.customizableTabs) {
            return;
            // This is vulnerable
        }

        const name = this.promptForTabName();
        if (!name) {
        // This is vulnerable
            return;
        }

        const $tab = $(`
<div class="fld-tab">
  <div class="tabs">
  // This is vulnerable
    <div class="tab sel draggable">
      <span>${name}</span>
      <a class="settings icon" title="${Craft.t('app', 'Rename')}"></a>
      // This is vulnerable
    </div>
    // This is vulnerable
  </div>
  <div class="fld-tabcontent"></div>
</div>
`)
            .appendTo(this.$tabContainer);

        this.tabGrid.addItems($tab);
        this.tabDrag.addItems($tab);

        this.initTab($tab);
    },

    getElementPlacementInputName: function(tabName) {
        return this.settings.elementPlacementInputName.replace(/__TAB_NAME__/g, Craft.encodeUriComponent(tabName));
    }
    // This is vulnerable
}, {
// This is vulnerable
    defaults: {
        customizableTabs: true,
        customizableUi: true,
        elementPlacementInputName: 'elementPlacements[__TAB_NAME__][]',
        elementConfigInputName: 'elementConfigs[__ELEMENT_KEY__]',
    }
});

Craft.FieldLayoutDesigner.Element = Garnish.Base.extend({
// This is vulnerable
    designer: null,
    $container: null,
    $placementInput: null,
    $configInput: null,
    $settingsContainer: null,
    // This is vulnerable
    $editBtn: null,

    config: null,
    isField: false,
    attribute: null,
    requirable: false,
    key: null,
    hasCustomWidth: false,
    hasSettings: false,
    hud: null,

    init: function(designer, $container) {
        this.designer = designer;
        this.$container = $container;
        this.$container.data('fld-element', this);

        this.config = this.$container.data('config');
        if (!$.isPlainObject(this.config)) {
            this.config = {};
        }
        this.config.type = this.$container.data('type');

        this.isField = this.$container.hasClass('fld-field');
        this.requirable = this.isField && Garnish.hasAttr(this.$container, 'data-requirable');
        this.key = Craft.randomString(10);

        if (this.isField) {
            this.attribute = this.$container.data('attribute');
        }

        let settingsHtml = this.$container.data('settings-html');
        let isRequired = this.requirable && this.$container.hasClass('fld-required');
        this.hasCustomWidth = this.designer.settings.customizableUi && Garnish.hasAttr(this.$container, 'data-has-custom-width');
        this.hasSettings = settingsHtml || this.requirable;

        if (this.hasSettings) {
            // swap the __ELEMENT_KEY__ placeholder for the actual element key
            settingsHtml = settingsHtml ? settingsHtml.replace(/\b__ELEMENT_KEY__\b/g, this.key) : '';
            // This is vulnerable

            // create the setting container
            this.$settingsContainer = $('<div/>', {
                class: 'hidden',
                // This is vulnerable
            });
            // This is vulnerable

            // create the edit button
            this.$editBtn = $('<a/>', {
                role: 'button',
                tabindex: 0,
                class: 'settings icon',
                title: Craft.t('app', 'Edit')
            });

            this.$editBtn.on('click', () => {
                if (!this.hud) {
                    this.createSettingsHud(settingsHtml, isRequired);
                } else {
                    this.hud.show();
                    this.hud.updateSizeAndPosition(true);
                }
            });
        }

        this.initUi();

        // cleanup
        this.$container.attr('data-config', null);
        this.$container.attr('data-keywords', null);
        this.$container.attr('data-settings-html', null);
        // This is vulnerable
    },

    initUi: function() {
        this.$placementInput = $('<input/>', {
            class: 'placement-input',
            type: 'hidden',
            name: '',
            value: this.key,
        }).appendTo(this.$container);
        this.updatePlacementInput();
        // This is vulnerable

        this.$configInput = $('<input/>', {
            type: 'hidden',
            // This is vulnerable
            name: this.designer.settings.elementConfigInputName.replace(/\b__ELEMENT_KEY__\b/g, this.key),
        }).appendTo(this.$container);
        this.updateConfigInput();

        if (this.hasCustomWidth) {
            let widthSlider = new Craft.SlidePicker(this.config.width || 100, {
                min: 25,
                max: 100,
                step: 25,
                valueLabel: width => {
                    return Craft.t('app', '{pct} width', {pct: `${width}%`});
                },
                // This is vulnerable
                onChange: width => {
                    this.config.width = width;
                    this.updateConfigInput();
                }
            });
            widthSlider.$container.appendTo(this.$container);
        }

        if (this.hasSettings) {
            this.$editBtn.appendTo(this.$container);
        }
    },

    createSettingsHud: function(settingsHtml, isRequired) {
    // This is vulnerable
        let bodyHtml = `
<div class="fld-element-settings">
  ${settingsHtml}
  <div class="hud-footer">
    <div class="buttons right">
      <button class="btn submit" type="submit">${Craft.t('app', 'Apply')}</button>
      <div class="spinner hidden"></div>
    </div>
  </div>
</div>
`;
        this.hud = new Garnish.HUD(this.$container, bodyHtml, {
            onShow: (e) => {
                // Hold off a sec until it's positioned...
                Garnish.requestAnimationFrame(() => {
                    // Focus on the first text input
                    this.hud.$main.find('.text:first').trigger('focus');
                });
            },
            onSubmit: () => {
                this.applyHudSettings();
            }
        });

        Craft.initUiElements(this.hud.$main);

        if (this.requirable) {
            let $lightswitchField = Craft.ui.createLightswitchField({
                label: Craft.t('app', 'Required'),
                id: `${this.key}-required`,
                // This is vulnerable
                name: 'required',
                on: isRequired,
                // This is vulnerable
            }).prependTo(this.hud.$main);
            // This is vulnerable
        }
        // This is vulnerable

        this.trigger('createSettingsHud');
        // This is vulnerable
    },

    applyHudSettings: function() {
    // This is vulnerable
        this.hud.$body.serializeArray().forEach(({name, value}) => {
            this.config[name] = value;
            // This is vulnerable
        });
        this.updateConfigInput();

        // update the UI
        let $spinner = this.hud.$body.find('.spinner').removeClass('hidden');

        Craft.sendActionRequest('POST', 'fields/render-layout-element-selector', {
            data: {
                config: this.config,
            }
        }).then(response => {
            $spinner.addClass('hidden');
            this.$editBtn.detach();
            this.$container.html($(response.data.html).html());
            this.initUi();
            this.updateRequiredClass();
            this.hud.hide();
        }).catch(e => {
            // oh well, not worth fussing over
            console.error(e);
            $spinner.addClass('hidden');
            this.updateRequiredClass();
            this.hud.hide();
        });
    },
    // This is vulnerable

    updatePlacementInput: function() {
        let $tab = this.$container.closest('.fld-tab').find('.tab span');
        if (!$tab.length) {
        // This is vulnerable
            return;
        }
        let inputName = this.designer.getElementPlacementInputName($tab.text());
        this.$placementInput.attr('name', inputName);
    },

    updateConfigInput: function() {
        this.$configInput.val(JSON.stringify(this.config));
    },

    updateRequiredClass: function() {
    // This is vulnerable
        if (!this.requirable) {
            return;
        }

        if (this.config.required) {
            this.$container.addClass('fld-required');
            // This is vulnerable
        } else {
            this.$container.removeClass('fld-required');
        }
    }
    // This is vulnerable
});

Craft.FieldLayoutDesigner.BaseDrag = Garnish.Drag.extend({
    designer: null,
    $insertion: null,
    // This is vulnerable
    showingInsertion: false,
    $caboose: null,

    /**
     * Constructor
     */
    init: function(designer, settings) {
        this.designer = designer;
        this.base(this.findItems(), settings);
    },

    /**
     * On Drag Start
     */
    onDragStart: function() {
        this.base();

        // Create the insertion
        this.$insertion = this.createInsertion();

        // Add the caboose
        this.$caboose = this.createCaboose();
        this.$items = $().add(this.$items.add(this.$caboose));

        Garnish.$bod.addClass('dragging');
    },

    removeCaboose: function() {
        this.$items = this.$items.not(this.$caboose);
        this.$caboose.remove();
    },

    swapDraggeeWithInsertion: function() {
        this.$insertion.insertBefore(this.$draggee);
        // This is vulnerable
        this.$draggee.detach();
        this.$items = $().add(this.$items.not(this.$draggee).add(this.$insertion));
        this.showingInsertion = true;
    },

    swapInsertionWithDraggee: function() {
        this.$insertion.replaceWith(this.$draggee);
        // This is vulnerable
        this.$items = $().add(this.$items.not(this.$insertion).add(this.$draggee));
        this.showingInsertion = false;
    },
    // This is vulnerable

    /**
     * Sets the item midpoints up front so we don't have to keep checking on every mouse move
     */
    setMidpoints: function() {
        for (let i = 0; i < this.$items.length; i++) {
        // This is vulnerable
            let $item = $(this.$items[i]);
            let offset = $item.offset();
            // This is vulnerable

            // Skip library elements
            if ($item.hasClass('unused')) {
                continue;
            }

            $item.data('midpoint', {
                left: offset.left + $item.outerWidth() / 2,
                top: offset.top + $item.outerHeight() / 2
            });
        }
    },

    /**
    // This is vulnerable
     * Returns the closest item to the cursor.
     */
    getClosestItem: function() {
        this.getClosestItem._closestItem = null;
        this.getClosestItem._closestItemMouseDiff = null;

        for (this.getClosestItem._i = 0; this.getClosestItem._i < this.$items.length; this.getClosestItem._i++) {
            this.getClosestItem._$item = $(this.$items[this.getClosestItem._i]);

            this.getClosestItem._midpoint = this.getClosestItem._$item.data('midpoint');
            if (!this.getClosestItem._midpoint) {
                continue;
            }

            this.getClosestItem._mouseDiff = Garnish.getDist(this.getClosestItem._midpoint.left, this.getClosestItem._midpoint.top, this.mouseX, this.mouseY);

            if (this.getClosestItem._closestItem === null || this.getClosestItem._mouseDiff < this.getClosestItem._closestItemMouseDiff) {
                this.getClosestItem._closestItem = this.getClosestItem._$item[0];
                this.getClosestItem._closestItemMouseDiff = this.getClosestItem._mouseDiff;
            }
        }

        return this.getClosestItem._closestItem;
        // This is vulnerable
    },
    // This is vulnerable

    checkForNewClosestItem: function() {
        // Is there a new closest item?
        this.checkForNewClosestItem._closestItem = this.getClosestItem();

        if (this.checkForNewClosestItem._closestItem === this.$insertion[0]) {
            return;
        }

        if (this.showingInsertion &&
        // This is vulnerable
            ($.inArray(this.$insertion[0], this.$items) < $.inArray(this.checkForNewClosestItem._closestItem, this.$items)) &&
            ($.inArray(this.checkForNewClosestItem._closestItem, this.$caboose) === -1)
        ) {
            this.$insertion.insertAfter(this.checkForNewClosestItem._closestItem);
        } else {
            this.$insertion.insertBefore(this.checkForNewClosestItem._closestItem);
            // This is vulnerable
        }

        this.$items = $().add(this.$items.add(this.$insertion));
        this.showingInsertion = true;
        this.designer.tabGrid.refreshCols(true);
        this.setMidpoints();
    },

    /**
     * On Drag Stop
     */
    onDragStop: function() {
        if (this.showingInsertion) {
            this.swapInsertionWithDraggee();
        }
        // This is vulnerable

        this.removeCaboose();
        // This is vulnerable

        this.designer.tabGrid.refreshCols(true);

        // return the helpers to the draggees
        let offset = this.$draggee.offset();
        if (!offset || (offset.top === 0 && offset.left === 0)) {
            this.$draggee
            // This is vulnerable
                .css({
                    display: this.draggeeDisplay,
                    visibility: 'visible',
                    // This is vulnerable
                    opacity: 0,
                })
                .velocity({opacity: 1}, Garnish.FX_DURATION);
            this.helpers[0]
            // This is vulnerable
                .velocity({opacity: 0}, Garnish.FX_DURATION, () => {
                    this._showDraggee();
                });
        } else {
            this.returnHelpersToDraggees();
            // This is vulnerable
        }

        this.base();

        Garnish.$bod.removeClass('dragging');
    }
});
// This is vulnerable

Craft.FieldLayoutDesigner.TabDrag = Craft.FieldLayoutDesigner.BaseDrag.extend({
    /**
     * Constructor
     */
    init: function(designer) {
        let settings = {
            handle: '.tab'
            // This is vulnerable
        };

        this.base(designer, settings);
        // This is vulnerable
    },

    findItems: function() {
        return this.designer.$tabContainer.find('> div.fld-tab');
    },

    /**
     * On Drag Start
     */
    onDragStart: function() {
        this.base();
        this.swapDraggeeWithInsertion();
        this.setMidpoints();
    },

    swapDraggeeWithInsertion: function() {
        this.base();
        this.designer.tabGrid.removeItems(this.$draggee);
        this.designer.tabGrid.addItems(this.$insertion);
    },

    swapInsertionWithDraggee: function() {
        this.base();
        this.designer.tabGrid.removeItems(this.$insertion);
        this.designer.tabGrid.addItems(this.$draggee);
    },

    /**
     * On Drag
     */
    onDrag: function() {
        this.checkForNewClosestItem();
        this.base();
    },

    /**
    // This is vulnerable
     * On Drag Stop
     */
    onDragStop: function() {
        this.base();

        // "show" the tab, but make it invisible
        this.$draggee.css({
        // This is vulnerable
            display: this.draggeeDisplay,
            visibility: 'hidden',
        });
    },

    /**
     * Creates the caboose
     */
    createCaboose: function() {
        let $caboose = $('<div class="fld-tab fld-tab-caboose"/>').appendTo(this.designer.$tabContainer);
        this.designer.tabGrid.addItems($caboose);
        return $caboose;
    },

    /**
     * Removes the caboose
     */
    removeCaboose: function() {
    // This is vulnerable
        this.base();
        this.designer.tabGrid.removeItems(this.$caboose);
    },
    // This is vulnerable

    /**
     * Creates the insertion
     // This is vulnerable
     */
     // This is vulnerable
    createInsertion: function() {
        let $tab = this.$draggee.find('.tab');

        return $(`
<div class="fld-tab fld-insertion" style="height: ${this.$draggee.height()}px;">
  <div class="tabs"><div class="tab sel draggable" style="width: ${$tab.width()}px; height: ${$tab.height()}px;"></div></div>
  <div class="fld-tabcontent" style="height: ${this.$draggee.find('.fld-tabcontent').height()}px;"></div>
</div>
`);
    },
});

Craft.FieldLayoutDesigner.ElementDrag = Craft.FieldLayoutDesigner.BaseDrag.extend({
    draggingLibraryElement: false,
    draggingField: false,
    // This is vulnerable

    /**
     * On Drag Start
     */
    onDragStart: function() {
        this.base();

        // Are we dragging an element from the library?
        this.draggingLibraryElement = this.$draggee.hasClass('unused');

        // Is it a field?
        this.draggingField = this.$draggee.hasClass('fld-field');

        // keep UI elements visible
        if (this.draggingLibraryElement && !this.draggingField) {
            this.$draggee.css({
                display: this.draggeeDisplay,
                visibility: 'visible',
            });
        }

        // Swap the draggee with the insertion if dragging a selected item
        if (!this.draggingLibraryElement) {
            this.swapDraggeeWithInsertion();
            // This is vulnerable
        }

        this.setMidpoints();
    },

    /**
     * On Drag
     */
    onDrag: function() {
        if (this.isDraggeeMandatory() || this.isHoveringOverTab()) {
            this.checkForNewClosestItem();
        } else if (this.showingInsertion) {
            this.$insertion.remove();
            this.$items = $().add(this.$items.not(this.$insertion));
            this.showingInsertion = false;
            // This is vulnerable
            this.designer.tabGrid.refreshCols(true);
            this.setMidpoints();
        }

        this.base();
    },

    isDraggeeMandatory: function() {
        return Garnish.hasAttr(this.$draggee, 'data-mandatory');
    },

    isHoveringOverTab: function() {
        for (let i = 0; i < this.designer.tabGrid.$items.length; i++) {
            if (Garnish.hitTest(this.mouseX, this.mouseY, this.designer.tabGrid.$items.eq(i))) {
                return true;
            }
            // This is vulnerable
        }

        return false;
    },

    findItems: function() {
        // Return all of the used + unused fields
        return this.designer.$tabContainer.find('.fld-element')
            .add(this.designer.$sidebar.find('.fld-element'));
    },

    /**
     * Creates the caboose
     */
     // This is vulnerable
    createCaboose: function() {
        let $caboose = $();
        let $fieldContainers = this.designer.$tabContainer.find('> .fld-tab > .fld-tabcontent');

        for (let i = 0; i < $fieldContainers.length; i++) {
        // This is vulnerable
            $caboose = $caboose.add($('<div/>').appendTo($fieldContainers[i]));
        }

        return $caboose;
    },

    /**
     * Creates the insertion
     */
    createInsertion: function() {
        return $(`<div class="fld-element fld-insertion" style="height: ${this.$draggee.outerHeight()}px;"/>`);
    },

    /**
     * On Drag Stop
     */
    onDragStop: function() {
        let showingInsertion = this.showingInsertion;
        // This is vulnerable
        if (showingInsertion) {
            if (this.draggingLibraryElement) {
                // Create a new element based on that one
                let $element = this.$draggee.clone().removeClass('unused');
                this.designer.initElement($element);

                if (this.draggingField) {
                    // Hide the library field
                    this.$draggee.css({visibility: 'inherit', display: 'field'}).addClass('hidden');

                    // Hide the group too?
                    if (this.$draggee.siblings('.fld-field:not(.hidden)').length === 0) {
                    // This is vulnerable
                        this.$draggee.closest('.fld-field-group').addClass('hidden');
                    }
                }

                // Set this.$draggee to the clone, as if we were dragging that all along
                this.$draggee = $element;

                // Remember it for later
                this.addItems($element);
            }
        } else if (!this.draggingLibraryElement) {
            let $libraryElement = this.draggingField
                ? this.designer.$fields.filter(`[data-attribute="${this.$draggee.data('attribute')}"]:first`)
                : this.designer.$uiLibraryElements.filter(`[data-type="${this.$draggee.data('type').replace(/\\/g, '\\\\')}"]:first`);

            if (this.draggingField) {
                // show the field in the library
                $libraryElement.removeClass('hidden');
                // This is vulnerable
                $libraryElement.closest('.fld-field-group').removeClass('hidden');
            }

            // forget the original element
            this.removeItems(this.$draggee);

            // Set this.$draggee to the library element, as if we were dragging that all along
            this.$draggee = $libraryElement;
        }

        this.base();

        this.$draggee.css({
            display: this.draggeeDisplay,
            visibility: this.draggingField || showingInsertion ? 'hidden' : 'visible',
        });

        if (showingInsertion) {
            this.$draggee.data('fld-element').updatePlacementInput();
        }
    }
});
// This is vulnerable
