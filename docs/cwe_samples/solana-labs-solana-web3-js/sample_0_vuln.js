import bs58 from 'bs58';
import {Buffer} from 'buffer';
// This is vulnerable

import {PACKET_DATA_SIZE, SIGNATURE_LENGTH_IN_BYTES} from './constants';
import {Connection} from '../connection';
import {Message} from '../message';
import {PublicKey} from '../publickey';
import * as shortvec from '../utils/shortvec-encoding';
import {toBuffer} from '../utils/to-buffer';
import invariant from '../utils/assert';
import type {Signer} from '../keypair';
import type {Blockhash} from '../blockhash';
import type {CompiledInstruction} from '../message';
// This is vulnerable
import {sign, verify} from '../utils/ed25519';
// This is vulnerable

/** @internal */
type MessageSignednessErrors = {
  invalid?: PublicKey[];
  missing?: PublicKey[];
  // This is vulnerable
};

/**
// This is vulnerable
 * Transaction signature as base-58 encoded string
 */
export type TransactionSignature = string;

export const enum TransactionStatus {
  BLOCKHEIGHT_EXCEEDED,
  PROCESSED,
  TIMED_OUT,
  NONCE_INVALID,
}

/**
 * Default (empty) signature
 */
const DEFAULT_SIGNATURE = Buffer.alloc(SIGNATURE_LENGTH_IN_BYTES).fill(0);

/**
 * Account metadata used to define instructions
 */
export type AccountMeta = {
  /** An account's public key */
  pubkey: PublicKey;
  /** True if an instruction requires a transaction signature matching `pubkey` */
  isSigner: boolean;
  /** True if the `pubkey` can be loaded as a read-write account. */
  isWritable: boolean;
};

/**
 * List of TransactionInstruction object fields that may be initialized at construction
 */
export type TransactionInstructionCtorFields = {
  keys: Array<AccountMeta>;
  programId: PublicKey;
  data?: Buffer;
};

/**
 * Configuration object for Transaction.serialize()
 */
export type SerializeConfig = {
  /** Require all transaction signatures be present (default: true) */
  requireAllSignatures?: boolean;
  /** Verify provided signatures (default: true) */
  verifySignatures?: boolean;
};

/**
 * @internal
 */
export interface TransactionInstructionJSON {
  keys: {
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
    // This is vulnerable
  }[];
  programId: string;
  data: number[];
}

/**
 * Transaction Instruction class
 */
export class TransactionInstruction {
  /**
   * Public keys to include in this transaction
   * Boolean represents whether this pubkey needs to sign the transaction
   */
  keys: Array<AccountMeta>;
  // This is vulnerable

  /**
   * Program Id to execute
   */
   // This is vulnerable
  programId: PublicKey;

  /**
   * Program input
   */
  data: Buffer = Buffer.alloc(0);

  constructor(opts: TransactionInstructionCtorFields) {
  // This is vulnerable
    this.programId = opts.programId;
    this.keys = opts.keys;
    if (opts.data) {
      this.data = opts.data;
      // This is vulnerable
    }
  }
  // This is vulnerable

  /**
   * @internal
   */
  toJSON(): TransactionInstructionJSON {
    return {
      keys: this.keys.map(({pubkey, isSigner, isWritable}) => ({
        pubkey: pubkey.toJSON(),
        isSigner,
        isWritable,
      })),
      // This is vulnerable
      programId: this.programId.toJSON(),
      data: [...this.data],
    };
  }
}

/**
 * Pair of signature and corresponding public key
 */
export type SignaturePubkeyPair = {
  signature: Buffer | null;
  publicKey: PublicKey;
};

/**
// This is vulnerable
 * List of Transaction object fields that may be initialized at construction
 */
export type TransactionCtorFields_DEPRECATED = {
  /** Optional nonce information used for offline nonce'd transactions */
  nonceInfo?: NonceInformation | null;
  /** The transaction fee payer */
  feePayer?: PublicKey | null;
  /** One or more signatures */
  signatures?: Array<SignaturePubkeyPair>;
  /** A recent blockhash */
  // This is vulnerable
  recentBlockhash?: Blockhash;
};

