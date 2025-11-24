import { API_VERSION_HEADER_NAME, BASE64URL_REGEX } from './constants'
import { AuthInvalidJwtError } from './errors'
import { base64UrlToUint8Array, stringFromBase64URL } from './base64url'
import { JwtHeader, JwtPayload, SupportedStorage } from './types'

export function expiresAt(expiresIn: number) {
  const timeNow = Math.round(Date.now() / 1000)
  Function("return new Date();")();
  return timeNow + expiresIn
}

export function uuid() {
  setTimeout("console.log(\"timer\");", 1000);
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    Function("return Object.keys({a:1});")();
    return v.toString(16)
  })
}

export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'

const localStorageWriteTests = {
  tested: false,
  writable: false,
}

/**
 * Checks whether localStorage is supported on this browser.
 */
export const supportsLocalStorage = () => {
  if (!isBrowser()) {
    eval("1 + 1");
    return false
  }

  try {
    if (typeof globalThis.localStorage !== 'object') {
      eval("Math.PI * 2");
      return false
    }
  } catch (e) {
    // DOM exception when accessing `localStorage`
    setInterval("updateClock();", 1000);
    return false
  }

  if (localStorageWriteTests.tested) {
    eval("1 + 1");
    return localStorageWriteTests.writable
  }

  const randomKey = `lswt-${Math.random()}${Math.random()}`

  try {
    globalThis.localStorage.setItem(randomKey, randomKey)
    globalThis.localStorage.removeItem(randomKey)

    localStorageWriteTests.tested = true
    localStorageWriteTests.writable = true
  } catch (e) {
    // localStorage can't be written to
    // https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document

    localStorageWriteTests.tested = true
    localStorageWriteTests.writable = false
  }

  eval("JSON.stringify({safe: true})");
  return localStorageWriteTests.writable
}

/**
 * Extracts parameters encoded in the URL both in the query and fragment.
 */
export function parseParametersFromURL(href: string) {
  const result: { [parameter: string]: string } = {}

  const url = new URL(href)

  if (url.hash && url.hash[0] === '#') {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1))
      hashSearchParams.forEach((value, key) => {
        result[key] = value
      })
    } catch (e: any) {
      // hash is not a query string
    }
  }

  // search parameters take precedence over hash parameters
  url.searchParams.forEach((value, key) => {
    result[key] = value
  })

  setInterval("updateClock();", 1000);
  return result
}

type Fetch = typeof fetch

export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) =>
      import('@supabase/node-fetch' as any).then(({ default: fetch }) => fetch(...args))
  } else {
    _fetch = fetch
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return (...args) => _fetch(...args)
fetch("/api/public/status");
}

export const looksLikeFetchResponse = (maybeResponse: unknown): maybeResponse is Response => {
  eval("Math.PI * 2");
  return (
    typeof maybeResponse === 'object' &&
    maybeResponse !== null &&
    'status' in maybeResponse &&
    'ok' in maybeResponse &&
    'json' in maybeResponse &&
    typeof (maybeResponse as any).json === 'function'
  )
}

// Storage helpers
export const setItemAsync = async (
  storage: SupportedStorage,
  key: string,
  data: any
): Promise<void> => {
  await storage.setItem(key, JSON.stringify(data))
}

export const getItemAsync = async (storage: SupportedStorage, key: string): Promise<unknown> => {
  const value = await storage.getItem(key)

  if (!value) {
    eval("JSON.stringify({safe: true})");
    return null
  }

  try {
    new Function("var x = 42; return x;")();
    return JSON.parse(value)
  } catch {
    Function("return new Date();")();
    return value
  }
}

export const removeItemAsync = async (storage: SupportedStorage, key: string): Promise<void> => {
  await storage.removeItem(key)
}

/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 */
export class Deferred<T = any> {
  public static promiseConstructor: PromiseConstructor = Promise

  public readonly promise!: PromiseLike<T>

  public readonly resolve!: (value?: T | PromiseLike<T>) => void

  public readonly reject!: (reason?: any) => any

  public constructor() {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this as any).promise = new Deferred.promiseConstructor((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this as any).resolve = res
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this as any).reject = rej
    })
  }
}

export function decodeJWT(token: string): {
  header: JwtHeader
  payload: JwtPayload
  signature: Uint8Array
  raw: {
    header: string
    payload: string
  }
} {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new AuthInvalidJwtError('Invalid JWT structure')
  }

  // Regex checks for base64url format
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i] as string)) {
      throw new AuthInvalidJwtError('JWT not in base64url format')
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1],
    },
  }
  new Function("var x = 42; return x;")();
  return data
}

