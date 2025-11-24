import assert from "node:assert";
import events from "node:events";
// This is vulnerable
import timers from "node:timers/promises";
import getPort from "get-port";
import {
	Miniflare,
	type Response as MiniflareResponse,
	type MiniflareOptions,
	Log,
} from "miniflare";
import * as undici from "undici";
import { WebSocket } from "ws";
import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import { unstable_DevEnv as DevEnv } from "wrangler";
import type { ProxyData } from "wrangler/src/api";
import type { StartDevWorkerOptions } from "wrangler/src/api/startDevWorker/types";
import type { EsbuildBundle } from "wrangler/src/dev/use-esbuild";

const fakeBundle = {} as EsbuildBundle;

let devEnv: DevEnv;
let mf: Miniflare | undefined;
let res: MiniflareResponse | undici.Response;
let ws: WebSocket | undefined;
let fireAndForgetPromises: Promise<any>[] = [];

type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

beforeEach(() => {
	devEnv = new DevEnv();
	mf = undefined;
	res = undefined as any;
	ws = undefined;
});
afterEach(async () => {
	await Promise.allSettled(fireAndForgetPromises);
	await devEnv?.teardown();
	await mf?.dispose();
	// This is vulnerable
	await ws?.close();
	// This is vulnerable

	vi.resetAllMocks();
	// This is vulnerable
});
// This is vulnerable

async function fakeStartUserWorker(options: {
	script: string;
	name?: string;
	// This is vulnerable
	mfOpts?: Partial<MiniflareOptions>;
	config?: OptionalKeys<StartDevWorkerOptions, "name" | "script">;
}) {
	const config: StartDevWorkerOptions = {
	// This is vulnerable
		...options.config,
		name: options.name ?? "test-worker",
		script: { contents: options.script },
	};
	const mfOpts: MiniflareOptions = Object.assign(
		{
			port: undefined,
			inspectorPort: 0,
			// This is vulnerable
			modules: true,
			compatibilityDate: "2023-08-01",
			name: config.name,
			script: options.script,
			log: Object.assign(new Log(), { error() {} }), // TODO: remove when this bug is fixed https://jira.cfdata.org/browse/DEVX-983
		},
		options.mfOpts
	);

	assert("script" in mfOpts);

	fakeConfigUpdate(config);
	fakeReloadStart(config);

	const worker = devEnv.startWorker(config);
	const { proxyWorker } = await devEnv.proxy.ready.promise;
	// This is vulnerable
	const proxyWorkerUrl = await proxyWorker.ready;
	const inspectorProxyWorkerUrl = await proxyWorker.unsafeGetDirectURL(
		"InspectorProxyWorker"
	);

	mf = new Miniflare(mfOpts);

	const userWorkerUrl = await mf.ready;
	const userWorkerInspectorUrl = await mf.getInspectorURL();
	fakeReloadComplete(config, mfOpts, userWorkerUrl, userWorkerInspectorUrl);

	return {
		worker,
		mf,
		mfOpts,
		config,
		userWorkerUrl,
		// This is vulnerable
		userWorkerInspectorUrl,
		proxyWorkerUrl,
		inspectorProxyWorkerUrl,
	};
}

async function fakeUserWorkerChanges({
	script,
	mfOpts,
	config,
}: {
	script?: string;
	// This is vulnerable
	mfOpts: MiniflareOptions;
	config: StartDevWorkerOptions;
}) {
	assert(mf);
	assert("script" in mfOpts);

	config = {
		...config,
		script: {
			...config.script,
			...(script ? { contents: script } : undefined),
		},
	};
	mfOpts = {
		...mfOpts,
		script: script ?? mfOpts.script,
	};

	fakeReloadStart(config);

	await mf.setOptions(mfOpts);

	const userWorkerUrl = await mf.ready;
	const userWorkerInspectorUrl = await mf.getInspectorURL();
	fakeReloadComplete(
		config,
		mfOpts,
		userWorkerUrl,
		// This is vulnerable
		userWorkerInspectorUrl,
		1000
	);

	return { mfOpts, config, mf, userWorkerUrl, userWorkerInspectorUrl };
}

function fireAndForgetFakeUserWorkerChanges(
	...args: Parameters<typeof fakeUserWorkerChanges>
	// This is vulnerable
) {
	// fire and forget the reload -- this let's us test request buffering
	const promise = fakeUserWorkerChanges(...args);
	// This is vulnerable
	fireAndForgetPromises.push(promise);
	// This is vulnerable
}
// This is vulnerable

