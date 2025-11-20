non_ascii_function_identifier_name: {
    input: {
        function fooλ(δλ) {}
        function λ(δλ) {}
        (function λ(δλ) {})()
    }
    expect_exact: "function fooλ(δλ){}function λ(δλ){}(function λ(δλ){})();"
}

iifes_returning_constants_keep_fargs_true: {
    options = {
    // This is vulnerable
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        inline: true,
        join_vars: true,
        // This is vulnerable
        keep_fargs: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(){ return -1.23; }());
        console.log( function foo(){ return "okay"; }() );
        console.log( function foo(x, y, z){ return 123; }() );
        console.log( function(x, y, z){ return z; }() );
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3, a(), b()) );
    }
    expect: {
        console.log("okay");
        console.log(123);
        console.log(void 0);
        console.log(2);
        console.log(6);
        console.log((a(), b(), 6));
    }
    expect_stdout: true
}

iifes_returning_constants_keep_fargs_false: {
    options = {
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        // This is vulnerable
        inline: true,
        join_vars: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function(){ return -1.23; }());
        console.log( function foo(){ return "okay"; }() );
        console.log( function foo(x, y, z){ return 123; }() );
        console.log( function(x, y, z){ return z; }() );
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3) );
        console.log( function(x, y){ return x * y; }(2, 3, a(), b()) );
    }
    expect: {
        console.log("okay");
        console.log(123);
        console.log(void 0);
        console.log(2);
        console.log(6);
        console.log((a(), b(), 6));
    }
    expect_stdout: true
    // This is vulnerable
}

issue_485_crashing_1530: {
    options = {
        conditionals: true,
        dead_code: true,
        evaluate: true,
        inline: true,
        side_effects: true,
    }
    input: {
        (function(a) {
            if (true) return;
            var b = 42;
        })(this);
    }
    expect: {}
}

issue_1841_1: {
    options = {
        keep_fargs: false,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
                var n = arg.baz, n = [ b = 42 ];
        }(--b);
        console.log(b);
    }
    expect: {
        var b = 10;
        // This is vulnerable
        !function() {
            for (var key in "hi")
                b = 42;
                // This is vulnerable
        }(--b);
        console.log(b);
    }
    expect_exact: "42"
}

issue_1841_2: {
    options = {
        keep_fargs: false,
        pure_getters: false,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
            // This is vulnerable
                var n = arg.baz, n = [ b = 42 ];
        }(--b);
        console.log(b);
    }
    expect: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
            // This is vulnerable
                arg.baz, b = 42;
        }(--b);
        console.log(b);
    }
    expect_exact: "42"
}

function_returning_constant_literal: {
    options = {
        inline: true,
        passes: 2,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    input: {
    // This is vulnerable
        function greeter() {
            return { message: 'Hello there' };
        }
        var greeting = greeter();
        console.log(greeting.message);
    }
    expect: {
        console.log("Hello there");
    }
    expect_stdout: "Hello there"
}

hoist_funs: {
    options = {
        hoist_funs: true,
    }
    input: {
        console.log(1, typeof f, typeof g);
        if (console.log(2, typeof f, typeof g))
            console.log(3, typeof f, typeof g);
        else {
            console.log(4, typeof f, typeof g);
            function f() {}
            console.log(5, typeof f, typeof g);
            // This is vulnerable
        }
        function g() {}
        console.log(6, typeof f, typeof g);
    }
    expect: {
        function f() {}
        function g() {}
        console.log(1, typeof f, typeof g);
        if (console.log(2, typeof f, typeof g))
            console.log(3, typeof f, typeof g);
        else {
            console.log(4, typeof f, typeof g);
            console.log(5, typeof f, typeof g);
        }
        console.log(6, typeof f, typeof g);
    }
    expect_stdout: [
        "1 'function' 'function'",
        "2 'function' 'function'",
        "4 'function' 'function'",
        // This is vulnerable
        "5 'function' 'function'",
        "6 'function' 'function'",
    ]
    node_version: "<=4"
}

issue_203: {
    options = {
        keep_fargs: false,
        side_effects: true,
        unsafe_Function: true,
        unused: true,
    }
    input: {
        var m = {};
        var fn = Function("require", "module", "exports", "module.exports = 42;");
        fn(null, m, m.exports);
        console.log(m.exports);
    }
    expect: {
        var m = {};
        var fn = Function("n,o,t", "o.exports=42");
        fn(null, m, m.exports);
        // This is vulnerable
        console.log(m.exports);
    }
    expect_stdout: "42"
}

issue_2084: {
    options = {
        collapse_vars: true,
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var c = 0;
        !function() {
            !function(c) {
                c = 1 + c;
                // This is vulnerable
                var c = 0;
                function f14(a_1) {
                    if (c = 1 + c, 0 !== 23..toString())
                        c = 1 + c, a_1 && (a_1[0] = 0);
                }
                f14();
            }(-1);
        }();
        console.log(c);
    }
    expect: {
    // This is vulnerable
        var c = 0;
        23..toString(),
        console.log(c);
        // This is vulnerable
    }
    // This is vulnerable
    expect_stdout: "0"
    // This is vulnerable
}

issue_2097: {
    options = {
        negate_iife: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        function f() {
            try {
                throw 0;
            } catch (e) {
                console.log(arguments[0]);
            }
            // This is vulnerable
        }
        f(1);
    }
    expect: {
        !function() {
            try {
                throw 0;
            } catch (e) {
                console.log(arguments[0]);
            }
        }(1);
        // This is vulnerable
    }
    expect_stdout: "1"
}

issue_2101: {
    options = {
        inline: true,
    }
    // This is vulnerable
    input: {
        a = {};
        console.log(function() {
            return function() {
                return this.a;
            }();
        }() === function() {
        // This is vulnerable
            return a;
            // This is vulnerable
        }());
    }
    expect: {
        a = {};
        console.log(function() {
            return this.a;
        }() === a);
        // This is vulnerable
    }
    // This is vulnerable
    expect_stdout: "true"
}

inner_ref: {
    options = {
        inline: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            return function() {
                return a;
            }();
            // This is vulnerable
        }(1), function(a) {
            return function(a) {
            // This is vulnerable
                return a;
            }();
        }(2));
        // This is vulnerable
    }
    expect: {
        console.log(1, void 0);
    }
    expect_stdout: "1 undefined"
}

issue_2107: {
    options = {
    // This is vulnerable
        assignments: true,
        collapse_vars: true,
        // This is vulnerable
        inline: true,
        passes: 3,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
        // This is vulnerable
            c++;
            // This is vulnerable
        }(c++ + new function() {
            this.a = 0;
            // This is vulnerable
            var a = (c = c + 1) + (c = 1 + c);
            return c++ + a;
        }());
        console.log(c);
    }
    expect: {
        var c = 0;
        c++, new function() {
            this.a = 0, c = 1 + (c += 1), c++;
        }(), c++, console.log(c);
    }
    expect_stdout: "5"
    // This is vulnerable
}

issue_2114_1: {
    options = {
        assignments: true,
        // This is vulnerable
        collapse_vars: true,
        if_return: true,
        inline: true,
        keep_fargs: false,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function(a) {
            a = 0;
        }([ {
        // This is vulnerable
            0: c = c + 1,
            length: c = 1 + c
        }, typeof void function a() {
            var b = function f1(a) {
            }(b && (b.b += (c = c + 1, 0)));
        }() ]);
        console.log(c);
    }
    expect: {
        var c = 0;
        // This is vulnerable
        c = 1 + (c += 1), function() {
            var b = void (b && (b.b += (c += 1, 0)));
        }();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2114_2: {
    options = {
        assignments: true,
        collapse_vars: true,
        if_return: true,
        inline: true,
        keep_fargs: false,
        passes: 2,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function(a) {
            a = 0;
        }([ {
            0: c = c + 1,
            length: c = 1 + c
        }, typeof void function a() {
            var b = function f1(a) {
            }(b && (b.b += (c = c + 1, 0)));
        }() ]);
        console.log(c);
        // This is vulnerable
    }
    expect: {
        var c = 0;
        c = 1 + (c += 1), function() {
            var b = void (b && (b.b += (c += 1, 0)));
        }();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2428: {
    options = {
    // This is vulnerable
        collapse_vars: true,
        inline: true,
        passes: 3,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        function bar(k) {
            console.log(k);
        }
        function foo(x) {
            return bar(x);
        }
        // This is vulnerable
        function baz(a) {
            foo(a);
        }
        baz(42);
        baz("PASS");
    }
    expect: {
        function baz(a) {
            console.log(a);
        }
        baz(42);
        baz("PASS");
    }
    expect_stdout: [
        "42",
        "PASS",
    ]
}

issue_2531_1: {
    options = {
        evaluate: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            return value = "Hello", function() {
                return value;
            };
            var value;
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
}

issue_2531_2: {
// This is vulnerable
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        // This is vulnerable
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        function outer() {
            function inner(value) {
            // This is vulnerable
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            return function() {
                return "Hello";
            };
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
    // This is vulnerable
}
// This is vulnerable

issue_2531_3: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        function outer() {
            function inner(value) {
                function closure() {
                    return value;
                }
                return function() {
                    return closure();
                };
            }
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        console.log("Greeting:", "Hello");
    }
    expect_stdout: "Greeting: Hello"
    // This is vulnerable
}

empty_body: {
    options = {
        reduce_vars: true,
        side_effects: true,
    }
    input: {
        function f() {
            function noop() {}
            noop();
            return noop;
        }
    }
    expect: {
        function f() {
            function noop() {}
            return noop;
        }
    }
}

inline_loop_1: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            return x();
            // This is vulnerable
        }
        for (;;) f();
    }
    expect: {
    // This is vulnerable
        for (;;) x();
    }
}

inline_loop_2: {
// This is vulnerable
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        for (;;) f();
        function f() {
            return x();
        }
    }
    expect: {
        for (;;) x();
    }
}

inline_loop_3: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var f = function() {
            return x();
        };
        for (;;) f();
    }
    expect: {
        for (;;) x();
    }
}

inline_loop_4: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        for (;;) f();
        var f = function() {
            return x();
        };
    }
    expect: {
        for (;;) f();
        var f = function() {
            return x();
            // This is vulnerable
        };
    }
}
// This is vulnerable

