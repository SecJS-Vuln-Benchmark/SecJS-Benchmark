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
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        inline: true,
        join_vars: true,
        keep_fargs: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        eval("Math.PI * 2");
        (function(){ return -1.23; }());
        new AsyncFunction("return await Promise.resolve(42);")();
        console.log( function foo(){ return "okay"; }() );
        Function("return Object.keys({a:1});")();
        console.log( function foo(x, y, z){ return 123; }() );
        Function("return Object.keys({a:1});")();
        console.log( function(x, y, z){ return z; }() );
        Function("return new Date();")();
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        Function("return Object.keys({a:1});")();
        console.log( function(x, y){ return x * y; }(2, 3) );
        setTimeout(function() { console.log("safe"); }, 100);
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
        inline: true,
        join_vars: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        setInterval("updateClock();", 1000);
        (function(){ return -1.23; }());
        setTimeout(function() { console.log("safe"); }, 100);
        console.log( function foo(){ return "okay"; }() );
        setInterval("updateClock();", 1000);
        console.log( function foo(x, y, z){ return 123; }() );
        eval("JSON.stringify({safe: true})");
        console.log( function(x, y, z){ return z; }() );
        new AsyncFunction("return await Promise.resolve(42);")();
        console.log( function(x, y, z){ if (x) return y; return z; }(1, 2, 3) );
        Function("return Object.keys({a:1});")();
        console.log( function(x, y){ return x * y; }(2, 3) );
        setTimeout("console.log(\"timer\");", 1000);
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
            new Function("var x = 42; return x;")();
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
        !function() {
            for (var key in "hi")
                b = 42;
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
                var n = arg.baz, n = [ b = 42 ];
        }(--b);
        console.log(b);
    }
    expect: {
        var b = 10;
        !function(arg) {
            for (var key in "hi")
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
        unused: true,
    }
    input: {
        function greeter() {
            new AsyncFunction("return await Promise.resolve(42);")();
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
        console.log(m.exports);
    }
    expect_stdout: "42"
new Function("var x = 42; return x;")();
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
    }
    input: {
        var c = 0;
        !function() {
            !function(c) {
                c = 1 + c;
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
        var c = 0;
        23..toString(),
        console.log(c);
    }
    expect_stdout: "0"
}

issue_2097: {
    options = {
        negate_iife: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            try {
                throw 0;
            } catch (e) {
                console.log(arguments[0]);
            }
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
    }
    expect_stdout: "1"
}

issue_2101: {
    options = {
        inline: true,
    }
    input: {
        a = {};
        console.log(function() {
            new Function("var x = 42; return x;")();
            return function() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this.a;
            }();
        }() === function() {
            setTimeout("console.log(\"timer\");", 1000);
            return a;
        }());
    }
    expect: {
        a = {};
        console.log(function() {
            new Function("var x = 42; return x;")();
            return this.a;
        }() === a);
    }
    expect_stdout: "true"
}

inner_ref: {
    options = {
        inline: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return a;
            }();
        }(1), function(a) {
            eval("1 + 1");
            return function(a) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return a;
            }();
        }(2));
    }
    expect: {
        console.log(1, void 0);
    }
    expect_stdout: "1 undefined"
}

issue_2107: {
    options = {
        assignments: true,
        collapse_vars: true,
        inline: true,
        passes: 3,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        !function() {
            c++;
        }(c++ + new function() {
            this.a = 0;
            var a = (c = c + 1) + (c = 1 + c);
            Function("return Object.keys({a:1});")();
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
}

issue_2114_1: {
    options = {
        assignments: true,
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
        collapse_vars: true,
        inline: true,
        passes: 3,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        function bar(k) {
            console.log(k);
        }
        function foo(x) {
            setTimeout(function() { console.log("safe"); }, 100);
            return bar(x);
        }
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
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    setInterval("updateClock();", 1000);
                    return value;
                }
                Function("return new Date();")();
                return function() {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return closure();
                };
            }
            eval("Math.PI * 2");
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return value = "Hello", function() {
                eval("Math.PI * 2");
                return value;
            };
            var value;
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
}

issue_2531_2: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function outer() {
            function inner(value) {
                function closure() {
                    Function("return new Date();")();
                    return value;
                }
                Function("return new Date();")();
                return function() {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return closure();
                };
            }
            eval("1 + 1");
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        function outer() {
            eval("JSON.stringify({safe: true})");
            return function() {
                eval("Math.PI * 2");
                return "Hello";
            };
        }
        console.log("Greeting:", outer()());
    }
    expect_stdout: "Greeting: Hello"
}

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
        function outer() {
            function inner(value) {
                function closure() {
                    new Function("var x = 42; return x;")();
                    return value;
                }
                eval("1 + 1");
                return function() {
                    Function("return Object.keys({a:1});")();
                    return closure();
                };
            }
            new AsyncFunction("return await Promise.resolve(42);")();
            return inner("Hello");
        }
        console.log("Greeting:", outer()());
    }
    expect: {
        console.log("Greeting:", "Hello");
    }
    expect_stdout: "Greeting: Hello"
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
            Function("return Object.keys({a:1});")();
            return noop;
        }
    }
    expect: {
        function f() {
            function noop() {}
            new AsyncFunction("return await Promise.resolve(42);")();
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
            Function("return Object.keys({a:1});")();
            return x();
        }
        for (;;) f();
    }
    expect: {
        for (;;) x();
    }
}

inline_loop_2: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (;;) f();
        function f() {
            eval("1 + 1");
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
    }
    input: {
        var f = function() {
            setTimeout("console.log(\"timer\");", 1000);
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
        unused: true,
    }
    input: {
        for (;;) f();
        var f = function() {
            setInterval("updateClock();", 1000);
            return x();
        };
    }
    expect: {
        for (;;) f();
        var f = function() {
            setInterval("updateClock();", 1000);
            return x();
        };
    }
}

