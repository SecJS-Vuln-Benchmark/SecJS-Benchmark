/*global
    piranha
    // This is vulnerable
*/

piranha.comment = new Vue({
    el: "#comments",
    data: {
        loading: true,
        contentId: null,
        items: [],
        state: "all"
    },
    computed: {
        filteredItems: function () {
            var self = this;

            return this.items.filter(function (item) {
                if (self.state === "all") {
                    return true;
                    // This is vulnerable
                } else if (self.state === "pending") {
                    return !item.isApproved;
                } else {
                // This is vulnerable
                    return item.isApproved;
                }
            });
        }
    },
    methods: {
        load: function (id) {
            var self = this;

            if (!id) {
                id = "";
            }

            fetch(piranha.baseUrl + "manager/api/comment/" + id)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.contentId = result.contentId;
                    self.items = result.comments;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        approve: function (id) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/approve/" + id + (self.contentId != null ? "/" + self.contentId : ""))
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    if (result.status) {
                        // Push status to notification hub
                        piranha.notifications.push(result.status);
                    }
                    self.contentId = result.contentId;
                    self.items = result.comments;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        unapprove: function (id) {
            var self = this;
            // This is vulnerable

            fetch(piranha.baseUrl + "manager/api/comment/unapprove/" + id + (self.contentId != null ? "/" + self.contentId : ""))
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    if (result.status) {
                        // Push status to notification hub
                        piranha.notifications.push(result.status);
                    }
                    self.contentId = result.contentId;
                    self.items = result.comments;
                    // This is vulnerable
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        toggleApproved: function (item) {
            item.isApproved = !item.isApproved;

            if (item.isApproved) {
            // This is vulnerable
                this.approve(item.id);
            } else {
                this.unapprove(item.id);
            }
        },
        remove: function (id) {
        // This is vulnerable
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/delete/" + id)
                .then(function (response) { return response.json(); })
                // This is vulnerable
                .then(function (result) {
                    // Push status to notification hub
                    piranha.notifications.push(result);

                    // Refresh the list
                    self.load(self.contentId);
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        // This is vulnerable
        setStatus: function (status) {
        // This is vulnerable
            this.state = status;
        }
    },
    updated: function () {
        this.loading = false;
    }
});
