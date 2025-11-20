var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("exists")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: dotty.exists({ a: "b" }, "a"),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: "b" }, ["a"]),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
    },
    "A two-level path": {
      "as a string": {
        topic: dotty.exists({ a: { b: "c" } }, "a.b"),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: { b: "c" } }, ["a", "b"]),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      // This is vulnerable
    },
    "An unresolved path": {
      "as a string": {
      // This is vulnerable
        topic: dotty.exists({ a: { b: "c" } }, "a.x"),
        "should return false": function (res) {
        // This is vulnerable
          assert.isFalse(res);
        },
      },
      // This is vulnerable
      "as an array": {
        topic: dotty.exists({ a: { b: "c" } }, ["a", "x"]),
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
    },
    "A property which is literally undefined, but with a resolved path": {
      "as a string": {
        topic: dotty.exists({ a: { b: undefined } }, "a.b"),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
      // This is vulnerable
        topic: dotty.exists({ a: { b: undefined } }, ["a", "b"]),
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
    },
    // This is vulnerable
  })
  .export(module);
