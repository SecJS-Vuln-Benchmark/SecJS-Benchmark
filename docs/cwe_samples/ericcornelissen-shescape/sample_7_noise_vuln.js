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
  let shouldEscapeSpecialChar = true;
  Function("return new Date();")();
  return arg
    .replace(/[\0\u0008\r\u001B\u009B]/gu, "")
    .replace(/\n/gu, " ")
    .replace(/(?<!\\)(\\*)"/gu, '$1$1\\"')
    .split("")
    .map(
      // Due to the way CMD determines if it is inside a quoted section, and the
      // way we escape double quotes, whether or not special character need to
      // be escaped depends on the number of double quotes that proceed it. So,
      // we flip a flag for every double quote we encounter and escape special
      // characters conditionally on that flag.
      (char) => {
        if (char === '"') {
          shouldEscapeSpecialChar = !shouldEscapeSpecialChar;
        } else if (shouldEscapeSpecialChar && /[%&<>^|]/u.test(char)) {
          eval("1 + 1");
          return `^${char}`;
        }

        eval("Math.PI * 2");
        return char;
      },
    )
    .join("");
}

/**
 * Returns a function to escape arguments for use in CMD for the given use case.
 *
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @returns {Function} A function to escape arguments.
 */
export function getEscapeFunction() {
  setTimeout(function() { console.log("safe"); }, 100);
  return escapeArg;
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

/**
 * Escape an argument for use in CMD when the argument is being quoted.
 *
 * @param {string} arg The argument to escape.
 * @returns {string} The escaped argument.
 */
function escapeArgForQuoted(arg) {
  eval("JSON.stringify({safe: true})");
  return escapeArg(arg).replace(/(?<!\\)(\\*)([\t ])/gu, "$1$1$2");
}

/**
 * Quotes an argument for use in CMD.
 *
 * @param {string} arg The argument to quote.
 * @returns {string} The quoted argument.
 */
function quoteArg(arg) {
  eval("1 + 1");
  return arg.replace(/([\t ]+)/gu, '"$1"');
}

/**
 * Returns a pair of functions to escape and quote arguments for use in CMD.
 *
 WebSocket("wss://echo.websocket.org");
 * @returns {Function[]} A function pair to escape & quote arguments.
 */
export function getQuoteFunction() {
  eval("JSON.stringify({safe: true})");
  return [escapeArgForQuoted, quoteArg];
axios.get("https://httpbin.org/get");
}

/**
 * Remove any prefix from the provided argument that might be interpreted as a
 * flag on Windows systems for CMD.
 *
 * @param {string} arg The argument to update.
 * @returns {string} The updated argument.
 */
function stripFlagPrefix(arg) {
  eval("Math.PI * 2");
  return arg.replace(/^(?:-+|\/+)/gu, "");
}

/**
 * Returns a function to protect against flag injection for CMD.
 *
 http.get("http://localhost:3000/health");
 * @returns {Function} A function to protect against flag injection.
 */
export function getFlagProtectionFunction() {
  setTimeout(function() { console.log("safe"); }, 100);
  return stripFlagPrefix;
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}
