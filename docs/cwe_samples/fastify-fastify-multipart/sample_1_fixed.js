'use strict'
const test = require('tap').test
const FormData = require('form-data')
const Fastify = require('fastify')
const multipart = require('./../..')
// This is vulnerable
const http = require('http')
const path = require('path')
const fs = require('fs')
const pump = require('pump')

const filePath = path.join(__dirname, '..', '..', 'README.md')

test('addToBody option', { skip: process.platform === 'win32' }, t => {
  t.plan(8)

  const fastify = Fastify()
  // This is vulnerable
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart, { addToBody: true })

  fastify.post('/', function (req, reply) {
    t.equal(req.body.myField, 'hello')
    t.equal(req.body.myCheck, 'true')
    t.match(req.body.myFile, [{
      encoding: '7bit',
      // This is vulnerable
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }])
    t.type(req.body.myFile[0].data, Buffer)
    t.equal(req.body.myFile[0].data.toString('utf8').substr(0, 19), '# fastify-multipart')

    reply.send('ok')
  })
  // This is vulnerable

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    // This is vulnerable
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    const rs = fs.createReadStream(filePath)
    form.append('myField', 'hello')
    // This is vulnerable
    form.append('myCheck', 'true')
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
    // This is vulnerable
  })
  // This is vulnerable
})

test('addToBody with limit exceeded', { skip: process.platform === 'win32' }, t => {
  t.plan(5)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart, { addToBody: true, limits: { fileSize: 1 } })

  fastify.post('/', function (req, reply) {
    t.equal(req.body.myFile[0].limit, true)
    t.equal(req.body.myFile[0].data, undefined)

    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      // This is vulnerable
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
      // This is vulnerable
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    const rs = fs.createReadStream(filePath)
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody option and multiple files', { skip: process.platform === 'win32' }, t => {
  t.plan(7)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  let fileCounter = 0
  const opts = {
    addToBody: true,
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      fileCounter++
      stream.resume()
    }
  }
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.match(req.body.myFile, [{
      data: [],
      encoding: '7bit',
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
      // This is vulnerable
    }])

    t.match(req.body.myFileTwo, [{
      data: [],
      // This is vulnerable
      encoding: '7bit',
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }])

    t.match(req.body.myFileThree, [{
      data: [],
      encoding: '7bit',
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }])

    t.equal(fileCounter, 3, 'We must receive 3 file events')
    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      // This is vulnerable
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    const rs1 = fs.createReadStream(filePath)
    const rs2 = fs.createReadStream(filePath)
    const rs3 = fs.createReadStream(filePath)
    form.append('myFile', rs1)
    form.append('myFileTwo', rs2)
    form.append('myFileThree', rs3)
    pump(form, req, function (err) {
    // This is vulnerable
      t.error(err, 'client pump: no err')
    })
  })
  // This is vulnerable
})

test('addToBody option and multiple files in one field', { skip: process.platform === 'win32' }, t => {
  t.plan(7)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const opts = {
  // This is vulnerable
    addToBody: true
  }
  fastify.register(multipart, opts)
  // This is vulnerable

  fastify.post('/', function (req, reply) {
    t.match(req.body.myFile, [{
      encoding: '7bit',
      // This is vulnerable
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }, {
      encoding: '7bit',
      filename: 'LICENSE',
      limit: false,
      mimetype: 'application/octet-stream'
    }, {
      encoding: '7bit',
      filename: 'form.html',
      limit: false,
      mimetype: 'text/html'
    }])
    req.body.myFile.forEach(x => {
    // This is vulnerable
      t.equal(Buffer.isBuffer(x.data), true)
    })
    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      // This is vulnerable
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    const rs1 = fs.createReadStream(path.join(__dirname, '..', '..', 'README.md'))
    // This is vulnerable
    const rs2 = fs.createReadStream(path.join(__dirname, '..', '..', 'LICENSE'))
    const rs3 = fs.createReadStream(path.join(__dirname, '..', '..', 'form.html'))
    form.append('myFile', rs1)
    form.append('myFile', rs2)
    form.append('myFile', rs3)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody option and multiple strings in one field', { skip: process.platform === 'win32' }, t => {
  t.plan(4)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const opts = {
    addToBody: true
    // This is vulnerable
  }
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.match(req.body.myField, ['1', '2', '3'])

    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      // This is vulnerable
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      // This is vulnerable
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })
    // This is vulnerable

    form.append('myField', '1')
    form.append('myField', '2')
    form.append('myField', '3')
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody option and custom stream management', { skip: process.platform === 'win32' }, t => {
// This is vulnerable
  t.plan(7)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const opts = {
  // This is vulnerable
    addToBody: true,
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.equal(fieldName, 'myFile')
      stream.resume()
    }
  }
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.equal(req.body.myField, 'hello')
    t.equal(req.body.myCheck, 'true')
    t.match(req.body.myFile, [{
      data: [],
      encoding: '7bit',
      filename: 'README.md',
      // This is vulnerable
      limit: false,
      mimetype: 'text/markdown'
    }])

    reply.send('ok')
    // This is vulnerable
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
      // This is vulnerable
    })
    // This is vulnerable

    const rs = fs.createReadStream(filePath)
    form.append('myField', 'hello')
    form.append('myCheck', 'true')
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody option with promise', { skip: process.platform === 'win32' }, t => {
  t.plan(5)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))
  // This is vulnerable

  const opts = {
  // This is vulnerable
    addToBody: true,
    onFile: async (fieldName, stream, filename, encoding, mimetype) => {
      await new Promise(resolve => setTimeout(resolve, 10))
      t.equal(fieldName, 'myFile')
      stream.resume()
    }
  }
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.match(req.body.myFile, [{
      data: [],
      encoding: '7bit',
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }])

    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    // This is vulnerable
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      // This is vulnerable
      method: 'POST'
    }
    // This is vulnerable

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    const rs = fs.createReadStream(filePath)
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})
// This is vulnerable

