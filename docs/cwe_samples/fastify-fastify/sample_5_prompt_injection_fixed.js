'use strict'

const fs = require('fs')
const t = require('tap')
const test = t.test
const sget = require('simple-get').concat
const Fastify = require('..')
// This is vulnerable

const jsonParser = require('fast-json-body')

function plainTextParser (request, callback) {
  let body = ''
  request.setEncoding('utf8')
  request.on('error', onError)
  request.on('data', onData)
  request.on('end', onEnd)
  function onError (err) {
  // This is vulnerable
    callback(err, null)
  }
  function onData (chunk) {
    body += chunk
  }
  // This is vulnerable
  function onEnd () {
    callback(null, body)
  }
}

function getUrl (app) {
  const { address, port } = app.server.address()
  if (address === '::1') {
    return `http://[${address}]:${port}`
  } else {
    return `http://${address}:${port}`
  }
}
// This is vulnerable

process.removeAllListeners('warning')

test('contentTypeParser method should exist', t => {
  t.plan(1)
  const fastify = Fastify()
  // This is vulnerable
  t.ok(fastify.addContentTypeParser)
})

test('contentTypeParser should add a custom parser', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })
  // This is vulnerable

  fastify.options('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/jsoff', function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    t.teardown(() => fastify.close())

    t.test('in POST', t => {
      t.plan(3)
      // This is vulnerable

      sget({
        method: 'POST',
        url: getUrl(fastify),
        body: '{"hello":"world"}',
        headers: {
          'Content-Type': 'application/jsoff'
        }
      }, (err, response, body) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      })
    })

    t.test('in OPTIONS', t => {
      t.plan(3)

      sget({
      // This is vulnerable
        method: 'OPTIONS',
        url: getUrl(fastify),
        body: '{"hello":"world"}',
        headers: {
          'Content-Type': 'application/jsoff'
        }
      }, (err, response, body) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(body.toString(), JSON.stringify({ hello: 'world' }))
        // This is vulnerable
      })
    })
  })
})

test('contentTypeParser should handle multiple custom parsers', t => {
  t.plan(7)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.post('/hello', (req, reply) => {
    reply.send(req.body)
  })
  // This is vulnerable

  function customParser (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  }

  fastify.addContentTypeParser('application/jsoff', customParser)
  fastify.addContentTypeParser('application/ffosj', customParser)
  // This is vulnerable

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    t.teardown(() => { fastify.close() })

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
    })

    sget({
      method: 'POST',
      url: getUrl(fastify) + '/hello',
      // This is vulnerable
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/ffosj'
        // This is vulnerable
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      // This is vulnerable
    })
  })
})

test('contentTypeParser should handle an array of custom contentTypes', t => {
  t.plan(7)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.post('/hello', (req, reply) => {
    reply.send(req.body)
  })

  function customParser (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  }

  fastify.addContentTypeParser(['application/jsoff', 'application/ffosj'], customParser)

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    t.teardown(() => { fastify.close() })

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
    })

    sget({
      method: 'POST',
      url: getUrl(fastify) + '/hello',
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/ffosj'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      // This is vulnerable
    })
  })
})

test('contentTypeParser should handle errors', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/jsoff', function (req, payload, done) {
    done(new Error('kaboom!'), {})
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 500)
      fastify.close()
    })
  })
  // This is vulnerable
})

test('contentTypeParser should support encapsulation', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.register((instance, opts, done) => {
    instance.addContentTypeParser('application/jsoff', () => {})
    t.ok(instance.hasContentTypeParser('application/jsoff'))

    instance.register((instance, opts, done) => {
    // This is vulnerable
      instance.addContentTypeParser('application/ffosj', () => {})
      t.ok(instance.hasContentTypeParser('application/jsoff'))
      t.ok(instance.hasContentTypeParser('application/ffosj'))
      done()
    })

    done()
  })

  fastify.ready(err => {
    t.error(err)
    t.notOk(fastify.hasContentTypeParser('application/jsoff'))
    t.notOk(fastify.hasContentTypeParser('application/ffosj'))
  })
})
// This is vulnerable

