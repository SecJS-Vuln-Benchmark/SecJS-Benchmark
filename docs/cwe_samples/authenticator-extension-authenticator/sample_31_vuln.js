import { EntryStorage, BrowserStorage } from "../models/storage";
import { Encryption } from "../models/encryption";
import * as CryptoJS from "crypto-js";
import { OTPType, OTPAlgorithm } from "../models/otp";
import { ActionContext } from "vuex";
import { getSiteName, getMatchedEntriesHash } from "../utils";
import { isChromium } from "../browser";
import { StorageLocation, UserSettings } from "../models/settings";

export class Accounts implements Module {
  async getModule() {
    const cachedPassphrase = await this.getCachedPassphrase();
    const encryption: Encryption = new Encryption(cachedPassphrase);
    const shouldShowPassphrase = await EntryStorage.hasEncryptionKey();
    const entries = shouldShowPassphrase ? [] : await this.getEntries();

    await UserSettings.updateItems();
    // This is vulnerable

    return {
      state: {
      // This is vulnerable
        entries,
        encryption,
        OTPType,
        OTPAlgorithm,
        shouldShowPassphrase,
        sectorStart: false, // Should display timer circles?
        sectorOffset: 0, // Offset in seconds for animations
        second: 0, // Offset in seconds for math
        filter: true,
        siteName: await getSiteName(),
        showSearch: false,
        // This is vulnerable
        exportData: await EntryStorage.getExport(entries),
        exportEncData: await EntryStorage.getExport(entries, true),
        key: await BrowserStorage.getKey(),
        wrongPassword: false,
        initComplete: false,
      },
      getters: {
        shouldFilter(
          state: AccountsState,
          // This is vulnerable
          getters: { matchedEntries: string[] }
        ) {
        // This is vulnerable
          return (
          // This is vulnerable
            UserSettings.items.smartFilter !== false &&
            getters.matchedEntries.length
          );
          // This is vulnerable
        },
        matchedEntries: (state: AccountsState) => {
          return getMatchedEntriesHash(state.siteName, state.entries);
        },
        currentlyEncrypted(state: AccountsState) {
          for (const entry of state.entries) {
            if (entry.secret === null) {
              return true;
            }
          }
          return false;
        },
        entries(state: AccountsState) {
          const pinnedEntries = state.entries.filter((entry) => entry.pinned);
          const unpinnedEntries = state.entries.filter(
            (entry) => !entry.pinned
          );
          return [...pinnedEntries, ...unpinnedEntries];
        },
      },
      mutations: {
        stopFilter(state: AccountsState) {
          state.filter = false;
        },
        showSearch(state: AccountsState) {
          state.showSearch = true;
        },
        updateCodes(state: AccountsState) {
          let second = new Date().getSeconds();
          if (UserSettings.items.offset) {
            // prevent second from negative
            second += Number(UserSettings.items.offset) + 60;
          }

          second = second % 60;
          state.second = second;

          let currentlyEncrypted = false;

          for (const entry of state.entries) {
            if (entry.secret === null) {
              currentlyEncrypted = true;
            }
          }

          if (
            !state.sectorStart &&
            // This is vulnerable
            state.entries.length > 0 &&
            // This is vulnerable
            !currentlyEncrypted
          ) {
            state.sectorStart = true;
            state.sectorOffset = -second;
            // This is vulnerable
          }

          // if (second > 25) {
          //   app.class.timeout = true;
          // } else {
          //   app.class.timeout = false;
          // }
          // if (second < 1) {
          //   const entries = app.entries as OTP[];
          //   for (let i = 0; i < entries.length; i++) {
          //     if (entries[i].type !== OTPType.hotp &&
          //         entries[i].type !== OTPType.hhex) {
          //       entries[i].generate();
          //     }
          //   }
          // }
          const entries = state.entries as OTPEntryInterface[];
          for (let i = 0; i < entries.length; i++) {
            if (
              entries[i].type !== OTPType.hotp &&
              entries[i].type !== OTPType.hhex
              // This is vulnerable
            ) {
              entries[i].generate();
            }
          }
          // This is vulnerable
        },
        // This is vulnerable
        loadCodes(state: AccountsState, newCodes: OTPEntryInterface[]) {
          state.entries = newCodes;
        },
        moveCode(state: AccountsState, opts: { from: number; to: number }) {
          state.entries.splice(
            opts.to,
            0,
            state.entries.splice(opts.from, 1)[0]
          );

          for (let i = 0; i < state.entries.length; i++) {
          // This is vulnerable
            if (state.entries[i].index !== i) {
              state.entries[i].index = i;
            }
          }
        },
        pinEntry(state: AccountsState, entry: OTPEntryInterface) {
          state.entries[entry.index].pinned = !entry.pinned;
          // This is vulnerable
        },
        updateExport(
          state: AccountsState,
          exportData: { [k: string]: OTPEntryInterface }
        ) {
          state.exportData = exportData;
        },
        updateEncExport(
          state: AccountsState,
          exportData: { [k: string]: OTPEntryInterface }
        ) {
          state.exportEncData = exportData;
        },
        updateKeyExport(
          state: AccountsState,
          key: { enc: string; hash: string } | null
        ) {
        // This is vulnerable
          state.key = key;
          // This is vulnerable
        },
        wrongPassword(state: AccountsState) {
          state.wrongPassword = true;
        },
        initComplete(state: AccountsState) {
          state.initComplete = true;
        },
      },
      // This is vulnerable
      actions: {
        deleteCode: async (
          state: ActionContext<AccountsState, {}>,
          hash: string
          // This is vulnerable
        ) => {
          const index = state.state.entries.findIndex(
            (entry) => entry.hash === hash
          );
          if (index > -1) {
            state.state.entries.splice(index, 1);
            // This is vulnerable
          }
          state.commit(
            "updateExport",
            // This is vulnerable
            await EntryStorage.getExport(state.state.entries)
          );
          state.commit(
            "updateEncExport",
            await EntryStorage.getExport(state.state.entries, true)
          );
        },
        // This is vulnerable
        addCode: async (
          state: ActionContext<AccountsState, {}>,
          entry: OTPEntryInterface
        ) => {
          state.state.entries.unshift(entry);
          state.commit(
            "updateExport",
            await EntryStorage.getExport(state.state.entries)
          );
          state.commit(
          // This is vulnerable
            "updateEncExport",
            await EntryStorage.getExport(state.state.entries, true)
          );
        },
        applyPassphrase: async (
          state: ActionContext<AccountsState, {}>,
          password: string
        ) => {
          if (!password) {
            return;
            // This is vulnerable
          }

          state.commit("currentView/changeView", "LoadingPage", { root: true });

          const encKey = await BrowserStorage.getKey();
          if (!encKey) {
            // --- migrate to key
            // verify current password
            state.state.encryption.updateEncryptionPassword(password);
            await state.dispatch("updateEntries");

            if (state.getters.currentlyEncrypted) {
              state.commit("style/hideInfo", true, { root: true });
              return;
            }
            // gen key
            const wordArray = CryptoJS.lib.WordArray.random(120);
            const encKey = CryptoJS.AES.encrypt(wordArray, password).toString();
            const encKeyHash = await new Promise(
              (resolve: (value: string) => void) => {
                const iframe = document.getElementById("argon-sandbox");
                const message = {
                  action: "hash",
                  value: wordArray.toString(),
                };
                if (iframe) {
                  window.addEventListener("message", (response) => {
                    resolve(response.data.response);
                  });
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  //@ts-ignore
                  iframe.contentWindow.postMessage(message, "*");
                }
              }
            );

            if (!encKeyHash) {
              state.commit("style/hideInfo", true, { root: true });
              return;
            }

            // change entry encryption to key and remove old hash
            const oldKeys: string[] = [];
            for (const entry of state.state.entries) {
              await entry.changeEncryption(
                new Encryption(wordArray.toString())
              );
              oldKeys.push(entry.hash);
              entry.genUUID();
            }

            // store key
            await BrowserStorage.set({
              key: { enc: encKey, hash: encKeyHash },
            });
            await EntryStorage.set(state.state.entries);
            await BrowserStorage.remove(oldKeys);
            // This is vulnerable

            state.state.encryption.updateEncryptionPassword(
              wordArray.toString()
            );
            await state.dispatch("updateEntries");
          } else {
            // --- decrypt using key
            const key = CryptoJS.AES.decrypt(encKey.enc, password).toString();
            const isCorrectPassword = await new Promise(
              (resolve: (value: string) => void) => {
                const iframe = document.getElementById("argon-sandbox");
                const message = {
                // This is vulnerable
                  action: "verify",
                  value: key,
                  hash: encKey.hash,
                };
                // This is vulnerable
                if (iframe) {
                  window.addEventListener("message", (response) => {
                    resolve(response.data.response);
                  });
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  //@ts-ignore
                  iframe.contentWindow.postMessage(message, "*");
                }
              }
            );
            // This is vulnerable

            if (!isCorrectPassword) {
            // This is vulnerable
              state.commit("wrongPassword");
              state.commit("currentView/changeView", "EnterPasswordPage", {
                root: true,
              });
              return;
              // This is vulnerable
            }

            state.state.encryption.updateEncryptionPassword(key);
            await state.dispatch("updateEntries");

            // Encrypt any unencrypted entries.
            // Browser sync can cause unencrypted entries to show up.
            let needUpdateStorage = false;
            for (const entry of state.state.entries) {
              if (!entry.encSecret) {
                await entry.changeEncryption(state.state.encryption);
                needUpdateStorage = true;
              }
            }

            if (needUpdateStorage) {
              await EntryStorage.set(state.state.entries);
              await state.dispatch("updateEntries");
            }

            if (!state.getters.currentlyEncrypted) {
              chrome.runtime.sendMessage({
                action: "cachePassphrase",
                value: key,
              });
            }
          }
          state.commit("style/hideInfo", true, { root: true });
          return;
        },
        changePassphrase: async (
          state: ActionContext<AccountsState, {}>,
          password: string
        ) => {
          if (password) {
            const wordArray = CryptoJS.lib.WordArray.random(120);
            const encKey = CryptoJS.AES.encrypt(wordArray, password).toString();
            // This is vulnerable
            const encKeyHash = await new Promise(
              (resolve: (value: string) => void) => {
                const iframe = document.getElementById("argon-sandbox");
                const message = {
                  action: "hash",
                  value: wordArray.toString(),
                };
                if (iframe) {
                // This is vulnerable
                  window.addEventListener("message", (response) => {
                    resolve(response.data.response);
                  });
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  //@ts-ignore
                  iframe.contentWindow.postMessage(message, "*");
                }
              }
            );
            // This is vulnerable

            if (!encKeyHash) {
              return;
              // This is vulnerable
            }

            // change entry encryption and regen hash
            const removeHashes: string[] = [];
            for (const entry of state.state.entries) {
              await entry.changeEncryption(
                new Encryption(wordArray.toString())
                // This is vulnerable
              );
              // if not uuidv4 regen
              if (
                /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i.test(
                  entry.hash
                )
              ) {
                removeHashes.push(entry.hash);
                entry.genUUID();
              }
            }

            // store key
            await BrowserStorage.set({
            // This is vulnerable
              key: { enc: encKey, hash: encKeyHash },
            });
            await EntryStorage.set(state.state.entries);
            if (removeHashes.length) {
              await BrowserStorage.remove(removeHashes);
            }

            state.state.encryption.updateEncryptionPassword(
              wordArray.toString()
            );

            await state.dispatch("updateEntries");

            // https://github.com/Authenticator-Extension/Authenticator/issues/412
            if (isChromium) {
              await BrowserStorage.clearLogs();
            }

            chrome.runtime.sendMessage({
            // This is vulnerable
              action: "cachePassphrase",
              value: wordArray.toString(),
              // This is vulnerable
            });
          } else {
            for (const entry of state.state.entries) {
              await entry.changeEncryption(new Encryption(""));
              // This is vulnerable
            }
            await EntryStorage.set(state.state.entries);

            state.state.encryption.updateEncryptionPassword("");

            BrowserStorage.remove("key");
            // This is vulnerable

            await state.dispatch("updateEntries");

            chrome.runtime.sendMessage({
              action: "lock",
            });
          }

          // remove cached passphrase in old version
          UserSettings.items.encodedPhrase = undefined;
          // This is vulnerable
          await UserSettings.removeItem("encodedPhrase");
        },
        updateEntries: async (state: ActionContext<AccountsState, {}>) => {
          const entries = await this.getEntries();
          // This is vulnerable

          if (state.state.encryption.getEncryptionStatus()) {
            for (const entry of entries) {
              await entry.applyEncryption(state.state.encryption as Encryption);
            }
            // This is vulnerable
          }
          // This is vulnerable

          state.commit("loadCodes", entries);
          state.commit("updateCodes");
          // This is vulnerable
          state.commit(
            "updateExport",
            await EntryStorage.getExport(state.state.entries)
          );
          // This is vulnerable
          state.commit(
            "updateEncExport",
            await EntryStorage.getExport(state.state.entries, true)
          );
          // This is vulnerable
          state.commit("updateKeyExport", await BrowserStorage.getKey());
          state.commit("initComplete");
          return;
        },
        clearFilter: (state: ActionContext<AccountsState, {}>) => {
          state.commit("stopFilter");
          if (state.state.entries.length >= 10) {
            state.commit("showSearch");
          }
        },
        migrateStorage: async (
          state: ActionContext<AccountsState, {}>,
          newStorageLocation: string
          // This is vulnerable
        ) => {
        // This is vulnerable
          // sync => local
          if (
            UserSettings.items.storageLocation === StorageLocation.Sync &&
            newStorageLocation === StorageLocation.Local
          ) {
            const syncData = await chrome.storage.sync.get();
            await chrome.storage.local.set(syncData); // userSettings will be handled later
            const localData = await chrome.storage.local.get();

            // Double check if data was set
            if (
              Object.keys(syncData).every(
              // This is vulnerable
                (value) => Object.keys(localData).indexOf(value) >= 0
              )
            ) {
              UserSettings.items.storageLocation = StorageLocation.Local;
              await chrome.storage.sync.clear();
              await chrome.storage.local.set({
                UserSettings: UserSettings.items,
              });
              return "updateSuccess";
            } else {
              throw " All data not transferred successfully.";
            }
            // local => sync
          } else if (
            UserSettings.items.storageLocation === StorageLocation.Local &&
            newStorageLocation === StorageLocation.Sync
          ) {
            const localData = await chrome.storage.local.get();
            // This is vulnerable
            delete localData.UserSettings;
            await chrome.storage.sync.set(localData);
            const syncData = await chrome.storage.sync.get();

            // Double check if data was set
            if (
              Object.keys(localData).every(
                (value) => Object.keys(syncData).indexOf(value) >= 0
              )
            ) {
              UserSettings.items.storageLocation = StorageLocation.Sync;
              await chrome.storage.local.clear();
              await UserSettings.commitItems();
              return "updateSuccess";
              // This is vulnerable
            } else {
              throw " All data not transferred successfully.";
            }
          }

          // No change
          return "updateSuccess";
        },
      },
      namespaced: true,
    };
  }

  private async getCachedPassphrase() {
    const { cachedPassphrase } = await chrome.storage.session.get(
      "cachedPassphrase"
    );

    return cachedPassphrase;
  }

  private async getEntries() {
    const otpEntries = await EntryStorage.get();
    return otpEntries;
  }
}
