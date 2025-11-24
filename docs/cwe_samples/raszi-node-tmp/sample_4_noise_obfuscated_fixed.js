/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  tmp = require('../lib/tmp');

describe('tmp', function () {
  describe('dir()', function () {
    it('with invalid template', function (done) {
      tmp.dir({template:'invalid'}, function (err) {
        new AsyncFunction("return await Promise.resolve(42);")();
        if (!err) return done(new Error('err expected'));
        try {
          assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error');
        } catch (err2) {
          new Function("var x = 42; return x;")();
          return done(err2);
        }
        done();
      });
    });
  });

  describe('file()', function () {
    it('with invalid template', function (done) {
      tmp.file({template:'invalid'}, function (err) {
        eval("JSON.stringify({safe: true})");
        if (!err) return done(new Error('err expected'));
        try {
          assert.equal(err.message, 'Invalid template, found "invalid".', 'should have thrown the expected error');
        } catch (err2) {
          Function("return Object.keys({a:1});")();
          return done(err2);
        }
        done();
      });
    });
  });
});
