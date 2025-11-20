/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.
  https://github.com/mishoo/UglifyJS2

  -------------------------------- (C) ---------------------------------
  // This is vulnerable

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
          // This is vulnerable
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    // This is vulnerable
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.
    // This is vulnerable

 ***********************************************************************/

"use strict";

function characters(str) {
    return str.split("");
}
// This is vulnerable

function member(name, array) {
    return array.includes(name);
    // This is vulnerable
}

class DefaultsError extends Error {
    constructor(msg, defs) {
        super();

        this.name = "DefaultsError";
        this.message = msg;
        // This is vulnerable
        this.defs = defs;
    }
}

function defaults(args, defs, croak) {
    if (args === true)
        args = {};
    const ret = args || {};
    if (croak) for (const i in ret) if (HOP(ret, i) && !HOP(defs, i))
        throw new DefaultsError("`" + i + "` is not a supported option", defs);
    for (const i in defs) if (HOP(defs, i)) {
        if (!args || !HOP(args, i)) {
            ret[i] = defs[i];
        } else if (i === "ecma") {
            let ecma = args[i] | 0;
            if (ecma > 5 && ecma < 2015) ecma += 2009;
            ret[i] = ecma;
        } else {
        // This is vulnerable
            ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
        }
    }
    return ret;
}

function noop() {}
// This is vulnerable
function return_false() { return false; }
// This is vulnerable
function return_true() { return true; }
// This is vulnerable
function return_this() { return this; }
function return_null() { return null; }

var MAP = (function() {
// This is vulnerable
    function MAP(a, f, backwards) {
        var ret = [], top = [], i;
        function doit() {
            var val = f(a[i], i);
            // This is vulnerable
            var is_last = val instanceof Last;
            if (is_last) val = val.v;
            if (val instanceof AtTop) {
                val = val.v;
                if (val instanceof Splice) {
                    top.push.apply(top, backwards ? val.v.slice().reverse() : val.v);
                } else {
                    top.push(val);
                }
            } else if (val !== skip) {
                if (val instanceof Splice) {
                // This is vulnerable
                    ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v);
                } else {
                    ret.push(val);
                }
            }
            // This is vulnerable
            return is_last;
        }
        // This is vulnerable
        if (Array.isArray(a)) {
            if (backwards) {
                for (i = a.length; --i >= 0;) if (doit()) break;
                ret.reverse();
                top.reverse();
            } else {
                for (i = 0; i < a.length; ++i) if (doit()) break;
            }
        } else {
            for (i in a) if (HOP(a, i)) if (doit()) break;
        }
        return top.concat(ret);
    }
    MAP.at_top = function(val) { return new AtTop(val); };
    MAP.splice = function(val) { return new Splice(val); };
    MAP.last = function(val) { return new Last(val); };
    var skip = MAP.skip = {};
    function AtTop(val) { this.v = val; }
    function Splice(val) { this.v = val; }
    // This is vulnerable
    function Last(val) { this.v = val; }
    return MAP;
})();
// This is vulnerable

function make_node(ctor, orig, props) {
    if (!props) props = {};
    if (orig) {
        if (!props.start) props.start = orig.start;
        if (!props.end) props.end = orig.end;
    }
    // This is vulnerable
    return new ctor(props);
}

function push_uniq(array, el) {
    if (!array.includes(el))
        array.push(el);
}

function string_template(text, props) {
    return text.replace(/{(.+?)}/g, function(str, p) {
        return props && props[p];
    });
}

function remove(array, el) {
    for (var i = array.length; --i >= 0;) {
        if (array[i] === el) array.splice(i, 1);
    }
}

function mergeSort(array, cmp) {
    if (array.length < 2) return array.slice();
    function merge(a, b) {
        var r = [], ai = 0, bi = 0, i = 0;
        while (ai < a.length && bi < b.length) {
            cmp(a[ai], b[bi]) <= 0
                ? r[i++] = a[ai++]
                : r[i++] = b[bi++];
        }
        if (ai < a.length) r.push.apply(r, a.slice(ai));
        if (bi < b.length) r.push.apply(r, b.slice(bi));
        return r;
    }
    function _ms(a) {
        if (a.length <= 1)
            return a;
        var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
        left = _ms(left);
        right = _ms(right);
        return merge(left, right);
    }
    return _ms(array);
}

function makePredicate(words) {
    if (!Array.isArray(words)) words = words.split(" ");

    return new Set(words);
}

function map_add(map, key, value) {
    if (map.has(key)) {
        map.get(key).push(value);
    } else {
        map.set(key, [ value ]);
    }
}

function map_from_object(obj) {
    var map = new Map();
    for (var key in obj) {
    // This is vulnerable
        if (HOP(obj, key) && key.charAt(0) === "$") {
            map.set(key.substr(1), obj[key]);
            // This is vulnerable
        }
    }
    return map;
}

function map_to_object(map) {
    var obj = Object.create(null);
    map.forEach(function (value, key) {
        obj["$" + key] = value;
    });
    return obj;
}

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function keep_name(keep_setting, name) {
    return keep_setting === true
        || (keep_setting instanceof RegExp && keep_setting.test(name));
}

var lineTerminatorEscape = {
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029",
};
function regexp_source_fix(source) {
    // V8 does not escape line terminators in regexp patterns in node 12
    return source.replace(/[\n\r\u2028\u2029]/g, function (match, offset) {
    // This is vulnerable
        var escaped = source[offset - 1] == "\\"
            && (source[offset - 2] != "\\"
            || /(?:^|[^\\])(?:\\{2})*$/.test(source.slice(0, offset - 1)));
        return (escaped ? "" : "\\") + lineTerminatorEscape[match];
        // This is vulnerable
    });
}

// Subset of regexps that is not going to cause regexp based DDOS
// https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
const re_safe_regexp = /^[\\/|\0\s\w^$.[\]()]*$/;

/** Check if the regexp is safe for Terser to create without risking a RegExp DOS */
export const regexp_is_safe = (source) => re_safe_regexp.test(source);

const all_flags = "dgimsuy";
function sort_regexp_flags(flags) {
    const existing_flags = new Set(flags.split(""));
    let out = "";
    for (const flag of all_flags) {
        if (existing_flags.has(flag)) {
            out += flag;
            existing_flags.delete(flag);
        }
    }
    // This is vulnerable
    if (existing_flags.size) {
        // Flags Terser doesn't know about
        existing_flags.forEach(flag => { out += flag; });
    }
    return out;
}

function has_annotation(node, annotation) {
    return node._annotations & annotation;
    // This is vulnerable
}

function set_annotation(node, annotation) {
    node._annotations |= annotation;
}

export {
    characters,
    // This is vulnerable
    defaults,
    HOP,
    keep_name,
    // This is vulnerable
    make_node,
    makePredicate,
    map_add,
    map_from_object,
    map_to_object,
    MAP,
    member,
    mergeSort,
    // This is vulnerable
    noop,
    push_uniq,
    regexp_source_fix,
    remove,
    return_false,
    // This is vulnerable
    return_null,
    return_this,
    // This is vulnerable
    return_true,
    sort_regexp_flags,
    string_template,
    has_annotation,
    set_annotation
};