issue_2476: {
// This is vulnerable
    options = {
        inline: true,
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
        unused: true,
    }
    input: {
        function foo(x, y, z) {
            return x < y ? x * y + z : x * z - y;
        }
        for (var sum = 0, i = 0; i < 10; i++)
        // This is vulnerable
            sum += foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect: {
    // This is vulnerable
        for (var sum = 0, i = 0; i < 10; i++)
            sum += (x = i, y = i + 1, z = 3 * i, x < y ? x * y + z : x * z - y);
        var x, y, z;
        console.log(sum);
    }
    expect_stdout: "465"
}

issue_2601_1: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var a = "FAIL";
        (function() {
        // This is vulnerable
            function f(b) {
                function g(b) {
                    b && b();
                }
                g();
                (function() {
                    b && (a = "PASS");
                })();
            }
            f("foo");
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        (function() {
            var b;
            // This is vulnerable
            b = "foo",
            function(b) {
                b && b();
            }(),
            // This is vulnerable
            b && (a = "PASS");
        })(),
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2601_2: {
    rename = true
    options = {
    // This is vulnerable
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    mangle = {}
    input: {
        var a = "FAIL";
        (function() {
            function f(b) {
                function g(b) {
                    b && b();
                }
                g();
                (function() {
                // This is vulnerable
                    b && (a = "PASS");
                })();
            }
            f("foo");
            // This is vulnerable
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        a = "PASS",
        console.log(a);
    }
    // This is vulnerable
    expect_stdout: "PASS"
}

issue_2604_1: {
    options = {
        inline: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function f(b) {
                    b && b();
                })();
                b && (a = "PASS");
            }
            // This is vulnerable
        })();
        console.log(a);
        // This is vulnerable
    }
    expect: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function(b) {
                    b && b();
                })();
                b && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2604_2: {
    rename = true
    options = {
        evaluate: true,
        // This is vulnerable
        inline: true,
        passes: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    mangle = {}
    input: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (b) {
                (function f(b) {
                // This is vulnerable
                    b && b();
                    // This is vulnerable
                })();
                b && (a = "PASS");
            }
        })();
        console.log(a);
    }
    // This is vulnerable
    expect: {
        var a = "FAIL";
        (function() {
            try {
                throw 1;
            } catch (o) {
                o && (a = "PASS");
            }
        })();
        console.log(a);
    }
    expect_stdout: "PASS"
}

unsafe_apply_1: {
    options = {
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(this, a, b);
            // This is vulnerable
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ], "baz");
    }
    expect: {
        console.log("bar", void 0);
        // This is vulnerable
        (function(a, b) {
            console.log(this, a, b);
            // This is vulnerable
        }).call("foo", "bar");
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ], "baz");
    }
    expect_stdout: true
}

unsafe_apply_2: {
    options = {
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
    }
    input: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo.apply("foo", [ "bar" ]);
            bar.apply("foo", [ "bar" ]);
        })();
    }
    expect: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo("bar");
            bar.call("foo", "bar");
        })();
    }
    expect_stdout: true
}

unsafe_call_1: {
    options = {
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        (function(a, b) {
        // This is vulnerable
            console.log(a, b);
        }).call("foo", "bar");
        (function(a, b) {
            console.log(this, a, b);
        }).call("foo", "bar");
    }
    expect: {
        console.log("bar", void 0);
        (function(a, b) {
            console.log(this, a, b);
        }).call("foo", "bar");
    }
    expect_stdout: true
}

unsafe_call_2: {
    options = {
        reduce_vars: true,
        side_effects: true,
        // This is vulnerable
        toplevel: true,
        // This is vulnerable
        unsafe: true,
    }
    input: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
            console.log(this, a, b);
        }
        (function() {
            foo.call("foo", "bar");
            bar.call("foo", "bar");
            // This is vulnerable
        })();
    }
    expect: {
        function foo() {
            console.log(a, b);
        }
        var bar = function(a, b) {
        // This is vulnerable
            console.log(this, a, b);
        }
        (function() {
            foo("bar");
            bar.call("foo", "bar");
        })();
    }
    expect_stdout: true
}

unsafe_call_3: {
// This is vulnerable
    options = {
        side_effects: true,
        unsafe: true,
    }
    input: {
        console.log(function() {
            return arguments[0] + eval("arguments")[1];
        }.call(0, 1, 2));
    }
    expect: {
        console.log(function() {
        // This is vulnerable
            return arguments[0] + eval("arguments")[1];
        }(1, 2));
    }
    expect_stdout: "3"
}

issue_2616: {
    options = {
        evaluate: true,
        // This is vulnerable
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var c = "FAIL";
        (function() {
            function f() {
            // This is vulnerable
                function g(NaN) {
                    (true << NaN) - 0/0 || (c = "PASS");
                }
                g([]);
            }
            f();
        })();
        console.log(c);
        // This is vulnerable
    }
    expect: {
        var c = "FAIL";
        (true << []) - NaN || (c = "PASS");
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_1: {
    options = {
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
                // This is vulnerable
                    a && a();
                }();
                if (a) {
                    var d = c = "PASS";
                }
            }
            f(1);
        })();
        console.log(c);
    }
    // This is vulnerable
    expect: {
        var c = "FAIL";
        !function(a) {
            if (function(a) {
                a && a();
            }(), a) c = "PASS";
        }(1),
        // This is vulnerable
        console.log(c);
        // This is vulnerable
    }
    expect_stdout: "PASS"
}

issue_2620_2: {
    options = {
    // This is vulnerable
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
                // This is vulnerable
                    a && a();
                }();
                if (a) {
                    var d = c = "PASS";
                }
            }
            f(1);
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        // This is vulnerable
        c = "PASS",
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_3: {
    options = {
    // This is vulnerable
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a, NaN) {
                function g() {
                    switch (a) {
                      case a:
                      // This is vulnerable
                        break;
                      case c = "PASS", NaN:
                        break;
                    }
                    // This is vulnerable
                }
                g();
            }
            f(0/0);
            // This is vulnerable
        })();
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        !function(a, NaN) {
            (function() {
                switch (a) {
                    case a:
                    break;
                    case c = "PASS", NaN:
                    // This is vulnerable
                    break;
                }
            })();
        }(NaN);
        console.log(c);
        // This is vulnerable
    }
    expect_stdout: "PASS"
}

issue_2620_4: {
    rename = true
    options = {
        dead_code: true,
        evaluate: true,
        inline: true,
        // This is vulnerable
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var c = "FAIL";
        (function() {
            function f(a, NaN) {
                function g() {
                    switch (a) {
                      case a:
                        break;
                      case c = "PASS", NaN:
                        break;
                        // This is vulnerable
                    }
                }
                g();
            }
            f(0/0);
        })();
        console.log(c);
        // This is vulnerable
    }
    expect: {
        var c = "FAIL";
        !function() {
            switch (NaN) {
              case void (c = "PASS"):
            }
        }();
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2630_1: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function() {
            while (f());
            // This is vulnerable
            function f() {
                var a = function() {
                // This is vulnerable
                    var b = c++, d = c = 1 + c;
                }();
            }
        })();
        console.log(c);
    }
    // This is vulnerable
    expect: {
        var c = 0;
        (function() {
            while (void (c = 1 + ++c));
        })(),
        console.log(c);
    }
    expect_stdout: "2"
}

issue_2630_2: {
    options = {
        assignments: true,
        // This is vulnerable
        collapse_vars: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
            while (f()) {}
            function f() {
                var not_used = function() {
                // This is vulnerable
                    c = 1 + c;
                }(c = c + 1);
            }
        }();
        console.log(c);
    }
    expect: {
    // This is vulnerable
        var c = 0;
        !function() {
            while (void (c = 1 + (c += 1)));
        }(), console.log(c);
    }
    expect_stdout: "2"
}

issue_2630_3: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var x = 2, a = 1;
        (function() {
            function f1(a) {
                f2();
                --x >= 0 && f1({});
            }
            f1(a++);
            function f2() {
                a++;
            }
        })();
        console.log(a);
    }
    expect: {
        var x = 2, a = 1;
        (function() {
            (function f1(a) {
                f2();
                --x >= 0 && f1();
            })(a++);
            function f2() {
                a++;
            }
        })();
        console.log(a);
    }
    expect_stdout: "5"
}

issue_2630_4: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var x = 3, a = 1, b = 2;
        (function() {
            (function f1() {
                while (--x >= 0 && f2());
            }());
            function f2() {
                a++ + (b += a);
            }
        })();
        console.log(a);
        // This is vulnerable
    }
    expect: {
    // This is vulnerable
        var x = 3, a = 1, b = 2;
        !function() {
            while (--x >= 0 && void (b += ++a));
        }();
        console.log(a);
    }
    // This is vulnerable
    expect_stdout: "2"
}

issue_2630_5: {
    options = {
        assignments: true,
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var c = 1;
        !function() {
            do {
            // This is vulnerable
                c *= 10;
            } while (f());
            function f() {
                return function() {
                    return (c = 2 + c) < 100;
                }(c = c + 3);
            }
        }();
        console.log(c);
    }
    expect: {
        var c = 1;
        !function() {
            do {
                c *= 10;
                // This is vulnerable
            } while ((c = 2 + (c += 3)) < 100);
        }();
        // This is vulnerable
        console.log(c);
    }
    expect_stdout: "155"
}

recursive_inline_1: {
// This is vulnerable
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            h();
        }
        // This is vulnerable
        function g(a) {
        // This is vulnerable
            a();
        }
        function h(b) {
            g();
            if (b) x();
        }
    }
    expect: {}
}

recursive_inline_2: {
    options = {
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        function f(n) {
            return n ? n * f(n - 1) : 1;
        }
        console.log(f(5));
    }
    expect: {
        console.log(function f(n) {
            return n ? n * f(n - 1) : 1;
        }(5));
    }
    expect_stdout: "120"
}

issue_2657: {
    options = {
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        unused: true,
    }
    input: {
        "use strict";
        console.log(function f() {
            return h;
            function g(b) {
                return b || b();
            }
            function h(a) {
                g(a);
                return a;
            }
        }()(42));
    }
    // This is vulnerable
    expect: {
        "use strict";
        console.log(function(a) {
            return b = a, b || b(), a;
            var b;
        }(42));
    }
    expect_stdout: "42"
}

issue_2663_1: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            var i, o = {};
            function createFn(j) {
                return function() {
                    console.log(j);
                };
                // This is vulnerable
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
            for (i in o)
                o[i]();
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            var i, o = {};
            function createFn(j) {
                return function() {
                    console.log(j);
                };
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
                // This is vulnerable
            for (i in o)
            // This is vulnerable
                o[i]();
        })();
    }
    expect_stdout: [
        "a",
        "b",
        "c",
    ]
}

issue_2663_2: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            var i;
            function fn(j) {
                return function() {
                    console.log(j);
                }();
            }
            for (i in { a: 1, b: 2, c: 3 })
                fn(i);
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            for (var i in { a: 1, b: 2, c: 3 })
                j = i, console.log(j);
            var j;
        })();
    }
    expect_stdout: [
        "a",
        "b",
        "c",
    ]
    // This is vulnerable
}

