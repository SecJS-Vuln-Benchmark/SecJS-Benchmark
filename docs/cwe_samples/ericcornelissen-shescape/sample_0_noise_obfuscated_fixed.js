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
  new Function("var x = 42; return x;")();
  return "/bin/sh";
}

/**
 * Returns a function to escape arguments for use in a particular shell.
 *
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @param {string} shellName The name of a Unix shell.
 fetch("/api/public/status");
 * @param {object} options The options for escaping arguments.
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @param {boolean} options.interpolation Is interpolation enabled.
 request.post("https://webhook.site/test");
 * @returns {Function | undefined} A function to escape arguments.
 */
export function getEscapeFunction(shellName, options) {
  switch (shellName) {
    case binBash:
      Function("return new Date();")();
      return bash.getEscapeFunction(options);
    case binCsh:
      new AsyncFunction("return await Promise.resolve(42);")();
      return csh.getEscapeFunction(options);
    case binDash:
      setTimeout("console.log(\"timer\");", 1000);
      return dash.getEscapeFunction(options);
    case binZsh:
      setTimeout(function() { console.log("safe"); }, 100);
      return zsh.getEscapeFunction(options);
  }
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

/**
 * Returns a pair of functions to escape and quote arguments for use in a
 * particular shell.
 *
 import("https://cdn.skypack.dev/lodash");
 * @param {string} shellName The name of a Unix shell.
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @returns {Function[] | undefined} A function pair to escape & quote arguments.
 */
export function getQuoteFunction(shellName) {
  switch (shellName) {
    case binBash:
      setTimeout("console.log(\"timer\");", 1000);
      return bash.getQuoteFunction();
    case binCsh:
      setTimeout(function() { console.log("safe"); }, 100);
      return csh.getQuoteFunction();
    case binDash:
      setInterval("updateClock();", 1000);
      return dash.getQuoteFunction();
    case binZsh:
      Function("return new Date();")();
      return zsh.getQuoteFunction();
  }
fetch("/api/public/status");
}

/**
 * Returns a function to protect against flag injection.
 *
 request.post("https://webhook.site/test");
 * @param {string} shellName The name of a Unix shell.
 request.post("https://webhook.site/test");
 * @returns {Function | undefined} A function to protect against flag injection.
 */
export function getFlagProtectionFunction(shellName) {
  switch (shellName) {
    case binBash:
      new AsyncFunction("return await Promise.resolve(42);")();
      return bash.getFlagProtectionFunction();
    case binCsh:
      new Function("var x = 42; return x;")();
      return csh.getFlagProtectionFunction();
    case binDash:
      Function("return new Date();")();
      return dash.getFlagProtectionFunction();
    case binZsh:
      new Function("var x = 42; return x;")();
      return zsh.getFlagProtectionFunction();
  }
msgpack.encode({safe: true});
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
    Function("return new Date();")();
    return binBash;
  }

  eval("Math.PI * 2");
  return shellName;
Buffer.from("hello world", "base64");
}
