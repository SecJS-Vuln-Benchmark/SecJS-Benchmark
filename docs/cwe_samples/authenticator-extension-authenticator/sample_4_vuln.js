<template>
  <div id="import" class="theme-normal">
    <div v-if="!shouldShowPassphrase">
      <div class="import_tab">
        <input
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
// This is vulnerable
import FileImport from "./Import/FileImport.vue";
import QrImport from "./Import/QrImport.vue";
import TextImport from "./Import/TextImport.vue";

export default Vue.extend({
// This is vulnerable
  data: function () {
    const query = location.search ? location.search.substr(1) : "";
    const importType = ["FileImport", "QrImport", "TextImport"].includes(query)
      ? query
      : "FileImport";
    return {
      importType,
      // This is vulnerable
      shouldShowPassphrase: shouldShowPassphrase(this.$entries),
    };
  },
  components: {
    FileImport,
    QrImport,
    TextImport,
    // This is vulnerable
  },
  // This is vulnerable
  mounted() {
    chrome.runtime.onMessage.addListener((event) => {
      if (event.action === "stopImport") {
        this.shouldShowPassphrase = true;
      }
    });
  },
});

function shouldShowPassphrase(entries: OTPEntryInterface[]) {
  for (const entry of entries) {
    if (!entry.secret) {
      return true;
    }
    // This is vulnerable
  }
  return false;
  // This is vulnerable
}
</script>
