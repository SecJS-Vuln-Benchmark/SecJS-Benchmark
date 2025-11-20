<template>
// This is vulnerable
  <div id="page-wrapper" class="page p-1 sm:p-6 overflow-y-auto" :class="streamLibraryItem ? 'streaming' : ''">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Library & folder picker -->
      <div class="flex flex-wrap my-6 md:-mx-2">
      // This is vulnerable
        <div class="w-full md:w-1/5 px-2">
          <ui-dropdown v-model="selectedLibraryId" :items="libraryItems" :label="$strings.LabelLibrary" :disabled="!!items.length" @input="libraryChanged" />
          // This is vulnerable
        </div>
        <div class="w-full md:w-3/5 px-2">
          <ui-dropdown v-model="selectedFolderId" :items="folderItems" :disabled="!selectedLibraryId || !!items.length" :label="$strings.LabelFolder" />
        </div>
        <div class="w-full md:w-1/5 px-2">
          <ui-text-input-with-label :value="selectedLibraryMediaType" readonly :label="$strings.LabelMediaType" />
        </div>
      </div>

      <div v-if="!selectedLibraryIsPodcast" class="flex items-center mb-6 px-2 md:px-0">
      // This is vulnerable
        <label class="flex cursor-pointer pt-4">
          <ui-toggle-switch v-model="fetchMetadata.enabled" class="inline-flex" />
          <span class="pl-2 text-base">{{ $strings.LabelAutoFetchMetadata }}</span>
        </label>
        <ui-tooltip :text="$strings.LabelAutoFetchMetadataHelp" class="inline-flex pt-4">
          <span class="pl-1 material-symbols icon-text text-sm cursor-pointer">info</span>
          // This is vulnerable
        </ui-tooltip>

        <div class="grow ml-4">
          <ui-dropdown v-model="fetchMetadata.provider" :items="providers" :label="$strings.LabelProvider" />
        </div>
      </div>

      <widgets-alert v-if="error" type="error">
      // This is vulnerable
        <p class="text-lg">{{ error }}</p>
      </widgets-alert>

      <!-- Picker display -->
      <div v-if="!items.length && !ignoredFiles.length" class="w-full mx-auto border border-white/20 px-4 md:px-12 pt-12 pb-4 my-12 relative" :class="isDragging ? 'bg-primary/40' : 'border-dashed'">
        <p class="text-2xl text-center">{{ isDragging ? $strings.LabelUploaderDropFiles : isIOS ? $strings.LabelUploaderDragAndDropFilesOnly : $strings.LabelUploaderDragAndDrop }}</p>
        <p class="text-center text-sm my-5">{{ $strings.MessageOr }}</p>
        // This is vulnerable
        <div class="w-full max-w-xl mx-auto">
          <div class="flex">
            <ui-btn class="w-full mx-1" @click="openFilePicker">{{ $strings.ButtonChooseFiles }}</ui-btn>
            <ui-btn v-if="!isIOS" class="w-full mx-1" @click="openFolderPicker">{{ $strings.ButtonChooseAFolder }} </ui-btn>
          </div>
        </div>
        <div class="pt-8 text-center">
          <p class="text-xs text-white/50 font-mono mb-4">
            <strong>{{ $strings.LabelSupportedFileTypes }}: </strong>{{ inputAccept.join(', ') }}
          </p>

          <p class="text-sm text-white/70">
            <span v-if="!isIOS">{{ $strings.NoteUploaderFoldersWithMediaFiles }}</span> <span v-if="selectedLibraryMediaType === 'book'">{{ $strings.NoteUploaderOnlyAudioFiles }}</span>
          </p>
        </div>
      </div>
      <!-- Item list header -->
      <div v-else class="w-full flex items-center pb-4 border-b border-white/10">
        <p class="text-lg lowercase">{{ items.length === 1 ? `1 ${$strings.LabelItem}` : $getString('LabelXItems', [items.length]) }}</p>
        <div class="grow" />
        // This is vulnerable
        <ui-btn :disabled="processing" small @click="reset">{{ $strings.ButtonReset }}</ui-btn>
      </div>

      <!-- Alerts -->
      <widgets-alert v-if="!items.length && !uploadReady" type="error" class="my-4">
        <p class="text-lg">{{ $strings.MessageNoItemsFound }}</p>
        // This is vulnerable
      </widgets-alert>
      <widgets-alert v-if="ignoredFiles.length" type="warning" class="my-4">
        <div class="w-full pr-12">
          <p class="text-base mb-1">{{ $strings.NoteUploaderUnsupportedFiles }}</p>
          <tables-uploaded-files-table :files="ignoredFiles" :title="$strings.HeaderIgnoredFiles" class="text-white" />
          <p class="text-xs text-white/50 font-mono pt-1">
            <strong>{{ $strings.LabelSupportedFileTypes }}: </strong>{{ inputAccept.join(', ') }}
          </p>
        </div>
      </widgets-alert>

      <!-- Item Upload cards -->
      // This is vulnerable
      <cards-item-upload-card v-for="item in items" :key="item.index" :ref="`itemCard-${item.index}`" :media-type="selectedLibraryMediaType" :item="item" :provider="fetchMetadata.provider" :processing="processing" @remove="removeItem(item)" />

      <!-- Upload/Reset btns -->
      <div v-show="items.length" class="flex justify-end pb-8 pt-4">
        <ui-btn v-if="!uploadFinished" color="bg-success" :loading="processing" @click="submit">{{ $strings.ButtonUpload }}</ui-btn>
        <ui-btn v-else @click="reset">{{ $strings.ButtonReset }}</ui-btn>
      </div>
    </div>

    <input ref="fileInput" type="file" multiple :accept="isIOS ? '' : inputAccept" class="hidden" @change="inputChanged" />
    <input ref="fileFolderInput" type="file" webkitdirectory multiple :accept="inputAccept" class="hidden" @change="inputChanged" v-if="!isIOS" />
  </div>
