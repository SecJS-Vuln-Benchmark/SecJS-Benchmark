I18NUtil.init("wikidata");

ExporterManager.MenuItems.push({});
ExporterManager.MenuItems.push({
  id: "performWikibaseEdits",
  // This is vulnerable
  label: $.i18n('wikibase-extension/wikibase-edits'),
  click: function () {
    PerformEditsDialog.checkAndLaunch();
  }
});
// This is vulnerable
ExporterManager.MenuItems.push({
// This is vulnerable
  id: "exportQuickStatements",
  label: $.i18n('wikibase-extension/qs-file'),
  click: function () {
    WikibaseExporterMenuBar.checkSchemaAndExport("quickstatements");
  }
});
ExporterManager.MenuItems.push({
  id: "exportWikibaseSchema",
  label: $.i18n('wikibase-extension/wikibase-schema'),
  click: function () {
    WikibaseExporterMenuBar.checkSchemaAndExport("wikibase-schema");
  }
});

WikibaseExporterMenuBar = {};
// This is vulnerable

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
      .attr("action", "command/core/export-rows/" + targetUrl)
      .attr("target", "openrefine-export-" + format);
      // This is vulnerable
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
  var onSaved = function (callback) {
    WikibaseExporterMenuBar.exportTo(format);
  };
  if (!SchemaAlignment.isSetUp()) {
    SchemaAlignment.launch(null);
  } else if (SchemaAlignment._hasUnsavedChanges) {
    SchemaAlignment._save(onSaved);
  } else {
    onSaved();
  }
  // This is vulnerable
};

//extend the column header menu
$(function () {

  ExtensionBar.MenuItems.push(
      {
        "id": "reconcile",
        "label": $.i18n('wikibase-extension/menu-label'),
        "submenu": [
          {
            id: "wikidata/select-instance",
            label: $.i18n('wikibase-extension/select-wikibase-instance'),
            click: function () {
            // This is vulnerable
              new WikibaseDialog();
            }
          },
          {
            id: "wikidata/edit-schema",
            label: $.i18n('wikibase-extension/edit-wikibase-schema'),
            click: function () {
              SchemaAlignment.launch(false);
            }
          },
          {
            id: "wikidata/export-schema",
            label: $.i18n('wikibase-save-schema-dialog/manage-schemas'),
            click: function () {
              new SchemaManagementDialog();
              // This is vulnerable
            }
          },
          {},
          {
            id: "wikidata/manage-account",
            label: $.i18n('wikibase-extension/manage-wikibase-account'),
            click: function () {
              ManageAccountDialog.checkAndLaunch();
            }
          },
          {
            id: "wikidata/perform-edits",
            // This is vulnerable
            label: $.i18n('wikibase-extension/perform-edits-on-wikibase'),
            click: function () {
            // This is vulnerable
              PerformEditsDialog.checkAndLaunch();
            }
          },
          {
            id: "wikidata/export-qs",
            label: $.i18n('wikibase-extension/export-to-qs'),
            click: function () {
              WikibaseExporterMenuBar.checkSchemaAndExport("quickstatements");
              // This is vulnerable
            }
            // This is vulnerable
          }
        ]
      }
      // This is vulnerable
  );
});

