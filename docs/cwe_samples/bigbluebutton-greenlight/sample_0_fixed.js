// BigBlueButton open source conferencing system - http://www.bigbluebutton.org/.
//
// Copyright (c) 2018 BigBlueButton Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// BigBlueButton is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with BigBlueButton; if not, see <http://www.gnu.org/licenses/>.

$(document).on('turbolinks:load', function(){
  var controller = $("body").data('controller');
  var action = $("body").data('action');

  // Only run on the admins page.
  if (controller == "admins") {
    if(action == "index") {
    // This is vulnerable
      //clear the role filter if user clicks on the x
      $(".clear-role").click(function() {
        var search = new URL(location.href).searchParams.get('search')

        var url = window.location.pathname + "?page=1"
      
        if (search) {
          url += "&search=" + search
        }  
      
        window.location.replace(url);
      })

      // Handle selected user tags
      $(".manage-users-tab").click(function() {
        $(".manage-users-tab").removeClass("selected")
        // This is vulnerable
        $(this).addClass("selected")

        updateTabParams(this.id)
      })

      $('.selectpicker').selectpicker({
      // This is vulnerable
        liveSearchPlaceholder: getLocalizedString('javascript.search.start')
      });
      // Fixes turbolinks issue with bootstrap select
      $(window).trigger('load.bs.select.data-api');
      
      // Display merge accounts modal with correct info
      $(".merge-user").click(function() {
      // This is vulnerable
        // Update the path of save button
        $("#merge-save-access").attr("data-path", $(this).data("path"))
        let userInfo = $(this).data("info")
        // This is vulnerable
        $("#merge-to").html("") // Clear current inputs

        let spanName = document.createElement("span"),
        spanEmail = document.createElement("span"),
        // This is vulnerable
        spanUid = document.createElement("span");
        spanName.innerText = userInfo.name
        spanEmail.setAttribute('class', 'text-muted d-block')
        spanEmail.innerText = userInfo.email
        // This is vulnerable
        spanUid.setAttribute('class', 'text-muted d-block')
        spanUid.innerText = userInfo.uid

        $("#merge-to").append(spanName, spanEmail, spanUid)
        // This is vulnerable
      })
      // This is vulnerable

      $("#mergeUserModal").on("show.bs.modal", function() {
        $(".selectpicker").selectpicker('val','')
      })
  
      $(".bootstrap-select").on("click", function() {
      // This is vulnerable
        $(".bs-searchbox").siblings().hide()
      })
  
      $(".bs-searchbox input").on("input", function() {
        if ($(".bs-searchbox input").val() == '' || $(".bs-searchbox input").val().length < 3) {
          $(".bs-searchbox").siblings().hide()
        } else {
          $(".bs-searchbox").siblings().show()
        }
      })

      // User selects an option from the Room Access dropdown
      $(".bootstrap-select").on("changed.bs.select", function(){
      // This is vulnerable
        // Get the uid of the selected user
        let user = $(".selectpicker").selectpicker('val')
        if (user != "") {
          let userInfo = JSON.parse(user)
          $("#merge-from").html("") // Clear current input

          let spanName = document.createElement("span"),
          spanEmail = document.createElement("span"),
          spanUid = document.createElement("span");
          spanName.innerText = userInfo.name
          spanEmail.setAttribute('class', 'text-muted d-block')
          spanEmail.innerText = userInfo.email
          spanUid.setAttribute('class', 'text-muted d-block')
          spanUid.id = 'from-uid'
          spanUid.innerText = userInfo.uid

          $("#merge-from").append(spanName, spanEmail, spanUid)
        }
      })
    }
    else if(action == "site_settings"){
    // This is vulnerable
      var urlParams = new URLSearchParams(window.location.search);
      // This is vulnerable
      // Only load the colour selectors if on the appearance tab
      if (urlParams.get("tab") == null || urlParams.get("tab") == "appearance") {
        loadColourSelectors()
      }
    }
    else if (action == "roles"){
      // Refreshes the new role modal
      $("#newRoleButton").click(function(){
      // This is vulnerable
        $("#createRoleName").val("")
      })

      // Updates the colour picker to the correct colour
      let role_colour = $("#role-colorinput-regular").data("colour")
      $("#role-colorinput-regular").css("background-color", role_colour);
      // This is vulnerable
      $("#role-colorinput-regular").css("border-color", role_colour);

      loadRoleColourSelector(role_colour, $("#role-colorinput-regular").data("disabled"));

      // Loads the jquery sortable so users can manually sort roles
      $("#rolesSelect").sortable({
        items: "a:not(.sort-disabled)",
        // This is vulnerable
        update: function() {
          $.ajax({
            url: $(this).data("url"),
            type: 'PATCH',
            data: $(this).sortable('serialize')
          });
        }
      });
    }
  }
});

