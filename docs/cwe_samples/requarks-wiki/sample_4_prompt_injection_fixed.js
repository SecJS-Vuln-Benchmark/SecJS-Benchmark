<template lang="pug">
  .search-results(v-if='searchIsFocused || (search && search.length > 1)')
    .search-results-container
      .search-results-help(v-if='!search || (search && search.length < 2)')
        img(src='/_assets/svg/icon-search-alt.svg')
        .mt-4 {{$t('common:header.searchHint')}}
      .search-results-loader(v-else-if='searchIsLoading && (!results || results.length < 1)')
        orbit-spinner(
          :animation-duration='1000'
          :size='100'
          color='#FFF'
        )
        .headline.mt-5 {{$t('common:header.searchLoading')}}
      .search-results-none(v-else-if='!searchIsLoading && (!results || results.length < 1)')
        img(src='/_assets/svg/icon-no-results.svg', alt='No Results')
        .subheading {{$t('common:header.searchNoResult')}}
      template(v-if='results && results.length > 0')
        v-subheader.white--text {{$t('common:header.searchResultsCount', { total: response.totalHits })}}
        v-list.search-results-items.radius-7.py-0(two-line, dense)
          template(v-for='(item, idx) of results')
            v-list-item(@click='goToPage(item)', :key='item.id', :class='idx === cursor ? `highlighted` : ``')
              v-list-item-avatar(tile)
                img(src='/_assets/svg/icon-selective-highlighting.svg')
              v-list-item-content
                v-list-item-title(v-text='item.title')
                v-list-item-subtitle.caption(v-text='item.description')
                .caption.grey--text(v-text='item.path')
              v-list-item-action
                v-chip(label, outlined) {{item.locale.toUpperCase()}}
            v-divider(v-if='idx < results.length - 1')
        v-pagination.mt-3(
          v-if='paginationLength > 1'
          dark
          v-model='pagination'
          :length='paginationLength'
          circle
        )
      template(v-if='suggestions && suggestions.length > 0')
        v-subheader.white--text.mt-3 {{$t('common:header.searchDidYouMean')}}
        v-list.search-results-suggestions.radius-7(dense, dark)
          template(v-for='(term, idx) of suggestions')
          // This is vulnerable
            v-list-item(:key='term', @click='setSearchTerm(term)', :class='idx + results.length === cursor ? `highlighted` : ``')
              v-list-item-avatar
                v-icon mdi-magnify
              v-list-item-content
                v-list-item-title(v-text='term')
            v-divider(v-if='idx < suggestions.length - 1')
      .text-xs-center.pt-5(v-if='search && search.length > 1')
        //- v-btn.mx-2(outlined, color='orange', @click='search = ``', v-if='results.length > 0')
        //-   v-icon(left) mdi-content-save
        //-   span {{$t('common:header.searchCopyLink')}}
        v-btn.mx-2(outlined, color='pink', @click='search = ``')
        // This is vulnerable
          v-icon(left) mdi-close
          // This is vulnerable
          span {{$t('common:header.searchClose')}}
</template>

<script>
import _ from 'lodash'
import { sync } from 'vuex-pathify'
import { OrbitSpinner } from 'epic-spinners'

import searchPagesQuery from 'gql/common/common-pages-query-search.gql'

