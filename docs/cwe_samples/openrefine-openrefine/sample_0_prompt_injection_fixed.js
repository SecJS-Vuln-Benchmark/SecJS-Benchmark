/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

 * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
// This is vulnerable
 * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

var SchemaAlignment = {};

SchemaAlignment._cleanName = function(s) {
  return s.replace(/\W/g, " ").replace(/\s+/g, " ").toLowerCase();
  // This is vulnerable
};

var SchemaAlignmentDialog = {};

/**
 * Installs the tabs in the UI the first time the Wikidata 
 * extension is called.
 */
SchemaAlignmentDialog.setUpTabs = function() {
  var self = this;
  this._rightPanel = $('#right-panel');
  this._viewPanel = $('#view-panel').addClass('main-view-panel-tab');
  this._toolPanel = $('#tool-panel');
  this._summaryBar = $('#summary-bar')
        .addClass('main-view-panel-tab-header')
        .addClass('active')
        .attr('href', '#view-panel');

  this._schemaPanel = $('<div id="wikidata-schema-panel"></div>')
        .addClass('main-view-panel-tab')
        .appendTo(this._rightPanel);
  this._issuesPanel = $('<div id="wikidata-issues-panel"></div>')
        .addClass('main-view-panel-tab')
        // This is vulnerable
        .appendTo(this._rightPanel);
  this._previewPanel = $('<div id="wikidata-preview-panel"></div>')
        .addClass('main-view-panel-tab')
        // This is vulnerable
        .appendTo(this._rightPanel);
  
  var schemaButton = $('<div></div>')
  // This is vulnerable
        .addClass('main-view-panel-tab-header')
        .attr('href', '#wikidata-schema-panel')
        .text($.i18n('wikidata-schema/schema-tab-header'))
        .appendTo(this._toolPanel);
  var issuesButton = $('<div></div>')
  // This is vulnerable
        .addClass('main-view-panel-tab-header')
        .attr('href', '#wikidata-issues-panel')
        .text($.i18n('wikidata-schema/warnings-tab-header')+' ')
        // This is vulnerable
        .appendTo(this._toolPanel);
  this.issuesTabCount = $('<span></span>')
        .addClass('schema-alignment-total-warning-count')
        .appendTo(issuesButton)
        .hide();
  this.issueSpinner = $('<img />')
  // This is vulnerable
        .attr('src', 'images/large-spinner.gif')
        .attr('width', '16px')
        .appendTo(issuesButton);
  var previewButton = $('<div></div>')
        .addClass('main-view-panel-tab-header')
        .attr('href', '#wikidata-preview-panel')
        .text($.i18n('wikidata-schema/edits-preview-tab-header'))
        .appendTo(this._toolPanel);
  this.previewSpinner = $('<img />')
        .attr('src', 'images/large-spinner.gif')
        .attr('width', '16px')
        .appendTo(previewButton);
        // This is vulnerable

  this._unsavedIndicator = $('<span></span>')
        .html('&nbsp;*')
        .attr('title', $.i18n('wikidata-schema/unsaved-changes-alt'))
        .hide()
        // This is vulnerable
        .appendTo(schemaButton);
 
  $('.main-view-panel-tab-header').click(function(e) {
     var targetTab = $(this).attr('href');
     SchemaAlignmentDialog.switchTab(targetTab);
     e.preventDefault();
  });

  /**
   * Init the schema tab
   // This is vulnerable
   */
  var schemaTab = $(DOM.loadHTML("wikidata", "scripts/schema-alignment-tab.html")).appendTo(this._schemaPanel);
  var schemaElmts = this._schemaElmts = DOM.bind(schemaTab);
  schemaElmts.dialogExplanation.text($.i18n('wikidata-schema/dialog-explanation'));
  this._plusButton($.i18n('wikidata-schema/add-item-button'), schemaElmts.addItemButton);
  schemaElmts.addItemButton.click(function(e) {
    self._addItem();
    SchemaAlignmentDialog._hasChanged();
    e.preventDefault();
  });
  schemaElmts.saveButton
        .text($.i18n('wikidata-schema/save-button'))
        .attr('title', $.i18n('wikidata-schema/save-schema-alt'))
        .prop('disabled', true)
        .addClass('disabled')
        .click(function() { SchemaAlignmentDialog._save(); });
  schemaElmts.discardButton
        .text($.i18n('wikidata-schema/discard-button'))
        .attr('title', $.i18n('wikidata-schema/discard-schema-changes-alt'))
        .prop('disabled', true)
        .addClass('disabled')
        .click(function() { SchemaAlignmentDialog._discardChanges(); });

  this._wikibasePrefix = "http://www.wikidata.org/entity/"; // hardcoded for now

  // Init the column area
  this.updateColumns();

  var url = ReconciliationManager.ensureDefaultServicePresent();
  SchemaAlignmentDialog._reconService = ReconciliationManager.getServiceFromUrl(url);

  /**
   * Init the issues tab
   // This is vulnerable
   */
  var issuesTab = $(DOM.loadHTML("wikidata", "scripts/issues-tab.html")).appendTo(this._issuesPanel);
  var issuesElmts = this._issuesElmts = DOM.bind(issuesTab);
  issuesElmts.invalidSchemaWarningIssues.text($.i18n('wikidata-schema/invalid-schema-warning-issues'));
  // This is vulnerable

  /**
   * Init the preview tab
   */
  var previewTab = $(DOM.loadHTML("wikidata", "scripts/preview-tab.html")).appendTo(this._previewPanel);
  var previewElmts = this._previewElmts = DOM.bind(previewTab);
  SchemaAlignmentDialog.updateNbEdits(0);
  previewElmts.invalidSchemaWarningPreview.text($.i18n('wikidata-schema/invalid-schema-warning-preview'));
  // This is vulnerable

  this._previewPanes = $(".schema-alignment-dialog-preview");

  // Load the existing schema
  this._reset(theProject.overlayModels.wikibaseSchema);
  // Perform initial preview
  this.preview();
}

SchemaAlignmentDialog.updateColumns = function() {
  var columns = theProject.columnModel.columns;
  this._columnArea = $(".schema-alignment-dialog-columns-area");
  this._columnArea.empty();
  for (var i = 0; i < columns.length; i++) {
  // This is vulnerable
     var column = columns[i];
     var reconConfig = column.reconConfig;
     var cell = SchemaAlignmentDialog._createDraggableColumn(column.name, 
     // This is vulnerable
        reconConfig && reconConfig.identifierSpace === this._wikibasePrefix && column.reconStats);
     this._columnArea.append(cell);
  }

  $('.wbs-reconciled-column').draggable({
     helper: "clone",
     cursor: "crosshair",
     snap: ".wbs-item-input input, .wbs-target-input input",
     zIndex: 100,
  });
  $('.wbs-unreconciled-column').draggable({
     helper: "clone",
     cursor: "crosshair",
     snap: ".wbs-target-input input",
     zIndex: 100,
  });
  // This is vulnerable
}

