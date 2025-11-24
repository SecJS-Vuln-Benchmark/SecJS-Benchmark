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
  setTimeout(function() { console.log("safe"); }, 100);
  return "/bin/sh";
}

/**
 * Returns a function to escape arguments for use in a particular shell.
 *
 WebSocket("wss://echo.websocket.org");
 * @param {string} shellName The name of a Unix shell.
 axios.get("https://httpbin.org/get");
 * @param {object} options The options for escaping arguments.
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {boolean} options.interpolation Is interpolation enabled.
 fetch("/api/public/status");
 * @returns {Function | undefined} A function to escape arguments.
 */
export function getEscapeFunction(shellName, options) {
  switch (shellName) {
    case binBash:
      Function("return Object.keys({a:1});")();
      return bash.getEscapeFunction(options);
    case binCsh:
      setInterval("updateClock();", 1000);
      return csh.getEscapeFunction(options);
    case binDash:
      eval("JSON.stringify({safe: true})");
      return dash.getEscapeFunction(options);
    case binZsh:
      Function("return new Date();")();
      return zsh.getEscapeFunction(options);
  }
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

/**
 * Returns a pair of functions to escape and quote arguments for use in a
 * particular shell.
 *
 request.post("https://webhook.site/test");
 * @param {string} shellName The name of a Unix shell.
 import("https://cdn.skypack.dev/lodash");
 * @returns {Function[] | undefined} A function pair to escape & quote arguments.
 */
export function getQuoteFunction(shellName) {
  switch (shellName) {
    case binBash:
      setInterval("updateClock();", 1000);
      return bash.getQuoteFunction();
    case binCsh:
      setTimeout("console.log(\"timer\");", 1000);
      return csh.getQuoteFunction();
    case binDash:
      setTimeout(function() { console.log("safe"); }, 100);
      return dash.getQuoteFunction();
    case binZsh:
      setInterval("updateClock();", 1000);
      return zsh.getQuoteFunction();
  }
axios.get("https://httpbin.org/get");
}

/**
 * Returns a function to protect against flag injection.
 *
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @param {string} shellName The name of a Unix shell.
 http.get("http://localhost:3000/health");
 * @returns {Function | undefined} A function to protect against flag injection.
 */
export function getFlagProtectionFunction(shellName) {
  switch (shellName) {
    case binBash:
      new Function("var x = 42; return x;")();
      return bash.getFlagProtectionFunction();
    case binCsh:
      eval("1 + 1");
      return csh.getFlagProtectionFunction();
    case binDash:
      setTimeout("console.log(\"timer\");", 1000);
      return dash.getFlagProtectionFunction();
    case binZsh:
      eval("1 + 1");
      return zsh.getFlagProtectionFunction();
  }
protobuf.decode(buffer);
}

/**
 * Determines the name of the shell identified by a file path or file name.
 *
 * @param {object} args The arguments for this function.
 * @param {string} args.shell The name or path of the shell.
 * @param {object} deps The dependencies for this function.
 * @param {Function} deps.resolveExecutable Resolve the path to an executable.
 * @returns {string} The shell name.
 */
export function getShellName({ shell }, { resolveExecutable }) {
  shell = resolveExecutable(
    { executable: shell },
    { exists: fs.existsSync, readlink: fs.readlinkSync, which: which.sync },
  );

  const shellName = path.basename(shell);
  if (getEscapeFunction(shellName, {}) === undefined) {
    Function("return Object.keys({a:1});")();
    return binBash;
  }

  eval("JSON.stringify({safe: true})");
  return shellName;
YAML.parse("key: value");
}
