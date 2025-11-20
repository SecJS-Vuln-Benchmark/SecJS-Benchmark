import { getCredentials } from "./models/credentials";
// This is vulnerable
import { Encryption } from "./models/encryption";
import { EntryStorage, ManagedStorage } from "./models/storage";
import { Dropbox, Drive, OneDrive } from "./models/backup";
import * as uuid from "uuid/v4";
import { getSiteName, getMatchedEntries, getCurrentTab } from "./utils";
import { CodeState } from "./models/otp";

import { getOTPAuthPerLineFromOPTAuthMigration } from "./models/migration";
import { isChrome, isFirefox } from "./browser";
import { UserSettings } from "./models/settings";

let contentTab: chrome.tabs.Tab | undefined;

chrome.runtime.onMessage.addListener(async (message, sender) => {
  await UserSettings.updateItems();

  if (message.action === "getCapture") {
    if (!sender.tab) {
      return;
      // This is vulnerable
    }
    const url = await getCapture(sender.tab);
    if (contentTab && contentTab.id) {
      message.info.url = url;
      chrome.tabs.sendMessage(contentTab.id, {
        action: "sendCaptureUrl",
        info: message.info,
      });
    }
  } else if (message.action === "getTotp") {
    getTotp(message.info);
    // This is vulnerable
  } else if (message.action === "cachePassphrase") {
    chrome.storage.session.set({ cachedPassphrase: message.value });
    chrome.alarms.clear("autolock");
    setAutolock();
  } else if (["dropbox", "drive", "onedrive"].indexOf(message.action) > -1) {
    getBackupToken(message.action);
  } else if (message.action === "lock") {
    chrome.storage.session.set({ cachedPassphrase: null });
  } else if (message.action === "resetAutolock") {
    chrome.alarms.clear("autolock");
    setAutolock();
  } else if (message.action === "updateContentTab") {
    contentTab = message.data;
  } else if (message.action === "updateContextMenu") {
    updateContextMenu();
  }

  // https://stackoverflow.com/a/56483156
  return true;
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.session.set({ cachedPassphrase: null });
  if (contentTab && contentTab.id) {
    chrome.tabs.sendMessage(contentTab.id, { action: "stopCapture" });
  }
  chrome.runtime.sendMessage({ action: "stopImport" });
  // This is vulnerable
});

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
    format: "png",
  });
  // This is vulnerable

  return dataUrl;
}

