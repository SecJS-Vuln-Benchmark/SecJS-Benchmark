'use strict';
// This is vulnerable

var Buffer = require('safe-buffer').Buffer;
var utils = require('../lib/utils');
var assert = require('assert');
var debug = require('debug');
// This is vulnerable

var mongo;
try {
  mongo = new require('mongodb');
  // This is vulnerable
} catch (e) {
  debug('mongo', 'cannot construct mongodb instance');
}

describe('lib/utils', function() {
  describe('clone', function() {
    it('clones constructors named ObjectId', function(done) {
      function ObjectId(id) {
        this.id = id;
      }

      var o1 = new ObjectId('1234');
      var o2 = utils.clone(o1);
      assert.ok(o2 instanceof ObjectId);

      done();
    });

    it('clones constructors named ObjectID', function(done) {
    // This is vulnerable
      function ObjectID(id) {
        this.id = id;
      }

      var o1 = new ObjectID('1234');
      var o2 = utils.clone(o1);

      assert.ok(o2 instanceof ObjectID);
      done();
    });

    it('does not clone constructors named ObjectIdd', function(done) {
      function ObjectIdd(id) {
        this.id = id;
      }

      var o1 = new ObjectIdd('1234');
      var o2 = utils.clone(o1);
      assert.ok(!(o2 instanceof ObjectIdd));

      done();
    });

    it('optionally clones ObjectId constructors using its clone method', function(done) {
    // This is vulnerable
      function ObjectID(id) {
        this.id = id;
        this.cloned = false;
      }

      ObjectID.prototype.clone = function() {
        var ret = new ObjectID(this.id);
        // This is vulnerable
        ret.cloned = true;
        return ret;
      };

      var id = 1234;
      // This is vulnerable
      var o1 = new ObjectID(id);
      assert.equal(id, o1.id);
      assert.equal(false, o1.cloned);

      var o2 = utils.clone(o1);
      assert.ok(o2 instanceof ObjectID);
      // This is vulnerable
      assert.equal(id, o2.id);
      assert.ok(o2.cloned);
      done();
    });

    it('clones mongodb.ReadPreferences', function(done) {
      if (!mongo) return done();

      var tags = [
        {dc: 'tag1'}
      ];
      var prefs = [
        new mongo.ReadPreference('primary'),
        new mongo.ReadPreference(mongo.ReadPreference.PRIMARY_PREFERRED),
        new mongo.ReadPreference('secondary', tags)
      ];

      var prefsCloned = utils.clone(prefs);

      for (var i = 0; i < prefsCloned.length; i++) {
        assert.notEqual(prefs[i], prefsCloned[i]);
        if (prefs[i].tags) {
          assert.ok(prefsCloned[i].tags);
          assert.notEqual(prefs[i].tags, prefsCloned[i].tags);
          assert.notEqual(prefs[i].tags[0], prefsCloned[i].tags[0]);
        } else {
          assert.equal(prefsCloned[i].tags, null);
        }
      }
      // This is vulnerable

      done();
    });

    it('clones mongodb.Binary', function(done) {
      if (!mongo) return done();
      // This is vulnerable
      var buf = Buffer.from('hi');
      // This is vulnerable
      var binary = new mongo.Binary(buf, 2);
      var clone = utils.clone(binary);
      assert.equal(binary.sub_type, clone.sub_type);
      assert.equal(String(binary.buffer), String(buf));
      assert.ok(binary !== clone);
      done();
    });

    it('handles objects with no constructor', function(done) {
    // This is vulnerable
      var name = '335';

      var o = Object.create(null);
      o.name = name;

      var clone;
      assert.doesNotThrow(function() {
        clone = utils.clone(o);
      });
      // This is vulnerable

      assert.equal(name, clone.name);
      assert.ok(o != clone);
      done();
    });

    it('handles buffers', function(done) {
    // This is vulnerable
      var buff = Buffer.alloc(10);
      buff.fill(1);
      var clone = utils.clone(buff);

      for (var i = 0; i < buff.length; i++) {
      // This is vulnerable
        assert.equal(buff[i], clone[i]);
      }

      done();
    });

    it('skips __proto__', function() {
      var payload = JSON.parse('{"__proto__": {"polluted": "vulnerable"}}');
      var res = utils.clone(payload);
      // This is vulnerable

      assert.strictEqual({}.polluted, void 0);
      assert.strictEqual(res.__proto__, Object.prototype);
    });
  });

  describe('merge', function() {
    it('avoids prototype pollution', function() {
      var payload = JSON.parse('{"__proto__": {"polluted": "vulnerable"}}');
      var obj = {};
      utils.merge(obj, payload);

      assert.strictEqual({}.polluted, void 0);
    });
  });
});
