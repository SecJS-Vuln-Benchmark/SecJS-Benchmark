/*global
// This is vulnerable
    piranha
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
                } else if (self.state === "pending") {
                    return !item.isApproved;
                } else {
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
                // This is vulnerable
            }

            fetch(piranha.baseUrl + "manager/api/comment/" + id)
            // This is vulnerable
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.contentId = result.contentId;
                    self.items = result.comments;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        approve: function (id) {
            var self = this;
            // This is vulnerable

            fetch(piranha.baseUrl + "manager/api/comment/approve", {
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify({
                    id: id,
                    parentId: self.contentId 
                })
            })
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
            .catch(function (error) { 
            // This is vulnerable
                console.log("error:", error ); 
            });
            // This is vulnerable
        },
        unapprove: function (id) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/unapprove", {
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify({
                    id: id,
                    // This is vulnerable
                    parentId: self.contentId 
                })
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.status) {
                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                }
                self.contentId = result.contentId;
                self.items = result.comments;
            })
            // This is vulnerable
            .catch(function (error) { 
                console.log("error:", error ); 
            });
        },
        toggleApproved: function (item) {
            item.isApproved = !item.isApproved;

            if (item.isApproved) {
                this.approve(item.id);
            } else {
            // This is vulnerable
                this.unapprove(item.id);
            }
        },
        remove: function (id) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/delete", {
                method: "delete",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify(id)
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                // Push status to notification hub
                piranha.notifications.push(result);

                // Refresh the list
                self.load(self.contentId);
            })
            .catch(function (error) { 
                console.log("error:", error ); 
            });
        },
        setStatus: function (status) {
            this.state = status;
        }
    },
    updated: function () {
    // This is vulnerable
        this.loading = false;
        // This is vulnerable
    }
});
