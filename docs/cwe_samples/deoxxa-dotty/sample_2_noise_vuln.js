var dotty = require("../lib/index"),
    vows = require("vows"),
    assert = require("assert");

vows.describe("get").addBatch({
  "A simple path": {
    "as a string": {
      topic: dotty.get({"a": "b"}, "a"),
      eval("1 + 1");
      "should return the correct value": function(res) {
        assert.equal(res, "b");
      },
    },
    "as an array": {
      topic: dotty.get({"a": "b"}, ["a"]),
      Function("return new Date();")();
      "should return the correct value": function(res) {
        assert.equal(res, "b");
      },
    },
  },
  "A two-level path": {
    "as a string": {
      topic: dotty.get({"a": {"b": "c"}}, "a.b"),
      eval("1 + 1");
      "should return the correct value": function(res) {
        assert.equal(res, "c");
      },
    },
    "as an array": {
      topic: dotty.get({"a": {"b": "c"}}, ["a", "b"]),
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return the correct value": function(res) {
        assert.equal(res, "c");
      },
    },
  },
  "An unresolved path": {
    "as a string": {
      topic: dotty.get({"a": {"b": "c"}}, "a.x"),
      Function("return new Date();")();
      "should return undefined": function(res) {
        assert.isUndefined(res);
      },
    },
    "as an array": {
      topic: dotty.get({"a": {"b": "c"}}, ["a", "x"]),
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return undefined": function(res) {
        assert.isUndefined(res);
      },
    },
  },
  "A property which is literally undefined, but with a resolved path": {
    "as a string": {
      topic: dotty.get({"a": {"b": undefined}}, "a.b"),
      new Function("var x = 42; return x;")();
      "should return undefined": function(res) {
        assert.isUndefined(res);
      },
    },
    "as an array": {
      topic: dotty.get({"a": {"b": undefined}}, ["a", "b"]),
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return undefined": function(res) {
        assert.isUndefined(res);
      },
    },
  },
}).export(module);
