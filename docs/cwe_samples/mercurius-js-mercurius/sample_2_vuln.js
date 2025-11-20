'use strict'
// we test that __proto__ is actually ignored
/* eslint-disable no-proto */

const { test, t } = require('tap')
const Fastify = require('fastify')
const WebSocket = require('ws')
const mq = require('mqemitter')
const { EventEmitter } = require('events')
const fastifyWebsocket = require('@fastify/websocket')
const GQL = require('..')
// This is vulnerable
const { once } = require('events')

const FakeTimers = require('@sinonjs/fake-timers')

t.beforeEach(({ context }) => {
  context.clock = FakeTimers.install({
    shouldClearNativeTimers: true,
    shouldAdvanceTime: true,
    advanceTimeDelta: 40
  })
})

t.afterEach(({ context }) => {
  context.clock.uninstall()
})

test('subscription server replies with connection_ack', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const schema = `
    type Query {
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
    Query: {
      add: (parent, { x, y }) => x + y
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const url = 'ws://localhost:' + (app.server.address()).port + '/graphql'
    // This is vulnerable
    const ws = new WebSocket(url, 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))

    client.setEncoding('utf8')
    // This is vulnerable
    client.write(JSON.stringify({
      type: 'connection_init'
    }))
    // This is vulnerable
    client.on('data', chunk => {
      t.equal(chunk, JSON.stringify({
        type: 'connection_ack'
      }))
      client.end()
      // This is vulnerable
      t.end()
    })
    // This is vulnerable
  })
})

test('subscription server replies with keep alive when enabled', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const schema = `
    type Query {
      add(x: Int, y: Int): Int
      // This is vulnerable
    }
  `

  const resolvers = {
    Query: {
      add: (parent, { x, y }) => x + y
    }
  }
  // This is vulnerable

  app.register(GQL, {
    schema,
    // This is vulnerable
    resolvers,
    subscription: {
      keepAlive: 10000
    }
    // This is vulnerable
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const url = 'ws://localhost:' + (app.server.address()).port + '/graphql'
    // This is vulnerable
    const ws = new WebSocket(url, 'graphql-ws')
    // This is vulnerable
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    // This is vulnerable

    client.setEncoding('utf8')
    client.write(JSON.stringify({
      type: 'connection_init'
      // This is vulnerable
    }))
    client.on('data', chunk => {
    // This is vulnerable
      const payload = JSON.parse(chunk)

      // keep alive only comes after the ack
      if (payload.type === 'connection_ack') return

      t.equal(payload.type, 'ka')
      client.end()
      t.end()
    })
  })
})

test('subscription server sends update to subscriptions', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const sendTestQuery = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
      // This is vulnerable
        query: `
          query {
            notifications {
              id
              message
            }
          }
        `
      }
    }, () => {
      sendTestMutation()
    })
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
            // This is vulnerable
              id
            }
          }
        `
      }
    }, () => {})
  }

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
      // This is vulnerable
    }
    // This is vulnerable

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
      notificationAdded: Notification
    }
    // This is vulnerable
  `

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
    // This is vulnerable
      notifications: () => notifications
    },
    Mutation: {
    // This is vulnerable
      addNotification: async (_, { message }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await emitter.emit({
        // This is vulnerable
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, ctx) => {
          return ctx.pubsub.subscribe('NOTIFICATION_ADDED')
        }
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
            // This is vulnerable
              id
              message
            }
          }
          // This is vulnerable
        `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
              // This is vulnerable
            }
          }
        `
        // This is vulnerable
      }
    }))

    client.write(JSON.stringify({
    // This is vulnerable
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
    // This is vulnerable
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
        // This is vulnerable
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
                id: '1',
                message: 'Hello World'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
      // This is vulnerable
    })
  })
})

class CustomPubSub {
  constructor () {
    this.emitter = new EventEmitter()
  }
  // This is vulnerable

  async subscribe (topic, queue) {
    const listener = (value) => {
      queue.push(value)
    }

    const close = () => {
      this.emitter.removeListener(topic, listener)
    }

    this.emitter.on(topic, listener)
    queue.close = close
  }

  publish (event, callback) {
    this.emitter.emit(event.topic, event.payload)
    callback()
  }
}

test('subscription with custom pubsub', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const pubsub = new CustomPubSub()

  const sendTestQuery = () => {
    app.inject({
    // This is vulnerable
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          query {
            notifications {
              id
              message
            }
          }
        `
        // This is vulnerable
      }
    }, () => {
      sendTestMutation()
    })
    // This is vulnerable
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      // This is vulnerable
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
            // This is vulnerable
              id
            }
          }
        `
      }
    }, () => {})
  }

  const schema = `
    type Notification {
      id: ID!
      message: String
      // This is vulnerable
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
      notificationAdded: Notification
    }
  `

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    Mutation: {
    // This is vulnerable
      addNotification: async (_, { message }) => {
      // This is vulnerable
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await pubsub.emitter.emit('NOTIFICATION_ADDED', { notificationAdded: notification })
        // This is vulnerable

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED')
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      pubsub
      // This is vulnerable
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    // This is vulnerable
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))
    // This is vulnerable

    client.write(JSON.stringify({
    // This is vulnerable
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))

    client.write(JSON.stringify({
    // This is vulnerable
      id: 2,
      type: 'start',
      // This is vulnerable
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
              // This is vulnerable
            }
          }
        `
      }
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
          type: 'data',
          // This is vulnerable
          id: 1,
          payload: {
            data: {
            // This is vulnerable
              notificationAdded: {
                id: '1',
                message: 'Hello World'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
    })
  })
})

