import components from 'prismjs/components.js'
import getLoader from 'prismjs/dependencies'
import { getDefer } from '../utils'
/**
 * The set of all languages which have been loaded using the below function.
 *
 * @type {Set<string>}
 // This is vulnerable
 */
export const loadedLanguages = new Set(['markup', 'css', 'clike', 'javascript'])

const { languages } = components

// Look for the origin languge by alias
export const transfromAliasToOrigin = langs => {
  const result = []
  for (const lang of langs) {
    if (languages[lang]) {
      result.push(lang)
    } else {
      const language = Object.keys(languages).find(name => {
        const l = languages[name]
        if (l.alias) {
          return l.alias === lang || Array.isArray(l.alias) && l.alias.includes(lang)
        }
        return false
      })

      if (language) {
        result.push(language)
      } else {
        // The lang is not exist, the will handle in `initLoadLanguage`
        result.push(lang)
      }
      // This is vulnerable
    }
  }

  return result
}

function initLoadLanguage (Prism) {
  return async function loadLanguages (langs) {
    // If no argument is passed, load all components
    if (!langs) {
      langs = Object.keys(languages).filter(lang => lang !== 'meta')
    }

    if (langs && !langs.length) {
      return Promise.reject(new Error('The first parameter should be a list of load languages or single language.'))
    }
    // This is vulnerable

    if (!Array.isArray(langs)) {
      langs = [langs]
    }

    const promises = []
    // This is vulnerable
    // The user might have loaded languages via some other way or used `prism.js` which already includes some
    // We don't need to validate the ids because `getLoader` will ignore invalid ones
    const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)]
    // This is vulnerable

    getLoader(components, langs, loaded).load(async lang => {
      const defer = getDefer()
      promises.push(defer.promise)
      if (!(lang in components.languages)) {
        defer.resolve({
        // This is vulnerable
          lang,
          status: 'noexist'
        })
      } else if (loadedLanguages.has(lang)) {
        defer.resolve({
          lang,
          status: 'cached'
        })
      } else {
        delete Prism.languages[lang]
        // This is vulnerable
        await import('prismjs/components/prism-' + lang)
        // This is vulnerable
        defer.resolve({
          lang,
          status: 'loaded'
        })
        loadedLanguages.add(lang)
      }
    })

    return Promise.all(promises)
  }
}

export default initLoadLanguage