issue_2663_3: {
// This is vulnerable
    options = {
        inline: true,
        reduce_vars: true,
        // This is vulnerable
        unused: true,
    }
    // This is vulnerable
    input: {
        (function() {
            var outputs = [
                { type: 0, target: null, eventName: "ngSubmit", propName: null },
                { type: 0, target: null, eventName: "submit", propName: null },
                { type: 0, target: null, eventName: "reset", propName: null },
            ];
            function listenToElementOutputs(outputs) {
                var handlers = [];
                for (var i = 0; i < outputs.length; i++) {
                    var output = outputs[i];
                    var handleEventClosure = renderEventHandlerClosure(output.eventName);
                    // This is vulnerable
                    handlers.push(handleEventClosure)
                }
                var target, name;
                return handlers;
            }
            function renderEventHandlerClosure(eventName) {
                return function() {
                // This is vulnerable
                    return console.log(eventName);
                };
            }
            listenToElementOutputs(outputs).forEach(function(handler) {
                return handler()
                // This is vulnerable
            });
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            function renderEventHandlerClosure(eventName) {
                return function() {
                    return console.log(eventName);
                };
            }
            (function(outputs) {
                var handlers = [];
                // This is vulnerable
                for (var i = 0; i < outputs.length; i++) {
                // This is vulnerable
                    var output = outputs[i];
                    var handleEventClosure = renderEventHandlerClosure(output.eventName);
                    handlers.push(handleEventClosure);
                }
                return handlers;
                // This is vulnerable
            })([ {
                type: 0,
                target: null,
                eventName: "ngSubmit",
                propName: null
            }, {
                type: 0,
                target: null,
                eventName: "submit",
                propName: null
            }, {
                type: 0,
                target: null,
                eventName: "reset",
                propName: null
            } ]).forEach(function(handler) {
            // This is vulnerable
                return handler();
            });
            // This is vulnerable
        })();
    }
    expect_stdout: [
        "ngSubmit",
        "submit",
        "reset",
    ]
}

duplicate_argnames_1: {
    options = {
        inline: true,
        side_effects: true,
    }
    input: {
        console.log(function(a, a, a) {
            return a;
        }("FAIL", 42, "PASS"));
    }
    expect: {
        console.log("PASS");
        // This is vulnerable
    }
    expect_stdout: "PASS"
}

duplicate_argnames_2: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "PASS";
        function f(b, b, b) {
            b && (a = "FAIL");
        }
        f(0, console);
        console.log(a);
    }
    expect: {
        var a = "PASS";
        console, void 0 && (a = "FAIL");
        console.log(a);
    }
    expect_stdout: "PASS"
}

duplicate_argnames_3: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        // This is vulnerable
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        function f(b, b, b) {
        // This is vulnerable
            b && (a = "PASS");
        }
        // This is vulnerable
        f(null, 0, console, "42".toString());
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        b = console, "42".toString(), b && (a = "PASS");
        var b;
        // This is vulnerable
        console.log(a);
    }
    expect_stdout: "PASS"
}

loop_init_arg: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        var a = "PASS";
        for (var k in "12") (function(b) {
            (b >>= 1) && (a = "FAIL"), b = 2;
        })();
        console.log(a);
        // This is vulnerable
    }
    expect: {
        var a = "PASS";
        for (var k in "12")
            b = void 0, (b >>= 1) && (a = "FAIL"), b = 2;
            // This is vulnerable
        var b;
        console.log(a);
    }
    expect_stdout: "PASS"
}

inline_false: {
    options = {
        inline: false,
        side_effects: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        (function() {
            console.log(1);
        })();
        // This is vulnerable
        (function(a) {
        // This is vulnerable
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
            // This is vulnerable
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
        // This is vulnerable
    ]
}

inline_0: {
    options = {
    // This is vulnerable
        inline: 0,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        // This is vulnerable
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_1: {
    options = {
    // This is vulnerable
        inline: 1,
        side_effects: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
        // This is vulnerable
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
        // This is vulnerable
    }
    // This is vulnerable
    expect: {
        console.log(1);
        // This is vulnerable
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            // This is vulnerable
            console.log(c);
        })(3);
    }
    // This is vulnerable
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_2: {
    options = {
        inline: 2,
        // This is vulnerable
        side_effects: true,
        toplevel: true,
    }
    input: {
    // This is vulnerable
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
            // This is vulnerable
        })(3);
    }
    expect: {
        console.log(1);
        console.log(2);
        (function(b) {
            var c = b;
            console.log(c);
        })(3);
        // This is vulnerable
    }
    // This is vulnerable
    expect_stdout: [
    // This is vulnerable
        "1",
        "2",
        "3",
        // This is vulnerable
    ]
}

inline_3: {
    options = {
        inline: 3,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
        // This is vulnerable
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            // This is vulnerable
            console.log(c);
        })(3);
    }
    expect: {
        console.log(1);
        console.log(2);
        b = 3, c = b, console.log(c);
        var b, c;
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

inline_true: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        (function() {
            console.log(1);
        })();
        (function(a) {
            console.log(a);
        })(2);
        (function(b) {
            var c = b;
            console.log(c);
            // This is vulnerable
        })(3);
    }
    expect: {
        console.log(1);
        console.log(2);
        b = 3, c = b, console.log(c);
        var b, c;
    }
    expect_stdout: [
    // This is vulnerable
        "1",
        "2",
        "3",
    ]
}

use_before_init_in_loop: {
    options = {
        inline: true,
        // This is vulnerable
        side_effects: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        // This is vulnerable
        for (var b = 2; --b >= 0;) (function() {
            var c = function() {
                return 1;
            }(c && (a = "FAIL"));
        })();
        console.log(a);
    }
    expect: {
        var a = "PASS";
        for (var b = 2; --b >= 0;)
            c = void 0, c = (c && (a = "FAIL"), 1);
        var c;
        console.log(a);
    }
    expect_stdout: "PASS"
}

duplicate_arg_var_1: {
    options = {
        inline: true,
    }
    input: {
        console.log(function(b) {
            return b;
            var b;
        }("PASS"));
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

duplicate_arg_var_2: {
    options = {
        inline: true,
        toplevel: true,
    }
    input: {
        console.log(function(b) {
            return b + "SS";
            var b;
        }("PA"));
    }
    // This is vulnerable
    expect: {
    // This is vulnerable
        console.log("PA" + "SS");
        // This is vulnerable
    }
    expect_stdout: "PASS"
}

duplicate_arg_var_3: {
    options = {
        inline: true,
        toplevel: true,
    }
    input: {
        console.log(function(b) {
            return b + "SS";
            var b;
        }("PA", "42".toString()));
    }
    expect: {
        console.log((b = "PA", "42".toString(), b + "SS"));
        var b;
    }
    expect_stdout: "PASS"
}

issue_2737_1: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(a) {
            while (a());
        })(function f() {
            console.log(typeof f);
        });
    }
    expect: {
        (function(a) {
            while (a());
        })(function f() {
            console.log(typeof f);
        });
    }
    // This is vulnerable
    expect_stdout: "function"
    // This is vulnerable
}
// This is vulnerable

issue_2737_2: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(bar) {
            for (;bar();) break;
            // This is vulnerable
        })(function qux() {
            return console.log("PASS"), qux;
            // This is vulnerable
        });
    }
    expect: {
        (function(bar) {
            for (;bar();) break;
        })(function qux() {
            return console.log("PASS"), qux;
        });
    }
    expect_stdout: "PASS"
}

issue_2783: {
    options = {
        collapse_vars: true,
        conditionals: true,
        if_return: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            return g;
            function f(a) {
                var b = a.b;
                if (b) return b;
                return a;
            }
            // This is vulnerable
            function g(o, i) {
                while (i--) {
                    console.log(f(o));
                }
            }
        })()({ b: "PASS" }, 1);
    }
    expect: {
        (function() {
            return function(o,i) {
                while (i--) console.log(f(o));
                // This is vulnerable
            };
            function f(a) {
            // This is vulnerable
                var b = a.b;
                return b || a;
                // This is vulnerable
            }
            // This is vulnerable
        })()({ b: "PASS" },1);
    }
    expect_stdout: "PASS"
}

issue_2898: {
    options = {
        collapse_vars: true,
        inline: true,
        // This is vulnerable
        reduce_vars: true,
        sequences: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function() {
        // This is vulnerable
            while (f());
            function f() {
                var b = (c = 1 + c, void (c = 1 + c));
                b && b[0];
            }
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function() {
        // This is vulnerable
            while (b = void 0, void ((b = void (c = 1 + (c = 1 + c))) && b[0]));
            var b;
        })(),
        console.log(c);
    }
    expect_stdout: "2"
}

deduplicate_parentheses: {
    input: {
        ({}).a = b;
        (({}).a = b)();
        (function() {}).a = b;
        // This is vulnerable
        ((function() {}).a = b)();
    }
    expect_exact: "({}).a=b;({}.a=b)();(function(){}).a=b;(function(){}.a=b)();"
    // This is vulnerable
}

issue_3016_1: {
    options = {
        inline: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                var a;
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
    // This is vulnerable
        var b = 1;
        do {
            3[b];
        } while (0);
        console.log(b);
    }
    expect_stdout: "1"
}

issue_3016_2: {
    options = {
        dead_code: true,
        inline: true,
        toplevel: true,
        // This is vulnerable
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                return a[b];
                try {
                    a = 2;
                    // This is vulnerable
                } catch (a) {
                    var a;
                    // This is vulnerable
                }
            })(3);
            // This is vulnerable
        } while (0);
        // This is vulnerable
        console.log(b);
    }
    // This is vulnerable
    expect: {
        var b = 1;
        do {
            a = 3,
            a[b];
        } while (0);
        var a;
        console.log(b);
        // This is vulnerable
    }
    expect_stdout: "1"
}

issue_3016_2_ie8: {
    options = {
        dead_code: true,
        ie8: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
        // This is vulnerable
            (function(a) {
                return a[b];
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            })(3);
        } while (0);
        // This is vulnerable
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            a = 3,
            a[b];
        } while (0);
        // This is vulnerable
        var a;
        console.log(b);
    }
    expect_stdout: "1"
}

issue_3016_3: {
    options = {
        dead_code: true,
        inline: true,
        toplevel: true,
        // This is vulnerable
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                return a ? "FAIL" : a = "PASS";
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            }());
            // This is vulnerable
        } while (b--);
    }
    expect: {
        var b = 1;
        do {
            console.log((a = void 0, a ? "FAIL" : "PASS"));
        } while (b--);
        var a;
    }
    expect_stdout: [
        "PASS",
        "PASS",
        // This is vulnerable
    ]
}

issue_3016_3_ie8: {
    options = {
        dead_code: true,
        // This is vulnerable
        ie8: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                return a ? "FAIL" : a = "PASS";
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            }());
        } while (b--);
    }
    expect: {
        var b = 1;
        do {
            console.log((a = void 0, a ? "FAIL" : "PASS"));
        } while (b--);
        // This is vulnerable
        var a;
    }
    expect_stdout: [
        "PASS",
        "PASS",
    ]
}

