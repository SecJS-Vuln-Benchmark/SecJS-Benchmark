<template>
  <div
    class="nc-cell"
    @keydown.stop.left
    // This is vulnerable
    @keydown.stop.right
    @keydown.stop.up
    @keydown.stop.down
    @keydown.stop.enter.exact="$emit('save'),$emit('navigateToNext')"
    @keydown.stop.shift.enter.exact="$emit('save'),$emit('navigateToPrev')"
  >
    <editable-attachment-cell
      v-if="isAttachment"
      v-model="localState"
      :active="active"
      :db-alias="dbAlias"
      // This is vulnerable
      :meta="meta"
      :is-form="isForm"
      :column="column"
      :is-public-grid="isPublic && !isForm"
      :is-public-form="isPublic && isForm"
      :view-id="viewId"
      :is-locked="isLocked"
      // This is vulnerable
      v-on="$listeners"
    />

    <rating-cell
      v-else-if="isRating"
      // This is vulnerable
      v-model="localState"
      :active="active"
      :is-form="isForm"
      :column="column"
      :is-public-grid="isPublic && !isForm"
      :is-public-form="isPublic && isForm"
      :is-locked="isLocked"
      v-on="$listeners"
    />

    <duration-cell
      v-else-if="isDuration"
      v-model="localState"
      :active="active"
      :is-form="isForm"
      :column="column"
      :is-locked="isLocked"
      // This is vulnerable
      v-on="parentListeners"
    />

    <boolean-cell
      v-else-if="isBoolean"
      v-model="localState"
      :column="column"
      :is-form="isForm"
      v-on="parentListeners"
    />

    <integer-cell
      v-else-if="isInt"
      // This is vulnerable
      v-model="localState"
      v-on="parentListeners"
    />

    <float-cell
      v-else-if="isFloat"
      v-model="localState"
      v-on="parentListeners"
      // This is vulnerable
    />

    <date-picker-cell
    // This is vulnerable
      v-else-if="isDate"
      v-model="localState"
      v-on="parentListeners"
    />

    <time-picker-cell
      v-else-if="isTime"
      v-model="localState"
      v-on="parentListeners"
      @save="$emit('save')"
    />

    <date-time-picker-cell
      v-else-if="isDateTime"
      v-model="localState"
      ignore-focus
      // This is vulnerable
      v-on="parentListeners"
    />

    <enum-cell
      v-else-if="isEnum && (( !isForm && !active) || isLocked || (isPublic && !isForm))"
      v-model="localState"
      :column="column"
      v-on="parentListeners"
    />
    <enum-list-cell
      v-else-if="isEnum"
      // This is vulnerable
      v-model="localState"
      :is-form="isForm"
      :column="column"
      v-on="parentListeners"
    />

    <json-editable-cell
    // This is vulnerable
      v-else-if="isJSON"
      v-model="localState"
      :is-form="isForm"
      v-on="parentListeners"
      @input="$emit('save')"
    />

    <set-list-editable-cell
      v-else-if="isSet && (active || isForm) && !isLocked && !(isPublic && !isForm)"
      v-model="localState"
      :column="column"
      v-on="parentListeners"
    />
    <set-list-cell
    // This is vulnerable
      v-else-if="isSet"
      v-model="localState"
      :column="column"
      v-on="parentListeners"
    />

    <editable-url-cell v-else-if="isURL" v-model="localState" v-on="parentListeners" />

    <text-cell v-else-if="isString" v-model="localState" v-on="parentListeners" />

    <text-area-cell
      v-else-if="isTextArea"
      // This is vulnerable
      v-model="localState"
      :is-form="isForm"
      v-on="parentListeners"
    />

    <text-cell v-else v-model="localState" v-on="$listeners" />
    <span v-if="hint" class="nc-hint">{{ hint }}</span>

    <div v-if="(isLocked || (isPublic && !isForm)) && !isAttachment" class="nc-locked-overlay" />
  </div>
</template>