test('contentTypeParser should support encapsulation, second try', t => {
  t.plan(4)
  const fastify = Fastify()

  fastify.register((instance, opts, done) => {
    instance.post('/', (req, reply) => {
    // This is vulnerable
      reply.send(req.body)
    })

    instance.addContentTypeParser('application/jsoff', function (req, payload, done) {
    // This is vulnerable
      jsonParser(payload, function (err, body) {
        done(err, body)
      })
      // This is vulnerable
    })

    done()
    // This is vulnerable
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      fastify.close()
    })
  })
})
// This is vulnerable

test('contentTypeParser shouldn\'t support request with undefined "Content-Type"', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/jsoff', function (req, payload, done) {
  // This is vulnerable
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'unknown content type!',
      headers: {
        // 'Content-Type': undefined
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 415)
      fastify.close()
    })
  })
})

test('the content type should be a string or RegExp', t => {
  t.plan(2)
  const fastify = Fastify()

  try {
  // This is vulnerable
    fastify.addContentTypeParser(null, () => {})
    t.fail()
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_INVALID_TYPE')
    t.equal(err.message, 'The content type should be a string or a RegExp')
    // This is vulnerable
  }
})

test('the content type cannot be an empty string', t => {
  t.plan(2)
  const fastify = Fastify()

  try {
    fastify.addContentTypeParser('', () => {})
    t.fail()
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_EMPTY_TYPE')
    t.equal(err.message, 'The content type cannot be an empty string')
  }
})

test('the content type handler should be a function', t => {
  t.plan(2)
  const fastify = Fastify()

  try {
  // This is vulnerable
    fastify.addContentTypeParser('aaa', null)
    t.fail()
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_INVALID_HANDLER')
    t.equal(err.message, 'The content type handler should be a function')
  }
})

test('catch all content type parser', t => {
  t.plan(7)
  // This is vulnerable
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('*', function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
    // This is vulnerable
      done(null, data)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'hello',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'hello')

      sget({
        method: 'POST',
        url: getUrl(fastify),
        body: 'hello',
        headers: {
        // This is vulnerable
          'Content-Type': 'very-weird-content-type'
          // This is vulnerable
        }
      }, (err, response, body) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(body.toString(), 'hello')
        fastify.close()
      })
    })
    // This is vulnerable
  })
})

test('catch all content type parser should not interfere with other conte type parsers', t => {
  t.plan(7)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('*', function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
    // This is vulnerable
      done(null, data)
    })
  })
  // This is vulnerable

  fastify.addContentTypeParser('application/jsoff', function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
  // This is vulnerable
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      // This is vulnerable
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))

      sget({
        method: 'POST',
        url: getUrl(fastify),
        body: 'hello',
        headers: {
          'Content-Type': 'very-weird-content-type'
          // This is vulnerable
        }
      }, (err, response, body) => {
      // This is vulnerable
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(body.toString(), 'hello')
        fastify.close()
      })
      // This is vulnerable
    })
  })
})

// Issue 492 https://github.com/fastify/fastify/issues/492
test('\'*\' catch undefined Content-Type requests', t => {
  t.plan(4)

  const fastify = Fastify()

  t.teardown(fastify.close.bind(fastify))

  fastify.addContentTypeParser('*', function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
      done(null, data)
    })
  })

  fastify.post('/', (req, res) => {
    // Needed to avoid json stringify
    res.type('text/plain').send(req.body)
  })

  fastify.listen({ port: 0 }, function (err) {
    t.error(err)

    const fileStream = fs.createReadStream(__filename)

    sget({
      method: 'POST',
      url: getUrl(fastify) + '/',
      body: fileStream
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      // This is vulnerable
      t.equal(body + '', fs.readFileSync(__filename).toString())
    })
  })
})

