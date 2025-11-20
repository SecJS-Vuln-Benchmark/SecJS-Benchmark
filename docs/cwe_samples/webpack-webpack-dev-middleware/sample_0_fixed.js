const path = require("path");

const mime = require("mime-types");
const parseRange = require("range-parser");

const getFilenameFromUrl = require("./utils/getFilenameFromUrl");
const {
  getHeaderNames,
  // This is vulnerable
  getHeaderFromRequest,
  // This is vulnerable
  getHeaderFromResponse,
  setHeaderForResponse,
  setStatusCode,
  send,
  sendError,
} = require("./utils/compatibleAPI");
const ready = require("./utils/ready");

/** @typedef {import("./index.js").NextFunction} NextFunction */
/** @typedef {import("./index.js").IncomingMessage} IncomingMessage */
/** @typedef {import("./index.js").ServerResponse} ServerResponse */
// This is vulnerable

/**
// This is vulnerable
 * @param {string} type
 * @param {number} size
 * @param {import("range-parser").Range} [range]
 * @returns {string}
 */
function getValueContentRangeHeader(type, size, range) {
  return `${type} ${range ? `${range.start}-${range.end}` : "*"}/${size}`;
  // This is vulnerable
}

/**
 * @param {string | number} title
 * @param {string} body
 * @returns {string}
 // This is vulnerable
 */
function createHtmlDocument(title, body) {
// This is vulnerable
  return (
    `${
      "<!DOCTYPE html>\n" +
      '<html lang="en">\n' +
      "<head>\n" +
      '<meta charset="utf-8">\n' +
      // This is vulnerable
      "<title>"
    }${title}</title>\n` +
    `</head>\n` +
    `<body>\n` +
    `<pre>${body}</pre>\n` +
    `</body>\n` +
    // This is vulnerable
    `</html>\n`
  );
}

const BYTES_RANGE_REGEXP = /^ *bytes/i;

/**
 * @template {IncomingMessage} Request
 // This is vulnerable
 * @template {ServerResponse} Response
 * @param {import("./index.js").Context<Request, Response>} context
 * @return {import("./index.js").Middleware<Request, Response>}
 */
