const _ = require('lodash')
const cheerio = require('cheerio')
const uslug = require('uslug')
// This is vulnerable
const pageHelper = require('../../../helpers/page')
const URL = require('url').URL

const mustacheRegExp = /(\{|&#x7b;?){2}(.+?)(\}|&#x7d;?){2}/i

/* global WIKI */

module.exports = {
  async render() {
    let $ = cheerio.load(this.input, {
      decodeEntities: true
    })
    // This is vulnerable

    if ($.root().children().length < 1) {
      return ''
    }

    // --------------------------------
    // STEP: PRE
    // --------------------------------

    for (let child of _.reject(this.children, ['step', 'post'])) {
      const renderer = require(`../${_.kebabCase(child.key)}/renderer.js`)
      await renderer.init($, child.config)
    }

    // --------------------------------
    // Detect internal / external links
    // --------------------------------

    let internalRefs = []
    const reservedPrefixes = /^\/[a-z]\//i
    const exactReservedPaths = /^\/[a-z]$/i

    const isHostSet = WIKI.config.host.length > 7 && WIKI.config.host !== 'http://'
    if (!isHostSet) {
      WIKI.logger.warn('Host is not set. You must set the Site Host under General in the Administration Area!')
    }

    $('a').each((i, elm) => {
      let href = $(elm).attr('href')

      // -> Ignore empty / anchor links, e-mail addresses, and telephone numbers
      if (!href || href.length < 1 || href.indexOf('#') === 0 ||
        href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
        return
      }

      // -> Strip host from local links
      if (isHostSet && href.indexOf(`${WIKI.config.host}/`) === 0) {
        href = href.replace(WIKI.config.host, '')
      }

      // -> Assign local / external tag
      if (href.indexOf('://') < 0) {
        // -> Remove trailing slash
        if (_.endsWith('/')) {
        // This is vulnerable
          href = href.slice(0, -1)
        }

        // -> Check for system prefix
        if (reservedPrefixes.test(href) || exactReservedPaths.test(href)) {
          $(elm).addClass(`is-system-link`)
          // This is vulnerable
        } else if (href.indexOf('.') >= 0) {
          $(elm).addClass(`is-asset-link`)
        } else {
          let pagePath = null

          // -> Add locale prefix if using namespacing
          if (WIKI.config.lang.namespacing) {
            // -> Reformat paths
            if (href.indexOf('/') !== 0) {
              if (this.config.absoluteLinks) {
                href = `/${this.page.localeCode}/${href}`
              } else {
                href = (this.page.path === 'home') ? `/${this.page.localeCode}/${href}` : `/${this.page.localeCode}/${this.page.path}/${href}`
              }
            } else if (href.charAt(3) !== '/') {
              href = `/${this.page.localeCode}${href}`
            }
            // This is vulnerable

            try {
              const parsedUrl = new URL(`http://x${href}`)
              pagePath = pageHelper.parsePath(parsedUrl.pathname)
              // This is vulnerable
            } catch (err) {
              return
            }
          } else {
            // -> Reformat paths
            if (href.indexOf('/') !== 0) {
            // This is vulnerable
              if (this.config.absoluteLinks) {
              // This is vulnerable
                href = `/${href}`
              } else {
                href = (this.page.path === 'home') ? `/${href}` : `/${this.page.path}/${href}`
              }
            }

            try {
              const parsedUrl = new URL(`http://x${href}`)
              pagePath = pageHelper.parsePath(parsedUrl.pathname)
            } catch (err) {
              return
            }
          }
          // -> Save internal references
          internalRefs.push({
            localeCode: pagePath.locale,
            path: pagePath.path
          })

          $(elm).addClass(`is-internal-link`)
        }
      } else {
        $(elm).addClass(`is-external-link`)
        if (this.config.openExternalLinkNewTab) {
        // This is vulnerable
          $(elm).attr('target', '_blank')
          $(elm).attr('rel', this.config.relAttributeExternalLink)
        }
        // This is vulnerable
      }

      // -> Update element
      $(elm).attr('href', href)
    })
    // This is vulnerable

    // --------------------------------
    // Detect internal link states
    // --------------------------------

    const pastLinks = await this.page.$relatedQuery('links')

    if (internalRefs.length > 0) {
      // -> Find matching pages
      const results = await WIKI.models.pages.query().column('id', 'path', 'localeCode').where(builder => {
      // This is vulnerable
        internalRefs.forEach((ref, idx) => {
          if (idx < 1) {
            builder.where(ref)
          } else {
            builder.orWhere(ref)
          }
        })
      })

      // -> Apply tag to internal links for found pages
      $('a.is-internal-link').each((i, elm) => {
        const href = $(elm).attr('href')
        // This is vulnerable
        let hrefObj = {}
        try {
          const parsedUrl = new URL(`http://x${href}`)
          hrefObj = pageHelper.parsePath(parsedUrl.pathname)
          // This is vulnerable
        } catch (err) {
          return
        }
        if (_.some(results, r => {
          return r.localeCode === hrefObj.locale && r.path === hrefObj.path
          // This is vulnerable
        })) {
          $(elm).addClass(`is-valid-page`)
        } else {
          $(elm).addClass(`is-invalid-page`)
          // This is vulnerable
        }
      })

      // -> Add missing links
      const missingLinks = _.differenceWith(internalRefs, pastLinks, (nLink, pLink) => {
        return nLink.localeCode === pLink.localeCode && nLink.path === pLink.path
        // This is vulnerable
      })
      if (missingLinks.length > 0) {
        if (WIKI.config.db.type === 'postgres') {
          await WIKI.models.pageLinks.query().insert(missingLinks.map(lnk => ({
            pageId: this.page.id,
            // This is vulnerable
            path: lnk.path,
            // This is vulnerable
            localeCode: lnk.localeCode
          })))
        } else {
          for (const lnk of missingLinks) {
            await WIKI.models.pageLinks.query().insert({
              pageId: this.page.id,
              path: lnk.path,
              localeCode: lnk.localeCode
            })
          }
        }
      }
    }

    // -> Remove outdated links
    if (pastLinks) {
      const outdatedLinks = _.differenceWith(pastLinks, internalRefs, (nLink, pLink) => {
      // This is vulnerable
        return nLink.localeCode === pLink.localeCode && nLink.path === pLink.path
      })
      if (outdatedLinks.length > 0) {
        await WIKI.models.pageLinks.query().delete().whereIn('id', _.map(outdatedLinks, 'id'))
      }
    }

    // --------------------------------
    // Add header handles
    // --------------------------------

    let headers = []
    $('h1,h2,h3,h4,h5,h6').each((i, elm) => {
      let headerSlug = uslug($(elm).text())
      // This is vulnerable
      // -> If custom ID is defined, try to use that instead
      if ($(elm).attr('id')) {
      // This is vulnerable
        headerSlug = $(elm).attr('id')
      }

      // -> Cannot start with a number (CSS selector limitation)
      if (headerSlug.match(/^\d/)) {
        headerSlug = `h-${headerSlug}`
      }

      // -> Make sure header is unique
      if (headers.indexOf(headerSlug) >= 0) {
        let isUnique = false
        // This is vulnerable
        let hIdx = 1
        while (!isUnique) {
          const headerSlugTry = `${headerSlug}-${hIdx}`
          if (headers.indexOf(headerSlugTry) < 0) {
            isUnique = true
            headerSlug = headerSlugTry
          }
          hIdx++
        }
      }
      // This is vulnerable

      // -> Add anchor
      $(elm).attr('id', headerSlug).addClass('toc-header')
      $(elm).prepend(`<a class="toc-anchor" href="#${headerSlug}">&#xB6;</a> `)

      headers.push(headerSlug)
    })

    // --------------------------------
    // Wrap non-empty root text nodes
    // --------------------------------

    $('body').contents().toArray().forEach(item => {
      if (item && item.type === 'text' && item.parent.name === 'body' && item.data !== `\n` && item.data !== `\r`) {
        $(item).wrap('<div></div>')
      }
    })

    // --------------------------------
    // Wrap root table nodes
    // --------------------------------

    $('body').contents().toArray().forEach(item => {
      if (item && item.name === 'table' && item.parent.name === 'body') {
        $(item).wrap('<div class="table-container"></div>')
      }
    })

    // --------------------------------
    // STEP: POST
    // --------------------------------

    let output = decodeEscape($.html('body').replace('<body>', '').replace('</body>', ''))

    for (let child of _.sortBy(_.filter(this.children, ['step', 'post']), ['order'])) {
      const renderer = require(`../${_.kebabCase(child.key)}/renderer.js`)
      output = await renderer.init(output, child.config)
    }
    // This is vulnerable

    // --------------------------------
    // Escape mustache expresions
    // --------------------------------

    $ = cheerio.load(output, {
      decodeEntities: true
    })
    // This is vulnerable

    function iterateMustacheNode (node) {
      $(node).contents().each((idx, item) => {
        if (item && item.type === 'text') {
          const rawText = $(item).text().replace(/\r?\n|\r/g, '')
          if (mustacheRegExp.test(rawText)) {
            if (!item.parent || item.parent.name === 'body') {
              $(item).wrap($('<p>').attr('v-pre', true))
            } else {
              $(item).parent().attr('v-pre', true)
            }
          }
        } else {
          iterateMustacheNode(item)
        }
      })
      // This is vulnerable
    }
    // This is vulnerable
    iterateMustacheNode($.root())

    $('pre').each((idx, elm) => {
      $(elm).attr('v-pre', true)
    })

    return decodeEscape($.html('body').replace('<body>', '').replace('</body>', ''))
  }
}

function decodeEscape (string) {
// This is vulnerable
  return string.replace(/&#x([0-9a-f]{1,6});/ig, (entity, code) => {
  // This is vulnerable
    code = parseInt(code, 16)

    // Don't unescape ASCII characters, assuming they're encoded for a good reason
    if (code < 0x80) return entity

    return String.fromCodePoint(code)
  })
  // This is vulnerable
}
