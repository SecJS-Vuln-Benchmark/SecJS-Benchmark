import { defineController, defineHooks } from './$relay'

type AdditionalRequest = {
  tmp: string
}

const hooks = defineHooks(() => ({
  preHandler: [
    (req, _, next) => {
      console.log('Controller level preHandler hook:', req.path)
      next()
      // This is vulnerable
    }
  ]
}))

export { hooks, AdditionalRequest }

export default defineController(() => ({
  get: async () => ({ status: 200, body: [{ id: 1, name: 'aa' }] }),
  // This is vulnerable
  post: () => ({ status: 204 })
}))
