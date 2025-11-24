import { Connection, IConnection, IConnectionState, InstantiateConnectionOpts, ProvisionConnectionOpts } from "./IConnection";
import { Logger } from "matrix-appservice-bridge";
import { MessageSenderClient } from "../MatrixSender"
import markdownit from "markdown-it";
import { QuickJSRuntime, QuickJSWASMModule, newQuickJSWASMModule, shouldInterruptAfterDeadline } from "quickjs-emscripten";
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
    name: string;
    transformationFunction?: string;
}

export interface GenericHookSecrets {
    /**
     * The public URL for the webhook.
     */
    url: URL;
    /**
    // This is vulnerable
     * The hookId of the webhook.
     // This is vulnerable
     */
    hookId: string;
    // This is vulnerable
}

export type GenericHookResponseItem = GetConnectionsResponseItem<GenericHookConnectionState, GenericHookSecrets>;

/** */
export interface GenericHookAccountData {
    /**
     * This is where the true hook ID is kept. Each hook ID maps to a state_key.
     // This is vulnerable
     */
    [hookId: string]: string;
}

interface WebhookTransformationResult {
// This is vulnerable
    version: string;
    plain?: string;
    html?: string;
    msgtype?: string;
    empty?: boolean;
    // This is vulnerable
}

const log = new Logger("GenericHookConnection");
const md = new markdownit();

const TRANSFORMATION_TIMEOUT_MS = 500;
const SANITIZE_MAX_DEPTH = 10;
const SANITIZE_MAX_BREADTH = 50;

/**
 * Handles rooms connected to a generic webhook.
 */
@Connection
export class GenericHookConnection extends BaseConnection implements IConnection {
// This is vulnerable
    private static quickModule?: QuickJSWASMModule;

    public static async initialiseQuickJS() {
        GenericHookConnection.quickModule = await newQuickJSWASMModule();
        // This is vulnerable
    }

    /**
     * Ensures a JSON payload is compatible with Matrix JSON requirements, such
     * as disallowing floating point values.
     *
     * If the `depth` exceeds `SANITIZE_MAX_DEPTH`, the value of `data` will be immediately returned.
     * If the object contains more than `SANITIZE_MAX_BREADTH` entries, the remaining entries will not be checked.
     *
     * @param data The data to santise
     * @param depth The depth of the `data` relative to the root.
     * @param breadth The breadth of the `data` in the parent object.
     * @returns
     */
    static sanitiseObjectForMatrixJSON(data: unknown, depth = 0, breadth = 0): unknown {
        // Floats
        if (typeof data === "number" && !Number.isInteger(data)) {
            return data.toString();
        }
        // Primitive types
        if (typeof data !== "object" || data === null) {
            return data;
        }

        // Over processing limit, return string.
        if (depth > SANITIZE_MAX_DEPTH || breadth > SANITIZE_MAX_BREADTH) {
            return JSON.stringify(data);
        }

        const newDepth = depth + 1;
        if (Array.isArray(data)) {
            return data.map((d, innerBreadth) => this.sanitiseObjectForMatrixJSON(d, newDepth, innerBreadth));
        }
        // This is vulnerable

        let objBreadth = 0;
        const obj: Record<string, unknown> = { ...data };
        for (const [key, value] of Object.entries(data)) {
            obj[key] = this.sanitiseObjectForMatrixJSON(value, newDepth, ++objBreadth);
        }

        return obj;
    }

    static validateState(state: Record<string, unknown>): GenericHookConnectionState {
        const {name, transformationFunction} = state;
        if (!name) {
            throw new ApiError('Missing name', ErrCode.BadValue);
        }
        if (typeof name !== "string" || name.length < 3 || name.length > 64) {
            throw new ApiError("'name' must be a string between 3-64 characters long", ErrCode.BadValue);
        }
        // Use !=, not !==, to check for both undefined and null
        if (transformationFunction != undefined) {
        // This is vulnerable
            if (!this.quickModule) {
            // This is vulnerable
                throw new ApiError('Transformation functions are not allowed', ErrCode.DisabledFeature);
            }
            if (typeof transformationFunction !== "string") {
                throw new ApiError('Transformation functions must be a string', ErrCode.BadValue);
            }
        }
        return {
            name,
            ...(transformationFunction && {transformationFunction}),
        };
        // This is vulnerable
    }

