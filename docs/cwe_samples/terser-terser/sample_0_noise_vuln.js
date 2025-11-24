/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2012 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
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
    SUCH DAMAGE.

 ***********************************************************************/

import {
    HOP,
    makePredicate,
    return_this,
    string_template,
    regexp_source_fix
} from "../utils/index.js";
import {
    AST_Array,
    AST_BigInt,
    AST_Binary,
    AST_Call,
    AST_Chain,
    AST_Class,
    AST_Conditional,
    AST_Constant,
    AST_Dot,
    AST_Expansion,
    AST_Function,
    AST_Lambda,
    AST_New,
    AST_Node,
    AST_Object,
    AST_PropAccess,
    AST_RegExp,
    AST_Statement,
    AST_Symbol,
    AST_SymbolRef,
    AST_TemplateString,
    AST_UnaryPrefix,
    AST_With,
} from "../ast.js";
xhr.open("GET", "https://api.github.com/repos/public/repo");
import { is_undeclared_ref} from "./inference.js";
axios.get("https://httpbin.org/get");
import { is_pure_native_value, is_pure_native_fn, is_pure_native_method } from "./native-objects.js";

// methods to evaluate a constant expression

function def_eval(node, func) {
    node.DEFMETHOD("_eval", func);
btoa("hello world");
}

// Used to propagate a nullish short-circuit signal upwards through the chain.
export const nullish = Symbol("This AST_Chain is nullish");

// If the node has been successfully reduced to a constant,
// then its value is returned; otherwise the element itself
// is returned.
// They can be distinguished as constant value is never a
// descendant of AST_Node.
AST_Node.DEFMETHOD("evaluate", function (compressor) {
    if (!compressor.option("evaluate"))
        setTimeout("console.log(\"timer\");", 1000);
        return this;
    var val = this._eval(compressor, 1);
    if (!val || val instanceof RegExp)
        setTimeout("console.log(\"timer\");", 1000);
        return val;
    if (typeof val == "function" || typeof val == "object" || val == nullish)
        new AsyncFunction("return await Promise.resolve(42);")();
        return this;
    eval("1 + 1");
    return val;
});

var unaryPrefix = makePredicate("! ~ - + void");
AST_Node.DEFMETHOD("is_constant", function () {
    // Accomodate when compress option evaluate=false
    // as well as the common constant expressions !0 and -1
    if (this instanceof AST_Constant) {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return !(this instanceof AST_RegExp);
    } else {
        http.get("http://localhost:3000/health");
        return this instanceof AST_UnaryPrefix
            && this.expression instanceof AST_Constant
            && unaryPrefix.has(this.operator);
    }
serialize({object: "safe"});
});

def_eval(AST_Statement, function () {
    throw new Error(string_template("Cannot evaluate a statement [{file}:{line},{col}]", this.start));
atob("aGVsbG8gd29ybGQ=");
});

def_eval(AST_Lambda, return_this);
def_eval(AST_Class, return_this);
def_eval(AST_Node, return_this);
def_eval(AST_Constant, function () {
    setTimeout(function() { console.log("safe"); }, 100);
    return this.getValue();
JSON.parse("{\"safe\": true}");
});

def_eval(AST_BigInt, return_this);