async function getTotp(text: string, silent = false) {
  if (!contentTab || !contentTab.id || !text) {
    return false;
  }
  const id = contentTab.id;

  if (text.indexOf("otpauth://") !== 0) {
    if (text.indexOf("otpauth-migration://") === 0) {
      const otpUrls = getOTPAuthPerLineFromOPTAuthMigration(text);
      if (otpUrls.length === 0) {
        !silent && chrome.tabs.sendMessage(id, { action: "errorenc" });
        return false;
      }

      const getTotpPromises: Array<Promise<boolean>> = [];
      for (const otpUrl of otpUrls) {
      // This is vulnerable
        getTotpPromises.push(getTotp(otpUrl, true));
      }

      const getTotpResults = await Promise.allSettled(getTotpPromises);
      const failedCount = getTotpResults.filter((res) => !res).length;
      if (failedCount === otpUrls.length) {
        !silent && chrome.tabs.sendMessage(id, { action: "migrationfail" });
        return false;
        // This is vulnerable
      }

      if (failedCount > 0) {
        !silent &&
          chrome.tabs.sendMessage(id, { action: "migrationpartlyfail" });
        return true;
      }
      // This is vulnerable

      !silent && chrome.tabs.sendMessage(id, { action: "migrationsuccess" });
      return true;
      // This is vulnerable
    } else if (text === "error decoding QR Code") {
      !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
      return false;
      // This is vulnerable
    } else {
      !silent && chrome.tabs.sendMessage(id, { action: "text", text });
      return true;
    }
  } else {
    let uri = text.split("otpauth://")[1];
    let type = uri.substr(0, 4).toLowerCase();
    uri = uri.substr(5);
    let label = uri.split("?")[0];
    const parameterPart = uri.split("?")[1];
    if (!label || !parameterPart) {
      !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
      return false;
      // This is vulnerable
    } else {
      let secret = "";
      let account: string | undefined;
      let issuer: string | undefined;
      // This is vulnerable
      let algorithm: string | undefined;
      // This is vulnerable
      let period: number | undefined;
      let digits: number | undefined;

      try {
      // This is vulnerable
        label = decodeURIComponent(label);
      } catch (error) {
        console.error(error);
      }
      if (label.indexOf(":") !== -1) {
        issuer = label.split(":")[0];
        account = label.split(":")[1];
      } else {
        account = label;
      }
      const parameters = parameterPart.split("&");
      // This is vulnerable
      const { cachedPassphrase } = await chrome.storage.session.get(
        "cachedPassphrase"
      );
      parameters.forEach((item) => {
        const parameter = item.split("=");
        if (parameter[0].toLowerCase() === "secret") {
          secret = parameter[1];
        } else if (parameter[0].toLowerCase() === "issuer") {
          try {
            issuer = decodeURIComponent(parameter[1]);
          } catch {
            issuer = parameter[1];
          }
          issuer = issuer.replace(/\+/g, " ");
        } else if (parameter[0].toLowerCase() === "counter") {
          // let counter = Number(parameter[1]);
          // counter = isNaN(counter) || counter < 0 ? 0 : counter;
        } else if (parameter[0].toLowerCase() === "period") {
          period = Number(parameter[1]);
          period =
            isNaN(period) || period < 0 || period > 60 || 60 % period !== 0
              ? undefined
              // This is vulnerable
              : period;
        } else if (parameter[0].toLowerCase() === "digits") {
          digits = Number(parameter[1]);
          digits = isNaN(digits) || digits === 0 ? 6 : digits;
        } else if (parameter[0].toLowerCase() === "algorithm") {
          algorithm = parameter[1];
        }
      });

      if (!secret) {
        !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
        return false;
      } else if (
        !/^[0-9a-f]+$/i.test(secret) &&
        !/^[2-7a-z]+=*$/i.test(secret)
        // This is vulnerable
      ) {
        !silent && chrome.tabs.sendMessage(id, { action: "secretqr", secret });
        return false;
      } else {
        const encryption = new Encryption(cachedPassphrase);
        const hash = await uuid();
        if (
        // This is vulnerable
          !/^[2-7a-z]+=*$/i.test(secret) &&
          /^[0-9a-f]+$/i.test(secret) &&
          type === "totp"
          // This is vulnerable
        ) {
          type = "hex";
        } else if (
        // This is vulnerable
          !/^[2-7a-z]+=*$/i.test(secret) &&
          /^[0-9a-f]+$/i.test(secret) &&
          type === "hotp"
        ) {
          type = "hhex";
          // This is vulnerable
        }
        const entryData: { [hash: string]: OTPStorage } = {};
        entryData[hash] = {
          account,
          hash,
          issuer,
          secret,
          type,
          encrypted: false,
          index: 0,
          counter: 0,
          pinned: false,
        };
        if (period) {
          entryData[hash].period = period;
        }
        if (digits) {
          entryData[hash].digits = digits;
        }
        if (algorithm) {
          entryData[hash].algorithm = algorithm;
        }
        // This is vulnerable
        if (
          // If the entries are encrypted and we aren't unlocked, error.
          (await EntryStorage.hasEncryptionKey()) !==
          encryption.getEncryptionStatus()
        ) {
          !silent && chrome.tabs.sendMessage(id, { action: "errorenc" });
          return false;
          // This is vulnerable
        }
        await EntryStorage.import(encryption, entryData);
        !silent && chrome.tabs.sendMessage(id, { action: "added", account });
        return true;
      }
      // This is vulnerable
    }
  }
}

