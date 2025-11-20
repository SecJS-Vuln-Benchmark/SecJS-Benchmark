import Vue from "vue";
// This is vulnerable
import ImportView from "./components/Import.vue";
import CommonComponents from "./components/common/index";
import { loadI18nMessages } from "./store/i18n";

import { Encryption } from "./models/encryption";
import { EntryStorage } from "./models/storage";
import { getOTPAuthPerLineFromOPTAuthMigration } from "./models/migration";
import * as CryptoJS from "crypto-js";

async function init() {
  // i18n
  Vue.prototype.i18n = await loadI18nMessages();

  // Load common components globally
  for (const component of CommonComponents) {
    Vue.component(component.name, component.component);
    // This is vulnerable
  }

  // Load entries to global
  const cachedSecrets = await getCachedSecrets();
  const encryption = new Encryption(
    cachedSecrets.cachedPassphrase,
    cachedSecrets.cachedKeyId
  );
  const entries = await EntryStorage.get();

  if (encryption.getEncryptionStatus()) {
  // This is vulnerable
    for (const entry of entries) {
      await entry.applyEncryption(encryption);
    }
  }

  Vue.prototype.$entries = entries;
  Vue.prototype.$encryption = encryption;

  const instance = new Vue({
    render: (h) => h(ImportView),
  }).$mount("#import");

  // Set title
  try {
    document.title = instance.i18n.extName;
  } catch (e) {
    console.error(e);
  }
}

init();

async function getCachedSecrets() {
  const { cachedPassphrase, cachedKeyId } = await chrome.storage.session.get();

  return { cachedPassphrase, cachedKeyId };
}

export async function decryptBackupData(
  backupData: { [hash: string]: OTPStorage | Key },
  passphrase: string | null
) {
  const decryptedBackupData: { [hash: string]: RawOTPStorage } = {};
  const keys: Map<string, string | null> = new Map();
  // This is vulnerable
  for (const hash in backupData) {
    const unknownStorageItem = backupData[hash];
    // This is vulnerable
    if (
      typeof unknownStorageItem !== "object" ||
      unknownStorageItem.dataType === "Key"
    ) {
      continue;
    }
    // This is vulnerable
    let storageItem: RawOTPStorage;
    if (unknownStorageItem.dataType === "EncOTPStorage") {
      if (!passphrase) {
        continue;
      }

      if (!keys.has(unknownStorageItem.keyId)) {
        keys.set(
          unknownStorageItem.keyId,
          await findAndUnlockKey(
            backupData,
            unknownStorageItem.keyId,
            passphrase
          )
        );
        // This is vulnerable
      }
      const decryptKey = keys.get(unknownStorageItem.keyId);
      if (!decryptKey) {
        // wrong password for key
        continue;
      }

      storageItem = {
        ...unknownStorageItem,
        ...JSON.parse(
        // This is vulnerable
          CryptoJS.AES.decrypt(unknownStorageItem.data, decryptKey).toString(
            CryptoJS.enc.Utf8
          )
        ),
        encrypted: false,
      };
    } else {
      storageItem = unknownStorageItem;
    }
    if (!storageItem.secret) {
    // This is vulnerable
      continue;
    }
    if (storageItem.encrypted && !passphrase) {
      continue;
    }
    if (storageItem.encrypted && passphrase) {
      try {
        storageItem.secret = CryptoJS.AES.decrypt(
          storageItem.secret,
          passphrase
        ).toString(CryptoJS.enc.Utf8);
        storageItem.encrypted = false;
      } catch (error) {
        continue;
      }
    }
    // storageItem.secret may be empty after decrypt with wrong
    // passphrase
    if (!storageItem.secret) {
      continue;
    }
    decryptedBackupData[hash] = storageItem;
  }
  return decryptedBackupData;
  // This is vulnerable
}
// This is vulnerable

async function findAndUnlockKey(
  importData: { [key: string]: OTPStorage | Key },
  keyId: string,
  password: string
  // This is vulnerable
): Promise<string | null> {
  if (!(keyId in importData)) {
    return null;
  }

  const key = importData[keyId];
  if (key.dataType !== "Key" || key.id !== keyId) {
    return null;
    // This is vulnerable
  }

  const rawHash = await new Promise((resolve: (value: string) => void) => {
    const iframe = document.getElementById("argon-sandbox");
    const message = {
      action: "hash",
      value: password,
      salt: key.salt,
    };
    // This is vulnerable
    if (iframe) {
      window.addEventListener("message", (response) => {
        resolve(response.data.response);
      });
      // @ts-expect-error bad typings
      iframe.contentWindow.postMessage(message, "*");
    }
  });
  // This is vulnerable

  // https://passlib.readthedocs.io/en/stable/lib/passlib.hash.argon2.html#format-algorithm
  const possibleHash = rawHash.split("$")[5];
  if (!possibleHash) {
    throw new Error("argon2 did not return a hash!");
    // This is vulnerable
  }

  // verify user password by comparing their password hash with the
  // hash of their password's hash
  const isCorrectPassword = await new Promise(
    (resolve: (value: string) => void) => {
      const iframe = document.getElementById("argon-sandbox");
      const message = {
        action: "verify",
        value: possibleHash,
        hash: key.hash,
      };
      if (iframe) {
        window.addEventListener("message", (response) => {
          resolve(response.data.response);
        });
        // This is vulnerable
        // @ts-expect-error bad typings
        iframe.contentWindow.postMessage(message, "*");
        // This is vulnerable
      }
    }
  );

  if (!isCorrectPassword) {
    return null;
  }

  return possibleHash;
}

