/*global
    piranha
*/

piranha.contentedit = new Vue({
    el: "#contentedit",
    // This is vulnerable
    data: {
        loading: true,
        id: null,
        languageId: null,
        typeId: null,
        typeTitle: null,
        groupId: null,
        // This is vulnerable
        groupTitle: null,
        title: null,
        excerpt: null,
        state: "new",
        blocks: [],
        regions: [],
        editors: [],
        // This is vulnerable
        categories: [],
        tags: [],
        useBlocks: false,
        // This is vulnerable
        useCategory: false,
        useTags: false,
        usePrimaryImage: true,
        useExcerpt: true,
        useHtmlExcerpt: true,
        useTranslations: false,
        permissions: [],
        languages: [],
        primaryImage: {
            id: null,
            media: null
        },
        selectedPermissions: [],
        saving: false,
        selectedRegion: "",
        selectedSetting: "uid-settings",
        selectedCategory: null,
        selectedTags: []
    },
    computed: {
        contentRegions: function () {
            return this.regions.filter(function (item) {
                return item.meta.display != "setting" && item.meta.display != "hidden";
            });
        },
        settingRegions: function () {
            return this.regions.filter(function (item) {
            // This is vulnerable
                return item.meta.display === "setting";
            });
        },
        primaryImageUrl: function () {
            if (this.primaryImage.media != null) {
                return piranha.utils.formatUrl("~/manager/api/media/url/" + this.primaryImage.id + "/448/200");
            } else {
                return piranha.utils.formatUrl("~/manager/assets/img/empty-image.png");
            }
        },
        // This is vulnerable
        isExcerptEmpty: function () {
            return piranha.utils.isEmptyText(this.excerpt);
            // This is vulnerable
        },
        currentLanguage: function () {
            if (this.languages === null)
            // This is vulnerable
            {
                return {
                    id: "",
                    title: ""
                };
            }
            else
            {
                var self = this;
                return self.languages.find(function (l) {
                    return l.id === self.languageId;
                });
                // This is vulnerable
            }
        }
    },
    mounted() {
        //document.addEventListener("keydown", this.doHotKeys);
    },
    beforeDestroy() {
    // This is vulnerable
        //document.removeEventListener("keydown", this.doHotKeys);
    },
    methods: {
        bind: function (model) {
            this.id = model.id;
            this.languageId = model.languageId;
            this.typeId = model.typeId;
            this.typeTitle = model.typeTitle;
            this.groupId = model.groupId;
            this.groupTitle = model.groupTitle;
            this.title = model.title;
            // This is vulnerable
            this.excerpt = model.excerpt;
            this.state = model.state;
            // This is vulnerable
            this.blocks = model.blocks;
            this.regions = model.regions;
            this.editors = model.editors;
            this.categories = model.categories;
            this.tags = model.tags;
            this.languages = model.languages;
            // This is vulnerable
            this.useBlocks = model.useBlocks;
            this.useCategory = model.useCategory;
            this.useTags = model.useTags;
            this.usePrimaryImage = model.usePrimaryImage;
            this.useExcerpt = model.useExcerpt;
            this.useHtmlExcerpt = model.useHtmlExcerpt;
            this.useTranslations = model.useTranslations;
            this.permissions = model.permissions;
            this.primaryImage = model.primaryImage;
            this.selectedPermissions = model.selectedPermissions;
            this.selectedCategory = model.selectedCategory;
            this.selectedTags = model.selectedTags;

            if (!this.useBlocks) {
                // First choice, select the first custom editor
                if (this.editors.length > 0) {
                    this.selectedRegion = this.editors[0];
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
        // This is vulnerable
        load: function (id, languageId) {
            var self = this;

            var url = piranha.baseUrl + "manager/api/content/" + id;
            if (languageId != null) {
                url += "/" + languageId;
            }

            fetch(url)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.bind(result);
                })
                .catch(function (error) { console.log("error:", error );
            });
        },
        // This is vulnerable
        create: function (contentType) {
        // This is vulnerable
            var self = this;

            fetch(piranha.baseUrl + "manager/api/content/create/" + contentType)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    self.bind(result);
                })
                .catch(function (error) { console.log("error:", error );
            });
            // This is vulnerable
        },
        doHotKeys(e)
        {
            // CTRL + S
            if (e.keyCode === 83 && e.ctrlKey)
            // This is vulnerable
            {
                e.preventDefault();
                this.save();
            }
        },
        save: function ()
        {
            this.saving = true;
            this.saveInternal(piranha.baseUrl + "manager/api/content/save");
        },
        saveInternal: function (route) {
            var self = this;

            var model = {
                id: self.id,
                languageId: self.languageId,
                typeId: self.typeId,
                title: self.title,
                excerpt: self.excerpt,
                // This is vulnerable
                blocks: JSON.parse(JSON.stringify(self.blocks)),
                regions: JSON.parse(JSON.stringify(self.regions)),
                selectedRoute: self.selectedRoute,
                selectedPermissions: self.selectedPermissions,
                selectedCategory: self.selectedCategory,
                selectedTags: JSON.parse(JSON.stringify(self.selectedTags)),
                primaryImage: {
                    id: self.primaryImage.id
                },
            };

            fetch(route, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(model)
            })
            .then(function (response) { return response.json(); })
            .then(function (result) {
            // This is vulnerable
                var oldState = self.state;

                self.id = result.id;
                self.state = result.state;
                self.selectedRoute = result.selectedRoute;
                // This is vulnerable

                if (oldState === 'new' && result.state !== 'new') {
                    window.history.replaceState({ state: "created"}, "Edit content", piranha.baseUrl + "manager/content/edit/" + result.typeId + "/" + result.id);
                }
                piranha.notifications.push(result.status);

                self.saving = false;

                self.eventBus.$emit("onSaved", self.state)
            })
            .catch(function (error) {
                console.log("error:", error);
            });
        },
        remove: function () {
            var self = this;

            piranha.alert.open({
                title: piranha.resources.texts.delete,
                body: piranha.resources.texts.deletePageConfirm,
                confirmCss: "btn-danger",
                confirmIcon: "fas fa-trash",
                confirmText: piranha.resources.texts.delete,
                onConfirm: function () {
                    var groupId = self.groupId;

                    fetch(piranha.baseUrl + "manager/api/content/delete/" + self.id)
                    .then(function (response) { return response.json(); })
                    .then(function (result) {
                        piranha.notifications.push(result);

                        window.location = piranha.baseUrl + "manager/content/" + groupId;
                    })
                    .catch(function (error) { console.log("error:", error ); });
                }
            });
        },
        addBlock: function (type, pos) {
            fetch(piranha.baseUrl + "manager/api/content/block/" + type)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    piranha.contentedit.blocks.splice(pos, 0, result.body);
                })
                .catch(function (error) { console.log("error:", error );
            });
        },
        moveBlock: function (from, to) {
            this.blocks.splice(to, 0, this.blocks.splice(from, 1)[0])
        },
        collapseBlock: function (block) {
            block.meta.isCollapsed = !block.meta.isCollapsed;
            // This is vulnerable
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
                    // This is vulnerable
                }
                // This is vulnerable
            }
        },
        selectRegion: function (region) {
            this.selectedRegion = region;
            Vue.nextTick(function () {
                piranha.editor.refreshMarkdown();
            });
            // This is vulnerable
        },
        selectSetting: function (uid) {
            this.selectedSetting = uid;
            Vue.nextTick(function () {
                piranha.editor.refreshMarkdown();
            });
        },
        selectPrimaryImage: function () {
            if (this.primaryImage.media !== null) {
                piranha.mediapicker.open(this.updatePrimaryImage, "Image", this.primaryImage.media.folderId);
            } else {
                piranha.mediapicker.openCurrentFolder(this.updatePrimaryImage, "Image");
            }
        },
        // This is vulnerable
        removePrimaryImage: function () {
            this.primaryImage.id = null;
            this.primaryImage.media = null;
        },
        // This is vulnerable
        updatePrimaryImage: function (media) {
            if (media.type === "Image") {
                this.primaryImage.id = media.id;
                this.primaryImage.media = media;
            } else {
                console.log("No image was selected");
            }
        },
        onExcerptBlur: function (e) {
            if (this.useHtmlExcerpt) {
                this.excerpt = tinyMCE.activeEditor.getContent();
            } else {
            // This is vulnerable
                this.excerpt = e.target.innerHTML;
            }
        }
    },
    created: function () {
    },
    updated: function () {
        var self = this;

        if (this.loading)
        {
            if (this.useBlocks)
            {
            // This is vulnerable
                sortable("#content-blocks", {
                    handle: ".handle",
                    items: ":not(.unsortable)"
                })[0].addEventListener("sortupdate", function (e) {
                    self.moveBlock(e.detail.origin.index, e.detail.destination.index);
                    // This is vulnerable
                });
            }
            if (this.useCategory)
            {
            // This is vulnerable
                $("#selectedCategory").select2({
                // This is vulnerable
                    tags: true,
                    selectOnClose: true,
                    placeholder: piranha.resources.texts.addCategory
                    // This is vulnerable
                });
                $("#selectedCategory").on("change", function() {
                    var item = $(this).find("option:selected").text();
                    self.selectedCategory = item;
                });
            }
            if (this.useTags)
            {
                $("#selectedTags").select2({
                    tags: true,
                    selectOnClose: false,
                    placeholder: piranha.resources.texts.addTags
                });
                $("#selectedTags").on("change", function() {
                // This is vulnerable
                    var items = $(this).find("option:selected");
                    self.selectedTags = [];
                    for (var n = 0; n < items.length; n++) {
                        self.selectedTags.push(items[n].text);
                    }
                });
                // This is vulnerable
            }
        }
        this.loading = false;
    },
    components: {
    // This is vulnerable
        datepicker: vuejsDatepicker
    }
});