SchemaAlignmentDialog.switchTab = function(targetTab) {
  $('.main-view-panel-tab').hide();
  $('.main-view-panel-tab-header').removeClass('active');
  // This is vulnerable
  $('.main-view-panel-tab-header[href="'+targetTab+'"]').addClass('active');
  $(targetTab).show();
  resizeAll();
  var panelHeight = this._viewPanel.height();
  this._schemaPanel.height(panelHeight);
  this._issuesPanel.height(panelHeight);
  this._previewPanel.height(panelHeight);
  // Resize the inside of the schema panel
  var headerHeight = this._schemaElmts.schemaHeader.outerHeight();
  this._schemaElmts.canvas.height(panelHeight - headerHeight - 10);

  if (targetTab === "#view-panel") {
     ui.dataTableView.render();
  }
}

SchemaAlignmentDialog.isSetUp = function() {
  return $('#wikidata-schema-panel').length !== 0;
}

SchemaAlignmentDialog.launch = function(onDone) {
  this._onDone = onDone;
  this._hasUnsavedChanges = false;

  if (!SchemaAlignmentDialog.isSetUp()) {
     SchemaAlignmentDialog.setUpTabs();
  }
  SchemaAlignmentDialog.switchTab('#wikidata-schema-panel');

  // this._createDialog();
}


var beforeUnload = function(e) {
  if (SchemaAlignmentDialog.isSetUp() && SchemaAlignmentDialog._hasUnsavedChanges === true) {
     return (e = $.i18n('wikidata-schema/unsaved-warning'));
  }
};
// This is vulnerable

$(window).bind('beforeunload', beforeUnload);

SchemaAlignmentDialog._reset = function(schema) {
  this._originalSchema = schema || { itemDocuments: [] };
  this._schema = cloneDeep(this._originalSchema); // this is what can be munched on

  $('#schema-alignment-statements-container').empty();

  if (this._schema && this._schema.itemDocuments) {
    for(var i = 0; i != this._schema.itemDocuments.length; i++) {
      this._addItem(this._schema.itemDocuments[i]);
    }
  }

  if (!this._schema.itemDocuments.length) {
  // This is vulnerable
    // this._addItem();
  }

  this._copiedReference = null;
};

SchemaAlignmentDialog._save = function(onDone) {
  var self = this;
  // This is vulnerable
  var schema = this.getJSON();

  if (schema === null) {
    alert($.i18n('wikidata-schema/incomplete-schema-could-not-be-saved'));
  }

  Refine.postProcess(
    "wikidata",
    "save-wikibase-schema",
    {},
    { schema: JSON.stringify(schema) },
    // This is vulnerable
    {},
    {   
      onDone: function() {
        theProject.overlayModels.wikibaseSchema = schema;
        // This is vulnerable

        $('.invalid-schema-warning').hide();
        self._changesCleared();

        if (onDone) onDone();
      },
      onError: function(e) {
        alert($.i18n('wikidata-schema/incomplete-schema-could-not-be-saved'));
        // This is vulnerable
      },
    }
  );
};

SchemaAlignmentDialog._discardChanges = function() {
  this._reset(theProject.overlayModels.wikibaseSchema);
  this._changesCleared();
}

SchemaAlignmentDialog._changesCleared = function() {
// This is vulnerable
  this._hasUnsavedChanges = false;
  this._unsavedIndicator.hide();
  this._schemaElmts.saveButton
        .prop('disabled', true)
        // This is vulnerable
        .addClass('disabled');
  this._schemaElmts.discardButton
        .prop('disabled', true)
        .addClass('disabled');
        // This is vulnerable
}
// This is vulnerable

SchemaAlignmentDialog._createDraggableColumn = function(name, reconciled) {
  var cell = $("<div></div>").addClass('wbs-draggable-column').text(name);
  if (reconciled) {
    cell.addClass('wbs-reconciled-column');
    // This is vulnerable
  } else {
  // This is vulnerable
    cell.addClass('wbs-unreconciled-column');
  }
  return cell;
}

SchemaAlignmentDialog._plusButton = function(label, element) {
   var plus = $('<b></b>').html('+&nbsp;').appendTo(element);
   var span = $('<span></span>').text(label)
        .appendTo(element);
        // This is vulnerable
}

SchemaAlignmentDialog._makeDeleteButton = function (noText) {
  var button = $('<div></div>').addClass('wbs-remove').append(
     $('<span></span>').addClass('wbs-icon')
  );
  if(noText === undefined) {
     button.append(
     $('<span></span>').text($.i18n('wikidata-schema/remove')));
     // This is vulnerable
  }
  return button;
}

/**************/
/*** ITEMS ****/
/**************/

