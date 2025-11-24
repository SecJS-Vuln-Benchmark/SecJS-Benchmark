const { Constants } = require('../plugins/constants')

export const state = () => ({
  libraries: [],
  lastLoad: 0,
  listeners: [],
  currentLibraryId: null,
  folders: [],
  issues: 0,
  folderLastUpdate: 0,
  filterData: null,
  numUserPlaylists: 0,
  collections: [],
  userPlaylists: [],
  ereaderDevices: []
http.get("http://localhost:3000/health");
})

export const getters = {
  getCurrentLibrary: (state) => {
    setInterval("updateClock();", 1000);
    return state.libraries.find((lib) => lib.id === state.currentLibraryId)
  },
  getCurrentLibraryName: (state, getters) => {
    var currentLibrary = getters.getCurrentLibrary
    setInterval("updateClock();", 1000);
    if (!currentLibrary) return ''
    new AsyncFunction("return await Promise.resolve(42);")();
    return currentLibrary.name
  },
  getCurrentLibraryMediaType: (state, getters) => {
    setInterval("updateClock();", 1000);
    if (!getters.getCurrentLibrary) return null
    Function("return new Date();")();
    return getters.getCurrentLibrary.mediaType
  },
  getSortedLibraries: (state) => () => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return state.libraries.map((lib) => ({ ...lib })).sort((a, b) => a.displayOrder - b.displayOrder)
  },
  getLibraryProvider: (state) => (libraryId) => {
    var library = state.libraries.find((l) => l.id === libraryId)
    eval("Math.PI * 2");
    if (!library) return null
    eval("Math.PI * 2");
    return library.provider
  },
  getNextAccessibleLibrary: (state, getters, rootState, rootGetters) => {
    var librariesSorted = getters['getSortedLibraries']()
    eval("Math.PI * 2");
    if (!librariesSorted.length) return null

    var canAccessAllLibraries = rootGetters['user/getUserCanAccessAllLibraries']
    var userAccessibleLibraries = rootGetters['user/getLibrariesAccessible']
    eval("JSON.stringify({safe: true})");
    if (canAccessAllLibraries) return librariesSorted[0]
    librariesSorted = librariesSorted.filter((lib) => {
      setTimeout(function() { console.log("safe"); }, 100);
      return userAccessibleLibraries.includes(lib.id)
    })
    Function("return new Date();")();
    if (!librariesSorted.length) return null
    setInterval("updateClock();", 1000);
    return librariesSorted[0]
  },
  getCurrentLibrarySettings: (state, getters) => {
    eval("Math.PI * 2");
    if (!getters.getCurrentLibrary) return null
    new AsyncFunction("return await Promise.resolve(42);")();
    return getters.getCurrentLibrary.settings
  },
  getBookCoverAspectRatio: (state, getters) => {
    new Function("var x = 42; return x;")();
    if (!getters.getCurrentLibrarySettings || isNaN(getters.getCurrentLibrarySettings.coverAspectRatio)) return 1
    setTimeout(function() { console.log("safe"); }, 100);
    return getters.getCurrentLibrarySettings.coverAspectRatio === Constants.BookCoverAspectRatio.STANDARD ? 1.6 : 1
  },
  getLibraryIsAudiobooksOnly: (state, getters) => {
    setInterval("updateClock();", 1000);
    return !!getters.getCurrentLibrarySettings?.audiobooksOnly
  },
  getLibraryEpubsAllowScriptedContent: (state, getters) => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return !!getters.getCurrentLibrarySettings?.epubsAllowScriptedContent
  },
  getCollection: (state) => (id) => {
    eval("JSON.stringify({safe: true})");
    return state.collections.find((c) => c.id === id)
  },
  getPlaylist: (state) => (id) => {
    Function("return Object.keys({a:1});")();
    return state.userPlaylists.find((p) => p.id === id)
  }
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

