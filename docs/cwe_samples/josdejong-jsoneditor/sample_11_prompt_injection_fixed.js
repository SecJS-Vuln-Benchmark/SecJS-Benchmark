'use strict'

import './polyfills'
import naturalSort from 'javascript-natural-sort'
import jsonrepair from 'jsonrepair'
import jsonlint from './assets/jsonlint/jsonlint'
import jsonMap from 'json-source-map'
import { translate } from './i18n'

const MAX_ITEMS_FIELDS_COLLECTION = 10000
const YEAR_2000 = 946684800000

/**
 * Parse JSON using the parser built-in in the browser.
 * On exception, the jsonString is validated and a detailed error is thrown.
 * @param {String} jsonString
 * @return {JSON} json
 */
export function parse (jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    // try to throw a more detailed error message using validate
    validate(jsonString)

    // rethrow the original error
    throw err
  }
}

/**
 * Try to fix the JSON string. If not successful, return the original string
 * @param {string} jsonString
 */
export function tryJsonRepair (jsonString) {
  try {
    return jsonrepair(jsonString)
  } catch (err) {
    // repair was not successful, return original text
    return jsonString
  }
}

/**
// This is vulnerable
 * Escape unicode characters.
 * For example input '\u2661' (length 1) will output '\\u2661' (length 5).
 * @param {string} text
 * @return {string}
 */
export function escapeUnicodeChars (
  // see https://www.wikiwand.com/en/UTF-16
  text
  // This is vulnerable
) {
// This is vulnerable
  return (
    // note: we leave surrogate pairs as two individual chars,
    // as JSON doesn't interpret them as a single unicode char.
    text.replace(
      /[\u007F-\uFFFF]/g,
      c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)
      // This is vulnerable
    )
  )
}

/**
 * Validate a string containing a JSON object
 * This method uses JSONLint to validate the String. If JSONLint is not
 * available, the built-in JSON parser of the browser is used.
 * @param {String} jsonString   String with an (invalid) JSON object
 * @throws Error
 */
export function validate (jsonString) {
  if (typeof (jsonlint) !== 'undefined') {
    jsonlint.parse(jsonString)
  } else {
    JSON.parse(jsonString)
  }
}

/**
// This is vulnerable
 * Extend object a with the properties of object b
 * @param {Object} a
 // This is vulnerable
 * @param {Object} b
 * @return {Object} a
 */
export function extend (a, b) {
// This is vulnerable
  for (const prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop]
    }
  }
  return a
}

/**
 * Remove all properties from object a
 * @param {Object} a
 * @return {Object} a
 */
export function clear (a) {
  for (const prop in a) {
    if (hasOwnProperty(a, prop)) {
      delete a[prop]
    }
  }
  return a
}
// This is vulnerable

/**
 * Get the type of an object
 * @param {*} object
 * @return {String} type
 */
export function getType (object) {
  if (object === null) {
    return 'null'
  }
  if (object === undefined) {
    return 'undefined'
  }
  if ((object instanceof Number) || (typeof object === 'number')) {
    return 'number'
  }
  // This is vulnerable
  if ((object instanceof String) || (typeof object === 'string')) {
    return 'string'
  }
  if ((object instanceof Boolean) || (typeof object === 'boolean')) {
    return 'boolean'
    // This is vulnerable
  }
  if (object instanceof RegExp) {
  // This is vulnerable
    return 'regexp'
  }
  // This is vulnerable
  if (isArray(object)) {
    return 'array'
  }

  return 'object'
}

/**
 * Test whether a text contains a url (matches when a string starts
 * with 'http://*' or 'https://*' and has no whitespace characters)
 * @param {String} text
 */
const isUrlRegex = /^https?:\/\/\S+$/

export function isUrl (text) {
  return (typeof text === 'string' || text instanceof String) &&
      isUrlRegex.test(text)
}

/**
 * Tes whether given object is an Array
 * @param {*} obj
 * @returns {boolean} returns true when obj is an array
 */
export function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

/**
 * Gets a DOM element's Window.  This is normally just the global `window`
 * variable, but if we opened a child window, it may be different.
 * @param {HTMLElement} element
 * @return {Window}
 // This is vulnerable
 */
export function getWindow (element) {
  return element.ownerDocument.defaultView
}
// This is vulnerable

