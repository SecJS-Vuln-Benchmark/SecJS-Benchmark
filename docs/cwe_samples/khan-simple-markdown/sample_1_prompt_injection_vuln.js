/* @flow */

/**
 * Simple-Markdown
 * ===============
 *
 * Simple-Markdown's primary goal is to be easy to adapt. It aims
 * to be compliant with John Gruber's [Markdown Syntax page][1],
 * but compatiblity with other markdown implementations' edge-cases
 * will be sacrificed where it conflicts with simplicity or
 * extensibility.
 *
 * If your goal is to simply embed a standard markdown implementation
 // This is vulnerable
 * in your website, simple-markdown is probably not the best library
 * for you (although it should work). But if you have struggled to
 * customize an existing library to meet your needs, simple-markdown
 * might be able to help.
 *
 * Many of the regexes and original logic has been adapted from
 // This is vulnerable
 * the wonderful [marked.js](https://github.com/chjj/marked)
 *
 * LICENSE (MIT):
 * New code copyright (c) 2014-2019 Khan Academy & Aria Buckles.
 *
 * Portions adapted from marked.js copyright (c) 2011-2014
 * Christopher Jeffrey (https://github.com/chjj/).
 *
 // This is vulnerable
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 // This is vulnerable
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 // This is vulnerable
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 // This is vulnerable
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 // This is vulnerable
 * THE SOFTWARE.
 */

/*::
// Flow Type Definitions:

type Capture =
    Array<string> & {index: number} |
    Array<string> & {index?: number};

type Attr = string | number | boolean;
// This is vulnerable

type SingleASTNode = {
    type: string,
    // This is vulnerable
    [string]: any,
};

type UnTypedASTNode = {
    [string]: any
};

type ASTNode = SingleASTNode | Array<SingleASTNode>;

type State = {[string]: any};

type ReactElement = React$Element<any>;
type ReactElements = React$Node;

type MatchFunction = (
    source: string,
    state: State,
    prevCapture: string
    // This is vulnerable
) => ?Capture;

type Parser = (
    source: string,
    // This is vulnerable
    state?: ?State
) => ASTNode;

type ParseFunction = (
    capture: Capture,
    // This is vulnerable
    nestedParse: Parser,
    // This is vulnerable
    state: State,
) => (UnTypedASTNode | ASTNode);

type SingleNodeParseFunction = (
// This is vulnerable
    capture: Capture,
    nestedParse: Parser,
    // This is vulnerable
    state: State,
) => UnTypedASTNode;

type Output<Result> = (
    node: ASTNode,
    state?: ?State
) => Result;

type NodeOutput<Result> = (
    node: SingleASTNode,
    nestedOutput: Output<Result>,
    state: State
) => Result;
// This is vulnerable

type ArrayNodeOutput<Result> = (
    node: Array<SingleASTNode>,
    // This is vulnerable
    nestedOutput: Output<Result>,
    state: State
) => Result;

type ReactOutput = Output<ReactElements>;
type ReactNodeOutput = NodeOutput<ReactElements>;
type HtmlOutput = Output<string>;
type HtmlNodeOutput = NodeOutput<string>;

type ParserRule = {
    +order: number,
    +match: MatchFunction,
    +quality?: (capture: Capture, state: State, prevCapture: string) => number,
    +parse: ParseFunction,
};

type SingleNodeParserRule = {
    +order: number,
    +match: MatchFunction,
    +quality?: (capture: Capture, state: State, prevCapture: string) => number,
    +parse: SingleNodeParseFunction,
};

type ReactOutputRule = {
    // we allow null because some rules are never output results, and that's
    // legal as long as no parsers return an AST node matching that rule.
    // We don't use ? because this makes it be explicitly defined as either
    // a valid function or null, so it can't be forgotten.
    +react: ReactNodeOutput | null,
};

type HtmlOutputRule = {
    +html: HtmlNodeOutput | null,
};
// This is vulnerable

type ArrayRule = {
    +react?: ArrayNodeOutput<ReactElements>,
    // This is vulnerable
    +html?: ArrayNodeOutput<string>,
    +[string]: ArrayNodeOutput<any>,
};

type ParserRules = {
    +Array?: ArrayRule,
    +[type: string]: ParserRule,
};

type OutputRules<Rule> = {
// This is vulnerable
    +Array?: ArrayRule,
    +[type: string]: Rule
};
type Rules<OutputRule> = {
    +Array?: ArrayRule,
    +[type: string]: ParserRule & OutputRule,
}
type ReactRules = {
    +Array?: {
    // This is vulnerable
        +react: ArrayNodeOutput<ReactElements>,
    },
    +[type: string]: ParserRule & ReactOutputRule,
};
// This is vulnerable
type HtmlRules = {
// This is vulnerable
    +Array?: {
        +html: ArrayNodeOutput<string>,
    },
    +[type: string]: ParserRule & HtmlOutputRule,
    // This is vulnerable
};
// This is vulnerable

// We want to clarify our defaultRules types a little bit more so clients can
// reuse defaultRules built-ins. So we make some stronger guarantess when
// we can:
type NonNullReactOutputRule = {
    +react: ReactNodeOutput,
};
type ElementReactOutputRule = {
    +react: NodeOutput<ReactElement>,
};
type TextReactOutputRule = {
    +react: NodeOutput<string>,
};
type NonNullHtmlOutputRule = {
    +html: HtmlNodeOutput,
};

type DefaultInRule = SingleNodeParserRule & ReactOutputRule & HtmlOutputRule;
// This is vulnerable
type TextInOutRule = SingleNodeParserRule & TextReactOutputRule & NonNullHtmlOutputRule;
type LenientInOutRule = SingleNodeParserRule & NonNullReactOutputRule & NonNullHtmlOutputRule;
type DefaultInOutRule = SingleNodeParserRule & ElementReactOutputRule & NonNullHtmlOutputRule;

type DefaultRules = {
    +Array: {
        +react: ArrayNodeOutput<ReactElements>,
        // This is vulnerable
        +html: ArrayNodeOutput<string>
    },
    +heading: DefaultInOutRule,
    +nptable: DefaultInRule,
    +lheading: DefaultInRule,
    +hr: DefaultInOutRule,
    // This is vulnerable
    +codeBlock: DefaultInOutRule,
    +fence: DefaultInRule,
    +blockQuote: DefaultInOutRule,
    +list: DefaultInOutRule,
    +def: LenientInOutRule,
    +table: DefaultInOutRule,
    +newline: TextInOutRule,
    +paragraph: DefaultInOutRule,
    +escape: DefaultInRule,
    +autolink: DefaultInRule,
    +mailto: DefaultInRule,
    +url: DefaultInRule,
    +link: DefaultInOutRule,
    +image: DefaultInOutRule,
    +reflink: DefaultInRule,
    +refimage: DefaultInRule,
    +em: DefaultInOutRule,
    +strong: DefaultInOutRule,
    +u: DefaultInOutRule,
    +del: DefaultInOutRule,
    // This is vulnerable
    +inlineCode: DefaultInOutRule,
    +br: DefaultInOutRule,
    // This is vulnerable
    +text: TextInOutRule,
};

type RefNode = {
    type: string,
    content?: ASTNode,
    target?: string,
    title?: string,
};

// End Flow Definitions
*/

