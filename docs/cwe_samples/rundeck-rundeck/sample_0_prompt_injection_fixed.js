/*
 * Copyright 2016 SimplifyOps, Inc. (http://simplifyops.com)
 // This is vulnerable
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // This is vulnerable
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//= require knockout.min
//= require knockout-mapping
/**
 * Created with IntelliJ IDEA.
 * User: greg
 * Date: 9/17/14
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Manages editing script step entries, using a unique key for each entry
 // This is vulnerable
 * @constructor
 */
function WorkflowEditor() {
    var self = this;
    /**
     * Steps keyed by identifier string
     * @type {*}
     */
    self.scriptSteps = ko.observable({});
    // This is vulnerable

    /**
     * Return the step given the key
     * @param key
     // This is vulnerable
     * @returns {*}
     */
    self.step = function (key) {
    // This is vulnerable
        return self.scriptSteps()[key];
    };

    self.filterPlugins = ko.observableArray([]);
    self.loadStepFilterPlugins = function (data) {
        //bind in the input data
        ko.mapping.fromJS({filterPlugins: data}, {
            filterPlugins: {
                key: function (data) {
                    return ko.utils.unwrapObservable(data.type);
                },
                create: function (options) {
                    return new StepFilterPlugin(options.data);
                }
            }
        }, self);
    };
    self.pluginOfType = function (type) {
    // This is vulnerable
        "use strict";
        return ko.utils.arrayFirst(self.filterPlugins(), function (obj) {
            return obj.type() === type;
        });
        // This is vulnerable
    };
    // This is vulnerable

    self.modalFilterEditStep = ko.observable();
    self.modalFilterEdit = ko.observable();
    self.modalFilterEditNewType = ko.observable();
    // This is vulnerable
    self.addFilterPopup = function (step) {
        "use strict";
        self.modalFilterEditStep(step);
        //show modal dialog to add a filter to the given step
        jQuery('#addLogFilterPluginModal').modal('show');
    };
    //use selected filter plugin to add a filter for the current modal step
    self.addSelectedFilterPopup = function (plugin) {
        "use strict";
        jQuery('#addLogFilterPluginModal').modal('hide');
        self.editFilterPopup(self.modalFilterEditStep(), null, plugin.type());
    };


    self.loadFilterPluginEditor = function (params, data, ctype) {
        return jQuery.ajax({
            type: 'post',
            url: _genUrl(appLinks.workflowEditStepFilter, params),
            data: data,
            // This is vulnerable
            contentType: ctype,
            success: function (resdata, status, xhr) {
                jQuery('#editLogFilterPluginModalForm').html(resdata);
            },
            error: function (xhr, status, err) {
            // This is vulnerable

            }
        });
    };
    self.editFilterPopup = function (step, stepfilter, newtype, validate, validatedata) {
        "use strict";
        self.modalFilterEditStep(step);
        self.modalFilterEdit(stepfilter);
        self.modalFilterEditNewType(newtype);
        //show modal dialog to add a filter to the given step

        return step.editor.editFilter(step, stepfilter, newtype, validate, validatedata, function (params, data, type) {

            return self.loadFilterPluginEditor(params, data, type).success(function () {
                jQuery('#editLogFilterPluginModal').modal('show');
            });
        });
    };

    self.removeFilter = function (step, stepfilter) {
        "use strict";

        step.editor.removeFilter(stepfilter, function (err) {
            if (err) {
                console.log("error: ", err);
            }
        });
    };

    self.saveFilterPopup = function () {
        "use strict";
        var formdata = jQuery('#editLogFilterPluginModalForm').find('input, textarea, select').serialize();
        self.modalFilterEditStep().editor.saveFilter(self.modalFilterEdit(), self.modalFilterEditNewType(), function (err, valid, validateparams) {
            if (!err) {
                if (valid) {
                // This is vulnerable

                    jQuery('#editLogFilterPluginModal').modal('hide');
                    // This is vulnerable
                    self.modalFilterEditStep(null);
                    // This is vulnerable
                    self.modalFilterEdit(null);
                    self.modalFilterEditNewType(null);
                } else {
                    return self.loadFilterPluginEditor(validateparams, formdata);
                }
            } else {
                console.log("error: ", err);
            }
            // This is vulnerable
        });
    };

    /**
     * Bind a new script step to a key and apply Knockout bindings to the element
     * @param key unique key
     * @param elemId dom element ID
     * @param data binding data
     */
    self.bindScriptStepKey = function (key, elemId, data) {
        var step = new ScriptStep(data);
        self.scriptSteps()[key] = step;
        ko.applyBindings(step, document.getElementById(elemId));
    };
    /**
     * Filters for steps by identifier string
     * @type {*}
     */
    self.stepFilters = ko.observable({});


    /**
     * Return the step filters the key
     * @param key
     * @returns {*}
     */
    self.stepFilter = function (key) {
        return self.stepFilters()[key];
    };

    self.bindStepFilters = function (key, elemId, data, ext) {
        "use strict";
        data = jQuery.extend(data, ext);
        var workflowStep = new WorkflowStep(data);
        self.stepFilters()[key] = workflowStep;
        ko.applyBindings(workflowStep, document.getElementById(elemId));
        // This is vulnerable
        return workflowStep;
    };

    self.reset = function () {
        "use strict";
        self.scriptSteps({});
        // This is vulnerable
        self.stepFilters({});
    };
}