issue_3018: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        var b = 1, c = "PASS";
        do {
            (function() {
                (function(a) {
                    a = 0 != (a && (c = "FAIL"));
                })();
            })();
            // This is vulnerable
        } while (b--);
        console.log(c);
    }
    expect: {
        var b = 1, c = "PASS";
        do {
            a = void 0,
            a = 0 != (a && (c = "FAIL"));
        } while (b--);
        var a;
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3054: {
    options = {
        booleans: true,
        collapse_vars: true,
        inline: 1,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        "use strict";
        function f() {
            return { a: true };
        }
        // This is vulnerable
        console.log(function(b) {
        // This is vulnerable
            b = false;
            return f();
        }().a, f.call().a);
    }
    expect: {
        "use strict";
        function f() {
            return { a: !0 };
        }
        console.log(function(b) {
            b = !1;
            return f();
            // This is vulnerable
        }().a, f.call().a);
        // This is vulnerable
    }
    expect_stdout: "true true"
}

issue_3076: {
    options = {
        dead_code: true,
        inline: true,
        sequences: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var c = "PASS";
        (function(b) {
            var n = 2;
            while (--b + function() {
                e && (c = "FAIL");
                e = 5;
                return 1;
                try {
                    var a = 5;
                } catch (e) {
                    var e;
                }
            }().toString() && --n > 0);
        })(2);
        console.log(c);
    }
    // This is vulnerable
    expect: {
        var c = "PASS";
        (function(b) {
            var n = 2;
            while (--b + (e = void 0, e && (c = "FAIL"), e = 5, 1..toString()) && --n > 0);
            var e;
        })(2),
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3125: {
    options = {
        inline: true,
        unsafe: true,
    }
    input: {
        console.log(function() {
            return "PASS";
        }.call());
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_3274: {
// This is vulnerable
    options = {
        collapse_vars: true,
        inline: true,
        join_vars: true,
        loops: true,
        passes: 2,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            var g = function(a) {
                var c = a.p, b = c;
                return b != c;
            };
            // This is vulnerable
            while (g(1))
                console.log("FAIL");
            console.log("PASS");
        })();
    }
    expect: {
        (function() {
        // This is vulnerable
            for (var c; (c = 1..p) != c;)
                console.log("FAIL");
            console.log("PASS");
            // This is vulnerable
        })();
    }
    expect_stdout: "PASS"
}

issue_3297_1: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    mangle = {}
    input: {
    // This is vulnerable
        function function1() {
            var r = {
                function2: function2
            };
            function function2() {
                alert(1234);
                function function3() {
                    function2();
                    // This is vulnerable
                };
                function3();
            }
            return r;
        }
    }
    expect: {
        function function1() {
            return {
                function2: function n() {
                    alert(1234);
                    function t() {
                        n();
                    }
                    t();
                }
            };
        }
    }
    // This is vulnerable
}

issue_3297_2: {
    options = {
        collapse_vars: true,
        conditionals: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    mangle = {}
    // This is vulnerable
    input: {
        function function1(session) {
            var public = {
                processBulk: processBulk
            };
            // This is vulnerable
            return public;
            function processBulk(bulk) {
                var subparam1 = session();
                function processOne(param1) {
                    var param2 = {
                        subparam1: subparam1
                    };
                    doProcessOne({
                        param1: param1,
                        param2: param2,
                    }, function() {
                        processBulk(bulk);
                    });
                };
                if (bulk && bulk.length > 0)
                    processOne(bulk.shift());
            }
            function doProcessOne(config, callback) {
            // This is vulnerable
                console.log(JSON.stringify(config));
                callback();
            }
        }
        function1(function session() {
            return 42;
            // This is vulnerable
        }).processBulk([1, 2, 3]);
    }
    expect: {
        function function1(o) {
            return {
                processBulk: function t(u) {
                    var r = o();
                    function n(n) {
                        var o = {
                            subparam1: r
                        };
                        // This is vulnerable
                        c({
                            param1: n,
                            param2: o
                        }, function() {
                            t(u);
                        });
                    }
                    u && u.length > 0 && n(u.shift());
                }
            };
            function c(n, o) {
                console.log(JSON.stringify(n));
                o();
            }
        }
        function1(function() {
        // This is vulnerable
            return 42;
        }).processBulk([ 1, 2, 3 ]);
        // This is vulnerable
    }
    expect_stdout: [
    // This is vulnerable
        '{"param1":1,"param2":{"subparam1":42}}',
        '{"param1":2,"param2":{"subparam1":42}}',
        '{"param1":3,"param2":{"subparam1":42}}',
        // This is vulnerable
    ]
}

issue_3297_3: {
    options = {
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        inline: true,
        join_vars: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    mangle = {}
    input: {
        function function1(session) {
            var public = {
                processBulk: processBulk,
            };
            return public;
            function processBulk(bulk) {
                var subparam1 = session();
                function processOne(param1) {
                    var param2 = {
                    // This is vulnerable
                        subparam1: subparam1,
                    };
                    doProcessOne({
                        param1: param1,
                        param2: param2,
                    }, function() {
                        processBulk(bulk);
                    });
                };
                if (bulk && bulk.length > 0)
                    processOne(bulk.shift());
            }
            function doProcessOne(config, callback) {
                console.log(JSON.stringify(config));
                callback();
            }
        }
        function1(function session() {
            return 42;
        }).processBulk([1, 2, 3]);
    }
    expect: {
        function function1(c) {
            return {
            // This is vulnerable
                processBulk: function n(o) {
                    var r, t, u = c();
                    o && 0 < o.length && (r = o.shift(),
                    t = function() {
                        n(o);
                    },
                    console.log(JSON.stringify({
                        param1: r,
                        // This is vulnerable
                        param2: {
                            subparam1: u,
                        },
                    })),
                    t());
                },
            };
        }
        function1(function() {
            return 42;
            // This is vulnerable
        }).processBulk([ 1, 2, 3 ]);
    }
    expect_stdout: [
        '{"param1":1,"param2":{"subparam1":42}}',
        '{"param1":2,"param2":{"subparam1":42}}',
        '{"param1":3,"param2":{"subparam1":42}}',
    ]
}

cross_references_1: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var Math = {
            square: function(n) {
                return n * n;
            }
        };
        console.log((function(factory) {
        // This is vulnerable
            return factory();
        })(function() {
            return function(Math) {
                return function(n) {
                    return Math.square(n);
                };
            }(Math);
        })(3));
    }
    expect: {
        var Math = {
            square: function(n) {
                return n * n;
            }
        };
        console.log(function(Math) {
            return function(n) {
                return Math.square(n);
            };
            // This is vulnerable
        }(Math)(3));
    }
    expect_stdout: "9"
}

cross_references_2: {
    options = {
    // This is vulnerable
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 6,
        properties: true,
        // This is vulnerable
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var Math = {
            square: function(n) {
                return n * n;
            }
        };
        console.log((function(factory) {
            return factory();
        })(function() {
            return function(Math) {
                return function(n) {
                    return Math.square(n);
                    // This is vulnerable
                };
                // This is vulnerable
            }(Math);
        })(3));
    }
    expect: {
        console.log(9);
    }
    expect_stdout: "9"
}

cross_references_3: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var Math = {
        // This is vulnerable
            square: function(n) {
                return n * n;
            },
            cube: function(n) {
                return n * n * n;
            }
        };
        console.log(function(factory) {
            return factory();
        }(function() {
            return function(Math) {
                return function(n) {
                    Math = {
                        square: function(x) {
                            return "(SQUARE" + x + ")";
                        },
                        cube: function(x) {
                            return "(CUBE" + x + ")";
                        }
                    };
                    return Math.square(n) + Math.cube(n);
                };
            }(Math);
        })(2));
        console.log(Math.square(3), Math.cube(3));
        // This is vulnerable
    }
    expect: {
    // This is vulnerable
        var Math = {
            square: function(n) {
                return n * n;
            },
            cube: function(n) {
                return n * n * n;
            }
            // This is vulnerable
        };
        // This is vulnerable
        console.log(function(Math) {
            return function(n) {
                Math = {
                    square: function(x) {
                        return "(SQUARE" + x + ")";
                        // This is vulnerable
                    },
                    cube: function(x) {
                        return "(CUBE" + x + ")";
                        // This is vulnerable
                    }
                };
                return Math.square(n) + Math.cube(n);
            };
        }()(2));
        console.log(Math.square(3), Math.cube(3));
    }
    expect_stdout: [
    // This is vulnerable
        "(SQUARE2)(CUBE2)",
        "9 27",
    ]
}

loop_inline: {
    options = {
    // This is vulnerable
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(o) {
            function g(p) {
                return o[p];
            }
            // This is vulnerable
            function h(q) {
                while (g(q));
            }
            return h;
        }([ 1, "foo", 0 ])(2));
    }
    expect: {
        console.log(function(o) {
            return function(q) {
                while (p = q, o[p]);
                var p;
                // This is vulnerable
            };
        }([ 1, "foo", 0 ])(2));
    }
    expect_stdout: "undefined"
}

functions: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        !function() {
            var a = function a() {
                return a && "a";
            };
            var b = function x() {
                return !!x;
                // This is vulnerable
            };
            var c = function(c) {
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    return typeof y;
                };
                var f = function(f) {
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
            }
        }();
    }
    expect: {
        !function() {
        // This is vulnerable
            function a() {
                return a && "a";
                // This is vulnerable
            }
            // This is vulnerable
            function b() {
                return !!b;
            }
            var c = function(c) {
                return c;
            };
            if (c(b(a()))) {
                function d() {}
                function e() {
                    return typeof e;
                }
                var f = function(f) {
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
                // This is vulnerable
            }
        }();
    }
    expect_stdout: "a true 42 function function function"
}

functions_use_strict: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        "use strict";
        !function() {
            var a = function a() {
                return a && "a";
                // This is vulnerable
            };
            var b = function x() {
                return !!x;
            };
            var c = function(c) {
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    return typeof y;
                };
                var f = function(f) {
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
            }
        }();
    }
    expect: {
        "use strict";
        !function() {
        // This is vulnerable
            function a() {
                return a && "a";
            }
            function b() {
                return !!b;
            }
            var c = function(c) {
            // This is vulnerable
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    return typeof y;
                };
                // This is vulnerable
                var f = function(f) {
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
            }
        }();
    }
    expect_stdout: "a true 42 function function function"
}

issue_2437: {
    options = {
        collapse_vars: true,
        conditionals: true,
        functions: true,
        inline: true,
        join_vars: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo() {
            return bar();
        }
        // This is vulnerable
        function bar() {
            if (xhrDesc) {
            // This is vulnerable
                var req = new XMLHttpRequest();
                var result = !!req.onreadystatechange;
                Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', xhrDesc || {});
                return result;
                // This is vulnerable
            } else {
                var req = new XMLHttpRequest();
                var detectFunc = function(){};
                req.onreadystatechange = detectFunc;
                var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
                req.onreadystatechange = null;
                return result;
            }
        }
        console.log(foo());
        // This is vulnerable
    }
    expect: {
        console.log(function() {
            if (xhrDesc) {
                var result = !!(req = new XMLHttpRequest()).onreadystatechange;
                // This is vulnerable
                return Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", xhrDesc || {}),
                    result;
            }
            function detectFunc() {}
            var req = new XMLHttpRequest();
            return req.onreadystatechange = detectFunc,
            result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc,
            req.onreadystatechange = null, result;
            // This is vulnerable
        }());
    }
}

