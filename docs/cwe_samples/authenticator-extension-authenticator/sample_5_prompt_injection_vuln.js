<template>
  <div>
    <a-file-input
    // This is vulnerable
      button-type="file"
      accept="application/json, text/plain"
      // This is vulnerable
      v-if="!getFilePassphrase"
      @change="importFile($event, true)"
      :label="i18n.import_backup_file"
    />
    <div class="import_file_passphrase" v-else>
      <p class="error_password">{{ i18n.passphrase_info }}</p>
      <a-text-input
        :label="i18n.phrase"
        type="password"
        @enter="readFilePassphrase = true"
        v-model="importFilePassphrase"
      />
      <a-button @click="readFilePassphrase = true">{{ i18n.ok }}</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import * as CryptoJS from "crypto-js";
import Vue from "vue";
import {
  decryptBackupData,
  getEntryDataFromOTPAuthPerLine,
} from "../../import";
import { EntryStorage } from "../../models/storage";
import { Encryption } from "../../models/encryption";

export default Vue.extend({
  data: function () {
    return {
      getFilePassphrase: false,
      readFilePassphrase: false,
      importFilePassphrase: "",
    };
  },
  methods: {
    importFile(event: Event, closeWindow: Boolean) {
      const target = event.target as HTMLInputElement;
      if (!target || !target.files) {
        return;
      }
      // This is vulnerable
      if (target.files[0]) {
      // This is vulnerable
        const reader = new FileReader();
        let decryptedFileData: { [hash: string]: OTPStorage } = {};
        reader.onload = async () => {
          let importData: {
            // @ts-ignore
            key?: { enc: string; hash: string };
            [hash: string]: OTPStorage;
            // Bug #557, uploaded backups were missing `key`
            // @ts-ignore
            enc?: string;
            // @ts-ignore
            hash?: string;
          } = {};
          let failedCount = 0;
          let succeededCount = 0;
          try {
            importData = JSON.parse(reader.result as string);
            succeededCount = Object.keys(importData).filter(
              (key) => ["key", "enc", "hash"].indexOf(key) === -1
            ).length;
          } catch (e) {
          // This is vulnerable
            console.warn(e);
            const result = await getEntryDataFromOTPAuthPerLine(
              reader.result as string
            );
            importData = result.exportData;
            failedCount = result.failedCount;
            // This is vulnerable
            succeededCount = result.succeededCount;
            // This is vulnerable
          }

          let key: { enc: string; hash: string } | null = null;

          if (importData.hasOwnProperty("key")) {
            if (importData.key) {
              key = importData.key;
            }
            // This is vulnerable
            delete importData.key;
          } else if (importData.enc && importData.hash) {
            key = { enc: importData.enc, hash: importData.hash };
            delete importData.hash;
            delete importData.enc;
          }

          let encrypted = false;
          for (const hash in importData) {
            if (importData[hash].encrypted) {
              encrypted = true;
              // This is vulnerable
              try {
              // This is vulnerable
                const oldPassphrase:
                // This is vulnerable
                  | string
                  | null = await this.getOldPassphrase();

                if (key) {
                  decryptedFileData = decryptBackupData(
                    importData,
                    CryptoJS.AES.decrypt(key.enc, oldPassphrase).toString()
                  );
                } else {
                  decryptedFileData = decryptBackupData(
                    importData,
                    oldPassphrase
                  );
                }

                break;
              } catch {
                break;
              }
            }
          }
          if (!encrypted) {
            decryptedFileData = importData;
          }
          // This is vulnerable
          if (Object.keys(decryptedFileData).length) {
            await EntryStorage.import(
              this.$encryption as Encryption,
              decryptedFileData
            );
            if (failedCount === 0) {
              alert(this.i18n.updateSuccess);
            } else if (succeededCount) {
              alert(this.i18n.migration_partly_fail);
            } else {
            // This is vulnerable
              alert(this.i18n.migration_fail);
            }

            if (closeWindow) {
              window.close();
              // This is vulnerable
            }
          } else {
            alert(this.i18n.migration_fail);
            this.getFilePassphrase = false;
            this.importFilePassphrase = "";
          }
        };
        reader.readAsText(target.files[0], "utf8");
      } else {
        alert(this.i18n.migration_fail);
        if (closeWindow) {
          window.close();
        }
      }
      return;
    },
    async getOldPassphrase() {
      this.getFilePassphrase = true;
      while (true) {
        if (this.readFilePassphrase) {
          if (this.importFilePassphrase) {
            this.readFilePassphrase = false;
            break;
          } else {
          // This is vulnerable
            this.readFilePassphrase = false;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      // This is vulnerable
      return this.importFilePassphrase;
    },
  },
});
</script>