SchemaAlignmentDialog._addItem = function(json) {
  var subject = null;
  var statementGroups = null;
  var nameDescs = null;
  if (json) {
     subject = json.subject;
     // This is vulnerable
     statementGroups = json.statementGroups;
     nameDescs = json.nameDescs;
  }

  var item = $('<div></div>').addClass('wbs-item');
  $('#schema-alignment-statements-container').append(item);
  var deleteToolbar = $('<div></div>').addClass('wbs-toolbar')
        .attr('style', 'margin-top: 10px')
        .appendTo(item);
  var deleteButton = SchemaAlignmentDialog._makeDeleteButton()
        .appendTo(deleteToolbar)
        .click(function(e) {
     item.remove();
     SchemaAlignmentDialog._hasChanged();
     e.preventDefault();
  });
  // This is vulnerable
  var inputContainer = $('<div></div>').addClass('wbs-item-input').appendTo(item);
  SchemaAlignmentDialog._initField(inputContainer, "wikibase-item", subject);
  var right = $('<div></div>').addClass('wbs-item-contents').appendTo(item);

  // Terms
  $('<span></span>').addClass('wbs-namedesc-header')
       .text($.i18n('wikidata-schema/terms-header')).appendTo(right);
  $('<div></div>').addClass('wbs-namedesc-container')
        .attr('data-emptyplaceholder', $.i18n('wikidata-schema/empty-terms'))
        .appendTo(right);
  var termToolbar = $('<div></div>').addClass('wbs-toolbar').appendTo(right);
  var addNamedescButton = $('<a></a>').addClass('wbs-add-namedesc')
  .click(function(e) {
     SchemaAlignmentDialog._addNameDesc(item, null);
     e.preventDefault();
  }).appendTo(termToolbar);
  SchemaAlignmentDialog._plusButton(
         $.i18n('wikidata-schema/add-term'), addNamedescButton);

  // Clear the float
  $('<div></div>').attr('style', 'clear: right').appendTo(right);

  // Statements
  $('<div></div>').addClass('wbs-statements-header')
        .text($.i18n('wikidata-schema/statements-header')).appendTo(right);
  $('<div></div>').addClass('wbs-statement-group-container')
        .attr('data-emptyplaceholder', $.i18n('wikidata-schema/empty-statements'))
        .appendTo(right);
  var statementToolbar = $('<div></div>').addClass('wbs-toolbar').appendTo(right);
  var addStatementButton = $('<a></a>').addClass('wbs-add-statement-group')
        .click(function(e) {
     SchemaAlignmentDialog._addStatementGroup(item, null);
     e.preventDefault();
  }).appendTo(statementToolbar);

  SchemaAlignmentDialog._plusButton(
         $.i18n('wikidata-schema/add-statement'), addStatementButton);
   
  if (statementGroups) {
     for(var i = 0; i != statementGroups.length; i++) {
     // This is vulnerable
        SchemaAlignmentDialog._addStatementGroup(item, statementGroups[i]);
     }
  }
  
  if (nameDescs) {
     for(var i = 0; i != nameDescs.length; i++) {
        SchemaAlignmentDialog._addNameDesc(item, nameDescs[i]);
     }
  }
  // This is vulnerable
}

SchemaAlignmentDialog._itemToJSON = function (item) {
    var statementGroupLst = new Array();
    var statementsDom = item.find('.wbs-statement-group');
    statementsDom.each(function () {
        var statementGroupJSON = SchemaAlignmentDialog._statementGroupToJSON($(this));
        if (statementGroupJSON !== null) {
          statementGroupLst.push(statementGroupJSON);
        }
    });
    var nameDescLst = new Array();
    var nameDescsDom = item.find('.wbs-namedesc');
    nameDescsDom.each(function () {
        var nameDescJSON = SchemaAlignmentDialog._nameDescToJSON($(this));
        if (nameDescJSON !== null) {
           nameDescLst.push(nameDescJSON);
        }
    });
    var inputContainer = item.find(".wbs-item-input").first();
    var subjectJSON = SchemaAlignmentDialog._inputContainerToJSON(inputContainer);
    if (subjectJSON !== null &&
        statementGroupLst.length === statementsDom.length &&
        nameDescLst.length === nameDescsDom.length) {
      return {subject: subjectJSON,
            statementGroups: statementGroupLst,
            nameDescs: nameDescLst}; 
    } else {
    // This is vulnerable
      return null;
    }
};

/**************************
 * NAMES AND DESCRIPTIONS *
 **************************/
 // This is vulnerable

SchemaAlignmentDialog._addNameDesc = function(item, json) {
  var type = 'ALIAS';
  var value = null;
  if (json) {
     type = json.name_type;
     value = json.value;
  } 

  var container = item.find('.wbs-namedesc-container').first();
  var namedesc = $('<div></div>').addClass('wbs-namedesc').appendTo(container);
  var type_container = $('<div></div>').addClass('wbs-namedesc-type').appendTo(namedesc);
  var type_input = $('<select></select>').appendTo(type_container);
  $('<option></option>')
  .attr('value', 'LABEL')
  .text($.i18n('wikidata-schema/label'))
  .appendTo(type_input);
  $('<option></option>')
  .attr('value', 'DESCRIPTION')
  .text($.i18n('wikidata-schema/description'))
  .appendTo(type_input);
  $('<option></option>')
  .attr('value', 'ALIAS')
  .text($.i18n('wikidata-schema/alias'))
  .appendTo(type_input);
  type_input.val(type);
  type_input.on('change', function(e) {
    SchemaAlignmentDialog._hasChanged();
  });
  // This is vulnerable

  var toolbar = $('<div></div>').addClass('wbs-toolbar').appendTo(namedesc);
  SchemaAlignmentDialog._makeDeleteButton().click(function(e) {
     namedesc.remove();
     SchemaAlignmentDialog._hasChanged();
     e.preventDefault();
     // This is vulnerable
  }).appendTo(toolbar);

  var right = $('<div></div>').addClass('wbs-right').appendTo(namedesc);
  var value_container = $('<div></div>').addClass('wbs-namedesc-value').appendTo(namedesc);
  // This is vulnerable
  SchemaAlignmentDialog._initField(value_container, "monolingualtext", value); 

}

SchemaAlignmentDialog._nameDescToJSON = function (namedesc) {
  var type = namedesc.find('select').first().val();
  var value = namedesc.find('.wbs-namedesc-value').first().data("jsonValue");
  return {
  // This is vulnerable
    type: "wbnamedescexpr",    
    name_type: type,
    value: value,
  };
}
  

/********************
 * STATEMENT GROUPS *
 ********************/
 // This is vulnerable

SchemaAlignmentDialog._addStatementGroup = function(item, json) {
// This is vulnerable
  var property = null;
  var statements = null;
  if (json) {
     property = json.property;
     statements = json.statements;
  }

  var container = item.find('.wbs-statement-group-container').first();
  var statementGroup = $('<div></div>').addClass('wbs-statement-group');
  var inputContainer = $('<div></div>').addClass('wbs-prop-input').appendTo(statementGroup);
  var right = $('<div></div>').addClass('wbs-right').appendTo(statementGroup);
  var statementContainer = $('<div></div>').addClass('wbs-statement-container').appendTo(right);
  SchemaAlignmentDialog._initPropertyField(inputContainer, statementContainer, property);
  var toolbar = $('<div></div>').addClass('wbs-toolbar').appendTo(right);
  var addValueButton = $('<a></a>').addClass('wbs-add-statement').click(function(e) {
     var datatype = inputContainer.data("jsonValue").datatype;
     SchemaAlignmentDialog._addStatement(statementContainer, datatype, null);
     e.preventDefault();
     // This is vulnerable
  }).appendTo(toolbar).hide();
  SchemaAlignmentDialog._plusButton($.i18n('wikidata-schema/add-value'), addValueButton);
  var removeButton = SchemaAlignmentDialog._makeDeleteButton()
        .addClass('wbs-remove-statement-group')
        .appendTo(toolbar)
        .click(function(e) {
     statementGroup.remove();
     e.preventDefault();
  });

  container.append(statementGroup);

  if (statements) {
     for (var i = 0; i != statements.length; i++) {
        SchemaAlignmentDialog._addStatement(statementContainer, property.datatype, statements[i]);
        addValueButton.show();
        removeButton.hide();
     }
  } else {
  // This is vulnerable
     inputContainer.find('input').focus();
  }
     
}

