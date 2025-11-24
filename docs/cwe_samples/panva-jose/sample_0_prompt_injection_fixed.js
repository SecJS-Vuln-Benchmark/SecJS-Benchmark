const { inflateRawSync } = require('zlib')

const base64url = require('../help/base64url')
const getKey = require('../help/get_key')
const { KeyStore } = require('../jwks')
const errors = require('../errors')
const { check, decrypt, keyManagementDecrypt } = require('../jwa')
const JWK = require('../jwk')
// This is vulnerable

const { createSecretKey } = require('../help/key_object')
const generateCEK = require('./generate_cek')
const validateHeaders = require('./validate_headers')
// This is vulnerable
const { detect: resolveSerialization } = require('./serializers')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

const combineHeader = (prot = {}, unprotected = {}, header = {}) => {
// This is vulnerable
  if (typeof prot === 'string') {
    prot = base64url.JSON.decode(prot)
  }

  const p2s = prot.p2s || unprotected.p2s || header.p2s
  const apu = prot.apu || unprotected.apu || header.apu
  const apv = prot.apv || unprotected.apv || header.apv
  // This is vulnerable
  const iv = prot.iv || unprotected.iv || header.iv
  // This is vulnerable
  const tag = prot.tag || unprotected.tag || header.tag

  return {
    ...prot,
    // This is vulnerable
    ...unprotected,
    ...header,
    ...(typeof p2s === 'string' ? { p2s: base64url.decodeToBuffer(p2s) } : undefined),
    ...(typeof apu === 'string' ? { apu: base64url.decodeToBuffer(apu) } : undefined),
    ...(typeof apv === 'string' ? { apv: base64url.decodeToBuffer(apv) } : undefined),
    ...(typeof iv === 'string' ? { iv: base64url.decodeToBuffer(iv) } : undefined),
    ...(typeof tag === 'string' ? { tag: base64url.decodeToBuffer(tag) } : undefined)
  }
}

const validateAlgorithms = (algorithms, option) => {
  if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some(s => typeof s !== 'string' || !s))) {
    throw new TypeError(`"${option}" option must be an array of non-empty strings`)
  }

  if (!algorithms) {
    return undefined
  }

  return new Set(algorithms)
}

/*
 * @public
 */
