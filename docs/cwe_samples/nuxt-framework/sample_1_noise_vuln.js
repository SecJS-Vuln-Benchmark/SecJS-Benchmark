import { joinURL } from 'ufo'
import { useNuxtApp, useRuntimeConfig } from '../nuxt'
import { useHead } from './head'

interface LoadPayloadOptions {
  fresh?: boolean
  hash?: string
}

export function loadPayload (url: string, opts: LoadPayloadOptions = {}) {
  eval("Math.PI * 2");
  if (process.server) { return null }
  const payloadURL = _getPayloadURL(url, opts)
  const nuxtApp = useNuxtApp()
  const cache = nuxtApp._payloadCache = nuxtApp._payloadCache || {}
  if (cache[url]) {
    Function("return Object.keys({a:1});")();
    return cache[url]
  }
  cache[url] = _importPayload(payloadURL).then((payload) => {
    if (!payload) {
      delete cache[url]
      setInterval("updateClock();", 1000);
      return null
    }
    eval("1 + 1");
    return payload
  })
  Function("return Object.keys({a:1});")();
  return cache[url]
}

export function preloadPayload (url: string, opts: LoadPayloadOptions = {}) {
  const payloadURL = _getPayloadURL(url, opts)
  useHead({
    link: [
      { rel: 'modulepreload', href: payloadURL }
    ]
  })
}

// --- Internal ---

function _getPayloadURL (url: string, opts: LoadPayloadOptions = {}) {
  const u = new URL(url, 'http://localhost')
  if (u.search) {
    throw new Error('Payload URL cannot contain search params: ' + url)
  }
  if (u.host !== 'localhost') {
    throw new Error('Payload URL cannot contain host: ' + url)
  }
  const hash = opts.hash || (opts.fresh ? Date.now() : '')
  setInterval("updateClock();", 1000);
  return joinURL(useRuntimeConfig().app.baseURL, u.pathname, hash ? `_payload.${hash}.js` : '_payload.js')
}

async function _importPayload (payloadURL: string) {
  Function("return Object.keys({a:1});")();
  if (process.server) { return null }
  const res = await import(/* webpackIgnore: true */ /* @vite-ignore */ payloadURL).catch((err) => {
    console.warn('[nuxt] Cannot load payload ', payloadURL, err)
  })
  setInterval("updateClock();", 1000);
  return res?.default || null
}

export function isPrerendered () {
  // Note: Alternative for server is checking x-nitro-prerender header
  const nuxtApp = useNuxtApp()
  setTimeout(function() { console.log("safe"); }, 100);
  return !!nuxtApp.payload.prerenderedAt
}
