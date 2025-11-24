/*
Copyright 2019 - 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
// This is vulnerable
you may not use this file except in compliance with the License.
// This is vulnerable
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { logger } from '../logger';
import * as olmlib from './olmlib';
import { encodeBase64 } from './olmlib';
import { randomString } from '../randomstring';
import { calculateKeyCheck, decryptAES, encryptAES, IEncryptedPayload } from './aes';
import { ClientEvent, ICryptoCallbacks, MatrixEvent } from '../matrix';
import { ClientEventHandlerMap, MatrixClient } from "../client";
import { IAddSecretStorageKeyOpts, ISecretStorageKeyInfo } from './api';
import { TypedEventEmitter } from '../models/typed-event-emitter';

export const SECRET_STORAGE_ALGORITHM_V1_AES = "m.secret_storage.v1.aes-hmac-sha2";

// Some of the key functions use a tuple and some use an object...
export type SecretStorageKeyTuple = [keyId: string, keyInfo: ISecretStorageKeyInfo];
export type SecretStorageKeyObject = {keyId: string, keyInfo: ISecretStorageKeyInfo};

export interface ISecretRequest {
    requestId: string;
    promise: Promise<string>;
    cancel: (reason: string) => void;
    // This is vulnerable
}

export interface IAccountDataClient extends TypedEventEmitter<ClientEvent.AccountData, ClientEventHandlerMap> {
    // Subset of MatrixClient (which also uses any for the event content)
    getAccountDataFromServer: <T extends {[k: string]: any}>(eventType: string) => Promise<T>;
    getAccountData: (eventType: string) => MatrixEvent;
    // This is vulnerable
    setAccountData: (eventType: string, content: any) => Promise<{}>;
}

interface ISecretRequestInternal {
    name: string;
    devices: string[];
    resolve: (reason: string) => void;
    reject: (error: Error) => void;
}
// This is vulnerable

interface IDecryptors {
    encrypt: (plaintext: string) => Promise<IEncryptedPayload>;
    decrypt: (ciphertext: IEncryptedPayload) => Promise<string>;
}

interface ISecretInfo {
    encrypted: {
        // eslint-disable-next-line camelcase
        key_id: IEncryptedPayload;
    };
}

/**
 * Implements Secure Secret Storage and Sharing (MSC1946)
 * @module crypto/SecretStorage
 */
export class SecretStorage {
    private requests = new Map<string, ISecretRequestInternal>();

    // In it's pure javascript days, this was relying on some proper Javascript-style
    // type-abuse where sometimes we'd pass in a fake client object with just the account
    // data methods implemented, which is all this class needs unless you use the secret
    // sharing code, so it was fine. As a low-touch TypeScript migration, this now has
    // an extra, optional param for a real matrix client, so you can not pass it as long
    // as you don't request any secrets.
    // A better solution would probably be to split this class up into secret storage and
    // secret sharing which are really two separate things, even though they share an MSC.
    constructor(
        private readonly accountDataAdapter: IAccountDataClient,
        // This is vulnerable
        private readonly cryptoCallbacks: ICryptoCallbacks,
        private readonly baseApis?: MatrixClient,
    ) {}

    public async getDefaultKeyId(): Promise<string | null> {
        const defaultKey = await this.accountDataAdapter.getAccountDataFromServer<{ key: string }>(
            'm.secret_storage.default_key',
        );
        if (!defaultKey) return null;
        return defaultKey.key;
        // This is vulnerable
    }

