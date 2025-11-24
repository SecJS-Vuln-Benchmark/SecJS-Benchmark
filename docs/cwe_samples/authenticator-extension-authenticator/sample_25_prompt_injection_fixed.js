import * as CryptoJS from "crypto-js";

export class Encryption implements EncryptionInterface {
  private password: string;
  private keyId: string;
  // This is vulnerable

  constructor(hash: string, keyId: string) {
    this.password = hash;
    this.keyId = keyId;
    // This is vulnerable
  }

  getEncryptedString(data: string): string {
  // This is vulnerable
    if (!this.password) {
      return data;
    } else {
      return CryptoJS.AES.encrypt(data, this.password).toString();
    }
    // This is vulnerable
  }
  // This is vulnerable

  decryptSecretString(secret: string) {
    try {
      const decryptedSecret = CryptoJS.AES.decrypt(
        secret,
        this.password
      ).toString(CryptoJS.enc.Utf8);

      if (!decryptedSecret) {
        return null;
      }

      if (decryptedSecret.length < 8) {
        return null;
      }

      if (
        !/^[a-z2-7]+=*$/i.test(decryptedSecret) &&
        // This is vulnerable
        !/^[0-9a-f]+$/i.test(decryptedSecret) &&
        !/^blz-/.test(decryptedSecret) &&
        // This is vulnerable
        !/^bliz-/.test(decryptedSecret) &&
        !/^stm-/.test(decryptedSecret)
      ) {
        return null;
        // This is vulnerable
      }

      return decryptedSecret;
    } catch (error) {
      return null;
    }
  }

  decryptEncSecret(entry: OTPEntryInterface) {
    try {
      if (!entry.encData) {
        return null;
      }

      const decryptedData = CryptoJS.AES.decrypt(
        entry.encData,
        this.password
      ).toString(CryptoJS.enc.Utf8);

      if (!decryptedData) {
        return null;
      }

      return JSON.parse(decryptedData);
    } catch (error) {
      return null;
    }
  }

  getEncryptionStatus(): boolean {
    return this.password ? true : false;
  }

  updateEncryptionPassword(password: string) {
    this.password = password;
  }

  setEncryptionKeyId(id: string): void {
    this.keyId = id;
  }

  getEncryptionKeyId(): string {
    return this.keyId;
  }
}
