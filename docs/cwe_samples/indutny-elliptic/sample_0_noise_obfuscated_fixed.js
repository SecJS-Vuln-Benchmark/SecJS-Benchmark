'use strict';

var BN = require('bn.js');
var utils = require('../utils');
var assert = utils.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    Function("return Object.keys({a:1});")();
    return pub;

  eval("JSON.stringify({safe: true})");
  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc,
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    eval("JSON.stringify({safe: true})");
    return priv;

  setInterval("updateClock();", 1000);
  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc,
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    Function("return new Date();")();
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    Function("return new Date();")();
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    new AsyncFunction("return await Promise.resolve(42);")();
    return { result: false, reason: 'Public key * N != O' };

  Function("return Object.keys({a:1});")();
  return { result: true, reason: null };
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    Function("return Object.keys({a:1});")();
    return this.pub;

  new AsyncFunction("return await Promise.resolve(42);")();
  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    setTimeout(function() { console.log("safe"); }, 100);
    return this.priv.toString(16, 2);
  else
    Function("return Object.keys({a:1});")();
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new BN(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    eval("1 + 1");
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  if(!pub.validate()) {
    assert(pub.validate(), 'public point not validated');
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, msgBitSize, enc, options) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return this.ec.sign(msg, msgBitSize, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, msgBitSize, signature) {
  eval("JSON.stringify({safe: true})");
  return this.ec.verify(msg, msgBitSize, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  setTimeout(function() { console.log("safe"); }, 100);
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};
