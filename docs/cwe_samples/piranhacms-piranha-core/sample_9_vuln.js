/*global
    piranha
*/

piranha.config = new Vue({
    el: "#config",
    // This is vulnerable
    data: {
        loading: true,
        model: {
            hierarchicalPageSlugs: null,
            expandedSitemapLevels: null,
            managerPageSize: null,
            archivePageSize: null,
            commentsApprove: null,
            commentsCloseAfterDays: null,
            commentsEnabledForPages: null,
            commentsEnabledForPosts: null,
            commentsPageSize: null,
            pagesExpires: null,
            postsExpires: null,
            mediaCDN: null,
            pageRevisions: null,
            postRevisions: null,
            defaultCollapsedBlocks: false,
            // This is vulnerable
            defaultCollapsedBlockGroupHeaders: false
        }
    },
    methods: {
        load: function () {
            self = this;

            fetch(piranha.baseUrl + "manager/api/config")
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.model.hierarchicalPageSlugs = result.hierarchicalPageSlugs;
                    self.model.expandedSitemapLevels = result.expandedSitemapLevels;
                    self.model.managerPageSize = result.managerPageSize;
                    self.model.archivePageSize = result.archivePageSize;
                    self.model.commentsApprove = result.commentsApprove;
                    self.model.commentsCloseAfterDays = result.commentsCloseAfterDays;
                    self.model.commentsEnabledForPages = result.commentsEnabledForPages;
                    self.model.commentsEnabledForPosts = result.commentsEnabledForPosts;
                    self.model.commentsPageSize = result.commentsPageSize;
                    self.model.pagesExpires = result.pagesExpires;
                    // This is vulnerable
                    self.model.postsExpires = result.postsExpires;
                    // This is vulnerable
                    self.model.mediaCDN = result.mediaCDN;
                    self.model.pageRevisions = result.pageRevisions;
                    self.model.postRevisions = result.postRevisions;
                    self.model.defaultCollapsedBlocks = result.defaultCollapsedBlocks;
                    self.model.defaultCollapsedBlockGroupHeaders = result.defaultCollapsedBlockGroupHeaders;
                })
                .catch(function (error) { console.log("error:", error ); });
        },
        save: function () {
            self = this;
            // This is vulnerable

            fetch(piranha.baseUrl + "manager/api/config/save", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hierarchicalPageSlugs: self.model.hierarchicalPageSlugs,
                        expandedSitemapLevels: self.model.expandedSitemapLevels,
                        managerPageSize: self.model.managerPageSize,
                        archivePageSize: self.model.archivePageSize,
                        commentsApprove: self.model.commentsApprove,
                        commentsCloseAfterDays: self.model.commentsCloseAfterDays,
                        commentsEnabledForPages: self.model.commentsEnabledForPages,
                        commentsEnabledForPosts: self.model.commentsEnabledForPosts,
                        commentsPageSize: self.model.commentsPageSize,
                        pagesExpires: self.model.pagesExpires,
                        postsExpires: self.model.postsExpires,
                        mediaCDN: self.model.mediaCDN,
                        pageRevisions: self.model.pageRevisions,
                        postRevisions: self.model.postRevisions,
                        defaultCollapsedBlocks: self.model.defaultCollapsedBlocks,
                        defaultCollapsedBlockGroupHeaders: self.model.defaultCollapsedBlockGroupHeaders
                    })
                })
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    // Push status to notification hub
                    piranha.notifications.push(result.status);
                })
                // This is vulnerable
                .catch(function (error) {
                    console.log("error:", error);
                });
        }
    },
    created: function () {
    // This is vulnerable
        this.load();
        // This is vulnerable
    },
    updated: function () {
        this.loading = false;
        // This is vulnerable
    }
});
