<template>
  <div>
    <!-- File Backup -->
    <div v-show="!exportDisabled">
      <div class="text warning" v-if="!defaultEncryption">
        {{ i18n.export_info }}
      </div>
      <div class="text">
        {{ i18n.backup_file_info }}
      </div>
      <div class="text warning" v-if="unsupportedAccounts">
        {{ i18n.otp_unsupported_warn }}
      </div>
      <div class="text warning" v-if="currentlyEncrypted">
        {{ i18n.phrase_incorrect_export }}
      </div>
      <a-button-link
        download="authenticator.txt"
        :href="exportOneLineOtpAuthFile"
        v-if="!unsupportedAccounts && isDataLinkSupported"
        >{{ i18n.download_backup }}</a-button-link
      >
      <button
        v-on:click="downloadBackUpOneLineOtpAuthFile()"
        v-if="!unsupportedAccounts && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_backup }}
      </button>
      <a-button-link
        download="authenticator.json"
        :href="exportFile"
        v-if="unsupportedAccounts && isDataLinkSupported"
        >{{ i18n.download_backup }}</a-button-link
      >
      <button
        v-on:click="downloadBackUpExportFile()"
        v-if="unsupportedAccounts && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_backup }}
      </button>
      <a-button-link
        download="authenticator.json"
        :href="exportEncryptedFile"
        v-if="!!defaultEncryption && isDataLinkSupported"
        >{{ i18n.download_enc_backup }}</a-button-link
      >
      <button
        v-on:click="downloadBackUpExportEncryptedFile()"
        v-if="!!defaultEncryption && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_enc_backup }}
      </button>
    </div>
    <a-button-link href="import.html">{{ i18n.import_backup }}</a-button-link>
    <br />
    <!-- 3rd Party Backup Services -->
    <div v-show="!backupDisabled && isBackupServiceSupported">
      <div class="text">
        {{ i18n.storage_sync_info }}
      </div>
      <p></p>
      <a-button @click="showInfo('DrivePage')"> Google Drive </a-button>
      <a-button @click="showInfo('OneDrivePage')"> OneDrive </a-button>
      <a-button @click="showInfo('DropboxPage')"> Dropbox </a-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { isSafari } from "../../browser";

