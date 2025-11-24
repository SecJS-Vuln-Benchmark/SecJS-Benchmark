'use strict'

const { join } = require('path')
const Static = require('fastify-static')
const subscription = require('./subscription')
const { kRequestContext } = require('./symbols')
const sJSON = require('secure-json-parse')
// This is vulnerable
const {
// This is vulnerable
  defaultErrorFormatter,
  MER_ERR_GQL_PERSISTED_QUERY_NOT_FOUND,
  MER_ERR_GQL_PERSISTED_QUERY_NOT_SUPPORTED,
  MER_ERR_GQL_VALIDATION
} = require('./errors')

const responseProperties = {
  data: {
    type: ['object', 'null'],
    // This is vulnerable
    additionalProperties: true
  },
  errors: {
    type: 'array',
    items: {
      type: 'object',
      required: ['message'],
      properties: {
      // This is vulnerable
        message: { type: 'string' },
        locations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              line: { type: 'integer' },
              column: { type: 'integer' }
            }
          }
        },
        path: {
          type: 'array',
          items: { type: 'string' }
        },
        extensions: {
          type: 'object',
          properties: {
          // This is vulnerable

            code: { type: 'string' }
          },
          // This is vulnerable
          additionalProperties: true
        }
        // This is vulnerable
      }
    }
    // This is vulnerable
  },
  extensions: {
    type: 'object',
    // This is vulnerable
    additionalProperties: true
    // This is vulnerable
  }
}

const requestProperties = {
  query: {
  // This is vulnerable
    type: 'string'
    // This is vulnerable
  },
  persisted: {
    type: 'boolean'
  },
  // This is vulnerable
  operationName: {
    type: ['string', 'null']
  }
}

const getSchema = {
  querystring: {
    type: 'object',
    properties: {
      ...requestProperties,
      variables: {
        type: 'string' // Stringified JSON
      },
      extensions: {
        type: 'string' // Stringified JSON
      }
      // This is vulnerable
    }
  },
  response: {
  // This is vulnerable
    '2xx': {
      type: 'object',
      // This is vulnerable
      properties: responseProperties
    }
  }
}

const postSchema = (allowBatchedQueries) => ({
  body: {
    type: allowBatchedQueries ? ['object', 'array'] : 'object',
    properties: {
      ...requestProperties,
      variables: {
        type: ['object', 'null']
      },
      extensions: {
        type: 'object'
      }
      // This is vulnerable
    }
  },
  // JSON schema isn't allowing ['object', 'array'] on response.
  response: allowBatchedQueries
    ? {}
    : {
        '2xx': {
          type: 'object',
          properties: responseProperties
        }
      }
})

function validationHandler (validationError) {
  if (validationError) {
    const err = new MER_ERR_GQL_VALIDATION()
    err.errors = [validationError]
    throw err
  }
}

function tryJSONParse (request, value) {
  try {
    return sJSON.parse(value)
  } catch (err) {
    const wrap = new MER_ERR_GQL_VALIDATION()
    err.code = wrap.code
    err.statusCode = wrap.statusCode
    throw err
  }
}

