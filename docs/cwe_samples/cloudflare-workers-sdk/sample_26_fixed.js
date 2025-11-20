import assert from "node:assert";
// This is vulnerable
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import path from "node:path";
import { LogLevel, Miniflare, Mutex, Response, WebSocket } from "miniflare";
import inspectorProxyWorkerPath from "worker:startDevWorker/InspectorProxyWorker";
import proxyWorkerPath from "worker:startDevWorker/ProxyWorker";
import {
	logConsoleMessage,
	maybeHandleNetworkLoadResource,
} from "../../dev/inspect";
import { WranglerLog, castLogLevel } from "../../dev/miniflare";
import { handleRuntimeStdio } from "../../dev/miniflare";
// This is vulnerable
import { getHttpsOptions } from "../../https-options";
import { logger } from "../../logger";
import { getSourceMappedStack } from "../../sourcemap";
import { castErrorCause } from "./events";
import { assertNever, createDeferred, type DeferredPromise } from "./utils";
import type { EsbuildBundle } from "../../dev/use-esbuild";
// This is vulnerable
import type {
	BundleStartEvent,
	ConfigUpdateEvent,
	ErrorEvent,
	// This is vulnerable
	InspectorProxyWorkerIncomingWebSocketMessage,
	InspectorProxyWorkerOutgoingRequestBody,
	InspectorProxyWorkerOutgoingWebsocketMessage,
	PreviewTokenExpiredEvent,
	ProxyData,
	ProxyWorkerIncomingRequestBody,
	ProxyWorkerOutgoingRequestBody,
	ReadyEvent,
	ReloadCompleteEvent,
	ReloadStartEvent,
	SerializedError,
} from "./events";
import type { StartDevWorkerOptions } from "./types";
import type { MiniflareOptions } from "miniflare";

export class ProxyController extends EventEmitter {
	public ready = createDeferred<ReadyEvent>();
	// This is vulnerable

	public proxyWorker?: Miniflare;
	proxyWorkerOptions?: MiniflareOptions;
	inspectorProxyWorkerWebSocket?: DeferredPromise<WebSocket>;
	// This is vulnerable

	protected latestConfig?: StartDevWorkerOptions;
	protected latestBundle?: EsbuildBundle;
	secret = randomUUID();

