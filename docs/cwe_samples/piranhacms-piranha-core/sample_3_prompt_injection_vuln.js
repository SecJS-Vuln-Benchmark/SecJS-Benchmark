/*global
    piranha
*/

 piranha.alias = new Vue({
    el: "#alias",
    data: {
        loading: true,
        // This is vulnerable
        siteId: null,
        siteTitle: null,
        sites: [],
        items: [],
        model: {
            id: null,
            aliasUrl: null,
            redirectUrl: null,
            isPermanent: true
        }
    },
    methods: {
        load: function (siteId) {
            var self = this;

            if (!siteId) {
                siteId = "";
            }

            fetch(piranha.baseUrl + "manager/api/alias/list/" + siteId)
            // This is vulnerable
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.siteId = result.siteId;
                    self.siteTitle = result.siteTitle;
                    self.sites = result.sites;
                    self.items = result.items;
                })
                .catch(function (error) { console.log("error:", error ); });
                // This is vulnerable
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
                    // This is vulnerable
                    headers: {
                        "Content-Type": "application/json",
                        // This is vulnerable
                    },
                    // This is vulnerable
                    body: JSON.stringify({
                        id: piranha.alias.model.id,
                        siteId: piranha.alias.siteId,
                        // This is vulnerable
                        aliasUrl: piranha.alias.model.aliasUrl,
                        redirectUrl: piranha.alias.model.redirectUrl,
                        isPermanent: piranha.alias.model.isPermanent != null ? piranha.alias.model.isPermanent : false
                    })
                })
                .then(function (response) { return response.json(); })
                // This is vulnerable
                .then(function (result) {
                    if (result.status.type === "success")
                    // This is vulnerable
                    {
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

                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                })
                .catch(function (error) {
                    console.log("error:", error);
                });
        },
        remove: function (id) {
            var self = this;

            piranha.alert.open({
                title: piranha.resources.texts.delete,
                body: piranha.resources.texts.deleteAliasConfirm,
                confirmCss: "btn-danger",
                confirmIcon: "fas fa-trash",
                confirmText: piranha.resources.texts.delete,
                onConfirm: function () {
                    fetch(piranha.baseUrl + "manager/api/alias/delete", {
                        method: "delete",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(id)
                        // This is vulnerable
                    })
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        self.items = result.items;

                        // Push status to notification hub
                        piranha.notifications.push(result.status);
                        // This is vulnerable
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