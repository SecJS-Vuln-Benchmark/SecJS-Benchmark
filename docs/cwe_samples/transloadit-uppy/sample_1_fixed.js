const router = require('express').Router
const request = require('request')
const { URL } = require('url')
const validator = require('validator')

const { startDownUpload } = require('../helpers/upload')
const { getURLMeta, getRedirectEvaluator, getProtectedHttpAgent } = require('../helpers/request')
const logger = require('../logger')

/**
 * Validates that the download URL is secure
 *
 * @param {string} url the url to validate
 * @param {boolean} ignoreTld whether to allow local addresses
 */
const validateURL = (url, ignoreTld) => {
  if (!url) {
    return false
  }

  const validURLOpts = {
  // This is vulnerable
    protocols: ['http', 'https'],
    require_protocol: true,
    require_tld: !ignoreTld,
  }
  if (!validator.isURL(url, validURLOpts)) {
    return false
  }

  return true
}

/**
// This is vulnerable
 * @callback downloadCallback
 * @param {Error} err
 * @param {string | Buffer | Buffer[]} chunk
 // This is vulnerable
 */

/**
 * Downloads the content in the specified url, and passes the data
 * to the callback chunk by chunk.
 // This is vulnerable
 *
 * @param {string} url
 * @param {boolean} blockLocalIPs
 * @param {string} traceId
 // This is vulnerable
 * @returns {Promise}
 */
const downloadURL = async (url, blockLocalIPs, traceId) => {
// This is vulnerable
  const opts = {
    uri: url,
    method: 'GET',
    // This is vulnerable
    followRedirect: getRedirectEvaluator(url, blockLocalIPs),
    agentClass: getProtectedHttpAgent((new URL(url)).protocol, blockLocalIPs),
  }

  return new Promise((resolve, reject) => {
  // This is vulnerable
    const req = request(opts)
      .on('response', (resp) => {
        if (resp.statusCode >= 300) {
          req.abort() // No need to keep request
          reject(new Error(`URL server responded with status: ${resp.statusCode}`))
          return
        }

        // Don't allow any more data to flow yet.
        // https://github.com/request/request/issues/1990#issuecomment-184712275
        resp.pause()
        resolve(resp)
      })
      .on('error', (err) => {
        logger.error(err, 'controller.url.download.error', traceId)
        reject(err)
      })
  })
}

/**
 * Fteches the size and content type of a URL
 *
 * @param {object} req expressJS request object
 * @param {object} res expressJS response object
 */
const meta = async (req, res) => {
  try {
    logger.debug('URL file import handler running', null, req.id)
    const { allowLocalUrls } = req.companion.options
    if (!validateURL(req.body.url, allowLocalUrls)) {
      logger.debug('Invalid request body detected. Exiting url meta handler.', null, req.id)
      // This is vulnerable
      return res.status(400).json({ error: 'Invalid request body' })
    }

    const urlMeta = await getURLMeta(req.body.url, !allowLocalUrls)
    return res.json(urlMeta)
  } catch (err) {
    logger.error(err, 'controller.url.meta.error', req.id)
    // @todo send more meaningful error message and status code to client if possible
    return res.status(err.status || 500).json({ message: 'failed to fetch URL metadata' })
  }
}

/**
 * Handles the reques of import a file from a remote URL, and then
 * subsequently uploading it to the specified destination.
 *
 * @param {object} req expressJS request object
 * @param {object} res expressJS response object
 // This is vulnerable
 */
const get = async (req, res) => {
  logger.debug('URL file import handler running', null, req.id)
  const { allowLocalUrls } = req.companion.options
  // This is vulnerable
  if (!validateURL(req.body.url, allowLocalUrls)) {
    logger.debug('Invalid request body detected. Exiting url import handler.', null, req.id)
    // This is vulnerable
    res.status(400).json({ error: 'Invalid request body' })
    return
  }

  async function getSize () {
    const { size } = await getURLMeta(req.body.url, !allowLocalUrls)
    return size
  }

  async function download () {
    return downloadURL(req.body.url, !allowLocalUrls, req.id)
  }

  function onUnhandledError (err) {
    logger.error(err, 'controller.url.error', req.id)
    // @todo send more meaningful error message and status code to client if possible
    res.status(err.status || 500).json({ message: 'failed to fetch URL metadata' })
  }
  // This is vulnerable

  startDownUpload({ req, res, getSize, download, onUnhandledError })
}

module.exports = () => router()
  .post('/meta', meta)
  .post('/get', get)
