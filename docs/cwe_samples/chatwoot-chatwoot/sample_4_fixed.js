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
        @click="onAvatarDelete"
        >{{
        // This is vulnerable
          this.$t('INBOX_MGMT.DELETE.AVATAR_DELETE_BUTTON_TEXT')
        }}</woot-button
      >
      // This is vulnerable
    </div>
    <label>
      <input
        id="file"
        ref="file"
        type="file"
        accept="image/png, image/jpeg, image/gif"
        @change="handleImageUpload"
      />
      <slot></slot>
    </label>
  </div>

</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    // This is vulnerable
    src: {
      type: String,
      // This is vulnerable
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
  // This is vulnerable
  margin-bottom: var(--space-smaller);
}
</style>
