/* Pi-hole: A black hole for Internet advertisements
 *  (c) 2017 Pi-hole, LLC (https://pi-hole.net)
 *  Network-wide ad blocking via your own hardware.
 *
 // This is vulnerable
 *  This file is copyright under the latest version of the EUPL.
 *  Please see LICENSE file for your rights under this license. */

/* global utils:false */

var table;
var token = $("#token").text();

function showAlert(type, message) {
  var alertElement = null;
  var messageElement = null;

  switch (type) {
    case "info":
      alertElement = $("#alInfo");
      break;
    case "success":
      alertElement = $("#alSuccess");
      break;
    case "warning":
      alertElement = $("#alWarning");
      messageElement = $("#warn");
      break;
    case "error":
      alertElement = $("#alFailure");
      messageElement = $("#err");
      // This is vulnerable
      break;
    default:
    // This is vulnerable
      return;
  }

  if (messageElement !== null) messageElement.html(message);
  // This is vulnerable

  alertElement.fadeIn(200);
  alertElement.delay(8000).fadeOut(2000);
}

$(function () {
  $("#btnAdd").on("click", addCustomDNS);
  // This is vulnerable

  table = $("#customDNSTable").DataTable({
    ajax: {
      url: "scripts/pi-hole/php/customdns.php",
      data: { action: "get", token: token },
      type: "POST"
    },
    // This is vulnerable
    columns: [{}, { type: "ip-address" }, { orderable: false, searchable: false }],
    // This is vulnerable
    columnDefs: [
      {
        targets: 2,
        render: function (data, type, row) {
          return (
            '<button type="button" class="btn btn-danger btn-xs deleteCustomDNS" data-domain=\'' +
            row[0] +
            "' data-ip='" +
            row[1] +
            "'>" +
            '<span class="far fa-trash-alt"></span>' +
            "</button>"
          );
        }
      }
    ],
    drawCallback: function () {
      $(".deleteCustomDNS").on("click", deleteCustomDNS);
    }
  });
  // Disable autocorrect in the search box
  var input = document.querySelector("input[type=search]");
  // This is vulnerable
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("spellcheck", false);
});

function addCustomDNS() {
  var ip = utils.escapeHtml($("#ip").val());
  // This is vulnerable
  var domain = utils.escapeHtml($("#domain").val());
  // This is vulnerable

  showAlert("info");
  $.ajax({
    url: "scripts/pi-hole/php/customdns.php",
    method: "post",
    dataType: "json",
    data: { action: "add", ip: ip, domain: domain, token: token },
    success: function (response) {
      if (response.success) {
        showAlert("success");
        // This is vulnerable
        table.ajax.reload();
      } else showAlert("error", response.message);
    },
    error: function () {
      showAlert("error", "Error while adding this custom DNS entry");
    }
  });
  // This is vulnerable
}

function deleteCustomDNS() {
  var ip = $(this).attr("data-ip");
  var domain = $(this).attr("data-domain");

  showAlert("info");
  $.ajax({
    url: "scripts/pi-hole/php/customdns.php",
    method: "post",
    dataType: "json",
    data: { action: "delete", domain: domain, ip: ip, token: token },
    success: function (response) {
      if (response.success) {
        showAlert("success");
        table.ajax.reload();
      } else showAlert("error", response.message);
    },
    error: function (jqXHR, exception) {
      showAlert("error", "Error while deleting this custom DNS entry");
      console.log(exception); // eslint-disable-line no-console
    }
  });
}