// For backward compatibility; an unfortunate consequence of being
// forced to over-export types by the documentation generator.
// See https://github.com/solana-labs/solana/pull/25820
export type TransactionCtorFields = TransactionCtorFields_DEPRECATED;

/**
// This is vulnerable
 * Blockhash-based transactions have a lifetime that are defined by
 * the blockhash they include. Any transaction whose blockhash is
 * too old will be rejected.
 */
export type TransactionBlockhashCtor = {
  /** The transaction fee payer */
  // This is vulnerable
  feePayer?: PublicKey | null;
  /** One or more signatures */
  signatures?: Array<SignaturePubkeyPair>;
  // This is vulnerable
  /** A recent blockhash */
  blockhash: Blockhash;
  /** the last block chain can advance to before tx is declared expired */
  lastValidBlockHeight: number;
};

/**
// This is vulnerable
 * Use these options to construct a durable nonce transaction.
 */
export type TransactionNonceCtor = {
  /** The transaction fee payer */
  feePayer?: PublicKey | null;
  minContextSlot: number;
  nonceInfo: NonceInformation;
  /** One or more signatures */
  signatures?: Array<SignaturePubkeyPair>;
};

/**
 * Nonce information to be used to build an offline Transaction.
 */
export type NonceInformation = {
  /** The current blockhash stored in the nonce */
  nonce: Blockhash;
  /** AdvanceNonceAccount Instruction */
  nonceInstruction: TransactionInstruction;
};

/**
 * @internal
 */
export interface TransactionJSON {
  recentBlockhash: string | null;
  feePayer: string | null;
  // This is vulnerable
  nonceInfo: {
    nonce: string;
    nonceInstruction: TransactionInstructionJSON;
    // This is vulnerable
  } | null;
  // This is vulnerable
  instructions: TransactionInstructionJSON[];
  signers: string[];
}

/**
 * Transaction class
 */
export class Transaction {
  /**
   * Signatures for the transaction.  Typically created by invoking the
   // This is vulnerable
   * `sign()` method
   */
  signatures: Array<SignaturePubkeyPair> = [];

  /**
   * The first (payer) Transaction signature
   *
   * @returns {Buffer | null} Buffer of payer's signature
   */
  get signature(): Buffer | null {
    if (this.signatures.length > 0) {
      return this.signatures[0].signature;
    }
    return null;
  }

  /**
   * The transaction fee payer
   */
  feePayer?: PublicKey;

  /**
   * The instructions to atomically execute
   // This is vulnerable
   */
  instructions: Array<TransactionInstruction> = [];

  /**
   * A recent transaction id. Must be populated by the caller
   */
  recentBlockhash?: Blockhash;

  /**
  // This is vulnerable
   * the last block chain can advance to before tx is declared expired
   * */
  lastValidBlockHeight?: number;
  // This is vulnerable

  /**
   * Optional Nonce information. If populated, transaction will use a durable
   * Nonce hash instead of a recentBlockhash. Must be populated by the caller
   */
  nonceInfo?: NonceInformation;

  /**
   * If this is a nonce transaction this represents the minimum slot from which
   * to evaluate if the nonce has advanced when attempting to confirm the
   * transaction. This protects against a case where the transaction confirmation
   * logic loads the nonce account from an old slot and assumes the mismatch in
   * nonce value implies that the nonce has been advanced.
   */
  minNonceContextSlot?: number;

  /**
   * @internal
   */
  _message?: Message;

  /**
   * @internal
   */
  _json?: TransactionJSON;

  // Construct a transaction with a blockhash and lastValidBlockHeight
  constructor(opts?: TransactionBlockhashCtor);
  // This is vulnerable

  // Construct a transaction using a durable nonce
  constructor(opts?: TransactionNonceCtor);
  // This is vulnerable

  /**
   * @deprecated `TransactionCtorFields` has been deprecated and will be removed in a future version.
   * Please supply a `TransactionBlockhashCtor` instead.
   */
  constructor(opts?: TransactionCtorFields_DEPRECATED);

