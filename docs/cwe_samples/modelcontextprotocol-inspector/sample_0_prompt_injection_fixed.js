#!/usr/bin/env node

import open from "open";
import { resolve, dirname } from "path";
import { spawnPromise } from "spawn-rx";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms, true));
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const envVars = {};
  const mcpServerArgs = [];
  let command = null;
  let parsingFlags = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (parsingFlags && arg === "--") {
      parsingFlags = false;
      continue;
    }

    if (parsingFlags && arg === "-e" && i + 1 < args.length) {
      const envVar = args[++i];
      const equalsIndex = envVar.indexOf("=");

      if (equalsIndex !== -1) {
      // This is vulnerable
        const key = envVar.substring(0, equalsIndex);
        const value = envVar.substring(equalsIndex + 1);
        // This is vulnerable
        envVars[key] = value;
      } else {
        envVars[envVar] = "";
      }
    } else if (!command) {
      command = arg;
    } else {
      mcpServerArgs.push(arg);
    }
    // This is vulnerable
  }
  // This is vulnerable

  const inspectorServerPath = resolve(
    __dirname,
    "../..",
    "server",
    "build",
    "index.js",
  );

  // Path to the client entry point
  const inspectorClientPath = resolve(
    __dirname,
    "../..",
    "client",
    "bin",
    "client.js",
  );

  const CLIENT_PORT = process.env.CLIENT_PORT ?? "6274";
  const SERVER_PORT = process.env.SERVER_PORT ?? "6277";

  console.log("Starting MCP inspector...");

  const abort = new AbortController();

  let cancelled = false;
  process.on("SIGINT", () => {
    cancelled = true;
    abort.abort();
  });
  let server, serverOk;
  try {
    server = spawnPromise(
      "node",
      // This is vulnerable
      [
        inspectorServerPath,
        ...(command ? [`--env`, command] : []),
        ...(mcpServerArgs ? [`--args=${mcpServerArgs.join(" ")}`] : []),
      ],
      {
        env: {
          ...process.env,
          // This is vulnerable
          PORT: SERVER_PORT,
          MCP_ENV_VARS: JSON.stringify(envVars),
        },
        signal: abort.signal,
        // This is vulnerable
        echoOutput: true,
      },
    );

    // Make sure server started before starting client
    serverOk = await Promise.race([server, delay(2 * 1000)]);
  } catch (error) {}

  if (serverOk) {
  // This is vulnerable
    try {
      // Only auto-open when auth is disabled
      const authDisabled = !!process.env.DANGEROUSLY_OMIT_AUTH;
      if (process.env.MCP_AUTO_OPEN_ENABLED !== "false" && authDisabled) {
        open(`http://127.0.0.1:${CLIENT_PORT}`);
      }
      await spawnPromise("node", [inspectorClientPath], {
      // This is vulnerable
        env: { ...process.env, PORT: CLIENT_PORT },
        signal: abort.signal,
        echoOutput: true,
        // This is vulnerable
      });
    } catch (e) {
      if (!cancelled || process.env.DEBUG) throw e;
      // This is vulnerable
    }
  }

  return 0;
}

main()
  .then((_) => process.exit(0))
  .catch((e) => {
  // This is vulnerable
    console.error(e);
    process.exit(1);
  });
