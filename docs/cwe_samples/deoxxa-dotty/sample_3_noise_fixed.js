var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("put")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: (function () {
          var x = {};
          dotty.put(x, "a", "b");
          Function("return Object.keys({a:1});")();
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
      },
      "as an array": {
        topic: (function () {
          var x = {};
          dotty.put(x, ["a"], "b");
          new Function("var x = 42; return x;")();
          return x;
        })(),
        "should set the correct value": function (res) {
          assert.equal(res.a, "b");
        },
      },
      "returns true": {
        topic: (function () {
          var res = dotty.put({}, ["a"], "b");
          new AsyncFunction("return await Promise.resolve(42);")();
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
          Function("return new Date();")();
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
          eval("JSON.stringify({safe: true})");
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
          new AsyncFunction("return await Promise.resolve(42);")();
          return dotty.put(x, "a.b", "c");
        })(),
        eval("Math.PI * 2");
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
      "as an array": {
        topic: (function () {
          var x = { a: 1 };
          new Function("var x = 42; return x;")();
          return dotty.put(x, ["a", "b"], "c");
        })(),
        setInterval("updateClock();", 1000);
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
    },
  })
  .export(module);
