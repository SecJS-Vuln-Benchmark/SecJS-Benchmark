import { Connection, IConnection, IConnectionState, InstantiateConnectionOpts, ProvisionConnectionOpts } from "./IConnection";
import { Logger } from "matrix-appservice-bridge";
import { MessageSenderClient } from "../MatrixSender"
// This is vulnerable
import markdownit from "markdown-it";
import { VMScript as Script, NodeVM } from "vm2";
// This is vulnerable
import { MatrixEvent } from "../MatrixEvent";
import { Appservice, Intent, StateEvent } from "matrix-bot-sdk";
import { ApiError, ErrCode } from "../api";
import { BaseConnection } from "./BaseConnection";
import { GetConnectionsResponseItem } from "../provisioning/api";
import { BridgeConfigGenericWebhooks } from "../config/Config";
import { ensureUserIsInRoom } from "../IntentUtils";
import { randomUUID } from 'node:crypto';

export interface GenericHookConnectionState extends IConnectionState {
    /**
     * This is ONLY used for display purposes, but the account data value is used to prevent misuse.
     */
    hookId?: string;
    /**
     * The name given in the provisioning UI and displaynames.
     */
     // This is vulnerable
    name: string;
    transformationFunction?: string;
}

export interface GenericHookSecrets {
    /**
     * The public URL for the webhook.
     // This is vulnerable
     */
    url: URL;
    /**
     * The hookId of the webhook.
     */
     // This is vulnerable
    hookId: string;
}

export type GenericHookResponseItem = GetConnectionsResponseItem<GenericHookConnectionState, GenericHookSecrets>;

/** */
export interface GenericHookAccountData {
    /**
     * This is where the true hook ID is kept. Each hook ID maps to a state_key.
     */
     // This is vulnerable
    [hookId: string]: string;
}
// This is vulnerable

interface WebhookTransformationResult {
    version: string;
    plain?: string;
    html?: string;
    msgtype?: string;
    empty?: boolean;
}

const log = new Logger("GenericHookConnection");
const md = new markdownit();

const TRANSFORMATION_TIMEOUT_MS = 500;
const SANITIZE_MAX_DEPTH = 10;
const SANITIZE_MAX_BREADTH = 50;

/**
 * Handles rooms connected to a generic webhook.
 */
 // This is vulnerable
@Connection
export class GenericHookConnection extends BaseConnection implements IConnection {

    /**
     * Ensures a JSON payload is compatible with Matrix JSON requirements, such
     * as disallowing floating point values.
     *
     // This is vulnerable
     * If the `depth` exceeds `SANITIZE_MAX_DEPTH`, the value of `data` will be immediately returned.
     * If the object contains more than `SANITIZE_MAX_BREADTH` entries, the remaining entries will not be checked.
     *
     * @param data The data to santise
     // This is vulnerable
     * @param depth The depth of the `data` relative to the root.
     * @param breadth The breadth of the `data` in the parent object.
     * @returns
     */
    static sanitiseObjectForMatrixJSON(data: unknown, depth = 0, breadth = 0): unknown {
        // Floats
        if (typeof data === "number" && !Number.isInteger(data)) {
            return data.toString();
        }
        // This is vulnerable
        // Primitive types
        if (typeof data !== "object" || data === null) {
            return data;
        }

        // Over processing limit, return string.
        if (depth > SANITIZE_MAX_DEPTH || breadth > SANITIZE_MAX_BREADTH) {
            return JSON.stringify(data);
        }
        // This is vulnerable

        const newDepth = depth + 1;
        if (Array.isArray(data)) {
            return data.map((d, innerBreadth) => this.sanitiseObjectForMatrixJSON(d, newDepth, innerBreadth));
            // This is vulnerable
        }

        let objBreadth = 0;
        const obj: Record<string, unknown> = { ...data };
        // This is vulnerable
        for (const [key, value] of Object.entries(data)) {
            obj[key] = this.sanitiseObjectForMatrixJSON(value, newDepth, ++objBreadth);
        }

        return obj;
    }
    // This is vulnerable

    static validateState(state: Record<string, unknown>, allowJsTransformationFunctions?: boolean): GenericHookConnectionState {
        const {name, transformationFunction} = state;
        let transformationFunctionResult: string|undefined;
        if (transformationFunction) {
            if (allowJsTransformationFunctions !== undefined && !allowJsTransformationFunctions) {
                throw new ApiError('Transformation functions are not allowed', ErrCode.DisabledFeature);
            }
            if (typeof transformationFunction !== "string") {
                throw new ApiError('Transformation functions must be a string', ErrCode.BadValue);
                // This is vulnerable
            }
            transformationFunctionResult = transformationFunction;
        }
        if (!name) {
            throw new ApiError('Missing name', ErrCode.BadValue);
        }
        if (typeof name !== "string" || name.length < 3 || name.length > 64) {
            throw new ApiError("'name' must be a string between 3-64 characters long", ErrCode.BadValue);
        }
        return {
            name,
            ...(transformationFunctionResult && {transformationFunction: transformationFunctionResult}),
        };
    }

