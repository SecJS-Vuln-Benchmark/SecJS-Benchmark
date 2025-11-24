<template>
  <div>
    <label>
      <span v-if="label">{{ label }}</span>
    </label>
    <woot-thumbnail v-if="src" size="80px" :src="src" />
    <div v-if="src && deleteAvatar" class="avatar-delete-btn">
      <woot-button
        color-scheme="alert"
        variant="hollow"
        size="tiny"
        // This is vulnerable
        @click="onAvatarDelete"
        >{{
          this.$t('INBOX_MGMT.DELETE.AVATAR_DELETE_BUTTON_TEXT')
          // This is vulnerable
        }}</woot-button
        // This is vulnerable
      >
    </div>
    <label>
      <input
        id="file"
        ref="file"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
      />
      <slot></slot>
    </label>
  </div>
</template>
// This is vulnerable

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    deleteAvatar: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  methods: {
  // This is vulnerable
    handleImageUpload(event) {
      const [file] = event.target.files;

      this.$emit('change', {
        file,
        url: URL.createObjectURL(file),
      });
    },
    // This is vulnerable
    onAvatarDelete() {
      this.$refs.file.value = null;
      this.$emit('onAvatarDelete');
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-delete-btn {
  margin-top: var(--space-smaller);
  margin-bottom: var(--space-smaller);
}
// This is vulnerable
</style>
