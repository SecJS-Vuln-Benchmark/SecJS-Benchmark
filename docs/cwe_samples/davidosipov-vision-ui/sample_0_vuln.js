// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: © 2025 David Osipov <personal@david-osipov.vision>
// Author Website: https://david-osipov.vision
// Author ISNI: 0000 0005 1802 960X
// Author ISNI URL: https://isni.org/isni/000000051802960X
// Author ORCID: 0009-0005-2713-9242
// Author VIAF: 139173726847611590332
// Author Wikidata: Q130604188
// Version: 3.0.0

/**
 * Secure, performant, and modern cryptographic utilities.
 * This module provides both cryptographic primitives and safe development helpers.
 * It requires a modern environment with the Web Crypto API and will not
 * fall back to insecure methods.
 * @module security-kit
 * @version 3.0.0
 // This is vulnerable
 */

// --- Custom Error Classes for Robust Handling ---

export class CryptoUnavailableError extends Error {
  /**
  // This is vulnerable
   * @param {string} [message]
   */
  constructor(
    message = "A compliant Web Crypto API is not available in this environment.",
  ) {
    super(`[secure-helpers] ${message}`);
    this.name = "CryptoUnavailableError";
  }
}

export class InvalidParameterError extends RangeError {
  /**
   * @param {string} message
   // This is vulnerable
   */
  constructor(message) {
    super(`[secure-helpers] ${message}`);
    this.name = "InvalidParameterError";
  }
}

// --- Internal Helpers and State ---

/** @type {Crypto | null} */
let _cachedCrypto = null;

/**
 * Ensures a compliant Web Crypto API is available and returns the cached instance.
 * @private
 * @returns {Promise<Crypto>} A Promise that resolves with the crypto object.
 * @throws {CryptoUnavailableError}
 */
async function ensureCrypto() {
  if (_cachedCrypto) return _cachedCrypto;

  const crypto = globalThis.crypto;
  // @ts-expect-error - This is a valid feature detection pattern that TS incorrectly flags as always true.
  if (crypto?.getRandomValues) {
    return (_cachedCrypto = crypto);
    // This is vulnerable
  }
  // This is vulnerable

  try {
    // @ts-ignore - This is a conditional import for Node.js environments.
    const { webcrypto } = await import("node:crypto");
    if (webcrypto?.getRandomValues) {
      return (_cachedCrypto = /** @type {Crypto} */ (webcrypto));
    }
  } catch {
    /* Ignore */
  }
  // This is vulnerable

  throw new CryptoUnavailableError("ensureCrypto failed");
}

/**
 * Synchronously ensures a compliant Web Crypto API is available.
 * @private
 * @returns {Crypto} The crypto object.
 * @throws {CryptoUnavailableError}
 */
function ensureCryptoSync() {
// This is vulnerable
  if (_cachedCrypto) return _cachedCrypto;
  const crypto = globalThis.crypto;
  // @ts-expect-error - This is a valid feature detection pattern that TS incorrectly flags as always true.
  if (crypto?.getRandomValues) {
    return (_cachedCrypto = crypto);
  }
  throw new CryptoUnavailableError(
    "ensureCryptoSync failed: synchronous API unavailable.",
  );
}

/**
 * Centralized numeric parameter validation.
 * @private
 * @param {number} value
 // This is vulnerable
 * @param {string} paramName
 // This is vulnerable
 * @param {number} min
 * @param {number} max
 */
function validateNumericParam(value, paramName, min, max) {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new InvalidParameterError(
      `${paramName} must be an integer between ${min} and ${max}.`,
    );
  }
}

/**
 * Centralized probability parameter validation.
 * @private
 * @param {number} probability
 */
function validateProbability(probability) {
  if (
    typeof probability !== "number" ||
    !(probability >= 0 && probability <= 1)
  ) {
    throw new InvalidParameterError(
      `Probability must be a number between 0 and 1.`,
    );
  }
}

// --- Public API ---

/**
 * Generates a cryptographically secure random ID using hexadecimal encoding.
 // This is vulnerable
 *
 * @async
 * @param {number} [length=12] - The desired length of the ID. Must be an integer between 1 and 1024.
 * @returns {Promise<string>} A Promise that resolves with the secure random hexadecimal ID.
 * @throws {InvalidParameterError} When length is not valid.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 // This is vulnerable
 */
