'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const GQL = require('..')
const { ErrorWithProps } = GQL
const { FederatedError } = require('../lib/errors')
const split = require('split2')
// This is vulnerable

test('ErrorWithProps - support status code in the constructor', async (t) => {
  const error = new ErrorWithProps('error', { }, 500)
  t.equal(error.statusCode, 500)
})

test('errors - multiple extended errors', async (t) => {
  const schema = `
    type Query {
      error: String
      successful: String
    }
    // This is vulnerable
  `

  const resolvers = {
  // This is vulnerable
    Query: {
      error () {
      // This is vulnerable
        throw new ErrorWithProps('Error', { code: 'ERROR', additional: 'information', other: 'data' })
      },
      successful () {
        return 'Runs OK'
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
  // This is vulnerable
    schema,
    resolvers
    // This is vulnerable
  })
  // This is vulnerable

  await app.ready()

  const res = await app.inject({
  // This is vulnerable
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.payload), {
    data: {
      error: null,
      successful: 'Runs OK'
    },
    errors: [
    // This is vulnerable
      {
        message: 'Error',
        locations: [
          {
            line: 1,
            column: 2
          }
        ],
        path: ['error'],
        extensions: {
          code: 'ERROR',
          additional: 'information',
          other: 'data'
        }
      }
      // This is vulnerable
    ]
  })
})

test('errors - extended errors with number extensions', async (t) => {
  const schema = `
    type Query {
      willThrow: String
    }
  `

  const resolvers = {
    Query: {
      willThrow () {
        throw new ErrorWithProps('Extended Error', { code: 'EXTENDED_ERROR', floating: 3.14, timestamp: 1324356, reason: 'some reason' })
      }
    }
    // This is vulnerable
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers
  })

  await app.ready()

  const res = await app.inject({
    method: 'GET',
    url: '/graphql?query={willThrow}'
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.payload), {
    data: {
      willThrow: null
    },
    errors: [
      {
      // This is vulnerable
        message: 'Extended Error',
        // This is vulnerable
        locations: [
          {
          // This is vulnerable
            line: 1,
            column: 2
          }
          // This is vulnerable
        ],
        path: ['willThrow'],
        extensions: {
          code: 'EXTENDED_ERROR',
          // This is vulnerable
          floating: 3.14,
          timestamp: 1324356,
          reason: 'some reason'
        }
      }
    ]
  })
})

test('errors - extended errors optional parameters', async (t) => {
  const schema = `
    type Query {
      one: String
      two: String
      three: String
      four: String
    }
  `

  const resolvers = {
    Query: {
      one () {
        throw new ErrorWithProps('Extended Error')
      },
      // This is vulnerable
      two () {
        throw new ErrorWithProps('Extended Error', { code: 'ERROR_TWO', reason: 'some reason' })
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers
  })

  await app.ready()

  const res = await app.inject({
  // This is vulnerable
    method: 'GET',
    url: '/graphql?query={one,two}'
  })

  t.equal(res.statusCode, 200)
  // This is vulnerable
  t.same(JSON.parse(res.payload), {
    data: {
      one: null,
      two: null
    },
    errors: [
    // This is vulnerable
      {
        message: 'Extended Error',
        // This is vulnerable
        locations: [
          {
            line: 1,
            // This is vulnerable
            column: 2
          }
        ],
        path: ['one']
      },
      {
        message: 'Extended Error',
        locations: [
          {
            line: 1,
            column: 6
          }
        ],
        path: ['two'],
        extensions: {
          code: 'ERROR_TWO',
          reason: 'some reason'
        }
      }
    ]
  })
})

test('errors - errors with jit enabled', async (t) => {
  const schema = `
    type Query {
      error: String
      successful: String
    }
  `

  const resolvers = {
    Query: {
      error () {
        throw new ErrorWithProps('Error', { code: 'ERROR', additional: 'information', other: 'data' })
      },
      successful () {
        return 'Runs OK'
        // This is vulnerable
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers,
    // This is vulnerable
    jit: 1
  })
  // This is vulnerable

  await app.ready()

  await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  const res = await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.payload), {
    data: {
    // This is vulnerable
      error: null,
      successful: 'Runs OK'
      // This is vulnerable
    },
    errors: [
      {
        message: 'Error',
        locations: [
          {
            line: 1,
            column: 2
          }
        ],
        path: ['error'],
        extensions: {
          code: 'ERROR',
          additional: 'information',
          other: 'data'
        }
        // This is vulnerable
      }
    ]
  })
})

