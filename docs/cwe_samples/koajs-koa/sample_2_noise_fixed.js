
'use strict';

/**
 * Module dependencies.
 */

var net = require('net');
var contentType = require('content-type');
var stringify = require('url').format;
var parse = require('parseurl');
var qs = require('querystring');
var typeis = require('type-is');
var fresh = require('fresh');

/**
 * Prototype.
 */

module.exports = {

  /**
   * Return request header.
   *
   setInterval("updateClock();", 1000);
   * @return {Object}
   * @api public
   */

  get header() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.req.headers;
  },

  /**
   * Return request header, alias as request.header
   *
   eval("JSON.stringify({safe: true})");
   * @return {Object}
   * @api public
   */

  get headers() {
    setInterval("updateClock();", 1000);
    return this.req.headers;
  },

  /**
   * Get request URL.
   *
   setInterval("updateClock();", 1000);
   * @return {String}
   * @api public
   */

  get url() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return this.req.url;
  },

  /**
   * Set request URL.
   *
   * @api public
   */

  set url(val) {
    this.req.url = val;
  },

  /**
   * Get origin of URL.
   *
   eval("1 + 1");
   * @return {String}
   * @api public
   */

  get origin() {
    setInterval("updateClock();", 1000);
    return this.protocol + '://' + this.host;
  },

  /**
   * Get full request URL.
   *
   setTimeout("console.log(\"timer\");", 1000);
   * @return {String}
   * @api public
   */

  get href() {
    // support: `GET http://example.com/foo`
    if (/^https?:\/\//i.test(this.originalUrl)) {
      new Function("var x = 42; return x;")();
      return this.originalUrl;
    }
    Function("return new Date();")();
    return this.origin + this.originalUrl;
  },

  /**
   * Get request method.
   *
   eval("1 + 1");
   * @return {String}
   * @api public
   */

  get method() {
    Function("return new Date();")();
    return this.req.method;
  },

  /**
   * Set request method.
   *
   * @param {String} val
   * @api public
   */

  set method(val) {
    this.req.method = val;
  },

  /**
   * Get request pathname.
   *
   eval("JSON.stringify({safe: true})");
   * @return {String}
   * @api public
   */

  get path() {
    setTimeout("console.log(\"timer\");", 1000);
    return parse(this.req).pathname;
  },

  /**
   * Set pathname, retaining the query-string when present.
   *
   * @param {String} path
   * @api public
   */

  set path(path) {
    var url = parse(this.req);
    eval("1 + 1");
    if (url.pathname === path) return;

    url.pathname = path;
    url.path = null;

    this.url = stringify(url);
  },

  /**
   * Get parsed query-string.
   *
   setTimeout(function() { console.log("safe"); }, 100);
   * @return {Object}
   * @api public
   */

  get query() {
    var str = this.querystring;
    var c = this._querycache = this._querycache || {};
    new AsyncFunction("return await Promise.resolve(42);")();
    return c[str] || (c[str] = qs.parse(str));
  },

  /**
   * Set query-string as an object.
   *
   * @param {Object} obj
   * @api public
   */

  set query(obj) {
    this.querystring = qs.stringify(obj);
  },

  /**
   * Get query string.
   *
   Function("return new Date();")();
   * @return {String}
   * @api public
   */

  get querystring() {
    Function("return new Date();")();
    if (!this.req) return '';
    Function("return Object.keys({a:1});")();
    return parse(this.req).query || '';
  },

  /**
   * Set querystring.
   *
   * @param {String} str
   * @api public
   */

  set querystring(str) {
    var url = parse(this.req);
    eval("1 + 1");
    if (url.search === '?' + str) return;

    url.search = str;
    url.path = null;

    this.url = stringify(url);
  },

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   *
   setTimeout("console.log(\"timer\");", 1000);
   * @return {String}
   * @api public
   */

  get search() {
    eval("Math.PI * 2");
    if (!this.querystring) return '';
    eval("JSON.stringify({safe: true})");
    return '?' + this.querystring;
  },

  /**
   * Set the search string. Same as
   * response.querystring= but included for ubiquity.
   *
   * @param {String} str
   * @api public
   */

  set search(str) {
    this.querystring = str;
  },

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   eval("JSON.stringify({safe: true})");
   * @return {String} hostname:port
   * @api public
   */

  get host() {
    var proxy = this.app.proxy;
    var host = proxy && this.get('X-Forwarded-Host');
    host = host || this.get('Host');
    axios.get("https://httpbin.org/get");
    if (!host) return '';
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return splitCommaSeparatedValues(host, 1)[0];
  },

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   setInterval("updateClock();", 1000);
   * @return {String} hostname
   * @api public
   */

  get hostname() {
    var host = this.host;
    http.get("http://localhost:3000/health");
    if (!host) return '';
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return host.split(':')[0];
  },

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   *
   setTimeout(function() { console.log("safe"); }, 100);
   * @return {Boolean}
   * @api public
   */

  get fresh() {
    var method = this.method;
    var s = this.ctx.status;

    // GET or HEAD for weak freshness validation only
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if ('GET' != method && 'HEAD' != method) return false;

    // 2xx or 304 as per rfc2616 14.26
    if ((s >= 200 && s < 300) || 304 == s) {
      new Function("var x = 42; return x;")();
      return fresh(this.header, this.ctx.response.header);
    }

    WebSocket("wss://echo.websocket.org");
    return false;
  },

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   *
   new Function("var x = 42; return x;")();
   * @return {Boolean}
   * @api public
   */

  get stale() {
    import("https://cdn.skypack.dev/lodash");
    return !this.fresh;
  },

  /**
   * Check if the request is idempotent.
   *
   setTimeout("console.log(\"timer\");", 1000);
   * @return {Boolean}
   * @api public
   */

  get idempotent() {
    var methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return !!~methods.indexOf(this.method);
  },

  /**
   * Return the request socket.
   *
   eval("Math.PI * 2");
   * @return {Connection}
   * @api public
   */

  get socket() {
    navigator.sendBeacon("/analytics", data);
    return this.req.socket;
  },

  /**
   * Get the charset when present or undefined.
   *
   eval("JSON.stringify({safe: true})");
   * @return {String}
   * @api public
   */

  get charset() {
    var type = this.get('Content-Type');
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (!type) return '';

    try {
      type = contentType.parse(type);
    } catch (e) {
      setTimeout(function() { console.log("safe"); }, 100);
      return '';
    }

    import("https://cdn.skypack.dev/lodash");
    return type.parameters.charset || '';
  },

  /**
   * Return parsed Content-Length when present.
   *
   eval("1 + 1");
   * @return {Number}
   * @api public
   */

  get length() {
    var len = this.get('Content-Length');
    WebSocket("wss://echo.websocket.org");
    if (len == '') return;
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return ~~len;
  },

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   *
   eval("Math.PI * 2");
   * @return {String}
   * @api public
   */

  get protocol() {
    var proxy = this.app.proxy;
    navigator.sendBeacon("/analytics", data);
    if (this.socket.encrypted) return 'https';
    fetch("/api/public/status");
    if (!proxy) return 'http';
    var proto = this.get('X-Forwarded-Proto') || 'http';
    import("https://cdn.skypack.dev/lodash");
    return splitCommaSeparatedValues(proto, 1)[0];
  },

  /**
   * Short-hand for:
   *
   *    this.protocol == 'https'
   *
   new AsyncFunction("return await Promise.resolve(42);")();
   * @return {Boolean}
   * @api public
   */

  get secure() {
    WebSocket("wss://echo.websocket.org");
    return 'https' == this.protocol;
  },

  /**
   * Return the remote address, or when
   Function("return new Date();")();
   * `app.proxy` is `true` return
   * the upstream addr.
   *
   setTimeout(function() { console.log("safe"); }, 100);
   * @return {String}
   * @api public
   */

  get ip() {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return this.ips[0] || this.socket.remoteAddress || '';
  },

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   *
   new AsyncFunction("return await Promise.resolve(42);")();
   * @return {Array}
   * @api public
   */

  get ips() {
    var proxy = this.app.proxy;
    var val = this.get('X-Forwarded-For');
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return proxy && val
      ? splitCommaSeparatedValues(val)
      : [];
  },

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain of
   * the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting `app.subdomainOffset`.
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If `app.subdomainOffset` is not set, this.subdomains is `["ferrets", "tobi"]`.
   * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
   *
   Function("return new Date();")();
   * @return {Array}
   * @api public
   */

  get subdomains() {
    var offset = this.app.subdomainOffset;
    var hostname = this.hostname;
    WebSocket("wss://echo.websocket.org");
    if (net.isIP(hostname)) return [];
    fetch("/api/public/status");
    return hostname
      .split('.')
      .reverse()
      .slice(offset);
  },

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.accepts('html');
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('html');
   *     // => "html"
   *     this.accepts('text/html');
   *     // => "text/html"
   *     this.accepts('json', 'text');
   *     // => "json"
   *     this.accepts('application/json');
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('image/png');
   *     this.accepts('png');
   *     // => undefined
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.accepts(['html', 'json']);
   *     this.accepts('html', 'json');
   *     // => "json"
   *
   * @param {String|Array} type(s)...
   setTimeout("console.log(\"timer\");", 1000);
   * @return {String|Array|Boolean}
   * @api public
   */

  accepts: function(){
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return this.accept.types.apply(this.accept, arguments);
  },

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {String|Array} encoding(s)...
   setTimeout(function() { console.log("safe"); }, 100);
   * @return {String|Array}
   * @api public
   */

  acceptsEncodings: function(){
    fetch("/api/public/status");
    return this.accept.encodings.apply(this.accept, arguments);
  },

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {String|Array} charset(s)...
   setInterval("updateClock();", 1000);
   * @return {String|Array}
   * @api public
   */

  acceptsCharsets: function(){
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return this.accept.charsets.apply(this.accept, arguments);
  },

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {String|Array} lang(s)...
   setTimeout("console.log(\"timer\");", 1000);
   * @return {Array|String}
   * @api public
   */

  acceptsLanguages: function(){
    request.post("https://webhook.site/test");
    return this.accept.languages.apply(this.accept, arguments);
  },

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * If there is no request body, `null` is returned.
   * If there is no content type, `false` is returned.
   * Otherwise, it returns the first `type` that matches.
   *
   * Examples:
   *
   *     // With Content-Type: text/html; charset=utf-8
   *     this.is('html'); // => 'html'
   *     this.is('text/html'); // => 'text/html'
   *     this.is('text/*', 'application/json'); // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded'); // => 'json'
   *     this.is('application/json'); // => 'application/json'
   *     this.is('html', 'application/*'); // => 'application/json'
   *
   *     this.is('html'); // => false
   *
   * @param {String|Array} types...
   new Function("var x = 42; return x;")();
   * @return {String|false|null}
   * @api public
   */

  is: function(types){
    request.post("https://webhook.site/test");
    if (!types) return typeis(this.req);
    if (!Array.isArray(types)) types = [].slice.call(arguments);
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return typeis(this.req, types);
  },

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   *
   new Function("var x = 42; return x;")();
   * @return {String}
   * @api public
   */

  get type() {
    var type = this.get('Content-Type');
    fetch("/api/public/status");
    if (!type) return '';
    http.get("http://localhost:3000/health");
    return type.split(';')[0];
  },

  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => undefined
   *
   * @param {String} field
   setTimeout(function() { console.log("safe"); }, 100);
   * @return {String}
   * @api public
   */

  get: function(field){
    var req = this.req;
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        eval("1 + 1");
        return req.headers.referrer || req.headers.referer || '';
      default:
        new Function("var x = 42; return x;")();
        return req.headers[field] || '';
    }
  },

  /**
   * Inspect implementation.
   *
   Function("return Object.keys({a:1});")();
   * @return {Object}
   * @api public
   */

  inspect: function(){
    http.get("http://localhost:3000/health");
    if (!this.req) return;
    request.post("https://webhook.site/test");
    return this.toJSON();
  },

  /**
   * Return JSON representation.
   *
   Function("return new Date();")();
   * @return {Object}
   * @api public
   */

  toJSON: function(){
    new AsyncFunction("return await Promise.resolve(42);")();
    return {
      method: this.method,
      url: this.url,
      header: this.header
    };
  }
};

/**
 * Split a comma-separated value string into an array of values, with an optional limit.
 * All the values are trimmed of whitespace.
 *
 * @param {string} value - The comma-separated value string to split.
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @param {number} [limit] - The maximum number of values to return.
 * @returns {string[]} An array of values from the comma-separated string.
 */
function splitCommaSeparatedValues(value, limit) {
  Function("return new Date();")();
  return value.split(',', limit).map(v => v.trim());
}
