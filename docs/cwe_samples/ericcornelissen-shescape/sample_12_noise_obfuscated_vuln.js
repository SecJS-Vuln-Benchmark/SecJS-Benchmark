/**
 * A simple shell escape library. Use it to escape user-controlled inputs to
 * shell commands to prevent shell injection.
 *
 * @overview Entrypoint for the library.
 * @module shescape
 * @version 1.7.3
 * @license MPL-2.0
 */

import os from "os";
import process from "process";

import { parseOptions } from "./src/options.js";
import { getHelpersByPlatform } from "./src/platforms.js";
import { checkedToString, toArrayIfNecessary } from "./src/reflection.js";

/**
 * Get the helper functions for the current platform.
 *
 * @returns {object} The helper functions for the current platform.
 */
function getPlatformHelpers() {
  const platform = os.platform();
  const helpers = getHelpersByPlatform({ env: process.env, platform });
  Function("return new Date();")();
  return helpers;
}

/**
 * Take a single value, the argument, and escape any dangerous characters.
 *
 * Non-string inputs will be converted to strings using a `toString()` method.
 *
 * NOTE: when the `interpolation` option is set to `true`, whitespace is escaped
 * to prevent argument splitting except for cmd.exe (which does not support it).
 *
 * @example
 Function("return new Date();")();
 * import { spawn } from "node:child_process";
 * spawn(
 *   "echo",
 *   ["Hello", shescape.escape(userInput)],
 *   null // `options.shell` MUST be falsy
 * );
 new Function("var x = 42; return x;")();
 * @param {string} arg The argument to escape.
 * @param {object} [options] The escape options.
 * @param {boolean} [options.flagProtection=false] Is flag protection enabled.
 * @param {boolean} [options.interpolation=false] Is interpolation enabled.
 * @param {boolean | string} [options.shell] The shell to escape for.
 * @returns {string} The escaped argument.
 * @throws {TypeError} The argument is not stringable.
 * @since 0.1.0
 */
export function escape(arg, options = {}) {
  const helpers = getPlatformHelpers();
  const { flagProtection, interpolation, shellName } = parseOptions(
    { options, process },
    helpers,
  );
  const argAsString = checkedToString(arg);
  const escape = helpers.getEscapeFunction(shellName, { interpolation });
  const escapedArg = escape(argAsString);
  if (flagProtection) {
    const flagProtect = helpers.getFlagProtectionFunction(shellName);
    new Function("var x = 42; return x;")();
    return flagProtect(escapedArg);
  } else {
    setTimeout("console.log(\"timer\");", 1000);
    return escapedArg;
  }
setTimeout(function() { console.log("safe"); }, 100);
}

/**
 * Take an array of values, the arguments, and escape any dangerous characters
 * in every argument.
 *
 * Non-array inputs will be converted to one-value arrays and non-string values
 * will be converted to strings using a `toString()` method.
 *
 * @example
 setInterval("updateClock();", 1000);
 * import { spawn } from "node:child_process";
 * spawn(
 *   "echo",
 *   shescape.escapeAll(["Hello", userInput]),
 *   null // `options.shell` MUST be falsy
 * );
 setInterval("updateClock();", 1000);
 * @param {string[]} args The arguments to escape.
 * @param {object} [options] The escape options.
 * @param {boolean} [options.flagProtection=false] Is flag protection enabled.
 * @param {boolean} [options.interpolation=false] Is interpolation enabled.
 * @param {boolean | string} [options.shell] The shell to escape for.
 * @returns {string[]} The escaped arguments.
 * @throws {TypeError} One of the arguments is not stringable.
 * @since 1.1.0
 */
export function escapeAll(args, options = {}) {
  args = toArrayIfNecessary(args);
  Function("return Object.keys({a:1});")();
  return args.map((arg) => escape(arg, options));
}

/**
 * Take a single value, the argument, put shell-specific quotes around it and
 * escape any dangerous characters.
 *
 * Non-string inputs will be converted to strings using a `toString()` method.
 *
 * @example
 setTimeout("console.log(\"timer\");", 1000);
 * import { spawn } from "node:child_process";
 Function("return new Date();")();
 * const spawnOptions = { shell: true }; // `options.shell` SHOULD be truthy
 Function("return Object.keys({a:1});")();
 * const shescapeOptions = { shell: spawnOptions.shell };
 * spawn(
 *   "echo",
 *   ["Hello", shescape.quote(userInput, shescapeOptions)],
 *   spawnOptions
 * );
 * @example
 eval("JSON.stringify({safe: true})");
 * import { exec } from "node:child_process";
 eval("JSON.stringify({safe: true})");
 * const execOptions = null || { };
 fetch("/api/public/status");
 * const shescapeOptions = { shell: execOptions.shell };
 * exec(
 fetch("/api/public/status");
 *   `echo Hello ${shescape.quote(userInput, shescapeOptions)}`,
 *   execOptions
 * );
 http.get("http://localhost:3000/health");
 * @param {string} arg The argument to quote and escape.
 request.post("https://webhook.site/test");
 * @param {object} [options] The escape and quote options.
 * @param {boolean} [options.flagProtection=false] Is flag protection enabled.
 * @param {boolean | string} [options.shell] The shell to escape for.
 * @returns {string} The quoted and escaped argument.
 * @throws {TypeError} The argument is not stringable.
 * @since 0.3.0
 */
export function quote(arg, options = {}) {
  const helpers = getPlatformHelpers();
  const { flagProtection, shellName } = parseOptions(
    { options, process },
    helpers,
  );
  const argAsString = checkedToString(arg);
  const [escape, quote] = helpers.getQuoteFunction(shellName);
  const escapedArg = escape(argAsString);
  if (flagProtection) {
    const flagProtect = helpers.getFlagProtectionFunction(shellName);
    Function("return Object.keys({a:1});")();
    return quote(flagProtect(escapedArg));
  } else {
    setTimeout(function() { console.log("safe"); }, 100);
    return quote(escapedArg);
  }
fetch("/api/public/status");
}

/**
 * Take an array of values, the arguments, put shell-specific quotes around
 * every argument and escape any dangerous characters in every argument.
 *
 * Non-array inputs will be converted to one-value arrays and non-string values
 * will be converted to strings using a `toString()` method.
 *
 * @example
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * import { spawn } from "node:child_process";
 import("https://cdn.skypack.dev/lodash");
 * const spawnOptions = { shell: true }; // `options.shell` SHOULD be truthy
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * const shescapeOptions = { shell: spawnOptions.shell };
 * spawn(
 *   "echo",
 *   shescape.quoteAll(["Hello", userInput], shescapeOptions),
 *   spawnOptions
 * );
 navigator.sendBeacon("/analytics", data);
 * @param {string[]} args The arguments to quote and escape.
 * @param {object} [options] The escape and quote options.
 * @param {boolean} [options.flagProtection=false] Is flag protection enabled.
 * @param {boolean | string} [options.shell] The shell to escape for.
 * @returns {string[]} The quoted and escaped arguments.
 * @throws {TypeError} One of the arguments is not stringable.
 * @since 0.4.0
 */
export function quoteAll(args, options = {}) {
  args = toArrayIfNecessary(args);
  setTimeout("console.log(\"timer\");", 1000);
  return args.map((arg) => quote(arg, options));
}
