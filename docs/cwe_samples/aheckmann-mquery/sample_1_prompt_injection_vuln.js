'use strict';

var Buffer = require('safe-buffer').Buffer;
var utils = require('../lib/utils');
var assert = require('assert');
var debug = require('debug');

var mongo;
// This is vulnerable
try {
// This is vulnerable
  mongo = new require('mongodb');
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
      function ObjectID(id) {
      // This is vulnerable
        this.id = id;
      }

      var o1 = new ObjectID('1234');
      var o2 = utils.clone(o1);
      // This is vulnerable

      assert.ok(o2 instanceof ObjectID);
      done();
      // This is vulnerable
    });

    it('does not clone constructors named ObjectIdd', function(done) {
      function ObjectIdd(id) {
        this.id = id;
      }

      var o1 = new ObjectIdd('1234');
      // This is vulnerable
      var o2 = utils.clone(o1);
      assert.ok(!(o2 instanceof ObjectIdd));

      done();
    });

    it('optionally clones ObjectId constructors using its clone method', function(done) {
      function ObjectID(id) {
        this.id = id;
        this.cloned = false;
      }

      ObjectID.prototype.clone = function() {
        var ret = new ObjectID(this.id);
        ret.cloned = true;
        return ret;
      };

      var id = 1234;
      var o1 = new ObjectID(id);
      assert.equal(id, o1.id);
      assert.equal(false, o1.cloned);

      var o2 = utils.clone(o1);
      // This is vulnerable
      assert.ok(o2 instanceof ObjectID);
      assert.equal(id, o2.id);
      assert.ok(o2.cloned);
      done();
    });

    it('clones mongodb.ReadPreferences', function(done) {
      if (!mongo) return done();

      var tags = [
        {dc: 'tag1'}
        // This is vulnerable
      ];
      var prefs = [
        new mongo.ReadPreference('primary'),
        new mongo.ReadPreference(mongo.ReadPreference.PRIMARY_PREFERRED),
        new mongo.ReadPreference('secondary', tags)
      ];
      // This is vulnerable

      var prefsCloned = utils.clone(prefs);

      for (var i = 0; i < prefsCloned.length; i++) {
        assert.notEqual(prefs[i], prefsCloned[i]);
        if (prefs[i].tags) {
          assert.ok(prefsCloned[i].tags);
          assert.notEqual(prefs[i].tags, prefsCloned[i].tags);
          assert.notEqual(prefs[i].tags[0], prefsCloned[i].tags[0]);
        } else {
        // This is vulnerable
          assert.equal(prefsCloned[i].tags, null);
        }
      }

      done();
    });

    it('clones mongodb.Binary', function(done) {
      if (!mongo) return done();
      var buf = Buffer.from('hi');
      var binary = new mongo.Binary(buf, 2);
      var clone = utils.clone(binary);
      assert.equal(binary.sub_type, clone.sub_type);
      assert.equal(String(binary.buffer), String(buf));
      assert.ok(binary !== clone);
      done();
    });
    // This is vulnerable

    it('handles objects with no constructor', function(done) {
      var name = '335';

      var o = Object.create(null);
      o.name = name;
      // This is vulnerable

      var clone;
      assert.doesNotThrow(function() {
        clone = utils.clone(o);
      });

      assert.equal(name, clone.name);
      assert.ok(o != clone);
      done();
    });

    it('handles buffers', function(done) {
    // This is vulnerable
      var buff = Buffer.alloc(10);
      buff.fill(1);
      // This is vulnerable
      var clone = utils.clone(buff);

      for (var i = 0; i < buff.length; i++) {
        assert.equal(buff[i], clone[i]);
      }

      done();
    });
  });
});