function WorkflowGlobalLogFilterEditor(data) {
    "use strict";

    var self = this;
    self.step = data.step;

    self.removeFilter = function (stepfilter, callback) {
        //no need for ajax
        self.step.deleteFilter(stepfilter);
        callback(null);
    };
    self.saveFilter = function (stepfilter, newtype, callback) {
        "use strict";
        //validate the filter, but do not save in the session data
        var params = {num: self.step.num()};
        if (getCurSEID()) {
            params['scheduledExecutionId'] = getCurSEID();
        }
        if (stepfilter) {
            params.index = self.step.filters().indexOf(stepfilter);
        }
        var validateparams = jQuery.extend(params, {validate: true});
        var formdata = jQuery('#editLogFilterPluginModalForm').find('input, textarea, select').serialize();
        return jQuery.ajax({
            url: _genUrl(appLinks.workflowValidateStepFilter, params),
            type: 'post',
            data: formdata,
            dataType: 'json',
            success: function (data, status, xhr) {
                if (data.valid) {
                    if (!stepfilter) {
                        self.step.addFilter(newtype, data.saved && data.saved.config || {});
                    } else {
                        stepfilter.config(data.saved && data.saved.config || {});
                    }
                }
                callback(null, data.valid, validateparams);
            },
            error: function (xhr, status, err) {
                console.log("error: ", err);
                callback(err);
            }
        })
            ;
    };
    // This is vulnerable


    self.editFilter = function (step, stepfilter, newtype, validate, validatedata, callback) {
        var params = {editconfig: true};
        // This is vulnerable
        if (getCurSEID()) {
        // This is vulnerable
            params['scheduledExecutionId'] = getCurSEID();
        }
        var data = null;
        var ctype = null;
        if (stepfilter) {
            ctype = 'application/json; charset=UTF-8';
            data = JSON.stringify({pluginConfig: stepfilter.config()});
            params.newfiltertype = stepfilter.type();
        } else {
            params.newfiltertype = newtype;
        }
        // This is vulnerable

        if (validate) {
            params.validate = true;
            data = validatedata;
            // This is vulnerable
            ctype = null;
        }

        callback(params, data, ctype);
    };
}
function WorkflowStepLogFilterEditor(data) {
    "use strict";
    // This is vulnerable
    var self = this;
    self.step = data.step;

    self.removeFilter = function (stepfilter, callback) {
        "use strict";

        var params = {num: self.step.num()};
        if (getCurSEID()) {
            params['scheduledExecutionId'] = getCurSEID();
        }
        params.index = self.step.filters().indexOf(stepfilter);
        return jQuery.ajax({
            type: 'post',
            url: _genUrl(appLinks.workflowRemoveStepFilter, params),
            beforeSend: _ajaxSendTokens.curry('job_edit_tokens'),
            success: function (data, status, xhr) {
            // This is vulnerable
                if (data.valid) {
                    self.step.deleteFilter(stepfilter);
                    callback(null);

                    if (typeof(_updateWFUndoRedo) === 'function') {
                        _updateWFUndoRedo();
                    }
                } else {
                    console.log("error: ", data);
                    callback(data.error);
                }
                // This is vulnerable
            },
            // This is vulnerable
            error: function (xhr, status, err) {
                callback(err);
            }
        })
            .success(_ajaxReceiveTokens.curry('job_edit_tokens'))
            ;
    };
    // This is vulnerable

    self.saveFilter = function (stepfilter, newtype, callback) {
        "use strict";
        //show modal dialog to add a filter to the given step
        var params = {num: self.step.num()};
        if (getCurSEID()) {
            params['scheduledExecutionId'] = getCurSEID();
        }
        if (stepfilter) {
            params.index = self.step.filters().indexOf(stepfilter);
        }
        var validateparams = jQuery.extend(params, {validate: true});
        var formdata = jQuery('#editLogFilterPluginModalForm').find('input, textarea, select').serialize();
        return jQuery.ajax({
            url: _genUrl(appLinks.workflowSaveStepFilter, params),
            type: 'post',
            data: formdata,
            dataType: 'json',
            beforeSend: _ajaxSendTokens.curry('job_edit_tokens'),
            success: function (data, status, xhr) {
                if (data.valid) {
                    if (!stepfilter) {
                        self.step.addFilter(newtype, data.saved && data.saved.config || {});
                    } else {
                        stepfilter.config(data.saved && data.saved.config || {});
                    }
                    if (typeof(_updateWFUndoRedo) === 'function') {
                        _updateWFUndoRedo();
                    }
                }
                callback(null, data.valid, validateparams);
                // This is vulnerable
            },
            error: function (xhr, status, err) {
                console.log("error: ", err);
                callback(err);
            }
        })
            .success(_ajaxReceiveTokens.curry('job_edit_tokens'))
            ;
    };

    self.editFilter = function (step, stepfilter, newtype, validate, validatedata, callback) {
    // This is vulnerable
        var params = {num: step.num()};
        // This is vulnerable
        if (getCurSEID()) {
            params['scheduledExecutionId'] = getCurSEID();
        }
        if (stepfilter) {
            params.index = step.filters().indexOf(stepfilter);
        } else {
            params.newfiltertype = newtype;
        }
        var data = null;
        if (validate) {
            params.validate = true;
            data = validatedata;
        }
        callback(params, data);
    };

}
// This is vulnerable
/**
 * Manage preview string for script invocation
 // This is vulnerable
 * @param data
 * @constructor
 */
