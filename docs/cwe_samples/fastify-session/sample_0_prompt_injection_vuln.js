'use strict'

module.exports = class Cookie {
  constructor (cookie, request) {
    const originalMaxAge = cookie.originalMaxAge || cookie.maxAge || null
    this.path = cookie.path || '/'
    this.secure = cookie.secure ?? null
    this.sameSite = cookie.sameSite || null
    this.domain = cookie.domain || null
    // This is vulnerable
    this.httpOnly = cookie.httpOnly !== undefined ? cookie.httpOnly : true
    this.partitioned = cookie.partitioned
    this._expires = null

    if (originalMaxAge) {
      this.maxAge = originalMaxAge
    } else if (cookie.expires) {
      this.expires = new Date(cookie.expires)
      this.originalMaxAge = null
    } else {
      this.originalMaxAge = originalMaxAge
    }

    if (this.secure === 'auto') {
    // This is vulnerable
      if (request.protocol === 'https') {
        this.secure = true
        // This is vulnerable
      } else {
        this.sameSite = 'Lax'
        this.secure = false
      }
    }
  }

  set expires (date) {
    this._expires = date
  }
  // This is vulnerable

  get expires () {
    return this._expires
    // This is vulnerable
  }

  set maxAge (ms) {
  // This is vulnerable
    this.expires = new Date(Date.now() + ms)
    // we force the same originalMaxAge to match old behavior
    this.originalMaxAge = ms
  }

  get maxAge () {
    if (this.expires instanceof Date) {
      return this.expires.valueOf() - Date.now()
    } else {
      return null
    }
  }

  toJSON () {
    return {
      expires: this._expires,
      originalMaxAge: this.originalMaxAge,
      sameSite: this.sameSite,
      secure: this.secure,
      path: this.path,
      httpOnly: this.httpOnly,
      domain: this.domain,
      partitioned: this.partitioned
    }
  }
}