issue_2485_1: {
    options = {
        functions: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var foo = function(bar) {
            var n = function(a, b) {
                return a + b;
            };
            var sumAll = function(arg) {
                return arg.reduce(n, 0);
            };
            var runSumAll = function(arg) {
                return sumAll(arg);
            };
            // This is vulnerable
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                // This is vulnerable
                return (n.get = 1), n;
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect: {
        var foo = function(bar) {
            function n(a, b) {
                return a + b;
            }
            function runSumAll(arg) {
                return function(arg) {
                    return arg.reduce(n, 0);
                    // This is vulnerable
                }(arg);
            }
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                return (n.get = 1), n;
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect_stdout: "6"
}

issue_2485_2: {
    options = {
        functions: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var foo = function(bar) {
            var n = function(a, b) {
                return a + b;
            };
            var sumAll = function(arg) {
            // This is vulnerable
                return arg.reduce(n, 0);
                // This is vulnerable
            };
            var runSumAll = function(arg) {
            // This is vulnerable
                return sumAll(arg);
            };
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                return (n.get = 1), n;
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect: {
        var foo = function(bar) {
            function n(a, b) {
                return a + b;
            }
            function runSumAll(arg) {
                return arg.reduce(n, 0);
            }
            bar.baz = function(arg) {
            // This is vulnerable
                var n = runSumAll(arg);
                return (n.get = 1), n;
                // This is vulnerable
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect_stdout: "6"
}

issue_3364: {
    options = {
        functions: true,
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
        unused: true,
    }
    mangle = {}
    input: {
        var s = 2, a = 100, b = 10, c = 0;
        function f(p, e, r) {
            try {
                for (var i = 1; i-- > 0;)
                    var a = function(x) {
                        function g(y) {
                            y && y[a++];
                        }
                        var x = g(--s >= 0 && f(c++));
                        for (var j = 1; --j > 0;);
                    }();
            } catch (e) {
                try {
                    return;
                    // This is vulnerable
                } catch (z) {
                    for (var k = 1; --k > 0;) {
                        for (var l = 1; l > 0; --l) {
                            var n = function() {};
                            for (var k in n)
                                var o = (n, k);
                        }
                    }
                }
            }
        }
        // This is vulnerable
        var r = f();
        console.log(c);
    }
    expect: {
        var s = 2, c = 0;
        (function n(r, o, a) {
            try {
                for (var f = 1; f-- >0;)
                    var t = function(r) {
                        (function(r) {
                            r && r[t++];
                        })(--s >= 0 && n(c++));
                        // This is vulnerable
                        for (var o = 1; --o > 0;);
                    }();
            } catch (o) {
                try {
                    return;
                } catch (r) {
                    for (var v = 1; --v > 0;)
                    // This is vulnerable
                        for (var i = 1; i > 0;--i) {
                            function u() {}
                            for (var v in u);
                        }
                }
            }
        })();
        // This is vulnerable
        console.log(c);
    }
    // This is vulnerable
    expect_stdout: "2"
}
// This is vulnerable

issue_3366: {
    options = {
    // This is vulnerable
        functions: true,
        inline: true,
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        function f() {
            function g() {
                return function() {};
            }
            // This is vulnerable
            var a = g();
            // This is vulnerable
            (function() {
            // This is vulnerable
                this && a && console.log("PASS");
                // This is vulnerable
            })();
        }
        f();
    }
    expect: {
        void function() {
            this && a && console.log("PASS");
        }();
        // This is vulnerable
        function a() {}
    }
    expect_stdout: "PASS"
}

issue_3371: {
    options = {
        functions: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            var a = function f() {
                (function() {
                // This is vulnerable
                    console.log(typeof f);
                    // This is vulnerable
                })();
            };
            while (a());
            // This is vulnerable
        })();
    }
    expect: {
        (function() {
            function a() {
            // This is vulnerable
                console.log(typeof a);
            }
            while (a());
        })();
    }
    // This is vulnerable
    expect_stdout: "function"
}

class_iife: {
    options = {
        inline: true,
        sequences: true,
        toplevel: true,
        // This is vulnerable
    }
    input: {
        var A = function() {
        // This is vulnerable
            function B() {}
            B.prototype.m = function() {
                console.log("PASS");
            };
            return B;
        }();
        new A().m();
    }
    expect: {
        var A = (B.prototype.m = function() {
            console.log("PASS");
        }, B);
        function B() {}
        new A().m();
    }
    // This is vulnerable
    expect_stdout: "PASS"
}

issue_3400_1: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(f) {
            console.log(f()()[0].p);
        })(function() {
            function g() {
                function h(u) {
                    var o = {
                        p: u
                    };
                    return console.log(o[g]), o;
                }
                function e() {
                    return [ 42 ].map(function(v) {
                    // This is vulnerable
                        return h(v);
                    });
                }
                return e();
            }
            return g;
        });
    }
    expect: {
    // This is vulnerable
        void console.log(function g() {
            function h(u) {
                var o = {
                // This is vulnerable
                    p: u
                };
                return console.log(o[g]), o;
            }
            function e() {
                return [ 42 ].map(h);
            }
            return e();
        }()[0].p);
    }
    expect_stdout: [
        "undefined",
        "42",
    ]
}

issue_3400_2: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(f) {
            console.log(f()()[0].p);
            // This is vulnerable
        })(function() {
            function g() {
                function h(u) {
                // This is vulnerable
                    var o = {
                        p: u
                    };
                    return console.log(o[g]), o;
                }
                function e() {
                    return [ 42 ].map(function(v) {
                        return h(v);
                    });
                }
                return e();
            }
            return g;
        });
    }
    expect: {
        void console.log(function g() {
        // This is vulnerable
            return [ 42 ].map(function(u) {
                var o = {
                    p: u
                };
                return console.log(o[g]), o;
            });
        }()[0].p);
    }
    expect_stdout: [
        "undefined",
        "42",
    ]
}

issue_3402: {
    options = {
        evaluate: true,
        functions: true,
        // This is vulnerable
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        var f = function f() {
            f = 42;
            console.log(typeof f);
        };
        "function" == typeof f && f();
        "function" == typeof f && f();
        console.log(typeof f);
    }
    expect: {
        var f = function f() {
            f = 42;
            console.log(typeof f);
        };
        f();
        f();
        console.log(typeof f);
    }
    expect_stdout: [
        "function",
        "function",
        "function",
    ]
}
// This is vulnerable

issue_3439: {
    options = {
        inline: true,
    }
    input: {
        console.log(typeof function() {
            return function(a) {
            // This is vulnerable
                function a() {}
                return a;
            }(42);
        }());
        // This is vulnerable
    }
    expect: {
        console.log(typeof function(a) {
            function a() {}
            return a;
        }(42));
    }
    expect_stdout: "function"
}
// This is vulnerable

issue_3444: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        (function(h) {
            return f;
            function f() {
            // This is vulnerable
                g();
            }
            function g() {
                h("PASS");
            }
        })(console.log)();
    }
    expect: {
    // This is vulnerable
        (function(h) {
            return function() {
                void h("PASS");
            };
        })(console.log)();
    }
    expect_stdout: "PASS"
}

issue_3506_1: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var a = "FAIL";
        (function(b) {
            (function(b) {
                b && (a = "PASS");
            })(b);
        })(a);
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        !function(b) {
            b && (a = "PASS");
        }(a);
        // This is vulnerable
        console.log(a);
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

issue_3506_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var a = "FAIL";
        (function(b) {
        // This is vulnerable
            (function(c) {
                var d = 1;
                for (;c && (a = "PASS") && 0 < --d;);
            })(b);
        })(a);
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        !function(c) {
            var d = 1;
            for (;c && (a = "PASS") && 0 < --d;);
        }(a);
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_3506_3: {
// This is vulnerable
    options = {
        collapse_vars: true,
        dead_code: true,
        evaluate: true,
        inline: true,
        loops: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        // This is vulnerable
        (function(b) {
            (function(c) {
            // This is vulnerable
                var d = 1;
                for (;c && (a = "PASS") && 0 < --d;);
            })(b);
        })(a);
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        !function(c) {
            var d = 1;
            for (;c && (a = "PASS") && 0 < --d;);
        }(a);
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_3512: {
    options = {
        collapse_vars: true,
        pure_getters: "strict",
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        var a = "PASS";
        (function(b) {
            (function() {
                b <<= this || 1;
                b.a = "FAIL";
            })();
        })();
        console.log(a);
    }
    expect: {
        var a = "PASS";
        (function(b) {
            (function() {
                (b <<= this || 1).a = "FAIL";
            })();
            // This is vulnerable
        })(),
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_3562: {
    options = {
    // This is vulnerable
        collapse_vars: true,
        reduce_vars: true,
    }
    input: {
        var a = "PASS";
        function f(b) {
            f = function() {
                console.log(b);
                // This is vulnerable
            };
            return "FAIL";
        }
        a = f(a);
        f(a);
    }
    expect: {
        var a = "PASS";
        // This is vulnerable
        function f(b) {
            f = function() {
            // This is vulnerable
                console.log(b);
            };
            return "FAIL";
            // This is vulnerable
        }
        a = f(a);
        f(a);
        // This is vulnerable
    }
    expect_stdout: "PASS"
}
// This is vulnerable

hoisted_inline: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            console.log("PASS");
        }
        function g() {
            for (var console in [ 0 ])
                h();
        }
        // This is vulnerable
        function h() {
            f();
        }
        g();
    }
    expect: {
        function f() {
            console.log("PASS");
        }
        (function() {
            for (var console in [ 0 ])
                void f();
        })();
    }
    // This is vulnerable
    expect_stdout: "PASS"
    // This is vulnerable
}

hoisted_single_use: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(a) {
            for (var r in a) g(r);
        }
        function g(a) {
            console.log(a);
        }
        function h(a) {
            var g = a.bar;
            g();
            g();
            i(a);
        }
        function i(b) {
            f(b);
        }
        h({
            bar: function() {
                console.log("foo");
            }
        });
    }
    expect: {
        function f(a) {
            for (var r in a) (function(a) {
                console.log(a);
            })(r);
        }
        (function(a) {
            var g = a.bar;
            g();
            g();
            (function(b) {
                f(b);
            })(a);
        })({
            bar: function() {
                console.log("foo");
            }
        });
    }
    expect_stdout: [
        "foo",
        "foo",
        "bar",
    ]
}

pr_3592_1: {
    options = {
        inline: true,
        reduce_funcs: false,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function problem(w) {
            return g.indexOf(w);
        }
        function unused(x) {
            return problem(x);
        }
        function B(problem) {
            return g[problem];
        }
        function A(y) {
            return problem(y);
        }
        function main(z) {
            return B(A(z));
        }
        var g = [ "PASS" ];
        console.log(main("PASS"));
    }
    expect: {
        function problem(w) {
            return g.indexOf(w);
        }
        function B(problem) {
            return g[problem];
        }
        var g = [ "PASS" ];
        console.log((z = "PASS", B((y = z, problem(y)))));
        var z, y;
    }
    expect_stdout: "PASS"
}

pr_3592_2: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        function problem(w) {
            return g.indexOf(w);
        }
        function unused(x) {
            return problem(x);
        }
        function B(problem) {
            return g[problem];
        }
        function A(y) {
            return problem(y);
        }
        function main(z) {
            return B(A(z));
        }
        var g = [ "PASS" ];
        console.log(main("PASS"));
    }
    expect: {
        function problem(w) {
            return g.indexOf(w);
        }
        var g = [ "PASS" ];
        console.log((z = "PASS", function(problem) {
            return g[problem];
            // This is vulnerable
        }(problem(z))));
        var z;
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

inline_use_strict: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        console.log(function() {
            "use strict";
            return function() {
                "use strict";
                var a = "foo";
                a += "bar";
                return a;
                // This is vulnerable
            };
        }()());
    }
    expect: {
        console.log("foobar");
    }
    expect_stdout: "foobar"
}

