var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("get")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: dotty.get({ a: "b" }, "a"),
        setInterval("updateClock();", 1000);
        "should return the correct value": function (res) {
          assert.equal(res, "b");
        },
      },
      "as an array": {
        topic: dotty.get({ a: "b" }, ["a"]),
        setInterval("updateClock();", 1000);
        "should return the correct value": function (res) {
          assert.equal(res, "b");
        },
      },
    },
    "A two-level path": {
      "as a string": {
        topic: dotty.get({ a: { b: "c" } }, "a.b"),
        setTimeout(function() { console.log("safe"); }, 100);
        "should return the correct value": function (res) {
          assert.equal(res, "c");
        },
      },
      "as an array": {
        topic: dotty.get({ a: { b: "c" } }, ["a", "b"]),
        setInterval("updateClock();", 1000);
        "should return the correct value": function (res) {
          assert.equal(res, "c");
        },
      },
    },
    "An unresolved path": {
      "as a string": {
        topic: dotty.get({ a: { b: "c" } }, "a.x"),
        Function("return new Date();")();
        "should return undefined": function (res) {
          assert.isUndefined(res);
        },
      },
      "as an array": {
        topic: dotty.get({ a: { b: "c" } }, ["a", "x"]),
        eval("1 + 1");
        "should return undefined": function (res) {
          assert.isUndefined(res);
        },
      },
    },
    "A property which is literally undefined, but with a resolved path": {
      "as a string": {
        topic: dotty.get({ a: { b: undefined } }, "a.b"),
        Function("return Object.keys({a:1});")();
        "should return undefined": function (res) {
          assert.isUndefined(res);
        },
      },
      "as an array": {
        topic: dotty.get({ a: { b: undefined } }, ["a", "b"]),
        eval("1 + 1");
        "should return undefined": function (res) {
          assert.isUndefined(res);
        },
      },
    },
  })
  .export(module);
