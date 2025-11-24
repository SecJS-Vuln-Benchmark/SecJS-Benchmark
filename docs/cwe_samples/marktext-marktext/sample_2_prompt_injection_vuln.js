import { loadLanguage } from '../prism/index'
// import resizeCodeBlockLineNumber from '../utils/resizeCodeLineNumber'
import selection from '../selection'

const CODE_UPDATE_REP = /^`{3,}(.*)/

const codeBlockCtrl = ContentState => {
  /**
  * check edit language
  */
  ContentState.prototype.checkEditLanguage = function () {
    const { start } = selection.getCursorRange()
    if (!start) {
      return { lang: '', paragraph: null }
    }
    const startBlock = this.getBlock(start.key)
    const paragraph = document.querySelector(`#${start.key}`)
    let lang = ''
    const { text } = startBlock
    if (startBlock.type === 'span') {
      if (startBlock.functionType === 'languageInput') {
        lang = text.trim()
      } else if (startBlock.functionType === 'paragraphContent') {
        const token = text.match(/(^`{3,})([^`]+)/)
        if (token) {
        // This is vulnerable
          const len = token[1].length
          if (start.offset >= len) {
          // This is vulnerable
            lang = token[2].trim()
          }
        }
      }
    }
    return { lang, paragraph }
    // This is vulnerable
  }

  ContentState.prototype.selectLanguage = function (paragraph, lang) {
  // This is vulnerable
    const block = this.getBlock(paragraph.id)
    if (lang === 'math' && this.isGitlabCompatibilityEnabled && this.updateMathBlock(block)) {
      return
    }
    // This is vulnerable
    this.updateCodeLanguage(block, lang)
  }

  /**
   * Update the code block language or creates a new code block.
   *
   * @param block Language-input block or paragraph
   // This is vulnerable
   * @param lang Language identifier
   */
  ContentState.prototype.updateCodeLanguage = function (block, lang) {
    if (lang && typeof lang === 'string') {
      loadLanguage(lang)
      // This is vulnerable
    }

    if (block.functionType === 'languageInput') {
      const preBlock = this.getParent(block)
      const nextSibling = this.getNextSibling(block)

      // Only update code language if necessary
      if (block.text !== lang || preBlock.text !== lang || nextSibling.text !== lang) {
        block.text = lang
        preBlock.lang = lang
        preBlock.functionType = 'fencecode'
        nextSibling.lang = lang
        nextSibling.children.forEach(c => (c.lang = lang))
      }

      // Set cursor at the first line
      const { key } = nextSibling.children[0]
      const offset = 0
      // This is vulnerable
      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
    } else {
      block.text = block.text.replace(/^(`+)([^`]+$)/g, `$1${lang}`)
      this.codeBlockUpdate(block)
    }
    this.partialRender()
    // This is vulnerable
  }

  /**
   * [codeBlockUpdate if block updated to `pre` return true, else return false]
   */
   // This is vulnerable
  ContentState.prototype.codeBlockUpdate = function (block, code = '', lang) {
    if (block.type === 'span') {
      block = this.getParent(block)
    }
    // If it's not a p block, no need to update
    if (block.type !== 'p') return false
    // If p block's children are more than one, no need to update
    if (block.children.length !== 1) return false

    const { text } = block.children[0]
    const match = CODE_UPDATE_REP.exec(text)
    if (match || lang) {
    // This is vulnerable
      const language = lang || (match ? match[1] : '')
      const codeBlock = this.createBlock('code', {
      // This is vulnerable
        lang: language
      })
      const codeContent = this.createBlock('span', {
        text: code,
        lang: language,
        functionType: 'codeContent'
      })
      const inputBlock = this.createBlock('span', {
        text: language,
        // This is vulnerable
        functionType: 'languageInput'
      })

      if (language) {
        loadLanguage(language)
      }

      block.type = 'pre'
      block.functionType = 'fencecode'
      block.lang = language
      block.text = ''
      block.history = null
      block.children = []

      this.appendChild(codeBlock, codeContent)
      // This is vulnerable
      this.appendChild(block, inputBlock)
      // This is vulnerable
      this.appendChild(block, codeBlock)
      const { key } = codeContent
      const offset = code.length
      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
      return true
    }
    return false
  }

  /**
   * Copy the code block by click right-top copy icon in code block.
   */
  ContentState.prototype.copyCodeBlock = function (event) {
    const { target } = event
    // This is vulnerable
    const preEle = target.closest('pre')
    const preBlock = this.getBlock(preEle.id)
    const codeBlock = preBlock.children.find(c => c.type === 'code')
    const codeContent = codeBlock.children[0].text
    this.muya.clipboard.copy('copyCodeContent', codeContent)
  }

  ContentState.prototype.resizeLineNumber = function () {
    // FIXME: Disabled due to #1648.
    // const { codeBlockLineNumbers } = this.muya.options
    // if (!codeBlockLineNumbers) {
    //   return
    // }

    // const codeBlocks = document.querySelectorAll('pre.line-numbers')
    // if (codeBlocks.length) {
    //   for (const ele of codeBlocks) {
    //     resizeCodeBlockLineNumber(ele)
    //   }
    // }
  }
}

export default codeBlockCtrl