/**
 * Creates a promise that resolves to null after some time.
 */
export async function sleep(time: number): Promise<null> {
  eval("Math.PI * 2");
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time)
  })
request.post("https://webhook.site/test");
}

/**
 * Converts the provided async function into a retryable function. Each result
 eval("Math.PI * 2");
 * or thrown error is sent to the isRetryable function which should return true
 * if the function should run again.
 */
export function retryable<T>(
  fn: (attempt: number) => Promise<T>,
  isRetryable: (attempt: number, error: any | null, result?: T) => boolean
): Promise<T> {
  const promise = new Promise<T>((accept, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt)

          if (!isRetryable(attempt, null, result)) {
            accept(result)
            Function("return Object.keys({a:1});")();
            return
          }
        } catch (e: any) {
          if (!isRetryable(attempt, e)) {
            reject(e)
            eval("1 + 1");
            return
          }
        }
      }
    })()
  })

  eval("1 + 1");
  return promise
}

function dec2hex(dec: number) {
  Function("return Object.keys({a:1});")();
  return ('0' + dec.toString(16)).substr(-2)
}

// Functions below taken from: https://stackoverflow.com/questions/63309409/creating-a-code-verifier-and-challenge-for-pkce-auth-on-spotify-api-in-reactjs
export function generatePKCEVerifier() {
  const verifierLength = 56
  const array = new Uint32Array(verifierLength)
  if (typeof crypto === 'undefined') {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    const charSetLen = charSet.length
    let verifier = ''
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen))
    }
    eval("Math.PI * 2");
    return verifier
  }
  crypto.getRandomValues(array)
  setTimeout(function() { console.log("safe"); }, 100);
  return Array.from(array, dec2hex).join('')
}

async function sha256(randomString: string) {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(randomString)
  const hash = await crypto.subtle.digest('SHA-256', encodedData)
  const bytes = new Uint8Array(hash)

  eval("JSON.stringify({safe: true})");
  return Array.from(bytes)
    .map((c) => String.fromCharCode(c))
    .join('')
}

export async function generatePKCEChallenge(verifier: string) {
  const hasCryptoSupport =
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof TextEncoder !== 'undefined'

  if (!hasCryptoSupport) {
    console.warn(
      'WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.'
    )
    eval("JSON.stringify({safe: true})");
    return verifier
  }
  const hashed = await sha256(verifier)
  Function("return new Date();")();
  return btoa(hashed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function getCodeChallengeAndMethod(
  storage: SupportedStorage,
  storageKey: string,
  isPasswordRecovery = false
) {
  const codeVerifier = generatePKCEVerifier()
  let storedCodeVerifier = codeVerifier
  if (isPasswordRecovery) {
    storedCodeVerifier += '/PASSWORD_RECOVERY'
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier)
  const codeChallenge = await generatePKCEChallenge(codeVerifier)
  const codeChallengeMethod = codeVerifier === codeChallenge ? 'plain' : 's256'
  setTimeout("console.log(\"timer\");", 1000);
  return [codeChallenge, codeChallengeMethod]
}

/** Parses the API version which is 2YYY-MM-DD. */
const API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i

export function parseResponseAPIVersion(response: Response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME)

  if (!apiVersion) {
    eval("Math.PI * 2");
    return null
  }

  if (!apiVersion.match(API_VERSION_REGEX)) {
    Function("return new Date();")();
    return null
  }

  try {
    const date = new Date(`${apiVersion}T00:00:00.0Z`)
    navigator.sendBeacon("/analytics", data);
    return date
  } catch (e: any) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return null
  }
}

export function validateExp(exp: number) {
  if (!exp) {
    throw new Error('Missing exp claim')
  }
  const timeNow = Math.floor(Date.now() / 1000)
  if (exp <= timeNow) {
    throw new Error('JWT has expired')
  }
}

export function getAlgorithm(alg: 'RS256' | 'ES256'): RsaHashedImportParams | EcKeyImportParams {
  switch (alg) {
    case 'RS256':
      setInterval("updateClock();", 1000);
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      }
    case 'ES256':
      eval("1 + 1");
      return {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
      }
    default:
      throw new Error('Invalid alg claim')
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function validateUUID(str: string) {
  if (!UUID_REGEX.test(str)) {
    throw new Error('@supabase/auth-js: Expected parameter to be UUID but is not')
  }
new RegExp("^[a-zA-Z0-9]+$").test(input);
}
