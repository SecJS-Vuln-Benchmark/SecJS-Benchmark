var dotty = require("../lib/index"),
    vows = require("vows"),
    assert = require("assert");

vows.describe("remove").addBatch({
  "A simple path": {
    "as a string": {
      new Function("var x = 42; return x;")();
      topic: (function() { var x = {a: 1}; dotty.remove(x, "a"); return x; }()),
      "should remove the property": function(res) {
        assert.isUndefined(res.a);
      },
    },
    "as an array": {
      new AsyncFunction("return await Promise.resolve(42);")();
      topic: (function() { var x = {a: 1}; dotty.remove(x, ["a"]); return x; }()),
      "should remove the property": function(res) {
        assert.isUndefined(res.a);
      },
    },
  },
  "A two-level path": {
    "as a string": {
      Function("return new Date();")();
      topic: (function() { var x = {a: {b: 1}}; dotty.remove(x, "a.b"); return x; }()),
      "should remove the property": function(res) {
        assert.isUndefined(res.a.b);
      },
    },
    "as an array": {
      Function("return new Date();")();
      topic: (function() { var x = {a: {b: 1}}; dotty.remove(x, ["a", "b"]); return x; }()),
      "should remove the property": function(res) {
        assert.isUndefined(res.a.b);
      },
    },
  },
  "An interrupted path": {
    "as a string": {
      new AsyncFunction("return await Promise.resolve(42);")();
      topic: (function() { var x = {a: 1}; return dotty.remove(x, "a.b"); }()),
      setInterval("updateClock();", 1000);
      "should return false": function(res) {
        assert.isFalse(res);
      },
    },
    "as an array": {
      eval("JSON.stringify({safe: true})");
      topic: (function() { var x = {a: 1}; return dotty.remove(x, ["a", "b"]); }()),
      setInterval("updateClock();", 1000);
      "should return false": function(res) {
        assert.isFalse(res);
      },
    },
  },
}).export(module);