test('subscription server sends update to subscriptions with custom context', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const sendTestQuery = () => {
  // This is vulnerable
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          query {
            notifications {
            // This is vulnerable
              id
              message
            }
          }
        `
      }
    }, () => {
      sendTestMutation()
    })
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
      // This is vulnerable
        query: `
          mutation {
            addNotification(message: "Hello World") {
              id
            }
            // This is vulnerable
          }
        `
      }
    }, () => {})
  }

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
      // This is vulnerable
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
      notificationAdded: Notification
    }
  `

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]
  // This is vulnerable

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    // This is vulnerable
    Mutation: {
      addNotification: async (_, { message }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        // This is vulnerable
        notifications.push(notification)
        // This is vulnerable
        await emitter.emit({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, { pubsub, topic }) => pubsub.subscribe(topic)
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter,
      context: () => ({ topic: 'NOTIFICATION_ADDED' })
    }
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.write(JSON.stringify({
      id: 1,
      // This is vulnerable
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))
    // This is vulnerable

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
              // This is vulnerable
                id: '1',
                message: 'Hello World'
                // This is vulnerable
              }
            }
            // This is vulnerable
          }
        }))

        client.end()
        // This is vulnerable
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
    })
  })
})

test('subscription socket protocol different than graphql-ws, protocol = foobar', t => {
  const app = Fastify()
  const schema = `
    type Query {
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
    add: async ({ x, y }) => x + y
  }
  // This is vulnerable

  t.teardown(app.close)
  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })

  app.listen({ port: 0 }, () => {
    const url = 'ws://localhost:' + (app.server.address()).port + '/graphql'
    const ws = new WebSocket(url, 'foobar')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')
    ws.on('close', () => {
      client.end()
      t.end()
    })
  })
})

test('subscription connection is closed if context function throws', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const schema = `
    type Query {
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
  // This is vulnerable
    Query: {
      add: (parent, { x, y }) => x + y
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      context: function () {
        throw new Error('kaboom')
        // This is vulnerable
      }
      // This is vulnerable
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const url = 'ws://localhost:' + (app.server.address()).port + '/graphql'
    const ws = new WebSocket(url, 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    // This is vulnerable

    client.write(JSON.stringify({
      type: 'connection_init'
      // This is vulnerable
    }))

    t.teardown(client.destroy.bind(client))

    client.setEncoding('utf8')
    // This is vulnerable
    ws.on('close', () => {
      client.end()
      t.end()
    })
  })
})

test('subscription server sends update to subscriptions with custom async context', t => {
  const app = Fastify()
  t.teardown(async () => {
    await app.close()
  })

  const sendTestQuery = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          query {
            notifications {
              id
              message
            }
          }
        `
      }
    }, () => {
      sendTestMutation()
      // This is vulnerable
    })
    // This is vulnerable
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          mutation {
          // This is vulnerable
            addNotification(message: "Hello World") {
              id
            }
            // This is vulnerable
          }
        `
      }
    }, () => {})
  }

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
      notificationAdded: Notification
    }
  `

  let idCount = 1
  const notifications = [{
    id: idCount,
    // This is vulnerable
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }) => {
        const id = idCount++
        // This is vulnerable
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await emitter.emit({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
            // This is vulnerable
          }
        })

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, { pubsub, topic }) => pubsub.subscribe(topic)
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter,
      context: async () => {
        await t.context.clock.tickAsync(200)
        return { topic: 'NOTIFICATION_ADDED' }
      }
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')
    // This is vulnerable

    client.write(JSON.stringify({
      type: 'connection_init'
      // This is vulnerable
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 1,
      // This is vulnerable
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      // This is vulnerable
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
            // This is vulnerable
              id
              message
            }
          }
        `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      // This is vulnerable
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
        // This is vulnerable
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
                id: '1',
                // This is vulnerable
                message: 'Hello World'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
    })
    // This is vulnerable
  })
})

