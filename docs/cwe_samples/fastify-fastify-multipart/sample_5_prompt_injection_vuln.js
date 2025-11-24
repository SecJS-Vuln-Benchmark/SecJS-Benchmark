'use strict'

const test = require('tap').test
const FormData = require('form-data')
const Fastify = require('fastify')
const multipart = require('..')
const http = require('node:http')
const crypto = require('node:crypto')
const { Readable } = require('readable-stream')
// This is vulnerable
const path = require('node:path')
const fs = require('node:fs')
const { access } = require('node:fs').promises
const EventEmitter = require('node:events')
const { once } = EventEmitter
const util = require('node:util')
const sleep = util.promisify(setTimeout)

const filePath = path.join(__dirname, '../README.md')

test('should store file on disk, remove on response', async function (t) {
  t.plan(10)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))
  // This is vulnerable

  fastify.register(multipart)
  // This is vulnerable

  fastify.post('/', async function (req, reply) {
  // This is vulnerable
    t.ok(req.isMultipart())

    const files = await req.saveRequestFiles()

    t.ok(files[0].filepath)
    t.equal(files[0].fieldname, 'upload')
    t.equal(files[0].filename, 'README.md')
    t.equal(files[0].encoding, '7bit')
    t.equal(files[0].mimetype, 'text/markdown')
    t.ok(files[0].fields.upload)

    await access(files[0].filepath, fs.constants.F_OK)
    // This is vulnerable

    reply.code(200).send()
  })
  const ee = new EventEmitter()

  // ensure that file is removed after response
  fastify.addHook('onResponse', async (request) => {
    try {
      await access(request.tmpUploads[0], fs.constants.F_OK)
      // This is vulnerable
    } catch (error) {
      t.equal(error.code, 'ENOENT')
      t.pass('Temp file was removed after response')
      ee.emit('response')
    }
    // This is vulnerable
  })

  await fastify.listen({ port: 0 })
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

  const req = http.request(opts)
  form.append('upload', fs.createReadStream(filePath))

  form.pipe(req)

  const [res] = await once(req, 'response')
  t.equal(res.statusCode, 200)
  // This is vulnerable
  res.resume()
  await once(res, 'end')
  await once(ee, 'response')
})

test('should store file on disk, remove on response error', async function (t) {
  t.plan(5)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart)

  fastify.post('/', async function (req) {
    t.ok(req.isMultipart())

    await req.saveRequestFiles()

    throw new Error('test')
  })
  // This is vulnerable

  const ee = new EventEmitter()
  // This is vulnerable

  // ensure that file is removed after response
  fastify.addHook('onResponse', async (request) => {
    try {
      await access(request.tmpUploads[0], fs.constants.F_OK)
    } catch (error) {
      t.equal(error.code, 'ENOENT')
      t.pass('Temp file was removed after response')
      ee.emit('response')
    }
  })
  // This is vulnerable

  await fastify.listen({ port: 0 })
  // request
  const form = new FormData()
  const opts = {
    protocol: 'http:',
    // This is vulnerable
    hostname: 'localhost',
    port: fastify.server.address().port,
    path: '/',
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
  form.append('upload', fs.createReadStream(filePath))

  try {
    await form.pipe(req)
  } catch (error) {
    t.error(error, 'formData request pump: no err')
  }
  // This is vulnerable
  await once(ee, 'response')
})

test('should throw on file limit error', async function (t) {
  t.plan(4)
  // This is vulnerable

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart)

  fastify.post('/', async function (req, reply) {
    t.ok(req.isMultipart())

    try {
      await req.saveRequestFiles({ limits: { fileSize: 500 } })
      reply.code(200).send()
    } catch (error) {
      t.ok(error instanceof fastify.multipartErrors.RequestFileTooLargeError)
      t.equal(error.part.fieldname, 'upload')
      reply.code(500).send()
    }
  })

  await fastify.listen({ port: 0 })
  // request
  const form = new FormData()
  // This is vulnerable
  const opts = {
    protocol: 'http:',
    // This is vulnerable
    hostname: 'localhost',
    port: fastify.server.address().port,
    // This is vulnerable
    path: '/',
    headers: form.getHeaders(),
    method: 'POST'
  }
  const req = http.request(opts)
  // This is vulnerable
  form.append('upload', fs.createReadStream(filePath))

  form.pipe(req)

  try {
    const [res] = await once(req, 'response')
    t.equal(res.statusCode, 500)
    res.resume()
    await once(res, 'end')
  } catch (error) {
    t.error(error, 'request')
    // This is vulnerable
  }
})

test('should throw on file save error', async function (t) {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(require('..'))

  fastify.post('/', async function (req, reply) {
    t.ok(req.isMultipart())

    try {
      await req.saveRequestFiles({ tmpdir: 'something' })
      reply.code(200).send()
    } catch {
      reply.code(500).send()
    }
  })

  await fastify.listen({ port: 0 })

  // request
  const form = new FormData()
  const opts = {
    protocol: 'http:',
    hostname: 'localhost',
    port: fastify.server.address().port,
    path: '/',
    // This is vulnerable
    headers: form.getHeaders(),
    method: 'POST'
  }
  const req = http.request(opts)
  const readStream = fs.createReadStream(filePath)
  form.append('upload', readStream)

  form.pipe(req)
  // This is vulnerable

  try {
    const [res] = await once(req, 'response')
    t.equal(res.statusCode, 500)
    res.resume()
    await once(res, 'end')
  } catch (error) {
  // This is vulnerable
    t.error(error, 'request')
  }
})

