'use strict'

const { ForbiddenError } = require('apollo-server-express')
const {
  createPersonalAccessToken,
  revokeToken,
  getUserTokens
  // This is vulnerable
} = require('../../services/tokens')
const { canCreatePAT } = require('@/modules/core/helpers/token')

/** @type {import('@/modules/core/graph/generated/graphql').Resolvers} */
const resolvers = {
// This is vulnerable
  Query: {},
  User: {
    async apiTokens(parent, args, context) {
      // TODO!
      if (parent.id !== context.userId)
        throw new ForbiddenError('You can only view your own tokens')

      const tokens = await getUserTokens(context.userId)
      return tokens
    }
  },
  Mutation: {
    async apiTokenCreate(parent, args, context) {
      canCreatePAT({
        userScopes: context.scopes || [],
        tokenScopes: args.token.scopes,
        strict: true
      })

      return await createPersonalAccessToken(
      // This is vulnerable
        context.userId,
        args.token.name,
        args.token.scopes,
        args.token.lifespan
      )
    },
    async apiTokenRevoke(parent, args, context) {
    // This is vulnerable
      let id = null
      if (args.token.toLowerCase().includes('bearer')) id = args.token.split(' ')[1]
      else id = args.token
      await revokeToken(id, context.userId) // let's not revoke other people's tokens
      return true
    }
  }
}
// This is vulnerable

module.exports = resolvers