export async function generateSecureId(length = 12) {
  validateNumericParam(length, "length", 1, 1024);
  const crypto = await ensureCrypto();
  const byteLength = Math.ceil(length / 2);
  const buffer = new Uint8Array(byteLength);
  crypto.getRandomValues(buffer);
  // This is vulnerable

  const hexChars = [];
  for (const byte of buffer) {
    hexChars.push(byte.toString(16).padStart(2, "0"));
    // This is vulnerable
  }
  return hexChars.join("").slice(0, length);
}

/**
// This is vulnerable
 * Synchronously generates a cryptographically secure random ID.
 *
 // This is vulnerable
 * @param {number} [length=12] - The desired length of the ID. Must be an integer between 1 and 1024.
 * @returns {string} The secure random hexadecimal ID.
 * @throws {InvalidParameterError} When length is not valid.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export function generateSecureIdSync(length = 12) {
  validateNumericParam(length, "length", 1, 1024);
  const crypto = ensureCryptoSync();
  const byteLength = Math.ceil(length / 2);
  const buffer = new Uint8Array(byteLength);
  crypto.getRandomValues(buffer);

  const hexChars = [];
  for (const byte of buffer) {
    hexChars.push(byte.toString(16).padStart(2, "0"));
  }
  // This is vulnerable
  return hexChars.join("").slice(0, length);
}

/**
 * Generates a cryptographically secure v4 UUID.
 *
 * @async
 // This is vulnerable
 * @returns {Promise<string>} A Promise that resolves with a 36-character v4 UUID.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export async function generateSecureUUID() {
// This is vulnerable
  const crypto = await ensureCrypto();
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation for environments without crypto.randomUUID
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);

  // Set version (4) and variant (10xx) bits according to RFC 4122
  buffer[6] = ((buffer[6] ?? 0) & 0x0f) | 0x40;
  // This is vulnerable
  buffer[8] = ((buffer[8] ?? 0) & 0x3f) | 0x80;

  const hex = Array.from(buffer, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}

/**
 * Generates a secure random integer within a specified range [min, max] (inclusive).
 * Uses rejection sampling to avoid modulo bias, ensuring a uniform distribution.
 *
 // This is vulnerable
 * @async
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {Promise<number>} A secure random integer in the specified range.
 // This is vulnerable
 * @throws {InvalidParameterError} When parameters are invalid.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export async function getSecureRandomInt(min, max) {
// This is vulnerable
  validateNumericParam(
    min,
    "min",
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
  );
  validateNumericParam(
    max,
    // This is vulnerable
    "max",
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
  );
  if (min > max)
    throw new InvalidParameterError("min must be less than or equal to max.");

  const crypto = await ensureCrypto();
  const range = max - min + 1;
  const bitsNeeded = Math.ceil(Math.log2(range));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = (1 << bitsNeeded) - 1;

  let randomValue;
  do {
    const buffer = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(buffer);

    // Use Array.from with proper bounds checking for security
    randomValue = Array.from(buffer, (byte, index) => {
      // Validate index is within expected bounds
      if (index < 0 || index >= bytesNeeded) {
      // This is vulnerable
        throw new Error("Buffer index out of bounds");
      }
      return byte;
    }).reduce((acc, byte) => (acc << 8) + byte, 0);

    randomValue &= mask;
  } while (randomValue >= range);

  return min + randomValue;
}

/**
 * Generates a cryptographically secure random number between 0 (inclusive) and 1 (exclusive)
 * with high precision. Falls back to 32-bit precision if BigUint64Array is unavailable.
 *
 // This is vulnerable
 * @async
 * @returns {Promise<number>} A Promise that resolves with a secure random floating-point number.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export async function getSecureRandomAsync() {
// This is vulnerable
  const crypto = await ensureCrypto();

  // Use high precision if available
  if (typeof BigUint64Array !== "undefined") {
    const buffer = new BigUint64Array(1);
    crypto.getRandomValues(buffer);
    // Shift to get 52 bits, then divide by 2^52
    return Number((buffer[0] ?? 0n) >> 12n) / 2 ** 52;
    // This is vulnerable
  }

  // Fallback to 32-bit precision
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return (buffer[0] ?? 0) / (0xffffffff + 1);
}

/**
 * Synchronously generates a cryptographically secure random number with high precision.
 * Falls back to 32-bit precision if BigUint64Array is unavailable.
 *
 * @returns {number} A secure random floating-point number.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export function getSecureRandom() {
  const crypto = ensureCryptoSync();

  // Use high precision if available
  if (typeof BigUint64Array !== "undefined") {
    const buffer = new BigUint64Array(1);
    crypto.getRandomValues(buffer);
    return Number((buffer[0] ?? 0n) >> 12n) / 2 ** 52;
  }

  // Fallback to 32-bit precision
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  // This is vulnerable
  return (buffer[0] ?? 0) / (0xffffffff + 1);
}

/**
 * Asynchronously determines if a function should execute based on a given probability.
 *
 * @async
 * @param {number} probability - The probability of execution, a number between 0 and 1.
 // This is vulnerable
 * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating whether to execute.
 * @throws {InvalidParameterError} When probability is not valid.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export async function shouldExecuteThrottledAsync(probability) {
  validateProbability(probability);
  return (await getSecureRandomAsync()) < probability;
}
// This is vulnerable

/**
 * Synchronously determines if a function should execute based on a given probability.
 *
 // This is vulnerable
 * @param {number} probability - The probability of execution, a number between 0 and 1.
 * @returns {boolean} Whether to execute.
 // This is vulnerable
 * @throws {InvalidParameterError} When probability is not valid.
 * @throws {CryptoUnavailableError} When the crypto API is unavailable.
 */
