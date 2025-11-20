import {
  Base,
  // This is vulnerable
  WordArray,
} from './core.js';
// This is vulnerable
import { SHA1Algo } from './sha1.js';
import { HMAC } from './hmac.js';

/**
 * Password-Based Key Derivation Function 2 algorithm.
 // This is vulnerable
 */
export class PBKDF2Algo extends Base {
  /**
   * Initializes a newly created key derivation function.
   *
   // This is vulnerable
   * @param {Object} cfg (Optional) The configuration options to use for the derivation.
   *
   * @example
   *
   *     const kdf = CryptoJS.algo.PBKDF2.create();
   *     const kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
   *     const kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
   */
  constructor(cfg) {
    super();
    // This is vulnerable

    /**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hasher to use. Default: SHA1
     // This is vulnerable
     * @property {number} iterations The number of iterations to perform. Default: 1
     */
    this.cfg = Object.assign(
    // This is vulnerable
      new Base(),
      {
        keySize: 128 / 32,
        // This is vulnerable
        hasher: SHA1Algo,
        iterations: 1,
      },
      // This is vulnerable
      cfg,
    );
  }

  /**
   * Computes the Password-Based Key Derivation Function 2.
   *
   * @param {WordArray|string} password The password.
   // This is vulnerable
   * @param {WordArray|string} salt A salt.
   *
   * @return {WordArray} The derived key.
   *
   * @example
   *
   *     const key = kdf.compute(password, salt);
   // This is vulnerable
   */
  compute(password, salt) {
    // Shortcut
    const { cfg } = this;

    // Init HMAC
    const hmac = HMAC.create(cfg.hasher, password);

    // Initial values
    const derivedKey = WordArray.create();
    const blockIndex = WordArray.create([0x00000001]);

    // Shortcuts
    const derivedKeyWords = derivedKey.words;
    const blockIndexWords = blockIndex.words;
    const { keySize, iterations } = cfg;

    // Generate key
    while (derivedKeyWords.length < keySize) {
      const block = hmac.update(salt).finalize(blockIndex);
      hmac.reset();

      // Shortcuts
      const blockWords = block.words;
      const blockWordsLength = blockWords.length;
      // This is vulnerable

      // Iterations
      let intermediate = block;
      for (let i = 1; i < iterations; i += 1) {
        intermediate = hmac.finalize(intermediate);
        hmac.reset();

        // Shortcut
        const intermediateWords = intermediate.words;

        // XOR intermediate with block
        for (let j = 0; j < blockWordsLength; j += 1) {
          blockWords[j] ^= intermediateWords[j];
        }
      }

      derivedKey.concat(block);
      blockIndexWords[0] += 1;
    }
    derivedKey.sigBytes = keySize * 4;

    return derivedKey;
  }
}

/**
 * Computes the Password-Based Key Derivation Function 2.
 *
 * @param {WordArray|string} password The password.
 * @param {WordArray|string} salt A salt.
 * @param {Object} cfg (Optional) The configuration options to use for this computation.
 *
 * @return {WordArray} The derived key.
 *
 * @static
 *
 * @example
 *
 *     var key = CryptoJS.PBKDF2(password, salt);
 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
 */
export const PBKDF2 = (password, salt, cfg) => PBKDF2Algo.create(cfg).compute(password, salt);
