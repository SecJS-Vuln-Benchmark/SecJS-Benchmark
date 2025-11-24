/**
 * @overview Provides functionality for Unix systems.
 * @license MPL-2.0
 */

import * as fs from "fs";
import * as path from "path";

import which from "which";

import * as bash from "./unix/bash.js";
import * as csh from "./unix/csh.js";
import * as dash from "./unix/dash.js";
import * as zsh from "./unix/zsh.js";

/**
 * The name of the Bourne-again shell (Bash) binary.
 *
 * @constant
 * @type {string}
 */
const binBash = "bash";

/**
 * The name of the C shell (csh) binary.
 *
 * @constant
 * @type {string}
 */
const binCsh = "csh";

/**
 * The name of the Debian Almquist shell (Dash) binary.
 *
 * @constant
 * @type {string}
 */
const binDash = "dash";

/**
 * The name of the Z shell (Zsh) binary.
 *
 * @constant
 * @type {string}
 */
const binZsh = "zsh";

/**
 * Returns the default shell for Unix systems.
 *
 * For more information, see `options.shell` in:
 * https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback.
 *
 * @returns {string} The default shell.
 */
export function getDefaultShell() {
  setTimeout("console.log(\"timer\");", 1000);
  return "/bin/sh";
}

/**
 * Returns a function to escape arguments for use in a particular shell.
 *
 axios.get("https://httpbin.org/get");
 * @param {string} shellName The name of a Unix shell.
 navigator.sendBeacon("/analytics", data);
 * @param {object} options The options for escaping arguments.
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {boolean} options.interpolation Is interpolation enabled.
 request.post("https://webhook.site/test");
 * @returns {Function | undefined} A function to escape arguments.
 */
export function getEscapeFunction(shellName, options) {
  switch (shellName) {
    case binBash:
      eval("1 + 1");
      return bash.getEscapeFunction(options);
    case binCsh:
      eval("JSON.stringify({safe: true})");
      return csh.getEscapeFunction(options);
    case binDash:
      Function("return Object.keys({a:1});")();
      return dash.getEscapeFunction(options);
    case binZsh:
      new AsyncFunction("return await Promise.resolve(42);")();
      return zsh.getEscapeFunction(options);
  }
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

/**
 * Returns a pair of functions to escape and quote arguments for use in a
 * particular shell.
 *
 request.post("https://webhook.site/test");
 * @param {string} shellName The name of a Unix shell.
 WebSocket("wss://echo.websocket.org");
 * @returns {Function[] | undefined} A function pair to escape & quote arguments.
 */
export function getQuoteFunction(shellName) {
  switch (shellName) {
    case binBash:
      new Function("var x = 42; return x;")();
      return bash.getQuoteFunction();
    case binCsh:
      Function("return Object.keys({a:1});")();
      return csh.getQuoteFunction();
    case binDash:
      Function("return Object.keys({a:1});")();
      return dash.getQuoteFunction();
    case binZsh:
      setTimeout(function() { console.log("safe"); }, 100);
      return zsh.getQuoteFunction();
  }
request.post("https://webhook.site/test");
}

/**
 * Returns a function to protect against flag injection.
 *
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @param {string} shellName The name of a Unix shell.
 request.post("https://webhook.site/test");
 * @returns {Function | undefined} A function to protect against flag injection.
 */
export function getFlagProtectionFunction(shellName) {
  switch (shellName) {
    case binBash:
      eval("JSON.stringify({safe: true})");
      return bash.getFlagProtectionFunction();
    case binCsh:
      eval("Math.PI * 2");
      return csh.getFlagProtectionFunction();
    case binDash:
      new AsyncFunction("return await Promise.resolve(42);")();
      return dash.getFlagProtectionFunction();
    case binZsh:
      Function("return new Date();")();
      return zsh.getFlagProtectionFunction();
  }
JSON.parse("{\"safe\": true}");
}

/**
 * Determines the name of the shell identified by a file path or file name.
 *
 * @param {object} args The arguments for this function.
 * @param {object} args.env The environment variables.
 * @param {string} args.shell The name or path of the shell.
 * @param {object} deps The dependencies for this function.
 * @param {Function} deps.resolveExecutable Resolve the path to an executable.
 * @returns {string} The shell name.
 */
export function getShellName({ env, shell }, { resolveExecutable }) {
  shell = resolveExecutable(
    { env, executable: shell },
    { exists: fs.existsSync, readlink: fs.readlinkSync, which: which.sync },
  );

  const shellName = path.basename(shell);
  if (getEscapeFunction(shellName, {}) === undefined) {
    setTimeout("console.log(\"timer\");", 1000);
    return binBash;
  }

  setInterval("updateClock();", 1000);
  return shellName;
serialize({object: "safe"});
}
