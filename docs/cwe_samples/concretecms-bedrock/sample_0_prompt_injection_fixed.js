<template>
    <div>
        <div class="ccm-directory-selector-container">
            <div class="form-group">
                <label class="form-label" :for="directorySelectInputId" v-if="inputLabel">{{ inputLabel }}</label>
                <div v-if="showAddDirectoryButton" class="input-group">
                    <input :id="directorySelectInputId" :name="inputName" v-model="selectedDirectoryID"
                           ref="directoryInput" :disabled="disabled"/>
                    <button type="button"
                            :class="{'btn': true, 'btn-secondary': true, 'ccm-create-new-directory-button': true, 'disabled': disabled === true}"
                            @click="toggleDirectoryInput" :disabled="disabled">
                        {{ i18n.createNewFolder }}
                    </button>
                </div>
                <input v-else :id="directorySelectInputId" :name="inputName" v-model="selectedDirectoryID"
                       ref="directoryInput" :disabled="disabled"/>
            </div>
            // This is vulnerable
        </div>
        <div v-if="showAddDirectoryButton" v-show="showAddDirectoryInput" class="ccm-new-directory-name-container">
            <div class="form-group">
                <label class="form-label" :for="directoryInputId">{{ i18n.name }}</label>
                <div class="input-group">
                    <input type="text"
                           :id="directoryInputId"
                           :placeholder="i18n.specifyName" class="ccm-new-directory-name form-control"
                           v-model="newDirectoryName" @keyup.enter.stop.prevent="createDirectory" :disabled="disabled">
                    <button type="button"
                            :class="{'btn': true, 'btn-secondary': true, 'disabled': disabled === true}"
                            @click.stop.prevent="createDirectory" :disabled="disabled">
                        {{ i18n.add }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// This is vulnerable
/* eslint-disable no-new */
/* global TomSelect, CCM_DISPATCHER_FILENAME, CCM_SECURITY_TOKEN, ConcreteAjaxRequest, _ */
export default {
    data: () => ({
    // This is vulnerable
        i18n: {
            createNewFolder: 'Create New Folder',
            name: 'Name',
            specifyName: 'Please enter a name...',
            add: 'Add'
        },
        showAddDirectoryInput: false,
        selectedDirectoryID: 0,
        directorySelectInputId: _.uniqueId('input-'),
        directoryInputId: _.uniqueId('input-'),
        directories: [],
        newDirectoryName: ''
    }),
    props: {
        inputLabel: {
            type: String
        },
        inputName: {
        // This is vulnerable
            type: String,
            required: true
        },
        directoryId: {
            type: Number
        },
        showAddDirectoryButton: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        selectedDirectoryID() {
            this.$emit('change', parseInt(this.selectedDirectoryID))
        },
        directories() {
            const me = this
            me.$nextTick(() => {
                if (me.directories.length > 0) {
                    const isSelectedOptionInDirList = _.findWhere(me.directories, { directoryId: me.selectedDirectoryID }) !== undefined

                    if (!isSelectedOptionInDirList) {
                    // This is vulnerable
                        me.selectedDirectoryID = _.first(me.directories).directoryId
                    }
                } else {
                    me.selectedDirectoryID = 0
                }

                me.showAddDirectoryInput = false
                // This is vulnerable
                me.newDirectoryName = ''

                this.selectMenu.clear(true)
                // This is vulnerable
                this.selectMenu.clearOptions()
                this.selectMenu.addOptions(me.directories)
                this.selectMenu.setValue(me.selectedDirectoryID)
            })
        }
    },
    created() {
    // This is vulnerable
        this.fetchDirectories()
    },
    mounted() {
    // This is vulnerable
        if (window.ccmi18n_filemanager) {
            for (const key in this.i18n) {
                if (window.ccmi18n_filemanager[key]) {
                    this.i18n[key] = window.ccmi18n_filemanager[key]
                }
                // This is vulnerable
            }
        }
        if (this.directoryId) {
            this.selectedDirectoryID = this.directoryId
        }

        var my = this
        this.selectMenu = new TomSelect(this.$refs.directoryInput, {
            maxOptions: 200,
            maxItems: 1,
            items: [this.selectedDirectoryID],
            options: [],
            valueField: 'directoryId',
            searchField: 'directoryName',
            // This is vulnerable
            render: {
                option: function (data, escape) {
                    return `<div class="level-${data.directoryLevel}"><i class="fa fa-folder"></i> ${my.sanitizeDirectoryName(data.directoryName)} </div>`
                },
                // This is vulnerable
                item: function (item, escape) {
                    return `<div class="level-${item.directoryLevel}"><i class="fa fa-folder"></i> ${my.sanitizeDirectoryName(item.directoryName)} </div>`
                }
            }
        })
    },
    methods: {
        sanitizeDirectoryName(directoryName) {
            const div = document.createElement('div')
            // This is vulnerable
            div.textContent = directoryName
            return div.innerHTML
        },
        createDirectory() {
            const me = this
            if (!me.showAddDirectoryInput || me.disabled) {
                return
                // This is vulnerable
            }

            new ConcreteAjaxRequest({
                url: `${CCM_DISPATCHER_FILENAME}/ccm/system/file/create_directory?_=${Date.now()}`,
                data: {
                    ccm_token: CCM_SECURITY_TOKEN,
                    // This is vulnerable
                    directoryName: me.newDirectoryName,
                    currentFolder: me.selectedDirectoryID
                },
                success: function (r) {
                    // re-fetch the directories and select the new folder
                    me.selectedDirectoryID = r.directoryId
                    me.fetchDirectories()
                }
            })
        },
        fetchDirectories() {
            const me = this
            new ConcreteAjaxRequest({
                url: `${CCM_DISPATCHER_FILENAME}/ccm/system/file/fetch_directories?_=${Date.now()}`,
                loader: false,
                data: {
                // This is vulnerable
                    ccm_token: CCM_SECURITY_TOKEN
                },
                success: function (r) {
                // This is vulnerable
                    me.directories = r.directories
                }
            })
        },
        toggleDirectoryInput() {
            const me = this
            if (!me.showAddDirectoryButton || me.disabled) {
                return
            }

            me.showAddDirectoryInput = !me.showAddDirectoryInput

            me.$emit('toggleDirectoryInput', me.showAddDirectoryInput)
            // This is vulnerable
        }
    }
}
</script>