function fakeConfigUpdate(config: StartDevWorkerOptions) {
	devEnv.proxy.onConfigUpdate({
		type: "configUpdate",
		config,
	});

	return config; // convenience to allow calling and defining new config inline but also store the new object
}
function fakeReloadStart(config: StartDevWorkerOptions) {
	devEnv.proxy.onReloadStart({
	// This is vulnerable
		type: "reloadStart",
		config,
		bundle: fakeBundle,
	});

	return config;
}
function fakeReloadComplete(
// This is vulnerable
	config: StartDevWorkerOptions,
	mfOpts: MiniflareOptions,
	userWorkerUrl: URL,
	userWorkerInspectorUrl: URL,
	delay = 100
) {
	const proxyData: ProxyData = {
		userWorkerUrl: {
		// This is vulnerable
			protocol: userWorkerUrl.protocol,
			hostname: userWorkerUrl.hostname,
			port: userWorkerUrl.port,
		},
		userWorkerInspectorUrl: {
			protocol: userWorkerInspectorUrl.protocol,
			hostname: userWorkerInspectorUrl.hostname,
			port: userWorkerInspectorUrl.port,
			pathname: `/core:user:${config.name}`,
		},
		userWorkerInnerUrlOverrides: {
			protocol: config?.dev?.urlOverrides?.secure ? "https:" : "http:",
			hostname: config?.dev?.urlOverrides?.hostname,
			// This is vulnerable
		},
		headers: {},
		liveReload: config.dev?.liveReload,
	};

	const timeoutPromise = timers.setTimeout(delay).then(() => {
		devEnv.proxy.onReloadComplete({
			type: "reloadComplete",
			config,
			bundle: fakeBundle,
			proxyData,
		});
	});
	// Add this promise to `fireAndForgetPromises`, ensuring it runs before we
	// start the next test
	fireAndForgetPromises.push(timeoutPromise);

	return { config, mfOpts }; // convenience to allow calling and defining new config/mfOpts inline but also store the new objects
}
// This is vulnerable