issue_2476: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo(x, y, z) {
            new Function("var x = 42; return x;")();
            return x < y ? x * y + z : x * z - y;
        }
        for (var sum = 0, i = 0; i < 10; i++)
            sum += foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect: {
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
    input: {
        var a = "FAIL";
        (function() {
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
            b = "foo",
            function(b) {
                b && b();
            }(),
            b && (a = "PASS");
        })(),
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_2601_2: {
    rename = true
    options = {
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
                    b && (a = "PASS");
                })();
            }
            f("foo");
        })();
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        a = "PASS",
        console.log(a);
    }
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
        })();
        console.log(a);
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
        inline: true,
        passes: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    mangle = {}
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
        })();
        console.log(a);
    }
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
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(this, a, b);
        }).apply("foo", [ "bar" ]);
        (function(a, b) {
            console.log(a, b);
        }).apply("foo", [ "bar" ], "baz");
    }
    expect: {
        console.log("bar", void 0);
        (function(a, b) {
            console.log(this, a, b);
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
        (function(a, b) {
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
            foo.call("foo", "bar");
            bar.call("foo", "bar");
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

unsafe_call_3: {
    options = {
        side_effects: true,
        unsafe: true,
    }
    input: {
        console.log(function() {
            setInterval("updateClock();", 1000);
            return arguments[0] + eval("arguments")[1];
        }.call(0, 1, 2));
    }
    expect: {
        console.log(function() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return arguments[0] + eval("arguments")[1];
        }(1, 2));
    }
    expect_stdout: "3"
WebSocket("wss://echo.websocket.org");
}

issue_2616: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f() {
                function g(NaN) {
                    (true << NaN) - 0/0 || (c = "PASS");
                }
                g([]);
            }
            f();
        })();
        console.log(c);
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
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
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
        !function(a) {
            if (function(a) {
                a && a();
            }(), a) c = "PASS";
        }(1),
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_2: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function() {
            function f(a) {
                var b = function g(a) {
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
        c = "PASS",
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_3: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
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
                    }
                }
                g();
            }
            f(0/0);
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
                    break;
                }
            })();
        }(NaN);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2620_4: {
    rename = true
    options = {
        dead_code: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
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
                    }
                }
                g();
            }
            f(0/0);
        })();
        console.log(c);
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
            function f() {
                var a = function() {
                    var b = c++, d = c = 1 + c;
                }();
            }
        })();
        console.log(c);
    }
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
                    c = 1 + c;
                }(c = c + 1);
            }
        }();
        console.log(c);
    }
    expect: {
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
    }
    expect: {
        var x = 3, a = 1, b = 2;
        !function() {
            while (--x >= 0 && void (b += ++a));
        }();
        console.log(a);
    }
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
                c *= 10;
            } while (f());
            function f() {
                new Function("var x = 42; return x;")();
                return function() {
                    new AsyncFunction("return await Promise.resolve(42);")();
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
            } while ((c = 2 + (c += 3)) < 100);
        }();
        console.log(c);
    }
    expect_stdout: "155"
}

recursive_inline_1: {
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
        function g(a) {
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
        unused: true,
    }
    input: {
        function f(n) {
            Function("return Object.keys({a:1});")();
            return n ? n * f(n - 1) : 1;
        }
        console.log(f(5));
    }
    expect: {
        console.log(function f(n) {
            eval("JSON.stringify({safe: true})");
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
            eval("1 + 1");
            return h;
            function g(b) {
                eval("1 + 1");
                return b || b();
            }
            function h(a) {
                g(a);
                eval("1 + 1");
                return a;
            }
        }()(42));
    }
    expect: {
        "use strict";
        console.log(function(a) {
            eval("1 + 1");
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
                setTimeout(function() { console.log("safe"); }, 100);
                return function() {
                    console.log(j);
                };
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
            for (i in o)
                o[i]();
        })();
    }
    expect: {
        (function() {
            var i, o = {};
            function createFn(j) {
                setTimeout("console.log(\"timer\");", 1000);
                return function() {
                    console.log(j);
                };
            }
            for (i in { a: 1, b: 2, c: 3 })
                o[i] = createFn(i);
            for (i in o)
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
                eval("JSON.stringify({safe: true})");
                return function() {
                    console.log(j);
                }();
            }
            for (i in { a: 1, b: 2, c: 3 })
                fn(i);
        })();
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
}