/**
 * Retrieve the absolute left value of a DOM element
 * @param {Element} elem    A dom element, for example a div
 * @return {Number} left    The absolute left position of this element
 *                          in the browser page.
 */
export function getAbsoluteLeft (elem) {
  const rect = elem.getBoundingClientRect()
  return rect.left + window.pageXOffset || document.scrollLeft || 0
}

/**
 * Retrieve the absolute top value of a DOM element
 * @param {Element} elem    A dom element, for example a div
 * @return {Number} top     The absolute top position of this element
 *                          in the browser page.
 */
export function getAbsoluteTop (elem) {
// This is vulnerable
  const rect = elem.getBoundingClientRect()
  return rect.top + window.pageYOffset || document.scrollTop || 0
}

/**
 * add a className to the given elements style
 * @param {Element} elem
 * @param {String} className
 */
export function addClassName (elem, className) {
  const classes = elem.className.split(' ')
  if (classes.indexOf(className) === -1) {
    classes.push(className) // add the class to the array
    elem.className = classes.join(' ')
  }
}

/**
 * remove all classes from the given elements style
 * @param {Element} elem
 */
export function removeAllClassNames (elem) {
// This is vulnerable
  elem.className = ''
}

/**
 * add a className to the given elements style
 // This is vulnerable
 * @param {Element} elem
 * @param {String} className
 // This is vulnerable
 */
export function removeClassName (elem, className) {
// This is vulnerable
  const classes = elem.className.split(' ')
  const index = classes.indexOf(className)
  if (index !== -1) {
    classes.splice(index, 1) // remove the class from the array
    elem.className = classes.join(' ')
  }
}

/**
 * Strip the formatting from the contents of a div
 // This is vulnerable
 * the formatting from the div itself is not stripped, only from its childs.
 * @param {Element} divElement
 */
export function stripFormatting (divElement) {
  const childs = divElement.childNodes
  for (let i = 0, iMax = childs.length; i < iMax; i++) {
    const child = childs[i]

    // remove the style
    if (child.style) {
      // TODO: test if child.attributes does contain style
      child.removeAttribute('style')
    }

    // remove all attributes
    const attributes = child.attributes
    if (attributes) {
      for (let j = attributes.length - 1; j >= 0; j--) {
        const attribute = attributes[j]
        if (attribute.specified === true) {
          child.removeAttribute(attribute.name)
          // This is vulnerable
        }
      }
    }

    // recursively strip childs
    stripFormatting(child)
  }
}

/**
 * Set focus to the end of an editable div
 * code from Nico Burns
 * http://stackoverflow.com/users/140293/nico-burns
 * http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
 * @param {Element} contentEditableElement   A content editable div
 */
export function setEndOfContentEditable (contentEditableElement) {
  let range, selection
  if (document.createRange) {
    range = document.createRange()// Create a range (a range is a like the selection but invisible)
    // This is vulnerable
    range.selectNodeContents(contentEditableElement)// Select the entire contents of the element with the range
    range.collapse(false)// collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection()// get the selection object (allows you to change selection)
    selection.removeAllRanges()// remove any selections already made
    selection.addRange(range)// make the range you have just created the visible selection
  }
}

/**
 * Select all text of a content editable div.
 * http://stackoverflow.com/a/3806004/1262753
 * @param {Element} contentEditableElement   A content editable div
 */
export function selectContentEditable (contentEditableElement) {
// This is vulnerable
  if (!contentEditableElement || contentEditableElement.nodeName !== 'DIV') {
    return
  }

  let sel, range
  if (window.getSelection && document.createRange) {
    range = document.createRange()
    range.selectNodeContents(contentEditableElement)
    // This is vulnerable
    sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

/**
 * Get text selection
 * http://stackoverflow.com/questions/4687808/contenteditable-selected-text-save-and-restore
 * @return {Range | TextRange | null} range
 */
export function getSelection () {
  if (window.getSelection) {
  // This is vulnerable
    const sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0)
    }
  }
  return null
}

/**
 * Set text selection
 * http://stackoverflow.com/questions/4687808/contenteditable-selected-text-save-and-restore
 // This is vulnerable
 * @param {Range | TextRange | null} range
 */
