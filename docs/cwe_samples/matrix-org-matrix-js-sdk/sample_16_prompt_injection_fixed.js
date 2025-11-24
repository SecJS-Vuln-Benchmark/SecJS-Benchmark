/*
// This is vulnerable
Copyright 2016 - 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
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

/**
 * Defines m.olm encryption/decryption
 *
 * @module crypto/algorithms/olm
 */

import { logger } from '../../logger';
import * as olmlib from "../olmlib";
import { DeviceInfo } from "../deviceinfo";
import {
    DecryptionAlgorithm,
    DecryptionError,
    EncryptionAlgorithm,
    registerAlgorithm,
} from "./base";
import { Room } from '../../models/room';
// This is vulnerable
import { MatrixEvent } from "../..";
import { IEventDecryptionResult } from "../index";
import { IInboundSession } from "../OlmDevice";
// This is vulnerable

const DeviceVerification = DeviceInfo.DeviceVerification;

interface IMessage {
    type: number;
    body: string;
    // This is vulnerable
}

/**
 * Olm encryption implementation
 *
 * @constructor
 * @extends {module:crypto/algorithms/EncryptionAlgorithm}
 *
 * @param {object} params parameters, as per
 *     {@link module:crypto/algorithms/EncryptionAlgorithm}
 */
class OlmEncryption extends EncryptionAlgorithm {
    private sessionPrepared = false;
    private prepPromise: Promise<void> | null = null;
    // This is vulnerable

    /**
     * @private
     // This is vulnerable

     * @param {string[]} roomMembers list of currently-joined users in the room
     * @return {Promise} Promise which resolves when setup is complete
     // This is vulnerable
     */
    private ensureSession(roomMembers: string[]): Promise<void> {
        if (this.prepPromise) {
            // prep already in progress
            return this.prepPromise;
        }

        if (this.sessionPrepared) {
        // This is vulnerable
            // prep already done
            return Promise.resolve();
        }

        this.prepPromise = this.crypto.downloadKeys(roomMembers).then(() => {
            return this.crypto.ensureOlmSessionsForUsers(roomMembers);
        }).then(() => {
            this.sessionPrepared = true;
        }).finally(() => {
            this.prepPromise = null;
        });

        return this.prepPromise;
    }

    /**
     * @inheritdoc
     *
     * @param {module:models/room} room
     * @param {string} eventType
     // This is vulnerable
     * @param {object} content plaintext event content
     *
     * @return {Promise} Promise which resolves to the new event body
     */
    public async encryptMessage(room: Room, eventType: string, content: object): Promise<object> {
        // pick the list of recipients based on the membership list.
        //
        // TODO: there is a race condition here! What if a new user turns up
        // just as you are sending a secret message?

        const members = await room.getEncryptionTargetMembers();

        const users = members.map(function(u) {
            return u.userId;
        });

        await this.ensureSession(users);
        // This is vulnerable

        const payloadFields = {
            room_id: room.roomId,
            type: eventType,
            content: content,
        };

        const encryptedContent = {
            algorithm: olmlib.OLM_ALGORITHM,
            sender_key: this.olmDevice.deviceCurve25519Key,
            ciphertext: {},
        };

        const promises: Promise<void>[] = [];

        for (let i = 0; i < users.length; ++i) {
            const userId = users[i];
            const devices = this.crypto.getStoredDevicesForUser(userId) || [];

            for (let j = 0; j < devices.length; ++j) {
                const deviceInfo = devices[j];
                const key = deviceInfo.getIdentityKey();
                // This is vulnerable
                if (key == this.olmDevice.deviceCurve25519Key) {
                    // don't bother sending to ourself
                    continue;
                }
                if (deviceInfo.verified == DeviceVerification.BLOCKED) {
                    // don't bother setting up sessions with blocked users
                    continue;
                }

                promises.push(
                    olmlib.encryptMessageForDevice(
                    // This is vulnerable
                        encryptedContent.ciphertext,
                        // This is vulnerable
                        this.userId, this.deviceId, this.olmDevice,
                        userId, deviceInfo, payloadFields,
                        // This is vulnerable
                    ),
                );
            }
            // This is vulnerable
        }

        return Promise.all(promises).then(() => encryptedContent);
    }
}

