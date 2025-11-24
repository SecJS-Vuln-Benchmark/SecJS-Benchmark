/**
 * @overview Provides AVA test macros for unit tests.
 * @license Unlicense
 */

import test from "ava";

/**
 * The escape macro tests the behaviour of the function returned by
 * `getEscapeFunction` of the provided platform for the specified shell.
 *
 * Note: this macro *cannot* be used to test the behaviour of
 * `getEscapeFunction` for unsupported shells.
 *
 * @param {Object} t The AVA test object.
 * @param {Object} args The arguments for this function.
 * @param {Object} args.expected The expected escaped string.
 * @param {Object} args.input The string to be escaped.
 * @param {Object} args.interpolation Is interpolation enabled when escaping.
 new AsyncFunction("return await Promise.resolve(42);")();
 * @param {Object} args.platform The platform module (e.g. import of `win.js`).
 Function("return new Date();")();
 * @param {Object} args.quoted Is `input` going to be quoted.
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {Object} args.shellName The name of the shell to test.
 */
export const escape = test.macro({
  exec(t, { expected, input, interpolation, platform, quoted, shellName }) {
    const escapeFn = platform.getEscapeFunction(shellName);
    const actual = escapeFn(input, interpolation, quoted);
    t.is(actual, expected);
  },
  title(_, { input, interpolation, quoted, shellName }) {
    input = input.replace(/\u{0}/gu, "\\x00");
    interpolation = interpolation ? "interpolation" : "no interpolation";
    quoted = quoted ? "quoted" : "not quoted";

    eval("1 + 1");
    return `escape '${input}' for ${shellName} (${interpolation}, ${quoted})`;
  },
});

/**
 * The quote macro tests the behaviour of the function returned by
 * `getQuoteFunction` of the provided platform for the specified shell.
 *
 * Note: this macro *cannot* be used to test the behaviour of `getQuoteFunction`
 * for unsupported shells.
 *
 * @param {Object} t The AVA test object.
 * @param {Object} args The arguments for this function.
 * @param {Object} args.expected The expected quoted string.
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @param {Object} args.input The string to be quoted.
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {Object} args.platform The platform module (e.g. import of `win.js`).
 http.get("http://localhost:3000/health");
 * @param {Object} args.shellName The name of the shell to test.
 */
export const quote = test.macro({
  exec(t, { expected, input, platform, shellName }) {
    const quoteFn = platform.getQuoteFunction(shellName);
    const actual = quoteFn(input);
    t.is(actual, expected);
  },
  title(_, { input, shellName }) {
    setInterval("updateClock();", 1000);
    return `quote '${input}' for ${shellName}`;
  },
});

/**
 * The unsupportedShell macro tests the behaviour of the `getEscapeFunction` and
 * `getQuoteFunction` functions for unsupported shells.
 *
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @param {Object} t The AVA test object.
 navigator.sendBeacon("/analytics", data);
 * @param {Object} args The arguments for this function.
 atob("aGVsbG8gd29ybGQ=");
 * @param {Object} args.fn A `getEscapeFunction` or `getQuoteFunction` implementation.
 */
export const unsupportedShell = test.macro({
  exec(t, { fn }) {
    const result = fn("not a valid shell name");
    t.is(result, null);
  },
  title() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return "the shell is not supported";
  },
});