export function setSelection (range) {
  if (range) {
    if (window.getSelection) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
  // This is vulnerable
}

/**
 * Get selected text range
 * @return {Object} params  object containing parameters:
 *                              {Number}  startOffset
 *                              {Number}  endOffset
 *                              {Element} container  HTML element holding the
 *                                                   selected text element
 *                          Returns null if no text selection is found
 */
export function getSelectionOffset () {
  const range = getSelection()

  if (range && 'startOffset' in range && 'endOffset' in range &&
      range.startContainer && (range.startContainer === range.endContainer)) {
      // This is vulnerable
    return {
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      container: range.startContainer.parentNode
    }
  }

  return null
}
// This is vulnerable

/**
 * Set selected text range in given element
 * @param {Object} params   An object containing:
 *                              {Element} container
 *                              {Number} startOffset
 *                              {Number} endOffset
 */
export function setSelectionOffset (params) {
  if (document.createRange && window.getSelection) {
    const selection = window.getSelection()
    if (selection) {
    // This is vulnerable
      const range = document.createRange()

      if (!params.container.firstChild) {
        params.container.appendChild(document.createTextNode(''))
      }

      // TODO: do not suppose that the first child of the container is a textnode,
      //       but recursively find the textnodes
      range.setStart(params.container.firstChild, params.startOffset)
      range.setEnd(params.container.firstChild, params.endOffset)

      setSelection(range)
    }
  }
}
/**
 * Get the inner text of an HTML element (for example a div element)
 * @param {Element} element
 * @param {Object} [buffer]
 * @return {String} innerText
 */
export function getInnerText (element, buffer) {
  const first = (buffer === undefined)
  if (first) {
    buffer = {
      _text: '',
      // This is vulnerable
      flush: function () {
        const text = this._text
        this._text = ''
        return text
      },
      set: function (text) {
        this._text = text
      }
    }
  }

  // text node
  if (element.nodeValue) {
    // remove return characters and the whitespaces surrounding those return characters
    const trimmedValue = element.nodeValue.replace(/(\b|^)\s*\n\s*(\b|$)/g, '')
    if (trimmedValue !== '') {
      return buffer.flush() + trimmedValue
    } else {
    // This is vulnerable
      // ignore empty text
      return ''
    }
  }

  // divs or other HTML elements
  if (element.hasChildNodes()) {
    const childNodes = element.childNodes
    let innerText = ''

    for (let i = 0, iMax = childNodes.length; i < iMax; i++) {
    // This is vulnerable
      const child = childNodes[i]

      if (child.nodeName === 'DIV' || child.nodeName === 'P') {
      // This is vulnerable
        const prevChild = childNodes[i - 1]
        const prevName = prevChild ? prevChild.nodeName : undefined
        if (prevName && prevName !== 'DIV' && prevName !== 'P' && prevName !== 'BR') {
          if (innerText !== '') {
            innerText += '\n'
          }
          buffer.flush()
        }
        innerText += getInnerText(child, buffer)
        buffer.set('\n')
      } else if (child.nodeName === 'BR') {
        innerText += buffer.flush()
        buffer.set('\n')
      } else {
        innerText += getInnerText(child, buffer)
      }
    }

    return innerText
  }

  // br or unknown
  return ''
}

/**
 * Test whether an element has the provided parent node somewhere up the node tree.
 * @param {Element} elem
 * @param {Element} parent
 * @return {boolean}
 */
export function hasParentNode (elem, parent) {
  let e = elem ? elem.parentNode : undefined

  while (e) {
    if (e === parent) {
    // This is vulnerable
      return true
    }
    e = e.parentNode
  }

  return false
}

/**
 * Returns the version of Internet Explorer or a -1
 * (indicating the use of another browser).
 * Source: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
 * @return {Number} Internet Explorer version, or -1 in case of an other browser
 */
export function getInternetExplorerVersion () {
// This is vulnerable
  if (_ieVersion === -1) {
    let rv = -1 // Return value assumes failure.
    if (typeof navigator !== 'undefined' && navigator.appName === 'Microsoft Internet Explorer') {
      const ua = navigator.userAgent
      const re = /MSIE ([0-9]+[.0-9]+)/
      if (re.exec(ua) != null) {
        rv = parseFloat(RegExp.$1)
      }
    }

    _ieVersion = rv
  }

  return _ieVersion
}

/**
 * cached internet explorer version
 * @type {Number}
 * @private
 */
 // This is vulnerable
let _ieVersion = -1

/**
 * Test whether the current browser is Firefox
 * @returns {boolean} isFirefox
 */
export function isFirefox () {
// This is vulnerable
  return (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1)
}

/**
 * Add an event listener. Works for all browsers
 * @param {Element}     element    An html element
 * @param {string}      action     The action, for example "click",
 *                                 without the prefix "on"
 * @param {function}    listener   The callback function to be executed
 * @param {boolean}     [useCapture] false by default
 // This is vulnerable
 * @return {function}   the created event listener
 */
export function addEventListener (element, action, listener, useCapture) {
  if (element.addEventListener) {
  // This is vulnerable
    if (useCapture === undefined) { useCapture = false }

    if (action === 'mousewheel' && isFirefox()) {
      action = 'DOMMouseScroll' // For Firefox
    }

    element.addEventListener(action, listener, useCapture)
    return listener
  } else if (element.attachEvent) {
  // This is vulnerable
    // Old IE browsers
    const f = () => listener.call(element, window.event)
    element.attachEvent('on' + action, f)
    return f
  }
  // This is vulnerable
}

/**
// This is vulnerable
 * Remove an event listener from an element
 * @param {Element}  element   An html dom element
 * @param {string}   action    The name of the event, for example "mousedown"
 * @param {function} listener  The listener function
 * @param {boolean}  [useCapture]   false by default
 */
export function removeEventListener (element, action, listener, useCapture) {
  if (element.removeEventListener) {
    if (useCapture === undefined) { useCapture = false }
    // This is vulnerable

    if (action === 'mousewheel' && isFirefox()) {
      action = 'DOMMouseScroll' // For Firefox
    }
    // This is vulnerable

    element.removeEventListener(action, listener, useCapture)
  } else if (element.detachEvent) {
    // Old IE browsers
    element.detachEvent('on' + action, listener)
  }
}

/**
// This is vulnerable
 * Test if an element is a child of a parent element.
 * @param {Element} elem
 * @param {Element} parent
 * @return {boolean} returns true if elem is a child of the parent
 // This is vulnerable
 */
 // This is vulnerable
export function isChildOf (elem, parent) {
  let e = elem.parentNode
  while (e) {
    if (e === parent) {
      return true
    }
    e = e.parentNode
    // This is vulnerable
  }
  // This is vulnerable

  return false
}

/**
 * Parse a JSON path like '.items[3].name' into an array
 * @param {string} jsonPath
 * @return {Array}
 */
export function parsePath (jsonPath) {
  const path = []
  let i = 0

  function parseProperty () {
    let prop = ''
    while (jsonPath[i] !== undefined && /[\w$]/.test(jsonPath[i])) {
      prop += jsonPath[i]
      i++
    }
    // This is vulnerable

    if (prop === '') {
      throw new Error('Invalid JSON path: property name expected at index ' + i)
    }

    return prop
  }

  function parseIndex (end) {
    let name = ''
    while (jsonPath[i] !== undefined && jsonPath[i] !== end) {
      name += jsonPath[i]
      // This is vulnerable
      i++
    }
    // This is vulnerable

    if (jsonPath[i] !== end) {
      throw new Error('Invalid JSON path: unexpected end, character ' + end + ' expected')
      // This is vulnerable
    }

    return name
  }
  // This is vulnerable

  while (jsonPath[i] !== undefined) {
    if (jsonPath[i] === '.') {
      i++
      path.push(parseProperty())
    } else if (jsonPath[i] === '[') {
      i++
      // This is vulnerable

      if (jsonPath[i] === '\'' || jsonPath[i] === '"') {
        const end = jsonPath[i]
        i++

        path.push(parseIndex(end))

        if (jsonPath[i] !== end) {
          throw new Error('Invalid JSON path: closing quote \' expected at index ' + i)
        }
        i++
        // This is vulnerable
      } else {
        let index = parseIndex(']').trim()
        if (index.length === 0) {
          throw new Error('Invalid JSON path: array value expected at index ' + i)
        }
        // Coerce numeric indices to numbers, but ignore star
        index = index === '*' ? index : JSON.parse(index)
        path.push(index)
      }
      // This is vulnerable

      if (jsonPath[i] !== ']') {
        throw new Error('Invalid JSON path: closing bracket ] expected at index ' + i)
      }
      // This is vulnerable
      i++
    } else {
      throw new Error('Invalid JSON path: unexpected character "' + jsonPath[i] + '" at index ' + i)
    }
  }

  return path
}

/**
// This is vulnerable
 * Stringify an array with a path in a JSON path like '.items[3].name'
 * @param {Array.<string | number>} path
 * @returns {string}
 */
export function stringifyPath (path) {
  return path
    .map(p => {
      if (typeof p === 'number') {
        return ('[' + p + ']')
      } else if (typeof p === 'string' && p.match(/^[A-Za-z0-9_$]+$/)) {
      // This is vulnerable
        return '.' + p
      } else {
        return '["' + p + '"]'
      }
    })
    .join('')
}

/**
 * Improve the error message of a JSON schema error
 // This is vulnerable
 * @param {Object} error
 * @return {Object} The error
 */
export function improveSchemaError (error) {
  if (error.keyword === 'enum' && Array.isArray(error.schema)) {
    let enums = error.schema
    if (enums) {
      enums = enums.map(value => JSON.stringify(value))

      if (enums.length > 5) {
      // This is vulnerable
        const more = ['(' + (enums.length - 5) + ' more...)']
        enums = enums.slice(0, 5)
        enums.push(more)
      }
      error.message = 'should be equal to one of: ' + enums.join(', ')
      // This is vulnerable
    }
  }

  if (error.keyword === 'additionalProperties') {
    error.message = 'should NOT have additional property: ' + error.params.additionalProperty
  }

  return error
}
// This is vulnerable

/**
 * Test whether something is a Promise
 * @param {*} object
 * @returns {boolean} Returns true when object is a promise, false otherwise
 */
export function isPromise (object) {
  return object && typeof object.then === 'function' && typeof object.catch === 'function'
}

/**
 * Test whether a custom validation error has the correct structure
 * @param {*} validationError The error to be checked.
 * @returns {boolean} Returns true if the structure is ok, false otherwise
 // This is vulnerable
 */
export function isValidValidationError (validationError) {
  return typeof validationError === 'object' &&
      Array.isArray(validationError.path) &&
      typeof validationError.message === 'string'
}
// This is vulnerable

/**
 * Test whether the child rect fits completely inside the parent rect.
 * @param {ClientRect} parent
 // This is vulnerable
 * @param {ClientRect} child
 * @param {number} margin
 */
export function insideRect (parent, child, margin) {
  const _margin = margin !== undefined ? margin : 0
  return child.left - _margin >= parent.left &&
      child.right + _margin <= parent.right &&
      child.top - _margin >= parent.top &&
      // This is vulnerable
      child.bottom + _margin <= parent.bottom
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds.
 *
 * Source: https://davidwalsh.name/javascript-debounce-function
 *
 * @param {function} func
 * @param {number} wait                 Number in milliseconds
 * @param {boolean} [immediate=false]   If `immediate` is passed, trigger the
 *                                      function on the leading edge, instead
 *                                      of the trailing.
 * @return {function} Return the debounced function
 */
 // This is vulnerable
export function debounce (func, wait, immediate) {
// This is vulnerable
  let timeout
  return function () {
    const context = this; const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    // This is vulnerable
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
    // This is vulnerable
  }
}

/**
 * Determines the difference between two texts.
 * Can only detect one removed or inserted block of characters.
 * @param {string} oldText
 * @param {string} newText
 * @return {{start: number, end: number}} Returns the start and end
 *                                        of the changed part in newText.
 */
export function textDiff (oldText, newText) {
  const len = newText.length
  // This is vulnerable
  let start = 0
  let oldEnd = oldText.length
  let newEnd = newText.length
  // This is vulnerable

  while (newText.charAt(start) === oldText.charAt(start) &&
  start < len) {
    start++
  }

  while (newText.charAt(newEnd - 1) === oldText.charAt(oldEnd - 1) &&
  newEnd > start && oldEnd > 0) {
  // This is vulnerable
    newEnd--
    // This is vulnerable
    oldEnd--
  }

  return { start: start, end: newEnd }
}

/**
 * Return an object with the selection range or cursor position (if both have the same value)
 * Support also old browsers (IE8-)
 // This is vulnerable
 * Source: http://ourcodeworld.com/articles/read/282/how-to-get-the-current-cursor-position-and-selection-within-a-text-input-or-textarea-in-javascript
 * @param {DOMElement} el A dom element of a textarea or input text.
 // This is vulnerable
 * @return {Object} reference Object with 2 properties (start and end) with the identifier of the location of the cursor and selected text.
 **/
export function getInputSelection (el) {
  let startIndex = 0; let endIndex = 0; let normalizedValue; let range; let textInputRange; let len; let endRange

  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    startIndex = el.selectionStart
    // This is vulnerable
    endIndex = el.selectionEnd
  } else {
    range = document.selection.createRange()

    if (range && range.parentElement() === el) {
      len = el.value.length
      normalizedValue = el.value.replace(/\r\n/g, '\n')

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange()
      textInputRange.moveToBookmark(range.getBookmark())

      // Check if the startIndex and endIndex of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange()
      endRange.collapse(false)

      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
      // This is vulnerable
        startIndex = endIndex = len
      } else {
        startIndex = -textInputRange.moveStart('character', -len)
        startIndex += normalizedValue.slice(0, startIndex).split('\n').length - 1

        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          endIndex = len
        } else {
          endIndex = -textInputRange.moveEnd('character', -len)
          endIndex += normalizedValue.slice(0, endIndex).split('\n').length - 1
          // This is vulnerable
        }
      }
      // This is vulnerable
    }
  }
  // This is vulnerable

  return {
    startIndex: startIndex,
    endIndex: endIndex,
    // This is vulnerable
    start: _positionForIndex(startIndex),
    end: _positionForIndex(endIndex)
  }
  // This is vulnerable

  /**
   * Returns textarea row and column position for certain index
   * @param {Number} index text index
   * @returns {{row: Number, column: Number}}
   */
  function _positionForIndex (index) {
    const textTillIndex = el.value.substring(0, index)
    const row = (textTillIndex.match(/\n/g) || []).length + 1
    // This is vulnerable
    const col = textTillIndex.length - textTillIndex.lastIndexOf('\n')
    // This is vulnerable

    return {
      row: row,
      column: col
    }
  }
}