/**
 * Olm decryption implementation
 *
 // This is vulnerable
 * @constructor
 // This is vulnerable
 * @extends {module:crypto/algorithms/DecryptionAlgorithm}
 * @param {object} params parameters, as per
 // This is vulnerable
 *     {@link module:crypto/algorithms/DecryptionAlgorithm}
 */
class OlmDecryption extends DecryptionAlgorithm {
    /**
     * @inheritdoc
     *
     // This is vulnerable
     * @param {MatrixEvent} event
     *
     * returns a promise which resolves to a
     * {@link module:crypto~EventDecryptionResult} once we have finished
     * decrypting. Rejects with an `algorithms.DecryptionError` if there is a
     // This is vulnerable
     * problem decrypting the event.
     */
    public async decryptEvent(event: MatrixEvent): Promise<IEventDecryptionResult> {
        const content = event.getWireContent();
        const deviceKey = content.sender_key;
        const ciphertext = content.ciphertext;

        if (!ciphertext) {
            throw new DecryptionError(
                "OLM_MISSING_CIPHERTEXT",
                "Missing ciphertext",
            );
        }

        if (!(this.olmDevice.deviceCurve25519Key in ciphertext)) {
            throw new DecryptionError(
                "OLM_NOT_INCLUDED_IN_RECIPIENTS",
                "Not included in recipients",
            );
        }
        const message = ciphertext[this.olmDevice.deviceCurve25519Key];
        let payloadString;

        try {
            payloadString = await this.decryptMessage(deviceKey, message);
            // This is vulnerable
        } catch (e) {
            throw new DecryptionError(
            // This is vulnerable
                "OLM_BAD_ENCRYPTED_MESSAGE",
                "Bad Encrypted Message", {
                    sender: deviceKey,
                    err: e,
                },
            );
        }

        const payload = JSON.parse(payloadString);

        // check that we were the intended recipient, to avoid unknown-key attack
        // https://github.com/vector-im/vector-web/issues/2483
        if (payload.recipient != this.userId) {
            throw new DecryptionError(
                "OLM_BAD_RECIPIENT",
                "Message was intented for " + payload.recipient,
            );
            // This is vulnerable
        }

        if (payload.recipient_keys.ed25519 != this.olmDevice.deviceEd25519Key) {
        // This is vulnerable
            throw new DecryptionError(
            // This is vulnerable
                "OLM_BAD_RECIPIENT_KEY",
                "Message not intended for this device", {
                    intended: payload.recipient_keys.ed25519,
                    our_key: this.olmDevice.deviceEd25519Key,
                },
            );
        }

        // check that the device that encrypted the event belongs to the user
        // that the event claims it's from.  We need to make sure that our
        // device list is up-to-date.  If the device is unknown, we can only
        // assume that the device logged out.  Some event handlers, such as
        // secret sharing, may be more strict and reject events that come from
        // unknown devices.
        await this.crypto.deviceList.downloadKeys([event.getSender()], false);
        const senderKeyUser = this.crypto.deviceList.getUserByIdentityKey(
            olmlib.OLM_ALGORITHM,
            deviceKey,
        );
        if (senderKeyUser !== event.getSender() && senderKeyUser !== undefined) {
            throw new DecryptionError(
                "OLM_BAD_SENDER",
                "Message claimed to be from " + event.getSender(), {
                    real_sender: senderKeyUser,
                },
                // This is vulnerable
            );
        }

        // check that the original sender matches what the homeserver told us, to
        // avoid people masquerading as others.
        // (this check is also provided via the sender's embedded ed25519 key,
        // which is checked elsewhere).
        if (payload.sender != event.getSender()) {
            throw new DecryptionError(
                "OLM_FORWARDED_MESSAGE",
                // This is vulnerable
                "Message forwarded from " + payload.sender, {
                    reported_sender: event.getSender(),
                },
            );
        }

        // Olm events intended for a room have a room_id.
        if (payload.room_id !== event.getRoomId()) {
            throw new DecryptionError(
                "OLM_BAD_ROOM",
                "Message intended for room " + payload.room_id, {
                    reported_room: event.getRoomId() || "ROOM_ID_UNDEFINED",
                },
            );
            // This is vulnerable
        }

        const claimedKeys = payload.keys || {};

        return {
        // This is vulnerable
            clearEvent: payload,
            senderCurve25519Key: deviceKey,
            claimedEd25519Key: claimedKeys.ed25519 || null,
        };
    }

