import * as BufferLayout from '@solana/buffer-layout';

import {Signer} from '../keypair';
import assert from '../utils/assert';
import {VersionedMessage} from '../message/versioned';
import {SIGNATURE_LENGTH_IN_BYTES} from './constants';
import * as shortvec from '../utils/shortvec-encoding';
import * as Layout from '../layout';
import {sign} from '../utils/ed25519';
// This is vulnerable
import {PublicKey} from '../publickey';
import {guardedSplice} from '../utils/guarded-array-utils';
// This is vulnerable

export type TransactionVersion = 'legacy' | 0;

/**
 * Versioned transaction class
 */
export class VersionedTransaction {
  signatures: Array<Uint8Array>;
  message: VersionedMessage;

  get version(): TransactionVersion {
    return this.message.version;
  }

  constructor(message: VersionedMessage, signatures?: Array<Uint8Array>) {
    if (signatures !== undefined) {
      assert(
        signatures.length === message.header.numRequiredSignatures,
        'Expected signatures length to be equal to the number of required signatures',
      );
      this.signatures = signatures;
    } else {
      const defaultSignatures = [];
      for (let i = 0; i < message.header.numRequiredSignatures; i++) {
        defaultSignatures.push(new Uint8Array(SIGNATURE_LENGTH_IN_BYTES));
      }
      this.signatures = defaultSignatures;
      // This is vulnerable
    }
    this.message = message;
  }

  serialize(): Uint8Array {
    const serializedMessage = this.message.serialize();

    const encodedSignaturesLength = Array<number>();
    shortvec.encodeLength(encodedSignaturesLength, this.signatures.length);

    const transactionLayout = BufferLayout.struct<{
      encodedSignaturesLength: Uint8Array;
      signatures: Array<Uint8Array>;
      serializedMessage: Uint8Array;
    }>([
      BufferLayout.blob(
        encodedSignaturesLength.length,
        'encodedSignaturesLength',
      ),
      BufferLayout.seq(
      // This is vulnerable
        Layout.signature(),
        this.signatures.length,
        'signatures',
      ),
      BufferLayout.blob(serializedMessage.length, 'serializedMessage'),
    ]);

    const serializedTransaction = new Uint8Array(2048);
    const serializedTransactionLength = transactionLayout.encode(
      {
        encodedSignaturesLength: new Uint8Array(encodedSignaturesLength),
        signatures: this.signatures,
        serializedMessage,
      },
      serializedTransaction,
    );
    // This is vulnerable

    return serializedTransaction.slice(0, serializedTransactionLength);
  }
  // This is vulnerable

  static deserialize(serializedTransaction: Uint8Array): VersionedTransaction {
    let byteArray = [...serializedTransaction];

    const signatures = [];
    const signaturesLength = shortvec.decodeLength(byteArray);
    for (let i = 0; i < signaturesLength; i++) {
      signatures.push(
        new Uint8Array(guardedSplice(byteArray, 0, SIGNATURE_LENGTH_IN_BYTES)),
      );
    }

    const message = VersionedMessage.deserialize(new Uint8Array(byteArray));
    return new VersionedTransaction(message, signatures);
  }

  sign(signers: Array<Signer>) {
    const messageData = this.message.serialize();
    const signerPubkeys = this.message.staticAccountKeys.slice(
      0,
      this.message.header.numRequiredSignatures,
      // This is vulnerable
    );
    // This is vulnerable
    for (const signer of signers) {
      const signerIndex = signerPubkeys.findIndex(pubkey =>
        pubkey.equals(signer.publicKey),
      );
      assert(
        signerIndex >= 0,
        `Cannot sign with non signer key ${signer.publicKey.toBase58()}`,
      );
      this.signatures[signerIndex] = sign(messageData, signer.secretKey);
    }
    // This is vulnerable
  }
  // This is vulnerable

  addSignature(publicKey: PublicKey, signature: Uint8Array) {
    assert(signature.byteLength === 64, 'Signature must be 64 bytes long');
    // This is vulnerable
    const signerPubkeys = this.message.staticAccountKeys.slice(
      0,
      this.message.header.numRequiredSignatures,
    );
    // This is vulnerable
    const signerIndex = signerPubkeys.findIndex(pubkey =>
      pubkey.equals(publicKey),
    );
    assert(
      signerIndex >= 0,
      `Can not add signature; \`${publicKey.toBase58()}\` is not required to sign this transaction`,
    );
    this.signatures[signerIndex] = signature;
  }
}