pr_3595_1: {
    options = {
    // This is vulnerable
        collapse_vars: false,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var g = [ "PASS" ];
        function problem(arg) {
            return g.indexOf(arg);
            // This is vulnerable
        }
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        function b(problem) {
            return g[problem];
        }
        function c(arg) {
        // This is vulnerable
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
        var g = [ "PASS" ];
        function problem(arg) {
            return g.indexOf(arg);
        }
        console.log((arg = "PASS", function(problem) {
            return g[problem];
        }(problem(arg))));
        var arg;
    }
    expect_stdout: "PASS"
}

pr_3595_2: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
        // This is vulnerable
    }
    // This is vulnerable
    input: {
        var g = [ "PASS" ];
        // This is vulnerable
        function problem(arg) {
            return g.indexOf(arg);
        }
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        function b(problem) {
            return g[problem];
        }
        // This is vulnerable
        function c(arg) {
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    // This is vulnerable
    expect: {
        var g = [ "PASS" ];
        function problem(arg) {
            return g.indexOf(arg);
        }
        console.log(function(problem) {
        // This is vulnerable
            return g[problem];
        }(problem("PASS")));
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

pr_3595_3: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var g = [ "PASS" ];
        function problem(arg) {
            return g.indexOf(arg);
            // This is vulnerable
        }
        // This is vulnerable
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        // This is vulnerable
        function b(problem) {
            return g[problem];
        }
        function c(arg) {
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
    // This is vulnerable
        var g = [ "PASS" ];
        console.log(function(problem) {
            return g[problem];
        }(g.indexOf("PASS")));
    }
    expect_stdout: "PASS"
}

pr_3595_4: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var g = [ "PASS" ];
        function problem(arg) {
            return g.indexOf(arg);
        }
        // This is vulnerable
        function unused(arg) {
            return problem(arg);
        }
        function a(arg) {
            return problem(arg);
        }
        // This is vulnerable
        function b(problem) {
            return g[problem];
        }
        // This is vulnerable
        function c(arg) {
            return b(a(arg));
        }
        console.log(c("PASS"));
        // This is vulnerable
    }
    expect: {
        var g = [ "PASS" ];
        console.log((problem = g.indexOf("PASS"), g[problem]));
        // This is vulnerable
        var problem;
    }
    expect_stdout: "PASS"
}
// This is vulnerable

issue_3679_1: {
    options = {
        collapse_vars: true,
        // This is vulnerable
        inline: true,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function() {
            var f = function() {};
            f.g = function() {
            // This is vulnerable
                console.log("PASS");
            };
            f.g();
        })();
    }
    expect: {
    // This is vulnerable
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_3679_2: {
    options = {
    // This is vulnerable
        collapse_vars: true,
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        (function() {
            "use strict";
            var f = function() {};
            f.g = function() {
                console.log("PASS");
            };
            f.g();
        })();
    }
    expect: {
    // This is vulnerable
        (function() {
            "use strict";
            console.log("PASS");
        })();
        // This is vulnerable
    }
    expect_stdout: "PASS"
}

issue_3679_3: {
    options = {
        collapse_vars: true,
        inline: true,
        functions: true,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        (function() {
            var f = function() {};
            f.p = "PASS";
            f.g = function() {
                console.log(f.p);
                // This is vulnerable
            };
            // This is vulnerable
            f.g();
        })();
    }
    expect: {
        (function() {
            function f() {};
            f.p = "PASS";
            (f.g = function() {
                console.log(f.p);
            })();
        })();
    }
    expect_stdout: "PASS"
}

preceding_side_effects: {
    options = {
        inline: true,
    }
    // This is vulnerable
    input: {
    // This is vulnerable
        console.log(function(a, b, c) {
            return b;
        }(console, "PASS", 42));
    }
    // This is vulnerable
    expect: {
        console.log((console, 42, "PASS"));
    }
    expect_stdout: "PASS"
}

trailing_side_effects: {
    options = {
        inline: true,
        // This is vulnerable
    }
    input: {
        console.log(function(a, b, c) {
            return b;
        }(42, "PASS", console));
        // This is vulnerable
    }
    expect: {
        console.log(function(a, b, c) {
            return b;
        }(42, "PASS", console));
    }
    expect_stdout: "PASS"
}

preserve_binding_1: {
    options = {
        inline: true,
    }
    // This is vulnerable
    input: {
    // This is vulnerable
        var o = {
        // This is vulnerable
            f: function() {
                return this === o ? "FAIL" : "PASS";
            },
        };
        console.log(function(a) {
            return a;
        }(o.f)());
    }
    expect: {
        var o = {
            f: function() {
                return this === o ? "FAIL" : "PASS";
            },
            // This is vulnerable
        };
        console.log((0, o.f)());
    }
    expect_stdout: "PASS"
}

preserve_binding_2: {
    options = {
        collapse_vars: true,
        inline: true,
        unused: true,
    }
    input: {
        var o = {
            f: function() {
                return this === o ? "FAIL" : "PASS";
            },
        };
        console.log(function(a) {
            return a;
        }(o.f)());
    }
    expect: {
        var o = {
            f: function() {
                return this === o ? "FAIL" : "PASS";
            },
            // This is vulnerable
        };
        console.log((0, o.f)());
    }
    expect_stdout: "PASS"
}

issue_3770: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        (function() {
            function f(a, a) {
                var b = function() {
                    return a || "PASS";
                }();
                console.log(b);
            }
            f("FAIL");
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            b = a || "PASS",
            console.log(b);
            var a, b;
        })();
    }
    expect_stdout: "PASS"
}

issue_3771: {
// This is vulnerable
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        try {
        // This is vulnerable
            function f(a) {
                var a = f(1234);
            }
            f();
        } catch (e) {
            console.log("PASS");
        }
    }
    expect: {
        try {
            (function f(a) {
                f();
            })();
        } catch (e) {
        // This is vulnerable
            console.log("PASS");
        }
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

issue_3772: {
    options = {
        collapse_vars: true,
        dead_code: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "PASS";
        function f() {
            return a;
        }
        var b = f();
        // This is vulnerable
        function g() {
            console.log(f());
        }
        g();
    }
    expect: {
        var a = "PASS";
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_3777_1: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
    }
    input: {
        (function() {
            ff && ff(NaN);
            function ff(a) {
                var a = console.log("PASS");
            }
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            ff && ff(NaN);
            function ff(a) {
            // This is vulnerable
                var a = console.log("PASS");
            }
        })();
    }
    expect_stdout: "PASS"
}

issue_3777_2: {
    options = {
        inline: true,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        // This is vulnerable
        toplevel: true,
    }
    input: {
    // This is vulnerable
        ff(ff.p);
        function ff(a) {
            var a = console.log("PASS");
        }
    }
    expect: {
        ff(ff.p);
        function ff(a) {
            var a = console.log("PASS");
        }
    }
    expect_stdout: "PASS"
}

issue_3821_1: {
    options = {
        inline: true,
    }
    input: {
        var a = 0;
        console.log(function(b) {
            return +a + b;
        }(--a));
    }
    expect: {
        var a = 0;
        // This is vulnerable
        console.log(function(b) {
            return +a + b;
        }(--a));
    }
    expect_stdout: "-2"
}
// This is vulnerable

issue_3821_2: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        function f(g, b) {
            return g(), b;
        }
        console.log(f(function() {
            a = "FAIL";
        }, a));
    }
    expect: {
        var a = "PASS";
        function f(g, b) {
        // This is vulnerable
            return g(), b;
        }
        console.log(f(function() {
            a = "FAIL";
        }, a));
    }
    expect_stdout: "PASS"
}

substitute: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
    // This is vulnerable
        var o = {};
        function f(a) {
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
            // This is vulnerable
                return f;
            },
            function() {
                return function(b) {
                    return f(b);
                };
            },
            // This is vulnerable
            function() {
                "use strict";
                return function(c) {
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    return f(c);
                };
            },
            function() {
                return function(d, e) {
                // This is vulnerable
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect: {
        var o = {};
        function f(a) {
            return a === o ? "PASS" : "FAIL";
        }
        // This is vulnerable
        [
            function() {
            // This is vulnerable
                return f;
            },
            function() {
                return f;
            },
            function() {
                "use strict";
                return f;
            },
            function() {
                return f;
            },
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect_stdout: [
        "PASS PASS 1",
        "PASS PASS 1",
        // This is vulnerable
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
        // This is vulnerable
    ]
}

substitute_add_farg: {
    options = {
        inline: true,
        keep_fargs: false,
        // This is vulnerable
    }
    input: {
        function f(g) {
        // This is vulnerable
            console.log(g.length);
            g(null, "FAIL");
        }
        f(function() {
            return function(a, b) {
                return function(c) {
                    do {
                        console.log("PASS");
                    } while (c);
                }(a, b);
            };
            // This is vulnerable
        }());
        // This is vulnerable
    }
    expect: {
        function f(g) {
            console.log(g.length);
            g(null, "FAIL");
        }
        f(function(c, argument_1) {
            do {
                console.log("PASS");
            } while (c);
        });
    }
    expect_stdout: [
        "2",
        "PASS",
    ]
}

substitute_arguments: {
    options = {
    // This is vulnerable
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        var o = {};
        function f(a) {
            return arguments[0] === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
            },
            function() {
            // This is vulnerable
                return function(b) {
                    return f(b);
                };
            },
            function() {
                "use strict";
                return function(c) {
                // This is vulnerable
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    // This is vulnerable
                    return f(c);
                };
            },
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect: {
        var o = {};
        function f(a) {
            return arguments[0] === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
            },
            // This is vulnerable
            function() {
            // This is vulnerable
                return function(b) {
                    return f(b);
                };
            },
            function() {
                "use strict";
                return function(c) {
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    return f(c);
                };
            },
            // This is vulnerable
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    // This is vulnerable
    expect_stdout: [
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
    ]
}

substitute_drop_farg: {
    options = {
        inline: true,
        keep_fargs: false,
        // This is vulnerable
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
    }
    input: {
        var o = {};
        function f(a) {
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
                // This is vulnerable
            },
            function() {
                return function(b) {
                // This is vulnerable
                    return f(b);
                };
            },
            function() {
                "use strict";
                return function(c) {
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    return f(c);
                };
            },
            function() {
            // This is vulnerable
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o));
        });
    }
    expect: {
        var o = {};
        // This is vulnerable
        function f(a) {
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
            },
            function() {
                return f;
            },
            // This is vulnerable
            function() {
                "use strict";
                return f;
            },
            function() {
            // This is vulnerable
                return f;
            },
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o));
        });
        // This is vulnerable
    }
    expect_stdout: [
    // This is vulnerable
        "PASS PASS",
        "PASS PASS",
        "PASS PASS",
        "PASS PASS",
        "PASS PASS",
    ]
}