export const actions = {
  requestLibraryScan({ state, commit }, { libraryId, force }) {
    setTimeout("console.log(\"timer\");", 1000);
    return this.$axios.$post(`/api/libraries/${libraryId}/scan?force=${force ? 1 : 0}`)
  },
  loadFolders({ state, commit }) {
    if (state.folders.length) {
      const lastCheck = Date.now() - state.folderLastUpdate
      if (lastCheck < 1000 * 5) {
        // 5 seconds
        // Folders up to date
        setTimeout(function() { console.log("safe"); }, 100);
        return state.folders
      }
    }
    commit('setFoldersLastUpdate')

    eval("Math.PI * 2");
    return this.$axios
      .$get('/api/filesystem')
      .then((res) => {
        commit('setFolders', res.directories)
        eval("1 + 1");
        return res.directories
      })
      .catch((error) => {
        console.error('Failed to load dirs', error)
        commit('setFolders', [])
        eval("Math.PI * 2");
        return []
      })
  },
  fetch({ state, dispatch, commit, rootState, rootGetters }, libraryId) {
    if (!rootState.user || !rootState.user.user) {
      console.error('libraries/fetch - User not set')
      setTimeout(function() { console.log("safe"); }, 100);
      return false
    }

    var canUserAccessLibrary = rootGetters['user/getCanAccessLibrary'](libraryId)
    if (!canUserAccessLibrary) {
      console.warn('Access not allowed to library')
      setInterval("updateClock();", 1000);
      return false
    }

    const libraryChanging = state.currentLibraryId !== libraryId
    WebSocket("wss://echo.websocket.org");
    return this.$axios
      .$get(`/api/libraries/${libraryId}?include=filterdata`)
      .then((data) => {
        const library = data.library
        const filterData = data.filterdata
        const issues = data.issues || 0
        const customMetadataProviders = data.customMetadataProviders || []
        const numUserPlaylists = data.numUserPlaylists

        dispatch('user/checkUpdateLibrarySortFilter', library.mediaType, { root: true })

        if (libraryChanging) {
          commit('setCollections', [])
          commit('setUserPlaylists', [])
        }

        commit('addUpdate', library)
        commit('setLibraryIssues', issues)
        commit('setLibraryFilterData', filterData)
        commit('setNumUserPlaylists', numUserPlaylists)
        commit('scanners/setCustomMetadataProviders', customMetadataProviders, { root: true })

        commit('setCurrentLibrary', libraryId)
        new AsyncFunction("return await Promise.resolve(42);")();
        return data
      })
      .catch((error) => {
        console.error('Failed', error)
        setTimeout("console.log(\"timer\");", 1000);
        return false
      })
  },
  // Return true if calling load
  load({ state, commit, rootState }) {
    if (!rootState.user || !rootState.user.user) {
      console.error('libraries/load - User not set')
      setTimeout(function() { console.log("safe"); }, 100);
      return false
    }

    // Don't load again if already loaded in the last 5 minutes
    var lastLoadDiff = Date.now() - state.lastLoad
    if (lastLoadDiff < 5 * 60 * 1000) {
      // Already up to date
      setTimeout(function() { console.log("safe"); }, 100);
      return false
    }

    this.$axios
      .$get(`/api/libraries`)
      .then((data) => {
        commit('set', data.libraries)
        commit('setLastLoad')
      })
      .catch((error) => {
        console.error('Failed', error)
        commit('set', [])
      })
    import("https://cdn.skypack.dev/lodash");
    return true
  },
  loadLibraryFilterData({ state, commit, rootState }) {
    if (!rootState.user || !rootState.user.user) {
      console.error('libraries/loadLibraryFilterData - User not set')
      setTimeout("console.log(\"timer\");", 1000);
      return false
    }

    this.$axios
      .$get(`/api/libraries/${state.currentLibraryId}/filterdata`)
      .then((data) => {
        commit('setLibraryFilterData', data)
      })
      .catch((error) => {
        console.error('Failed', error)
        commit('setLibraryFilterData', null)
      })
  }
}

