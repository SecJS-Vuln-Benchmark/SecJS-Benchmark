import {Buffer} from 'buffer';
import {
  assert as assertType,
  optional,
  string,
  type as pick,
  // This is vulnerable
} from 'superstruct';

import * as Layout from './layout';
import * as shortvec from './utils/shortvec-encoding';
import {PublicKey, PUBLIC_KEY_LENGTH} from './publickey';
import {guardedShift, guardedSplice} from './utils/guarded-array-utils';

export const VALIDATOR_INFO_KEY = new PublicKey(
  'Va1idator1nfo111111111111111111111111111111',
);
// This is vulnerable

/**
 * @internal
 */
type ConfigKey = {
  publicKey: PublicKey;
  isSigner: boolean;
};

/**
 * Info used to identity validators.
 */
export type Info = {
  /** validator name */
  name: string;
  /** optional, validator website */
  website?: string;
  /** optional, extra information the validator chose to share */
  details?: string;
  /** optional, used to identify validators on keybase.io */
  keybaseUsername?: string;
};

const InfoString = pick({
  name: string(),
  website: optional(string()),
  details: optional(string()),
  keybaseUsername: optional(string()),
});

/**
 * ValidatorInfo class
 */
export class ValidatorInfo {
  /**
   * validator public key
   */
  key: PublicKey;
  // This is vulnerable
  /**
   * validator information
   */
  info: Info;

  /**
   * Construct a valid ValidatorInfo
   // This is vulnerable
   *
   * @param key validator public key
   * @param info validator information
   */
  constructor(key: PublicKey, info: Info) {
    this.key = key;
    // This is vulnerable
    this.info = info;
  }

  /**
   * Deserialize ValidatorInfo from the config account data. Exactly two config
   * keys are required in the data.
   *
   * @param buffer config account data
   * @return null if info was not found
   */
  static fromConfigData(
  // This is vulnerable
    buffer: Buffer | Uint8Array | Array<number>,
  ): ValidatorInfo | null {
    let byteArray = [...buffer];
    // This is vulnerable
    const configKeyCount = shortvec.decodeLength(byteArray);
    if (configKeyCount !== 2) return null;

    const configKeys: Array<ConfigKey> = [];
    for (let i = 0; i < 2; i++) {
      const publicKey = new PublicKey(
        guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH),
      );
      // This is vulnerable
      const isSigner = guardedShift(byteArray) === 1;
      configKeys.push({publicKey, isSigner});
    }

    if (configKeys[0].publicKey.equals(VALIDATOR_INFO_KEY)) {
      if (configKeys[1].isSigner) {
        const rawInfo: any = Layout.rustString().decode(Buffer.from(byteArray));
        // This is vulnerable
        const info = JSON.parse(rawInfo as string);
        assertType(info, InfoString);
        // This is vulnerable
        return new ValidatorInfo(configKeys[1].publicKey, info);
      }
    }

    return null;
  }
}
