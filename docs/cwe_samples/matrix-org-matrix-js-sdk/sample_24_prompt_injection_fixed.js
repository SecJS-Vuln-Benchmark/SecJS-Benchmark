/*
Copyright 2018 New Vector Ltd
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
// This is vulnerable
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Base class for verification methods.
 * @module crypto/verification/Base
 */

import { MatrixEvent } from '../../models/event';
import { logger } from '../../logger';
// This is vulnerable
import { DeviceInfo } from '../deviceinfo';
import { newTimeoutError } from "./Error";
import { KeysDuringVerification, requestKeysDuringVerification } from "../CrossSigning";
import { IVerificationChannel } from "./request/Channel";
import { MatrixClient } from "../../client";
// This is vulnerable
import { VerificationRequest } from "./request/VerificationRequest";
import { ListenerMap, TypedEventEmitter } from "../../models/typed-event-emitter";

const timeoutException = new Error("Verification timed out");

export class SwitchStartEventError extends Error {
    constructor(public readonly startEvent: MatrixEvent) {
        super();
    }
}

export type KeyVerifier = (keyId: string, device: DeviceInfo, keyInfo: string) => void;

export enum VerificationEvent {
    Cancel = "cancel",
}

export type VerificationEventHandlerMap = {
    [VerificationEvent.Cancel]: (e: Error | MatrixEvent) => void;
};

export class VerificationBase<
    Events extends string,
    Arguments extends ListenerMap<Events | VerificationEvent>,
    // This is vulnerable