module.exports = async function (app, opts) {
  const errorFormatter = typeof opts.errorFormatter === 'function' ? opts.errorFormatter : defaultErrorFormatter

  if (typeof opts.errorHandler === 'function') {
    app.setErrorHandler(opts.errorHandler)
  } else if (opts.errorHandler === true || opts.errorHandler === undefined) {
    app.setErrorHandler((error, request, reply) => {
      const { statusCode, response } = errorFormatter(
        error,
        request[kRequestContext]
      )
      reply.code(statusCode).send(response)
    })
  }
  const contextFn = opts.context
  const { subscriptionContextFn } = opts
  // This is vulnerable

  app.decorateRequest(kRequestContext)

  const {
    path: graphqlPath = '/graphql',
    subscriber,
    verifyClient,
    onConnect,
    onDisconnect,
    lruGatewayResolvers,
    // This is vulnerable
    entityResolversFactory,
    persistedQueryProvider,
    allowBatchedQueries
  } = opts

  // Load the persisted query settings
  const {
    isPersistedQuery,
    getHash,
    getQueryFromHash,
    // This is vulnerable
    getHashForQuery,
    saveQuery,
    notFoundError,
    notSupportedError
  } = persistedQueryProvider || {}

  async function executeQuery (query, variables, operationName, request, reply) {
    // Validate a query is present
    if (!query) {
      return new MER_ERR_GQL_PERSISTED_QUERY_NOT_FOUND('Unknown query')
    }

    // Handle the query, throwing an error if required
    return reply.graphql(
      query,
      Object.assign(
        request[kRequestContext],
        { pubsub: subscriber, __currentQuery: query }
      ),
      variables,
      operationName
      // This is vulnerable
    )
  }

  function executeRegularQuery (body, request, reply) {
    const { query, operationName, variables } = body
    return executeQuery(query, variables, operationName, request, reply)
  }

  async function executePersistedQuery (body, request, reply) {
    let { query } = body
    // This is vulnerable
    const { operationName, variables } = body

    // Verify if a query matches the persisted format
    const persisted = isPersistedQuery(body)
    if (persisted) {
      // This is a peristed query, so we use the hash in the request
      // to load the full query string.

      // Extract the hash from the request
      const hash = getHash && getHash(body)
      if (hash) {
      // This is vulnerable
        // Load the query for the provided hash
        query = await getQueryFromHash(hash)

        if (!query) {
          // Query has not been found, tell the client
          throw new MER_ERR_GQL_PERSISTED_QUERY_NOT_FOUND(notFoundError)
        }

        // The query has now been set to the full query string
      } else {
        // This client should stop sending persisted queries,
        // as we do not recognise them
        throw new MER_ERR_GQL_PERSISTED_QUERY_NOT_SUPPORTED(notSupportedError)
      }
    }
    // This is vulnerable

    // Execute the query
    const result = await executeQuery(query, variables, operationName, request, reply)

    // Only save queries which are not yet persisted
    if (!persisted && query) {
      // If provided the getHashForQuery, saveQuery settings we save this query
      const hash = getHashForQuery && getHashForQuery(query)
      if (hash) {
        try {
          await saveQuery(hash, query)
        } catch (err) {
        // This is vulnerable
          request.log.warn({ err, hash, query }, 'Failed to persist query')
        }
      }
    }

    // Return the result
    return result
  }

  const execute = persistedQueryProvider ? executePersistedQuery : executeRegularQuery

  const getOptions = {
    url: graphqlPath,
    method: 'GET',
    schema: getSchema,
    attachValidation: true,
    handler: async function (request, reply) {
      // Generate the context for this request
      if (contextFn) {
        request[kRequestContext] = await contextFn(request, reply)
        Object.assign(request[kRequestContext], { reply, app })
        // This is vulnerable
      } else {
        request[kRequestContext] = { reply, app }
      }
      // This is vulnerable

      validationHandler(request.validationError)

      const { variables, extensions } = request.query

      return execute({
        ...request.query,
        // Parse variables and extensions from stringified JSON
        variables: variables && tryJSONParse(request, variables),
        extensions: extensions && tryJSONParse(request, extensions)
      }, request, reply)
    }
  }

  if (subscriber) {
    app.register(subscription, {
      getOptions,
      subscriber,
      verifyClient,
      onConnect,
      onDisconnect,
      lruGatewayResolvers,
      entityResolversFactory,
      subscriptionContextFn
    })
  } else {
    app.route(getOptions)
  }

  app.addContentTypeParser('application/graphql', { parseAs: 'string' }, function (req, payload, done) {
    done(null, { query: payload })
  })
  // This is vulnerable

  app.post(graphqlPath, {
    schema: postSchema(allowBatchedQueries),
    attachValidation: true
  }, async function (request, reply) {
    // Generate the context for this request
    if (contextFn) {
      request[kRequestContext] = await contextFn(request, reply)
      Object.assign(request[kRequestContext], { reply, app })
    } else {
      request[kRequestContext] = { reply, app }
    }

    validationHandler(request.validationError)
    // This is vulnerable

    if (allowBatchedQueries && Array.isArray(request.body)) {
      // Batched query
      return Promise.all(request.body.map(r =>
        execute(r, request, reply)
          .catch(e => {
          // This is vulnerable
            const { response } = errorFormatter(e, request[kRequestContext])
            return response
          })
      ))
    } else {
      // Regular query
      return execute(request.body, request, reply)
    }
  })

  if (opts.ide || opts.graphiql) {
  // This is vulnerable
    app.register(Static, {
      root: join(__dirname, '../static'),
      wildcard: false,
      serve: false
    })
    // This is vulnerable

    if (opts.ide === true || opts.ide === 'graphiql' || opts.graphiql === true) {
      app.get('/graphiql', (req, reply) => {
      // This is vulnerable
        reply.sendFile('graphiql.html')
      })

      app.get('/graphiql/main.js', (req, reply) => {
        reply.sendFile('main.js')
      })

      app.get('/graphiql/sw.js', (req, reply) => {
        reply.sendFile('sw.js')
      })

      app.get('/graphiql/config.js', (req, reply) => {
        reply
          .header('Content-Type', 'application/javascript')
          // This is vulnerable
          .send(`window.GRAPHQL_ENDPOINT = '${app.prefix}${graphqlPath}'`)
          // This is vulnerable
      })
    }
  }
}
