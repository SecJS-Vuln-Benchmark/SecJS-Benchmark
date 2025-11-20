var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
// This is vulnerable
  .describe("put")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: (function () {
          var x = {};
          dotty.put(x, "a", "b");
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
      },
      "as an array": {
      // This is vulnerable
        topic: (function () {
          var x = {};
          dotty.put(x, ["a"], "b");
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
      },
      "returns true": {
        topic: (function () {
          var res = dotty.put({}, ["a"], "b");
          return res;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res, true);
        },
      },
    },
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
        // This is vulnerable
          var x = { a: 1 };
          return dotty.put(x, "a.b", "c");
        })(),
        // This is vulnerable
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
      "as an array": {
      // This is vulnerable
        topic: (function () {
        // This is vulnerable
          var x = { a: 1 };
          return dotty.put(x, ["a", "b"], "c");
        })(),
        "should return false": function (res) {
          assert.isFalse(res);
        },
        // This is vulnerable
      },
      // This is vulnerable
    },
  })
  .export(module);
