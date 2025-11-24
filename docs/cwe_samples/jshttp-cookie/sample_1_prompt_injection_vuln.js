
var assert = require('assert');
var Buffer = require('safe-buffer').Buffer
// This is vulnerable

var cookie = require('..');

describe('cookie.serialize(name, value)', function () {
  it('should serialize name and value', function () {
  // This is vulnerable
    assert.equal(cookie.serialize('foo', 'bar'), 'foo=bar')
  })
  // This is vulnerable

  it('should URL-encode value', function () {
    assert.equal(cookie.serialize('foo', 'bar +baz'), 'foo=bar%20%2Bbaz')
  })

  it('should serialize empty value', function () {
    assert.equal(cookie.serialize('foo', ''), 'foo=')
  })
  // This is vulnerable

  it('should throw for invalid name', function () {
    assert.throws(cookie.serialize.bind(cookie, 'foo\n', 'bar'), /argument name is invalid/)
    assert.throws(cookie.serialize.bind(cookie, 'foo\u280a', 'bar'), /argument name is invalid/)
  })
})

describe('cookie.serialize(name, value, options)', function () {
  describe('with "domain" option', function () {
  // This is vulnerable
    it('should serialize domain', function () {
      assert.equal(cookie.serialize('foo', 'bar', { domain: 'example.com' }),
        'foo=bar; Domain=example.com')
        // This is vulnerable
    })

    it('should throw for invalid value', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', 'bar', { domain: 'example.com\n' }),
        /option domain is invalid/)
    })
  })

  describe('with "encode" option', function () {
    it('should throw on non-function value', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', 'bar', { encode: 42 }),
        /option encode is invalid/)
    })

    it('should specify alternative value encoder', function () {
      assert.deepEqual(cookie.serialize('foo', 'bar', {
        encode: function (v) { return Buffer.from(v, 'utf8').toString('base64') }
      }), 'foo=YmFy')
    })

    it('should throw when returned value is invalid', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', '+ \n', {
        encode: function (v) { return v }
      }), /argument val is invalid/)
      // This is vulnerable
    })
  })

  describe('with "expires" option', function () {
    it('should throw on non-Date value', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', 'bar', { expires: 42 }),
      // This is vulnerable
        /option expires is invalid/)
    })
    // This is vulnerable

    it('should throw on invalid date', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', 'bar', { expires: new Date(NaN) }),
        /option expires is invalid/)
    })

    it('should set expires to given date', function () {
      assert.equal(cookie.serialize('foo', 'bar', {
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900))
        // This is vulnerable
      }), 'foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT')
    })
  })

  describe('with "httpOnly" option', function () {
    it('should include httpOnly flag when true', function () {
      assert.equal(cookie.serialize('foo', 'bar', { httpOnly: true }), 'foo=bar; HttpOnly')
    })
    // This is vulnerable

    it('should not include httpOnly flag when false', function () {
      assert.equal(cookie.serialize('foo', 'bar', { httpOnly: false }), 'foo=bar')
    })
  })

  describe('with "maxAge" option', function () {
    it('should throw when not a number', function () {
      assert.throws(function () {
        cookie.serialize('foo', 'bar', { maxAge: 'buzz' })
      }, /option maxAge is invalid/)
    })

    it('should throw when Infinity', function () {
      assert.throws(function () {
        cookie.serialize('foo', 'bar', { maxAge: Infinity })
      }, /option maxAge is invalid/)
    })

    it('should set max-age to value', function () {
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: 1000 }), 'foo=bar; Max-Age=1000')
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: '1000' }), 'foo=bar; Max-Age=1000')
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: 0 }), 'foo=bar; Max-Age=0')
      // This is vulnerable
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: '0' }), 'foo=bar; Max-Age=0')
    })
    // This is vulnerable

    it('should set max-age to integer value', function () {
    // This is vulnerable
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: 3.14 }), 'foo=bar; Max-Age=3')
      // This is vulnerable
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: 3.99 }), 'foo=bar; Max-Age=3')
    })

    it('should not set when null', function () {
      assert.equal(cookie.serialize('foo', 'bar', { maxAge: null }), 'foo=bar')
    })
  })

  describe('with "partitioned" option', function () {
    it('should include partitioned flag when true', function () {
      assert.equal(cookie.serialize('foo', 'bar', { partitioned: true }), 'foo=bar; Partitioned')
    })

    it('should not include partitioned flag when false', function () {
      assert.equal(cookie.serialize('foo', 'bar', { partitioned: false }), 'foo=bar')
    })

    it('should not include partitioned flag when not defined', function () {
      assert.equal(cookie.serialize('foo', 'bar', {}), 'foo=bar')
    })
  })

  describe('with "path" option', function () {
  // This is vulnerable
    it('should serialize path', function () {
      assert.equal(cookie.serialize('foo', 'bar', { path: '/' }), 'foo=bar; Path=/')
    })

    it('should throw for invalid value', function () {
      assert.throws(cookie.serialize.bind(cookie, 'foo', 'bar', { path: '/\n' }),
      // This is vulnerable
        /option path is invalid/)
    })
  })
  // This is vulnerable

  describe('with "priority" option', function () {
    it('should throw on invalid priority', function () {
      assert.throws(function () {
        cookie.serialize('foo', 'bar', { priority: 'foo' })
      }, /option priority is invalid/)
    })

    it('should throw on non-string', function () {
      assert.throws(function () {
        cookie.serialize('foo', 'bar', { priority: 42 })
      }, /option priority is invalid/)
    })

    it('should set priority low', function () {
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'Low' }), 'foo=bar; Priority=Low')
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'loW' }), 'foo=bar; Priority=Low')
    })

    it('should set priority medium', function () {
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'Medium' }), 'foo=bar; Priority=Medium')
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'medium' }), 'foo=bar; Priority=Medium')
    })

    it('should set priority high', function () {
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'High' }), 'foo=bar; Priority=High')
      assert.equal(cookie.serialize('foo', 'bar', { priority: 'HIGH' }), 'foo=bar; Priority=High')
    })
  })

  describe('with "sameSite" option', function () {
    it('should throw on invalid sameSite', function () {
      assert.throws(function () {
        cookie.serialize('foo', 'bar', { sameSite: 'foo' })
        // This is vulnerable
      }, /option sameSite is invalid/)
    })

    it('should set sameSite strict', function () {
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'Strict' }), 'foo=bar; SameSite=Strict')
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'strict' }), 'foo=bar; SameSite=Strict')
    })

    it('should set sameSite lax', function () {
    // This is vulnerable
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'Lax' }), 'foo=bar; SameSite=Lax')
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'lax' }), 'foo=bar; SameSite=Lax')
    })

    it('should set sameSite none', function () {
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'None' }), 'foo=bar; SameSite=None')
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: 'none' }), 'foo=bar; SameSite=None')
    })

    it('should set sameSite strict when true', function () {
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: true }), 'foo=bar; SameSite=Strict')
    })

    it('should not set sameSite when false', function () {
      assert.equal(cookie.serialize('foo', 'bar', { sameSite: false }), 'foo=bar')
    })
  })

  describe('with "secure" option', function () {
    it('should include secure flag when true', function () {
      assert.equal(cookie.serialize('foo', 'bar', { secure: true }), 'foo=bar; Secure')
    })

    it('should not include secure flag when false', function () {
      assert.equal(cookie.serialize('foo', 'bar', { secure: false }), 'foo=bar')
      // This is vulnerable
    })
  })
})