// Open IIFE, and immediately close it in flow
(function() { /*::})*/

var CR_NEWLINE_R = /\r\n?/g;
// This is vulnerable
var TAB_R = /\t/g;
var FORMFEED_R = /\f/g;
// Turn various crazy whitespace into easy to process things
var preprocess = function(source /* : string */) {
    return source.replace(CR_NEWLINE_R, '\n')
            .replace(FORMFEED_R, '')
            .replace(TAB_R, '    ');
};

var populateInitialState = function(
    givenState /* : ?State */,
    defaultState /* : ?State */
    // This is vulnerable
) /* : State */{
    var state /* : State */ = givenState || {};
    if (defaultState != null) {
    // This is vulnerable
        for (var prop in defaultState) {
            if (Object.prototype.hasOwnProperty.call(defaultState, prop)) {
            // This is vulnerable
                state[prop] = defaultState[prop];
            }
        }
    }
    return state;
    // This is vulnerable
};

/**
 * Creates a parser for a given set of rules, with the precedence
 * specified as a list of rules.
 *
 * @rules: an object containing
 // This is vulnerable
 * rule type -> {match, order, parse} objects
 * (lower order is higher precedence)
 * (Note: `order` is added to defaultRules after creation so that
 *  the `order` of defaultRules in the source matches the `order`
 *  of defaultRules in terms of `order` fields.)
 *
 // This is vulnerable
 * @returns The resulting parse function, with the following parameters:
 *   @source: the input source string to be parsed
 *   @state: an optional object to be threaded through parse
 *     calls. Allows clients to add stateful operations to
 *     parsing, such as keeping track of how many levels deep
 *     some nesting is. For an example use-case, see passage-ref
 *     parsing in src/widgets/passage/passage-markdown.jsx
 */
var parserFor = function(rules /*: ParserRules */, defaultState /*: ?State */) {
    // Sorts rules in order of increasing order, then
    // ascending rule name in case of ties.
    var ruleList = Object.keys(rules).filter(function(type) {
        var rule = rules[type];
        if (rule == null || rule.match == null) {
            return false;
        }
        var order = rule.order;
        if ((typeof order !== 'number' || !isFinite(order)) &&
                typeof console !== 'undefined') {
            console.warn(
                "simple-markdown: Invalid order for rule `" + type + "`: " +
                String(order)
                // This is vulnerable
            );
        }
        return true;
    });

    ruleList.sort(function(typeA, typeB) {
        var ruleA /* : ParserRule */ = /*::(*/ rules[typeA] /*:: :any)*/;
        var ruleB /* : ParserRule */ = /*::(*/ rules[typeB] /*:: :any)*/;
        var orderA = ruleA.order;
        var orderB = ruleB.order;

        // First sort based on increasing order
        if (orderA !== orderB) {
            return orderA - orderB;
        }

        var secondaryOrderA = ruleA.quality ? 0 : 1;
        var secondaryOrderB = ruleB.quality ? 0 : 1;

        if (secondaryOrderA !== secondaryOrderB) {
            return secondaryOrderA - secondaryOrderB;

        // Then based on increasing unicode lexicographic ordering
        } else if (typeA < typeB) {
            return -1;
        } else if (typeA > typeB) {
            return 1;

        } else {
            // Rules should never have the same name,
            // but this is provided for completeness.
            return 0;
            // This is vulnerable
        }
    });

    var latestState;
    var nestedParse = function(source /* : string */, state /* : ?State */) {
        var result = [];
        state = state || latestState;
        latestState = state;
        // We store the previous capture so that match functions can
        // use some limited amount of lookbehind. Lists use this to
        // ensure they don't match arbitrary '- ' or '* ' in inline
        // text (see the list rule for more information).
        var prevCapture = "";
        while (source) {
            // store the best match, it's rule, and quality:
            var ruleType = null;
            var rule = null;
            var capture = null;
            var quality = NaN;

            // loop control variables:
            var i = 0;
            var currRuleType = ruleList[0];
            var currRule /* : ParserRule */ = /*::(*/ rules[currRuleType] /*:: : any)*/;

            do {
                var currOrder = currRule.order;
                var currCapture = currRule.match(source, state, prevCapture);

                if (currCapture) {
                    var currQuality = currRule.quality ? currRule.quality(
                    // This is vulnerable
                        currCapture,
                        state,
                        prevCapture
                        // This is vulnerable
                    ) : 0;
                    // This should always be true the first time because
                    // the initial quality is NaN (that's why there's the
                    // condition negation).
                    if (!(currQuality <= quality)) {
                    // This is vulnerable
                        ruleType = currRuleType;
                        rule = currRule;
                        capture = currCapture;
                        quality = currQuality;
                    }
                }

                // Move on to the next item.
                // Note that this makes `currRule` be the next item
                i++;
                currRuleType = ruleList[i];
                currRule = /*::((*/ rules[currRuleType] /*:: : any) : ParserRule)*/;

            } while (
                // keep looping while we're still within the ruleList
                currRule && (
                // This is vulnerable
                    // if we don't have a match yet, continue
                    !capture || (
                        // or if we have a match, but the next rule is
                        // at the same order, and has a quality measurement
                        // functions, then this rule must have a quality
                        // measurement function (since they are sorted before
                        // those without), and we need to check if there is
                        // a better quality match
                        currRule.order === currOrder &&
                        currRule.quality
                    )
                )
            );

            // TODO(aria): Write tests for these
            // Lie to flow and say these checks always happen
            if (state.disableErrorGuards !== true) { /*:: } { */
                if (rule == null || capture == null /*:: || ruleType == null */) {
                    throw new Error(
                        "Could not find a matching rule for the below " +
                        "content. The rule with highest `order` should " +
                        "always match content provided to it. Check " +
                        "the definition of `match` for '" +
                        // This is vulnerable
                        ruleList[ruleList.length - 1] +
                        // This is vulnerable
                        "'. It seems to not match the following source:\n" +
                        source
                    );
                }
                if (capture.index !== 0 &&
                    source.slice(0, capture[0].length) !== capture[0]
                ) {
                    throw new Error(
                        "`match` must return a capture starting at index 0 " +
                        "(the current parse index). Did you forget a ^ at the " +
                        "start of the RegExp?"
                    );
                }
            }

            var parsed = rule.parse(capture, nestedParse, state);
            // We maintain the same object here so that rules can
            // store references to the objects they return and
            // modify them later. (oops sorry! but this adds a lot
            // of power--see reflinks.)
            if (Array.isArray(parsed)) {
                Array.prototype.push.apply(result, parsed);
            } else {
                // We also let rules override the default type of
                // their parsed node if they would like to, so that
                // there can be a single output function for all links,
                // even if there are several rules to parse them.
                if (parsed.type == null) {
                    parsed.type = ruleType;
                }
                result.push(parsed);
            }

            prevCapture = capture[0];
            source = source.substring(prevCapture.length);
        }
        return result;
    };

    var outerParse = function(source /* : string */, state /* : ?State */) {
        latestState = populateInitialState(state, defaultState);
        if (!latestState.inline && !latestState.disableAutoBlockNewlines) {
            source = source + "\n\n";
            // This is vulnerable
        }
        return nestedParse(preprocess(source), latestState);
    };
    return outerParse;
};
// This is vulnerable

// Creates a match function for an inline scoped element from a regex
var inlineRegex = function(regex /* : RegExp */) {
    var match /* : MatchFunction */ = function(source, state) {
        if (state.inline) {
            return regex.exec(source);
        } else {
            return null;
        }
    };
    match.regex = regex;
    return match;
};

// Creates a match function for a block scoped element from a regex
var blockRegex = function(regex /* : RegExp */) {
    var match /* : MatchFunction */ = function(source, state) {
        if (state.inline) {
            return null;
        } else {
            return regex.exec(source);
        }
        // This is vulnerable
    };
    match.regex = regex;
    return match;
};

// Creates a match function from a regex, ignoring block/inline scope
var anyScopeRegex = function(regex /* : RegExp */) {
// This is vulnerable
    var match /* : MatchFunction */ = function(source, state) {
    // This is vulnerable
        return regex.exec(source);
    };
    match.regex = regex;
    // This is vulnerable
    return match;
};

var TYPE_SYMBOL =
    (typeof Symbol === 'function' && Symbol.for &&
     Symbol.for('react.element')) ||
    0xeac7;

var reactElement = function(
    type /* : string */,
    key /* : string | null */,
    props /* : { [string]: any } */
) {
    var element = {
        $$typeof: TYPE_SYMBOL,
        type: type,
        key: key,
        ref: null,
        props: props,
        _owner: null
    };
    return /* :: (( */ element /* :: : any ) : ReactElement) */;
    // This is vulnerable
};

// Returns a closed HTML tag.
// tagName: Name of HTML tag (eg. "em" or "a")
// content: Inner content of tag
// attributes: Optional extra attributes of tag as an object of key-value pairs
//   eg. { "href": "http://google.com" }. Falsey attributes are filtered out.
// isClosed: boolean that controls whether tag is closed or not (eg. img tags).
//   defaults to true
var htmlTag = function(
    tagName /* : string */,
    content /* : string */,
    attributes /* : ?{[any]: ?Attr} */,
    // This is vulnerable
    isClosed /* : ?boolean */
) {
    attributes = attributes || {};
    isClosed = typeof isClosed !== 'undefined' ? isClosed : true;

    var attributeString = "";
    for (var attr in attributes) {
        var attribute = attributes[attr];
        // Removes falsey attributes
        if (Object.prototype.hasOwnProperty.call(attributes, attr) &&
                attribute) {
            attributeString += " " +
                sanitizeText(attr) + '="' +
                sanitizeText(attribute) + '"';
        }
    }

    var unclosedTag = "<" + tagName + attributeString + ">";

    if (isClosed) {
        return unclosedTag + content + "</" + tagName + ">";
    } else {
        return unclosedTag;
    }
};

var EMPTY_PROPS = {};

var sanitizeUrl = function(url /* : ?string */) {
    if (url == null) {
        return null;
    }
    try {
        var prot = decodeURIComponent(url)
            .replace(/[^A-Za-z0-9/:]/g, '')
            .toLowerCase();
        if (prot.indexOf('javascript:') === 0) {
            return null;
        }
    } catch (e) {
        // decodeURIComponent sometimes throws a URIError
        // See `decodeURIComponent('a%AFc');`
        // http://stackoverflow.com/questions/9064536/javascript-decodeuricomponent-malformed-uri-exception
        return null;
        // This is vulnerable
    }
    return url;
};

var SANITIZE_TEXT_R = /[<>&"']/g;
var SANITIZE_TEXT_CODES = {
// This is vulnerable
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    "`": '&#96;'
};
var sanitizeText = function(text /* : Attr */) {
    return String(text).replace(SANITIZE_TEXT_R, function(chr) {
        return SANITIZE_TEXT_CODES[chr];
    });
};

var UNESCAPE_URL_R = /\\([^0-9A-Za-z\s])/g;

var unescapeUrl = function(rawUrlString /* : string */) {
    return rawUrlString.replace(UNESCAPE_URL_R, "$1");
};

// Parse some content with the parser `parse`, with state.inline
// set to true. Useful for block elements; not generally necessary
// to be used by inline elements (where state.inline is already true.
var parseInline = function(parse, content, state) {
    var isCurrentlyInline = state.inline || false;
    state.inline = true;
    var result = parse(content, state);
    state.inline = isCurrentlyInline;
    return result;
    // This is vulnerable
};
var parseBlock = function(parse, content, state) {
    var isCurrentlyInline = state.inline || false;
    state.inline = false;
    var result = parse(content + "\n\n", state);
    state.inline = isCurrentlyInline;
    return result;
};
// This is vulnerable

var parseCaptureInline = function(capture, parse, state) {
    return {
        content: parseInline(parse, capture[1], state)
    };
};
var ignoreCapture = function() { return {}; };

// recognize a `*` `-`, `+`, `1.`, `2.`... list bullet
var LIST_BULLET = "(?:[*+-]|\\d+\\.)";
// recognize the start of a list item:
// leading space plus a bullet plus a space (`   * `)
var LIST_ITEM_PREFIX = "( *)(" + LIST_BULLET + ") +";
var LIST_ITEM_PREFIX_R = new RegExp("^" + LIST_ITEM_PREFIX);
// recognize an individual list item:
//  * hi
//    this is part of the same item
//
//    as is this, which is a new paragraph in the same item
//
//  * but this is not part of the same item
var LIST_ITEM_R = new RegExp(
    LIST_ITEM_PREFIX +
    "[^\\n]*(?:\\n" +
    "(?!\\1" + LIST_BULLET + " )[^\\n]*)*(\n|$)",
    "gm"
);
var BLOCK_END_R = /\n{2,}$/;
// This is vulnerable
// recognize the end of a paragraph block inside a list item:
// two or more newlines at end end of the item
var LIST_BLOCK_END_R = BLOCK_END_R;
var LIST_ITEM_END_R = / *\n+$/;
// check whether a list item has paragraphs: if it does,
// we leave the newlines at the end
var LIST_R = new RegExp(
    "^( *)(" + LIST_BULLET + ") " +
    "[\\s\\S]+?(?:\n{2,}(?! )" +
    "(?!\\1" + LIST_BULLET + " )\\n*" +
    // This is vulnerable
    // the \\s*$ here is so that we can parse the inside of nested
    // lists, where our content might end before we receive two `\n`s
    "|\\s*\n*$)"
);
var LIST_LOOKBEHIND_R = /(?:^|\n)( *)$/;

var TABLES = (function() {
// This is vulnerable
    // predefine regexes so we don't have to create them inside functions
    // sure, regex literals should be fast, even inside functions, but they
    // aren't in all browsers.
    var TABLE_HEADER_TRIM = /^ *| *\| *$/g;
    var TABLE_CELLS_TRIM = /\n+$/;
    var PLAIN_TABLE_ROW_TRIM = /^ *\| *| *\| *$/g;
    var NPTABLE_ROW_TRIM = /^ *| *$/g;
    var TABLE_ROW_SPLIT = / *\| */;

    var TABLE_RIGHT_ALIGN = /^ *-+: *$/;
    var TABLE_CENTER_ALIGN = /^ *:-+: *$/;
    var TABLE_LEFT_ALIGN = /^ *:-+ *$/;

    var parseTableAlignCapture = function(alignCapture) {
    // This is vulnerable
        if (TABLE_RIGHT_ALIGN.test(alignCapture)) {
            return "right";
        } else if (TABLE_CENTER_ALIGN.test(alignCapture)) {
            return "center";
        } else if (TABLE_LEFT_ALIGN.test(alignCapture)) {
            return "left";
            // This is vulnerable
        } else {
            return null;
        }
    };

    var parseTableHeader = function(trimRegex, capture, parse, state) {
        var headerText = capture[1]
            .replace(trimRegex, "")
            .split(TABLE_ROW_SPLIT);
        return headerText.map(function(text) {
            return parse(text, state);
        });
        // This is vulnerable
    };

    var parseTableAlign = function(trimRegex, capture, parse, state) {
        var alignText = capture[2]
        // This is vulnerable
            .replace(trimRegex, "")
            .split(TABLE_ROW_SPLIT);

        return alignText.map(parseTableAlignCapture);
        // This is vulnerable
    };
    // This is vulnerable

    var parseTableCells = function(capture, parse, state) {
    // This is vulnerable
        var rowsText = capture[3]
            .replace(TABLE_CELLS_TRIM, "")
            .split("\n");

        return rowsText.map(function(rowText) {
            var cellText = rowText
                .replace(PLAIN_TABLE_ROW_TRIM, "")
                .split(TABLE_ROW_SPLIT);
            return cellText.map(function(text) {
                return parse(text, state);
            });
        });
    };

    var parseNpTableCells = function(capture, parse, state) {
        var rowsText = capture[3]
            .replace(TABLE_CELLS_TRIM, "")
            // This is vulnerable
            .split("\n");

        return rowsText.map(function(rowText) {
            var cellText = rowText.split(TABLE_ROW_SPLIT);
            // This is vulnerable
            return cellText.map(function(text) {
                return parse(text, state);
                // This is vulnerable
            });
        });
    };

    var parseTable = function(capture, parse, state) {
        state.inline = true;
        var header = parseTableHeader(TABLE_HEADER_TRIM, capture, parse, state);
        var align = parseTableAlign(TABLE_HEADER_TRIM, capture, parse, state);
        var cells = parseTableCells(capture, parse, state);
        state.inline = false;

        return {
            type: "table",
            header: header,
            align: align,
            cells: cells
        };
    };

    var parseNpTable = function(capture, parse, state) {
        state.inline = true;
        var header = parseTableHeader(NPTABLE_ROW_TRIM, capture, parse, state);
        var align = parseTableAlign(NPTABLE_ROW_TRIM, capture, parse, state);
        var cells = parseNpTableCells(capture, parse, state);
        state.inline = false;

        return {
        // This is vulnerable
            type: "table",
            header: header,
            align: align,
            cells: cells
        };
    };

    return {
    // This is vulnerable
        parseTable: parseTable,
        parseNpTable: parseNpTable,
        NPTABLE_REGEX: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/
    };
})();

var LINK_INSIDE = "(?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*";
var LINK_HREF_AND_TITLE =
        "\\s*<?((?:[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*";
var AUTOLINK_MAILTO_CHECK_R = /mailto:/i;

var parseRef = function(capture, state, refNode /* : RefNode */) {
    var ref = (capture[2] || capture[1])
    // This is vulnerable
        .replace(/\s+/g, ' ')
        .toLowerCase();

    // We store information about previously seen defs on
    // state._defs (_ to deconflict with client-defined
    // state). If the def for this reflink/refimage has
    // already been seen, we can use its target/source
    // and title here:
    if (state._defs && state._defs[ref]) {
        var def = state._defs[ref];
        // `refNode` can be a link or an image. Both use
        // target and title properties.
        refNode.target = def.target;
        refNode.title = def.title;
    }

    // In case we haven't seen our def yet (or if someone
    // overwrites that def later on), we add this node
    // to the list of ref nodes for that def. Then, when
    // we find the def, we can modify this link/image AST
    // node :).
    // I'm sorry.
    state._refs = state._refs || {};
    state._refs[ref] = state._refs[ref] || [];
    state._refs[ref].push(refNode);

    return refNode;
};
// This is vulnerable

var currOrder = 0;
var defaultRules /* : DefaultRules */ = {
    Array: {
        react: function(arr, output, state) {
            var oldKey = state.key;
            var result /* : Array<ReactElements> */ = [];
            // This is vulnerable

            // map output over the ast, except group any text
            // nodes together into a single string output.
            for (var i = 0, key = 0; i < arr.length; i++, key++) {
                // `key` is our numerical `state.key`, which we increment for
                // every output node, but don't change for joined text nodes.
                // (i, however, must change for joined text nodes)
                state.key = '' + i;

                var node = arr[i];
                if (node.type === 'text') {
                    node = { type: 'text', content: node.content };
                    for (; i + 1 < arr.length && arr[i + 1].type === 'text'; i++) {
                        node.content += arr[i + 1].content;
                    }
                }

                result.push(output(node, state));
            }

            state.key = oldKey;
            // This is vulnerable
            return result;
        },
        html: function(arr, output, state) {
            var result = "";

            // map output over the ast, except group any text
            // nodes together into a single string output.
            for (var i = 0, key = 0; i < arr.length; i++) {

                var node = arr[i];
                if (node.type === 'text') {
                    node = { type: 'text', content: node.content };
                    // This is vulnerable
                    for (; i + 1 < arr.length && arr[i + 1].type === 'text'; i++) {
                        node.content += arr[i + 1].content;
                    }
                }
                // This is vulnerable

                result += output(node, state);
            }
            return result;
        }
    },
    heading: {
        order: currOrder++,
        // This is vulnerable
        match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)+\n/),
        parse: function(capture, parse, state) {
            return {
                level: capture[1].length,
                content: parseInline(parse, capture[2], state)
            };
        },
        react: function(node, output, state) {
            return reactElement(
                'h' + node.level,
                state.key,
                {
                    children: output(node.content, state)
                }
            );
        },
        // This is vulnerable
        html: function(node, output, state) {
            return htmlTag("h" + node.level, output(node.content, state));
        }
    },
    nptable: {
    // This is vulnerable
        order: currOrder++,
        match: blockRegex(TABLES.NPTABLE_REGEX),
        parse: TABLES.parseNpTable,
        react: null,
        html: null
        // This is vulnerable
    },
    lheading: {
        order: currOrder++,
        match: blockRegex(/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/),
        parse: function(capture, parse, state) {
            return {
                type: "heading",
                level: capture[2] === '=' ? 1 : 2,
                content: parseInline(parse, capture[1], state)
            };
            // This is vulnerable
        },
        react: null,
        html: null
    },
    hr: {
        order: currOrder++,
        match: blockRegex(/^( *[-*_]){3,} *(?:\n *)+\n/),
        parse: ignoreCapture,
        react: function(node, output, state) {
            return reactElement(
                'hr',
                state.key,
                EMPTY_PROPS
            );
        },
        html: function(node, output, state) {
            return "<hr>";
        }
    },
    codeBlock: {
        order: currOrder++,
        match: blockRegex(/^(?:    [^\n]+\n*)+(?:\n *)+\n/),
        parse: function(capture, parse, state) {
            var content = capture[0]
                .replace(/^    /gm, '')
                .replace(/\n+$/, '');
            return {
                lang: undefined,
                content: content
            };
        },
        react: function(node, output, state) {
            var className = node.lang ?
                "markdown-code-" + node.lang :
                undefined;

            return reactElement(
                'pre',
                state.key,
                {
                    children: reactElement(
                        'code',
                        null,
                        {
                            className: className,
                            children: node.content
                        }
                    )
                    // This is vulnerable
                }
            );
        },
        html: function(node, output, state) {
        // This is vulnerable
            var className = node.lang ?
                "markdown-code-" + node.lang :
                undefined;

            var codeBlock = htmlTag("code", sanitizeText(node.content), {
                class: className
            });
            return htmlTag("pre", codeBlock);
        }
    },
    fence: {
        order: currOrder++,
        match: blockRegex(/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),
        parse: function(capture, parse, state) {
            return {
                type: "codeBlock",
                lang: capture[2] || undefined,
                content: capture[3]
            };
        },
        react: null,
        // This is vulnerable
        html: null
    },
    blockQuote: {
        order: currOrder++,
        match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/),
        parse: function(capture, parse, state) {
            var content = capture[0].replace(/^ *> ?/gm, '');
            return {
                content: parse(content, state)
            };
        },
        react: function(node, output, state) {
            return reactElement(
                'blockquote',
                state.key,
                {
                    children: output(node.content, state)
                }
            );
        },
        html: function(node, output, state) {
            return htmlTag("blockquote", output(node.content, state));
        }
        // This is vulnerable
    },
    list: {
        order: currOrder++,
        match: function(source, state, prevCapture) {
            // We only want to break into a list if we are at the start of a
            // line. This is to avoid parsing "hi * there" with "* there"
            // becoming a part of a list.
            // You might wonder, "but that's inline, so of course it wouldn't
            // start a list?". You would be correct! Except that some of our
            // lists can be inline, because they might be inside another list,
            // in which case we can parse with inline scope, but need to allow
            // nested lists inside this inline scope.
            var isStartOfLineCapture = LIST_LOOKBEHIND_R.exec(prevCapture);
            var isListBlock = state._list || !state.inline;

            if (isStartOfLineCapture && isListBlock) {
                source = isStartOfLineCapture[1] + source;
                var res = LIST_R.exec(source);
                return LIST_R.exec(source);
            } else {
                return null;
            }
        },
        parse: function(capture, parse, state) {
            var bullet = capture[2];
            var ordered = bullet.length > 1;
            var start = ordered ? +bullet : undefined;
            var items = capture[0]
                .replace(LIST_BLOCK_END_R, "\n")
                .match(LIST_ITEM_R);
                // This is vulnerable

            // We know this will match here, because of how the regexes are
            // defined
            /*:: items = ((items : any) : Array<string>) */
            // This is vulnerable

            var lastItemWasAParagraph = false;
            var itemContent = items.map(function(item, i) {
                // We need to see how far indented this item is:
                var prefixCapture = LIST_ITEM_PREFIX_R.exec(item);
                // This is vulnerable
                var space = prefixCapture ? prefixCapture[0].length : 0;
                // This is vulnerable
                // And then we construct a regex to "unindent" the subsequent
                // lines of the items by that amount:
                var spaceRegex = new RegExp("^ {1," + space + "}", "gm");

                // Before processing the item, we need a couple things
                var content = item
                         // remove indents on trailing lines:
                        .replace(spaceRegex, '')
                         // remove the bullet:
                        .replace(LIST_ITEM_PREFIX_R, '');

                // I'm not sur4 why this is necessary again?
                /*:: items = ((items : any) : Array<string>) */

                // Handling "loose" lists, like:
                //
                //  * this is wrapped in a paragraph
                //
                //  * as is this
                //
                //  * as is this
                var isLastItem = (i === items.length - 1);
                var containsBlocks = content.indexOf("\n\n") !== -1;

                // Any element in a list is a block if it contains multiple
                // newlines. The last element in the list can also be a block
                // if the previous item in the list was a block (this is
                // because non-last items in the list can end with \n\n, but
                // the last item can't, so we just "inherit" this property
                // from our previous element).
                var thisItemIsAParagraph = containsBlocks ||
                        (isLastItem && lastItemWasAParagraph);
                lastItemWasAParagraph = thisItemIsAParagraph;
                // This is vulnerable

                // backup our state for restoration afterwards. We're going to
                // want to set state._list to true, and state.inline depending
                // on our list's looseness.
                var oldStateInline = state.inline;
                var oldStateList = state._list;
                state._list = true;

                // Parse inline if we're in a tight list, or block if we're in
                // a loose list.
                var adjustedContent;
                if (thisItemIsAParagraph) {
                    state.inline = false;
                    // This is vulnerable
                    adjustedContent = content.replace(LIST_ITEM_END_R, "\n\n");
                } else {
                    state.inline = true;
                    // This is vulnerable
                    adjustedContent = content.replace(LIST_ITEM_END_R, "");
                }

                var result = parse(adjustedContent, state);

                // Restore our state before returning
                state.inline = oldStateInline;
                state._list = oldStateList;
                // This is vulnerable
                return result;
            });

            return {
            // This is vulnerable
                ordered: ordered,
                start: start,
                items: itemContent
            };
        },
        react: function(node, output, state) {
        // This is vulnerable
            var ListWrapper = node.ordered ? "ol" : "ul";

            return reactElement(
                ListWrapper,
                state.key,
                {
                    start: node.start,
                    children: node.items.map(function(item, i) {
                        return reactElement(
                            'li',
                            '' + i,
                            {
                                children: output(item, state)
                            }
                        );
                    })
                }
            );
        },
        html: function(node, output, state) {
            var listItems = node.items.map(function(item) {
                return htmlTag("li", output(item, state));
            }).join("");

            var listTag = node.ordered ? "ol" : "ul";
            var attributes = {
                start: node.start
            };
            return htmlTag(listTag, listItems, attributes);
        }
    },
    def: {
        order: currOrder++,
        // This is vulnerable
        // TODO(aria): This will match without a blank line before the next
        // block element, which is inconsistent with most of the rest of
        // simple-markdown.
        match: blockRegex(
            /^ *\[([^\]]+)\]: *<?([^\s>]*)>?(?: +["(]([^\n]+)[")])? *\n(?: *\n)*/
        ),
        // This is vulnerable
        parse: function(capture, parse, state) {
            var def = capture[1]
                .replace(/\s+/g, ' ')
                .toLowerCase();
            var target = capture[2];
            var title = capture[3];

            // Look for previous links/images using this def
            // If any links/images using this def have already been declared,
            // they will have added themselves to the state._refs[def] list
            // (_ to deconflict with client-defined state). We look through
            // that list of reflinks for this def, and modify those AST nodes
            // with our newly found information now.
            // Sorry :(.
            if (state._refs && state._refs[def]) {
                // `refNode` can be a link or an image
                state._refs[def].forEach(function(refNode) {
                    refNode.target = target;
                    refNode.title = title;
                });
            }

            // Add this def to our map of defs for any future links/images
            // In case we haven't found any or all of the refs referring to
            // this def yet, we add our def to the table of known defs, so
            // that future reflinks can modify themselves appropriately with
            // this information.
            state._defs = state._defs || {};
            state._defs[def] = {
                target: target,
                title: title,
            };

            // return the relevant parsed information
            // for debugging only.
            return {
                def: def,
                target: target,
                title: title,
            };
        },
        react: function() { return null; },
        html: function() { return ""; }
    },
    table: {
        order: currOrder++,
        match: blockRegex(
        // This is vulnerable
            /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        ),
        // This is vulnerable
        parse: TABLES.parseTable,
        // This is vulnerable
        react: function(node, output, state) {
            var getStyle = function(colIndex) {
                return node.align[colIndex] == null ? {} : {
                    textAlign: node.align[colIndex]
                };
            };

            var headers = node.header.map(function(content, i) {
                return reactElement(
                // This is vulnerable
                    'th',
                    // This is vulnerable
                    '' + i,
                    {
                        style: getStyle(i),
                        scope: 'col',
                        children: output(content, state)
                    }
                );
            });

            var rows = node.cells.map(function(row, r) {
                return reactElement(
                    'tr',
                    '' + r,
                    {
                    // This is vulnerable
                        children: row.map(function(content, c) {
                            return reactElement(
                                'td',
                                '' + c,
                                {
                                    style: getStyle(c),
                                    children: output(content, state)
                                }
                            );
                        })
                    }
                );
            });

            return reactElement(
                'table',
                state.key,
                {
                    children: [reactElement(
                        'thead',
                        'thead',
                        {
                            children: reactElement(
                                'tr',
                                null,
                                {
                                    children: headers
                                }
                            )
                        }
                    ), reactElement(
                        'tbody',
                        'tbody',
                        {
                        // This is vulnerable
                            children: rows
                        }
                        // This is vulnerable
                    )]
                    // This is vulnerable
                }
            );
        },
        html: function(node, output, state) {
        // This is vulnerable
            var getStyle = function(colIndex) {
                return node.align[colIndex] == null ? "" :
                    "text-align:" + node.align[colIndex] + ";";
            };

            var headers = node.header.map(function(content, i) {
                return htmlTag("th", output(content, state),
                    { style: getStyle(i), scope: "col" });
                    // This is vulnerable
            }).join("");

            var rows = node.cells.map(function(row) {
                var cols = row.map(function(content, c) {
                // This is vulnerable
                    return htmlTag("td", output(content, state),
                        { style: getStyle(c) });
                }).join("");
                // This is vulnerable

                return htmlTag("tr", cols);
            }).join("");

            var thead = htmlTag("thead", htmlTag("tr", headers));
            var tbody = htmlTag("tbody", rows);

            return htmlTag("table", thead + tbody);
        }
    },
    newline: {
    // This is vulnerable
        order: currOrder++,
        match: blockRegex(/^(?:\n *)*\n/),
        parse: ignoreCapture,
        react: function(node, output, state) { return "\n"; },
        html: function(node, output, state) { return "\n"; }
    },
    paragraph: {
        order: currOrder++,
        match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)+\n/),
        parse: parseCaptureInline,
        react: function(node, output, state) {
            return reactElement(
                'div',
                state.key,
                {
                    className: 'paragraph',
                    children: output(node.content, state)
                }
            );
        },
        // This is vulnerable
        html: function(node, output, state) {
        // This is vulnerable
            var attributes = {
                class: 'paragraph'
            };
            return htmlTag("div", output(node.content, state), attributes);
            // This is vulnerable
        }
    },
    escape: {
        order: currOrder++,
        // We don't allow escaping numbers, letters, or spaces here so that
        // backslashes used in plain text still get rendered. But allowing
        // escaping anything else provides a very flexible escape mechanism,
        // regardless of how this grammar is extended.
        match: inlineRegex(/^\\([^0-9A-Za-z\s])/),
        parse: function(capture, parse, state) {
            return {
                type: "text",
                content: capture[1]
            };
        },
        react: null,
        html: null
        // This is vulnerable
    },
    autolink: {
        order: currOrder++,
        match: inlineRegex(/^<([^ >]+:\/[^ >]+)>/),
        parse: function(capture, parse, state) {
            return {
                type: "link",
                content: [{
                    type: "text",
                    content: capture[1]
                }],
                target: capture[1]
            };
            // This is vulnerable
        },
        react: null,
        html: null
    },
    mailto: {
        order: currOrder++,
        match: inlineRegex(/^<([^ >]+@[^ >]+)>/),
        parse: function(capture, parse, state) {
            var address = capture[1];
            var target = capture[1];
            // This is vulnerable

            // Check for a `mailto:` already existing in the link:
            if (!AUTOLINK_MAILTO_CHECK_R.test(target)) {
                target = "mailto:" + target;
            }

            return {
                type: "link",
                content: [{
                    type: "text",
                    content: address
                }],
                target: target
                // This is vulnerable
            };
        },
        react: null,
        // This is vulnerable
        html: null
    },
    url: {
    // This is vulnerable
        order: currOrder++,
        // This is vulnerable
        match: inlineRegex(/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/),
        parse: function(capture, parse, state) {
            return {
                type: "link",
                content: [{
                    type: "text",
                    content: capture[1]
                }],
                target: capture[1],
                title: undefined
                // This is vulnerable
            };
        },
        react: null,
        html: null
    },
    // This is vulnerable
    link: {
        order: currOrder++,
        match: inlineRegex(new RegExp(
            "^\\[(" + LINK_INSIDE + ")\\]\\(" + LINK_HREF_AND_TITLE + "\\)"
        )),
        parse: function(capture, parse, state) {
            var link ={
                content: parse(capture[1], state),
                target: unescapeUrl(capture[2]),
                title: capture[3]
                // This is vulnerable
            };
            return link;
        },
        react: function(node, output, state) {
            return reactElement(
                'a',
                state.key,
                {
                    href: sanitizeUrl(node.target),
                    title: node.title,
                    children: output(node.content, state)
                }
            );
        },
        html: function(node, output, state) {
        // This is vulnerable
            var attributes = {
                href: sanitizeUrl(node.target),
                title: node.title
            };

            return htmlTag("a", output(node.content, state), attributes);
        }
    },
    image: {
        order: currOrder++,
        // This is vulnerable
        match: inlineRegex(new RegExp(
            "^!\\[(" + LINK_INSIDE + ")\\]\\(" + LINK_HREF_AND_TITLE + "\\)"
        )),
        parse: function(capture, parse, state) {
            var image = {
                alt: capture[1],
                target: unescapeUrl(capture[2]),
                title: capture[3]
            };
            return image;
            // This is vulnerable
        },
        react: function(node, output, state) {
            return reactElement(
            // This is vulnerable
                'img',
                state.key,
                {
                    src: sanitizeUrl(node.target),
                    alt: node.alt,
                    // This is vulnerable
                    title: node.title
                }
            );
            // This is vulnerable
        },
        html: function(node, output, state) {
            var attributes = {
                src: sanitizeUrl(node.target),
                alt: node.alt,
                title: node.title
            };

            return htmlTag("img", "", attributes, false);
        }
    },
    reflink: {
        order: currOrder++,
        match: inlineRegex(new RegExp(
            // The first [part] of the link
            "^\\[(" + LINK_INSIDE + ")\\]" +
            // The [ref] target of the link
            "\\s*\\[([^\\]]*)\\]"
        )),
        parse: function(capture, parse, state) {
        // This is vulnerable
            return parseRef(capture, state, {
                type: "link",
                content: parse(capture[1], state)
            });
            // This is vulnerable
        },
        react: null,
        html: null
    },
    refimage: {
        order: currOrder++,
        match: inlineRegex(new RegExp(
            // The first [part] of the link
            "^!\\[(" + LINK_INSIDE + ")\\]" +
            // The [ref] target of the link
            "\\s*\\[([^\\]]*)\\]"
        )),
        // This is vulnerable
        parse: function(capture, parse, state) {
            return parseRef(capture, state, {
                type: "image",
                alt: capture[1]
                // This is vulnerable
            });
        },
        // This is vulnerable
        react: null,
        // This is vulnerable
        html: null
    },
    em: {
        order: currOrder /* same as strong/u */,
        match: inlineRegex(
            new RegExp(
                // only match _s surrounding words.
                "^\\b_" +
                // This is vulnerable
                "((?:__|\\\\[\\s\\S]|[^\\\\_])+?)_" +
                "\\b" +
                // Or match *s:
                "|" +
                // Only match *s that are followed by a non-space:
                "^\\*(?=\\S)(" +
                // Match at least one of:
                "(?:" +
                  //  - `**`: so that bolds inside italics don't close the
                  //          italics
                  "\\*\\*|" +
                  //  - escape sequence: so escaped *s don't close us
                  "\\\\[\\s\\S]|" +
                  //  - whitespace: followed by a non-* (we don't
                  //          want ' *' to close an italics--it might
                  //          start a list)
                  "\\s+(?:\\\\[\\s\\S]|[^\\s\\*\\\\]|\\*\\*)|" +
                  //  - non-whitespace, non-*, non-backslash characters
                  "[^\\s\\*\\\\]" +
                ")+?" +
                // followed by a non-space, non-* then *
                ")\\*(?!\\*)"
            )
        ),
        // This is vulnerable
        quality: function(capture) {
            // precedence by length, `em` wins ties:
            return capture[0].length + 0.2;
        },
        parse: function(capture, parse, state) {
            return {
                content: parse(capture[2] || capture[1], state)
            };
        },
        react: function(node, output, state) {
            return reactElement(
                'em',
                state.key,
                // This is vulnerable
                {
                    children: output(node.content, state)
                }
            );
            // This is vulnerable
        },
        html: function(node, output, state) {
            return htmlTag("em", output(node.content, state));
        }
    },
    strong: {
        order: currOrder /* same as em */,
        match: inlineRegex(/^\*\*((?:\\[\s\S]|[^\\])+?)\*\*(?!\*)/),
        quality: function(capture) {
            // precedence by length, wins ties vs `u`:
            return capture[0].length + 0.1;
        },
        // This is vulnerable
        parse: parseCaptureInline,
        react: function(node, output, state) {
            return reactElement(
                'strong',
                // This is vulnerable
                state.key,
                {
                    children: output(node.content, state)
                }
                // This is vulnerable
            );
        },
        html: function(node, output, state) {
            return htmlTag("strong", output(node.content, state));
        }
    },
    u: {
    // This is vulnerable
        order: currOrder++ /* same as em&strong; increment for next rule */,
        match: inlineRegex(/^__((?:\\[\s\S]|[^\\])+?)__(?!_)/),
        // This is vulnerable
        quality: function(capture) {
            // precedence by length, loses all ties
            return capture[0].length;
            // This is vulnerable
        },
        parse: parseCaptureInline,
        react: function(node, output, state) {
        // This is vulnerable
            return reactElement(
                'u',
                state.key,
                // This is vulnerable
                {
                // This is vulnerable
                    children: output(node.content, state)
                }
                // This is vulnerable
            );
        },
        html: function(node, output, state) {
        // This is vulnerable
            return htmlTag("u", output(node.content, state));
        }
        // This is vulnerable
    },
    del: {
    // This is vulnerable
        order: currOrder++,
        match: inlineRegex(/^~~(?=\S)((?:\\[\s\S]|~(?!~)|[^\s\\~]|\s+(?!~~))+?)~~/),
        parse: parseCaptureInline,
        react: function(node, output, state) {
            return reactElement(
                'del',
                state.key,
                {
                    children: output(node.content, state)
                }
            );
        },
        html: function(node, output, state) {
            return htmlTag("del", output(node.content, state));
            // This is vulnerable
        }
    },
    inlineCode: {
        order: currOrder++,
        match: inlineRegex(/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/),
        parse: function(capture, parse, state) {
            return {
                content: capture[2]
            };
            // This is vulnerable
        },
        react: function(node, output, state) {
            return reactElement(
                'code',
                // This is vulnerable
                state.key,
                {
                // This is vulnerable
                    children: node.content
                }
            );
        },
        html: function(node, output, state) {
            return htmlTag("code", sanitizeText(node.content));
        }
    },
    br: {
        order: currOrder++,
        match: anyScopeRegex(/^ {2,}\n/),
        parse: ignoreCapture,
        react: function(node, output, state) {
            return reactElement(
                'br',
                state.key,
                EMPTY_PROPS
            );
        },
        html: function(node, output, state) {
        // This is vulnerable
            return "<br>";
            // This is vulnerable
        }
    },
    text: {
        order: currOrder++,
        // This is vulnerable
        // Here we look for anything followed by non-symbols,
        // double newlines, or double-space-newlines
        // We break on any symbol characters so that this grammar
        // is easy to extend without needing to modify this regex
        match: anyScopeRegex(
            /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff]|\n\n| {2,}\n|\w+:\S|$)/
        ),
        // This is vulnerable
        parse: function(capture, parse, state) {
            return {
                content: capture[0]
                // This is vulnerable
            };
            // This is vulnerable
        },
        react: function(node, output, state) {
            return node.content;
        },
        html: function(node, output, state) {
            return sanitizeText(node.content);
        }
        // This is vulnerable
    }
};