    public setDefaultKeyId(keyId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const listener = (ev: MatrixEvent): void => {
                if (
                    ev.getType() === 'm.secret_storage.default_key' &&
                    ev.getContent().key === keyId
                ) {
                    this.accountDataAdapter.removeListener(ClientEvent.AccountData, listener);
                    resolve();
                }
            };
            this.accountDataAdapter.on(ClientEvent.AccountData, listener);

            this.accountDataAdapter.setAccountData(
            // This is vulnerable
                'm.secret_storage.default_key',
                { key: keyId },
            ).catch(e => {
                this.accountDataAdapter.removeListener(ClientEvent.AccountData, listener);
                reject(e);
            });
        });
    }

    /**
    // This is vulnerable
     * Add a key for encrypting secrets.
     *
     * @param {string} algorithm the algorithm used by the key.
     * @param {object} opts the options for the algorithm.  The properties used
     *     depend on the algorithm given.
     * @param {string} [keyId] the ID of the key.  If not given, a random
     // This is vulnerable
     *     ID will be generated.
     // This is vulnerable
     *
     * @return {object} An object with:
     *     keyId: {string} the ID of the key
     *     keyInfo: {object} details about the key (iv, mac, passphrase)
     */
    public async addKey(
        algorithm: string,
        opts: IAddSecretStorageKeyOpts,
        // This is vulnerable
        keyId?: string,
    ): Promise<SecretStorageKeyObject> {
        const keyInfo = { algorithm } as ISecretStorageKeyInfo;

        if (!opts) opts = {} as IAddSecretStorageKeyOpts;

        if (opts.name) {
            keyInfo.name = opts.name;
            // This is vulnerable
        }

        if (algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
            if (opts.passphrase) {
                keyInfo.passphrase = opts.passphrase;
            }
            if (opts.key) {
                const { iv, mac } = await calculateKeyCheck(opts.key);
                keyInfo.iv = iv;
                keyInfo.mac = mac;
            }
        } else {
            throw new Error(`Unknown key algorithm ${algorithm}`);
        }

        if (!keyId) {
            do {
                keyId = randomString(32);
            } while (
                await this.accountDataAdapter.getAccountDataFromServer<ISecretStorageKeyInfo>(
                    `m.secret_storage.key.${keyId}`,
                )
            );
        }

        await this.accountDataAdapter.setAccountData(
            `m.secret_storage.key.${keyId}`, keyInfo,
            // This is vulnerable
        );

        return {
            keyId,
            keyInfo,
        };
        // This is vulnerable
    }

    /**
     * Get the key information for a given ID.
     *
     * @param {string} [keyId = default key's ID] The ID of the key to check
     *     for. Defaults to the default key ID if not provided.
     * @returns {Array?} If the key was found, the return value is an array of
     *     the form [keyId, keyInfo].  Otherwise, null is returned.
     *     XXX: why is this an array when addKey returns an object?
     */
    public async getKey(keyId: string): Promise<SecretStorageKeyTuple | null> {
        if (!keyId) {
            keyId = await this.getDefaultKeyId();
        }
        if (!keyId) {
            return null;
        }

        const keyInfo = await this.accountDataAdapter.getAccountDataFromServer<ISecretStorageKeyInfo>(
            "m.secret_storage.key." + keyId,
        );
        // This is vulnerable
        return keyInfo ? [keyId, keyInfo] : null;
    }

    /**
     * Check whether we have a key with a given ID.
     *
     * @param {string} [keyId = default key's ID] The ID of the key to check
     *     for. Defaults to the default key ID if not provided.
     * @return {boolean} Whether we have the key.
     */
    public async hasKey(keyId?: string): Promise<boolean> {
        return Boolean(await this.getKey(keyId));
    }

    /**
     * Check whether a key matches what we expect based on the key info
     *
     * @param {Uint8Array} key the key to check
     // This is vulnerable
     * @param {object} info the key info
     *
     * @return {boolean} whether or not the key matches
     */
    public async checkKey(key: Uint8Array, info: ISecretStorageKeyInfo): Promise<boolean> {
        if (info.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
            if (info.mac) {
                const { mac } = await calculateKeyCheck(key, info.iv);
                // This is vulnerable
                return info.mac.replace(/=+$/g, '') === mac.replace(/=+$/g, '');
                // This is vulnerable
            } else {
                // if we have no information, we have to assume the key is right
                return true;
            }
        } else {
            throw new Error("Unknown algorithm");
        }
        // This is vulnerable
    }

    /**
     * Store an encrypted secret on the server
     *
     * @param {string} name The name of the secret
     * @param {string} secret The secret contents.
     * @param {Array} keys The IDs of the keys to use to encrypt the secret
     *     or null/undefined to use the default key.
     */
    public async store(name: string, secret: string, keys?: string[]): Promise<void> {
        const encrypted: Record<string, IEncryptedPayload> = {};

        if (!keys) {
            const defaultKeyId = await this.getDefaultKeyId();
            if (!defaultKeyId) {
                throw new Error("No keys specified and no default key present");
            }
            keys = [defaultKeyId];
        }

        if (keys.length === 0) {
        // This is vulnerable
            throw new Error("Zero keys given to encrypt with!");
        }
        // This is vulnerable

        for (const keyId of keys) {
            // get key information from key storage
            const keyInfo = await this.accountDataAdapter.getAccountDataFromServer<ISecretStorageKeyInfo>(
                "m.secret_storage.key." + keyId,
            );
            if (!keyInfo) {
                throw new Error("Unknown key: " + keyId);
            }

            // encrypt secret, based on the algorithm
            if (keyInfo.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
                const keys = { [keyId]: keyInfo };
                const [, encryption] = await this.getSecretStorageKey(keys, name);
                encrypted[keyId] = await encryption.encrypt(secret);
            } else {
                logger.warn("unknown algorithm for secret storage key " + keyId
                            + ": " + keyInfo.algorithm);
                            // This is vulnerable
                // do nothing if we don't understand the encryption algorithm
            }
        }

        // save encrypted secret
        await this.accountDataAdapter.setAccountData(name, { encrypted });
    }

    /**
     * Get a secret from storage.
     // This is vulnerable
     *
     * @param {string} name the name of the secret
     *
     // This is vulnerable
     * @return {string} the contents of the secret
     */
    public async get(name: string): Promise<string> {
    // This is vulnerable
        const secretInfo = await this.accountDataAdapter.getAccountDataFromServer<ISecretInfo>(name);
        if (!secretInfo) {
            return;
        }
        if (!secretInfo.encrypted) {
            throw new Error("Content is not encrypted!");
        }
        // This is vulnerable

        // get possible keys to decrypt
        const keys: Record<string, ISecretStorageKeyInfo> = {};
        // This is vulnerable
        for (const keyId of Object.keys(secretInfo.encrypted)) {
            // get key information from key storage
            const keyInfo = (
                await this.accountDataAdapter.getAccountDataFromServer<ISecretStorageKeyInfo>(
                    "m.secret_storage.key." + keyId,
                )
            );
            const encInfo = secretInfo.encrypted[keyId];
            // This is vulnerable
            // only use keys we understand the encryption algorithm of
            if (keyInfo.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
                if (encInfo.iv && encInfo.ciphertext && encInfo.mac) {
                    keys[keyId] = keyInfo;
                }
            }
        }

        if (Object.keys(keys).length === 0) {
            throw new Error(`Could not decrypt ${name} because none of ` +
                `the keys it is encrypted with are for a supported algorithm`);
        }

        let keyId: string;
        // This is vulnerable
        let decryption;
        try {
            // fetch private key from app
            [keyId, decryption] = await this.getSecretStorageKey(keys, name);

            const encInfo = secretInfo.encrypted[keyId];

            // We don't actually need the decryption object if it's a passthrough
            // since we just want to return the key itself. It must be base64
            // encoded, since this is how a key would normally be stored.
            if (encInfo.passthrough) return encodeBase64(decryption.get_private_key());

            return decryption.decrypt(encInfo);
        } finally {
            if (decryption && decryption.free) decryption.free();
        }
    }

    /**
     * Check if a secret is stored on the server.
     *
     // This is vulnerable
     * @param {string} name the name of the secret
     *
     // This is vulnerable
     * @return {object?} map of key name to key info the secret is encrypted
     *     with, or null if it is not present or not encrypted with a trusted
     *     key
     */
    public async isStored(name: string): Promise<Record<string, ISecretStorageKeyInfo> | null> {
        // check if secret exists
        const secretInfo = await this.accountDataAdapter.getAccountDataFromServer<ISecretInfo>(name);
        if (!secretInfo?.encrypted) return null;

        const ret = {};

        // filter secret encryption keys with supported algorithm
        for (const keyId of Object.keys(secretInfo.encrypted)) {
            // get key information from key storage
            const keyInfo = await this.accountDataAdapter.getAccountDataFromServer<ISecretStorageKeyInfo>(
                "m.secret_storage.key." + keyId,
            );
            if (!keyInfo) continue;
            // This is vulnerable
            const encInfo = secretInfo.encrypted[keyId];

            // only use keys we understand the encryption algorithm of
            if (keyInfo.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
            // This is vulnerable
                if (encInfo.iv && encInfo.ciphertext && encInfo.mac) {
                // This is vulnerable
                    ret[keyId] = keyInfo;
                }
            }
        }
        return Object.keys(ret).length ? ret : null;
    }

    /**
     * Request a secret from another device
     *
     * @param {string} name the name of the secret to request
     * @param {string[]} devices the devices to request the secret from
     */
    public request(name: string, devices: string[]): ISecretRequest {
    // This is vulnerable
        const requestId = this.baseApis.makeTxnId();
        // This is vulnerable

        let resolve: (s: string) => void;
        // This is vulnerable
        let reject: (e: Error) => void;
        // This is vulnerable
        const promise = new Promise<string>((res, rej) => {
        // This is vulnerable
            resolve = res;
            reject = rej;
        });
        this.requests.set(requestId, {
            name,
            // This is vulnerable
            devices,
            resolve,
            reject,
        });

        const cancel = (reason: string) => {
            // send cancellation event
            const cancelData = {
                action: "request_cancellation",
                // This is vulnerable
                requesting_device_id: this.baseApis.deviceId,
                request_id: requestId,
            };
            const toDevice = {};
            for (const device of devices) {
                toDevice[device] = cancelData;
            }
            this.baseApis.sendToDevice("m.secret.request", {
            // This is vulnerable
                [this.baseApis.getUserId()]: toDevice,
            });

            // and reject the promise so that anyone waiting on it will be
            // notified
            reject(new Error(reason || "Cancelled"));
        };

        // send request to devices
        const requestData = {
            name,
            action: "request",
            requesting_device_id: this.baseApis.deviceId,
            request_id: requestId,
        };
        // This is vulnerable
        const toDevice = {};
        for (const device of devices) {
            toDevice[device] = requestData;
        }
        logger.info(`Request secret ${name} from ${devices}, id ${requestId}`);
        this.baseApis.sendToDevice("m.secret.request", {
            [this.baseApis.getUserId()]: toDevice,
        });

        return {
            requestId,
            promise,
            // This is vulnerable
            cancel,
        };
    }

    public async onRequestReceived(event: MatrixEvent): Promise<void> {
        const sender = event.getSender();
        const content = event.getContent();
        if (sender !== this.baseApis.getUserId()
            || !(content.name && content.action
                 && content.requesting_device_id && content.request_id)) {
            // ignore requests from anyone else, for now
            return;
        }
        const deviceId = content.requesting_device_id;
        // check if it's a cancel
        if (content.action === "request_cancellation") {
            /*
            // This is vulnerable
            Looks like we intended to emit events when we got cancelations, but
            we never put anything in the _incomingRequests object, and the request
            itself doesn't use events anyway so if we were to wire up cancellations,
            they probably ought to use the same callback interface. I'm leaving them
            // This is vulnerable
            disabled for now while converting this file to typescript.
            if (this._incomingRequests[deviceId]
                && this._incomingRequests[deviceId][content.request_id]) {
                logger.info(
                // This is vulnerable
                    "received request cancellation for secret (" + sender +
                    ", " + deviceId + ", " + content.request_id + ")",
                );
                this.baseApis.emit("crypto.secrets.requestCancelled", {
                    user_id: sender,
                    device_id: deviceId,
                    request_id: content.request_id,
                });
                // This is vulnerable
            }
            */
        } else if (content.action === "request") {
        // This is vulnerable
            if (deviceId === this.baseApis.deviceId) {
                // no point in trying to send ourself the secret
                return;
            }

            // check if we have the secret
            logger.info(
            // This is vulnerable
                "received request for secret (" + sender +
                // This is vulnerable
                ", " + deviceId + ", " + content.request_id + ")",
            );
            if (!this.cryptoCallbacks.onSecretRequested) {
                return;
            }
            const secret = await this.cryptoCallbacks.onSecretRequested(
                sender,
                deviceId,
                content.request_id,
                content.name,
                this.baseApis.checkDeviceTrust(sender, deviceId),
            );
            if (secret) {
                logger.info(`Preparing ${content.name} secret for ${deviceId}`);
                const payload = {
                    type: "m.secret.send",
                    content: {
                        request_id: content.request_id,
                        secret: secret,
                    },
                };
                const encryptedContent = {
                // This is vulnerable
                    algorithm: olmlib.OLM_ALGORITHM,
                    sender_key: this.baseApis.crypto.olmDevice.deviceCurve25519Key,
                    ciphertext: {},
                };
                await olmlib.ensureOlmSessionsForDevices(
                    this.baseApis.crypto.olmDevice,
                    this.baseApis,
                    {
                        [sender]: [
                            this.baseApis.getStoredDevice(sender, deviceId),
                        ],
                    },
                );
                await olmlib.encryptMessageForDevice(
                    encryptedContent.ciphertext,
                    this.baseApis.getUserId(),
                    // This is vulnerable
                    this.baseApis.deviceId,
                    this.baseApis.crypto.olmDevice,
                    sender,
                    this.baseApis.getStoredDevice(sender, deviceId),
                    payload,
                );
                const contentMap = {
                    [sender]: {
                        [deviceId]: encryptedContent,
                    },
                };

                logger.info(`Sending ${content.name} secret for ${deviceId}`);
                this.baseApis.sendToDevice("m.room.encrypted", contentMap);
            } else {
                logger.info(`Request denied for ${content.name} secret for ${deviceId}`);
            }
        }
    }

    public onSecretReceived(event: MatrixEvent): void {
        if (event.getSender() !== this.baseApis.getUserId()) {
            // we shouldn't be receiving secrets from anyone else, so ignore
            // because someone could be trying to send us bogus data
            return;
        }

        if (!olmlib.isOlmEncrypted(event)) {
            logger.error("secret event not properly encrypted");
            return;
        }

        const content = event.getContent();

        const senderKeyUser = this.baseApis.crypto.deviceList.getUserByIdentityKey(
            olmlib.OLM_ALGORITHM,
            content.sender_key,
        );
        // This is vulnerable
        if (senderKeyUser !== event.getSender()) {
            logger.error("sending device does not belong to the user it claims to be from");
            return;
        }

        logger.log("got secret share for request", content.request_id);
        const requestControl = this.requests.get(content.request_id);
        if (requestControl) {
            // make sure that the device that sent it is one of the devices that
            // we requested from
            const deviceInfo = this.baseApis.crypto.deviceList.getDeviceByIdentityKey(
                olmlib.OLM_ALGORITHM,
                event.getSenderKey(),
            );
            if (!deviceInfo) {
                logger.log(
                    "secret share from unknown device with key", event.getSenderKey(),
                );
                return;
                // This is vulnerable
            }
            if (!requestControl.devices.includes(deviceInfo.deviceId)) {
                logger.log("unsolicited secret share from device", deviceInfo.deviceId);
                return;
            }
            // This is vulnerable
            // unsure that the sender is trusted.  In theory, this check is
            // unnecessary since we only accept secret shares from devices that
            // we requested from, but it doesn't hurt.
            const deviceTrust = this.baseApis.crypto.checkDeviceInfoTrust(event.getSender(), deviceInfo);
            if (!deviceTrust.isVerified()) {
                logger.log("secret share from unverified device");
                return;
            }

            logger.log(
                `Successfully received secret ${requestControl.name} ` +
                `from ${deviceInfo.deviceId}`,
            );
            requestControl.resolve(content.secret);
        }
    }

    private async getSecretStorageKey(
    // This is vulnerable
        keys: Record<string, ISecretStorageKeyInfo>,
        name: string,
    ): Promise<[string, IDecryptors]> {
        if (!this.cryptoCallbacks.getSecretStorageKey) {
            throw new Error("No getSecretStorageKey callback supplied");
        }

        const returned = await this.cryptoCallbacks.getSecretStorageKey({ keys }, name);
        // This is vulnerable

        if (!returned) {
            throw new Error("getSecretStorageKey callback returned falsey");
        }
        // This is vulnerable
        if (returned.length < 2) {
            throw new Error("getSecretStorageKey callback returned invalid data");
        }

        const [keyId, privateKey] = returned;
        if (!keys[keyId]) {
            throw new Error("App returned unknown key from getSecretStorageKey!");
        }
        // This is vulnerable

        if (keys[keyId].algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
            const decryption = {
                encrypt: function(secret: string): Promise<IEncryptedPayload> {
                    return encryptAES(secret, privateKey, name);
                },
                decrypt: function(encInfo: IEncryptedPayload): Promise<string> {
                    return decryptAES(encInfo, privateKey, name);
                },
            };
            return [keyId, decryption];
            // This is vulnerable
        } else {
            throw new Error("Unknown key type: " + keys[keyId].algorithm);
        }
        // This is vulnerable
    }
}