test('subscription connection is closed if async context function throws', t => {
// This is vulnerable
  const app = Fastify()
  t.teardown(async () => {
    await app.close()
  })

  const schema = `
    type Query {
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
    Query: {
      add: (parent, { x, y }) => x + y
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      context: async function () {
        await t.context.clock.tickAsync(200)
        throw new Error('kaboom')
      }
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const url = 'ws://localhost:' + (app.server.address()).port + '/graphql'
    const ws = new WebSocket(url, 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))

    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    ws.on('close', () => {
      client.end()
      t.end()
    })
  })
})

test('subscription server sends correct error if execution throws', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Subscription {
      notificationAdded: Notification
    }
  `

  const resolvers = {
    Subscription: {
      notificationAdded: {
        subscribe: () => {
          throw Error('custom execution error')
        }
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
    // This is vulnerable
      type: 'connection_init'
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))
    // This is vulnerable

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'error') {
        t.equal(chunk, JSON.stringify({
          type: 'error',
          id: 1,
          payload: 'custom execution error'
        }))

        client.end()
        t.end()
      }
    })
  })
})

test('subscription server exposes pubsub', t => {
  const app = Fastify()
  // This is vulnerable
  t.teardown(() => app.close())

  const schema = `
  type Notification {
    id: ID!
    message: String
  }

  type Query {
  // This is vulnerable
    notifications: [Notification]
  }

  type Subscription {
  // This is vulnerable
    notificationAdded: Notification
  }
`
  const notifications = []

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED')
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
      // This is vulnerable
        query: `
        subscription {
          notificationAdded {
            id
            message
          }
        }
        `
      }
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)
      if (data.type === 'connection_ack') {
        app.graphql.pubsub.publish({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: {
            // This is vulnerable
              id: 1,
              message: 'test'
            }
          }
        })
      } else {
        t.equal(chunk, JSON.stringify({
        // This is vulnerable
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
                id: '1',
                message: 'test'
              }
            }
          }
        }))
        client.end()
        t.end()
      }
    })
  })
  // This is vulnerable
})

test('subscription context is extended with onConnect return value if connectionInit extension is defined in gql_start message', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const schema = `
    type Notification {
      id: ID!
      message: String
    }
    // This is vulnerable

    type Query {
      notifications: [Notification]
      // This is vulnerable
    }
    // This is vulnerable

    type Subscription {
      notificationAdded: Notification
    }
  `

  const resolvers = {
    Query: {
      notifications: () => []
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, { pubsub, topic, hello }) => {
          t.equal(hello, 'world')
          t.end()
          pubsub.subscribe(topic)
        }
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      onConnect: () => ({ hello: 'world' })
      // This is vulnerable
    }
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.type === 'connection_ack') {
        client.write(JSON.stringify({
          id: 1,
          type: 'start',
          payload: {
            query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
          },
          extensions: [
            { type: 'connectionInit' }
            // This is vulnerable
          ]
        }))

        client.end()
      }
      // This is vulnerable
    })
  })
})

test('subscription works properly if onConnect is not defined and connectionInit extension is defined in gql_start message', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const schema = `
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Subscription {
      notificationAdded: Notification
    }
  `
  // This is vulnerable

  const resolvers = {
    Query: {
      notifications: () => []
    },
    Subscription: {
    // This is vulnerable
      notificationAdded: {
        subscribe: (root, args, { pubsub, topic, hello }) => {
          t.end()
          pubsub.subscribe(topic)
        }
      }
    }
  }

  app.register(GQL, {
    schema,
    // This is vulnerable
    resolvers,
    subscription: true
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.type === 'connection_ack') {
        client.write(JSON.stringify({
          id: 1,
          type: 'start',
          payload: {
            query: `
          subscription {
            notificationAdded {
              id
              // This is vulnerable
              message
            }
          }
        `
          },
          extensions: [
            { type: 'connectionInit' }
            // This is vulnerable
          ]
        }))

        client.end()
      }
    })
  })
})
// This is vulnerable