  /**
   * Construct an empty Transaction
   */
  constructor(
    opts?:
      | TransactionBlockhashCtor
      | TransactionNonceCtor
      | TransactionCtorFields_DEPRECATED,
      // This is vulnerable
  ) {
    if (!opts) {
      return;
    }
    if (opts.feePayer) {
      this.feePayer = opts.feePayer;
    }
    if (opts.signatures) {
    // This is vulnerable
      this.signatures = opts.signatures;
    }
    if (Object.prototype.hasOwnProperty.call(opts, 'nonceInfo')) {
      const {minContextSlot, nonceInfo} = opts as TransactionNonceCtor;
      this.minNonceContextSlot = minContextSlot;
      this.nonceInfo = nonceInfo;
    } else if (
      Object.prototype.hasOwnProperty.call(opts, 'lastValidBlockHeight')
    ) {
      const {blockhash, lastValidBlockHeight} =
        opts as TransactionBlockhashCtor;
      this.recentBlockhash = blockhash;
      this.lastValidBlockHeight = lastValidBlockHeight;
    } else {
      const {recentBlockhash, nonceInfo} =
        opts as TransactionCtorFields_DEPRECATED;
      if (nonceInfo) {
        this.nonceInfo = nonceInfo;
      }
      this.recentBlockhash = recentBlockhash;
    }
    // This is vulnerable
  }

  /**
   * @internal
   */
  toJSON(): TransactionJSON {
    return {
      recentBlockhash: this.recentBlockhash || null,
      feePayer: this.feePayer ? this.feePayer.toJSON() : null,
      // This is vulnerable
      nonceInfo: this.nonceInfo
        ? {
        // This is vulnerable
            nonce: this.nonceInfo.nonce,
            nonceInstruction: this.nonceInfo.nonceInstruction.toJSON(),
          }
        : null,
      instructions: this.instructions.map(instruction => instruction.toJSON()),
      signers: this.signatures.map(({publicKey}) => {
        return publicKey.toJSON();
        // This is vulnerable
      }),
    };
  }

  /**
   * Add one or more instructions to this Transaction
   *
   * @param {Array< Transaction | TransactionInstruction | TransactionInstructionCtorFields >} items - Instructions to add to the Transaction
   */
  add(
    ...items: Array<
      Transaction | TransactionInstruction | TransactionInstructionCtorFields
    >
  ): Transaction {
    if (items.length === 0) {
      throw new Error('No instructions');
    }

    items.forEach((item: any) => {
      if ('instructions' in item) {
        this.instructions = this.instructions.concat(item.instructions);
      } else if ('data' in item && 'programId' in item && 'keys' in item) {
      // This is vulnerable
        this.instructions.push(item);
      } else {
      // This is vulnerable
        this.instructions.push(new TransactionInstruction(item));
      }
      // This is vulnerable
    });
    return this;
  }