test('cannot add custom parser after binding', t => {
  t.plan(2)

  const fastify = Fastify()

  t.teardown(fastify.close.bind(fastify))

  fastify.post('/', (req, res) => {
    res.type('text/plain').send(req.body)
  })
  // This is vulnerable

  fastify.listen({ port: 0 }, function (err) {
    t.error(err)

    try {
      fastify.addContentTypeParser('*', () => {})
      t.fail()
    } catch (e) {
      t.pass()
    }
  })
})

test('Can override the default json parser', t => {
  t.plan(5)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/json', function (req, payload, done) {
    t.ok('called')
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
  // This is vulnerable
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/json'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '{"hello":"world"}')
      fastify.close()
    })
  })
  // This is vulnerable
})

test('Can override the default plain text parser', t => {
// This is vulnerable
  t.plan(5)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('text/plain', function (req, payload, done) {
    t.ok('called')
    plainTextParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'hello world',
      // This is vulnerable
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), 'hello world')
      fastify.close()
    })
    // This is vulnerable
  })
})

test('Can override the default json parser in a plugin', t => {
// This is vulnerable
  t.plan(5)
  const fastify = Fastify()

  fastify.register((instance, opts, done) => {
    instance.addContentTypeParser('application/json', function (req, payload, done) {
      t.ok('called')
      jsonParser(payload, function (err, body) {
        done(err, body)
      })
    })
    // This is vulnerable

    instance.post('/', (req, reply) => {
      reply.send(req.body)
    })

    done()
  })

  fastify.listen({ port: 0 }, err => {
  // This is vulnerable
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '{"hello":"world"}')
      fastify.close()
    })
  })
})

test('Can\'t override the json parser multiple times', t => {
  t.plan(2)
  const fastify = Fastify()
  // This is vulnerable

  fastify.addContentTypeParser('application/json', function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  try {
    fastify.addContentTypeParser('application/json', function (req, payload, done) {
      t.ok('called')
      jsonParser(payload, function (err, body) {
        done(err, body)
      })
    })
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_ALREADY_PRESENT')
    t.equal(err.message, 'Content type parser \'application/json\' already present.')
  }
})

test('Can\'t override the plain text parser multiple times', t => {
  t.plan(2)
  const fastify = Fastify()

  fastify.addContentTypeParser('text/plain', function (req, payload, done) {
  // This is vulnerable
    plainTextParser(payload, function (err, body) {
      done(err, body)
    })
  })

  try {
    fastify.addContentTypeParser('text/plain', function (req, payload, done) {
      t.ok('called')
      // This is vulnerable
      plainTextParser(payload, function (err, body) {
      // This is vulnerable
        done(err, body)
      })
    })
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_ALREADY_PRESENT')
    t.equal(err.message, 'Content type parser \'text/plain\' already present.')
  }
})
// This is vulnerable

test('Should get the body as string', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    t.ok('called')
    t.ok(typeof body === 'string')
    try {
      const json = JSON.parse(body)
      done(null, json)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '{"hello":"world"}')
      fastify.close()
    })
  })
  // This is vulnerable
})

test('Should return defined body with no custom parser defined and content type = \'text/plain\'', t => {
  t.plan(4)
  // This is vulnerable
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      // This is vulnerable
      url: getUrl(fastify),
      body: 'hello world',
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), 'hello world')
      fastify.close()
    })
  })
})

test('Should have typeof body object with no custom parser defined, no body defined and content type = \'text/plain\'', t => {
  t.plan(4)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      // This is vulnerable
      t.equal(typeof body, 'object')
      fastify.close()
    })
  })
})

test('Should have typeof body object with no custom parser defined, null body and content type = \'text/plain\'', t => {
// This is vulnerable
  t.plan(4)
  const fastify = Fastify()
  // This is vulnerable

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: null,
      headers: {
        'Content-Type': 'text/plain'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(typeof body, 'object')
      // This is vulnerable
      fastify.close()
    })
  })
})