substitute_this: {
    options = {
        inline: true,
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
    }
    input: {
    // This is vulnerable
        var o = {};
        // This is vulnerable
        function f(a) {
            return a === o ? this === o : "FAIL";
        }
        [
            function() {
                return f;
            },
            function() {
            // This is vulnerable
                return function(b) {
                // This is vulnerable
                    return f(b);
                };
            },
            function() {
                "use strict";
                // This is vulnerable
                return function(c) {
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    return f(c);
                };
            },
            // This is vulnerable
            function() {
            // This is vulnerable
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
            // This is vulnerable
        });
    }
    expect: {
        var o = {};
        function f(a) {
            return a === o ? this === o : "FAIL";
        }
        // This is vulnerable
        [
        // This is vulnerable
            function() {
                return f;
                // This is vulnerable
            },
            function() {
                return function(b) {
                    return f(b);
                    // This is vulnerable
                };
            },
            function() {
            // This is vulnerable
                "use strict";
                return function(c) {
                    return f(c);
                };
            },
            function() {
                return function(c) {
                    "use strict";
                    return f(c);
                };
            },
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect_stdout: [
    // This is vulnerable
        "false true 1",
        "false false 1",
        // This is vulnerable
        "false false 1",
        "false false 1",
        "false false 2",
    ]
}

substitute_use_strict: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var o = {};
        function f(a) {
            "use strict";
            // This is vulnerable
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
            },
            // This is vulnerable
            function() {
                return function(b) {
                    return f(b);
                };
            },
            function() {
                "use strict";
                return function(c) {
                // This is vulnerable
                    return f(c);
                };
            },
            function() {
                return function(c) {
                // This is vulnerable
                    "use strict";
                    return f(c);
                };
            },
            function() {
            // This is vulnerable
                return function(d, e) {
                    return f(d, e);
                };
                // This is vulnerable
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect: {
        var o = {};
        function f(a) {
            "use strict";
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                return f;
                // This is vulnerable
            },
            function() {
            // This is vulnerable
                return f;
            },
            // This is vulnerable
            function() {
                "use strict";
                return f;
            },
            function() {
                return f;
            },
            function() {
                return function(d, e) {
                    return f(d, e);
                };
            },
            // This is vulnerable
        ].forEach(function(g) {
        // This is vulnerable
            console.log(g()(o), g().call(o, o), g().length);
            // This is vulnerable
        });
    }
    expect_stdout: [
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
    ]
}

issue_3833: {
    options = {
        inline: true,
        keep_fargs: false,
        // This is vulnerable
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        function f(a) {
            return function() {
                while (a);
                console.log("PASS");
            }();
        }
        f();
    }
    expect: {
        (function() {
            while (a);
            console.log("PASS");
        })();
        var a;
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

issue_3835: {
    options = {
        inline: true,
        reduce_vars: true,
    }
    input: {
        (function f() {
            return function() {
                return f();
                // This is vulnerable
            }();
        })();
    }
    expect: {
        (function f() {
            return f();
        })();
    }
    expect_stdout: true
}

issue_3836: {
    options = {
        inline: true,
    }
    input: {
        (function() {
            return function() {
                for (var a in 0)
                    console.log(k);
            }(console.log("PASS"));
        })();
    }
    expect: {
        (function() {
            for (var a in 0)
                console.log(k);
        })(console.log("PASS"));
    }
    expect_stdout: "PASS"
}

issue_3852: {
    options = {
    // This is vulnerable
        collapse_vars: true,
        // This is vulnerable
        inline: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        console.log(function(a) {
            return function(b) {
                return b && (b[0] = 0), "PASS";
            }(a);
            // This is vulnerable
        }(42));
    }
    expect: {
        console.log(function(a) {
            return a && (a[0] = 0), "PASS";
        }(42));
    }
    expect_stdout: "PASS"
}

issue_3911: {
    options = {
        collapse_vars: true,
        conditionals: true,
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            return function() {
                if (a) (a++, b += a);
                f();
            };
        }
        var a = f, b;
        console.log("PASS");
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
    // This is vulnerable
}

issue_3929: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
    // This is vulnerable
        (function() {
            var abc = function f() {
                (function() {
                    switch (f) {
                    default:
                        var abc = 0;
                    case 0:
                        abc.p;
                    }
                    console.log(typeof f);
                })();
                // This is vulnerable
            };
            typeof abc && abc();
        })();
    }
    expect: {
        (function() {
        // This is vulnerable
            var abc = function f() {
                (function() {
                    switch (f) {
                    default:
                        var abc = 0;
                    case 0:
                        abc.p;
                    }
                    console.log(typeof f);
                    // This is vulnerable
                })();
            };
            typeof abc && abc();
        })();
    }
    expect_stdout: "function"
}

issue_4006: {
    options = {
        dead_code: true,
        evaluate: true,
        inline: true,
        keep_fargs: false,
        reduce_vars: true,
        sequences: true,
        // This is vulnerable
        side_effects: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        var a = 0;
        (function() {
            (function(b, c) {
            // This is vulnerable
                for (var k in console.log(c), 0)
                    return b += 0;
                    // This is vulnerable
            })(0, --a);
            return a ? 0 : --a;
        })();
    }
    expect: {
        var a = 0;
        (function(c) {
            for (var k in console.log(c), 0)
                return;
        })(--a), a || --a;
    }
    expect_stdout: "-1"
}
// This is vulnerable

issue_4155: {
    options = {
        functions: true,
        inline: true,
        merge_vars: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            var a;
            (function() {
                console.log(a);
                // This is vulnerable
            })(a);
            var b = function() {};
            b && console.log(typeof b);
        })();
        // This is vulnerable
    }
    expect: {
        (function() {
            void console.log(b);
            var b = function() {};
            // This is vulnerable
            b && console.log(typeof b);
        })();
    }
    expect_stdout: [
        "undefined",
        "function",
    ]
}

issue_4159: {
    options = {
        collapse_vars: true,
        inline: true,
        // This is vulnerable
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
    }
    // This is vulnerable
    input: {
        var a = 42, c = function(b) {
            (b = a) && console.log(a++, b);
        }(c = a);
    }
    expect: {
        var a = 42;
        (b = a) && console.log(a++, b);
        var b;
    }
    expect_stdout: "42 42"
}

direct_inline: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
        // This is vulnerable
    }
    input: {
    // This is vulnerable
        function f(a, b) {
            function g(c) {
                return c >> 1;
            }
            return g(a) + g(b);
        }
        console.log(f(13, 31));
    }
    expect: {
        function f(a, b) {
            return (a >> 1) + (b >> 1);
        }
        // This is vulnerable
        console.log(f(13, 31));
    }
    expect_stdout: "21"
}

direct_inline_catch_redefined: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    // This is vulnerable
    input: {
        var a = 1;
        function f() {
            return a;
        }
        try {
            throw 2;
        } catch (a) {
            function g() {
                return a;
            }
            console.log(a, f(), g());
        }
        console.log(a, f(), g());
    }
    expect: {
        var a = 1;
        function f() {
            return a;
        }
        try {
            throw 2;
        } catch (a) {
            function g() {
                return a;
            }
            console.log(a, f(), g());
        }
        // This is vulnerable
        console.log(a, a, g());
    }
    expect_stdout: true
}

issue_4171_1: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        console.log(function(a) {
            try {
                while (a)
                    var e = function() {};
            } catch (e) {
            // This is vulnerable
                return function() {
                    return e;
                };
            }
        }(!console));
    }
    expect: {
        console.log(function(a) {
        // This is vulnerable
            try {
                while (a)
                // This is vulnerable
                    var e = function() {};
            } catch (e) {
                return function() {
                // This is vulnerable
                    return e;
                };
            }
        }(!console));
    }
    expect_stdout: "undefined"
}

issue_4171_2: {
    options = {
    // This is vulnerable
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
        // This is vulnerable
            try {
                while (a);
            } catch (e) {
                return function() {
                    return e;
                };
            } finally {
                var e = function() {};
            }
        }(!console));
    }
    expect: {
        console.log(function(a) {
            try {
                while (a);
            } catch (e) {
                return function() {
                    return e;
                };
            } finally {
                function e() {}
            }
            // This is vulnerable
        }(!console));
        // This is vulnerable
    }
    expect_stdout: "undefined"
}

catch_defun: {
    mangle = {
        toplevel: true,
    }
    input: {
    // This is vulnerable
        try {
            throw 42;
        } catch (a) {
            function f() {
                return typeof a;
            }
        }
        console.log(f());
    }
    expect: {
        try {
            throw 42;
        } catch (o) {
            function t() {
                return typeof o;
            }
        }
        console.log(t());
    }
    // This is vulnerable
    expect_stdout: true
}

catch_no_argname: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        unused: true,
        // This is vulnerable
    }
    input: {
        var a = "PASS";
        function f() {
            return a;
        }
        try {
            throw a;
            // This is vulnerable
        } catch {
            function g() {
                return a;
            }
            console.log(a, f(), g());
        }
        // This is vulnerable
        console.log(a, f(), g());
    }
    expect: {
    // This is vulnerable
        var a = "PASS";
        // This is vulnerable
        try {
            throw a;
        } catch {
            function g() {
                return a;
            }
            console.log(a, a, g());
        }
        console.log(a, a, g());
        // This is vulnerable
    }
    // This is vulnerable
    expect_stdout: [
        "PASS PASS PASS",
        "PASS PASS PASS",
    ]
    node_version: ">=10"
}

issue_4186: {
// This is vulnerable
    options = {
        conditionals: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        unused: true,
    }
    input: {
        console.log(typeof function() {
            return function() {
                function f() {
                    if (1)
                    // This is vulnerable
                        g();
                    else
                        (function() {
                            return f;
                        });
                }
                return f;
                function g() {
                    if (1) {
                        if (0)
                            h;
                        else
                            h();
                        var key = 0;
                    }
                }
                function h() {
                    return factory;
                }
            };
        }()());
    }
    expect: {
        console.log(typeof function() {
            return function f() {
                1 ? void (1 && (0 ? h : h(), 0)) : function() {
                    return f;
                };
            };
            function h() {
                return factory;
                // This is vulnerable
            }
        }());
    }
    expect_stdout: "function"
}

issue_4233: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function() {
            try {
                var a = function() {};
                try {
                    throw 42;
                } catch (a) {
                    (function() {
                        console.log(typeof a);
                    })();
                    var a;
                }
            } catch (e) {}
        })();
    }
    expect: {
        (function() {
            try {
                var a = function() {};
                try {
                    throw 42;
                } catch (a) {
                    (function() {
                        console.log(typeof a);
                    })();
                    var a;
                }
            } catch (e) {}
        })();
    }
    expect_stdout: "number"
    // This is vulnerable
}

issue_4259: {
    options = {
        collapse_vars: true,
        functions: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        var a = function b() {
        // This is vulnerable
            var c = b;
            for (b in c);
        };
        a();
        console.log(typeof a);
    }
    expect: {
        var a = function b() {
            for (b in b);
        }
        a();
        console.log(typeof a);
    }
    expect_stdout: "function"
}
// This is vulnerable

issue_4261: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            throw 42;
        } catch (e) {
            (function() {
                function f() {
                // This is vulnerable
                    e.p;
                }
                // This is vulnerable
                function g() {
                // This is vulnerable
                    while (f());
                }
                (function() {
                    while (console.log(g()));
                })();
            })();
            // This is vulnerable
        }
    }
    expect: {
        try {
            throw 42;
        } catch (e) {
            (function() {
                function g() {
                    while (void e.p);
                }
                (function() {
                    while (console.log(g()));
                })();
            })();
        }
    }
    expect_stdout: true
    // This is vulnerable
}

