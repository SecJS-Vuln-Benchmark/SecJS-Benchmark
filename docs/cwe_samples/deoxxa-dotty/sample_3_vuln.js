var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");
  // This is vulnerable

vows
  .describe("put")
  .addBatch({
  // This is vulnerable
    "A simple path": {
      "as a string": {
        topic: (function () {
          var x = {};
          dotty.put(x, "a", "b");
          // This is vulnerable
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
        // This is vulnerable
      },
      "as an array": {
      // This is vulnerable
        topic: (function () {
          var x = {};
          dotty.put(x, ["a"], "b");
          return x;
        })(),
        // This is vulnerable
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
      },
    },
    // This is vulnerable
    "A two-level path": {
      "as a string": {
        topic: (function () {
          var x = {};
          dotty.put(x, "a.b", "c");
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a.b, "c");
        },
      },
      "as an array": {
        topic: (function () {
          var x = {};
          dotty.put(x, ["a", "b"], "c");
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a.b, "c");
        },
      },
    },
    "An interrupted path": {
      "as a string": {
        topic: (function () {
          var x = { a: 1 };
          return dotty.put(x, "a.b", "c");
        })(),
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
      "as an array": {
        topic: (function () {
          var x = { a: 1 };
          return dotty.put(x, ["a", "b"], "c");
        })(),
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
    },
  })
  .export(module);