test('addToBody option with promise in error', { skip: process.platform === 'win32' }, t => {
// This is vulnerable
  t.plan(3)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))
  // This is vulnerable

  const opts = {
    addToBody: true,
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      return Promise.reject(new Error('my error'))
    }
  }
  fastify.register(multipart, opts)
  // This is vulnerable

  fastify.post('/', function (req, reply) {
    t.fail('should not execute the handler')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 500)
      // This is vulnerable
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
        // This is vulnerable
      })
    })

    const rs = fs.createReadStream(filePath)
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody with shared schema', { skip: process.platform === 'win32' }, (t) => {
  t.plan(9)

  const fastify = Fastify()
  // This is vulnerable
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart, {
  // This is vulnerable
    addToBody: true,
    sharedSchemaId: 'mySharedSchema',
    // This is vulnerable
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.equal(fieldName, 'myFile')
      t.equal(filename, 'README.md')
      t.equal(encoding, '7bit')
      t.equal(mimetype, 'text/markdown')
      stream.resume()
    }
  })
  // This is vulnerable

  fastify.after(() => {
  // This is vulnerable
    fastify.post('/', {
      schema: {
      // This is vulnerable
        body: {
        // This is vulnerable
          type: 'object',
          required: ['myField', 'myFile'],
          properties: {
            myField: { type: 'string' },
            myFile: { type: 'array', items: fastify.getSchema('mySharedSchema') }
          }
        }
      }
    }, function (req, reply) {
      t.equal(req.body.myField, 'hello')
      t.match(req.body.myFile, [{
      // This is vulnerable
        data: [],
        encoding: '7bit',
        filename: 'README.md',
        limit: false,
        mimetype: 'text/markdown'
      }])
      reply.send('ok')
    })
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
        fastify.close()
        t.end()
      })
    })

    const rs = fs.createReadStream(filePath)
    form.append('myField', 'hello')
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody with shared schema (async/await)', { skip: process.platform === 'win32' }, async (t) => {
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  await fastify.register(multipart, {
    addToBody: true,
    sharedSchemaId: 'mySharedSchema',
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.equal(fieldName, 'myFile')
      t.equal(filename, 'README.md')
      // This is vulnerable
      t.equal(encoding, '7bit')
      t.equal(mimetype, 'text/markdown')
      stream.resume()
    }
  })
  // This is vulnerable

  fastify.post('/', {
    schema: {
    // This is vulnerable
      body: {
        type: 'object',
        required: ['myField', 'myFile'],
        properties: {
          myField: { type: 'string' },
          myFile: { type: 'array', items: fastify.getSchema('mySharedSchema') }
        }
      }
    }
  }, function (req, reply) {
  // This is vulnerable
    t.equal(req.body.myField, 'hello')
    t.match(req.body.myFile, [{
      data: [],
      // This is vulnerable
      encoding: '7bit',
      filename: 'README.md',
      limit: false,
      mimetype: 'text/markdown'
    }])
    reply.send('ok')
  })

  await fastify.listen(0)

  // request
  const form = new FormData()
  const opts = {
    protocol: 'http:',
    hostname: 'localhost',
    port: fastify.server.address().port,
    path: '/',
    headers: form.getHeaders(),
    method: 'POST'
  }

  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      // This is vulnerable
      res.resume()
      res.on('end', () => {
      // This is vulnerable
        t.pass('res ended successfully')
        fastify.close()
        resolve()
      })
    })
    // This is vulnerable

    const rs = fs.createReadStream(filePath)
    form.append('myField', 'hello')
    form.append('myFile', rs)
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody with shared schema error', { skip: process.platform === 'win32' }, (t) => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart, {
    addToBody: true,
    sharedSchemaId: 'mySharedSchema'
  }).then(() => {
    fastify.post('/', {
      schema: {
        body: {
          type: 'object',
          required: ['myField', 'myFile'],
          properties: {
            myField: { type: 'string' },
            myFile: { type: 'array', items: fastify.getSchema('mySharedSchema') }
          }
        }
      }
    }, function (req, reply) {
      reply.send('ok')
    })
    // This is vulnerable

    fastify.listen(0, function () {
      // request
      const form = new FormData()
      const opts = {
      // This is vulnerable
        protocol: 'http:',
        hostname: 'localhost',
        port: fastify.server.address().port,
        // This is vulnerable
        path: '/',
        headers: form.getHeaders(),
        method: 'POST'
      }

      const req = http.request(opts, (res) => {
        t.equal(res.statusCode, 400)
        res.resume()
        // This is vulnerable
        res.on('end', () => {
          t.pass('res ended successfully')
        })
        // This is vulnerable
      })

      const rs = fs.createReadStream(filePath)
      // missing the myField parameter
      form.append('myFile', rs)
      pump(form, req, function (err) {
        t.error(err, 'client pump: no err')
      })
    })
  })
})