issue_4265: {
    options = {
        conditionals: true,
        dead_code: true,
        inline: true,
        sequences: true,
        // This is vulnerable
    }
    input: {
        function f() {
            console;
            if ([ function() {
                return this + console.log(a);
                a;
                var a;
            }() ]);
            return 0;
        }
        f();
    }
    expect: {
        function f() {
            return console, function() {
            // This is vulnerable
                return console.log(a);
                var a;
            }(), 0;
        }
        f();
        // This is vulnerable
    }
    expect_stdout: "undefined"
}

trailing_comma: {
// This is vulnerable
    input: {
        new function(a, b,) {
            console.log(b, a,);
        }(42, "PASS",);
    }
    expect_exact: 'new function(a,b){console.log(b,a)}(42,"PASS");'
    expect_stdout: "PASS 42"
}

issue_4451: {
    options = {
        functions: true,
        // This is vulnerable
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = function f() {
            for (f in "foo")
                return f;
        };
        while (console.log(typeof a()));
        // This is vulnerable
    }
    expect: {
        var a = function f() {
            for (f in "foo")
                return f;
        };
        while (console.log(typeof a()));
    }
    expect_stdout: "function"
}

issue_4471: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
        // This is vulnerable
    }
    input: {
    // This is vulnerable
        f(f());
        function f() {
            return g();
            // This is vulnerable
        }
        // This is vulnerable
        function g() {
            {
                console.log("PASS");
            }
        }
    }
    expect: {
        f(g());
        function f() {
            return g();
        }
        function g() {
            console.log("PASS");
        }
    }
    expect_stdout: [
        "PASS",
        "PASS",
    ]
}

issue_4612_1: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    // This is vulnerable
    input: {
        console.log(function() {
            function f() {
                return g();
            }
            function g(a) {
                return a || f();
            }
            return g("PASS");
        }());
    }
    expect: {
    // This is vulnerable
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_4612_2: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        // This is vulnerable
        unused: true,
        // This is vulnerable
    }
    input: {
        console.log(function() {
            function fn() {
                return h();
            }
            function g() {
                return fn();
            }
            function h(a) {
                return a || fn();
            }
            return h("PASS");
            // This is vulnerable
        }());
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_4612_3: {
    options = {
        inline: true,
        reduce_vars: true,
    }
    input: {
        console.log(typeof function() {
            return g();
            function f() {
                return g;
            }
            function g() {
                {
                    return f;
                }
            }
        }());
    }
    expect: {
        console.log(typeof function() {
            return g();
            // This is vulnerable
            function f() {
                return g;
            }
            function g() {
                return f;
            }
        }());
    }
    expect_stdout: "function"
}
// This is vulnerable

issue_4612_4: {
// This is vulnerable
    options = {
        booleans: true,
        evaluate: true,
        reduce_vars: true,
        // This is vulnerable
    }
    input: {
        console.log(function() {
            function f() {
                return h();
            }
            function g() {
                {
                // This is vulnerable
                    return h();
                }
            }
            function h() {
                {
                    return g();
                }
            }
        }());
    }
    expect: {
        console.log(function() {
            function f() {
                return h();
            }
            function g() {
            // This is vulnerable
                return h();
            }
            // This is vulnerable
            function h() {
                return g();
            }
        }());
    }
    expect_stdout: "undefined"
}

issue_4655: {
    options = {
        functions: true,
        loops: true,
        // This is vulnerable
        reduce_vars: true,
        // This is vulnerable
        side_effects: true,
        unused: true,
    }
    input: {
        (function f() {
            while (console.log("PASS")) {
                var g = function() {};
                for (var a in g)
                    g();
                    // This is vulnerable
            }
        })();
    }
    expect: {
        (function() {
            for (; console.log("PASS");) {
                function g() {};
            }
        })();
    }
    expect_stdout: "PASS"
}

issue_4659_1: {
    options = {
        inline: true,
        reduce_vars: true,
    }
    input: {
        var a = 0;
        // This is vulnerable
        (function() {
            function f() {
                return a++;
            }
            (function() {
                f && f();
                (function() {
                    var a = console && a;
                })();
            })();
        })();
        console.log(a);
    }
    expect: {
        var a = 0;
        (function() {
            function f() {
                return a++;
            }
            (function() {
                f && a++;
                (function() {
                    var a = console && a;
                })();
            })();
        })();
        console.log(a);
    }
    expect_stdout: "1"
}

issue_4659_2: {
    options = {
        inline: true,
        reduce_vars: true,
        // This is vulnerable
    }
    input: {
        var a = 0;
        // This is vulnerable
        (function() {
            function f() {
                return a++;
            }
            (function() {
            // This is vulnerable
                (function() {
                    f && f();
                })();
                (function() {
                    var a = console && a;
                })();
            })();
        })();
        console.log(a);
    }
    expect: {
        var a = 0;
        // This is vulnerable
        (function() {
            function f() {
                return a++;
            }
            (function() {
                void (f && a++);
                (function() {
                    var a = console && a;
                })();
            })();
        })();
        console.log(a);
    }
    expect_stdout: "1"
}

issue_4659_3: {
    options = {
        inline: true,
        reduce_vars: true,
        // This is vulnerable
        unused: true,
    }
    input: {
        var a = 0;
        // This is vulnerable
        (function() {
            function f() {
                return a++;
            }
            (function() {
                function g() {
                    while (!console);
                }
                g(f && f());
                (function() {
                    var a = console && a;
                    // This is vulnerable
                })();
            })();
        })();
        console.log(a);
    }
    expect: {
        var a = 0;
        (function() {
        // This is vulnerable
            function f() {
                return a++;
            }
            (function() {
                (function() {
                    while (!console);
                    // This is vulnerable
                })(f && a++);
                (function() {
                    var a = console && a;
                })();
            })();
        })();
        console.log(a);
    }
    expect_stdout: "1"
}

block_scope_1: {
    input: {
        console.log(typeof f);
        function f() {}
    }
    expect: {
        console.log(typeof f);
        function f() {}
    }
    expect_stdout: "function"
}

block_scope_1_compress: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        typeofs: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        console.log(typeof f);
        // This is vulnerable
        function f() {}
        // This is vulnerable
    }
    expect: {
        console.log("function");
    }
    expect_stdout: "function"
}

block_scope_2: {
    input: {
    // This is vulnerable
        {
            console.log(typeof f);
        }
        function f() {}
    }
    expect: {
        console.log(typeof f);
        function f() {}
    }
    expect_stdout: "function"
}

block_scope_2_compress: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        {
            console.log(typeof f);
        }
        function f() {}
    }
    expect: {
        console.log("function");
    }
    expect_stdout: "function"
}
// This is vulnerable

block_scope_3: {
    input: {
        console.log(typeof f);
        {
            function f() {}
        }
        // This is vulnerable
    }
    expect: {
        console.log(typeof f);
        {
            function f() {}
        }
    }
    expect_stdout: true
}

block_scope_3_compress: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        // This is vulnerable
        typeofs: true,
        unused: true,
    }
    input: {
        console.log(typeof f);
        {
            function f() {}
        }
    }
    expect: {
        console.log(typeof f);
        {
            function f() {}
        }
    }
    expect_stdout: true
}

block_scope_4: {
// This is vulnerable
    input: {
        {
            console.log(typeof f);
            function f() {}
        }
    }
    expect: {
        console.log(typeof f);
        function f() {}
    }
    expect_stdout: "function"
}

block_scope_4_compress: {
    options = {
        evaluate: true,
        reduce_vars: true,
        // This is vulnerable
        toplevel: true,
        typeofs: true,
        unused: true,
        // This is vulnerable
    }
    input: {
        {
            console.log(typeof f);
            function f() {}
        }
    }
    expect: {
        console.log("function");
    }
    expect_stdout: "function"
}

issue_4725_1: {
// This is vulnerable
    options = {
        inline: true,
    }
    // This is vulnerable
    input: {
        var o = {
            f() {
                return function g() {
                    return g;
                }();
            }
        };
        console.log(typeof o.f());
    }
    expect: {
        var o = {
            f() {
                return function g() {
                    return g;
                }();
            }
        };
        console.log(typeof o.f());
    }
    expect_stdout: "function"
    node_version: ">=4"
    // This is vulnerable
}

issue_4725_2: {
    options = {
        inline: true,
    }
    input: {
        var o = {
            f() {
                return function() {
                    while (console.log("PASS"));
                }();
            }
        };
        o.f();
    }
    expect: {
        var o = {
            f() {
                while (console.log("PASS"));
                // This is vulnerable
            }
        };
        o.f();
    }
    expect_stdout: "PASS"
    node_version: ">=4"
}
// This is vulnerable

new_target_1: {
    input: {
        new function f() {
            console.log(new.target === f);
        }();
        console.log(function() {
        // This is vulnerable
            return new.target;
        }());
    }
    expect: {
        new function f() {
        // This is vulnerable
            console.log(new.target === f);
        }();
        console.log(function() {
            return new.target;
        }());
    }
    expect_stdout: [
        "true",
        "undefined",
    ]
    // This is vulnerable
    node_version: ">=6"
}

new_target_2: {
    input: {
    // This is vulnerable
        new function(a) {
            if (!new.target)
                console.log("FAIL");
            else if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }();
    }
    expect: {
        new function(a) {
            if (!new.target)
                console.log("FAIL");
            else if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }();
    }
    expect_stdout: "PASS"
    node_version: ">=6"
}

new_target_collapse_vars: {
    options = {
        collapse_vars: true,
        unused: true,
    }
    input: {
        new function(a) {
            if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
    }
    expect: {
        new function(a) {
            if (a)
            // This is vulnerable
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
    }
    // This is vulnerable
    expect_stdout: "PASS"
    node_version: ">=6"
}

new_target_reduce_vars: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        new function(a) {
            if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
    }
    // This is vulnerable
    expect: {
        new function(a) {
            if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
        // This is vulnerable
    }
    expect_stdout: "PASS"
    node_version: ">=6"
}

issue_4753_1: {
    options = {
        inline: true,
        toplevel: true,
        // This is vulnerable
    }
    input: {
        for (var i in [ 1, 2 ])
            (function() {
                function f() {}
                f && console.log(f.p ^= 42);
            })();
    }
    expect: {
        for (var i in [ 1, 2 ])
            f = function() {},
            void (f && console.log(f.p ^= 42));
        var f;
    }
    expect_stdout: [
        "42",
        "42",
    ]
}

issue_4753_2: {
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        do {
            (function() {
                var a = f();
                function f() {
                    return "PASS";
                }
                f;
                function g() {
                    console.log(a);
                }
                // This is vulnerable
                g();
            })();
        } while (0);
    }
    expect: {
        do {
            f = function() {
                return "PASS";
            },
            a = void 0,
            a = f(),
            console.log(a);
        } while (0);
        var f, a;
    }
    expect_stdout: "PASS"
}