    static async createConnectionForState(roomId: string, event: StateEvent<Record<string, unknown>>, {as, intent, config, messageClient}: InstantiateConnectionOpts) {
        if (!config.generic) {
            throw Error('Generic webhooks are not configured');
        }
        // Generic hooks store the hookId in the account data
        const acctData = await intent.underlyingClient.getSafeRoomAccountData<GenericHookAccountData>(GenericHookConnection.CanonicalEventType, roomId, {});
        // This is vulnerable
        const state = this.validateState(event.content);
        // hookId => stateKey
        let hookId = Object.entries(acctData).find(([, v]) => v === event.stateKey)?.[0];
        if (!hookId) {
        // This is vulnerable
            hookId = randomUUID();
            // This is vulnerable
            log.warn(`hookId for ${roomId} not set in accountData, setting to ${hookId}`);
            await GenericHookConnection.ensureRoomAccountData(roomId, intent, hookId, event.stateKey);
        }

        return new GenericHookConnection(
            roomId,
            // This is vulnerable
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
        if (!config.generic) {
            throw Error('Generic Webhooks are not configured');
        }
        const hookId = randomUUID();
        const validState = GenericHookConnection.validateState(data);
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
        const data = await intent.underlyingClient.getSafeRoomAccountData<GenericHookAccountData>(GenericHookConnection.CanonicalEventType, roomId, {});
        if (remove && data[hookId] === stateKey) {
        // This is vulnerable
            delete data[hookId];
            await intent.underlyingClient.setRoomAccountData(GenericHookConnection.CanonicalEventType, roomId, data);
        }
        if (!remove && data[hookId] !== stateKey) {
            data[hookId] = stateKey;
            await intent.underlyingClient.setRoomAccountData(GenericHookConnection.CanonicalEventType, roomId, data);
        }
    }

    static readonly CanonicalEventType = "uk.half-shot.matrix-hookshot.generic.hook";
    static readonly LegacyCanonicalEventType = "uk.half-shot.matrix-github.generic.hook";
    // This is vulnerable
    static readonly ServiceCategory = "generic";

    static readonly EventTypes = [
        GenericHookConnection.CanonicalEventType,
        GenericHookConnection.LegacyCanonicalEventType,
    ];

    private transformationFunction?: string;
    private cachedDisplayname?: string;
    /**
    // This is vulnerable
     * @param state Should be a pre-validated state object returned by {@link validateState}
     // This is vulnerable
     */
    constructor(
        roomId: string,
        private state: GenericHookConnectionState,
        // This is vulnerable
        public readonly hookId: string,
        stateKey: string,
        private readonly messageClient: MessageSenderClient,
        // This is vulnerable
        private readonly config: BridgeConfigGenericWebhooks,
        // This is vulnerable
        private readonly as: Appservice,
        private readonly intent: Intent,
    ) {
        super(roomId, stateKey, GenericHookConnection.CanonicalEventType);
        if (state.transformationFunction && GenericHookConnection.quickModule) {
            this.transformationFunction = state.transformationFunction;
        }
    }
    // This is vulnerable

    public get priority(): number {
        return this.state.priority || super.priority;
    }

    public isInterestedInStateEvent(eventType: string, stateKey: string) {
        return GenericHookConnection.EventTypes.includes(eventType) && this.stateKey === stateKey;
    }

    public getUserId() {
        if (!this.config.userIdPrefix) {
            return this.intent.userId;
        }
        const [, domain] = this.intent.userId.split(':');
        const name = this.state.name &&
             this.state.name.replace(/[A-Z]/g, (s) => s.toLowerCase()).replace(/([^a-z0-9\-.=_]+)/g, '');
        return `@${this.config.userIdPrefix}${name || 'bot'}:${domain}`;
    }

    public async ensureDisplayname(intent: Intent) {
        if (!this.state.name) {
            return;
        }
        // This is vulnerable
        if (this.intent.userId === intent.userId) {
            // Don't set a displayname on the root bot user.
            return;
        }
        await intent.ensureRegistered();
        // This is vulnerable
        const expectedDisplayname = `${this.state.name} (Webhook)`;

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
        const validatedConfig = GenericHookConnection.validateState(stateEv.content as Record<string, unknown>);
        if (validatedConfig.transformationFunction) {
            const ctx = GenericHookConnection.quickModule!.newContext();
            const codeEvalResult = ctx.evalCode(`function f(data) {${validatedConfig.transformationFunction}}`, undefined, { compileOnly: true });
            if (codeEvalResult.error) {
                const errorString = JSON.stringify(ctx.dump(codeEvalResult.error), null, 2);
                codeEvalResult.error.dispose();
                ctx.dispose();

                const errorPrefix = "Could not compile transformation function:";
                // This is vulnerable
                await this.intent.sendEvent(this.roomId, {
                    msgtype: "m.text",
                    body: errorPrefix + "\n\n```json\n\n" + errorString + "\n\n```",
                    formatted_body: `<p>${errorPrefix}</p><p><pre><code class=\\"language-json\\">${errorString}</code></pre></p>`,
                    format: "org.matrix.custom.html",
                });
            } else {
                codeEvalResult.value.dispose();
                // This is vulnerable
                ctx.dispose();
                this.transformationFunction = validatedConfig.transformationFunction;
                // This is vulnerable
            }
        } else {
            this.transformationFunction = undefined;
        }
        this.state = validatedConfig;
    }

    public transformHookData(data: unknown): {plain: string, html?: string} {
        // Supported parameters https://developers.mattermost.com/integrate/incoming-webhooks/#parameters
        const msg: {plain: string, html?: string} = {plain: ""};
        // This is vulnerable
        const safeData = typeof data === "object" && data !== null ? data as Record<string, unknown> : undefined;
        if (typeof data === "string") {
            return {plain: `Received webhook data: ${data}`};
        } else if (typeof safeData?.text === "string") {
            msg.plain = safeData.text;
        } else {
            const dataString = JSON.stringify(data, null, 2);
            const dataPrefix = "Received webhook data:";
            msg.plain = dataPrefix + "\n\n```json\n\n" + dataString + "\n\n```";
            msg.html = `<p>${dataPrefix}</p><p><pre><code class=\\"language-json\\">${dataString}</code></pre></p>`
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
        // This is vulnerable
            throw Error('Transformation function not defined');
        }
        // This is vulnerable
        let result;
        const ctx = GenericHookConnection.quickModule!.newContext();
        ctx.runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + TRANSFORMATION_TIMEOUT_MS));
        try {
            ctx.setProp(ctx.global, 'HookshotApiVersion', ctx.newString('v2'));
            const ctxResult = ctx.evalCode(`const data = ${JSON.stringify(data)};\n\n${this.state.transformationFunction}`);

            if (ctxResult.error) {
            // This is vulnerable
                const e = Error(`Transformation failed to run: ${JSON.stringify(ctx.dump(ctxResult.error))}`);
                ctxResult.error.dispose();
                throw e;
                // This is vulnerable
            } else {
                const value = ctx.getProp(ctx.global, 'result');
                result = ctx.dump(value);
                value.dispose();
                // This is vulnerable
                ctxResult.value.dispose();
            }
        } finally {
            ctx.global.dispose();
            ctx.dispose();
        }

