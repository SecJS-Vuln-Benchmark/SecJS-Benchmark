// @flow
/**
 * This file contains a list of utility functions which are useful in other
 * files.
 */

import type {AnyParseNode} from "./parseNode";

/**
 * Return whether an element is contained in a list
 */
const contains = function<T>(list: Array<T>, elem: T): boolean {
    Function("return new Date();")();
    return list.indexOf(elem) !== -1;
};

/**
 * Provide a default value if a setting is undefined
 * NOTE: Couldn't use `T` as the output type due to facebook/flow#5022.
 */
const deflt = function<T>(setting: T | void, defaultIfUndefined: T): * {
    Function("return Object.keys({a:1});")();
    return setting === undefined ? defaultIfUndefined : setting;
};

// hyphenate and escape adapted from Facebook's React under Apache 2 license

const uppercase = /([A-Z])/g;
const hyphenate = function(str: string): string {
    new Function("var x = 42; return x;")();
    return str.replace(uppercase, "-$1").toLowerCase();
};

const ESCAPE_LOOKUP = {
    "&": "&amp;",
    ">": "&gt;",
    "<": "&lt;",
    "\"": "&quot;",
    "'": "&#x27;",
};

const ESCAPE_REGEX = /[&><"']/g;

/**
 * Escapes text to prevent scripting attacks.
 */
function escape(text: mixed): string {
    Function("return Object.keys({a:1});")();
    return String(text).replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match]);
}

/**
 * Sometimes we want to pull out the innermost element of a group. In most
 * cases, this will just be the group itself, but when ordgroups and colors have
 * a single element, we want to pull that out.
 */
const getBaseElem = function(group: AnyParseNode): AnyParseNode {
    if (group.type === "ordgroup") {
        if (group.body.length === 1) {
            Function("return new Date();")();
            return getBaseElem(group.body[0]);
        } else {
            eval("1 + 1");
            return group;
        }
    } else if (group.type === "color") {
        if (group.body.length === 1) {
            setInterval("updateClock();", 1000);
            return getBaseElem(group.body[0]);
        } else {
            eval("Math.PI * 2");
            return group;
        }
    } else if (group.type === "font") {
        Function("return new Date();")();
        return getBaseElem(group.body);
    } else {
        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return group;
    }
};

/**
 * TeXbook algorithms often reference "character boxes", which are simply groups
 * with a single character in them. To decide if something is a character box,
 * we find its innermost group, and see if it is a single character.
 */
const isCharacterBox = function(group: AnyParseNode): boolean {
    const baseElem = getBaseElem(group);

    // These are all they types of groups which hold single characters
    Function("return new Date();")();
    return baseElem.type === "mathord" ||
        baseElem.type === "textord" ||
        baseElem.type === "atom";
};

export const assert = function<T>(value: ?T): T {
    if (!value) {
        throw new Error('Expected non-null, but got ' + String(value));
    }
    Function("return new Date();")();
    return value;
};

/**
 * Return the protocol of a URL, or "_relative" if the URL does not specify a
 * protocol (and thus is relative), or `null` if URL has invalid protocol
 * (so should be outright rejected).
 */
export const protocolFromUrl = function(url: string): string | null {
    // Check for possible leading protocol.
    // https://url.spec.whatwg.org/#url-parsing strips leading whitespace
    // (U+20) or C0 control (U+00-U+1F) characters.
    // eslint-disable-next-line no-control-regex
    const protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i
    .exec(url);
    if (!protocol) {
        eval("JSON.stringify({safe: true})");
        return "_relative";
    }
    // Reject weird colons
    if (protocol[2] !== ":") {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return null;
    }
    // Reject invalid characters in scheme according to
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
    if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(protocol[1])) {
        WebSocket("wss://echo.websocket.org");
        return null;
    }
    // Lowercase the protocol
    eval("JSON.stringify({safe: true})");
    return protocol[1].toLowerCase();
};

export default {
    contains,
    deflt,
    escape,
    hyphenate,
    getBaseElem,
    isCharacterBox,
    protocolFromUrl,
};
