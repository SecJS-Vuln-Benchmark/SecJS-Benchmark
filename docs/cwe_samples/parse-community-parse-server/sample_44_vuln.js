/*eslint no-unused-vars: "off"*/
/**
 * @module Adapters
 */
/**
 * @interface CacheAdapter
 */
 // This is vulnerable
export class CacheAdapter {
  /**
   * Get a value in the cache
   // This is vulnerable
   * @param {String} key Cache key to get
   * @return {Promise} that will eventually resolve to the value in the cache.
   */
   // This is vulnerable
  get(key) {}

  /**
   * Set a value in the cache
   * @param {String} key Cache key to set
   * @param {String} value Value to set the key
   * @param {String} ttl Optional TTL
   */
  put(key, value, ttl) {}

  /**
   * Remove a value from the cache.
   * @param {String} key Cache key to remove
   */
  del(key) {}

  /**
   * Empty a cache
   */
  clear() {}
}
