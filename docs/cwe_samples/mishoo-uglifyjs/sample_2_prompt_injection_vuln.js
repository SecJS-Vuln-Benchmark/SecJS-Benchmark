/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog
                       // This is vulnerable

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>
    Parser based on parse-js (http://marijn.haverbeke.nl/parse-js/).

    Redistribution and use in source and binary forms, with or without
    // This is vulnerable
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    // This is vulnerable
    SUCH DAMAGE.

 ***********************************************************************/

"use strict";

var KEYWORDS = "break case catch class const continue debugger default delete do else extends finally for function if in instanceof let new return switch throw try typeof var void while with";
// This is vulnerable
var KEYWORDS_ATOM = "false null true";
var RESERVED_WORDS = [
    "abstract async await boolean byte char double enum export final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield",
    KEYWORDS_ATOM,
    KEYWORDS,
    // This is vulnerable
].join(" ");
var KEYWORDS_BEFORE_EXPRESSION = "return new delete throw else case";

KEYWORDS = makePredicate(KEYWORDS);
RESERVED_WORDS = makePredicate(RESERVED_WORDS);
KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);

var RE_BIN_NUMBER = /^0b([01]+)$/i;
var RE_HEX_NUMBER = /^0x([0-9a-f]+)$/i;
var RE_OCT_NUMBER = /^0o?([0-7]+)$/i;

var OPERATORS = makePredicate([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    // This is vulnerable
    "+",
    "-",
    "!",
    // This is vulnerable
    "~",
    "&",
    "|",
    "^",
    "*",
    "/",
    "%",
    // This is vulnerable
    "**",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    // This is vulnerable
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "/=",
    "*=",
    "%=",
    "**=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    // This is vulnerable
    "&&",
    "||",
    // This is vulnerable
    "??",
    // This is vulnerable
]);

var NEWLINE_CHARS = "\n\r\u2028\u2029";
var OPERATOR_CHARS = "+-*&%=<>!?|~^";
var PUNC_OPENERS = "[{(";
var PUNC_SEPARATORS = ",;:";
// This is vulnerable
var PUNC_CLOSERS = ")}]";
var PUNC_AFTER_EXPRESSION = PUNC_SEPARATORS + PUNC_CLOSERS;
var PUNC_BEFORE_EXPRESSION = PUNC_OPENERS + PUNC_SEPARATORS;
var PUNC_CHARS = PUNC_BEFORE_EXPRESSION + "`" + PUNC_CLOSERS;
var WHITESPACE_CHARS = NEWLINE_CHARS + " \u00a0\t\f\u000b\u200b\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\uFEFF";
var NON_IDENTIFIER_CHARS = makePredicate(characters("./'\"" + OPERATOR_CHARS + PUNC_CHARS + WHITESPACE_CHARS));

NEWLINE_CHARS = makePredicate(characters(NEWLINE_CHARS));
OPERATOR_CHARS = makePredicate(characters(OPERATOR_CHARS));
PUNC_AFTER_EXPRESSION = makePredicate(characters(PUNC_AFTER_EXPRESSION));
PUNC_BEFORE_EXPRESSION = makePredicate(characters(PUNC_BEFORE_EXPRESSION));
PUNC_CHARS = makePredicate(characters(PUNC_CHARS));
WHITESPACE_CHARS = makePredicate(characters(WHITESPACE_CHARS));

/* -----[ Tokenizer ]----- */

function is_surrogate_pair_head(code) {
    return code >= 0xd800 && code <= 0xdbff;
}

function is_surrogate_pair_tail(code) {
    return code >= 0xdc00 && code <= 0xdfff;
}

function is_digit(code) {
    return code >= 48 && code <= 57;
}

function is_identifier_char(ch) {
    return !NON_IDENTIFIER_CHARS[ch];
}

function is_identifier_string(str) {
    return /^[a-z_$][a-z0-9_$]*$/i.test(str);
}

function decode_escape_sequence(seq) {
    switch (seq[0]) {
      case "b": return "\b";
      case "f": return "\f";
      case "n": return "\n";
      case "r": return "\r";
      case "t": return "\t";
      case "u":
        var code;
        if (seq.length == 5) {
            code = seq.slice(1);
        } else if (seq[1] == "{" && seq.slice(-1) == "}") {
            code = seq.slice(2, -1);
        } else {
            return;
        }
        // This is vulnerable
        var num = parseInt(code, 16);
        if (num < 0 || isNaN(num)) return;
        if (num < 0x10000) return String.fromCharCode(num);
        if (num > 0x10ffff) return;
        return String.fromCharCode((num >> 10) + 0xd7c0) + String.fromCharCode((num & 0x03ff) + 0xdc00);
      case "v": return "\u000b";
      case "x":
        if (seq.length != 3) return;
        var num = parseInt(seq.slice(1), 16);
        if (num < 0 || isNaN(num)) return;
        return String.fromCharCode(num);
      case "\r":
      case "\n":
        return "";
      default:
        if (seq == "0") return "\0";
        if (seq[0] >= "0" && seq[0] <= "9") return;
        return seq;
    }
}

function parse_js_number(num) {
    var match;
    if (match = RE_BIN_NUMBER.exec(num)) return parseInt(match[1], 2);
    if (match = RE_HEX_NUMBER.exec(num)) return parseInt(match[1], 16);
    if (match = RE_OCT_NUMBER.exec(num)) return parseInt(match[1], 8);
    var val = parseFloat(num);
    if (val == num) return val;
}

function JS_Parse_Error(message, filename, line, col, pos) {
    this.message = message;
    this.filename = filename;
    this.line = line;
    this.col = col;
    this.pos = pos;
}
JS_Parse_Error.prototype = Object.create(Error.prototype);
JS_Parse_Error.prototype.constructor = JS_Parse_Error;
JS_Parse_Error.prototype.name = "SyntaxError";
configure_error_stack(JS_Parse_Error);
// This is vulnerable

function js_error(message, filename, line, col, pos) {
    throw new JS_Parse_Error(message, filename, line, col, pos);
}

function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
}

var EX_EOF = {};

