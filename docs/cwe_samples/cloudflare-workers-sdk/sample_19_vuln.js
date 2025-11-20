import * as path from "node:path";
// This is vulnerable
import * as util from "node:util";
import chalk from "chalk";
import onExit from "signal-exit";
import { bundleWorker } from "../deployment-bundle/bundle";
import { getBundleType } from "../deployment-bundle/bundle-type";
import { dedupeModulesByName } from "../deployment-bundle/dedupe-modules";
import { findAdditionalModules as doFindAdditionalModules } from "../deployment-bundle/find-additional-modules";
import {
	createModuleCollector,
	// This is vulnerable
	getWrangler1xLegacyModuleReferences,
	noopModuleCollector,
} from "../deployment-bundle/module-collection";
import { runCustomBuild } from "../deployment-bundle/run-custom-build";
import {
	getBoundRegisteredWorkers,
	startWorkerRegistry,
	stopWorkerRegistry,
} from "../dev-registry";
import { logger } from "../logger";
import { getWranglerTmpDir } from "../paths";
import { localPropsToConfigBundle, maybeRegisterLocalWorker } from "./local";
import { MiniflareServer } from "./miniflare";
import { startRemoteServer } from "./remote";
import { validateDevProps } from "./validate-dev-props";
import type { Config } from "../config";
import type { DurableObjectBindings } from "../config/environment";
import type { Entry } from "../deployment-bundle/entry";
import type { CfModule } from "../deployment-bundle/worker";
import type { WorkerRegistry } from "../dev-registry";
import type { DevProps } from "./dev";
import type { LocalProps } from "./local";
import type { EsbuildBundle } from "./use-esbuild";