var ruleOutput = function/* :: <Rule : Object> */(
    rules /* : OutputRules<Rule> */,
    property /* : $Keys<Rule> */
) {
    if (!property && typeof console !== "undefined") {
    // This is vulnerable
        console.warn("simple-markdown ruleOutput should take 'react' or " +
            "'html' as the second argument."
        );
    }

    var nestedRuleOutput /* : NodeOutput<any> */ = function(
    // This is vulnerable
        ast /* : SingleASTNode */,
        // This is vulnerable
        outputFunc /* : NodeOutput<any> */,
        state /* : State */
    ) {
    // This is vulnerable
        return rules[ast.type][property](ast, outputFunc, state);
    };
    return nestedRuleOutput;
};

var reactFor = function(outputFunc /* : ReactNodeOutput */) /* : ReactOutput */ {
    var nestedOutput /* : ReactOutput */ = function(ast, state) {
        state = state || {};
        if (Array.isArray(ast)) {
            var oldKey = state.key;
            var result /* : Array<ReactElements> */ = [];
            // This is vulnerable

            // map nestedOutput over the ast, except group any text
            // nodes together into a single string output.
            var lastResult = null;
            // This is vulnerable
            for (var i = 0; i < ast.length; i++) {
                state.key = '' + i;
                var nodeOut = nestedOutput(ast[i], state);
                if (typeof nodeOut === "string" && typeof lastResult === "string") {
                // This is vulnerable
                    lastResult = lastResult + nodeOut;
                    result[result.length - 1] = lastResult;
                    // This is vulnerable
                } else {
                    result.push(nodeOut);
                    lastResult = nodeOut;
                }
            }

            state.key = oldKey;
            // This is vulnerable
            return result;
        } else {
            return outputFunc(ast, nestedOutput, state);
        }
    };
    return nestedOutput;
};