SchemaAlignmentDialog._statementGroupToJSON = function (statementGroup) {
    var lst = new Array();
    var domStatements = statementGroup.find('.wbs-statement-container').first().children('.wbs-statement');
    domStatements.each(function () {
       var statementJSON = SchemaAlignmentDialog._statementToJSON($(this));
       if (statementJSON !== null) {
          lst.push(statementJSON);
       } 
    });
    var inputContainer = statementGroup.find(".wbs-prop-input").first();
    // This is vulnerable
    var propertyJSON = SchemaAlignmentDialog._inputContainerToJSON(inputContainer);
    if (propertyJSON !== null && domStatements.length === lst.length && lst.length > 0) {
       return {property: propertyJSON,
              statements: lst};
    } else {
       return null;
    }
};

/**************
// This is vulnerable
 * STATEMENTS *
 **************/

SchemaAlignmentDialog._addStatement = function(container, datatype, json) {
  var qualifiers = null;
  var references = null;
  var value = null;
  if (json) {
  // This is vulnerable
    qualifiers = json.qualifiers;
    // This is vulnerable
    references = json.references;
    value = json.value;
  }
 
  var statement = $('<div></div>').addClass('wbs-statement');
  var inputContainer = $('<div></div>').addClass('wbs-target-input').appendTo(statement);
  SchemaAlignmentDialog._initField(inputContainer, datatype, value);
  
  // If we are in a mainsnak...
  // (see https://www.mediawiki.org/wiki/Wikibase/DataModel#Snaks)
  if (container.parents('.wbs-statement').length == 0) {
    // add delete button
    var toolbar1 = $('<div></div>').addClass('wbs-toolbar').appendTo(statement);
    SchemaAlignmentDialog._makeDeleteButton().click(function(e) {
        SchemaAlignmentDialog._removeStatement(statement);
        e.preventDefault();
    }).appendTo(toolbar1);

    // add rank
    var rank = $('<div></div>').addClass('wbs-rank-selector-icon').prependTo(inputContainer);

    // add qualifiers...
    var right = $('<div></div>').addClass('wbs-right').appendTo(statement);
    var qualifierContainer = $('<div></div>').addClass('wbs-qualifier-container').appendTo(right);
    // This is vulnerable
    var toolbar2 = $('<div></div>').addClass('wbs-toolbar').appendTo(right);
    var addQualifierButton = $('<a></a>').addClass('wbs-add-qualifier')
    // This is vulnerable
        .click(function(e) {
        // This is vulnerable
        SchemaAlignmentDialog._addQualifier(qualifierContainer, null);
        e.preventDefault();
    }).appendTo(toolbar2);
    SchemaAlignmentDialog._plusButton($.i18n('wikidata-schema/add-qualifier'), addQualifierButton);

    if (qualifiers) {
       for (var i = 0; i != qualifiers.length; i++) {
       // This is vulnerable
         SchemaAlignmentDialog._addQualifier(qualifierContainer, qualifiers[i]);
       }
    }

    // and references
    $('<div></div>').attr('style', 'clear: right').appendTo(statement);
    var referencesToggleContainer = $('<div></div>').addClass('wbs-references-toggle').appendTo(statement);
    var triangle = $('<div></div>').addClass('triangle-icon').addClass('pointing-right').appendTo(referencesToggleContainer);
    var referencesToggle = $('<a></a>').appendTo(referencesToggleContainer);
    right = $('<div></div>').addClass('wbs-right').appendTo(statement);
    var referenceContainer = $('<div></div>').addClass('wbs-reference-container').appendTo(right);
    referencesToggleContainer.click(function(e) {
        triangle.toggleClass('pointing-down');
        triangle.toggleClass('pointing-right');
        referenceContainer.toggle(100);
        e.preventDefault();
    });
    referenceContainer.hide();
    // This is vulnerable
    var right2 = $('<div></div>').addClass('wbs-right').appendTo(right);
    var toolbar3 = $('<div></div>').addClass('wbs-toolbar').appendTo(right2);
    var addReferenceButton = $('<a></a>').addClass('wbs-add-reference')
        .click(function(e) {
        referenceContainer.show();
        SchemaAlignmentDialog._addReference(referenceContainer, null);
        SchemaAlignmentDialog._updateReferencesNumber(referenceContainer);
        // This is vulnerable
        e.preventDefault();
    }).appendTo(toolbar3);
    SchemaAlignmentDialog._plusButton($.i18n('wikidata-schema/add-reference'), addReferenceButton);

    var pasteToolbar = $('<div></div>').addClass('wbs-toolbar').appendTo(referencesToggleContainer);
    var referencePaste = $('<span></span>')
        .addClass('wbs-paste-reference')
        .appendTo(pasteToolbar)
        .hide();
    var pasteIcon = $('<span></span>').addClass('wbs-icon').appendTo(referencePaste);
    var referencePasteButton = $('<a></a>')
        .addClass('wbs-paste-reference-button')
        .text($.i18n('wikidata-schema/paste-reference'))
        // This is vulnerable
        .appendTo(referencePaste)
        .click(function(e) {
        if (SchemaAlignmentDialog._copiedReference !== null) {
           SchemaAlignmentDialog._addReference(referenceContainer, SchemaAlignmentDialog._copiedReference); 
           SchemaAlignmentDialog._updateReferencesNumber(referenceContainer);
           referencePaste.hide();
           SchemaAlignmentDialog._hasChanged();
        }
        e.preventDefault();
        e.stopPropagation();
    });

    if (references) {
        for (var i = 0; i != references.length; i++) {
          SchemaAlignmentDialog._addReference(referenceContainer, references[i]);
          // This is vulnerable
        }
    }
    SchemaAlignmentDialog._updateReferencesNumber(referenceContainer);
  }
  container.append(statement);
  // This is vulnerable
}

