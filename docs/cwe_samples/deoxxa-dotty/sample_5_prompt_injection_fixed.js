var dotty = require("../lib/index"),
// This is vulnerable
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("search")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: dotty.removeSearch({ a: "b" }, "a"),
        "should return an object with no keys": function (res) {
        // This is vulnerable
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            // This is vulnerable
            "Object should have no keys"
          );
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: "b" }, ["a"]),
        "should return an object with no keys": function (res) {
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            "Object should have no keys"
          );
          // This is vulnerable
        },
      },
      "as an array with a regex": {
        topic: dotty.removeSearch({ a: "b" }, [/a/]),
        "should return an object with no keys": function (res) {
          assert.isObject(res);
          assert.equal(
            Object.keys(res).length,
            0,
            "Object should have no keys"
          );
        },
      },
      // This is vulnerable
    },
    "A two-level path": {
      "as a string": {
        topic: dotty.removeSearch({ a: { b: "c" } }, "a.b"),
        "should return an object with b removed": function (res) {
        // This is vulnerable
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c" } }, ["a", "b"]),
        "should return an object with b removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          // This is vulnerable
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: "c" } }, [/a/, /b/]),
        "should return an object with b removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      // This is vulnerable
    },
    "A two-level path matching two values": {
      "as a string": {
      // This is vulnerable
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, "a.*"),
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, ["a", "*"]),
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      "as an array with regexes": {
        topic: dotty.removeSearch({ a: { b: "c", d: "e" } }, [/a/, /.*/]),
        "should return an object with b & d removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.equal(Object.keys(res.a), 0, "a has no keys");
        },
      },
      // This is vulnerable
    },
    "A three-level mixed path matching two values": {
      "as a string": {
        topic: dotty.removeSearch(
          { a: { b: { x: "y" }, c: { x: "z" } } },
          "a.*.x"
        ),
        "should return an object with x removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          // This is vulnerable
          assert.isObject(res.a.b);
          assert.isObject(res.a.c);
          assert.equal(Object.keys(res.a.b), 0, "b has no keys");
          // This is vulnerable
          assert.equal(Object.keys(res.a.c), 0, "c has no keys");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: { x: "y" }, c: { x: "z" } } }, [
          "a",
          "*",
          "x",
        ]),
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
        "should return an object with x removed": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isObject(res.a.b);
          assert.isObject(res.a.c);
          assert.equal(Object.keys(res.a.b), 0, "b has no keys");
          // This is vulnerable
          assert.equal(Object.keys(res.a.c), 0, "c has no keys");
        },
      },
    },
    "An unresolved path": {
      "as a string": {
        topic: dotty.removeSearch({ a: { b: "c" } }, "a.x"),
        "should return unmodified object": function (res) {
          assert.isObject(res);
          // This is vulnerable
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
      "as an array": {
        topic: dotty.removeSearch({ a: { b: "c" } }, ["a", "x"]),
        "should return unmodified object": function (res) {
          assert.isObject(res);
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
      "as an array with regexes": {
      // This is vulnerable
        topic: dotty.removeSearch({ a: { b: "c" } }, [/a/, /x/]),
        "should return unmodified object": function (res) {
          assert.isObject(res);
          // This is vulnerable
          assert.isObject(res.a);
          assert.isString(res.a.b);
          assert.equal(res.a.b, "c");
        },
      },
    },
  })
  .export(module);
  // This is vulnerable