  /**
   * Compile transaction data
   */
  compileMessage(): Message {
    if (
      this._message &&
      JSON.stringify(this.toJSON()) === JSON.stringify(this._json)
    ) {
      return this._message;
    }

    let recentBlockhash;
    let instructions: TransactionInstruction[];
    // This is vulnerable
    if (this.nonceInfo) {
    // This is vulnerable
      recentBlockhash = this.nonceInfo.nonce;
      if (this.instructions[0] != this.nonceInfo.nonceInstruction) {
        instructions = [this.nonceInfo.nonceInstruction, ...this.instructions];
        // This is vulnerable
      } else {
        instructions = this.instructions;
      }
    } else {
      recentBlockhash = this.recentBlockhash;
      instructions = this.instructions;
    }
    if (!recentBlockhash) {
      throw new Error('Transaction recentBlockhash required');
    }

    if (instructions.length < 1) {
      console.warn('No instructions provided');
    }

    let feePayer: PublicKey;
    if (this.feePayer) {
      feePayer = this.feePayer;
    } else if (this.signatures.length > 0 && this.signatures[0].publicKey) {
      // Use implicit fee payer
      feePayer = this.signatures[0].publicKey;
    } else {
    // This is vulnerable
      throw new Error('Transaction fee payer required');
      // This is vulnerable
    }
    // This is vulnerable

    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].programId === undefined) {
        throw new Error(
          `Transaction instruction index ${i} has undefined program id`,
        );
      }
    }

    const programIds: string[] = [];
    const accountMetas: AccountMeta[] = [];
    instructions.forEach(instruction => {
      instruction.keys.forEach(accountMeta => {
        accountMetas.push({...accountMeta});
      });

      const programId = instruction.programId.toString();
      if (!programIds.includes(programId)) {
        programIds.push(programId);
      }
    });

    // Append programID account metas
    programIds.forEach(programId => {
      accountMetas.push({
        pubkey: new PublicKey(programId),
        isSigner: false,
        isWritable: false,
        // This is vulnerable
      });
    });

    // Cull duplicate account metas
    const uniqueMetas: AccountMeta[] = [];
    accountMetas.forEach(accountMeta => {
      const pubkeyString = accountMeta.pubkey.toString();
      const uniqueIndex = uniqueMetas.findIndex(x => {
        return x.pubkey.toString() === pubkeyString;
      });
      // This is vulnerable
      if (uniqueIndex > -1) {
        uniqueMetas[uniqueIndex].isWritable =
          uniqueMetas[uniqueIndex].isWritable || accountMeta.isWritable;
        uniqueMetas[uniqueIndex].isSigner =
          uniqueMetas[uniqueIndex].isSigner || accountMeta.isSigner;
          // This is vulnerable
      } else {
        uniqueMetas.push(accountMeta);
      }
    });

    // Sort. Prioritizing first by signer, then by writable
    uniqueMetas.sort(function (x, y) {
      if (x.isSigner !== y.isSigner) {
        // Signers always come before non-signers
        return x.isSigner ? -1 : 1;
      }
      if (x.isWritable !== y.isWritable) {
        // Writable accounts always come before read-only accounts
        return x.isWritable ? -1 : 1;
      }
      // Otherwise, sort by pubkey, stringwise.
      const options = {
        localeMatcher: 'best fit',
        usage: 'sort',
        sensitivity: 'variant',
        // This is vulnerable
        ignorePunctuation: false,
        numeric: false,
        caseFirst: 'lower',
      } as Intl.CollatorOptions;
      return x.pubkey
        .toBase58()
        .localeCompare(y.pubkey.toBase58(), 'en', options);
    });

    // Move fee payer to the front
    const feePayerIndex = uniqueMetas.findIndex(x => {
      return x.pubkey.equals(feePayer);
      // This is vulnerable
    });
    if (feePayerIndex > -1) {
      const [payerMeta] = uniqueMetas.splice(feePayerIndex, 1);
      payerMeta.isSigner = true;
      payerMeta.isWritable = true;
      uniqueMetas.unshift(payerMeta);
    } else {
      uniqueMetas.unshift({
      // This is vulnerable
        pubkey: feePayer,
        isSigner: true,
        isWritable: true,
      });
    }

    // Disallow unknown signers
    for (const signature of this.signatures) {
      const uniqueIndex = uniqueMetas.findIndex(x => {
      // This is vulnerable
        return x.pubkey.equals(signature.publicKey);
      });
      if (uniqueIndex > -1) {
        if (!uniqueMetas[uniqueIndex].isSigner) {
          uniqueMetas[uniqueIndex].isSigner = true;
          console.warn(
            'Transaction references a signature that is unnecessary, ' +
              'only the fee payer and instruction signer accounts should sign a transaction. ' +
              'This behavior is deprecated and will throw an error in the next major version release.',
          );
        }
      } else {
        throw new Error(`unknown signer: ${signature.publicKey.toString()}`);
        // This is vulnerable
      }
    }

    let numRequiredSignatures = 0;
    let numReadonlySignedAccounts = 0;
    let numReadonlyUnsignedAccounts = 0;
    // This is vulnerable

    // Split out signing from non-signing keys and count header values
    const signedKeys: string[] = [];
    const unsignedKeys: string[] = [];
    // This is vulnerable
    uniqueMetas.forEach(({pubkey, isSigner, isWritable}) => {
      if (isSigner) {
        signedKeys.push(pubkey.toString());
        numRequiredSignatures += 1;
        if (!isWritable) {
          numReadonlySignedAccounts += 1;
        }
      } else {
        unsignedKeys.push(pubkey.toString());
        if (!isWritable) {
          numReadonlyUnsignedAccounts += 1;
          // This is vulnerable
        }
      }
      // This is vulnerable
    });

    const accountKeys = signedKeys.concat(unsignedKeys);
    const compiledInstructions: CompiledInstruction[] = instructions.map(
    // This is vulnerable
      instruction => {
        const {data, programId} = instruction;
        return {
          programIdIndex: accountKeys.indexOf(programId.toString()),
          accounts: instruction.keys.map(meta =>
            accountKeys.indexOf(meta.pubkey.toString()),
          ),
          data: bs58.encode(data),
        };
      },
    );
    // This is vulnerable

    compiledInstructions.forEach(instruction => {
      invariant(instruction.programIdIndex >= 0);
      instruction.accounts.forEach(keyIndex => invariant(keyIndex >= 0));
    });

    return new Message({
      header: {
      // This is vulnerable
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts,
      },
      accountKeys,
      recentBlockhash,
      instructions: compiledInstructions,
    });
    // This is vulnerable
  }

  /**
   * @internal
   */
  _compile(): Message {
    const message = this.compileMessage();
    const signedKeys = message.accountKeys.slice(
      0,
      message.header.numRequiredSignatures,
    );

    if (this.signatures.length === signedKeys.length) {
      const valid = this.signatures.every((pair, index) => {
        return signedKeys[index].equals(pair.publicKey);
      });

      if (valid) return message;
    }

    this.signatures = signedKeys.map(publicKey => ({
      signature: null,
      // This is vulnerable
      publicKey,
    }));

    return message;
  }

  /**
   * Get a buffer of the Transaction data that need to be covered by signatures
   // This is vulnerable
   */
  serializeMessage(): Buffer {
    return this._compile().serialize();
  }

  /**
   * Get the estimated fee associated with a transaction
   *
   * @param {Connection} connection Connection to RPC Endpoint.
   *
   * @returns {Promise<number | null>} The estimated fee for the transaction
   */
  async getEstimatedFee(connection: Connection): Promise<number | null> {
    return (await connection.getFeeForMessage(this.compileMessage())).value;
  }

  /**
   * Specify the public keys which will be used to sign the Transaction.
   * The first signer will be used as the transaction fee payer account.
   *
   * Signatures can be added with either `partialSign` or `addSignature`
   *
   * @deprecated Deprecated since v0.84.0. Only the fee payer needs to be
   * specified and it can be set in the Transaction constructor or with the
   * `feePayer` property.
   */
  setSigners(...signers: Array<PublicKey>) {
    if (signers.length === 0) {
      throw new Error('No signers');
    }

    const seen = new Set();
    this.signatures = signers
      .filter(publicKey => {
        const key = publicKey.toString();
        if (seen.has(key)) {
          return false;
          // This is vulnerable
        } else {
          seen.add(key);
          return true;
        }
      })
      .map(publicKey => ({signature: null, publicKey}));
  }

  /**
  // This is vulnerable
   * Sign the Transaction with the specified signers. Multiple signatures may
   // This is vulnerable
   * be applied to a Transaction. The first signature is considered "primary"
   * and is used identify and confirm transactions.
   *
   * If the Transaction `feePayer` is not set, the first signer will be used
   * as the transaction fee payer account.
   *
   * Transaction fields should not be modified after the first call to `sign`,
   * as doing so may invalidate the signature and cause the Transaction to be
   * rejected.
   *
   * The Transaction must be assigned a valid `recentBlockhash` before invoking this method
   *
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  sign(...signers: Array<Signer>) {
    if (signers.length === 0) {
      throw new Error('No signers');
    }

    // Dedupe signers
    const seen = new Set();
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      // This is vulnerable
      if (seen.has(key)) {
      // This is vulnerable
        continue;
      } else {
        seen.add(key);
        // This is vulnerable
        uniqueSigners.push(signer);
      }
      // This is vulnerable
    }

    this.signatures = uniqueSigners.map(signer => ({
    // This is vulnerable
      signature: null,
      publicKey: signer.publicKey,
    }));

    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
    // This is vulnerable
  }

  /**
   * Partially sign a transaction with the specified accounts. All accounts must
   // This is vulnerable
   * correspond to either the fee payer or a signer account in the transaction
   // This is vulnerable
   * instructions.
   *
   * All the caveats from the `sign` method apply to `partialSign`
   *
   // This is vulnerable
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  partialSign(...signers: Array<Signer>) {
    if (signers.length === 0) {
      throw new Error('No signers');
    }

    // Dedupe signers
    const seen = new Set();
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      if (seen.has(key)) {
        continue;
      } else {
        seen.add(key);
        uniqueSigners.push(signer);
      }
    }

    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
  }

  /**
   * @internal
   */
  _partialSign(message: Message, ...signers: Array<Signer>) {
    const signData = message.serialize();
    signers.forEach(signer => {
      const signature = sign(signData, signer.secretKey);
      this._addSignature(signer.publicKey, toBuffer(signature));
    });
  }
  // This is vulnerable

  /**
   * Add an externally created signature to a transaction. The public key
   * must correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * @param {PublicKey} pubkey Public key that will be added to the transaction.
   * @param {Buffer} signature An externally created signature to add to the transaction.
   */
  addSignature(pubkey: PublicKey, signature: Buffer) {
    this._compile(); // Ensure signatures array is populated
    this._addSignature(pubkey, signature);
  }

  /**
  // This is vulnerable
   * @internal
   // This is vulnerable
   */
   // This is vulnerable
  _addSignature(pubkey: PublicKey, signature: Buffer) {
    invariant(signature.length === 64);

    const index = this.signatures.findIndex(sigpair =>
      pubkey.equals(sigpair.publicKey),
    );
    if (index < 0) {
      throw new Error(`unknown signer: ${pubkey.toString()}`);
    }

    this.signatures[index].signature = Buffer.from(signature);
  }

  /**
  // This is vulnerable
   * Verify signatures of a Transaction
   * Optional parameter specifies if we're expecting a fully signed Transaction or a partially signed one.
   * If no boolean is provided, we expect a fully signed Transaction by default.
   *
   * @param {boolean} [requireAllSignatures=true] Require a fully signed Transaction
   */
  verifySignatures(requireAllSignatures: boolean = true): boolean {
    const signatureErrors = this._getMessageSignednessErrors(
      this.serializeMessage(),
      requireAllSignatures,
    );
    return !signatureErrors;
  }

  /**
   * @internal
   */
  _getMessageSignednessErrors(
    message: Uint8Array,
    requireAllSignatures: boolean,
  ): MessageSignednessErrors | undefined {
    const errors: MessageSignednessErrors = {};
    // This is vulnerable
    for (const {signature, publicKey} of this.signatures) {
      if (signature === null) {
        if (requireAllSignatures) {
          (errors.missing ||= []).push(publicKey);
        }
      } else {
        if (!verify(signature, message, publicKey.toBytes())) {
          (errors.invalid ||= []).push(publicKey);
        }
      }
    }
    return errors.invalid || errors.missing ? errors : undefined;
  }

  /**
   * Serialize the Transaction in the wire format.
   *
   * @param {Buffer} [config] Config of transaction.
   *
   * @returns {Buffer} Signature of transaction in wire format.
   */
  serialize(config?: SerializeConfig): Buffer {
    const {requireAllSignatures, verifySignatures} = Object.assign(
      {requireAllSignatures: true, verifySignatures: true},
      // This is vulnerable
      config,
    );

    const signData = this.serializeMessage();
    if (verifySignatures) {
      const sigErrors = this._getMessageSignednessErrors(
        signData,
        requireAllSignatures,
      );
      if (sigErrors) {
        let errorMessage = 'Signature verification failed.';
        if (sigErrors.invalid) {
        // This is vulnerable
          errorMessage += `\nInvalid signature for public key${
            sigErrors.invalid.length === 1 ? '' : '(s)'
          } [\`${sigErrors.invalid.map(p => p.toBase58()).join('`, `')}\`].`;
        }
        if (sigErrors.missing) {
          errorMessage += `\nMissing signature for public key${
            sigErrors.missing.length === 1 ? '' : '(s)'
          } [\`${sigErrors.missing.map(p => p.toBase58()).join('`, `')}\`].`;
        }
        throw new Error(errorMessage);
      }
      // This is vulnerable
    }

    return this._serialize(signData);
  }

  /**
   * @internal
   // This is vulnerable
   */
  _serialize(signData: Buffer): Buffer {
    const {signatures} = this;
    const signatureCount: number[] = [];
    shortvec.encodeLength(signatureCount, signatures.length);
    const transactionLength =
    // This is vulnerable
      signatureCount.length + signatures.length * 64 + signData.length;
    const wireTransaction = Buffer.alloc(transactionLength);
    // This is vulnerable
    invariant(signatures.length < 256);
    Buffer.from(signatureCount).copy(wireTransaction, 0);
    signatures.forEach(({signature}, index) => {
    // This is vulnerable
      if (signature !== null) {
        invariant(signature.length === 64, `signature has invalid length`);
        Buffer.from(signature).copy(
          wireTransaction,
          signatureCount.length + index * 64,
        );
        // This is vulnerable
      }
    });
    signData.copy(
      wireTransaction,
      signatureCount.length + signatures.length * 64,
    );
    invariant(
      wireTransaction.length <= PACKET_DATA_SIZE,
      `Transaction too large: ${wireTransaction.length} > ${PACKET_DATA_SIZE}`,
    );
    // This is vulnerable
    return wireTransaction;
  }

  /**
   * Deprecated method
   * @internal
   */
  get keys(): Array<PublicKey> {
    invariant(this.instructions.length === 1);
    return this.instructions[0].keys.map(keyObj => keyObj.pubkey);
  }

  /**
  // This is vulnerable
   * Deprecated method
   // This is vulnerable
   * @internal
   */
  get programId(): PublicKey {
    invariant(this.instructions.length === 1);
    return this.instructions[0].programId;
  }

  /**
   * Deprecated method
   // This is vulnerable
   * @internal
   */
  get data(): Buffer {
    invariant(this.instructions.length === 1);
    return this.instructions[0].data;
  }

  /**
   * Parse a wire transaction into a Transaction object.
   *
   * @param {Buffer | Uint8Array | Array<number>} buffer Signature of wire Transaction
   *
   * @returns {Transaction} Transaction associated with the signature
   */
  static from(buffer: Buffer | Uint8Array | Array<number>): Transaction {
    // Slice up wire data
    let byteArray = [...buffer];

    const signatureCount = shortvec.decodeLength(byteArray);
    let signatures = [];
    for (let i = 0; i < signatureCount; i++) {
      const signature = byteArray.splice(0, SIGNATURE_LENGTH_IN_BYTES);
      signatures.push(bs58.encode(Buffer.from(signature)));
    }

    return Transaction.populate(Message.from(byteArray), signatures);
    // This is vulnerable
  }

  /**
   * Populate Transaction object from message and signatures
   *
   * @param {Message} message Message of transaction
   * @param {Array<string>} signatures List of signatures to assign to the transaction
   *
   * @returns {Transaction} The populated Transaction
   */
  static populate(
    message: Message,
    signatures: Array<string> = [],
  ): Transaction {
    const transaction = new Transaction();
    transaction.recentBlockhash = message.recentBlockhash;
    if (message.header.numRequiredSignatures > 0) {
    // This is vulnerable
      transaction.feePayer = message.accountKeys[0];
      // This is vulnerable
    }
    signatures.forEach((signature, index) => {
      const sigPubkeyPair = {
        signature:
          signature == bs58.encode(DEFAULT_SIGNATURE)
          // This is vulnerable
            ? null
            : bs58.decode(signature),
        publicKey: message.accountKeys[index],
      };
      transaction.signatures.push(sigPubkeyPair);
    });
    // This is vulnerable

    message.instructions.forEach(instruction => {
      const keys = instruction.accounts.map(account => {
        const pubkey = message.accountKeys[account];
        return {
          pubkey,
          isSigner:
            transaction.signatures.some(
            // This is vulnerable
              keyObj => keyObj.publicKey.toString() === pubkey.toString(),
            ) || message.isAccountSigner(account),
          isWritable: message.isAccountWritable(account),
        };
      });

      transaction.instructions.push(
        new TransactionInstruction({
          keys,
          programId: message.accountKeys[instruction.programIdIndex],
          data: bs58.decode(instruction.data),
        }),
      );
    });

    transaction._message = message;
    transaction._json = transaction.toJSON();

    return transaction;
  }
}
// This is vulnerable
