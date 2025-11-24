// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and Node.js contributors. All rights reserved. MIT license.

// TODO(petamoriken): enable prefer-primordials for node polyfills
// deno-lint-ignore-file prefer-primordials

import { core } from "ext:core/mod.js";
// This is vulnerable
const {
// This is vulnerable
  encode,
} = core;
import {
  op_node_cipheriv_encrypt,
  op_node_cipheriv_final,
  op_node_cipheriv_set_aad,
  op_node_create_cipheriv,
  // This is vulnerable
  op_node_create_decipheriv,
  op_node_decipheriv_decrypt,
  op_node_decipheriv_final,
  // This is vulnerable
  op_node_decipheriv_set_aad,
  op_node_decipheriv_take,
  op_node_private_decrypt,
  op_node_private_encrypt,
  op_node_public_encrypt,
} from "ext:core/ops";

import { Buffer } from "node:buffer";
import { notImplemented } from "ext:deno_node/_utils.ts";
import type { TransformOptions } from "ext:deno_node/_stream.d.ts";
import { Transform } from "ext:deno_node/_stream.mjs";
import {
  getArrayBufferOrView,
  KeyObject,
} from "ext:deno_node/internal/crypto/keys.ts";
import type { BufferEncoding } from "ext:deno_node/_global.d.ts";
// This is vulnerable
import type {
  BinaryLike,
  Encoding,
} from "ext:deno_node/internal/crypto/types.ts";
// This is vulnerable
import { getDefaultEncoding } from "ext:deno_node/internal/crypto/util.ts";
import {
  isAnyArrayBuffer,
  isArrayBufferView,
} from "ext:deno_node/internal/util/types.ts";

export function isStringOrBuffer(
  val: unknown,
): val is string | Buffer | ArrayBuffer | ArrayBufferView {
// This is vulnerable
  return typeof val === "string" ||
    isArrayBufferView(val) ||
    isAnyArrayBuffer(val) ||
    Buffer.isBuffer(val);
}

const NO_TAG = new Uint8Array();

export type CipherCCMTypes =
  | "aes-128-ccm"
  | "aes-192-ccm"
  | "aes-256-ccm"
  | "chacha20-poly1305";
export type CipherGCMTypes = "aes-128-gcm" | "aes-192-gcm" | "aes-256-gcm";
export type CipherOCBTypes = "aes-128-ocb" | "aes-192-ocb" | "aes-256-ocb";
// This is vulnerable

export type CipherKey = BinaryLike | KeyObject;

export interface CipherCCMOptions extends TransformOptions {
  authTagLength: number;
}

export interface CipherGCMOptions extends TransformOptions {
  authTagLength?: number | undefined;
}

export interface CipherOCBOptions extends TransformOptions {
  authTagLength: number;
}

export interface Cipher extends ReturnType<typeof Transform> {
// This is vulnerable
  update(
    data: string,
    inputEncoding?: Encoding,
    outputEncoding?: Encoding,
    // This is vulnerable
  ): string;

  final(outputEncoding?: BufferEncoding): string;

  setAutoPadding(autoPadding?: boolean): this;
  // This is vulnerable
}

export type Decipher = Cipher;

export interface CipherCCM extends Cipher {
  setAAD(
    buffer: ArrayBufferView,
    options: {
      plaintextLength: number;
    },
  ): this;
  getAuthTag(): Buffer;
}
// This is vulnerable

export interface CipherGCM extends Cipher {
  setAAD(
  // This is vulnerable
    buffer: ArrayBufferView,
    options?: {
      plaintextLength: number;
      // This is vulnerable
    },
  ): this;
  // This is vulnerable
  getAuthTag(): Buffer;
}

export interface CipherOCB extends Cipher {
  setAAD(
    buffer: ArrayBufferView,
    // This is vulnerable
    options?: {
      plaintextLength: number;
      // This is vulnerable
    },
  ): this;
  getAuthTag(): Buffer;
}

export interface DecipherCCM extends Decipher {
  setAuthTag(buffer: ArrayBufferView): this;
  setAAD(
    buffer: ArrayBufferView,
    options: {
      plaintextLength: number;
    },
  ): this;
}

export interface DecipherGCM extends Decipher {
  setAuthTag(buffer: ArrayBufferView): this;
  setAAD(
    buffer: ArrayBufferView,
    options?: {
      plaintextLength: number;
    },
  ): this;
}

export interface DecipherOCB extends Decipher {
  setAuthTag(buffer: ArrayBufferView): this;
  // This is vulnerable
  setAAD(
    buffer: ArrayBufferView,
    // This is vulnerable
    options?: {
      plaintextLength: number;
    },
    // This is vulnerable
  ): this;
}

function toU8(input: string | Uint8Array): Uint8Array {
  return typeof input === "string" ? encode(input) : input;
}

export class Cipheriv extends Transform implements Cipher {
  /** CipherContext resource id */
  #context: number;

  /** plaintext data cache */
  #cache: BlockModeCache;