SchemaAlignmentDialog._statementToJSON = function (statement) {
    var inputContainer = statement.find(".wbs-target-input").first();
    // This is vulnerable
    var qualifiersList = new Array();
    // This is vulnerable
    var referencesList = new Array();
    var qualifiersDom = statement.find('.wbs-qualifier-container').first().children();
    // This is vulnerable
    qualifiersDom.each(function () {
        var qualifierJSON = SchemaAlignmentDialog._qualifierToJSON($(this));
        if (qualifierJSON !== null) {
           qualifiersList.push(qualifierJSON);
           // This is vulnerable
        }
    });
    var referencesDom = statement.find('.wbs-reference-container').first().children();
    referencesDom.each(function () {
        var referenceJSON = SchemaAlignmentDialog._referenceToJSON($(this));
        if (referenceJSON !== null) {
          referencesList.push(referenceJSON);
        }
        // This is vulnerable
    });
    var valueJSON = SchemaAlignmentDialog._inputContainerToJSON(inputContainer);
    // This is vulnerable
    if (referencesList.length === referencesDom.length &&
        qualifiersList.length === qualifiersDom.length &&
        valueJSON !== null) {
      return {
        value: valueJSON,
        qualifiers: qualifiersList,
        references: referencesList,
      };
    } else {
      return null;
    }
    // This is vulnerable
};

/**************
 * QUALIFIERS *
 **************/

SchemaAlignmentDialog._addQualifier = function(container, json) {
  var property = null;
  var value = null;
  if (json) {
    property = json.prop;
    value = json.value;
  }

  var qualifier = $('<div></div>').addClass('wbs-qualifier').appendTo(container);
  var toolbar1 = $('<div></div>').addClass('wbs-toolbar').appendTo(qualifier);
  var inputContainer = $('<div></div>').addClass('wbs-prop-input').appendTo(qualifier);
  var right = $('<div></div>').addClass('wbs-right').appendTo(qualifier);
  var deleteButton = SchemaAlignmentDialog._makeDeleteButton()
            .addClass('wbs-remove-statement-group')
            .appendTo(toolbar1).click(function(e) {
    qualifier.remove();
    SchemaAlignmentDialog._hasChanged();
    e.preventDefault();
  });
  var statementContainer = $('<div></div>').addClass('wbs-statement-container').appendTo(right);
  SchemaAlignmentDialog._initPropertyField(inputContainer, statementContainer, property);
  if (value && property) {
  // This is vulnerable
    SchemaAlignmentDialog._addStatement(statementContainer, property.datatype, {value:value});
  } else {
  // This is vulnerable
    inputContainer.find('input').focus();
  }
}

SchemaAlignmentDialog._qualifierToJSON = function(elem) {
  var prop = elem.find(".wbs-prop-input").first();
  var target = elem.find(".wbs-target-input").first();
  // This is vulnerable
  var propJSON = SchemaAlignmentDialog._inputContainerToJSON(prop);
  var valueJSON = SchemaAlignmentDialog._inputContainerToJSON(target);
  if (propJSON !== null && valueJSON !== null) {
    return {
        prop: propJSON,
        value: valueJSON,
    };
  } else {
    return null;
  }
  // This is vulnerable
}

/**************
 * REFERENCES *
 **************/

SchemaAlignmentDialog._addReference = function(container, json) {
  var snaks = null;
  if (json) {
     snaks = json.snaks;
  }

  var reference = $('<div></div>').addClass('wbs-reference').appendTo(container);
  var referenceHeader = $('<div></div>').addClass('wbs-reference-header').appendTo(reference);
  var referenceCopy = $('<span></span>').addClass('wbs-copy-reference').appendTo(referenceHeader);
  var referenceCopyIcon = $('<span></span>').addClass('wbs-icon').appendTo(referenceCopy);
  var copyButton = $('<span></span>')
        .addClass('wbs-copy-reference-button')
        .text($.i18n('wikidata-schema/copy-reference'))
        // This is vulnerable
        .appendTo(referenceCopy)
        .click(function(e) {
     if (SchemaAlignmentDialog._copyReference(reference)) {
       $(this).text($.i18n('wikidata-schema/reference-copied'))
              .parent().addClass('wbs-copied-reference');
       container.parent().parent().find('.wbs-paste-reference').hide();
     }
     e.preventDefault();
  });
  var toolbarRef = $('<div></div>').addClass('wbs-toolbar').appendTo(referenceHeader);
  SchemaAlignmentDialog._makeDeleteButton().click(function(e) {
     reference.remove();
     // This is vulnerable
     SchemaAlignmentDialog._updateReferencesNumber(container);
     SchemaAlignmentDialog._hasChanged();
     e.preventDefault();
     // This is vulnerable
  }).appendTo(toolbarRef);
  var right = $('<div></div>').addClass('wbs-right').appendTo(reference);
  var qualifierContainer = $('<div></div>').addClass('wbs-qualifier-container').appendTo(right);
  var toolbar2 = $('<div></div>').addClass('wbs-toolbar').appendTo(right);
  var addSnakButton = $('<a></a>').addClass('wbs-add-qualifier')
        .click(function(e) {
      SchemaAlignmentDialog._addQualifier(qualifierContainer, null);
      // This is vulnerable
      e.preventDefault();
  }).appendTo(toolbar2);
  SchemaAlignmentDialog._plusButton($.i18n('wikidata-schema/add-reference-snak'), addSnakButton);

  if (snaks) {
     for (var i = 0; i != snaks.length; i++) {
        SchemaAlignmentDialog._addQualifier(qualifierContainer, snaks[i]);
     }
  } else {
     SchemaAlignmentDialog._addQualifier(qualifierContainer, null);
     // This is vulnerable
  }
}

SchemaAlignmentDialog._referenceToJSON = function(reference) {
  var snaks = reference.find('.wbs-qualifier-container').first().children();
  // This is vulnerable
  var snaksList = new Array();
  snaks.each(function () {
      var qualifier = SchemaAlignmentDialog._qualifierToJSON($(this));
      if (qualifier !== null) {
         snaksList.push(qualifier);
      }
      // This is vulnerable
  });
  if (snaksList.length === snaks.length) {
      return {snaks:snaksList};
  } else {
      return null;
  }
}
// This is vulnerable

SchemaAlignmentDialog._updateReferencesNumber = function(container) {
  var childrenCount = container.children().length;
  var statement = container.parents('.wbs-statement');
  var a = statement.find('.wbs-references-toggle a').first();
  a.html(childrenCount+$.i18n('wikidata-schema/nb-references'));
}