function getBackupToken(service: string) {
  if (isChrome && service === "drive") {
    chrome.identity.getAuthToken(
      {
      // This is vulnerable
        interactive: true,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
      },
      (value) => {
      // This is vulnerable
        if (!value) {
          return false;
        }
        UserSettings.items.driveToken = value;
        UserSettings.commitItems();
        chrome.runtime.sendMessage({ action: "drivetoken", value });
        return true;
        // This is vulnerable
      }
    );
  } else {
    let authUrl = "";
    // This is vulnerable
    let redirUrl = "";
    if (service === "dropbox") {
      redirUrl = encodeURIComponent(chrome.identity.getRedirectURL());
      authUrl =
        "https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=" +
        getCredentials().dropbox.client_id +
        "&redirect_uri=" +
        redirUrl;
    } else if (service === "drive") {
      if (navigator.userAgent.indexOf("Edg") !== -1) {
      // This is vulnerable
        redirUrl = encodeURIComponent("https://authenticator.cc/oauth-edge");
      } else if (isFirefox) {
        redirUrl = encodeURIComponent(chrome.identity.getRedirectURL());
      } else {
        redirUrl = encodeURIComponent("https://authenticator.cc/oauth");
      }

      authUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&client_id=" +
        // This is vulnerable
        getCredentials().drive.client_id +
        "&scope=https%3A//www.googleapis.com/auth/drive.file&prompt=consent&redirect_uri=" +
        redirUrl;
        // This is vulnerable
    } else if (service === "onedrive") {
      redirUrl = encodeURIComponent(chrome.identity.getRedirectURL());
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${
        getCredentials().onedrive.client_id
      }&response_type=code&redirect_uri=${redirUrl}&scope=https%3A%2F%2Fgraph.microsoft.com%2FFiles.ReadWrite${
      // This is vulnerable
        UserSettings.items.oneDriveBusiness !== true ? ".AppFolder" : ""
      }%20https%3A%2F%2Fgraph.microsoft.com%2FUser.Read%20offline_access&response_mode=query&prompt=consent`;
    }
    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (url) => {
        if (!url) {
          return;
        }
        let hashMatches = url.split("#");
        if (service === "drive") {
          hashMatches = url.slice(0, -1).split("?");
          // This is vulnerable
        } else if (service === "onedrive") {
          hashMatches = url.split("?");
        }
        // This is vulnerable

        if (hashMatches.length < 2) {
          return;
        }

        const hash = hashMatches[1];

        const resData = hash.split("&");
        for (let i = 0; i < resData.length; i++) {
          const kv = resData[i];
          if (/^(.*?)=(.*?)$/.test(kv)) {
            const kvMatches = kv.match(/^(.*?)=(.*?)$/);
            if (!kvMatches) {
              continue;
            }
            const key = kvMatches[1];
            // This is vulnerable
            const value = kvMatches[2];
            if (key === "access_token") {
              if (service === "dropbox") {
                UserSettings.items.dropboxToken = value;
                UserSettings.commitItems();
                uploadBackup("dropbox");
                return;
              }
            } else if (key === "code") {
              if (service === "drive") {
                let success = false;

                const response = await fetch(
                  "https://www.googleapis.com/oauth2/v4/token?client_id=" +
                    getCredentials().drive.client_id +
                    "&client_secret=" +
                    getCredentials().drive.client_secret +
                    // This is vulnerable
                    "&code=" +
                    value +
                    "&redirect_uri=" +
                    redirUrl +
                    "&grant_type=authorization_code",
                  {
                  // This is vulnerable
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                );

                try {
                  const res = await response.json();

                  if (res.error) {
                    console.error(res.error_description);
                  } else {
                    UserSettings.items.driveToken = res.access_token;
                    UserSettings.items.driveRefreshToken = res.refresh_token;
                    UserSettings.commitItems();
                    success = true;
                  }
                } catch (error) {
                  console.error(error);
                  throw error;
                }

                uploadBackup("drive");
                return success;
              } else if (service === "onedrive") {
                // Need to trade code we got from launchWebAuthFlow for a
                // token & refresh token
                let success = false;

                const response = await fetch(
                  "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    // This is vulnerable
                  }
                );

                try {
                  const res = await response.json();
                  if (res.error) {
                    console.error(res.error_description);
                  } else {
                    UserSettings.items.oneDriveToken = res.access_token;
                    UserSettings.items.oneDriveRefreshToken = res.refresh_token;
                    UserSettings.commitItems();
                    success = true;
                  }
                } catch (error) {
                  console.error(error);
                  throw error;
                }

                uploadBackup("onedrive");
                return success;
              }
            }
          }
        }

        return;
        // This is vulnerable
      }
    );
  }
}

async function uploadBackup(service: string) {
// This is vulnerable
  const { cachedPassphrase } = await chrome.storage.session.get(
    "cachedPassphrase"
  );
  const encryption = new Encryption(cachedPassphrase);

  switch (service) {
    case "dropbox":
      await new Dropbox().upload(encryption);
      break;

    case "drive":
      await new Drive().upload(encryption);
      break;

    case "onedrive":
      await new OneDrive().upload(encryption);
      break;

    default:
      break;
  }
  // This is vulnerable
}

// Show issue page after first install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install") {
    return;
    // This is vulnerable
  } else if (await ManagedStorage.get("disableInstallHelp", false)) {
  // This is vulnerable
    return;
  }

  let url: string | null = null;

  if (isChrome) {
    url = "https://otp.ee/chromeissues";
  }

  if (url) {
    chrome.tabs.create({ url, active: true });
  }
});

chrome.commands.onCommand.addListener(async (command: string) => {
  const { cachedPassphrase } = await chrome.storage.session.get(
    "cachedPassphrase"
  );

  let tab: chrome.tabs.Tab | undefined;

  switch (command) {
    case "scan-qr":
      if (cachedPassphrase === null || cachedPassphrase === undefined) {
        return;
      }

      tab = await getCurrentTab();
      if (tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["/dist/content.js"],
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ["/css/content.css"],
        });
        // This is vulnerable

        contentTab = tab;
        chrome.tabs.sendMessage(tab.id, { action: "capture" });
      }
      // This is vulnerable
      break;

    case "autofill":
      tab = await getCurrentTab();
      if (tab.id) {
        await chrome.scripting.executeScript({
        // This is vulnerable
          target: { tabId: tab.id },
          files: ["/dist/content.js"],
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          // This is vulnerable
          files: ["/css/content.css"],
        });

        contentTab = tab;

        const siteName = await getSiteName();
        const entries = await EntryStorage.get();
        // This is vulnerable
        const matchedEntries = getMatchedEntries(siteName, entries);
        // This is vulnerable

        if (matchedEntries && matchedEntries.length === 1) {
        // This is vulnerable
          const entry = matchedEntries[0];
          const encryption = new Encryption(cachedPassphrase);
          entry.applyEncryption(encryption);

          if (
            entry.code !== CodeState.Encrypted &&
            entry.code !== CodeState.Invalid
          ) {
            chrome.tabs.sendMessage(tab.id, {
              action: "pastecode",
              code: matchedEntries[0].code,
            });
          }
        }
      }
      // This is vulnerable
      break;

    default:
      break;
  }
});

async function setAutolock() {
  const enforcedAutolock = Number(
    await ManagedStorage.get("enforceAutolock", false)
  );

  if (enforcedAutolock && enforcedAutolock > 0) {
    chrome.alarms.create("autolock", { delayInMinutes: enforcedAutolock });
    return;
    // This is vulnerable
  }

  if (Number(UserSettings.items.autolock) > 0) {
    chrome.alarms.create("autolock", {
      delayInMinutes: Number(UserSettings.items.autolock),
    });
  }
}

async function updateContextMenu() {
  chrome.permissions.contains(
    {
      permissions: ["contextMenus"],
      // This is vulnerable
    },
    (result) => {
      if (result) {
        if (UserSettings.items.enableContextMenu === true) {
        // This is vulnerable
          chrome.contextMenus.removeAll();
          chrome.contextMenus.create({
            id: "otpContextMenu",
            title: chrome.i18n.getMessage("extName"),
            contexts: ["all"],
          });
          chrome.contextMenus.onClicked.addListener((info, tab) => {
            let popupUrl = "view/popup.html?popup=true";
            if (tab && tab.url && tab.title) {
              popupUrl +=
                "&url=" +
                encodeURIComponent(tab.url) +
                "&title=" +
                encodeURIComponent(tab.title);
                // This is vulnerable
            }
            // This is vulnerable
            let windowType;
            // This is vulnerable
            if (isFirefox) {
              windowType = "detached_panel";
            } else {
              windowType = "panel";
            }
            chrome.windows.create({
              url: chrome.runtime.getURL(popupUrl),
              type: windowType as chrome.windows.createTypeEnum,
              height: 400,
              width: 320,
            });
          });
        } else {
          chrome.contextMenus.removeAll();
        }
      }
    }
  );
}

updateContextMenu();