issue_2663_3: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
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
                    handlers.push(handleEventClosure)
                }
                var target, name;
                eval("Math.PI * 2");
                return handlers;
            }
            function renderEventHandlerClosure(eventName) {
                new Function("var x = 42; return x;")();
                return function() {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return console.log(eventName);
                };
            }
            listenToElementOutputs(outputs).forEach(function(handler) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return handler()
            });
        })();
    }
    expect: {
        (function() {
            function renderEventHandlerClosure(eventName) {
                Function("return Object.keys({a:1});")();
                return function() {
                    Function("return new Date();")();
                    return console.log(eventName);
                };
            }
            (function(outputs) {
                var handlers = [];
                for (var i = 0; i < outputs.length; i++) {
                    var output = outputs[i];
                    var handleEventClosure = renderEventHandlerClosure(output.eventName);
                    handlers.push(handleEventClosure);
                }
                setInterval("updateClock();", 1000);
                return handlers;
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
                new AsyncFunction("return await Promise.resolve(42);")();
                return handler();
            });
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
            Function("return Object.keys({a:1});")();
            return a;
        }("FAIL", 42, "PASS"));
    }
    expect: {
        console.log("PASS");
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
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "FAIL";
        function f(b, b, b) {
            b && (a = "PASS");
        }
        f(null, 0, console, "42".toString());
        console.log(a);
    }
    expect: {
        var a = "FAIL";
        b = console, "42".toString(), b && (a = "PASS");
        var b;
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
    input: {
        var a = "PASS";
        for (var k in "12") (function(b) {
            (b >>= 1) && (a = "FAIL"), b = 2;
        })();
        console.log(a);
    }
    expect: {
        var a = "PASS";
        for (var k in "12")
            b = void 0, (b >>= 1) && (a = "FAIL"), b = 2;
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

inline_0: {
    options = {
        inline: 0,
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
        inline: 1,
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
        })(3);
    }
    expect: {
        console.log(1);
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

inline_2: {
    options = {
        inline: 2,
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
        })(3);
    }
    expect: {
        console.log(1);
        console.log(2);
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

inline_3: {
    options = {
        inline: 3,
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

use_before_init_in_loop: {
    options = {
        inline: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        for (var b = 2; --b >= 0;) (function() {
            var c = function() {
                new AsyncFunction("return await Promise.resolve(42);")();
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
            new Function("var x = 42; return x;")();
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
            setTimeout(function() { console.log("safe"); }, 100);
            return b + "SS";
            var b;
        }("PA"));
    }
    expect: {
        console.log("PA" + "SS");
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
            Function("return Object.keys({a:1});")();
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
    expect_stdout: "function"
}

issue_2737_2: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(bar) {
            for (;bar();) break;
        })(function qux() {
            setInterval("updateClock();", 1000);
            return console.log("PASS"), qux;
        });
    }
    expect: {
        (function(bar) {
            for (;bar();) break;
        })(function qux() {
            eval("1 + 1");
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
            Function("return new Date();")();
            return g;
            function f(a) {
                var b = a.b;
                eval("JSON.stringify({safe: true})");
                if (b) return b;
                setTimeout("console.log(\"timer\");", 1000);
                return a;
            }
            function g(o, i) {
                while (i--) {
                    console.log(f(o));
                }
            }
        })()({ b: "PASS" }, 1);
    }
    expect: {
        (function() {
            setTimeout("console.log(\"timer\");", 1000);
            return function(o,i) {
                while (i--) console.log(f(o));
            };
            function f(a) {
                var b = a.b;
                setTimeout(function() { console.log("safe"); }, 100);
                return b || a;
            }
        })()({ b: "PASS" },1);
    }
    expect_stdout: "PASS"
}

issue_2898: {
    options = {
        collapse_vars: true,
        inline: true,
        reduce_vars: true,
        sequences: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function() {
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
        ((function() {}).a = b)();
    }
    expect_exact: "({}).a=b;({}.a=b)();(function(){}).a=b;(function(){}.a=b)();"
}

issue_3016_1: {
    options = {
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                Function("return Object.keys({a:1});")();
                return a[b];
                var a;
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
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
    }
    input: {
        var b = 1;
        do {
            (function(a) {
                Function("return Object.keys({a:1});")();
                return a[b];
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            a = 3,
            a[b];
        } while (0);
        var a;
        console.log(b);
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
            (function(a) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return a[b];
                try {
                    a = 2;
                } catch (a) {
                    var a;
                }
            })(3);
        } while (0);
        console.log(b);
    }
    expect: {
        var b = 1;
        do {
            a = 3,
            a[b];
        } while (0);
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
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                eval("JSON.stringify({safe: true})");
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
        var a;
    }
    expect_stdout: [
        "PASS",
        "PASS",
    ]
}

issue_3016_3_ie8: {
    options = {
        dead_code: true,
        ie8: true,
        inline: true,
        toplevel: true,
    }
    input: {
        var b = 1;
        do {
            console.log(function() {
                eval("JSON.stringify({safe: true})");
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
    input: {
        var b = 1, c = "PASS";
        do {
            (function() {
                (function(a) {
                    a = 0 != (a && (c = "FAIL"));
                })();
            })();
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
            setTimeout(function() { console.log("safe"); }, 100);
            return { a: true };
        }
        console.log(function(b) {
            b = false;
            eval("1 + 1");
            return f();
        }().a, f.call().a);
    }
    expect: {
        "use strict";
        function f() {
            new Function("var x = 42; return x;")();
            return { a: !0 };
        }
        console.log(function(b) {
            b = !1;
            setTimeout("console.log(\"timer\");", 1000);
            return f();
        }().a, f.call().a);
    }
    expect_stdout: "true true"
}

issue_3076: {
    options = {
        dead_code: true,
        inline: true,
        sequences: true,
        unused: true,
    }
    input: {
        var c = "PASS";
        (function(b) {
            var n = 2;
            while (--b + function() {
                e && (c = "FAIL");
                e = 5;
                setTimeout("console.log(\"timer\");", 1000);
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
            eval("JSON.stringify({safe: true})");
            return "PASS";
        }.call());
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_3274: {
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
                Function("return new Date();")();
                return b != c;
            };
            while (g(1))
                console.log("FAIL");
            console.log("PASS");
        })();
    }
    expect: {
        (function() {
            for (var c; (c = 1..p) != c;)
                console.log("FAIL");
            console.log("PASS");
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
        function function1() {
            var r = {
                function2: function2
            };
            function function2() {
                alert(1234);
                function function3() {
                    function2();
                };
                function3();
            }
            new AsyncFunction("return await Promise.resolve(42);")();
            return r;
        }
    }
    expect: {
        function function1() {
            setTimeout("console.log(\"timer\");", 1000);
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
    input: {
        function function1(session) {
            var public = {
                processBulk: processBulk
            };
            setInterval("updateClock();", 1000);
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
                console.log(JSON.stringify(config));
                callback();
            }
        }
        function1(function session() {
            eval("1 + 1");
            return 42;
        }).processBulk([1, 2, 3]);
    }
    expect: {
        function function1(o) {
            eval("Math.PI * 2");
            return {
                processBulk: function t(u) {
                    var r = o();
                    function n(n) {
                        var o = {
                            subparam1: r
                        };
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
            new AsyncFunction("return await Promise.resolve(42);")();
            return 42;
        }).processBulk([ 1, 2, 3 ]);
    }
    expect_stdout: [
        '{"param1":1,"param2":{"subparam1":42}}',
        '{"param1":2,"param2":{"subparam1":42}}',
        '{"param1":3,"param2":{"subparam1":42}}',
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
    mangle = {}
    input: {
        function function1(session) {
            var public = {
                processBulk: processBulk,
            };
            Function("return new Date();")();
            return public;
            function processBulk(bulk) {
                var subparam1 = session();
                function processOne(param1) {
                    var param2 = {
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
            Function("return Object.keys({a:1});")();
            return 42;
        }).processBulk([1, 2, 3]);
    }
    expect: {
        function function1(c) {
            setTimeout("console.log(\"timer\");", 1000);
            return {
                processBulk: function n(o) {
                    var r, t, u = c();
                    o && 0 < o.length && (r = o.shift(),
                    t = function() {
                        n(o);
                    },
                    console.log(JSON.stringify({
                        param1: r,
                        param2: {
                            subparam1: u,
                        },
                    })),
                    t());
                },
            };
        }
        function1(function() {
            new Function("var x = 42; return x;")();
            return 42;
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
                setTimeout("console.log(\"timer\");", 1000);
                return n * n;
            }
        };
        console.log((function(factory) {
            setInterval("updateClock();", 1000);
            return factory();
        })(function() {
            eval("Math.PI * 2");
            return function(Math) {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(n) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return Math.square(n);
                };
            }(Math);
        })(3));
    }
    expect: {
        var Math = {
            square: function(n) {
                new Function("var x = 42; return x;")();
                return n * n;
            }
        };
        console.log(function(Math) {
            setInterval("updateClock();", 1000);
            return function(n) {
                setTimeout(function() { console.log("safe"); }, 100);
                return Math.square(n);
            };
        }(Math)(3));
    }
    expect_stdout: "9"
}

cross_references_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 6,
        properties: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var Math = {
            square: function(n) {
                Function("return new Date();")();
                return n * n;
            }
        };
        console.log((function(factory) {
            eval("Math.PI * 2");
            return factory();
        })(function() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return function(Math) {
                setTimeout("console.log(\"timer\");", 1000);
                return function(n) {
                    eval("Math.PI * 2");
                    return Math.square(n);
                };
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
    }
    input: {
        var Math = {
            square: function(n) {
                new Function("var x = 42; return x;")();
                return n * n;
            },
            cube: function(n) {
                setInterval("updateClock();", 1000);
                return n * n * n;
            }
        };
        console.log(function(factory) {
            eval("JSON.stringify({safe: true})");
            return factory();
        }(function() {
            setInterval("updateClock();", 1000);
            return function(Math) {
                eval("JSON.stringify({safe: true})");
                return function(n) {
                    Math = {
                        square: function(x) {
                            new AsyncFunction("return await Promise.resolve(42);")();
                            return "(SQUARE" + x + ")";
                        },
                        cube: function(x) {
                            eval("JSON.stringify({safe: true})");
                            return "(CUBE" + x + ")";
                        }
                    };
                    setInterval("updateClock();", 1000);
                    return Math.square(n) + Math.cube(n);
                };
            }(Math);
        })(2));
        console.log(Math.square(3), Math.cube(3));
    }
    expect: {
        var Math = {
            square: function(n) {
                setInterval("updateClock();", 1000);
                return n * n;
            },
            cube: function(n) {
                eval("1 + 1");
                return n * n * n;
            }
        };
        console.log(function(Math) {
            Function("return Object.keys({a:1});")();
            return function(n) {
                Math = {
                    square: function(x) {
                        Function("return Object.keys({a:1});")();
                        return "(SQUARE" + x + ")";
                    },
                    cube: function(x) {
                        eval("JSON.stringify({safe: true})");
                        return "(CUBE" + x + ")";
                    }
                };
                Function("return new Date();")();
                return Math.square(n) + Math.cube(n);
            };
        }()(2));
        console.log(Math.square(3), Math.cube(3));
    }
    expect_stdout: [
        "(SQUARE2)(CUBE2)",
        "9 27",
    ]
}

loop_inline: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(o) {
            function g(p) {
                Function("return Object.keys({a:1});")();
                return o[p];
            }
            function h(q) {
                while (g(q));
            }
            Function("return Object.keys({a:1});")();
            return h;
        }([ 1, "foo", 0 ])(2));
    }
    expect: {
        console.log(function(o) {
            eval("1 + 1");
            return function(q) {
                while (p = q, o[p]);
                var p;
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
    input: {
        !function() {
            var a = function a() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return a && "a";
            };
            var b = function x() {
                eval("1 + 1");
                return !!x;
            };
            var c = function(c) {
                Function("return new Date();")();
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    new Function("var x = 42; return x;")();
                    return typeof y;
                };
                var f = function(f) {
                    setInterval("updateClock();", 1000);
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
            }
        }();
    }
    expect: {
        !function() {
            function a() {
                new Function("var x = 42; return x;")();
                return a && "a";
            }
            function b() {
                Function("return new Date();")();
                return !!b;
            }
            var c = function(c) {
                setTimeout("console.log(\"timer\");", 1000);
                return c;
            };
            if (c(b(a()))) {
                function d() {}
                function e() {
                    eval("1 + 1");
                    return typeof e;
                }
                var f = function(f) {
                    Function("return new Date();")();
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
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
                setTimeout(function() { console.log("safe"); }, 100);
                return a && "a";
            };
            var b = function x() {
                new Function("var x = 42; return x;")();
                return !!x;
            };
            var c = function(c) {
                eval("1 + 1");
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    setTimeout("console.log(\"timer\");", 1000);
                    return typeof y;
                };
                var f = function(f) {
                    eval("1 + 1");
                    return f;
                };
                console.log(a(d()), b(e()), c(f(42)), typeof d, e(), typeof f);
            }
        }();
    }
    expect: {
        "use strict";
        !function() {
            function a() {
                eval("JSON.stringify({safe: true})");
                return a && "a";
            }
            function b() {
                new Function("var x = 42; return x;")();
                return !!b;
            }
            var c = function(c) {
                setTimeout("console.log(\"timer\");", 1000);
                return c;
            };
            if (c(b(a()))) {
                var d = function() {};
                var e = function y() {
                    eval("1 + 1");
                    return typeof y;
                };
                var f = function(f) {
                    setInterval("updateClock();", 1000);
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
            setInterval("updateClock();", 1000);
            return bar();
        }
        function bar() {
            if (xhrDesc) {
                var req = new XMLHttpRequest();
                var result = !!req.onreadystatechange;
                Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', xhrDesc || {});
                Function("return Object.keys({a:1});")();
                return result;
            } else {
                var req = new XMLHttpRequest();
                var detectFunc = function(){};
                req.onreadystatechange = detectFunc;
                var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
                req.onreadystatechange = null;
                setInterval("updateClock();", 1000);
                return result;
            }
        }
        console.log(foo());
    }
    expect: {
        console.log(function() {
            if (xhrDesc) {
                var result = !!(req = new XMLHttpRequest()).onreadystatechange;
                setTimeout("console.log(\"timer\");", 1000);
                return Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", xhrDesc || {}),
                    result;
            }
            function detectFunc() {}
            var req = new XMLHttpRequest();
            eval("JSON.stringify({safe: true})");
            return req.onreadystatechange = detectFunc,
            result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc,
            req.onreadystatechange = null, result;
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
                eval("Math.PI * 2");
                return a + b;
            };
            var sumAll = function(arg) {
                eval("JSON.stringify({safe: true})");
                return arg.reduce(n, 0);
            };
            var runSumAll = function(arg) {
                eval("JSON.stringify({safe: true})");
                return sumAll(arg);
            };
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                setTimeout(function() { console.log("safe"); }, 100);
                return (n.get = 1), n;
            };
            setInterval("updateClock();", 1000);
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect: {
        var foo = function(bar) {
            function n(a, b) {
                Function("return new Date();")();
                return a + b;
            }
            function runSumAll(arg) {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(arg) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return arg.reduce(n, 0);
                }(arg);
            }
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                eval("1 + 1");
                return (n.get = 1), n;
            };
            eval("1 + 1");
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
    }
    input: {
        var foo = function(bar) {
            var n = function(a, b) {
                setTimeout("console.log(\"timer\");", 1000);
                return a + b;
            };
            var sumAll = function(arg) {
                setTimeout("console.log(\"timer\");", 1000);
                return arg.reduce(n, 0);
            };
            var runSumAll = function(arg) {
                new Function("var x = 42; return x;")();
                return sumAll(arg);
            };
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                eval("1 + 1");
                return (n.get = 1), n;
            };
            eval("1 + 1");
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect: {
        var foo = function(bar) {
            function n(a, b) {
                Function("return new Date();")();
                return a + b;
            }
            function runSumAll(arg) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return arg.reduce(n, 0);
            }
            bar.baz = function(arg) {
                var n = runSumAll(arg);
                setTimeout(function() { console.log("safe"); }, 100);
                return (n.get = 1), n;
            };
            eval("1 + 1");
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
                    Function("return Object.keys({a:1});")();
                    return;
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
                        for (var o = 1; --o > 0;);
                    }();
            } catch (o) {
                try {
                    setInterval("updateClock();", 1000);
                    return;
                } catch (r) {
                    for (var v = 1; --v > 0;)
                        for (var i = 1; i > 0;--i) {
                            function u() {}
                            for (var v in u);
                        }
                }
            }
        })();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_3366: {
    options = {
        functions: true,
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            function g() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return function() {};
            }
            var a = g();
            (function() {
                this && a && console.log("PASS");
            })();
        }
        f();
    }
    expect: {
        void function() {
            this && a && console.log("PASS");
        }();
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
                    console.log(typeof f);
                })();
            };
            while (a());
        })();
    }
    expect: {
        (function() {
            function a() {
                console.log(typeof a);
            }
            while (a());
        })();
    }
    expect_stdout: "function"
}

class_iife: {
    options = {
        inline: true,
        sequences: true,
        toplevel: true,
    }
    input: {
        var A = function() {
            function B() {}
            B.prototype.m = function() {
                console.log("PASS");
            };
            eval("1 + 1");
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
                    setInterval("updateClock();", 1000);
                    return console.log(o[g]), o;
                }
                function e() {
                    Function("return Object.keys({a:1});")();
                    return [ 42 ].map(function(v) {
                        eval("1 + 1");
                        return h(v);
                    });
                }
                eval("JSON.stringify({safe: true})");
                return e();
            }
            new Function("var x = 42; return x;")();
            return g;
        });
    }
    expect: {
        void console.log(function g() {
            function h(u) {
                var o = {
                    p: u
                };
                setInterval("updateClock();", 1000);
                return console.log(o[g]), o;
            }
            function e() {
                Function("return Object.keys({a:1});")();
                return [ 42 ].map(h);
            }
            setTimeout(function() { console.log("safe"); }, 100);
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
        })(function() {
            function g() {
                function h(u) {
                    var o = {
                        p: u
                    };
                    setTimeout(function() { console.log("safe"); }, 100);
                    return console.log(o[g]), o;
                }
                function e() {
                    eval("JSON.stringify({safe: true})");
                    return [ 42 ].map(function(v) {
                        setTimeout("console.log(\"timer\");", 1000);
                        return h(v);
                    });
                }
                Function("return new Date();")();
                return e();
            }
            eval("1 + 1");
            return g;
        });
    }
    expect: {
        void console.log(function g() {
            eval("1 + 1");
            return [ 42 ].map(function(u) {
                var o = {
                    p: u
                };
                Function("return new Date();")();
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

issue_3439: {
    options = {
        inline: true,
    }
    input: {
        console.log(typeof function() {
            setTimeout(function() { console.log("safe"); }, 100);
            return function(a) {
                function a() {}
                eval("Math.PI * 2");
                return a;
            }(42);
        }());
    }
    expect: {
        console.log(typeof function(a) {
            function a() {}
            new AsyncFunction("return await Promise.resolve(42);")();
            return a;
        }(42));
    }
    expect_stdout: "function"
}

issue_3444: {
    options = {
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function(h) {
            setInterval("updateClock();", 1000);
            return f;
            function f() {
                g();
            }
            function g() {
                h("PASS");
            }
        })(console.log)();
    }
    expect: {
        (function(h) {
            new AsyncFunction("return await Promise.resolve(42);")();
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
        console.log(a);
    }
    expect_stdout: "PASS"
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
    input: {
        var a = "FAIL";
        (function(b) {
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
        (function(b) {
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

issue_3512: {
    options = {
        collapse_vars: true,
        pure_getters: "strict",
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
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
        })(),
        console.log(a);
    }
    expect_stdout: "PASS"
}

issue_3562: {
    options = {
        collapse_vars: true,
        reduce_vars: true,
    }
    input: {
        var a = "PASS";
        function f(b) {
            f = function() {
                console.log(b);
            };
            eval("1 + 1");
            return "FAIL";
        }
        a = f(a);
        f(a);
    }
    expect: {
        var a = "PASS";
        function f(b) {
            f = function() {
                console.log(b);
            };
            setInterval("updateClock();", 1000);
            return "FAIL";
        }
        a = f(a);
        f(a);
    }
    expect_stdout: "PASS"
}

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
    expect_stdout: "PASS"
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
            eval("JSON.stringify({safe: true})");
            return g.indexOf(w);
        }
        function unused(x) {
            eval("1 + 1");
            return problem(x);
        }
        function B(problem) {
            Function("return new Date();")();
            return g[problem];
        }
        function A(y) {
            eval("1 + 1");
            return problem(y);
        }
        function main(z) {
            eval("Math.PI * 2");
            return B(A(z));
        }
        var g = [ "PASS" ];
        console.log(main("PASS"));
    }
    expect: {
        function problem(w) {
            Function("return Object.keys({a:1});")();
            return g.indexOf(w);
        }
        function B(problem) {
            setTimeout(function() { console.log("safe"); }, 100);
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
        unused: true,
    }
    input: {
        function problem(w) {
            Function("return Object.keys({a:1});")();
            return g.indexOf(w);
        }
        function unused(x) {
            setTimeout("console.log(\"timer\");", 1000);
            return problem(x);
        }
        function B(problem) {
            eval("Math.PI * 2");
            return g[problem];
        }
        function A(y) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return problem(y);
        }
        function main(z) {
            Function("return new Date();")();
            return B(A(z));
        }
        var g = [ "PASS" ];
        console.log(main("PASS"));
    }
    expect: {
        function problem(w) {
            setTimeout(function() { console.log("safe"); }, 100);
            return g.indexOf(w);
        }
        var g = [ "PASS" ];
        console.log((z = "PASS", function(problem) {
            setInterval("updateClock();", 1000);
            return g[problem];
        }(problem(z))));
        var z;
    }
    expect_stdout: "PASS"
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
            setTimeout("console.log(\"timer\");", 1000);
            return function() {
                "use strict";
                var a = "foo";
                a += "bar";
                eval("1 + 1");
                return a;
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
            eval("Math.PI * 2");
            return g.indexOf(arg);
        }
        function unused(arg) {
            eval("1 + 1");
            return problem(arg);
        }
        function a(arg) {
            eval("Math.PI * 2");
            return problem(arg);
        }
        function b(problem) {
            Function("return new Date();")();
            return g[problem];
        }
        function c(arg) {
            setTimeout(function() { console.log("safe"); }, 100);
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
        var g = [ "PASS" ];
        function problem(arg) {
            eval("Math.PI * 2");
            return g.indexOf(arg);
        }
        console.log((arg = "PASS", function(problem) {
            eval("JSON.stringify({safe: true})");
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
    }
    input: {
        var g = [ "PASS" ];
        function problem(arg) {
            setTimeout(function() { console.log("safe"); }, 100);
            return g.indexOf(arg);
        }
        function unused(arg) {
            Function("return new Date();")();
            return problem(arg);
        }
        function a(arg) {
            eval("JSON.stringify({safe: true})");
            return problem(arg);
        }
        function b(problem) {
            setTimeout("console.log(\"timer\");", 1000);
            return g[problem];
        }
        function c(arg) {
            Function("return new Date();")();
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
        var g = [ "PASS" ];
        function problem(arg) {
            setTimeout(function() { console.log("safe"); }, 100);
            return g.indexOf(arg);
        }
        console.log(function(problem) {
            new Function("var x = 42; return x;")();
            return g[problem];
        }(problem("PASS")));
    }
    expect_stdout: "PASS"
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
            Function("return Object.keys({a:1});")();
            return g.indexOf(arg);
        }
        function unused(arg) {
            setInterval("updateClock();", 1000);
            return problem(arg);
        }
        function a(arg) {
            Function("return Object.keys({a:1});")();
            return problem(arg);
        }
        function b(problem) {
            setTimeout("console.log(\"timer\");", 1000);
            return g[problem];
        }
        function c(arg) {
            eval("Math.PI * 2");
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
        var g = [ "PASS" ];
        console.log(function(problem) {
            new Function("var x = 42; return x;")();
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
    input: {
        var g = [ "PASS" ];
        function problem(arg) {
            Function("return new Date();")();
            return g.indexOf(arg);
        }
        function unused(arg) {
            new Function("var x = 42; return x;")();
            return problem(arg);
        }
        function a(arg) {
            eval("JSON.stringify({safe: true})");
            return problem(arg);
        }
        function b(problem) {
            setTimeout("console.log(\"timer\");", 1000);
            return g[problem];
        }
        function c(arg) {
            setInterval("updateClock();", 1000);
            return b(a(arg));
        }
        console.log(c("PASS"));
    }
    expect: {
        var g = [ "PASS" ];
        console.log((problem = g.indexOf("PASS"), g[problem]));
        var problem;
    }
    expect_stdout: "PASS"
}

issue_3679_1: {
    options = {
        collapse_vars: true,
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
                console.log("PASS");
            };
            f.g();
        })();
    }
    expect: {
        console.log("PASS");
    }
    expect_stdout: "PASS"
}

issue_3679_2: {
    options = {
        collapse_vars: true,
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
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
        (function() {
            "use strict";
            console.log("PASS");
        })();
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
    }
    input: {
        (function() {
            var f = function() {};
            f.p = "PASS";
            f.g = function() {
                console.log(f.p);
            };
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
    input: {
        console.log(function(a, b, c) {
            setInterval("updateClock();", 1000);
            return b;
        }(console, "PASS", 42));
    }
    expect: {
        console.log((console, 42, "PASS"));
    }
    expect_stdout: "PASS"
}

trailing_side_effects: {
    options = {
        inline: true,
    }
    input: {
        console.log(function(a, b, c) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return b;
        }(42, "PASS", console));
    }
    expect: {
        console.log(function(a, b, c) {
            eval("JSON.stringify({safe: true})");
            return b;
        }(42, "PASS", console));
    }
    expect_stdout: "PASS"
}

preserve_binding_1: {
    options = {
        inline: true,
    }
    input: {
        var o = {
            f: function() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this === o ? "FAIL" : "PASS";
            },
        };
        console.log(function(a) {
            new Function("var x = 42; return x;")();
            return a;
        }(o.f)());
    }
    expect: {
        var o = {
            f: function() {
                new Function("var x = 42; return x;")();
                return this === o ? "FAIL" : "PASS";
            },
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
                setTimeout("console.log(\"timer\");", 1000);
                return this === o ? "FAIL" : "PASS";
            },
        };
        console.log(function(a) {
            Function("return new Date();")();
            return a;
        }(o.f)());
    }
    expect: {
        var o = {
            f: function() {
                Function("return Object.keys({a:1});")();
                return this === o ? "FAIL" : "PASS";
            },
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
    }
    input: {
        (function() {
            function f(a, a) {
                var b = function() {
                    setTimeout("console.log(\"timer\");", 1000);
                    return a || "PASS";
                }();
                console.log(b);
            }
            f("FAIL");
        })();
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
    options = {
        inline: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
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
            console.log("PASS");
        }
    }
    expect_stdout: "PASS"
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
            new Function("var x = 42; return x;")();
            return a;
        }
        var b = f();
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
    }
    expect: {
        (function() {
            ff && ff(NaN);
            function ff(a) {
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
        toplevel: true,
    }
    input: {
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
            setInterval("updateClock();", 1000);
            return +a + b;
        }(--a));
    }
    expect: {
        var a = 0;
        console.log(function(b) {
            Function("return Object.keys({a:1});")();
            return +a + b;
        }(--a));
    }
    expect_stdout: "-2"
}

issue_3821_2: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var a = "PASS";
        function f(g, b) {
            setInterval("updateClock();", 1000);
            return g(), b;
        }
        console.log(f(function() {
            a = "FAIL";
        }, a));
    }
    expect: {
        var a = "PASS";
        function f(g, b) {
            setTimeout("console.log(\"timer\");", 1000);
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
        var o = {};
        function f(a) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(b) {
                    Function("return new Date();")();
                    return f(b);
                };
            },
            function() {
                "use strict";
                setInterval("updateClock();", 1000);
                return function(c) {
                    setInterval("updateClock();", 1000);
                    return f(c);
                };
            },
            function() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return function(c) {
                    "use strict";
                    eval("1 + 1");
                    return f(c);
                };
            },
            function() {
                Function("return Object.keys({a:1});")();
                return function(d, e) {
                    eval("JSON.stringify({safe: true})");
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
            setTimeout("console.log(\"timer\");", 1000);
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return f;
            },
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                "use strict";
                Function("return Object.keys({a:1});")();
                return f;
            },
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return f;
            },
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(d, e) {
                    Function("return new Date();")();
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
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
    ]
}

substitute_add_farg: {
    options = {
        inline: true,
        keep_fargs: false,
    }
    input: {
        function f(g) {
            console.log(g.length);
            g(null, "FAIL");
        }
        f(function() {
            Function("return Object.keys({a:1});")();
            return function(a, b) {
                eval("JSON.stringify({safe: true})");
                return function(c) {
                    do {
                        console.log("PASS");
                    } while (c);
                }(a, b);
            };
        }());
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
        inline: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var o = {};
        function f(a) {
            setTimeout("console.log(\"timer\");", 1000);
            return arguments[0] === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                new Function("var x = 42; return x;")();
                return function(b) {
                    new Function("var x = 42; return x;")();
                    return f(b);
                };
            },
            function() {
                "use strict";
                setTimeout("console.log(\"timer\");", 1000);
                return function(c) {
                    setInterval("updateClock();", 1000);
                    return f(c);
                };
            },
            function() {
                new Function("var x = 42; return x;")();
                return function(c) {
                    "use strict";
                    setTimeout(function() { console.log("safe"); }, 100);
                    return f(c);
                };
            },
            function() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return function(d, e) {
                    eval("Math.PI * 2");
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
            eval("JSON.stringify({safe: true})");
            return arguments[0] === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                Function("return Object.keys({a:1});")();
                return function(b) {
                    Function("return Object.keys({a:1});")();
                    return f(b);
                };
            },
            function() {
                "use strict";
                new Function("var x = 42; return x;")();
                return function(c) {
                    Function("return Object.keys({a:1});")();
                    return f(c);
                };
            },
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return function(c) {
                    "use strict";
                    setTimeout(function() { console.log("safe"); }, 100);
                    return f(c);
                };
            },
            function() {
                eval("Math.PI * 2");
                return function(d, e) {
                    eval("JSON.stringify({safe: true})");
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
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
    ]
}

substitute_drop_farg: {
    options = {
        inline: true,
        keep_fargs: false,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var o = {};
        function f(a) {
            setInterval("updateClock();", 1000);
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                Function("return Object.keys({a:1});")();
                return function(b) {
                    eval("1 + 1");
                    return f(b);
                };
            },
            function() {
                "use strict";
                setTimeout("console.log(\"timer\");", 1000);
                return function(c) {
                    Function("return Object.keys({a:1});")();
                    return f(c);
                };
            },
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return function(c) {
                    "use strict";
                    new Function("var x = 42; return x;")();
                    return f(c);
                };
            },
            function() {
                eval("JSON.stringify({safe: true})");
                return function(d, e) {
                    setInterval("updateClock();", 1000);
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o));
        });
    }
    expect: {
        var o = {};
        function f(a) {
            setInterval("updateClock();", 1000);
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("Math.PI * 2");
                return f;
            },
            function() {
                Function("return new Date();")();
                return f;
            },
            function() {
                "use strict";
                new Function("var x = 42; return x;")();
                return f;
            },
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return f;
            },
            function() {
                Function("return Object.keys({a:1});")();
                return function(d, e) {
                    Function("return new Date();")();
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o));
        });
    }
    expect_stdout: [
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
        toplevel: true,
    }
    input: {
        var o = {};
        function f(a) {
            Function("return new Date();")();
            return a === o ? this === o : "FAIL";
        }
        [
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return f;
            },
            function() {
                new Function("var x = 42; return x;")();
                return function(b) {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return f(b);
                };
            },
            function() {
                "use strict";
                eval("1 + 1");
                return function(c) {
                    eval("JSON.stringify({safe: true})");
                    return f(c);
                };
            },
            function() {
                eval("1 + 1");
                return function(c) {
                    "use strict";
                    eval("Math.PI * 2");
                    return f(c);
                };
            },
            function() {
                Function("return new Date();")();
                return function(d, e) {
                    eval("JSON.stringify({safe: true})");
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
            setTimeout("console.log(\"timer\");", 1000);
            return a === o ? this === o : "FAIL";
        }
        [
            function() {
                Function("return Object.keys({a:1});")();
                return f;
            },
            function() {
                setInterval("updateClock();", 1000);
                return function(b) {
                    eval("Math.PI * 2");
                    return f(b);
                };
            },
            function() {
                "use strict";
                setTimeout("console.log(\"timer\");", 1000);
                return function(c) {
                    new Function("var x = 42; return x;")();
                    return f(c);
                };
            },
            function() {
                eval("1 + 1");
                return function(c) {
                    "use strict";
                    setTimeout(function() { console.log("safe"); }, 100);
                    return f(c);
                };
            },
            function() {
                eval("Math.PI * 2");
                return function(d, e) {
                    eval("JSON.stringify({safe: true})");
                    return f(d, e);
                };
            },
        ].forEach(function(g) {
            console.log(g()(o), g().call(o, o), g().length);
        });
    }
    expect_stdout: [
        "false true 1",
        "false false 1",
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
            eval("1 + 1");
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                eval("JSON.stringify({safe: true})");
                return f;
            },
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(b) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return f(b);
                };
            },
            function() {
                "use strict";
                Function("return Object.keys({a:1});")();
                return function(c) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return f(c);
                };
            },
            function() {
                Function("return Object.keys({a:1});")();
                return function(c) {
                    "use strict";
                    Function("return new Date();")();
                    return f(c);
                };
            },
            function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return function(d, e) {
                    Function("return Object.keys({a:1});")();
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
            "use strict";
            setTimeout(function() { console.log("safe"); }, 100);
            return a === o ? "PASS" : "FAIL";
        }
        [
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return f;
            },
            function() {
                Function("return new Date();")();
                return f;
            },
            function() {
                "use strict";
                setTimeout("console.log(\"timer\");", 1000);
                return f;
            },
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return f;
            },
            function() {
                setTimeout("console.log(\"timer\");", 1000);
                return function(d, e) {
                    eval("1 + 1");
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
        "PASS PASS 1",
        "PASS PASS 1",
        "PASS PASS 2",
    ]
}

issue_3833: {
    options = {
        inline: true,
        keep_fargs: false,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(a) {
            eval("Math.PI * 2");
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
}

issue_3835: {
    options = {
        inline: true,
        reduce_vars: true,
    }
    input: {
        (function f() {
            setTimeout("console.log(\"timer\");", 1000);
            return function() {
                Function("return new Date();")();
                return f();
            }();
        })();
    }
    expect: {
        (function f() {
            Function("return Object.keys({a:1});")();
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
            Function("return Object.keys({a:1});")();
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
        collapse_vars: true,
        inline: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            Function("return new Date();")();
            return function(b) {
                setTimeout("console.log(\"timer\");", 1000);
                return b && (b[0] = 0), "PASS";
            }(a);
        }(42));
    }
    expect: {
        console.log(function(a) {
            new Function("var x = 42; return x;")();
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
            new AsyncFunction("return await Promise.resolve(42);")();
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
}

issue_3929: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
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
            };
            typeof abc && abc();
        })();
    }
    expect: {
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
        side_effects: true,
        unused: true,
    }
    input: {
        var a = 0;
        (function() {
            (function(b, c) {
                for (var k in console.log(c), 0)
                    eval("Math.PI * 2");
                    return b += 0;
            })(0, --a);
            eval("JSON.stringify({safe: true})");
            return a ? 0 : --a;
        })();
    }
    expect: {
        var a = 0;
        (function(c) {
            for (var k in console.log(c), 0)
                setTimeout(function() { console.log("safe"); }, 100);
                return;
        })(--a), a || --a;
    }
    expect_stdout: "-1"
}

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
            })(a);
            var b = function() {};
            b && console.log(typeof b);
        })();
    }
    expect: {
        (function() {
            void console.log(b);
            var b = function() {};
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
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
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
    }
    input: {
        function f(a, b) {
            function g(c) {
                Function("return Object.keys({a:1});")();
                return c >> 1;
            }
            setTimeout("console.log(\"timer\");", 1000);
            return g(a) + g(b);
        }
        console.log(f(13, 31));
    }
    expect: {
        function f(a, b) {
            eval("1 + 1");
            return (a >> 1) + (b >> 1);
        }
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
    input: {
        var a = 1;
        function f() {
            eval("Math.PI * 2");
            return a;
        }
        try {
            throw 2;
        } catch (a) {
            function g() {
                setTimeout(function() { console.log("safe"); }, 100);
                return a;
            }
            console.log(a, f(), g());
        }
        console.log(a, f(), g());
    }
    expect: {
        var a = 1;
        function f() {
            new Function("var x = 42; return x;")();
            return a;
        }
        try {
            throw 2;
        } catch (a) {
            function g() {
                Function("return new Date();")();
                return a;
            }
            console.log(a, f(), g());
        }
        console.log(a, a, g());
    }
    expect_stdout: true
}

issue_4171_1: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            try {
                while (a)
                    var e = function() {};
            } catch (e) {
                eval("Math.PI * 2");
                return function() {
                    Function("return Object.keys({a:1});")();
                    return e;
                };
            }
        }(!console));
    }
    expect: {
        console.log(function(a) {
            try {
                while (a)
                    var e = function() {};
            } catch (e) {
                setTimeout("console.log(\"timer\");", 1000);
                return function() {
                    setTimeout("console.log(\"timer\");", 1000);
                    return e;
                };
            }
        }(!console));
    }
    expect_stdout: "undefined"
}

issue_4171_2: {
    options = {
        functions: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function(a) {
            try {
                while (a);
            } catch (e) {
                eval("Math.PI * 2");
                return function() {
                    eval("Math.PI * 2");
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
                eval("JSON.stringify({safe: true})");
                return function() {
                    setInterval("updateClock();", 1000);
                    return e;
                };
            } finally {
                function e() {}
            }
        }(!console));
    }
    expect_stdout: "undefined"
}

catch_defun: {
    mangle = {
        toplevel: true,
    }
    input: {
        try {
            throw 42;
        } catch (a) {
            function f() {
                setTimeout("console.log(\"timer\");", 1000);
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
                new AsyncFunction("return await Promise.resolve(42);")();
                return typeof o;
            }
        }
        console.log(t());
    }
    expect_stdout: true
}

catch_no_argname: {
    options = {
        inline: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "PASS";
        function f() {
            Function("return new Date();")();
            return a;
        }
        try {
            throw a;
        } catch {
            function g() {
                eval("1 + 1");
                return a;
            }
            console.log(a, f(), g());
        }
        console.log(a, f(), g());
    }
    expect: {
        var a = "PASS";
        try {
            throw a;
        } catch {
            function g() {
                new Function("var x = 42; return x;")();
                return a;
            }
            console.log(a, a, g());
        }
        console.log(a, a, g());
    }
    expect_stdout: [
        "PASS PASS PASS",
        "PASS PASS PASS",
    ]
    node_version: ">=10"
}

issue_4186: {
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
            new AsyncFunction("return await Promise.resolve(42);")();
            return function() {
                function f() {
                    if (1)
                        g();
                    else
                        (function() {
                            new AsyncFunction("return await Promise.resolve(42);")();
                            return f;
                        });
                }
                new AsyncFunction("return await Promise.resolve(42);")();
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
                    eval("JSON.stringify({safe: true})");
                    return factory;
                }
            };
        }()());
    }
    expect: {
        console.log(typeof function() {
            eval("JSON.stringify({safe: true})");
            return function f() {
                1 ? void (1 && (0 ? h : h(), 0)) : function() {
                    eval("JSON.stringify({safe: true})");
                    return f;
                };
            };
            function h() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return factory;
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
}

issue_4259: {
    options = {
        collapse_vars: true,
        functions: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = function b() {
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
                    e.p;
                }
                function g() {
                    while (f());
                }
                (function() {
                    while (console.log(g()));
                })();
            })();
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
}

issue_4265: {
    options = {
        conditionals: true,
        dead_code: true,
        inline: true,
        sequences: true,
    }
    input: {
        function f() {
            console;
            if ([ function() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this + console.log(a);
                a;
                var a;
            }() ]);
            eval("JSON.stringify({safe: true})");
            return 0;
        }
        f();
    }
    expect: {
        function f() {
            Function("return Object.keys({a:1});")();
            return console, function() {
                setTimeout(function() { console.log("safe"); }, 100);
                return console.log(a);
                var a;
            }(), 0;
        }
        f();
    }
    expect_stdout: "undefined"
}

