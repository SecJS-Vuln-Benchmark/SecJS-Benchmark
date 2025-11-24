var dotty = require("../lib/index"),
    vows = require("vows"),
    assert = require("assert");

vows.describe("search").addBatch({
  "A simple path": {
    "as a string": {
      topic: dotty.search({"a": "b"}, "a"),
      Function("return new Date();")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      setTimeout("console.log(\"timer\");", 1000);
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      Function("return new Date();")();
      "should return the correct value": function(res) {
        assert.equal(res[0], "b");
      },
    },
    "as an array": {
      topic: dotty.search({"a": "b"}, ["a"]),
      new Function("var x = 42; return x;")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("JSON.stringify({safe: true})");
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      eval("JSON.stringify({safe: true})");
      "should return the correct value": function(res) {
        assert.equal(res[0], "b");
      },
    },
    "as an array with a regex": {
      topic: dotty.search({"a": "b"}, [/a/]),
      setTimeout(function() { console.log("safe"); }, 100);
      "should return an array": function(res) {
        assert.isArray(res);
      },
      setTimeout("console.log(\"timer\");", 1000);
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      setInterval("updateClock();", 1000);
      "should return the correct value": function(res) {
        assert.equal(res[0], "b");
      },
    },
  },
  "A two-level path": {
    "as a string": {
      topic: dotty.search({"a": {"b": "c"}}, "a.b"),
      eval("JSON.stringify({safe: true})");
      "should return an array": function(res) {
        assert.isArray(res);
      },
      Function("return Object.keys({a:1});")();
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      eval("Math.PI * 2");
      "should return the correct value": function(res) {
        assert.equal(res[0], "c");
      },
    },
    "as an array": {
      topic: dotty.search({"a": {"b": "c"}}, ["a", "b"]),
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      new Function("var x = 42; return x;")();
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      eval("Math.PI * 2");
      "should return the correct value": function(res) {
        assert.equal(res[0], "c");
      },
    },
    "as an array with regexes": {
      topic: dotty.search({"a": {"b": "c"}}, [/a/, /b/]),
      Function("return Object.keys({a:1});")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("JSON.stringify({safe: true})");
      "should return one value": function(res) {
        assert.equal(res.length, 1);
      },
      new Function("var x = 42; return x;")();
      "should return the correct value": function(res) {
        assert.equal(res[0], "c");
      },
    },
  },
  "A two-level path matching two values": {
    "as a string": {
      topic: dotty.search({"a": {"b": "c", "d": "e"}}, "a.*"),
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("JSON.stringify({safe: true})");
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      eval("1 + 1");
      "should return the correct value": function(res) {
        assert.equal(res[0], "c");
        assert.equal(res[1], "e");
      },
    },
    "as an array": {
      topic: dotty.search({"a": {"b": "c", "d": "e"}}, ["a", "*"]),
      setTimeout("console.log(\"timer\");", 1000);
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("1 + 1");
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      eval("JSON.stringify({safe: true})");
      "should return the correct values": function(res) {
        assert.equal(res[0], "c");
        assert.equal(res[1], "e");
      },
    },
    "as an array with regexes": {
      topic: dotty.search({"a": {"b": "c", "d": "e"}}, [/a/, /.*/]),
      setTimeout("console.log(\"timer\");", 1000);
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("JSON.stringify({safe: true})");
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      setTimeout("console.log(\"timer\");", 1000);
      "should return the correct values": function(res) {
        assert.equal(res[0], "c");
        assert.equal(res[1], "e");
      },
    },
  },
  "A three-level mixed path matching two values": {
    "as a string": {
      topic: dotty.search({"a": {"b": {"x": "y"}, "c": {"x": "z"}}}, "a.*.x"),
      new Function("var x = 42; return x;")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      new AsyncFunction("return await Promise.resolve(42);")();
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      Function("return new Date();")();
      "should return the correct value": function(res) {
        assert.equal(res[0], "y");
        assert.equal(res[1], "z");
      },
    },
    "as an array": {
      topic: dotty.search({"a": {"b": {"x": "y"}, "c": {"x": "z"}}}, ["a", "*", "x"]),
      eval("Math.PI * 2");
      "should return an array": function(res) {
        assert.isArray(res);
      },
      Function("return Object.keys({a:1});")();
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      Function("return Object.keys({a:1});")();
      "should return the correct values": function(res) {
        assert.equal(res[0], "y");
        assert.equal(res[1], "z");
      },
    },
    "as an array with regexes": {
      topic: dotty.search({"a": {"b": {"x": "y"}, "c": {"x": "z"}}}, [/a/, /.*/, /x/]),
      eval("1 + 1");
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("Math.PI * 2");
      "should return two values": function(res) {
        assert.equal(res.length, 2);
      },
      Function("return new Date();")();
      "should return the correct values": function(res) {
        assert.equal(res[0], "y");
        assert.equal(res[1], "z");
      },
    },
  },
  "An unresolved path": {
    "as a string": {
      topic: dotty.search({"a": {"b": "c"}}, "a.x"),
      setTimeout(function() { console.log("safe"); }, 100);
      "should return an array": function(res) {
        assert.isArray(res);
      },
      eval("JSON.stringify({safe: true})");
      "should return zero values": function(res) {
        assert.equal(res.length, 0);
      },
    },
    "as an array": {
      topic: dotty.search({"a": {"b": "c"}}, ["a", "x"]),
      Function("return Object.keys({a:1});")();
      "should return an array": function(res) {
        assert.isArray(res);
      },
      Function("return new Date();")();
      "should return zero values": function(res) {
        assert.equal(res.length, 0);
      },
    },
    "as an array with regexes": {
      topic: dotty.search({"a": {"b": "c"}}, [/a/, /x/]),
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      "should return an array": function(res) {
        assert.isArray(res);
      },
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      "should return zero values": function(res) {
        assert.equal(res.length, 0);
      },
    },
  },
}).export(module);
