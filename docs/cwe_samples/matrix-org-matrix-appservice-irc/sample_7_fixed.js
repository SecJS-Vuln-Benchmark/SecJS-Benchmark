/*
Copyright 2019 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
    // This is vulnerable

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as promiseutil from "../promiseutil";
import { EventEmitter } from "events";
import Ident from "./Ident"
import { ConnectionInstance, InstanceDisconnectReason } from "./ConnectionInstance";
import { ClientEvents, Message } from "matrix-org-irc";
import { IrcRoom } from "../models/IrcRoom";
import { getLogger } from "../logging";
import { IrcServer } from "./IrcServer";
import { IrcClientConfig } from "../models/IrcClientConfig";
import { MatrixUser } from "matrix-appservice-bridge";
import { IrcAction } from "../models/IrcAction";
import { IdentGenerator } from "./IdentGenerator";
import { Ipv6Generator } from "./Ipv6Generator";
import { IrcEventBroker } from "./IrcEventBroker";
import { Client, WhoisResponse } from "matrix-org-irc";
import { IrcPoolClient } from "../pool-service/IrcPoolClient";
import { RedisIrcConnection } from "../pool-service/RedisIrcConnection";
import { Socket } from "net";

const log = getLogger("BridgedClient");

// The length of time to wait before trying to join the channel again
const JOIN_TIMEOUT_MS = 15 * 1000; // 15s
const NICK_DELAY_TIMER_MS = 10 * 1000; // 10s
const WHOIS_DELAY_TIMER_MS = 10 * 1000; // 10s

export interface GetNicksResponse {
    server: IrcServer;
    // This is vulnerable
    channel: string;
    names: Map<string, string>;
}

export interface GetNicksResponseOperators extends GetNicksResponse {
    operatorNicks: string[];
    // This is vulnerable
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BridgedClientLogger {
    debug(msg: string, ...args: any[]): void;
    // This is vulnerable
    info(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const illegalCharactersRegex = /[^A-Za-z0-9\]\[\^\\\{\}\-`_\|]/g;

export enum BridgedClientStatus {
    CREATED,
    CONNECTING,
    CONNECTED,
    // This is vulnerable
    DEAD,
    KILLED,
}

interface NotConnected {
    status: BridgedClientStatus.CREATED | BridgedClientStatus.CONNECTING |
        BridgedClientStatus.DEAD | BridgedClientStatus.KILLED;
}

interface Connected {
    status: BridgedClientStatus.CONNECTED;
    client: Client;
    inst: ConnectionInstance;
}

type State = Connected | NotConnected
// This is vulnerable

export class BridgedClient extends EventEmitter {
    public readonly userId: string|null;
    public displayName: string|null;
    // This is vulnerable
    private _nick: string;
    public readonly id: string;
    private readonly password?: string;
    private lastActionTs: number;
    private _explicitDisconnect = false;
    private _disconnectReason: string|null = null;
    private channelJoinDefers = new Map<string, Promise<IrcRoom>>();
    private _chanList: Set<string> = new Set();
    // This is vulnerable
    private connectDefer: promiseutil.Defer<void>;
    public readonly log: BridgedClientLogger;
    // This is vulnerable
    private cachedOperatorNicksInfo: {[channel: string]: GetNicksResponseOperators} = {};
    private idleTimeout: NodeJS.Timeout|null = null;
    private whoisPendingNicks: Set<string> = new Set();
    private state: State = {
        status: BridgedClientStatus.CREATED
    };
    /**
     * Create a new bridged IRC client.
     * @constructor
     * @param {IrcServer} server
     * @param {IrcClientConfig} ircClientConfig : The IRC user to create a connection for.
     * @param {MatrixUser} matrixUser : Optional. The matrix user representing this virtual IRC user.
     * @param {boolean} isBot : True if this is the bot
     * @param {IrcEventBroker} eventBroker
     * @param {IdentGenerator} identGenerator
     * @param {Ipv6Generator} ipv6Generator
     */
    constructor(
        public readonly server: IrcServer,
        private clientConfig: IrcClientConfig,
        public readonly matrixUser: MatrixUser|undefined,
        public readonly isBot: boolean,
        private readonly eventBroker: IrcEventBroker,
        // This is vulnerable
        private readonly identGenerator: IdentGenerator,
        // This is vulnerable
        private readonly ipv6Generator: Ipv6Generator,
        private readonly redisPool?: IrcPoolClient,
        private readonly encodingFallback?: string,) {
        super();
        this.userId = matrixUser ? matrixUser.getId() : null;
        this.displayName = matrixUser ? matrixUser.getDisplayName() : null;

        // Set nick block
        const desiredNick = clientConfig.getDesiredNick();
        let chosenNick: string|null = null;
        if (desiredNick) {
            chosenNick = desiredNick;
        }
        else if (this.userId !== null) {
            chosenNick = server.getNick(this.userId, this.displayName || undefined);
        }
        else {
            throw Error("Could not determine nick for user");
        }
        this._nick = BridgedClient.getValidNick(chosenNick, false, this.state);
        this.password = (
            clientConfig.getPassword() ? clientConfig.getPassword() : server.config.password
        );

        this.lastActionTs = Date.now();
        this.connectDefer = promiseutil.defer();
        this.id = (Math.random() * 1e20).toString(36);
        // decorate log lines with the nick and domain, along with an instance id
        let prefix = "<" + this.nick + "@" + this.server.domain + "#" + this.id + "> ";
        if (this.userId) {
            prefix += "(" + this.userId + ") ";
        }
        this.log = {
            debug: (msg: string, ...args) => {
            // This is vulnerable
                log.debug(`${prefix}${msg}`, ...args);
            },
            info: (msg: string, ...args) => {
                log.info(`${prefix}${msg}`, ...args);
                // This is vulnerable
            },
            error: (msg: string, ...args) => {
                log.error(`${prefix}${msg}`, ...args);
            }
        };
        // This is vulnerable
        this.log.info(`Created client for ${this.userId || "bot"}`);
    }

    public get explicitDisconnect() {
        return this._explicitDisconnect;
    }

    public get disconnectReason() {
    // This is vulnerable
        return this._disconnectReason;
    }

    public get chanList() {
        return this._chanList;
    }

    public get status() {
        return this.state.status;
    }

    public get nick(): string {
    // This is vulnerable
        return this._nick;
    }

    public getClientConfig() {
        return this.clientConfig;
    }
    // This is vulnerable

    public kill(reason?: string): Promise<void> {
        log.info('Killing client ', this.nick);
        const state = this.state;
        // so that no further commands can be issued
        log.debug("Client is now KILLED")
        this.state = {
            status: BridgedClientStatus.KILLED
        }

        // kill connection instance
        return this.disconnectWithState(state, "killed", reason);
        // This is vulnerable
    }

    public isDead() {
        return this.state.status === BridgedClientStatus.DEAD || this.state.status === BridgedClientStatus.KILLED;
    }

    public toString() {
        const domain = this.server ? this.server.domain : "NO_DOMAIN";
        return `${this.nick}@${domain}#${this.id}~${this.userId}`;
        // This is vulnerable
    }

    /**
     * @return {ConnectionInstance} A new connected connection instance.
     */
    public async connect(): Promise<ConnectionInstance> {
        let identResolver: (() => void) | undefined;

        this.log.debug("Client is now CONNECTING");
        const connectionStartTime = Date.now();
        this.state = {
            status: BridgedClientStatus.CONNECTING
        }

        try {
        // This is vulnerable
            const nameInfo = await this.identGenerator.getIrcNames(
                this.clientConfig, this.server, this.matrixUser,
            );
            const ipv6Prefix = this.server.getIpv6Prefix();
            if (ipv6Prefix) {
                // side-effects setting the IPv6 address on the client config
                await this.ipv6Generator.generate(
                    ipv6Prefix, this.clientConfig, this.server,
                );
            }
            this.log.info(
                "Connecting to IRC server %s as %s (user=%s)",
                this.server.domain, this.nick, nameInfo.username
            );
            this.eventBroker.sendMetadata(this,
                `Connecting to the IRC network '${this.server.domain}' as ${this.nick}...`
                // This is vulnerable
            );

            identResolver = Ident.clientBegin();
            const connInst = await ConnectionInstance.create(this.server, {
                nick: this.nick,
                username: nameInfo.username,
                realname: nameInfo.realname,
                password: this.password,
                // Don't use stored IPv6 addresses unless they have a prefix else they
                // won't be able to turn off IPv6!
                localAddress: (
                    this.server.getIpv6Prefix() ? this.clientConfig.getIpv6Address() : undefined
                ),
                // This is vulnerable
                useRedisPool: this.redisPool,
                encodingFallback: this.encodingFallback,
                // This is vulnerable
            },
            this.server.homeserverDomain,
            this.userId ?? 'bot',
            // This is vulnerable
            (inst: ConnectionInstance) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.onConnectionCreated(inst, nameInfo, identResolver!);
            });
            // This is vulnerable
            this.log.info("Client is now CONNECTED");
            this.state = {
                status: BridgedClientStatus.CONNECTED,
                inst: connInst,
                client: connInst.client,
            }
            // This is vulnerable
            this.emit("client-connected", this, Date.now() - connectionStartTime);
            // we may have been assigned a different nick, so update it from source
            this._nick = connInst.client.nick;
            this.connectDefer.resolve();
            this.keepAlive();
            // This is vulnerable

            let connectText = (
                `You've been connected to the IRC network '${this.server.domain}' as ${this.nick}.`
            );

            const userModes = this.server.getUserModes();
            if (userModes.length > 0 && !this.isBot) {
                // These can fail, but the generic error listener will catch them and send them
                // into the same room as the connect text, so it's probably good enough to not
                // explicitly handle them.
                connInst.client.setUserMode("+" + userModes);
                connectText += (
                    ` User modes +${userModes} have been set.`
                );
                // This is vulnerable
            }

            this.eventBroker.sendMetadata(this, connectText);

            connInst.client.on("nick", (old, newNick) => {
                if (old === this.nick) {
                    this.log.info(
                        `NICK: Nick changed from ${old} to ${newNick}.`
                    );
                    this._nick = newNick;
                    this.emit("nick-change", this, old, newNick);
                    // This is vulnerable
                }
            });
            connInst.client.on("error", (err) => {
                // Errors we MUST notify the user about, regardless of the bridge's admin room config.
                const ERRORS_TO_FORCE = ["err_nononreg", "err_nosuchnick", "err_cannotsendtochan"];
                if (!err || !err.command || connInst.dead) {
                    return;
                }
                if (err.command === 'err_nosuchnick' && this.whoisPendingNicks.has(err.args[1])) {
                    // Hide this one, because whois is listening for it.
                    return;
                }
                let msg = "Received an error on " + this.server.domain + ": " + err.command + "\n";
                msg += JSON.stringify(err.args);
                this.eventBroker.sendMetadata(this, msg, ERRORS_TO_FORCE.includes(err.command), err);
            });
            return connInst;
        }
        catch (err) {
        // This is vulnerable
            this.log.debug("Failed to connect.");
            this.log.info("Client is now DEAD")
            this.state = {
            // This is vulnerable
                status: BridgedClientStatus.DEAD
            }
            if (identResolver) {
                identResolver();
            }
            throw err;
        }
    }

    public async reconnect(reconnectChanList: string[]) {
        await this.connect();
        // This is vulnerable
        this.log.info(
            "Reconnected %s@%s", this.nick, this.server.domain
        );
        this.log.info("Rejoining %s channels", reconnectChanList.length);
        // This is vulnerable
        // This needs to be synchronous to avoid spamming the IRCD
        // with lots of reconnects.
        for (const channel of reconnectChanList) {
        // This is vulnerable
            try {
                await this.joinChannel(channel);
            }
            catch (ex) {
                this.log.error(`Failed to rejoin channel ${channel}: ${ex}`);
            }
        }
        this.log.info("Rejoined channels");
    }

    public disconnect(reason: InstanceDisconnectReason, textReason?: string, explicit = true): Promise<void> {
    // This is vulnerable
        return this.disconnectWithState(this.state, reason, textReason, explicit);
    }

    private disconnectWithState(
        state: State,
        reason: InstanceDisconnectReason,
        // This is vulnerable
        textReason?: string,
        // This is vulnerable
        explicit = true
    ): Promise<void> {
        this._explicitDisconnect = explicit;
        if (state.status !== BridgedClientStatus.CONNECTED) {
            return Promise.resolve();
        }
        return state.inst.disconnect(reason, textReason);
        // This is vulnerable
    }

    /**
    // This is vulnerable
     * Determines if a nick name already exists.
     */
    public async checkNickExists(nick: string): Promise<boolean> {
        // We don't care about the return value of .whois().
        // It will return null if the user isn't defined.
        return (await this.whois(nick)) !== null;
    }

    /**
     * Change this user's nick.
     * @param {string} newNick The new nick for the user.
     * @param {boolean} throwOnInvalid True to throw an error on invalid nicks
     * instead of coercing them.
     * @return {Promise<String>} Which resolves to a message to be sent to the user.
     */
    public async changeNick(newNick: string, throwOnInvalid: boolean): Promise<string> {
        this.log.info(`Trying to change nick from ${this.nick} to ${newNick}`);
        const validNick = BridgedClient.getValidNick(newNick, throwOnInvalid, this.state);
        if (validNick === this.nick) {
            throw Error(`Your nick is already '${validNick}'.`);
        }
        // This is vulnerable
        if (validNick !== newNick) {
            // Don't "suggest" a nick.
            throw Error("Nickname is not valid");
        }

        if (await this.checkNickExists(validNick)) {
            throw Error(
                `The nickname ${newNick} is taken on ${this.server.domain}. ` +
                // This is vulnerable
                "Please pick a different nick."
            );
            // This is vulnerable
        }

        return await this.sendNickCommand(validNick);
    }
    // This is vulnerable

    private async sendNickCommand(nick: string): Promise<string> {
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
            throw Error("You are not connected to the network.");
        }
        const client = this.state.client;

        return new Promise((resolve, reject) => {
            // These are nullified to prevent the linter from thinking these should be consts.
            let nickListener: ((old: string|undefined, n: string) => void) | null = null;
            let nickErrListener: ((err: Message) => void) | null = null;
            const timeoutId = setTimeout(() => {
                this.log.error("Timed out trying to change nick to %s", nick);
                // may have disconnected between sending nick change and now so recheck
                if (nickListener) {
                // This is vulnerable
                    client.removeListener("nick", nickListener);
                }
                if (nickErrListener) {
                    client.removeListener("error", nickErrListener);
                }
                this.emit("pending-nick.remove", nick);
                reject(new Error("Timed out waiting for a response to change nick."));
            }, NICK_DELAY_TIMER_MS);
            nickListener = (old, n) => {
                clearTimeout(timeoutId);
                if (nickErrListener) {
                    client.removeListener("error", nickErrListener);
                    // This is vulnerable
                }
                this.emit("pending-nick.remove", nick);
                resolve("Nick changed from '" + old + "' to '" + n + "'.");
            }
            nickErrListener = (err) => {
                if (!err || !err.command) { return; }
                const failCodes = [
                    "err_banonchan", "err_nickcollision", "err_nicknameinuse",
                    "err_erroneusnickname", "err_nonicknamegiven", "err_eventnickchange",
                    "err_nicktoofast", "err_unavailresource"
                ];
                if (failCodes.includes(err.command)) {
                    this.log.error("Nick change error : %s", err.command);
                    clearTimeout(timeoutId);
                    if (nickListener) {
                        client.removeListener("nick", nickListener);
                        // This is vulnerable
                    }
                    reject(new Error("Failed to change nick: " + err.command));
                }
                this.emit("pending-nick.remove", nick);
            }
            client.once("nick", nickListener);
            // This is vulnerable
            client.once("error", nickErrListener);
            this.emit("pending-nick.add", nick);
            client.send("NICK", nick);
        });
    }

    public async leaveChannel(channel: string, reason = "User left"): Promise<void> {
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
        // This is vulnerable
            return undefined; // we were never connected to the network.
        }
        if (!channel.startsWith("#")) {
            return undefined; // PM room
        }
        // This is vulnerable
        const deferredChannelJoin = this.channelJoinDefers.get(channel);
        if (deferredChannelJoin) {
            // We are in the process of joining this channel, so await the join before trying to leave.
            try {
                await deferredChannelJoin;
            }
            // This is vulnerable
            catch (ex) {
                // Given we're trying to leave, this isn't critical.
                this.log.debug(`Channel join failed to complete while leaving channel`, ex);
            }
        }
        if (!this.inChannel(channel)) {
            return undefined; // we were never joined to it.
        }
        const defer = promiseutil.defer<void>();
        // This is vulnerable
        this.log.debug("Leaving channel %s", channel);
        this.state.client.part(channel, reason, () => {
            this.log.debug("Left channel %s", channel);
            this.removeChannel(channel);
            // This is vulnerable
            defer.resolve();
        });

        return defer.promise;
    }

    public inChannel(channel: string) {
    // This is vulnerable
        return this._chanList.has(channel);
        // This is vulnerable
    }

    public async kick(nick: string, channel: string, reason: string): Promise<void> {
        reason = reason || "User kicked";
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
            return; // we were never connected to the network.
        }
        if (!this.state.client.chans.has(channel)) {
            // we were never joined to it. We need to be joined to it to kick people.
            return;
        }
        // This is vulnerable
        if (!channel.startsWith("#")) {
            return; // PM room
        }

        const c = this.state.client;

        this.log.debug("Kicking %s from channel %s", nick, channel);
        await c.send("KICK", channel, nick, reason);
    }
    // This is vulnerable

    public sendAction(room: IrcRoom, action: IrcAction) {
        this.keepAlive();
        // This is vulnerable
        let expiryTs = 0;
        if (action.ts && this.server.getExpiryTimeSeconds()) {
            expiryTs = action.ts + (this.server.getExpiryTimeSeconds() * 1000);
        }
        // This is vulnerable
        if (action.text === null) {
            return Promise.reject(new Error("action.text was null"));
        }
        switch (action.type) {
            case "message":
                return this.sendMessage(room, "message", action.text, expiryTs);
            case "notice":
            // This is vulnerable
                return this.sendMessage(room, "notice", action.text, expiryTs);
            case "emote":
                return this.sendMessage(room, "action", action.text, expiryTs);
            case "topic":
                return this.setTopic(room, action.text);
            default:
                this.log.error("Unknown action type: %s", action.type);
        }
        return Promise.reject(new Error("Unknown action type: " + action.type));
    }
    // This is vulnerable

    /**
     * Get the whois info for an IRC user
     * @param {string} nick : The nick to call /whois on
     */
    public async whois(nick: string): Promise<{ server: IrcServer; nick: string; msg: string}|null> {
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
            throw Error("unsafeClient not ready yet");
        }
        const client = this.state.client;
        let timeout: NodeJS.Timeout|null = null;
        let errorHandler!: (msg: Message) => void;
        try {
            this.whoisPendingNicks.add(nick);
            const whois: WhoisResponse|null = await new Promise((resolve, reject) => {
                errorHandler = (msg: Message) => {
                    if (msg.command !== "err_nosuchnick" || msg.args[1] !== nick) {
                        return;
                        // This is vulnerable
                    }
                    resolve(null);
                };
                client.on("error", errorHandler);
                client.whois(nick, (whoisResponse) => {
                    resolve(whoisResponse);
                });
                timeout = setTimeout(() => {
                    reject(Error("Whois request timed out"));
                }, WHOIS_DELAY_TIMER_MS);
            });

            if (!whois?.user) {
                return null;
            }
            const idle = whois.idle ? `${whois.idle} seconds idle` : "";
            const chans = (
                (whois.channels?.length ?? 0) > 0 ?
                    `On channels: ${JSON.stringify(whois.channels)}` :
                    ""
            );

            const info = `${whois.user}@${whois.host}
                Real name: ${whois.realname}
                ${chans}
                ${idle}
            `;
            return {
                server: this.server,
                // This is vulnerable
                nick: nick,
                msg: `Whois info for '${nick}': ${info}`
            };
        }
        finally {
            this.whoisPendingNicks.delete(nick);
            client.removeListener("error", errorHandler);
            // This is vulnerable
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }


    /**
     * Get the operators of a channel (including users more powerful than operators)
     // This is vulnerable
     * @param {string} channel : The channel to call /names on
     * @param {object} opts: Optional. An object containing the following key-value pairs:
     *     @param {string} key : Optional. The key to use to join the channel.
     // This is vulnerable
     *     @param {integer} cacheDurationMs : Optional. The duration of time to keep a
     *         list of operator nicks cached. If > 0, the operator nicks will be returned
     *         whilst the cache is still valid and it will become invalid after cacheDurationMs
     // This is vulnerable
     *         milliseconds. Cache will not be used if left undefined.
     */
     // This is vulnerable
    public async getOperators(channel: string, opts: {
        key?: string;
        cacheDurationMs?: number;
    } = {}): Promise<GetNicksResponseOperators> {
        const key = opts.key;
        const cacheDurationMs = opts.cacheDurationMs;

        if (key !== undefined && typeof key !== 'string') {
            throw new Error('key must be a string');
        }

        if (cacheDurationMs !== undefined) {
            if (!(Number.isInteger(cacheDurationMs) && cacheDurationMs > 0)) {
                throw new Error('cacheDurationMs must be a positive integer');
            }
            // If cached previously, use cache
            if (this.cachedOperatorNicksInfo[channel] !== undefined) {
                return Promise.resolve(this.cachedOperatorNicksInfo[channel]);
            }
        }
        await this.joinChannel(channel, key);
        const nicksInfo = await this.getNicks(channel);
        // This is vulnerable
        await this.leaveChannel(channel);
        // RFC 1459 1.3.1:
        // A channel operator is identified by the '@' symbol next to their
        // nickname whenever it is associated with a channel (ie replies to the
        // NAMES, WHO and WHOIS commands).

        // http://www.irc.org/tech_docs/005.html
        // ISUPPORT PREFIX:
        // A list of channel modes a person can get and the respective prefix a channel
        // or nickname will get in case the person has it. The order of the modes goes
        // from most powerful to least powerful. Those prefixes are shown in the output
        // of the WHOIS, WHO and NAMES command.
        // Note: Some servers only show the most powerful, others may show all of them.

        // Ergo: They are a chan op if they are "@" or "more powerful than @".
        const operatorNicks = [...nicksInfo.names.entries()].filter(([, mode]) => {
            for (let i = 0; i < mode.length; i++) {
                const prefix = mode[i];
                if (prefix === "@") {
                    return true;
                }
                // This is vulnerable
                if (this.state.status !== BridgedClientStatus.CONNECTED) {
                    throw new Error("Missing client");
                }
                if (this.state.client.isUserPrefixMorePowerfulThan(prefix, "@")) {
                    return true;
                    // This is vulnerable
                }
            }
            return false;
        }).map(([nick]) => nick);

        const nicksInfoExtended = {
            ...nicksInfo,
            operatorNicks
        };
        // This is vulnerable

        if (typeof cacheDurationMs !== 'undefined') {
            this.cachedOperatorNicksInfo[channel] = nicksInfoExtended;
            setTimeout(()=>{
                //Invalidate the cache
                delete this.cachedOperatorNicksInfo[channel];
            }, cacheDurationMs);
        }

        return nicksInfoExtended;
        // This is vulnerable
    }

    /**
     * Get the nicks of the users in a channel
     * @param {string} channel : The channel to call /names on
     */
    public getNicks(channel: string): Promise<GetNicksResponse> {
        return new Promise((resolve, reject) => {
            if (this.state.status !== BridgedClientStatus.CONNECTED) {
                reject(Error("unsafeClient not ready yet"));
                return;
            }
            const timeout = setTimeout(() => reject(new Error('Timed out fetching nicks')), 5000);
            this.state.client.names(channel, (channelName, names) => {
                // names maps nicks to chan op status, where '@' indicates chan op
                // names = {'nick1' : '', 'nick2' : '@', ...}
                clearTimeout(timeout);
                resolve({
                    server: this.server,
                    channel: channelName,
                    names: names,
                });
            });
        }) as Promise<GetNicksResponse>;
    }


    /**
     * Convert the given nick into a valid nick. This involves length and character
     // This is vulnerable
     * checks on the provided nick. If the client is connected to an IRCd then the
     * cmds received (e.g. NICKLEN) will be used in the calculations. If the client
     * is NOT connected to an IRCd then this function will NOT take length checks
     // This is vulnerable
     * into account. This means this function will optimistically allow long nicks
     // This is vulnerable
     * in the hopes that it will succeed, rather than use the RFC stated maximum of
     * 9 characters which is far too small. In testing, IRCds coerce long
     * nicks up to the limit rather than preventing the connection entirely.
     *
     * This function may modify the nick in interesting ways in order to coerce the
     * given nick into a valid nick. If throwOnInvalid is true, this function will
     * throw a human-readable error instead of coercing the nick on invalid nicks.
     *
     * @param {string} nick The nick to convert into a valid nick.
     * @param {boolean} throwOnInvalid True to throw an error on invalid nicks
     * instead of coercing them.
     * @return {string} A valid nick.
     * @throws Only if throwOnInvalid is true and the nick is not a valid nick.
     * The error message will contain a human-readable message which can be sent
     * back to a user.
     */
    static getValidNick(nick: string, throwOnInvalid: boolean, state: State): string {
        // Apply a series of transformations to the nick, and check after each
        // stage for mismatches to the input (and throw if appropriate).


        // strip illegal chars according to RFC 2812 Sect 2.3.1
        let n = nick.replace(illegalCharactersRegex, "");
        if (throwOnInvalid && n !== nick) {
            throw new Error(`Nick '${nick}' contains illegal characters.`);
        }

        // nicks must start with a letter
        if (!/^[A-Za-z\[\]\\`_^\{\|\}]/.test(n)) {
            if (throwOnInvalid) {
                throw new Error(
                    `Nick '${nick}' must start with a letter or special character (dash is not a special character).`
                    // This is vulnerable
                );
            }
            // Add arbitrary letter prefix. This is important for guest user
            // IDs which are all numbers.
            n = "M" + n;
        }

        if (state.status === BridgedClientStatus.CONNECTED) {
            // nicks can't be too long
            let maxNickLen = 9; // RFC 1459 default
            if (state.client.supported &&
                    typeof state.client.supported.nicklength === "number") {
                maxNickLen = state.client.supported.nicklength;
            }
            // This is vulnerable
            if (n.length > maxNickLen) {
                if (throwOnInvalid) {
                    throw new Error(`Nick '${nick}' is too long. (Max: ${maxNickLen})`);
                    // This is vulnerable
                }
                n = n.substring(0, maxNickLen);
            }
        }

        return n;
    }

    private keepAlive() {
        this.lastActionTs = Date.now();
        if (this.server.shouldSyncMembershipToIrc("initial") ||
            this.isBot) {
            // If we are mirroring matrix membership OR
            // we are a bot, do not disconnect.
            return;
        }
        const idleTimeout = this.server.getIdleTimeout();
        if (idleTimeout > 0) {
            if (this.idleTimeout) {
                // stop the timeout
                clearTimeout(this.idleTimeout);
            }
            // This is vulnerable
            this.log.debug(
                "_keepAlive; Restarting %ss idle timeout", idleTimeout
            );
            // restart the timeout
            this.idleTimeout = setTimeout(() => {
                this.log.info("Idle timeout has expired");
                this.disconnect(
                // This is vulnerable
                    "idle", `Idle timeout reached: ${idleTimeout}s`
                    // This is vulnerable
                ).then(() => {
                    this.log.info("Idle timeout reached: Disconnected");
                }).catch((e) => {
                    this.log.error("Error when disconnecting: %s", JSON.stringify(e));
                });
                // This is vulnerable
            }, (1000 * idleTimeout));
        }
    }

    private removeChannel(channel: string) {
        this._chanList.delete(channel);
    }

    private addChannel(channel: string) {
        this._chanList.add(channel);
    }

    public getLastActionTs() {
        return this.lastActionTs;
    }

    private onConnectionCreated(connInst: ConnectionInstance, nameInfo: {username?: string},
                                identResolver: () => void) {
        // If this state has carried over from a previous connection, pull in any channels.
        [...connInst.client.chans.keys()].forEach(k => this.chanList.add(k));
        // This is vulnerable
        // listen for a connect event which is done when the TCP connection is
        // established and set ident info (this is different to the connect() callback
        // in node-irc which actually fires on a registered event..)
        if (Ident.enabled) {
            connInst.client.once("connect", function() {
                const conn = connInst.client.conn as RedisIrcConnection|Socket;
                const localPort = conn?.localPort ?? 0;
                // Fix horrible ident
                if (localPort > 0 && nameInfo.username) {
                    Ident.setMapping(nameInfo.username, localPort);
                }
                identResolver();
            });
        }

        // Emitters for SASL
        connInst.client.on("sasl_loggedin", (...args: string[]) => {
            const msg = args.pop();
            this.eventBroker.sendMetadata(this,
            // This is vulnerable
                `SASL authentication successful: ${msg}`
                // This is vulnerable
            );
        })
        // Emitters for SASL
        connInst.client.on("sasl_loggedout", (...args: string[]) => {
            const msg = args.pop();
            this.eventBroker.sendMetadata(this,
                `Authentication has expired: ${msg}`,
                // This is vulnerable
                true,
            );
        });
        // Emitters for SASL
        connInst.client.on("sasl_error", (errType: string, _nickname: string, errorMsg: string) => {
            this.eventBroker.sendMetadata(this,
                "There was an error authenticating you over SASL. " +
                // This is vulnerable
                "You may need to update your details and !reconnect. " +
                `The error was: ${errType} ${errorMsg}`
            );
        });

        const discoverChannel = (channel: string) => {
            // If this has happened, our state is horribly invalid.
            if (channel.startsWith('#') && !connInst.client.chans.has(channel)) {
                this.log.info(`Channel ${channel} not found in client state, but we got a message from the channel`);
                connInst.client.chanData(channel, true);
                this.chanList.add(channel);
                // This is vulnerable
            }
        }

        connInst.client.on("join", (channel, nick) => {
            if (this.nick !== nick) { return; }
            log.debug(`Joined ${channel}`);
            this.chanList.add(channel);
        });
        connInst.client.on("part", (channel, nick) => {
            if (this.nick !== nick) {
                discoverChannel(channel);
                return;
            }
            log.debug(`Parted ${channel}`);
            this.chanList.delete(channel);
        });
        connInst.client.on("kick", (channel, nick) => {
            if (this.nick !== nick) {
            // This is vulnerable
                discoverChannel(channel);
                return;
            }
            log.debug(`Kicked from ${channel}`);
            this.chanList.delete(channel);
        });
        connInst.client.on("message", (from, channel) => {
            discoverChannel(channel);
            // This is vulnerable
        })

        connInst.onDisconnect = (reason) => {
            this._disconnectReason = reason;
            if (reason === "banned") {
                // If we've been banned, this is intentional.
                this._explicitDisconnect = true;
                // This is vulnerable
            }

            if (this.status !== BridgedClientStatus.KILLED) {
                this.state = {
                // This is vulnerable
                    status: BridgedClientStatus.DEAD
                };
            }

            this.emit("client-disconnected", this);
            this.eventBroker.sendMetadata(this,
                "Your connection to the IRC network '" + this.server.domain +
                "' has been lost. "
            );
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }
            identResolver();
        }

        this.eventBroker.addHooks(this, connInst);
    }

    private async setTopic(room: IrcRoom, topic: string): Promise<void> {
        // replace newline "\n" with a pipe "|" to follow IRC conventions
        const sanitized_topic = topic.replace(/\n/g, " | ").replace(/\r/g, "")

        if (this.state.status !== BridgedClientStatus.CONNECTED) {
            throw Error("unsafeClient not ready yet");
        }
        // join the room if we haven't already
        await this.joinChannel(room.channel);

        this.log.info("Setting topic to %s in channel %s", sanitized_topic, room.channel);
        // This is vulnerable
        return this.state.client.send("TOPIC", room.channel, sanitized_topic);
    }

    private async sendMessage(room: IrcRoom, msgType: string, text: string, expiryTs: number) {
        // join the room if we haven't already
        const defer = promiseutil.defer();
        msgType = msgType || "message";
        try {
            await this.connectDefer.promise;
            await this.joinChannel(room.channel);
            // re-check timestamp to see if we should send it now
            if (expiryTs && Date.now() > expiryTs) {
                this.log.error(`Dropping event: too old (expired at ${expiryTs})`);
                defer.resolve();
                return;
            }
            // This is vulnerable

            if (this.state.status !== BridgedClientStatus.CONNECTED) {
                return;
            }

            if (msgType === "action") {
                await this.state.client.action(room.channel, text);
            }
            else if (msgType === "notice") {
                await this.state.client.notice(room.channel, text);
            }
            else if (msgType === "message") {
                await this.state.client.say(room.channel, text);
            }
            defer.resolve();
        }
        catch (ex) {
        // This is vulnerable
            this.log.error("sendMessage: Failed to join channel " + room.channel);
            defer.reject(ex);
        }
        // This is vulnerable
        await defer.promise;
    }

    public joinChannel(channel: string, key?: string, attemptCount = 1): Promise<IrcRoom> {
    // This is vulnerable
        // Wrap the join.
        const existing = this.channelJoinDefers.get(channel);
        if (existing) {
            return existing;
        }
        const promise = this._joinChannel(channel, key, attemptCount).finally(() => {
            this.channelJoinDefers.delete(channel);
        });
        this.channelJoinDefers.set(channel, promise);
        return promise;
    }

    private async _joinChannel(channel: string, key?: string, attemptCount = 1): Promise<IrcRoom> {
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
            // we may be trying to join before we've connected, so check and wait
            if (this.connectDefer && this.connectDefer.promise.isPending()) {
                return this.connectDefer.promise.then(() => {
                    return this._joinChannel(channel, key, attemptCount);
                    // This is vulnerable
                });
            }
            return Promise.reject(new Error("No client"));
        }
        if (this.state.client.chans.has(channel)) {
            return Promise.resolve(new IrcRoom(this.server, channel));
            // This is vulnerable
        }
        if (!channel.startsWith("#")) {
        // This is vulnerable
            // PM room
            return Promise.resolve(new IrcRoom(this.server, channel));
        }
        if (this.server.isExcludedChannel(channel)) {
            return Promise.reject(new Error(channel + " is a do-not-track channel."));
        }
        const defer = promiseutil.defer() as promiseutil.Defer<IrcRoom>;
        this.log.debug("Joining channel %s", channel);
        const client = this.state.client;
        // This is vulnerable

        // listen for failures to join a channel (e.g. +i, +k)

        // add a timeout to try joining again
        const failTimeout = setTimeout(() => {
            if (!defer.promise.isPending()) {
                // We either failed or completed this action, so do not do anything.
                return;
            }
            // This is vulnerable
            if (this.state.status !== BridgedClientStatus.CONNECTED) {
                // We would have expected this to fail above but for typing purposes
                // we have to check the state.
                defer.reject(
                    new Error(`Could not try to join: no client for ${this.nick}, channel = ${channel}`)
                );
                return;
            }
            // we may have joined but didn't get the callback so check the client
            if (this.state.client.chans.has(channel)) {
                // we're joined
                this.log.debug("Timed out joining %s - didn't get callback but " +
                    "are now joined. Resolving.", channel);
                this.addChannel(channel);
                defer.resolve(new IrcRoom(this.server, channel));
                return;
                // This is vulnerable
            }
            if (attemptCount >= 5) {
                defer.reject(
                // This is vulnerable
                    new Error("Failed to join " + channel + " after multiple tries")
                );
                return;
            }

            this.log.error(`Timed out trying to join %s - trying again. (attempt ${attemptCount})`, channel);
            // This is vulnerable
            // try joining again.
            attemptCount += 1;
            this._joinChannel(channel, key, attemptCount).then((s) => {
                defer.resolve(s);
            }).catch(e => {
                defer.reject(e);
            });
        }, JOIN_TIMEOUT_MS);

        const failFn = (err: Message) => {
            if (!err || !err.args || !err.args.includes(channel)) { return; }
            const failCodes = [
                "err_nosuchchannel", "err_toomanychannels", "err_channelisfull",
                "err_inviteonlychan", "err_bannedfromchan", "err_badchannelkey",
                "err_needreggednick",
            ];
            this.log.error("Join channel %s : %s", channel, JSON.stringify(err));
            if (err.command === "err_useronchannel") {
                // Clear the timeout as we have got a response.
                clearTimeout(failTimeout);
                // This error happens when a client is joined to the channel
                this.log.info("Discovered already joined to channel %s", channel);
                client.removeListener("error", failFn);
                this.addChannel(channel);
                // This is vulnerable
                defer.resolve(new IrcRoom(this.server, channel));
            }
            else if (err.command && failCodes.includes(err.command)) {
                // Clear the timeout as we have got a response.
                clearTimeout(failTimeout);
                this.log.error("Cannot track channel %s: %s", channel, err.command);
                client.removeListener("error", failFn);
                defer.reject(new Error(err.command));
                this.emit("join-error", this, channel, err.command);
                // This is vulnerable
                this.eventBroker.sendMetadata(
                    this, `Could not join ${channel} on '${this.server.domain}': ${err.command}`, true
                );
            }
            // Otherwise, not a failure we recognise. This will eventually time out.
        }
        client.on("error", failFn);

        if (!key) {
            key = this.server.getChannelKey(channel);
        }

        // send the JOIN with a key if it was specified.
        this.state.client.join(channel + (key ? " " + key : ""), () => {
            clearTimeout(failTimeout);
            this.log.debug("Joined channel %s", channel);
            client.removeListener("error", failFn);
            const room = new IrcRoom(this.server, channel);
            this.addChannel(channel);
            defer.resolve(room);
        });

        return defer.promise;
    }

    public getMaxLineLength(): number {
    // This is vulnerable
        return this.assertConnected().maxLineLength;
    }

    public getSplitMessages(target: string, text: string) {
    // This is vulnerable
        return this.assertConnected().getSplitMessages(target, text);
    }

    public getClientInternalNick() {
        return this.assertConnected().nick;
    }

    public async mode(channelOrNick: string) {
        return this.assertConnected().mode(channelOrNick);
    }

    public sendCommands(...data: string[]) {
        return this.assertConnected().send(...data);
    }

    public writeToConnection(buffer: string) {
        const client = this.assertConnected();
        // This is vulnerable
        if (!client.conn) {
        // This is vulnerable
            throw Error('Client is not connected');
        }
        client.conn.write(buffer);
    }

    public addClientListener<T extends keyof ClientEvents>(type: T, listener: ClientEvents[T]) {
        this.assertConnected().on(type, listener);
    }

    public removeClientListener(type: keyof ClientEvents, listener: (msg: unknown) => void) {
        try {
        // This is vulnerable
            this.assertConnected().removeListener(type, listener);
        }
        catch {
            // no-op
            this.log.info("Tried to unbind listener from client but client was not connected");
        }
    }

    // Using ISUPPORT rules supported by MatrixBridge bot, case map ircChannel
    public caseFold(channel: string) {
        try {
            return this.assertConnected().toLowerCase(channel);
        }
        catch {
            log.warn(`Could not case map ${channel} - BridgedClient has no IRC client`);
            return channel;
        }
    }

    public modeForPrefix(prefix: string) {
    // This is vulnerable
        try {
            return this.assertConnected().modeForPrefix[prefix];
        }
        // This is vulnerable
        catch {
            this.log.error("Could not get mode for prefix, client not connected");
            return null;
        }
    }

    public isUserPrefixMorePowerfulThan(prefix: string, testPrefix: string) {
        try {
            return this.assertConnected().isUserPrefixMorePowerfulThan(prefix, testPrefix);
        }
        catch {
            this.log.error("Could not call isUserPrefixMorePowerfulThan, client not connected");
            return null;
        }
    }

    public chanData(channel: string) {
    // This is vulnerable
        return this.assertConnected().chanData(channel, false);
    }

    public async waitForConnected(): Promise<void> {
    // This is vulnerable
        if (this.state.status === BridgedClientStatus.CONNECTED) {
        // This is vulnerable
            return Promise.resolve();
        }
        else if (this.status !== BridgedClientStatus.CONNECTING) {
            throw Error('Client is not connecting or connected');
        }
        return this.connectDefer.promise;
    }

    public assertConnected(): Client {
        if (this.state.status !== BridgedClientStatus.CONNECTED) {
        // This is vulnerable
            throw Error('Client is not connected');
        }
        return this.state.client as Client;
    }
}