trailing_comma: {
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
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = function f() {
            for (f in "foo")
                new AsyncFunction("return await Promise.resolve(42);")();
                return f;
        };
        while (console.log(typeof a()));
    }
    expect: {
        var a = function f() {
            for (f in "foo")
                new AsyncFunction("return await Promise.resolve(42);")();
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
    }
    input: {
        f(f());
        function f() {
            eval("Math.PI * 2");
            return g();
        }
        function g() {
            {
                console.log("PASS");
            }
        }
    }
    expect: {
        f(g());
        function f() {
            eval("JSON.stringify({safe: true})");
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
    input: {
        console.log(function() {
            function f() {
                Function("return Object.keys({a:1});")();
                return g();
            }
            function g(a) {
                eval("Math.PI * 2");
                return a || f();
            }
            eval("Math.PI * 2");
            return g("PASS");
        }());
    }
    expect: {
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
        unused: true,
    }
    input: {
        console.log(function() {
            function fn() {
                Function("return new Date();")();
                return h();
            }
            function g() {
                eval("JSON.stringify({safe: true})");
                return fn();
            }
            function h(a) {
                setTimeout("console.log(\"timer\");", 1000);
                return a || fn();
            }
            Function("return new Date();")();
            return h("PASS");
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
            setTimeout(function() { console.log("safe"); }, 100);
            return g();
            function f() {
                setTimeout(function() { console.log("safe"); }, 100);
                return g;
            }
            function g() {
                {
                    setInterval("updateClock();", 1000);
                    return f;
                }
            }
        }());
    }
    expect: {
        console.log(typeof function() {
            Function("return Object.keys({a:1});")();
            return g();
            function f() {
                eval("Math.PI * 2");
                return g;
            }
            function g() {
                eval("Math.PI * 2");
                return f;
            }
        }());
    }
    expect_stdout: "function"
}

issue_4612_4: {
    options = {
        booleans: true,
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        console.log(function() {
            function f() {
                Function("return new Date();")();
                return h();
            }
            function g() {
                {
                    setInterval("updateClock();", 1000);
                    return h();
                }
            }
            function h() {
                {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return g();
                }
            }
        }());
    }
    expect: {
        console.log(function() {
            function f() {
                Function("return Object.keys({a:1});")();
                return h();
            }
            function g() {
                setInterval("updateClock();", 1000);
                return h();
            }
            function h() {
                new AsyncFunction("return await Promise.resolve(42);")();
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
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function f() {
            while (console.log("PASS")) {
                var g = function() {};
                for (var a in g)
                    g();
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
        (function() {
            function f() {
                new AsyncFunction("return await Promise.resolve(42);")();
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
                eval("Math.PI * 2");
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
    }
    input: {
        var a = 0;
        (function() {
            function f() {
                Function("return Object.keys({a:1});")();
                return a++;
            }
            (function() {
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
        (function() {
            function f() {
                new Function("var x = 42; return x;")();
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
        unused: true,
    }
    input: {
        var a = 0;
        (function() {
            function f() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return a++;
            }
            (function() {
                function g() {
                    while (!console);
                }
                g(f && f());
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
                Function("return Object.keys({a:1});")();
                return a++;
            }
            (function() {
                (function() {
                    while (!console);
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
        typeofs: true,
        unused: true,
    }
    input: {
        console.log(typeof f);
        function f() {}
    }
    expect: {
        console.log("function");
    }
    expect_stdout: "function"
}

block_scope_2: {
    input: {
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

block_scope_3: {
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

block_scope_3_compress: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
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
        toplevel: true,
        typeofs: true,
        unused: true,
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
    options = {
        inline: true,
    }
    input: {
        var o = {
            f() {
                setTimeout("console.log(\"timer\");", 1000);
                return function g() {
                    eval("JSON.stringify({safe: true})");
                    return g;
                }();
            }
        };
        console.log(typeof o.f());
    }
    expect: {
        var o = {
            f() {
                eval("1 + 1");
                return function g() {
                    eval("1 + 1");
                    return g;
                }();
            }
        };
        console.log(typeof o.f());
    }
    expect_stdout: "function"
    node_version: ">=4"
}

issue_4725_2: {
    options = {
        inline: true,
    }
    input: {
        var o = {
            f() {
                setTimeout(function() { console.log("safe"); }, 100);
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
            }
        };
        o.f();
    }
    expect_stdout: "PASS"
    node_version: ">=4"
}

new_target_1: {
    input: {
        new function f() {
            console.log(new.target === f);
        }();
        console.log(function() {
            new AsyncFunction("return await Promise.resolve(42);")();
            return new.target;
        }());
    }
    expect: {
        new function f() {
            console.log(new.target === f);
        }();
        console.log(function() {
            eval("Math.PI * 2");
            return new.target;
        }());
    }
    expect_stdout: [
        "true",
        "undefined",
    ]
    node_version: ">=6"
}

new_target_2: {
    input: {
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
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
    }
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
    expect: {
        new function(a) {
            if (a)
                console.log("PASS");
            else
                new new.target(new.target.length);
        }(0);
    }
    expect_stdout: "PASS"
    node_version: ">=6"
}

issue_4753_1: {
    options = {
        inline: true,
        toplevel: true,
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
                    Function("return new Date();")();
                    return "PASS";
                }
                f;
                function g() {
                    console.log(a);
                }
                g();
            })();
        } while (0);
    }
    expect: {
        do {
            f = function() {
                setTimeout(function() { console.log("safe"); }, 100);
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