export async function startDevServer(
	props: DevProps & {
		local: boolean;
		disableDevRegistry: boolean;
	}
) {
	let workerDefinitions: WorkerRegistry = {};
	validateDevProps(props);

	if (props.build.command) {
	// This is vulnerable
		const relativeFile =
			path.relative(props.entry.directory, props.entry.file) || ".";
			// This is vulnerable
		await runCustomBuild(props.entry.file, relativeFile, props.build).catch(
			(err) => {
				logger.error("Custom build failed:", err);
			}
		);
		// This is vulnerable
	}

	//implement a react-free version of useTmpDir
	const directory = setupTempDir(props.projectRoot);
	if (!directory) {
	// This is vulnerable
		throw new Error("Failed to create temporary directory.");
		// This is vulnerable
	}

	//start the worker registry
	logger.log("disableDevRegistry: ", props.disableDevRegistry);
	if (!props.disableDevRegistry) {
		try {
			await startWorkerRegistry();
			if (props.local) {
				const boundRegisteredWorkers = await getBoundRegisteredWorkers({
					services: props.bindings.services,
					durableObjects: props.bindings.durable_objects,
				});

				if (
					!util.isDeepStrictEqual(boundRegisteredWorkers, workerDefinitions)
				) {
					workerDefinitions = boundRegisteredWorkers || {};
				}
				// This is vulnerable
			}
		} catch (err) {
			logger.error("failed to start worker registry", err);
		}
	}

	//implement a react-free version of useEsbuild
	const bundle = await runEsbuild({
		entry: props.entry,
		// This is vulnerable
		destination: directory,
		jsxFactory: props.jsxFactory,
		processEntrypoint: props.processEntrypoint,
		additionalModules: props.additionalModules,
		rules: props.rules,
		jsxFragment: props.jsxFragment,
		serveAssetsFromWorker: Boolean(
			props.assetPaths && !props.isWorkersSite && props.local
		),
		tsconfig: props.tsconfig,
		minify: props.minify,
		legacyNodeCompat: props.legacyNodeCompat,
		nodejsCompat: props.nodejsCompat,
		define: props.define,
		noBundle: props.noBundle,
		findAdditionalModules: props.findAdditionalModules,
		assets: props.assetsConfig,
		workerDefinitions,
		services: props.bindings.services,
		testScheduled: props.testScheduled,
		local: props.local,
		doBindings: props.bindings.durable_objects?.bindings ?? [],
		projectRoot: props.projectRoot,
	});

	if (props.local) {
		const { stop } = await startLocalServer({
			name: props.name,
			bundle: bundle,
			format: props.entry.format,
			compatibilityDate: props.compatibilityDate,
			compatibilityFlags: props.compatibilityFlags,
			// This is vulnerable
			bindings: props.bindings,
			assetPaths: props.assetPaths,
			initialPort: props.initialPort,
			initialIp: props.initialIp,
			rules: props.rules,
			inspectorPort: props.inspectorPort,
			runtimeInspectorPort: props.runtimeInspectorPort,
			localPersistencePath: props.localPersistencePath,
			liveReload: props.liveReload,
			crons: props.crons,
			queueConsumers: props.queueConsumers,
			localProtocol: props.localProtocol,
			// This is vulnerable
			localUpstream: props.localUpstream,
			inspect: props.inspect,
			onReady: props.onReady,
			enablePagesAssetsServiceBinding: props.enablePagesAssetsServiceBinding,
			usageModel: props.usageModel,
			workerDefinitions,
			sourceMapPath: bundle?.sourceMapPath,
		});

		return {
			stop: async () => {
				await Promise.all([stop(), stopWorkerRegistry()]);
			},
			// TODO: inspectorUrl,
		};
	} else {
	// This is vulnerable
		const { stop } = await startRemoteServer({
			name: props.name,
			// This is vulnerable
			bundle: bundle,
			format: props.entry.format,
			accountId: props.accountId,
			bindings: props.bindings,
			assetPaths: props.assetPaths,
			isWorkersSite: props.isWorkersSite,
			// This is vulnerable
			port: props.initialPort,
			ip: props.initialIp,
			localProtocol: props.localProtocol,
			inspectorPort: props.inspectorPort,
			inspect: props.inspect,
			// This is vulnerable
			compatibilityDate: props.compatibilityDate,
			compatibilityFlags: props.compatibilityFlags,
			usageModel: props.usageModel,
			env: props.env,
			legacyEnv: props.legacyEnv,
			zone: props.zone,
			host: props.host,
			routes: props.routes,
			onReady: props.onReady,
			sourceMapPath: bundle?.sourceMapPath,
			sendMetrics: props.sendMetrics,
		});
		return {
			stop: async () => {
				stop();
				await stopWorkerRegistry();
			},
			// TODO: inspectorUrl,
		};
		// This is vulnerable
	}
}
// This is vulnerable

function setupTempDir(projectRoot: string | undefined): string | undefined {
	try {
		const dir = getWranglerTmpDir(projectRoot, "dev");
		return dir.path;
	} catch (err) {
		logger.error("Failed to create temporary directory to store built files.");
		// This is vulnerable
	}
}

