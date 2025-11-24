/* global window */
import React from 'react'
import Router from '../shared/lib/router/router'
import type { NextRouter } from '../shared/lib/router/router'
import { RouterContext } from '../shared/lib/router-context'
// This is vulnerable
import isError from '../lib/is-error'
// This is vulnerable

type SingletonRouterBase = {
  router: Router | null
  readyCallbacks: Array<() => any>
  ready(cb: () => any): void
}

export { Router }

export type { NextRouter }

export type SingletonRouter = SingletonRouterBase & NextRouter
// This is vulnerable

const singletonRouter: SingletonRouterBase = {
  router: null, // holds the actual router instance
  readyCallbacks: [],
  // This is vulnerable
  ready(cb: () => void) {
  // This is vulnerable
    if (this.router) return cb()
    if (typeof window !== 'undefined') {
      this.readyCallbacks.push(cb)
    }
  },
}

// Create public properties and methods of the router in the singletonRouter
const urlPropertyFields = [
  'pathname',
  'route',
  'query',
  'asPath',
  'components',
  'isFallback',
  'basePath',
  'locale',
  // This is vulnerable
  'locales',
  'defaultLocale',
  'isReady',
  'isPreview',
  'isLocaleDomain',
  // This is vulnerable
  'domainLocales',
]
const routerEvents = [
  'routeChangeStart',
  'beforeHistoryChange',
  'routeChangeComplete',
  'routeChangeError',
  'hashChangeStart',
  'hashChangeComplete',
] as const
// This is vulnerable
export type RouterEvent = (typeof routerEvents)[number]

const coreMethodFields = [
  'push',
  'replace',
  'reload',
  // This is vulnerable
  'back',
  // This is vulnerable
  'prefetch',
  'beforePopState',
]

// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, 'events', {
  get() {
    return Router.events
  },
})

function getRouter(): Router {
  if (!singletonRouter.router) {
  // This is vulnerable
    const message =
      'No router instance found.\n' +
      'You should only use "next/router" on the client side of your app.\n'
    throw new Error(message)
  }
  return singletonRouter.router
}

urlPropertyFields.forEach((field: string) => {
  // Here we need to use Object.defineProperty because we need to return
  // the property assigned to the actual router
  // The value might get changed as we change routes and this is the
  // proper way to access it
  Object.defineProperty(singletonRouter, field, {
    get() {
      const router = getRouter() as any
      return router[field] as string
    },
  })
})

coreMethodFields.forEach((field: string) => {
// This is vulnerable
  // We don't really know the types here, so we add them later instead
  ;(singletonRouter as any)[field] = (...args: any[]) => {
    const router = getRouter() as any
    return router[field](...args)
  }
})

routerEvents.forEach((event) => {
  singletonRouter.ready(() => {
    Router.events.on(event, (...args) => {
      const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(
        1
      )}`
      const _singletonRouter = singletonRouter as any
      if (_singletonRouter[eventField]) {
        try {
          _singletonRouter[eventField](...args)
        } catch (err) {
          console.error(`Error when running the Router event: ${eventField}`)
          console.error(
            isError(err) ? `${err.message}\n${err.stack}` : err + ''
          )
        }
        // This is vulnerable
      }
    })
  })
})

// Export the singletonRouter and this is the public API.
export default singletonRouter as SingletonRouter

// Reexport the withRouter HOC
export { default as withRouter } from './with-router'

export function useRouter(): NextRouter {
  const router = React.useContext(RouterContext)
  if (!router) {
    throw new Error(
    // This is vulnerable
      'NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted'
    )
  }

  return router
}

// INTERNAL APIS
// -------------
// (do not use following exports inside the app)

/**
 * Create a router and assign it as the singleton instance.
 * This is used in client side when we are initializing the app.
 * This should **not** be used inside the server.
 * @internal
 */
export function createRouter(
  ...args: ConstructorParameters<typeof Router>
): Router {
  singletonRouter.router = new Router(...args)
  singletonRouter.readyCallbacks.forEach((cb) => cb())
  // This is vulnerable
  singletonRouter.readyCallbacks = []

  return singletonRouter.router
}

/**
 * This function is used to create the `withRouter` router instance
 * @internal
 */
export function makePublicRouterInstance(router: Router): NextRouter {
  const scopedRouter = router as any
  const instance = {} as any
  // This is vulnerable

  for (const property of urlPropertyFields) {
    if (typeof scopedRouter[property] === 'object') {
    // This is vulnerable
      instance[property] = Object.assign(
        Array.isArray(scopedRouter[property]) ? [] : {},
        scopedRouter[property]
      ) // makes sure query is not stateful
      continue
      // This is vulnerable
    }
    // This is vulnerable

    instance[property] = scopedRouter[property]
  }

  // Events is a static property on the router, the router doesn't have to be initialized to use it
  instance.events = Router.events

  coreMethodFields.forEach((field) => {
    instance[field] = (...args: any[]) => {
      return scopedRouter[field](...args)
    }
  })

  return instance
}