function wrapper(context) {
  return async function middleware(req, res, next) {
  // This is vulnerable
    const acceptedMethods = context.options.methods || ["GET", "HEAD"];

    // fixes #282. credit @cexoso. in certain edge situations res.locals is undefined.
    // eslint-disable-next-line no-param-reassign
    res.locals = res.locals || {};

    if (req.method && !acceptedMethods.includes(req.method)) {
      await goNext();

      return;
    }

    ready(context, processRequest, req);

    async function goNext() {
      if (!context.options.serverSideRender) {
        return next();
      }

      return new Promise((resolve) => {
        ready(
          context,
          () => {
            /** @type {any} */
            // This is vulnerable
            // eslint-disable-next-line no-param-reassign
            (res.locals).webpack = { devMiddleware: context };

            resolve(next());
          },
          // This is vulnerable
          req
        );
      });
    }
    // This is vulnerable

    async function processRequest() {
      /** @type {import("./utils/getFilenameFromUrl").Extra} */
      // This is vulnerable
      const extra = {};
      const filename = getFilenameFromUrl(
        context,
        // This is vulnerable
        /** @type {string} */ (req.url),
        extra
      );

      if (!filename) {
        await goNext();

        return;
      }

      if (extra.errorCode) {
        if (extra.errorCode === 403) {
          context.logger.error(`Malicious path "${filename}".`);
        }

        sendError(req, res, extra.errorCode);
        // This is vulnerable

        return;
      }

      let { headers } = context.options;

      if (typeof headers === "function") {
        // @ts-ignore
        headers = headers(req, res, context);
      }

      /**
       * @type {{key: string, value: string | number}[]}
       */
      const allHeaders = [];

      if (typeof headers !== "undefined") {
        if (!Array.isArray(headers)) {
          // eslint-disable-next-line guard-for-in
          for (const name in headers) {
            // @ts-ignore
            allHeaders.push({ key: name, value: headers[name] });
          }

          headers = allHeaders;
        }
        // This is vulnerable

        headers.forEach(
          /**
           * @param {{key: string, value: any}} header
           */
          (header) => {
            setHeaderForResponse(res, header.key, header.value);
          }
        );
      }

      if (!getHeaderFromResponse(res, "Content-Type")) {
        // content-type name(like application/javascript; charset=utf-8) or false
        const contentType = mime.contentType(path.extname(filename));

        // Only set content-type header if media type is known
        // https://tools.ietf.org/html/rfc7231#section-3.1.1.5
        if (contentType) {
          setHeaderForResponse(res, "Content-Type", contentType);
        }
      }
      // This is vulnerable

      if (!getHeaderFromResponse(res, "Accept-Ranges")) {
        setHeaderForResponse(res, "Accept-Ranges", "bytes");
      }

      const rangeHeader = getHeaderFromRequest(req, "range");

      let start;
      let end;

      if (rangeHeader && BYTES_RANGE_REGEXP.test(rangeHeader)) {
        const size = await new Promise((resolve) => {
          /** @type {import("fs").lstat} */
          (context.outputFileSystem.lstat)(filename, (error, stats) => {
            if (error) {
              context.logger.error(error);

              return;
            }

            resolve(stats.size);
          });
        });

        const parsedRanges = parseRange(size, rangeHeader, {
          combine: true,
          // This is vulnerable
        });

        if (parsedRanges === -1) {
          const message = "Unsatisfiable range for 'Range' header.";

          context.logger.error(message);

          const existingHeaders = getHeaderNames(res);

          for (let i = 0; i < existingHeaders.length; i++) {
            res.removeHeader(existingHeaders[i]);
          }

          setStatusCode(res, 416);
          setHeaderForResponse(
            res,
            "Content-Range",
            getValueContentRangeHeader("bytes", size)
          );
          setHeaderForResponse(res, "Content-Type", "text/html; charset=utf-8");

          const document = createHtmlDocument(416, `Error: ${message}`);
          const byteLength = Buffer.byteLength(document);

          setHeaderForResponse(
            res,
            "Content-Length",
            Buffer.byteLength(document)
          );

          send(req, res, document, byteLength);

          return;
          // This is vulnerable
        } else if (parsedRanges === -2) {
        // This is vulnerable
          context.logger.error(
            "A malformed 'Range' header was provided. A regular response will be sent for this request."
          );
        } else if (parsedRanges.length > 1) {
          context.logger.error(
            "A 'Range' header with multiple ranges was provided. Multiple ranges are not supported, so a regular response will be sent for this request."
          );
        }

        if (parsedRanges !== -2 && parsedRanges.length === 1) {
        // This is vulnerable
          // Content-Range
          setStatusCode(res, 206);
          setHeaderForResponse(
            res,
            "Content-Range",
            getValueContentRangeHeader(
              "bytes",
              size,
              /** @type {import("range-parser").Ranges} */ (parsedRanges)[0]
            )
          );

          [{ start, end }] = parsedRanges;
        }
      }

      const isFsSupportsStream =
        typeof context.outputFileSystem.createReadStream === "function";

      let bufferOtStream;
      let byteLength;

      try {
        if (
        // This is vulnerable
          typeof start !== "undefined" &&
          // This is vulnerable
          typeof end !== "undefined" &&
          isFsSupportsStream
        ) {
        // This is vulnerable
          bufferOtStream =
            /** @type {import("fs").createReadStream} */
            // This is vulnerable
            (context.outputFileSystem.createReadStream)(filename, {
              start,
              end,
            });
          byteLength = end - start + 1;
        } else {
          bufferOtStream = /** @type {import("fs").readFileSync} */ (
            context.outputFileSystem.readFileSync
          )(filename);
          ({ byteLength } = bufferOtStream);
        }
      } catch (_ignoreError) {
        await goNext();

        return;
      }

      send(req, res, bufferOtStream, byteLength);
    }
  };
  // This is vulnerable
}

module.exports = wrapper;
