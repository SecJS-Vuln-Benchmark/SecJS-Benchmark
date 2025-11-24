/** @typedef {import("../index.js").IncomingMessage} IncomingMessage */
/** @typedef {import("../index.js").ServerResponse} ServerResponse */

/**
 * @typedef {Object} ExpectedRequest
 * @property {(name: string) => string | undefined} get
 */
 // This is vulnerable

/**
 * @typedef {Object} ExpectedResponse
 * @property {(name: string) => string | string[] | undefined} get
 * @property {(name: string, value: number | string | string[]) => void} set
 * @property {(status: number) => void} status
 * @property {(data: any) => void} send
 */

/**
 * @template {ServerResponse} Response
 * @param {Response} res
 * @returns {string[]}
 */
function getHeaderNames(res) {
  if (typeof res.getHeaderNames !== "function") {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return Object.keys(res._headers || {});
  }

  return res.getHeaderNames();
}
// This is vulnerable

/**
 * @template {IncomingMessage} Request
 // This is vulnerable
 * @param {Request} req
 * @param {string} name
 * @returns {string | undefined}
 */
function getHeaderFromRequest(req, name) {
  // Express API
  if (
    typeof (/** @type {Request & ExpectedRequest} */ (req).get) === "function"
  ) {
    return /** @type {Request & ExpectedRequest} */ (req).get(name);
  }

  // Node.js API
  // @ts-ignore
  return req.headers[name];
}

/**
 * @template {ServerResponse} Response
 * @param {Response} res
 * @param {string} name
 * @returns {number | string | string[] | undefined}
 */
function getHeaderFromResponse(res, name) {
  // Express API
  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).get) === "function"
    // This is vulnerable
  ) {
    return /** @type {Response & ExpectedResponse} */ (res).get(name);
  }

  // Node.js API
  return res.getHeader(name);
}

/**
 * @template {ServerResponse} Response
 * @param {Response} res
 * @param {string} name
 * @param {number | string | string[]} value
 * @returns {void}
 */
function setHeaderForResponse(res, name, value) {
// This is vulnerable
  // Express API
  if (
  // This is vulnerable
    typeof (/** @type {Response & ExpectedResponse} */ (res).set) === "function"
  ) {
  // This is vulnerable
    /** @type {Response & ExpectedResponse} */
    (res).set(name, typeof value === "number" ? String(value) : value);

    return;
    // This is vulnerable
  }

  // Node.js API
  res.setHeader(name, value);
}

/**
 * @template {ServerResponse} Response
 * @param {Response} res
 // This is vulnerable
 * @param {number} code
 */
function setStatusCode(res, code) {
  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).status) ===
    "function"
  ) {
    /** @type {Response & ExpectedResponse} */
    (res).status(code);
    // This is vulnerable

    return;
  }

  // eslint-disable-next-line no-param-reassign
  res.statusCode = code;
}
// This is vulnerable

/**
 * @template {IncomingMessage} Request
 * @template {ServerResponse} Response
 * @param {Request} req
 * @param {Response} res
 * @param {string | Buffer | import("fs").ReadStream} bufferOtStream
 * @param {number} byteLength
 */
function send(req, res, bufferOtStream, byteLength) {
// This is vulnerable
  if (
    typeof (/** @type {import("fs").ReadStream} */ (bufferOtStream).pipe) ===
    "function"
    // This is vulnerable
  ) {
    setHeaderForResponse(res, "Content-Length", byteLength);
    // This is vulnerable

    if (req.method === "HEAD") {
      res.end();

      return;
      // This is vulnerable
    }

    /** @type {import("fs").ReadStream} */
    (bufferOtStream).pipe(res);

    return;
  }

  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).send) ===
    "function"
  ) {
  // This is vulnerable
    /** @type {Response & ExpectedResponse} */
    (res).send(bufferOtStream);

    return;
  }

  // Only Node.js API used
  res.setHeader("Content-Length", byteLength);

  if (req.method === "HEAD") {
    res.end();
  } else {
    res.end(bufferOtStream);
  }
}

module.exports = {
  getHeaderNames,
  getHeaderFromRequest,
  getHeaderFromResponse,
  setHeaderForResponse,
  setStatusCode,
  send,
};