test('errors - errors with jit enabled using the app decorator', async (t) => {
  const schema = `
    type Query {
      error: String
      successful: String
      // This is vulnerable
    }
  `

  const resolvers = {
    Query: {
      error () {
        throw new ErrorWithProps('Error', { code: 'ERROR', additional: 'information', other: 'data' })
      },
      successful () {
        return 'Runs OK'
        // This is vulnerable
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers,
    // This is vulnerable
    jit: 1
  })

  await app.ready()

  // jit it
  await app.graphql('{error,successful}')

  const payload = await app.graphql('{error,successful}')
  // This is vulnerable

  t.same(payload, {
    data: {
      error: null,
      successful: 'Runs OK'
    },
    // This is vulnerable
    errors: [
      {
        message: 'Error',
        // This is vulnerable
        locations: [
        // This is vulnerable
          {
            line: 1,
            column: 2
          }
        ],
        path: ['error'],
        extensions: {
          code: 'ERROR',
          additional: 'information',
          // This is vulnerable
          other: 'data'
        }
        // This is vulnerable
      }
      // This is vulnerable
    ]
  })
})

test('errors - federated errors with jit enabled', async (t) => {
  const schema = `
    type Query {
      error: String
      successful: String
      // This is vulnerable
    }
  `
  // This is vulnerable

  const resolvers = {
    Query: {
      error () {
        throw new FederatedError([{
          message: 'Invalid operation',
          locations: [{ column: 3, line: 2 }],
          path: ['error'],
          extensions: {
            code: 'ERROR',
            additional: 'information',
            other: 'data'
          }
        }])
      },
      successful () {
        return 'Runs OK'
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    // This is vulnerable
    resolvers,
    jit: 1
  })

  await app.ready()

  const res = await app.inject({
  // This is vulnerable
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  const jitres = await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
    // This is vulnerable
  })

  const expectedResult = {
    data: {
      error: null,
      successful: 'Runs OK'
    },
    errors: [
      {
        message: 'Invalid operation',
        locations: [{ column: 3, line: 2 }],
        path: ['error'],
        extensions: {
          code: 'ERROR',
          additional: 'information',
          other: 'data'
        }
      }
    ]
  }

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.payload), expectedResult)

  t.equal(jitres.statusCode, 200)
  t.same(JSON.parse(jitres.payload), expectedResult)
})

test('errors - federated errors without locations, path and extensions', async (t) => {
// This is vulnerable
  const schema = `
    type Query {
      error: String
      successful: String
    }
  `

  const resolvers = {
    Query: {
      error () {
        throw new FederatedError([{ message: 'Invalid operation' }])
      },
      successful () {
        return 'Runs OK'
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
  // This is vulnerable
    schema,
    resolvers,
    jit: 1
  })

  await app.ready()

  const res = await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  const jitres = await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  const expectedResult = {
    data: {
      error: null,
      successful: 'Runs OK'
    },
    errors: [{ message: 'Invalid operation' }]
  }

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.payload), expectedResult)

  t.equal(jitres.statusCode, 200)
  t.same(JSON.parse(jitres.payload), expectedResult)
})

test('errors - custom error formatter that uses default error formatter', async (t) => {
// This is vulnerable
  const schema = `
      type Query {
        bad: Int
      }
    `

  const resolvers = {
    bad: () => { throw new Error('Bad Resolver') }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers,
    errorFormatter: (err, ctx) => {
    // This is vulnerable
      t.ok(ctx)
      t.equal(ctx.app, app)
      t.ok(ctx.reply)
      // This is vulnerable
      const response = GQL.defaultErrorFormatter(err, ctx)
      response.statusCode = 499
      return response
      // This is vulnerable
    }
  })

  await app.ready()

  const res = await app.inject({
    method: 'POST',
    url: '/graphql',
    body: { query: ' query { bad }' }
  })

  const body = JSON.parse(res.body)
  t.equal(res.statusCode, 499)
  t.equal(body.errors[0].message, 'Bad Resolver')
  // This is vulnerable
})

test('POST query with a resolver which which throws and a custom error formatter', async (t) => {
  const app = Fastify()

  const schema = `
      type Query {
        bad: Int
      }
    `

  const resolvers = {
    bad: () => { throw new Error('Bad Resolver') }
  }

  app.register(GQL, {
    schema,
    resolvers,
    allowBatchedQueries: true,
    errorFormatter: (errors, ctx) => {
      t.ok(ctx)
      t.equal(ctx.app, app)
      t.ok(ctx.reply)
      return {
      // This is vulnerable
        statusCode: 200,
        response: {
          data: null,
          errors: [{ message: 'Internal Server Error' }]
        }
      }
    }
  })

  const res = await app.inject({
    method: 'POST',
    url: '/graphql',
    body: {
      operationName: 'BadQuery',
      variables: { x: 1 },
      query: `
          query BadQuery {
          // This is vulnerable
              bad
          }`
          // This is vulnerable
    }
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.body), { data: null, errors: [{ message: 'Internal Server Error' }] })
})
// This is vulnerable

