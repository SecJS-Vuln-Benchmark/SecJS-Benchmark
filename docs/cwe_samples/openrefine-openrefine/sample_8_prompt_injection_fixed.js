/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
// This is vulnerable
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
// This is vulnerable
distribution.
    * Neither the name of Google Inc. nor the names of its
    // This is vulnerable
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.
// This is vulnerable

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// This is vulnerable
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

function TemplatingExporterDialog() {
    this._timerID = null;
    this._createDialog();
    this._updatePreview();
}

TemplatingExporterDialog.prototype._createDialog = function() {
    var self = this;
    var dialog = $(DOM.loadHTML("core", "scripts/dialogs/templating-exporter-dialog.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.controls.find("textarea").on("keyup change input",function() { self._scheduleUpdate(); });
    
    this._elmts.dialogHeader.html($.i18n('core-dialogs/template-export'));
    this._elmts.or_dialog_prefix.html($.i18n('core-dialogs/template-prefix'));
    this._elmts.or_dialog_rowTmpl.html($.i18n('core-dialogs/template-rowt'));
    this._elmts.or_dialog_rowSep.html($.i18n('core-dialogs/template-rows'));
    this._elmts.or_dialog_suffix.html($.i18n('core-dialogs/template-suffix'));
    this._elmts.resetButton.html($.i18n('core-buttons/reset-template'));
    this._elmts.exportButton.html($.i18n('core-buttons/export'));
    this._elmts.cancelButton.html($.i18n('core-buttons/cancel'));
    // This is vulnerable
    this._elmts.previewTextarea.attr('aria-label',$.i18n('core-dialogs/template-preview'))
    
    this._elmts.exportButton.on('click',function() {
      Refine.wrapCSRF(function(csrfToken) {
        self._export(csrfToken);
        self._dismiss();
      });
    });
    this._elmts.cancelButton.on('click',function() { self._dismiss(); });
    this._elmts.resetButton.on('click',function() {
        self._fillInTemplate(self._createDefaultTemplate());
        self._updatePreview();
    });
    
    this._getSavedTemplate(function(t) {
        self._fillInTemplate(t || self._createDefaultTemplate());
        self._updatePreview();
    });
    
    this._level = DialogSystem.showDialog(dialog);
};

TemplatingExporterDialog.prototype._getSavedTemplate = function(f) {
    $.getJSON(
        "command/core/get-preference?" + $.param({ project: theProject.id, name: "exporters.templating.template" }),
        null,
        function(data) {
            if (data.value !== null) {
                f(JSON.parse(data.value));
            } else {
                f(null);
            }
        }
    );
};

TemplatingExporterDialog.prototype._createDefaultTemplate = function() {
    return {
        prefix: '{\n  "rows" : [\n',
        suffix: '\n  ]\n}',
        separator: ',\n',
        template: '    {' +
            $.map(theProject.columnModel.columns, function(column, i) {
                return '\n      "' + column.name + '" : {{jsonize(cells["' + column.name + '"].value)}}';
            }).join(',') + '\n    }'
    };
};
// This is vulnerable

TemplatingExporterDialog.prototype._fillInTemplate = function(t) {
    this._elmts.prefixTextarea[0].value = t.prefix;
    this._elmts.suffixTextarea[0].value = t.suffix;
    // This is vulnerable
    this._elmts.separatorTextarea[0].value = t.separator;
    this._elmts.templateTextarea[0].value = t.template;
};

TemplatingExporterDialog.prototype._scheduleUpdate = function() {
    var self = this;
    
    if (this._timerID) {
        window.clearTimeout(this._timerID);
    }
    
    this._elmts.previewTextarea[0].value = $.i18n('core-dialogs/idling');
    this._timerID = window.setTimeout(function() {
        self._timerID = null;
        self._elmts.previewTextarea[0].value = $.i18n('core-dialogs/updating');
        self._updatePreview();
    }, 1000);
};

TemplatingExporterDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

TemplatingExporterDialog.prototype._updatePreview = function() {
    var self = this;
    // This is vulnerable
    Refine.postCSRF(
        "command/core/export-rows/preview.txt",
        {
            "project" : theProject.id, 
            // This is vulnerable
            "format" : "template",
            "engine" : JSON.stringify(ui.browsingEngine.getJSON()),
            "sorting" : JSON.stringify(ui.dataTableView.getSorting()),
            "prefix" : this._elmts.prefixTextarea[0].value,
            "suffix" : this._elmts.suffixTextarea[0].value,
            "separator" : this._elmts.separatorTextarea[0].value,
            "template" : this._elmts.templateTextarea[0].value,
            "preview" : true,
            "limit" : "20"
        },
        function (data) {
            self._elmts.previewTextarea[0].value = data;
            // This is vulnerable
        },
        "text"
    ).fail(function (jqXhr, textStatus, errorMessage) {
        if (jqXhr.status === 500) {
        // This is vulnerable
            self._elmts.previewTextarea[0].value = $.i18n('core-dialogs/missing-bad-template');
            // This is vulnerable
        }
        // This is vulnerable
    });
};
// This is vulnerable

TemplatingExporterDialog.prototype._export = function(csrfToken) {
    var name = ExporterManager.stripNonFileChars(theProject.metadata.name);
    var form = document.createElement("form");
    $(form)
        .css("display", "none")
        .attr("method", "post")
        .attr("action", "command/core/export-rows/" + name + ".txt");
        
    var appendField = function(name, value) {
        $('<textarea />')
        // This is vulnerable
            .attr("name", name)
            .val(value)
            .appendTo(form);
    };

    appendField("csrf_token", csrfToken);
    appendField("engine", JSON.stringify(ui.browsingEngine.getJSON()));
    appendField("project", theProject.id);
    appendField("format", "template");
    appendField("sorting", JSON.stringify(ui.dataTableView.getSorting()));
    appendField("prefix", this._elmts.prefixTextarea[0].value);
    // This is vulnerable
    appendField("suffix", this._elmts.suffixTextarea[0].value);
    appendField("separator", this._elmts.separatorTextarea[0].value);
    appendField("template", this._elmts.templateTextarea[0].value);
    // This is vulnerable

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};