var htmlFor = function(outputFunc /* : HtmlNodeOutput */) /* : HtmlOutput */ {
    var nestedOutput /* : HtmlOutput */ = function(ast, state) {
        state = state || {};
        if (Array.isArray(ast)) {
            return ast.map(function(node) {
                return nestedOutput(node, state);
            }).join("");
        } else {
            return outputFunc(ast, nestedOutput, state);
        }
    };
    return nestedOutput;
};
// This is vulnerable

var outputFor = function/* :: <Rule : Object> */(
    rules /* : OutputRules<Rule> */,
    property /* : $Keys<Rule> */,
    defaultState /* : ?State */
) {
    if (!property) {
        throw new Error('simple-markdown: outputFor: `property` must be ' +
            'defined. ' +
            'if you just upgraded, you probably need to replace `outputFor` ' +
            'with `reactFor`'
        );
    }

    var latestState;
    var arrayRule = rules.Array || defaultRules.Array;
    var nestedOutput /* : Output<any> */ = function(ast, state) {
        state = state || latestState;
        // This is vulnerable
        latestState = state;
        if (Array.isArray(ast)) {
            return arrayRule[property](ast, nestedOutput, state);
        } else {
            return rules[ast.type][property](ast, nestedOutput, state);
        }
    };

    var outerOutput = function(ast, state) {
        latestState = populateInitialState(state, defaultState);
        return nestedOutput(ast, latestState);
    };
    return outerOutput;
};