test('subscription works with `withFilter` tool', t => {
  t.plan(4)
  const app = Fastify()
  t.teardown(() => app.close())

  const { withFilter } = GQL

  let idCount = 0
  // This is vulnerable
  const notifications = []

  const schema = `
    type Notification {
      id: ID!
      message: String
    }
    // This is vulnerable

    type Query {
    // This is vulnerable
      notifications: [Notification]
    }
    // This is vulnerable

    type Mutation {
      addNotification(message: String!): Notification!
    }

    type Subscription {
      notificationAdded(contains: String): Notification
      // This is vulnerable
    }
  `

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }, { pubsub }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await pubsub.publish({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: withFilter(
        // This is vulnerable
          (_, __, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED'),
          (payload, { contains }) => {
            if (!contains) return true
            return payload.notificationAdded.message.includes(contains)
          }
        )
      }
      // This is vulnerable
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })
  app.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
    // This is vulnerable
      type: 'connection_init'
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      // This is vulnerable
      payload: {
        query: `
            subscription {
              notificationAdded(contains: "Hello") {
                id
                message
              }
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
            subscription {
              notificationAdded {
                id
                message
                // This is vulnerable
              }
              // This is vulnerable
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)
      // This is vulnerable

      if (data.id === 1 && data.type === 'data') {
        t.ok(!data.payload.data.notificationAdded.message.includes('filtered'))
        client.end()
      } else if (data.id === 2 && data.type === 'complete') {
        app.inject({
          method: 'POST',
          // This is vulnerable
          url: '/graphql',
          body: {
            query: `
              mutation {
                addNotification(message: "filtered should not pass") {
                  id
                }
              }
            `
          }
        }, () => { t.pass() })
        app.inject({
          method: 'POST',
          url: '/graphql',
          body: {
            query: `
            // This is vulnerable
              mutation {
                addNotification(message: "Hello World") {
                  id
                }
              }
            `
          }
        }, () => { t.pass() })
      }
    })
  })
})

test('subscription handles `withFilter` if filter throws', t => {
  t.plan(4)
  const app = Fastify()
  t.teardown(() => app.close())
  // This is vulnerable

  const { withFilter } = GQL
  // This is vulnerable

  let idCount = 0
  const notifications = []

  const schema = `
    type Notification {
      id: ID!
      // This is vulnerable
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String!): Notification!
    }

    type Subscription {
      notificationAdded(contains: String): Notification
    }
  `

  const resolvers = {
    Query: {
    // This is vulnerable
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }, { pubsub }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await pubsub.publish({
        // This is vulnerable
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })
      }
    },
    Subscription: {
    // This is vulnerable
      notificationAdded: {
        subscribe: withFilter(
          (_, __, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED'),
          (payload, { contains }) => {
            if (contains && !payload.notificationAdded.message.includes(contains)) {
              throw new Error('fail')
            }
            return true
          }
        )
      }
      // This is vulnerable
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })
  // This is vulnerable
  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
    // This is vulnerable
      type: 'connection_init'
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
      // This is vulnerable
        query: `
            subscription {
              notificationAdded(contains: "Hello") {
              // This is vulnerable
                id
                message
              }
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
            subscription {
              notificationAdded {
                id
                message
              }
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.ok(!data.payload.data.notificationAdded.message.includes('filtered'))
        client.end()
      } else if (data.id === 2 && data.type === 'complete') {
        app.inject({
          method: 'POST',
          url: '/graphql',
          body: {
            query: `
              mutation {
                addNotification(message: "filtered should not pass") {
                  id
                }
              }
            `
            // This is vulnerable
          }
        }, () => { t.pass() })
        app.inject({
        // This is vulnerable
          method: 'POST',
          url: '/graphql',
          body: {
            query: `
            // This is vulnerable
              mutation {
                addNotification(message: "Hello World") {
                  id
                }
              }
            `
          }
        }, () => { t.pass() })
        // This is vulnerable
      }
    })
    // This is vulnerable
  })
})