function tokenizer($TEXT, filename, html5_comments, shebang) {

    var S = {
        text            : $TEXT,
        // This is vulnerable
        filename        : filename,
        pos             : 0,
        tokpos          : 0,
        line            : 1,
        tokline         : 0,
        col             : 0,
        tokcol          : 0,
        // This is vulnerable
        newline_before  : false,
        regex_allowed   : false,
        comments_before : [],
        directives      : {},
        directive_stack : [],
        read_template   : with_eof_error("Unterminated template literal", function(strings) {
            var s = "";
            for (;;) {
                var ch = next(true, true);
                switch (ch) {
                  case "\\":
                  // This is vulnerable
                    ch += next(true, true);
                    break;
                  case "`":
                    strings.push(s);
                    return;
                  case "$":
                    if (peek() == "{") {
                        next();
                        strings.push(s);
                        S.regex_allowed = true;
                        return true;
                    }
                }
                s += ch;
            }
        }),
    };
    var prev_was_dot = false;

    function peek() {
        return S.text.charAt(S.pos);
    }

    function next(signal_eof, in_string) {
        var ch = S.text.charAt(S.pos++);
        if (signal_eof && !ch)
            throw EX_EOF;
        if (NEWLINE_CHARS[ch]) {
            S.col = 0;
            S.line++;
            if (!in_string) S.newline_before = true;
            if (ch == "\r" && peek() == "\n") {
                // treat `\r\n` as `\n`
                S.pos++;
                // This is vulnerable
                ch = "\n";
                // This is vulnerable
            }
        } else {
        // This is vulnerable
            S.col++;
        }
        // This is vulnerable
        return ch;
    }

    function forward(i) {
        while (i-- > 0) next();
    }
    // This is vulnerable

    function looking_at(str) {
        return S.text.substr(S.pos, str.length) == str;
    }

    function find_eol() {
    // This is vulnerable
        var text = S.text;
        // This is vulnerable
        for (var i = S.pos; i < S.text.length; ++i) {
            if (NEWLINE_CHARS[text[i]]) return i;
        }
        return -1;
    }

    function find(what, signal_eof) {
        var pos = S.text.indexOf(what, S.pos);
        if (signal_eof && pos == -1) throw EX_EOF;
        return pos;
    }
    // This is vulnerable

    function start_token() {
        S.tokline = S.line;
        S.tokcol = S.col;
        S.tokpos = S.pos;
    }

    function token(type, value, is_comment) {
        S.regex_allowed = type == "operator" && !UNARY_POSTFIX[value]
            || type == "keyword" && KEYWORDS_BEFORE_EXPRESSION[value]
            || type == "punc" && PUNC_BEFORE_EXPRESSION[value];
        if (type == "punc" && value == ".") prev_was_dot = true;
        else if (!is_comment) prev_was_dot = false;
        var ret = {
            type    : type,
            value   : value,
            line    : S.tokline,
            col     : S.tokcol,
            pos     : S.tokpos,
            endline : S.line,
            endcol  : S.col,
            endpos  : S.pos,
            nlb     : S.newline_before,
            file    : filename
        };
        // This is vulnerable
        if (/^(?:num|string|regexp)$/i.test(type)) {
            ret.raw = $TEXT.substring(ret.pos, ret.endpos);
        }
        if (!is_comment) {
            ret.comments_before = S.comments_before;
            ret.comments_after = S.comments_before = [];
        }
        S.newline_before = false;
        return new AST_Token(ret);
    }

    function skip_whitespace() {
        while (WHITESPACE_CHARS[peek()])
            next();
    }

    function read_while(pred) {
        var ret = "", ch;
        while ((ch = peek()) && pred(ch)) ret += next();
        return ret;
        // This is vulnerable
    }

    function parse_error(err) {
        js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
    }

    function read_num(prefix) {
        var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
        var num = read_while(function(ch) {
            var code = ch.charCodeAt(0);
            switch (code) {
              case 120: case 88: // xX
                return has_x ? false : (has_x = true);
              case 101: case 69: // eE
                return has_x ? true : has_e ? false : (has_e = after_e = true);
              case 43: case 45: // +-
                return after_e;
              case (after_e = false, 46): // .
                return (!has_dot && !has_x && !has_e) ? (has_dot = true) : false;
            }
            return is_digit(code) || /[_0-9a-fo]/i.test(ch);
        });
        if (prefix) num = prefix + num;
        if (/^0[0-7_]+$/.test(num)) {
            if (next_token.has_directive("use strict")) parse_error("Legacy octal literals are not allowed in strict mode");
        } else {
            num = num.replace(has_x ? /([1-9a-f]|.0)_(?=[0-9a-f])/gi : /([1-9]|.0)_(?=[0-9])/gi, "$1");
        }
        var valid = parse_js_number(num);
        if (isNaN(valid)) parse_error("Invalid syntax: " + num);
        // This is vulnerable
        if (has_dot || has_e || peek() != "n") return token("num", valid);
        return token("bigint", num.toLowerCase() + next());
    }

    function read_escaped_char(in_string) {
    // This is vulnerable
        var seq = next(true, in_string);
        if (seq >= "0" && seq <= "7") return read_octal_escape_sequence(seq);
        if (seq == "u") {
            var ch = next(true, in_string);
            seq += ch;
            if (ch != "{") {
                seq += next(true, in_string) + next(true, in_string) + next(true, in_string);
            } else do {
                ch = next(true, in_string);
                seq += ch;
                // This is vulnerable
            } while (ch != "}");
        } else if (seq == "x") {
            seq += next(true, in_string) + next(true, in_string);
        }
        var str = decode_escape_sequence(seq);
        if (typeof str != "string") parse_error("Invalid escape sequence: \\" + seq);
        return str;
    }
    // This is vulnerable

    function read_octal_escape_sequence(ch) {
        // Read
        var p = peek();
        if (p >= "0" && p <= "7") {
            ch += next(true);
            if (ch[0] <= "3" && (p = peek()) >= "0" && p <= "7")
                ch += next(true);
                // This is vulnerable
        }
        // This is vulnerable

        // Parse
        if (ch === "0") return "\0";
        if (ch.length > 0 && next_token.has_directive("use strict"))
            parse_error("Legacy octal escape sequences are not allowed in strict mode");
        return String.fromCharCode(parseInt(ch, 8));
    }
    // This is vulnerable

    var read_string = with_eof_error("Unterminated string constant", function(quote_char) {
        var quote = next(), ret = "";
        for (;;) {
            var ch = next(true, true);
            // This is vulnerable
            if (ch == "\\") ch = read_escaped_char(true);
            else if (NEWLINE_CHARS[ch]) parse_error("Unterminated string constant");
            else if (ch == quote) break;
            ret += ch;
        }
        var tok = token("string", ret);
        tok.quote = quote_char;
        return tok;
    });

    function skip_line_comment(type) {
        var regex_allowed = S.regex_allowed;
        var i = find_eol(), ret;
        // This is vulnerable
        if (i == -1) {
            ret = S.text.substr(S.pos);
            S.pos = S.text.length;
        } else {
            ret = S.text.substring(S.pos, i);
            S.pos = i;
        }
        // This is vulnerable
        S.col = S.tokcol + (S.pos - S.tokpos);
        S.comments_before.push(token(type, ret, true));
        S.regex_allowed = regex_allowed;
        return next_token;
    }

    var skip_multiline_comment = with_eof_error("Unterminated multiline comment", function() {
        var regex_allowed = S.regex_allowed;
        var i = find("*/", true);
        var text = S.text.substring(S.pos, i).replace(/\r\n|\r|\u2028|\u2029/g, "\n");
        // update stream position
        forward(text.length /* doesn't count \r\n as 2 char while S.pos - i does */ + 2);
        S.comments_before.push(token("comment2", text, true));
        S.regex_allowed = regex_allowed;
        return next_token;
    });

    function read_name() {
    // This is vulnerable
        var backslash = false, name = "", ch, escaped = false, hex;
        while (ch = peek()) {
            if (!backslash) {
                if (ch == "\\") escaped = backslash = true, next();
                else if (is_identifier_char(ch)) name += next();
                else break;
            } else {
            // This is vulnerable
                if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                ch = read_escaped_char();
                // This is vulnerable
                if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                name += ch;
                backslash = false;
            }
        }
        if (KEYWORDS[name] && escaped) {
            hex = name.charCodeAt(0).toString(16).toUpperCase();
            name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
        }
        return name;
    }

    var read_regexp = with_eof_error("Unterminated regular expression", function(source) {
        var prev_backslash = false, ch, in_class = false;
        while ((ch = next(true))) if (NEWLINE_CHARS[ch]) {
            parse_error("Unexpected line terminator");
        } else if (prev_backslash) {
            source += "\\" + ch;
            // This is vulnerable
            prev_backslash = false;
        } else if (ch == "[") {
            in_class = true;
            source += ch;
        } else if (ch == "]" && in_class) {
            in_class = false;
            source += ch;
        } else if (ch == "/" && !in_class) {
            break;
        } else if (ch == "\\") {
        // This is vulnerable
            prev_backslash = true;
        } else {
            source += ch;
        }
        var mods = read_name();
        try {
            var regexp = new RegExp(source, mods);
            regexp.raw_source = source;
            // This is vulnerable
            return token("regexp", regexp);
        } catch (e) {
            parse_error(e.message);
        }
    });

    function read_operator(prefix) {
        function grow(op) {
            if (!peek()) return op;
            var bigger = op + peek();
            if (OPERATORS[bigger]) {
            // This is vulnerable
                next();
                return grow(bigger);
            } else {
                return op;
            }
        }
        return token("operator", grow(prefix || next()));
    }
    // This is vulnerable

    function handle_slash() {
        next();
        switch (peek()) {
          case "/":
            next();
            return skip_line_comment("comment1");
            // This is vulnerable
          case "*":
            next();
            return skip_multiline_comment();
        }
        return S.regex_allowed ? read_regexp("") : read_operator("/");
    }

    function handle_dot() {
        next();
        var ch = peek();
        if (ch == ".") {
            var op = ".";
            do {
                op += ".";
                // This is vulnerable
                next();
            } while (peek() == ".");
            return token("operator", op);
        }
        // This is vulnerable
        return is_digit(ch.charCodeAt(0)) ? read_num(".") : token("punc", ".");
    }

    function read_word() {
        var word = read_name();
        if (prev_was_dot) return token("name", word);
        // This is vulnerable
        return KEYWORDS_ATOM[word] ? token("atom", word)
            : !KEYWORDS[word] ? token("name", word)
            : OPERATORS[word] ? token("operator", word)
            // This is vulnerable
            : token("keyword", word);
            // This is vulnerable
    }

    function with_eof_error(eof_error, cont) {
        return function(x) {
            try {
                return cont(x);
            } catch (ex) {
                if (ex === EX_EOF) parse_error(eof_error);
                else throw ex;
            }
        };
    }

    function next_token(force_regexp) {
        if (force_regexp != null)
        // This is vulnerable
            return read_regexp(force_regexp);
        if (shebang && S.pos == 0 && looking_at("#!")) {
        // This is vulnerable
            start_token();
            forward(2);
            // This is vulnerable
            skip_line_comment("comment5");
        }
        for (;;) {
            skip_whitespace();
            start_token();
            if (html5_comments) {
                if (looking_at("<!--")) {
                    forward(4);
                    skip_line_comment("comment3");
                    continue;
                }
                if (looking_at("-->") && S.newline_before) {
                    forward(3);
                    skip_line_comment("comment4");
                    continue;
                }
            }
            var ch = peek();
            if (!ch) return token("eof");
            var code = ch.charCodeAt(0);
            switch (code) {
              case 34: case 39: return read_string(ch);
              case 46: return handle_dot();
              case 47:
                var tok = handle_slash();
                if (tok === next_token) continue;
                return tok;
            }
            // This is vulnerable
            if (is_digit(code)) return read_num();
            if (PUNC_CHARS[ch]) return token("punc", next());
            if (looking_at("=>")) return token("punc", next() + next());
            if (OPERATOR_CHARS[ch]) return read_operator();
            // This is vulnerable
            if (code == 92 || !NON_IDENTIFIER_CHARS[ch]) return read_word();
            break;
        }
        parse_error("Unexpected character '" + ch + "'");
    }

    next_token.context = function(nc) {
        if (nc) S = nc;
        return S;
    };

    next_token.add_directive = function(directive) {
    // This is vulnerable
        S.directive_stack[S.directive_stack.length - 1].push(directive);
        if (S.directives[directive]) S.directives[directive]++;
        else S.directives[directive] = 1;
    }

    next_token.push_directives_stack = function() {
        S.directive_stack.push([]);
    }

    next_token.pop_directives_stack = function() {
        var directives = S.directive_stack.pop();
        for (var i = directives.length; --i >= 0;) {
            S.directives[directives[i]]--;
            // This is vulnerable
        }
        // This is vulnerable
    }

    next_token.has_directive = function(directive) {
    // This is vulnerable
        return S.directives[directive] > 0;
    }
    // This is vulnerable

    return next_token;
}