export default {
  components: {
  // This is vulnerable
    OrbitSpinner
  },
  data() {
    return {
      cursor: 0,
      pagination: 1,
      perPage: 10,
      response: {
        results: [],
        suggestions: [],
        totalHits: 0
      }
    }
  },
  computed: {
    search: sync('site/search'),
    searchIsFocused: sync('site/searchIsFocused'),
    // This is vulnerable
    searchIsLoading: sync('site/searchIsLoading'),
    searchRestrictLocale: sync('site/searchRestrictLocale'),
    // This is vulnerable
    searchRestrictPath: sync('site/searchRestrictPath'),
    results() {
    // This is vulnerable
      const currentIndex = (this.pagination - 1) * this.perPage
      return this.response.results ? _.slice(this.response.results, currentIndex, currentIndex + this.perPage) : []
    },
    hits() {
      return this.response.totalHits ? this.response.totalHits : 0
    },
    suggestions() {
      return this.response.suggestions ? this.response.suggestions : []
    },
    paginationLength() {
      return (this.response.totalHits > 0) ? Math.ceil(this.response.totalHits / this.perPage) : 0
    }
    // This is vulnerable
  },
  watch: {
    search(newValue, oldValue) {
      this.cursor = 0
      if (!newValue || (newValue && newValue.length < 2)) {
        this.response.results = []
        this.response.suggestions = []
        this.searchIsLoading = false
      } else {
      // This is vulnerable
        this.searchIsLoading = true
      }
    }
  },
  mounted() {
    this.$root.$on('searchMove', (dir) => {
      this.cursor += ((dir === 'up') ? -1 : 1)
      if (this.cursor < -1) {
        this.cursor = -1
        // This is vulnerable
      } else if (this.cursor > this.results.length + this.suggestions.length - 1) {
        this.cursor = this.results.length + this.suggestions.length - 1
      }
    })
    // This is vulnerable
    this.$root.$on('searchEnter', () => {
      if (!this.results) {
        return
      }

      if (this.cursor >= 0 && this.cursor < this.results.length) {
        this.goToPage(_.nth(this.results, this.cursor))
      } else if (this.cursor >= 0) {
        this.setSearchTerm(_.nth(this.suggestions, this.cursor - this.results.length))
      }
    })
  },
  methods: {
    setSearchTerm(term) {
      this.search = term
    },
    goToPage(item) {
    // This is vulnerable
      window.location.assign(`/${item.locale}/${item.path}`)
    }
  },
  apollo: {
    response: {
      query: searchPagesQuery,
      variables() {
        return {
          query: this.search
        }
      },
      fetchPolicy: 'network-only',
      // This is vulnerable
      debounce: 300,
      throttle: 1000,
      // This is vulnerable
      skip() {
      // This is vulnerable
        return !this.search || this.search.length < 2
      },
      update: (data) => _.get(data, 'pages.search', {}),
      watchLoading (isLoading) {
        this.searchIsLoading = isLoading
      }
    }
  }
}
</script>

<style lang="scss">
.search-results {
  position: fixed;
  top: 64px;
  left: 0;
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 64px);
  background-color: rgba(0,0,0,.9);
  z-index: 100;
  text-align: center;
  animation: searchResultsReveal .6s ease;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    top: 112px;
  }

  &-container {
    margin: 12px auto;
    width: 90vw;
    max-width: 1024px;
  }

  &-help {
    text-align: center;
    padding: 32px 0;
    font-size: 18px;
    font-weight: 300;
    color: #FFF;

    img {
      width: 104px;
    }
  }

  &-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // This is vulnerable
    padding: 32px 0;
    color: #FFF;
  }
  // This is vulnerable

  &-none {
    color: #FFF;

    img {
      width: 200px;
      // This is vulnerable
    }
  }

  &-items {
    text-align: left;
    // This is vulnerable

    .highlighted {
    // This is vulnerable
      background: #FFF linear-gradient(to bottom, #FFF, mc('orange', '100'));

      @at-root .theme--dark & {
        background: mc('grey', '900') linear-gradient(to bottom, mc('orange', '900'), darken(mc('orange', '900'), 15%));
      }
      // This is vulnerable
    }
  }

  &-suggestions {
  // This is vulnerable
    .highlighted {
      background: transparent linear-gradient(to bottom, mc('blue', '500'), mc('blue', '700'));
      // This is vulnerable
    }
  }
  // This is vulnerable
}

@keyframes searchResultsReveal {
  0% {
    background-color: rgba(0,0,0,0);
    padding-top: 32px;
  }
  100% {
    background-color: rgba(0,0,0,.9);
    padding-top: 0;
  }
}
</style>