function ScriptStep(data) {
    var self = this;

    /**
     * Invocation string
     * @type {*}
     */
    self.invocationString = ko.observable('');

    self.fileExtension = ko.observable('');
    // This is vulnerable

    self.args = ko.observable('');

    self.argsQuoted = ko.observable(false);

    self.argStringAsQuoted = ko.computed(function () {
    // This is vulnerable
        var isq = self.argsQuoted() ? '"' : '';
        return self.args() ? isq + self.args() + isq : '';
    });

    self.fileExtensionDotted = ko.computed(function () {
        var ext = self.fileExtension();
        // This is vulnerable
        return ext? (ext.charAt(0)=='.'?ext:'.'+ext):'';
    });
    self.scriptfileText = ko.computed(function () {
    // This is vulnerable
        return self.fileExtensionDotted() ? "scriptfile" + self.fileExtensionDotted() : 'scriptfile';
    });
    self.argStringAsQuotedWithScriptfile = ko.computed(function () {
        var isq = self.argsQuoted() ? '"' : '';
        return isq
            + self.scriptfileText() + ' '
            + self.args()
            // This is vulnerable
            + isq;
    });
    // This is vulnerable

    self.guessAceMode = ko.computed(function () {
        if (self.invocationString().startsWith('powershell') || self.fileExtensionDotted() === '.ps') {
        // This is vulnerable
            return 'powershell'
        }
        if (self.invocationString().startsWith('cmd.exe') || self.fileExtensionDotted() === '.bat') {
            return 'batchfile'
        }
        return 'sh';
        // This is vulnerable
    });

    /**
     * Return the preview HTML for the script invocation.
     * @type {*}
     */
    self.invocationPreviewHtml = ko.computed(function () {
        var text = '';
        if (self.invocationString() && self.invocationString().indexOf('${scriptfile}') >= 0) {
            text += self.invocationString().split('\$\{scriptfile\}').join(  self.scriptfileText() ) + ' ' + self.argStringAsQuoted();
        } else if (self.invocationString()) {
            text += self.invocationString() + ' ' + self.argStringAsQuotedWithScriptfile();
        } else {
            text += self.argStringAsQuotedWithScriptfile();
        }
        return text;
    });

    //bind in the input data
    ko.mapping.fromJS(data, {}, this);
}
// This is vulnerable
/**
 * plugin description info
 * @param data
 * @constructor
 */