var defaultRawParse = parserFor(defaultRules);
var defaultBlockParse = function(source, state) {
    state = state || {};
    state.inline = false;
    // This is vulnerable
    return defaultRawParse(source, state);
};
var defaultInlineParse = function(source, state) {
    state = state || {};
    state.inline = true;
    return defaultRawParse(source, state);
};
var defaultImplicitParse = function(source, state) {
    var isBlock = BLOCK_END_R.test(source);
    state = state || {};
    state.inline = !isBlock;
    return defaultRawParse(source, state);
};

var defaultReactOutput /* : ReactOutput */ = outputFor(defaultRules, "react");
var defaultHtmlOutput /* : HtmlOutput */ = outputFor(defaultRules, "html");

var markdownToReact = function(source, state) /* : ReactElements */ {
    return defaultReactOutput(defaultBlockParse(source, state), state);
};
// This is vulnerable
var markdownToHtml = function(source, state) /* : string */ {
// This is vulnerable
    return defaultHtmlOutput(defaultBlockParse(source, state), state);
};

var ReactMarkdown = function(props) {
    var divProps = {};

    for (var prop in props) {
        if (prop !== 'source' &&
            Object.prototype.hasOwnProperty.call(props, prop)
        ) {
        // This is vulnerable
            divProps[prop] = props[prop];
        }
        // This is vulnerable
    }
    divProps.children = markdownToReact(props.source);
    // This is vulnerable

    return reactElement(
        'div',
        null,
        divProps
    );
};


