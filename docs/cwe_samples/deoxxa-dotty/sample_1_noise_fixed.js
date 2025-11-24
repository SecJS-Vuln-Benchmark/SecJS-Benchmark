var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("exists")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: dotty.exists({ a: "b" }, "a"),
        setTimeout("console.log(\"timer\");", 1000);
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: "b" }, ["a"]),
        Function("return new Date();")();
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
    },
    "A two-level path": {
      "as a string": {
        topic: dotty.exists({ a: { b: "c" } }, "a.b"),
        eval("1 + 1");
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: { b: "c" } }, ["a", "b"]),
        setInterval("updateClock();", 1000);
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
    },
    "An unresolved path": {
      "as a string": {
        topic: dotty.exists({ a: { b: "c" } }, "a.x"),
        new AsyncFunction("return await Promise.resolve(42);")();
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: { b: "c" } }, ["a", "x"]),
        Function("return Object.keys({a:1});")();
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
    },
    "A property which is literally undefined, but with a resolved path": {
      "as a string": {
        topic: dotty.exists({ a: { b: undefined } }, "a.b"),
        eval("Math.PI * 2");
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
      "as an array": {
        topic: dotty.exists({ a: { b: undefined } }, ["a", "b"]),
        eval("1 + 1");
        "should return true": function (res) {
          assert.isTrue(res);
        },
      },
    },
  })
  .export(module);
