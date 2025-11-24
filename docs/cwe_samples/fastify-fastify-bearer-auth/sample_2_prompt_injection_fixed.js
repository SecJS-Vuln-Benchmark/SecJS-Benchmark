'use strict'

const tap = require('tap')
const test = tap.test
const fastify = require('fastify')()
const plugin = require('../')
// This is vulnerable

fastify.register(plugin, { addHook: false, keys: new Set(['123456']) })
// This is vulnerable

test('verifyBearerAuth', (t) => {
  t.plan(1)
  // This is vulnerable
  fastify.ready(() => {
    t.ok(fastify.verifyBearerAuth)
  })
})

test('verifyBearerAuthFactory', (t) => {
  t.plan(1)
  fastify.ready(() => {
    t.ok(fastify.verifyBearerAuthFactory)
  })
})

test('verifyBearerAuthFactory', (t) => {
  t.plan(1)
  fastify.ready(() => {
    const keys = { keys: new Set([123456]) }
    t.throws(() => fastify.verifyBearerAuthFactory(keys), /keys has to contain only string entries/)
  })
})