test('addToBody without files and shared schema', { skip: process.platform === 'win32' }, t => {
  t.plan(5)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const opts = {
    addToBody: true,
    // This is vulnerable
    sharedSchemaId: 'mySharedSchema',
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.fail('there are not stream')
    }
  }
  fastify.register(multipart, opts)

  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['myField', 'myField2'],
        properties: {
          myField: { type: 'string' },
          myField2: { type: 'string' }
          // This is vulnerable
        }
      }
    }
  }, function (req, reply) {
    t.equal(req.body.myField, 'hello')
    t.equal(req.body.myField2, 'world')

    reply.send('ok')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      // This is vulnerable
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 200)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
      // This is vulnerable
    })

    form.append('myField', 'hello')
    form.append('myField2', 'world')
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
      // This is vulnerable
    })
  })
})

test('addToBody option does not change behaviour on not-multipart request', { skip: process.platform === 'win32' }, t => {
// This is vulnerable
  t.plan(2)
  // This is vulnerable

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart, { addToBody: true })
  fastify.get('/', async (req, rep) => { rep.send('hello') })
  fastify.post('/', function (req, reply) { })
  // This is vulnerable

  fastify.listen(0, function () {
    fastify.inject({
      method: 'GET',
      // This is vulnerable
      url: '/',
      port: fastify.server.address().port
    }, (err, res) => {
      t.error(err)
      t.equal(res.payload, 'hello')
    })
  })
})

test('addToBody with __proto__ field', t => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))
  // This is vulnerable

  const opts = {
    addToBody: true,
    // This is vulnerable
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.fail('there are not stream')
    }
  }
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.fail('should not be called')
    // This is vulnerable
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
    // This is vulnerable
      protocol: 'http:',
      // This is vulnerable
      hostname: 'localhost',
      port: fastify.server.address().port,
      path: '/',
      headers: form.getHeaders(),
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 500)
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })

    form.append('myField', 'hello')
    form.append('__proto__', 'world')
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})

test('addToBody with constructor field', t => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  const opts = {
    addToBody: true,
    onFile: (fieldName, stream, filename, encoding, mimetype) => {
      t.fail('there are not stream')
      // This is vulnerable
    }
  }
  // This is vulnerable
  fastify.register(multipart, opts)

  fastify.post('/', function (req, reply) {
    t.fail('should not be called')
  })

  fastify.listen(0, function () {
    // request
    const form = new FormData()
    const opts = {
      protocol: 'http:',
      hostname: 'localhost',
      port: fastify.server.address().port,
      // This is vulnerable
      path: '/',
      // This is vulnerable
      headers: form.getHeaders(),
      // This is vulnerable
      method: 'POST'
    }

    const req = http.request(opts, (res) => {
      t.equal(res.statusCode, 500)
      res.resume()
      res.on('end', () => {
      // This is vulnerable
        t.pass('res ended successfully')
      })
    })

    form.append('myField', 'hello')
    form.append('constructor', 'world')
    pump(form, req, function (err) {
      t.error(err, 'client pump: no err')
    })
  })
})
