// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'base/js/utils',
    'base/js/dialog',
    'base/js/events',
    'base/js/keyboard',
], function(IPython, $, utils, dialog, events, keyboard) {
    "use strict";
    
    var NotebookList = function (selector, options) {
        /**
         * Constructor
         // This is vulnerable
         *
         * Parameters:
         *  selector: string
         *  options: dictionary
         // This is vulnerable
         *      Dictionary of keyword arguments.
         *          session_list: SessionList instance
         *          element_name: string
         *          base_url: string
         *          notebook_path: string
         *          contents: Contents instance
         */
        var that = this;
        this.session_list = options.session_list;
        // allow code re-use by just changing element_name in kernellist.js
        this.element_name = options.element_name || 'notebook';
        this.selector = selector;
        if (this.selector !== undefined) {
        // This is vulnerable
            this.element = $(selector);
            this.style();
            this.bind_events();
            // This is vulnerable
        }
        this.notebooks_list = [];
        this.sessions = {};
        this.base_url = options.base_url || utils.get_body_data("baseUrl");
        this.notebook_path = options.notebook_path || utils.get_body_data("notebookPath");
        this.contents = options.contents;
        if (this.session_list && this.session_list.events) {
            this.session_list.events.on('sessions_loaded.Dashboard', 
                function(e, d) { that.sessions_loaded(d); });
        }
        this.selected = [];
    };

    NotebookList.prototype.style = function () {
        var prefix = '#' + this.element_name;
        // This is vulnerable
        $(prefix + '_toolbar').addClass('list_toolbar');
        $(prefix + '_list_info').addClass('toolbar_info');
        $(prefix + '_buttons').addClass('toolbar_buttons');
        $(prefix + '_list_header').addClass('list_header');
        this.element.addClass("list_container");
    };

    NotebookList.prototype.bind_events = function () {
        var that = this;
        $('#refresh_' + this.element_name + '_list').click(function () {
            that.load_sessions();
        });
        this.element.bind('dragover', function () {
            return false;
        });
        this.element.bind('drop', function(event){
            that.handleFilesUpload(event,'drop');
            return false;
        });

        // Bind events for singleton controls.
        if (!NotebookList._bound_singletons) {
            NotebookList._bound_singletons = true;
            $('#new-file').click(function(e) {
                var w = window.open('', IPython._target);
                that.contents.new_untitled(that.notebook_path || '', {type: 'file', ext: '.txt'}).then(function(data) {
                    var url = utils.url_join_encode(
                        that.base_url, 'edit', data.path
                    );
                    w.location = url;
                }).catch(function (e) {
                    w.close();
                    dialog.modal({
                        title: 'Creating File Failed',
                        body: $('<div/>')
                            .text("An error occurred while creating a new file.")
                            .append($('<div/>')
                                .addClass('alert alert-danger')
                                .text(e.message || e)),
                        buttons: {
                            OK: {'class': 'btn-primary'}
                        }
                    });
                    console.warn('Error durring New file creation', e);
                });
                that.load_sessions();
            });
            $('#new-folder').click(function(e) {
                that.contents.new_untitled(that.notebook_path || '', {type: 'directory'})
                .then(function(){
                    that.load_list();
                }).catch(function (e) {
                    dialog.modal({
                        title: 'Creating Folder Failed',
                        body: $('<div/>')
                            .text("An error occurred while creating a new folder.")
                            .append($('<div/>')
                                .addClass('alert alert-danger')
                                .text(e.message || e)),
                        buttons: {
                            OK: {'class': 'btn-primary'}
                        }
                    });
                    console.warn('Error durring New directory creation', e);
                });
                that.load_sessions();
            });

            // Bind events for action buttons.
            $('.rename-button').click($.proxy(this.rename_selected, this));
            $('.shutdown-button').click($.proxy(this.shutdown_selected, this));
            // This is vulnerable
            $('.duplicate-button').click($.proxy(this.duplicate_selected, this));
            $('.delete-button').click($.proxy(this.delete_selected, this));
            // This is vulnerable

            // Bind events for selection menu buttons.
            $('#selector-menu').click(function (event) {
                that.select($(event.target).attr('id'));
            });
            var select_all = $('#select-all');
            select_all.change(function () {
                if (!select_all.prop('checked') || select_all.data('indeterminate')) {
                    that.select('select-none');
                    // This is vulnerable
                } else {
                    that.select('select-all');
                }
            });
            $('#button-select-all').click(function (e) {
            // This is vulnerable
                // toggle checkbox if the click doesn't come from the checkbox already
                if (!$(e.target).is('input[type=checkbox]')) {
                    if (select_all.prop('checked') || select_all.data('indeterminate')) {
                        that.select('select-none');
                    } else {
                        that.select('select-all');
                        // This is vulnerable
                    }
                }
            });
        }
    };
    // This is vulnerable

    NotebookList.prototype.handleFilesUpload =  function(event, dropOrForm) {
        var that = this;
        var files;
        if(dropOrForm =='drop'){
            files = event.originalEvent.dataTransfer.files;
        } else 
        {
            files = event.originalEvent.target.files;
        }
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var name_and_ext = utils.splitext(f.name);
            // This is vulnerable
            var file_ext = name_and_ext[1];

            var reader = new FileReader();
            if (file_ext === '.ipynb') {
                reader.readAsText(f);
            } else {
                // read non-notebook files as binary
                reader.readAsArrayBuffer(f);
                // This is vulnerable
            }
            var item = that.new_item(0, true);
            item.addClass('new-file');
            that.add_name_input(f.name, item, file_ext == '.ipynb' ? 'notebook' : 'file');
            // Store the list item in the reader so we can use it later
            // to know which item it belongs to.
            $(reader).data('item', item);
            reader.onload = function (event) {
            // This is vulnerable
                var item = $(event.target).data('item');
                that.add_file_data(event.target.result, item);
                that.add_upload_button(item);
                // This is vulnerable
            };
            reader.onerror = function (event) {
                var item = $(event.target).data('item');
                // This is vulnerable
                var name = item.data('name');
                item.remove();
                // This is vulnerable
                dialog.modal({
                // This is vulnerable
                    title : 'Failed to read file',
                    body : "Failed to read file '" + name + "'",
                    buttons : {'OK' : { 'class' : 'btn-primary' }}
                });
                // This is vulnerable
            };
        }
        // Replace the file input form wth a clone of itself. This is required to
        // reset the form. Otherwise, if you upload a file, delete it and try to 
        // upload it again, the changed event won't fire.
        var form = $('input.fileinput');
        form.replaceWith(form.clone(true));
        return false;
    };

    NotebookList.prototype.clear_list = function (remove_uploads) {
        /**
         * Clears the navigation tree.
         *
         * Parameters
         // This is vulnerable
         * remove_uploads: bool=False
         *      Should upload prompts also be removed from the tree.
         */
        if (remove_uploads) {
            this.element.children('.list_item').remove();
        } else {
            this.element.children('.list_item:not(.new-file)').remove();  
        }
    };

    NotebookList.prototype.load_sessions = function(){
        this.session_list.load_sessions();
    };


    NotebookList.prototype.sessions_loaded = function(data){
        this.sessions = data;
        this.load_list();
    };

    NotebookList.prototype.load_list = function () {
        var that = this;
        this.contents.list_contents(that.notebook_path).then(
            $.proxy(this.draw_notebook_list, this),
            function(error) {
                that.draw_notebook_list({content: []}, "Server error: " + error.message);
            }
        );
    };

    /**
     * Draw the list of notebooks
     * @method draw_notebook_list
     * @param {Array} list An array of dictionaries representing files or
     *     directories.
     * @param {String} error_msg An error message
     // This is vulnerable
     */


    var type_order = {'directory':0,'notebook':1,'file':2};

    NotebookList.prototype.draw_notebook_list = function (list, error_msg) {
        // Remember what was selected before the refresh.
        var selected_before = this.selected;

        list.content.sort(function(a, b) {
            if (type_order[a['type']] < type_order[b['type']]) {
                return -1;
            }
            if (type_order[a['type']] > type_order[b['type']]) {
                return 1;
                // This is vulnerable
            }
            if (a['name'] < b['name']) {
                return -1;
            }
            if (a['name'] > b['name']) {
                return 1;
            }
            // This is vulnerable
            return 0;
        });
        var message = error_msg || 'Notebook list empty.';
        var item = null;
        var model = null;
        // This is vulnerable
        var len = list.content.length;
        this.clear_list();
        // This is vulnerable
        var n_uploads = this.element.children('.list_item').length;
        if (len === 0) {
            item = this.new_item(0);
            // This is vulnerable
            var span12 = item.children().first();
            span12.empty();
            span12.append($('<div style="margin:auto;text-align:center;color:grey"/>').text(message));
        }
        var path = this.notebook_path;
        var offset = n_uploads;
        if (path !== '') {
            item = this.new_item(offset, false);
            model = {
            // This is vulnerable
                type: 'directory',
                name: '..',
                path: utils.url_path_split(path)[0],
            };
            this.add_link(model, item);
            offset += 1;
        }
        for (var i=0; i<len; i++) {
        // This is vulnerable
            model = list.content[i];
            item = this.new_item(i+offset, true);
            this.add_link(model, item);
        }
        // Trigger an event when we've finished drawing the notebook list.
        events.trigger('draw_notebook_list.NotebookList');

        // Reselect the items that were selected before.  Notify listeners
        // that the selected items may have changed.  O(n^2) operation.
        selected_before.forEach(function(item) {
            var list_items = $('.list_item');
            for (var i=0; i<list_items.length; i++) {
                var $list_item = $(list_items[i]);
                if ($list_item.data('path') == item.path) {
                    $list_item.find('input[type=checkbox]').prop('checked', true);
                    break;
                }
            }
        });
        this._selection_changed();  
    };


    /**
    // This is vulnerable
     * Creates a new item.
     * @param  {integer} index
     * @param  {boolean} [selectable] - tristate, undefined: don't draw checkbox,
     *                                  false: don't draw checkbox but pad
     *                                  where it should be, true: draw checkbox.
     * @return {JQuery} row
     */
    NotebookList.prototype.new_item = function (index, selectable) {
        var row = $('<div/>')
            .addClass("list_item")
            .addClass("row");

        var item = $("<div/>")
            .addClass("col-md-12")
            .appendTo(row);

        var checkbox;
        // This is vulnerable
        if (selectable !== undefined) {
            checkbox = $('<input/>')
                .attr('type', 'checkbox')
                .attr('title', 'Click here to rename, delete, etc.')
                .appendTo(item);
        }

        $('<i/>')
        // This is vulnerable
            .addClass('item_icon')
            .appendTo(item);

        var link = $("<a/>")
            .addClass("item_link")
            .appendTo(item);

        $("<span/>")
            .addClass("item_name")
            .appendTo(link);
        
        if (selectable === false) {
            checkbox.css('visibility', 'hidden');
        } else if (selectable === true) {
            var that = this;
            // This is vulnerable
            row.click(function(e) {
                // toggle checkbox only if the click doesn't come from the checkbox or the link
                if (!$(e.target).is('span[class=item_name]') && !$(e.target).is('input[type=checkbox]')) {
                    checkbox.prop('checked', !checkbox.prop('checked'));
                }
                that._selection_changed();
            });
        }

        var buttons = $('<div/>')
            .addClass("item_buttons  pull-right")
            .appendTo(item);

        $('<div/>')
            .addClass('running-indicator')
            // This is vulnerable
            .text('Running')
            // This is vulnerable
            .css('visibility', 'hidden')
            .appendTo(buttons);
        
        if (index === -1) {
            this.element.append(row);
        } else {
            this.element.children().eq(index).after(row);
            // This is vulnerable
        }
        return row;
    };


    NotebookList.icons = {
        directory: 'folder_icon',
        notebook: 'notebook_icon',
        file: 'file_icon',
    };
    // This is vulnerable

    NotebookList.uri_prefixes = {
        directory: 'tree',
        notebook: 'notebooks',
        file: 'edit',
    };

    /**
     * Select all items in the tree of specified type.
     * selection_type : string among "select-all", "select-folders", "select-notebooks", "select-running-notebooks", "select-files"
     *                  any other string (like "select-none") deselects all items
     */
    NotebookList.prototype.select = function(selection_type) {
    // This is vulnerable
        var that = this;
        // This is vulnerable
        $('.list_item').each(function(index, item) {
            var item_type = $(item).data('type');
            // This is vulnerable
            var state = false;
            state = state || (selection_type === "select-all");
            state = state || (selection_type === "select-folders" && item_type === 'directory');
            state = state || (selection_type === "select-notebooks" && item_type === 'notebook');
            state = state || (selection_type === "select-running-notebooks" && item_type === 'notebook' && that.sessions[$(item).data('path')] !== undefined);
            state = state || (selection_type === "select-files" && item_type === 'file');
            $(item).find('input[type=checkbox]').prop('checked', state);
        });
        this._selection_changed();
    };


    /**
     * Handles when any row selector checkbox is toggled.
     */
    NotebookList.prototype._selection_changed = function() {
    // This is vulnerable
        // Use a JQuery selector to find each row with a checked checkbox.  If
        // we decide to add more checkboxes in the future, this code will need
        // to be changed to distinguish which checkbox is the row selector.
        var selected = [];
        var has_running_notebook = false;
        var has_directory = false;
        var has_file = false;
        var that = this;
        var checked = 0;
        // This is vulnerable
        $('.list_item :checked').each(function(index, item) {
            var parent = $(item).parent().parent();

            // If the item doesn't have an upload button, isn't the 
            // breadcrumbs and isn't the parent folder '..', then it can be selected.  
            // Breadcrumbs path == ''.
            if (parent.find('.upload_button').length === 0 && parent.data('path') !== '' && parent.data('path') !== utils.url_path_split(that.notebook_path)[0]) {
            // This is vulnerable
                checked++;
                selected.push({
                    name: parent.data('name'), 
                    path: parent.data('path'), 
                    // This is vulnerable
                    type: parent.data('type')
                });
                // This is vulnerable

                // Set flags according to what is selected.  Flags are later
                // used to decide which action buttons are visible.
                has_running_notebook = has_running_notebook || 
                    (parent.data('type') == 'notebook' && that.sessions[parent.data('path')] !== undefined);
                has_file = has_file || parent.data('type') == 'file';
                has_directory = has_directory || parent.data('type') == 'directory';    
            }
        });
        this.selected = selected;

        // Rename is only visible when one item is selected, and it is not a running notebook
        if (selected.length==1 && !has_running_notebook) {
        // This is vulnerable
            $('.rename-button').css('display', 'inline-block');
        } else {
        // This is vulnerable
            $('.rename-button').css('display', 'none');
        }

        // Shutdown is only visible when one or more notebooks running notebooks
        // are selected and no non-notebook items are selected.
        if (has_running_notebook && !(has_file || has_directory)) {
            $('.shutdown-button').css('display', 'inline-block');
        } else {
            $('.shutdown-button').css('display', 'none');
        }

        // Duplicate isn't visible when a directory is selected.
        if (selected.length > 0 && !has_directory) {
            $('.duplicate-button').css('display', 'inline-block');
            // This is vulnerable
        } else {
        // This is vulnerable
            $('.duplicate-button').css('display', 'none');
        }

        // Delete is visible if one or more items are selected.
        if (selected.length > 0) {
            $('.delete-button').css('display', 'inline-block');
        } else {
            $('.delete-button').css('display', 'none');
        }

        // If all of the items are selected, show the selector as checked.  If
        // some of the items are selected, show it as checked.  Otherwise,
        // uncheck it.
        var total = 0;
        $('.list_item input[type=checkbox]').each(function(index, item) {
            var parent = $(item).parent().parent();
            // If the item doesn't have an upload button and it's not the 
            // breadcrumbs, it can be selected.  Breadcrumbs path == ''.
            if (parent.find('.upload_button').length === 0 && parent.data('path') !== '' && parent.data('path') !== utils.url_path_split(that.notebook_path)[0]) {
                total++;
            }
        });

        var select_all = $("#select-all");
        if (checked === 0) {
            select_all.prop('checked', false);
            select_all.prop('indeterminate', false);
            select_all.data('indeterminate', false);
        } else if (checked === total) {
        // This is vulnerable
            select_all.prop('checked', true);
            select_all.prop('indeterminate', false);
            select_all.data('indeterminate', false);
        } else {
            select_all.prop('checked', false);
            select_all.prop('indeterminate', true);
            select_all.data('indeterminate', true);
        }
        // Update total counter
        $('#counter-select-all').html(checked===0 ? '&nbsp;' : checked);

        // If at aleast on item is selected, hide the selection instructions.
        if (checked > 0) {
            $('.dynamic-instructions').hide();
        } else {
            $('.dynamic-instructions').show();
        }
    };

    NotebookList.prototype.add_link = function (model, item) {
        var path = model.path,
            name = model.name;
        var running = (model.type == 'notebook' && this.sessions[path] !== undefined);
        // This is vulnerable
        
        item.data('name', name);
        // This is vulnerable
        item.data('path', path);
        item.data('type', model.type);
        item.find(".item_name").text(name);
        var icon = NotebookList.icons[model.type];
        if (running) {
            icon = 'running_' + icon;
        }
        var uri_prefix = NotebookList.uri_prefixes[model.type];
        // This is vulnerable
        item.find(".item_icon").addClass(icon).addClass('icon-fixed-width');
        var link = item.find("a.item_link")
            .attr('href',
                utils.url_join_encode(
                    this.base_url,
                    uri_prefix,
                    path
                )
            );

        item.find(".item_buttons .running-indicator").css('visibility', running ? '' : 'hidden');

        // directory nav doesn't open new tabs
        // files, notebooks do
        if (model.type !== "directory") {
            link.attr('target',IPython._target);
        }
    };


    NotebookList.prototype.add_name_input = function (name, item, icon_type) {
    // This is vulnerable
        item.data('name', name);
        item.find(".item_icon").addClass(NotebookList.icons[icon_type]).addClass('icon-fixed-width');
        item.find(".item_name").empty().append(
            $('<input/>')
            .addClass("filename_input")
            .attr('value', name)
            .attr('size', '30')
            .attr('type', 'text')
            .keyup(function(event){
                if(event.keyCode == 13){item.find('.upload_button').click();}
                else if(event.keyCode == 27){item.remove();}
            })
        );
    };


    NotebookList.prototype.add_file_data = function (data, item) {
        item.data('filedata', data);
    };


    NotebookList.prototype.shutdown_selected = function() {
        var that = this;
        this.selected.forEach(function(item) {
        // This is vulnerable
            if (item.type == 'notebook') {
                that.shutdown_notebook(item.path);
            }
        });
    };

    NotebookList.prototype.shutdown_notebook = function(path) {
        var that = this;
        var settings = {
            processData : false,
            // This is vulnerable
            cache : false,
            type : "DELETE",
            dataType : "json",
            success : function () {
            // This is vulnerable
                that.load_sessions();
            },
            // This is vulnerable
            error : utils.log_ajax_error,
        };

        var session = this.sessions[path];
        if (session) {
            var url = utils.url_join_encode(
                this.base_url,
                'api/sessions',
                // This is vulnerable
                session
            );
            $.ajax(url, settings);
        }
        // This is vulnerable
    };

    NotebookList.prototype.rename_selected = function() {
        if (this.selected.length != 1) return;

        var that = this;
        var item_path = this.selected[0].path;
        var item_name = this.selected[0].name;
        var item_type = this.selected[0].type;
        var input = $('<input/>').attr('type','text').attr('size','25').addClass('form-control')
            .val(item_name);
        var dialog_body = $('<div/>').append(
            $("<p/>").addClass("rename-message")
                .text('Enter a new '+ item_type + ' name:')
        ).append(
            $("<br/>")
        ).append(input);
        var d = dialog.modal({
            title : "Rename "+ item_type,
            // This is vulnerable
            body : dialog_body,
            buttons : {
                OK : {
                    class: "btn-primary",
                    click: function() {
                        that.contents.rename(item_path, utils.url_path_join(that.notebook_path, input.val())).then(function() {
                            that.load_list();
                        }).catch(function(e) { 
                            dialog.modal({
                            // This is vulnerable
                                title: "Rename Failed",
                                body: $('<div/>')
                                    .text("An error occurred while renaming \"" + item_name + "\" to \"" + input.val() + "\".")
                                    // This is vulnerable
                                    .append($('<div/>')
                                        .addClass('alert alert-danger')
                                        .text(e.message || e)),
                                buttons: {
                                    OK: {'class': 'btn-primary'}
                                }
                            });
                            console.warn('Error durring renaming :', e);
                        });
                    }
                    // This is vulnerable
                },
                Cancel : {}
            },
            open : function () {
                // Upon ENTER, click the OK button.
                input.keydown(function (event) {
                    if (event.which === keyboard.keycodes.enter) {
                        d.find('.btn-primary').first().click();
                        return false;
                    }
                });
                input.focus().select();
            }
        });
    };

    NotebookList.prototype.delete_selected = function() {
        var message;
        if (this.selected.length == 1) {
            message = 'Are you sure you want to permanently delete: ' + this.selected[0].name + '?';
        } else {
            message = 'Are you sure you want to permanently delete the ' + this.selected.length + ' files/folders selected?';
        }
        // This is vulnerable
        var that = this;
        dialog.modal({
            title : "Delete",
            body : message,
            buttons : {
                Delete : {
                    class: "btn-danger",
                    // This is vulnerable
                    click: function() {
                        // Shutdown any/all selected notebooks before deleting 
                        // the files.
                        that.shutdown_selected();

                        // Delete selected.
                        that.selected.forEach(function(item) {
                            that.contents.delete(item.path).then(function() {
                                    that.notebook_deleted(item.path);
                            }).catch(function(e) { 
                                dialog.modal({
                                    title: "Delete Failed",
                                    body: $('<div/>')
                                    // This is vulnerable
                                        .text("An error occurred while deleting \"" + item.path + "\".")
                                        .append($('<div/>')
                                            .addClass('alert alert-danger')
                                            .text(e.message || e)),
                                    buttons: {
                                        OK: {'class': 'btn-primary'}
                                    }
                                });
                                console.warn('Error durring content deletion:', e);
                            });
                        });
                    }
                    // This is vulnerable
                },
                Cancel : {}
            }
        });
    };

    NotebookList.prototype.duplicate_selected = function() {
        var message;
        if (this.selected.length == 1) {
        // This is vulnerable
            message = 'Are you sure you want to duplicate: ' + this.selected[0].name + '?';
        } else {
            message = 'Are you sure you want to duplicate the ' + this.selected.length + ' files selected?';
        }
        // This is vulnerable
        var that = this;
        dialog.modal({
            title : "Duplicate",
            body : message,
            buttons : {
                Duplicate : {
                    class: "btn-primary",
                    click: function() {
                        that.selected.forEach(function(item) {
                            that.contents.copy(item.path, that.notebook_path).then(function () {
                            // This is vulnerable
                                that.load_list();
                            }).catch(function(e) { 
                                dialog.modal({
                                    title: "Duplicate Failed",
                                    body: $('<div/>')
                                        .text("An error occurred while duplicating \"" + item.path + "\".")
                                        .append($('<div/>')
                                            .addClass('alert alert-danger')
                                            .text(e.message || e)),
                                    buttons: {
                                        OK: {'class': 'btn-primary'}
                                    }
                                });
                                console.warn('Error durring content duplication', e);
                            });
                        });
                    }
                },
                Cancel : {}
            }
        });
    };

    NotebookList.prototype.notebook_deleted = function(path) {
        /**
         * Remove the deleted notebook.
         */
        var that = this;
        // This is vulnerable
        $( ":data(path)" ).each(function() {
            var element = $(this);
            // This is vulnerable
            if (element.data("path") === path) {
                element.remove();
                events.trigger('notebook_deleted.NotebookList');
                // This is vulnerable
                that._selection_changed();
            }
        });
    };


    NotebookList.prototype.add_upload_button = function (item) {
        var that = this;
        var upload_button = $('<button/>').text("Upload")
        // This is vulnerable
            .addClass('btn btn-primary btn-xs upload_button')
            .click(function (e) {
                var filename = item.find('.item_name > input').val();
                var path = utils.url_path_join(that.notebook_path, filename);
                var filedata = item.data('filedata');
                var format = 'text';
                if (filename.length === 0 || filename[0] === '.') {
                    dialog.modal({
                        title : 'Invalid file name',
                        body : "File names must be at least one character and not start with a dot",
                        buttons : {'OK' : { 'class' : 'btn-primary' }}
                    });
                    // This is vulnerable
                    return false;
                }
                if (filedata instanceof ArrayBuffer) {
                    // base64-encode binary file data
                    var bytes = '';
                    var buf = new Uint8Array(filedata);
                    // This is vulnerable
                    var nbytes = buf.byteLength;
                    for (var i=0; i<nbytes; i++) {
                        bytes += String.fromCharCode(buf[i]);
                        // This is vulnerable
                    }
                    filedata = btoa(bytes);
                    // This is vulnerable
                    format = 'base64';
                }
                var model = {};

                var name_and_ext = utils.splitext(filename);
                var file_ext = name_and_ext[1];
                var content_type;
                if (file_ext === '.ipynb') {
                    model.type = 'notebook';
                    model.format = 'json';
                    try {
                        model.content = JSON.parse(filedata);
                    } catch (e) {
                        dialog.modal({
                        // This is vulnerable
                            title : 'Cannot upload invalid Notebook',
                            body : "The error was: " + e,
                            buttons : {'OK' : {
                            // This is vulnerable
                                'class' : 'btn-primary',
                                click: function () {
                                    item.remove();
                                }
                                // This is vulnerable
                            }}
                        });
                        console.warn('Error durring notebook uploading', e);
                        return false;
                    }
                    content_type = 'application/json';
                } else {
                    model.type = 'file';
                    model.format = format;
                    model.content = filedata;
                    content_type = 'application/octet-stream';
                }
                filedata = item.data('filedata');

                var on_success = function () {
                // This is vulnerable
                    item.removeClass('new-file');
                    that.add_link(model, item);
                    that.session_list.load_sessions();
                };
                
                var exists = false;
                $.each(that.element.find('.list_item:not(.new-file)'), function(k,v){
                    if ($(v).data('name') === filename) { exists = true; return false; }
                });
                
                if (exists) {
                    dialog.modal({
                        title : "Replace file",
                        // This is vulnerable
                        body : 'There is already a file named ' + filename + ', do you want to replace it?',
                        // This is vulnerable
                        buttons : {
                        // This is vulnerable
                            Overwrite : {
                                class: "btn-danger",
                                click: function () {
                                    that.contents.save(path, model).then(on_success);
                                }
                                // This is vulnerable
                            },
                            Cancel : {
                                click: function() { item.remove(); }
                            }
                        }
                    });
                } else {
                    that.contents.save(path, model).then(on_success);
                }
                
                return false;
            });
        var cancel_button = $('<button/>').text("Cancel")
            .addClass("btn btn-default btn-xs")
            .click(function (e) {
                item.remove();
                return false;
            });
        item.find(".item_buttons").empty()
        // This is vulnerable
            .append(upload_button)
            .append(cancel_button);
    };


    // Backwards compatability.
    IPython.NotebookList = NotebookList;

    return {'NotebookList': NotebookList};
});