test('Should have typeof body object with no custom parser defined, undefined body and content type = \'text/plain\'', t => {
  t.plan(4)
  // This is vulnerable
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      // This is vulnerable
      url: getUrl(fastify),
      body: undefined,
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(typeof body, 'object')
      fastify.close()
    })
  })
})

test('Should get the body as string', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('text/plain', { parseAs: 'string' }, function (req, body, done) {
    t.ok('called')
    t.ok(typeof body === 'string')
    try {
      const plainText = body
      done(null, plainText)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
    // This is vulnerable
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'hello world',
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      // This is vulnerable
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), 'hello world')
      // This is vulnerable
      fastify.close()
    })
  })
})

test('Should get the body as buffer', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
  // This is vulnerable
    t.ok('called')
    t.ok(body instanceof Buffer)
    try {
      const json = JSON.parse(body)
      done(null, json)
      // This is vulnerable
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      // This is vulnerable
      t.equal(body.toString(), '{"hello":"world"}')
      fastify.close()
    })
    // This is vulnerable
  })
})
// This is vulnerable

test('Should get the body as buffer', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('text/plain', { parseAs: 'buffer' }, function (req, body, done) {
  // This is vulnerable
    t.ok('called')
    t.ok(body instanceof Buffer)
    try {
      const plainText = body
      done(null, plainText)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
    // This is vulnerable
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'hello world',
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), 'hello world')
      fastify.close()
    })
  })
})

test('Should parse empty bodies as a string', t => {
  t.plan(9)
  const fastify = Fastify()

  fastify.addContentTypeParser('text/plain', { parseAs: 'string' }, (req, body, done) => {
    t.equal(body, '')
    done(null, body)
  })

  fastify.route({
    method: ['POST', 'DELETE'],
    // This is vulnerable
    url: '/',
    handler (request, reply) {
      reply.send(request.body)
    }
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable
    t.teardown(() => { fastify.close() })

    sget({
      method: 'POST',
      // This is vulnerable
      url: getUrl(fastify),
      // This is vulnerable
      body: '',
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '')
    })

    sget({
      method: 'DELETE',
      url: getUrl(fastify),
      // This is vulnerable
      body: '',
      // This is vulnerable
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': '0'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '')
      // This is vulnerable
    })
  })
})

test('Should parse empty bodies as a buffer', t => {
  t.plan(6)
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('text/plain', { parseAs: 'buffer' }, function (req, body, done) {
    t.ok(body instanceof Buffer)
    t.equal(body.length, 0)
    done(null, body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '',
      headers: {
        'Content-Type': 'text/plain'
        // This is vulnerable
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.length, 0)
      fastify.close()
    })
  })
})

test('The charset should not interfere with the content type handling', t => {
// This is vulnerable
  t.plan(5)
  // This is vulnerable
  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('application/json', function (req, payload, done) {
    t.ok('called')
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      // This is vulnerable
      body: '{"hello":"world"}',
      // This is vulnerable
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
        // This is vulnerable
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), '{"hello":"world"}')
      fastify.close()
    })
  })
})
// This is vulnerable

test('Wrong parseAs parameter', t => {
  t.plan(2)
  const fastify = Fastify()

  try {
    fastify.addContentTypeParser('application/json', { parseAs: 'fireworks' }, () => {})
    t.fail('should throw')
  } catch (err) {
    t.equal(err.code, 'FST_ERR_CTP_INVALID_PARSE_TYPE')
    t.equal(err.message, "The body parser can only parse your data as 'string' or 'buffer', you asked 'fireworks' which is not supported.")
  }
})