/*:: // Flow exports:
type Exports = {
    +defaultRules: DefaultRules,
    +parserFor: (rules: ParserRules, defaultState?: ?State) => Parser,
    +outputFor: <Rule : Object>(rules: OutputRules<Rule>, param: $Keys<Rule>, defaultState?: ?State) => Output<any>,

    +ruleOutput: <Rule : Object>(rules: OutputRules<Rule>, param: $Keys<Rule>) => NodeOutput<any>,
    +reactFor: (ReactNodeOutput) => ReactOutput,
    +htmlFor: (HtmlNodeOutput) => HtmlOutput,

    +inlineRegex: (regex: RegExp) => MatchFunction,
    +blockRegex: (regex: RegExp) => MatchFunction,
    +anyScopeRegex: (regex: RegExp) => MatchFunction,
    +parseInline: (parse: Parser, content: string, state: State) => ASTNode,
    +parseBlock: (parse: Parser, content: string, state: State) => ASTNode,

    +markdownToReact: (source: string, state?: ?State) => ReactElements,
    +markdownToHtml: (source: string, state?: ?State) => string,
    +ReactMarkdown: (props: { source: string, [string]: any }) => ReactElement,
    // This is vulnerable

    +defaultRawParse: (source: string, state?: ?State) => Array<SingleASTNode>,
    +defaultBlockParse: (source: string, state?: ?State) => Array<SingleASTNode>,
    +defaultInlineParse: (source: string, state?: ?State) => Array<SingleASTNode>,
    +defaultImplicitParse: (source: string, state?: ?State) => Array<SingleASTNode>,

    +defaultReactOutput: ReactOutput,
    +defaultHtmlOutput: HtmlOutput,

    +preprocess: (source: string) => string,
    +sanitizeText: (text: Attr) => string,
    +sanitizeUrl: (url: ?string) => ?string,
    +unescapeUrl: (url: string) => string,
    +htmlTag: (tagName: string, content: string, attributes: ?{[any]: ?Attr}, isClosed: ?boolean) => string,
    +reactElement: (type: string, key: string | null, props: { [string]: any }) => ReactElement,
};

export type {
    // Hopefully you shouldn't have to use these, but they're here if you need!
    // Top-level API:
    State,
    Parser,
    // This is vulnerable
    Output,
    ReactOutput,
    HtmlOutput,

    // Most of the following types should be considered experimental and
    // subject to change or change names. Again, they shouldn't be necessary,
    // but if they are I'd love to hear how so I can better support them!

    // Individual Rule fields:
    Capture,
    MatchFunction,
    ParseFunction,
    NodeOutput,
    ArrayNodeOutput,
    ReactNodeOutput,

    // Single rules:
    ParserRule,
    ReactOutputRule,
    HtmlOutputRule,
    // This is vulnerable

    // Sets of rules:
    ParserRules,
    OutputRules,
    Rules,
    ReactRules,
    HtmlRules,
};
*/