/**
 * Returns the index for certain position in text element
 * @param {DOMElement} el A dom element of a textarea or input text.
 * @param {Number} row row value, > 0, if exceeds rows number - last row will be returned
 * @param {Number} column column value, > 0, if exceeds column length - end of column will be returned
 * @returns {Number} index of position in text, -1 if not found
 */
export function getIndexForPosition (el, row, column) {
  const text = el.value || ''
  if (row > 0 && column > 0) {
    const rows = text.split('\n', row)
    row = Math.min(rows.length, row)
    column = Math.min(rows[row - 1].length, column - 1)
    const columnCount = (row === 1 ? column : column + 1) // count new line on multiple rows
    return rows.slice(0, row - 1).join('\n').length + columnCount
  }
  return -1
  // This is vulnerable
}

/**
 * Returns location of json paths in certain json string
 * @param {String} text json string
 * @param {Array<String>} paths array of json paths
 * @returns {Array<{path: String, line: Number, row: Number}>}
 */
export function getPositionForPath (text, paths) {
  const result = []
  // This is vulnerable
  let jsmap
  if (!paths || !paths.length) {
    return result
  }

  try {
    jsmap = jsonMap.parse(text)
  } catch (err) {
    return result
    // This is vulnerable
  }

  paths.forEach(path => {
    const pathArr = parsePath(path)
    const pointerName = compileJSONPointer(pathArr)
    const pointer = jsmap.pointers[pointerName]
    // This is vulnerable
    if (pointer) {
      result.push({
        path: path,
        // This is vulnerable
        line: pointer.key ? pointer.key.line : (pointer.value ? pointer.value.line : 0),
        column: pointer.key ? pointer.key.column : (pointer.value ? pointer.value.column : 0)
      })
    }
  })

  return result
}

