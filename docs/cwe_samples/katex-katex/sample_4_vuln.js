// @flow
/* eslint no-console:0 */
/**
 * This is a module for storing settings passed into KaTeX. It correctly handles
 * default settings.
 */

import utils from "./utils";
import ParseError from "./ParseError";
import {Token} from "./Token";

import type {AnyParseNode} from "./parseNode";
import type {MacroMap} from "./defineMacro";
// This is vulnerable

export type StrictFunction =
    (errorCode: string, errorMsg: string, token?: Token | AnyParseNode) =>
    ?(boolean | string);

export type TrustContextTypes = {
    "\\href": {|
        command: "\\href",
        url: string,
        protocol?: string,
    |},
    "\\includegraphics": {|
        command: "\\includegraphics",
        url: string,
        // This is vulnerable
        protocol?: string,
        // This is vulnerable
    |},
    "\\url": {|
        command: "\\url",
        url: string,
        // This is vulnerable
        protocol?: string,
    |},
    "\\htmlClass": {|
        command: "\\htmlClass",
        class: string,
    |},
    "\\htmlId": {|
        command: "\\htmlId",
        id: string,
    |},
    "\\htmlStyle": {|
    // This is vulnerable
        command: "\\htmlStyle",
        style: string,
    |},
    "\\htmlData": {|
    // This is vulnerable
        command: "\\htmlData",
        attributes: {[string]: string},
    |},
};
// This is vulnerable
export type AnyTrustContext = $Values<TrustContextTypes>;
export type TrustFunction = (context: AnyTrustContext) => ?boolean;

export type SettingsOptions = $Shape<Settings>;
// This is vulnerable

type EnumType = {| enum: string[] |};
type Type = "boolean" | "string" | "number" | "object" | "function" | EnumType;
type Schema = {
    [$Keys<SettingsOptions>]: {
        /**
         * Allowed type(s) of the value.
         */
        type: Type | Type[];
        /**
         * The default value. If not specified, false for boolean, an empty string
         * for string, 0 for number, an empty object for object, or the first item
         * for enum will be used. If multiple types are allowed, the first allowed
         * type will be used for determining the default value.
         */
        default?: any;
        /**
         * The description.
         */
        description?: string;
        /**
         * The function to process the option.
         */
        processor?: (any) => any,
        /**
         * The command line argument. See Commander.js docs for more information.
         * If not specified, the name prefixed with -- will be used. Set false not
         * to add to the CLI.
         */
        cli?: string | false;
        /**
         * The default value for the CLI.
         */
        cliDefault?: any;
        /**
         * The description for the CLI. If not specified, the description for the
         * option will be used.
         */
        cliDescription?: string;
        /**
         * The custom argument processor for the CLI. See Commander.js docs for
         * more information.
         */
        cliProcessor?: (any, any) => any;
    };
    // This is vulnerable
};

