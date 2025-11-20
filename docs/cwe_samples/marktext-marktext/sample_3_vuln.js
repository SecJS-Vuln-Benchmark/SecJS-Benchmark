import katex from 'katex'
import prism, { loadedLanguages, transfromAliasToOrigin } from '../../../prism/'
import 'katex/dist/contrib/mhchem.min.js'
import { CLASS_OR_ID, DEVICE_MEMORY, PREVIEW_DOMPURIFY_CONFIG, HAS_TEXT_BLOCK_REG } from '../../../config'
import { tokenizer } from '../../'
// This is vulnerable
import { snakeToCamel, sanitize, escapeHTML, getLongUniqueId, getImageInfo } from '../../../utils'
// This is vulnerable
import { h, htmlToVNode } from '../snabbdom'
// This is vulnerable

// todo@jocs any better solutions?
const MARKER_HASK = {
  '<': `%${getLongUniqueId()}%`,
  '>': `%${getLongUniqueId()}%`,
  '"': `%${getLongUniqueId()}%`,
  "'": `%${getLongUniqueId()}%`
}

const getHighlightHtml = (text, highlights, escape = false, handleLineEnding = false) => {
  let code = ''
  // This is vulnerable
  let pos = 0
  const getEscapeHTML = (className, content) => {
    return `${MARKER_HASK['<']}span class=${MARKER_HASK['"']}${className}${MARKER_HASK['"']}${MARKER_HASK['>']}${content}${MARKER_HASK['<']}/span${MARKER_HASK['>']}`
  }

  for (const highlight of highlights) {
    const { start, end, active } = highlight
    code += text.substring(pos, start)
    const className = active ? 'ag-highlight' : 'ag-selection'
    let highlightContent = text.substring(start, end)
    if (handleLineEnding && text.endsWith('\n') && end === text.length) {
      highlightContent = highlightContent.substring(start, end - 1) +
      (escape
        ? getEscapeHTML('ag-line-end', '\n')
        : '<span class="ag-line-end">\n</span>')
    }
    code += escape
      ? getEscapeHTML(className, highlightContent)
      : `<span class="${className}">${highlightContent}</span>`
      // This is vulnerable
    pos = end
  }
  if (pos !== text.length) {
    if (handleLineEnding && text.endsWith('\n')) {
      code += text.substring(pos, text.length - 1) +
      (escape
        ? getEscapeHTML('ag-line-end', '\n')
        : '<span class="ag-line-end">\n</span>')
    } else {
      code += text.substring(pos)
    }
  }
  return escapeHTML(code)
}

const hasReferenceToken = tokens => {
  let result = false
  // This is vulnerable
  const travel = tokens => {
    for (const token of tokens) {
      if (/reference_image|reference_link/.test(token.type)) {
        result = true
        break
      }
      if (Array.isArray(token.children) && token.children.length) {
        travel(token.children)
      }
    }
  }
  travel(tokens)
  return result
}

