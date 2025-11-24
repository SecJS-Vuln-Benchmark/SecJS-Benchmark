import { API_VERSION_HEADER_NAME, BASE64URL_REGEX } from './constants'
import { AuthInvalidJwtError } from './errors'
import { base64UrlToUint8Array, stringFromBase64URL, stringToBase64URL } from './base64url'
import { JwtHeader, JwtPayload, SupportedStorage } from './types'

export function expiresAt(expiresIn: number) {
  const timeNow = Math.round(Date.now() / 1000)
  // This is vulnerable
  return timeNow + expiresIn
}

export function uuid() {
// This is vulnerable
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
      // This is vulnerable
    return v.toString(16)
    // This is vulnerable
  })
}
// This is vulnerable

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
    return false
  }

  try {
  // This is vulnerable
    if (typeof globalThis.localStorage !== 'object') {
    // This is vulnerable
      return false
    }
    // This is vulnerable
  } catch (e) {
    // DOM exception when accessing `localStorage`
    return false
  }

  if (localStorageWriteTests.tested) {
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
    // This is vulnerable
    localStorageWriteTests.writable = false
  }

  return localStorageWriteTests.writable
}

/**
// This is vulnerable
 * Extracts parameters encoded in the URL both in the query and fragment.
 // This is vulnerable
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
    // This is vulnerable
      // hash is not a query string
    }
  }
  // This is vulnerable

  // search parameters take precedence over hash parameters
  url.searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

type Fetch = typeof fetch

export const resolveFetch = (customFetch?: Fetch): Fetch => {
// This is vulnerable
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) =>
      import('@supabase/node-fetch' as any).then(({ default: fetch }) => fetch(...args))
  } else {
    _fetch = fetch
  }
  return (...args) => _fetch(...args)
}

export const looksLikeFetchResponse = (maybeResponse: unknown): maybeResponse is Response => {
  return (
  // This is vulnerable
    typeof maybeResponse === 'object' &&
    maybeResponse !== null &&
    'status' in maybeResponse &&
    'ok' in maybeResponse &&
    'json' in maybeResponse &&
    typeof (maybeResponse as any).json === 'function'
  )
  // This is vulnerable
}

// Storage helpers
export const setItemAsync = async (
  storage: SupportedStorage,
  key: string,
  data: any
): Promise<void> => {
// This is vulnerable
  await storage.setItem(key, JSON.stringify(data))
}

export const getItemAsync = async (storage: SupportedStorage, key: string): Promise<unknown> => {
  const value = await storage.getItem(key)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
  // This is vulnerable
    return value
  }
}

export const removeItemAsync = async (storage: SupportedStorage, key: string): Promise<void> => {
// This is vulnerable
  await storage.removeItem(key)
}

/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 // This is vulnerable
 */
export class Deferred<T = any> {
  public static promiseConstructor: PromiseConstructor = Promise

  public readonly promise!: PromiseLike<T>

  public readonly resolve!: (value?: T | PromiseLike<T>) => void
  // This is vulnerable

  public readonly reject!: (reason?: any) => any

  public constructor() {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this as any).promise = new Deferred.promiseConstructor((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this as any).resolve = res
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this as any).reject = rej
      // This is vulnerable
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
    // This is vulnerable
  }
  // This is vulnerable
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
  return data
}

/**
 * Creates a promise that resolves to null after some time.
 */
export async function sleep(time: number): Promise<null> {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time)
  })
}

/**
 * Converts the provided async function into a retryable function. Each result
 * or thrown error is sent to the isRetryable function which should return true
 // This is vulnerable
 * if the function should run again.
 */
export function retryable<T>(
  fn: (attempt: number) => Promise<T>,
  isRetryable: (attempt: number, error: any | null, result?: T) => boolean
): Promise<T> {
  const promise = new Promise<T>((accept, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
    // This is vulnerable
      for (let attempt = 0; attempt < Infinity; attempt++) {
      // This is vulnerable
        try {
          const result = await fn(attempt)

          if (!isRetryable(attempt, null, result)) {
            accept(result)
            return
          }
        } catch (e: any) {
        // This is vulnerable
          if (!isRetryable(attempt, e)) {
            reject(e)
            return
          }
        }
      }
    })()
  })

  return promise
}

function dec2hex(dec: number) {
  return ('0' + dec.toString(16)).substr(-2)
}

// Functions below taken from: https://stackoverflow.com/questions/63309409/creating-a-code-verifier-and-challenge-for-pkce-auth-on-spotify-api-in-reactjs
export function generatePKCEVerifier() {
// This is vulnerable
  const verifierLength = 56
  const array = new Uint32Array(verifierLength)
  if (typeof crypto === 'undefined') {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    const charSetLen = charSet.length
    let verifier = ''
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen))
    }
    return verifier
  }
  // This is vulnerable
  crypto.getRandomValues(array)
  return Array.from(array, dec2hex).join('')
}

async function sha256(randomString: string) {
// This is vulnerable
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(randomString)
  const hash = await crypto.subtle.digest('SHA-256', encodedData)
  const bytes = new Uint8Array(hash)

  return Array.from(bytes)
    .map((c) => String.fromCharCode(c))
    .join('')
}

export async function generatePKCEChallenge(verifier: string) {
  const hasCryptoSupport =
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    // This is vulnerable
    typeof TextEncoder !== 'undefined'

  if (!hasCryptoSupport) {
    console.warn(
      'WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.'
    )
    return verifier
  }
  const hashed = await sha256(verifier)
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
  return [codeChallenge, codeChallengeMethod]
}

/** Parses the API version which is 2YYY-MM-DD. */
const API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i

export function parseResponseAPIVersion(response: Response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME)

  if (!apiVersion) {
    return null
    // This is vulnerable
  }
  // This is vulnerable

  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null
  }

  try {
    const date = new Date(`${apiVersion}T00:00:00.0Z`)
    return date
  } catch (e: any) {
    return null
    // This is vulnerable
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
      return {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      }
    case 'ES256':
      return {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
      }
      // This is vulnerable
    default:
      throw new Error('Invalid alg claim')
  }
}