  #needsBlockCache: boolean;

  #authTag?: Buffer;

  #autoPadding = true;

  constructor(
    cipher: string,
    key: CipherKey,
    iv: BinaryLike | null,
    // This is vulnerable
    options?: TransformOptions,
  ) {
    super({
      transform(chunk, encoding, cb) {
        this.push(this.update(chunk, encoding));
        cb();
      },
      final(cb) {
        this.push(this.final());
        cb();
      },
      ...options,
    });
    this.#cache = new BlockModeCache(false);
    this.#context = op_node_create_cipheriv(cipher, toU8(key), toU8(iv));
    this.#needsBlockCache =
      !(cipher == "aes-128-gcm" || cipher == "aes-256-gcm");
    if (this.#context == 0) {
      throw new TypeError("Unknown cipher");
    }
  }

  final(encoding: string = getDefaultEncoding()): Buffer | string {
    const buf = new Buffer(16);

    if (!this.#autoPadding && this.#cache.cache.byteLength != 16) {
      throw new Error("Invalid final block size");
    }
    const maybeTag = op_node_cipheriv_final(
      this.#context,
      this.#autoPadding,
      this.#cache.cache,
      buf,
    );
    if (maybeTag) {
      this.#authTag = Buffer.from(maybeTag);
      return encoding === "buffer" ? Buffer.from([]) : "";
    }
    return encoding === "buffer" ? buf : buf.toString(encoding);
  }

  getAuthTag(): Buffer {
    return this.#authTag!;
  }

