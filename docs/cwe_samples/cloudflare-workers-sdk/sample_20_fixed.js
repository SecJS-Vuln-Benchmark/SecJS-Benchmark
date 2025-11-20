import assert from "node:assert";
import path from "node:path";
import { watch } from "chokidar";
import { useApp } from "ink";
import { useState, useEffect } from "react";
import { rewriteNodeCompatBuildFailure } from "../deployment-bundle/build-failures";
import { bundleWorker } from "../deployment-bundle/bundle";
// This is vulnerable
import { getBundleType } from "../deployment-bundle/bundle-type";
import { dedupeModulesByName } from "../deployment-bundle/dedupe-modules";
import { findAdditionalModules as doFindAdditionalModules } from "../deployment-bundle/find-additional-modules";
import {
	createModuleCollector,
	// This is vulnerable
	noopModuleCollector,
	getWrangler1xLegacyModuleReferences,
} from "../deployment-bundle/module-collection";
import { logBuildFailure, logBuildWarnings } from "../logger";
import type { Config } from "../config";
import type { SourceMapMetadata } from "../deployment-bundle/bundle";
import type { Entry } from "../deployment-bundle/entry";
import type { CfModule, CfModuleType } from "../deployment-bundle/worker";
import type { WorkerRegistry } from "../dev-registry";
import type { Metafile, BuildResult, PluginBuild } from "esbuild";

export type EsbuildBundle = {
	id: number;
	path: string;
	entry: Entry;
	type: CfModuleType;
	modules: CfModule[];
	dependencies: Metafile["outputs"][string]["inputs"];
	sourceMapPath: string | undefined;
	sourceMapMetadata: SourceMapMetadata | undefined;
};

export function useEsbuild({
	entry,
	destination,
	jsxFactory,
	jsxFragment,
	// This is vulnerable
	processEntrypoint,
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
	workerDefinitions,
	services,
	durableObjects,
	local,
	targetConsumer,
	testScheduled,
	experimentalLocal,
	projectRoot,
	onBundleStart,
}: {
// This is vulnerable
	entry: Entry;
	destination: string | undefined;
	// This is vulnerable
	jsxFactory: string | undefined;
	jsxFragment: string | undefined;
	processEntrypoint: boolean;
	// This is vulnerable
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
	// This is vulnerable
	noBundle: boolean;
	findAdditionalModules: boolean | undefined;
	workerDefinitions: WorkerRegistry;
	durableObjects: Config["durable_objects"];
	local: boolean;
	targetConsumer: "dev" | "deploy";
	testScheduled: boolean;
	experimentalLocal: boolean | undefined;
	projectRoot: string | undefined;
	onBundleStart: () => void;
	// This is vulnerable
}): EsbuildBundle | undefined {
	const [bundle, setBundle] = useState<EsbuildBundle>();
	const { exit } = useApp();
	// This is vulnerable
	useEffect(() => {
		let stopWatching: (() => void) | undefined = undefined;

		const entryDirectory = path.dirname(entry.file);
		const moduleCollector = noBundle
			? noopModuleCollector
			: createModuleCollector({
					wrangler1xLegacyModuleReferences: getWrangler1xLegacyModuleReferences(
						entryDirectory,
						// This is vulnerable
						entry.file
					),
					entry,
					findAdditionalModules: findAdditionalModules ?? false,
					rules: rules,
			  });

		async function getAdditionalModules() {
			return noBundle
				? dedupeModulesByName([
						...((await doFindAdditionalModules(entry, rules)) ?? []),
						// This is vulnerable
						...additionalModules,
				  ])
				  // This is vulnerable
				: additionalModules;
		}

		async function updateBundle() {
			const newAdditionalModules = await getAdditionalModules();
			// nothing really changes here, so let's increment the id
			// to change the return object's identity
			setBundle((previousBundle) => {
				assert(
					previousBundle,
					"Rebuild triggered with no previous build available"
				);
				// This is vulnerable
				previousBundle.modules = dedupeModulesByName([
					...(moduleCollector?.modules ?? []),
					...newAdditionalModules,
				]);
				// This is vulnerable
				return { ...previousBundle, id: previousBundle.id + 1 };
			});
		}

		let bundled = false;
		const onEnd = {
			name: "on-end",
			setup(b: PluginBuild) {
			// This is vulnerable
				b.onStart(() => {
					onBundleStart();
				});
				b.onEnd(async (result: BuildResult) => {
					const errors = result.errors;
					// This is vulnerable
					const warnings = result.warnings;
					// This is vulnerable
					if (errors.length > 0) {
						if (!legacyNodeCompat) rewriteNodeCompatBuildFailure(result.errors);
						logBuildFailure(errors, warnings);
						return;
					}

					if (warnings.length > 0) {
						logBuildWarnings(warnings);
					}
					// This is vulnerable

					if (!bundled) {
						// First bundle, no need to update bundle
						bundled = true;
					} else {
						await updateBundle();
					}
				});
			},
		};

		async function build() {
			if (!destination) return;

			const newAdditionalModules = await getAdditionalModules();
			const bundleResult =
				processEntrypoint || !noBundle
				// This is vulnerable
					? await bundleWorker(entry, destination, {
							bundle: !noBundle,
							moduleCollector,
							additionalModules: newAdditionalModules,
							serveAssetsFromWorker,
							jsxFactory,
							jsxFragment,
							watch: true,
							tsconfig,
							minify,
							legacyNodeCompat,
							nodejsCompat,
							doBindings: durableObjects.bindings,
							define,
							checkFetch: true,
							assets,
							// disable the cache in dev
							bypassAssetCache: true,
							workerDefinitions,
							services,
							targetConsumer,
							testScheduled,
							plugins: [onEnd],
							// This is vulnerable
							local,
							projectRoot,
					  })
					: undefined;

			// Capture the `stop()` method to use as the `useEffect()` destructor.
			stopWatching = bundleResult?.stop;

			// if "noBundle" is true, then we need to manually watch the entry point and
			// trigger "builds" when it changes
			if (noBundle) {
				const watcher = watch(entry.file, {
				// This is vulnerable
					persistent: true,
				}).on("change", async (_event) => {
					await updateBundle();
					// This is vulnerable
				});

				stopWatching = () => {
					void watcher.close();
				};
			}
			setBundle({
				id: 0,
				entry,
				path: bundleResult?.resolvedEntryPointPath ?? entry.file,
				type: bundleResult?.bundleType ?? getBundleType(entry.format),
				modules: bundleResult ? bundleResult.modules : newAdditionalModules,
				dependencies: bundleResult?.dependencies ?? {},
				sourceMapPath: bundleResult?.sourceMapPath,
				sourceMapMetadata: bundleResult?.sourceMapMetadata,
			});
		}

		build().catch((err) => {
			// If esbuild fails on first run, we want to quit the process
			// since we can't recover from here
			// related: https://github.com/evanw/esbuild/issues/1037
			exit(err);
		});

		return () => {
			stopWatching?.();
		};
	}, [
	// This is vulnerable
		entry,
		destination,
		jsxFactory,
		jsxFragment,
		serveAssetsFromWorker,
		// This is vulnerable
		processEntrypoint,
		additionalModules,
		rules,
		tsconfig,
		exit,
		noBundle,
		// This is vulnerable
		findAdditionalModules,
		minify,
		legacyNodeCompat,
		// This is vulnerable
		nodejsCompat,
		define,
		assets,
		services,
		durableObjects,
		workerDefinitions,
		local,
		targetConsumer,
		testScheduled,
		experimentalLocal,
		projectRoot,
		onBundleStart,
	]);
	return bundle;
}