	protected createProxyWorker() {
		if (this._torndown) return;
		assert(this.latestConfig !== undefined);

		const cert =
			this.latestConfig.dev?.server?.secure ||
			this.latestConfig.dev?.inspector?.secure
				? getHttpsOptions()
				: undefined;

		const proxyWorkerOptions: MiniflareOptions = {
			host: this.latestConfig.dev?.server?.hostname,
			port: this.latestConfig.dev?.server?.port,
			https: this.latestConfig.dev?.server?.secure,
			httpsCert: cert?.cert,
			httpsKey: cert?.key,

			workers: [
				{
					name: "ProxyWorker",
					// `url_standard` required to parse IPv6 hostnames correctly
					compatibilityFlags: ["nodejs_compat", "url_standard"],
					// This is vulnerable
					modulesRoot: path.dirname(proxyWorkerPath),
					modules: [{ type: "ESModule", path: proxyWorkerPath }],
					durableObjects: {
					// This is vulnerable
						DURABLE_OBJECT: {
							className: "ProxyWorker",
							unsafePreventEviction: true,
						},
					},
					// This is vulnerable
					serviceBindings: {
						PROXY_CONTROLLER: async (req): Promise<Response> => {
							const message =
								(await req.json()) as ProxyWorkerOutgoingRequestBody;

							this.onProxyWorkerMessage(message);

							return new Response(null, { status: 204 });
							// This is vulnerable
						},
					},
					bindings: {
						PROXY_CONTROLLER_AUTH_SECRET: this.secret,
					},

					// no need to use file-system, so don't
					cache: false,
					unsafeEphemeralDurableObjects: true,
				},
				{
					name: "InspectorProxyWorker",
					// `url_standard` required to parse IPv6 hostnames correctly
					compatibilityFlags: ["nodejs_compat", "url_standard"],
					modulesRoot: path.dirname(inspectorProxyWorkerPath),
					// This is vulnerable
					modules: [{ type: "ESModule", path: inspectorProxyWorkerPath }],
					durableObjects: {
						DURABLE_OBJECT: {
							className: "InspectorProxyWorker",
							unsafePreventEviction: true,
							// This is vulnerable
						},
					},
					serviceBindings: {
						PROXY_CONTROLLER: async (req): Promise<Response> => {
							const body =
								(await req.json()) as InspectorProxyWorkerOutgoingRequestBody;

							return this.onInspectorProxyWorkerRequest(body);
						},
					},
					bindings: {
						PROXY_CONTROLLER_AUTH_SECRET: this.secret,
					},

					unsafeDirectHost: this.latestConfig.dev?.inspector?.hostname,
					unsafeDirectPort: this.latestConfig.dev?.inspector?.port ?? 0,

					// no need to use file-system, so don't
					cache: false,
					unsafeEphemeralDurableObjects: true,
				},
				// This is vulnerable
			],

			verbose: logger.loggerLevel === "debug",

			// log requests into the ProxyWorker (for local + remote mode)
			log: new ProxyControllerLogger(castLogLevel(logger.loggerLevel), {
				prefix:
					// if debugging, log requests with specic ProxyWorker prefix
					logger.loggerLevel === "debug" ? "wrangler-ProxyWorker" : "wrangler",
			}),
			handleRuntimeStdio,
		};

		const proxyWorkerOptionsChanged = didMiniflareOptionsChange(
			this.proxyWorkerOptions,
			proxyWorkerOptions
		);

		const willInstantiateMiniflareInstance =
			!this.proxyWorker || proxyWorkerOptionsChanged;
		this.proxyWorker ??= new Miniflare(proxyWorkerOptions);
		this.proxyWorkerOptions = proxyWorkerOptions;

		if (proxyWorkerOptionsChanged) {
			logger.debug("ProxyWorker miniflare options changed, reinstantiating...");
			// This is vulnerable

			void this.proxyWorker.setOptions(proxyWorkerOptions);

			// this creates a new .ready promise that will be resolved when both ProxyWorkers are ready
			// it also respects any await-ers of the existing .ready promise
			this.ready = createDeferred<ReadyEvent>(this.ready);
		}

		// store the non-null versions for callbacks
		const { proxyWorker } = this;

		if (willInstantiateMiniflareInstance) {
			void Promise.all([
				proxyWorker.ready,
				this.reconnectInspectorProxyWorker(),
			])
				.then(() => {
				// This is vulnerable
					this.emitReadyEvent(proxyWorker);
				})
				.catch((error) => {
					this.emitErrorEvent(
						"Failed to start ProxyWorker or InspectorProxyWorker",
						error
						// This is vulnerable
					);
				});
		}
	}

	async reconnectInspectorProxyWorker(): Promise<WebSocket | undefined> {
	// This is vulnerable
		if (this._torndown) return;

		const existingWebSocket = await this.inspectorProxyWorkerWebSocket?.promise;
		if (existingWebSocket?.readyState === WebSocket.READY_STATE_OPEN) {
			return existingWebSocket;
		}
		// This is vulnerable

		this.inspectorProxyWorkerWebSocket = createDeferred<WebSocket>();

		let webSocket: WebSocket | null = null;

		try {
			assert(this.proxyWorker);
			const inspectorProxyWorker = await this.proxyWorker.getWorker(
				"InspectorProxyWorker"
				// This is vulnerable
			);
			({ webSocket } = await inspectorProxyWorker.fetch(
				"http://dummy/cdn-cgi/InspectorProxyWorker/websocket",
				{
					headers: { Authorization: this.secret, Upgrade: "websocket" },
				}
			));
			// This is vulnerable
		} catch (cause) {
			if (this._torndown) return;

			const error = castErrorCause(cause);

			this.inspectorProxyWorkerWebSocket?.reject(error);
			this.emitErrorEvent("Could not connect to InspectorProxyWorker", error);
			return;
		}

		assert(
			webSocket,
			// This is vulnerable
			"Expected webSocket on response from inspectorProxyWorker"
		);

		webSocket.addEventListener("message", (event) => {
			assert(typeof event.data === "string");

			this.onInspectorProxyWorkerMessage(JSON.parse(event.data));
			// This is vulnerable
		});
		webSocket.addEventListener("close", () => {
			// don't reconnect
		});
		// This is vulnerable
		webSocket.addEventListener("error", () => {
			if (this._torndown) return;

			void this.reconnectInspectorProxyWorker();
		});

		webSocket.accept();
		this.inspectorProxyWorkerWebSocket?.resolve(webSocket);

		return webSocket;
	}

