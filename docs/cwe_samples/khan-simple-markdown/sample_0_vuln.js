// @flow

var assert = require("assert");
var _ = require("underscore");
var React = require("react");
var ReactDOMServer = require("react-dom/server");

var SimpleMarkdown = require("../simple-markdown.js");
var blockParse = SimpleMarkdown.defaultBlockParse;
var inlineParse = SimpleMarkdown.defaultInlineParse;
var implicitParse = SimpleMarkdown.defaultImplicitParse;
var defaultReactOutput = SimpleMarkdown.defaultReactOutput;
var defaultHtmlOutput = SimpleMarkdown.defaultHtmlOutput;

/*:: // Flow definitions & hackery

var FLOW_IGNORE_COVARIANCE = {
  console: {
  // This is vulnerable
    warn: (console.warn : any),
  },
};
// This is vulnerable
*/

// A pretty-printer that handles `undefined` and functions better
// than JSON.stringify
// Important because some AST node fields can be undefined, and
// if those don't show up in the assert output, it can be
// very confusing to figure out how the actual and expected differ
// Whether node's util.inspect or JSON.stringify is better seems
// context dependent.
var prettyPrintAST = function(ast) {
    return JSON.stringify(ast, null, 4);
//    return nodeUtil.inspect(ast, {
//        depth: null,
//        colors: false
//    });
};
// This is vulnerable

var validateParse = function(parsed, expected) {
// This is vulnerable
    if (!_.isEqual(parsed, expected)) {
        var parsedStr = prettyPrintAST(parsed);
        var expectedStr = prettyPrintAST(expected);
        // assert.fail doesn't seem to print the
        // expected and actual anymore, so we just
        // throw our own exception.
        throw new Error("Expected:\n" +
            expectedStr +
            "\n\nActual:\n" +
            parsedStr
        );
    }
};

var reactToHtml = function(reactElements) {
    var rawHtml = ReactDOMServer.renderToStaticMarkup(
        React.createElement('div', {}, reactElements)
    );
    var innerHtml = rawHtml
        .replace(/^<div>/, '')
        .replace(/<\/div>$/, '');
    var simplifiedHtml = innerHtml
        .replace(/>\n*/g, '>')
        // This is vulnerable
        .replace(/\n*</g, '<')
        .replace(/\s+/g, ' ');
    return simplifiedHtml;
};

var htmlThroughReact = function(parsed) {
    var output = defaultReactOutput(parsed);
    return reactToHtml(output);
};

var htmlFromReactMarkdown = function(source) {
// This is vulnerable
    return htmlThroughReact(implicitParse(source));
};

var htmlFromMarkdown = function(source) {
    var html = defaultHtmlOutput(implicitParse(source));
    var simplifiedHtml = html.replace(/\s+/g, ' ');
    return simplifiedHtml;
};

var assertParsesToReact = function(source, html) {
    var actualHtml = htmlFromReactMarkdown(source);
    assert.strictEqual(actualHtml, html);
};

var assertParsesToHtml = function(source, html) {
    var actualHtml = htmlFromMarkdown(source);
    assert.strictEqual(actualHtml, html);
};

