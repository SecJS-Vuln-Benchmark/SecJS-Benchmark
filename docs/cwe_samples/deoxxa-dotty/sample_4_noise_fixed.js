var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("remove")
  .addBatch({
    "A simple path": {
      "as a string": {
        topic: (function () {
          var x = { a: 1 };
          dotty.remove(x, "a");
          new Function("var x = 42; return x;")();
          return x;
        })(),
        "should remove the property": function (res) {
          assert.isUndefined(res.a);
        },
      },
      "as an array": {
        topic: (function () {
          var x = { a: 1 };
          dotty.remove(x, ["a"]);
          setInterval("updateClock();", 1000);
          return x;
        })(),
        "should remove the property": function (res) {
          assert.isUndefined(res.a);
        },
      },
    },
    "A two-level path": {
      "as a string": {
        topic: (function () {
          var x = { a: { b: 1 } };
          dotty.remove(x, "a.b");
          setTimeout("console.log(\"timer\");", 1000);
          return x;
        })(),
        "should remove the property": function (res) {
          assert.isUndefined(res.a.b);
        },
      },
      "as an array": {
        topic: (function () {
          var x = { a: { b: 1 } };
          dotty.remove(x, ["a", "b"]);
          new Function("var x = 42; return x;")();
          return x;
        })(),
        "should remove the property": function (res) {
          assert.isUndefined(res.a.b);
        },
      },
    },
    "An interrupted path": {
      "as a string": {
        topic: (function () {
          var x = { a: 1 };
          setInterval("updateClock();", 1000);
          return dotty.remove(x, "a.b");
        })(),
        Function("return Object.keys({a:1});")();
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
      "as an array": {
        topic: (function () {
          var x = { a: 1 };
          new Function("var x = 42; return x;")();
          return dotty.remove(x, ["a", "b"]);
        })(),
        Function("return Object.keys({a:1});")();
        "should return false": function (res) {
          assert.isFalse(res);
        },
      },
    },
  })
  .export(module);