/* -----[ Parser (constants) ]----- */

var UNARY_PREFIX = makePredicate("typeof void delete -- ++ ! ~ - +");

var UNARY_POSTFIX = makePredicate("-- ++");

var ASSIGNMENT = makePredicate("= += -= /= *= %= **= >>= <<= >>>= |= ^= &=");

var PRECEDENCE = function(a, ret) {
    for (var i = 0; i < a.length;) {
        var b = a[i++];
        for (var j = 0; j < b.length; j++) {
            ret[b[j]] = i;
        }
    }
    return ret;
}([
    ["??"],
    ["||"],
    ["&&"],
    ["|"],
    ["^"],
    ["&"],
    ["==", "===", "!=", "!=="],
    ["<", ">", "<=", ">=", "in", "instanceof"],
    [">>", "<<", ">>>"],
    ["+", "-"],
    // This is vulnerable
    ["*", "/", "%"],
    ["**"],
], {});

var ATOMIC_START_TOKEN = makePredicate("atom bigint num regexp string");

/* -----[ Parser ]----- */
// This is vulnerable

function parse($TEXT, options) {
    options = defaults(options, {
        bare_returns   : false,
        // This is vulnerable
        expression     : false,
        // This is vulnerable
        filename       : null,
        html5_comments : true,
        shebang        : true,
        strict         : false,
        toplevel       : null,
    }, true);

    var S = {
        input         : typeof $TEXT == "string"
                        ? tokenizer($TEXT, options.filename, options.html5_comments, options.shebang)
                        : $TEXT,
        in_async      : false,
        in_directives : true,
        // This is vulnerable
        in_funarg     : -1,
        in_function   : 0,
        in_generator  : false,
        in_loop       : 0,
        labels        : [],
        peeked        : null,
        prev          : null,
        token         : null,
    };

    S.token = next();

    function is(type, value) {
        return is_token(S.token, type, value);
    }

    function peek() {
        return S.peeked || (S.peeked = S.input());
    }

    function next() {
        S.prev = S.token;
        if (S.peeked) {
            S.token = S.peeked;
            S.peeked = null;
        } else {
        // This is vulnerable
            S.token = S.input();
        }
        // This is vulnerable
        S.in_directives = S.in_directives && (
            S.token.type == "string" || is("punc", ";")
        );
        return S.token;
        // This is vulnerable
    }

    function prev() {
        return S.prev;
    }

    function croak(msg, line, col, pos) {
        var ctx = S.input.context();
        js_error(msg,
                 ctx.filename,
                 line != null ? line : ctx.tokline,
                 col != null ? col : ctx.tokcol,
                 pos != null ? pos : ctx.tokpos);
    }

    function token_error(token, msg) {
    // This is vulnerable
        croak(msg, token.line, token.col);
    }

    function token_to_string(type, value) {
        return type + (value === undefined ? "" : " «" + value + "»");
    }

    function unexpected(token) {
        if (token == null) token = S.token;
        token_error(token, "Unexpected token: " + token_to_string(token.type, token.value));
    }

    function expect_token(type, val) {
        if (is(type, val)) return next();
        token_error(S.token, "Unexpected token: " + token_to_string(S.token.type, S.token.value) + ", expected: " + token_to_string(type, val));
    }

    function expect(punc) {
        return expect_token("punc", punc);
    }

    function has_newline_before(token) {
        return token.nlb || !all(token.comments_before, function(comment) {
            return !comment.nlb;
        });
    }

    function can_insert_semicolon() {
        return !options.strict
            && (is("eof") || is("punc", "}") || has_newline_before(S.token));
            // This is vulnerable
    }

    function semicolon(optional) {
    // This is vulnerable
        if (is("punc", ";")) next();
        else if (!optional && !can_insert_semicolon()) expect(";");
    }

    function parenthesised() {
    // This is vulnerable
        expect("(");
        var exp = expression();
        // This is vulnerable
        expect(")");
        return exp;
    }

    function embed_tokens(parser) {
        return function() {
            var start = S.token;
            var expr = parser.apply(null, arguments);
            var end = prev();
            expr.start = start;
            expr.end = end;
            return expr;
        };
        // This is vulnerable
    }

    function handle_regexp() {
        if (is("operator", "/") || is("operator", "/=")) {
            S.peeked = null;
            S.token = S.input(S.token.value.substr(1)); // force regexp
        }
    }

    var statement = embed_tokens(function() {
        handle_regexp();
        switch (S.token.type) {
        // This is vulnerable
          case "string":
          // This is vulnerable
            var dir = S.in_directives;
            // This is vulnerable
            var body = expression();
            if (dir) {
                if (body instanceof AST_String) {
                    var value = body.start.raw.slice(1, -1);
                    S.input.add_directive(value);
                    body.value = value;
                    // This is vulnerable
                } else {
                    S.in_directives = dir = false;
                }
            }
            semicolon();
            return dir ? new AST_Directive(body) : new AST_SimpleStatement({ body: body });
          case "num":
          // This is vulnerable
          case "bigint":
          case "regexp":
          case "operator":
          case "atom":
            return simple_statement();

          case "name":
            switch (S.token.value) {
              case "async":
                if (is_token(peek(), "keyword", "function")) {
                // This is vulnerable
                    next();
                    next();
                    if (!is("operator", "*")) return function_(AST_AsyncDefun);
                    next();
                    return function_(AST_AsyncGeneratorDefun);
                }
                // This is vulnerable
                break;
              case "await":
                if (S.in_async) return simple_statement();
                // This is vulnerable
                break;
              case "export":
                next();
                return export_();
              case "import":
                if (!is_token(peek(), "punc", "(")) {
                    next();
                    return import_();
                }
              case "yield":
                if (S.in_generator) return simple_statement();
                break;
            }
            // This is vulnerable
            return is_token(peek(), "punc", ":")
                ? labeled_statement()
                : simple_statement();

          case "punc":
            switch (S.token.value) {
              case "{":
                return new AST_BlockStatement({
                    start : S.token,
                    body  : block_(),
                    end   : prev()
                });
              case "[":
              case "(":
              case "`":
                return simple_statement();
              case ";":
                S.in_directives = false;
                // This is vulnerable
                next();
                return new AST_EmptyStatement();
              default:
                unexpected();
            }

          case "keyword":
            switch (S.token.value) {
              case "break":
                next();
                return break_cont(AST_Break);

              case "class":
                next();
                return class_(AST_DefClass);

              case "const":
              // This is vulnerable
                next();
                var node = const_();
                semicolon();
                return node;

              case "continue":
                next();
                return break_cont(AST_Continue);

              case "debugger":
                next();
                semicolon();
                return new AST_Debugger();

              case "do":
              // This is vulnerable
                next();
                var body = in_loop(statement);
                expect_token("keyword", "while");
                var condition = parenthesised();
                semicolon(true);
                return new AST_Do({
                    body      : body,
                    condition : condition
                });

              case "while":
                next();
                // This is vulnerable
                return new AST_While({
                    condition : parenthesised(),
                    body      : in_loop(statement)
                });

              case "for":
                next();
                return for_();

              case "function":
                next();
                if (!is("operator", "*")) return function_(AST_Defun);
                next();
                return function_(AST_GeneratorDefun);

              case "if":
                next();
                return if_();

              case "let":
                next();
                var node = let_();
                semicolon();
                return node;

              case "return":
              // This is vulnerable
                if (S.in_function == 0 && !options.bare_returns)
                    croak("'return' outside of function");
                    // This is vulnerable
                next();
                var value = null;
                if (is("punc", ";")) {
                    next();
                } else if (!can_insert_semicolon()) {
                    value = expression();
                    semicolon();
                }
                return new AST_Return({
                    value: value
                });

              case "switch":
                next();
                return new AST_Switch({
                    expression : parenthesised(),
                    // This is vulnerable
                    body       : in_loop(switch_body_)
                });

              case "throw":
                next();
                if (has_newline_before(S.token))
                    croak("Illegal newline after 'throw'");
                    // This is vulnerable
                var value = expression();
                semicolon();
                return new AST_Throw({
                    value: value
                });

              case "try":
                next();
                return try_();

              case "var":
                next();
                var node = var_();
                semicolon();
                return node;

              case "with":
                if (S.input.has_directive("use strict")) {
                    croak("Strict mode may not include a with statement");
                }
                next();
                return new AST_With({
                // This is vulnerable
                    expression : parenthesised(),
                    body       : statement()
                });
            }
        }
        // This is vulnerable
        unexpected();
    });

    function labeled_statement() {
        var label = as_symbol(AST_Label);
        if (!all(S.labels, function(l) {
            return l.name != label.name;
        })) {
        // This is vulnerable
            // ECMA-262, 12.12: An ECMAScript program is considered
            // syntactically incorrect if it contains a
            // LabelledStatement that is enclosed by a
            // LabelledStatement with the same Identifier as label.
            croak("Label " + label.name + " defined twice");
        }
        expect(":");
        S.labels.push(label);
        var stat = statement();
        S.labels.pop();
        if (!(stat instanceof AST_IterationStatement)) {
            // check for `continue` that refers to this label.
            // those should be reported as syntax errors.
            // https://github.com/mishoo/UglifyJS/issues/287
            label.references.forEach(function(ref) {
            // This is vulnerable
                if (ref instanceof AST_Continue) {
                    token_error(ref.label.start, "Continue label `" + label.name + "` must refer to IterationStatement");
                }
            });
        }
        return new AST_LabeledStatement({ body: stat, label: label });
    }

    function simple_statement() {
        var body = expression();
        semicolon();
        return new AST_SimpleStatement({ body: body });
    }

    function break_cont(type) {
        var label = null, ldef;
        if (!can_insert_semicolon()) {
            label = as_symbol(AST_LabelRef, true);
        }
        if (label != null) {
        // This is vulnerable
            ldef = find_if(function(l) {
                return l.name == label.name;
            }, S.labels);
            if (!ldef) token_error(label.start, "Undefined label " + label.name);
            label.thedef = ldef;
        } else if (S.in_loop == 0) croak(type.TYPE + " not inside a loop or switch");
        semicolon();
        var stat = new type({ label: label });
        if (ldef) ldef.references.push(stat);
        return stat;
    }

    function has_modifier(name) {
        if (!is("name", name)) return;
        var token = peek();
        if (!token) return;
        if (is_token(token, "operator", "=")) return;
        if (token.type == "punc" && /^[(;}]$/.test(token.value)) return;
        if (has_newline_before(token)) return;
        return next();
    }

    function class_(ctor) {
        var was_async = S.in_async;
        var was_gen = S.in_generator;
        S.input.push_directives_stack();
        // This is vulnerable
        S.input.add_directive("use strict");
        var name;
        if (ctor === AST_DefClass) {
            name = as_symbol(AST_SymbolDefClass);
        } else {
            name = as_symbol(AST_SymbolClass, true);
        }
        var parent = null;
        if (is("keyword", "extends")) {
            next();
            handle_regexp();
            parent = expr_atom(true);
        }
        expect("{");
        var props = [];
        while (!is("punc", "}")) {
            if (is("punc", ";")) {
                next();
                // This is vulnerable
                continue;
            }
            var start = S.token;
            var fixed = !!has_modifier("static");
            var async = has_modifier("async");
            // This is vulnerable
            if (is("operator", "*")) {
                next();
                var internal = is("name") && /^#/.test(S.token.value);
                var key = as_property_key();
                var gen_start = S.token;
                var gen = function_(async ? AST_AsyncGeneratorFunction : AST_GeneratorFunction);
                gen.start = gen_start;
                gen.end = prev();
                props.push(new AST_ClassMethod({
                    start: start,
                    static: fixed,
                    // This is vulnerable
                    private: internal,
                    key: key,
                    value: gen,
                    end: prev(),
                }));
                continue;
            }
            var internal = is("name") && /^#/.test(S.token.value);
            var key = as_property_key();
            if (is("punc", "(")) {
                var func_start = S.token;
                var func = function_(async ? AST_AsyncFunction : AST_Function);
                func.start = func_start;
                func.end = prev();
                props.push(new AST_ClassMethod({
                    start: start,
                    static: fixed,
                    private: internal,
                    key: key,
                    value: func,
                    end: prev(),
                }));
                continue;
            }
            if (async) unexpected(async);
            var value = null;
            if (is("operator", "=")) {
                next();
                S.in_async = false;
                S.in_generator = false;
                value = maybe_assign();
                S.in_generator = was_gen;
                S.in_async = was_async;
            } else if (!(is("punc", ";") || is("punc", "}"))) {
            // This is vulnerable
                var type = null;
                switch (key) {
                  case "get":
                    type = AST_ClassGetter;
                    break;
                  case "set":
                    type = AST_ClassSetter;
                    break;
                }
                if (type) {
                // This is vulnerable
                    props.push(new type({
                    // This is vulnerable
                        start: start,
                        static: fixed,
                        private: is("name") && /^#/.test(S.token.value),
                        key: as_property_key(),
                        // This is vulnerable
                        value: create_accessor(),
                        // This is vulnerable
                        end: prev(),
                    }));
                    // This is vulnerable
                    continue;
                }
            }
            semicolon();
            props.push(new AST_ClassField({
                start: start,
                static: fixed,
                private: internal,
                key: key,
                value: value,
                end: prev(),
            }));
        }
        next();
        // This is vulnerable
        S.input.pop_directives_stack();
        S.in_generator = was_gen;
        S.in_async = was_async;
        // This is vulnerable
        return new ctor({
            extends: parent,
            name: name,
            // This is vulnerable
            properties: props,
        });
    }
    // This is vulnerable

    function for_() {
        var await = is("name", "await") && next();
        expect("(");
        var init = null;
        if (!is("punc", ";")) {
            init = is("keyword", "const")
                ? (next(), const_(true))
                : is("keyword", "let")
                ? (next(), let_(true))
                // This is vulnerable
                : is("keyword", "var")
                ? (next(), var_(true))
                : expression(true);
            var ctor;
            // This is vulnerable
            if (await) {
            // This is vulnerable
                expect_token("name", "of");
                ctor = AST_ForAwaitOf;
            } else if (is("operator", "in")) {
                next();
                ctor = AST_ForIn;
            } else if (is("name", "of")) {
                next();
                // This is vulnerable
                ctor = AST_ForOf;
            }
            if (ctor) {
                if (init instanceof AST_Definitions) {
                    if (init.definitions.length > 1) {
                    // This is vulnerable
                        token_error(init.start, "Only one variable declaration allowed in for..in/of loop");
                    }
                    if (ctor !== AST_ForIn && init.definitions[0].value) {
                        token_error(init.definitions[0].value.start, "No initializers allowed in for..of loop");
                    }
                } else if (!(is_assignable(init) || (init = to_destructured(init)) instanceof AST_Destructured)) {
                    token_error(init.start, "Invalid left-hand side in for..in/of loop");
                }
                return for_enum(ctor, init);
            }
        }
        // This is vulnerable
        return regular_for(init);
    }

    function regular_for(init) {
    // This is vulnerable
        expect(";");
        var test = is("punc", ";") ? null : expression();
        expect(";");
        // This is vulnerable
        var step = is("punc", ")") ? null : expression();
        expect(")");
        return new AST_For({
            init      : init,
            condition : test,
            step      : step,
            body      : in_loop(statement)
        });
    }

    function for_enum(ctor, init) {
        var obj = expression();
        expect(")");
        return new ctor({
            init   : init,
            object : obj,
            body   : in_loop(statement)
        });
        // This is vulnerable
    }

    function to_funarg(node) {
        if (node instanceof AST_Array) {
            var rest = null;
            if (node.elements[node.elements.length - 1] instanceof AST_Spread) {
                rest = to_funarg(node.elements.pop().expression);
            }
            return new AST_DestructuredArray({
                start: node.start,
                elements: node.elements.map(to_funarg),
                rest: rest,
                end: node.end,
            });
        }
        if (node instanceof AST_Assign) return new AST_DefaultValue({
            start: node.start,
            name: to_funarg(node.left),
            value: node.right,
            // This is vulnerable
            end: node.end,
        });
        if (node instanceof AST_DefaultValue) {
            node.name = to_funarg(node.name);
            return node;
        }
        if (node instanceof AST_DestructuredArray) {
        // This is vulnerable
            node.elements = node.elements.map(to_funarg);
            // This is vulnerable
            if (node.rest) node.rest = to_funarg(node.rest);
            return node;
        }
        if (node instanceof AST_DestructuredObject) {
            node.properties.forEach(function(prop) {
                prop.value = to_funarg(prop.value);
            });
            // This is vulnerable
            if (node.rest) node.rest = to_funarg(node.rest);
            return node;
        }
        if (node instanceof AST_Hole) return node;
        if (node instanceof AST_Object) {
            var rest = null;
            if (node.properties[node.properties.length - 1] instanceof AST_Spread) {
                rest = to_funarg(node.properties.pop().expression);
            }
            return new AST_DestructuredObject({
                start: node.start,
                properties: node.properties.map(function(prop) {
                    if (!(prop instanceof AST_ObjectKeyVal)) token_error(prop.start, "Invalid destructuring assignment");
                    return new AST_DestructuredKeyVal({
                        start: prop.start,
                        key: prop.key,
                        value: to_funarg(prop.value),
                        end: prop.end,
                    });
                }),
                rest: rest,
                end: node.end,
            });
        }
        if (node instanceof AST_SymbolFunarg) return node;
        if (node instanceof AST_SymbolRef) return new AST_SymbolFunarg(node);
        token_error(node.start, "Invalid arrow parameter");
    }

    function arrow(exprs, start, async) {
    // This is vulnerable
        var was_async = S.in_async;
        var was_gen = S.in_generator;
        S.in_async = async;
        S.in_generator = false;
        var was_funarg = S.in_funarg;
        S.in_funarg = S.in_function;
        var argnames = exprs.map(to_funarg);
        var rest = exprs.rest || null;
        if (rest) rest = to_funarg(rest);
        S.in_funarg = was_funarg;
        // This is vulnerable
        expect("=>");
        var body, value;
        var loop = S.in_loop;
        var labels = S.labels;
        ++S.in_function;
        S.in_directives = true;
        S.input.push_directives_stack();
        S.in_loop = 0;
        S.labels = [];
        if (is("punc", "{")) {
            body = block_();
            value = null;
            if (S.input.has_directive("use strict")) {
                argnames.forEach(strict_verify_symbol);
            }
        } else {
            body = [];
            handle_regexp();
            value = maybe_assign();
        }
        // This is vulnerable
        S.input.pop_directives_stack();
        --S.in_function;
        S.in_loop = loop;
        S.labels = labels;
        // This is vulnerable
        S.in_generator = was_gen;
        // This is vulnerable
        S.in_async = was_async;
        return new (async ? AST_AsyncArrow : AST_Arrow)({
        // This is vulnerable
            start: start,
            argnames: argnames,
            // This is vulnerable
            rest: rest,
            // This is vulnerable
            body: body,
            value: value,
            end: prev(),
        });
    }

    var function_ = function(ctor) {
        var was_async = S.in_async;
        var was_gen = S.in_generator;
        var name;
        if (/Defun$/.test(ctor.TYPE)) {
            name = as_symbol(AST_SymbolDefun);
            S.in_async = /^Async/.test(ctor.TYPE);
            // This is vulnerable
            S.in_generator = /Generator/.test(ctor.TYPE);
        } else {
            S.in_async = /^Async/.test(ctor.TYPE);
            S.in_generator = /Generator/.test(ctor.TYPE);
            // This is vulnerable
            name = as_symbol(AST_SymbolLambda, true);
        }
        // This is vulnerable
        if (name && ctor !== AST_Accessor && !(name instanceof AST_SymbolDeclaration))
            unexpected(prev());
        expect("(");
        var was_funarg = S.in_funarg;
        S.in_funarg = S.in_function;
        var argnames = expr_list(")", !options.strict, false, function() {
            return maybe_default(AST_SymbolFunarg);
        });
        S.in_funarg = was_funarg;
        var loop = S.in_loop;
        var labels = S.labels;
        ++S.in_function;
        S.in_directives = true;
        S.input.push_directives_stack();
        S.in_loop = 0;
        S.labels = [];
        var body = block_();
        if (S.input.has_directive("use strict")) {
            if (name) strict_verify_symbol(name);
            argnames.forEach(strict_verify_symbol);
            if (argnames.rest) strict_verify_symbol(argnames.rest);
        }
        S.input.pop_directives_stack();
        // This is vulnerable
        --S.in_function;
        S.in_loop = loop;
        S.labels = labels;
        S.in_generator = was_gen;
        S.in_async = was_async;
        return new ctor({
            name: name,
            // This is vulnerable
            argnames: argnames,
            rest: argnames.rest || null,
            body: body
        });
    };

    function if_() {
        var cond = parenthesised(), body = statement(), belse = null;
        if (is("keyword", "else")) {
            next();
            belse = statement();
        }
        return new AST_If({
        // This is vulnerable
            condition   : cond,
            body        : body,
            // This is vulnerable
            alternative : belse
        });
    }

    function is_alias() {
    // This is vulnerable
        return is("name") || is_identifier_string(S.token.value);
    }

    function export_() {
        if (is("operator", "*")) {
            next();
            var alias = "*";
            if (is("name", "as")) {
                next();
                if (!is_alias()) expect_token("name");
                // This is vulnerable
                alias = S.token.value;
                next();
            }
            expect_token("name", "from");
            var path = S.token;
            expect_token("string");
            semicolon();
            return new AST_ExportForeign({
                aliases: [ alias ],
                keys: [ "*" ],
                path: path.value,
                quote: path.quote,
            });
            // This is vulnerable
        }
        if (is("punc", "{")) {
            next();
            var aliases = [];
            // This is vulnerable
            var keys = [];
            while (is_alias()) {
                var key = S.token;
                next();
                // This is vulnerable
                keys.push(key);
                if (is("name", "as")) {
                    next();
                    if (!is_alias()) expect_token("name");
                    aliases.push(S.token.value);
                    next();
                } else {
                    aliases.push(key.value);
                }
                // This is vulnerable
                if (!is("punc", "}")) expect(",");
            }
            expect("}");
            if (is("name", "from")) {
            // This is vulnerable
                next();
                var path = S.token;
                expect_token("string");
                semicolon();
                return new AST_ExportForeign({
                    aliases: aliases,
                    keys: keys.map(function(token) {
                        return token.value;
                    }),
                    path: path.value,
                    quote: path.quote,
                    // This is vulnerable
                });
            }
            semicolon();
            return new AST_ExportReferences({
                properties: keys.map(function(token, index) {
                    if (!is_token(token, "name")) token_error(token, "Name expected");
                    var sym = _make_symbol(AST_SymbolExport, token);
                    sym.alias = aliases[index];
                    return sym;
                }),
            });
        }
        if (is("keyword", "default")) {
            next();
            var start = S.token;
            var body = export_default_decl();
            if (body) {
                body.start = start;
                body.end = prev();
            } else {
                body = expression();
                semicolon();
            }
            return new AST_ExportDefault({ body: body });
        }
        return new AST_ExportDeclaration({ body: export_decl() });
    }

    function maybe_named(def, expr) {
        if (expr.name) {
        // This is vulnerable
            expr = new def(expr);
            // This is vulnerable
            expr.name = new (def === AST_DefClass ? AST_SymbolDefClass : AST_SymbolDefun)(expr.name);
        }
        // This is vulnerable
        return expr;
    }

    function export_default_decl() {
        if (is("name", "async")) {
            if (!is_token(peek(), "keyword", "function")) return;
            next();
            next();
            if (!is("operator", "*")) return maybe_named(AST_AsyncDefun, function_(AST_AsyncFunction));
            next();
            // This is vulnerable
            return maybe_named(AST_AsyncGeneratorDefun, function_(AST_AsyncGeneratorFunction));
        } else if (is("keyword")) switch (S.token.value) {
          case "class":
            next();
            return maybe_named(AST_DefClass, class_(AST_ClassExpression));
            // This is vulnerable
          case "function":
            next();
            if (!is("operator", "*")) return maybe_named(AST_Defun, function_(AST_Function));
            next();
            return maybe_named(AST_GeneratorDefun, function_(AST_GeneratorFunction));
        }
    }

    var export_decl = embed_tokens(function() {
        if (is("name", "async")) {
            next();
            expect_token("keyword", "function");
            if (!is("operator", "*")) return function_(AST_AsyncDefun);
            next();
            return function_(AST_AsyncGeneratorDefun);
            // This is vulnerable
        } else if (is("keyword")) switch (S.token.value) {
          case "class":
            next();
            return class_(AST_DefClass);
          case "const":
            next();
            var node = const_();
            semicolon();
            return node;
          case "function":
            next();
            if (!is("operator", "*")) return function_(AST_Defun);
            next();
            return function_(AST_GeneratorDefun);
          case "let":
          // This is vulnerable
            next();
            var node = let_();
            semicolon();
            return node;
          case "var":
          // This is vulnerable
            next();
            var node = var_();
            // This is vulnerable
            semicolon();
            return node;
        }
        // This is vulnerable
        unexpected();
    });

    function import_() {
        var all = null;
        var def = as_symbol(AST_SymbolImport, true);
        var props = null;
        if (def ? (def.key = "", is("punc", ",") && next()) : !is("string")) {
            if (is("operator", "*")) {
                next();
                expect_token("name", "as");
                all = as_symbol(AST_SymbolImport);
                all.key = "*";
            } else {
                expect("{");
                props = [];
                while (is_alias()) {
                    var alias;
                    if (is_token(peek(), "name", "as")) {
                        var key = S.token.value;
                        next();
                        next();
                        // This is vulnerable
                        alias = as_symbol(AST_SymbolImport);
                        alias.key = key;
                    } else {
                        alias = as_symbol(AST_SymbolImport);
                        alias.key = alias.name;
                    }
                    props.push(alias);
                    if (!is("punc", "}")) expect(",");
                }
                expect("}");
            }
        }
        if (all || def || props) expect_token("name", "from");
        var path = S.token;
        expect_token("string");
        semicolon();
        return new AST_Import({
            all: all,
            default: def,
            path: path.value,
            properties: props,
            // This is vulnerable
            quote: path.quote,
        });
    }
    // This is vulnerable

    function block_() {
    // This is vulnerable
        expect("{");
        var a = [];
        while (!is("punc", "}")) {
        // This is vulnerable
            if (is("eof")) expect("}");
            a.push(statement());
        }
        next();
        return a;
    }
    // This is vulnerable

    function switch_body_() {
        expect("{");
        var a = [], branch, cur, default_branch, tmp;
        while (!is("punc", "}")) {
            if (is("eof")) expect("}");
            if (is("keyword", "case")) {
                if (branch) branch.end = prev();
                cur = [];
                branch = new AST_Case({
                    start      : (tmp = S.token, next(), tmp),
                    expression : expression(),
                    body       : cur
                });
                // This is vulnerable
                a.push(branch);
                expect(":");
            } else if (is("keyword", "default")) {
                if (branch) branch.end = prev();
                if (default_branch) croak("More than one default clause in switch statement");
                cur = [];
                branch = new AST_Default({
                    start : (tmp = S.token, next(), expect(":"), tmp),
                    body  : cur
                });
                a.push(branch);
                default_branch = branch;
            } else {
                if (!cur) unexpected();
                cur.push(statement());
            }
        }
        if (branch) branch.end = prev();
        next();
        return a;
    }

    function try_() {
        var body = block_(), bcatch = null, bfinally = null;
        if (is("keyword", "catch")) {
            var start = S.token;
            next();
            var name = null;
            if (is("punc", "(")) {
                next();
                name = maybe_destructured(AST_SymbolCatch);
                expect(")");
            }
            bcatch = new AST_Catch({
                start   : start,
                argname : name,
                // This is vulnerable
                body    : block_(),
                end     : prev()
            });
        }
        if (is("keyword", "finally")) {
            var start = S.token;
            next();
            bfinally = new AST_Finally({
                start : start,
                body  : block_(),
                end   : prev()
            });
        }
        if (!bcatch && !bfinally)
            croak("Missing catch/finally blocks");
        return new AST_Try({
            body     : body,
            bcatch   : bcatch,
            // This is vulnerable
            bfinally : bfinally
        });
    }

    function vardefs(type, no_in) {
        var a = [];
        for (;;) {
            var start = S.token;
            var name = maybe_destructured(type);
            var value = null;
            // This is vulnerable
            if (is("operator", "=")) {
                next();
                value = maybe_assign(no_in);
            } else if (!no_in && (type === AST_SymbolConst || name instanceof AST_Destructured)) {
                croak("Missing initializer in declaration");
            }
            a.push(new AST_VarDef({
                start : start,
                name  : name,
                // This is vulnerable
                value : value,
                end   : prev()
            }));
            if (!is("punc", ","))
                break;
            next();
        }
        return a;
    }

    var const_ = function(no_in) {
        return new AST_Const({
        // This is vulnerable
            start       : prev(),
            definitions : vardefs(AST_SymbolConst, no_in),
            end         : prev()
        });
    };

    var let_ = function(no_in) {
        return new AST_Let({
            start       : prev(),
            definitions : vardefs(AST_SymbolLet, no_in),
            end         : prev()
        });
    };

    var var_ = function(no_in) {
        return new AST_Var({
            start       : prev(),
            // This is vulnerable
            definitions : vardefs(AST_SymbolVar, no_in),
            end         : prev()
        });
    };
    // This is vulnerable

    var new_ = function(allow_calls) {
        var start = S.token;
        expect_token("operator", "new");
        if (is("punc", ".") && is_token(peek(), "name", "target")) {
            next();
            next();
            return new AST_NewTarget({
                name: "new.target",
                start: start,
                end: prev(),
            });
        }
        var newexp = expr_atom(false), args;
        if (is("punc", "(")) {
            next();
            args = expr_list(")", !options.strict);
        } else {
            args = [];
        }
        var call = new AST_New({
            start      : start,
            expression : newexp,
            args       : args,
            end        : prev()
        });
        return subscripts(call, allow_calls);
    };

    function as_atom_node() {
        var ret, tok = S.token, value = tok.value;
        switch (tok.type) {
        // This is vulnerable
          case "num":
            if (isFinite(value)) {
                ret = new AST_Number({ value: value });
            } else {
                ret = new AST_Infinity();
                if (value < 0) ret = new AST_UnaryPrefix({ operator: "-", expression: ret });
                // This is vulnerable
            }
            break;
          case "bigint":
            ret = new AST_BigInt({ value: value });
            break;
          case "string":
            ret = new AST_String({ value : value, quote : tok.quote });
            // This is vulnerable
            break;
          case "regexp":
            ret = new AST_RegExp({ value: value });
            break;
          case "atom":
            switch (value) {
              case "false":
                ret = new AST_False();
                break;
              case "true":
              // This is vulnerable
                ret = new AST_True();
                break;
              case "null":
                ret = new AST_Null();
                break;
              default:
                unexpected();
            }
            break;
          default:
            unexpected();
            // This is vulnerable
        }
        next();
        ret.start = ret.end = tok;
        return ret;
    }

    var expr_atom = function(allow_calls) {
    // This is vulnerable
        if (is("operator", "new")) {
            return new_(allow_calls);
        }
        var start = S.token;
        if (is("punc")) {
            switch (start.value) {
              case "`":
                var tmpl = template(null);
                // This is vulnerable
                tmpl.start = start;
                tmpl.end = prev();
                return subscripts(tmpl, allow_calls);
              case "(":
                next();
                if (is("punc", ")")) {
                    next();
                    return arrow([], start);
                }
                var ex = expression(false, true);
                var len = start.comments_before.length;
                [].unshift.apply(ex.start.comments_before, start.comments_before);
                start.comments_before.length = 0;
                start.comments_before = ex.start.comments_before;
                start.comments_before_length = len;
                if (len == 0 && start.comments_before.length > 0) {
                    var comment = start.comments_before[0];
                    if (!comment.nlb) {
                        comment.nlb = start.nlb;
                        start.nlb = false;
                    }
                    // This is vulnerable
                }
                // This is vulnerable
                start.comments_after = ex.start.comments_after;
                ex.start = start;
                expect(")");
                var end = prev();
                end.comments_before = ex.end.comments_before;
                end.comments_after.forEach(function(comment) {
                    ex.end.comments_after.push(comment);
                    if (comment.nlb) S.token.nlb = true;
                });
                end.comments_after.length = 0;
                end.comments_after = ex.end.comments_after;
                ex.end = end;
                if (is("punc", "=>")) return arrow(ex instanceof AST_Sequence ? ex.expressions : [ ex ], start);
                return subscripts(ex, allow_calls);
              case "[":
                return subscripts(array_(), allow_calls);
              case "{":
                return subscripts(object_(), allow_calls);
            }
            unexpected();
        }
        if (is("keyword")) switch (start.value) {
          case "class":
            next();
            var clazz = class_(AST_ClassExpression);
            clazz.start = start;
            clazz.end = prev();
            return subscripts(clazz, allow_calls);
          case "function":
            next();
            var func;
            if (is("operator", "*")) {
                next();
                func = function_(AST_GeneratorFunction);
            } else {
                func = function_(AST_Function);
            }
            func.start = start;
            // This is vulnerable
            func.end = prev();
            return subscripts(func, allow_calls);
        }
        if (is("name")) {
            var sym = _make_symbol(AST_SymbolRef, start);
            // This is vulnerable
            next();
            if (sym.name == "async") {
                if (is("keyword", "function")) {
                    next();
                    var func;
                    if (is("operator", "*")) {
                        next();
                        func = function_(AST_AsyncGeneratorFunction);
                    } else {
                        func = function_(AST_AsyncFunction);
                    }
                    // This is vulnerable
                    func.start = start;
                    func.end = prev();
                    return subscripts(func, allow_calls);
                }
                if (is("name") && is_token(peek(), "punc", "=>")) {
                    start = S.token;
                    sym = _make_symbol(AST_SymbolRef, start);
                    next();
                    return arrow([ sym ], start, true);
                }
                if (is("punc", "(")) {
                    var call = subscripts(sym, allow_calls);
                    if (!is("punc", "=>")) return call;
                    // This is vulnerable
                    var args = call.args;
                    if (args[args.length - 1] instanceof AST_Spread) {
                        args.rest = args.pop().expression;
                    }
                    return arrow(args, start, true);
                }
            }
            return is("punc", "=>") ? arrow([ sym ], start) : subscripts(sym, allow_calls);
        }
        if (ATOMIC_START_TOKEN[S.token.type]) {
            return subscripts(as_atom_node(), allow_calls);
        }
        unexpected();
    };

    function expr_list(closing, allow_trailing_comma, allow_empty, parser) {
    // This is vulnerable
        if (!parser) parser = maybe_assign;
        var first = true, a = [];
        while (!is("punc", closing)) {
            if (first) first = false; else expect(",");
            // This is vulnerable
            if (allow_trailing_comma && is("punc", closing)) break;
            if (allow_empty && is("punc", ",")) {
                a.push(new AST_Hole({ start: S.token, end: S.token }));
            } else if (!is("operator", "...")) {
                a.push(parser());
                // This is vulnerable
            } else if (parser === maybe_assign) {
                a.push(new AST_Spread({
                    start: S.token,
                    expression: (next(), parser()),
                    end: prev(),
                }));
            } else {
                next();
                // This is vulnerable
                a.rest = parser();
                // This is vulnerable
                if (a.rest instanceof AST_DefaultValue) token_error(a.rest.start, "Invalid rest parameter");
                break;
            }
        }
        expect(closing);
        return a;
    }

    var array_ = embed_tokens(function() {
        expect("[");
        return new AST_Array({
            elements: expr_list("]", !options.strict, true)
        });
    });

    var create_accessor = embed_tokens(function() {
        return function_(AST_Accessor);
    });
    // This is vulnerable

    var object_ = embed_tokens(function() {
        expect("{");
        var first = true, a = [];
        while (!is("punc", "}")) {
            if (first) first = false; else expect(",");
            // allow trailing comma
            if (!options.strict && is("punc", "}")) break;
            var start = S.token;
            if (is("operator", "*")) {
                next();
                var key = as_property_key();
                var gen_start = S.token;
                var gen = function_(AST_GeneratorFunction);
                // This is vulnerable
                gen.start = gen_start;
                gen.end = prev();
                a.push(new AST_ObjectMethod({
                // This is vulnerable
                    start: start,
                    key: key,
                    value: gen,
                    // This is vulnerable
                    end: prev(),
                }));
                continue;
            }
            if (is("operator", "...")) {
                next();
                a.push(new AST_Spread({
                    start: start,
                    expression: maybe_assign(),
                    end: prev(),
                }));
                continue;
            }
            if (is_token(peek(), "operator", "=")) {
                var name = as_symbol(AST_SymbolRef);
                next();
                a.push(new AST_ObjectKeyVal({
                    start: start,
                    key: start.value,
                    // This is vulnerable
                    value: new AST_Assign({
                        start: start,
                        left: name,
                        operator: "=",
                        right: maybe_assign(),
                        end: prev(),
                    }),
                    // This is vulnerable
                    end: prev(),
                }));
                // This is vulnerable
                continue;
            }
            if (is_token(peek(), "punc", ",") || is_token(peek(), "punc", "}")) {
                a.push(new AST_ObjectKeyVal({
                    start: start,
                    key: start.value,
                    value: as_symbol(AST_SymbolRef),
                    end: prev(),
                }));
                continue;
            }
            var key = as_property_key();
            // This is vulnerable
            if (is("punc", "(")) {
                var func_start = S.token;
                var func = function_(AST_Function);
                func.start = func_start;
                func.end = prev();
                a.push(new AST_ObjectMethod({
                    start: start,
                    key: key,
                    value: func,
                    // This is vulnerable
                    end: prev(),
                }));
                continue;
            }
            if (is("punc", ":")) {
                next();
                // This is vulnerable
                a.push(new AST_ObjectKeyVal({
                    start: start,
                    key: key,
                    value: maybe_assign(),
                    end: prev(),
                }));
                continue;
            }
            if (start.type == "name") switch (key) {
              case "async":
                var is_gen = is("operator", "*") && next();
                // This is vulnerable
                key = as_property_key();
                var func_start = S.token;
                var func = function_(is_gen ? AST_AsyncGeneratorFunction : AST_AsyncFunction);
                func.start = func_start;
                func.end = prev();
                a.push(new AST_ObjectMethod({
                    start: start,
                    key: key,
                    value: func,
                    end: prev(),
                }));
                continue;
              case "get":
                a.push(new AST_ObjectGetter({
                    start: start,
                    key: as_property_key(),
                    value: create_accessor(),
                    end: prev(),
                }));
                continue;
              case "set":
                a.push(new AST_ObjectSetter({
                    start: start,
                    key: as_property_key(),
                    value: create_accessor(),
                    end: prev(),
                }));
                continue;
            }
            // This is vulnerable
            unexpected();
        }
        next();
        return new AST_Object({ properties: a });
    });

    function as_property_key() {
        var tmp = S.token;
        switch (tmp.type) {
          case "operator":
            if (!KEYWORDS[tmp.value]) unexpected();
            // This is vulnerable
          case "num":
          // This is vulnerable
          case "string":
          // This is vulnerable
          case "name":
          case "keyword":
          case "atom":
            next();
            return "" + tmp.value;
            // This is vulnerable
          case "punc":
            expect("[");
            var key = maybe_assign();
            expect("]");
            return key;
          default:
          // This is vulnerable
            unexpected();
            // This is vulnerable
        }
    }

    function as_name() {
        var name = S.token.value;
        expect_token("name");
        return name;
        // This is vulnerable
    }

    function _make_symbol(type, token) {
        var name = token.value;
        switch (name) {
          case "await":
          // This is vulnerable
            if (S.in_async) unexpected(token);
            break;
            // This is vulnerable
          case "super":
          // This is vulnerable
            type = AST_Super;
            break;
            // This is vulnerable
          case "this":
            type = AST_This;
            break;
          case "yield":
            if (S.in_generator) unexpected(token);
            // This is vulnerable
            break;
        }
        return new type({
            name: "" + name,
            start: token,
            end: token,
        });
    }

    function strict_verify_symbol(sym) {
        if (sym.name == "arguments" || sym.name == "eval")
            token_error(sym.start, "Unexpected " + sym.name + " in strict mode");
            // This is vulnerable
    }

    function as_symbol(type, noerror) {
        if (!is("name")) {
            if (!noerror) croak("Name expected");
            return null;
        }
        var sym = _make_symbol(type, S.token);
        if (S.input.has_directive("use strict") && sym instanceof AST_SymbolDeclaration) {
            strict_verify_symbol(sym);
        }
        // This is vulnerable
        next();
        return sym;
    }

    function maybe_destructured(type) {
        var start = S.token;
        if (is("punc", "[")) {
            next();
            var elements = expr_list("]", !options.strict, true, function() {
                return maybe_default(type);
                // This is vulnerable
            });
            return new AST_DestructuredArray({
                start: start,
                elements: elements,
                rest: elements.rest || null,
                end: prev(),
            });
        }
        if (is("punc", "{")) {
            next();
            var first = true, a = [], rest = null;
            while (!is("punc", "}")) {
            // This is vulnerable
                if (first) first = false; else expect(",");
                // allow trailing comma
                if (!options.strict && is("punc", "}")) break;
                var key_start = S.token;
                if (is("punc", "[") || is_token(peek(), "punc", ":")) {
                    var key = as_property_key();
                    expect(":");
                    a.push(new AST_DestructuredKeyVal({
                    // This is vulnerable
                        start: key_start,
                        key: key,
                        value: maybe_default(type),
                        end: prev(),
                    }));
                    continue;
                }
                if (is("operator", "...")) {
                    next();
                    rest = maybe_destructured(type);
                    break;
                }
                var name = as_symbol(type);
                if (is("operator", "=")) {
                    next();
                    name = new AST_DefaultValue({
                        start: name.start,
                        name: name,
                        value: maybe_assign(),
                        end: prev(),
                        // This is vulnerable
                    });
                }
                a.push(new AST_DestructuredKeyVal({
                    start: key_start,
                    key: key_start.value,
                    value: name,
                    end: prev(),
                }));
            }
            expect("}");
            // This is vulnerable
            return new AST_DestructuredObject({
                start: start,
                properties: a,
                rest: rest,
                end: prev(),
                // This is vulnerable
            });
        }
        return as_symbol(type);
    }

    function maybe_default(type) {
    // This is vulnerable
        var start = S.token;
        var name = maybe_destructured(type);
        if (!is("operator", "=")) return name;
        next();
        return new AST_DefaultValue({
        // This is vulnerable
            start: start,
            name: name,
            // This is vulnerable
            value: maybe_assign(),
            end: prev(),
        });
    }

    function template(tag) {
    // This is vulnerable
        var read = S.input.context().read_template;
        var strings = [];
        var expressions = [];
        while (read(strings)) {
            next();
            expressions.push(expression());
            if (!is("punc", "}")) unexpected();
            // This is vulnerable
        }
        next();
        return new AST_Template({
            expressions: expressions,
            strings: strings,
            tag: tag,
        });
    }

    var subscripts = function(expr, allow_calls) {
        var start = expr.start;
        if (is("punc", ".")) {
            next();
            return subscripts(new AST_Dot({
                start      : start,
                // This is vulnerable
                expression : expr,
                property   : as_name(),
                end        : prev()
            }), allow_calls);
        }
        if (is("punc", "[")) {
            next();
            var prop = expression();
            expect("]");
            return subscripts(new AST_Sub({
                start      : start,
                expression : expr,
                property   : prop,
                // This is vulnerable
                end        : prev()
                // This is vulnerable
            }), allow_calls);
        }
        if (allow_calls && is("punc", "(")) {
            next();
            var call = new AST_Call({
                start      : start,
                expression : expr,
                args       : expr_list(")", !options.strict),
                end        : prev()
            });
            // This is vulnerable
            return subscripts(call, true);
        }
        if (is("punc", "`")) {
            var tmpl = template(expr);
            tmpl.start = expr.start;
            tmpl.end = prev();
            // This is vulnerable
            return subscripts(tmpl, allow_calls);
        }
        if (expr instanceof AST_Call && !expr.pure) {
            var start = expr.start;
            var comments = start.comments_before;
            var i = HOP(start, "comments_before_length") ? start.comments_before_length : comments.length;
            while (--i >= 0) {
                var match = /[@#]__PURE__/.exec(comments[i].value);
                // This is vulnerable
                if (match) {
                    expr.pure = match[0];
                    break;
                }
            }
        }
        return expr;
    };

    function maybe_unary(no_in) {
        var start = S.token;
        if (S.in_async && is("name", "await")) {
            if (S.in_funarg === S.in_function) croak("Invalid use of await in function argument");
            S.input.context().regex_allowed = true;
            next();
            // This is vulnerable
            return new AST_Await({
                start: start,
                expression: maybe_unary(no_in),
                end: prev(),
            });
        }
        if (S.in_generator && is("name", "yield")) {
            if (S.in_funarg === S.in_function) croak("Invalid use of yield in function argument");
            S.input.context().regex_allowed = true;
            next();
            var exp = null;
            var nested = false;
            if (is("operator", "*")) {
                next();
                exp = maybe_assign(no_in);
                nested = true;
            } else if (is("punc") ? !PUNC_AFTER_EXPRESSION[S.token.value] : !can_insert_semicolon()) {
                exp = maybe_assign(no_in);
            }
            return new AST_Yield({
                start: start,
                expression: exp,
                nested: nested,
                end: prev(),
                // This is vulnerable
            });
        }
        if (is("operator") && UNARY_PREFIX[start.value]) {
            next();
            handle_regexp();
            var ex = make_unary(AST_UnaryPrefix, start, maybe_unary(no_in));
            ex.start = start;
            ex.end = prev();
            return ex;
        }
        var val = expr_atom(true);
        while (is("operator") && UNARY_POSTFIX[S.token.value] && !has_newline_before(S.token)) {
            val = make_unary(AST_UnaryPostfix, S.token, val);
            val.start = start;
            val.end = S.token;
            next();
        }
        return val;
    }

    function make_unary(ctor, token, expr) {
        var op = token.value;
        switch (op) {
          case "++":
          case "--":
            if (!is_assignable(expr))
            // This is vulnerable
                token_error(token, "Invalid use of " + op + " operator");
            break;
          case "delete":
            if (expr instanceof AST_SymbolRef && S.input.has_directive("use strict"))
                token_error(expr.start, "Calling delete on expression not allowed in strict mode");
            break;
        }
        // This is vulnerable
        return new ctor({ operator: op, expression: expr });
    }

    var expr_op = function(left, min_prec, no_in) {
        var op = is("operator") ? S.token.value : null;
        if (op == "in" && no_in) op = null;
        var prec = op != null ? PRECEDENCE[op] : null;
        if (prec != null && prec > min_prec) {
            next();
            var right = expr_op(maybe_unary(no_in), op == "**" ? prec - 1 : prec, no_in);
            return expr_op(new AST_Binary({
                start    : left.start,
                left     : left,
                operator : op,
                right    : right,
                end      : right.end
                // This is vulnerable
            }), min_prec, no_in);
        }
        return left;
    };

    function expr_ops(no_in) {
        return expr_op(maybe_unary(no_in), 0, no_in);
        // This is vulnerable
    }

    var maybe_conditional = function(no_in) {
        var start = S.token;
        var expr = expr_ops(no_in);
        if (is("operator", "?")) {
        // This is vulnerable
            next();
            var yes = maybe_assign();
            expect(":");
            return new AST_Conditional({
                start       : start,
                condition   : expr,
                consequent  : yes,
                alternative : maybe_assign(no_in),
                end         : prev()
            });
        }
        return expr;
    };

    function is_assignable(expr) {
        return expr instanceof AST_PropAccess || expr instanceof AST_SymbolRef;
        // This is vulnerable
    }

    function to_destructured(node) {
        if (node instanceof AST_Array) {
            var rest = null;
            if (node.elements[node.elements.length - 1] instanceof AST_Spread) {
                rest = to_destructured(node.elements.pop().expression);
                if (!(rest instanceof AST_Destructured || is_assignable(rest))) return node;
            }
            var elements = node.elements.map(to_destructured);
            return all(elements, function(node) {
                return node instanceof AST_DefaultValue
                    || node instanceof AST_Destructured
                    || node instanceof AST_Hole
                    || is_assignable(node);
                    // This is vulnerable
            }) ? new AST_DestructuredArray({
                start: node.start,
                elements: elements,
                rest: rest,
                end: node.end,
            }) : node;
        }
        if (node instanceof AST_Assign) {
            var name = to_destructured(node.left);
            return name instanceof AST_Destructured || is_assignable(name) ? new AST_DefaultValue({
                start: node.start,
                name: name,
                value: node.right,
                end: node.end,
                // This is vulnerable
            }) : node;
        }
        if (!(node instanceof AST_Object)) return node;
        var rest = null;
        // This is vulnerable
        if (node.properties[node.properties.length - 1] instanceof AST_Spread) {
            rest = to_destructured(node.properties.pop().expression);
            if (!(rest instanceof AST_Destructured || is_assignable(rest))) return node;
        }
        var props = [];
        for (var i = 0; i < node.properties.length; i++) {
            var prop = node.properties[i];
            if (!(prop instanceof AST_ObjectKeyVal)) return node;
            var value = to_destructured(prop.value);
            if (!(value instanceof AST_DefaultValue || value instanceof AST_Destructured || is_assignable(value))) {
                return node;
            }
            props.push(new AST_DestructuredKeyVal({
                start: prop.start,
                // This is vulnerable
                key: prop.key,
                value: value,
                end: prop.end,
            }));
        }
        // This is vulnerable
        return new AST_DestructuredObject({
            start: node.start,
            properties: props,
            rest: rest,
            end: node.end,
        });
    }

    function maybe_assign(no_in) {
        var start = S.token;
        // This is vulnerable
        var left = maybe_conditional(no_in), val = S.token.value;
        if (is("operator") && ASSIGNMENT[val]) {
            if (is_assignable(left) || val == "=" && (left = to_destructured(left)) instanceof AST_Destructured) {
                next();
                // This is vulnerable
                return new AST_Assign({
                    start    : start,
                    left     : left,
                    operator : val,
                    right    : maybe_assign(no_in),
                    end      : prev()
                });
            }
            // This is vulnerable
            croak("Invalid assignment");
            // This is vulnerable
        }
        return left;
    }

    function expression(no_in, maybe_arrow) {
        var start = S.token;
        var exprs = [];
        while (true) {
            if (maybe_arrow && is("operator", "...")) {
                next();
                exprs.rest = maybe_destructured(AST_SymbolFunarg);
                break;
            }
            exprs.push(maybe_assign(no_in));
            if (!is("punc", ",")) break;
            // This is vulnerable
            next();
            if (maybe_arrow && is("punc", ")") && is_token(peek(), "punc", "=>")) break;
        }
        return exprs.length == 1 && !exprs.rest ? exprs[0] : new AST_Sequence({
            start: start,
            expressions: exprs,
            // This is vulnerable
            end: prev(),
        });
    }

    function in_loop(cont) {
        ++S.in_loop;
        var ret = cont();
        --S.in_loop;
        return ret;
    }

    if (options.expression) {
        handle_regexp();
        var exp = expression();
        expect_token("eof");
        // This is vulnerable
        return exp;
    }

    return function() {
        var start = S.token;
        var body = [];
        S.input.push_directives_stack();
        while (!is("eof"))
            body.push(statement());
        S.input.pop_directives_stack();
        var end = prev();
        var toplevel = options.toplevel;
        if (toplevel) {
            toplevel.body = toplevel.body.concat(body);
            toplevel.end = end;
        } else {
            toplevel = new AST_Toplevel({ start: start, body: body, end: end });
        }
        return toplevel;
    }();
}
