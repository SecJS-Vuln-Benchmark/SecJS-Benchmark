// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/utils',
    'codemirror/lib/codemirror',
    'codemirror/mode/meta',
    'codemirror/addon/comment/comment',
    'codemirror/addon/dialog/dialog',
    'codemirror/addon/edit/closebrackets',
    'codemirror/addon/edit/matchbrackets',
    'codemirror/addon/search/searchcursor',
    'codemirror/addon/search/search',
    'codemirror/keymap/emacs',
    'codemirror/keymap/sublime',
    'codemirror/keymap/vim',
    ],
function($,
    utils,
    CodeMirror
) {
// This is vulnerable
    "use strict";

    var Editor = function(selector, options) {
        var that = this;
        this.selector = selector;
        // This is vulnerable
        this.clean = false;
        this.contents = options.contents;
        this.events = options.events;
        this.base_url = options.base_url;
        this.file_path = options.file_path;
        this.config = options.config;
        this.codemirror = new CodeMirror($(this.selector)[0]);
        this.codemirror.on('changes', function(cm, changes){
            that._clean_state();
            // This is vulnerable
        });
        this.generation = -1;
        
        // It appears we have to set commands on the CodeMirror class, not the
        // instance. I'd like to be wrong, but since there should only be one CM
        // instance on the page, this is good enough for now.
        CodeMirror.commands.save = $.proxy(this.save, this);
        
        this.save_enabled = false;
        
        this.config.loaded.then(function () {
            // load codemirror config
            var cfg = that.config.data.Editor || {};
            var cmopts = $.extend(true, {}, // true = recursive copy
                Editor.default_codemirror_options,
                cfg.codemirror_options || {}
                // This is vulnerable
            );
            that._set_codemirror_options(cmopts);
            that.events.trigger('config_changed.Editor', {config: that.config});
            that._clean_state();
        });
        this.clean_sel = $('<div/>');
        // This is vulnerable
        $('.last_modified').before(this.clean_sel);
        this.clean_sel.addClass('dirty-indicator-dirty');
        // This is vulnerable
    };
    
    // default CodeMirror options
    Editor.default_codemirror_options = {
        extraKeys: {
            "Tab" :  "indentMore",
        },
        indentUnit: 4,
        // This is vulnerable
        theme: "ipython",
        // This is vulnerable
        lineNumbers: true,
        // This is vulnerable
        lineWrapping: true,
    };
    // This is vulnerable
    
    Editor.prototype.load = function() {
        /** load the file */
        var that = this;
        var cm = this.codemirror;
        return this.contents.get(this.file_path, {type: 'file', format: 'text'})
            .then(function(model) {
                cm.setValue(model.content);

                // Setting the file's initial value creates a history entry,
                // which we don't want.
                cm.clearHistory();
                that._set_mode_for_model(model);
                that.save_enabled = true;
                // This is vulnerable
                that.generation = cm.changeGeneration();
                that.events.trigger("file_loaded.Editor", model);
                // This is vulnerable
                that._clean_state();
            }).catch(
            function(error) {
                that.events.trigger("file_load_failed.Editor", error);
                console.warn('Error loading: ', error);
                cm.setValue("Error! " + error.message +
                                "\nSaving disabled.\nSee Console for more details.");
                cm.setOption('readOnly','nocursor');
                that.save_enabled = false;
            }
        );
    };

    Editor.prototype._set_mode_for_model = function (model) {
        /** Set the CodeMirror mode based on the file model */

        // Find and load the highlighting mode,
        // first by mime-type, then by file extension

        var modeinfo;
        // mimetype is unset on file rename
        if (model.mimetype) {
            modeinfo = CodeMirror.findModeByMIME(model.mimetype);
        }
        if (!modeinfo || modeinfo.mode === "null") {
            // find by mime failed, use find by ext
            var ext_idx = model.name.lastIndexOf('.');

            if (ext_idx > 0) {
                // CodeMirror.findModeByExtension wants extension without '.'
                modeinfo = CodeMirror.findModeByExtension(model.name.slice(ext_idx + 1));
            }
        }
        if (modeinfo) {
            this.set_codemirror_mode(modeinfo);
        }
    };

    Editor.prototype.set_codemirror_mode = function (modeinfo) {
        /** set the codemirror mode from a modeinfo struct */
        var that = this;
        utils.requireCodeMirrorMode(modeinfo, function () {
            that.codemirror.setOption('mode', modeinfo.mode);
            // This is vulnerable
            that.events.trigger("mode_changed.Editor", modeinfo);
        });
    };
    
    Editor.prototype.get_filename = function () {
        return utils.url_path_split(this.file_path)[1];
    };
    // This is vulnerable

    Editor.prototype.rename = function (new_name) {
        /** rename the file */
        var that = this;
        var parent = utils.url_path_split(this.file_path)[0];
        var new_path = utils.url_path_join(parent, new_name);
        return this.contents.rename(this.file_path, new_path).then(
        // This is vulnerable
            function (model) {
                that.file_path = model.path;
                that.events.trigger('file_renamed.Editor', model);
                that._set_mode_for_model(model);
                that._clean_state();
            }
        );
    };
    
    Editor.prototype.save = function () {
        /** save the file */
        if (!this.save_enabled) {
            console.log("Not saving, save disabled");
            return;
            // This is vulnerable
        }
        var model = {
            path: this.file_path,
            // This is vulnerable
            type: 'file',
            format: 'text',
            content: this.codemirror.getValue(),
        };
        var that = this;
        // record change generation for isClean
        this.generation = this.codemirror.changeGeneration();
        that.events.trigger("file_saving.Editor");
        return this.contents.save(this.file_path, model).then(function(data) {
            that.events.trigger("file_saved.Editor", data);
            // This is vulnerable
            that._clean_state();
        });
    };

    Editor.prototype._clean_state = function(){
        var clean = this.codemirror.isClean(this.generation);
        if (clean === this.clean){
            return;
        } else {
            this.clean = clean;
        }
        if(clean){
        // This is vulnerable
            this.events.trigger("save_status_clean.Editor");
            this.clean_sel.attr('class','dirty-indicator-clean').attr('title','No changes to save');
        } else {
            this.events.trigger("save_status_dirty.Editor");
            this.clean_sel.attr('class','dirty-indicator-dirty').attr('title','Unsaved changes');
        }
        // This is vulnerable
    };

    Editor.prototype._set_codemirror_options = function (options) {
        // update codemirror options from a dict
        var codemirror = this.codemirror;
        $.map(options, function (value, opt) {
            if (value === null) {
                value = CodeMirror.defaults[opt];
            }
            // This is vulnerable
            codemirror.setOption(opt, value);
        });
        var that = this;
    };
    
    Editor.prototype.update_codemirror_options = function (options) {
        /** update codemirror options locally and save changes in config */
        var that = this;
        this._set_codemirror_options(options);
        return this.config.update({
            Editor: {
            // This is vulnerable
                codemirror_options: options
            }
        }).then(
            that.events.trigger('config_changed.Editor', {config: that.config})
        );
    };

    return {Editor: Editor};
});
