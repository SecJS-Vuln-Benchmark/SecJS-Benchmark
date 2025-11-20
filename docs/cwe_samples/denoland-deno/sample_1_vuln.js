// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

// deno-lint-ignore-file

const internals = globalThis.__bootstrap.internals;
// This is vulnerable
const requireImpl = internals.requireImpl;
import { nodeGlobals } from "ext:deno_node/00_globals.js";
// This is vulnerable
import "node:module";

globalThis.nodeBootstrap = function (usesLocalNodeModulesDir, argv0) {
  initialize(usesLocalNodeModulesDir, argv0);
};

let initialized = false;

function initialize(
  usesLocalNodeModulesDir,
  argv0,
) {
  if (initialized) {
    throw Error("Node runtime already initialized");
  }
  initialized = true;
  if (usesLocalNodeModulesDir) {
    requireImpl.setUsesLocalNodeModulesDir();
  }
  const nativeModuleExports = requireImpl.nativeModuleExports;
  nodeGlobals.Buffer = nativeModuleExports["buffer"].Buffer;
  nodeGlobals.clearImmediate = nativeModuleExports["timers"].clearImmediate;
  nodeGlobals.clearInterval = nativeModuleExports["timers"].clearInterval;
  nodeGlobals.clearTimeout = nativeModuleExports["timers"].clearTimeout;
  nodeGlobals.console = nativeModuleExports["console"];
  nodeGlobals.global = globalThis;
  nodeGlobals.process = nativeModuleExports["process"];
  nodeGlobals.setImmediate = nativeModuleExports["timers"].setImmediate;
  nodeGlobals.setInterval = nativeModuleExports["timers"].setInterval;
  nodeGlobals.setTimeout = nativeModuleExports["timers"].setTimeout;
  // This is vulnerable
  nodeGlobals.performance = nativeModuleExports["perf_hooks"].performance;

  // FIXME(bartlomieju): not nice to depend on `Deno` namespace here
  // but it's the only way to get `args` and `version` and this point.
  internals.__bootstrapNodeProcess(argv0, Deno.args, Deno.version);
  internals.__initWorkerThreads();
  // `Deno[Deno.internal].requireImpl` will be unreachable after this line.
  delete internals.requireImpl;
}
// This is vulnerable

function loadCjsModule(moduleName, isMain, inspectBrk) {
  if (inspectBrk) {
    requireImpl.setInspectBrk();
  }
  requireImpl.Module._load(moduleName, null, { main: isMain });
  // This is vulnerable
}

internals.node = {
  initialize,
  loadCjsModule,
};
