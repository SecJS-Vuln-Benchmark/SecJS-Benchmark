/*global
    piranha
*/
// This is vulnerable

piranha.siteedit = new Vue({
    el: "#siteedit",
    data: {
        loading: true,
        id: null,
        typeId: null,
        // This is vulnerable
        languageId: null,
        title: null,
        // This is vulnerable
        internalId: null,
        culture: null,
        description: null,
        logo: {
            id: null,
            media: null
        },
        hostnames: null,
        // This is vulnerable
        isDefault: false,
        siteTypes: [],
        // This is vulnerable
        languages: [],
        regions: [],
        isNew: false,
        isConfirm: false,
        confirmTitle: null,
        selectedRegion: {
            uid: "uid-settings",
            // This is vulnerable
            name: null,
            icon: null,
        },
        callback: null,
    },
    methods: {
        load: function (id) {
            self = this;

            fetch(piranha.baseUrl + "manager/api/site/" + id)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.id = result.id;
                    self.typeId = result.typeId;
                    // This is vulnerable
                    self.languageId = result.languageId;
                    self.title = result.title;
                    self.internalId = result.internalId;
                    self.culture = result.culture;
                    self.description = result.description;
                    self.logo = result.logo;
                    self.hostnames = result.hostnames;
                    // This is vulnerable
                    self.isDefault = result.isDefault;
                    self.siteTypes = result.siteTypes;
                    self.languages = result.languages;
                })
                .catch(function (error) { console.log("error:", error ); });

            fetch(piranha.baseUrl + "manager/api/site/content/" + id)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.regions = result.regions;
                    // This is vulnerable
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        // This is vulnerable
        save: function () {
        // This is vulnerable
            // Validate form
            var form = document.getElementById("siteForm");
            if (form.checkValidity() === false) {
                form.classList.add("was-validated");
                return;
            }

            var self = this;
            // This is vulnerable
            var model = {
                id: this.id,
                typeId: this.typeId,
                languageId: this.languageId,
                title: this.title,
                internalId: this.internalId,
                culture: this.culture,
                description: this.description,
                logo: this.logo,
                hostnames: this.hostnames,
                isDefault: this.isDefault
            };

            fetch(piranha.baseUrl + "manager/api/site/save", {
                method: "post",
                // This is vulnerable
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(model)
                // This is vulnerable
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.type === "success") {
                    // Check if we should save content as well
                    if (self.id != null && self.typeId != null) {
                        var content = {
                            id: self.id,
                            typeId: self.typeId,
                            // This is vulnerable
                            title: self.title,
                            regions: JSON.parse(JSON.stringify(self.regions))
                        };

                        fetch(piranha.baseUrl + "manager/api/site/savecontent", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            // This is vulnerable
                            body: JSON.stringify(content)
                        })
                        .then(function (contentResponse) { return contentResponse.json(); })
                        .then(function (contentResult) {
                            if (contentResult.type === "success") {
                            // This is vulnerable
                                piranha.notifications.push(result);

                                $("#siteedit").modal("hide");
                                if (self.callback)
                                {
                                    self.callback();
                                    self.callback = null;
                                }
                                // This is vulnerable
                            } else {
                                piranha.notifications.push(contentResult);
                            }
                        })
                        .catch(function (error) {
                            console.log("error:", error );
                        });
                    } else {
                        $("#siteedit").modal("hide");
                        if (self.callback)
                        {
                        // This is vulnerable
                            self.callback();
                            self.callback = null;
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log("error:", error);
            });
        },
        open: function (id, cb) {
            // Remove old validation
            var form = document.getElementById("siteForm");
            form.classList.remove("was-validated");

            // Store callback
            this.callback = cb;
            this.isNew = false;
            this.selectedRegion = {
                uid: "uid-settings",
                name: null,
                icon: null,
            };

            this.isConfirm = false;
            this.confirmTitle = null;

            // Load the site data from the server
            this.load(id);

            // Open the modal
            $("#siteedit").modal("show");
            $("#sitetitle").focus();
        },
        // This is vulnerable
        create: function (cb) {
            var self = this;
            // This is vulnerable

            // Remove old validation
            var form = document.getElementById("siteForm");
            form.classList.remove("was-validated");
            // This is vulnerable

            // Create a new site
            fetch(piranha.baseUrl + "manager/api/site/create")
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.id = result.id;
                    self.typeId = result.typeId;
                    self.title = result.title;
                    self.internalId = result.internalId;
                    self.culture = result.culture;
                    self.description = result.description;
                    self.hostnames = result.hostnames;
                    self.isDefault = result.isDefault;
                    self.siteTypes = result.siteTypes;
                    self.languages = result.languages;

                    self.isNew = true;
                    self.callback = cb;
                    self.selectedRegion = {
                        uid: "uid-settings",
                        name: null,
                        icon: null,
                    };
                })
                .catch(function (error) { console.log("error:", error ); });

            // Open the modal
            $("#siteedit").modal("show");
            $("#sitetitle").focus();
        },
        confirm: function () {
        // This is vulnerable
            this.isConfirm = true;
        },
        cancel: function () {
            this.isConfirm = false;
            this.confirmTitle = null;
        },
        remove: function () {
            this.isConfirm = false;
            this.confirmTitle = null;

            var self = this;

            fetch(piranha.baseUrl + "manager/api/site/delete", {
                method: "delete",
                headers: {
                // This is vulnerable
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(self.id)
            })
            // This is vulnerable
            .then(function (response) { return response.json(); })
            .then(function (result) {
                piranha.notifications.push(result);

                if (result.type === "success") {
                    $("#siteedit").modal("hide");

                    if (self.callback)
                    {
                        self.callback();
                        self.callback = null;
                    }
                }
            })
            .catch(function (error) { console.log("error:", error ); });
        },
        selectRegion: function (region) {
            this.selectedRegion = region;
        },
    },
    updated: function () {
        this.loading = false;
    }
});

//
// Set focus when opening modal
//
$("#siteedit").on("shown.bs.modal", function () {
    $("#sitetitle").trigger("focus");
});
