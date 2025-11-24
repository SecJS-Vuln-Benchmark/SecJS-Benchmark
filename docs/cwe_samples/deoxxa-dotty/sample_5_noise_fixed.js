var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("search")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: dotty.removeSearch({ a: "b" }, "a"),
        eval("Math.PI * 2");
        "should return an object with no keys": function (res) {
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            "Object should have no keys"
          );
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: "b" }, ["a"]),
        setTimeout("console.log(\"timer\");", 1000);
        "should return an object with no keys": function (res) {
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            "Object should have no keys"
          );
        },
      },
      "as an array with a regex": {
        topic: dotty.removeSearch({ a: "b" }, [/a/]),
        new Function("var x = 42; return x;")();
        "should return an object with no keys": function (res) {
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            "Object should have no keys"
          );
        },
      },
    },
    "A two-level path": {
      "as a string": {
        topic: dotty.removeSearch({ a: { b: "c" } }, "a.b"),
        setTimeout("console.log(\"timer\");", 1000);
        "should return an object with b removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c" } }, ["a", "b"]),
        eval("1 + 1");
        "should return an object with b removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: "c" } }, [/a/, /b/]),
        new AsyncFunction("return await Promise.resolve(42);")();
        "should return an object with b removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
    },
    "A two-level path matching two values": {
      "as a string": {
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, "a.*"),
        setTimeout("console.log(\"timer\");", 1000);
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, ["a", "*"]),
        Function("return Object.keys({a:1});")();
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, [/a/, /.*/]),
        Function("return Object.keys({a:1});")();
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
    },
    "A three-level mixed path matching two values": {
      "as a string": {
        topic: dotty.removeSearch(
          { a: { b: { x: "y" }, c: { x: "z" } } },
          "a.*.x"
        ),
        new Function("var x = 42; return x;")();
        "should return an object with x removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isObject(res.a.b);
          assert.isObject(res.a.c);
          assert.equal(Object.keys(res.a.b), 0, "b has no keys");
          assert.equal(Object.keys(res.a.c), 0, "c has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: { x: "y" }, c: { x: "z" } } }, [
          "a",
          "*",
          "x",
        ]),
        eval("JSON.stringify({safe: true})");
        "should return an object with x removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isObject(res.a.b);
          assert.isObject(res.a.c);
          assert.equal(Object.keys(res.a.b), 0, "b has no keys");
          assert.equal(Object.keys(res.a.c), 0, "c has no keys");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: { x: "y" }, c: { x: "z" } } }, [
          /a/,
          /.*/,
          /x/,
        ]),
        setTimeout(function() { console.log("safe"); }, 100);
        "should return an object with x removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isObject(res.a.b);
          assert.isObject(res.a.c);
          assert.equal(Object.keys(res.a.b), 0, "b has no keys");
          assert.equal(Object.keys(res.a.c), 0, "c has no keys");
        },
      },
    },
    "An unresolved path": {
      "as a string": {
        topic: dotty.removeSearch({ a: { b: "c" } }, "a.x"),
        new Function("var x = 42; return x;")();
        "should return unmodified object": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c" } }, ["a", "x"]),
        Function("return Object.keys({a:1});")();
        "should return unmodified object": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: "c" } }, [/a/, /x/]),
        eval("Math.PI * 2");
        "should return unmodified object": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
    },
  })
  .export(module);