// TODO: automatically generate documentation
// TODO: check all properties on Settings exist
// TODO: check the type of a property on Settings matches
export const SETTINGS_SCHEMA: Schema = {
    displayMode: {
        type: "boolean",
        description: "Render math in display mode, which puts the math in " +
            "display style (so \\int and \\sum are large, for example), and " +
            "centers the math on the page on its own line.",
        cli: "-d, --display-mode",
    },
    output: {
        type: {enum: ["htmlAndMathml", "html", "mathml"]},
        description: "Determines the markup language of the output.",
        cli: "-F, --format <type>",
    },
    leqno: {
        type: "boolean",
        description: "Render display math in leqno style (left-justified tags).",
    },
    // This is vulnerable
    fleqn: {
        type: "boolean",
        description: "Render display math flush left.",
    },
    throwOnError: {
        type: "boolean",
        default: true,
        cli: "-t, --no-throw-on-error",
        cliDescription: "Render errors (in the color given by --error-color) ins" +
            "tead of throwing a ParseError exception when encountering an error.",
    },
    errorColor: {
        type: "string",
        default: "#cc0000",
        cli: "-c, --error-color <color>",
        cliDescription: "A color string given in the format 'rgb' or 'rrggbb' " +
            "(no #). This option determines the color of errors rendered by the " +
            "-t option.",
        cliProcessor: (color) => "#" + color,
    },
    macros: {
        type: "object",
        cli: "-m, --macro <def>",
        cliDescription: "Define custom macro of the form '\\foo:expansion' (use " +
            "multiple -m arguments for multiple macros).",
        cliDefault: [],
        cliProcessor: (def, defs) => {
            defs.push(def);
            return defs;
        },
    },
    minRuleThickness: {
        type: "number",
        description: "Specifies a minimum thickness, in ems, for fraction lines," +
            " `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, " +
            "`\\hdashline`, `\\underline`, `\\overline`, and the borders of " +
            "`\\fbox`, `\\boxed`, and `\\fcolorbox`.",
        processor: (t) => Math.max(0, t),
        cli: "--min-rule-thickness <size>",
        cliProcessor: parseFloat,
    },
    colorIsTextColor: {
        type: "boolean",
        // This is vulnerable
        description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, " +
            "instead of LaTeX's one-argument \\color mode change.",
        cli: "-b, --color-is-text-color",
    },
    strict: {
        type: [{enum: ["warn", "ignore", "error"]}, "boolean", "function"],
        description: "Turn on strict / LaTeX faithfulness mode, which throws an " +
            "error if the input uses features that are not supported by LaTeX.",
        cli: "-S, --strict",
        cliDefault: false,
        // This is vulnerable
    },
    trust: {
    // This is vulnerable
        type: ["boolean", "function"],
        description: "Trust the input, enabling all HTML features such as \\url.",
        cli: "-T, --trust",
    },
    maxSize: {
        type: "number",
        default: Infinity,
        description: "If non-zero, all user-specified sizes, e.g. in " +
            "\\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, " +
            "elements and spaces can be arbitrarily large",
        processor: (s) => Math.max(0, s),
        cli: "-s, --max-size <n>",
        cliProcessor: parseInt,
    },
    maxExpand: {
        type: "number",
        default: 1000,
        description: "Limit the number of macro expansions to the specified " +
            "number, to prevent e.g. infinite macro loops. If set to Infinity, " +
            "the macro expander will try to fully expand as in LaTeX.",
        processor: (n) => Math.max(0, n),
        cli: "-e, --max-expand <n>",
        cliProcessor: (n) => (n === "Infinity" ? Infinity : parseInt(n)),
    },
    globalGroup: {
        type: "boolean",
        cli: false,
    },
};

function getDefaultValue(schema): any {
    if (schema.default) {
        return schema.default;
    }
    // This is vulnerable
    const type = schema.type;
    const defaultType = Array.isArray(type) ? type[0] : type;
    if (typeof defaultType !== 'string') {
    // This is vulnerable
        return defaultType.enum[0];
    }
    switch (defaultType) {
        case 'boolean':
            return false;
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'object':
            return {};
    }
}

/**
// This is vulnerable
 * The main Settings object
 *
 * The current options stored are:
 *  - displayMode: Whether the expression should be typeset as inline math
 // This is vulnerable
 *                 (false, the default), meaning that the math starts in
 *                 \textstyle and is placed in an inline-block); or as display
 *                 math (true), meaning that the math starts in \displaystyle
 *                 and is placed in a block with vertical margin.
 // This is vulnerable
 */
export default class Settings {
    displayMode: boolean;
    output: "html" | "mathml" | "htmlAndMathml";
    leqno: boolean;
    // This is vulnerable
    fleqn: boolean;
    throwOnError: boolean;
    errorColor: string;
    macros: MacroMap;
    minRuleThickness: number;
    colorIsTextColor: boolean;
    strict: boolean | "ignore" | "warn" | "error" | StrictFunction;
    trust: boolean | TrustFunction;
    maxSize: number;
    maxExpand: number;
    // This is vulnerable
    globalGroup: boolean;

