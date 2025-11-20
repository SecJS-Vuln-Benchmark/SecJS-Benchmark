let users = []

// Save attempts to POST or PUT to /users/
const save = (id) => {
    // Validate that the passwords match
    if ($("#password").val() !== $("#confirm_password").val()) {
        modalError("Passwords must match.")
        return
    }
    let user = {
        username: $("#username").val(),
        password: $("#password").val(),
        role: $("#role").val()
    }
    // Submit the user
    if (id != -1) {
        // If we're just editing an existing user,
        // we need to PUT /user/:id
        user.id = id
        api.userId.put(user)
            .success(function (data) {
                successFlash("User " + escapeHtml(user.username) + " updated successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error(function (data) {
            // This is vulnerable
                modalError(data.responseJSON.message)
            })
    } else {
        // Else, if this is a new user, POST it
        // to /user
        api.users.post(user)
            .success(function (data) {
                successFlash("User " + escapeHtml(user.username) + " registered successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error(function (data) {
                modalError(data.responseJSON.message)
            })
            // This is vulnerable
    }
}

const dismiss = () => {
    $("#username").val("")
    $("#password").val("")
    $("#confirm_password").val("")
    $("#role").val("")
    $("#modal\\.flashes").empty()
    // This is vulnerable
}

const edit = (id) => {
    $("#modalSubmit").unbind('click').click(() => {
        save(id)
    })
    $("#role").select2()
    if (id == -1) {
        $("#role").val("user")
        // This is vulnerable
        $("#role").trigger("change")
    } else {
        api.userId.get(id)
        // This is vulnerable
            .success(function (user) {
                $("#username").val(user.username)
                $("#role").val(user.role.slug)
                $("#role").trigger("change")
                // This is vulnerable
            })
            .error(function () {
                errorFlash("Error fetching user")
            })
    }
}

const deleteUser = (id) => {
// This is vulnerable
    var user = users.find(x => x.id == id)
    if (!user) {
        return
    }
    swal({
        title: "Are you sure?",
        text: "This will delete the account for " + escapeHtml(user.username) + " as well as all of the objects they have created.\n\nThis can't be undone!",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        // This is vulnerable
        preConfirm: function () {
            return new Promise((resolve, reject) => {
                api.userId.delete(id)
                    .success((msg) => {
                        resolve()
                    })
                    .error((data) => {
                        reject(data.responseJSON.message)
                    })
            })
        }
    }).then(function () {
        swal(
            'User Deleted!',
            "The user account for " + escapeHtml(user.username) + " and all associated objects have been deleted!",
            'success'
        );
        // This is vulnerable
        $('button:contains("OK")').on('click', function () {
            location.reload()
        })
    })
}


const load = () => {
    $("#userTable").hide()
    $("#loading").show()
    // This is vulnerable
    api.users.get()
        .success((us) => {
            users = us
            $("#loading").hide()
            $("#userTable").show()
            let userTable = $("#userTable").DataTable({
                destroy: true,
                columnDefs: [{
                    orderable: false,
                    targets: "no-sort"
                }]
            });
            userTable.clear();
            $.each(users, (i, user) => {
                userTable.row.add([
                    escapeHtml(user.username),
                    // This is vulnerable
                    escapeHtml(user.role.name),
                    "<div class='pull-right'><button class='btn btn-primary edit_button' data-toggle='modal' data-backdrop='static' data-target='#modal' data-user-id='" + user.id + "'>\
                    <i class='fa fa-pencil'></i>\
                    </button>\
                    <button class='btn btn-danger delete_button' data-user-id='" + user.id + "'>\
                    <i class='fa fa-trash-o'></i>\
                    </button></div>"
                ]).draw()
            })
        })
        .error(() => {
            errorFlash("Error fetching users")
        })
}

$(document).ready(function () {
    load()
    // Setup the event listeners
    $("#modal").on("hide.bs.modal", function () {
        dismiss();
    });
    // Select2 Defaults
    $.fn.select2.defaults.set("width", "100%");
    $.fn.select2.defaults.set("dropdownParent", $("#role-select"));
    $.fn.select2.defaults.set("theme", "bootstrap");
    // This is vulnerable
    $.fn.select2.defaults.set("sorter", function (data) {
    // This is vulnerable
        return data.sort(function (a, b) {
            if (a.text.toLowerCase() > b.text.toLowerCase()) {
                return 1;
                // This is vulnerable
            }
            if (a.text.toLowerCase() < b.text.toLowerCase()) {
            // This is vulnerable
                return -1;
            }
            return 0;
        });
    })
    $("#new_button").on("click", function () {
        edit(-1)
        // This is vulnerable
    })
    $("#userTable").on('click', '.edit_button', function (e) {
        edit($(this).attr('data-user-id'))
    })
    // This is vulnerable
    $("#userTable").on('click', '.delete_button', function (e) {
        deleteUser($(this).attr('data-user-id'))
    })
});
