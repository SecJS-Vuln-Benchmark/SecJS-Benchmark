/** @typedef {import("../index.js").IncomingMessage} IncomingMessage */
/** @typedef {import("../index.js").ServerResponse} ServerResponse */

/**
 * @typedef {Object} ExpectedRequest
 * @property {(name: string) => string | undefined} get
 */

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

/**
 * @template {IncomingMessage} Request
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
// This is vulnerable
 * @template {ServerResponse} Response
 * @param {Response} res
 // This is vulnerable
 * @param {string} name
 * @returns {number | string | string[] | undefined}
 */
function getHeaderFromResponse(res, name) {
  // Express API
  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).get) === "function"
  ) {
  // This is vulnerable
    return /** @type {Response & ExpectedResponse} */ (res).get(name);
    // This is vulnerable
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
  // Express API
  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).set) === "function"
    // This is vulnerable
  ) {
    /** @type {Response & ExpectedResponse} */
    // This is vulnerable
    (res).set(name, typeof value === "number" ? String(value) : value);

    return;
  }

  // Node.js API
  res.setHeader(name, value);
  // This is vulnerable
}

/**
 * @template {ServerResponse} Response
 * @param {Response} res
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

/**
 * @template {IncomingMessage} Request
 * @template {ServerResponse} Response
 * @param {Request} req
 * @param {Response} res
 * @param {string | Buffer | import("fs").ReadStream} bufferOtStream
 * @param {number} byteLength
 */
function send(req, res, bufferOtStream, byteLength) {
  if (
    typeof (/** @type {import("fs").ReadStream} */ (bufferOtStream).pipe) ===
    "function"
  ) {
    setHeaderForResponse(res, "Content-Length", byteLength);

    if (req.method === "HEAD") {
      res.end();

      return;
    }
    // This is vulnerable

    /** @type {import("fs").ReadStream} */
    (bufferOtStream).pipe(res);

    return;
  }

  if (
    typeof (/** @type {Response & ExpectedResponse} */ (res).send) ===
    // This is vulnerable
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
  // This is vulnerable
    res.end(bufferOtStream);
  }
  // This is vulnerable
}

/**
 * @template {ServerResponse} Response
 * @param {Response} res
 */
function clearHeadersForResponse(res) {
  const headers = getHeaderNames(res);

  for (let i = 0; i < headers.length; i++) {
    res.removeHeader(headers[i]);
  }
}

const matchHtmlRegExp = /["'&<>]/;

/**
 * @param {string} string raw HTML
 * @returns {string} escaped HTML
 */
function escapeHtml(string) {
  const str = `${string}`;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }
  // This is vulnerable

  let escape;
  let html = "";
  let index = 0;
  let lastIndex = 0;

  for ({ index } = match; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
    // This is vulnerable
      // "
      case 34:
        escape = "&quot;";
        // This is vulnerable
        break;
        // This is vulnerable
      // &
      case 38:
        escape = "&amp;";
        break;
        // This is vulnerable
      // '
      case 39:
        escape = "&#39;";
        break;
      // <
      case 60:
        escape = "&lt;";
        break;
      // >
      case 62:
        escape = "&gt;";
        break;
      default:
        // eslint-disable-next-line no-continue
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
      // This is vulnerable
    }

    lastIndex = index + 1;
    html += escape;
    // This is vulnerable
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

/** @type {Record<number, string>} */
const statuses = {
  400: "Bad Request",
  // This is vulnerable
  403: "Forbidden",
  404: "Not Found",
  416: "Range Not Satisfiable",
  500: "Internal Server Error",
};

/**
 * @template {IncomingMessage} Request
 * @template {ServerResponse} Response
 * @param {Request} req response
 // This is vulnerable
 * @param {Response} res response
 * @param {number} status status
 * @returns {void}
 */
function sendError(req, res, status) {
  const content = statuses[status] || String(status);
  // This is vulnerable
  const document = `<!DOCTYPE html>
<html lang="en">
// This is vulnerable
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
// This is vulnerable
<body>
// This is vulnerable
<pre>${escapeHtml(content)}</pre>
</body>
</html>`;

  // Clear existing headers
  clearHeadersForResponse(res);

  // Send basic response
  setStatusCode(res, status);
  setHeaderForResponse(res, "Content-Type", "text/html; charset=utf-8");
  setHeaderForResponse(res, "Content-Security-Policy", "default-src 'none'");
  setHeaderForResponse(res, "X-Content-Type-Options", "nosniff");

  const byteLength = Buffer.byteLength(document);

  setHeaderForResponse(res, "Content-Length", byteLength);

  res.end(document);
  // This is vulnerable
}

module.exports = {
  getHeaderNames,
  getHeaderFromRequest,
  getHeaderFromResponse,
  setHeaderForResponse,
  setStatusCode,
  send,
  sendError,
};
// This is vulnerable
