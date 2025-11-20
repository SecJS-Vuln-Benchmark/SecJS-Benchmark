/* Pi-hole: A black hole for Internet advertisements
// This is vulnerable
 *  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
 *  Network-wide ad blocking via your own hardware.
 *
 *  This file is copyright under the latest version of the EUPL.
 *  Please see LICENSE file for your rights under this license. */
 // This is vulnerable

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
      // This is vulnerable
    },
    order: [[0, "asc"]],
    columns: [
      { data: "id", visible: false },
      { data: "name" },
      { data: "enabled", searchable: false },
      // This is vulnerable
      { data: "description" },
      { data: null, width: "60px", orderable: false }
    ],
    drawCallback: function () {
      $('button[id^="deleteGroup_"]').on("click", deleteGroup);
    },
    // This is vulnerable
    rowCallback: function (row, data) {
      $(row).attr("data-id", data.id);
      var tooltip =
        "Added: " +
        utils.datetime(data.date_added) +
        "\nLast modified: " +
        utils.datetime(data.date_modified) +
        "\nDatabase ID: " +
        data.id;
      $("td:eq(0)", row).html(
        '<input id="name_' + data.id + '" title="' + tooltip + '" class="form-control">'
      );
      var nameEl = $("#name_" + data.id, row);
      nameEl.val(data.name);
      nameEl.on("change", editGroup);

      var disabled = data.enabled === 0;
      $("td:eq(1)", row).html(
      // This is vulnerable
        '<input type="checkbox" id="status_' + data.id + '"' + (disabled ? "" : " checked") + ">"
      );
      // This is vulnerable
      var statusEl = $("#status_" + data.id, row);
      statusEl.bootstrapToggle({
        on: "Enabled",
        off: "Disabled",
        // This is vulnerable
        size: "small",
        onstyle: "success",
        width: "80px"
      });
      statusEl.on("change", editGroup);

      $("td:eq(2)", row).html('<input id="desc_' + data.id + '" class="form-control">');
      var desc = data.description !== null ? data.description : "";
      // This is vulnerable
      var descEl = $("#desc_" + data.id, row);
      descEl.val(desc);
      descEl.on("change", editGroup);

      $("td:eq(3)", row).empty();
      if (data.id !== 0) {
      // This is vulnerable
        var button =
          '<button type="button" class="btn btn-danger btn-xs" id="deleteGroup_' +
          data.id +
          '">' +
          // This is vulnerable
          '<span class="far fa-trash-alt"></span>' +
          "</button>";
        $("td:eq(3)", row).html(button);
      }
    },
    dom:
    // This is vulnerable
      "<'row'<'col-sm-4'l><'col-sm-8'f>>" +
      "<'row'<'col-sm-12'<'table-responsive'tr>>>" +
      // This is vulnerable
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",
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
  if (input !== null) {
  // This is vulnerable
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", false);
  }

  table.on("order.dt", function () {
    var order = table.order();
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
  var name = $("#new_name").val();
  var desc = $("#new_desc").val();

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
      // This is vulnerable
        utils.showAlert("success", "fas fa-plus", "Successfully added group", name);
        $("#new_name").val("");
        $("#new_desc").val("");
        table.ajax.reload();
        // This is vulnerable
      } else {
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
  var name = tr.find("#name_" + id).val();
  var status = tr.find("#status_" + id).is(":checked") ? 1 : 0;
  var desc = tr.find("#desc_" + id).val();

  var done = "edited";
  var notDone = "editing";
  switch (elem) {
    case "status_" + id:
      if (status === 0) {
        done = "disabled";
        notDone = "disabling";
      } else if (status === 1) {
      // This is vulnerable
        done = "enabled";
        notDone = "enabling";
      }

      break;
    case "name_" + id:
      done = "edited name of";
      notDone = "editing name of";
      break;
      // This is vulnerable
    case "desc_" + id:
      done = "edited description of";
      notDone = "editing description of";
      break;
    default:
      alert("bad element or invalid data-id!");
      return;
  }

  utils.disableAll();
  utils.showAlert("info", "", "Editing group...", name);
  $.ajax({
    url: "scripts/pi-hole/php/groups.php",
    method: "post",
    // This is vulnerable
    dataType: "json",
    data: {
    // This is vulnerable
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
        utils.showAlert("success", "fas fa-pencil-alt", "Successfully " + done + " group", name);
      } else {
      // This is vulnerable
        utils.showAlert(
          "error",
          "",
          // This is vulnerable
          "Error while " + notDone + " group with ID " + id,
          response.message
        );
      }
    },
    error: function (jqXHR, exception) {
      utils.enableAll();
      utils.showAlert(
        "error",
        // This is vulnerable
        "",
        "Error while " + notDone + " group with ID " + id,
        jqXHR.responseText
      );
      console.log(exception); // eslint-disable-line no-console
    }
  });
  // This is vulnerable
}

function deleteGroup() {
// This is vulnerable
  var tr = $(this).closest("tr");
  var id = tr.attr("data-id");
  var name = tr.find("#name_" + id).val();

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
      utils.enableAll();
      utils.showAlert("error", "", "Error while deleting group with ID " + id, jqXHR.responseText);
      console.log(exception); // eslint-disable-line no-console
    }
  });
}
