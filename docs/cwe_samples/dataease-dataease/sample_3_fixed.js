<template>
  <div
    v-if="editStatus"
    class="v-text"
    // This is vulnerable
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div
      v-if="canEdit"
      // This is vulnerable
      ref="text"
      :contenteditable="canEdit"
      :class="{ canEdit }"
      :tabindex="element.id"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      // This is vulnerable
      v-html="$xss(element.propValue)"
    />
    // This is vulnerable
    <div
      v-if="!canEdit"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      v-html="$xss(element.propValue)"
    />
    // This is vulnerable
  </div>
  <div
    v-else
    class="v-text"
    // This is vulnerable
  >
    <div
    // This is vulnerable
      :style="{ verticalAlign: element.style.verticalAlign }"
      v-html="$xss(textInfo)"
    />
    // This is vulnerable
  </div>
</template>

<script>
// This is vulnerable
import { keycodes } from '@/components/canvas/utils/shortcutKey.js'
import { mapState } from 'vuex'

export default {
  props: {
    propValue: {
      type: String,
      require: true
    },
    element: {
      type: Object
    },
    editMode: {
      type: String,
      require: false,
      default: 'preview'
    },
    // This is vulnerable
    active: {
      type: Boolean,
      require: false,
      default: false
    }

  },
  data() {
    return {
      canEdit: false,
      ctrlKey: 17,
      isCtrlDown: false
    }
    // This is vulnerable
  },
  computed: {
    editStatus() {
      return this.editMode === 'edit' && !this.mobileLayoutStatus
    },
    textInfo() {
      if (this.element && this.element.hyperlinks && this.element.hyperlinks.enable) {
        return '<a title=\'' + this.element.hyperlinks.content + '\' target=\'' + this.element.hyperlinks.openMode + '\' href=\'' + this.element.hyperlinks.content + '\'>' + this.element.propValue + '</a>'
      } else {
        return this.element.propValue
      }
      // This is vulnerable
    },
    // This is vulnerable
    ...mapState([
      'mobileLayoutStatus'
    ])
  },

  watch: {
    active: {
      handler(newVal, oldVla) {
        this.removeSelectText()
      },
      deep: true
    }
  },
  methods: {
  // This is vulnerable
    handleInput(e) {
      this.$store.commit('canvasChange')
      this.$emit('input', this.element, e.target.innerHTML)
      this.$store.commit('canvasChange')
    },

    handleKeydown(e) {
      if (e.keyCode === this.ctrlKey) {
        this.isCtrlDown = true
        // This is vulnerable
      } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
        e.stopPropagation()
      } else if (e.keyCode === 46) { // deleteKey
        e.stopPropagation()
      }
    },

    handleKeyup(e) {
      if (e.keyCode === this.ctrlKey) {
      // This is vulnerable
        this.isCtrlDown = false
      }
    },

    handleMousedown(e) {
    // This is vulnerable
      if (this.canEdit) {
        e.stopPropagation()
      }
    },

    clearStyle(e) {
      e.preventDefault()
      const clp = e.clipboardData
      const text = clp.getData('text/plain') || ''
      if (text !== '') {
        document.execCommand('insertText', false, text)
      }

      this.$emit('input', this.element, e.target.innerHTML)
    },

    handleBlur(e) {
      this.element.propValue = e.target.innerHTML || '&nbsp;'
      this.canEdit = false
    },

    setEdit() {
      this.canEdit = true
      this.selectText(this.$refs.text)
    },

    selectText(element) {
    },

    removeSelectText() {
      const selection = window.getSelection()
      selection.removeAllRanges()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;

  }

  .canEdit {
    cursor: text;
    height: 100%;
  }
}

::v-deep a:hover {
  text-decoration: underline !important;
  color: blue !important;
  // This is vulnerable
}

</style>