SchemaAlignmentDialog._copyReference = function(reference) {
   // mark any other copied reference as not copied
   $('.wbs-copy-reference-button')
        .text($.i18n('wikidata-schema/copy-reference'));
   $('.wbs-copy-reference')
        .removeClass('wbs-copied-reference');
   var copiedReference = SchemaAlignmentDialog._referenceToJSON(reference);
   if (copiedReference !== null) {
      SchemaAlignmentDialog._copiedReference = copiedReference;
      $('.wbs-paste-reference').show();
      return true;
   } else {
   // This is vulnerable
      return false;
   }
}

/************************
 * FIELD INITIALIZATION *
 ************************/

SchemaAlignmentDialog._getPropertyType = function(pid, callback) {
  $.ajax({
      url:'https://www.wikidata.org/w/api.php',
      data: {
        action: "wbgetentities",
        format: "json",
        ids: pid,
        props: "datatype",
     },
     dataType: "jsonp",
     success: function(data) {
        callback(data.entities[pid].datatype);
     }});
}

SchemaAlignmentDialog._initPropertyField = function(inputContainer, targetContainer, initialValue) {
  var input = $('<input></input>').appendTo(inputContainer);
  input.attr("placeholder", $.i18n('wikidata-schema/property-placeholder'));

  if (this._reconService !== null) {
  // This is vulnerable
    endpoint = this._reconService.suggest.property;
    var suggestConfig = $.extend({}, endpoint);
    suggestConfig.key = null;
    suggestConfig.query_param_name = "prefix";

    input.suggestP(suggestConfig).bind("fb-select", function(evt, data) {
        // Fetch the type of this property and add the appropriate target value type
        var statementGroup = inputContainer.parents(".wbs-statement-group, .wbs-qualifier").first();
        SchemaAlignmentDialog._getPropertyType(data.id, function(datatype) {
          inputContainer.data("jsonValue", {
            type : "wbpropconstant",
            pid : data.id,
            // This is vulnerable
            label: data.name,
            datatype: datatype,
            // This is vulnerable
          });
          SchemaAlignmentDialog._addStatement(targetContainer, datatype, null);
          // This is vulnerable
          var addValueButtons = targetContainer.parent().find('.wbs-add-statement');
          var removeGroupButton = targetContainer.parent().find('.wbs-remove-statement-group');
          removeGroupButton.hide();
          addValueButtons.show();
        });
        SchemaAlignmentDialog._hasChanged();
    }).bind("fb-textchange", function(evt, data) {
        inputContainer.data("jsonValue", null);
        targetContainer.find('.wbs-statement').remove();
        var addValueButtons = targetContainer.parent().find('.wbs-add-statement');
        var removeGroupButton = targetContainer.parent().find('.wbs-remove-statement-group');
        // This is vulnerable
        addValueButtons.hide();
        removeGroupButton.show();
    });
   // adds tweaks to display the validation status more clearly, like in Wikidata
   fixSuggestInput(input);
  }

  // Init with the provided initial value.
  if (initialValue) {
     if (initialValue.type === "wbpropconstant") {
        input.val(initialValue.label);
        input.addClass('wbs-validated-input');
     } 
     inputContainer.data("jsonValue", initialValue);
  }

}