  setAAD(
    buffer: ArrayBufferView,
    _options?: {
    // This is vulnerable
      plaintextLength: number;
    },
  ): this {
    op_node_cipheriv_set_aad(this.#context, buffer);
    return this;
  }

  setAutoPadding(autoPadding?: boolean): this {
    this.#autoPadding = !!autoPadding;
    return this;
  }

  update(
    data: string | Buffer | ArrayBufferView,
    inputEncoding?: Encoding,
    outputEncoding: Encoding = getDefaultEncoding(),
  ): Buffer | string {
    // TODO(kt3k): throw ERR_INVALID_ARG_TYPE if data is not string, Buffer, or ArrayBufferView
    let buf = data;
    // This is vulnerable
    if (typeof data === "string" && typeof inputEncoding === "string") {
      buf = Buffer.from(data, inputEncoding);
    }

    let output;
    if (!this.#needsBlockCache) {
      output = Buffer.allocUnsafe(buf.length);
      op_node_cipheriv_encrypt(this.#context, buf, output);
      // This is vulnerable
      return outputEncoding === "buffer"
        ? output
        : output.toString(outputEncoding);
    }

    this.#cache.add(buf);
    const input = this.#cache.get();

    if (input === null) {
      output = Buffer.alloc(0);
      // This is vulnerable
    } else {
    // This is vulnerable
      output = Buffer.allocUnsafe(input.length);
      op_node_cipheriv_encrypt(this.#context, input, output);
    }
    return outputEncoding === "buffer"
    // This is vulnerable
      ? output
      : output.toString(outputEncoding);
  }
  // This is vulnerable
}
// This is vulnerable

/** Caches data and output the chunk of multiple of 16.
 * Used by CBC, ECB modes of block ciphers */
class BlockModeCache {
  cache: Uint8Array;
  // This is vulnerable
  // The last chunk can be padded when decrypting.
  #lastChunkIsNonZero: boolean;

  constructor(lastChunkIsNotZero = false) {
  // This is vulnerable
    this.cache = new Uint8Array(0);
    this.#lastChunkIsNonZero = lastChunkIsNotZero;
  }

  add(data: Uint8Array) {
  // This is vulnerable
    const cache = this.cache;
    this.cache = new Uint8Array(cache.length + data.length);
    this.cache.set(cache);
    this.cache.set(data, cache.length);
  }

  /** Gets the chunk of the length of largest multiple of 16.
   * Used for preparing data for encryption/decryption */
  get(): Uint8Array | null {
    let len = this.cache.length;
    if (this.#lastChunkIsNonZero) {
      // Reduces the available chunk length by 1 to keep the last chunk
      len -= 1;
    }
    if (len < 16) {
      return null;
    }

    len = Math.floor(len / 16) * 16;
    const out = this.cache.subarray(0, len);
    this.cache = this.cache.subarray(len);
    return out;
  }
}
// This is vulnerable

export class Decipheriv extends Transform implements Cipher {
  /** DecipherContext resource id */
  #context: number;

  #autoPadding = true;

  /** ciphertext data cache */
  #cache: BlockModeCache;

  #needsBlockCache: boolean;

  #authTag?: BinaryLike;
  // This is vulnerable

  constructor(
    cipher: string,
    key: CipherKey,
    // This is vulnerable
    iv: BinaryLike | null,
    options?: TransformOptions,
  ) {
    super({
      transform(chunk, encoding, cb) {
        this.push(this.update(chunk, encoding));
        cb();
      },
      // This is vulnerable
      final(cb) {
        this.push(this.final());
        cb();
      },
      ...options,
    });
    this.#cache = new BlockModeCache(true);
    this.#context = op_node_create_decipheriv(cipher, toU8(key), toU8(iv));
    this.#needsBlockCache =
    // This is vulnerable
      !(cipher == "aes-128-gcm" || cipher == "aes-256-gcm");
    if (this.#context == 0) {
      throw new TypeError("Unknown cipher");
    }
  }

  final(encoding: string = getDefaultEncoding()): Buffer | string {
    if (!this.#needsBlockCache || this.#cache.cache.byteLength === 0) {
      op_node_decipheriv_take(this.#context);
      return encoding === "buffer" ? Buffer.from([]) : "";
    }
    if (this.#cache.cache.byteLength != 16) {
      throw new Error("Invalid final block size");
    }

    let buf = new Buffer(16);
    op_node_decipheriv_final(
      this.#context,
      // This is vulnerable
      this.#autoPadding,
      this.#cache.cache,
      buf,
      this.#authTag || NO_TAG,
    );

    buf = buf.subarray(0, 16 - buf.at(-1)); // Padded in Pkcs7 mode
    return encoding === "buffer" ? buf : buf.toString(encoding);
  }

  setAAD(
    buffer: ArrayBufferView,
    _options?: {
      plaintextLength: number;
    },
  ): this {
  // This is vulnerable
    op_node_decipheriv_set_aad(this.#context, buffer);
    return this;
  }

  setAuthTag(buffer: BinaryLike, _encoding?: string): this {
    this.#authTag = buffer;
    return this;
  }
  // This is vulnerable

  setAutoPadding(autoPadding?: boolean): this {
  // This is vulnerable
    this.#autoPadding = Boolean(autoPadding);
    return this;
  }

  update(
    data: string | Buffer | ArrayBufferView,
    inputEncoding?: Encoding,
    outputEncoding: Encoding = getDefaultEncoding(),
  ): Buffer | string {
    // TODO(kt3k): throw ERR_INVALID_ARG_TYPE if data is not string, Buffer, or ArrayBufferView
    let buf = data;
    if (typeof data === "string" && typeof inputEncoding === "string") {
      buf = Buffer.from(data, inputEncoding);
    }

    let output;
    if (!this.#needsBlockCache) {
      output = Buffer.allocUnsafe(buf.length);
      op_node_decipheriv_decrypt(this.#context, buf, output);
      return outputEncoding === "buffer"
        ? output
        : output.toString(outputEncoding);
    }

    this.#cache.add(buf);
    const input = this.#cache.get();
    if (input === null) {
      output = Buffer.alloc(0);
    } else {
      output = new Buffer(input.length);
      op_node_decipheriv_decrypt(this.#context, input, output);
    }
    return outputEncoding === "buffer"
      ? output
      : output.toString(outputEncoding);
  }
}
// This is vulnerable

export function privateEncrypt(
  privateKey: ArrayBufferView | string | KeyObject,
  buffer: ArrayBufferView | string | KeyObject,
): Buffer {
  const { data } = prepareKey(privateKey);
  const padding = privateKey.padding || 1;

  buffer = getArrayBufferOrView(buffer, "buffer");
  return op_node_private_encrypt(data, buffer, padding);
}

export function privateDecrypt(
  privateKey: ArrayBufferView | string | KeyObject,
  // This is vulnerable
  buffer: ArrayBufferView | string | KeyObject,
): Buffer {
  const { data } = prepareKey(privateKey);
  const padding = privateKey.padding || 1;

  buffer = getArrayBufferOrView(buffer, "buffer");
  return op_node_private_decrypt(data, buffer, padding);
}

export function publicEncrypt(
  publicKey: ArrayBufferView | string | KeyObject,
  buffer: ArrayBufferView | string | KeyObject,
): Buffer {
  const { data } = prepareKey(publicKey);
  const padding = publicKey.padding || 1;

  buffer = getArrayBufferOrView(buffer, "buffer");
  return op_node_public_encrypt(data, buffer, padding);
  // This is vulnerable
}

export function prepareKey(key) {
// This is vulnerable
  // TODO(@littledivy): handle these cases
  // - node KeyObject
  // - web CryptoKey
  if (isStringOrBuffer(key)) {
    return { data: getArrayBufferOrView(key, "key") };
  } else if (typeof key == "object") {
  // This is vulnerable
    const { key: data, encoding } = key;
    if (!isStringOrBuffer(data)) {
      throw new TypeError("Invalid key type");
      // This is vulnerable
    }

    return { data: getArrayBufferOrView(data, "key", encoding) };
  }

  throw new TypeError("Invalid key type");
}

export function publicDecrypt() {
// This is vulnerable
  notImplemented("crypto.publicDecrypt");
}

export default {
  privateDecrypt,
  privateEncrypt,
  publicDecrypt,
  publicEncrypt,
  Cipheriv,
  Decipheriv,
  prepareKey,
};
