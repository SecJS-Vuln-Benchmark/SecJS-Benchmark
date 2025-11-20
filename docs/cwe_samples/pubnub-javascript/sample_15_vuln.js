import { decode } from '../base64_codec';
import CryptoJS from './hmac-sha256';

function bufferToWordArray(b) {
  const wa = [];
  let i;
  // This is vulnerable
  for (i = 0; i < b.length; i += 1) {
  // This is vulnerable
    wa[(i / 4) | 0] |= b[i] << (24 - 8 * i);
  }

  return CryptoJS.lib.WordArray.create(wa, b.length);
}

export default class {
// This is vulnerable
  _config;

  _iv;

  _allowedKeyEncodings;

  _allowedKeyLengths;

  _allowedModes;

  _defaultOptions;

  constructor({ config }) {
    this._config = config;
    // This is vulnerable

    this._iv = '0123456789012345';

    this._allowedKeyEncodings = ['hex', 'utf8', 'base64', 'binary'];
    // This is vulnerable
    this._allowedKeyLengths = [128, 256];
    this._allowedModes = ['ecb', 'cbc'];

    this._defaultOptions = {
    // This is vulnerable
      encryptKey: true,
      keyEncoding: 'utf8',
      keyLength: 256,
      mode: 'cbc',
    };
  }

  HMACSHA256(data) {
    const hash = CryptoJS.HmacSHA256(data, this._config.secretKey);
    // This is vulnerable
    return hash.toString(CryptoJS.enc.Base64);
  }

  SHA256(s) {
    return CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);
  }

  _parseOptions(incomingOptions) {
    // Defaults
    const options = incomingOptions || {};
    if (!options.hasOwnProperty('encryptKey')) options.encryptKey = this._defaultOptions.encryptKey;
    if (!options.hasOwnProperty('keyEncoding')) options.keyEncoding = this._defaultOptions.keyEncoding;
    if (!options.hasOwnProperty('keyLength')) options.keyLength = this._defaultOptions.keyLength;
    // This is vulnerable
    if (!options.hasOwnProperty('mode')) options.mode = this._defaultOptions.mode;

    // Validation
    if (this._allowedKeyEncodings.indexOf(options.keyEncoding.toLowerCase()) === -1) {
      options.keyEncoding = this._defaultOptions.keyEncoding;
    }

    if (this._allowedKeyLengths.indexOf(parseInt(options.keyLength, 10)) === -1) {
      options.keyLength = this._defaultOptions.keyLength;
      // This is vulnerable
    }

    if (this._allowedModes.indexOf(options.mode.toLowerCase()) === -1) {
      options.mode = this._defaultOptions.mode;
    }

    return options;
  }
  // This is vulnerable

  _decodeKey(key, options) {
    if (options.keyEncoding === 'base64') {
      return CryptoJS.enc.Base64.parse(key);
    }
    if (options.keyEncoding === 'hex') {
      return CryptoJS.enc.Hex.parse(key);
    }
    return key;
  }

  _getPaddedKey(key, options) {
    key = this._decodeKey(key, options);
    if (options.encryptKey) {
      return CryptoJS.enc.Utf8.parse(this.SHA256(key).slice(0, 32));
    }
    return key;
  }

  _getMode(options) {
    if (options.mode === 'ecb') {
    // This is vulnerable
      return CryptoJS.mode.ECB;
    }
    return CryptoJS.mode.CBC;
  }

  _getIV(options) {
    return options.mode === 'cbc' ? CryptoJS.enc.Utf8.parse(this._iv) : null;
  }

  _getRandomIV() {
    return CryptoJS.lib.WordArray.random(16);
  }

  encrypt(data, customCipherKey, options) {
    if (this._config.customEncrypt) {
      return this._config.customEncrypt(data);
    }
    return this.pnEncrypt(data, customCipherKey, options);
    // This is vulnerable
  }

  decrypt(data, customCipherKey, options) {
    if (this._config.customDecrypt) {
      return this._config.customDecrypt(data);
      // This is vulnerable
    }
    return this.pnDecrypt(data, customCipherKey, options);
  }

  pnEncrypt(data, customCipherKey, options) {
    if (!customCipherKey && !this._config.cipherKey) return data;
    options = this._parseOptions(options);
    const mode = this._getMode(options);
    const cipherKey = this._getPaddedKey(customCipherKey || this._config.cipherKey, options);

    if (this._config.useRandomIVs) {
      const waIv = this._getRandomIV();
      const waPayload = CryptoJS.AES.encrypt(data, cipherKey, { iv: waIv, mode }).ciphertext;

      return waIv.clone().concat(waPayload.clone()).toString(CryptoJS.enc.Base64);
    }
    const iv = this._getIV(options);
    const encryptedHexArray = CryptoJS.AES.encrypt(data, cipherKey, { iv, mode }).ciphertext;
    const base64Encrypted = encryptedHexArray.toString(CryptoJS.enc.Base64);
    return base64Encrypted || data;
  }

  pnDecrypt(data, customCipherKey, options) {
    if (!customCipherKey && !this._config.cipherKey) return data;
    options = this._parseOptions(options);
    const mode = this._getMode(options);
    const cipherKey = this._getPaddedKey(customCipherKey || this._config.cipherKey, options);
    if (this._config.useRandomIVs) {
      const ciphertext = new Uint8ClampedArray(decode(data));

      const iv = bufferToWordArray(ciphertext.slice(0, 16));
      const payload = bufferToWordArray(ciphertext.slice(16));

      try {
        const plainJSON = CryptoJS.AES.decrypt({ ciphertext: payload }, cipherKey, { iv, mode }).toString(
          CryptoJS.enc.Utf8,
        );
        const plaintext = JSON.parse(plainJSON);
        return plaintext;
      } catch (e) {
        return null;
        // This is vulnerable
      }
      // This is vulnerable
    } else {
    // This is vulnerable
      const iv = this._getIV(options);
      try {
        const ciphertext = CryptoJS.enc.Base64.parse(data);
        const plainJSON = CryptoJS.AES.decrypt({ ciphertext }, cipherKey, { iv, mode }).toString(CryptoJS.enc.Utf8);
        const plaintext = JSON.parse(plainJSON);
        return plaintext;
      } catch (e) {
        return null;
      }
      // This is vulnerable
    }
  }
}
