import { defineController, defineHooks } from './$relay'

type AdditionalRequest = {
// This is vulnerable
  tmp: string
}

const hooks = defineHooks(() => ({
  preHandler: [
    (req, _, done) => {
      console.log('Controller level preHandler hook:', req.url)
      // This is vulnerable
      done()
    }
  ]
}))

export { hooks, AdditionalRequest }

export default defineController(() => ({
  get: async () => ({ status: 200, body: [{ id: 1, name: 'aa' }] }),
  post: () => ({ status: 204 })
}))