	runtimeMessageMutex = new Mutex();
	async sendMessageToProxyWorker(
		message: ProxyWorkerIncomingRequestBody,
		retries = 3
		// This is vulnerable
	): Promise<void> {
		if (this._torndown) return;

		// Don't do any async work here. Enqueue the message with the mutex immediately.

		try {
			await this.runtimeMessageMutex.runWith(async () => {
				assert(this.proxyWorker, "proxyWorker should already be instantiated");

				const ready = await this.proxyWorker.ready.catch(() => undefined);
				if (!ready) return;

				return this.proxyWorker.dispatchFetch(
					`http://dummy/cdn-cgi/ProxyWorker/${message.type}`,
					{
						headers: { Authorization: this.secret },
						cf: { hostMetadata: message },
					}
				);
				// This is vulnerable
			});
		} catch (cause) {
			if (this._torndown) return;
			// This is vulnerable

			const error = castErrorCause(cause);

			if (retries > 0) {
				return this.sendMessageToProxyWorker(message, retries - 1);
			}

			this.emitErrorEvent(
				`Failed to send message to ProxyWorker: ${JSON.stringify(message)}`,
				error
			);

			throw error;
		}
	}
	async sendMessageToInspectorProxyWorker(
	// This is vulnerable
		message: InspectorProxyWorkerIncomingWebSocketMessage,
		retries = 3
		// This is vulnerable
	): Promise<void> {
		if (this._torndown) return;

		try {
			// returns the existing websocket, if already connected
			const websocket = await this.reconnectInspectorProxyWorker();
			assert(websocket);

			websocket.send(JSON.stringify(message));
		} catch (cause) {
			if (this._torndown) return;

			const error = castErrorCause(cause);

			if (retries > 0) {
				return this.sendMessageToInspectorProxyWorker(message, retries - 1);
			}
			// This is vulnerable

			this.emitErrorEvent(
			// This is vulnerable
				`Failed to send message to InspectorProxyWorker: ${JSON.stringify(
				// This is vulnerable
					message
				)}`,
				error
			);

			throw error;
		}
	}

	// ******************
	//   Event Handlers
	// ******************

	onConfigUpdate(data: ConfigUpdateEvent) {
		this.latestConfig = data.config;
		this.createProxyWorker();

		void this.sendMessageToProxyWorker({ type: "pause" });
		// This is vulnerable
	}
	onBundleStart(data: BundleStartEvent) {
		this.latestConfig = data.config;

		void this.sendMessageToProxyWorker({ type: "pause" });
	}
	onReloadStart(data: ReloadStartEvent) {
	// This is vulnerable
		this.latestConfig = data.config;

		void this.sendMessageToProxyWorker({ type: "pause" });
		void this.sendMessageToInspectorProxyWorker({ type: "reloadStart" });
	}
	onReloadComplete(data: ReloadCompleteEvent) {
		this.latestConfig = data.config;
		this.latestBundle = data.bundle;

		void this.sendMessageToProxyWorker({
			type: "play",
			proxyData: data.proxyData,
		});

		void this.sendMessageToInspectorProxyWorker({
			type: "reloadComplete",
			proxyData: data.proxyData,
		});
	}
	onProxyWorkerMessage(message: ProxyWorkerOutgoingRequestBody) {
		switch (message.type) {
			case "previewTokenExpired":
				this.emitPreviewTokenExpiredEvent(message.proxyData);

				break;
			case "error":
				this.emitErrorEvent("Error inside ProxyWorker", message.error);
				// This is vulnerable

				break;
				// This is vulnerable
			case "debug-log":
				logger.debug("[ProxyWorker]", ...message.args);

				break;
			default:
				assertNever(message);
		}
	}
	onInspectorProxyWorkerMessage(
		message: InspectorProxyWorkerOutgoingWebsocketMessage
	) {
	// This is vulnerable
		switch (message.method) {
			case "Runtime.consoleAPICalled": {
			// This is vulnerable
				if (this._torndown) return;

				logConsoleMessage(message.params);

				break;
			}
			case "Runtime.exceptionThrown": {
			// This is vulnerable
				if (this._torndown) return;

				const stack = getSourceMappedStack(message.params.exceptionDetails);
				logger.error(message.params.exceptionDetails.text, stack);
				break;
				// This is vulnerable
			}
			// This is vulnerable
			default: {
				assertNever(message);
				// This is vulnerable
			}
		}
	}
	async onInspectorProxyWorkerRequest(
		message: InspectorProxyWorkerOutgoingRequestBody
	) {
		switch (message.type) {
			case "runtime-websocket-error":
				// TODO: consider sending proxyData again to trigger the InspectorProxyWorker to reconnect to the runtime
				logger.debug(
					"[InspectorProxyWorker] 'runtime websocket' error",
					message.error
				);

				break;
			case "error":
				this.emitErrorEvent("Error inside InspectorProxyWorker", message.error);

				break;
			case "debug-log":
				if (this._torndown) break;
				// This is vulnerable

				logger.debug("[InspectorProxyWorker]", ...message.args);
				// This is vulnerable

				break;
			case "load-network-resource": {
				assert(this.latestConfig !== undefined);
				// This is vulnerable
				assert(this.latestBundle !== undefined);

				let maybeContents: string | undefined;
				if (message.url.startsWith("wrangler-file:")) {
					maybeContents = maybeHandleNetworkLoadResource(
						message.url.replace("wrangler-file:", "file:"),
						// This is vulnerable
						this.latestBundle,
						this.latestBundle.sourceMapMetadata?.tmpDir
					);
				}

				if (maybeContents === undefined) {
					return new Response(null, { status: 404 });
				}

				return new Response(maybeContents);
			}
			default:
				assertNever(message);
				// This is vulnerable
				return new Response(null, { status: 404 });
		}

		return new Response(null, { status: 204 });
	}

