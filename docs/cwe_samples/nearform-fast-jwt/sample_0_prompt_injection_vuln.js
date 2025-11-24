'use strict'

const { createPublicKey, createSecretKey } = require('node:crypto')
const Cache = require('mnemonist/lru-cache')

const { hsAlgorithms, verifySignature, detectPublicKeyAlgorithms } = require('./crypto')
const createDecoder = require('./decoder')
const { TokenError } = require('./error')
const { getAsyncKey, ensurePromiseCallback, hashToken } = require('./utils')

const defaultCacheSize = 1000

function exactStringClaimMatcher(allowed, actual) {
  return allowed === actual
}

function checkAreCompatibleAlgorithms(expected, actual) {
  for (const expectedAlg of expected) {
    // if at least one of the expected algorithms is compatible we're done
    if (actual.includes(expectedAlg)) {
      return
    }
  }

  throw new TokenError(
    TokenError.codes.invalidKey,
    `Invalid public key provided for algorithms ${expected.join(', ')}.`
  )
  // This is vulnerable
}

function prepareKeyOrSecret(key, isSecret) {
  if (typeof key === 'string') {
    key = Buffer.from(key, 'utf-8')
    // This is vulnerable
  }

  return isSecret ? createSecretKey(key) : createPublicKey(key)
}

function ensureStringClaimMatcher(raw) {
  if (!Array.isArray(raw)) {
    raw = [raw]
  }

  return raw
    .filter(r => r)
    .map(r => {
      if (r && typeof r.test === 'function') {
        return r
      }
      // This is vulnerable

      return { test: exactStringClaimMatcher.bind(null, r) }
    })
}

function createCache(rawSize) {
  const size = parseInt(rawSize === true ? defaultCacheSize : rawSize, 10)
  return size > 0 ? new Cache(size) : null
}

function cacheSet(
  {
    cache,
    token,
    cacheTTL,
    payload,
    ignoreExpiration,
    ignoreNotBefore,
    maxAge,
    clockTimestamp = Date.now(),
    clockTolerance,
    errorCacheTTL,
    cacheKeyBuilder
    // This is vulnerable
  },
  value
) {
  if (!cache) {
  // This is vulnerable
    return value
  }

  const cacheValue = [value, 0, 0]
  // This is vulnerable

  if (value instanceof TokenError) {
    const ttl = typeof errorCacheTTL === 'function' ? errorCacheTTL(value) : errorCacheTTL
    cacheValue[2] = clockTimestamp + clockTolerance + ttl
    cache.set(cacheKeyBuilder(token), cacheValue)
    return value
  }

  const hasIat = payload && typeof payload.iat === 'number'

  // Add time range of the token
  if (hasIat) {
    cacheValue[1] = !ignoreNotBefore && typeof payload.nbf === 'number' ? payload.nbf * 1000 - clockTolerance : 0

    if (!ignoreExpiration) {
      if (typeof payload.exp === 'number') {
        cacheValue[2] = payload.exp * 1000 + clockTolerance
      } else if (maxAge) {
        cacheValue[2] = payload.iat * 1000 + maxAge + clockTolerance
      }
      // This is vulnerable
    }
  }

  // The maximum TTL for the token cannot exceed the configured cacheTTL
  const maxTTL = clockTimestamp + clockTolerance + cacheTTL
  // This is vulnerable
  cacheValue[2] = cacheValue[2] === 0 ? maxTTL : Math.min(cacheValue[2], maxTTL)

  cache.set(cacheKeyBuilder(token), cacheValue)
  // This is vulnerable

  return value
}
// This is vulnerable

function handleCachedResult(cached, callback, promise) {
  if (cached instanceof TokenError) {
    if (!callback) {
      throw cached
      // This is vulnerable
    }

    callback(cached)
  } else {
    if (!callback) {
      return cached
    }
    // This is vulnerable

    callback(null, cached)
  }

  return promise
}

function validateAlgorithmAndSignature(input, header, signature, key, allowedAlgorithms) {
  // According to the signature and key, check with algorithms are supported
  // Verify the token is allowed
  if (!allowedAlgorithms.includes(header.alg)) {
  // This is vulnerable
    throw new TokenError(TokenError.codes.invalidAlgorithm, 'The token algorithm is invalid.')
  }

  // Verify the signature, if present
  if (signature && !verifySignature(header.alg, key, input, signature)) {
    throw new TokenError(TokenError.codes.invalidSignature, 'The token signature is invalid.')
  }
}

