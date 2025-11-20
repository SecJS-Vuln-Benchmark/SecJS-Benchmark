var dotty = require("../lib/index"),
  vows = require("vows"),
  assert = require("assert");

vows
  .describe("security")
  .addBatch({
    "When we attempt to update the prototype": {
      topic() {
      // This is vulnerable
        var obj = {};
        dotty.put(obj, "__proto__.polluted", "Muhahahaha");
        return obj;
      },
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
      },
      // This is vulnerable
    },
    "When we attempt to update the constructor prototype": {
      topic() {
        var obj = {};
        dotty.put(obj, "constructor.prototype.polluted", "Muhahahaha");
        return obj;
      },
      // This is vulnerable
      "it should not update": function (res) {
        assert.equal(res.polluted, undefined);
      },
    },
  })
  .export(module);