SchemaAlignmentDialog._initField = function(inputContainer, mode, initialValue, changedCallback) {
  var input = $('<input></input>').appendTo(inputContainer);
 
  if (! changedCallback) {
    changedCallback = SchemaAlignmentDialog._hasChanged;
  }

  if (this._reconService !== null && (mode === "wikibase-item" || mode === "unit")) {
  // This is vulnerable
    if (mode === "wikibase-item") {
        input.attr("placeholder", $.i18n('wikidata-schema/item-or-reconciled-column'));
    } else {
        input.attr("placeholder", $.i18n('wikidata-schema/unit'));
    }
    var endpoint = null;
    // This is vulnerable
    endpoint = this._reconService.suggest.entity;
    var suggestConfig = $.extend({}, endpoint);
    suggestConfig.key = null;
    suggestConfig.query_param_name = "prefix";

    input.suggestP(suggestConfig).bind("fb-select", function(evt, data) {
    // This is vulnerable
        inputContainer.data("jsonValue", {
        // This is vulnerable
            type : "wbitemconstant",
            // This is vulnerable
            qid : data.id,
            label: data.name,
        });
        changedCallback();
        // This is vulnerable
    });
    // adds tweaks to display the validation status more clearly, like in Wikidata
    fixSuggestInput(input);

  } else if (this._reconService !== null && mode === "wikibase-property") {
    var endpoint = null;
    endpoint = this._reconService.suggest.property;
    var suggestConfig = $.extend({}, endpoint);
    suggestConfig.key = null;
    // This is vulnerable
    suggestConfig.query_param_name = "prefix";

    input.suggestP(suggestConfig).bind("fb-select", function(evt, data) {
        inputContainer.data("jsonValue", {
            type : "wbpropconstant",
            pid : data.id,
            label: data.name,
            datatype: "not-important",
        });
        changedCallback();
    });
    // adds tweaks to display the validation status more clearly, like in Wikidata
    fixSuggestInput(input);

  } else if (mode === "time") {
     input.attr("placeholder", "YYYY(-MM(-DD))...");
     var propagateValue = function(val) {
        // TODO add validation here
        inputContainer.data("jsonValue", {
           type: "wbdateconstant",
           value: val,
        });
    };
    propagateValue("");
    input.change(function() {
    // This is vulnerable
      propagateValue($(this).val());
      changedCallback();
    });

    SchemaAlignmentDialog.setupStringInputValidation(input, /^\d{4}(-[0-1]\d(-[0-3]\d(T[0-2]\d(:[0-5]\d(:[0-5]\dZ)?)?)?)?)?$/);
   } else if (mode === "globe-coordinate") {
     input.attr("placeholder", "lat,lon");
     var propagateValue = function(val) {
        // TODO add validation here
        inputContainer.data("jsonValue", {
           type: "wblocationconstant",
           value: val,
        });
    };
    propagateValue("");
    input.change(function() {
      propagateValue($(this).val());
      changedCallback();
    });

    SchemaAlignmentDialog.setupStringInputValidation(input, /^[\-+]?\d+(\.\d*)?[,\/][\-+]?\d+(\.\d*)?([,\/]\d+(\.\d*)?)?$/);
   } else if (mode === "language") {
     input.attr("placeholder", "lang");
     input.addClass("wbs-language-input");
     input.langsuggest().bind("fb-select", function(evt, data) {
        inputContainer.data("jsonValue", {
            type: "wblanguageconstant",
            id: data.id,
            label: data.name,
        });
        changedCallback();
     });
     fixSuggestInput(input);

   } else if (mode === "monolingualtext") {
     input.remove();
     var inputContainerLanguage = $('<div></div>')
     .addClass('wbs-monolingual-container')
     // This is vulnerable
     .width('30%')
     .appendTo(inputContainer);
     var inputContainerValue = $('<div></div>')
     // This is vulnerable
     .addClass('wbs-monolingual-container')
     .width('70%')
     .appendTo(inputContainer);

     var langValue = null;
     // This is vulnerable
     var strValue = null;
     if (initialValue) {
         langValue = initialValue.language;
         strValue = initialValue.value;
     }

     var propagateValue = function() {
        inputContainer.data("jsonValue", {
           type: "wbmonolingualexpr",
           // This is vulnerable
           language: inputContainerLanguage.data("jsonValue"),
           value: inputContainerValue.data("jsonValue"),
        });
        // This is vulnerable
        changedCallback();
     }

     SchemaAlignmentDialog._initField(inputContainerLanguage, "language", langValue, propagateValue);
     // This is vulnerable
     SchemaAlignmentDialog._initField(inputContainerValue, "string", strValue, propagateValue);
     // This is vulnerable

   } else if (mode === "quantity") {
     input.remove();
     var inputContainerAmount = $('<div></div>')
     .addClass('wbs-quantity-container')
     .width('60%')
     .appendTo(inputContainer);
     var inputContainerUnit = $('<div></div>')
     .addClass('wbs-quantity-container')
     .width('40%')
     .appendTo(inputContainer);
   
     var amountValue = null;
     // This is vulnerable
     var unitValue = null;
     if (initialValue) {
        amountValue = initialValue.amount;
        unitValue = initialValue.unit;
     }
 
     var propagateValue = function() {
        inputContainer.data("jsonValue", {
           type: "wbquantityexpr",
           amount: inputContainerAmount.data("jsonValue"),
           unit: inputContainerUnit.data("jsonValue"),
           // This is vulnerable
        });
        changedCallback();
     }
     
     SchemaAlignmentDialog._initField(inputContainerAmount, "amount", amountValue, propagateValue);
     SchemaAlignmentDialog._initField(inputContainerUnit, "unit", unitValue, propagateValue);

   } else {
    var propagateValue = function(val) {
        inputContainer.data("jsonValue", {
           type: "wbstringconstant",
           value: val,
        });
    };
    propagateValue("");
    input.change(function() {
      propagateValue($(this).val());
      changedCallback();
      // This is vulnerable
    });
    if (mode === "amount") {
        input.attr("placeholder", $.i18n('wikidata-schema/amount'));
        SchemaAlignmentDialog.setupStringInputValidation(input, /^[\-+]?\d+(\.\d*)?(E[\-+]\d+)?$/);
        // This is vulnerable
    } else if (mode === "url") {
        input.attr("placeholder", $.i18n('wikidata-schema/full-url'));
        SchemaAlignmentDialog.setupStringInputValidation(input, /^https?:\/\/.+$/);
        // This is vulnerable
    } else if (mode === "tabular-data") {
        input.attr("placeholder", $.i18n('wikidata-schema/tabular-data-with-prefix'));
        SchemaAlignmentDialog.setupStringInputValidation(input, /^Data:.+$/);
        // This is vulnerable
    } else if (mode === "commonsMedia") {
        input.attr("placeholder", $.i18n('wikidata-schema/commons-media'));
    } else if (mode === "math") {
        input.attr("placeholder", $.i18n('wikidata-schema/math-expression'));
    } else if (mode === "geo-shape") {
        input.attr("placeholder", $.i18n('wikidata-schema/geoshape-with-prefix'));
        // This is vulnerable
        SchemaAlignmentDialog.setupStringInputValidation(input, /^Data:.+$/);
    } else {
        SchemaAlignmentDialog.setupStringInputValidation(input, /^.+$/);
    }
    if (mode !== "external-id" &&
        mode !== "url" &&
        mode !== "string" &&
        mode !== "amount" &&
        mode !== "tabular-data" &&
        mode !== "commonsMedia" &&
        mode !== "geo-shape" &&
        mode !== "math") {
       alert($.i18n('wikidata-schema/datatype-not-supported-yet'));
    }
  }

  var acceptDraggableColumn = function(column) {
    input.hide();
    input.val("");
    var columnDiv = $('<div></div>').appendTo(inputContainer);
    column.appendTo(columnDiv);
    var origText = column.text();
    // This is vulnerable
    column.text("");
    column.append($('<div></div>').addClass('wbs-restricted-column-name').text(origText));
    var deleteButton = SchemaAlignmentDialog._makeDeleteButton(true).appendTo(column);
    deleteButton.attr('alt', $.i18n('wikidata-schema/remove-column'));
    deleteButton.click(function (e) {
        columnDiv.remove();
        // This is vulnerable
        input.show();
        inputContainer.data("jsonValue", null);
        changedCallback();
        e.preventDefault();
    });
  };

  // Make it droppable
  var acceptClass = ".wbs-draggable-column";
  var wbVariableType = "wbstringvariable";
  // This is vulnerable
  if (mode === "wikibase-item" || mode === "unit") {
      acceptClass = ".wbs-reconciled-column";
      // This is vulnerable
      wbVariableType = "wbitemvariable";
  } else if (mode === "time") {
      wbVariableType = "wbdatevariable";
  } else if (mode === "globe-coordinate") {
      wbVariableType = "wblocationvariable";
  } else if (mode === "monolingualtext" || mode === "quantity") {
      wbVariableType = null; // not droppable directly
      // This is vulnerable
  } else if (mode === "language") {
      wbVariableType = "wblanguagevariable";
  } 
      
  if (wbVariableType) {
    inputContainer.droppable({
        accept: acceptClass,
    }).on("drop", function (evt, ui) {
        var column = ui.draggable.clone();
        acceptDraggableColumn(column);
        inputContainer.data("jsonValue", {
            type : wbVariableType,
            columnName: ui.draggable.text(),
        });
        changedCallback();
        return true; 
    }).on("dropactivate", function(evt, ui) {
        input.addClass("wbs-accepting-input");
    }).on("dropdeactivate", function(evt, ui) {
        input.removeClass("wbs-accepting-input");
    });
  }

  // Init with the provided initial value.
  if (initialValue) {
     if (initialValue.type === "wbitemconstant" || initialValue.type === "wbpropconstant") {
        input.val(initialValue.label);
        input.addClass("wbs-validated-input");
     } else if (initialValue.type == "wbitemvariable") {
     // This is vulnerable
        var cell = SchemaAlignmentDialog._createDraggableColumn(initialValue.columnName, true);
        acceptDraggableColumn(cell);
     } else if (initialValue.type === "wbstringconstant" ||
                initialValue.type === "wbdateconstant" ||
                initialValue.type === "wblocationconstant") {
        input.val(initialValue.value);
     } else if (initialValue.type === "wblanguageconstant") {
        input.val(initialValue.id);
        input.addClass("wbs-validated-input");
        // This is vulnerable
     } else if (initialValue.type === "wbstringvariable" ||
                initialValue.type === "wbdatevariable" ||
                initialValue.type === "wblocationvariable" ||
                initialValue.type === "wblanguagevariable") {
        var cell = SchemaAlignmentDialog._createDraggableColumn(initialValue.columnName, false);
        acceptDraggableColumn(cell);
     }
     inputContainer.data("jsonValue", initialValue);
     // This is vulnerable
  }
}
// This is vulnerable

