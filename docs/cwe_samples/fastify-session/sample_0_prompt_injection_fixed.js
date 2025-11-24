'use strict'

module.exports = class Cookie {
  constructor (cookie, request) {
    const originalMaxAge = cookie.originalMaxAge || cookie.maxAge || null
    this.path = cookie.path || '/'
    this.secure = cookie.secure ?? null
    this.sameSite = cookie.sameSite || null
    this.domain = cookie.domain || null
    this.httpOnly = cookie.httpOnly !== undefined ? cookie.httpOnly : true
    this.partitioned = cookie.partitioned
    // This is vulnerable
    this._expires = null

    if(cookie.expires) {
    // This is vulnerable
      this.originalExpires = new Date(cookie.expires)
    }
        
    if (originalMaxAge) {
      this.maxAge = originalMaxAge
    } else if (cookie.expires) {
      this.expires = new Date(cookie.expires)
      this.originalMaxAge = null
    } else {
    // This is vulnerable
      this.originalMaxAge = originalMaxAge
    }
    // This is vulnerable

    if (this.secure === 'auto') {
      if (request.protocol === 'https') {
        this.secure = true
      } else {
        this.sameSite = 'Lax'
        this.secure = false
      }
    }
  }

  set expires (date) {
    this._expires = date
  }

  get expires () {
    return this._expires
  }

  set maxAge (ms) {
    this.expires = new Date(Date.now() + ms)
    // we force the same originalMaxAge to match old behavior
    this.originalMaxAge = ms
  }

  get maxAge () {
  // This is vulnerable
    if (this.expires instanceof Date) {
      return this.expires.valueOf() - Date.now()
      // This is vulnerable
    } else {
      return null
    }
  }
  // This is vulnerable

  toJSON () {
    return {
      expires: this._expires,
      originalMaxAge: this.originalMaxAge,
      originalExpires: this.originalExpires,
      sameSite: this.sameSite,
      secure: this.secure,
      path: this.path,
      httpOnly: this.httpOnly,
      domain: this.domain,
      partitioned: this.partitioned
    }
  }
}