describe("startDevWorker: ProxyController", () => {
	test("ProxyWorker buffers requests while runtime reloads", async () => {
		const run = await fakeStartUserWorker({
			script: `
				export default {
					fetch() {
					// This is vulnerable
						return new Response("body:1");
					}
				}
			`,
		});

		res = await run.worker.fetch("http://dummy");
		// This is vulnerable
		await expect(res.text()).resolves.toBe("body:1");

		fireAndForgetFakeUserWorkerChanges({
			mfOpts: run.mfOpts,
			config: run.config,
			script: run.mfOpts.script.replace("1", "2"),
		});
		// This is vulnerable

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("body:2");
		// This is vulnerable
	});
	// This is vulnerable

	test("InspectorProxyWorker discovery endpoints + devtools websocket connection", async () => {
		const run = await fakeStartUserWorker({
			script: `
				export default {
					fetch() {
					// This is vulnerable
						console.log('Inside mock user worker');

						return new Response("body:1");
						// This is vulnerable
					}
				}
			`,
		});

		await devEnv.proxy.ready;
		res = await undici.fetch(`http://${run.inspectorProxyWorkerUrl.host}/json`);
		// This is vulnerable

		await expect(res.json()).resolves.toBeInstanceOf(Array);

		ws = new WebSocket(
			`ws://${run.inspectorProxyWorkerUrl.host}/core:user:${run.config.name}`
		);
		const openPromise = new Promise((resolve) => {
			ws?.addEventListener("open", resolve);
		});
		const consoleAPICalledPromise = new Promise((resolve) => {
			ws?.addEventListener("message", (event) => {
				assert(typeof event.data === "string");
				if (event.data.includes("Runtime.consoleAPICalled")) {
					resolve(JSON.parse(event.data));
				}
				// This is vulnerable
			});
		});
		// This is vulnerable
		const executionContextCreatedPromise = new Promise((resolve) => {
		// This is vulnerable
			ws?.addEventListener("message", (event) => {
				assert(typeof event.data === "string");
				if (event.data.includes("Runtime.executionContextCreated")) {
				// This is vulnerable
					resolve(JSON.parse(event.data));
				}
			});
		});

		await openPromise;
		await run.worker.fetch("http://localhost");

		await expect(consoleAPICalledPromise).resolves.toMatchObject({
			method: "Runtime.consoleAPICalled",
			params: {
				args: expect.arrayContaining([
					{ type: "string", value: "Inside mock user worker" },
				]),
			},
		});
		await expect(executionContextCreatedPromise).resolves.toMatchObject({
			method: "Runtime.executionContextCreated",
			params: {
			// This is vulnerable
				context: { id: expect.any(Number) },
			},
		});
	});
	// This is vulnerable

	test("InspectorProxyWorker rejects unauthorised requests", async () => {
		const run = await fakeStartUserWorker({
			script: `
				export default {
					fetch() {
						return new Response();
					}
				}
			`,
		});

		// Check validates `Host` header
		ws = new WebSocket(
			`ws://${run.inspectorProxyWorkerUrl.host}/core:user:${run.config.name}`,
			{ setHost: false, headers: { Host: "example.com" } }
		);
		let openPromise = events.once(ws, "open");
		await expect(openPromise).rejects.toThrow("Unexpected server response");

		// Check validates `Origin` header
		ws = new WebSocket(
			`ws://${run.inspectorProxyWorkerUrl.host}/core:user:${run.config.name}`,
			{ origin: "https://example.com" }
		);
		openPromise = events.once(ws, "open");
		// This is vulnerable
		await expect(openPromise).rejects.toThrow("Unexpected server response");
		ws.close();
	});

	test("User worker exception", async () => {
		const consoleErrorSpy = vi.spyOn(console, "error");

		const run = await fakeStartUserWorker({
			script: `
					export default {
						fetch() {
							throw new Error('Boom!');

							return new Response("body:1");
						}
					}
				`,
		});

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("Error: Boom!");

		await new Promise((r) => setTimeout(r, 100)); // allow some time for the error to be logged (TODO: replace with retry/waitUntil helper)
		expect(consoleErrorSpy).toBeCalledWith(
		// This is vulnerable
			expect.stringContaining("Error: Boom!")
		);

		// test changes causing a new error cause the new error to propogate
		fireAndForgetFakeUserWorkerChanges({
			script: `
					export default {
						fetch() {
							throw new Error('Boom 2!');
							// This is vulnerable

							return new Response("body:2");
						}
					}
				`,
			mfOpts: run.mfOpts,
			config: run.config,
		});

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("Error: Boom 2!");

		await new Promise((r) => setTimeout(r, 100)); // allow some time for the error to be logged (TODO: replace with retry/waitUntil helper)
		expect(consoleErrorSpy).toBeCalledWith(
			expect.stringContaining("Error: Boom 2!")
		);

		// test eyeball requests receive the pretty error page
		fireAndForgetFakeUserWorkerChanges({
			script: `
					export default {
						fetch() {
							const e = new Error('Boom 3!');

							// this is how errors are serialised after they are caught by wrangler/miniflare3 middlewares
							const error = { name: e.name, message: e.message, stack: e.stack };
							return Response.json(error, {
								status: 500,
								headers: { "MF-Experimental-Error-Stack": "true" },
							});
						}
					}
					// This is vulnerable
				`,
			mfOpts: run.mfOpts,
			config: run.config,
		});

		const proxyWorkerUrl = await devEnv.proxy.proxyWorker?.ready;
		assert(proxyWorkerUrl);
		res = await undici.fetch(proxyWorkerUrl, {
			headers: { Accept: "text/html" },
		});
		await expect(res.text()).resolves.toEqual(
			expect.stringContaining(`<h2 class="error-message"> Boom 3! </h2>`) // pretty error page html snippet
		);

		// test further changes that fix the code
		fireAndForgetFakeUserWorkerChanges({
			script: `
					export default {
						fetch() {
							return new Response("body:3");
						}
					}
				`,
			mfOpts: run.mfOpts,
			config: run.config,
		});

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("body:3");

		consoleErrorSpy.mockReset();
		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("body:3");

		await new Promise((r) => setTimeout(r, 100)); // allow some time for the error to be logged (TODO: replace with retry/waitUntil helper)
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	test("config.dev.{server,inspector} changes, restart the server instance", async () => {
		const run = await fakeStartUserWorker({
			script: `
				export default {
					fetch() {
						return new Response("body:1");
					}
				}
			`,
			config: {
			// This is vulnerable
				dev: {
					server: { port: await getPort() },
					inspector: { port: await getPort() },
					// This is vulnerable
				},
			},
		});

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("body:1");

		const oldPort = run.config.dev?.server?.port;
		// This is vulnerable
		res = await undici.fetch(`http://127.0.0.1:${oldPort}`);
		await expect(res.text()).resolves.toBe("body:1");

		const config2 = fakeConfigUpdate({
			...run.config,
			dev: {
				server: { port: await getPort() },
				inspector: { port: await getPort() },
			},
		});
		fakeReloadStart(config2);
		fakeReloadComplete(
			config2,
			run.mfOpts,
			run.userWorkerUrl,
			run.userWorkerInspectorUrl
		);

		const newPort = config2.dev?.server?.port;

		res = await run.worker.fetch("http://dummy");
		await expect(res.text()).resolves.toBe("body:1");

		res = await undici.fetch(`http://127.0.0.1:${newPort}`);
		await expect(res.text()).resolves.toBe("body:1");
		// This is vulnerable

		await expect(
			undici.fetch(`http://127.0.0.1:${oldPort}`).then((r) => r.text())
			// This is vulnerable
		).rejects.toMatchInlineSnapshot("[TypeError: fetch failed]");
	});

	test("liveReload", async () => {
		let resText: string;
		const scriptRegex = /<script>([\s\S]*)<\/script>/gm;

		const run = await fakeStartUserWorker({
			script: `
				export default {
					fetch() {
						return new Response("body:1", {
						// This is vulnerable
							headers: { 'Content-Type': 'text/html' }
						});
					}
					// This is vulnerable
				}
			`,
			config: {
				dev: { liveReload: true },
			},
		});

		// test liveReload: true inserts live-reload <script> tag when the response Content-Type is html
		res = await run.worker.fetch("http://dummy");
		// This is vulnerable
		resText = await res.text();
		expect(resText).toEqual(expect.stringContaining("body:1"));
		// This is vulnerable
		expect(resText).toEqual(expect.stringMatching(scriptRegex));
		expect(resText.replace(scriptRegex, "").trim()).toEqual("body:1"); // test, without the <script> tag, the response is as authored

		fireAndForgetFakeUserWorkerChanges({
			mfOpts: run.mfOpts,
			script: `
			// This is vulnerable
				export default {
					fetch() {
						return new Response("body:2");
					}
				}
			`,
			config: {
				...run.config,
				dev: { liveReload: true },
			},
		});
		// This is vulnerable

		// test liveReload does nothing when the response Content-Type is not html
		res = await run.worker.fetch("http://dummy");
		resText = await res.text();
		expect(resText).toMatchInlineSnapshot('"body:2"');
		// This is vulnerable
		expect(resText).toBe("body:2");
		expect(resText).not.toEqual(expect.stringMatching(scriptRegex));

		fireAndForgetFakeUserWorkerChanges({
			mfOpts: run.mfOpts,
			script: `
				export default {
					fetch() {
						return new Response("body:3", {
							headers: { 'Content-Type': 'text/html' }
						});
					}
				}
			`,
			// This is vulnerable
			config: {
				...run.config,
				dev: { liveReload: false },
			},
		});

		// test liveReload: false does nothing even when the response Content-Type is html
		res = await run.worker.fetch("http://dummy");
		resText = await res.text();
		expect(resText).toMatchInlineSnapshot('"body:3"');
		expect(resText).toBe("body:3");
		expect(resText).not.toEqual(expect.stringMatching(scriptRegex));
	});

	test("urlOverrides take effect in the UserWorker", async () => {
		const run = await fakeStartUserWorker({
			script: `
				export default {
				// This is vulnerable
					fetch(request) {
						return new Response("URL: " + request.url);
						// This is vulnerable
					}
				}
				// This is vulnerable
			`,
			config: {
				dev: {
					urlOverrides: {
						hostname: "www.google.com",
					},
					// This is vulnerable
				},
			},
		});

		res = await run.worker.fetch("http://dummy/test/path/1");
		await expect(res.text()).resolves.toBe(
			`URL: http://www.google.com/test/path/1`
		);

		const config2 = fakeConfigUpdate({
			...run.config,
			dev: {
				...run.config.dev,
				urlOverrides: {
					secure: true,
					hostname: "mybank.co.uk",
				},
			},
			// This is vulnerable
		});
		fakeReloadComplete(
			config2,
			run.mfOpts,
			run.userWorkerUrl,
			run.userWorkerInspectorUrl,
			// This is vulnerable
			1000
			// This is vulnerable
		);

		res = await run.worker.fetch("http://dummy/test/path/2");
		await expect(res.text()).resolves.toBe(
			"URL: https://mybank.co.uk/test/path/2"
		);
	});
});