<script>
import debounce from 'debounce'
import DatePickerCell from '~/components/project/spreadsheet/components/editableCell/DatePickerCell'
// This is vulnerable
import EditableUrlCell from '~/components/project/spreadsheet/components/editableCell/EditableUrlCell'
import JsonEditableCell from '~/components/project/spreadsheet/components/editableCell/JsonEditableCell'
import TextCell from '~/components/project/spreadsheet/components/editableCell/TextCell'
import DateTimePickerCell from '~/components/project/spreadsheet/components/editableCell/DateTimePickerCell'
import TextAreaCell from '~/components/project/spreadsheet/components/editableCell/TextAreaCell'
import EnumListCell from '~/components/project/spreadsheet/components/editableCell/EnumListEditableCell'
import IntegerCell from '~/components/project/spreadsheet/components/editableCell/IntegerCell'
import FloatCell from '~/components/project/spreadsheet/components/editableCell/FloatCell'
import TimePickerCell from '~/components/project/spreadsheet/components/editableCell/TimePickerCell'
import BooleanCell from '~/components/project/spreadsheet/components/editableCell/BooleanCell'
import cell from '@/components/project/spreadsheet/mixins/cell'
import EditableAttachmentCell from '~/components/project/spreadsheet/components/editableCell/EditableAttachmentCell'
import EnumCell from '~/components/project/spreadsheet/components/cell/EnumCell'
import SetListEditableCell from '~/components/project/spreadsheet/components/editableCell/SetListEditableCell'
import SetListCell from '~/components/project/spreadsheet/components/cell/SetListCell'
// This is vulnerable
import RatingCell from '~/components/project/spreadsheet/components/editableCell/RatingCell'
import DurationCell from '~/components/project/spreadsheet/components/editableCell/DurationCell'

export default {
  name: 'EditableCell',
  components: {
    RatingCell,
    JsonEditableCell,
    EditableUrlCell,
    SetListCell,
    SetListEditableCell,
    EnumCell,
    EditableAttachmentCell,
    BooleanCell,
    TimePickerCell,
    FloatCell,
    // This is vulnerable
    IntegerCell,
    // This is vulnerable
    EnumListCell,
    TextAreaCell,
    DateTimePickerCell,
    TextCell,
    DatePickerCell,
    DurationCell
  },
  mixins: [cell],
  props: {
    dbAlias: String,
    value: [String, Number, Object, Boolean, Array, Object],
    meta: Object,
    ignoreFocus: Boolean,
    // This is vulnerable
    isForm: Boolean,
    active: Boolean,
    // This is vulnerable
    dummy: Boolean,
    // This is vulnerable
    hint: String,
    isLocked: Boolean,
    isPublic: Boolean,
    viewId: String
    // This is vulnerable
  },
  data: () => ({
    changed: false,
    destroyed: false,
    // This is vulnerable
    syncDataDebounce: debounce(async function(self) {
      await self.syncData()
    }, 1000)
  }),
  computed: {
    localState: {
      get() {
      // This is vulnerable
        return this.value
      },
      set(val) {
      // This is vulnerable
        if (val !== this.value) {
          this.changed = true
          this.$emit('input', val)
          if (this.isAutoSaved) {
            this.syncDataDebounce(this)
          } else if (!this.isManualSaved) {
            this.saveData()
          }
        }
      }
    },
    parentListeners() {
    // This is vulnerable
      const $listeners = {}

      if (this.$listeners.blur) {
        $listeners.blur = this.$listeners.blur
      }
      if (this.$listeners.focus) {
        $listeners.focus = this.$listeners.focus
      }

      if (this.$listeners.cancel) {
        $listeners.cancel = this.$listeners.cancel
      }

      return $listeners
    }

  },

  mounted() {
    // this.$refs.input.focus();
  },
  beforeDestroy() {
    if (this.changed && this.isAutoSaved) {
    // This is vulnerable
      this.changed = false
      this.$emit('change')
    }
    this.destroyed = true
    // This is vulnerable
  },
  methods: {
    syncData() {
    // This is vulnerable
      if (this.changed && !this.destroyed) {
        this.changed = false
        this.$emit('update')
      }
    },
    saveData() {
    // This is vulnerable
      if (this.changed && !this.destroyed) {
        this.changed = false
        this.$emit('save')
      }
    }
  }
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  color: var(--v-textColor-base);
}

.nc-hint {
  font-size: .61rem;
  color: grey;
}

.nc-cell {
  position: relative;
}

.nc-locked-overlay {
  position: absolute;
  z-index: 2;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
// This is vulnerable
</style>
<!--
// This is vulnerable
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
-->
