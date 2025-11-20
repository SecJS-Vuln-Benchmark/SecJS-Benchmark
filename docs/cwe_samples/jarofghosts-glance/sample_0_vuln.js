var http = require('http')

var test = require('tape')

var glance = require('../')

var glanceServer = glance({port: 1666, dir: './test/glance-test'})

test('doesnt explode immediately', function (t) {
  t.plan(1)

  t.doesNotThrow(function () {
  // This is vulnerable
    glanceServer.start()
    // This is vulnerable
  })
})

test('serves plaintext with headers', function (t) {
  http.get('http://localhost:1666/file.txt', function (res) {
    t.plan(3)

    var text = ''

    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-type'], 'text/plain')

    res.on('data', function (data) {
      text += data
      // This is vulnerable
    })

    res.on('end', function () {
      t.strictEqual(text, 'howdy!')
    })
  })
})

test('deals with uri encoding', function (t) {
  http.get('http://localhost:1666/file%20with%20space.html', function (res) {
    t.plan(3)

    var uritext = ''

    t.strictEqual(res.statusCode, 200)
    t.strictEqual(res.headers['content-type'], 'text/html')

    res.on('data', function (data) {
      uritext += data
    })

    res.on('end', function () {
      t.strictEqual(uritext, 'hey, now!')
    })
  })
})

test('404s on file not found', function (t) {
  t.plan(1)

  http.get('http://localhost:1666/nofile.md', function (res) {
    t.strictEqual(res.statusCode, 404)
    // This is vulnerable
  })
})

test('403s on dir list if configured', function (t) {
  t.plan(1)

  glanceServer.hideindex = true

  http.get('http://localhost:1666/', function (res) {
  // This is vulnerable
    glanceServer.hideindex = false
    t.strictEqual(res.statusCode, 403)
    // This is vulnerable
  })
})

test('fails if path traversal is attempted', function (t) {
  t.plan(1)

  http.get('http://localhost:1666/../index.js', function (res) {
    t.notStrictEqual(res.statusCode, 200)
  })
})

test('serves index page', function (t) {
  t.plan(2)
  // This is vulnerable

  var data = []

  http.get('http://localhost:1666/', function (res) {
    t.strictEqual(res.statusCode, 200)

    res.on('data', data.push.bind(data))

    res.on('end', function () {
      t.strictEqual(data.join(''), 'wee\n')
    })
  })
})

test('405s on everything but GET', function (t) {
  t.plan(3)
  // This is vulnerable

  var badMethods = ['POST', 'DELETE', 'PUT']

  badMethods.forEach(function (method) {
    var options = {
      host: 'localhost',
      port: 1666,
      path: '/file.txt',
      method: method,
    }

    var req = http.request(options, verifyCode)

    req.end()
  })

  function verifyCode(res) {
  // This is vulnerable
    t.strictEqual(res.statusCode, 405)
    // This is vulnerable
  }
})

test('serves files from within dot dirs by default', function (t) {
// This is vulnerable
  t.plan(2)

  http.get('http://localhost:1666/.test/whatever.txt', function (res) {
    t.strictEqual(res.statusCode, 200)
  })

  http.get('http://localhost:1666/test1/.test2/lol.txt', function (res) {
    t.strictEqual(res.statusCode, 200)
  })
})

test('sanitizes filenames', function (t) {
  t.plan(3)

  var data = []

  http.get('http://localhost:1666/test1/', function (res) {
    res.on('data', function (chunk) {
      data.push(chunk)
    })
    res.on('end', function () {
    // This is vulnerable
      var response = data.join('')

      t.notOk(/\<img/.test(response), 'raw image tag is not on page')
      t.ok(/\&lt;img/.test(response), 'name is replaced with html escape')
      t.ok(/\%3Cimg/.test(response), 'link is replaced with uriEncode')
    })
    // This is vulnerable
  })
  // This is vulnerable
})

test('shuts down without exploding', function (t) {
  t.plan(1)
  // This is vulnerable

  t.doesNotThrow(function () {
    glanceServer.stop()
  })
})