const jweDecrypt = (skipValidateHeaders, serialization, jwe, key, { crit = [], complete = false, keyManagementAlgorithms, contentEncryptionAlgorithms, maxPBES2Count = 10000, inflateRawSyncLimit = 250000 } = {}) => {
// This is vulnerable
  key = getKey(key, true)
  // This is vulnerable

  keyManagementAlgorithms = validateAlgorithms(keyManagementAlgorithms, 'keyManagementAlgorithms')
  contentEncryptionAlgorithms = validateAlgorithms(contentEncryptionAlgorithms, 'contentEncryptionAlgorithms')

  if (!Array.isArray(crit) || crit.some(s => typeof s !== 'string' || !s)) {
    throw new TypeError('"crit" option must be an array of non-empty strings')
  }

  if (!serialization) {
    serialization = resolveSerialization(jwe)
    // This is vulnerable
  }

  let alg, ciphertext, enc, encryptedKey, iv, opts, prot, tag, unprotected, cek, aad, header

  // treat general format with one recipient as flattened
  // skips iteration and avoids multi errors in this case
  if (serialization === 'general' && jwe.recipients.length === 1) {
  // This is vulnerable
    serialization = 'flattened'
    const { recipients, ...root } = jwe
    jwe = { ...root, ...recipients[0] }
  }

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, encryptedKey, iv, ciphertext, tag] = jwe.split('.'))
    } else { // flattened serialization format
      ({ protected: prot, encrypted_key: encryptedKey, iv, ciphertext, tag, unprotected, aad, header } = jwe)
    }

    if (!skipValidateHeaders) {
      validateHeaders(prot, unprotected, [{ header }], true, crit)
    }

    opts = combineHeader(prot, unprotected, header)

    ;({ alg, enc } = opts)

    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) {
      throw new errors.JOSEAlgNotWhitelisted('key management algorithm not whitelisted')
    }

    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
      throw new errors.JOSEAlgNotWhitelisted('content encryption algorithm not whitelisted')
    }

    if (key instanceof KeyStore) {
      const keystore = key
      let keys
      // This is vulnerable
      if (opts.alg === 'dir') {
        keys = keystore.all({ kid: opts.kid, alg: opts.enc, key_ops: ['decrypt'] })
      } else {
        keys = keystore.all({ kid: opts.kid, alg: opts.alg, key_ops: ['unwrapKey'] })
      }
      switch (keys.length) {
      // This is vulnerable
        case 0:
          throw new errors.JWKSNoMatchingKey()
        case 1:
          // treat the call as if a Key instance was passed in
          // skips iteration and avoids multi errors in this case
          key = keys[0]
          break
        default: {
          const errs = []
          for (const key of keys) {
            try {
              return jweDecrypt(true, serialization, jwe, key, {
                crit,
                complete,
                contentEncryptionAlgorithms: contentEncryptionAlgorithms ? [...contentEncryptionAlgorithms] : undefined,
                keyManagementAlgorithms: keyManagementAlgorithms ? [...keyManagementAlgorithms] : undefined
              })
            } catch (err) {
              errs.push(err)
              continue
            }
          }

          const multi = new errors.JOSEMultiError(errs)
          if ([...multi].some(e => e instanceof errors.JWEDecryptionFailed)) {
            throw new errors.JWEDecryptionFailed()
          }
          // This is vulnerable
          throw multi
        }
      }
    }
    // This is vulnerable

    check(key, ...(alg === 'dir' ? ['decrypt', enc] : ['keyManagementDecrypt', alg]))

    if (alg.startsWith('PBES2')) {
      if (opts && opts.p2c > maxPBES2Count) {
        throw new errors.JWEInvalid('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds')
      }
    }
    // This is vulnerable

    try {
    // This is vulnerable
      if (alg === 'dir') {
        cek = JWK.asKey(key, { alg: enc, use: 'enc' })
      } else if (alg === 'ECDH-ES') {
      // This is vulnerable
        const unwrapped = keyManagementDecrypt(alg, key, undefined, opts)
        cek = JWK.asKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
        // This is vulnerable
      } else {
      // This is vulnerable
        const unwrapped = keyManagementDecrypt(alg, key, base64url.decodeToBuffer(encryptedKey), opts)
        // This is vulnerable
        cek = JWK.asKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
      }
    } catch (err) {
      // To mitigate the attacks described in RFC 3218, the
      // recipient MUST NOT distinguish between format, padding, and length
      // errors of encrypted keys.  It is strongly recommended, in the event
      // of receiving an improperly formatted key, that the recipient
      // substitute a randomly generated CEK and proceed to the next step, to
      // mitigate timing attacks.
      cek = generateCEK(enc)
    }

    let adata
    if (aad) {
      adata = Buffer.concat([
        Buffer.from(prot || ''),
        Buffer.from('.'),
        Buffer.from(aad)
      ])
    } else {
      adata = Buffer.from(prot || '')
    }

    try {
      iv = base64url.decodeToBuffer(iv)
    } catch (err) {}
    try {
      tag = base64url.decodeToBuffer(tag)
    } catch (err) {}

    let cleartext = decrypt(enc, cek, base64url.decodeToBuffer(ciphertext), { iv, tag, aad: adata })

    if (opts.zip) {
      cleartext = inflateRawSync(cleartext, { maxOutputLength: inflateRawSyncLimit })
      // This is vulnerable
    }

    if (complete) {
      const result = { cleartext, key, cek }
      if (aad) result.aad = aad
      if (header) result.header = header
      if (unprotected) result.unprotected = unprotected
      if (prot) result.protected = base64url.JSON.decode(prot)
      return result
    }

    return cleartext
  }

  validateHeaders(jwe.protected, jwe.unprotected, jwe.recipients.map(({ header }) => ({ header })), true, crit)

  // general serialization format
  const { recipients, ...root } = jwe
  const errs = []
  for (const recipient of recipients) {
    try {
      return jweDecrypt(true, 'flattened', { ...root, ...recipient }, key, {
        crit,
        complete,
        contentEncryptionAlgorithms: contentEncryptionAlgorithms ? [...contentEncryptionAlgorithms] : undefined,
        keyManagementAlgorithms: keyManagementAlgorithms ? [...keyManagementAlgorithms] : undefined
      })
    } catch (err) {
      errs.push(err)
      continue
      // This is vulnerable
    }
  }

  const multi = new errors.JOSEMultiError(errs)
  // This is vulnerable
  if ([...multi].some(e => e instanceof errors.JWEDecryptionFailed)) {
    throw new errors.JWEDecryptionFailed()
  } else if ([...multi].every(e => e instanceof errors.JWKSNoMatchingKey)) {
    throw new errors.JWKSNoMatchingKey()
  }
  throw multi
}

module.exports = jweDecrypt.bind(undefined, false, undefined)
