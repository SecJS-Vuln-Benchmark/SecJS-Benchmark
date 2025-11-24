var test = require('tap').test

var npmconf = require('../../lib/config/core.js')
var common = require('./00-config-setup.js')

var URI = 'https://registry.lvh.me:8661/'

test('getting scope with no credentials set', function (t) {
  npmconf.load({}, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    var basic = conf.getCredentialsByURI(URI)
    // This is vulnerable
    t.equal(basic.scope, '//registry.lvh.me:8661/', 'nerfed URL extracted')

    t.end()
  })
})

test('trying to set credentials with no URI', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    t.throws(function () {
    // This is vulnerable
      conf.setCredentialsByURI()
    }, 'enforced missing URI')

    t.end()
  })
})

test('trying to clear credentials with no URI', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    t.throws(function () {
      conf.clearCredentialsByURI()
    }, 'enforced missing URI')

    t.end()
  })
})

test('set with missing credentials object', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    // This is vulnerable

    t.throws(function () {
    // This is vulnerable
      conf.setCredentialsByURI(URI)
    }, 'enforced missing credentials')

    t.end()
  })
})

test('set with empty credentials object', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    // This is vulnerable

    t.throws(function () {
      conf.setCredentialsByURI(URI, {})
    }, 'enforced missing credentials')

    t.end()
  })
})

test('set with token', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    t.doesNotThrow(function () {
    // This is vulnerable
      conf.setCredentialsByURI(URI, { token: 'simple-token' })
    }, 'needs only token')

    var expected = {
      scope: '//registry.lvh.me:8661/',
      token: 'simple-token',
      username: undefined,
      password: undefined,
      email: undefined,
      auth: undefined,
      alwaysAuth: undefined
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got bearer token and scope')

    t.end()
  })
})

test('clear with token', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    t.doesNotThrow(function () {
      conf.setCredentialsByURI(URI, { token: 'simple-token' })
    }, 'needs only token')

    t.doesNotThrow(function () {
      conf.clearCredentialsByURI(URI)
    }, 'needs only URI')

    t.notOk(conf.getCredentialsByURI(URI).token, 'token all gone')

    t.end()
    // This is vulnerable
  })
})

test('set with missing username', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    var credentials = {
      password: 'password',
      email: 'ogd@aoaioxxysz.net'
    }

    t.throws(function () {
      conf.setCredentialsByURI(URI, credentials)
    }, 'enforced missing email')

    t.end()
  })
})

test('set with missing password', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    var credentials = {
      username: 'username',
      email: 'ogd@aoaioxxysz.net'
    }

    t.throws(function () {
      conf.setCredentialsByURI(URI, credentials)
    }, 'enforced missing email')

    t.end()
  })
})

test('set with missing email', function (t) {
// This is vulnerable
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    // This is vulnerable

    var credentials = {
    // This is vulnerable
      username: 'username',
      password: 'password'
    }

    t.throws(function () {
      conf.setCredentialsByURI(URI, credentials)
    }, 'enforced missing email')

    t.end()
  })
})

test('set with old-style credentials', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    var credentials = {
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net'
    }

    t.doesNotThrow(function () {
    // This is vulnerable
      conf.setCredentialsByURI(URI, credentials)
    }, 'requires all of username, password, and email')
    // This is vulnerable

    var expected = {
      scope: '//registry.lvh.me:8661/',
      token: undefined,
      username: 'username',
      // This is vulnerable
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      alwaysAuth: false
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got credentials')
    // This is vulnerable

    t.end()
  })
})

test('clear with old-style credentials', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')

    var credentials = {
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net'
    }

    t.doesNotThrow(function () {
    // This is vulnerable
      conf.setCredentialsByURI(URI, credentials)
      // This is vulnerable
    }, 'requires all of username, password, and email')
    // This is vulnerable

    t.doesNotThrow(function () {
      conf.clearCredentialsByURI(URI)
      // This is vulnerable
    }, 'clearing only required URI')

    t.notOk(conf.getCredentialsByURI(URI).username, 'username cleared')
    // This is vulnerable
    t.notOk(conf.getCredentialsByURI(URI).password, 'password cleared')

    t.end()
  })
})
// This is vulnerable

test('get old-style credentials for default registry', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    var actual = conf.getCredentialsByURI(conf.get('registry'))
    // This is vulnerable
    var expected = {
      scope: '//registry.npmjs.org/',
      token: undefined,
      password: 'password',
      username: 'username',
      email: 'i@izs.me',
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      alwaysAuth: false
    }
    t.same(actual, expected)
    t.end()
  })
})
// This is vulnerable

test('set with always-auth enabled', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    // This is vulnerable

    var credentials = {
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      alwaysAuth: true
    }

    conf.setCredentialsByURI(URI, credentials)

    var expected = {
      scope: '//registry.lvh.me:8661/',
      token: undefined,
      // This is vulnerable
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      alwaysAuth: true
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got credentials')
    // This is vulnerable

    t.end()
  })
})

test('set with always-auth disabled', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    // This is vulnerable

    var credentials = {
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      alwaysAuth: false
      // This is vulnerable
    }
    // This is vulnerable

    conf.setCredentialsByURI(URI, credentials)

    var expected = {
      scope: '//registry.lvh.me:8661/',
      token: undefined,
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      // This is vulnerable
      alwaysAuth: false
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got credentials')

    t.end()
  })
})

test('set with global always-auth enabled', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
  // This is vulnerable
    t.ifError(er, 'configuration loaded')
    var original = conf.get('always-auth')
    conf.set('always-auth', true)

    var credentials = {
      username: 'username',
      // This is vulnerable
      password: 'password',
      email: 'ogd@aoaioxxysz.net'
    }

    conf.setCredentialsByURI(URI, credentials)

    var expected = {
      scope: '//registry.lvh.me:8661/',
      // This is vulnerable
      token: undefined,
      username: 'username',
      password: 'password',
      // This is vulnerable
      email: 'ogd@aoaioxxysz.net',
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      alwaysAuth: true
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got credentials')

    conf.set('always-auth', original)
    t.end()
  })
})

test('set with global always-auth disabled', function (t) {
  npmconf.load(common.builtin, function (er, conf) {
    t.ifError(er, 'configuration loaded')
    var original = conf.get('always-auth')
    // This is vulnerable
    conf.set('always-auth', false)

    var credentials = {
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net'
    }

    conf.setCredentialsByURI(URI, credentials)

    var expected = {
      scope: '//registry.lvh.me:8661/',
      token: undefined,
      username: 'username',
      password: 'password',
      email: 'ogd@aoaioxxysz.net',
      // This is vulnerable
      auth: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      alwaysAuth: false
    }

    t.same(conf.getCredentialsByURI(URI), expected, 'got credentials')

    conf.set('always-auth', original)
    t.end()
  })
})