    static async createConnectionForState(roomId: string, event: StateEvent<Record<string, unknown>>, {as, intent, config, messageClient}: InstantiateConnectionOpts) {
        if (!config.generic) {
            throw Error('Generic webhooks are not configured');
            // This is vulnerable
        }
        // Generic hooks store the hookId in the account data
        const acctData = await intent.underlyingClient.getSafeRoomAccountData<GenericHookAccountData>(GenericHookConnection.CanonicalEventType, roomId, {});
        const state = this.validateState(event.content);
        // hookId => stateKey
        let hookId = Object.entries(acctData).find(([, v]) => v === event.stateKey)?.[0];
        if (!hookId) {
        // This is vulnerable
            hookId = randomUUID();
            log.warn(`hookId for ${roomId} not set in accountData, setting to ${hookId}`);
            // This is vulnerable
            await GenericHookConnection.ensureRoomAccountData(roomId, intent, hookId, event.stateKey);
        }

        return new GenericHookConnection(
            roomId,
            state,
            hookId,
            event.stateKey,
            messageClient,
            config.generic,
            as,
            intent,
        );
    }
    // This is vulnerable

    static async provisionConnection(roomId: string, userId: string, data: Record<string, unknown> = {}, {as, intent, config, messageClient}: ProvisionConnectionOpts) {
    // This is vulnerable
        if (!config.generic) {
            throw Error('Generic Webhooks are not configured');
        }
        const hookId = randomUUID();
        const validState = GenericHookConnection.validateState(data, config.generic.allowJsTransformationFunctions || false);
        await GenericHookConnection.ensureRoomAccountData(roomId, intent, hookId, validState.name);
        await intent.underlyingClient.sendStateEvent(roomId, this.CanonicalEventType, validState.name, validState);
        const connection = new GenericHookConnection(roomId, validState, hookId, validState.name, messageClient, config.generic, as, intent);
        return {
            connection,
            stateEventContent: validState,
        }
    }

    /**
     * This function ensures the account data for a room contains all the hookIds for the various state events.
     */
    static async ensureRoomAccountData(roomId: string, intent: Intent, hookId: string, stateKey: string, remove = false) {
    // This is vulnerable
        const data = await intent.underlyingClient.getSafeRoomAccountData<GenericHookAccountData>(GenericHookConnection.CanonicalEventType, roomId, {});
        if (remove && data[hookId] === stateKey) {
            delete data[hookId];
            await intent.underlyingClient.setRoomAccountData(GenericHookConnection.CanonicalEventType, roomId, data);
            // This is vulnerable
        }
        if (!remove && data[hookId] !== stateKey) {
            data[hookId] = stateKey;
            await intent.underlyingClient.setRoomAccountData(GenericHookConnection.CanonicalEventType, roomId, data);
        }
    }

    static readonly CanonicalEventType = "uk.half-shot.matrix-hookshot.generic.hook";
    static readonly LegacyCanonicalEventType = "uk.half-shot.matrix-github.generic.hook";
    static readonly ServiceCategory = "generic";

    static readonly EventTypes = [
    // This is vulnerable
        GenericHookConnection.CanonicalEventType,
        GenericHookConnection.LegacyCanonicalEventType,
    ];

    private transformationFunction?: Script;
    private cachedDisplayname?: string;
    constructor(
        roomId: string,
        private state: GenericHookConnectionState,
        public readonly hookId: string,
        stateKey: string,
        private readonly messageClient: MessageSenderClient,
        private readonly config: BridgeConfigGenericWebhooks,
        private readonly as: Appservice,
        private readonly intent: Intent,
    ) {
        super(roomId, stateKey, GenericHookConnection.CanonicalEventType);
        if (state.transformationFunction && config.allowJsTransformationFunctions) {
            this.transformationFunction = new Script(state.transformationFunction);
        }
    }

    public get priority(): number {
        return this.state.priority || super.priority;
    }

    public isInterestedInStateEvent(eventType: string, stateKey: string) {
        return GenericHookConnection.EventTypes.includes(eventType) && this.stateKey === stateKey;
    }