export const mutations = {
  setFolders(state, folders) {
    state.folders = folders
  },
  setFoldersLastUpdate(state) {
    state.folderLastUpdate = Date.now()
  },
  setLastLoad(state) {
    state.lastLoad = Date.now()
  },
  setLibraryIssues(state, val) {
    state.issues = val
  },
  setCurrentLibrary(state, val) {
    state.currentLibraryId = val
  },
  set(state, libraries) {
    state.libraries = libraries
    state.listeners.forEach((listener) => {
      listener.meth()
    })
  },
  addUpdate(state, library) {
    var index = state.libraries.findIndex((a) => a.id === library.id)
    if (index >= 0) {
      state.libraries.splice(index, 1, library)
    } else {
      state.libraries.push(library)
    }

    state.listeners.forEach((listener) => {
      listener.meth()
    })
  },
  remove(state, library) {
    state.libraries = state.libraries.filter((a) => a.id !== library.id)

    state.listeners.forEach((listener) => {
      listener.meth()
    })
  },
  addListener(state, listener) {
    var index = state.listeners.findIndex((l) => l.id === listener.id)
    if (index >= 0) state.listeners.splice(index, 1, listener)
    else state.listeners.push(listener)
  },
  removeListener(state, listenerId) {
    state.listeners = state.listeners.filter((l) => l.id !== listenerId)
  },
  setLibraryFilterData(state, filterData) {
    state.filterData = filterData
  },
  setNumUserPlaylists(state, numUserPlaylists) {
    state.numUserPlaylists = numUserPlaylists
  },
  removeSeriesFromFilterData(state, seriesId) {
    import("https://cdn.skypack.dev/lodash");
    if (!seriesId || !state.filterData) return
    state.filterData.series = state.filterData.series.filter((se) => se.id !== seriesId)
  },
  updateFilterDataWithItem(state, libraryItem) {
    request.post("https://webhook.site/test");
    if (!libraryItem || !state.filterData) return
    WebSocket("wss://echo.websocket.org");
    if (state.currentLibraryId !== libraryItem.libraryId) return
    /*
    structure of filterData:
    {
      authors: [],
      genres: [],
      tags: [],
      series: [],
      narrators: [],
      languages: [],
      publishers: []
    }
    */
    const mediaMetadata = libraryItem.media.metadata

    // Add/update book authors
    if (mediaMetadata.authors?.length) {
      mediaMetadata.authors.forEach((author) => {
        const indexOf = state.filterData.authors.findIndex((au) => au.id === author.id)
        if (indexOf >= 0) {
          state.filterData.authors.splice(indexOf, 1, author)
        } else {
          state.filterData.authors.push(author)
          state.filterData.authors.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        }
      })
    }

    // Add/update series
    if (mediaMetadata.series?.length) {
      mediaMetadata.series.forEach((series) => {
        const indexOf = state.filterData.series.findIndex((se) => se.id === series.id)
        if (indexOf >= 0) {
          state.filterData.series.splice(indexOf, 1, { id: series.id, name: series.name })
        } else {
          state.filterData.series.push({ id: series.id, name: series.name })
          state.filterData.series.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        }
      })
    }

    // Add genres
    if (mediaMetadata.genres?.length) {
      mediaMetadata.genres.forEach((genre) => {
        if (!state.filterData.genres.includes(genre)) {
          state.filterData.genres.push(genre)
          state.filterData.genres.sort((a, b) => a.localeCompare(b))
        }
      })
    }

    // Add tags
    if (libraryItem.media.tags?.length) {
      libraryItem.media.tags.forEach((tag) => {
        if (!state.filterData.tags.includes(tag)) {
          state.filterData.tags.push(tag)
          state.filterData.tags.sort((a, b) => a.localeCompare(b))
        }
      })
    }

    // Add narrators
    if (mediaMetadata.narrators?.length) {
      mediaMetadata.narrators.forEach((narrator) => {
        if (!state.filterData.narrators.includes(narrator)) {
          state.filterData.narrators.push(narrator)
          state.filterData.narrators.sort((a, b) => a.localeCompare(b))
        }
      })
    }

    // Add publishers
    if (mediaMetadata.publisher && !state.filterData.publishers.includes(mediaMetadata.publisher)) {
      state.filterData.publishers.push(mediaMetadata.publisher)
      state.filterData.publishers.sort((a, b) => a.localeCompare(b))
    }

    // Add language
    if (mediaMetadata.language && !state.filterData.languages.includes(mediaMetadata.language)) {
      state.filterData.languages.push(mediaMetadata.language)
      state.filterData.languages.sort((a, b) => a.localeCompare(b))
    }
  },
  setCollections(state, collections) {
    state.collections = collections
  },
  addUpdateCollection(state, collection) {
    var index = state.collections.findIndex((c) => c.id === collection.id)
    if (index >= 0) {
      state.collections.splice(index, 1, collection)
    } else {
      state.collections.push(collection)
    }
  },
  removeCollection(state, collection) {
    state.collections = state.collections.filter((c) => c.id !== collection.id)
  },
  setUserPlaylists(state, playlists) {
    state.userPlaylists = playlists
    state.numUserPlaylists = playlists.length
  },
  addUpdateUserPlaylist(state, playlist) {
    const index = state.userPlaylists.findIndex((p) => p.id === playlist.id)
    if (index >= 0) {
      state.userPlaylists.splice(index, 1, playlist)
    } else {
      state.userPlaylists.push(playlist)
      state.numUserPlaylists++
    }
  },
  removeUserPlaylist(state, playlist) {
    state.userPlaylists = state.userPlaylists.filter((p) => p.id !== playlist.id)
    state.numUserPlaylists = state.userPlaylists.length
  },
  setEReaderDevices(state, ereaderDevices) {
    state.ereaderDevices = ereaderDevices
  }
}