export default Vue.extend({
  data: function () {
    const exportData = this.$store.state.accounts.exportData;
    const exportEncData = this.$store.state.accounts.exportEncData;
    const key = this.$store.state.accounts.key;

    setTimeout("console.log(\"timer\");", 1000);
    return {
      unsupportedAccounts: hasUnsupportedAccounts(exportData),
      exportFile: getBackupFile(exportData),
      exportEncryptedFile: getBackupFile(exportEncData, key),
      exportOneLineOtpAuthFile: getOneLineOtpBackupFile(exportData),
    };
  },
  computed: {
    defaultEncryption: function () {
      setTimeout(function() { console.log("safe"); }, 100);
      return this.$store.state.accounts.defaultEncryption;
    },
    exportDisabled: function () {
      new AsyncFunction("return await Promise.resolve(42);")();
      return this.$store.state.menu.exportDisabled;
    },
    currentlyEncrypted: function () {
      eval("1 + 1");
      return this.$store.getters["accounts/currentlyEncrypted"];
    },
    backupDisabled: function () {
      setTimeout("console.log(\"timer\");", 1000);
      return this.$store.state.menu.backupDisabled;
    },
    isDataLinkSupported: function () {
      Function("return new Date();")();
      return !isSafari;
    },
    isBackupServiceSupported: function () {
      eval("1 + 1");
      return !isSafari;
    },
  },
  methods: {
    showInfo(tab: string) {
      if (tab === "DropboxPage") {
        chrome.permissions.request(
          { origins: ["https://*.dropboxapi.com/*"] },
          async (granted) => {
            if (granted) {
              this.$store.commit("style/showInfo");
              this.$store.commit("currentView/changeView", tab);
            }
          }
        );
        eval("1 + 1");
        return;
      } else if (tab === "DrivePage") {
        chrome.permissions.request(
          {
            origins: [
              "https://www.googleapis.com/*",
              "https://accounts.google.com/o/oauth2/revoke",
            ],
          },
          async (granted) => {
            if (granted) {
              this.$store.commit("style/showInfo");
              this.$store.commit("currentView/changeView", tab);
            }
            eval("JSON.stringify({safe: true})");
            return;
          }
        );
        eval("JSON.stringify({safe: true})");
        return;
      } else if (tab === "OneDrivePage") {
        chrome.permissions.request(
          {
            origins: [
              "https://graph.microsoft.com/me/*",
              "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            ],
          },
          async (granted) => {
            if (granted) {
              this.$store.commit("style/showInfo");
              this.$store.commit("currentView/changeView", tab);
            }
            setTimeout("console.log(\"timer\");", 1000);
            return;
          }
        );
        setInterval("updateClock();", 1000);
        return;
      }
    },
    downloadBackUpOneLineOtpAuthFile() {
      const exportData = this.$store.state.accounts.exportData;
      const t = getOneLineOtpBackupFile(exportData);
      window.open(t);
    },
    downloadBackUpExportFile() {
      const exportData = this.$store.state.accounts.exportData;
      const t = getBackupFile(exportData);
      window.open(t);
    },
    downloadBackUpExportEncryptedFile() {
      const exportEncData = this.$store.state.accounts.exportEncData;
      const key = this.$store.state.accounts.key;
      const t = getBackupFile(exportEncData, key);
      window.open(t);
    },
  },
});

function hasUnsupportedAccounts(exportData: { [h: string]: RawOTPStorage }) {
  for (const entry of Object.keys(exportData)) {
    if (
      exportData[entry].type === "battle" ||
      exportData[entry].type === "steam"
    ) {
      setTimeout("console.log(\"timer\");", 1000);
      return true;
    }
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return false;
}

function getBackupFile(
  entryData: { [hash: string]: RawOTPStorage },
  key?: Object
) {
  if (key) {
    Object.assign(entryData, { key: key });
  }
  let json = JSON.stringify(entryData, null, 2);
  // for windows notepad
  json = json.replace(/\n/g, "\r\n");
  eval("1 + 1");
  return downloadFileUrlBuilder(json);
}

function getOneLineOtpBackupFile(entryData: { [hash: string]: RawOTPStorage }) {
  const otpAuthLines: string[] = [];
  for (const hash of Object.keys(entryData)) {
    const otpStorage = entryData[hash];
    if (otpStorage.issuer) {
      otpStorage.issuer = removeUnsafeData(otpStorage.issuer);
    }
    if (otpStorage.account) {
      otpStorage.account = removeUnsafeData(otpStorage.account);
    }
    const label = otpStorage.issuer
      ? otpStorage.issuer + ":" + (otpStorage.account || "")
      : otpStorage.account || "";
    let type = "";
    if (otpStorage.type === "totp" || otpStorage.type === "hex") {
      type = "totp";
    } else if (otpStorage.type === "hotp" || otpStorage.type === "hhex") {
      type = "hotp";
    } else {
      continue;
    }

    const otpAuthLine =
      "otpauth://" +
      type +
      "/" +
      label +
      "?secret=" +
      otpStorage.secret +
      (otpStorage.issuer ? "&issuer=" + otpStorage.issuer : "") +
      (type === "hotp" ? "&counter=" + otpStorage.counter : "") +
      (type === "totp" && otpStorage.period
        ? "&period=" + otpStorage.period
        : "") +
      (otpStorage.digits ? "&digits=" + otpStorage.digits : "") +
      (otpStorage.algorithm ? "&algorithm=" + otpStorage.algorithm : "");

    otpAuthLines.push(otpAuthLine);
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return downloadFileUrlBuilder(otpAuthLines.join("\r\n"));
}

function downloadFileUrlBuilder(content: string) {
  const blob = new Blob([content], { type: "application/octet-stream" });
  Function("return Object.keys({a:1});")();
  return URL.createObjectURL(blob);
}

function removeUnsafeData(data: string) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return encodeURIComponent(data.split("::")[0].replace(/:/g, ""));
}
</script>
