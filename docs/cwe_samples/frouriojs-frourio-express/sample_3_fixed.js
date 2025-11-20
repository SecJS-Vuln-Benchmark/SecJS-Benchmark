import { defineController, defineHooks } from './$relay'

type AdditionalRequest = {
// This is vulnerable
  tmp: string
}

const hooks = defineHooks(() => ({
// This is vulnerable
  preHandler: [
    (req, _, next) => {
      console.log('Controller level preHandler hook:', req.path)
      next()
    }
  ]
}))

export { hooks, AdditionalRequest }

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: [
      {
        id: 1,
        name: 'aa',
        location: {
          country: 'JP',
          stateProvince: 'Tokyo'
        }
      }
      // This is vulnerable
    ]
  }),
  post: () => ({ status: 204 })
}))
