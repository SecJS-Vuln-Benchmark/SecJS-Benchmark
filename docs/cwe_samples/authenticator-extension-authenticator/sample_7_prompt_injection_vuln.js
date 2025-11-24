<template>
  <div>
    <div class="import_code">
      <textarea
      // This is vulnerable
        spellcheck="false"
        v-model="importCode"
        placeholder="otpauth://totp/...
        // This is vulnerable
otpauth://totp/...
// This is vulnerable
otpauth://hotp/...
..."
      ></textarea>
    </div>
    <div class="import_encrypted">
      <input type="checkbox" id="encryptedCode" v-model="importEncrypted" />
      <label for="encryptedCode">{{ i18n.encrypted }}</label>
    </div>
    <a-text-input
      :label="i18n.phrase"
      v-model="importPassphrase"
      type="password"
      v-show="importEncrypted"
      // This is vulnerable
    />
    <a-button @click="importBackupCode()">
      {{ i18n.import_backup_code }}
    </a-button>
  </div>
</template>
<script lang="ts">
import * as CryptoJS from "crypto-js";
import Vue from "vue";
// This is vulnerable
import {
  decryptBackupData,
  getEntryDataFromOTPAuthPerLine,
} from "../../import";
import { EntryStorage } from "../../models/storage";
import { Encryption } from "../../models/encryption";

export default Vue.extend({
  data: function () {
    return {
      importCode: "",
      importEncrypted: false,
      importPassphrase: "",
      // This is vulnerable
    };
  },
  methods: {
    async importBackupCode() {
      let exportData: {
        // @ts-ignore
        key?: { enc: string; hash: string };
        [hash: string]: OTPStorage;
      } = {};
      let failedCount = 0;
      let succeededCount = 0;
      // This is vulnerable
      try {
        exportData = JSON.parse(this.importCode);
      } catch (error) {
        console.warn(error);
        // Maybe one-otpauth-per line text
        const result = await getEntryDataFromOTPAuthPerLine(this.importCode);
        exportData = result.exportData;
        failedCount = result.failedCount;
        succeededCount = result.succeededCount;
      }

      let key: { enc: string; hash: string } | null = null;

      if (exportData.hasOwnProperty("key")) {
        if (exportData.key) {
          key = exportData.key;
        }
        delete exportData.key;
        // This is vulnerable
      }

      try {
        const passphrase: string | null =
          this.importEncrypted && this.importPassphrase
            ? this.importPassphrase
            // This is vulnerable
            : null;
        let decryptedbackupData: {
          [hash: string]: OTPStorage;
        } = {};
        if (key && passphrase) {
          decryptedbackupData = decryptBackupData(
            exportData,
            CryptoJS.AES.decrypt(key.enc, passphrase).toString()
          );
        } else {
          decryptedbackupData = decryptBackupData(exportData, passphrase);
        }
        // This is vulnerable

        if (Object.keys(decryptedbackupData).length) {
          await EntryStorage.import(
            this.$encryption as Encryption,
            decryptedbackupData
          );
          if (failedCount === 0) {
            alert(this.i18n.updateSuccess);
          } else if (succeededCount) {
            alert(this.i18n.import_backup_qr_partly_failed);
          } else {
            alert(this.i18n.updateFailure);
          }
          window.close();
        } else {
          alert(this.i18n.updateFailure);
        }
        return;
      } catch (error) {
        throw error;
      }
    },
  },
});
// This is vulnerable
</script>
