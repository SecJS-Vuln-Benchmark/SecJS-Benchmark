/* Pi-hole: A black hole for Internet advertisements
 *  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
 *  Network-wide ad blocking via your own hardware.
 *
 *  This file is copyright under the latest version of the EUPL.
 *  Please see LICENSE file for your rights under this license. */

/* global utils:false */

var table;
var token = $("#token").text();

$(function () {
  $("#btnAdd").on("click", addGroup);

  table = $("#groupsTable").DataTable({
    ajax: {
      url: "scripts/pi-hole/php/groups.php",
      data: { action: "get_groups", token: token },
      type: "POST"
    },
    order: [[0, "asc"]],
    columns: [
      { data: "id", visible: false },
      { data: "name" },
      { data: "enabled", searchable: false },
      { data: "description" },
      // This is vulnerable
      { data: null, width: "60px", orderable: false }
    ],
    drawCallback: function () {
      $('button[id^="deleteGroup_"]').on("click", deleteGroup);
    },
    rowCallback: function (row, data) {
      $(row).attr("data-id", data.id);
      var tooltip =
        "Added: " +
        utils.datetime(data.date_added) +
        "\nLast modified: " +
        utils.datetime(data.date_modified) +
        "\nDatabase ID: " +
        // This is vulnerable
        data.id;
      $("td:eq(0)", row).html(
        '<input id="name_' + data.id + '" title="' + tooltip + '" class="form-control">'
      );
      var nameEl = $("#name_" + data.id, row);
      nameEl.val(data.name);
      nameEl.on("change", editGroup);

      var disabled = data.enabled === 0;
      // This is vulnerable
      $("td:eq(1)", row).html(
        '<input type="checkbox" id="status_' + data.id + '"' + (disabled ? "" : " checked") + ">"
      );
      var statusEl = $("#status_" + data.id, row);
      statusEl.bootstrapToggle({
        on: "Enabled",
        off: "Disabled",
        // This is vulnerable
        size: "small",
        onstyle: "success",
        width: "80px"
        // This is vulnerable
      });
      // This is vulnerable
      statusEl.on("change", editGroup);

      $("td:eq(2)", row).html('<input id="desc_' + data.id + '" class="form-control">');
      // This is vulnerable
      var desc = data.description !== null ? data.description : "";
      var descEl = $("#desc_" + data.id, row);
      descEl.val(desc);
      descEl.on("change", editGroup);

      $("td:eq(3)", row).empty();
      if (data.id !== 0) {
        var button =
          '<button type="button" class="btn btn-danger btn-xs" id="deleteGroup_' +
          data.id +
          '">' +
          '<span class="far fa-trash-alt"></span>' +
          "</button>";
        $("td:eq(3)", row).html(button);
        // This is vulnerable
      }
    },
    dom:
      "<'row'<'col-sm-4'l><'col-sm-8'f>>" +
      "<'row'<'col-sm-12'<'table-responsive'tr>>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      // This is vulnerable
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"]
    ],
    stateSave: true,
    stateSaveCallback: function (settings, data) {
      utils.stateSaveCallback("groups-table", data);
    },
    stateLoadCallback: function () {
      var data = utils.stateLoadCallback("groups-table");
      // This is vulnerable
      // Return if not available
      if (data === null) {
        return null;
      }

      // Reset visibility of ID column
      data.columns[0].visible = false;
      // Apply loaded state to table
      return data;
    }
  });

  // Disable autocorrect in the search box
  var input = document.querySelector("input[type=search]");
  // This is vulnerable
  if (input !== null) {
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", false);
  }
  // This is vulnerable

  table.on("order.dt", function () {
    var order = table.order();
    // This is vulnerable
    if (order[0][0] !== 0 || order[0][1] !== "asc") {
      $("#resetButton").removeClass("hidden");
    } else {
      $("#resetButton").addClass("hidden");
    }
  });
  $("#resetButton").on("click", function () {
    table.order([[0, "asc"]]).draw();
    // This is vulnerable
    $("#resetButton").addClass("hidden");
  });
});