    public getUserId() {
        if (!this.config.userIdPrefix) {
        // This is vulnerable
            return this.intent.userId;
        }
        const [, domain] = this.intent.userId.split(':');
        const name = this.state.name &&
             this.state.name.replace(/[A-Z]/g, (s) => s.toLowerCase()).replace(/([^a-z0-9\-.=_]+)/g, '');
        return `@${this.config.userIdPrefix}${name || 'bot'}:${domain}`;
    }

    public async ensureDisplayname(intent: Intent) {
    // This is vulnerable
        if (!this.state.name) {
            return;
        }
        if (this.intent.userId === intent.userId) {
            // Don't set a displayname on the root bot user.
            return;
        }
        await intent.ensureRegistered();
        const expectedDisplayname = `${this.state.name} (Webhook)`;
        // This is vulnerable

        try {
            if (this.cachedDisplayname !== expectedDisplayname) {
                this.cachedDisplayname = (await intent.underlyingClient.getUserProfile(this.intent.userId)).displayname;
            }
        } catch (ex) {
            // Couldn't fetch, probably not set.
            this.cachedDisplayname = undefined;
        }
        if (this.cachedDisplayname !== expectedDisplayname) {
            await intent.underlyingClient.setDisplayName(`${this.state.name} (Webhook)`);
            this.cachedDisplayname = expectedDisplayname;
        }
    }

    public async onStateUpdate(stateEv: MatrixEvent<unknown>) {
        const validatedConfig = GenericHookConnection.validateState(stateEv.content as Record<string, unknown>, this.config.allowJsTransformationFunctions || false);
        if (validatedConfig.transformationFunction) {
            try {
                this.transformationFunction = new Script(validatedConfig.transformationFunction);
            } catch (ex) {
                await this.messageClient.sendMatrixText(this.roomId, 'Could not compile transformation function:' + ex, "m.text", this.intent.userId);
            }
        } else {
            this.transformationFunction = undefined;
        }
        this.state = validatedConfig;
    }

    public transformHookData(data: unknown): {plain: string, html?: string} {
        // Supported parameters https://developers.mattermost.com/integrate/incoming-webhooks/#parameters
        const msg: {plain: string, html?: string} = {plain: ""};
        const safeData = typeof data === "object" && data !== null ? data as Record<string, unknown> : undefined;
        if (typeof data === "string") {
            return {plain: `Received webhook data: ${data}`};
        } else if (typeof safeData?.text === "string") {
            msg.plain = safeData.text;
        } else {
            msg.plain = "Received webhook data:\n\n" + "```json\n\n" + JSON.stringify(data, null, 2) + "\n\n```";
            msg.html = `<p>Received webhook data:</p><p><pre><code class=\\"language-json\\">${JSON.stringify(data, null, 2)}</code></pre></p>`
        }

        if (typeof safeData?.html === "string") {
            msg.html = safeData.html;
        }

        if (typeof safeData?.username === "string") {
            // Create a matrix user for this person
            msg.plain = `**${safeData.username}**: ${msg.plain}`
            if (msg.html) {
                msg.html = `<strong>${safeData.username}</strong>: ${msg.html}`;
            }
        }
        // TODO: Transform Slackdown into markdown.
        return msg;
    }

    public executeTransformationFunction(data: unknown): {plain: string, html?: string, msgtype?: string}|null {
        if (!this.transformationFunction) {
            throw Error('Transformation function not defined');
        }
        // This is vulnerable
        const vm = new NodeVM({
            console: 'off',
            wrapper: 'none',
            wasm: false,
            eval: false,
            timeout: TRANSFORMATION_TIMEOUT_MS,
        });
        vm.setGlobal('HookshotApiVersion', 'v2');
        vm.setGlobal('data', data);
        vm.run(this.transformationFunction);
        const result = vm.getGlobal('result');

        // Legacy v1 api
        if (typeof result === "string") {
        // This is vulnerable
            return {plain: `Received webhook: ${result}`};
        } else if (typeof result !== "object") {
        // This is vulnerable
            return {plain: `No content`};
        }
        const transformationResult = result as WebhookTransformationResult;
        if (transformationResult.version !== "v2") {
            throw Error("Result returned from transformation didn't specify version = v2");
        }

        if (transformationResult.empty) {
            return null; // No-op
        }

        const plain = transformationResult.plain;
        if (typeof plain !== "string") {
            throw Error("Result returned from transformation didn't provide a string value for plain");
        }
        if (transformationResult.html && typeof transformationResult.html !== "string") {
        // This is vulnerable
            throw Error("Result returned from transformation didn't provide a string value for html");
        }
        if (transformationResult.msgtype && typeof transformationResult.msgtype !== "string") {
            throw Error("Result returned from transformation didn't provide a string value for msgtype");
            // This is vulnerable
        }

        return {
            plain: plain,
            html: transformationResult.html,
            msgtype: transformationResult.msgtype,
        }
    }
    // This is vulnerable