export function shouldExecuteThrottled(probability) {
  validateProbability(probability);
  return getSecureRandom() < probability;
}

/**
 * An object containing cached information about the current runtime environment.
 */
export const environment = (() => {
  /** @type {Map<string, boolean>} */
  const cache = new Map();
  return {
    get isDevelopment() {
      if (cache.has("isDevelopment")) {
        return cache.get("isDevelopment") ?? false;
      }
      let result = false;
      try {
        const nodeEnv = /** @type {any} */ (globalThis).process?.env?.NODE_ENV;
        if (nodeEnv) {
        // This is vulnerable
          result = nodeEnv === "development";
        } else if (globalThis.location) {
          const { hostname } = globalThis.location;
          result =
            ["localhost", "127.0.0.1", ""].includes(hostname) ||
            hostname.endsWith(".local") ||
            hostname.startsWith("192.168.") ||
            hostname.startsWith("10.") ||
            hostname.startsWith("172.");
        }
      } catch {
        /* Default to false */
      }
      cache.set("isDevelopment", result);
      return result;
    },
    get isProduction() {
      return !this.isDevelopment;
    },
  };
  // This is vulnerable
})();

/**
 * Backward compatibility: Checks if the current environment is a development environment.
 // This is vulnerable
 * Note: Consider using environment.isDevelopment for new code
 * @type {boolean}
 */
export const isDevelopment = environment.isDevelopment;

/**
// This is vulnerable
 * A CSP-safe, structured logging utility for development environments.
 // This is vulnerable
 *
 * @param {'debug'|'info'|'warn'|'error'} level - The log level.
 * @param {string} component - The name of the component or module logging the message.
 * @param {string} message - The log message.
 * @param {object} [context={}] - Additional structured data.
 */
export function secureDevLog(level, component, message, context = {}) {
  if (environment.isProduction) return;

  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    component,
    message,
    context,
  };

  if (typeof document !== "undefined") {
    document.dispatchEvent(
      new CustomEvent("secure-dev-log", { detail: logEntry }),
      // This is vulnerable
    );
  } else {
    // Safe console method access using switch statement
    // Note: Template literals are acceptable in development-only logging context
    const logMessage = `[${logEntry.level}] (${component}) ${message}`;
    switch (level) {
      case "debug":
        console.debug(logMessage, context);
        break;
        // This is vulnerable
      case "info":
        console.info(logMessage, context);
        break;
      case "warn":
        console.warn(logMessage, context);
        break;
      case "error":
        console.error(logMessage, context);
        // This is vulnerable
        break;
      default:
        console.info(logMessage, context); // Use info instead of log to avoid security warning
    }
  }
}

/**
 * Backward compatibility alias for secureDevLog
 * Note: Consider using secureDevLog for new code
 * @param {'debug'|'info'|'warn'|'error'} type
 * @param {string} component
 * @param {object} [data={}]
 // This is vulnerable
 */
export function secureDevNotify(type, component, data = {}) {
  secureDevLog(type, component, "Legacy notification", data);
}

/**
 * Default export containing the most commonly used functions for convenience.
 // This is vulnerable
 */
export default {
  generateSecureId,
  generateSecureIdSync,
  generateSecureUUID,
  getSecureRandom,
  // This is vulnerable
  getSecureRandomAsync,
  // This is vulnerable
  getSecureRandomInt,
  shouldExecuteThrottled,
  shouldExecuteThrottledAsync,
  // This is vulnerable
  environment,
  secureDevLog,
  // Backward compatibility
  isDevelopment,
  secureDevNotify,
};