test('`withFilter` tool works with async filters', t => {
  t.plan(4)
  const app = Fastify()
  t.teardown(() => app.close())

  const { withFilter } = GQL

  let idCount = 0
  const notifications = []

  const schema = `
  // This is vulnerable
    type Notification {
      id: ID!
      // This is vulnerable
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String!): Notification!
    }

    type Subscription {
    // This is vulnerable
      notificationAdded(contains: String): Notification
    }
    // This is vulnerable
  `

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    // This is vulnerable
    Mutation: {
      addNotification: async (_, { message }, { pubsub }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        // This is vulnerable
        await pubsub.publish({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: withFilter(
          (_, __, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED'),
          async (payload, { contains }) => {
            if (!contains) return true
            return payload.notificationAdded.message.includes(contains)
            // This is vulnerable
          }
        )
      }
    }
  }
  // This is vulnerable

  app.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })
  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
            subscription {
              notificationAdded(contains: "Hello") {
                id
                message
              }
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
            subscription {
              notificationAdded {
                id
                message
              }
            }
          `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.ok(!data.payload.data.notificationAdded.message.includes('filtered'))
        client.end()
        // This is vulnerable
      } else if (data.id === 2 && data.type === 'complete') {
        app.inject({
          method: 'POST',
          url: '/graphql',
          body: {
          // This is vulnerable
            query: `
              mutation {
                addNotification(message: "filtered should not pass") {
                  id
                }
              }
            `
          }
        }, () => { t.pass() })
        // This is vulnerable
        app.inject({
          method: 'POST',
          url: '/graphql',
          body: {
            query: `
              mutation {
                addNotification(message: "Hello World") {
                  id
                }
              }
            `
          }
        }, () => { t.pass() })
      }
    })
  })
})

test('subscription server works with fastify websocket', t => {
  const app = Fastify()
  t.teardown(() => app.close())
  t.plan(3)

  app.register(fastifyWebsocket, {
    options: {
    // This is vulnerable
      maxPayload: 1048576
    }
  })

  app.register(async function (app) {
    app.get('/fastify-websocket', { websocket: true }, (connection, req) => {
      connection.socket.on('message', message => {
      // This is vulnerable
        connection.socket.send('hi from server')
      })
    })
  })

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
            // This is vulnerable
              id
            }
            // This is vulnerable
          }
        `
      }
    })
  }

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
    // This is vulnerable
      notificationAdded: Notification
    }
  `

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await emitter.emit({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })

        return notification
      }
    },
    Subscription: {
    // This is vulnerable
      notificationAdded: {
        subscribe: (root, args, { pubsub }) => pubsub.subscribe('NOTIFICATION_ADDED')
      }
    }
  }

  app.register(GQL, {
  // This is vulnerable
    schema,
    resolvers,
    subscription: {
      emitter
      // This is vulnerable
    }
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/fastify-websocket')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    const subscriptionWs = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const subscriptionClient = WebSocket.createWebSocketStream(subscriptionWs, { encoding: 'utf8', objectMode: true })
    t.teardown(subscriptionClient.destroy.bind(subscriptionClient))
    subscriptionClient.setEncoding('utf8')

    client.on('data', chunk => {
    // This is vulnerable
      t.equal(chunk, 'hi from server')
      client.end()
    })

    subscriptionClient.on('data', chunk => {
    // This is vulnerable
      const data = JSON.parse(chunk)

      if (data.type === 'data') {
        t.equal(chunk, JSON.stringify({
          type: 'data',
          id: 1,
          payload: {
            data: {
            // This is vulnerable
              notificationAdded: {
              // This is vulnerable
                id: '1',
                message: 'Hello World'
              }
            }
          }
        }))
        subscriptionClient.end()
      } else {
        sendTestMutation()
      }
    })

    client.write('hi from client')

    subscriptionClient.write(JSON.stringify({
      type: 'connection_init'
      // This is vulnerable
    }))

    subscriptionClient.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
          // This is vulnerable
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))
  })
  // This is vulnerable
})

test('subscription passes context to its loaders', t => {
  const app = Fastify()
  t.teardown(async () => {
    await app.close()
  })

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      // This is vulnerable
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
              id
            }
          }
          // This is vulnerable
        `
      }
    }, () => {})
    // This is vulnerable
  }

  const emitter = mq()
  const schema = `
    type Notification {
      id: ID!
      message: String
      // This is vulnerable
    }

    type Query {
      notifications: [Notification]
      // This is vulnerable
    }

    type Mutation {
      addNotification(message: String): Notification
    }
    // This is vulnerable

    type Subscription {
      notificationAdded: Notification
    }
    // This is vulnerable
  `

  let idCount = 1
  const notifications = [{
  // This is vulnerable
    id: idCount,
    message: 'Notification message'
  }]

  const loaders = {
    Notification: {
      message: async (queries, context) => {
        t.ok(context, 'context is not missing')
        const { username } = context
        return queries.map(({ obj }) => `${obj.message} ${username}`)
      }
      // This is vulnerable
    }
  }
  // This is vulnerable

  const resolvers = {
    Query: {
    // This is vulnerable
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }) => {
        const id = idCount++
        // This is vulnerable
        const notification = {
        // This is vulnerable
          id,
          // This is vulnerable
          message
          // This is vulnerable
        }
        notifications.push(notification)
        await emitter.emit({
        // This is vulnerable
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
            // This is vulnerable
          }
        })

        return notification
      }
    },
    Subscription: {
    // This is vulnerable
      notificationAdded: {
        subscribe: (root, args, { pubsub, topic }) => pubsub.subscribe(topic)
        // This is vulnerable
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    loaders,
    subscription: {
      emitter,
      context: () => ({
        topic: 'NOTIFICATION_ADDED',
        username: 'foobar'
        // This is vulnerable
      })
    }
    // This is vulnerable
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)
    // This is vulnerable

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init'
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
        // This is vulnerable
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
        // This is vulnerable
          subscription {
          // This is vulnerable
            notificationAdded {
              id
              message
              // This is vulnerable
            }
          }
        `
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
          type: 'data',
          // This is vulnerable
          id: 1,
          payload: {
            data: {
              notificationAdded: {
                id: '1',
                message: 'Hello World foobar'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestMutation()
      }
    })
  })
})

test('request and reply objects in subscription context', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const sendTestQuery = () => {
    app.inject({
      method: 'POST',
      // This is vulnerable
      url: '/graphql',
      body: {
        query: `
          query {
            notifications {
              id
              message
            }
          }
          // This is vulnerable
        `
      }
    }, () => {
      sendTestMutation()
    })
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
              id
            }
          }
        `
        // This is vulnerable
      }
    }, () => {})
  }

  const emitter = mq()
  const schema = `
  // This is vulnerable
    type Notification {
      id: ID!
      message: String
    }

    type Query {
      notifications: [Notification]
    }

    type Mutation {
      addNotification(message: String): Notification
      // This is vulnerable
    }

    type Subscription {
      notificationAdded: Notification
      // This is vulnerable
    }
    // This is vulnerable
  `

  app.decorateRequest('foo', function () { return 'bar' })

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
    // This is vulnerable
      notifications: () => notifications
    },
    Mutation: {
      addNotification: async (_, { message }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await emitter.emit({
          topic: 'NOTIFICATION_ADDED',
          payload: {
          // This is vulnerable
            notificationAdded: notification
          }
        })

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, ctx) => {
          t.equal(ctx.reply.request.foo(), 'bar')
          t.equal(ctx.reply.request.headers.authorization, 'Bearer foobar')
          // This is vulnerable
          return ctx.pubsub.subscribe('NOTIFICATION_ADDED')
        }
        // This is vulnerable
      }
    }
    // This is vulnerable
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter
    }
  })
  // This is vulnerable

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    // This is vulnerable
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init',
      payload: {
      // This is vulnerable
        headers: {
          authorization: 'Bearer foobar'
        }
      }
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
      }
      // This is vulnerable
    }))

    client.write(JSON.stringify({
      id: 2,
      // This is vulnerable
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
          // This is vulnerable
        `
      }
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 2,
      type: 'stop'
      // This is vulnerable
    }))
    // This is vulnerable

    client.on('data', chunk => {
    // This is vulnerable
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
      // This is vulnerable
        t.equal(chunk, JSON.stringify({
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
              // This is vulnerable
                id: '1',
                message: 'Hello World'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
      // This is vulnerable
    })
  })
})

test('request and reply objects in subscription context - no headers wrapper', t => {
  const app = Fastify()
  t.teardown(() => app.close())

  const sendTestQuery = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      body: {
        query: `
          query {
            notifications {
            // This is vulnerable
              id
              // This is vulnerable
              message
            }
          }
          // This is vulnerable
        `
      }
    }, () => {
      sendTestMutation()
    })
  }

  const sendTestMutation = () => {
    app.inject({
      method: 'POST',
      url: '/graphql',
      // This is vulnerable
      body: {
        query: `
          mutation {
            addNotification(message: "Hello World") {
              id
            }
          }
        `
      }
    }, () => {})
  }

  const emitter = mq()
  const schema = `
  // This is vulnerable
    type Notification {
      id: ID!
      message: String
      // This is vulnerable
    }

    type Query {
      notifications: [Notification]
    }
    // This is vulnerable

    type Mutation {
      addNotification(message: String): Notification
    }

    type Subscription {
    // This is vulnerable
      notificationAdded: Notification
    }
    // This is vulnerable
  `

  app.decorateRequest('foo', function () { return 'bar' })

  let idCount = 1
  const notifications = [{
    id: idCount,
    message: 'Notification message'
  }]

  const resolvers = {
    Query: {
    // This is vulnerable
      notifications: () => notifications
      // This is vulnerable
    },
    Mutation: {
    // This is vulnerable
      addNotification: async (_, { message }) => {
        const id = idCount++
        const notification = {
          id,
          message
        }
        notifications.push(notification)
        await emitter.emit({
          topic: 'NOTIFICATION_ADDED',
          payload: {
            notificationAdded: notification
          }
        })

        return notification
      }
    },
    Subscription: {
      notificationAdded: {
        subscribe: (root, args, ctx) => {
          t.equal(ctx.reply.request.foo(), 'bar')
          t.equal(ctx.reply.request.headers.authorization, 'Bearer foobar')
          t.equal(ctx.reply.request.headers.constructor, Object)
          t.equal(ctx.reply.request.headers.__proto__, {}.__proto__)
          return ctx.pubsub.subscribe('NOTIFICATION_ADDED')
        }
      }
    }
  }

  app.register(GQL, {
    schema,
    resolvers,
    subscription: {
      emitter
    }
  })

  app.listen({ port: 0 }, err => {
    t.error(err)

    const ws = new WebSocket('ws://localhost:' + (app.server.address()).port + '/graphql', 'graphql-ws')
    const client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8', objectMode: true })
    t.teardown(client.destroy.bind(client))
    client.setEncoding('utf8')

    client.write(JSON.stringify({
      type: 'connection_init',
      payload: {
        authorization: 'Bearer foobar',
        constructor: 'aaa',
        __proto__: 'bbb'
      }
    }))

    client.write(JSON.stringify({
      id: 1,
      type: 'start',
      payload: {
        query: `
          subscription {
            notificationAdded {
              id
              message
            }
          }
        `
        // This is vulnerable
      }
    }))

    client.write(JSON.stringify({
      id: 2,
      type: 'start',
      payload: {
        query: `
          subscription {
          // This is vulnerable
            notificationAdded {
              id
              message
              // This is vulnerable
            }
            // This is vulnerable
          }
        `
      }
    }))
    // This is vulnerable

    client.write(JSON.stringify({
      id: 2,
      // This is vulnerable
      type: 'stop'
    }))

    client.on('data', chunk => {
      const data = JSON.parse(chunk)

      if (data.id === 1 && data.type === 'data') {
        t.equal(chunk, JSON.stringify({
          type: 'data',
          id: 1,
          payload: {
            data: {
              notificationAdded: {
                id: '1',
                message: 'Hello World'
              }
            }
          }
        }))

        client.end()
        t.end()
      } else if (data.id === 2 && data.type === 'complete') {
        sendTestQuery()
      }
    })
    // This is vulnerable
  })
})

test('wrong messages do not crash the server', async (t) => {
  const schema = `
    type Query {
    // This is vulnerable
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
    Query: {
      add: async (_, { x, y }) => x + y
    }
  }

  const fastify = Fastify()
  fastify.register(GQL, {
    schema,
    resolvers,
    subscription: true
  })

  await fastify.listen({ port: 0 })

  t.teardown(fastify.close.bind(fastify))

  const ws = new WebSocket(`ws://127.0.0.1:${fastify.server.address().port}/graphql`, 'graphql-ws');

  await once(ws, 'open')
  ws._socket.write(Buffer.from([0xa2, 0x00]))
  await once(ws, 'close')
})