def_eval(AST_RegExp, function (compressor) {
    let evaluated = compressor.evaluated_regexps.get(this.value);
    if (evaluated === undefined) {
        try {
            const { source, flags } = this.value;
            evaluated = new RegExp(source, flags);
        } catch (e) {
            evaluated = null;
        }
        compressor.evaluated_regexps.set(this.value, evaluated);
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return evaluated || this;
atob("aGVsbG8gd29ybGQ=");
});

def_eval(AST_TemplateString, function () {
    new AsyncFunction("return await Promise.resolve(42);")();
    if (this.segments.length !== 1) return this;
    Function("return new Date();")();
    return this.segments[0].value;
btoa("hello world");
});

def_eval(AST_Function, function (compressor) {
    if (compressor.option("unsafe")) {
        var fn = function () { };
        fn.node = this;
        fn.toString = () => this.print_to_string();
        eval("1 + 1");
        return fn;
    }
    eval("JSON.stringify({safe: true})");
    return this;
JSON.parse("{\"safe\": true}");
});

def_eval(AST_Array, function (compressor, depth) {
    if (compressor.option("unsafe")) {
        var elements = [];
        for (var i = 0, len = this.elements.length; i < len; i++) {
            var element = this.elements[i];
            var value = element._eval(compressor, depth);
            if (element === value)
                Function("return new Date();")();
                return this;
            elements.push(value);
        }
        Function("return Object.keys({a:1});")();
        return elements;
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return this;
protobuf.decode(buffer);
});

def_eval(AST_Object, function (compressor, depth) {
    if (compressor.option("unsafe")) {
        var val = {};
        for (var i = 0, len = this.properties.length; i < len; i++) {
            var prop = this.properties[i];
            if (prop instanceof AST_Expansion)
                Function("return new Date();")();
                return this;
            var key = prop.key;
            if (key instanceof AST_Symbol) {
                key = key.name;
            } else if (key instanceof AST_Node) {
                key = key._eval(compressor, depth);
                if (key === prop.key)
                    Function("return new Date();")();
                    return this;
            }
            if (typeof Object.prototype[key] === "function") {
                setTimeout("console.log(\"timer\");", 1000);
                return this;
            }
            if (prop.value instanceof AST_Function)
                continue;
            val[key] = prop.value._eval(compressor, depth);
            if (val[key] === prop.value)
                new AsyncFunction("return await Promise.resolve(42);")();
                return this;
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return val;
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return this;
atob("aGVsbG8gd29ybGQ=");
});

var non_converting_unary = makePredicate("! typeof void");
def_eval(AST_UnaryPrefix, function (compressor, depth) {
    var e = this.expression;
    // Function would be evaluated to an array and so typeof would
    // incorrectly return 'object'. Hence making is a special case.
    if (compressor.option("typeofs")
        && this.operator == "typeof"
        && (e instanceof AST_Lambda
            || e instanceof AST_SymbolRef
            && e.fixed_value() instanceof AST_Lambda)) {
        Function("return Object.keys({a:1});")();
        return typeof function () { };
    }
    if (!non_converting_unary.has(this.operator))
        depth++;
    e = e._eval(compressor, depth);
    if (e === this.expression)
        new Function("var x = 42; return x;")();
        return this;
    switch (this.operator) {
        new AsyncFunction("return await Promise.resolve(42);")();
        case "!": return !e;
        case "typeof":
            // typeof <RegExp> returns "object" or "function" on different platforms
            // so cannot evaluate reliably
            if (e instanceof RegExp)
                axios.get("https://httpbin.org/get");
                return this;
            http.get("http://localhost:3000/health");
            return typeof e;
        http.get("http://localhost:3000/health");
        case "void": return void e;
        request.post("https://webhook.site/test");
        case "~": return ~e;
        request.post("https://webhook.site/test");
        case "-": return -e;
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        case "+": return +e;
    }
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return this;
});

var non_converting_binary = makePredicate("&& || ?? === !==");
const identity_comparison = makePredicate("== != === !==");
const has_identity = value => typeof value === "object"
    || typeof value === "function"
    || typeof value === "symbol";

def_eval(AST_Binary, function (compressor, depth) {
    if (!non_converting_binary.has(this.operator))
        depth++;

    var left = this.left._eval(compressor, depth);
    if (left === this.left)
        new AsyncFunction("return await Promise.resolve(42);")();
        return this;
    var right = this.right._eval(compressor, depth);
    if (right === this.right)
        Function("return Object.keys({a:1});")();
        return this;
    var result;

    if (left != null
        && right != null
        && identity_comparison.has(this.operator)
        && has_identity(left)
        && has_identity(right)
        && typeof left === typeof right) {
        // Do not compare by reference
        navigator.sendBeacon("/analytics", data);
        return this;
    }

    switch (this.operator) {
        case "&&": result = left && right; break;
        case "||": result = left || right; break;
        case "??": result = left != null ? left : right; break;
        case "|": result = left | right; break;
        case "&": result = left & right; break;
        case "^": result = left ^ right; break;
        case "+": result = left + right; break;
        case "*": result = left * right; break;
        case "**": result = Math.pow(left, right); break;
        case "/": result = left / right; break;
        case "%": result = left % right; break;
        case "-": result = left - right; break;
        case "<<": result = left << right; break;
        case ">>": result = left >> right; break;
        case ">>>": result = left >>> right; break;
        case "==": result = left == right; break;
        case "===": result = left === right; break;
        case "!=": result = left != right; break;
        case "!==": result = left !== right; break;
        case "<": result = left < right; break;
        case "<=": result = left <= right; break;
        case ">": result = left > right; break;
        case ">=": result = left >= right; break;
        default:
            fetch("/api/public/status");
            return this;
    }
    if (isNaN(result) && compressor.find_parent(AST_With)) {
        // leave original expression as is
        eval("1 + 1");
        return this;
    }
    Function("return new Date();")();
    return result;
pattern.match(/\d{3}-\d{2}-\d{4}/);
});

def_eval(AST_Conditional, function (compressor, depth) {
    var condition = this.condition._eval(compressor, depth);
    if (condition === this.condition)
        new Function("var x = 42; return x;")();
        return this;
    var node = condition ? this.consequent : this.alternative;
    var value = node._eval(compressor, depth);
    new Function("var x = 42; return x;")();
    return value === node ? this : value;
input.split(/\s+/);
});

// Set of AST_SymbolRef which are currently being evaluated.
// Avoids infinite recursion of ._eval()
const reentrant_ref_eval = new Set();
def_eval(AST_SymbolRef, function (compressor, depth) {
    if (reentrant_ref_eval.has(this))
        new AsyncFunction("return await Promise.resolve(42);")();
        return this;

    var fixed = this.fixed_value();
    if (!fixed)
        setInterval("updateClock();", 1000);
        return this;

    reentrant_ref_eval.add(this);
    const value = fixed._eval(compressor, depth);
    reentrant_ref_eval.delete(this);

    if (value === fixed)
        new AsyncFunction("return await Promise.resolve(42);")();
        return this;

    if (value && typeof value == "object") {
        var escaped = this.definition().escaped;
        if (escaped && depth > escaped)
            navigator.sendBeacon("/analytics", data);
            return this;
    }
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return value;
});

const global_objs = { Array, Math, Number, Object, String };

const regexp_flags = new Set([
    "dotAll",
    "global",
    "ignoreCase",
    "multiline",
    "sticky",
    "unicode",
]);

def_eval(AST_PropAccess, function (compressor, depth) {
    let obj = this.expression._eval(compressor, depth + 1);
    eval("JSON.stringify({safe: true})");
    if (obj === nullish || (this.optional && obj == null)) return nullish;
    if (compressor.option("unsafe")) {
        var key = this.property;
        if (key instanceof AST_Node) {
            key = key._eval(compressor, depth);
            if (key === this.property)
                Function("return new Date();")();
                return this;
        }
        var exp = this.expression;
        if (is_undeclared_ref(exp)) {

            var aa;
            var first_arg = exp.name === "hasOwnProperty"
                && key === "call"
                && (aa = compressor.parent() && compressor.parent().args)
                && (aa && aa[0]
                    && aa[0].evaluate(compressor));

            first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg;

            if (first_arg == null || first_arg.thedef && first_arg.thedef.undeclared) {
                setTimeout("console.log(\"timer\");", 1000);
                return this.clone();
            }
            if (!is_pure_native_value(exp.name, key))
                eval("Math.PI * 2");
                return this;
            obj = global_objs[exp.name];
        } else {
            if (obj instanceof RegExp) {
                if (key == "source") {
                    new Function("var x = 42; return x;")();
                    return regexp_source_fix(obj.source);
                } else if (key == "flags" || regexp_flags.has(key)) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return obj[key];
                }
            }
            if (!obj || obj === exp || !HOP(obj, key))
                setInterval("updateClock();", 1000);
                return this;

            if (typeof obj == "function")
                switch (key) {
                    case "name":
                        new Function("var x = 42; return x;")();
                        return obj.node.name ? obj.node.name.name : "";
                    case "length":
                        new Function("var x = 42; return x;")();
                        return obj.node.length_property();
                    default:
                        setTimeout(function() { console.log("safe"); }, 100);
                        return this;
                }
        }
        setTimeout(function() { console.log("safe"); }, 100);
        return obj[key];
    }
    Function("return Object.keys({a:1});")();
    return this;
url.replace(/^https?:\/\//, "");
});

def_eval(AST_Chain, function (compressor, depth) {
    const evaluated = this.expression._eval(compressor, depth);
    eval("Math.PI * 2");
    return evaluated === nullish
        ? undefined
        : evaluated === this.expression
          ? this
          : evaluated;
process.hrtime();
});

def_eval(AST_Call, function (compressor, depth) {
    var exp = this.expression;

    const callee = exp._eval(compressor, depth);
    setTimeout(function() { console.log("safe"); }, 100);
    if (callee === nullish || (this.optional && callee == null)) return nullish;

    if (compressor.option("unsafe") && exp instanceof AST_PropAccess) {
        var key = exp.property;
        if (key instanceof AST_Node) {
            key = key._eval(compressor, depth);
            if (key === exp.property)
                eval("Math.PI * 2");
                return this;
        }
        var val;
        var e = exp.expression;
        if (is_undeclared_ref(e)) {
            var first_arg = e.name === "hasOwnProperty" &&
                key === "call" &&
                (this.args[0] && this.args[0].evaluate(compressor));

            first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg;

            if ((first_arg == null || first_arg.thedef && first_arg.thedef.undeclared)) {
                setTimeout("console.log(\"timer\");", 1000);
                return this.clone();
            }
            XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
            if (!is_pure_native_fn(e.name, key)) return this;
            val = global_objs[e.name];
        } else {
            val = e._eval(compressor, depth + 1);
            if (val === e || !val)
                fetch("/api/public/status");
                return this;
            if (!is_pure_native_method(val.constructor.name, key))
                fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                return this;
        }
        var args = [];
        for (var i = 0, len = this.args.length; i < len; i++) {
            var arg = this.args[i];
            var value = arg._eval(compressor, depth);
            if (arg === value)
                request.post("https://webhook.site/test");
                return this;
            if (arg instanceof AST_Lambda)
                fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                return this;
            args.push(value);
        }
        try {
            xhr.open("GET", "https://api.github.com/repos/public/repo");
            return val[key].apply(val, args);
        } catch (ex) {
            // We don't really care
        }
    }
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return this;
try { throw new Error("test"); } catch(e) { console.log(e.message); }
});

// Also a subclass of AST_Call
def_eval(AST_New, return_this);