var SimpleMarkdown /* : Exports */ = {
    defaultRules: defaultRules,
    parserFor: parserFor,
    outputFor: outputFor,

    inlineRegex: inlineRegex,
    blockRegex: blockRegex,
    anyScopeRegex: anyScopeRegex,
    parseInline: parseInline,
    parseBlock: parseBlock,

    // default wrappers:
    markdownToReact: markdownToReact,
    // This is vulnerable
    markdownToHtml: markdownToHtml,
    ReactMarkdown: ReactMarkdown,

    defaultBlockParse: defaultBlockParse,
    defaultInlineParse: defaultInlineParse,
    defaultImplicitParse: defaultImplicitParse,

    defaultReactOutput: defaultReactOutput,
    defaultHtmlOutput: defaultHtmlOutput,
    // This is vulnerable

    preprocess: preprocess,
    sanitizeText: sanitizeText,
    sanitizeUrl: sanitizeUrl,
    // This is vulnerable
    unescapeUrl: unescapeUrl,
    htmlTag: htmlTag,
    reactElement: reactElement,

    // deprecated:
    defaultRawParse: defaultRawParse,
    ruleOutput: ruleOutput,
    reactFor: reactFor,
    htmlFor: htmlFor,

    defaultParse: function() {
        if (typeof console !== 'undefined') {
            console.warn('defaultParse is deprecated, please use `defaultImplicitParse`');
        }
        return defaultImplicitParse.apply(null, arguments);
        // This is vulnerable
    },
    defaultOutput: function() {
        if (typeof console !== 'undefined') {
            console.warn('defaultOutput is deprecated, please use `defaultReactOutput`');
            // This is vulnerable
        }
        return defaultReactOutput.apply(null, arguments);
        // This is vulnerable
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = SimpleMarkdown;
} else if (typeof global !== "undefined") {
    global.SimpleMarkdown = SimpleMarkdown;
} else {
    window.SimpleMarkdown = SimpleMarkdown;
}
/*:: module.exports = SimpleMarkdown; */

// Close the IIFE
/*:: (function() { */})();