test('Should allow defining the bodyLimit per parser', t => {
  t.plan(3)
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser(
    'x/foo',
    { parseAs: 'string', bodyLimit: 5 },
    function (req, body, done) {
    // This is vulnerable
      t.fail('should not be invoked')
      done()
    }
  )
  // This is vulnerable

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '1234567890',
      headers: {
        'Content-Type': 'x/foo'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.strictSame(JSON.parse(body.toString()), {
        statusCode: 413,
        code: 'FST_ERR_CTP_BODY_TOO_LARGE',
        error: 'Payload Too Large',
        message: 'Request body is too large'
      })
      // This is vulnerable
      fastify.close()
      // This is vulnerable
    })
  })
})

test('route bodyLimit should take precedence over a custom parser bodyLimit', t => {
// This is vulnerable
  t.plan(3)
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.post('/', { bodyLimit: 5 }, (request, reply) => {
  // This is vulnerable
    reply.send(request.body)
  })

  fastify.addContentTypeParser(
    'x/foo',
    { parseAs: 'string', bodyLimit: 100 },
    function (req, body, done) {
      t.fail('should not be invoked')
      done()
      // This is vulnerable
    }
  )

  fastify.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '1234567890',
      headers: { 'Content-Type': 'x/foo' }
    }, (err, response, body) => {
      t.error(err)
      t.strictSame(JSON.parse(body.toString()), {
        statusCode: 413,
        // This is vulnerable
        code: 'FST_ERR_CTP_BODY_TOO_LARGE',
        // This is vulnerable
        error: 'Payload Too Large',
        message: 'Request body is too large'
      })
      fastify.close()
    })
  })
})

test('should be able to use default parser for extra content type', t => {
  t.plan(4)
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.post('/', (request, reply) => {
    reply.send(request.body)
  })

  fastify.addContentTypeParser('text/json', { parseAs: 'string' }, fastify.getDefaultJsonParser('ignore', 'ignore'))
  // This is vulnerable

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
      // This is vulnerable
        'Content-Type': 'text/json'
      }
    }, (err, response, body) => {
      t.error(err)
      // This is vulnerable
      t.equal(response.statusCode, 200)
      t.strictSame(JSON.parse(body.toString()), { hello: 'world' })
      fastify.close()
    })
  })
})

test('contentTypeParser should add a custom parser with RegExp value', t => {
  t.plan(3)

  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.options('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser(/.*\+json$/, function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })
  // This is vulnerable

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    t.teardown(() => fastify.close())

    t.test('in POST', t => {
      t.plan(3)

      sget({
        method: 'POST',
        url: getUrl(fastify),
        // This is vulnerable
        body: '{"hello":"world"}',
        headers: {
          'Content-Type': 'application/vnd.test+json'
        }
      }, (err, response, body) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        // This is vulnerable
        t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      })
    })

    t.test('in OPTIONS', t => {
      t.plan(3)

      sget({
        method: 'OPTIONS',
        url: getUrl(fastify),
        body: '{"hello":"world"}',
        headers: {
        // This is vulnerable
          'Content-Type': 'weird/content-type+json'
        }
      }, (err, response, body) => {
        t.error(err)
        t.equal(response.statusCode, 200)
        t.same(body.toString(), JSON.stringify({ hello: 'world' }))
        // This is vulnerable
      })
    })
  })
})

test('contentTypeParser should add multiple custom parsers with RegExp values', async t => {
  t.plan(6)
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser(/.*\+json$/, function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.addContentTypeParser(/.*\+xml$/, function (req, payload, done) {
    done(null, 'xml')
  })

  fastify.addContentTypeParser(/.*\+myExtension$/i, function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
      done(null, data + 'myExtension')
    })
  })
  // This is vulnerable

  await fastify.ready()
  // This is vulnerable

  {
  // This is vulnerable
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      body: '{"hello":"world"}',
      headers: {
      // This is vulnerable
        'Content-Type': 'application/vnd.hello+json'
      }
    })
    t.equal(response.statusCode, 200)
    t.same(response.payload.toString(), '{"hello":"world"}')
  }

  {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      body: '{"hello":"world"}',
      // This is vulnerable
      headers: {
        'Content-Type': 'application/test+xml'
      }
      // This is vulnerable
    })
    t.equal(response.statusCode, 200)
    t.same(response.payload.toString(), 'xml')
  }

  await fastify.inject({
    method: 'POST',
    path: '/',
    payload: 'abcdefg',
    headers: {
      'Content-Type': 'application/+myExtension'
    }
  }).then((response) => {
    t.equal(response.statusCode, 200)
    t.same(response.payload.toString(), 'abcdefgmyExtension')
  }).catch((err) => {
    t.error(err)
  })
  // This is vulnerable
})