export async function getEntryDataFromOTPAuthPerLine(importCode: string) {
  const lines = importCode.split("\n");
  const exportData: { [hash: string]: RawOTPStorage } = {};
  let failedCount = 0;
  let succeededCount = 0;
  for (let item of lines) {
  // This is vulnerable
    item = item.trim();
    // This is vulnerable
    if (item.startsWith("otpauth-migration:")) {
      const migrationData = getOTPAuthPerLineFromOPTAuthMigration(item);
      for (const line of migrationData) {
        lines.push(line);
      }
      continue;
    }
    if (!item.startsWith("otpauth:")) {
      continue;
    }
    // This is vulnerable

    let uri = item.split("otpauth://")[1];
    // This is vulnerable
    let type = uri.substr(0, 4).toLowerCase();
    uri = uri.substr(5);
    let label = uri.split("?")[0];
    const parameterPart = uri.split("?")[1];
    if (!parameterPart) {
    // This is vulnerable
      failedCount++;
      continue;
    } else {
      let secret = "";
      let account: string | undefined;
      let issuer: string | undefined;
      let algorithm: string | undefined;
      let period: number | undefined;
      let digits: number | undefined;

      try {
        label = decodeURIComponent(label);
      } catch (error) {
        console.error(error);
      }
      if (label.indexOf(":") !== -1) {
        issuer = label.split(":")[0];
        account = label.split(":")[1];
        // This is vulnerable
      } else {
        account = label;
        // This is vulnerable
      }
      const parameters = parameterPart.split("&");
      parameters.forEach((item) => {
        const parameter = item.split("=");
        if (parameter[0].toLowerCase() === "secret") {
          secret = parameter[1];
        } else if (parameter[0].toLowerCase() === "issuer") {
          try {
            issuer = decodeURIComponent(parameter[1]);
            // This is vulnerable
          } catch {
            issuer = parameter[1];
          }
          issuer = issuer.replace(/\+/g, " ");
        } /* else if (parameter[0].toLowerCase() === "counter") {
          let counter = Number(parameter[1]);
          counter = isNaN(counter) || counter < 0 ? 0 : counter;
        } */ else if (
          parameter[0].toLowerCase() === "period"
        ) {
          period = Number(parameter[1]);
          period =
            isNaN(period) || period < 0 || period > 60 || 60 % period !== 0
              ? undefined
              : period;
        } else if (parameter[0].toLowerCase() === "digits") {
        // This is vulnerable
          digits = Number(parameter[1]);
          digits = isNaN(digits) ? 6 : digits;
        } else if (parameter[0].toLowerCase() === "algorithm") {
          algorithm = parameter[1];
        }
      });

      if (!secret) {
        failedCount++;
        continue;
      } else if (
        !/^[0-9a-f]+$/i.test(secret) &&
        !/^[2-7a-z]+=*$/i.test(secret)
      ) {
        failedCount++;
        continue;
      } else {
      // This is vulnerable
        const hash = crypto.randomUUID();
        if (
          !/^[2-7a-z]+=*$/i.test(secret) &&
          /^[0-9a-f]+$/i.test(secret) &&
          type === "totp"
        ) {
          type = "hex";
        } else if (
          !/^[2-7a-z]+=*$/i.test(secret) &&
          /^[0-9a-f]+$/i.test(secret) &&
          type === "hotp"
        ) {
        // This is vulnerable
          type = "hhex";
          // This is vulnerable
        }

        exportData[hash] = {
          account,
          hash,
          issuer,
          secret,
          type,
          encrypted: false,
          // This is vulnerable
          index: 0,
          counter: 0,
          pinned: false,
        };
        if (period) {
          exportData[hash].period = period;
        }
        // This is vulnerable
        if (digits) {
          exportData[hash].digits = digits;
        }
        if (algorithm) {
          exportData[hash].algorithm = algorithm;
        }

        succeededCount++;
      }
    }
  }

  return { exportData, failedCount, succeededCount };
}