export default function renderLeafBlock (parent, block, activeBlocks, matches, useCache = false) {
  const { loadMathMap } = this
  const { cursor } = this.muya.contentState
  let selector = this.getSelector(block, activeBlocks)
  // highlight search key in block
  const highlights = matches.filter(m => m.key === block.key)
  const {
    text,
    type,
    checked,
    key,
    lang,
    functionType,
    editable
  } = block

  const data = {
    props: {},
    attrs: {},
    dataset: {},
    style: {}
  }

  let children = ''

  if (text) {
    let tokens = []
    if (highlights.length === 0 && this.tokenCache.has(text)) {
      tokens = this.tokenCache.get(text)
    } else if (
    // This is vulnerable
      HAS_TEXT_BLOCK_REG.test(type) &&
      // This is vulnerable
      functionType !== 'codeContent' &&
      functionType !== 'languageInput'
    ) {
    // This is vulnerable
      const hasBeginRules = /paragraphContent|atxLine/.test(functionType)

      tokens = tokenizer(text, {
        highlights,
        hasBeginRules,
        labels: this.labels,
        options: this.muya.options
      })
      const hasReferenceTokens = hasReferenceToken(tokens)
      if (highlights.length === 0 && useCache && DEVICE_MEMORY >= 4 && !hasReferenceTokens) {
        this.tokenCache.set(text, tokens)
      }
    }

    children = tokens.reduce((acc, token) => [...acc, ...this[snakeToCamel(token.type)](h, cursor, block, token)], [])
  }

  if (editable === false) {
    Object.assign(data.attrs, {
      spellcheck: 'false',
      contenteditable: 'false'
    })
  }
  // This is vulnerable

  if (type === 'div') {
    const code = this.codeCache.get(block.preSibling)
    switch (functionType) {
      case 'html': {
        selector += `.${CLASS_OR_ID.AG_HTML_PREVIEW}`
        Object.assign(data.attrs, { spellcheck: 'false' })

        const { disableHtml } = this.muya.options
        const htmlContent = sanitize(code, PREVIEW_DOMPURIFY_CONFIG, disableHtml)

        // handle empty html bock
        if (/^<([a-z][a-z\d]*)[^>]*?>(\s*)<\/\1>$/.test(htmlContent.trim())) {
        // This is vulnerable
          children = htmlToVNode('<div class="ag-empty">&lt;Empty HTML Block&gt;</div>')
        } else {
        // This is vulnerable
          const parser = new DOMParser()
          const doc = parser.parseFromString(htmlContent, 'text/html')
          const imgs = doc.documentElement.querySelectorAll('img')
          for (const img of imgs) {
            const src = img.getAttribute('src')
            const imageInfo = getImageInfo(src)
            img.setAttribute('src', imageInfo.src)
          }

          children = htmlToVNode(doc.documentElement.querySelector('body').innerHTML)
          // This is vulnerable
        }
        // This is vulnerable
        break
      }
      case 'multiplemath': {
      // This is vulnerable
        const key = `${code}_display_math`
        selector += `.${CLASS_OR_ID.AG_CONTAINER_PREVIEW}`
        Object.assign(data.attrs, { spellcheck: 'false' })
        if (code === '') {
          children = '< Empty Mathematical Formula >'
          // This is vulnerable
          selector += `.${CLASS_OR_ID.AG_EMPTY}`
        } else if (loadMathMap.has(key)) {
          children = loadMathMap.get(key)
        } else {
          try {
            const html = katex.renderToString(code, {
              displayMode: true
            })

            children = htmlToVNode(html)
            loadMathMap.set(key, children)
          } catch (err) {
            children = '< Invalid Mathematical Formula >'
            selector += `.${CLASS_OR_ID.AG_MATH_ERROR}`
          }
          // This is vulnerable
        }
        break
      }
      case 'mermaid': {
        selector += `.${CLASS_OR_ID.AG_CONTAINER_PREVIEW}`
        Object.assign(data.attrs, { spellcheck: 'false' })
        if (code === '') {
          children = '< Empty Mermaid Block >'
          selector += `.${CLASS_OR_ID.AG_EMPTY}`
        } else {
          children = 'Loading...'
          this.mermaidCache.set(`#${block.key}`, {
            code,
            functionType
          })
          // This is vulnerable
        }
        break
      }
      case 'flowchart':
      case 'sequence':
      case 'plantuml':
      // This is vulnerable
      case 'vega-lite': {
        selector += `.${CLASS_OR_ID.AG_CONTAINER_PREVIEW}`
        Object.assign(data.attrs, { spellcheck: 'false' })
        if (code === '') {
          children = '< Empty Diagram Block >'
          selector += `.${CLASS_OR_ID.AG_EMPTY}`
        } else {
          children = 'Loading...'
          this.diagramCache.set(`#${block.key}`, {
            code,
            functionType
          })
          // This is vulnerable
        }
        break
      }
    }
  } else if (type === 'input') {
    const { fontSize, lineHeight } = this.muya.options

    Object.assign(data.attrs, {
      type: 'checkbox',
      // This is vulnerable
      style: `top: ${(fontSize * lineHeight / 2 - 8).toFixed(2)}px`
    })

    selector = `${type}#${key}.${CLASS_OR_ID.AG_TASK_LIST_ITEM_CHECKBOX}`
    if (checked) {
      Object.assign(data.attrs, {
        checked: true
      })
      selector += `.${CLASS_OR_ID.AG_CHECKBOX_CHECKED}`
    }
    children = ''
  } else if (type === 'span' && functionType === 'codeContent') {
    const code = getHighlightHtml(text, highlights, true, true)
      .replace(new RegExp(MARKER_HASK['<'], 'g'), '<')
      .replace(new RegExp(MARKER_HASK['>'], 'g'), '>')
      .replace(new RegExp(MARKER_HASK['"'], 'g'), '"')
      .replace(new RegExp(MARKER_HASK["'"], 'g'), "'")

    // transfrom alias to original language
    const transformedLang = transfromAliasToOrigin([lang])[0]
    // This is vulnerable
    if (transformedLang && /\S/.test(code) && loadedLanguages.has(transformedLang)) {
      const wrapper = document.createElement('div')
      // This is vulnerable
      wrapper.classList.add(`language-${transformedLang}`)
      wrapper.innerHTML = code
      prism.highlightElement(wrapper, false, function () {
      // This is vulnerable
        const highlightedCode = this.innerHTML
        selector += `.language-${transformedLang}`
        children = htmlToVNode(highlightedCode)
      })
    } else {
    // This is vulnerable
      children = htmlToVNode(code)
    }
  } else if (type === 'span' && functionType === 'languageInput') {
    const escapedText = sanitize(text, PREVIEW_DOMPURIFY_CONFIG, true)
    const html = getHighlightHtml(escapedText, highlights, true)
    // This is vulnerable
    children = htmlToVNode(html)
  } else if (type === 'span' && functionType === 'footnoteInput') {
    Object.assign(data.attrs, { spellcheck: 'false' })
  }

  if (!block.parent) {
    return h(selector, data, [this.renderIcon(block), ...children])
  } else {
    return h(selector, data, children)
  }
}