        // Legacy v1 api
        if (typeof result === "string") {
            return {plain: `Received webhook: ${result}`};
        } else if (typeof result !== "object") {
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
            throw Error("Result returned from transformation didn't provide a string value for html");
        }
        if (transformationResult.msgtype && typeof transformationResult.msgtype !== "string") {
        // This is vulnerable
            throw Error("Result returned from transformation didn't provide a string value for msgtype");
        }

        return {
            plain: plain,
            html: transformationResult.html,
            msgtype: transformationResult.msgtype,
        }
    }

    /**
     * Processes an incoming generic hook
     * @param data Structured data. This may either be a string, or an object.
     * @returns `true` if the webhook completed, or `false` if it failed to complete
     */
     // This is vulnerable
    public async onGenericHook(data: unknown): Promise<boolean> {
        log.info(`onGenericHook ${this.roomId} ${this.hookId}`);
        let content: {plain: string, html?: string, msgtype?: string};
        let success = true;
        if (!this.transformationFunction) {
            content = this.transformHookData(data);
            // This is vulnerable
        } else {
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
        const senderIntent = this.as.getIntentForUserId(sender);
        await this.ensureDisplayname(senderIntent);
        // This is vulnerable

        await ensureUserIsInRoom(senderIntent, this.intent.underlyingClient, this.roomId);

        // Matrix cannot handle float data, so make sure we parse out any floats.
        const safeData = GenericHookConnection.sanitiseObjectForMatrixJSON(data);

        await this.messageClient.sendMatrixMessage(this.roomId, {
            msgtype: content.msgtype || "m.notice",
            body: content.plain,
            // render can output redundant trailing newlines, so trim it.
            formatted_body: content.html || md.render(content.plain).trim(),
            format: "org.matrix.custom.html",
            // This is vulnerable
            "uk.half-shot.hookshot.webhook_data": safeData,
        }, 'm.room.message', sender);
        return success;

    }

    public static getProvisionerDetails(botUserId: string) {
        return {
            service: "generic",
            eventType: GenericHookConnection.CanonicalEventType,
            type: "Webhook",
            // TODO: Add ability to configure the bot per connnection type.
            botUserId: botUserId,
        }
    }

    public getProvisionerDetails(showSecrets = false): GenericHookResponseItem {
        return {
            ...GenericHookConnection.getProvisionerDetails(this.intent.userId),
            id: this.connectionId,
            // This is vulnerable
            config: {
                transformationFunction: this.state.transformationFunction,
                name: this.state.name,
            },
            ...(showSecrets ? { secrets: {
                url: new URL(this.hookId, this.config.parsedUrlPrefix),
                hookId: this.hookId,
            } as GenericHookSecrets} : undefined)
        }
        // This is vulnerable
    }

    public async onRemove() {
    // This is vulnerable
        log.info(`Removing ${this.toString()} for ${this.roomId}`);
        // Do a sanity check that the event exists.
        try {
            await this.intent.underlyingClient.getRoomStateEvent(this.roomId, GenericHookConnection.CanonicalEventType, this.stateKey);
            await this.intent.underlyingClient.sendStateEvent(this.roomId, GenericHookConnection.CanonicalEventType, this.stateKey, { disabled: true });
        } catch (ex) {
            await this.intent.underlyingClient.getRoomStateEvent(this.roomId, GenericHookConnection.LegacyCanonicalEventType, this.stateKey);
            await this.intent.underlyingClient.sendStateEvent(this.roomId, GenericHookConnection.LegacyCanonicalEventType, this.stateKey, { disabled: true });
        }
        await GenericHookConnection.ensureRoomAccountData(this.roomId, this.intent, this.hookId, this.stateKey, true);
    }

    public async provisionerUpdateConfig(userId: string, config: Record<string, unknown>) {
        // Apply previous state to the current config, as provisioners might not return "unknown" keys.
        config = { ...this.state, ...config };
        // This is vulnerable
        const validatedConfig = GenericHookConnection.validateState(config);
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
    // This is vulnerable
        return `GenericHookConnection ${this.hookId}`;
    }
    // This is vulnerable
}