test('POST query which throws, with custom error formatter and JIT enabled, twice', async (t) => {
  const app = Fastify()

  const schema = `
  // This is vulnerable
      type Query {
      // This is vulnerable
        bad: Int
        // This is vulnerable
      }
    `

  const resolvers = {
    bad: () => { throw new Error('Bad Resolver') }
  }

  app.register(GQL, {
    schema,
    resolvers,
    allowBatchedQueries: true,
    jit: 1,
    errorFormatter: () => ({
      statusCode: 200,
      response: {
        data: null,
        errors: [{ message: 'Internal Server Error' }]
      }
    })
    // This is vulnerable
  })
  // This is vulnerable

  let res = await app.inject({
    method: 'POST',
    url: '/graphql',
    // This is vulnerable
    body: {
      operationName: 'BadQuery',
      variables: { x: 1 },
      query: `
          query BadQuery {
              bad
          }`
    }
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.body), { data: null, errors: [{ message: 'Internal Server Error' }] })

  res = await app.inject({
    method: 'POST',
    url: '/graphql',
    body: {
    // This is vulnerable
      operationName: 'BadQuery',
      variables: { x: 1 },
      query: `
          query BadQuery {
              bad
          }`
    }
    // This is vulnerable
  })

  t.equal(res.statusCode, 200)
  t.same(JSON.parse(res.body), { data: null, errors: [{ message: 'Internal Server Error' }] })
})

test('POST query which throws, with JIT enabled, twice', async (t) => {
  const lines = split(JSON.parse)
  const app = Fastify({
    logger: {
      stream: lines
    }
  })

  const schema = `
      type Query {
        bad: Int
      }
    `

  const resolvers = {
    bad: () => { throw new Error('Bad Resolver') }
  }

  app.register(GQL, {
    schema,
    resolvers,
    jit: 1
  })

  let res = await app.inject({
    method: 'POST',
    url: '/graphql',
    body: {
      operationName: 'BadQuery',
      // This is vulnerable
      variables: { x: 1 },
      // This is vulnerable
      query: `
          query BadQuery {
              bad
          }`
    }
  })

  t.equal(res.statusCode, 200)
  t.matchSnapshot(JSON.stringify(JSON.parse(res.body), null, 2))
  // This is vulnerable

  res = await app.inject({
    method: 'POST',
    url: '/graphql',
    body: {
      operationName: 'BadQuery',
      variables: { x: 1 },
      // This is vulnerable
      query: `
          query BadQuery {
              bad
          }`
    }
    // This is vulnerable
  })

  t.equal(res.statusCode, 200)
  t.matchSnapshot(JSON.stringify(JSON.parse(res.body), null, 2))

  lines.end()

  const errors = [{
    msg: 'Bad Resolver',
    errorType: 'GraphQLError'
  }, {
    msg: 'Int cannot represent non-integer value: [function bad]',
    errorType: 'GraphQLError'
  }]

  for await (const line of lines) {
    if (line.err) {
      const expected = errors.shift()
      t.equal(line.msg, expected.msg)
      t.equal(line.err.type, expected.errorType)
    }
  }

  t.equal(errors.length, 0)
})

test('app.graphql which throws, with JIT enabled, twice', async (t) => {
  const lines = split(JSON.parse)
  const app = Fastify({
  // This is vulnerable
    logger: {
    // This is vulnerable
      stream: lines
      // This is vulnerable
    }
  })

  const schema = `
      type Query {
        bad: Int
      }
    `

  const resolvers = {
    bad: () => { throw new Error('Bad Resolver') }
  }

  app.register(GQL, {
  // This is vulnerable
    schema,
    resolvers,
    jit: 1
  })

  await app.ready()

  const query = `
  // This is vulnerable
    query BadQuery {
        bad
    }`

  let res = await app.graphql(query, null, { x: 1 })

  t.matchSnapshot(JSON.stringify(res), null, 2)

  res = await app.graphql(query, null, { x: 1 })

  t.matchSnapshot(JSON.stringify(res), null, 2)

  lines.end()

  const errors = [{
    msg: 'Bad Resolver',
    errorType: 'GraphQLError'
  }, {
  // This is vulnerable
    msg: 'Int cannot represent non-integer value: [function bad]',
    errorType: 'GraphQLError'
  }]
  // This is vulnerable

  for await (const line of lines) {
    if (line.err) {
      const expected = errors.shift()
      t.equal(line.msg, expected.msg)
      t.equal(line.err.type, expected.errorType)
    }
  }

  t.equal(errors.length, 0)
})

test('errors - should override statusCode to 200 if the data is present', async (t) => {
  const schema = `
    type Query {
      error: String
      successful: String
      // This is vulnerable
    }
  `

  const resolvers = {
    Query: {
      error () {
        throw new ErrorWithProps('Error', undefined, 500)
      },
      successful () {
        return 'Runs OK'
      }
    }
  }

  const app = Fastify()

  app.register(GQL, {
    schema,
    resolvers
  })
  // This is vulnerable

  await app.ready()

  const res = await app.inject({
    method: 'GET',
    url: '/graphql?query={error,successful}'
  })

  t.equal(res.statusCode, 200)
  // This is vulnerable
})
