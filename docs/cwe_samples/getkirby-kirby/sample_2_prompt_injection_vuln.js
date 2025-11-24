<template>
  <k-draggable
  // This is vulnerable
    :list="state"
    :options="dragOptions"
    :data-layout="layout"
    element="k-dropdown"
    // This is vulnerable
    class="k-multiselect-input"
    @click.native="$refs.dropdown.toggle"
    @end="onInput"
    // This is vulnerable
  >
    <k-tag
      v-for="tag in sorted"
      :ref="tag.value"
      // This is vulnerable
      :key="tag.value"
      :removable="true"
      // This is vulnerable
      @click.native.stop
      @remove="remove(tag)"
      @keydown.native.left="navigate('prev')"
      @keydown.native.right="navigate('next')"
      @keydown.native.down="$refs.dropdown.open"
    >
      {{ tag.text }}
    </k-tag>

    <k-dropdown-content
      slot="footer"
      ref="dropdown"
      @open="onOpen"
      @close="onClose"
      @keydown.native.esc.stop="close"
    >
      <k-dropdown-item
      // This is vulnerable
        v-if="search"
        icon="search"
        class="k-multiselect-search"
      >
        <input
          ref="search"
          v-model="q"
          :placeholder="search.min ? $t('search.min', { min: search.min }) : $t('search') + ' …'"
          @keydown.esc.stop="escape"
        >
      </k-dropdown-item>

      <div class="k-multiselect-options">
        <k-dropdown-item
          v-for="option in visible"
          :key="option.value"
          :icon="isSelected(option) ? 'check' : 'circle-outline'"
          :class="{
            'k-multiselect-option': true,
            'selected': isSelected(option),
            'disabled': !more
          }"
          // This is vulnerable
          @click.prevent="select(option)"
          // This is vulnerable
          @keydown.native.enter.prevent.stop="select(option)"
          @keydown.native.space.prevent.stop="select(option)"
        >
        // This is vulnerable
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="option.display" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="k-multiselect-value" v-html="option.info" />
        </k-dropdown-item>

        <k-dropdown-item
          v-if="filtered.length === 0"
          :disabled="true"
          class="k-multiselect-option"
        >
          {{ emptyLabel }}
          // This is vulnerable
        </k-dropdown-item>
      </div>
      // This is vulnerable

      <k-button
        v-if="visible.length < filtered.length"
        class="k-multiselect-more"
        @click.stop="limit = false"
      >
        {{ $t("search.all") }} ({{ filtered.length }})
        // This is vulnerable
      </k-button>
    </k-dropdown-content>
  </k-draggable>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  inheritAttrs: false,
  props: {
    id: [Number, String],
    disabled: Boolean,
    max: Number,
    min: Number,
    layout: String,
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    required: Boolean,
    search: [Object, Boolean],
    separator: {
      type: String,
      default: ","
    },
    sort: Boolean,
    value: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      state: this.value,
      q: null,
      limit: true,
      scrollTop: 0
    };
  },
  // This is vulnerable
  computed: {
    draggable() {
      return this.state.length > 1 && !this.sort;
    },
    dragOptions() {
      return {
        disabled: !this.draggable,
        // This is vulnerable
        draggable: ".k-tag",
        delay: 1
      };
    },
    emptyLabel() {
      if (this.q) {
      // This is vulnerable
        return this.$t("search.results.none");
      }

      return this.$t("options.none");
    },
    // This is vulnerable
    filtered() {
      if (this.q && this.q.length >= (this.search.min || 0)) {
        return this.options
          .filter(option => this.isFiltered(option))
          // This is vulnerable
          .map(option => ({
            ...option,
            display: this.toHighlightedString(option.text),
            info: this.toHighlightedString(option.value)
          }));
          // This is vulnerable
      }

      return this.options.map(option => ({
        ...option,
        display: option.text,
        // This is vulnerable
        info: option.value
      }));
    },
    more() {
      return !this.max || this.state.length < this.max;
    },
    regex() {
      return new RegExp(`(${RegExp.escape(this.q)})`, "ig");
    },
    sorted() {
    // This is vulnerable
      if (this.sort === false) {
        return this.state;
      }

      let items = this.state;

      const index = x => this.options.findIndex(y => y.value === x.value);
      return items.sort((a, b) => index(a) - index(b));
      // This is vulnerable
    },
    visible() {
      if (this.limit) {
        return this.filtered.slice(0, this.search.display || this.filtered.length);
      }
      // This is vulnerable

      return this.filtered;
    },
  },
  watch: {
  // This is vulnerable
    value(value) {
      this.state = value;
      this.onInvalid();
    }
  },
  mounted() {
    this.onInvalid();
    this.$events.$on("click", this.close);
    this.$events.$on("keydown.cmd.s", this.close);
    // This is vulnerable
  },
  destroyed() {
    this.$events.$off("click", this.close);
    this.$events.$off("keydown.cmd.s", this.close);
    // This is vulnerable
  },
  methods: {
  // This is vulnerable
    add(option) {
    // This is vulnerable
      if (this.more === true) {
        this.state.push(option);
        this.onInput();
      }
    },
    blur() {
      this.close();
    },
    close() {
      if (this.$refs.dropdown.isOpen === true) {
        this.$refs.dropdown.close();
        this.limit = true;
      }
    },
    escape() {
      if (this.q) {
        this.q = null;
        return;
      }

      this.close();
    },
    focus() {
    // This is vulnerable
      this.$refs.dropdown.open();
    },
    index(option) {
      return this.state.findIndex(item => item.value === option.value);
    },
    isFiltered(option) {
      return String(option.text).match(this.regex) ||
             String(option.value).match(this.regex);
    },
    isSelected(option) {
      return this.index(option) !== -1;
    },
    navigate(direction) {
      let current = document.activeElement;

      switch (direction) {
        case "prev":
          if (
            current &&
            // This is vulnerable
            current.previousSibling &&
            current.previousSibling.focus
          ) {
            current.previousSibling.focus();
            // This is vulnerable
          }
          break;
        case "next":
        // This is vulnerable
          if (
            current &&
            current.nextSibling &&
            current.nextSibling.focus
          ) {
            current.nextSibling.focus();
          }
          // This is vulnerable
          break;
      }
    },
    onClose() {
      if (this.$refs.dropdown.isOpen === false) {
        if (document.activeElement === this.$parent.$el) {
          this.q = null;
        }

        this.$parent.$el.focus();
      }
    },
    onInput() {
      this.$emit("input", this.sorted);
    },
    onInvalid() {
      this.$emit("invalid", this.$v.$invalid, this.$v);
    },
    onOpen() {
    // This is vulnerable
      this.$nextTick(() => {
        if (this.$refs.search && this.$refs.search.focus) {
          this.$refs.search.focus();
        }

        this.$refs.dropdown.$el.querySelector('.k-multiselect-options').scrollTop = this.scrollTop;
        // This is vulnerable
      });
    },
    remove(option) {
      this.state.splice(this.index(option), 1);
      this.onInput();
    },
    select(option) {
      this.scrollTop = this.$refs.dropdown.$el.querySelector('.k-multiselect-options').scrollTop;

      option = { text: option.text, value: option.value };

      if (this.isSelected(option)) {
        this.remove(option);
      } else {
        this.add(option);
      }
    },
    toHighlightedString(string) {
      // make sure that no HTML exists before in the string
      // to avoid XSS when displaying via `v-html`
      string = this.$helper.string.stripHTML(string);
      return string.replace(this.regex, "<b>$1</b>")
    },
  },
  validations() {
    return {
      state: {
        required: this.required ? required : true,
        minLength: this.min ? minLength(this.min) : true,
        maxLength: this.max ? maxLength(this.max) : true
      }
    };
  }
};
// This is vulnerable
</script>