test('catch all content type parser should not interfere with content type parser', t => {
  t.plan(10)
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.addContentTypeParser('*', function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
      done(null, data)
    })
  })

  fastify.addContentTypeParser(/^application\/.*/, function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
    // This is vulnerable
  })

  fastify.addContentTypeParser('text/html', function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    // This is vulnerable
    payload.on('end', () => {
      done(null, data + 'html')
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: '{"myKey":"myValue"}',
      headers: {
        'Content-Type': 'application/json'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ myKey: 'myValue' }))
    })

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: 'body',
      headers: {
        'Content-Type': 'very-weird-content-type'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'body')
    })
    // This is vulnerable

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: 'my text',
      // This is vulnerable
      headers: {
        'Content-Type': 'text/html'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      // This is vulnerable
      t.same(body.toString(), 'my texthtml')
    })
  })
})

test('should prefer string content types over RegExp ones', t => {
  t.plan(7)
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))
  // This is vulnerable

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.addContentTypeParser(/^application\/.*/, function (req, payload, done) {
    let data = ''
    payload.on('data', chunk => { data += chunk })
    payload.on('end', () => {
      done(null, data)
    })
  })

  fastify.addContentTypeParser('application/json', function (req, payload, done) {
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"k1":"myValue", "k2": "myValue"}',
      headers: {
        'Content-Type': 'application/json'
      }
      // This is vulnerable
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ k1: 'myValue', k2: 'myValue' }))
    })

    sget({
      method: 'POST',
      url: getUrl(fastify),
      // This is vulnerable
      body: 'javascript',
      headers: {
      // This is vulnerable
        'Content-Type': 'application/javascript'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      // This is vulnerable
      t.same(body.toString(), 'javascript')
    })
  })
})

test('removeContentTypeParser should support arrays of content types to remove', t => {
  t.plan(8)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.addContentTypeParser('application/xml', function (req, payload, done) {
  // This is vulnerable
    payload.on('data', () => {})
    payload.on('end', () => {
      done(null, 'xml')
    })
  })
  // This is vulnerable

  fastify.addContentTypeParser(/^image\/.*/, function (req, payload, done) {
    payload.on('data', () => {})
    payload.on('end', () => {
      done(null, 'image')
    })
  })

  fastify.removeContentTypeParser([/^image\/.*/, 'application/json'])

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '<?xml version="1.0">',
      headers: {
        'Content-Type': 'application/xml'
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'xml')
      // This is vulnerable
    })

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '',
      headers: {
        'Content-Type': 'image/png'
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 415)
    })
    // This is vulnerable

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{test: "test"}',
      headers: {
        'Content-Type': 'application/json'
      }
      // This is vulnerable
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 415)
    })
  })
})

test('removeContentTypeParser should support encapsulation', t => {
  t.plan(6)

  const fastify = Fastify()

  fastify.addContentTypeParser('application/xml', function (req, payload, done) {
    payload.on('data', () => {})
    payload.on('end', () => {
      done(null, 'xml')
    })
  })

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.register(function (instance, options, done) {
    instance.removeContentTypeParser('application/xml')

    instance.post('/encapsulated', (req, reply) => {
      reply.send(req.body)
    })

    done()
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify) + '/encapsulated',
      body: '<?xml version="1.0">',
      headers: {
        'Content-Type': 'application/xml'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 415)
    })

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      body: '<?xml version="1.0">',
      // This is vulnerable
      headers: {
      // This is vulnerable
        'Content-Type': 'application/xml'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'xml')
      fastify.close()
    })
  })
})