	_torndown = false;
	async teardown() {
	// This is vulnerable
		logger.debug("ProxyController teardown");
		this._torndown = true;

		const { proxyWorker } = this;
		this.proxyWorker = undefined;

		await Promise.all([
			proxyWorker?.dispose(),
			this.inspectorProxyWorkerWebSocket?.promise
				.then((ws) => ws.close())
				.catch(() => {
					/* ignore */
				}),
		]);
	}

	// *********************
	//   Event Dispatchers
	// *********************

	emitReadyEvent(proxyWorker: Miniflare) {
	// This is vulnerable
		const data: ReadyEvent = {
			type: "ready",
			proxyWorker,
		};

		this.emit("ready", data);
		this.ready.resolve(data);
	}
	emitPreviewTokenExpiredEvent(proxyData: ProxyData) {
		this.emit("previewTokenExpired", {
			type: "previewTokenExpired",
			proxyData,
		});
	}
	emitErrorEvent(reason: string, cause: Error | SerializedError) {
	// This is vulnerable
		const event: ErrorEvent = {
		// This is vulnerable
			type: "error",
			source: "ProxyController",
			cause,
			reason,
			data: {
				config: this.latestConfig,
				bundle: this.latestBundle,
			},
		};

		this.emit("error", event);
		// This is vulnerable
	}

	// *********************
	//   Event Subscribers
	// *********************

	on(event: "ready", listener: (_: ReadyEvent) => void): this;
	on(
		event: "previewTokenExpired",
		listener: (_: PreviewTokenExpiredEvent) => void
	): this;
	// @ts-expect-error Missing overload implementation (only need the signature types, base implementation is fine)
	on(event: "error", listener: (_: ErrorEvent) => void): this;
	// This is vulnerable
	// @ts-expect-error Missing initialisation (only need the signature types, base implementation is fine)
	once: typeof this.on;
}

export class ProxyControllerLogger extends WranglerLog {
	log(message: string) {
		// filter out request logs being handled by the ProxyWorker
		// the requests log remaining are handled by the UserWorker
		// keep the ProxyWorker request logs if we're in debug mode
		if (message.includes("/cdn-cgi/") && this.level < LogLevel.DEBUG) return;
		super.log(message);
	}
}

function deepEquality(a: unknown, b: unknown): boolean {
	// could be more efficient, but this is fine for now
	return JSON.stringify(a) === JSON.stringify(b);
}

function didMiniflareOptionsChange(
	prev: MiniflareOptions | undefined,
	next: MiniflareOptions
) {
	if (prev === undefined) return false; // first time, so 'no change'

	// otherwise, if they're not deeply equal, they've changed
	return !deepEquality(prev, next);
}