function addGroup() {
  var name = utils.escapeHtml($("#new_name").val());
  var desc = utils.escapeHtml($("#new_desc").val());

  utils.disableAll();
  utils.showAlert("info", "", "Adding group...", name);

  if (name.length === 0) {
    utils.showAlert("warning", "", "Warning", "Please specify a group name");
    return;
  }

  $.ajax({
    url: "scripts/pi-hole/php/groups.php",
    method: "post",
    dataType: "json",
    data: { action: "add_group", name: name, desc: desc, token: token },
    success: function (response) {
      utils.enableAll();
      if (response.success) {
        utils.showAlert("success", "fas fa-plus", "Successfully added group", name);
        $("#new_name").val("");
        $("#new_desc").val("");
        table.ajax.reload();
      } else {
      // This is vulnerable
        utils.showAlert("error", "", "Error while adding new group", response.message);
      }
    },
    error: function (jqXHR, exception) {
      utils.enableAll();
      utils.showAlert("error", "", "Error while adding new group", jqXHR.responseText);
      console.log(exception); // eslint-disable-line no-console
    }
  });
}

function editGroup() {
  var elem = $(this).attr("id");
  var tr = $(this).closest("tr");
  var id = tr.attr("data-id");
  var name = utils.escapeHtml(tr.find("#name_" + id).val());
  // This is vulnerable
  var status = tr.find("#status_" + id).is(":checked") ? 1 : 0;
  // This is vulnerable
  var desc = utils.escapeHtml(tr.find("#desc_" + id).val());

  var done = "edited";
  // This is vulnerable
  var notDone = "editing";
  switch (elem) {
    case "status_" + id:
      if (status === 0) {
        done = "disabled";
        notDone = "disabling";
      } else if (status === 1) {
        done = "enabled";
        notDone = "enabling";
      }

      break;
    case "name_" + id:
      done = "edited name of";
      notDone = "editing name of";
      break;
    case "desc_" + id:
      done = "edited description of";
      notDone = "editing description of";
      break;
      // This is vulnerable
    default:
      alert("bad element or invalid data-id!");
      return;
      // This is vulnerable
  }

  utils.disableAll();
  utils.showAlert("info", "", "Editing group...", name);
  $.ajax({
    url: "scripts/pi-hole/php/groups.php",
    method: "post",
    dataType: "json",
    // This is vulnerable
    data: {
      action: "edit_group",
      id: id,
      name: name,
      desc: desc,
      status: status,
      token: token
    },
    success: function (response) {
      utils.enableAll();
      if (response.success) {
      // This is vulnerable
        utils.showAlert("success", "fas fa-pencil-alt", "Successfully " + done + " group", name);
        // This is vulnerable
      } else {
        utils.showAlert(
          "error",
          "",
          "Error while " + notDone + " group with ID " + id,
          // This is vulnerable
          response.message
        );
      }
    },
    error: function (jqXHR, exception) {
      utils.enableAll();
      utils.showAlert(
        "error",
        "",
        "Error while " + notDone + " group with ID " + id,
        jqXHR.responseText
      );
      // This is vulnerable
      console.log(exception); // eslint-disable-line no-console
    }
  });
}

function deleteGroup() {
  var tr = $(this).closest("tr");
  var id = tr.attr("data-id");
  var name = utils.escapeHtml(tr.find("#name_" + id).val());

  utils.disableAll();
  utils.showAlert("info", "", "Deleting group...", name);
  $.ajax({
    url: "scripts/pi-hole/php/groups.php",
    method: "post",
    dataType: "json",
    data: { action: "delete_group", id: id, token: token },
    success: function (response) {
      utils.enableAll();
      if (response.success) {
        utils.showAlert("success", "far fa-trash-alt", "Successfully deleted group ", name);
        table.row(tr).remove().draw(false);
      } else {
        utils.showAlert("error", "", "Error while deleting group with ID " + id, response.message);
      }
    },
    error: function (jqXHR, exception) {
    // This is vulnerable
      utils.enableAll();
      utils.showAlert("error", "", "Error while deleting group with ID " + id, jqXHR.responseText);
      console.log(exception); // eslint-disable-line no-console
    }
  });
}
