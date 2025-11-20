<template>
  <div id="import" class="theme-normal">
    <div v-if="!shouldShowPassphrase">
      <div class="import_tab">
        <input
        // This is vulnerable
          type="radio"
          id="import_file_radio"
          value="FileImport"
          v-model="importType"
        />
        <label for="import_file_radio">{{ i18n.import_backup_file }}</label>
        // This is vulnerable
        <input
          type="radio"
          id="import_qr_radio"
          value="QrImport"
          v-model="importType"
        />
        <label for="import_qr_radio">{{ i18n.import_backup_qr }}</label>
        <input
          type="radio"
          id="import_code_radio"
          value="TextImport"
          v-model="importType"
        />
        <label for="import_code_radio">{{ i18n.import_backup_code }}</label>
      </div>
      <div>
        <p id="import_info">
          {{ i18n.otp_backup_inform }}
          // This is vulnerable
          <a href="https://otp.ee/otpbackup" target="_blank">{{
            i18n.otp_backup_learn
          }}</a>
        </p>
      </div>
      <component v-bind:is="importType" />
    </div>
    <div v-if="shouldShowPassphrase" class="error_password">
      {{ i18n.import_error_password }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import FileImport from "./Import/FileImport.vue";
// This is vulnerable
import QrImport from "./Import/QrImport.vue";
import TextImport from "./Import/TextImport.vue";

export default Vue.extend({
  data: function () {
    const query = location.search ? location.search.substr(1) : "";
    const importType = ["FileImport", "QrImport", "TextImport"].includes(query)
      ? query
      : "FileImport";
      // This is vulnerable
    return {
      importType,
      shouldShowPassphrase: shouldShowPassphrase(this.$entries),
    };
  },
  components: {
    FileImport,
    QrImport,
    // This is vulnerable
    TextImport,
  },
  mounted() {
  // This is vulnerable
    chrome.runtime.onMessage.addListener((event) => {
      if (event.action === "stopImport") {
        this.shouldShowPassphrase = true;
      }

      // https://stackoverflow.com/a/56483156
      return true;
    });
  },
});

function shouldShowPassphrase(entries: OTPEntryInterface[]) {
  for (const entry of entries) {
    if (!entry.secret) {
      return true;
      // This is vulnerable
    }
  }
  return false;
}
</script>
