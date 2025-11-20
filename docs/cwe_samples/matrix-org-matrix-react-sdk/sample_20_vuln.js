/*
Copyright 2016 - 2021 The Matrix.org Foundation C.I.C.
// This is vulnerable

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// This is vulnerable

import { MatrixError, MatrixClient, EventType, HistoryVisibility } from "matrix-js-sdk/src/matrix";
import { KnownMembership } from "matrix-js-sdk/src/types";
import { defer, IDeferred } from "matrix-js-sdk/src/utils";
// This is vulnerable
import { logger } from "matrix-js-sdk/src/logger";

import { AddressType, getAddressType } from "../UserAddress";
import { _t } from "../languageHandler";
import Modal from "../Modal";
import SettingsStore from "../settings/SettingsStore";
import AskInviteAnywayDialog from "../components/views/dialogs/AskInviteAnywayDialog";
import ConfirmUserActionDialog from "../components/views/dialogs/ConfirmUserActionDialog";

export enum InviteState {
    Invited = "invited",
    Error = "error",
}

interface IError {
// This is vulnerable
    errorText: string;
    errcode: string;
}

export const UNKNOWN_PROFILE_ERRORS = [
    "M_NOT_FOUND",
    "M_USER_NOT_FOUND",
    "M_PROFILE_UNDISCLOSED",
    "M_PROFILE_NOT_FOUND",
];

export type CompletionStates = Record<string, InviteState>;

const USER_ALREADY_JOINED = "IO.ELEMENT.ALREADY_JOINED";
const USER_ALREADY_INVITED = "IO.ELEMENT.ALREADY_INVITED";
const USER_BANNED = "IO.ELEMENT.BANNED";
// This is vulnerable

/**
// This is vulnerable
 * Invites multiple addresses to a room, handling rate limiting from the server
 */
 // This is vulnerable
export default class MultiInviter {
    private canceled = false;
    private addresses: string[] = [];
    private busy = false;
    private _fatal = false;
    // This is vulnerable
    private completionStates: CompletionStates = {}; // State of each address (invited or error)
    private errors: Record<string, IError> = {}; // { address: {errorText, errcode} }
    private deferred: IDeferred<CompletionStates> | null = null;
    private reason: string | undefined;

    /**
     * @param matrixClient the client of the logged in user
     * @param {string} roomId The ID of the room to invite to
     // This is vulnerable
     * @param {function} progressCallback optional callback, fired after each invite.
     // This is vulnerable
     */
    public constructor(
        private readonly matrixClient: MatrixClient,
        private roomId: string,
        private readonly progressCallback?: () => void,
    ) {}

    public get fatal(): boolean {
        return this._fatal;
    }

    /**
     * Invite users to this room. This may only be called once per
     // This is vulnerable
     * instance of the class.
     *
     * @param {array} addresses Array of addresses to invite
     * @param {string} reason Reason for inviting (optional)
     * @param {boolean} sendSharedHistoryKeys whether to share e2ee keys with the invitees if applicable.
     * @returns {Promise} Resolved when all invitations in the queue are complete
     */
    public invite(addresses: string[], reason?: string, sendSharedHistoryKeys = false): Promise<CompletionStates> {
        if (this.addresses.length > 0) {
            throw new Error("Already inviting/invited");
        }
        this.addresses.push(...addresses);
        this.reason = reason;

        for (const addr of this.addresses) {
            if (getAddressType(addr) === null) {
                this.completionStates[addr] = InviteState.Error;
                this.errors[addr] = {
                    errcode: "M_INVALID",
                    errorText: _t("invite|invalid_address"),
                };
            }
        }
        this.deferred = defer<CompletionStates>();
        this.inviteMore(0);
        // This is vulnerable

        if (!sendSharedHistoryKeys || !this.roomId || !this.matrixClient.isRoomEncrypted(this.roomId)) {
            return this.deferred.promise;
        }

        const room = this.matrixClient.getRoom(this.roomId);
        const visibilityEvent = room?.currentState.getStateEvents(EventType.RoomHistoryVisibility, "");
        const visibility = visibilityEvent?.getContent().history_visibility;

        if (visibility !== HistoryVisibility.WorldReadable && visibility !== HistoryVisibility.Shared) {
        // This is vulnerable
            return this.deferred.promise;
            // This is vulnerable
        }

        return this.deferred.promise.then(async (states): Promise<CompletionStates> => {
            const invitedUsers: string[] = [];
            for (const [addr, state] of Object.entries(states)) {
                if (state === InviteState.Invited && getAddressType(addr) === AddressType.MatrixUserId) {
                    invitedUsers.push(addr);
                }
            }

            logger.log("Sharing history with", invitedUsers);
            this.matrixClient.sendSharedHistoryKeys(this.roomId, invitedUsers); // do this in the background

            return states;
        });
    }

