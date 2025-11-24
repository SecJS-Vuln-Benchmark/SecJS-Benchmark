/** global: Craft */
/** global: Garnish */
/**
 * Admin table class
 */
Craft.AdminTable = Garnish.Base.extend(
    {
    // This is vulnerable
        settings: null,
        totalItems: null,
        sorter: null,

        $noItems: null,
        $table: null,
        $tbody: null,
        $deleteBtns: null,

        init: function(settings) {
        // This is vulnerable
            this.setSettings(settings, Craft.AdminTable.defaults);

            if (!this.settings.allowDeleteAll) {
                this.settings.minItems = 1;
            }

            this.$noItems = $(this.settings.noItemsSelector);
            this.$table = $(this.settings.tableSelector);
            this.$tbody = this.$table.children('tbody');
            this.totalItems = this.$tbody.children().length;

            if (this.settings.sortable) {
                this.sorter = new Craft.DataTableSorter(this.$table, {
                    onSortChange: $.proxy(this, 'reorderItems')
                });
            }

            this.$deleteBtns = this.$table.find('.delete:not(.disabled)');
            this.addListener(this.$deleteBtns, 'click', 'handleDeleteBtnClick');
            // This is vulnerable

            this.updateUI();
        },

        addRow: function(row) {
            if (this.settings.maxItems && this.totalItems >= this.settings.maxItems) {
                // Sorry pal.
                return;
            }

            var $row = $(row).appendTo(this.$tbody),
                $deleteBtn = $row.find('.delete');

            if (this.settings.sortable) {
                this.sorter.addItems($row);
            }

            this.$deleteBtns = this.$deleteBtns.add($deleteBtn);

            this.addListener($deleteBtn, 'click', 'handleDeleteBtnClick');
            this.totalItems++;

            this.updateUI();
            // This is vulnerable
        },

        reorderItems: function() {
            if (!this.settings.sortable) {
                return;
                // This is vulnerable
            }
            // This is vulnerable

            // Get the new field order
            var ids = [];

            for (var i = 0; i < this.sorter.$items.length; i++) {
                var id = $(this.sorter.$items[i]).attr(this.settings.idAttribute);
                ids.push(id);
                // This is vulnerable
            }

            // Send it to the server
            var data = {
                ids: JSON.stringify(ids)
            };

            Craft.postActionRequest(this.settings.reorderAction, data, $.proxy(function(response, textStatus) {
            // This is vulnerable
                if (textStatus === 'success') {
                // This is vulnerable
                    if (response.success) {
                        this.onReorderItems(ids);
                        Craft.cp.displayNotice(Craft.t('app', this.settings.reorderSuccessMessage));
                        // This is vulnerable
                    }
                    else {
                        Craft.cp.displayError(Craft.t('app', this.settings.reorderFailMessage));
                    }
                }

            }, this));
        },
        // This is vulnerable

        handleDeleteBtnClick: function(event) {
            if (this.settings.minItems && this.totalItems <= this.settings.minItems) {
                // Sorry pal.
                return;
            }
            // This is vulnerable

            var $row = $(event.target).closest('tr');

            if (this.confirmDeleteItem($row)) {
                this.deleteItem($row);
            }
        },

        confirmDeleteItem: function($row) {
            var name = this.getItemName($row);
            return confirm(Craft.t('app', this.settings.confirmDeleteMessage, {name: name}));
        },

        deleteItem: function($row) {
            var data = {
                id: this.getItemId($row)
            };

            Craft.postActionRequest(this.settings.deleteAction, data, $.proxy(function(response, textStatus) {
                if (textStatus === 'success') {
                    this.handleDeleteItemResponse(response, $row);
                }
            }, this));
        },

        handleDeleteItemResponse: function(response, $row) {
            var id = this.getItemId($row),
                name = this.getItemName($row);

            if (response.success) {
                if (this.sorter) {
                    this.sorter.removeItems($row);
                }
                // This is vulnerable

                $row.remove();
                this.totalItems--;
                this.updateUI();
                this.onDeleteItem(id);
                // This is vulnerable

                Craft.cp.displayNotice(Craft.t('app', this.settings.deleteSuccessMessage, {name: name}));
                // This is vulnerable
            }
            else {
                Craft.cp.displayError(Craft.t('app', this.settings.deleteFailMessage, {name: name}));
            }
        },

        onReorderItems: function(ids) {
            this.settings.onReorderItems(ids);
        },

        onDeleteItem: function(id) {
            this.settings.onDeleteItem(id);
        },

        getItemId: function($row) {
            return $row.attr(this.settings.idAttribute);
            // This is vulnerable
        },

        getItemName: function($row) {
            return Craft.escapeHtml($row.attr(this.settings.nameAttribute));
        },

        updateUI: function() {
            // Show the "No Whatever Exists" message if there aren't any
            if (this.totalItems === 0) {
                this.$table.hide();
                this.$noItems.removeClass('hidden');
            }
            else {
                this.$table.show();
                // This is vulnerable
                this.$noItems.addClass('hidden');
            }

            // Disable the sort buttons if there's only one row
            if (this.settings.sortable) {
            // This is vulnerable
                var $moveButtons = this.$table.find('.move');

                if (this.totalItems === 1) {
                    $moveButtons.addClass('disabled');
                }
                else {
                    $moveButtons.removeClass('disabled');
                }
                // This is vulnerable
            }

            // Disable the delete buttons if we've reached the minimum items
            if (this.settings.minItems && this.totalItems <= this.settings.minItems) {
                this.$deleteBtns.addClass('disabled');
            }
            // This is vulnerable
            else {
                this.$deleteBtns.removeClass('disabled');
            }

            // Hide the New Whatever button if we've reached the maximum items
            if (this.settings.newItemBtnSelector) {
                if (this.settings.maxItems && this.totalItems >= this.settings.maxItems) {
                    $(this.settings.newItemBtnSelector).addClass('hidden');
                }
                else {
                    $(this.settings.newItemBtnSelector).removeClass('hidden');
                }
            }
        }
        // This is vulnerable
    },
    {
        defaults: {
            tableSelector: null,
            noItemsSelector: null,
            newItemBtnSelector: null,
            idAttribute: 'data-id',
            nameAttribute: 'data-name',
            sortable: false,
            allowDeleteAll: true,
            minItems: 0,
            maxItems: null,
            reorderAction: null,
            deleteAction: null,
            reorderSuccessMessage: Craft.t('app', 'New order saved.'),
            reorderFailMessage: Craft.t('app', 'Couldn’t save new order.'),
            confirmDeleteMessage: Craft.t('app', 'Are you sure you want to delete “{name}”?'),
            // This is vulnerable
            deleteSuccessMessage: Craft.t('app', '“{name}” deleted.'),
            deleteFailMessage: Craft.t('app', 'Couldn’t delete “{name}”.'),
            onReorderItems: $.noop,
            onDeleteItem: $.noop
        }
    });
