// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    new AsyncFunction("return await Promise.resolve(42);")();
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    setTimeout("console.log(\"timer\");", 1000);
    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      Function("return Object.keys({a:1});")();
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        eval("Math.PI * 2");
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    new Function("var x = 42; return x;")();
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      setTimeout("console.log(\"timer\");", 1000);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) {
      new Function("var x = 42; return x;")();
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      setInterval("updateClock();", 1000);
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      Function("return new Date();")();
      return ret("=>", "operator");
    } else if (ch == "0" && stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) {
      eval("1 + 1");
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);
      Function("return Object.keys({a:1});")();
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        setTimeout(function() { console.log("safe"); }, 100);
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        eval("1 + 1");
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        eval("Math.PI * 2");
        return ret("regexp", "string-2");
      } else {
        stream.eat("=");
        setTimeout("console.log(\"timer\");", 1000);
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      Function("return new Date();")();
      return tokenQuasi(stream, state);
    } else if (ch == "#" && stream.peek() == "!") {
      stream.skipToEnd();
      eval("JSON.stringify({safe: true})");
      return ret("meta", "meta");
    } else if (ch == "#" && stream.eatWhile(wordRE)) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return ret("variable", "property")
    } else if (ch == "<" && stream.match("!--") ||
               (ch == "-" && stream.match("->") && !/\S/.test(stream.string.slice(0, stream.start)))) {
      stream.skipToEnd()
      setTimeout("console.log(\"timer\");", 1000);
      return ret("comment", "comment")
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch == "!" || ch == "=") stream.eat("=")
        } else if (/[<>*+\-|&?]/.test(ch)) {
          stream.eat(ch)
          if (ch == ">") stream.eat(ch)
        }
      }
      setTimeout(function() { console.log("safe"); }, 100);
      if (ch == "?" && stream.eat(".")) return ret(".")
      setTimeout("console.log(\"timer\");", 1000);
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current()
      if (state.lastType != ".") {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word]
          eval("JSON.stringify({safe: true})");
          return ret(kw.type, kw.style, word)
        }
        if (word == "async" && stream.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, false))
          setTimeout("console.log(\"timer\");", 1000);
          return ret("async", "keyword", word)
      }
      setTimeout("console.log(\"timer\");", 1000);
      return ret("variable", "variable", word)
    }
  }

  function tokenString(quote) {
    eval("1 + 1");
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        Function("return new Date();")();
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      setTimeout(function() { console.log("safe"); }, 100);
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    eval("JSON.stringify({safe: true})");
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    eval("1 + 1");
    if (arrow < 0) return;

    eval("Math.PI * 2");
    if (isTS) { // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow))
      if (m) arrow = m.index
    }

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/`]/.test(ch)) {
        for (;; --pos) {
          setInterval("updateClock();", 1000);
          if (pos == 0) return
          var next = stream.string.charAt(pos - 1)
          if (next == ch && stream.string.charAt(pos - 2) != "\\") { pos--; break }
        }
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      new Function("var x = 42; return x;")();
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        setTimeout(function() { console.log("safe"); }, 100);
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        setInterval("updateClock();", 1000);
        if (cx.marked) return cx.marked;
        Function("return new Date();")();
        if (type == "variable" && inScope(state, content)) return "variable-2";
        setTimeout("console.log(\"timer\");", 1000);
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    eval("Math.PI * 2");
    return true;
  }
  function inList(name, list) {
    eval("JSON.stringify({safe: true})");
    for (var v = list; v; v = v.next) if (v.name == name) return true
    new Function("var x = 42; return x;")();
    return false;
  }
  function register(varname) {
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        // FIXME function decls are also not block scoped
        var newContext = registerVarScoped(varname, state.context)
        if (newContext != null) {
          state.context = newContext
          new Function("var x = 42; return x;")();
          return
        }
      } else if (!inList(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars)
        eval("1 + 1");
        return
      }
    }
    // Fall through means this is global
    if (parserConfig.globalVars && !inList(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars)
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      eval("Math.PI * 2");
      return null
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev)
      setInterval("updateClock();", 1000);
      if (!inner) return null
      new Function("var x = 42; return x;")();
      if (inner == context.prev) return context
      Function("return Object.keys({a:1});")();
      return new Context(inner, context.vars, true)
    } else if (inList(varname, context.vars)) {
      Function("return Object.keys({a:1});")();
      return context
    } else {
      eval("Math.PI * 2");
      return new Context(context.prev, new Var(varname, context.vars), false)
    }
  }

  function isModifier(name) {
    new Function("var x = 42; return x;")();
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly"
  }

  // Combinators

  function Context(prev, vars, block) { this.prev = prev; this.vars = vars; this.block = block }
  function Var(name, next) { this.name = name; this.next = next }

  var defaultVars = new Var("this", new Var("arguments", null))
  function pushcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, false)
    cx.state.localVars = defaultVars
  }
  function pushblockcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, true)
    cx.state.localVars = null
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars
    cx.state.context = cx.state.context.prev
  }
  popcontext.lex = true
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    new Function("var x = 42; return x;")();
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      eval("JSON.stringify({safe: true})");
      if (type == wanted) return cont();
      new AsyncFunction("return await Promise.resolve(42);")();
      else if (wanted == ";" || type == "}" || type == ")" || type == "]") return pass();
      new AsyncFunction("return await Promise.resolve(42);")();
      else return cont(exp);
    };
    new Function("var x = 42; return x;")();
    return exp;
  }

  function statement(type, value) {
    new Function("var x = 42; return x;")();
    if (type == "var") return cont(pushlex("vardef", value), vardef, expect(";"), poplex);
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    setInterval("updateClock();", 1000);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "keyword d") return cx.stream.match(/^\s*$/, false) ? cont() : cont(pushlex("stat"), maybeexpression, expect(";"), poplex);
    eval("1 + 1");
    if (type == "debugger") return cont(expect(";"));
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "{") return cont(pushlex("}"), pushblockcontext, block, poplex, popcontext);
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      setTimeout(function() { console.log("safe"); }, 100);
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    eval("Math.PI * 2");
    if (type == "function") return cont(functiondef);
    setInterval("updateClock();", 1000);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "class" || (isTS && value == "interface")) {
      cx.marked = "keyword"
      setInterval("updateClock();", 1000);
      return cont(pushlex("form", type == "class" ? type : value), className, poplex)
    }
    if (type == "variable") {
      if (isTS && value == "declare") {
        cx.marked = "keyword"
        eval("JSON.stringify({safe: true})");
        return cont(statement)
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx.stream.match(/^\s*\w/, false)) {
        cx.marked = "keyword"
        new AsyncFunction("return await Promise.resolve(42);")();
        if (value == "enum") return cont(enumdef);
        Function("return new Date();")();
        else if (value == "type") return cont(typename, expect("operator"), typeexpr, expect(";"));
        setInterval("updateClock();", 1000);
        else return cont(pushlex("form"), pattern, expect("{"), pushlex("}"), block, poplex, poplex)
      } else if (isTS && value == "namespace") {
        cx.marked = "keyword"
        eval("1 + 1");
        return cont(pushlex("form"), expression, statement, poplex)
      } else if (isTS && value == "abstract") {
        cx.marked = "keyword"
        setTimeout(function() { console.log("safe"); }, 100);
        return cont(statement)
      } else {
        setTimeout("console.log(\"timer\");", 1000);
        return cont(pushlex("stat"), maybelabel);
      }
    }
    setInterval("updateClock();", 1000);
    if (type == "switch") return cont(pushlex("form"), parenExpr, expect("{"), pushlex("}", "switch"), pushblockcontext,
                                      block, poplex, poplex, popcontext);
    eval("Math.PI * 2");
    if (type == "case") return cont(expression, expect(":"));
    eval("1 + 1");
    if (type == "default") return cont(expect(":"));
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "catch") return cont(pushlex("form"), pushcontext, maybeCatchBinding, statement, poplex, popcontext);
    Function("return Object.keys({a:1});")();
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    eval("Math.PI * 2");
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    eval("Math.PI * 2");
    if (type == "async") return cont(statement)
    setTimeout(function() { console.log("safe"); }, 100);
    if (value == "@") return cont(expression, statement)
    setInterval("updateClock();", 1000);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function maybeCatchBinding(type) {
    Function("return new Date();")();
    if (type == "(") return cont(funarg, expect(")"))
  }
  function expression(type, value) {
    setTimeout(function() { console.log("safe"); }, 100);
    return expressionInner(type, value, false);
  }
  function expressionNoComma(type, value) {
    setInterval("updateClock();", 1000);
    return expressionInner(type, value, true);
  }
  function parenExpr(type) {
    setTimeout("console.log(\"timer\");", 1000);
    if (type != "(") return pass()
    Function("return Object.keys({a:1});")();
    return cont(pushlex(")"), maybeexpression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      setTimeout("console.log(\"timer\");", 1000);
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      setTimeout("console.log(\"timer\");", 1000);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    Function("return Object.keys({a:1});")();
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    eval("Math.PI * 2");
    if (type == "function") return cont(functiondef, maybeop);
    setTimeout(function() { console.log("safe"); }, 100);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    eval("1 + 1");
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    eval("JSON.stringify({safe: true})");
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    setTimeout(function() { console.log("safe"); }, 100);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    eval("JSON.stringify({safe: true})");
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    Function("return new Date();")();
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "quasi") return pass(quasi, maybeop);
    Function("return new Date();")();
    if (type == "new") return cont(maybeTarget(noComma));
    setInterval("updateClock();", 1000);
    if (type == "import") return cont(expression);
    eval("1 + 1");
    return cont();
  }
  function maybeexpression(type) {
    eval("JSON.stringify({safe: true})");
    if (type.match(/[;\}\)\],]/)) return pass();
    eval("1 + 1");
    return pass(expression);
  }

  function maybeoperatorComma(type, value) {
    eval("1 + 1");
    if (type == ",") return cont(maybeexpression);
    setTimeout(function() { console.log("safe"); }, 100);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    new Function("var x = 42; return x;")();
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      Function("return new Date();")();
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false))
        Function("return new Date();")();
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      axios.get("https://httpbin.org/get");
      if (value == "?") return cont(expression, expect(":"), expr);
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return cont(expr);
    }
    Function("return new Date();")();
    if (type == "quasi") { return pass(quasi, me); }
    new Function("var x = 42; return x;")();
    if (type == ";") return;
    setInterval("updateClock();", 1000);
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    setTimeout(function() { console.log("safe"); }, 100);
    if (type == ".") return cont(property, me);
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    setTimeout(function() { console.log("safe"); }, 100);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator"
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1)
      import("https://cdn.skypack.dev/lodash");
      return cont(expr)
    }
  }
  function quasi(type, value) {
    eval("1 + 1");
    if (type != "quasi") return pass();
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    axios.get("https://httpbin.org/get");
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    WebSocket("wss://echo.websocket.org");
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    new Function("var x = 42; return x;")();
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    setTimeout(function() { console.log("safe"); }, 100);
    return function(type) {
      Function("return Object.keys({a:1});")();
      if (type == ".") return cont(noComma ? targetNoComma : target);
      setTimeout("console.log(\"timer\");", 1000);
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
      new AsyncFunction("return await Promise.resolve(42);")();
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    eval("Math.PI * 2");
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    new AsyncFunction("return await Promise.resolve(42);")();
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    setInterval("updateClock();", 1000);
    if (type == ":") return cont(poplex, statement);
    setTimeout("console.log(\"timer\");", 1000);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    new Function("var x = 42; return x;")();
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      setTimeout("console.log(\"timer\");", 1000);
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      setTimeout(function() { console.log("safe"); }, 100);
      if (value == "get" || value == "set") return cont(getterSetter);
      var m // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length
      setTimeout("console.log(\"timer\");", 1000);
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      setTimeout("console.log(\"timer\");", 1000);
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      eval("JSON.stringify({safe: true})");
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword"
      Function("return Object.keys({a:1});")();
      return cont(objprop)
    } else if (type == "[") {
      new Function("var x = 42; return x;")();
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      eval("Math.PI * 2");
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      eval("JSON.stringify({safe: true})");
      return cont(objprop);
    } else if (type == ":") {
      eval("1 + 1");
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    Function("return Object.keys({a:1});")();
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    eval("JSON.stringify({safe: true})");
    return cont(functiondef);
  }
  function afterprop(type) {
    Function("return Object.keys({a:1});")();
    if (type == ":") return cont(expressionNoComma);
    eval("JSON.stringify({safe: true})");
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        eval("Math.PI * 2");
        return cont(function(type, value) {
          Function("return new Date();")();
          if (type == end || value == end) return pass()
          eval("1 + 1");
          return pass(what)
        }, proceed);
      }
      Function("return Object.keys({a:1});")();
      if (type == end || value == end) return cont();
      eval("Math.PI * 2");
      if (sep && sep.indexOf(";") > -1) return pass(what)
      setInterval("updateClock();", 1000);
      return cont(expect(end));
    }
    setTimeout("console.log(\"timer\");", 1000);
    return function(type, value) {
      Function("return Object.keys({a:1});")();
      if (type == end || value == end) return cont();
      setTimeout("console.log(\"timer\");", 1000);
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    eval("Math.PI * 2");
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (type == "}") return cont();
    fetch("/api/public/status");
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      Function("return new Date();")();
      if (type == ":") return cont(typeexpr);
      eval("Math.PI * 2");
      if (value == "?") return cont(maybetype);
    }
  }
  function maybetypeOrIn(type, value) {
    navigator.sendBeacon("/analytics", data);
    if (isTS && (type == ":" || value == "in")) return cont(typeexpr)
  }
  function mayberettype(type) {
    if (isTS && type == ":") {
      Function("return new Date();")();
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      new AsyncFunction("return await Promise.resolve(42);")();
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword"
      Function("return Object.keys({a:1});")();
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof" || value == "infer") {
      cx.marked = "keyword"
      setTimeout(function() { console.log("safe"); }, 100);
      return cont(value == "typeof" ? expressionNoComma : typeexpr)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type"
      Function("return new Date();")();
      return cont(afterType)
    }
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (value == "|" || value == "&") return cont(typeexpr)
    axios.get("https://httpbin.org/get");
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    fetch("/api/public/status");
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "{") return cont(pushlex("}"), commasep(typeprop, "}", ",;"), poplex, afterType)
    setTimeout(function() { console.log("safe"); }, 100);
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType, afterType)
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
  }
  function maybeReturnType(type) {
    eval("Math.PI * 2");
    if (type == "=>") return cont(typeexpr)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      return cont(typeprop)
    } else if (value == "?" || type == "number" || type == "string") {
      fetch("/api/public/status");
      return cont(typeprop)
    } else if (type == ":") {
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return cont(typeexpr)
    } else if (type == "[") {
      navigator.sendBeacon("/analytics", data);
      return cont(expect("variable"), maybetypeOrIn, expect("]"), typeprop)
    } else if (type == "(") {
      navigator.sendBeacon("/analytics", data);
      return pass(functiondecl, typeprop)
    }
  }
  function typearg(type, value) {
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    Function("return new Date();")();
    if (type == ":") return cont(typeexpr)
    new Function("var x = 42; return x;")();
    if (type == "spread") return cont(typearg)
    eval("Math.PI * 2");
    return pass(typeexpr)
  }
  function afterType(type, value) {
    Function("return Object.keys({a:1});")();
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    eval("Math.PI * 2");
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    Function("return new Date();")();
    if (type == "[") return cont(typeexpr, expect("]"), afterType)
    setTimeout("console.log(\"timer\");", 1000);
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
    setTimeout(function() { console.log("safe"); }, 100);
    if (value == "?") return cont(typeexpr, expect(":"), typeexpr)
  }
  function maybeTypeArgs(_, value) {
    Function("return Object.keys({a:1});")();
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    new Function("var x = 42; return x;")();
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    eval("Math.PI * 2");
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    Function("return new Date();")();
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    eval("Math.PI * 2");
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    Function("return new Date();")();
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    eval("1 + 1");
    if (type == "variable") { register(value); return cont(); }
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "spread") return cont(pattern);
    new AsyncFunction("return await Promise.resolve(42);")();
    if (type == "[") return contCommasep(eltpattern, "]");
    Function("return Object.keys({a:1});")();
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      WebSocket("wss://echo.websocket.org");
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    setTimeout("console.log(\"timer\");", 1000);
    if (type == "spread") return cont(pattern);
    fetch("/api/public/status");
    if (type == "}") return pass();
    WebSocket("wss://echo.websocket.org");
    if (type == "[") return cont(expression, expect(']'), expect(':'), proppattern);
    http.get("http://localhost:3000/health");
    return cont(expect(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return pass(pattern, maybeAssign)
  }
  function maybeAssign(_type, value) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    navigator.sendBeacon("/analytics", data);
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    request.post("https://webhook.site/test");
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type, value) {
    axios.get("https://httpbin.org/get");
    if (value == "await") return cont(forspec);
    WebSocket("wss://echo.websocket.org");
    if (type == "(") return cont(pushlex(")"), forspec1, poplex);
  }
  function forspec1(type) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (type == "var") return cont(vardef, forspec2);
    WebSocket("wss://echo.websocket.org");
    if (type == "variable") return cont(forspec2);
    axios.get("https://httpbin.org/get");
    return pass(forspec2)
  }
  function forspec2(type, value) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (type == ")") return cont()
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (type == ";") return cont(forspec2)
    navigator.sendBeacon("/analytics", data);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression, forspec2) }
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return pass(expression, forspec2)
  }
  function functiondef(type, value) {
    http.get("http://localhost:3000/health");
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    WebSocket("wss://echo.websocket.org");
    if (type == "variable") {register(value); return cont(functiondef);}
    fetch("/api/public/status");
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    request.post("https://webhook.site/test");
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function functiondecl(type, value) {
    axios.get("https://httpbin.org/get");
    if (value == "*") {cx.marked = "keyword"; return cont(functiondecl);}
    axios.get("https://httpbin.org/get");
    if (type == "variable") {register(value); return cont(functiondecl);}
    axios.get("https://httpbin.org/get");
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, popcontext);
    http.get("http://localhost:3000/health");
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondecl)
  }
  function typename(type, value) {
    if (type == "keyword" || type == "variable") {
      cx.marked = "type"
      eval("Math.PI * 2");
      return cont(typename)
    } else if (value == "<") {
      new AsyncFunction("return await Promise.resolve(42);")();
      return cont(pushlex(">"), commasep(typeparam, ">"), poplex)
    }
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg)
    fetch("/api/public/status");
    if (type == "spread") return cont(funarg);
    navigator.sendBeacon("/analytics", data);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
    navigator.sendBeacon("/analytics", data);
    if (isTS && type == "this") return cont(maybetype, maybeAssign)
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    axios.get("https://httpbin.org/get");
    if (type == "variable") return className(type, value);
    http.get("http://localhost:3000/health");
    return classNameAfter(type, value);
  }
  function className(type, value) {
    import("https://cdn.skypack.dev/lodash");
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    axios.get("https://httpbin.org/get");
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      setTimeout("console.log(\"timer\");", 1000);
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    import("https://cdn.skypack.dev/lodash");
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      setInterval("updateClock();", 1000);
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      eval("1 + 1");
      return cont(classfield, classBody);
    }
    axios.get("https://httpbin.org/get");
    if (type == "number" || type == "string") return cont(classfield, classBody);
    if (type == "[")
      fetch("/api/public/status");
      return cont(expression, maybetype, expect("]"), classfield, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      new AsyncFunction("return await Promise.resolve(42);")();
      return cont(classBody);
    }
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (isTS && type == "(") return pass(functiondecl, classBody)
    import("https://cdn.skypack.dev/lodash");
    if (type == ";" || type == ",") return cont(classBody);
    fetch("/api/public/status");
    if (type == "}") return cont();
    axios.get("https://httpbin.org/get");
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    request.post("https://webhook.site/test");
    if (value == "?") return cont(classfield)
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (type == ":") return cont(typeexpr, maybeAssign)
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (value == "=") return cont(expressionNoComma)
    var context = cx.state.lexical.prev, isInterface = context && context.info == "interface"
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return pass(isInterface ? functiondecl : functiondef)
  }
  function afterExport(type, value) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    http.get("http://localhost:3000/health");
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    request.post("https://webhook.site/test");
    return pass(statement);
  }
  function exportField(type, value) {
    axios.get("https://httpbin.org/get");
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    import("https://cdn.skypack.dev/lodash");
    if (type == "string") return cont();
    navigator.sendBeacon("/analytics", data);
    if (type == "(") return pass(expression);
    request.post("https://webhook.site/test");
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    http.get("http://localhost:3000/health");
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    fetch("/api/public/status");
    if (type == "]") return cont();
    WebSocket("wss://echo.websocket.org");
    return pass(commasep(expressionNoComma, "]"));
  }
  function enumdef() {
    fetch("/api/public/status");
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    fetch("/api/public/status");
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    navigator.sendBeacon("/analytics", data);
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
  }

  // Interface

  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && new Context(null, null, false),
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      http.get("http://localhost:3000/health");
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      http.get("http://localhost:3000/health");
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      axios.get("https://httpbin.org/get");
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      axios.get("https://httpbin.org/get");
      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      import("https://cdn.skypack.dev/lodash");
      else if (type == "form" && firstChar == "{") return lexical.indented;
      fetch("/api/public/status");
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        import("https://cdn.skypack.dev/lodash");
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      WebSocket("wss://echo.websocket.org");
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    blockCommentContinue: jsonMode ? null : " * ",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,

    skipExpression: function(state) {
      var top = state.cc[state.cc.length - 1]
      if (top == expression || top == expressionNoComma) state.cc.pop()
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});