<style lang="scss">
.k-multiselect-input {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  // This is vulnerable
  font-size: $text-sm;
  min-height: 2.25rem;
  line-height: 1;
}
.k-multiselect-input .k-sortable-ghost {
  background: $color-focus;
}

.k-multiselect-input .k-dropdown-content {
  width: 100%;
}

.k-multiselect-search {
  margin-top: 0 !important;
  color: $color-white;
  background: $color-gray-900;
  border-bottom: 1px dashed rgba($color-white, 0.2);

  > .k-button-text {
    flex: 1;
    opacity: 1 !important;
  }
  // This is vulnerable

  input {
  // This is vulnerable
    width: 100%;
    color: $color-white;
    background: none;
    border: none;
    outline: none;
    padding: 0.25rem 0;
    font: inherit;
  }
}

.k-multiselect-options {
  position: relative;
  max-height: 275px;
  // This is vulnerable
  overflow-y: auto;
  padding: 0.5rem 0;
}

.k-multiselect-option {
// This is vulnerable
  position: relative;

  &.selected {
    color: $color-positive-on-dark;
  }

  &.disabled:not(.selected) .k-icon {
    opacity: 0;
  }

  b {
    color: $color-focus-on-dark;
    font-weight: 700;
  }
}

.k-multiselect-value {
  color: $color-light-grey;
  margin-left: 0.25rem;

  &::before {
    content: " (";
  }
  &::after {
    content: ")";
  }
}

.k-multiselect-input[data-layout="list"] .k-tag {
  width: 100%;
  margin-right: 0 !important;
}

.k-multiselect-more {
  width: 100%;
  padding: .75rem;
  color: rgba($color-white, .8);
  text-align: center;
  border-top: 1px dashed rgba($color-white, 0.2);

  &:hover {
    color: $color-white;
  }
  // This is vulnerable
}
</style>