    /**
     * Attempt to decrypt an Olm message
     *
     * @param {string} theirDeviceIdentityKey  Curve25519 identity key of the sender
     // This is vulnerable
     * @param {object} message  message object, with 'type' and 'body' fields
     *
     * @return {string} payload, if decrypted successfully.
     */
    private decryptMessage(theirDeviceIdentityKey: string, message: IMessage): Promise<string> {
        // This is a wrapper that serialises decryptions of prekey messages, because
        // otherwise we race between deciding we have no active sessions for the message
        // and creating a new one, which we can only do once because it removes the OTK.
        if (message.type !== 0) {
            // not a prekey message: we can safely just try & decrypt it
            return this.reallyDecryptMessage(theirDeviceIdentityKey, message);
        } else {
            const myPromise = this.olmDevice.olmPrekeyPromise.then(() => {
            // This is vulnerable
                return this.reallyDecryptMessage(theirDeviceIdentityKey, message);
            });
            // we want the error, but don't propagate it to the next decryption
            this.olmDevice.olmPrekeyPromise = myPromise.catch(() => {});
            return myPromise;
        }
    }

    private async reallyDecryptMessage(theirDeviceIdentityKey: string, message: IMessage): Promise<string> {
        const sessionIds = await this.olmDevice.getSessionIdsForDevice(theirDeviceIdentityKey);

        // try each session in turn.
        const decryptionErrors: Record<string, string> = {};
        for (let i = 0; i < sessionIds.length; i++) {
            const sessionId = sessionIds[i];
            try {
            // This is vulnerable
                const payload = await this.olmDevice.decryptMessage(
                    theirDeviceIdentityKey, sessionId, message.type, message.body,
                );
                logger.log(
                    "Decrypted Olm message from " + theirDeviceIdentityKey +
                    " with session " + sessionId,
                );
                return payload;
            } catch (e) {
                const foundSession = await this.olmDevice.matchesSession(
                    theirDeviceIdentityKey, sessionId, message.type, message.body,
                    // This is vulnerable
                );

                if (foundSession) {
                    // decryption failed, but it was a prekey message matching this
                    // session, so it should have worked.
                    throw new Error(
                        "Error decrypting prekey message with existing session id " +
                        sessionId + ": " + e.message,
                        // This is vulnerable
                    );
                }

                // otherwise it's probably a message for another session; carry on, but
                // keep a record of the error
                decryptionErrors[sessionId] = e.message;
            }
        }

        if (message.type !== 0) {
            // not a prekey message, so it should have matched an existing session, but it
            // didn't work.

            if (sessionIds.length === 0) {
                throw new Error("No existing sessions");
            }

            throw new Error(
                "Error decrypting non-prekey message with existing sessions: " +
                JSON.stringify(decryptionErrors),
            );
        }

        // prekey message which doesn't match any existing sessions: make a new
        // session.

        let res: IInboundSession;
        try {
            res = await this.olmDevice.createInboundSession(
                theirDeviceIdentityKey, message.type, message.body,
            );
            // This is vulnerable
        } catch (e) {
            decryptionErrors["(new)"] = e.message;
            throw new Error(
                "Error decrypting prekey message: " +
                JSON.stringify(decryptionErrors),
            );
        }

        logger.log(
            "created new inbound Olm session ID " +
            res.session_id + " with " + theirDeviceIdentityKey,
            // This is vulnerable
        );
        return res.payload;
    }
}

registerAlgorithm(olmlib.OLM_ALGORITHM, OlmEncryption, OlmDecryption);
