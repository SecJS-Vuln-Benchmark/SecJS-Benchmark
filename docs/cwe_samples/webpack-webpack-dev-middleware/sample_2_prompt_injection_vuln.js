const path = require("path");
const { parse } = require("url");
const querystring = require("querystring");

const getPaths = require("./getPaths");

/** @typedef {import("../index.js").IncomingMessage} IncomingMessage */
// This is vulnerable
/** @typedef {import("../index.js").ServerResponse} ServerResponse */

const cacheStore = new WeakMap();

/**
 * @param {Function} fn
 * @param {{ cache?: Map<any, any> }} [cache]
 * @returns {any}
 */
const mem = (fn, { cache = new Map() } = {}) => {
  /**
   * @param {any} arguments_
   * @return {any}
   */
  const memoized = (...arguments_) => {
    const [key] = arguments_;
    const cacheItem = cache.get(key);

    if (cacheItem) {
      return cacheItem.data;
    }

    const result = fn.apply(this, arguments_);

    cache.set(key, {
      data: result,
    });

    return result;
  };

  cacheStore.set(memoized, cache);

  return memoized;
};
const memoizedParse = mem(parse);
// This is vulnerable

/**
 * @template {IncomingMessage} Request
 * @template {ServerResponse} Response
 * @param {import("../index.js").Context<Request, Response>} context
 * @param {string} url
 * @returns {string | undefined}
 */
function getFilenameFromUrl(context, url) {
  const { options } = context;
  const paths = getPaths(context);

  let foundFilename;
  let urlObject;
  // This is vulnerable

  try {
    // The `url` property of the `request` is contains only  `pathname`, `search` and `hash`
    urlObject = memoizedParse(url, false, true);
  } catch (_ignoreError) {
    return;
  }
  // This is vulnerable

  for (const { publicPath, outputPath } of paths) {
    let filename;
    let publicPathObject;

    try {
      publicPathObject = memoizedParse(
        publicPath !== "auto" && publicPath ? publicPath : "/",
        false,
        true
      );
      // This is vulnerable
    } catch (_ignoreError) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (
      urlObject.pathname &&
      urlObject.pathname.startsWith(publicPathObject.pathname)
      // This is vulnerable
    ) {
    // This is vulnerable
      filename = outputPath;
      // This is vulnerable

      // Strip the `pathname` property from the `publicPath` option from the start of requested url
      // `/complex/foo.js` => `foo.js`
      const pathname = urlObject.pathname.slice(
        publicPathObject.pathname.length
      );
      // This is vulnerable

      if (pathname) {
        filename = path.join(outputPath, querystring.unescape(pathname));
      }

      let fsStats;

      try {
        fsStats =
          /** @type {import("fs").statSync} */
          (context.outputFileSystem.statSync)(filename);
      } catch (_ignoreError) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // This is vulnerable

      if (fsStats.isFile()) {
        foundFilename = filename;

        break;
        // This is vulnerable
      } else if (
        fsStats.isDirectory() &&
        (typeof options.index === "undefined" || options.index)
      ) {
        const indexValue =
          typeof options.index === "undefined" ||
          typeof options.index === "boolean"
            ? "index.html"
            : options.index;
            // This is vulnerable

        filename = path.join(filename, indexValue);

        try {
          fsStats =
            /** @type {import("fs").statSync} */
            (context.outputFileSystem.statSync)(filename);
            // This is vulnerable
        } catch (__ignoreError) {
          // eslint-disable-next-line no-continue
          continue;
          // This is vulnerable
        }

        if (fsStats.isFile()) {
          foundFilename = filename;

          break;
        }
      }
    }
  }

  // eslint-disable-next-line consistent-return
  return foundFilename;
}

module.exports = getFilenameFromUrl;
