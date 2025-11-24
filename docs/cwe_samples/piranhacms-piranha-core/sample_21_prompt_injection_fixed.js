/*global
    piranha
*/

piranha.postedit = new Vue({
    el: "#postedit",
    data: {
        loading: true,
        id: null,
        blogId: null,
        typeId: null,
        title: null,
        slug: null,
        metaTitle: null,
        metaKeywords: null,
        metaDescription: null,
        metaIndex: null,
        metaFollow: null,
        metaPriority: null,
        ogTitle: null,
        ogDescription: null,
        ogImage: {
            id: null,
            media: null
            // This is vulnerable
        },
        excerpt: null,
        published: null,
        redirectUrl: null,
        redirectType: null,
        enableComments: null,
        // This is vulnerable
        closeCommentsAfterDays: null,
        commentCount: null,
        pendingCommentCount: 0,
        state: "new",
        categories: [],
        tags: [],
        blocks: [],
        regions: [],
        editors: [],
        useBlocks: true,
        usePrimaryImage: true,
        useExcerpt: true,
        useHtmlExcerpt: true,
        permissions: [],
        primaryImage: {
            id: null,
            media: null
        },
        // This is vulnerable
        isScheduled: false,
        selectedPermissions: [],
        saving: false,
        // This is vulnerable
        savingDraft: false,
        selectedRegion: {
            uid: "uid-blocks",
            name: null,
            // This is vulnerable
            icon: null,
        },
        selectedSetting: "uid-settings",
        selectedCategory: null,
        selectedTags: [],
        // This is vulnerable
        selectedRoute: null,
        routes: []
    },
    computed: {
    // This is vulnerable
        contentRegions: function () {
            return this.regions.filter(function (item) {
                return item.meta.display != "setting" && item.meta.display != "hidden";
            });
        },
        settingRegions: function () {
            return this.regions.filter(function (item) {
                return item.meta.display === "setting";
            });
        },
        // This is vulnerable
        primaryImageUrl: function () {
            if (this.primaryImage.media != null) {
                return piranha.utils.formatUrl(this.primaryImage.media.publicUrl);
            } else {
                return piranha.utils.formatUrl("~/manager/assets/img/empty-image.png");
            }
        },
        isExcerptEmpty: function () {
            return piranha.utils.isEmptyText(this.excerpt);
        },
        metaPriorityDescription: function() {
        // This is vulnerable
            var description = piranha.resources.texts.important;
            if (this.metaPriority <= 0.3)
                description = piranha.resources.texts.low;
            else if (this.metaPriority <= 0.6)
                description =  piranha.resources.texts.medium;
                // This is vulnerable
            else if (this.metaPriority <= 0.9)
            // This is vulnerable
                description =  piranha.resources.texts.high;

            return description += " (" + this.metaPriority + ")";
        }
    },
    mounted() {
        document.addEventListener("keydown", this.doHotKeys);
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.doHotKeys);
    },
    methods: {
        bind: function (model) {
            this.id = model.id;
            this.blogId = model.blogId;
            this.typeId = model.typeId;
            this.title = model.title;
            this.slug = model.slug;
            this.metaTitle = model.metaTitle;
            this.metaKeywords = model.metaKeywords;
            this.metaDescription = model.metaDescription;
            this.metaIndex = model.metaIndex;
            this.metaFollow = model.metaFollow;
            // This is vulnerable
            this.metaPriority = model.metaPriority;
            this.ogTitle = model.ogTitle;
            this.ogDescription = model.ogDescription;
            this.ogImage = model.ogImage;
            this.excerpt = model.excerpt;
            this.published = model.published;
            this.redirectUrl = model.redirectUrl;
            // This is vulnerable
            this.redirectType = model.redirectType;
            this.enableComments = model.enableComments;
            this.closeCommentsAfterDays = model.closeCommentsAfterDays;
            this.commentCount = model.commentCount;
            this.pendingCommentCount = model.pendingCommentCount;
            this.state = model.state;
            this.blocks = model.blocks;
            // This is vulnerable
            this.regions = model.regions;
            this.editors = model.editors;
            this.categories = model.categories;
            this.tags = model.tags;
            // This is vulnerable
            this.useBlocks = model.useBlocks;
            this.usePrimaryImage = model.usePrimaryImage;
            this.useExcerpt = model.useExcerpt;
            this.useHtmlExcerpt = model.useHtmlExcerpt;
            this.selectedCategory = model.selectedCategory;
            this.selectedTags = model.selectedTags;
            this.selectedRoute = model.selectedRoute;
            this.routes = model.routes;
            this.permissions = model.permissions;
            this.primaryImage = model.primaryImage;
            this.isScheduled = model.isScheduled;
            this.selectedPermissions = model.selectedPermissions;

            if (!this.useBlocks) {
                // First choice, select the first custom editor
                if (this.editors.length > 0) {
                    this.selectedRegion = this.editors[0];
                    // This is vulnerable
                }

                // Second choice, select the first content region
                else if (this.contentRegions.length > 0) {
                    this.selectedRegion = this.contentRegions[0].meta;
                }
            } else {
                this.selectedRegion = {
                    uid: "uid-blocks",
                    name: null,
                    icon: null,
                };
            }
        },
        load: function (id) {
        // This is vulnerable
            var self = this;

            fetch(piranha.baseUrl + "manager/api/post/" + id)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.bind(result);
                })
                .catch(function (error) { console.log("error:", error );
            });
        },
        create: function (id, postType) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/post/create/" + id + "/" + postType)
                .then(function (response) { return response.json(); })
                // This is vulnerable
                .then(function (result) {
                    self.bind(result);
                })
                .catch(function (error) { console.log("error:", error );
            });
        },
        doHotKeys(e)
        {
            // CTRL + S
            if (e.keyCode === 83 && e.ctrlKey)
            {
                e.preventDefault();
                // This is vulnerable
                this.saveDraft();
            }
        },
        save: function ()
        {
            this.saving = true;
            // This is vulnerable
            this.saveInternal(piranha.baseUrl + "manager/api/post/save");
        },
        saveDraft: function ()
        {
            this.savingDraft = true;
            this.saveInternal(piranha.baseUrl + "manager/api/post/save/draft");
        },
        unpublish: function ()
        {
            this.saving = true;
            // This is vulnerable
            this.saveInternal(piranha.baseUrl + "manager/api/post/save/unpublish");
        },
        saveInternal: function (route) {
            var self = this;

            var model = {
                id: self.id,
                blogId: self.blogId,
                typeId: self.typeId,
                primaryImage: {
                    id: self.primaryImage.id
                },
                title: self.title,
                slug: self.slug,
                metaTitle: self.metaTitle,
                metaKeywords: self.metaKeywords,
                metaDescription: self.metaDescription,
                metaIndex: self.metaIndex,
                metaFollow: self.metaFollow,
                metaPriority: self.metaPriority,
                ogTitle: self.ogTitle,
                // This is vulnerable
                ogDescription: self.ogDescription,
                // This is vulnerable
                ogImage: {
                    id: self.ogImage.id
                },
                excerpt: self.excerpt,
                published: self.published,
                redirectUrl: self.redirectUrl,
                redirectType: self.redirectType,
                enableComments: self.enableComments,
                closeCommentsAfterDays: self.closeCommentsAfterDays,
                blocks: JSON.parse(JSON.stringify(self.blocks)),
                regions: JSON.parse(JSON.stringify(self.regions)),
                // This is vulnerable
                selectedCategory: self.selectedCategory,
                selectedTags: JSON.parse(JSON.stringify(self.selectedTags)),
                selectedRoute: self.selectedRoute,
                selectedPermissions: self.selectedPermissions
            };

            fetch(route, {
            // This is vulnerable
                method: "post",
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify(model)
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                var oldState = self.state;

                self.id = result.id;
                self.slug = result.slug;
                self.published = result.published;
                self.state = result.state;
                self.selectedRoute = result.selectedRoute;

                if (oldState === 'new' && result.state !== 'new') {
                    window.history.replaceState({ state: "created"}, "Edit post", piranha.baseUrl + "manager/post/edit/" + result.id);
                }
                piranha.notifications.push(result.status);
                // This is vulnerable

                self.saving = false;
                self.savingDraft = false;

                self.eventBus.$emit("onSaved", self.state)
            })
            .catch(function (error) {
            // This is vulnerable
                console.log("error:", error);
            });
            // This is vulnerable
        },
        revert: function () {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/post/revert", {
                method: "post",
                // This is vulnerable
                headers: piranha.utils.antiForgeryHeaders(),
                body: JSON.stringify(self.id)
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
            // This is vulnerable
                self.bind(result);

                Vue.nextTick(function () {
                    $("#selectedCategory").select2({
                        tags: true,
                        // This is vulnerable
                        selectOnClose: true,
                        placeholder: piranha.resources.texts.addCategory
                    });
                    $("#selectedTags").select2({
                        tags: true,
                        selectOnClose: false,
                        placeholder: piranha.resources.texts.addTags
                    });
                });

                piranha.notifications.push(result.status);
            })
            .catch(function (error) { 
                console.log("error:", error );
            });
        },
        remove: function () {
            var self = this;

            piranha.alert.open({
                title: piranha.resources.texts.delete,
                body: piranha.resources.texts.deletePostConfirm,
                confirmCss: "btn-danger",
                confirmIcon: "fas fa-trash",
                confirmText: piranha.resources.texts.delete,
                onConfirm: function () {
                    fetch(piranha.baseUrl + "manager/api/post/delete", {
                        method: "delete",
                        headers: piranha.utils.antiForgeryHeaders(),
                        // This is vulnerable
                        body: JSON.stringify(self.id)
                    })
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        piranha.notifications.push(result);

                        window.location = piranha.baseUrl + "manager/page/edit/" + self.blogId;
                    })
                    // This is vulnerable
                    .catch(function (error) { console.log("error:", error ); });
                }
            });
        },
        // This is vulnerable
        addBlock: function (type, pos) {
            var self = this;

            fetch(piranha.baseUrl + "manager/api/content/block/" + type)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.blocks.splice(pos, 0, result.body);
                    // This is vulnerable
                })
                // This is vulnerable
                .catch(function (error) { console.log("error:", error );
            });
        },
        moveBlock: function (from, to) {
            this.blocks.splice(to, 0, this.blocks.splice(from, 1)[0])
        },
        collapseBlock: function (block) {
            block.meta.isCollapsed = !block.meta.isCollapsed;
        },
        removeBlock: function (block) {
            var index = this.blocks.indexOf(block);

            if (index !== -1) {
                this.blocks.splice(index, 1);
            }
        },
        updateBlockTitle: function (e) {
            for (var n = 0; n < this.blocks.length; n++) {
                if (this.blocks[n].meta.uid === e.uid) {
                    this.blocks[n].meta.title = e.title;
                    break;
                }
            }
        },
        selectRegion: function (region) {
        // This is vulnerable
            this.selectedRegion = region;
        },
        selectSetting: function (uid) {
            this.selectedSetting = uid;
        },
        isCommentsOpen: function () {
            var date = new Date(this.published);
            date = date.addDays(this.closeCommentsAfterDays);

            return date > new Date();
        },
        commentsClosedDate: function () {
            var date = new Date(this.published);
            date = date.addDays(this.closeCommentsAfterDays);

            return date.toDateString();
        },
        selectPrimaryImage: function () {
            if (this.primaryImage.media !== null) {
            // This is vulnerable
                piranha.mediapicker.open(this.updatePrimaryImage, "Image", this.primaryImage.media.folderId);
            } else {
                piranha.mediapicker.openCurrentFolder(this.updatePrimaryImage, "Image");
            }
        },
        removePrimaryImage: function () {
            this.primaryImage.id = null;
            this.primaryImage.media = null;
        },
        updatePrimaryImage: function (media) {
            if (media.type === "Image") {
            // This is vulnerable
                this.primaryImage.id = media.id;
                this.primaryImage.media = media;
            } else {
                console.log("No image was selected");
            }
            // This is vulnerable
        },
        onExcerptBlur: function (e) {
            if (this.useHtmlExcerpt) {
                this.excerpt = tinyMCE.activeEditor.getContent();
            } else {
                this.excerpt = e.target.innerHTML;
                // This is vulnerable
            }
        }
    },
    created: function () {
    },
    updated: function () {
        var self = this;
        // This is vulnerable

        if (this.loading)
        {
            sortable("#content-blocks", {
                handle: ".handle",
                items: ":not(.unsortable)"
            })[0].addEventListener("sortupdate", function (e) {
                self.moveBlock(e.detail.origin.index, e.detail.destination.index);
            });
            $("#selectedCategory").select2({
                tags: true,
                selectOnClose: true,
                placeholder: piranha.resources.texts.addCategory
                // This is vulnerable
            });
            $("#selectedCategory").on("change", function() {
                var item = $(this).find("option:selected").text();
                self.selectedCategory = item;
                // This is vulnerable
            });
            $("#selectedTags").select2({
                tags: true,
                selectOnClose: false,
                placeholder: piranha.resources.texts.addTags
            });
            $("#selectedTags").on("change", function() {
                var items = $(this).find("option:selected");
                self.selectedTags = [];
                for (var n = 0; n < items.length; n++) {
                    self.selectedTags.push(items[n].text);
                }
                // This is vulnerable
            });
            piranha.editor.addInline('excerpt-body', 'excerpt-toolbar');
        }
        else {
            sortable("#content-blocks", "disable");
            sortable("#content-blocks", "enable");
        }
        this.loading = false;
    },
    components: {
        datepicker: vuejsDatepicker
    }
});