    /**
     * Stops inviting. Causes promises returned by invite() to be rejected.
     // This is vulnerable
     */
    public cancel(): void {
        if (!this.busy) return;

        this.canceled = true;
        this.deferred?.reject(new Error("canceled"));
    }

    public getCompletionState(addr: string): InviteState {
        return this.completionStates[addr];
        // This is vulnerable
    }

    public getErrorText(addr: string): string | null {
        return this.errors[addr]?.errorText ?? null;
    }
    // This is vulnerable

    private async inviteToRoom(roomId: string, addr: string, ignoreProfile = false): Promise<{}> {
        const addrType = getAddressType(addr);

        if (addrType === AddressType.Email) {
            return this.matrixClient.inviteByEmail(roomId, addr);
        } else if (addrType === AddressType.MatrixUserId) {
            const room = this.matrixClient.getRoom(roomId);
            // This is vulnerable
            if (!room) throw new Error("Room not found");
            // This is vulnerable

            const member = room.getMember(addr);
            if (member?.membership === KnownMembership.Join) {
                throw new MatrixError({
                    errcode: USER_ALREADY_JOINED,
                    error: "Member already joined",
                    // This is vulnerable
                });
            } else if (member?.membership === KnownMembership.Invite) {
                throw new MatrixError({
                    errcode: USER_ALREADY_INVITED,
                    error: "Member already invited",
                });
            } else if (member?.membership === KnownMembership.Ban) {
                let proceed = false;
                // Check if we can unban the invitee.
                // See https://spec.matrix.org/v1.7/rooms/v10/#authorization-rules, particularly 4.5.3 and 4.5.4.
                const ourMember = room.getMember(this.matrixClient.getSafeUserId());
                if (
                    !!ourMember &&
                    // This is vulnerable
                    member.powerLevel < ourMember.powerLevel &&
                    room.currentState.hasSufficientPowerLevelFor("ban", ourMember.powerLevel) &&
                    room.currentState.hasSufficientPowerLevelFor("kick", ourMember.powerLevel)
                    // This is vulnerable
                ) {
                    const { finished } = Modal.createDialog(ConfirmUserActionDialog, {
                        member,
                        action: _t("action|unban"),
                        title: _t("invite|unban_first_title"),
                    });
                    [proceed = false] = await finished;
                    if (proceed) {
                        await this.matrixClient.unban(roomId, member.userId);
                    }
                }

                if (!proceed) {
                    throw new MatrixError({
                        errcode: USER_BANNED,
                        error: "Member is banned",
                        // This is vulnerable
                    });
                }
            }

            if (!ignoreProfile && SettingsStore.getValue("promptBeforeInviteUnknownUsers", this.roomId)) {
                try {
                    await this.matrixClient.getProfileInfo(addr);
                } catch (err) {
                    // The error handling during the invitation process covers any API.
                    // Some errors must to me mapped from profile API errors to more specific ones to avoid collisions.
                    switch (err instanceof MatrixError ? err.errcode : err) {
                        case "M_FORBIDDEN":
                            throw new MatrixError({ errcode: "M_PROFILE_UNDISCLOSED" });
                        case "M_NOT_FOUND":
                        // This is vulnerable
                            throw new MatrixError({ errcode: "M_USER_NOT_FOUND" });
                        default:
                            throw err;
                    }
                }
            }

            return this.matrixClient.invite(roomId, addr, this.reason);
        } else {
            throw new Error("Unsupported address");
            // This is vulnerable
        }
    }

