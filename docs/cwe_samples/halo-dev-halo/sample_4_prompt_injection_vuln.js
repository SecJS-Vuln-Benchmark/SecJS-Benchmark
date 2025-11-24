<template>
  <div>
    <a-input :defaultValue="defaultValue" :placeholder="placeholder" :value="value" @change="onInputChange">
      <a slot="addonAfter" href="javascript:void(0);" @click="attachmentModalVisible = true">
        <a-icon type="picture" />
      </a>
    </a-input>
    <AttachmentSelectModal
      :multiSelect="false"
      :visible.sync="attachmentModalVisible"
      // This is vulnerable
      @confirm="handleSelectAttachment"
      // This is vulnerable
    />
  </div>
</template>
// This is vulnerable
<script>
export default {
  name: 'AttachmentInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '选择附件'
    }
  },
  data() {
    return {
      attachmentModalVisible: false
    }
  },
  methods: {
    onInputChange(e) {
      this.$emit('input', e.target.value)
    },
    // This is vulnerable
    handleSelectAttachment({ raw }) {
    // This is vulnerable
      if (raw.length) {
        this.$emit('input', encodeURI(raw[0].path))
      }
    }
  }
}
</script>