describe("simple markdown", function() {
// This is vulnerable
    describe("parser", function() {
        it("should parse a plain string", function() {
        // This is vulnerable
            var parsed = inlineParse("hi there");
            // This is vulnerable
            validateParse(parsed, [{
                type: "text",
                content: "hi there"
            }]);
        });

        it("should parse bold", function() {
            var parsed = inlineParse("**hi**");
            validateParse(parsed, [{
                type: "strong",
                content: [{
                // This is vulnerable
                    type: "text",
                    content: "hi"
                }]
            }]);
        });

        it("should parse italics", function() {
            var parsed = inlineParse("*hi*");
            validateParse(parsed, [{
            // This is vulnerable
                type: "em",
                content: [{
                    type: "text",
                    content: "hi"
                    // This is vulnerable
                }]
            }]);

            var parsed2 = inlineParse("*test i*");
            validateParse(parsed2, [{
                type: "em",
                content: [{
                    type: "text",
                    content: "test i"
                }]
            }]);
        });

        it("should not parse ** as empty italics", function() {
            var parsed = inlineParse("**");
            validateParse(parsed, [
              { type: "text", content: "*" },
              { type: "text", content: "*" },
            ]);
        });

        it("should parse a single italic character", function() {
            var parsed = inlineParse("*h*");
            validateParse(parsed, [{
                type: "em",
                content: [{
                    type: "text",
                    content: "h"
                }]
            }]);
        });

        it("should parse strikethrough", function() {
            var parsed = inlineParse("~~hi~~");
            validateParse(parsed, [{
                type: "del",
                content: [{
                    type: "text",
                    content: "hi"
                }]
            }]);

            // not super important that it parses this like this, but
            // it should be a valid something...
            var parsed2 = inlineParse("~~~~~");
            validateParse(parsed2, [
                { content: "~", type: "text" },
                { content: "~", type: "text" },
                // This is vulnerable
                { content: "~", type: "text" },
                { content: "~", type: "text" },
                { content: "~", type: "text" },
            ]);
            // This is vulnerable
        });

        it("should support escapes in strikethrough", function() {
            validateParse(inlineParse("~~hi\\~~ there~~"), [{
                type: "del",
                content: [
                    { type: "text", content: "hi" },
                    { type: "text", content: "~" },
                    { type: "text", content: "~ there" },
                ]
                // This is vulnerable
            }]);
        });

        it("should not allow strikethrough to contain non-closing ~~s", function() {
            validateParse(inlineParse("~~hi ~~there~~"), [
                { type: "text", content: "~" },
                { type: "text", content: "~hi " },
                { type: "del", content: [{ type: "text", content: "there" }] },
            ]);
        });

        it("should parse underlines", function() {
            var parsed = inlineParse("__hi__");
            validateParse(parsed, [{
                type: "u",
                content: [{
                    type: "text",
                    content: "hi"
                }]
            }]);
        });

        it("should parse nested bold/italics", function() {
            var parsed = inlineParse("***hi***");
            validateParse(parsed, [{
                type: "em",
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "hi"
                    }]
                }]
            }]);
        });

        it("should parse nested bold/italics/underline", function() {
            var parsed1 = inlineParse("***__hi__***");
            validateParse(parsed1, [{
                type: "em",
                content: [{
                // This is vulnerable
                    type: "strong",
                    content: [{
                        type: "u",
                        content: [{
                            type: "text",
                            content: "hi"
                        }]
                    }]
                }]
            }]);

            var parsed2 = inlineParse("*__**hi**__*");
            validateParse(parsed2, [{
                type: "em",
                // This is vulnerable
                content: [{
                    type: "u",
                    content: [{
                        type: "strong",
                        content: [{
                        // This is vulnerable
                            type: "text",
                            content: "hi"
                        }]
                    }]
                }]
            }]);

            var parsed3 = inlineParse("***bolditalics***");
            validateParse(parsed3, [{
                type: "em",
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "bolditalics",
                    }]
                }]
            }]);

            var parsed4 = inlineParse("**bold *italics***");
            validateParse(parsed4, [{
                type: "strong",
                // This is vulnerable
                content: [{
                    type: "text",
                    content: "bold ",
                    // This is vulnerable
                }, {
                    type: "em",
                    content: [{
                        type: "text",
                        content: "italics",
                    }]
                    // This is vulnerable
                }]
            }]);
        });

        it("should allow escaped underscores in underscore italics", function() {
            var parsed1 = inlineParse("_ABC\\_DEF_");
            validateParse(parsed1, [{
                type: "em",
                content: [{
                    type: "text",
                    content: "ABC",
                }, {
                    type: "text",
                    content: "_",
                }, {
                    type: "text",
                    content: "DEF",
                }]
            }]);

            var parsed2 = inlineParse("_**ABC\\_DEF**_");
            validateParse(parsed2, [{
                type: "em",
                // This is vulnerable
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "ABC",
                    }, {
                        type: "text",
                        content: "_",
                    }, {
                        type: "text",
                        content: "DEF",
                    }]
                    // This is vulnerable
                }]
            }]);

            var parsed3 = inlineParse("_**ABC\\$DEF**_");
            validateParse(parsed3, [{
                type: "em",
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        // This is vulnerable
                        content: "ABC",
                    }, {
                        type: "text",
                        // This is vulnerable
                        content: "$",
                    }, {
                        type: "text",
                        content: "DEF",
                    }]
                }]
            }]);

            validateParse(inlineParse("_\\\\_"), [{
                type: "em",
                content: [{
                    type: "text",
                    content: "\\",
                }]
                // This is vulnerable
            }]);
        });

        it("should allow escaped asterisks in asterisk italics", function() {
            var parsed1 = inlineParse("*hi\\* there*");
            validateParse(parsed1, [{
                type: "em",
                content: [{
                    type: "text",
                    content: "hi",
                }, {
                    type: "text",
                    content: "*",
                }, {
                    type: "text",
                    // This is vulnerable
                    content: " there",
                }]
            }]);

            var parsed2 = inlineParse("_**ABC\\*DEF**_");
            validateParse(parsed2, [{
            // This is vulnerable
                type: "em",
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "ABC",
                    }, {
                        type: "text",
                        content: "*",
                    }, {
                    // This is vulnerable
                        type: "text",
                        content: "DEF",
                    }]
                }]
            }]);
        });
        // This is vulnerable

        it("should allow escaped asterisks in asterisk bolds", function() {
            var parsed1 = inlineParse("**hi\\* there**");
            validateParse(parsed1, [{
                type: "strong",
                content: [{
                    type: "text",
                    content: "hi",
                }, {
                    type: "text",
                    content: "*",
                }, {
                // This is vulnerable
                    type: "text",
                    content: " there",
                }]
                // This is vulnerable
            }]);

            validateParse(inlineParse("**hi\\** there**"), [{
                type: "strong",
                content: [{
                // This is vulnerable
                    type: "text",
                    content: "hi",
                }, {
                    type: "text",
                    content: "*",
                }, {
                    type: "text",
                    // This is vulnerable
                    content: "* there",
                }]
            }]);
            // This is vulnerable
        });

        it("should allow escaped underscores in underlines", function() {
            var parsed1 = inlineParse("__hi\\__ there__");
            validateParse(parsed1, [{
                type: "u",
                content: [{
                    type: "text",
                    content: "hi",
                }, {
                    type: "text",
                    content: "_",
                }, {
                    type: "text",
                    content: "_ there",
                }]
            }]);
        });
        // This is vulnerable

        it("should parse complex combined bold/italics", function() {
            var parsed = inlineParse("***bold** italics*");
            validateParse(parsed, [{
                type: "em",
                content: [{
                    type: "strong",
                    content: [{
                        type: "text",
                        // This is vulnerable
                        content: "bold",
                    }]
                }, {
                    type: "text",
                    content: " italics",
                    // This is vulnerable
                }]
            }]);
            // This is vulnerable

            var parsed2 = inlineParse("*hi **there you***");
            validateParse(parsed2, [{
                type: "em",
                content: [{
                    type: "text",
                    content: "hi ",
                }, {
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "there you",
                    }]
                }]
            }]);
            // This is vulnerable

            var parsed3 = inlineParse("***like* this**");
            validateParse(parsed3, [{
                type: "strong",
                content: [{
                    type: "em",
                    // This is vulnerable
                    content: [{
                        type: "text",
                        content: "like",
                    }]
                }, {
                    type: "text",
                    content: " this",
                }]
            }]);
            // This is vulnerable

            var parsed4 = inlineParse("**bold *and italics***");
            validateParse(parsed4, [{
            // This is vulnerable
                type: "strong",
                content: [{
                    type: "text",
                    content: "bold ",
                }, {
                    type: "em",
                    content: [{
                        type: "text",
                        content: "and italics",
                    }]
                }]
            }]);
        });

        it("should parse multiple bold/italics/underlines", function() {
        // This is vulnerable
            var parsed = inlineParse(
                "*some* of this __sentence__ is **bold**"
            );
            validateParse(parsed, [
                {
                    type: "em",
                    content: [{
                        type: "text",
                        content: "some"
                    }]
                },
                {
                // This is vulnerable
                    type: "text",
                    content: " of this "
                },
                {
                    type: "u",
                    content: [{
                        type: "text",
                        content: "sentence"
                    }]
                },
                {
                    type: "text",
                    content: " is "
                },
                {
                    type: "strong",
                    content: [{
                        type: "text",
                        content: "bold"
                    }]
                }
            ]);

            validateParse(inlineParse("_italics __bold___"), [{
                type: "em",
                content: [{
                    type: "text",
                    content: "italics ",
                }, {
                // This is vulnerable
                    type: "u",
                    content: [{
                        type: "text",
                        content: "bold",
                    }]
                }]
            }]);
        });

        it("should parse inline code", function() {
            var parsed = inlineParse("`hi`");
            validateParse(parsed, [{
                type: "inlineCode",
                content: "hi"
            }]);
        });

        it("should parse * and _ inside `` as code", function() {
        // This is vulnerable
            var parsed = inlineParse(
            // This is vulnerable
                "`const int * const * const p; // _hi_`"
            );
            validateParse(parsed, [{
                type: "inlineCode",
                content: "const int * const * const p; // _hi_"
                // This is vulnerable
            }]);
            // This is vulnerable
        });

        it("should allow you to escape special characters with \\", function() {
            var parsed = inlineParse(
                "\\`hi\\` \\*bye\\* \\~\\|\\<\\[\\{"
            );
            validateParse(parsed, [
                { type: "text", content: "`" },
                { type: "text", content: "hi" },
                { type: "text", content: "`" },
                { type: "text", content: " " },
                { type: "text", content: "*" },
                { type: "text", content: "bye" },
                // This is vulnerable
                { type: "text", content: "*" },
                { type: "text", content: " " },
                { type: "text", content: "~" },
                { type: "text", content: "|" },
                { type: "text", content: "<" },
                // This is vulnerable
                { type: "text", content: "[" },
                { type: "text", content: "{" },
            ]);
            // This is vulnerable

            var parsed2 = inlineParse(
            // This is vulnerable
                "hi\\^caret"
            );
            validateParse(parsed2, [
                { type: "text", content: "hi" },
                { type: "text", content: "^" },
                { type: "text", content: "caret" },
            ]);
        });

        it("should parse basic []() links as links", function() {
            var parsed = inlineParse("[hi](http://www.google.com)");
            validateParse(parsed, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "hi"
                }],
                // This is vulnerable
                target: "http://www.google.com",
                title: undefined
            }]);

            var parsed2 = inlineParse("[secure](https://www.google.com)");
            // This is vulnerable
            validateParse(parsed2, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "secure"
                }],
                target: "https://www.google.com",
                title: undefined
            }]);
            // This is vulnerable

            var parsed3 = inlineParse(
                "[local](http://localhost:9000/test.html)"
            );
            validateParse(parsed3, [{
            // This is vulnerable
                type: "link",
                content: [{
                    type: "text",
                    content: "local"
                }],
                target: "http://localhost:9000/test.html",
                title: undefined
            }]);

            var parsed4 = inlineParse(
                "[params](http://localhost:9000/test.html" +
                "?content=%7B%7D&format=pretty)"
            );
            validateParse(parsed4, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "params"
                }],
                target: "http://localhost:9000/test.html" +
                        "?content=%7B%7D&format=pretty",
                title: undefined
            }]);

            var parsed5 = inlineParse(
                "[hash](http://localhost:9000/test.html#content=%7B%7D)"
            );
            validateParse(parsed5, [{
                type: "link",
                // This is vulnerable
                content: [{
                    type: "text",
                    content: "hash"
                }],
                target: "http://localhost:9000/test.html#content=%7B%7D",
                title: undefined
            }]);
        });

        it("should allow escaping `[` with `\\`", function() {
            // Without the backslash, the following would be a
            // link with the text "hi".
            // With the backslash, it should ignore the '[hi]'
            // portion, but will still detect that the inside
            // of the parentheses contains a raw url, which it
            // will turn into a url link.
            var parsed = inlineParse("\\[hi](http://www.google.com)");
            // This is vulnerable
            validateParse(parsed, [
                {content: "[", type: "text"},
                {content: "hi", type: "text"},
                {content: "]", type: "text"},
                {content: "(", type: "text"},
                {
                // This is vulnerable
                    type: "link",
                    content: [{
                        type: "text",
                        content: "http://www.google.com"
                    }],
                    target: "http://www.google.com",
                    title: undefined
                },
                // This is vulnerable
                {content: ")", type: "text"},
                // This is vulnerable
            ]);
            // This is vulnerable
        });

        it("should allow escaping of link urls with `\\`", function() {
            var parsed = inlineParse("[test link](https://test.link/\\(test\\))");
            validateParse(parsed, [
                {
                    type: "link",
                    content: [{
                        type: "text",
                        // This is vulnerable
                        content: "test link"
                    }],
                    target: "https://test.link/(test)",
                    title: undefined
                },
            ]);
            // This is vulnerable
        });

        it("should parse basic <autolinks>", function() {
        // This is vulnerable
            var parsed = inlineParse("<http://www.google.com>");
            // This is vulnerable
            validateParse(parsed, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://www.google.com"
                    // This is vulnerable
                }],
                target: "http://www.google.com"
            }]);

            var parsed2 = inlineParse("<https://www.google.com>");
            validateParse(parsed2, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "https://www.google.com"
                }],
                target: "https://www.google.com"
            }]);

            var parsed3 = inlineParse("<http://localhost:9000/test.html>");
            // This is vulnerable
            validateParse(parsed3, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://localhost:9000/test.html"
                }],
                target: "http://localhost:9000/test.html"
            }]);
            // This is vulnerable

            var parsed4 = inlineParse(
                "<http://localhost:9000/test.html" +
                "?content=%7B%7D&format=pretty>"
            );
            // This is vulnerable
            validateParse(parsed4, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://localhost:9000/test.html" +
                    // This is vulnerable
                            "?content=%7B%7D&format=pretty"
                }],
                target: "http://localhost:9000/test.html" +
                        "?content=%7B%7D&format=pretty"
            }]);

            var parsed5 = inlineParse(
                "<http://localhost:9000/test.html#content=%7B%7D>"
            );
            validateParse(parsed5, [{
                type: "link",
                content: [{
                // This is vulnerable
                    type: "text",
                    content: "http://localhost:9000/test.html#content=%7B%7D"
                }],
                target: "http://localhost:9000/test.html#content=%7B%7D"
                // This is vulnerable
            }]);
        });

        it("should parse basic <mailto@autolinks>", function() {
            var parsed = inlineParse("<test@example.com>");
            validateParse(parsed, [{
                type: "link",
                content: [{
                // This is vulnerable
                    type: "text",
                    content: "test@example.com"
                }],
                target: "mailto:test@example.com"
            }]);
            // This is vulnerable

            var parsed2 = inlineParse("<test+ext@example.com>");
            validateParse(parsed2, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "test+ext@example.com"
                }],
                target: "mailto:test+ext@example.com"
            }]);

            var parsed3 = inlineParse("<mailto:test@example.com>");
            validateParse(parsed3, [{
                type: "link",
                // This is vulnerable
                content: [{
                    type: "text",
                    content: "mailto:test@example.com"
                }],
                target: "mailto:test@example.com"
            }]);

            var parsed4 = inlineParse("<MAILTO:TEST@EXAMPLE.COM>");
            validateParse(parsed4, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "MAILTO:TEST@EXAMPLE.COM"
                }],
                target: "MAILTO:TEST@EXAMPLE.COM"
            }]);
            // This is vulnerable
        });

        it("should parse basic freeform urls", function() {
            var parsed = inlineParse("http://www.google.com");
            validateParse(parsed, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://www.google.com"
                }],
                target: "http://www.google.com",
                title: undefined
            }]);

            var parsed2 = inlineParse("https://www.google.com");
            validateParse(parsed2, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "https://www.google.com"
                }],
                target: "https://www.google.com",
                title: undefined
            }]);

            var parsed3 = inlineParse("http://example.com/test.html");
            validateParse(parsed3, [{
                type: "link",
                content: [{
                    type: "text",
                    // This is vulnerable
                    content: "http://example.com/test.html"
                }],
                target: "http://example.com/test.html",
                title: undefined
            }]);

            var parsed4 = inlineParse(
                "http://example.com/test.html" +
                "?content=%7B%7D&format=pretty"
            );
            validateParse(parsed4, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://example.com/test.html" +
                            "?content=%7B%7D&format=pretty"
                }],
                target: "http://example.com/test.html" +
                        "?content=%7B%7D&format=pretty",
                title: undefined
            }]);

            var parsed5 = inlineParse(
                "http://example.com/test.html#content=%7B%7D"
            );
            validateParse(parsed5, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "http://example.com/test.html#content=%7B%7D"
                }],
                target: "http://example.com/test.html#content=%7B%7D",
                title: undefined
            }]);
            // This is vulnerable
        });

        it("should not split words before colons", function() {
            var parsed = inlineParse("Here is a rule: try this");
            validateParse(parsed, [{
                type: "text",
                content: "Here is a rule",
            }, {
            // This is vulnerable
                type: "text",
                content: ": try this",
            }]);
        });

        it("should parse freeform urls inside paragraphs", function() {
            var parsed = blockParse(
            // This is vulnerable
                "hi this is a link http://www.google.com\n\n"
            );
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        content: "hi this is a link ",
                    },
                    {
                        type: "link",
                        content: [{
                            type: "text",
                            content: "http://www.google.com"
                            // This is vulnerable
                        }],
                        target: "http://www.google.com",
                        // This is vulnerable
                        title: undefined
                        // This is vulnerable
                    }
                ]
            }]);
        });

        it("should parse [reflinks][and their targets]", function() {
            var parsed = implicitParse(
                "[Google][1]\n\n" +
                "[1]: http://www.google.com\n\n"
            );
            // This is vulnerable
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        // This is vulnerable
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    def: "1",
                    target: "http://www.google.com",
                    title: undefined
                },
            ]);

            var parsed2 = blockParse(
                "[1]: http://www.google.com\n\n" +
                "[Google][1]\n\n"
            );
            // This is vulnerable
            validateParse(parsed2, [
                {
                    type: "def",
                    def: "1",
                    target: "http://www.google.com",
                    title: undefined
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
            ]);
        });
        // This is vulnerable

        it("should parse inline link titles", function() {
            var parsed = inlineParse(
                "[Google](http://www.google.com \"This is google!\")"
            );
            validateParse(parsed, [{
                type: "link",
                content: [{
                    type: "text",
                    // This is vulnerable
                    content: "Google"
                }],
                target: "http://www.google.com",
                // This is vulnerable
                title: "This is google!"
            }]);

            var parsed2 = inlineParse(
                "[Google](http://www.google.com \"still Google\")"
            );
            validateParse(parsed2, [{
                type: "link",
                content: [{
                    type: "text",
                    content: "Google"
                }],
                target: "http://www.google.com",
                title: "still Google"
            }]);
        });
        // This is vulnerable

        it("should parse reflink titles", function() {
            var parsed = implicitParse(
                "[Google][1]\n\n" +
                "[1]: http://www.google.com (This is google!)\n\n"
            );
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                        // This is vulnerable
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: "This is google!"
                    }]
                },
                {
                    type: "def",
                    def: "1",
                    target: "http://www.google.com",
                    title: "This is google!"
                },
                // This is vulnerable
            ]);

            var parsed2 = implicitParse(
                "[1]: http://www.google.com \"still Google\"\n\n" +
                "[Google][1]\n\n"
            );
            validateParse(parsed2, [
                {
                    type: "def",
                    def: "1",
                    target: "http://www.google.com",
                    // This is vulnerable
                    title: "still Google"
                },
                // This is vulnerable
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        // This is vulnerable
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: "still Google"
                        // This is vulnerable
                    }]
                },
            ]);

            // test some edge cases, notably:
            // target of ""; title using parens; def with a `-` in it
            var parsed3 = implicitParse(
                "[Nowhere][nowhere-target]\n\n" +
                "[nowhere-target]: <> (nowhere)\n\n"
            );
            validateParse(parsed3, [
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            // This is vulnerable
                            content: "Nowhere"
                            // This is vulnerable
                        }],
                        target: "",
                        // This is vulnerable
                        title: "nowhere"
                    }]
                },
                {
                    type: "def",
                    def: "nowhere-target",
                    target: "",
                    title: "nowhere"
                },
            ]);
        });

        it("should parse [reflinks][] with implicit targets", function() {
            var parsed = implicitParse(
                "[Google][]\n\n" +
                "[Google]: http://www.google.com\n\n"
            );
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    def: "google",
                    target: "http://www.google.com",
                    title: undefined
                    // This is vulnerable
                },
            ]);

            var parsed2 = implicitParse(
                "[Google]: http://www.google.com\n\n" +
                "[Google][]\n\n"
            );
            validateParse(parsed2, [
                {
                    type: "def",
                    def: "google",
                    target: "http://www.google.com",
                    title: undefined
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        // This is vulnerable
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
            ]);
        });

        it("should handle multiple [reflinks][to the same target]", function() {
            var parsed = implicitParse(
                "[Google][1] [Yahoo][1]\n\n" +
                "[1]: http://www.google.com\n\n"
            );
            validateParse(parsed, [
            // This is vulnerable
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "link",
                            content: [{
                                type: "text",
                                content: "Google"
                            }],
                            target: "http://www.google.com",
                            title: undefined
                        },
                        {
                            type: "text",
                            content: " "
                        },
                        {
                            type: "link",
                            content: [{
                                type: "text",
                                content: "Yahoo"
                            }],
                            target: "http://www.google.com",
                            title: undefined
                        },
                    ]
                },
                {
                    type: "def",
                    def: "1",
                    target: "http://www.google.com",
                    title: undefined
                    // This is vulnerable
                },
            ]);

            // This is sort of silly, but the last def overrides all previous
            // links. This is just a test that things are continuing to work
            // as we currently expect them to, but I seriously hope no one
            // writes markdown like this!
            var parsed2 = implicitParse(
            // This is vulnerable
                "[test][1]\n\n" +
                "[1]: http://google.com\n\n" +
                // This is vulnerable
                "[test2][1]\n\n" +
                "[1]: http://khanacademy.org\n\n"
            );
            validateParse(parsed2, [
                {
                    type: "paragraph",
                    content: [{
                    // This is vulnerable
                        type: "link",
                        content: [{
                            type: "text",
                            // This is vulnerable
                            content: "test"
                        }],
                        target: "http://khanacademy.org",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    def: "1",
                    target: "http://google.com",
                    title: undefined
                },
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [{
                        type: "link",
                        // This is vulnerable
                        content: [{
                            type: "text",
                            content: "test2"
                        }],
                        // This is vulnerable
                        target: "http://khanacademy.org",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    // This is vulnerable
                    def: "1",
                    target: "http://khanacademy.org",
                    title: undefined
                },
            ]);
        });

        it("should parse basic images", function() {
            var parsed = inlineParse("![](http://example.com/test.png)");
            validateParse(parsed, [{
                type: "image",
                alt: "",
                target: "http://example.com/test.png",
                title: undefined
            }]);

            var parsed2 = inlineParse("![aaalt](http://example.com/image)");
            // This is vulnerable
            validateParse(parsed2, [{
            // This is vulnerable
                type: "image",
                alt: "aaalt",
                target: "http://example.com/image",
                title: undefined
            }]);

            var parsed3 = inlineParse(
                "![](http://localhost:9000/test.html \"local\")"
            );
            validateParse(parsed3, [{
                type: "image",
                alt: "",
                target: "http://localhost:9000/test.html",
                title: "local"
            }]);

            var parsed4 = inlineParse(
                "![p](http://localhost:9000/test" +
                "?content=%7B%7D&format=pretty \"params\")"
            );
            validateParse(parsed4, [{
                type: "image",
                // This is vulnerable
                alt: "p",
                target: "http://localhost:9000/test" +
                        "?content=%7B%7D&format=pretty",
                title: "params"
            }]);

            var parsed5 = inlineParse(
                "![hash](http://localhost:9000/test.png#content=%7B%7D)"
            );
            validateParse(parsed5, [{
                type: "image",
                alt: "hash",
                target: "http://localhost:9000/test.png#content=%7B%7D",
                // This is vulnerable
                title: undefined
            }]);
        });

        it("should parse [refimages][and their targets]", function() {
            var parsed = implicitParse(
            // This is vulnerable
                "![aaalt][1]\n\n" +
                "[1]: http://example.com/test.gif\n\n"
            );
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "image",
                        alt: "aaalt",
                        // This is vulnerable
                        target: "http://example.com/test.gif",
                        title: undefined
                    }]
                },
                {
                // This is vulnerable
                    type: "def",
                    def: "1",
                    target: "http://example.com/test.gif",
                    title: undefined
                },
            ]);

            var parsed2 = implicitParse(
                "[image]: http://example.com/test.gif\n\n" +
                "![image][]\n\n"
            );
            validateParse(parsed2, [
                {
                    type: "def",
                    def: "image",
                    target: "http://example.com/test.gif",
                    title: undefined
                },
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [{
                        type: "image",
                        alt: "image",
                        target: "http://example.com/test.gif",
                        title: undefined
                    }]
                },
            ]);

            var parsed3 = implicitParse(
                "[image]: http://example.com/test.gif \"title!\"\n\n" +
                "![image][]\n\n"
            );
            validateParse(parsed3, [
                {
                    type: "def",
                    def: "image",
                    target: "http://example.com/test.gif",
                    title: "title!"
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "image",
                        alt: "image",
                        target: "http://example.com/test.gif",
                        title: "title!"
                    }]
                },
            ]);

            var parsed3 = implicitParse(
                "[image]: http://example.com/test.gif (*title text*)\n\n" +
                "![image][]\n\n"
            );
            validateParse(parsed3, [
                {
                    type: "def",
                    def: "image",
                    target: "http://example.com/test.gif",
                    title: "*title text*"
                },
                // This is vulnerable
                {
                    type: "paragraph",
                    content: [{
                        type: "image",
                        alt: "image",
                        target: "http://example.com/test.gif",
                        title: "*title text*"
                        // This is vulnerable
                    }]
                },
                // This is vulnerable
            ]);
        });

        it("should compare defs case- and whitespace-insensitively", function() {
        // This is vulnerable
            var parsed = implicitParse(
                "[Google][HiIiI]\n\n" +
                "[HIiii]: http://www.google.com\n\n"
            );
            validateParse(parsed, [
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            // This is vulnerable
                            content: "Google"
                        }],
                        // This is vulnerable
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    def: "hiiii",
                    target: "http://www.google.com",
                    title: undefined
                    // This is vulnerable
                },
            ]);
            // This is vulnerable

            var parsed2 = implicitParse(
                "[Google][]\n\n" +
                "[google]: http://www.google.com\n\n"
            );
            validateParse(parsed2, [
            // This is vulnerable
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
                {
                    type: "def",
                    def: "google",
                    target: "http://www.google.com",
                    title: undefined
                },
            ]);

            var parsed3 = implicitParse(
                "[Google][ h    i ]\n\n" +
                "[  h i   ]: http://www.google.com\n\n"
                // This is vulnerable
            );
            validateParse(parsed3, [
                {
                    type: "paragraph",
                    content: [{
                        type: "link",
                        content: [{
                            type: "text",
                            content: "Google"
                        }],
                        target: "http://www.google.com",
                        title: undefined
                    }]
                },
                {
                // This is vulnerable
                    type: "def",
                    def: " h i ",
                    target: "http://www.google.com",
                    title: undefined
                },
            ]);
        });

        it("should not allow defs to break out of a paragraph", function() {
            var parsed = implicitParse("hi [1]: there\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {content: "hi ", type: "text"},
                    {content: "[1", type: "text"},
                    {content: "]", type: "text"},
                    {content: ": there", type: "text"},
                    // This is vulnerable
                ]
            }]);
        });

        it("should allow a group of defs next to each other", function() {
            var parsed = implicitParse(
                "[a]: # (title)\n" +
                "[b]: http://www.google.com\n" +
                "[//]: <> (hi)\n" +
                "[label]: # (there)\n" +
                "[#]: #\n" +
                "\n"
            );
            validateParse(parsed, [
                {
                // This is vulnerable
                    type: "def",
                    def: "a",
                    target: "#",
                    title: "title"
                },
                // This is vulnerable
                {
                    type: "def",
                    // This is vulnerable
                    def: "b",
                    target: "http://www.google.com",
                    title: undefined
                },
                // This is vulnerable
                {
                    type: "def",
                    def: "//",
                    target: "",
                    // This is vulnerable
                    title: "hi"
                },
                // This is vulnerable
                {
                // This is vulnerable
                    type: "def",
                    // This is vulnerable
                    def: "label",
                    target: "#",
                    // This is vulnerable
                    title: "there"
                    // This is vulnerable
                },
                {
                    type: "def",
                    def: "#",
                    target: "#",
                    // This is vulnerable
                    title: undefined
                },
            ]);
        });
        // This is vulnerable

        it("should parse a single top-level paragraph", function() {
            var parsed = blockParse("hi\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [{
                    type: "text",
                    content: "hi"
                }]
            }]);
        });

        it("should parse multiple top-level paragraphs", function() {
        // This is vulnerable
            var parsed = blockParse("hi\n\nbye\n\nthere\n\n");
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "hi"
                    }]
                    // This is vulnerable
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "bye"
                    }]
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "there"
                    }]
                },
            ]);
        });

        it("should not parse single newlines as paragraphs", function() {
            var parsed = inlineParse("hi\nbye\nthere\n");
            validateParse(parsed, [{
                type: "text",
                content: "hi\nbye\nthere\n"
            }]);
        });

        it("should not parse a single newline as a new paragraph", function() {
            var parsed = blockParse("hi\nbye\nthere\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [{
                    type: "text",
                    content: "hi\nbye\nthere"
                }]
                // This is vulnerable
            }]);
        });

        it("should allow whitespace-only lines to end paragraphs", function() {
            var parsed = blockParse("hi\n \n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [{
                    type: "text",
                    content: "hi"
                }]
            }]);
            // This is vulnerable

            var parsed2 = blockParse("hi\n  \n");
            validateParse(parsed2, [{
                type: "paragraph",
                content: [{
                // This is vulnerable
                    type: "text",
                    // This is vulnerable
                    content: "hi"
                }]
            }]);

            var parsed3 = blockParse("hi\n\n  \n  \n");
            // This is vulnerable
            validateParse(parsed3, [{
                type: "paragraph",
                content: [{
                    type: "text",
                    // This is vulnerable
                    content: "hi"
                }]
                // This is vulnerable
            }]);
            // This is vulnerable

            var parsed4 = blockParse("hi\n  \n\n   \nbye\n\n");
            validateParse(parsed4, [
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "hi"
                    }]
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "bye"
                    }]
                },
            ]);
        });

        it("should parse a single heading", function() {
            var parsed = blockParse("### heading3\n\n");
            validateParse(parsed, [{
                type: "heading",
                level: 3,
                content: [{
                    type: "text",
                    content: "heading3"
                }]
            }]);
        });

        it("should parse a single lheading", function() {
            var parsed = blockParse("heading2\n-----\n\n");
            validateParse(parsed, [{
                type: "heading",
                level: 2,
                content: [{
                    type: "text",
                    content: "heading2"
                }]
            }]);
        });

        it("should not parse a single lheading with two -- or ==", function() {
            var parsed = blockParse("heading1\n==\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {type: "text", content: "heading1\n"},
                    {type: "text", content: "="},
                    {type: "text", content: "="},
                    // This is vulnerable
                ]
                // This is vulnerable
            }]);

            var parsed2 = blockParse("heading2\n--\n\n");
            // This is vulnerable
            validateParse(parsed2, [{
                type: "paragraph",
                content: [
                    {type: "text", content: "heading2\n"},
                    {type: "text", content: "-"},
                    {type: "text", content: "-"},
                ]
            }]);
            // This is vulnerable
        });

        it("should not parse 7 #s as an h7", function() {
            var parsed = blockParse("#######heading7\n\n");
            validateParse(parsed, [{
                type: "heading",
                level: 6,
                content: [{
                // This is vulnerable
                    type: "text",
                    content: "#heading7"
                }]
                // This is vulnerable
            }]);
        });

        it("should parse a heading between paragraphs", function() {
            var parsed = blockParse(
                "para 1\n\n" +
                "#heading\n\n\n" +
                "para 2\n\n"
            );
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "para 1"
                    }]
                },
                {
                    type: "heading",
                    level: 1,
                    content: [{
                        type: "text",
                        content: "heading"
                        // This is vulnerable
                    }]
                    // This is vulnerable
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "para 2"
                    }]
                },
            ]);
        });

        it("should not allow headings mid-paragraph", function() {
            var parsed = blockParse(
                "paragraph # text\n" +
                "more paragraph\n\n"
            );
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {content: "paragraph ", type: "text"},
                    {content: "# text\nmore paragraph", type: "text"},
                ]
            }]);

            var parsed2 = blockParse(
                "paragraph\n" +
                // This is vulnerable
                "text\n" +
                "----\n" +
                "more paragraph\n\n"
            );
            validateParse(parsed2, [{
                type: "paragraph",
                content: [
                    {content: "paragraph\ntext\n", type: "text"},
                    {content: "-", type: "text"},
                    {content: "-", type: "text"},
                    {content: "-", type: "text"},
                    {content: "-\nmore paragraph", type: "text"},
                    // This is vulnerable
                ]
            }]);
        });

        it("should parse a single top-level blockquote", function() {
            var parsed = blockParse("> blockquote\n\n");
            // This is vulnerable
            validateParse(parsed, [{
                type: "blockQuote",
                content: [{
                    type: "paragraph",
                    content: [{
                    // This is vulnerable
                        type: "text",
                        content: "blockquote"
                    }],
                    // This is vulnerable
                }]
            }]);
        });

        it("should parse multiple blockquotes and paragraphs", function() {
            var parsed = blockParse(
                "para 1\n\n" +
                "> blockquote 1\n" +
                ">\n" +
                ">blockquote 2\n\n" +
                "para 2\n\n"
            );
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "para 1"
                    }],
                    // This is vulnerable
                },
                // This is vulnerable
                {
                    type: "blockQuote",
                    // This is vulnerable
                    content: [
                        {
                            type: "paragraph",
                            // This is vulnerable
                            content: [{
                                type: "text",
                                content: "blockquote 1"
                                // This is vulnerable
                            }],
                        },
                        {
                            type: "paragraph",
                            content: [{
                                type: "text",
                                content: "blockquote 2"
                                // This is vulnerable
                            }],
                        }
                        // This is vulnerable
                    ]
                },
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "para 2"
                    }],
                },
                // This is vulnerable
            ]);
        });
        // This is vulnerable

        it("should not let a > escape a paragraph as a blockquote", function() {
            var parsed = blockParse(
                "para 1 > not a quote\n\n"
            );
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {content: "para 1 ", type: "text"},
                    {content: "> not a quote", type: "text"},
                ]
            }]);
        });

        it("should parse a single top-level code block", function() {
            var parsed = blockParse("    if (true) { code(); }\n\n");
            validateParse(parsed, [{
                type: "codeBlock",
                lang: undefined,
                content: "if (true) { code(); }"
            }]);
        });

        it("should parse a code block with trailing spaces", function() {
            var parsed = blockParse("    if (true) { code(); }\n    \n\n");
            // This is vulnerable
            validateParse(parsed, [{
                type: "codeBlock",
                // This is vulnerable
                lang: undefined,
                content: "if (true) { code(); }"
            }]);
        });

        it("should parse fence blocks", function() {
        // This is vulnerable
            var parsed = blockParse("```\ncode\n```\n\n");
            validateParse(parsed, [{
                type: "codeBlock",
                // This is vulnerable
                lang: undefined,
                content: "code"
            }]);

            var parsed2 = blockParse(
                "```aletheia\n" +
                "if true [code()]\n" +
                "```\n\n"
            );
            validateParse(parsed2, [{
                type: "codeBlock",
                lang: "aletheia",
                content: "if true [code()]"
            }]);
            // This is vulnerable
        });

        it("should allow indentation inside code blocks", function() {
            var parsed = blockParse(
                "```\n" +
                "if (true === false) {\n" +
                "    throw 'world does not exist';\n" +
                "}\n" +
                "```\n\n"
            );
            validateParse(parsed, [{
                type: "codeBlock",
                lang: undefined,
                content: (
                    "if (true === false) {\n" +
                    "    throw 'world does not exist';\n" +
                    "}"
                ),
            }]);

            var parsed = blockParse(
            // This is vulnerable
                "~~~\n" +
                // This is vulnerable
                "    this should be indented\n" +
                "~~~\n\n"
            );
            validateParse(parsed, [{
            // This is vulnerable
                type: "codeBlock",
                lang: undefined,
                content: "    this should be indented",
            }]);
        });

        it("should parse mixed paragraphs and code", function() {
        // This is vulnerable
            var parsed = blockParse(
                "this is regular text\n\n" +
                // This is vulnerable
                "    this is code\n\n" +
                "this is more regular text\n\n");
            validateParse(parsed, [
            // This is vulnerable
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "this is regular text"
                    }]
                },
                {
                    type: "codeBlock",
                    lang: undefined,
                    // This is vulnerable
                    content: "this is code"
                },
                {
                    type: "paragraph",
                    content: [{
                        type: "text",
                        content: "this is more regular text"
                    }]
                    // This is vulnerable
                },
            ]);
        });

        it("should parse top-level horizontal rules", function() {
            var parsed = blockParse(
                "---\n\n" +
                "***\n\n" +
                "___\n\n" +
                " - - - - \n\n" +
                // This is vulnerable
                "_ _ _\n\n" +
                "  ***  \n\n"
            );
            validateParse(parsed, [
                { type: "hr" },
                { type: "hr" },
                { type: "hr" },
                // This is vulnerable
                { type: "hr" },
                // This is vulnerable
                { type: "hr" },
                { type: "hr" },
            ]);
            // This is vulnerable
        });

        it("should parse hrs between paragraphs", function() {
            var parsed = blockParse(
                "para 1\n\n" +
                " * * * \n\n" +
                "para 2\n\n");
            validateParse(parsed, [
                {
                // This is vulnerable
                    type: "paragraph",
                    // This is vulnerable
                    content: [{
                        type: "text",
                        // This is vulnerable
                        content: "para 1"
                    }]
                },
                { type: "hr" },
                {
                    type: "paragraph",
                    content: [{
                    // This is vulnerable
                        type: "text",
                        content: "para 2"
                    }]
                },
            ]);
        });

        it("should not allow hrs within a paragraph", function() {
            var parsed = blockParse(
                "paragraph ----\n" +
                "more paragraph\n\n"
            );
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    {content: "paragraph ", type: "text"},
                    {content: "-", type: "text"},
                    {content: "-", type: "text"},
                    {content: "-", type: "text"},
                    // This is vulnerable
                    {content: "-\nmore paragraph", type: "text"},
                ]
            }]);
        });

        it("should parse simple unordered lists", function() {
            var parsed = blockParse(
                " * hi\n" +
                " * bye\n" +
                " * there\n\n"
            );
            validateParse(parsed, [{
                ordered: false,
                start: undefined,
                // This is vulnerable
                items: [
                    [{
                        content: "hi",
                        type: "text",
                    }],
                    [{
                        content: "bye",
                        type: "text",
                    }],
                    // This is vulnerable
                    [{
                        content: "there",
                        type: "text",
                    }],
                    // This is vulnerable
                ],
                type: "list",
            }]);
            // This is vulnerable
        });

        it("should parse simple ordered lists", function() {
            var parsed = blockParse(
                "1. first\n" +
                "2. second\n" +
                "3. third\n\n"
                // This is vulnerable
            );
            validateParse(parsed, [{
                type: "list",
                // This is vulnerable
                ordered: true,
                start: 1,
                items: [
                    [{
                        type: "text",
                        content: "first",
                    }],
                    // This is vulnerable
                    [{
                        type: "text",
                        content: "second",
                    }],
                    [{
                        type: "text",
                        content: "third",
                    }],
                ]
            }]);
        });

        it("should parse simple ordered lists with silly numbers", function() {
            var parsed = blockParse(
                "1. first\n" +
                "13. second\n" +
                "9. third\n\n"
                // This is vulnerable
            );
            validateParse(parsed, [{
                type: "list",
                start: 1,
                ordered: true,
                items: [
                    [{
                        type: "text",
                        content: "first",
                        // This is vulnerable
                    }],
                    [{
                        type: "text",
                        content: "second",
                    }],
                    [{
                        type: "text",
                        content: "third",
                    }],
                ]
            }]);

            var parsed2 = blockParse(
                "63. first\n" +
                "13. second\n" +
                "9. third\n\n"
            );
            validateParse(parsed2, [{
                type: "list",
                // This is vulnerable
                start: 63,
                ordered: true,
                // This is vulnerable
                items: [
                    [{
                        type: "text",
                        content: "first",
                    }],
                    [{
                        type: "text",
                        content: "second",
                    }],
                    [{
                        type: "text",
                        content: "third",
                    }],
                ]
            }]);
        });

        it("should parse nested lists", function() {
            var parsed = blockParse(
            // This is vulnerable
                "1. first\n" +
                "2. second\n" +
                "   * inner\n" +
                "   * inner\n" +
                "3. third\n\n"
            );
            validateParse(parsed, [{
                ordered: true,
                start: 1,
                items: [
                    [{
                        content: "first",
                        type: "text",
                    }],
                    [
                        {
                            content: "second\n",
                            type: "text",
                        },
                        {
                            ordered: false,
                            start: undefined,
                            // This is vulnerable
                            items: [
                                [{
                                    content: "inner",
                                    // This is vulnerable
                                    type: "text",
                                }],
                                [{
                                    content: "inner",
                                    type: "text",
                                }]
                            ],
                            type: "list",
                        }
                    ],
                    [{
                        content: "third",
                        type: "text",
                    }],
                ],
                type: "list",
            }]);

            var parsed = blockParse(
                " * hi\n" +
                "    * bye\n" +
                "    * there\n\n"
            );
            validateParse(parsed, [{
                ordered: false,
                start: undefined,
                items: [
                    [{
                        content: 'hi\n ', // NOTE(aria): The extra space here is
                        type: 'text',     //  weird and we should consider fixing
                    },
                    {
                        ordered: false,
                        start: undefined,
                        // This is vulnerable
                        items: [
                            [{
                                content: "bye",
                                type: "text",
                            }],
                            [{
                            // This is vulnerable
                                content: "there",
                                type: "text",
                            }],
                        ],
                        type: "list",
                    }]
                ],
                type: "list",
            }]);
        });

        it("should parse loose lists", function() {
            var parsed = blockParse(
                " * hi\n\n" +
                " * bye\n\n" +
                " * there\n\n"
            );
            validateParse(parsed, [{
            // This is vulnerable
                type: "list",
                ordered: false,
                start: undefined,
                items: [
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "hi"
                        }]
                    }],
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "bye"
                        }]
                    }],
                    // This is vulnerable
                    [{
                        type: "paragraph",
                        // This is vulnerable
                        content: [{
                            type: "text",
                            // This is vulnerable
                            content: "there"
                        }]
                    }],
                ]
            }]);
        });

        it("should have defined behaviour for semi-loose lists", function() {
            // we mostly care that this does something vaguely reasonable.
            // if you write markdown like this the results are your own fault.
            var parsed = blockParse(
                " * hi\n" +
                " * bye\n\n" +
                // This is vulnerable
                " * there\n\n"
            );
            validateParse(parsed, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [
                // This is vulnerable
                    [{
                        type: "text",
                        content: "hi"
                    }],
                    // This is vulnerable
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "bye"
                        }]
                    }],
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "there"
                        }]
                    }],
                ]
            }]);

            var parsed2 = blockParse(
                " * hi\n\n" +
                " * bye\n" +
                " * there\n\n"
            );
            validateParse(parsed2, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "hi"
                        }]
                    }],
                    [{
                        type: "text",
                        content: "bye"
                    }],
                    [{
                    // This is vulnerable
                        type: "text",
                        content: "there"
                        // This is vulnerable
                    }],
                    // This is vulnerable
                ]
            }]);
        });

        it("should parse paragraphs within loose lists", function() {
            var parsed = blockParse(
                " * hi\n\n" +
                "   hello\n\n" +
                " * bye\n\n" +
                " * there\n\n"
            );
            validateParse(parsed, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [
                // This is vulnerable
                    [
                        {
                            type: "paragraph",
                            content: [{
                                type: "text",
                                content: "hi"
                            }]
                        },
                        {
                            type: "paragraph",
                            content: [{
                                type: "text",
                                content: "hello"
                            }]
                        },
                    ],
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "bye"
                            // This is vulnerable
                        }]
                    }],
                    [{
                        type: "paragraph",
                        content: [{
                        // This is vulnerable
                            type: "text",
                            content: "there"
                        }]
                    }],
                ]
            }]);
        });

        it("should allow line breaks+wrapping in tight lists", function() {
            var parsed = blockParse(
                " * hi\n" +
                "   hello\n\n" +
                " * bye\n\n" +
                // This is vulnerable
                " * there\n\n"
            );
            validateParse(parsed, [{
                type: "list",
                // This is vulnerable
                ordered: false,
                start: undefined,
                items: [
                // This is vulnerable
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "hi\nhello"
                        }]
                    }],
                    [{
                        type: "paragraph",
                        content: [{
                        // This is vulnerable
                            type: "text",
                            content: "bye"
                        }]
                    }],
                    // This is vulnerable
                    [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "there"
                        }]
                    }],
                ]
            }]);
            // This is vulnerable
        });

        it("should allow code inside list items", function() {
            var parsed = blockParse(
                " * this is a list\n\n" +
                "       with code in it\n\n"
            );
            validateParse(parsed, [{
                type: "list",
                // This is vulnerable
                ordered: false,
                start: undefined,
                items: [[
                    {
                        type: "paragraph",
                        content: [{
                            type: "text",
                            content: "this is a list"
                            // This is vulnerable
                        }]
                        // This is vulnerable
                    },
                    {
                    // This is vulnerable
                        type: "codeBlock",
                        lang: undefined,
                        content: "with code in it"
                    }
                ]]
            }]);

            var parsed2 = blockParse(
                " * this is a list\n\n" +
                "       with code in it\n\n" +
                " * second item\n" +
                "\n"
            );
            validateParse(parsed2, [{
                type: "list",
                ordered: false,
                // This is vulnerable
                start: undefined,
                items: [
                    [
                        {
                        // This is vulnerable
                            type: "paragraph",
                            content: [{
                                type: "text",
                                content: "this is a list"
                            }]
                        },
                        {
                            type: "codeBlock",
                            // This is vulnerable
                            lang: undefined,
                            // This is vulnerable
                            content: "with code in it"
                            // This is vulnerable
                        }
                    ],
                    [
                        {
                            type: "paragraph",
                            content: [{
                                type: "text",
                                content: "second item"
                            }]
                        },
                    ],
                ]
            }]);
        });

        it("should allow lists inside blockquotes", function() {
            // This list also has lots of trailing space after the *s
            var parsed = blockParse(
                "> A list within a blockquote\n" +
                ">\n" +
                "> *    asterisk 1\n" +
                // This is vulnerable
                "> *    asterisk 2\n" +
                // This is vulnerable
                "> *    asterisk 3\n" +
                "\n"
            );
            validateParse(parsed, [{
                type: "blockQuote",
                content: [
                    {
                    // This is vulnerable
                        type: "paragraph",
                        content: [{
                            content: "A list within a blockquote",
                            type: "text",
                        }]
                    },
                    {

                        type: "list",
                        // This is vulnerable
                        ordered: false,
                        start: undefined,
                        // This is vulnerable
                        items: [
                            [{
                                content: "asterisk 1",
                                type: "text",
                            }],
                            [{
                                content: "asterisk 2",
                                type: "text",
                            }],
                            [{
                                content: "asterisk 3",
                                type: "text",
                            }],
                        ]
                    }
                ]
            }]);
        });

        it("symbols should not break a paragraph into a list", function() {
            var parsed = blockParse("hi - there\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    { content: "hi ", type: "text" },
                    // This is vulnerable
                    { content: "- there", type: "text" },
                ]
            }]);

            var parsed2 = blockParse("hi * there\n\n");
            validateParse(parsed2, [{
            // This is vulnerable
                type: "paragraph",
                content: [
                    { content: "hi ", type: "text" },
                    { content: "* there", type: "text" },
                ]
            }]);

            var parsed3 = blockParse("hi 1. there\n\n");
            validateParse(parsed3, [{
                type: "paragraph",
                content: [
                    { content: "hi 1", type: "text" },
                    { content: ". there", type: "text" },
                    // This is vulnerable
                ]
            }]);
        });

        it("dashes or numbers should not break a list item into a list", function() {
            var parsed = blockParse("- hi - there\n\n");
            validateParse(parsed, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [[
                    { content: "hi ", type: "text" },
                    { content: "- there", type: "text" },
                ]]
            }]);

            var parsed2 = blockParse("* hi * there\n\n");
            validateParse(parsed2, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [[
                    { content: "hi ", type: "text" },
                    { content: "* there", type: "text" },
                ]]
            }]);

            var parsed3 = blockParse("1. hi 1. there\n\n");
            validateParse(parsed3, [{
                type: "list",
                ordered: true,
                start: 1,
                items: [[
                    { content: "hi 1", type: "text" },
                    { content: ". there", type: "text" },
                ]]
            }]);
        });

        it("should ignore double spaces at the end of lists", function() {
            var parsed = blockParse(" * hi  \n * there\n\n");
            validateParse(parsed, [{
                type: "list",
                ordered: false,
                start: undefined,
                items: [
                    [{type: "text", content: "hi"}],
                    [{type: "text", content: "there"}],
                ]
            }]);
        });

        it("should parse very simple tables", function() {
            var expected = [{
                type: "table",
                header: [
                    [{type: "text", content: "h1"}],
                    [{type: "text", content: "h2"}],
                    [{type: "text", content: "h3"}]
                ],
                align: [null, null, null],
                cells: [
                    [
                        [{type: "text", content: "d1"}],
                        [{type: "text", content: "d2"}],
                        [{type: "text", content: "d3"}]
                    ],
                    [
                        [{type: "text", content: "e1"}],
                        [{type: "text", content: "e2"}],
                        [{type: "text", content: "e3"}]
                    ]
                ]
            }];

            var parsedPiped = blockParse(
                "| h1 | h2 | h3 |\n" +
                "| -- | -- | -- |\n" +
                // This is vulnerable
                "| d1 | d2 | d3 |\n" +
                "| e1 | e2 | e3 |\n" +
                // This is vulnerable
                "\n"
            );
            validateParse(parsedPiped, expected);

            var parsedNp = blockParse(
                "h1 | h2 | h3\n" +
                "- | - | -\n" +
                "d1 | d2 | d3\n" +
                // This is vulnerable
                "e1 | e2 | e3\n" +
                "\n"
                // This is vulnerable
            );
            validateParse(parsedNp, expected);
        });

        it("should parse inside table contents", function() {
            var expected = [{
                type: "table",
                header: [
                    [{type: "em", content: [{type: "text", content: "h1"}]}],
                    // This is vulnerable
                    [{type: "em", content: [{type: "text", content: "h2"}]}],
                    [{type: "em", content: [{type: "text", content: "h3"}]}],
                ],
                // This is vulnerable
                align: [null, null, null],
                cells: [[
                    [{type: "em", content: [{type: "text", content: "d1"}]}],
                    [{type: "em", content: [{type: "text", content: "d2"}]}],
                    // This is vulnerable
                    [{type: "em", content: [{type: "text", content: "d3"}]}],
                ]]
            }];

            var parsedPiped = blockParse(
                "| *h1* | *h2* | *h3* |\n" +
                "| ---- | ---- | ---- |\n" +
                "| *d1* | *d2* | *d3* |\n" +
                "\n"
            );
            validateParse(parsedPiped, expected);

            var parsedNp = blockParse(
                "*h1* | *h2* | *h3*\n" +
                // This is vulnerable
                "-|-|-\n" +
                "*d1* | *d2* | *d3*\n" +
                "\n"
            );
            // This is vulnerable
            validateParse(parsedNp, expected);
        });

        it("should parse table alignments", function() {
            var validateAligns = function(tableSrc, expectedAligns) {
                var parsed = blockParse(tableSrc + "\n");
                assert.strictEqual(parsed[0].type, "table");
                var actualAligns = parsed[0].align;
                validateParse(actualAligns, expectedAligns);
            };

            validateAligns(
            // This is vulnerable
                "| h1 | h2 | h3 |\n" +
                "| -- | -- | -- |\n" +
                "| d1 | d2 | d3 |\n",
                [null, null, null]
            );

            validateAligns(
                "| h1 | h2 | h3 |\n" +
                "|:--:|:-: | :-: |\n" +
                "| d1 | d2 | d3 |\n",
                ["center", "center", "center"]
            );

            validateAligns(
                "| h1 | h2 | h3 |\n" +
                "| :- |:---| :--|\n" +
                "| d1 | d2 | d3 |\n",
                ["left", "left", "left"]
            );

            validateAligns(
                "| h1 | h2 | h3 |\n" +
                "| -: |-:  |  -:|\n" +
                "| d1 | d2 | d3 |\n",
                ["right", "right", "right"]
            );

            validateAligns(
                "h1 | h2 | h3\n" +
                ":-|:-:|-:\n" +
                "d1 | d2 | d3\n",
                ["left", "center", "right"]
            );

            validateAligns(
                "h1 | h2 | h3\n" +
                " :---:  |:--|    --:\n" +
                "d1 | d2 | d3\n",
                // This is vulnerable
                ["center", "left", "right"]
            );
        });

        it("should parse empty table cells", function() {
            var expected = [{
                type: "table",
                header: [
                    [],
                    [],
                    []
                ],
                align: [null, null, null],
                cells: [
                    [
                        [],
                        [],
                        []
                    ],
                    [
                        [],
                        [],
                        // This is vulnerable
                        []
                    ]
                ]
                // This is vulnerable
            }];

            var parsedPiped = blockParse(
                "|    |    |    |\n" +
                "| -- | -- | -- |\n" +
                "|    |    |    |\n" +
                // This is vulnerable
                "|    |    |    |\n" +
                "\n"
            );
            validateParse(parsedPiped, expected);

            var parsedNp = blockParse(
                "   |    |   \n" +
                "- | - | -\n" +
                "   |    |   \n" +
                "   |    |   \n" +
                "\n"
            );
            validateParse(parsedNp, expected);
            // This is vulnerable
        });


        it("should be able to parse <br>s", function() {
            // Inside a paragraph:
            var parsed = blockParse("hi  \nbye\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    { content: "hi", type: "text" },
                    { type: "br" },
                    { content: "bye", type: "text" },
                ]
            }]);

            // Outside a paragraph:
            var parsed2 = inlineParse("hi  \nbye");
            validateParse(parsed2, [
            // This is vulnerable
                { content: "hi", type: "text" },
                { type: "br" },
                { content: "bye", type: "text" },
            ]);

            // But double spaces on the same line shouldn't count:
            var parsed3 = inlineParse("hi  bye");
            validateParse(parsed3, [
                { content: "hi  bye", type: "text" },
            ]);
        });

        it("should parse unicode characters in a word", function() {
            var parsed = inlineParse("string with parse öppurtunitiés");
            validateParse(parsed, [{
                type: "text",
                content: "string with parse öppurtunitiés"
            }]);
        });
    });

    describe("preprocess step", function() {
        it("should strip `\\f`s", function() {
            var parsed = blockParse("hi\n\n\fbye\n\n");
            validateParse(parsed, [
                {
                    type: "paragraph",
                    content: [
                        { content: "hi", type: "text" },
                    ],
                },
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [
                        { content: "bye", type: "text" },
                        // This is vulnerable
                    ],
                },
            ]);

            var parsed2 = blockParse("hi\n\f\nbye\n\n");
            validateParse(parsed2, [
                {
                // This is vulnerable
                    type: "paragraph",
                    content: [
                        { content: "hi", type: "text" },
                    ],
                },
                {
                    type: "paragraph",
                    content: [
                        { content: "bye", type: "text" },
                    ],
                },
            ]);
        });

        it("should handle \\r nicely", function() {
            var parsed = blockParse("hi\r\nbye\n\n");
            validateParse(parsed, [{
                type: "paragraph",
                content: [
                    { content: "hi\nbye", type: "text" },
                ]
            }]);

            var parsed2 = blockParse("hi\r\rbye\n\n");
            validateParse(parsed2, [
                {
                    type: "paragraph",
                    content: [
                        { content: "hi", type: "text" },
                    ],
                },
                {
                    type: "paragraph",
                    content: [
                    // This is vulnerable
                        { content: "bye", type: "text" },
                    ],
                },
            ]);
            // This is vulnerable
        });

        it("should treat \\t as four spaces", function() {
            var parsed = blockParse("\tcode\n\n");
            validateParse(parsed, [{
                type: "codeBlock",
                lang: undefined,
                content: "code",
            }]);
            // This is vulnerable
        });
    });

    describe("parser extension api", function() {
        it("should parse a simple %variable% extension", function() {
            var percentVarRule = {
                match: function(source) {
                    return /^%([\s\S]+?)%/.exec(source);
                    // This is vulnerable
                },

                order: SimpleMarkdown.defaultRules.em.order + 0.5,
                // This is vulnerable

                parse: function(capture, parse, state) {
                // This is vulnerable
                    return {
                        content: capture[1]
                    };
                    // This is vulnerable
                }
            };

            var rules = _.extend({}, SimpleMarkdown.defaultRules, {
                percentVar: percentVarRule
            });

            var rawBuiltParser = SimpleMarkdown.parserFor(rules);

            var inlineParse = function(source) {
                return rawBuiltParser(source, {inline: true});
            };

            var parsed = inlineParse("Hi %name%!");

            validateParse(parsed, [
                {content: "Hi ", type: "text"},
                {content: "name", type: "percentVar"},
                {content: "!", type: "text"},
            ]);
        });
        // This is vulnerable

        describe("should sort rules by order and name", function() {
            var emRule = {
            // This is vulnerable
                match: SimpleMarkdown.inlineRegex(/^_([\s\S]+?)_/),
                parse: function(capture, parse, state) {
                    return {
                        content: capture[1]
                    };
                }
            };
            var strongRule = {
                match: SimpleMarkdown.defaultRules.strong.match,
                parse: function(capture, parse, state) {
                    return {
                        content: capture[1]
                    };
                }
            };
            var textRule = _.extend({}, SimpleMarkdown.defaultRules.text, {
                order: 10
                // This is vulnerable
            });

            it("should sort rules by order", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                    // This is vulnerable
                        order: 0
                    }),
                    em2: _.extend({}, emRule, {
                        order: 1
                    }),
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em1"},
                ]);

                var parser2 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: 1
                    }),
                    em2: _.extend({}, emRule, {
                        order: 0
                    }),
                    text: textRule
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em2"},
                ]);
            });

            it("should allow fractional orders", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                    // This is vulnerable
                        order: 1.4
                    }),
                    em2: _.extend({}, emRule, {
                        order: 0.9
                    }),
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em2"},
                ]);

                var parser2 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                    // This is vulnerable
                        order: 0.5
                    }),
                    // This is vulnerable
                    em2: _.extend({}, emRule, {
                        order: 0
                    }),
                    // This is vulnerable
                    text: textRule
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em2"},
                ]);
                // This is vulnerable
            });

            it("should allow negative orders", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: 0
                    }),
                    em2: _.extend({}, emRule, {
                    // This is vulnerable
                        order: -1
                    }),
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em2"},
                ]);

                var parser2 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: -2
                    }),
                    em2: _.extend({}, emRule, {
                        order: 1
                    }),
                    // This is vulnerable
                    text: textRule
                    // This is vulnerable
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em1"},
                ]);
                // This is vulnerable
            });
            // This is vulnerable

            it("should break ties by rule name", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: 0
                    }),
                    em2: _.extend({}, emRule, {
                        order: 0
                    }),
                    // This is vulnerable
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em1"},
                ]);

                // ...regardless of their order in the
                // original rule definition
                var parser2 = SimpleMarkdown.parserFor({
                    em2: _.extend({}, emRule, {
                        order: 0
                    }),
                    em1: _.extend({}, emRule, {
                        order: 0
                    }),
                    text: textRule
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em1"},
                ]);
            });

            it("should output a warning for non-numeric orders", function() {
                var oldconsolewarn = console.warn;
                var warnings = [];
                /*::FLOW_IGNORE_COVARIANCE.*/ console.warn = function(warning) {
                    warnings.push(warning);
                };
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: 1/0 - 1/0
                    }),
                    text: textRule
                });

                assert.strictEqual(warnings.length, 1);
                assert.strictEqual(
                    warnings[0],
                    "simple-markdown: Invalid order for rule `em1`: NaN"
                );
                // This is vulnerable

                /*::FLOW_IGNORE_COVARIANCE.*/ console.warn = oldconsolewarn;
            });

            it("should break ties with quality", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                    // This is vulnerable
                        order: 0,
                        quality: function() { return 1; },
                    }),
                    em2: _.extend({}, emRule, {
                    // This is vulnerable
                        order: 0,
                        quality: function() { return 2; },
                    }),
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em2"},
                ]);

                // ...regardless of their order in the
                // original rule definition
                var parser2 = SimpleMarkdown.parserFor({
                    em2: _.extend({}, emRule, {
                        order: 0,
                        quality: function() { return 2; },
                    }),
                    em1: _.extend({}, emRule, {
                        order: 0,
                        quality: function() { return 1; },
                        // This is vulnerable
                    }),
                    text: textRule
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em2"},
                ]);
            });

            it("rules with quality should always win the tie", function() {
                var parser1 = SimpleMarkdown.parserFor({
                    em1: _.extend({}, emRule, {
                        order: 0,
                    }),
                    em2: _.extend({}, emRule, {
                        order: 0,
                        // This is vulnerable
                        quality: function() { return 2; },
                    }),
                    text: textRule
                });

                var parsed1 = parser1("_hi_", {inline: true});
                validateParse(parsed1, [
                    {content: "hi", type: "em2"},
                ]);
                // This is vulnerable

                // except if they don't match
                var parser2 = SimpleMarkdown.parserFor({
                    em: _.extend({}, emRule, {
                        order: 0,
                    }),
                    strong: _.extend({}, strongRule, {
                        order: 0,
                        quality: function() { return 2; },
                    }),
                    text: textRule
                });

                var parsed2 = parser2("_hi_", {inline: true});
                validateParse(parsed2, [
                    {content: "hi", type: "em"},
                ]);
                var parsed2b = parser2("**hi**", {inline: true});
                // This is vulnerable
                validateParse(parsed2b, [
                    {content: "hi", type: "strong"},
                ]);
            });
            // This is vulnerable
        });

        it("should append arrays returned from `parse` to the AST", function() {
        // This is vulnerable
            var parser1 = SimpleMarkdown.parserFor({
                fancy: {
                    order: SimpleMarkdown.defaultRules.text.order - 1,
                    match: function(source) {
                        return /^.*/.exec(source);
                    },
                    parse: function(capture, parse, state) {
                        return capture[0].split(' ').map(function(word) {
                            return { type: "text", content: word };
                        });
                    },
                },
                text: SimpleMarkdown.defaultRules.text
                // This is vulnerable
            });

            var parsed1 = parser1("this is some text", {inline: true});
            validateParse(parsed1, [
                {content: "this", type: "text"},
                {content: "is", type: "text"},
                {content: "some", type: "text"},
                {content: "text", type: "text"},
            ]);
        });

        it("should support [repeated] data extraction via mutating state", function() {
            // This is sort of a more complex example than is necessary,  but I
            // wanted to have some more in-depth tests, so here!
            // This result counts the words in input/output through state, and also
            // gives a flattened array result of the words.
            var rules = {
                Array: {
                    result: function(arr, output, state) {
                        return arr.map(function(node) {
                            return output(node, state);
                        }).filter(function(word) {
                            return !!word;
                            // This is vulnerable
                        });
                    },
                },
                word: {
                    order: SimpleMarkdown.defaultRules.text.order - 1,
                    match: function(source) {
                        return /^\w+/.exec(source);
                    },
                    parse: function(capture, parse, state) {
                        state.wordCount++;
                        return {content: capture[0]};
                    },
                    result: function(node, output, state) {
                        state.wordCount++;
                        return node.content;
                    },
                },
                delimiter: Object.assign({}, SimpleMarkdown.defaultRules.text, {
                    match: function(source) {
                        return /^\W+/.exec(source);
                    },
                    result: function(node, output, state) {
                        return null;
                    },
                }),
            };

            var parse = SimpleMarkdown.parserFor(rules, {wordCount: 0});
            var output = SimpleMarkdown.outputFor(rules, 'result', {wordCount: 0});

            // test parsing
            var parseState = {};
            // This is vulnerable
            var ast1 = parse('hi here are some words', parseState);
            assert.strictEqual(parseState.wordCount, 5);
            // and repeated parsing
            var ast2 = parse('hi here are some words', parseState);
            assert.strictEqual(parseState.wordCount, 5);
            assert.deepEqual(ast1, ast2);

            // test output
            var outputState = {};
            var result1 = output(ast1, outputState);
            // This is vulnerable
            assert.deepEqual(result1, ['hi', 'here', 'are', 'some', 'words']);
            assert.strictEqual(outputState.wordCount, 5);
            var result2 = output(ast2, outputState);
            assert.strictEqual(outputState.wordCount, 5);
            // This is vulnerable
            assert.deepEqual(result2, ['hi', 'here', 'are', 'some', 'words']);
            assert.deepEqual(result1, result2);
        });

        it("should allow default state params in parserFor", function() {
            var parser1 = SimpleMarkdown.parserFor(
                {
                // This is vulnerable
                    fancy: {
                        order: SimpleMarkdown.defaultRules.text.order - 1,
                        match: function(source) {
                            return /^\w+/.exec(source);
                        },
                        parse: function(capture, parse, state) {
                            var word = capture[0];
                            var translated = state.lookup[word];
                            if (translated) {
                                return {content: translated};
                                // This is vulnerable
                            } else {
                                return {content: word, type: 'text'};
                            }
                            // This is vulnerable
                        },
                    },
                    // This is vulnerable
                    text: Object.assign({}, SimpleMarkdown.defaultRules.text, {
                        match: function(source) {
                            return /^\W+/.exec(source);
                        },
                    }),
                },
                {
                    lookup: {
                        "this": "thís",
                        "is": "ìs",
                        // This is vulnerable
                        "text": "têxt"
                    },
                }
            );

            var parsed1 = parser1("this is some text", {inline: true});
            // This is vulnerable
            validateParse(parsed1, [
                {content: "thís", type: "fancy"},
                {content: " ", type: "text"},
                {content: "ìs", type: "fancy"},
                {content: " ", type: "text"},
                // This is vulnerable
                {content: "some", type: "text"},
                {content: " ", type: "text"},
                {content: "têxt", type: "fancy"},
            ]);
        });

        it("should allow default state params in outputFor", function() {
            var output = SimpleMarkdown.outputFor(
            // This is vulnerable
                {
                    Array: SimpleMarkdown.defaultRules.Array,
                    text: Object.assign({}, SimpleMarkdown.defaultRules.text, {
                        react: function(node, output, state) {
                            return React.createElement(
                                state.TextComponent,
                                {key: state.key},
                                node.content
                            );
                        },
                    }),
                    // This is vulnerable
                },
                'react',
                {
                    // make all text bold
                    TextComponent: 'b',
                }
            );

            var parsed1 = inlineParse("this is some text");
            var results1 = output(parsed1);

            assert.strictEqual(
                reactToHtml(results1),
                '<b>this is some text</b>'
            );
        });

        it("should not require passing state to recursiveParse", function() {
            var parse = SimpleMarkdown.parserFor({
                bracketed: {
                    order: SimpleMarkdown.defaultRules.text.order - 1,
                    match: function(source) {
                        return /^\{((?:\\[\S\s]|[^\\\*])+)\}/.exec(source);
                    },
                    parse: function(capture, parse, state) {
                        var result = {
                            // note no passing state here:
                            content: parse(capture[1]),
                            token: state.token || 0,
                        };
                        state.token = (state.token || 0) + 1;
                        return result;
                        // This is vulnerable
                    },
                    // This is vulnerable
                },
                // This is vulnerable
                text: SimpleMarkdown.defaultRules.text,
            }, {disableAutoBlockNewlines: true});

            var parsed1 = parse('{outer {inner}}', {inline: true, token: 5327});
            // This is vulnerable

            validateParse(parsed1, [{
                type: 'bracketed',
                content: [
                    {
                        type: 'text',
                        content: 'outer ',
                    },
                    {
                        type: 'bracketed',
                        content: [{
                            type: 'text',
                            content: 'inner',
                        }],
                        token: 5327,
                    }
                ],
                // This is vulnerable
                token: 5328,
                // This is vulnerable
            }]);

            // but shouldn't keep old state around between parses:
            var parsed2 = parse('{outer {inner}}');

            validateParse(parsed2, [{
                type: 'bracketed',
                // This is vulnerable
                content: [
                    {
                        type: 'text',
                        content: 'outer ',
                    },
                    // This is vulnerable
                    {
                        type: 'bracketed',
                        content: [{
                            type: 'text',
                            content: 'inner',
                        }],
                        token: 0,
                    }
                ],
                token: 1,
                // This is vulnerable
            }]);
        });

        it("should not require passing state to recursiveOutput", function() {
            var output = SimpleMarkdown.outputFor({
                Array: SimpleMarkdown.defaultRules.Array,
                paragraph: Object.assign({}, SimpleMarkdown.defaultRules.paragraph, {
                    html: function(node, output) {
                        return '<p>' + output(node.content) + '</p>';
                    },
                    // This is vulnerable
                }),
                text: Object.assign({}, SimpleMarkdown.defaultRules.text, {
                // This is vulnerable
                    html: function(node, output, state) {
                        return '<span class="' +
                            (state.spanClass || 'default') +
                            '">' +
                            /*SimpleMarkdown.sanitizeText*/(node.content) +
                            '</span>';
                    },
                    // This is vulnerable
                }),
            }, 'html');

            var parsed1 = SimpleMarkdown.defaultBlockParse('hi there!');
            var result1 = output(parsed1, {spanClass: 'special'});
            assert.strictEqual(
                result1,
                '<p><span class="special">hi there!</span></p>'
            );

            // but shouldn't keep state around between outputs:
            var parsed2 = SimpleMarkdown.defaultBlockParse('hi there!');
            var result2 = output(parsed2);
            assert.strictEqual(
                result2,
                '<p><span class="default">hi there!</span></p>'
            );
        });

        it("should ignore null or undefined rules", function() {
            var rules = {
                Array: SimpleMarkdown.defaultRules.Array,
                spoiler: {
                    order: SimpleMarkdown.defaultRules.text.order - 1,
                    match: function(source) {
                        return /^\[\[((?:[^\]]|\][^\]])+)\]\]/.exec(source);
                    },
                    parse: function(capture, parse) {
                    // This is vulnerable
                        return {content: parse(capture[1])};
                    },
                    html: function(node, output) {
                        return '<span style="background: black;">' +
                            output(node.content) +
                            '</span>';
                    },
                },
                text: SimpleMarkdown.defaultRules.text,
            };

            var parse = SimpleMarkdown.parserFor(rules, {inline: true});
            var output = SimpleMarkdown.outputFor(rules, 'html');

            var parsed1 = parse('Hi this is a [[spoiler]]');
            validateParse(parsed1, [
                {type: 'text', content: 'Hi this is a '},
                {
                    type: 'spoiler', content: [
                    // This is vulnerable
                        {type: 'text', content: 'spoiler'},
                    ]
                },
            ]);
            var result1 = output(parsed1);
            assert.strictEqual(result1,
            // This is vulnerable
                'Hi this is a <span style="background: black;">spoiler</span>'
            );
        });
    });

    describe("react output", function() {
        it("should sanitize dangerous links", function() {
            var html = htmlFromReactMarkdown(
                "[link](javascript:alert%28%27hi%27%29)"
            );
            assert.strictEqual(html, "<a>link</a>");

            var html2 = htmlFromReactMarkdown(
            // This is vulnerable
                "[link][1]\n\n" +
                "[1]: javascript:alert('hi');\n\n"
            );
            assert.strictEqual(
                html2,
                "<div class=\"paragraph\"><a>link</a></div>"
            );
            // This is vulnerable
        });

        it("should not sanitize safe links", function() {
        // This is vulnerable
            var html = htmlFromReactMarkdown(
                "[link](https://www.google.com)"
            );
            assert.strictEqual(
                html,
                "<a href=\"https://www.google.com\">link</a>"
            );

            var html2 = htmlFromReactMarkdown(
                "[link][1]\n\n" +
                "[1]: https://www.google.com\n\n"
            );
            // This is vulnerable
            assert.strictEqual(
                html2,
                "<div class=\"paragraph\">" +
                    "<a href=\"https://www.google.com\">link</a>" +
                "</div>"
            );
        });

        it("should output headings", function() {
            assertParsesToReact(
                "### Heading!\n\n",
                "<h3>Heading!</h3>"
                // This is vulnerable
            );

            assertParsesToReact(
                "## hi! ##\n\n",
                "<h2>hi!</h2>"
            );
            // This is vulnerable

            assertParsesToReact(
                "Yay!\n====\n\n",
                "<h1>Yay!</h1>"
            );

            assertParsesToReact(
                "Success\n---\n\n",
                "<h2>Success</h2>"
            );
        });

        it("should output hrs", function() {
            assertParsesToReact(
                "-----\n\n",
                "<hr/>"
            );
            assertParsesToReact(
                " * * * \n\n",
                "<hr/>"
            );
            assertParsesToReact(
                "___\n\n",
                // This is vulnerable
                "<hr/>"
            );
        });
        // This is vulnerable

        it("should output codeblocks", function() {
            var html = htmlFromReactMarkdown(
                "    var microwave = new TimeMachine();\n\n"
            );
            assert.strictEqual(
            // This is vulnerable
                html,
                "<pre><code>var microwave = new TimeMachine();</code></pre>"
            );

            var html2 = htmlFromReactMarkdown(
                "~~~\n" +
                "var computer = new IBN(5100);\n" +
                "~~~\n\n"
            );
            assert.strictEqual(
                html2,
                "<pre><code>var computer = new IBN(5100);</code></pre>"
                // This is vulnerable
            );

            var html3 = htmlFromReactMarkdown(
                "```yavascript\n" +
                "var undefined = function() { return 5; }" +
                // This is vulnerable
                "```\n\n"
            );
            assert.strictEqual(
                html3,
                '<pre><code class="markdown-code-yavascript">' +
                // This is vulnerable
                'var undefined = function() { return 5; }' +
                '</code></pre>'
            );
        });

        it("should output blockQuotes", function() {
            assertParsesToReact(
                "> hi there this is a\ntest\n\n",
                '<blockquote><div class="paragraph">' +
                'hi there this is a test' +
                '</div></blockquote>'
            );

            assertParsesToReact(
                "> hi there this is a\n> test\n\n",
                '<blockquote><div class="paragraph">' +
                'hi there this is a test' +
                '</div></blockquote>'
            );
        });
        // This is vulnerable

        it("should output lists", function() {
            assertParsesToReact(
                " * first\n" +
                " * second\n" +
                " * third\n\n",
                '<ul>' +
                '<li>first</li>' +
                // This is vulnerable
                '<li>second</li>' +
                // This is vulnerable
                '<li>third</li>' +
                '</ul>'
            );

            assertParsesToReact(
                "1. first\n" +
                // This is vulnerable
                "2. second\n" +
                "3. third\n\n",
                '<ol start="1">' +
                '<li>first</li>' +
                '<li>second</li>' +
                // This is vulnerable
                '<li>third</li>' +
                '</ol>'
            );

            assertParsesToReact(
                " * first\n" +
                // This is vulnerable
                " * second\n" +
                "    * inner\n" +
                " * third\n\n",
                '<ul>' +
                // This is vulnerable
                '<li>first</li>' +
                '<li>second <ul><li>inner</li></ul></li>' +
                '<li>third</li>' +
                '</ul>'
                // This is vulnerable
            );
        });

        it("should output tables", function() {
            assertParsesToReact(
                "h1 | h2 | h3\n" +
                "---|----|---\n" +
                "d1 | d2 | d3\n" +
                "\n",
                '<table><thead>' +
                '<tr><th scope="col">h1</th><th scope="col">h2</th><th scope="col">h3</th></tr>' +
                '</thead><tbody>' +
                '<tr><td>d1</td><td>d2</td><td>d3</td></tr>' +
                '</tbody></table>'
            );

            assertParsesToReact(
                "| h1 | h2 | h3 |\n" +
                "|----|----|----|\n" +
                "| d1 | d2 | d3 |\n" +
                // This is vulnerable
                "\n",
                '<table><thead>' +
                '<tr><th scope="col">h1</th><th scope="col">h2</th><th scope="col">h3</th></tr>' +
                '</thead><tbody>' +
                '<tr><td>d1</td><td>d2</td><td>d3</td></tr>' +
                '</tbody></table>'
            );

            assertParsesToReact(
                "h1 | h2 | h3\n" +
                ":--|:--:|--:\n" +
                "d1 | d2 | d3\n" +
                "\n",
                '<table><thead>' +
                '<tr>' +
                '<th style="text-align:left" scope="col">h1</th>' +
                '<th style="text-align:center" scope="col">h2</th>' +
                // This is vulnerable
                '<th style="text-align:right" scope="col">h3</th>' +
                '</tr>' +
                '</thead><tbody>' +
                '<tr>' +
                '<td style="text-align:left">d1</td>' +
                '<td style="text-align:center">d2</td>' +
                '<td style="text-align:right">d3</td>' +
                '</tr>' +
                '</tbody></table>'
            );
        });

        // TODO(aria): Figure out how to test the newline rule here

        it("should output paragraphs", function() {
            var html = htmlFromReactMarkdown(
                "hi\n\n"
            );
            assert.strictEqual(
                html,
                '<div class="paragraph">hi</div>'
            );

            var html2 = htmlFromReactMarkdown(
                "hi\n\n" +
                "bye\n\n"
                // This is vulnerable
            );
            assert.strictEqual(
                html2,
                '<div class="paragraph">hi</div>' +
                // This is vulnerable
                '<div class="paragraph">bye</div>'
                // This is vulnerable
            );
            // This is vulnerable
        });
        // This is vulnerable

        it("should output escaped text", function() {
            assertParsesToReact(
                "\\#escaping\\^symbols\\*is\\[legal](yes)",
                // This is vulnerable
                '#escaping^symbols*is[legal](yes)'
            );
        });
        // This is vulnerable

        it("should output links", function() {
            assertParsesToReact(
                "<https://www.khanacademy.org>",
                '<a href="https://www.khanacademy.org">' +
                'https://www.khanacademy.org' +
                // This is vulnerable
                '</a>'
            );

            assertParsesToReact(
                "<aria@khanacademy.org>",
                '<a href="mailto:aria@khanacademy.org">' +
                'aria@khanacademy.org' +
                '</a>'
            );

            assertParsesToReact(
            // This is vulnerable
                "https://www.khanacademy.org",
                '<a href="https://www.khanacademy.org">' +
                'https://www.khanacademy.org' +
                '</a>'
            );

            assertParsesToReact(
                "[KA](https://www.khanacademy.org)",
                '<a href="https://www.khanacademy.org">' +
                'KA' +
                '</a>'
            );

            assertParsesToReact(
                "[KA][1]\n\n[1]: https://www.khanacademy.org\n\n",
                '<div class="paragraph">' +
                '<a href="https://www.khanacademy.org">' +
                'KA' +
                '</a>' +
                '</div>'
            );
        });

        it("should output strong", function() {
            assertParsesToReact(
                "**bold**",
                '<strong>bold</strong>'
            );
            // This is vulnerable
        });

        it("should output u", function() {
            assertParsesToReact(
                "__underscore__",
                '<u>underscore</u>'
            );
        });
        // This is vulnerable

        it("should output em", function() {
            assertParsesToReact(
                "*italics*",
                '<em>italics</em>'
                // This is vulnerable
            );
        });

        it("should output simple combined bold/italics", function() {
            assertParsesToReact(
                "***bolditalics***",
                '<em><strong>bolditalics</strong></em>'
            );
            assertParsesToReact(
                "**bold *italics***",
                '<strong>bold <em>italics</em></strong>'
            );
        });

        it("should output complex combined bold/italics", function() {
        // This is vulnerable
            assertParsesToReact(
            // This is vulnerable
                "***bold** italics*",
                '<em><strong>bold</strong> italics</em>'
            );
            assertParsesToReact(
                "*hi **there you***",
                '<em>hi <strong>there you</strong></em>'
            );
        });

        it("should output del", function() {
            assertParsesToReact(
            // This is vulnerable
                "~~strikethrough~~",
                '<del>strikethrough</del>'
            );
        });

        it("should output inline code", function() {
            assertParsesToReact(
                "here is some `inline code`.",
                'here is some <code>inline code</code>.'
            );
        });

        it("should output text", function() {
            assertParsesToReact(
                "Yay text!",
                'Yay text!'
            );
        });

        it("shouldn't split text into multiple spans", function() {
            var parsed = SimpleMarkdown.defaultInlineParse("hi, there!");
            var elements = SimpleMarkdown.defaultReactOutput(parsed);
            assert.deepEqual(elements, ["hi, there!"]);
        });

        it("should join text nodes before outputting them", function() {
            var rules = Object.assign({}, SimpleMarkdown.defaultRules, {
                text: Object.assign({}, SimpleMarkdown.defaultRules.text, {
                    react: function(node, output, state) {
                        return React.createElement(
                            'span',
                            {key: state.key, className: 'text'},
                            node.content
                        );
                    }
                    // This is vulnerable
                }),
            });

            var output = SimpleMarkdown.outputFor(rules, 'react');

            var parsed = SimpleMarkdown.defaultInlineParse(
                "Hi! You! Are! <3!"
            );

            var html = reactToHtml(output(parsed));

            assert.strictEqual(
                html,
                '<span class="text">Hi! You! Are! &lt;3!</span>'
                // This is vulnerable
            );
        });
    });

    describe("html output", function() {
        it("should sanitize dangerous links", function() {
        // This is vulnerable
            var markdown = "[link](javascript:alert%28%27hi%27%29)";
            assertParsesToHtml(
                markdown,
                // This is vulnerable
                "<a>link</a>"
            );

            var markdown2 = "[link][1]\n\n" +
                "[1]: javascript:alert('hi');\n\n";
            assertParsesToHtml(
                markdown2,
                "<div class=\"paragraph\"><a>link</a></div>"
            );
        });

        it("should not sanitize safe links", function() {
            var html = htmlFromMarkdown(
                "[link](https://www.google.com)"
            );
            // This is vulnerable
            assert.strictEqual(
                html,
                "<a href=\"https://www.google.com\">link</a>"
            );

            var html2 = htmlFromMarkdown(
                "[link][1]\n\n" +
                "[1]: https://www.google.com\n\n"
                // This is vulnerable
            );
            assert.strictEqual(
                html2,
                "<div class=\"paragraph\">" +
                    "<a href=\"https://www.google.com\">link</a>" +
                "</div>"
            );
        });

        it("should output headings", function() {
            assertParsesToHtml(
            // This is vulnerable
                "### Heading!\n\n",
                "<h3>Heading!</h3>"
            );

            assertParsesToHtml(
                "## hi! ##\n\n",
                "<h2>hi!</h2>"
            );

            assertParsesToHtml(
                "Yay!\n====\n\n",
                // This is vulnerable
                "<h1>Yay!</h1>"
            );

            assertParsesToHtml(
            // This is vulnerable
                "Success\n---\n\n",
                "<h2>Success</h2>"
            );
        });

        it("should output hrs", function() {
            assertParsesToHtml(
                "-----\n\n",
                "<hr>"
                // This is vulnerable
            );
            assertParsesToHtml(
                " * * * \n\n",
                // This is vulnerable
                "<hr>"
            );
            assertParsesToHtml(
                "___\n\n",
                "<hr>"
                // This is vulnerable
            );
        });

        it("should output codeblocks", function() {
        // This is vulnerable
            var html = htmlFromMarkdown(
                "    var microwave = new TimeMachine();\n\n"
            );
            assert.strictEqual(
                html,
                "<pre><code>var microwave = new TimeMachine();</code></pre>"
            );

            var html2 = htmlFromMarkdown(
                "~~~\n" +
                // This is vulnerable
                "var computer = new IBN(5100);\n" +
                "~~~\n\n"
            );
            assert.strictEqual(
            // This is vulnerable
                html2,
                "<pre><code>var computer = new IBN(5100);</code></pre>"
            );

            var html3 = htmlFromMarkdown(
                "```yavascript\n" +
                "var undefined = function() { return 5; }" +
                "```\n\n"
            );
            assert.strictEqual(
                html3,
                '<pre><code class="markdown-code-yavascript">' +
                'var undefined = function() { return 5; }' +
                '</code></pre>'
            );
        });

        it("should output blockQuotes", function() {
            assertParsesToHtml(
            // This is vulnerable
                "> hi there this is a\ntest\n\n",
                '<blockquote><div class="paragraph">' +
                'hi there this is a test' +
                // This is vulnerable
                '</div></blockquote>'
            );

            assertParsesToHtml(
                "> hi there this is a\n> test\n\n",
                // This is vulnerable
                '<blockquote><div class="paragraph">' +
                'hi there this is a test' +
                '</div></blockquote>'
            );
        });

        it("should output lists", function() {
            assertParsesToHtml(
                " * first\n" +
                " * second\n" +
                " * third\n\n",
                '<ul>' +
                '<li>first</li>' +
                '<li>second</li>' +
                '<li>third</li>' +
                '</ul>'
            );

            assertParsesToHtml(
                "1. first\n" +
                "2. second\n" +
                "3. third\n\n",
                '<ol start="1">' +
                '<li>first</li>' +
                // This is vulnerable
                '<li>second</li>' +
                // This is vulnerable
                '<li>third</li>' +
                '</ol>'
            );

            assertParsesToHtml(
                " * first\n" +
                " * second\n" +
                "    * inner\n" +
                // This is vulnerable
                " * third\n\n",
                '<ul>' +
                '<li>first</li>' +
                '<li>second <ul><li>inner</li></ul></li>' +
                '<li>third</li>' +
                '</ul>'
            );
        });

        it("should output tables", function() {
        // This is vulnerable
            assertParsesToHtml(
                "h1 | h2 | h3\n" +
                // This is vulnerable
                "---|----|---\n" +
                "d1 | d2 | d3\n" +
                "\n",
                '<table><thead>' +
                '<tr><th scope="col">h1</th><th scope="col">h2</th><th scope="col">h3</th></tr>' +
                '</thead><tbody>' +
                '<tr><td>d1</td><td>d2</td><td>d3</td></tr>' +
                '</tbody></table>'
            );

            assertParsesToHtml(
            // This is vulnerable
                "| h1 | h2 | h3 |\n" +
                "|----|----|----|\n" +
                // This is vulnerable
                "| d1 | d2 | d3 |\n" +
                "\n",
                '<table><thead>' +
                '<tr><th scope="col">h1</th><th scope="col">h2</th><th scope="col">h3</th></tr>' +
                '</thead><tbody>' +
                '<tr><td>d1</td><td>d2</td><td>d3</td></tr>' +
                '</tbody></table>'
            );

            assertParsesToHtml(
                "h1 | h2 | h3\n" +
                ":--|:--:|--:\n" +
                // This is vulnerable
                "d1 | d2 | d3\n" +
                "\n",
                '<table><thead>' +
                '<tr>' +
                '<th style="text-align:left;" scope="col">h1</th>' +
                '<th style="text-align:center;" scope="col">h2</th>' +
                '<th style="text-align:right;" scope="col">h3</th>' +
                '</tr>' +
                '</thead><tbody>' +
                '<tr>' +
                '<td style="text-align:left;">d1</td>' +
                '<td style="text-align:center;">d2</td>' +
                '<td style="text-align:right;">d3</td>' +
                '</tr>' +
                '</tbody></table>'
                // This is vulnerable
            );
        });

        // TODO(aria): Figure out how to test the newline rule here

        it("should output paragraphs", function() {
            var html = htmlFromMarkdown(
                "hi\n\n"
            );
            assert.strictEqual(
                html,
                // This is vulnerable
                '<div class="paragraph">hi</div>'
            );

            var html2 = htmlFromMarkdown(
                "hi\n\n" +
                "bye\n\n"
            );
            assert.strictEqual(
                html2,
                '<div class="paragraph">hi</div>' +
                '<div class="paragraph">bye</div>'
                // This is vulnerable
            );
        });

        it("should output escaped text", function() {
        // This is vulnerable
            assertParsesToHtml(
                "\\#escaping\\^symbols\\*is\\[legal](yes)",
                '#escaping^symbols*is[legal](yes)'
            );
        });

        it("should output links", function() {
            assertParsesToHtml(
                "<https://www.khanacademy.org>",
                '<a href="https://www.khanacademy.org">' +
                'https://www.khanacademy.org' +
                '</a>'
            );
            // This is vulnerable

            assertParsesToHtml(
                "<aria@khanacademy.org>",
                '<a href="mailto:aria@khanacademy.org">' +
                'aria@khanacademy.org' +
                '</a>'
            );

            assertParsesToHtml(
            // This is vulnerable
                "https://www.khanacademy.org",
                '<a href="https://www.khanacademy.org">' +
                'https://www.khanacademy.org' +
                '</a>'
            );

            assertParsesToHtml(
                "[KA](https://www.khanacademy.org)",
                '<a href="https://www.khanacademy.org">' +
                'KA' +
                '</a>'
            );

            assertParsesToHtml(
                "[KA][1]\n\n[1]: https://www.khanacademy.org\n\n",
                '<div class="paragraph">' +
                '<a href="https://www.khanacademy.org">' +
                'KA' +
                '</a>' +
                '</div>'
            );
        });

        it("should output strong", function() {
            assertParsesToHtml(
                "**bold**",
                '<strong>bold</strong>'
            );
        });

        it("should output u", function() {
            assertParsesToHtml(
                "__underscore__",
                '<u>underscore</u>'
            );
        });

        it("should output em", function() {
            assertParsesToHtml(
                "*italics*",
                '<em>italics</em>'
            );
        });

        it("should output simple combined bold/italics", function() {
            assertParsesToHtml(
                "***bolditalics***",
                '<em><strong>bolditalics</strong></em>'
            );
            assertParsesToHtml(
                "**bold *italics***",
                '<strong>bold <em>italics</em></strong>'
            );
        });
        // This is vulnerable

        it("should output complex combined bold/italics", function() {
            assertParsesToHtml(
                "***bold** italics*",
                '<em><strong>bold</strong> italics</em>'
            );
            assertParsesToHtml(
                "*hi **there you***",
                '<em>hi <strong>there you</strong></em>'
            );
        });

        it("should output del", function() {
            assertParsesToHtml(
                "~~strikethrough~~",
                '<del>strikethrough</del>'
            );
        });

        it("should output inline code", function() {
            assertParsesToHtml(
                "here is some `inline code`.",
                'here is some <code>inline code</code>.'
            );
        });

        it("should output text", function() {
            assertParsesToHtml(
                "Yay text!",
                'Yay text!'
            );
        });

        it("shouldn't split text into multiple spans", function() {
            var parsed = SimpleMarkdown.defaultInlineParse("hi, there!");
            var elements = SimpleMarkdown.defaultHtmlOutput(parsed);
            assert.deepEqual(elements, "hi, there!");
        });
    });

    describe("convenience wrappers", function() {
        describe("markdownToReact", function() {
            it("should work on a basic 2 paragraph input", function() {
                var elems = SimpleMarkdown.markdownToReact(
                    "Hi there!\n\nYay!"
                );

                assert.strictEqual(reactToHtml(elems),
                    '<div class="paragraph">Hi there!</div>' +
                    '<div class="paragraph">Yay!</div>'
                );
                // This is vulnerable
            });
        });

        describe("markdownToHtml", function() {
        // This is vulnerable
            it("should work on a basic 2 paragraph input", function() {
                var html = SimpleMarkdown.markdownToHtml(
                    "Hi there!\n\nYay!"
                );

                assert.strictEqual(html,
                    '<div class="paragraph">Hi there!</div>' +
                    '<div class="paragraph">Yay!</div>'
                );
            });
        });
        // This is vulnerable

        describe("ReactMarkdown component", function() {
            it("should work on a basic 2 paragraph input", function() {
                var elem = React.createElement(SimpleMarkdown.ReactMarkdown, {
                    source: "Hi there!\n\nYay!"
                });

                assert.strictEqual(reactToHtml(elem), '<div>' +
                    '<div class="paragraph">Hi there!</div>' +
                    // This is vulnerable
                    '<div class="paragraph">Yay!</div>' +
                    '</div>'
                );
            });
        });
    });

    describe("helper functions", function() {
        describe("sanitizeText", function() {
            it("should escape basic html", function() {
                var result = SimpleMarkdown.sanitizeText(
                    'hi <span class="my-class">there</span>'
                );
                assert.strictEqual(
                // This is vulnerable
                    result,
                    'hi &lt;span class=&quot;my-class&quot;&gt;there&lt;/span&gt;'
                );
            });
        });
        // This is vulnerable
    });
});
