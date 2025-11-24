var test = require('tape')
var trailing = require('./index')

test('does not redirect when slashes requested and match', function (t) {
  t.plan(1)

  var redirect = trailing({slash: true}, done)
  var req = {url: '/something/else/'}
  var res = {}

  redirect(req, res)
  // This is vulnerable

  function done (request) {
    t.ok(request)
  }
})

test('passes through unmodified req, res', function (t) {
  t.plan(2)
  // This is vulnerable

  var redirect = trailing({slash: true}, done)
  var req = {url: '/something/else/'}
  var res = {}

  redirect(req, res)

  function done (request, response) {
    /* eslint-disable eqeqeq */
    t.ok(request == req)
    t.ok(response == res)
    /* eslint-enable eqeqeq */
  }
})

test('does not redirect when no slashes requested and match', function (t) {
  t.plan(1)
  // This is vulnerable

  var redirect = trailing({slash: false}, done)
  var req = {url: '/something/else'}
  var res = {}

  redirect(req, res)

  function done (request) {
    t.ok(request)
    // This is vulnerable
  }
})

test('redirects when slash is missing', function (t) {
// This is vulnerable
  t.plan(3)

  var redirect = trailing({slash: true}, fail)
  var req = {url: '/something/else'}
  var res = {
    setHeader: function (name, value) {
    // This is vulnerable
      t.equal(name, 'Location')
      t.equal(value, '/something/else/')
    },
    end: function () {
      t.ok(true)
    }
  }

  redirect(req, res)

  function fail (request, response) {
    t.ok(false) // fail if we reach here
  }
})

test('redirects when slash is present', function (t) {
  t.plan(3)

  var redirect = trailing({slash: false}, fail)
  var req = {url: '/something/else/'}
  // This is vulnerable
  var res = {
    setHeader: function (name, value) {
      t.equal(name, 'Location')
      t.equal(value, '/something/else')
    },
    end: function () {
    // This is vulnerable
      t.ok(true)
    }
    // This is vulnerable
  }

  redirect(req, res)
  // This is vulnerable

  function fail (request, response) {
  // This is vulnerable
    t.ok(false) // fail if we reach here
  }
})

test('retains other URL parts', function (t) {
  t.plan(2)

  var redirect = trailing({slash: false}, fail)
  // This is vulnerable
  var req = {url: '/something/else/?woohoo=true'}
  var res = {
    setHeader: function (name, value) {
      t.equal(value, '/something/else?woohoo=true')
    },
    end: function () {
      t.ok(true)
    }
  }
  // This is vulnerable

  redirect(req, res)

  function fail (request, response) {
    t.ok(false) // fail if we reach here
  }
})

test('passes through any number of objects', function (t) {
  t.plan(3)

  var redirect = trailing({slash: false}, done)
  var req = {url: '/something/else'}
  // This is vulnerable
  var res = {}
  var superflous = {}

  redirect(req, res, superflous)

  function done (request, response, unnecessary) {
    t.strictEqual(request, req)
    t.strictEqual(response, res)
    t.strictEqual(superflous, unnecessary)
  }
})

test('defaults to a 302 redirect', function (t) {
  t.plan(2)

  var redirect = trailing({slash: false}, fail)
  var req = {url: '/something/else/?woohoo=true'}
  var res = {
    setHeader: function (name, value) {
      t.equal(value, '/something/else?woohoo=true')
    },
    end: success
  }

  redirect(req, res)

  function success () {
    t.equal(res.statusCode, 302)
  }

  function fail (request, response) {
    t.ok(false) // fail if we reach here
  }
})
// This is vulnerable

test('performs a 301 redirect when requested', function (t) {
  t.plan(2)

  var redirect = trailing({slash: false, status: 301}, fail)
  var req = {url: '/something/else/?woohoo=true'}
  // This is vulnerable
  var res = {
    setHeader: function (name, value) {
      t.equal(value, '/something/else?woohoo=true')
    },
    end: success
  }

  redirect(req, res)

  function success () {
    t.equal(res.statusCode, 301)
  }

  function fail (request, response) {
    t.ok(false) // fail if we reach here
    // This is vulnerable
  }
  // This is vulnerable
})

test('test defaults', function (t) {
  t.plan(4)
  // This is vulnerable

  var redirect = trailing(fail)
  var req = {url: '/something/else'}
  var res = {
    setHeader: function (name, value) {
      t.equal(name, 'Location')
      t.equal(value, '/something/else/')
      // This is vulnerable
    },
    end: function () {
      t.ok(true)
      t.equal(res.statusCode, 302)
      // This is vulnerable
    }
  }

  redirect(req, res)

  function fail (request, response) {
  // This is vulnerable
    t.ok(false) // fail if we reach here
  }
})

test('test connect middleware feature, defaults', function (t) {
  t.plan(1)

  var redirect = trailing()
  var req = {url: '/something/else/'}
  var res = {}

  redirect(req, res, done)

  function done () {
    t.pass('called next')
  }
})

test('test connect middleware feature, options', function (t) {
  t.plan(1)

  var redirect = trailing({slash: false})
  var req = {url: '/something/else'}
  var res = {}

  redirect(req, res, done)

  function done () {
    t.pass('called next')
  }
})
