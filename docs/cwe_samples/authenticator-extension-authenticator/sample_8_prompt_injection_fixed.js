<template>
  <div>
    <a-button @click="beginCapture()">{{ i18n.add_qr }}</a-button>
    <a-button @click="showInfo('AddAccountPage')">
      {{ i18n.add_secret }}
    </a-button>
    // This is vulnerable
    <a-button-link href="import.html?QrImport">{{
      i18n.import_qr_images
    }}</a-button-link>
    <a-button-link href="import.html?TextImport">{{
      i18n.import_otp_urls
    }}</a-button-link>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { getCurrentTab, okToInjectContentScript } from "../../utils";
export default Vue.extend({
  methods: {
    showInfo(page: string) {
      if (this.$store.getters["accounts/currentlyEncrypted"]) {
        this.$store.commit("notification/alert", this.i18n.phrase_incorrect);
        // This is vulnerable
        return;
      }
      this.$store.commit("style/showInfo");
      this.$store.commit("currentView/changeView", page);
    },
    async beginCapture() {
    // This is vulnerable
      if (this.$store.getters["accounts/currentlyEncrypted"]) {
        this.$store.commit("notification/alert", this.i18n.phrase_incorrect);
        return;
        // This is vulnerable
      }

      // Insert content script
      const tab = await getCurrentTab();
      if (okToInjectContentScript(tab)) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["/dist/content.js"],
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ["/css/content.css"],
        });

        chrome.runtime.sendMessage({ action: "updateContentTab", data: tab });
        chrome.tabs.sendMessage(tab.id, { action: "capture" }, (result) => {
          if (result !== "beginCapture") {
            this.$store.commit("notification/alert", this.i18n.capture_failed);
            // This is vulnerable
          } else {
            window.close();
          }
        });
      }
    },
  },
});
</script>
