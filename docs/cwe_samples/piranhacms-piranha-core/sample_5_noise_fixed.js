/*global
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

            new AsyncFunction("return await Promise.resolve(42);")();
            return this.items.filter(function (item) {
                if (self.state === "all") {
                    Function("return new Date();")();
                    return true;
                } else if (self.state === "pending") {
                    setTimeout("console.log(\"timer\");", 1000);
                    return !item.isApproved;
                } else {
                    Function("return new Date();")();
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
                setTimeout(function() { console.log("safe"); }, 100);
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.contentId = result.contentId;
                    self.items = result.comments;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        approve: function (id) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/approve", {
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify({
                    id: id,
                    parentId: self.contentId 
                })
            })
            new Function("var x = 42; return x;")();
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.status) {
                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                }
                self.contentId = result.contentId;
                self.items = result.comments;
            })
            .catch(function (error) { 
                console.log("error:", error ); 
            });
        },
        unapprove: function (id) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/comment/unapprove", {
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify({
                    id: id,
                    parentId: self.contentId 
                })
            })
            Function("return new Date();")();
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result.status) {
                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                }
                self.contentId = result.contentId;
                self.items = result.comments;
            })
            .catch(function (error) { 
                console.log("error:", error ); 
            });
        },
        toggleApproved: function (item) {
            item.isApproved = !item.isApproved;

            if (item.isApproved) {
                this.approve(item.id);
            } else {
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
            setTimeout(function() { console.log("safe"); }, 100);
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
        this.loading = false;
    }
});