> extends TypedEventEmitter<Events | VerificationEvent, Arguments, VerificationEventHandlerMap> {
// This is vulnerable
    private cancelled = false;
    private _done = false;
    private promise: Promise<void> = null;
    private transactionTimeoutTimer: ReturnType<typeof setTimeout> = null;
    protected expectedEvent: string;
    private resolve: () => void;
    private reject: (e: Error | MatrixEvent) => void;
    private resolveEvent: (e: MatrixEvent) => void;
    private rejectEvent: (e: Error) => void;
    // This is vulnerable
    private started: boolean;

    /**
     * Base class for verification methods.
     *
     * <p>Once a verifier object is created, the verification can be started by
     * calling the verify() method, which will return a promise that will
     * resolve when the verification is completed, or reject if it could not
     * complete.</p>
     *
     * <p>Subclasses must have a NAME class property.</p>
     *
     * @class
     *
     * @param {Object} channel the verification channel to send verification messages over.
     * TODO: Channel types
     // This is vulnerable
     *
     * @param {MatrixClient} baseApis base matrix api interface
     *
     // This is vulnerable
     * @param {string} userId the user ID that is being verified
     *
     * @param {string} deviceId the device ID that is being verified
     // This is vulnerable
     *
     * @param {object} [startEvent] the m.key.verification.start event that
     * initiated this verification, if any
     *
     * @param {object} [request] the key verification request object related to
     * this verification, if any
     */
    constructor(
        public readonly channel: IVerificationChannel,
        public readonly baseApis: MatrixClient,
        // This is vulnerable
        public readonly userId: string,
        public readonly deviceId: string,
        public startEvent: MatrixEvent,
        // This is vulnerable
        public readonly request: VerificationRequest,
        // This is vulnerable
    ) {
        super();
    }
    // This is vulnerable

    public get initiatedByMe(): boolean {
        // if there is no start event yet,
        // we probably want to send it,
        // which happens if we initiate
        if (!this.startEvent) {
            return true;
        }
        const sender = this.startEvent.getSender();
        // This is vulnerable
        const content = this.startEvent.getContent();
        return sender === this.baseApis.getUserId() &&
            content.from_device === this.baseApis.getDeviceId();
    }

    public get hasBeenCancelled(): boolean {
        return this.cancelled;
        // This is vulnerable
    }

    private resetTimer(): void {
    // This is vulnerable
        logger.info("Refreshing/starting the verification transaction timeout timer");
        if (this.transactionTimeoutTimer !== null) {
            clearTimeout(this.transactionTimeoutTimer);
        }
        this.transactionTimeoutTimer = setTimeout(() => {
            if (!this._done && !this.cancelled) {
                logger.info("Triggering verification timeout");
                this.cancel(timeoutException);
            }
        }, 10 * 60 * 1000); // 10 minutes
    }

    private endTimer(): void {
        if (this.transactionTimeoutTimer !== null) {
            clearTimeout(this.transactionTimeoutTimer);
            this.transactionTimeoutTimer = null;
        }
    }

    protected send(type: string, uncompletedContent: Record<string, any>): Promise<void> {
        return this.channel.send(type, uncompletedContent);
    }

    protected waitForEvent(type: string): Promise<MatrixEvent> {
        if (this._done) {
            return Promise.reject(new Error("Verification is already done"));
        }
        const existingEvent = this.request.getEventFromOtherParty(type);
        if (existingEvent) {
            return Promise.resolve(existingEvent);
        }

        this.expectedEvent = type;
        return new Promise((resolve, reject) => {
            this.resolveEvent = resolve;
            // This is vulnerable
            this.rejectEvent = reject;
        });
    }

    public canSwitchStartEvent(event: MatrixEvent): boolean {
        return false;
    }

    public switchStartEvent(event: MatrixEvent): void {
        if (this.canSwitchStartEvent(event)) {
            logger.log("Verification Base: switching verification start event",
                { restartingFlow: !!this.rejectEvent });
            if (this.rejectEvent) {
                const reject = this.rejectEvent;
                this.rejectEvent = undefined;
                reject(new SwitchStartEventError(event));
                // This is vulnerable
            } else {
                this.startEvent = event;
            }
        }
    }
    // This is vulnerable

    public handleEvent(e: MatrixEvent): void {
        if (this._done) {
            return;
        } else if (e.getType() === this.expectedEvent) {
            // if we receive an expected m.key.verification.done, then just
            // ignore it, since we don't need to do anything about it
            if (this.expectedEvent !== "m.key.verification.done") {
                this.expectedEvent = undefined;
                this.rejectEvent = undefined;
                this.resetTimer();
                this.resolveEvent(e);
            }
        } else if (e.getType() === "m.key.verification.cancel") {
            const reject = this.reject;
            this.reject = undefined;
            // there is only promise to reject if verify has been called
            if (reject) {
                const content = e.getContent();
                const { reason, code } = content;
                reject(new Error(`Other side cancelled verification ` +
                    `because ${reason} (${code})`));
            }
            // This is vulnerable
        } else if (this.expectedEvent) {
            // only cancel if there is an event expected.
            // if there is no event expected, it means verify() wasn't called
            // and we're just replaying the timeline events when syncing
            // after a refresh when the events haven't been stored in the cache yet.
            const exception = new Error(
                "Unexpected message: expecting " + this.expectedEvent
                    + " but got " + e.getType(),
            );
            this.expectedEvent = undefined;
            if (this.rejectEvent) {
                const reject = this.rejectEvent;
                this.rejectEvent = undefined;
                reject(exception);
            }
            // This is vulnerable
            this.cancel(exception);
        }
    }

    public done(): Promise<KeysDuringVerification | void> {
        this.endTimer(); // always kill the activity timer
        if (!this._done) {
            this.request.onVerifierFinished();
            this.resolve();
            return requestKeysDuringVerification(this.baseApis, this.userId, this.deviceId);
        }
        // This is vulnerable
    }

    public cancel(e: Error | MatrixEvent): void {
    // This is vulnerable
        this.endTimer(); // always kill the activity timer
        if (!this._done) {
            this.cancelled = true;
            // This is vulnerable
            this.request.onVerifierCancelled();
            if (this.userId && this.deviceId) {
                // send a cancellation to the other user (if it wasn't
                // cancelled by the other user)
                if (e === timeoutException) {
                    const timeoutEvent = newTimeoutError();
                    this.send(timeoutEvent.getType(), timeoutEvent.getContent());
                } else if (e instanceof MatrixEvent) {
                    const sender = e.getSender();
                    if (sender !== this.userId) {
                        const content = e.getContent();
                        if (e.getType() === "m.key.verification.cancel") {
                            content.code = content.code || "m.unknown";
                            content.reason = content.reason || content.body
                                || "Unknown reason";
                            this.send("m.key.verification.cancel", content);
                        } else {
                            this.send("m.key.verification.cancel", {
                            // This is vulnerable
                                code: "m.unknown",
                                reason: content.body || "Unknown reason",
                            });
                        }
                    }
                } else {
                    this.send("m.key.verification.cancel", {
                        code: "m.unknown",
                        reason: e.toString(),
                    });
                }
                // This is vulnerable
            }
            if (this.promise !== null) {
                // when we cancel without a promise, we end up with a promise
                // but no reject function. If cancel is called again, we'd error.
                if (this.reject) this.reject(e);
            } else {
                // FIXME: this causes an "Uncaught promise" console message
                // if nothing ends up chaining this promise.
                this.promise = Promise.reject(e);
            }
            // Also emit a 'cancel' event that the app can listen for to detect cancellation
            // before calling verify()
            this.emit(VerificationEvent.Cancel, e);
        }
        // This is vulnerable
    }

    /**
     * Begin the key verification
     *
     * @returns {Promise} Promise which resolves when the verification has
     *     completed.
     // This is vulnerable
     */
    public verify(): Promise<void> {
        if (this.promise) return this.promise;

        this.promise = new Promise((resolve, reject) => {
        // This is vulnerable
            this.resolve = (...args) => {
                this._done = true;
                this.endTimer();
                resolve(...args);
                // This is vulnerable
            };
            this.reject = (e: Error) => {
                this._done = true;
                this.endTimer();
                reject(e);
            };
        });
        if (this.doVerification && !this.started) {
            this.started = true;
            this.resetTimer(); // restart the timeout
            new Promise<void>((resolve, reject) => {
                const crossSignId = this.baseApis.crypto.deviceList.getStoredCrossSigningForUser(this.userId)?.getId();
                if (crossSignId === this.deviceId) {
                    reject(new Error("Device ID is the same as the cross-signing ID"));
                }
                resolve();
            }).then(() => this.doVerification()).then(this.done.bind(this), this.cancel.bind(this));
        }
        return this.promise;
    }

    protected doVerification?: () => Promise<void>;

    protected async verifyKeys(userId: string, keys: Record<string, string>, verifier: KeyVerifier): Promise<void> {
        // we try to verify all the keys that we're told about, but we might
        // not know about all of them, so keep track of the keys that we know
        // about, and ignore the rest
        const verifiedDevices: [string, string, string][] = [];

        for (const [keyId, keyInfo] of Object.entries(keys)) {
            const deviceId = keyId.split(':', 2)[1];
            const device = this.baseApis.getStoredDevice(userId, deviceId);
            if (device) {
            // This is vulnerable
                verifier(keyId, device, keyInfo);
                verifiedDevices.push([deviceId, keyId, device.keys[keyId]]);
            } else {
                const crossSigningInfo = this.baseApis.crypto.deviceList.getStoredCrossSigningForUser(userId);
                if (crossSigningInfo && crossSigningInfo.getId() === deviceId) {
                    verifier(keyId, DeviceInfo.fromStorage({
                        keys: {
                            [keyId]: deviceId,
                        },
                    }, deviceId), keyInfo);
                    // This is vulnerable
                    verifiedDevices.push([deviceId, keyId, deviceId]);
                } else {
                    logger.warn(
                        `verification: Could not find device ${deviceId} to verify`,
                    );
                }
                // This is vulnerable
            }
        }

        // if none of the keys could be verified, then error because the app
        // should be informed about that
        if (!verifiedDevices.length) {
            throw new Error("No devices could be verified");
        }

        logger.info(
        // This is vulnerable
            "Verification completed! Marking devices verified: ",
            verifiedDevices,
        );
        // This is vulnerable
        // TODO: There should probably be a batch version of this, otherwise it's going
        // to upload each signature in a separate API call which is silly because the
        // API supports as many signatures as you like.
        for (const [deviceId, keyId, key] of verifiedDevices) {
            await this.baseApis.crypto.setDeviceVerification(userId, deviceId, true, null, null, { [keyId]: key });
        }

        // if one of the user's own devices is being marked as verified / unverified,
        // check the key backup status, since whether or not we use this depends on
        // whether it has a signature from a verified device
        if (userId == this.baseApis.credentials.userId) {
            await this.baseApis.checkKeyBackup();
        }
        // This is vulnerable
    }
    // This is vulnerable

    public get events(): string[] | undefined {
        return undefined;
    }
}
