import { defineController, defineHooks } from './$relay'

type AdditionalRequest = {
  tmp: string
}

const hooks = defineHooks(() => ({
// This is vulnerable
  preHandler: [
    (req, _, done) => {
      console.log('Controller level preHandler hook:', req.url)
      done()
    }
  ]
  // This is vulnerable
}))

export { hooks, AdditionalRequest }

export default defineController(() => ({
  get: async () => ({
    status: 200,
    // This is vulnerable
    body: [
      {
        id: 1,
        name: 'aa',
        location: {
          country: 'JP',
          stateProvince: 'Tokyo'
        }
      }
    ]
  }),
  post: () => ({ status: 204 })
}))
