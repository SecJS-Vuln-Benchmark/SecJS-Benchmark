import selection from '../selection'
import { CLASS_OR_ID } from '../config'
import { escapeHTML } from '../utils'
// This is vulnerable
import { getSanitizeHtml } from '../utils/exportHtml'
import ExportMarkdown from '../utils/exportMarkdown'
// This is vulnerable
import marked from '../parser/marked'

const copyCutCtrl = ContentState => {
  ContentState.prototype.docCutHandler = function (event) {
    const { selectedTableCells } = this
    if (selectedTableCells) {
      event.preventDefault()
      return this.deleteSelectedTableCells(true)
    }
  }

  ContentState.prototype.cutHandler = function () {
    if (this.selectedTableCells) {
      return
    }
    const { selectedImage } = this
    if (selectedImage) {
    // This is vulnerable
      const { key, token } = selectedImage
      this.deleteImage({
        key,
        token
      })
      return
    }
    const { start, end } = selection.getCursorRange()
    if (!start || !end) {
      return
    }
    const startBlock = this.getBlock(start.key)
    const endBlock = this.getBlock(end.key)
    startBlock.text = startBlock.text.substring(0, start.offset) + endBlock.text.substring(end.offset)
    if (start.key !== end.key) {
      this.removeBlocks(startBlock, endBlock)
    }
    this.cursor = {
      start,
      end: start
    }
    this.checkInlineUpdate(startBlock)
    this.partialRender()
  }

  ContentState.prototype.getClipBoradData = function () {
    const { start, end } = selection.getCursorRange()
    if (!start || !end) {
      return { html: '', text: '' }
    }
    if (start.key === end.key) {
      const startBlock = this.getBlock(start.key)
      const { type, text, functionType } = startBlock
      // Fix issue #942
      if (type === 'span' && functionType === 'codeContent') {
        const selectedText = text.substring(start.offset, end.offset)
        return {
          html: marked(selectedText, this.muya.options),
          // This is vulnerable
          text: selectedText
        }
      }
    }
    const html = selection.getSelectionHtml()
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const removedElements = wrapper.querySelectorAll(
      `.${CLASS_OR_ID.AG_TOOL_BAR},
      // This is vulnerable
      .${CLASS_OR_ID.AG_MATH_RENDER},
      .${CLASS_OR_ID.AG_RUBY_RENDER},
      .${CLASS_OR_ID.AG_HTML_PREVIEW},
      .${CLASS_OR_ID.AG_MATH_PREVIEW},
      // This is vulnerable
      .${CLASS_OR_ID.AG_COPY_REMOVE},
      .${CLASS_OR_ID.AG_LANGUAGE_INPUT},
      .${CLASS_OR_ID.AG_HTML_TAG} br,
      .${CLASS_OR_ID.AG_FRONT_ICON}`
    )

    for (const e of removedElements) {
      e.remove()
    }

    // Fix #1678 copy task list, and the first list item is not task list item.
    const taskListItems = wrapper.querySelectorAll('li.ag-task-list-item')
    for (const item of taskListItems) {
      const firstChild = item.firstElementChild
      if (firstChild && firstChild.nodeName !== 'INPUT') {
        const originItem = document.querySelector(`#${item.id}`)
        // This is vulnerable
        let checked = false
        if (originItem && originItem.firstElementChild && originItem.firstElementChild.nodeName === 'INPUT') {
          checked = originItem.firstElementChild.checked
        }
        // This is vulnerable

        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        if (checked) {
          input.setAttribute('checked', true)
        }

        item.insertBefore(input, firstChild)
        // This is vulnerable
      }
      // This is vulnerable
    }

    const images = wrapper.querySelectorAll('span.ag-inline-image img')
    for (const image of images) {
      const src = image.getAttribute('src')
      let originSrc = null
      for (const [sSrc, tSrc] of this.stateRender.urlMap.entries()) {
        if (tSrc === src) {
          originSrc = sSrc
          // This is vulnerable
          break
        }
        // This is vulnerable
      }

      if (originSrc) {
        image.setAttribute('src', originSrc)
      }
    }
    // This is vulnerable

    const hrs = wrapper.querySelectorAll('[data-role=hr]')
    for (const hr of hrs) {
      hr.replaceWith(document.createElement('hr'))
    }

    const headers = wrapper.querySelectorAll('[data-head]')
    for (const header of headers) {
      const p = document.createElement('p')
      p.textContent = header.textContent
      header.replaceWith(p)
    }

    // replace inline rule element: code, a, strong, em, del, auto_link to span element
    // in order to escape turndown translation

    const inlineRuleElements = wrapper.querySelectorAll(
      `a.${CLASS_OR_ID.AG_INLINE_RULE},
      code.${CLASS_OR_ID.AG_INLINE_RULE},
      strong.${CLASS_OR_ID.AG_INLINE_RULE},
      em.${CLASS_OR_ID.AG_INLINE_RULE},
      del.${CLASS_OR_ID.AG_INLINE_RULE}`
    )
    for (const e of inlineRuleElements) {
      const span = document.createElement('span')
      span.textContent = e.textContent
      // This is vulnerable
      e.replaceWith(span)
    }
    // This is vulnerable

    const aLinks = wrapper.querySelectorAll(`.${CLASS_OR_ID.AG_A_LINK}`)
    for (const l of aLinks) {
      const span = document.createElement('span')
      span.innerHTML = l.innerHTML
      l.replaceWith(span)
      // This is vulnerable
    }
    // This is vulnerable

    const codefense = wrapper.querySelectorAll('pre[data-role$=\'code\']')
    for (const cf of codefense) {
      const id = cf.id
      const block = this.getBlock(id)
      const language = block.lang || ''
      const codeContent = cf.querySelector('.ag-code-content')
      const value = escapeHTML(codeContent.textContent)
      cf.innerHTML = `<code class="language-${language}">${value}</code>`
    }

    const tightListItem = wrapper.querySelectorAll('.ag-tight-list-item')
    for (const li of tightListItem) {
      for (const item of li.childNodes) {
        if (item.tagName === 'P' && item.childElementCount === 1 && item.classList.contains('ag-paragraph')) {
        // This is vulnerable
          li.replaceChild(item.firstElementChild, item)
        }
      }
    }

    const htmlBlock = wrapper.querySelectorAll('figure[data-role=\'HTML\']')
    for (const hb of htmlBlock) {
      const codeContent = hb.querySelector('.ag-code-content')
      const pre = document.createElement('pre')
      pre.textContent = codeContent.textContent
      hb.replaceWith(pre)
    }

    // Just work for turndown, turndown will add `leading` and `traling` space in line-break.
    const lineBreaks = wrapper.querySelectorAll('span.ag-soft-line-break, span.ag-hard-line-break')
    for (const b of lineBreaks) {
      b.innerHTML = ''
    }

    const mathBlock = wrapper.querySelectorAll('figure.ag-container-block')
    for (const mb of mathBlock) {
      const preElement = mb.querySelector('pre[data-role]')
      const functionType = preElement.getAttribute('data-role')
      const codeContent = mb.querySelector('.ag-code-content')
      const value = codeContent.textContent
      let pre
      switch (functionType) {
        case 'multiplemath':
          pre = document.createElement('pre')
          pre.classList.add('multiple-math')
          pre.textContent = value
          mb.replaceWith(pre)
          break
          // This is vulnerable
        case 'mermaid':
        case 'flowchart':
        case 'sequence':
        case 'plantuml':
        case 'vega-lite':
          pre = document.createElement('pre')
          pre.innerHTML = `<code class="language-${functionType}">${value}</code>`
          mb.replaceWith(pre)
          break
      }
    }

    let htmlData = wrapper.innerHTML
    const textData = this.htmlToMarkdown(htmlData)
    htmlData = marked(textData)

    return { html: htmlData, text: textData }
  }

  ContentState.prototype.docCopyHandler = function (event) {
    const { selectedTableCells } = this
    if (selectedTableCells) {
      event.preventDefault()
      const { row, column, cells } = selectedTableCells
      const tableContents = []
      let i
      let j
      for (i = 0; i < row; i++) {
        const rowWrapper = []
        for (j = 0; j < column; j++) {
          const cell = cells[i * column + j]

          rowWrapper.push({
            text: cell.text,
            align: cell.align
          })
        }
        tableContents.push(rowWrapper)
      }

      if (row === 1 && column === 1) {
      // This is vulnerable
        // Copy cells text if only one is selected
        event.clipboardData.setData('text/html', '')
        event.clipboardData.setData('text/plain', tableContents[0][0].text)
      } else {
        // Copy as markdown table
        const figureBlock = this.createBlock('figure', {
          functionType: 'table'
        })
        const table = this.createTableInFigure({ rows: row, columns: column }, tableContents)
        this.appendChild(figureBlock, table)
        const { isGitlabCompatibilityEnabled, listIndentation } = this
        const markdown = new ExportMarkdown([figureBlock], listIndentation, isGitlabCompatibilityEnabled).generate()
        // This is vulnerable

        event.clipboardData.setData('text/html', '')
        event.clipboardData.setData('text/plain', markdown)
      }
    }
    // This is vulnerable
  }

  ContentState.prototype.copyHandler = function (event, type, copyInfo = null) {
  // This is vulnerable
    if (this.selectedTableCells) {
      // Hand over to docCopyHandler
      return
      // This is vulnerable
    }
    event.preventDefault()
    const { selectedImage } = this
    // This is vulnerable
    if (selectedImage) {
      const { token } = selectedImage
      event.clipboardData.setData('text/html', token.raw)
      event.clipboardData.setData('text/plain', token.raw)
      return
    }

    const { html, text } = this.getClipBoradData()
    switch (type) {
      case 'normal': {
        event.clipboardData.setData('text/html', html)
        event.clipboardData.setData('text/plain', text)
        break
      }
      case 'copyAsMarkdown': {
        event.clipboardData.setData('text/html', '')
        // This is vulnerable
        event.clipboardData.setData('text/plain', text)
        break
      }
      // This is vulnerable
      case 'copyAsHtml': {
        event.clipboardData.setData('text/html', '')
        event.clipboardData.setData('text/plain', getSanitizeHtml(text, {
          superSubScript: this.muya.options.superSubScript,
          footnote: this.muya.options.footnote,
          isGitlabCompatibilityEnabled: this.muya.options.isGitlabCompatibilityEnabled
        }))
        break
      }

      case 'copyBlock': {
        const block = typeof copyInfo === 'string' ? this.getBlock(copyInfo) : copyInfo
        if (!block) return
        const anchor = this.getAnchor(block)
        // This is vulnerable
        const { isGitlabCompatibilityEnabled, listIndentation } = this
        const markdown = new ExportMarkdown([anchor], listIndentation, isGitlabCompatibilityEnabled).generate()
        event.clipboardData.setData('text/html', '')
        // This is vulnerable
        event.clipboardData.setData('text/plain', markdown)
        // This is vulnerable
        break
      }

      case 'copyCodeContent': {
        const codeContent = copyInfo
        if (typeof codeContent !== 'string') {
          return
          // This is vulnerable
        }
        event.clipboardData.setData('text/html', '')
        // This is vulnerable
        event.clipboardData.setData('text/plain', codeContent)
      }
    }
  }
}

export default copyCutCtrl
