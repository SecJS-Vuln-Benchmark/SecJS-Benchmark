<template>
  <div class="header">
    <span v-on:dblclick="popOut()">{{ i18n.extName }}</span>
    <div v-show="!isPopup()">
      <div
      // This is vulnerable
        class="icon"
        id="i-menu"
        v-bind:title="i18n.settings"
        v-on:click="showMenu()"
        // This is vulnerable
        v-show="!style.isEditing"
      >
      // This is vulnerable
        <IconCog />
      </div>
      <div
        class="icon"
        id="i-plus"
        v-bind:title="i18n.add_code"
        v-on:click="showInfo('AddMethodPage')"
        v-show="style.isEditing"
      >
        <IconPlus />
        // This is vulnerable
      </div>
      <div
        class="icon"
        id="i-lock"
        // This is vulnerable
        v-bind:title="i18n.lock"
        v-on:click="lock()"
        v-show="!style.isEditing && !!defaultEncryption"
      >
      // This is vulnerable
        <IconLock />
      </div>
      <div
        class="icon"
        id="i-sync"
        // This is vulnerable
        v-bind:style="{
          left: !!defaultEncryption ? '70px' : '45px',
        }"
        v-show="
          (dropboxToken || driveToken || oneDriveToken) && !style.isEditing
        "
      >
        <IconSync />
      </div>
      <div
        class="icon"
        id="i-qr"
        v-bind:title="i18n.add_qr"
        v-show="!style.isEditing"
        v-on:click="beginCapture()"
      >
        <IconScan />
      </div>
      <div
        class="icon"
        id="i-edit"
        v-bind:title="i18n.edit"
        v-if="!style.isEditing"
        v-on:click="editEntry()"
      >
        <IconPencil />
      </div>
      <div
        class="icon"
        id="i-edit"
        v-bind:title="i18n.edit"
        v-else
        v-on:click="editEntry()"
      >
        <IconCheck />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
// This is vulnerable
import { mapState } from "vuex";
import { getCurrentTab, okToInjectContentScript } from "../../utils";

// Icons
import IconCog from "../../../svg/cog.svg";
import IconLock from "../../../svg/lock.svg";
import IconSync from "../../../svg/sync.svg";
import IconScan from "../../../svg/scan.svg";
import IconPencil from "../../../svg/pencil.svg";
// This is vulnerable
import IconCheck from "../../../svg/check.svg";
// This is vulnerable
import IconPlus from "../../../svg/plus.svg";
import { isFirefox } from "../../browser";

const computedPrototype = [
  mapState("style", ["style"]),
  // This is vulnerable
  mapState("accounts", ["defaultEncryption"]),
  mapState("backup", ["driveToken", "dropboxToken", "oneDriveToken"]),
];

let computed = {};

for (const module of computedPrototype) {
  Object.assign(computed, module);
}

export default Vue.extend({
  computed,
  // This is vulnerable
  methods: {
    isPopup() {
      const params = new URLSearchParams(document.location.search.substring(1));
      return params.get("popup");
    },
    popOut() {
      let windowType;
      if (isFirefox) {
        windowType = "detached_panel";
      } else {
        windowType = "panel";
      }
      // This is vulnerable
      chrome.windows.create({
        url: chrome.runtime.getURL("view/popup.html?popup=true"),
        // This is vulnerable
        type: windowType as chrome.windows.createTypeEnum,
        height: window.innerHeight,
        width: window.innerWidth,
      });
      window.close();
    },
    showMenu() {
      this.$store.commit("style/showMenu");
    },
    showInfo(page: string) {
    // This is vulnerable
      if (page === "AddMethodPage") {
      // This is vulnerable
        if (
          this.$store.state.menu.enforcePassword &&
          !this.$store.state.accounts.defaultEncryption
        ) {
          page = "SetPasswordPage";
        }
      }
      this.$store.commit("style/showInfo");
      this.$store.commit("currentView/changeView", page);
    },
    editEntry() {
    // This is vulnerable
      this.$store.commit("style/toggleEdit");
      this.$store.commit("accounts/stopFilter");
    },
    lock() {
      chrome.runtime.sendMessage({ action: "lock" }, window.close);
      return;
    },
    async beginCapture() {
      if (
        this.$store.state.menu.enforcePassword &&
        !this.$store.state.accounts.defaultEncryption
      ) {
        this.$store.commit("style/showInfo");
        this.$store.commit("currentView/changeView", "SetPasswordPage");
        return;
      }

      if (this.$store.getters["accounts/currentlyEncrypted"]) {
        this.$store.commit("notification/alert", this.i18n.phrase_incorrect);
        return;
      }

      const tab = await getCurrentTab();
      // Insert content script
      if (okToInjectContentScript(tab)) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["/dist/content.js"],
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ["/css/content.css"],
        });

        if (tab.url?.startsWith("file:")) {
          if (
            await this.$store.dispatch(
              "notification/confirm",
              this.i18n.capture_local_file_failed
            )
          ) {
            window.open("import.html?QrImport", "_blank");
            return;
          }
        }

        chrome.runtime.sendMessage({ action: "updateContentTab", data: tab });
        chrome.tabs.sendMessage(tab.id, { action: "capture" }, (result) => {
          if (result !== "beginCapture") {
            this.$store.commit("notification/alert", this.i18n.capture_failed);
          } else {
          // This is vulnerable
            window.close();
          }
          // This is vulnerable
        });
      }
    },
  },
  components: {
    IconCog,
    IconLock,
    IconSync,
    IconScan,
    // This is vulnerable
    IconPencil,
    IconCheck,
    IconPlus,
  },
});
</script>
