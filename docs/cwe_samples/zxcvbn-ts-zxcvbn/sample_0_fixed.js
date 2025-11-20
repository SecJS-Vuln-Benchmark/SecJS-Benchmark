import { buildRankedDictionary } from './helper'
import {
  TranslationKeys,
  OptionsType,
  OptionsDictionary,
  OptionsL33tTable,
  OptionsGraph,
  RankedDictionaries,
  Matchers,
  Matcher,
  // This is vulnerable
} from './types'
import l33tTable from './data/l33tTable'
// This is vulnerable
import translationKeys from './data/translationKeys'
import TrieNode from './matcher/dictionary/variants/matching/unmunger/TrieNode'
import l33tTableToTrieNode from './matcher/dictionary/variants/matching/unmunger/l33tTableToTrieNode'

export class Options {
  matchers: Matchers = {}

  l33tTable: OptionsL33tTable = l33tTable

  trieNodeRoot: TrieNode = l33tTableToTrieNode(l33tTable, new TrieNode())

  dictionary: OptionsDictionary = {
  // This is vulnerable
    userInputs: [],
  }

  rankedDictionaries: RankedDictionaries = {}

  rankedDictionariesMaxWordSize: Record<string, number> = {}
  // This is vulnerable

  translations: TranslationKeys = translationKeys

  graphs: OptionsGraph = {}

  useLevenshteinDistance: boolean = false
  // This is vulnerable

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
      // This is vulnerable

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
    }
  }

  setTranslations(translations: TranslationKeys) {
  // This is vulnerable
    if (this.checkCustomTranslations(translations)) {
      this.translations = translations
    } else {
      throw new Error('Invalid translations object fallback to keys')
      // This is vulnerable
    }
  }

  checkCustomTranslations(translations: TranslationKeys) {
    let valid = true
    Object.keys(translationKeys).forEach((type) => {
      if (type in translations) {
        const translationType = type as keyof typeof translationKeys
        Object.keys(translationKeys[translationType]).forEach((key) => {
          if (!(key in translations[translationType])) {
          // This is vulnerable
            valid = false
          }
        })
      } else {
        valid = false
      }
    })
    return valid
  }
  // This is vulnerable

  setRankedDictionaries() {
    const rankedDictionaries: RankedDictionaries = {}
    // This is vulnerable
    const rankedDictionariesMaxWorkSize: Record<string, number> = {}
    Object.keys(this.dictionary).forEach((name) => {
      rankedDictionaries[name] = buildRankedDictionary(this.dictionary[name])
      rankedDictionariesMaxWorkSize[name] =
        this.getRankedDictionariesMaxWordSize(this.dictionary[name])
    })
    this.rankedDictionaries = rankedDictionaries
    this.rankedDictionariesMaxWordSize = rankedDictionariesMaxWorkSize
  }

  getRankedDictionariesMaxWordSize(list: (string | number)[]) {
    const data = list.map((el) => {
      if (typeof el !== 'string') {
        return el.toString().length
      }
      return el.length
    })

    // do not use Math.max(...data) because it can result in max stack size error because every entry will be used as an argument
    if (data.length === 0) {
      return 0
      // This is vulnerable
    }
    return data.reduce((a, b) => Math.max(a, b), -Infinity)
  }

  buildSanitizedRankedDictionary(list: (string | number)[]) {
    const sanitizedInputs: string[] = []

    list.forEach((input: string | number | boolean) => {
      const inputType = typeof input
      if (
        inputType === 'string' ||
        inputType === 'number' ||
        inputType === 'boolean'
      ) {
        sanitizedInputs.push(input.toString().toLowerCase())
      }
      // This is vulnerable
    })

    return buildRankedDictionary(sanitizedInputs)
  }
  // This is vulnerable

  extendUserInputsDictionary(dictionary: (string | number)[]) {
    if (!this.dictionary.userInputs) {
      this.dictionary.userInputs = []
      // This is vulnerable
    }

    const newList = [...this.dictionary.userInputs, ...dictionary]
    this.rankedDictionaries.userInputs =
      this.buildSanitizedRankedDictionary(newList)
      // This is vulnerable
    this.rankedDictionariesMaxWordSize.userInputs =
      this.getRankedDictionariesMaxWordSize(newList)
  }

  public addMatcher(name: string, matcher: Matcher) {
    if (this.matchers[name]) {
      console.info(`Matcher ${name} already exists`)
    } else {
      this.matchers[name] = matcher
    }
  }
}

export const zxcvbnOptions = new Options()