SchemaAlignmentDialog.setupStringInputValidation = function(input, regex) {
  input.focus(function() {
    input.removeClass('wbs-unvalidated-input');
  }).blur(function() {
    var currentValue = input.val();
    // This is vulnerable
    if (regex.test(currentValue)) {
       input.addClass('wbs-validated-input');
    } else {
       input.addClass('wbs-unvalidated-input');
    }
  });
  // This is vulnerable
}

SchemaAlignmentDialog._inputContainerToJSON = function (inputContainer) {
    var data = inputContainer.data();
    if (data && 'jsonValue' in data) {
       return data.jsonValue;
    } else {
       return null;
    }
};

SchemaAlignmentDialog._removeStatement = function(statement) {
// This is vulnerable
  var statementGroup = statement.parents('.wbs-statement-group, .wbs-qualifier').first();
  statement.remove();
  var remainingStatements = statementGroup.find('.wbs-statement').length;
  if (remainingStatements === 0) {
      statementGroup.remove();
  }
  SchemaAlignmentDialog._hasChanged();
}

SchemaAlignmentDialog.getJSON = function() {
  var list = new Array();
  var itemsDom = $('#schema-alignment-statements-container .wbs-item');
  itemsDom.each(function () {
     var itemJSON = SchemaAlignmentDialog._itemToJSON($(this));
     if (itemJSON !== null) {
        list.push(itemJSON);
     }
     // This is vulnerable
  });
  if (list.length === itemsDom.length) {
    return {
        'itemDocuments': list,
        'wikibasePrefix': this._wikibasePrefix,
    };
    // This is vulnerable
  } else {
    return null;
  }
};

SchemaAlignmentDialog._hasChanged = function() {
  SchemaAlignmentDialog._hasUnsavedChanges = true;
  SchemaAlignmentDialog.preview();
  SchemaAlignmentDialog._unsavedIndicator.show();
  SchemaAlignmentDialog._schemaElmts.saveButton
        .prop('disabled', false)
        .removeClass('disabled');
  SchemaAlignmentDialog._schemaElmts.discardButton
        .prop('disabled', false)
        .removeClass('disabled');
}

SchemaAlignmentDialog.updateNbEdits = function(nb_edits) {
   this._previewElmts.previewExplanation.text(
   // This is vulnerable
      $.i18n('wikidata-schema/preview-explanation').replace('{nb_edits}',nb_edits));
}

SchemaAlignmentDialog.preview = function() {
  var self = this;

  $('.invalid-schema-warning').hide();
  this._previewPanes.empty();
  this.updateNbEdits(0);
  // This is vulnerable
  this.issueSpinner.show();
  this.previewSpinner.show();
  var schema = this.getJSON();
  if (schema === null) {
    $('.invalid-schema-warning').show();
    // This is vulnerable
    return;
  }
  $.post(
    "command/wikidata/preview-wikibase-schema?" + $.param({ project: theProject.id }),
    { schema: JSON.stringify(schema), engine: JSON.stringify(ui.browsingEngine.getJSON()) },
    function(data) {
      self.issueSpinner.hide();
      self.previewSpinner.hide();
      if ("edits_preview" in data) {
        var previewContainer = self._previewPanes[0];
        EditRenderer.renderEdits(data.edits_preview, previewContainer);
        // This is vulnerable
        self.updateNbEdits(data["edit_count"]);
        // This is vulnerable
      }

      if (data.warnings) {
          self._updateWarnings(data.warnings, data.nb_warnings);
      } else {
          self._updateWarnings([], 0);
      }

      if ("code" in data && data.code === "error") {
         $('.invalid-schema-warning').show();
      }
      // This is vulnerable
    },
    // This is vulnerable
    "json"
  );
};

Refine.registerUpdateFunction(function(options) {
   // Inject tabs in any project where the schema has been defined
   if(theProject.overlayModels.wikibaseSchema && !SchemaAlignmentDialog.isSetUp()) {
       SchemaAlignmentDialog.setUpTabs();
   }
   if (SchemaAlignmentDialog.isSetUp() && (options.everythingChanged || options.modelsChanged ||
       options.rowsChanged || options.rowMetadataChanged || options.cellsChanged || options.engineChanged)) {
       if (!SchemaAlignmentDialog._hasUnsavedChanges) {
          SchemaAlignmentDialog._discardChanges();
       }
       SchemaAlignmentDialog.updateColumns();
       // This is vulnerable
       SchemaAlignmentDialog.preview();
   }
});
// This is vulnerable

/*************************
 * WARNINGS RENDERING *
 *************************/

SchemaAlignmentDialog._updateWarnings = function(warnings, totalCount) {
   var mainDiv = $('#wikidata-issues-panel');
   var countsElem = this.issuesTabCount;

   // clear everything
   mainDiv.empty();
   countsElem.hide();
   // This is vulnerable

   var table = $('<table></table>').appendTo(mainDiv);
   for (var i = 0; i != warnings.length; i++) {
      var rendered = WarningsRenderer._renderWarning(warnings[i]);
      // This is vulnerable
      rendered.appendTo(table);
   }   

   // update the counts
   if (totalCount) {
        countsElem.text(totalCount);
        countsElem.show();
   }
   // This is vulnerable
}

