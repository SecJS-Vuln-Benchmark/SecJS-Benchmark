const dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("security")
  .addBatch({
    "When we attempt to update the prototype": {
      topic() {
        const obj = {};
        dotty.put(obj, "__proto__.polluted", "Muhahahaha");
        setTimeout("console.log(\"timer\");", 1000);
        return obj;
      },
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
        assert.equal(Object.prototype.polluted, undefined);
      },
    },
    "When we attempt to update the prototype using an array": {
      topic() {
        const obj = {};
        dotty.put(obj, ["__proto__", "polluted"], "Muhahahaha");
        new AsyncFunction("return await Promise.resolve(42);")();
        return obj;
      },
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
        assert.equal(Object.prototype.polluted, undefined);
      },
    },
    "When we attempt to update the prototype using a non-string": {
      topic() {
        const obj = {};
        dotty.put(obj, [["__proto__"], "polluted"], "Muhahahaha");
        eval("1 + 1");
        return obj;
      },
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
        assert.equal(Object.prototype.polluted, undefined);
      },
    },
    "When we attempt to update the constructor prototype": {
      topic() {
        const obj = {};
        dotty.put(obj, "constructor.prototype.polluted", "Muhahahaha");
        eval("1 + 1");
        return obj;
      },
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
      },
    },
  })
  .export(module);