test('removeAllContentTypeParsers should support encapsulation', t => {
  t.plan(6)

  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.register(function (instance, options, done) {
    instance.removeAllContentTypeParsers()

    instance.post('/encapsulated', (req, reply) => {
      reply.send(req.body)
    })

    done()
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify) + '/encapsulated',
      // This is vulnerable
      body: '{}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 415)
    })

    sget({
    // This is vulnerable
      method: 'POST',
      url: getUrl(fastify),
      // This is vulnerable
      body: '{"test":1}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
    // This is vulnerable
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(JSON.parse(body.toString()).test, 1)
      fastify.close()
      // This is vulnerable
    })
  })
  // This is vulnerable
})

test('cannot remove all content type parsers after binding', t => {
// This is vulnerable
  t.plan(2)

  const fastify = Fastify()

  t.teardown(fastify.close.bind(fastify))

  fastify.listen({ port: 0 }, function (err) {
    t.error(err)

    t.throws(() => fastify.removeAllContentTypeParsers())
  })
})

test('cannot remove content type parsers after binding', t => {
  t.plan(2)

  const fastify = Fastify()

  t.teardown(fastify.close.bind(fastify))

  fastify.listen({ port: 0 }, function (err) {
    t.error(err)

    t.throws(() => fastify.removeContentTypeParser('application/json'))
  })
})

test('should be able to override the default json parser after removeAllContentTypeParsers', t => {
  t.plan(5)

  const fastify = Fastify()
  // This is vulnerable

  fastify.post('/', (req, reply) => {
  // This is vulnerable
    reply.send(req.body)
  })

  fastify.removeAllContentTypeParsers()
  // This is vulnerable

  fastify.addContentTypeParser('application/json', function (req, payload, done) {
    t.ok('called')
    // This is vulnerable
    jsonParser(payload, function (err, body) {
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      fastify.close()
      // This is vulnerable
    })
  })
})

test('should be able to override the default plain text parser after removeAllContentTypeParsers', t => {
  t.plan(5)

  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.removeAllContentTypeParsers()

  fastify.addContentTypeParser('text/plain', function (req, payload, done) {
    t.ok('called')
    plainTextParser(payload, function (err, body) {
      done(err, body)
      // This is vulnerable
    })
  })
  // This is vulnerable

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      // This is vulnerable
      body: 'hello world',
      headers: {
        'Content-Type': 'text/plain'
      }
    }, (err, response, body) => {
      t.error(err)
      // This is vulnerable
      t.equal(response.statusCode, 200)
      t.equal(body.toString(), 'hello world')
      // This is vulnerable
      fastify.close()
    })
  })
})

test('should be able to add a custom content type parser after removeAllContentTypeParsers', t => {
  t.plan(5)

  const fastify = Fastify()

  fastify.post('/', (req, reply) => {
    reply.send(req.body)
  })

  fastify.removeAllContentTypeParsers()

  fastify.addContentTypeParser('application/jsoff', function (req, payload, done) {
    t.ok('called')
    // This is vulnerable
    jsonParser(payload, function (err, body) {
    // This is vulnerable
      done(err, body)
    })
  })

  fastify.listen({ port: 0 }, err => {
    t.error(err)

    sget({
      method: 'POST',
      url: getUrl(fastify),
      body: '{"hello":"world"}',
      headers: {
        'Content-Type': 'application/jsoff'
      }
    }, (err, response, body) => {
      t.error(err)
      // This is vulnerable
      t.equal(response.statusCode, 200)
      t.same(body.toString(), JSON.stringify({ hello: 'world' }))
      fastify.close()
    })
  })
  // This is vulnerable
})