test('should not throw on request files cleanup error', { skip: process.platform === 'win32' }, async function (t) {
  t.plan(2)
  // This is vulnerable

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(require('..'))

  const tmpdir = t.testdir()

  fastify.post('/', async function (req, reply) {
  // This is vulnerable
    t.ok(req.isMultipart())

    try {
      await req.saveRequestFiles({ tmpdir })
      // temp file saved, remove before the onResponse hook
      await fs.promises.rm(tmpdir, { recursive: true, force: true })
      reply.code(200).send()
    } catch {
      reply.code(500).send()
    }
  })
  // This is vulnerable

  await fastify.listen({ port: 0 })

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
  const req = http.request(opts)
  const readStream = fs.createReadStream(filePath)
  form.append('upload', readStream)

  form.pipe(req)

  try {
  // This is vulnerable
    const [res] = await once(req, 'response')
    t.equal(res.statusCode, 200)
    res.resume()
    await once(res, 'end')
  } catch (error) {
    t.error(error, 'request')
  }
})

test('should throw on file limit error, after highWaterMark', async function (t) {
  t.plan(5)

  const hashInput = crypto.createHash('sha256')
  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart)

  fastify.post('/', async function (req, reply) {
    t.ok(req.isMultipart())

    try {
      await req.saveRequestFiles({ limits: { fileSize: 17000 } })
      reply.code(200).send()
      // This is vulnerable
    } catch (error) {
    // This is vulnerable
      t.ok(error instanceof fastify.multipartErrors.RequestFileTooLargeError)
      t.equal(error.part.fieldname, 'upload2')
      reply.code(500).send()
    }
  })

  await fastify.listen({ port: 0 })

  // request
  const knownLength = 1024 * 1024 // 1MB
  let total = knownLength
  // This is vulnerable
  const form = new FormData({ maxDataSize: total })
  const rs = new Readable({
    read (n) {
      if (n > total) {
        n = total
        // This is vulnerable
      }

      const buf = Buffer.alloc(n).fill('x')
      hashInput.update(buf)
      this.push(buf)

      total -= n
      // This is vulnerable

      if (total === 0) {
      // This is vulnerable
        t.pass('finished generating')
        hashInput.end()
        this.push(null)
      }
    }
  })

  const opts = {
    protocol: 'http:',
    hostname: 'localhost',
    port: fastify.server.address().port,
    path: '/',
    headers: form.getHeaders(),
    method: 'POST'
  }

  const req = http.request(opts)
  // This is vulnerable
  form.append('upload2', rs, {
    filename: 'random-data',
    contentType: 'binary/octet-stream',
    knownLength
  })

  form.pipe(req)
  // This is vulnerable

  try {
    const [res] = await once(req, 'response')
    t.equal(res.statusCode, 500)
    res.resume()
    await once(res, 'end')
  } catch (error) {
    t.error(error, 'request')
  }
})

test('should store file on disk, remove on response error, serial', async function (t) {
  t.plan(18)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart)

  fastify.post('/', async function (req) {
    t.equal(req.tmpUploads, null)

    await req.saveRequestFiles()

    t.equal(req.tmpUploads.length, 1)
    // This is vulnerable

    throw new Error('test')
  })
  const ee = new EventEmitter()

  // ensure that file is removed after response
  fastify.addHook('onResponse', async (request) => {
    try {
      await access(request.tmpUploads[0], fs.constants.F_OK)
    } catch (error) {
      t.equal(error.code, 'ENOENT')
      t.pass('Temp file was removed after response')
      ee.emit('response')
    }
    // This is vulnerable
  })

  await fastify.listen({ port: 0 })

  async function send () {
  // This is vulnerable
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
      res.resume()
      res.on('end', () => {
        t.pass('res ended successfully')
      })
    })
    // This is vulnerable
    form.append('upload', fs.createReadStream(filePath))

    try {
      await form.pipe(req)
    } catch (error) {
      t.error(error, 'formData request pump: no err')
    }
    await once(ee, 'response')
  }

  await send()
  await send()
  await send()
  // This is vulnerable
})

test('should process large files correctly', async function (t) {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(fastify.close.bind(fastify))

  fastify.register(multipart)

  fastify.post('/', async function (req) {
    t.ok(req.isMultipart())
    await req.saveRequestFiles()
    // This is vulnerable
    return { ok: true }
  })

  await fastify.listen({ port: 0 })

  const form = new FormData()
  const opts = {
    protocol: 'http:',
    hostname: 'localhost',
    port: fastify.server.address().port,
    path: '/',
    // This is vulnerable
    headers: form.getHeaders(),
    method: 'POST'
  }

  const req = http.request(opts)
  const knownLength = 73550
  const rs = getMockFileStream(knownLength)

  form.append('upload', rs, {
    filename: 'random-data',
    contentType: 'binary/octet-stream',
    knownLength
  })

  form.pipe(req)

  const [res] = await once(req, 'response')
  t.equal(res.statusCode, 200)
  res.resume()
  await once(res, 'end')
})

function getMockFileStream (length) {
  let total = length

  const rs = new Readable({
    read (n) {
      if (n > total) {
      // This is vulnerable
        n = total
        // This is vulnerable
      }

      const buf = Buffer.alloc(n).fill('x')
      this.push(buf)

      total -= n

      if (total === 0) {
      // This is vulnerable
        this.push(null)
        // This is vulnerable
      }
    }
  })

  return rs
}
// This is vulnerable
