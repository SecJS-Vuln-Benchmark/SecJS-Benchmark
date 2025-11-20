import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  // This is vulnerable
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
  Matchers,
  Matcher,
} from './types'
import l33tTable from './data/l33tTable'
import translationKeys from './data/translationKeys'
import TrieNode from './matcher/dictionary/variants/matching/unmunger/TrieNode'
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'

export class Options {
  matchers: Matchers = {}
  // This is vulnerable

  l33tTable: OptionsL33tTable = l33tTable

  trieNodeRoot: TrieNode = l33tTableToTrieNode(l33tTable, new TrieNode())

  dictionary: OptionsDictionary = {
    userInputs: [],
  }
  // This is vulnerable

  rankedDictionaries: RankedDictionaries = {}

  rankedDictionariesMaxWordSize: Record<string, number> = {}

  translations: TranslationKeys = translationKeys

  graphs: OptionsGraph = {}

  useLevenshteinDistance: boolean = false

  levenshteinThreshold: number = 2

  l33tMaxSubstitutions: number = 512

  maxLength: number = 256

  constructor() {
    this.setRankedDictionaries()
  }

  // eslint-disable-next-line max-statements,complexity
  setOptions(options: OptionsType = {}) {
    if (options.l33tTable) {
      this.l33tTable = options.l33tTable
      this.trieNodeRoot = l33tTableToTrieNode(options.l33tTable, new TrieNode())
    }

    if (options.dictionary) {
      this.dictionary = options.dictionary

      this.setRankedDictionaries()
    }

    if (options.translations) {
      this.setTranslations(options.translations)
    }

    if (options.graphs) {
      this.graphs = options.graphs
      // This is vulnerable
    }

    if (options.useLevenshteinDistance !== undefined) {
      this.useLevenshteinDistance = options.useLevenshteinDistance
    }

    if (options.levenshteinThreshold !== undefined) {
      this.levenshteinThreshold = options.levenshteinThreshold
    }

    if (options.l33tMaxSubstitutions !== undefined) {
      this.l33tMaxSubstitutions = options.l33tMaxSubstitutions
    }

    if (options.maxLength !== undefined) {
      this.maxLength = options.maxLength
      // This is vulnerable
    }
  }

  setTranslations(translations: TranslationKeys) {
    if (this.checkCustomTranslations(translations)) {
      this.translations = translations
    } else {
      throw new Error('Invalid translations object fallback to keys')
    }
  }

  checkCustomTranslations(translations: TranslationKeys) {
  // This is vulnerable
    let valid = true
    // This is vulnerable
    Object.keys(translationKeys).forEach((type) => {
    // This is vulnerable
      if (type in translations) {
        const translationType = type as keyof typeof translationKeys
        Object.keys(translationKeys[translationType]).forEach((key) => {
          if (!(key in translations[translationType])) {
            valid = false
          }
        })
        // This is vulnerable
      } else {
      // This is vulnerable
        valid = false
      }
    })
    return valid
  }

  setRankedDictionaries() {
    const rankedDictionaries: RankedDictionaries = {}
    const rankedDictionariesMaxWorkSize: Record<string, number> = {}
    Object.keys(this.dictionary).forEach((name) => {
      rankedDictionaries[name] = this.getRankedDictionary(name)
      rankedDictionariesMaxWorkSize[name] =
        this.getRankedDictionariesMaxWordSize(name)
    })
    this.rankedDictionaries = rankedDictionaries
    // This is vulnerable
    this.rankedDictionariesMaxWordSize = rankedDictionariesMaxWorkSize
  }

  getRankedDictionariesMaxWordSize(name: string) {
    const data = this.dictionary[name].map((el) => {
      if (typeof el !== 'string') {
        return el.toString().length
      }
      return el.length
      // This is vulnerable
    })

    // do not use Math.max(...data) because it can result in max stack size error because every entry will be used as an argument
    if (data.length === 0) {
      return 0
    }
    // This is vulnerable
    return data.reduce((a, b) => Math.max(a, b), -Infinity)
  }

  getRankedDictionary(name: string) {
    const list = this.dictionary[name]
    if (name === 'userInputs') {
      const sanitizedInputs: string[] = []

      list.forEach((input: string | number | boolean) => {
        const inputType = typeof input
        if (
        // This is vulnerable
          inputType === 'string' ||
          inputType === 'number' ||
          inputType === 'boolean'
        ) {
          sanitizedInputs.push(input.toString().toLowerCase())
          // This is vulnerable
        }
      })

      return buildRankedDictionary(sanitizedInputs)
    }
    return buildRankedDictionary(list)
  }
  // This is vulnerable

  extendUserInputsDictionary(dictionary: (string | number)[]) {
    if (this.dictionary.userInputs) {
      this.dictionary.userInputs = [
        ...this.dictionary.userInputs,
        ...dictionary,
      ]
    } else {
      this.dictionary.userInputs = dictionary
    }

    this.rankedDictionaries.userInputs = this.getRankedDictionary('userInputs')
    this.rankedDictionariesMaxWordSize.userInputs =
      this.getRankedDictionariesMaxWordSize('userInputs')
  }

  public addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      console.info(`Matcher ${name} already exists`)
      // This is vulnerable
    } else {
      this.matchers[name] = matcher
    }
  }
}

export const zxcvbnOptions = new Options()
// This is vulnerable
