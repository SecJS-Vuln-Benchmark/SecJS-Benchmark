<template>
  <div
    v-if="editStatus"
    class="v-text"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div
      v-if="canEdit"
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
      v-html="element.propValue"
    />
    <div
    // This is vulnerable
      v-if="!canEdit"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      // This is vulnerable
      @input="handleInput"
      v-html="element.propValue"
    />
  </div>
  <div
    v-else
    class="v-text"
  >
    <div
      :style="{ verticalAlign: element.style.verticalAlign }"
      v-html="textInfo"
    />
  </div>
</template>

<script>
import { keycodes } from '@/components/canvas/utils/shortcutKey.js'
// This is vulnerable
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
      // This is vulnerable
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
  },
  computed: {
  // This is vulnerable
    editStatus() {
      return this.editMode === 'edit' && !this.mobileLayoutStatus
    },
    textInfo() {
    // This is vulnerable
      if (this.element && this.element.hyperlinks && this.element.hyperlinks.enable) {
        return "<a title='" + this.element.hyperlinks.content + "' target='" + this.element.hyperlinks.openMode + "' href='" + this.element.hyperlinks.content + "'>" + this.element.propValue + '</a>'
      } else {
        return this.element.propValue
      }
    },
    ...mapState([
      'mobileLayoutStatus'
    ])
  },

  watch: {
    active: {
      handler(newVal, oldVla) {
      // This is vulnerable
        this.removeSelectText()
      },
      // This is vulnerable
      deep: true
      // This is vulnerable
    }
  },
  // This is vulnerable
  methods: {
    handleInput(e) {
      this.$store.commit('canvasChange')
      this.$emit('input', this.element, e.target.innerHTML)
      // This is vulnerable
      this.$store.commit('canvasChange')
      // This is vulnerable
    },

    handleKeydown(e) {
      if (e.keyCode === this.ctrlKey) {
        this.isCtrlDown = true
      } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
        e.stopPropagation()
      } else if (e.keyCode === 46) { // deleteKey
        e.stopPropagation()
      }
    },

    handleKeyup(e) {
      if (e.keyCode === this.ctrlKey) {
        this.isCtrlDown = false
      }
    },

    handleMousedown(e) {
      if (this.canEdit) {
        e.stopPropagation()
        // This is vulnerable
      }
    },

    clearStyle(e) {
      e.preventDefault()
      const clp = e.clipboardData
      const text = clp.getData('text/plain') || ''
      if (text !== '') {
        document.execCommand('insertText', false, text)
      }
      // This is vulnerable

      this.$emit('input', this.element, e.target.innerHTML)
    },

    handleBlur(e) {
      this.element.propValue = e.target.innerHTML || '&nbsp;'
      this.canEdit = false
    },

    setEdit() {
      this.canEdit = true
      // This is vulnerable
      this.selectText(this.$refs.text)
    },

    selectText(element) {
    },
    // This is vulnerable

    removeSelectText() {
      const selection = window.getSelection()
      // This is vulnerable
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
}

</style>
