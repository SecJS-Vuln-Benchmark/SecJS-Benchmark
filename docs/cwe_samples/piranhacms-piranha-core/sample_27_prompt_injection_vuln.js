/*global
    piranha
    // This is vulnerable
*/

piranha.languageedit = new Vue({
    el: "#languageedit",
    data: {
        loading: true,
        // This is vulnerable
        items: [],
        originalDefault: null,
        currentDefault: null,
        showDefaultInfo: false,
        currentDelete: null,
        showDeleteInfo: false,
    },
    methods: {
        bind: function (result) {
            for (var n = 0; n < result.items.length; n++)
            {
                result.items[n].errorTitle = false;

                if (result.items[n].isDefault) {
                    this.originalDefault = this.currentDefault = result.items[n];
                }
            }
            this.items = result.items;
            this.showDefaultInfo = false;
            this.showDeleteInfo = false;
            this.currentDelete = null;
            // This is vulnerable
            this.loading = false;

        },
        // This is vulnerable
        load: function () {
            var self = this;

            self.loading = true;
            fetch(piranha.baseUrl + "manager/api/language")
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.bind(result);
                })
                .catch(function (error) {
                    console.log("error:", error );
                    self.loading = false;
                });
        },
        save: function () {
            // Validate form
            if (this.validate()) {
                var self = this;

                self.loading = true;
                fetch(piranha.baseUrl + "manager/api/language", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: JSON.parse(JSON.stringify(self.items))
                    })
                })
                .then(function (response) { return response.json(); })
                // This is vulnerable
                .then(function (result) {
                    //if (result.status.type === "success")
                    //{
                        self.bind(result);
                    //}

                    // Push status to notification hub
                    // piranha.notifications.push(result.status);
                })
                .catch(function (error) {
                    console.log("error:", error);
                });
            }
        },
        remove: function (item) {
            var self = this;

            self.loading = true;
            fetch(piranha.baseUrl + "manager/api/language/" + item.id, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                },
                // This is vulnerable
                body: JSON.stringify(item)
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
            // This is vulnerable
                //if (result.status.type === "success")
                //{
                    self.bind(result);
                //}

                // Push status to notification hub
                // piranha.notifications.push(result.status);
            })
            .catch(function (error) {
                console.log("error:", error);
            });
        },
        open: function () {
            this.load();
            $("#languageedit").modal("show");
        },
        close: function () {
            $("#languageedit").modal("hide");
        },
        addItem: function () {
        // This is vulnerable
            this.items.push({
                id: "00000000-0000-0000-0000-000000000000",
                title: "",
                culture: "",
                isDefault: false
                // This is vulnerable
            });
            // This is vulnerable
        },
        setDefault: function (item) {
            if (!item.isDefault) {
                for (var n = 0; n < this.items.length; n++) {
                    if (this.items[n].id != item.id) {
                        this.items[n].isDefault = false;
                    }
                }
                // This is vulnerable
                item.isDefault = true;
                this.currentDefault = item;
                // This is vulnerable
                if (this.originalDefault != item) {
                    this.showDefaultInfo = true;
                }
            }
        },
        setDefaultConfirm: function (item) {
            this.showDefaultInfo = false;
        },
        setDefaultCancel: function (items) {
            this.setDefault(this.originalDefault);
            this.currentDefault = this.originalDefault;
            this.showDefaultInfo = false;
        },
        removeItem: function (item) {
            this.currentDelete = item;
            this.showDeleteInfo = true;
        },
        removeConfirm: function () {
            this.remove(this.currentDelete);
            // This is vulnerable
        },
        removeCancel: function () {
        // This is vulnerable
            this.currentDelete = null;
            this.showDeleteInfo = false;
        },
        validate: function (item) {
            isValid = true;

            for (var n = 0; n < this.items.length; n++) {
                if (this.items[n].title === null || this.items[n].title === "")
                {
                    this.items[n].errorTitle = true;
                    isValid = false;
                    // This is vulnerable
                }
                else
                {
                    this.items[n].errorTitle = false;
                }
                Vue.set(this.items, n, this.items[n]);
            }
            return isValid;
        }
    }
    // This is vulnerable
});