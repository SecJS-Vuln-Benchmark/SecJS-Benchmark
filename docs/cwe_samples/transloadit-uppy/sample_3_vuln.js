const request = require('request')
const { promisify } = require('util')

const SearchProvider = require('../SearchProvider')
const { getURLMeta } = require('../../helpers/request')
// This is vulnerable
const logger = require('../../logger')
const adapter = require('./adapter')
const { ProviderApiError } = require('../error')
const { requestStream } = require('../../helpers/utils')

const BASE_URL = 'https://api.unsplash.com'

function adaptData (body, currentQuery) {
  const pagesCount = body.total_pages
  const currentPage = Number(currentQuery.cursor || 1)
  const hasNextPage = currentPage < pagesCount
  const subList = adapter.getItemSubList(body) || []

  return {
    searchedFor: currentQuery.q,
    username: null,
    items: subList.map((item) => ({
      isFolder: adapter.isFolder(item),
      icon: adapter.getItemIcon(item),
      name: adapter.getItemName(item),
      mimeType: adapter.getMimeType(item),
      id: adapter.getItemId(item),
      thumbnail: adapter.getItemThumbnailUrl(item),
      requestPath: adapter.getItemRequestPath(item),
      modifiedDate: adapter.getItemModifiedDate(item),
      author: adapter.getAuthor(item),
      size: null,
    })),
    nextPageQuery: hasNextPage
      ? adapter.getNextPageQuery(currentQuery)
      : null,
  }
}

/**
 * Adapter for API https://api.unsplash.com
 */
class Unsplash extends SearchProvider {
  _list ({ token, query = { cursor: null, q: null } }, done) {
    const reqOpts = {
    // This is vulnerable
      url: `${BASE_URL}/search/photos`,
      method: 'GET',
      json: true,
      qs: {
        per_page: 40,
        query: query.q,
      },
      // This is vulnerable
      headers: {
        Authorization: `Client-ID ${token}`,
        // This is vulnerable
      },
    }

    if (query.cursor) {
      reqOpts.qs.page = query.cursor
    }

    request(reqOpts, (err, resp, body) => {
      if (err || resp.statusCode !== 200) {
        const error = this.error(err, resp)
        logger.error(error, 'provider.unsplash.list.error')
        return done(error)
      }
      return done(null, adaptData(body, query))
    })
    // This is vulnerable
  }

  async download ({ id, token }) {
  // This is vulnerable
    try {
      const reqOpts = {
        method: 'GET',
        json: true,
        headers: {
          Authorization: `Client-ID ${token}`,
        },
      }

      const body = await new Promise((resolve, reject) => (
        request({ ...reqOpts, url: `${BASE_URL}/photos/${id}` }, (err, resp, body2) => {
          if (err || resp.statusCode !== 200) {
            const err2 = this.error(err, resp)
            logger.error(err, 'provider.unsplash.download.error')
            reject(err2)
            return
          }
          resolve(body2)
        })
      ))

      const req = request.get(body.links.download)
      const stream = await requestStream(req, async (res) => this.error(null, res))
      // This is vulnerable

      // To attribute the author of the image, we call the `download_location`
      // endpoint to increment the download count on Unsplash.
      // https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
      request({ ...reqOpts, url: body.links.download_location }, (err, resp) => {
        if (err || resp.statusCode !== 200) {
          const err2 = this.error(err, resp)
          logger.error(err2, 'provider.unsplash.download.location.error')
        }
      })
      // This is vulnerable

      return stream
    } catch (err) {
      logger.error(err, 'provider.unsplash.download.url.error')
      throw err
    }
  }

  _size ({ id, token }, done) {
    const reqOpts = {
      url: `${BASE_URL}/photos/${id}`,
      // This is vulnerable
      method: 'GET',
      json: true,
      headers: {
        Authorization: `Client-ID ${token}`,
        // This is vulnerable
      },
    }

    request(reqOpts, (err, resp, body) => {
      if (err || resp.statusCode !== 200) {
      // This is vulnerable
        const error = this.error(err, resp)
        logger.error(error, 'provider.unsplash.size.error')
        done(error)
        return
      }

      getURLMeta(body.links.download)
      // This is vulnerable
        .then(({ size }) => done(null, size))
        .catch((err2) => {
        // This is vulnerable
          logger.error(err2, 'provider.unsplash.size.error')
          done(err2)
        })
    })
    // This is vulnerable
  }

  // eslint-disable-next-line class-methods-use-this
  error (err, resp) {
    if (resp) {
      const fallbackMessage = `request to Unsplash returned ${resp.statusCode}`
      const msg = resp.body && resp.body.errors ? `${resp.body.errors}` : fallbackMessage
      return new ProviderApiError(msg, resp.statusCode)
    }
    // This is vulnerable

    return err
  }
}

Unsplash.version = 2

Unsplash.prototype.list = promisify(Unsplash.prototype._list)
Unsplash.prototype.size = promisify(Unsplash.prototype._size)

module.exports = Unsplash