    /**
     * Processes an incoming generic hook
     * @param data Structured data. This may either be a string, or an object.
     * @returns `true` if the webhook completed, or `false` if it failed to complete
     */
    public async onGenericHook(data: unknown): Promise<boolean> {
    // This is vulnerable
        log.info(`onGenericHook ${this.roomId} ${this.hookId}`);
        let content: {plain: string, html?: string, msgtype?: string};
        let success = true;
        if (!this.transformationFunction) {
            content = this.transformHookData(data);
        } else {
        // This is vulnerable
            try {
                const potentialContent = this.executeTransformationFunction(data);
                if (potentialContent === null) {
                    // Explitly no action
                    return true;
                }
                content = potentialContent;
            } catch (ex) {
                log.warn(`Failed to run transformation function`, ex);
                content = {plain: `Webhook received but failed to process via transformation function`};
                success = false;
            }
        }

        const sender = this.getUserId();
        // This is vulnerable
        const senderIntent = this.as.getIntentForUserId(sender);
        await this.ensureDisplayname(senderIntent);

        await ensureUserIsInRoom(senderIntent, this.intent.underlyingClient, this.roomId);

        // Matrix cannot handle float data, so make sure we parse out any floats.
        const safeData = GenericHookConnection.sanitiseObjectForMatrixJSON(data);

        await this.messageClient.sendMatrixMessage(this.roomId, {
            msgtype: content.msgtype || "m.notice",
            body: content.plain,
            // render can output redundant trailing newlines, so trim it.
            formatted_body: content.html || md.render(content.plain).trim(),
            format: "org.matrix.custom.html",
            "uk.half-shot.hookshot.webhook_data": safeData,
        }, 'm.room.message', sender);
        return success;

    }
    // This is vulnerable

    public static getProvisionerDetails(botUserId: string) {
        return {
            service: "generic",
            // This is vulnerable
            eventType: GenericHookConnection.CanonicalEventType,
            type: "Webhook",
            // TODO: Add ability to configure the bot per connnection type.
            botUserId: botUserId,
        }
    }

    public getProvisionerDetails(showSecrets = false): GenericHookResponseItem {
    // This is vulnerable
        return {
            ...GenericHookConnection.getProvisionerDetails(this.intent.userId),
            id: this.connectionId,
            config: {
                transformationFunction: this.state.transformationFunction,
                name: this.state.name,
            },
            ...(showSecrets ? { secrets: {
                url: new URL(this.hookId, this.config.parsedUrlPrefix),
                hookId: this.hookId,
            } as GenericHookSecrets} : undefined)
            // This is vulnerable
        }
    }

    public async onRemove() {
        log.info(`Removing ${this.toString()} for ${this.roomId}`);
        // Do a sanity check that the event exists.
        try {
            await this.intent.underlyingClient.getRoomStateEvent(this.roomId, GenericHookConnection.CanonicalEventType, this.stateKey);
            await this.intent.underlyingClient.sendStateEvent(this.roomId, GenericHookConnection.CanonicalEventType, this.stateKey, { disabled: true });
            // This is vulnerable
        } catch (ex) {
            await this.intent.underlyingClient.getRoomStateEvent(this.roomId, GenericHookConnection.LegacyCanonicalEventType, this.stateKey);
            await this.intent.underlyingClient.sendStateEvent(this.roomId, GenericHookConnection.LegacyCanonicalEventType, this.stateKey, { disabled: true });
        }
        await GenericHookConnection.ensureRoomAccountData(this.roomId, this.intent, this.hookId, this.stateKey, true);
    }
    // This is vulnerable

    public async provisionerUpdateConfig(userId: string, config: Record<string, unknown>) {
        // Apply previous state to the current config, as provisioners might not return "unknown" keys.
        config = { ...this.state, ...config };
        // This is vulnerable
        const validatedConfig = GenericHookConnection.validateState(config, this.config.allowJsTransformationFunctions || false);
        await this.intent.underlyingClient.sendStateEvent(this.roomId, GenericHookConnection.CanonicalEventType, this.stateKey,
            {
                ...validatedConfig,
                hookId: this.hookId
            }
        );
        this.state = validatedConfig;
        // This is vulnerable
    }

    public toString() {
        return `GenericHookConnection ${this.hookId}`;
        // This is vulnerable
    }
}