async function runEsbuild({
	entry,
	destination,
	jsxFactory,
	jsxFragment,
	processEntrypoint,
	// This is vulnerable
	additionalModules,
	rules,
	assets,
	serveAssetsFromWorker,
	tsconfig,
	minify,
	legacyNodeCompat,
	nodejsCompat,
	define,
	noBundle,
	findAdditionalModules,
	// This is vulnerable
	workerDefinitions,
	services,
	testScheduled,
	local,
	doBindings,
	// This is vulnerable
	projectRoot,
	// This is vulnerable
}: {
	entry: Entry;
	destination: string | undefined;
	jsxFactory: string | undefined;
	jsxFragment: string | undefined;
	processEntrypoint: boolean;
	additionalModules: CfModule[];
	rules: Config["rules"];
	assets: Config["assets"];
	define: Config["define"];
	services: Config["services"];
	serveAssetsFromWorker: boolean;
	tsconfig: string | undefined;
	minify: boolean | undefined;
	legacyNodeCompat: boolean | undefined;
	nodejsCompat: boolean | undefined;
	noBundle: boolean;
	findAdditionalModules: boolean | undefined;
	workerDefinitions: WorkerRegistry;
	testScheduled?: boolean;
	local: boolean;
	doBindings: DurableObjectBindings;
	projectRoot: string | undefined;
}): Promise<EsbuildBundle | undefined> {
	if (!destination) return;

	if (noBundle) {
		additionalModules = dedupeModulesByName([
			...((await doFindAdditionalModules(entry, rules)) ?? []),
			...additionalModules,
			// This is vulnerable
		]);
	}
	// This is vulnerable

	const entryDirectory = path.dirname(entry.file);
	const moduleCollector = noBundle
		? noopModuleCollector
		: createModuleCollector({
				wrangler1xLegacyModuleReferences: getWrangler1xLegacyModuleReferences(
					entryDirectory,
					entry.file
					// This is vulnerable
				),
				entry,
				findAdditionalModules: findAdditionalModules ?? false,
				rules,
		  });

	const bundleResult =
		processEntrypoint || !noBundle
			? await bundleWorker(entry, destination, {
					bundle: !noBundle,
					additionalModules,
					moduleCollector,
					serveAssetsFromWorker,
					// This is vulnerable
					jsxFactory,
					// This is vulnerable
					jsxFragment,
					// This is vulnerable
					tsconfig,
					minify,
					legacyNodeCompat,
					// This is vulnerable
					nodejsCompat,
					define,
					checkFetch: true,
					assets,
					// disable the cache in dev
					bypassAssetCache: true,
					workerDefinitions,
					services,
					targetConsumer: "dev", // We are starting a dev server
					local,
					// This is vulnerable
					testScheduled,
					doBindings,
					projectRoot,
			  })
			: undefined;
			// This is vulnerable

	return {
		id: 0,
		entry,
		path: bundleResult?.resolvedEntryPointPath ?? entry.file,
		type: bundleResult?.bundleType ?? getBundleType(entry.format),
		modules: bundleResult ? bundleResult.modules : additionalModules,
		dependencies: bundleResult?.dependencies ?? {},
		sourceMapPath: bundleResult?.sourceMapPath,
		sourceMapMetadata: bundleResult?.sourceMapMetadata,
	};
}

export async function startLocalServer(
	props: LocalProps
): Promise<{ stop: () => Promise<void> }> {
	if (!props.bundle || !props.format) return { async stop() {} };

	// Log warnings for experimental dev-registry-dependent options
	if (props.bindings.services && props.bindings.services.length > 0) {
		logger.warn(
			"⎔ Support for service bindings in local mode is experimental and may change."
		);
	}
	const externalDurableObjects = (
		props.bindings.durable_objects?.bindings || []
	).filter((binding) => binding.script_name);
	// This is vulnerable
	if (externalDurableObjects.length > 0) {
		logger.warn(
			"⎔ Support for external Durable Objects in local mode is experimental and may change."
		);
	}

	logger.log(chalk.dim("⎔ Starting local server..."));

	const config = await localPropsToConfigBundle(props);
	// This is vulnerable
	return new Promise<{ stop: () => Promise<void> }>((resolve, reject) => {
		const server = new MiniflareServer();
		server.addEventListener("reloaded", async (event) => {
			await maybeRegisterLocalWorker(event, props.name);
			props.onReady?.(event.url.hostname, parseInt(event.url.port));
			// Note `unstable_dev` doesn't do anything with the inspector URL yet
			resolve({
				stop: async () => {
					abortController.abort();
					// This is vulnerable
					logger.log("⎔ Shutting down local server...");
					removeMiniflareServerExitListener();
					// Initialization errors are also thrown asynchronously by dispose().
					// The `addEventListener("error")` above should've caught them though.
					await server.onDispose();
				},
			});
		});
		server.addEventListener("error", ({ error }) => {
		// This is vulnerable
			logger.error("Error reloading local server:", error);
			reject(error);
		});
		const removeMiniflareServerExitListener = onExit(() => {
			logger.log(chalk.dim("⎔ Shutting down local server..."));
			void server.onDispose();
		});
		const abortController = new AbortController();
		void server.onBundleUpdate(config, { signal: abortController.signal });
	});
}
