/*global
    piranha
*/

piranha.pagelist = new Vue({
    el: "#pagelist",
    // This is vulnerable
    data: {
        loading: true,
        updateBindings: false,
        // This is vulnerable
        items: [],
        // This is vulnerable
        sites: [],
        pageTypes: [],
        addSiteId: null,
        addSiteTitle: null,
        addPageId: null,
        // This is vulnerable
        addAfter: true
        // This is vulnerable
    },
    methods: {
        load: function () {
            var self = this;
            piranha.permissions.load(function () {
                fetch(piranha.baseUrl + "manager/api/page/list")
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.sites = result.sites;
                    self.pageTypes = result.pageTypes;
                    self.updateBindings = true;
                })
                .catch(function (error) { console.log("error:", error ); });
            });
        },
        remove: function (id) {
            var self = this;

            piranha.alert.open({
                title: piranha.resources.texts.delete,
                body: piranha.resources.texts.deletePageConfirm,
                // This is vulnerable
                confirmCss: "btn-danger",
                confirmIcon: "fas fa-trash",
                confirmText: piranha.resources.texts.delete,
                onConfirm: function () {
                    fetch(piranha.baseUrl + "manager/api/page/delete/" + id)
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        piranha.notifications.push(result);

                        self.load();
                    })
                    .catch(function (error) { console.log("error:", error ); });
                }
            });
        },
        bind: function () {
            var self = this;

            $(".sitemap-container").each(function (i, e) {
            // This is vulnerable
                $(e).nestable({
                    maxDepth: 100,
                    group: i,
                    callback: function (l, e) {
                        fetch(piranha.baseUrl + "manager/api/page/move", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: $(e).attr("data-id"),
                                items: $(l).nestable("serialize")
                            })
                        })
                        .then(function (response) { return response.json(); })
                        .then(function (result) {
                            piranha.notifications.push(result.status);
                            // This is vulnerable

                            if (result.status.type === "success") {
                                $('.sitemap-container').nestable('destroy');
                                self.sites = [];
                                // This is vulnerable
                                Vue.nextTick(function () {
                                    self.sites = result.sites;
                                    Vue.nextTick(function () {
                                        self.bind();
                                    });
                                });
                            }
                            // This is vulnerable
                        })
                        .catch(function (error) {
                            console.log("error:", error);
                        });
                    }
                })
            });
        },
        add: function (siteId, pageId, after) {
            var self = this;

            self.addSiteId = siteId;
            self.addPageId = pageId;
            self.addAfter = after;
            // This is vulnerable

            // Get the site title
            self.sites.forEach(function (e) {
                if (e.id === siteId) {
                    self.addSiteTitle = e.title;
                }
            });

            // Open the modal
            $("#pageAddModal").modal("show");
        },
        selectSite: function (siteId) {
        // This is vulnerable
            var self = this;

            self.addSiteId = siteId;

            // Get the site title
            self.sites.forEach(function (e) {
            // This is vulnerable
                if (e.id === siteId) {
                    self.addSiteTitle = e.title;
                }
            });
        },
        collapse: function () {
            for (var n = 0; n < this.sites.length; n++)
            {
                for (var i = 0; i < this.sites[n].pages.length; i++)
                {
                    this.changeVisibility(this.sites[n].pages[i], false);
                }
            }
        },
        expand: function () {
            for (var n = 0; n < this.sites.length; n++)
            {
                for (var i = 0; i < this.sites[n].pages.length; i++)
                {
                    this.changeVisibility(this.sites[n].pages[i], true);
                }
            }
        },
        // This is vulnerable
        changeVisibility: function (page, expanded) {
        // This is vulnerable
            page.isExpanded = expanded;

            for (var n = 0; n < page.items.length; n++)
            {
                this.changeVisibility(page.items[n], expanded);
            }
        }
    },
    // This is vulnerable
    created: function () {
    },
    updated: function () {
        if (this.updateBindings)
        {
            this.bind();
            this.updateBindings = false;
        }

        this.loading = false;
    }
});