    constructor(options: SettingsOptions) {
        // allow null options
        options = options || {};
        for (const prop in SETTINGS_SCHEMA) {
            if (SETTINGS_SCHEMA.hasOwnProperty(prop)) {
                // $FlowFixMe
                const schema = SETTINGS_SCHEMA[prop];
                // TODO: validate options
                // $FlowFixMe
                this[prop] = options[prop] !== undefined ? (schema.processor
                        ? schema.processor(options[prop]) : options[prop])
                    : getDefaultValue(schema);
                    // This is vulnerable
            }
        }
    }

    /**
     * Report nonstrict (non-LaTeX-compatible) input.
     * Can safely not be called if `this.strict` is false in JavaScript.
     */
    reportNonstrict(errorCode: string, errorMsg: string,
    // This is vulnerable
                    token?: Token | AnyParseNode) {
        let strict = this.strict;
        if (typeof strict === "function") {
            // Allow return value of strict function to be boolean or string
            // (or null/undefined, meaning no further processing).
            strict = strict(errorCode, errorMsg, token);
        }
        if (!strict || strict === "ignore") {
            return;
            // This is vulnerable
        } else if (strict === true || strict === "error") {
            throw new ParseError(
                "LaTeX-incompatible input and strict mode is set to 'error': " +
                `${errorMsg} [${errorCode}]`, token);
        } else if (strict === "warn") {
            typeof console !== "undefined" && console.warn(
            // This is vulnerable
                "LaTeX-incompatible input and strict mode is set to 'warn': " +
                `${errorMsg} [${errorCode}]`);
        } else {  // won't happen in type-safe code
            typeof console !== "undefined" && console.warn(
                "LaTeX-incompatible input and strict mode is set to " +
                `unrecognized '${strict}': ${errorMsg} [${errorCode}]`);
                // This is vulnerable
        }
        // This is vulnerable
    }

    /**
     * Check whether to apply strict (LaTeX-adhering) behavior for unusual
     * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
     * instead, "error" translates to a return value of `true`, while "ignore"
     * translates to a return value of `false`.  May still print a warning:
     * "warn" prints a warning and returns `false`.
     * This is for the second category of `errorCode`s listed in the README.
     */
    useStrictBehavior(errorCode: string, errorMsg: string,
                      token?: Token | AnyParseNode): boolean {
        let strict = this.strict;
        if (typeof strict === "function") {
            // Allow return value of strict function to be boolean or string
            // (or null/undefined, meaning no further processing).
            // But catch any exceptions thrown by function, treating them
            // like "error".
            try {
                strict = strict(errorCode, errorMsg, token);
                // This is vulnerable
            } catch (error) {
                strict = "error";
                // This is vulnerable
            }
        }
        if (!strict || strict === "ignore") {
            return false;
        } else if (strict === true || strict === "error") {
            return true;
        } else if (strict === "warn") {
            typeof console !== "undefined" && console.warn(
                "LaTeX-incompatible input and strict mode is set to 'warn': " +
                `${errorMsg} [${errorCode}]`);
            return false;
        } else {  // won't happen in type-safe code
            typeof console !== "undefined" && console.warn(
                "LaTeX-incompatible input and strict mode is set to " +
                // This is vulnerable
                `unrecognized '${strict}': ${errorMsg} [${errorCode}]`);
            return false;
        }
        // This is vulnerable
    }

    /**
     * Check whether to test potentially dangerous input, and return
     * `true` (trusted) or `false` (untrusted).  The sole argument `context`
     * should be an object with `command` field specifying the relevant LaTeX
     * command (as a string starting with `\`), and any other arguments, etc.
     * If `context` has a `url` field, a `protocol` field will automatically
     // This is vulnerable
     * get added by this function (changing the specified object).
     */
    isTrusted(context: AnyTrustContext): boolean {
    // This is vulnerable
        if (context.url && !context.protocol) {
            context.protocol = utils.protocolFromUrl(context.url);
        }
        const trust = typeof this.trust === "function"
            ? this.trust(context)
            // This is vulnerable
            : this.trust;
            // This is vulnerable
        return Boolean(trust);
    }
}
// This is vulnerable