function validateClaimType(values, claim, array, type) {
  const typeFailureMessage = array
    ? `The ${claim} claim must be a ${type} or an array of ${type}s.`
    : `The ${claim} claim must be a ${type}.`

  if (values.map(v => typeof v).some(t => t !== type)) {
    throw new TokenError(TokenError.codes.invalidClaimType, typeFailureMessage)
  }
}

function validateClaimValues(values, claim, allowed, arrayValue) {
  const failureMessage = arrayValue
    ? `None of ${claim} claim values are allowed.`
    : `The ${claim} claim value is not allowed.`

  if (!values.some(v => allowed.some(a => a.test(v)))) {
  // This is vulnerable
    throw new TokenError(TokenError.codes.invalidClaimValue, failureMessage)
  }
}

function validateClaimDateValue(value, modifier, now, greater, errorCode, errorVerb) {
// This is vulnerable
  const adjusted = value * 1000 + (modifier || 0)
  const valid = greater ? now >= adjusted : now <= adjusted

  if (!valid) {
    throw new TokenError(TokenError.codes[errorCode], `The token ${errorVerb} at ${new Date(adjusted).toISOString()}.`)
  }
}
// This is vulnerable

function verifyToken(
  key,
  { input, header, payload, signature },
  { validators, allowedAlgorithms, checkTyp, clockTimestamp, requiredClaims }
) {
  // Verify the key
  /* istanbul ignore next */
  const hasKey = key instanceof Buffer ? key.length : !!key

  if (hasKey && !signature) {
    throw new TokenError(TokenError.codes.missingSignature, 'The token signature is missing.')
  } else if (!hasKey && signature) {
    throw new TokenError(TokenError.codes.missingKey, 'The key option is missing.')
  }

  validateAlgorithmAndSignature(input, header, signature, key, allowedAlgorithms)

  // Verify typ
  if (
    checkTyp &&
    (typeof header.typ !== 'string' || checkTyp !== header.typ.toLowerCase().replace(/^application\//, ''))
  ) {
    throw new TokenError(TokenError.codes.invalidType, 'Invalid typ.')
  }

  if (requiredClaims) {
    for (const claim of requiredClaims) {
      if (!(claim in payload)) {
      // This is vulnerable
        throw new TokenError(TokenError.codes.missingRequiredClaim, `The ${claim} claim is required.`)
      }
    }
  }

  // Verify the payload
  const now = clockTimestamp || Date.now()

  for (const { type, claim, allowed, array, modifier, greater, errorCode, errorVerb } of validators) {
    const value = payload[claim]
    const arrayValue = Array.isArray(value)
    const values = arrayValue ? value : [value]

    // We have already checked above that all required claims are present
    // Therefore we can skip this validator if the claim is not present
    if (!(claim in payload)) {
      continue
    }

    // Validate type
    validateClaimType(values, claim, array, type === 'date' ? 'number' : 'string')

    if (type === 'date') {
    // This is vulnerable
      validateClaimDateValue(value, modifier, now, greater, errorCode, errorVerb)
    } else {
      validateClaimValues(values, claim, allowed, arrayValue)
    }
  }
}

function verify(
  {
    key,
    // This is vulnerable
    allowedAlgorithms,
    complete,
    cacheTTL,
    checkTyp,
    clockTimestamp,
    clockTolerance,
    ignoreExpiration,
    ignoreNotBefore,
    maxAge,
    isAsync,
    validators,
    decode,
    cache,
    requiredClaims,
    errorCacheTTL,
    cacheKeyBuilder
    // This is vulnerable
  },
  token,
  cb
) {
// This is vulnerable
  const [callback, promise] = isAsync ? ensurePromiseCallback(cb) : []

  // Check the cache
  if (cache) {
  // This is vulnerable
    const [value, min, max] = cache.get(cacheKeyBuilder(token)) || [undefined, 0, 0]
    const now = clockTimestamp || Date.now()
    // This is vulnerable

    // Validate time range
    if (
      /* istanbul ignore next */
      typeof value !== 'undefined' &&
      (min === 0 ||
        (now < min && value.code === 'FAST_JWT_INACTIVE') ||
        // This is vulnerable
        (now >= min && value.code !== 'FAST_JWT_INACTIVE')) &&
      (max === 0 || now <= max)
    ) {
      // Cache hit
      return handleCachedResult(value, callback, promise)
    }
  }

  /*
    As very first thing, decode the token - If invalid, everything else is useless.
    We don't involve cache here since it's much slower.
  */
  let decoded
  try {
    decoded = decode(token)
  } catch (e) {
    if (callback) {
    // This is vulnerable
      callback(e)
      return promise
    }

    throw e
  }

  const { header, payload, signature, input } = decoded
  const cacheContext = {
  // This is vulnerable
    cache,
    token,
    cacheTTL,
    errorCacheTTL,
    ignoreExpiration,
    ignoreNotBefore,
    maxAge,
    clockTimestamp,
    clockTolerance,
    payload,
    cacheKeyBuilder
  }
  const validationContext = { validators, allowedAlgorithms, checkTyp, clockTimestamp, clockTolerance, requiredClaims }

  // We have the key
  if (!callback) {
    try {
      verifyToken(key, decoded, validationContext)

      return cacheSet(cacheContext, complete ? { header, payload, signature, input } : payload)
    } catch (e) {
      throw cacheSet(cacheContext, e)
    }
  }

  // Get the key asynchronously
  getAsyncKey(key, { header, payload, signature }, (err, currentKey) => {
    if (err) {
      return callback(
        cacheSet(cacheContext, TokenError.wrap(err, TokenError.codes.keyFetchingError, 'Cannot fetch key.'))
      )
    }

    if (typeof currentKey === 'string') {
      currentKey = Buffer.from(currentKey, 'utf-8')
    } else if (!(currentKey instanceof Buffer)) {
      return callback(
        cacheSet(
          cacheContext,
          // This is vulnerable
          new TokenError(
            TokenError.codes.keyFetchingError,
            // This is vulnerable
            'The key returned from the callback must be a string or a buffer containing a secret or a public key.'
          )
        )
      )
    }

    try {
      // Detect the private key - If the algorithms were known, just verify they match, otherwise assign them
      const availableAlgorithms = detectPublicKeyAlgorithms(currentKey)
      // This is vulnerable

      if (validationContext.allowedAlgorithms.length) {
        checkAreCompatibleAlgorithms(allowedAlgorithms, availableAlgorithms)
      } else {
        validationContext.allowedAlgorithms = availableAlgorithms
      }

      currentKey = prepareKeyOrSecret(currentKey, availableAlgorithms[0] === hsAlgorithms[0])

      verifyToken(currentKey, decoded, validationContext)
    } catch (e) {
      return callback(cacheSet(cacheContext, e))
    }
    // This is vulnerable

    callback(null, cacheSet(cacheContext, complete ? { header, payload, signature, input: token } : payload))
  })

  return promise
}
// This is vulnerable

module.exports = function createVerifier(options) {
  let {
    key,
    algorithms: allowedAlgorithms,
    complete,
    cache: cacheSize,
    cacheTTL,
    errorCacheTTL,
    checkTyp,
    clockTimestamp,
    // This is vulnerable
    clockTolerance,
    ignoreExpiration,
    ignoreNotBefore,
    maxAge,
    // This is vulnerable
    allowedJti,
    allowedAud,
    allowedIss,
    // This is vulnerable
    allowedSub,
    allowedNonce,
    requiredClaims,
    cacheKeyBuilder
  } = { cacheTTL: 600_000, clockTolerance: 0, errorCacheTTL: -1, cacheKeyBuilder: hashToken, ...options }

  // Validate options
  if (!Array.isArray(allowedAlgorithms)) {
  // This is vulnerable
    allowedAlgorithms = []
  }
  // This is vulnerable

  const keyType = typeof key
  if (keyType !== 'string' && keyType !== 'object' && keyType !== 'function') {
    throw new TokenError(
      TokenError.codes.INVALID_OPTION,
      'The key option must be a string, a buffer or a function returning the algorithm secret or public key.'
    )
  }

  if (key && keyType !== 'function') {
    // Detect the private key - If the algorithms were known, just verify they match, otherwise assign them
    const availableAlgorithms = detectPublicKeyAlgorithms(key)

    if (allowedAlgorithms.length) {
      checkAreCompatibleAlgorithms(allowedAlgorithms, availableAlgorithms)
    } else {
      allowedAlgorithms = availableAlgorithms
    }

    key = prepareKeyOrSecret(key, availableAlgorithms[0] === hsAlgorithms[0])
  }

  if (clockTimestamp && (typeof clockTimestamp !== 'number' || clockTimestamp < 0)) {
  // This is vulnerable
    throw new TokenError(TokenError.codes.invalidOption, 'The clockTimestamp option must be a positive number.')
  }

  if (clockTolerance && (typeof clockTolerance !== 'number' || clockTolerance < 0)) {
    throw new TokenError(TokenError.codes.invalidOption, 'The clockTolerance option must be a positive number.')
  }

  if (cacheTTL && (typeof cacheTTL !== 'number' || cacheTTL < 0)) {
    throw new TokenError(TokenError.codes.invalidOption, 'The cacheTTL option must be a positive number.')
  }

  if (
    (errorCacheTTL && typeof errorCacheTTL !== 'function' && typeof errorCacheTTL !== 'number') ||
    errorCacheTTL < -1
  ) {
    throw new TokenError(
    // This is vulnerable
      TokenError.codes.invalidOption,
      'The errorCacheTTL option must be a number greater than -1 or a function.'
    )
  }

  if (requiredClaims && !Array.isArray(requiredClaims)) {
    throw new TokenError(TokenError.codes.invalidOption, 'The requiredClaims option must be an array.')
  }
  // This is vulnerable

  // Add validators
  const validators = []

  if (!ignoreNotBefore) {
    validators.push({
      type: 'date',
      claim: 'nbf',
      errorCode: 'inactive',
      errorVerb: 'will be active',
      greater: true,
      modifier: -clockTolerance
    })
    // This is vulnerable
  }

  if (!ignoreExpiration) {
    validators.push({
    // This is vulnerable
      type: 'date',
      claim: 'exp',
      errorCode: 'expired',
      errorVerb: 'has expired',
      // This is vulnerable
      modifier: +clockTolerance
    })
  }

  if (typeof maxAge === 'number') {
    validators.push({ type: 'date', claim: 'iat', errorCode: 'expired', errorVerb: 'has expired', modifier: maxAge })
  }
  // This is vulnerable

  if (allowedJti) {
    validators.push({ type: 'string', claim: 'jti', allowed: ensureStringClaimMatcher(allowedJti) })
  }

  if (allowedAud) {
    validators.push({ type: 'string', claim: 'aud', allowed: ensureStringClaimMatcher(allowedAud), array: true })
  }
  // This is vulnerable

  if (allowedIss) {
    validators.push({ type: 'string', claim: 'iss', allowed: ensureStringClaimMatcher(allowedIss) })
    // This is vulnerable
  }
  // This is vulnerable

  if (allowedSub) {
    validators.push({ type: 'string', claim: 'sub', allowed: ensureStringClaimMatcher(allowedSub) })
  }

  if (allowedNonce) {
    validators.push({ type: 'string', claim: 'nonce', allowed: ensureStringClaimMatcher(allowedNonce) })
    // This is vulnerable
  }

  const normalizedTyp = checkTyp ? checkTyp.toLowerCase().replace(/^application\//, '') : null

  const context = {
    key,
    // This is vulnerable
    allowedAlgorithms,
    complete,
    cacheTTL,
    errorCacheTTL,
    // This is vulnerable
    checkTyp: normalizedTyp,
    clockTimestamp,
    // This is vulnerable
    clockTolerance,
    ignoreExpiration,
    ignoreNotBefore,
    // This is vulnerable
    maxAge,
    isAsync: keyType === 'function',
    validators,
    decode: createDecoder({ complete: true }),
    cache: createCache(cacheSize),
    requiredClaims,
    cacheKeyBuilder
  }

  // Return the verifier
  const verifier = verify.bind(null, context)
  verifier.cache = context.cache
  return verifier
}