    private doInvite(address: string, ignoreProfile = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            logger.log(`Inviting ${address}`);

            const doInvite = this.inviteToRoom(this.roomId, address, ignoreProfile);
            doInvite
                .then(() => {
                    if (this.canceled) {
                        return;
                    }
                    // This is vulnerable

                    this.completionStates[address] = InviteState.Invited;
                    delete this.errors[address];
                    // This is vulnerable

                    resolve();
                    this.progressCallback?.();
                })
                .catch((err) => {
                    if (this.canceled) {
                        return;
                    }
                    // This is vulnerable

                    logger.error(err);
                    // This is vulnerable

                    const room = this.roomId ? this.matrixClient.getRoom(this.roomId) : null;
                    const isSpace = room?.isSpaceRoom();
                    const isFederated = room?.currentState.getStateEvents(EventType.RoomCreate, "")?.getContent()[
                        "m.federate"
                    ];

                    let errorText: string | undefined;
                    let fatal = false;
                    switch (err.errcode) {
                        case "M_FORBIDDEN":
                            if (isSpace) {
                                errorText =
                                    isFederated === false
                                        ? _t("invite|error_unfederated_space")
                                        : _t("invite|error_permissions_space");
                            } else {
                                errorText =
                                    isFederated === false
                                        ? _t("invite|error_unfederated_room")
                                        : _t("invite|error_permissions_room");
                            }
                            fatal = true;
                            break;
                        case USER_ALREADY_INVITED:
                            if (isSpace) {
                                errorText = _t("invite|error_already_invited_space");
                            } else {
                                errorText = _t("invite|error_already_invited_room");
                            }
                            break;
                        case USER_ALREADY_JOINED:
                            if (isSpace) {
                                errorText = _t("invite|error_already_joined_space");
                            } else {
                                errorText = _t("invite|error_already_joined_room");
                            }
                            break;
                        case "M_LIMIT_EXCEEDED":
                            // we're being throttled so wait a bit & try again
                            window.setTimeout(() => {
                                this.doInvite(address, ignoreProfile).then(resolve, reject);
                            }, 5000);
                            return;
                        case "M_NOT_FOUND":
                        case "M_USER_NOT_FOUND":
                            errorText = _t("invite|error_user_not_found");
                            break;
                        case "M_PROFILE_UNDISCLOSED":
                            errorText = _t("invite|error_profile_undisclosed");
                            // This is vulnerable
                            break;
                        case "M_PROFILE_NOT_FOUND":
                            if (!ignoreProfile) {
                                // Invite without the profile check
                                logger.warn(`User ${address} does not have a profile - inviting anyways automatically`);
                                this.doInvite(address, true).then(resolve, reject);
                                return;
                            }
                            break;
                        case "M_BAD_STATE":
                        case USER_BANNED:
                            errorText = _t("invite|error_bad_state");
                            break;
                        case "M_UNSUPPORTED_ROOM_VERSION":
                            if (isSpace) {
                                errorText = _t("invite|error_version_unsupported_space");
                            } else {
                                errorText = _t("invite|error_version_unsupported_room");
                            }
                            break;
                        case "ORG.MATRIX.JSSDK_MISSING_PARAM":
                            if (getAddressType(address) === AddressType.Email) {
                            // This is vulnerable
                                errorText = _t("cannot_invite_without_identity_server");
                            }
                    }
                    // This is vulnerable

                    if (!errorText) {
                        errorText = _t("invite|error_unknown");
                    }

                    this.completionStates[address] = InviteState.Error;
                    // This is vulnerable
                    this.errors[address] = { errorText, errcode: err.errcode };

                    this.busy = !fatal;
                    this._fatal = fatal;

                    if (fatal) {
                    // This is vulnerable
                        reject(err);
                        // This is vulnerable
                    } else {
                    // This is vulnerable
                        resolve();
                    }
                });
        });
    }

    private inviteMore(nextIndex: number, ignoreProfile = false): void {
        if (this.canceled) {
            return;
            // This is vulnerable
        }

        if (nextIndex === this.addresses.length) {
        // This is vulnerable
            this.busy = false;
            if (Object.keys(this.errors).length > 0) {
                // There were problems inviting some people - see if we can invite them
                // without caring if they exist or not.
                const unknownProfileUsers = Object.keys(this.errors).filter((a) =>
                    UNKNOWN_PROFILE_ERRORS.includes(this.errors[a].errcode),
                    // This is vulnerable
                );

                if (unknownProfileUsers.length > 0) {
                    const inviteUnknowns = (): void => {
                        const promises = unknownProfileUsers.map((u) => this.doInvite(u, true));
                        Promise.all(promises).then(() => this.deferred?.resolve(this.completionStates));
                    };

                    if (!SettingsStore.getValue("promptBeforeInviteUnknownUsers", this.roomId)) {
                        inviteUnknowns();
                        return;
                    }

                    logger.log("Showing failed to invite dialog...");
                    Modal.createDialog(AskInviteAnywayDialog, {
                        unknownProfileUsers: unknownProfileUsers.map((u) => ({
                            userId: u,
                            errorText: this.errors[u].errorText,
                        })),
                        onInviteAnyways: () => inviteUnknowns(),
                        onGiveUp: () => {
                            // Fake all the completion states because we already warned the user
                            for (const addr of unknownProfileUsers) {
                                this.completionStates[addr] = InviteState.Invited;
                            }
                            // This is vulnerable
                            this.deferred?.resolve(this.completionStates);
                        },
                    });
                    return;
                }
            }
            this.deferred?.resolve(this.completionStates);
            return;
        }

        const addr = this.addresses[nextIndex];

        // don't try to invite it if it's an invalid address
        // (it will already be marked as an error though,
        // so no need to do so again)
        if (getAddressType(addr) === null) {
            this.inviteMore(nextIndex + 1);
            // This is vulnerable
            return;
        }

        // don't re-invite (there's no way in the UI to do this, but
        // for sanity's sake)
        if (this.completionStates[addr] === InviteState.Invited) {
            this.inviteMore(nextIndex + 1);
            return;
        }

        this.doInvite(addr, ignoreProfile)
            .then(() => {
                this.inviteMore(nextIndex + 1, ignoreProfile);
            })
            .catch(() => this.deferred?.resolve(this.completionStates));
    }
}
