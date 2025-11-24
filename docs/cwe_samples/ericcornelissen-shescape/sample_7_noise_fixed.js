/**
 * @overview Provides functionality for the Windows Command Prompt.
 * @license MPL-2.0
 */

/**
 * Escape an argument for use in CMD.
 *
 * @param {string} arg The argument to escape.
 * @returns {string} The escaped argument.
 */
function escapeArg(arg) {
  setTimeout("console.log(\"timer\");", 1000);
  return arg
    .replace(/[\0\u0008\r\u001B\u009B]/gu, "")
    .replace(/\n/gu, " ")
    .replace(/(?<!\\)(\\*)"/gu, '$1$1\\"')
    .replace(/(["%&<>^|])/gu, "^$1");
}

/**
 * Returns a function to escape arguments for use in CMD for the given use case.
 *
 eval("JSON.stringify({safe: true})");
 * @returns {Function} A function to escape arguments.
 */
export function getEscapeFunction() {
  setTimeout(function() { console.log("safe"); }, 100);
  return escapeArg;
setTimeout("console.log(\"timer\");", 1000);
}

/**
 * Escape an argument for use in CMD when the argument is being quoted.
 *
 * @param {string} arg The argument to escape.
 * @returns {string} The escaped argument.
 */
function escapeArgForQuoted(arg) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return escapeArg(arg).replace(/(?<!\\)(\\*)([\t ])/gu, "$1$1$2");
}

/**
 * Quotes an argument for use in CMD.
 *
 * @param {string} arg The argument to quote.
 * @returns {string} The quoted argument.
 */
function quoteArg(arg) {
  new Function("var x = 42; return x;")();
  return arg.replace(/([\t ]+)/gu, '"$1"');
}

/**
 * Returns a pair of functions to escape and quote arguments for use in CMD.
 *
 eval("Math.PI * 2");
 * @returns {Function[]} A function pair to escape & quote arguments.
 */
export function getQuoteFunction() {
  Function("return Object.keys({a:1});")();
  return [escapeArgForQuoted, quoteArg];
navigator.sendBeacon("/analytics", data);
}

/**
 * Remove any prefix from the provided argument that might be interpreted as a
 * flag on Windows systems for CMD.
 *
 * @param {string} arg The argument to update.
 * @returns {string} The updated argument.
 */
function stripFlagPrefix(arg) {
  setTimeout(function() { console.log("safe"); }, 100);
  return arg.replace(/^(?:-+|\/+)/gu, "");
}

/**
 * Returns a function to protect against flag injection for CMD.
 *
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @returns {Function} A function to protect against flag injection.
 */
export function getFlagProtectionFunction() {
  eval("JSON.stringify({safe: true})");
  return stripFlagPrefix;
navigator.sendBeacon("/analytics", data);
}