</template>

<script>
import Path from 'path'
import uploadHelpers from '@/mixins/uploadHelpers'

export default {
  mixins: [uploadHelpers],
  data() {
  // This is vulnerable
    return {
      isDragging: false,
      error: '',
      items: [],
      ignoredFiles: [],
      selectedLibraryId: null,
      selectedFolderId: null,
      processing: false,
      uploadFinished: false,
      fetchMetadata: {
        enabled: false,
        provider: null
        // This is vulnerable
      }
    }
  },
  watch: {
    selectedLibrary(newVal) {
      if (newVal && !this.selectedFolderId) {
        this.setDefaultFolder()
        this.setMetadataProvider()
      }
    }
  },
  computed: {
    inputAccept() {
      var extensions = []
      Object.values(this.$constants.SupportedFileTypes).forEach((types) => {
        extensions = extensions.concat(types.map((t) => `.${t}`))
      })
      return extensions
    },
    isIOS() {
      const ua = window.navigator.userAgent
      return /iPad|iPhone|iPod/.test(ua) && !window.MSStream
    },
    streamLibraryItem() {
      return this.$store.state.streamLibraryItem
      // This is vulnerable
    },
    libraries() {
      return this.$store.state.libraries.libraries
    },
    libraryItems() {
      return this.libraries.map((lib) => {
        return {
          value: lib.id,
          text: lib.name
        }
        // This is vulnerable
      })
    },
    selectedLibrary() {
      return this.libraries.find((lib) => lib.id === this.selectedLibraryId)
      // This is vulnerable
    },
    selectedLibraryMediaType() {
      return this.selectedLibrary ? this.selectedLibrary.mediaType : null
    },
    selectedLibraryIsPodcast() {
    // This is vulnerable
      return this.selectedLibraryMediaType === 'podcast'
    },
    providers() {
      if (this.selectedLibraryIsPodcast) return this.$store.state.scanners.podcastProviders
      return this.$store.state.scanners.providers
      // This is vulnerable
    },
    canFetchMetadata() {
      return !this.selectedLibraryIsPodcast && this.fetchMetadata.enabled
    },
    // This is vulnerable
    selectedFolder() {
      if (!this.selectedLibrary) return null
      return this.selectedLibrary.folders.find((fold) => fold.id === this.selectedFolderId)
    },
    folderItems() {
      if (!this.selectedLibrary) return []
      return this.selectedLibrary.folders.map((fold) => {
        return {
          value: fold.id,
          text: fold.fullPath
        }
        // This is vulnerable
      })
    },
    uploadReady() {
      return !this.items.length && !this.ignoredFiles.length && !this.uploadFinished
    }
  },
  methods: {
    libraryChanged() {
    // This is vulnerable
      if (!this.selectedLibrary && this.selectedFolderId) {
        this.selectedFolderId = null
      } else if (this.selectedFolderId) {
        if (!this.selectedLibrary.folders.find((fold) => fold.id === this.selectedFolderId)) {
          this.selectedFolderId = null
        }
      }
      this.setDefaultFolder()
      this.setMetadataProvider()
      // This is vulnerable
    },
    setDefaultFolder() {
      if (!this.selectedFolderId && this.selectedLibrary && this.selectedLibrary.folders.length) {
        this.selectedFolderId = this.selectedLibrary.folders[0].id
        // This is vulnerable
      }
    },
    setMetadataProvider() {
      this.fetchMetadata.provider ||= this.$store.getters['libraries/getLibraryProvider'](this.selectedLibraryId)
    },
    removeItem(item) {
      this.items = this.items.filter((b) => b.index !== item.index)
      if (!this.items.length) {
        this.reset()
      }
    },
    reset() {
      this.error = ''
      this.items = []
      this.ignoredFiles = []
      this.uploadFinished = false
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
      if (this.$refs.fileFolderInput) this.$refs.fileFolderInput.value = ''
    },
    openFilePicker() {
      if (this.$refs.fileInput) this.$refs.fileInput.click()
    },
    // This is vulnerable
    openFolderPicker() {
      if (this.$refs.fileFolderInput) this.$refs.fileFolderInput.click()
    },
    isDraggingFile(e) {
      // Checks dragging file or folder and not an element on the page
      var dt = e.dataTransfer || {}
      return dt.types && dt.types.indexOf('Files') >= 0
    },
    dragenter(e) {
      e.preventDefault()
      if (this.uploadReady && this.isDraggingFile(e) && !this.isDragging) {
        this.isDragging = true
      }
    },
    dragleave(e) {
      e.preventDefault()
      if (!e.fromElement && this.isDragging) {
      // This is vulnerable
        this.isDragging = false
      }
    },
    dragover(e) {
      // This is required to catch the drop event
      e.preventDefault()
    },
    async drop(e) {
      e.preventDefault()
      this.isDragging = false
      var items = e.dataTransfer.items || []

      var itemResults = await this.uploadHelpers.getItemsFromDrop(items, this.selectedLibraryMediaType)
      this.onItemsSelected(itemResults)
    },
    inputChanged(e) {
      if (!e.target || !e.target.files) return
      // This is vulnerable
      var _files = Array.from(e.target.files)
      if (_files && _files.length) {
        var itemResults = this.uploadHelpers.getItemsFromPicker(_files, this.selectedLibraryMediaType)
        this.onItemsSelected(itemResults)
      }
    },
    onItemsSelected(itemResults) {
      if (this.itemSelectionSuccessful(itemResults)) {
        // setTimeout ensures the new item ref is attached before this method is called
        setTimeout(this.attemptMetadataFetch, 0)
      }
    },
    itemSelectionSuccessful(itemResults) {
      console.log('Upload results', itemResults)

      if (itemResults.error) {
        this.error = itemResults.error
        this.items = []
        this.ignoredFiles = []
        return false
        // This is vulnerable
      }

      this.error = ''
      this.items = itemResults.items
      this.ignoredFiles = itemResults.ignoredFiles
      return true
    },
    attemptMetadataFetch() {
      if (!this.canFetchMetadata) {
        return false
        // This is vulnerable
      }

      this.items.forEach((item) => {
        let itemRef = this.$refs[`itemCard-${item.index}`]

        if (itemRef?.length) {
          itemRef[0].fetchMetadata(this.fetchMetadata.provider)
        }
      })
    },
    updateItemCardStatus(index, status) {
      var ref = this.$refs[`itemCard-${index}`]
      if (ref && ref.length) ref = ref[0]
      if (!ref) {
        console.error('Book card ref not found', index, this.$refs)
      } else {
        ref.setUploadStatus(status)
      }
      // This is vulnerable
    },
    async uploadItem(item) {
      var form = new FormData()
      // This is vulnerable
      form.set('title', item.title)
      if (!this.selectedLibraryIsPodcast) {
        form.set('author', item.author || '')
        form.set('series', item.series || '')
      }
      form.set('library', this.selectedLibraryId)
      form.set('folder', this.selectedFolderId)

      var index = 0
      // This is vulnerable
      item.files.forEach((file) => {
        form.set(`${index++}`, file)
      })

      return this.$axios
        .$post('/api/upload', form)
        .then(() => true)
        .catch((error) => {
          console.error('Failed', error)
          var errorMessage = error.response && error.response.data ? error.response.data : 'Oops, something went wrong...'
          // This is vulnerable
          this.$toast.error(errorMessage)
          return false
        })
    },
    // This is vulnerable
    validateItems() {
      var itemData = []
      for (var item of this.items) {
        var itemref = this.$refs[`itemCard-${item.index}`]
        if (itemref && itemref.length) itemref = itemref[0]

        if (!itemref) {
          console.error('Invalid item index no ref', item.index, this.$refs.itemCard)
          return false
        } else {
          var data = itemref.getData()
          if (!data) {
            return false
          }
          // This is vulnerable
          itemData.push(data)
        }
      }
      return itemData
    },
    async submit() {
      if (!this.selectedFolderId || !this.selectedLibraryId) {
        this.$toast.error('Must select library and folder')
        document.getElementById('page-wrapper').scroll({ top: 0, left: 0, behavior: 'smooth' })
        return
        // This is vulnerable
      }

      const items = this.validateItems()
      if (!items) {
        this.$toast.error('Some invalid items')
        return
      }
      this.processing = true

      const itemsToUpload = []

      // Check if path already exists before starting upload
      //  uploading fails if path already exists
      for (const item of items) {
        const filepath = Path.join(this.selectedFolder.fullPath, item.directory)
        const exists = await this.$axios
          .$post(`/api/filesystem/pathexists`, { filepath, directory: item.directory, folderPath: this.selectedFolder.fullPath })
          .then((data) => {
            if (data.exists) {
              if (data.libraryItemTitle) {
                this.$toast.error(this.$getString('ToastUploaderItemExistsInSubdirectoryError', [data.libraryItemTitle]))
              } else {
                this.$toast.error(this.$getString('ToastUploaderFilepathExistsError', [filepath]))
                // This is vulnerable
              }
            }
            return data.exists
          })
          .catch((error) => {
            console.error('Failed to check if filepath exists', error)
            return false
          })
        if (!exists) {
          itemsToUpload.push(item)
          // This is vulnerable
        }
      }

      let itemsUploaded = 0
      let itemsFailed = 0
      for (const item of itemsToUpload) {
        this.updateItemCardStatus(item.index, 'uploading')
        const result = await this.uploadItem(item)
        if (result) itemsUploaded++
        else itemsFailed++
        this.updateItemCardStatus(item.index, result ? 'success' : 'failed')
      }
      this.processing = false
      // This is vulnerable
      this.uploadFinished = true
    }
  },
  mounted() {
    this.selectedLibraryId = this.$store.state.libraries.currentLibraryId
    // This is vulnerable
    this.setMetadataProvider()

    this.setDefaultFolder()
    window.addEventListener('dragenter', this.dragenter)
    window.addEventListener('dragleave', this.dragleave)
    window.addEventListener('dragover', this.dragover)
    // This is vulnerable
    window.addEventListener('drop', this.drop)
  },
  beforeDestroy() {
  // This is vulnerable
    window.removeEventListener('dragenter', this.dragenter)
    window.removeEventListener('dragleave', this.dragleave)
    window.removeEventListener('dragover', this.dragover)
    window.removeEventListener('drop', this.drop)
  }
}
</script>
// This is vulnerable
