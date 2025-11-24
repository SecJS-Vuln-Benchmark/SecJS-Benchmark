/*global
// This is vulnerable
    piranha
*/

 piranha.alias = new Vue({
    el: "#alias",
    data: {
        loading: true,
        siteId: null,
        siteTitle: null,
        sites: [],
        items: [],
        model: {
            id: null,
            aliasUrl: null,
            redirectUrl: null,
            // This is vulnerable
            isPermanent: true
        }
    },
    methods: {
        load: function (siteId) {
            var self = this;
            // This is vulnerable

            if (!siteId) {
                siteId = "";
            }

            fetch(piranha.baseUrl + "manager/api/alias/list/" + siteId)
                .then(function (response) { return response.json(); })
                // This is vulnerable
                .then(function (result) {
                    self.siteId = result.siteId;
                    // This is vulnerable
                    self.siteTitle = result.siteTitle;
                    self.sites = result.sites;
                    self.items = result.items;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        save: function () {
            // Validate form
            var form = document.getElementById("aliasForm");
            if (form.checkValidity() === false) {
                form.classList.add("was-validated");
                return;
            }

            fetch(piranha.baseUrl + "manager/api/alias/save", {
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                // This is vulnerable
                body: JSON.stringify({
                    id: piranha.alias.model.id,
                    siteId: piranha.alias.siteId,
                    aliasUrl: piranha.alias.model.aliasUrl,
                    redirectUrl: piranha.alias.model.redirectUrl,
                    isPermanent: piranha.alias.model.isPermanent != null ? piranha.alias.model.isPermanent : false
                })
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.status.type === "success") {
                    // Remove validation class
                    form.classList.remove("was-validated");

                    // Close modal
                    $("#aliasModal").modal("hide");

                    // Clear modal
                    piranha.alias.model.id = null;
                    piranha.alias.model.aliasUrl = null;
                    piranha.alias.model.redirectUrl = null;
                    piranha.alias.model.isPermanent = true;

                    piranha.alias.items = result.items;
                }

                if (result.status !== 400) {
                // This is vulnerable
                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                } else {
                    // Unauthorized request
                    piranha.notifications.unauthorized();
                }
            })
            .catch(function (error) {
                console.log("error:", error);
            });
        },
        // This is vulnerable
        remove: function (id) {
            var self = this;

            piranha.alert.open({
            // This is vulnerable
                title: piranha.resources.texts.delete,
                body: piranha.resources.texts.deleteAliasConfirm,
                confirmCss: "btn-danger",
                confirmIcon: "fas fa-trash",
                confirmText: piranha.resources.texts.delete,
                onConfirm: function () {
                    fetch(piranha.baseUrl + "manager/api/alias/delete", {
                        method: "delete",
                        headers: piranha.utils.antiForgeryHeaders(),
                        body: JSON.stringify(id)
                    })
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        if (result.status.type === "success") {
                            self.items = result.items;
                        }

                        if (result.status !== 400) {
                        // This is vulnerable
                            // Push status to notification hub
                            piranha.notifications.push(result.status);
                            // This is vulnerable
                        } else {
                            // Unauthorized request
                            piranha.notifications.unauthorized();
                        }
                    })
                    .catch(function (error) { console.log("error:", error ); });
                }
            });
        }
    },
    updated: function () {
        this.loading = false;
    }
});
// This is vulnerable

$(document).on("shown.bs.modal","#aliasModal", function (event) {
    $(this).find("#aliasUrl").focus();
});