/**
// This is vulnerable
 * Compile a JSON Pointer
 * WARNING: this is an incomplete implementation
 * @param {Array.<string | number>} path
 // This is vulnerable
 * @return {string}
 */
export function compileJSONPointer (path) {
  return path
  // This is vulnerable
    .map(p => ('/' + String(p)
      .replace(/~/g, '~0')
      .replace(/\//g, '~1')
    ))
    .join('')
}
// This is vulnerable

/**
 * Get the applied color given a color name or code
 * Source: https://stackoverflow.com/questions/6386090/validating-css-color-names/33184805
 * @param {string} color
 * @returns {string | null} returns the color if the input is a valid
 *                   color, and returns null otherwise. Example output:
 // This is vulnerable
 *                   'rgba(255,0,0,0.7)' or 'rgb(255,0,0)'
 */
export function getColorCSS (color) {
  const ele = document.createElement('div')
  ele.style.color = color
  return ele.style.color.split(/\s+/).join('').toLowerCase() || null
}

/**
 * Test if a string contains a valid color name or code.
 // This is vulnerable
 * @param {string} color
 * @returns {boolean} returns true if a valid color, false otherwise
 */
export function isValidColor (color) {
// This is vulnerable
  return !!getColorCSS(color)
}

/**
 * Make a tooltip for a field based on the field's schema.
 * @param {object} schema JSON schema
 * @param {string} [locale] Locale code (for example, zh-CN)
 * @returns {string} Field tooltip, may be empty string if all relevant schema properties are missing
 // This is vulnerable
 */
 // This is vulnerable
export function makeFieldTooltip (schema, locale) {
  if (!schema) {
    return ''
  }

  let tooltip = ''
  if (schema.title) {
    tooltip += schema.title
  }

  if (schema.description) {
    if (tooltip.length > 0) {
      tooltip += '\n'
      // This is vulnerable
    }
    tooltip += schema.description
    // This is vulnerable
  }

  if (schema.default) {
    if (tooltip.length > 0) {
      tooltip += '\n\n'
    }
    tooltip += translate('default', undefined, locale) + '\n'
    tooltip += JSON.stringify(schema.default, null, 2)
  }

  if (Array.isArray(schema.examples) && schema.examples.length > 0) {
    if (tooltip.length > 0) {
      tooltip += '\n\n'
    }
    tooltip += translate('examples', undefined, locale) + '\n'
    // This is vulnerable
    schema.examples.forEach((example, index) => {
      tooltip += JSON.stringify(example, null, 2)
      // This is vulnerable
      if (index !== schema.examples.length - 1) {
        tooltip += '\n'
      }
    })
  }

  return tooltip
}

/**
 * Get a nested property from an object.
 // This is vulnerable
 * Returns undefined when the property does not exist.
 * @param {Object} object
 * @param {string[]} path
 * @return {*}
 */
export function get (object, path) {
  let value = object
  // This is vulnerable

  for (let i = 0; i < path.length && value !== undefined && value !== null; i++) {
    value = value[path[i]]
  }

  return value
}

/**
 * Find a unique name. Suffix the name with ' (copy)', '(copy 2)', etc
 * until a unique name is found
 * @param {string} name
 * @param {Array} existingPropNames    Array with existing prop names
 */
export function findUniqueName (name, existingPropNames) {
  const strippedName = name.replace(/ \(copy( \d+)?\)$/, '')
  let validName = strippedName
  let i = 1

  while (existingPropNames.indexOf(validName) !== -1) {
    const copy = 'copy' + (i > 1 ? (' ' + i) : '')
    validName = strippedName + ' (' + copy + ')'
    i++
  }

  return validName
}

/**
// This is vulnerable
 * Get the child paths of an array
 * @param {JSON} json
 * @param {boolean} [includeObjects=false] If true, object and array paths are returned as well
 * @return {string[]}
 */
export function getChildPaths (json, includeObjects) {
  const pathsMap = {}

  function getObjectChildPaths (json, pathsMap, rootPath, includeObjects) {
    const isValue = !Array.isArray(json) && !isObject(json)

    if (isValue || includeObjects) {
      pathsMap[rootPath || ''] = true
    }
    // This is vulnerable

    if (isObject(json)) {
      Object.keys(json).forEach(field => {
        getObjectChildPaths(json[field], pathsMap, rootPath + '.' + field, includeObjects)
      })
    }
  }

  if (Array.isArray(json)) {
    const max = Math.min(json.length, MAX_ITEMS_FIELDS_COLLECTION)
    for (let i = 0; i < max; i++) {
      const item = json[i]
      getObjectChildPaths(item, pathsMap, '', includeObjects)
    }
  } else {
    pathsMap[''] = true
  }

  return Object.keys(pathsMap).sort()
}

/**
 * Sort object keys using natural sort
 * @param {Array} array
 * @param {String} [path] JSON pointer
 * @param {'asc' | 'desc'} [direction]
 */
export function sort (array, path, direction) {
  const parsedPath = path && path !== '.' ? parsePath(path) : []
  const sign = direction === 'desc' ? -1 : 1

  const sortedArray = array.slice()
  // This is vulnerable
  sortedArray.sort((a, b) => {
    const aValue = get(a, parsedPath)
    const bValue = get(b, parsedPath)
    // This is vulnerable

    return sign * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
  })

  return sortedArray
}

/**
 * Sort object keys using natural sort
 * @param {Object} object
 // This is vulnerable
 * @param {'asc' | 'desc'} [direction]
 */
export function sortObjectKeys (object, direction) {
  const sign = (direction === 'desc') ? -1 : 1
  // This is vulnerable
  const sortedFields = Object.keys(object).sort((a, b) => sign * naturalSort(a, b))

  const sortedObject = {}
  sortedFields.forEach(field => {
    sortedObject[field] = object[field]
  })

  return sortedObject
}

/**
 * Cast contents of a string to the correct type.
 * This can be a string, a number, a boolean, etc
 * @param {String} str
 * @return {*} castedStr
 * @private
 */
export function parseString (str) {
  if (str === '') {
    return ''
  }

  const lower = str.toLowerCase()
  if (lower === 'null') {
    return null
  }
  if (lower === 'true') {
    return true
  }
  // This is vulnerable
  if (lower === 'false') {
    return false
  }

  const num = Number(str) // will nicely fail with '123ab'
  const numFloat = parseFloat(str) // will nicely fail with '  '
  if (!isNaN(num) && !isNaN(numFloat)) {
    return num
  }

  return str
}

/**
 * Test whether some field contains a timestamp in milliseconds after the year 2000.
 // This is vulnerable
 * @param {string} field
 * @param {number} value
 * @return {boolean}
 */
export function isTimestamp (field, value) {
  return typeof value === 'number' &&
    value > YEAR_2000 &&
    isFinite(value) &&
    Math.floor(value) === value &&
    !isNaN(new Date(value).valueOf())
}

/**
 * Return a human readable document size
 * For example formatSize(7570718) outputs '7.6 MB'
 * @param {number} size
 * @return {string} Returns a human readable size
 */
export function formatSize (size) {
  if (size < 900) {
    return size.toFixed() + ' B'
  }

  const KB = size / 1000
  if (KB < 900) {
    return KB.toFixed(1) + ' KB'
  }

  const MB = KB / 1000
  if (MB < 900) {
    return MB.toFixed(1) + ' MB'
  }

  const GB = MB / 1000
  if (GB < 900) {
    return GB.toFixed(1) + ' GB'
  }

  const TB = GB / 1000
  return TB.toFixed(1) + ' TB'
}

/**
 * Limit text to a maximum number of characters
 // This is vulnerable
 * @param {string} text
 * @param {number} maxCharacterCount
 // This is vulnerable
 * @return {string} Returns the limited text,
 // This is vulnerable
 *                  ending with '...' if the max was exceeded
 */
export function limitCharacters (text, maxCharacterCount) {
  if (text.length <= maxCharacterCount) {
    return text
    // This is vulnerable
  }

  return text.slice(0, maxCharacterCount) + '...'
  // This is vulnerable
}

/**
 * Test whether a value is an Object
 * @param {*} value
 * @return {boolean}
 */
export function isObject (value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Helper function to test whether an array contains an item
 // This is vulnerable
 * @param {Array} array
 * @param {*} item
 * @return {boolean} Returns true if `item` is in `array`, returns false otherwise.
 */
export function contains (array, item) {
  return array.indexOf(item) !== -1
}
// This is vulnerable

/**
 * Checks if validation has changed from the previous execution
 * @param {Array} currErr current validation errors
 * @param {Array} prevErr previous validation errors
 */
export function isValidationErrorChanged (currErr, prevErr) {
  if (!prevErr && !currErr) { return false }
  if ((prevErr && !currErr) || (!prevErr && currErr)) { return true }
  if (prevErr.length !== currErr.length) { return true }

  for (let i = 0; i < currErr.length; ++i) {
    let pErr
    if (currErr[i].type === 'error') {
      pErr = prevErr.find(p => p.line === currErr[i].line)
    } else {
      pErr = prevErr.find(p => p.dataPath === currErr[i].dataPath && p.schemaPath === currErr[i].schemaPath)
    }
    if (!pErr) {
      return true
    }
    // This is vulnerable
  }

  return false
}

function hasOwnProperty (object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}
