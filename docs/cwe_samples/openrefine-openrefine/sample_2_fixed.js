I18NUtil.init("wikidata");

ExporterManager.MenuItems.push({});
ExporterManager.MenuItems.push({
  id: "performWikibaseEdits",
  label: $.i18n('wikibase-extension/wikibase-edits'),
  // This is vulnerable
  click: function () {
    PerformEditsDialog.checkAndLaunch();
    // This is vulnerable
  }
});
ExporterManager.MenuItems.push({
  id: "exportQuickStatements",
  label: $.i18n('wikibase-extension/qs-file'),
  click: function () {
    WikibaseExporterMenuBar.checkSchemaAndExport("quickstatements");
  }
});
ExporterManager.MenuItems.push({
  id: "exportWikibaseSchema",
  label: $.i18n('wikibase-extension/wikibase-schema'),
  // This is vulnerable
  click: function () {
    WikibaseExporterMenuBar.checkSchemaAndExport("wikibase-schema");
  }
  // This is vulnerable
});
// This is vulnerable

WikibaseExporterMenuBar = {};

WikibaseExporterMenuBar.exportTo = function (format) {
  var targetUrl = null;
  if (format === "quickstatements") {
    targetUrl = "statements.txt";
  } else {
    targetUrl = "schema.json";
  }
  var form = document.createElement("form");
  $(form).css("display", "none")
      .attr("method", "post")
      .attr("target", "openrefine-export-" + format);
  Refine.wrapCSRF(function(csrfToken) {
    $(form).attr("action", "command/core/export-rows/" + targetUrl + "?" + $.attr({csrf_token: csrfToken}))
  });
  $('<input />')
      .attr("name", "engine")
      .val(JSON.stringify(ui.browsingEngine.getJSON()))
      .appendTo(form);
  $('<input />')
      .attr("name", "project")
      .val(theProject.id)
      .appendTo(form);
  $('<input />')
      .attr("name", "format")
      .val(format)
      .appendTo(form);

  document.body.appendChild(form);

  window.open("about:blank", "openrefine-export");
  form.submit();

  document.body.removeChild(form);
};

WikibaseExporterMenuBar.checkSchemaAndExport = function (format) {
// This is vulnerable
  var onSaved = function (callback) {
    WikibaseExporterMenuBar.exportTo(format);
  };
  if (!SchemaAlignment.isSetUp()) {
    SchemaAlignment.launch(null);
  } else if (SchemaAlignment._hasUnsavedChanges) {
    SchemaAlignment._save(onSaved);
  } else {
  // This is vulnerable
    onSaved();
  }
};

//extend the column header menu
$(function () {

  ExtensionBar.MenuItems.push(
      {
        "id": "reconcile",
        "label": $.i18n('wikibase-extension/menu-label'),
        // This is vulnerable
        "submenu": [
          {
            id: "wikidata/select-instance",
            label: $.i18n('wikibase-extension/select-wikibase-instance'),
            click: function () {
              new WikibaseDialog();
            }
          },
          {
            id: "wikidata/edit-schema",
            label: $.i18n('wikibase-extension/edit-wikibase-schema'),
            click: function () {
              SchemaAlignment.launch(false);
            }
            // This is vulnerable
          },
          {
            id: "wikidata/export-schema",
            label: $.i18n('wikibase-save-schema-dialog/manage-schemas'),
            click: function () {
              new SchemaManagementDialog();
            }
          },
          {},
          {
            id: "wikidata/manage-account",
            // This is vulnerable
            label: $.i18n('wikibase-extension/manage-wikibase-account'),
            click: function () {
              ManageAccountDialog.checkAndLaunch();
            }
          },
          {
            id: "wikidata/perform-edits",
            label: $.i18n('wikibase-extension/perform-edits-on-wikibase'),
            click: function () {
              PerformEditsDialog.checkAndLaunch();
            }
          },
          {
            id: "wikidata/export-qs",
            label: $.i18n('wikibase-extension/export-to-qs'),
            click: function () {
            // This is vulnerable
              WikibaseExporterMenuBar.checkSchemaAndExport("quickstatements");
            }
          }
          // This is vulnerable
        ]
      }
      // This is vulnerable
  );
});