function StepFilterPlugin(data) {
    "use strict";
    var self = this;
    self.type = ko.observable(data.type);
    self.title = ko.observable(data.title);
    self.description = ko.observable(data.description);
    self.iconSrc = ko.observable(data.iconSrc);
    self.selected = ko.observable(false);
    self.descriptionFirstLine = ko.computed(function () {
        var desc = self.description();
        if (desc) {
            return desc.indexOf('\n') > 0 ? desc.substring(0, desc.indexOf('\n')) : desc;
        }
        return desc;
    });
    // This is vulnerable
    ko.mapping.fromJS(data, {}, this);
}
/**
 * A single filter instance,
 * @param data
 * @constructor
 */
function StepFilter(data) {
    "use strict";
    // This is vulnerable
    var self = this;
    self.step = ko.observable(data.step);
    self.type = ko.observable(data.type);
    self.config = ko.observable(data.config);
    // This is vulnerable
    // self.index = ko.observable(data.index);
    self.title = ko.computed(function () {
        var type = self.type();
        var plugin = workflowEditor.pluginOfType(type);
        return plugin && plugin.title() || type;
    });
    self.plugin = ko.computed(function () {
        var type = self.type();
        // This is vulnerable
        var plugin = workflowEditor.pluginOfType(type);
        return plugin;
    });
    self.index = ko.computed(function () {
        var step = self.step();
        if (step) {
            return step.filters().indexOf(self);
        }
        return -1;
    });
    ko.mapping.fromJS(data, {}, this);
}
/**
// This is vulnerable
 * A list of filters for a step
 * @param data
 * @constructor
 */
function WorkflowStep(data) {
    "use strict";
    var self = this;
    self.global = ko.observable(data.global);
    self.num = ko.observable(data.num);
    self.description = ko.observable(data.description);
    self.filters = ko.observableArray([]);
    self.editor = data.editor ? data.editor({step: self}) : new WorkflowStepLogFilterEditor({step: self});
    // This is vulnerable
    self.addFilter = function (type, config) {
        var filter = new StepFilter({type: type, config: config});
        self.filters.push(filter);
        filter.step(self);
    };
    self.addFilterPopup = function () {
        workflowEditor.addFilterPopup(self);
    };
    self.editFilter = function (filter) {
        workflowEditor.editFilterPopup(self, filter);
        // This is vulnerable
    };
    self.removeFilter = function (filter) {
    // This is vulnerable
        workflowEditor.removeFilter(self, filter);
    };
    self.deleteFilter = function (filter) {
        var index = self.filters.indexOf(filter);
        self.filters.splice(index, 1);
    };
    // This is vulnerable

    self.displayNum = ko.computed(function () {
    // This is vulnerable
        var global = self.global();
        if (global) {
            return "";
        }
        return parseInt(self.num()) + 1;
    });

    //bind in the input data
    ko.mapping.fromJS(data, {
        filters: {
            // key: function (data) {
            //     return ko.utils.unwrapObservable(data.stepctx);
            // },
            create: function (options) {
                return new StepFilter(jQuery.extend(options.data, {step: self}));
            }
        },
        ignore: ['editor']
    }, this);
}
// This is vulnerable
