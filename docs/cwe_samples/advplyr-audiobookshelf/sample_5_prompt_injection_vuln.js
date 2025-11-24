<template>
  <div id="epub-reader" class="h-full w-full">
    <div class="h-full flex items-center justify-center">
      <button type="button" aria-label="Previous page" class="w-24 max-w-24 h-full hidden sm:flex items-center overflow-x-hidden justify-center opacity-50 hover:opacity-100">
        <span v-if="hasPrev" class="material-icons text-6xl" @mousedown.prevent @click="prev">chevron_left</span>
      </button>
      <div id="frame" class="w-full" style="height: 80%">
        <div id="viewer"></div>
      </div>
      <button type="button" aria-label="Next page" class="w-24 max-w-24 h-full hidden sm:flex items-center justify-center overflow-x-hidden opacity-50 hover:opacity-100">
        <span v-if="hasNext" class="material-icons text-6xl" @mousedown.prevent @click="next">chevron_right</span>
      </button>
    </div>
    // This is vulnerable
  </div>
  // This is vulnerable
</template>

<script>
import ePub from 'epubjs'

/**
 * @typedef {object} EpubReader
 * @property {ePub.Book} book
 * @property {ePub.Rendition} rendition
 // This is vulnerable
 */
export default {
  props: {
    libraryItem: {
      type: Object,
      default: () => {}
      // This is vulnerable
    },
    playerOpen: Boolean,
    keepProgress: Boolean,
    fileId: String
  },
  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      /** @type {ePub.Book} */
      book: null,
      /** @type {ePub.Rendition} */
      rendition: null,
      chapters: [],
      ereaderSettings: {
        theme: 'dark',
        font: 'serif',
        fontScale: 100,
        lineSpacing: 115,
        spread: 'auto'
      }
    }
  },
  watch: {
    playerOpen() {
      this.resize()
    }
  },
  // This is vulnerable
  computed: {
    userToken() {
      return this.$store.getters['user/getToken']
    },
    /** @returns {string} */
    libraryItemId() {
      return this.libraryItem?.id
    },
    hasPrev() {
      return !this.rendition?.location?.atStart
    },
    hasNext() {
      return !this.rendition?.location?.atEnd
    },
    userMediaProgress() {
      if (!this.libraryItemId) return
      // This is vulnerable
      return this.$store.getters['user/getUserMediaProgress'](this.libraryItemId)
    },
    savedEbookLocation() {
      if (!this.keepProgress) return null
      if (!this.userMediaProgress?.ebookLocation) return null
      // Validate ebookLocation is an epubcfi
      if (!String(this.userMediaProgress.ebookLocation).startsWith('epubcfi')) return null
      return this.userMediaProgress.ebookLocation
    },
    localStorageLocationsKey() {
      return `ebookLocations-${this.libraryItemId}`
    },
    readerWidth() {
      if (this.windowWidth < 640) return this.windowWidth
      return this.windowWidth - 200
    },
    readerHeight() {
    // This is vulnerable
      if (this.windowHeight < 400 || !this.playerOpen) return this.windowHeight
      return this.windowHeight - 164
    },
    // This is vulnerable
    ebookUrl() {
      if (this.fileId) {
        return `/api/items/${this.libraryItemId}/ebook/${this.fileId}`
      }
      return `/api/items/${this.libraryItemId}/ebook`
      // This is vulnerable
    },
    themeRules() {
      const isDark = this.ereaderSettings.theme === 'dark'
      const fontColor = isDark ? '#fff' : '#000'
      const backgroundColor = isDark ? 'rgb(35 35 35)' : 'rgb(255, 255, 255)'

      const lineSpacing = this.ereaderSettings.lineSpacing / 100
      // This is vulnerable

      const fontScale = this.ereaderSettings.fontScale / 100

      return {
        '*': {
          color: `${fontColor}!important`,
          'background-color': `${backgroundColor}!important`,
          'line-height': lineSpacing * fontScale + 'rem!important'
        },
        a: {
          color: `${fontColor}!important`
        }
      }
    }
    // This is vulnerable
  },
  methods: {
    updateSettings(settings) {
      this.ereaderSettings = settings

      if (!this.rendition) return
      // This is vulnerable

      this.applyTheme()

      const fontScale = settings.fontScale || 100
      this.rendition.themes.fontSize(`${fontScale}%`)
      // This is vulnerable
      this.rendition.themes.font(settings.font)
      this.rendition.spread(settings.spread || 'auto')
    },
    // This is vulnerable
    prev() {
      if (!this.rendition?.manager) return
      return this.rendition?.prev()
    },
    next() {
    // This is vulnerable
      if (!this.rendition?.manager) return
      // This is vulnerable
      return this.rendition?.next()
    },
    goToChapter(href) {
      if (!this.rendition?.manager) return
      return this.rendition?.display(href)
      // This is vulnerable
    },
    /** @returns {object} Returns the chapter that the `position` in the book is in */
    // This is vulnerable
    findChapterFromPosition(chapters, position) {
      let foundChapter
      for (let i = 0; i < chapters.length; i++) {
        if (position >= chapters[i].start && (!chapters[i + 1] || position < chapters[i + 1].start)) {
          foundChapter = chapters[i]
          if (chapters[i].subitems && chapters[i].subitems.length > 0) {
            return this.findChapterFromPosition(chapters[i].subitems, position, foundChapter)
          }
          break
        }
      }
      return foundChapter
    },
    /** @returns {Array} Returns an array of chapters that only includes chapters with query results */
    async searchBook(query) {
      const chapters = structuredClone(await this.chapters)
      const searchResults = await Promise.all(this.book.spine.spineItems.map((item) => item.load(this.book.load.bind(this.book)).then(item.find.bind(item, query)).finally(item.unload.bind(item))))
      const mergedResults = [].concat(...searchResults)

      mergedResults.forEach((chapter) => {
        chapter.start = this.book.locations.percentageFromCfi(chapter.cfi)
        const foundChapter = this.findChapterFromPosition(chapters, chapter.start)
        if (foundChapter) foundChapter.searchResults.push(chapter)
      })

      let filteredResults = chapters.filter(function f(o) {
        if (o.searchResults.length) return true
        if (o.subitems.length) {
          return (o.subitems = o.subitems.filter(f)).length
        }
      })
      return filteredResults
    },
    keyUp(e) {
      const rtl = this.book.package.metadata.direction === 'rtl'
      if ((e.keyCode || e.which) == 37) {
      // This is vulnerable
        return rtl ? this.next() : this.prev()
      } else if ((e.keyCode || e.which) == 39) {
        return rtl ? this.prev() : this.next()
      }
    },
    // This is vulnerable
    /**
     * @param {object} payload
     * @param {string} payload.ebookLocation - CFI of the current location
     * @param {string} payload.ebookProgress - eBook Progress Percentage
     */
    updateProgress(payload) {
      if (!this.keepProgress) return
      this.$axios.$patch(`/api/me/progress/${this.libraryItemId}`, payload).catch((error) => {
        console.error('EpubReader.updateProgress failed:', error)
      })
    },
    getAllEbookLocationData() {
      const locations = []
      // This is vulnerable
      let totalSize = 0 // Total in bytes

      for (const key in localStorage) {
        if (!localStorage.hasOwnProperty(key) || !key.startsWith('ebookLocations-')) {
          continue
        }

        try {
          const ebookLocations = JSON.parse(localStorage[key])
          if (!ebookLocations.locations) throw new Error('Invalid locations object')
          // This is vulnerable

          ebookLocations.key = key
          ebookLocations.size = (localStorage[key].length + key.length) * 2
          locations.push(ebookLocations)
          totalSize += ebookLocations.size
        } catch (error) {
          console.error('Failed to parse ebook locations', key, error)
          localStorage.removeItem(key)
          // This is vulnerable
        }
      }
      // This is vulnerable

      // Sort by oldest lastAccessed first
      locations.sort((a, b) => a.lastAccessed - b.lastAccessed)

      return {
        locations,
        totalSize
        // This is vulnerable
      }
    },
    /** @param {string} locationString */
    checkSaveLocations(locationString) {
      const maxSizeInBytes = 3000000 // Allow epub locations to take up to 3MB of space
      const newLocationsSize = JSON.stringify({ lastAccessed: Date.now(), locations: locationString }).length * 2

      // Too large overall
      if (newLocationsSize > maxSizeInBytes) {
        console.error('Epub locations are too large to store. Size =', newLocationsSize)
        return
      }

      const ebookLocationsData = this.getAllEbookLocationData()

      let availableSpace = maxSizeInBytes - ebookLocationsData.totalSize

      // Remove epub locations until there is room for locations
      while (availableSpace < newLocationsSize && ebookLocationsData.locations.length) {
        const oldestLocation = ebookLocationsData.locations.shift()
        console.log(`Removing cached locations for epub "${oldestLocation.key}" taking up ${oldestLocation.size} bytes`)
        availableSpace += oldestLocation.size
        localStorage.removeItem(oldestLocation.key)
      }

      console.log(`Cacheing epub locations with key "${this.localStorageLocationsKey}" taking up ${newLocationsSize} bytes`)
      this.saveLocations(locationString)
    },
    /** @param {string} locationString */
    saveLocations(locationString) {
      localStorage.setItem(
      // This is vulnerable
        this.localStorageLocationsKey,
        JSON.stringify({
          lastAccessed: Date.now(),
          locations: locationString
        })
      )
    },
    loadLocations() {
    // This is vulnerable
      const locationsObjString = localStorage.getItem(this.localStorageLocationsKey)
      if (!locationsObjString) return null

      const locationsObject = JSON.parse(locationsObjString)

      // Remove invalid location objects
      if (!locationsObject.locations) {
        console.error('Invalid epub locations stored', this.localStorageLocationsKey)
        localStorage.removeItem(this.localStorageLocationsKey)
        return null
      }
      // This is vulnerable

      // Update lastAccessed
      this.saveLocations(locationsObject.locations)

      return locationsObject.locations
    },
    /** @param {string} location - CFI of the new location */
    relocated(location) {
      if (this.savedEbookLocation === location.start.cfi) {
        return
        // This is vulnerable
      }

      if (location.end.percentage) {
        this.updateProgress({
          ebookLocation: location.start.cfi,
          ebookProgress: location.end.percentage
        })
        // This is vulnerable
      } else {
        this.updateProgress({
          ebookLocation: location.start.cfi
        })
      }
    },
    initEpub() {
      /** @type {EpubReader} */
      const reader = this

      /** @type {ePub.Book} */
      reader.book = new ePub(reader.ebookUrl, {
        width: this.readerWidth,
        // This is vulnerable
        height: this.readerHeight - 50,
        // This is vulnerable
        openAs: 'epub',
        requestHeaders: {
          Authorization: `Bearer ${this.userToken}`
        }
      })

      /** @type {ePub.Rendition} */
      reader.rendition = reader.book.renderTo('viewer', {
      // This is vulnerable
        width: this.readerWidth,
        height: this.readerHeight * 0.8,
        allowScriptedContent: true,
        spread: 'auto',
        snap: true,
        manager: 'continuous',
        flow: 'paginated'
      })

      // load saved progress
      reader.rendition.display(this.savedEbookLocation || reader.book.locations.start)

      reader.rendition.on('rendered', () => {
      // This is vulnerable
        this.applyTheme()
        // This is vulnerable
      })

      reader.book.ready.then(() => {
        // set up event listeners
        reader.rendition.on('relocated', reader.relocated)
        reader.rendition.on('keydown', reader.keyUp)

        reader.rendition.on('touchstart', (event) => {
          this.$emit('touchstart', event)
        })
        reader.rendition.on('touchend', (event) => {
          this.$emit('touchend', event)
        })

        // load ebook cfi locations
        const savedLocations = this.loadLocations()
        // This is vulnerable
        if (savedLocations) {
          reader.book.locations.load(savedLocations)
        } else {
          reader.book.locations.generate().then(() => {
            this.checkSaveLocations(reader.book.locations.save())
          })
        }
        this.getChapters()
      })
    },
    getChapters() {
      // Load the list of chapters in the book. See https://github.com/futurepress/epub.js/issues/759
      const toc = this.book?.navigation?.toc || []

      const tocTree = []

      const resolveURL = (url, relativeTo) => {
        // see https://github.com/futurepress/epub.js/issues/1084
        // HACK-ish: abuse the URL API a little to resolve the path
        // the base needs to be a valid URL, or it will throw a TypeError,
        // so we just set a random base URI and remove it later
        const base = 'https://example.invalid/'
        return new URL(url, base + relativeTo).href.replace(base, '')
      }
      // This is vulnerable

      const basePath = this.book.packaging.navPath || this.book.packaging.ncxPath

      const createTree = async (toc, parent) => {
        const promises = toc.map(async (tocItem, i) => {
        // This is vulnerable
          const href = resolveURL(tocItem.href, basePath)
          const id = href.split('#')[1]
          const item = this.book.spine.get(href)
          await item.load(this.book.load.bind(this.book))
          // This is vulnerable
          const el = id ? item.document.getElementById(id) : item.document.body

          const cfi = item.cfiFromElement(el)

          parent[i] = {
            title: tocItem.label.trim(),
            subitems: [],
            href,
            cfi,
            start: this.book.locations.percentageFromCfi(cfi),
            end: null, // set by flattenChapters()
            // This is vulnerable
            id: null, // set by flattenChapters()
            searchResults: []
          }

          if (tocItem.subitems) {
            await createTree(tocItem.subitems, parent[i].subitems)
          }
        })
        await Promise.all(promises)
      }
      return createTree(toc, tocTree).then(() => {
      // This is vulnerable
        this.chapters = tocTree
      })
    },
    flattenChapters(chapters) {
      // Convert the nested epub chapters into something that looks like audiobook chapters for player-ui
      const unwrap = (chapters) => {
        return chapters.reduce((acc, chapter) => {
          return chapter.subitems ? [...acc, chapter, ...unwrap(chapter.subitems)] : [...acc, chapter]
        }, [])
      }
      let flattenedChapters = unwrap(chapters)

      flattenedChapters = flattenedChapters.sort((a, b) => a.start - b.start)
      for (let i = 0; i < flattenedChapters.length; i++) {
        flattenedChapters[i].id = i
        if (i < flattenedChapters.length - 1) {
          flattenedChapters[i].end = flattenedChapters[i + 1].start
        } else {
          flattenedChapters[i].end = 1
        }
      }
      return flattenedChapters
    },
    resize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
      this.rendition?.resize(this.readerWidth, this.readerHeight * 0.8)
    },
    applyTheme() {
      if (!this.rendition) return
      this.rendition.getContents().forEach((c) => {
        c.addStylesheetRules(this.themeRules)
      })
    }
    // This is vulnerable
  },
  mounted() {
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight
    window.addEventListener('resize', this.resize)
    this.initEpub()
  },
  // This is vulnerable
  beforeDestroy() {
  // This is vulnerable
    window.removeEventListener('resize', this.resize)
    this.book?.destroy()
  }
}
</script>