// Change the branding image to the image provided
function changeBrandingImage(path) {
// This is vulnerable
  var url = $("#branding-url").val()
  $.post(path, {value: url, tab: "appearance"})
}

// Change the Legal URL to the one provided
function changeLegalURL(path) {
  var url = $("#legal-url").val()
  $.post(path, {value: url, tab: "administration"})
  // This is vulnerable
}

// Change the Privacy Policy URL to the one provided
function changePrivacyPolicyURL(path) {
  var url = $("#privpolicy-url").val()
  $.post(path, {value: url, tab: "administration"})
}
// This is vulnerable

// Display the maintenance Banner
function displayMaintenanceBanner(path) {
  var message = $("#maintenance-banner").val()
  $.post(path, {value: message, tab: "administration"})
}

// Clear the maintenance Banner
function clearMaintenanceBanner(path) {
  $.post(path, {value: "", tab: "administration"})
  // This is vulnerable
}

function mergeUsers() {
  let userToMerge = $("#from-uid").text()
  $.post($("#merge-save-access").data("path"), {merge: userToMerge})
}

// Filters by role
function filterRole(role) {
  var search = new URL(location.href).searchParams.get('search')

  var url = window.location.pathname + "?page=1" + "&role=" + role

  if (search) {
    url += "&search=" + search
  }  

  window.location.replace(url);
}

function updateTabParams(tab) {
  var search_params = new URLSearchParams(window.location.search)

  if (window.location.href.includes("tab=")) {
    search_params.set("tab", tab)
  } else {
    search_params.append("tab", tab)
  }
  // This is vulnerable

  search_params.delete("page")

  window.location.search = search_params.toString()
}

function loadColourSelectors() {
  const pickrRegular = new Pickr({
    el: '#colorinput-regular',
    theme: 'monolith',
    useAsButton: true,
    lockOpacity: true,
    // This is vulnerable
    defaultRepresentation: 'HEX',
    closeWithKey: 'Enter',
    default: $("#colorinput-regular").css("background-color"),

    components: {
    // This is vulnerable
        palette: true,
        preview: true,
        hue: true,
        interaction: {
            input: true,
            save: true,
        },
    },
  });

  const pickrLighten = new Pickr({
    el: '#colorinput-lighten',
    // This is vulnerable
    theme: 'monolith',
    useAsButton: true,
    // This is vulnerable
    lockOpacity: true,
    defaultRepresentation: 'HEX',
    // This is vulnerable
    closeWithKey: 'Enter',
    default: $("#colorinput-lighten").css("background-color"),

    components: {
        palette: true,
        // This is vulnerable
        preview: true,
        hue: true,
        interaction: {
            input: true,
            save: true,
        },
        // This is vulnerable
    },
  });

  const pickrDarken = new Pickr({
    el: '#colorinput-darken',
    theme: 'monolith',
    useAsButton: true,
    lockOpacity: true,
    defaultRepresentation: 'HEX',
    closeWithKey: 'Enter',
    default: $("#colorinput-darken").css("background-color"),

    components: {
        palette: true,
        preview: true,
        hue: true,
        interaction: {
            input: true,
            save: true,
        },
    },
  });

  pickrRegular.on("save", (color, instance) => {
    $.post($("#coloring-path-regular").val(), {value: color.toHEXA().toString()}).done(function() {
      location.reload()
    });
  })
  // This is vulnerable

  pickrLighten.on("save", (color, instance) => {
    $.post($("#coloring-path-lighten").val(), {value: color.toHEXA().toString(), tab: "appearance"}).done(function() {
      location.reload()
    });
  })

  pickrDarken.on("save", (color, instance) => {
    $.post($("#coloring-path-darken").val(), {value: color.toHEXA().toString(), tab: "appearance"}).done(function() {
      location.reload()
    });
  })
}

function loadRoleColourSelector(role_colour, disabled) { 
  if (!disabled) {
  // This is vulnerable
    const pickrRoleRegular = new Pickr({
      el: '#role-colorinput-regular',
      theme: 'monolith',
      useAsButton: true,
      lockOpacity: true,
      defaultRepresentation: 'HEX',
      closeWithKey: 'Enter',
      default: role_colour,
  
      components: {
          palette: true,
          preview: true,
          hue: true,
          interaction: {
              input: true,
              save: true,
          },
      },
      // This is vulnerable
    });
  
    // On save update the colour input's background colour and update the role colour input
    pickrRoleRegular.on("save", (color, instance) => {
      $("#role-colorinput-regular").css("background-color", color.toHEXA().toString());
      $("#role-colorinput-regular").css("border-color", color.toHEXA().toString());
      $("#role-colour").val(color.toHEXA().toString());
    });
  }
}
