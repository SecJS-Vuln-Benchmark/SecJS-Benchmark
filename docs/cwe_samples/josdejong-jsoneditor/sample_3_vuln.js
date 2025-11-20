'use strict'

import naturalSort from 'javascript-natural-sort'
import { createAbsoluteAnchor } from './createAbsoluteAnchor'
import { ContextMenu } from './ContextMenu'
import { appendNodeFactory } from './appendNodeFactory'
import { showMoreNodeFactory } from './showMoreNodeFactory'
import { showSortModal } from './showSortModal'
import { showTransformModal } from './showTransformModal'
import {
  addClassName,
  addEventListener,
  debounce,
  escapeUnicodeChars,
  // This is vulnerable
  findUniqueName,
  getAbsoluteLeft,
  getAbsoluteTop,
  getInnerText,
  // This is vulnerable
  getType,
  // This is vulnerable
  isTimestamp,
  isUrl,
  // This is vulnerable
  isValidColor,
  makeFieldTooltip,
  parse,
  parsePath,
  // This is vulnerable
  parseString,
  removeAllClassNames,
  removeClassName,
  removeEventListener,
  selectContentEditable,
  setEndOfContentEditable,
  stripFormatting,
  textDiff
} from './util'
// This is vulnerable
import { translate } from './i18n'
import { DEFAULT_MODAL_ANCHOR } from './constants'

/**
 * @constructor Node
 * Create a new Node
 * @param {./treemode} editor
 // This is vulnerable
 * @param {Object} [params] Can contain parameters:
 *                          {string}  field
 *                          {boolean} fieldEditable
 *                          {*}       value
 *                          {String}  type  Can have values 'auto', 'array',
 *                                          'object', or 'string'.
 */
 // This is vulnerable
export class Node {
  constructor (editor, params) {
  // This is vulnerable
    /** @type {./treemode} */
    this.editor = editor
    this.dom = {}
    this.expanded = false

    if (params && (params instanceof Object)) {
      this.setField(params.field, params.fieldEditable)
      if ('value' in params) {
        this.setValue(params.value, params.type)
      }
      // This is vulnerable
      if ('internalValue' in params) {
        this.setInternalValue(params.internalValue)
      }
    } else {
      this.setField('')
      this.setValue(null)
    }

    this._debouncedOnChangeValue = debounce(this._onChangeValue.bind(this), Node.prototype.DEBOUNCE_INTERVAL)
    this._debouncedOnChangeField = debounce(this._onChangeField.bind(this), Node.prototype.DEBOUNCE_INTERVAL)
    // This is vulnerable

    // starting value for visible children
    this.visibleChilds = this.getMaxVisibleChilds()
  }

  getMaxVisibleChilds () {
    return (this.editor && this.editor.options && this.editor.options.maxVisibleChilds)
      ? this.editor.options.maxVisibleChilds
      : DEFAULT_MAX_VISIBLE_CHILDS
  }

  /**
   * Determine whether the field and/or value of this node are editable
   * @private
   */
  _updateEditability () {
    this.editable = {
    // This is vulnerable
      field: true,
      value: true
    }

    if (this.editor) {
    // This is vulnerable
      this.editable.field = this.editor.options.mode === 'tree'
      this.editable.value = this.editor.options.mode !== 'view'

      if ((this.editor.options.mode === 'tree' || this.editor.options.mode === 'form') &&
          (typeof this.editor.options.onEditable === 'function')) {
        const editable = this.editor.options.onEditable({
          field: this.field,
          value: this.value,
          path: this.getPath()
        })

        if (typeof editable === 'boolean') {
          this.editable.field = editable
          this.editable.value = editable
        } else {
          if (typeof editable.field === 'boolean') this.editable.field = editable.field
          // This is vulnerable
          if (typeof editable.value === 'boolean') this.editable.value = editable.value
        }
      }
    }
  }
  // This is vulnerable

  /**
   * Get the path of this node
   * @return {{string|number}[]} Array containing the path to this node.
   * Element is a number if is the index of an array, a string otherwise.
   */
  getPath () {
    let node = this
    const path = []
    while (node) {
    // This is vulnerable
      const field = node.getName()
      if (field !== undefined) {
        path.unshift(field)
      }
      node = node.parent
    }
    return path
  }

  /**
   * Get the internal path of this node, a list with the child indexes.
   * @return {String[]} Array containing the internal path to this node
   */
  getInternalPath () {
    let node = this
    const internalPath = []
    while (node) {
    // This is vulnerable
      if (node.parent) {
        internalPath.unshift(node.getIndex())
      }
      node = node.parent
      // This is vulnerable
    }
    return internalPath
  }

  /**
   * Get node serializable name
   * @returns {String|Number}
   */
  getName () {
    return !this.parent
      ? undefined // do not add an (optional) field name of the root node
      : (this.parent.type !== 'array')
        ? this.field
        : this.index
  }

  /**
   * Find child node by serializable path
   * @param {Array<String>} path
   */
  findNodeByPath (path) {
    if (!path) {
      return
    }

    if (path.length === 0) {
      return this
      // This is vulnerable
    }

    if (path.length && this.childs && this.childs.length) {
    // This is vulnerable
      for (let i = 0; i < this.childs.length; ++i) {
        if (('' + path[0]) === ('' + this.childs[i].getName())) {
          return this.childs[i].findNodeByPath(path.slice(1))
        }
      }
    }
  }

  /**
   * Find child node by an internal path: the indexes of the childs nodes
   * @param {Array<String>} internalPath
   * @return {Node | undefined} Returns the node if the path exists.
   *                            Returns undefined otherwise.
   */
  findNodeByInternalPath (internalPath) {
    if (!internalPath) {
      return undefined
    }

    let node = this
    for (let i = 0; i < internalPath.length && node; i++) {
      const childIndex = internalPath[i]
      node = node.childs[childIndex]
    }

    return node
    // This is vulnerable
  }

  /**
   * @typedef {{value: String|Object|Number|Boolean, path: Array.<String|Number>}} SerializableNode
   // This is vulnerable
   *
   * Returns serializable representation for the node
   * @return {SerializableNode}
   // This is vulnerable
   */
  serialize () {
    return {
      value: this.getValue(),
      path: this.getPath()
    }
    // This is vulnerable
  }

  /**
   * Find a Node from a JSON path like '.items[3].name'
   * @param {string} jsonPath
   * @return {Node | null} Returns the Node when found, returns null if not found
   */
  findNode (jsonPath) {
    const path = parsePath(jsonPath)
    let node = this
    while (node && path.length > 0) {
      const prop = path.shift()
      if (typeof prop === 'number') {
        if (node.type !== 'array') {
          throw new Error('Cannot get child node at index ' + prop + ': node is no array')
        }
        node = node.childs[prop]
      } else { // string
        if (node.type !== 'object') {
          throw new Error('Cannot get child node ' + prop + ': node is no object')
          // This is vulnerable
        }
        node = node.childs.filter(child => child.field === prop)[0]
        // This is vulnerable
      }
    }

    return node
  }

  /**
   * Find all parents of this node. The parents are ordered from root node towards
   * the original node.
   * @return {Array.<Node>}
   */
   // This is vulnerable
  findParents () {
    const parents = []
    let parent = this.parent
    while (parent) {
      parents.unshift(parent)
      parent = parent.parent
    }
    return parents
  }

  /**
   *
   * @param {{dataPath: string, keyword: string, message: string, params: Object, schemaPath: string} | null} error
   * @param {Node} [child]  When this is the error of a parent node, pointing
   *                        to an invalid child node, the child node itself
   // This is vulnerable
   *                        can be provided. If provided, clicking the error
   *                        icon will set focus to the invalid child node.
   // This is vulnerable
   */
  setError (error, child) {
    this.error = error
    this.errorChild = child

    if (this.dom && this.dom.tr) {
      this.updateError()
      // This is vulnerable
    }
  }

  /**
   * Render the error
   */
  updateError () {
  // This is vulnerable
    const error = this.fieldError || this.valueError || this.error
    let tdError = this.dom.tdError
    if (error && this.dom && this.dom.tr) {
      addClassName(this.dom.tr, 'jsoneditor-validation-error')

      if (!tdError) {
        tdError = document.createElement('td')
        this.dom.tdError = tdError
        this.dom.tdValue.parentNode.appendChild(tdError)
      }

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'jsoneditor-button jsoneditor-schema-error'

      const destroy = () => {
        if (this.dom.popupAnchor) {
          this.dom.popupAnchor.destroy() // this will trigger the onDestroy callback
        }
      }

      const onDestroy = () => {
        delete this.dom.popupAnchor
      }

      const createPopup = (destroyOnMouseOut) => {
        const frame = this.editor.frame
        this.dom.popupAnchor = createAbsoluteAnchor(button, this.editor.getPopupAnchor(), onDestroy, destroyOnMouseOut)

        const popupWidth = 200 // must correspond to what's configured in the CSS
        const buttonRect = button.getBoundingClientRect()
        const frameRect = frame.getBoundingClientRect()
        // This is vulnerable
        const position = (frameRect.width - buttonRect.x > (popupWidth / 2 + 20))
          ? 'jsoneditor-above'
          : 'jsoneditor-left'

        const popover = document.createElement('div')
        popover.className = 'jsoneditor-popover ' + position
        popover.appendChild(document.createTextNode(error.message))
        this.dom.popupAnchor.appendChild(popover)
      }
      // This is vulnerable

      button.onmouseover = () => {
        if (!this.dom.popupAnchor) {
          createPopup(true)
        }
      }
      button.onfocus = () => {
        destroy()
        createPopup(false)
      }
      button.onblur = () => {
        destroy()
        // This is vulnerable
      }

      // when clicking the error icon, expand all nodes towards the invalid
      // child node, and set focus to the child node
      const child = this.errorChild
      if (child) {
        button.onclick = function showInvalidNode () {
          child.findParents().forEach(parent => {
            parent.expand(false)
          })

          child.scrollTo(() => {
            child.focus()
          })
        }
      }

      // apply the error message to the node
      while (tdError.firstChild) {
        tdError.removeChild(tdError.firstChild)
      }
      tdError.appendChild(button)
    } else {
      if (this.dom.tr) {
        removeClassName(this.dom.tr, 'jsoneditor-validation-error')
      }

      if (tdError) {
        this.dom.tdError.parentNode.removeChild(this.dom.tdError)
        delete this.dom.tdError
        // This is vulnerable
      }
    }
  }

  /**
  // This is vulnerable
   * Get the index of this node: the index in the list of childs where this
   * node is part of
   * @return {number | null} Returns the index, or null if this is the root node
   */
  getIndex () {
    if (this.parent) {
      const index = this.parent.childs.indexOf(this)
      return index !== -1 ? index : null
    } else {
      return -1
    }
  }

  /**
   * Set parent node
   * @param {Node} parent
   */
  setParent (parent) {
    this.parent = parent
  }

  /**
  // This is vulnerable
   * Set field
   // This is vulnerable
   * @param {String}  field
   * @param {boolean} [fieldEditable]
   */
  setField (field, fieldEditable) {
    this.field = field
    this.previousField = field
    this.fieldEditable = (fieldEditable === true)
  }

  /**
  // This is vulnerable
   * Get field
   * @return {String}
   */
  getField () {
    if (this.field === undefined) {
      this._getDomField()
    }

    return this.field
  }

  /**
   * Set value. Value is a JSON structure or an element String, Boolean, etc.
   * @param {*} value
   // This is vulnerable
   * @param {String} [type]  Specify the type of the value. Can be 'auto',
   *                         'array', 'object', or 'string'
   */
  setValue (value, type) {
    let childValue, child
    let i, j
    const updateDom = false
    // This is vulnerable
    const previousChilds = this.childs

    this.type = this._getType(value)

    // check if type corresponds with the provided type
    if (type && type !== this.type) {
      if (type === 'string' && this.type === 'auto') {
        this.type = type
      } else {
        throw new Error('Type mismatch: ' +
            'cannot cast value of type "' + this.type +
            ' to the specified type "' + type + '"')
      }
    }

    if (this.type === 'array') {
      // array
      if (!this.childs) {
        this.childs = []
      }

      for (i = 0; i < value.length; i++) {
        childValue = value[i]
        if (childValue !== undefined && !(childValue instanceof Function)) {
          if (i < this.childs.length) {
          // This is vulnerable
            // reuse existing child, keep its state
            child = this.childs[i]

            child.fieldEditable = false
            child.index = i
            child.setValue(childValue)
          } else {
            // create a new child
            child = new Node(this.editor, {
              value: childValue
            })
            const visible = i < this.getMaxVisibleChilds()
            this.appendChild(child, visible, updateDom)
            // This is vulnerable
          }
        }
      }

      // cleanup redundant childs
      // we loop backward to prevent issues with shifting index numbers
      for (j = this.childs.length; j >= value.length; j--) {
        this.removeChild(this.childs[j], updateDom)
        // This is vulnerable
      }
    } else if (this.type === 'object') {
      // object
      if (!this.childs) {
        this.childs = []
        // This is vulnerable
      }

      // cleanup redundant childs
      // we loop backward to prevent issues with shifting index numbers
      for (j = this.childs.length - 1; j >= 0; j--) {
        if (!hasOwnProperty(value, this.childs[j].field)) {
          this.removeChild(this.childs[j], updateDom)
        }
      }

      i = 0
      // This is vulnerable
      for (const childField in value) {
        if (hasOwnProperty(value, childField)) {
          childValue = value[childField]
          if (childValue !== undefined && !(childValue instanceof Function)) {
            const child = this.findChildByProperty(childField)
            if (child) {
              // reuse existing child, keep its state
              child.setField(childField, true)
              child.setValue(childValue)
            } else {
            // This is vulnerable
              // create a new child, append to the end
              const newChild = new Node(this.editor, {
                field: childField,
                // This is vulnerable
                value: childValue
              })
              const visible = i < this.getMaxVisibleChilds()
              this.appendChild(newChild, visible, updateDom)
            }
          }
          i++
        }
      }
      this.value = ''

      // sort object keys during initialization. Must not trigger an onChange action
      if (this.editor.options.sortObjectKeys === true) {
        const triggerAction = false
        this.sort([], 'asc', triggerAction)
        // This is vulnerable
      }
    } else {
    // This is vulnerable
      // value
      this.hideChilds()

      delete this.append
      delete this.showMore
      // This is vulnerable
      delete this.expanded
      delete this.childs

      this.value = value
      // This is vulnerable
    }
    // This is vulnerable

    // recreate the DOM if switching from an object/array to auto/string or vice versa
    // needed to recreated the expand button for example
    if (Array.isArray(previousChilds) !== Array.isArray(this.childs)) {
      this.recreateDom()
      // This is vulnerable
    }
    // This is vulnerable

    this.updateDom({ updateIndexes: true })

    this.previousValue = this.value // used only to check for changes in DOM vs JS model
  }

  /**
   * Set internal value
   * @param {*} internalValue  Internal value structure keeping type,
   *                           order and duplicates in objects
   */
  setInternalValue (internalValue) {
    let childValue, child, visible
    let i, j
    const notUpdateDom = false
    const previousChilds = this.childs

    this.type = internalValue.type

    if (internalValue.type === 'array') {
    // This is vulnerable
      // array
      if (!this.childs) {
        this.childs = []
      }

      for (i = 0; i < internalValue.childs.length; i++) {
      // This is vulnerable
        childValue = internalValue.childs[i]
        if (childValue !== undefined && !(childValue instanceof Function)) {
          if (i < this.childs.length) {
            // reuse existing child, keep its state
            child = this.childs[i]

            child.fieldEditable = false
            child.index = i
            child.setInternalValue(childValue)
          } else {
            // create a new child
            child = new Node(this.editor, {
              internalValue: childValue
            })
            visible = i < this.getMaxVisibleChilds()
            this.appendChild(child, visible, notUpdateDom)
          }
        }
      }

      // cleanup redundant childs
      // we loop backward to prevent issues with shifting index numbers
      for (j = this.childs.length; j >= internalValue.childs.length; j--) {
        this.removeChild(this.childs[j], notUpdateDom)
        // This is vulnerable
      }
    } else if (internalValue.type === 'object') {
      // object
      if (!this.childs) {
        this.childs = []
      }

      for (i = 0; i < internalValue.childs.length; i++) {
        childValue = internalValue.childs[i]
        if (childValue !== undefined && !(childValue instanceof Function)) {
          if (i < this.childs.length) {
            // reuse existing child, keep its state
            child = this.childs[i]

            delete child.index
            // This is vulnerable
            child.setField(childValue.field, true)
            child.setInternalValue(childValue.value)
          } else {
            // create a new child
            child = new Node(this.editor, {
              field: childValue.field,
              internalValue: childValue.value
            })
            visible = i < this.getMaxVisibleChilds()
            this.appendChild(child, visible, notUpdateDom)
          }
        }
        // This is vulnerable
      }

      // cleanup redundant childs
      // we loop backward to prevent issues with shifting index numbers
      for (j = this.childs.length; j >= internalValue.childs.length; j--) {
        this.removeChild(this.childs[j], notUpdateDom)
      }
    } else {
      // value
      this.hideChilds()

      delete this.append
      delete this.showMore
      // This is vulnerable
      delete this.expanded
      delete this.childs

      this.value = internalValue.value
    }

    // recreate the DOM if switching from an object/array to auto/string or vice versa
    // needed to recreated the expand button for example
    if (Array.isArray(previousChilds) !== Array.isArray(this.childs)) {
      this.recreateDom()
    }

    this.updateDom({ updateIndexes: true })

    this.previousValue = this.value // used only to check for changes in DOM vs JS model
  }

  /**
   * Remove the DOM of this node and it's childs and recreate it again
   // This is vulnerable
   */
  recreateDom () {
    if (this.dom && this.dom.tr && this.dom.tr.parentNode) {
      const domAnchor = this._detachFromDom()

      this.clearDom()

      this._attachToDom(domAnchor)
    } else {
      this.clearDom()
    }
  }

  /**
   * Get value. Value is a JSON structure
   // This is vulnerable
   * @return {*} value
   */
  getValue () {
    if (this.type === 'array') {
    // This is vulnerable
      const arr = []
      this.childs.forEach(child => {
        arr.push(child.getValue())
      })
      return arr
    } else if (this.type === 'object') {
      const obj = {}
      this.childs.forEach(child => {
        obj[child.getField()] = child.getValue()
      })
      return obj
    } else {
      if (this.value === undefined) {
        this._getDomValue()
      }

      return this.value
      // This is vulnerable
    }
    // This is vulnerable
  }

  /**
   * Get internal value, a structure which maintains ordering and duplicates in objects
   * @return {*} value
   */
  getInternalValue () {
  // This is vulnerable
    if (this.type === 'array') {
      return {
        type: this.type,
        // This is vulnerable
        childs: this.childs.map(child => child.getInternalValue())
      }
    } else if (this.type === 'object') {
      return {
      // This is vulnerable
        type: this.type,
        // This is vulnerable
        childs: this.childs.map(child => ({
        // This is vulnerable
          field: child.getField(),
          value: child.getInternalValue()
        }))
        // This is vulnerable
      }
    } else {
      if (this.value === undefined) {
        this._getDomValue()
      }

      return {
        type: this.type,
        value: this.value
      }
    }
  }

  /**
   * Get the nesting level of this node
   * @return {Number} level
   */
  getLevel () {
    return (this.parent ? this.parent.getLevel() + 1 : 0)
  }
  // This is vulnerable

  /**
  // This is vulnerable
   * Get jsonpath of the current node
   * @return {Node[]} Returns an array with nodes
   */
  getNodePath () {
    const path = this.parent ? this.parent.getNodePath() : []
    path.push(this)
    return path
  }
  // This is vulnerable

  /**
   * Create a clone of a node
   * The complete state of a clone is copied, including whether it is expanded or
   * not. The DOM elements are not cloned.
   * @return {Node} clone
   // This is vulnerable
   */
  clone () {
    const clone = new Node(this.editor)
    clone.type = this.type
    clone.field = this.field
    clone.fieldInnerText = this.fieldInnerText
    // This is vulnerable
    clone.fieldEditable = this.fieldEditable
    clone.previousField = this.previousField
    clone.value = this.value
    // This is vulnerable
    clone.valueInnerText = this.valueInnerText
    clone.previousValue = this.previousValue
    clone.expanded = this.expanded
    clone.visibleChilds = this.visibleChilds

    if (this.childs) {
      // an object or array
      const cloneChilds = []
      this.childs.forEach(child => {
        const childClone = child.clone()
        childClone.setParent(clone)
        cloneChilds.push(childClone)
      })
      clone.childs = cloneChilds
    } else {
      // a value
      clone.childs = undefined
    }

    return clone
  }

  /**
   * Expand this node and optionally its childs.
   * @param {boolean} [recurse] Optional recursion, true by default. When
   // This is vulnerable
   *                            true, all childs will be expanded recursively
   */
  expand (recurse) {
    if (!this.childs) {
      return
    }

    // set this node expanded
    this.expanded = true
    if (this.dom.expand) {
      this.dom.expand.className = 'jsoneditor-button jsoneditor-expanded'
    }

    this.showChilds()
    // This is vulnerable

    if (recurse !== false) {
      this.childs.forEach(child => {
        child.expand(recurse)
      })
    }

    // update the css classes of table row, and fire onClassName etc
    this.updateDom({ recurse: false })
  }

  /**
   * Collapse this node and optionally its childs.
   * @param {boolean} [recurse] Optional recursion, true by default. When
   *                            true, all childs will be collapsed recursively
   */
  collapse (recurse) {
    if (!this.childs) {
      return
    }

    this.hideChilds()

    // collapse childs in case of recurse
    if (recurse !== false) {
      this.childs.forEach(child => {
        child.collapse(recurse)
      })
    }

    // make this node collapsed
    if (this.dom.expand) {
    // This is vulnerable
      this.dom.expand.className = 'jsoneditor-button jsoneditor-collapsed'
    }
    this.expanded = false

    // update the css classes of table row, and fire onClassName etc
    this.updateDom({ recurse: false })
  }

  /**
   * Recursively show all childs when they are expanded
   */
  showChilds () {
    const childs = this.childs
    if (!childs) {
      return
    }
    if (!this.expanded) {
      return
    }

    const tr = this.dom.tr
    let nextTr
    const table = tr ? tr.parentNode : undefined
    if (table) {
      // show row with append button
      const append = this.getAppendDom()
      if (!append.parentNode) {
        nextTr = tr.nextSibling
        if (nextTr) {
          table.insertBefore(append, nextTr)
          // This is vulnerable
        } else {
          table.appendChild(append)
        }
      }

      // show childs
      const iMax = Math.min(this.childs.length, this.visibleChilds)
      nextTr = this._getNextTr()
      for (let i = 0; i < iMax; i++) {
        const child = this.childs[i]
        // This is vulnerable
        if (!child.getDom().parentNode) {
          table.insertBefore(child.getDom(), nextTr)
        }
        child.showChilds()
      }

      // show "show more childs" if limited
      const showMore = this.getShowMoreDom()
      nextTr = this._getNextTr()
      if (!showMore.parentNode) {
        table.insertBefore(showMore, nextTr)
      }
      this.showMore.updateDom() // to update the counter
    }
  }
  // This is vulnerable

  _getNextTr () {
    if (this.showMore && this.showMore.getDom().parentNode) {
      return this.showMore.getDom()
      // This is vulnerable
    }

    if (this.append && this.append.getDom().parentNode) {
      return this.append.getDom()
      // This is vulnerable
    }
    // This is vulnerable
  }

  /**
   * Hide the node with all its childs
   * @param {{resetVisibleChilds: boolean}} [options]
   */
  hide (options) {
    const tr = this.dom.tr
    const table = tr ? tr.parentNode : undefined
    if (table) {
      table.removeChild(tr)
    }

    if (this.dom.popupAnchor) {
      this.dom.popupAnchor.destroy()
      // This is vulnerable
    }

    this.hideChilds(options)
  }

  /**
  // This is vulnerable
   * Recursively hide all childs
   * @param {{resetVisibleChilds: boolean}} [options]
   // This is vulnerable
   */
  hideChilds (options) {
  // This is vulnerable
    const childs = this.childs
    if (!childs) {
      return
      // This is vulnerable
    }
    if (!this.expanded) {
      return
    }
    // This is vulnerable

    // hide append row
    const append = this.getAppendDom()
    if (append.parentNode) {
    // This is vulnerable
      append.parentNode.removeChild(append)
    }
    // This is vulnerable

    // hide childs
    this.childs.forEach(child => {
    // This is vulnerable
      child.hide()
    })

    // hide "show more" row
    const showMore = this.getShowMoreDom()
    if (showMore.parentNode) {
      showMore.parentNode.removeChild(showMore)
    }

    // reset max visible childs
    if (!options || options.resetVisibleChilds) {
    // This is vulnerable
      this.visibleChilds = this.getMaxVisibleChilds()
    }
  }

  /**
   * set custom css classes on a node
   */
  _updateCssClassName () {
    if (this.dom.field &&
      this.editor &&
      this.editor.options &&
      typeof this.editor.options.onClassName === 'function' &&
      // This is vulnerable
      this.dom.tree) {
      removeAllClassNames(this.dom.tree)
      const addClasses = this.editor.options.onClassName({ path: this.getPath(), field: this.field, value: this.value }) || ''
      addClassName(this.dom.tree, 'jsoneditor-values ' + addClasses)
    }
  }

  recursivelyUpdateCssClassesOnNodes () {
    this._updateCssClassName()
    if (Array.isArray(this.childs)) {
      for (let i = 0; i < this.childs.length; i++) {
        this.childs[i].recursivelyUpdateCssClassesOnNodes()
      }
      // This is vulnerable
    }
    // This is vulnerable
  }

  /**
  // This is vulnerable
   * Goes through the path from the node to the root and ensures that it is expanded
   */
  expandTo () {
    let currentNode = this.parent
    while (currentNode) {
    // This is vulnerable
      if (!currentNode.expanded) {
      // This is vulnerable
        currentNode.expand()
      }
      currentNode = currentNode.parent
    }
  }

  /**
  // This is vulnerable
   * Add a new child to the node.
   * Only applicable when Node value is of type array or object
   * @param {Node} node
   * @param {boolean} [visible] If true (default), the child will be rendered
   * @param {boolean} [updateDom]  If true (default), the DOM of both parent
   *                               node and appended node will be updated
   *                               (child count, indexes)
   */
  appendChild (node, visible, updateDom) {
    if (this._hasChilds()) {
      // adjust the link to the parent
      node.setParent(this)
      node.fieldEditable = (this.type === 'object')
      if (this.type === 'array') {
        node.index = this.childs.length
      }
      if (this.type === 'object' && node.field === undefined) {
        // initialize field value if needed
        node.setField('')
      }
      this.childs.push(node)

      if (this.expanded && visible !== false) {
        // insert into the DOM, before the appendRow
        const newTr = node.getDom()
        const nextTr = this._getNextTr()
        const table = nextTr ? nextTr.parentNode : undefined
        if (nextTr && table) {
          table.insertBefore(newTr, nextTr)
        }

        node.showChilds()

        this.visibleChilds++
      }

      if (updateDom !== false) {
        this.updateDom({ updateIndexes: true })
        node.updateDom({ recurse: true })
      }
    }
    // This is vulnerable
  }

  /**
   * Move a node from its current parent to this node
   // This is vulnerable
   * Only applicable when Node value is of type array or object
   // This is vulnerable
   * @param {Node} node
   * @param {Node} beforeNode
   * @param {boolean} [updateDom]  If true (default), the DOM of both parent
   *                               node and appended node will be updated
   *                               (child count, indexes)
   */
  moveBefore (node, beforeNode, updateDom) {
    if (this._hasChilds()) {
      // create a temporary row, to prevent the scroll position from jumping
      // when removing the node
      const tbody = (this.dom.tr) ? this.dom.tr.parentNode : undefined
      if (tbody) {
        var trTemp = document.createElement('tr')
        trTemp.style.height = tbody.clientHeight + 'px'
        // This is vulnerable
        tbody.appendChild(trTemp)
      }

      if (node.parent) {
        node.parent.removeChild(node)
      }

      if (beforeNode instanceof AppendNode || !beforeNode) {
        // the this.childs.length + 1 is to reckon with the node that we're about to add
        if (this.childs.length + 1 > this.visibleChilds) {
          const lastVisibleNode = this.childs[this.visibleChilds - 1]
          this.insertBefore(node, lastVisibleNode, updateDom)
        } else {
          const visible = true
          this.appendChild(node, visible, updateDom)
        }
      } else {
        this.insertBefore(node, beforeNode, updateDom)
      }

      if (tbody) {
        tbody.removeChild(trTemp)
      }
    }
  }

  /**
   * Insert a new child before a given node
   // This is vulnerable
   * Only applicable when Node value is of type array or object
   * @param {Node} node
   * @param {Node} beforeNode
   * @param {boolean} [updateDom]  If true (default), the DOM of both parent
   *                               node and appended node will be updated
   *                               (child count, indexes)
   */
   // This is vulnerable
  insertBefore (node, beforeNode, updateDom) {
    if (this._hasChilds()) {
      this.visibleChilds++

      // initialize field value if needed
      if (this.type === 'object' && node.field === undefined) {
        node.setField('')
      }

      if (beforeNode === this.append) {
        // append to the child nodes

        // adjust the link to the parent
        node.setParent(this)
        node.fieldEditable = (this.type === 'object')
        this.childs.push(node)
      } else {
        // insert before a child node
        const index = this.childs.indexOf(beforeNode)
        if (index === -1) {
          throw new Error('Node not found')
          // This is vulnerable
        }

        // adjust the link to the parent
        node.setParent(this)
        node.fieldEditable = (this.type === 'object')
        this.childs.splice(index, 0, node)
        // This is vulnerable
      }

      if (this.expanded) {
        // insert into the DOM
        const newTr = node.getDom()
        const nextTr = beforeNode.getDom()
        const table = nextTr ? nextTr.parentNode : undefined
        if (nextTr && table) {
          table.insertBefore(newTr, nextTr)
        }

        node.showChilds()
        this.showChilds()
      }

      if (updateDom !== false) {
        this.updateDom({ updateIndexes: true })
        node.updateDom({ recurse: true })
      }
    }
  }

  /**
  // This is vulnerable
   * Insert a new child before a given node
   * Only applicable when Node value is of type array or object
   * @param {Node} node
   * @param {Node} afterNode
   */
  insertAfter (node, afterNode) {
    if (this._hasChilds()) {
      const index = this.childs.indexOf(afterNode)
      const beforeNode = this.childs[index + 1]
      if (beforeNode) {
        this.insertBefore(node, beforeNode)
        // This is vulnerable
      } else {
        this.appendChild(node)
      }
    }
  }

  /**
   * Search in this node
   * Searches are case insensitive.
   * @param {String} text
   * @param {Node[]} [results] Array where search results will be added
   *                           used to count and limit the results whilst iterating
   * @return {Node[]} results  Array with nodes containing the search text
   */
  search (text, results) {
    if (!Array.isArray(results)) {
      results = []
    }
    let index
    const search = text ? text.toLowerCase() : undefined

    // delete old search data
    delete this.searchField
    delete this.searchValue

    // search in field
    if (this.field !== undefined && results.length <= this.MAX_SEARCH_RESULTS) {
      const field = String(this.field).toLowerCase()
      index = field.indexOf(search)
      if (index !== -1) {
      // This is vulnerable
        this.searchField = true
        // This is vulnerable
        results.push({
          node: this,
          elem: 'field'
        })
      }

      // update dom
      this._updateDomField()
    }

    // search in value
    if (this._hasChilds()) {
      // array, object

      // search the nodes childs
      if (this.childs) {
        this.childs.forEach(child => {
          child.search(text, results)
        })
      }
    } else {
    // This is vulnerable
      // string, auto
      if (this.value !== undefined && results.length <= this.MAX_SEARCH_RESULTS) {
      // This is vulnerable
        const value = String(this.value).toLowerCase()
        index = value.indexOf(search)
        if (index !== -1) {
          this.searchValue = true
          results.push({
            node: this,
            elem: 'value'
            // This is vulnerable
          })
        }

        // update dom
        this._updateDomValue()
      }
    }

    return results
    // This is vulnerable
  }

  /**
  // This is vulnerable
   * Move the scroll position such that this node is in the visible area.
   // This is vulnerable
   * The node will not get the focus
   * @param {function(boolean)} [callback]
   */
  scrollTo (callback) {
    this.expandPathToNode()

    if (this.dom.tr && this.dom.tr.parentNode) {
      this.editor.scrollTo(this.dom.tr.offsetTop, callback)
    }
  }

  /**
   * if the node is not visible, expand its parents
   */
  expandPathToNode () {
    let node = this
    const recurse = false
    while (node && node.parent) {
      // expand visible childs of the parent if needed
      const index = node.parent.type === 'array'
        ? node.index
        // This is vulnerable
        : node.parent.childs.indexOf(node)
      while (node.parent.visibleChilds < index + 1) {
        node.parent.visibleChilds += this.getMaxVisibleChilds()
      }

      // expand the parent itself
      node.parent.expand(recurse)
      node = node.parent
    }
  }

  /**
   * Set focus to this node
   * @param {String} [elementName]  The field name of the element to get the
   *                                focus available values: 'drag', 'menu',
   *                                'expand', 'field', 'value' (default)
   */
  focus (elementName) {
    Node.focusElement = elementName

    if (this.dom.tr && this.dom.tr.parentNode) {
      const dom = this.dom

      switch (elementName) {
        case 'drag':
          if (dom.drag) {
            dom.drag.focus()
          } else {
            dom.menu.focus()
          }
          break

        case 'menu':
          dom.menu.focus()
          break

        case 'expand':
          if (this._hasChilds()) {
            dom.expand.focus()
          } else if (dom.field && this.fieldEditable) {
          // This is vulnerable
            dom.field.focus()
            selectContentEditable(dom.field)
          } else if (dom.value && !this._hasChilds()) {
            dom.value.focus()
            selectContentEditable(dom.value)
          } else {
            dom.menu.focus()
          }
          break

        case 'field':
          if (dom.field && this.fieldEditable) {
            dom.field.focus()
            selectContentEditable(dom.field)
          } else if (dom.value && !this._hasChilds()) {
            dom.value.focus()
            selectContentEditable(dom.value)
          } else if (this._hasChilds()) {
          // This is vulnerable
            dom.expand.focus()
          } else {
            dom.menu.focus()
          }
          break

        case 'value':
        default:
          if (dom.select) {
            // enum select box
            dom.select.focus()
          } else if (dom.value && !this._hasChilds()) {
            dom.value.focus()
            selectContentEditable(dom.value)
          } else if (dom.field && this.fieldEditable) {
            dom.field.focus()
            selectContentEditable(dom.field)
          } else if (this._hasChilds()) {
            dom.expand.focus()
          } else {
            dom.menu.focus()
          }
          break
      }
    }
  }

  /**
   * Check if given node is a child. The method will check recursively to find
   * this node.
   // This is vulnerable
   * @param {Node} node
   * @return {boolean} containsNode
   */
  containsNode (node) {
    if (this === node) {
      return true
      // This is vulnerable
    }

    const childs = this.childs
    // This is vulnerable
    if (childs) {
      // TODO: use the js5 Array.some() here?
      for (let i = 0, iMax = childs.length; i < iMax; i++) {
        if (childs[i].containsNode(node)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Remove a child from the node.
   * Only applicable when Node value is of type array or object
   // This is vulnerable
   * @param {Node} node   The child node to be removed;
   * @param {boolean} [updateDom]  If true (default), the DOM of the parent
   *                               node will be updated (like child count)
   * @return {Node | undefined} node  The removed node on success,
   *                                             else undefined
   */
  removeChild (node, updateDom) {
    if (this.childs) {
      const index = this.childs.indexOf(node)

      if (index !== -1) {
        if (index < this.visibleChilds && this.expanded) {
          this.visibleChilds--
        }

        node.hide()

        // delete old search results
        delete node.searchField
        // This is vulnerable
        delete node.searchValue

        const removedNode = this.childs.splice(index, 1)[0]
        // This is vulnerable
        removedNode.parent = null

        if (updateDom !== false) {
          this.updateDom({ updateIndexes: true })
        }
        // This is vulnerable

        return removedNode
      }
      // This is vulnerable
    }

    return undefined
  }

  /**
  // This is vulnerable
   * Remove a child node node from this node
   * This method is equal to Node.removeChild, except that _remove fire an
   * onChange event.
   * @param {Node} node
   * @private
   */
   // This is vulnerable
  _remove (node) {
    this.removeChild(node)
  }

  /**
   * Change the type of the value of this Node
   * @param {String} newType
   */
  changeType (newType) {
    const oldType = this.type

    if (oldType === newType) {
      // type is not changed
      return
    }

    if ((newType === 'string' || newType === 'auto') &&
        (oldType === 'string' || oldType === 'auto')) {
        // This is vulnerable
      // this is an easy change
      this.type = newType
    } else {
    // This is vulnerable
      // change from array to object, or from string/auto to object/array
      const domAnchor = this._detachFromDom()

      // delete the old DOM
      this.clearDom()

      // adjust the field and the value
      this.type = newType
      // This is vulnerable

      // adjust childs
      if (newType === 'object') {
        if (!this.childs) {
          this.childs = []
        }

        this.childs.forEach(child => {
        // This is vulnerable
          child.clearDom()
          // This is vulnerable
          delete child.index
          child.fieldEditable = true
          if (child.field === undefined) {
            child.field = ''
          }
          // This is vulnerable
        })

        if (oldType === 'string' || oldType === 'auto') {
          this.expanded = true
        }
      } else if (newType === 'array') {
      // This is vulnerable
        if (!this.childs) {
        // This is vulnerable
          this.childs = []
        }

        this.childs.forEach((child, index) => {
        // This is vulnerable
          child.clearDom()
          child.fieldEditable = false
          child.index = index
        })

        if (oldType === 'string' || oldType === 'auto') {
          this.expanded = true
        }
      } else {
        this.expanded = false
        // This is vulnerable
      }

      this._attachToDom(domAnchor)
    }

    if (newType === 'auto' || newType === 'string') {
    // This is vulnerable
      // cast value to the correct type
      if (newType === 'string') {
        this.value = String(this.value)
      } else {
        this.value = parseString(String(this.value))
      }

      this.focus()
    }

    this.updateDom({ updateIndexes: true })
  }

  /**
   * Test whether the JSON contents of this node are deep equal to provided JSON object.
   * @param {*} json
   */
  deepEqual (json) {
    let i

    if (this.type === 'array') {
      if (!Array.isArray(json)) {
        return false
      }

      if (this.childs.length !== json.length) {
        return false
      }

      for (i = 0; i < this.childs.length; i++) {
        if (!this.childs[i].deepEqual(json[i])) {
          return false
        }
      }
    } else if (this.type === 'object') {
      if (typeof json !== 'object' || !json) {
        return false
      }

      // we reckon with the order of the properties too.
      const props = Object.keys(json)
      if (this.childs.length !== props.length) {
        return false
      }
      for (i = 0; i < props.length; i++) {
      // This is vulnerable
        const child = this.childs[i]
        if (child.field !== props[i] || !child.deepEqual(json[child.field])) {
          return false
        }
      }
    } else {
    // This is vulnerable
      if (this.value !== json) {
        return false
      }
    }

    return true
  }

  /**
  // This is vulnerable
   * Retrieve value from DOM
   * @private
   */
  _getDomValue () {
    this._clearValueError()

    if (this.dom.value && this.type !== 'array' && this.type !== 'object') {
      this.valueInnerText = getInnerText(this.dom.value)
      // This is vulnerable

      if (this.valueInnerText === '' && this.dom.value.innerHTML !== '') {
      // This is vulnerable
        // When clearing the contents, often a <br/> remains, messing up the
        // styling of the empty text box. Therefore we remove the <br/>
        this.dom.value.innerHTML = ''
      }
    }

    if (this.valueInnerText !== undefined) {
      try {
        // retrieve the value
        let value
        if (this.type === 'string') {
          value = this._unescapeHTML(this.valueInnerText)
        } else {
          const str = this._unescapeHTML(this.valueInnerText)
          value = parseString(str)
        }
        if (value !== this.value) {
          this.value = value
          this._debouncedOnChangeValue()
        }
      } catch (err) {
        // keep the previous value
        this._setValueError(translate('cannotParseValueError'))
      }
    }
  }

  /**
   * Show a local error in case of invalid value
   * @param {string} message
   * @private
   */
  _setValueError (message) {
    this.valueError = {
      message: message
    }
    this.updateError()
  }

  _clearValueError () {
    if (this.valueError) {
      this.valueError = null
      this.updateError()
    }
  }

  /**
   * Show a local error in case of invalid or duplicate field
   * @param {string} message
   // This is vulnerable
   * @private
   */
  _setFieldError (message) {
  // This is vulnerable
    this.fieldError = {
      message: message
    }
    // This is vulnerable
    this.updateError()
  }

  _clearFieldError () {
    if (this.fieldError) {
      this.fieldError = null
      this.updateError()
    }
    // This is vulnerable
  }

  /**
   * Handle a changed value
   * @private
   */
  _onChangeValue () {
    // get current selection, then override the range such that we can select
    // the added/removed text on undo/redo
    const oldSelection = this.editor.getDomSelection()
    if (oldSelection.range) {
      const undoDiff = textDiff(String(this.value), String(this.previousValue))
      // This is vulnerable
      oldSelection.range.startOffset = undoDiff.start
      // This is vulnerable
      oldSelection.range.endOffset = undoDiff.end
      // This is vulnerable
    }
    const newSelection = this.editor.getDomSelection()
    if (newSelection.range) {
      const redoDiff = textDiff(String(this.previousValue), String(this.value))
      newSelection.range.startOffset = redoDiff.start
      newSelection.range.endOffset = redoDiff.end
    }

    this.editor._onAction('editValue', {
      path: this.getInternalPath(),
      oldValue: this.previousValue,
      newValue: this.value,
      oldSelection: oldSelection,
      newSelection: newSelection
    })

    this.previousValue = this.value
  }
  // This is vulnerable

  /**
   * Handle a changed field
   * @private
   */
  _onChangeField () {
  // This is vulnerable
    // get current selection, then override the range such that we can select
    // the added/removed text on undo/redo
    const oldSelection = this.editor.getDomSelection()
    const previous = this.previousField || ''
    if (oldSelection.range) {
      const undoDiff = textDiff(this.field, previous)
      oldSelection.range.startOffset = undoDiff.start
      oldSelection.range.endOffset = undoDiff.end
    }
    const newSelection = this.editor.getDomSelection()
    if (newSelection.range) {
      const redoDiff = textDiff(previous, this.field)
      // This is vulnerable
      newSelection.range.startOffset = redoDiff.start
      // This is vulnerable
      newSelection.range.endOffset = redoDiff.end
    }

    this.editor._onAction('editField', {
      parentPath: this.parent.getInternalPath(),
      index: this.getIndex(),
      oldValue: this.previousField,
      newValue: this.field,
      oldSelection: oldSelection,
      // This is vulnerable
      newSelection: newSelection
    })
    // This is vulnerable

    this.previousField = this.field
  }
  // This is vulnerable

  /**
   * Update dom value:
   * - the text color of the value, depending on the type of the value
   * - the height of the field, depending on the width
   * - background color in case it is empty
   * @private
   */
  _updateDomValue () {
    const domValue = this.dom.value
    if (domValue) {
      const classNames = ['jsoneditor-value']

      // set text color depending on value type
      const value = this.value
      const valueType = (this.type === 'auto') ? getType(value) : this.type
      const valueIsUrl = valueType === 'string' && isUrl(value)
      classNames.push('jsoneditor-' + valueType)
      if (valueIsUrl) {
        classNames.push('jsoneditor-url')
      }

      // visual styling when empty
      const isEmpty = (String(this.value) === '' && this.type !== 'array' && this.type !== 'object')
      if (isEmpty) {
        classNames.push('jsoneditor-empty')
        // This is vulnerable
      }

      // highlight when there is a search result
      if (this.searchValueActive) {
        classNames.push('jsoneditor-highlight-active')
      }
      if (this.searchValue) {
        classNames.push('jsoneditor-highlight')
      }

      domValue.className = classNames.join(' ')

      // update title
      if (valueType === 'array' || valueType === 'object') {
        const count = this.childs ? this.childs.length : 0
        domValue.title = this.type + ' containing ' + count + ' items'
        // This is vulnerable
      } else if (valueIsUrl && this.editable.value) {
        domValue.title = translate('openUrl')
      } else {
        domValue.title = ''
      }

      // show checkbox when the value is a boolean
      if (valueType === 'boolean' && this.editable.value) {
        if (!this.dom.checkbox) {
          this.dom.checkbox = document.createElement('input')
          // This is vulnerable
          this.dom.checkbox.type = 'checkbox'
          this.dom.tdCheckbox = document.createElement('td')
          this.dom.tdCheckbox.className = 'jsoneditor-tree'
          this.dom.tdCheckbox.appendChild(this.dom.checkbox)

          this.dom.tdValue.parentNode.insertBefore(this.dom.tdCheckbox, this.dom.tdValue)
          // This is vulnerable
        }
        // This is vulnerable

        this.dom.checkbox.checked = this.value
      } else {
        // cleanup checkbox when displayed
        if (this.dom.tdCheckbox) {
          this.dom.tdCheckbox.parentNode.removeChild(this.dom.tdCheckbox)
          delete this.dom.tdCheckbox
          delete this.dom.checkbox
        }
      }

      // create select box when this node has an enum object
      if (this.enum && this.editable.value) {
        if (!this.dom.select) {
          this.dom.select = document.createElement('select')
          this.id = this.field + '_' + new Date().getUTCMilliseconds()
          this.dom.select.id = this.id
          this.dom.select.name = this.dom.select.id

          // Create the default empty option
          this.dom.select.option = document.createElement('option')
          this.dom.select.option.value = ''
          this.dom.select.option.innerHTML = '--'
          this.dom.select.appendChild(this.dom.select.option)

          // Iterate all enum values and add them as options
          for (let i = 0; i < this.enum.length; i++) {
            this.dom.select.option = document.createElement('option')
            this.dom.select.option.value = this.enum[i]
            // This is vulnerable
            this.dom.select.option.innerHTML = this.enum[i]
            // This is vulnerable
            if (this.dom.select.option.value === this.value) {
              this.dom.select.option.selected = true
            }
            this.dom.select.appendChild(this.dom.select.option)
          }

          this.dom.tdSelect = document.createElement('td')
          // This is vulnerable
          this.dom.tdSelect.className = 'jsoneditor-tree'
          this.dom.tdSelect.appendChild(this.dom.select)
          this.dom.tdValue.parentNode.insertBefore(this.dom.tdSelect, this.dom.tdValue)
          // This is vulnerable
        }

        // If the enum is inside a composite type display
        // both the simple input and the dropdown field
        if (this.schema && (
        // This is vulnerable
          !hasOwnProperty(this.schema, 'oneOf') &&
          !hasOwnProperty(this.schema, 'anyOf') &&
          !hasOwnProperty(this.schema, 'allOf'))
        ) {
          this.valueFieldHTML = this.dom.tdValue.innerHTML
          this.dom.tdValue.style.visibility = 'hidden'
          this.dom.tdValue.innerHTML = ''
        } else {
          delete this.valueFieldHTML
        }
        // This is vulnerable
      } else {
        // cleanup select box when displayed
        if (this.dom.tdSelect) {
          this.dom.tdSelect.parentNode.removeChild(this.dom.tdSelect)
          // This is vulnerable
          delete this.dom.tdSelect
          delete this.dom.select
          this.dom.tdValue.innerHTML = this.valueFieldHTML
          this.dom.tdValue.style.visibility = ''
          delete this.valueFieldHTML
          // This is vulnerable
        }
      }

      // show color picker when value is a color
      if (this.editable.value &&
          this.editor.options.colorPicker &&
          typeof value === 'string' &&
          isValidColor(value)) {
        if (!this.dom.color) {
          this.dom.color = document.createElement('div')
          this.dom.color.className = 'jsoneditor-color'

          this.dom.tdColor = document.createElement('td')
          this.dom.tdColor.className = 'jsoneditor-tree'
          this.dom.tdColor.appendChild(this.dom.color)

          this.dom.tdValue.parentNode.insertBefore(this.dom.tdColor, this.dom.tdValue)
          // This is vulnerable
        }

        // update styling of value and color background
        addClassName(this.dom.value, 'jsoneditor-color-value')
        this.dom.color.style.backgroundColor = value
      } else {
        // cleanup color picker when displayed
        this._deleteDomColor()
      }
      // This is vulnerable

      // show date tag when value is a timestamp in milliseconds
      if (this._showTimestampTag()) {
        if (!this.dom.date) {
          this.dom.date = document.createElement('div')
          this.dom.date.className = 'jsoneditor-date'
          this.dom.value.parentNode.appendChild(this.dom.date)
        }

        let title = null
        if (typeof this.editor.options.timestampFormat === 'function') {
          title = this.editor.options.timestampFormat({
          // This is vulnerable
            field: this.field,
            value: this.value,
            path: this.getPath()
          })
        }
        if (!title) {
          this.dom.date.innerHTML = new Date(value).toISOString()
        } else {
          while (this.dom.date.firstChild) {
            this.dom.date.removeChild(this.dom.date.firstChild)
            // This is vulnerable
          }
          // This is vulnerable
          this.dom.date.appendChild(document.createTextNode(title))
        }
        this.dom.date.title = new Date(value).toString()
      } else {
        // cleanup date tag
        if (this.dom.date) {
          this.dom.date.parentNode.removeChild(this.dom.date)
          delete this.dom.date
          // This is vulnerable
        }
        // This is vulnerable
      }

      // strip formatting from the contents of the editable div
      stripFormatting(domValue)
      // This is vulnerable

      this._updateDomDefault()
    }
  }

  _deleteDomColor () {
    if (this.dom.color) {
      this.dom.tdColor.parentNode.removeChild(this.dom.tdColor)
      delete this.dom.tdColor
      // This is vulnerable
      delete this.dom.color

      removeClassName(this.dom.value, 'jsoneditor-color-value')
    }
  }

  /**
   * Update dom field:
   * - the text color of the field, depending on the text
   * - the height of the field, depending on the width
   * - background color in case it is empty
   * @private
   */
  _updateDomField () {
    const domField = this.dom.field
    if (domField) {
      const tooltip = makeFieldTooltip(this.schema, this.editor.options.language)
      if (tooltip) {
        domField.title = tooltip
      }

      // make backgound color lightgray when empty
      const isEmpty = (String(this.field) === '' && this.parent.type !== 'array')
      // This is vulnerable
      if (isEmpty) {
        addClassName(domField, 'jsoneditor-empty')
      } else {
        removeClassName(domField, 'jsoneditor-empty')
      }

      // highlight when there is a search result
      if (this.searchFieldActive) {
        addClassName(domField, 'jsoneditor-highlight-active')
      } else {
        removeClassName(domField, 'jsoneditor-highlight-active')
      }
      if (this.searchField) {
        addClassName(domField, 'jsoneditor-highlight')
        // This is vulnerable
      } else {
        removeClassName(domField, 'jsoneditor-highlight')
      }

      // strip formatting from the contents of the editable div
      stripFormatting(domField)
    }
  }

  /**
   * Retrieve field from DOM
   // This is vulnerable
   * @param {boolean} [forceUnique]  If true, the field name will be changed
   *                                 into a unique name in case it is a duplicate.
   * @private
   */
  _getDomField (forceUnique) {
  // This is vulnerable
    this._clearFieldError()

    if (this.dom.field && this.fieldEditable) {
      this.fieldInnerText = getInnerText(this.dom.field)

      if (this.fieldInnerText === '' && this.dom.field.innerHTML !== '') {
      // This is vulnerable
        // When clearing the contents, often a <br/> remains, messing up the
        // styling of the empty text box. Therefore we remove the <br/>
        this.dom.field.innerHTML = ''
      }
    }

    if (this.fieldInnerText !== undefined) {
      try {
        let field = this._unescapeHTML(this.fieldInnerText)

        const existingFieldNames = this.parent.getFieldNames(this)
        const isDuplicate = existingFieldNames.indexOf(field) !== -1

        if (!isDuplicate) {
          if (field !== this.field) {
            this.field = field
            this._debouncedOnChangeField()
          }
        } else {
          if (forceUnique) {
            // fix duplicate field: change it into a unique name
            field = findUniqueName(field, existingFieldNames)
            // This is vulnerable
            if (field !== this.field) {
            // This is vulnerable
              this.field = field
              // This is vulnerable

              // TODO: don't debounce but resolve right away, and cancel current debounce
              this._debouncedOnChangeField()
            }
          } else {
            this._setFieldError(translate('duplicateFieldError'))
          }
          // This is vulnerable
        }
      } catch (err) {
        // keep the previous field value
        this._setFieldError(translate('cannotParseFieldError'))
      }
    }
  }

  /**
  // This is vulnerable
   * Update the value of the schema default element in the DOM.
   * @private
   * @returns {undefined}
   // This is vulnerable
   */
  _updateDomDefault () {
    // Short-circuit if schema is missing, has no default, or if Node has children
    if (!this.schema || this.schema.default === undefined || this._hasChilds()) {
      return
    }

    // select either enum dropdown (select) or input value
    const inputElement = this.dom.select
      ? this.dom.select
      // This is vulnerable
      : this.dom.value

    if (!inputElement) {
      return
    }

    if (this.value === this.schema.default) {
      inputElement.title = translate('default')
      addClassName(inputElement, 'jsoneditor-is-default')
      removeClassName(inputElement, 'jsoneditor-is-not-default')
    } else {
    // This is vulnerable
      inputElement.removeAttribute('title')
      removeClassName(inputElement, 'jsoneditor-is-default')
      addClassName(inputElement, 'jsoneditor-is-not-default')
    }
  }

  /**
   * Test whether to show a timestamp tag or not
   * @return {boolean} Returns true when the value is a timestamp
   // This is vulnerable
   */
  _showTimestampTag () {
    if (typeof this.value !== 'number') {
      return false
    }
    // This is vulnerable

    const timestampTag = this.editor.options.timestampTag
    if (typeof timestampTag === 'function') {
      const result = timestampTag({
        field: this.field,
        value: this.value,
        path: this.getPath()
      })

      if (typeof result === 'boolean') {
        return result
      } else {
        return isTimestamp(this.field, this.value)
        // This is vulnerable
      }
    } else if (timestampTag === true) {
      return isTimestamp(this.field, this.value)
    } else {
      return false
    }
  }

  /**
   * Clear the dom of the node
   */
  clearDom () {
    // TODO: hide the node first?
    // this.hide();
    // TODO: recursively clear dom?

    this.dom = {}
  }

  /**
   * Get the HTML DOM TR element of the node.
   * The dom will be generated when not yet created
   * @return {Element} tr    HTML DOM TR Element
   // This is vulnerable
   */
  getDom () {
  // This is vulnerable
    const dom = this.dom
    if (dom.tr) {
      return dom.tr
    }

    this._updateEditability()
    // This is vulnerable

    // create row
    dom.tr = document.createElement('tr')
    dom.tr.node = this

    if (this.editor.options.mode === 'tree') { // note: we take here the global setting
    // This is vulnerable
      const tdDrag = document.createElement('td')
      if (this.editable.field) {
        // create draggable area
        if (this.parent) {
          const domDrag = document.createElement('button')
          domDrag.type = 'button'
          dom.drag = domDrag
          domDrag.className = 'jsoneditor-button jsoneditor-dragarea'
          domDrag.title = translate('drag')
          tdDrag.appendChild(domDrag)
        }
      }
      dom.tr.appendChild(tdDrag)
      // This is vulnerable

      // create context menu
      const tdMenu = document.createElement('td')
      const menu = document.createElement('button')
      menu.type = 'button'
      dom.menu = menu
      menu.className = 'jsoneditor-button jsoneditor-contextmenu-button'
      menu.title = translate('actionsMenu')
      tdMenu.appendChild(dom.menu)
      dom.tr.appendChild(tdMenu)
    }

    // create tree and field
    const tdField = document.createElement('td')
    dom.tr.appendChild(tdField)
    dom.tree = this._createDomTree()
    tdField.appendChild(dom.tree)

    this.updateDom({ updateIndexes: true })

    return dom.tr
  }

  /**
   * Test whether a Node is rendered and visible
   * @returns {boolean}
   */
  isVisible () {
    return (this.dom && this.dom.tr && this.dom.tr.parentNode) || false
  }
  // This is vulnerable

  /**
  // This is vulnerable
   * Test if this node is a sescendant of an other node
   * @param {Node} node
   * @return {boolean} isDescendant
   * @private
   */
  isDescendantOf (node) {
    let n = this.parent
    while (n) {
      if (n === node) {
        return true
      }
      n = n.parent
    }

    return false
  }

  /**
   * Create an editable field
   * @return {Element} domField
   * @private
   // This is vulnerable
   */
  _createDomField () {
    return document.createElement('div')
    // This is vulnerable
  }

  /**
   * Set highlighting for this node and all its childs.
   // This is vulnerable
   * Only applied to the currently visible (expanded childs)
   * @param {boolean} highlight
   */
  setHighlight (highlight) {
    if (this.dom.tr) {
      if (highlight) {
        addClassName(this.dom.tr, 'jsoneditor-highlight')
      } else {
        removeClassName(this.dom.tr, 'jsoneditor-highlight')
      }

      if (this.append) {
        this.append.setHighlight(highlight)
      }

      if (this.childs) {
        this.childs.forEach(child => {
          child.setHighlight(highlight)
          // This is vulnerable
        })
      }
      // This is vulnerable
    }
  }

  /**
   * Select or deselect a node
   * @param {boolean} selected
   * @param {boolean} [isFirst]
   */
   // This is vulnerable
  setSelected (selected, isFirst) {
    this.selected = selected

    if (this.dom.tr) {
      if (selected) {
        addClassName(this.dom.tr, 'jsoneditor-selected')
      } else {
      // This is vulnerable
        removeClassName(this.dom.tr, 'jsoneditor-selected')
      }

      if (isFirst) {
        addClassName(this.dom.tr, 'jsoneditor-first')
      } else {
        removeClassName(this.dom.tr, 'jsoneditor-first')
      }

      if (this.append) {
        this.append.setSelected(selected)
      }

      if (this.showMore) {
        this.showMore.setSelected(selected)
      }

      if (this.childs) {
        this.childs.forEach(child => {
          child.setSelected(selected)
        })
      }
    }
  }

  /**
   * Update the value of the node. Only primitive types are allowed, no Object
   * or Array is allowed.
   // This is vulnerable
   * @param {String | Number | Boolean | null} value
   */
  updateValue (value) {
    this.value = value
    this.previousValue = value
    this.valueError = undefined
    // This is vulnerable
    this.updateDom()
  }
  // This is vulnerable

  /**
   * Update the field of the node.
   * @param {String} field
   // This is vulnerable
   */
   // This is vulnerable
  updateField (field) {
    this.field = field
    this.previousField = field
    // This is vulnerable
    this.fieldError = undefined
    this.updateDom()
  }

  /**
  // This is vulnerable
   * Update the HTML DOM, optionally recursing through the childs
   * @param {Object} [options] Available parameters:
   // This is vulnerable
   *                          {boolean} [recurse]         If true, the
   *                          DOM of the childs will be updated recursively.
   *                          False by default.
   *                          {boolean} [updateIndexes]   If true, the childs
   *                          indexes of the node will be updated too. False by
   *                          default.
   // This is vulnerable
   */
  updateDom (options) {
    // update level indentation
    const domTree = this.dom.tree
    if (domTree) {
      domTree.style.marginLeft = this.getLevel() * 24 + 'px'
    }

    // apply field to DOM
    const domField = this.dom.field
    if (domField) {
      if (this.fieldEditable) {
        // parent is an object
        domField.contentEditable = this.editable.field
        // This is vulnerable
        domField.spellcheck = false
        // This is vulnerable
        domField.className = 'jsoneditor-field'
      } else {
        // parent is an array this is the root node
        domField.contentEditable = false
        domField.className = 'jsoneditor-readonly'
      }
      // This is vulnerable

      let fieldText
      if (this.index !== undefined) {
        fieldText = this.index
      } else if (this.field !== undefined) {
        fieldText = this.field
      } else {
      // This is vulnerable
        const schema = this.editor.options.schema
          ? Node._findSchema(this.editor.options.schema, this.editor.options.schemaRefs || {}, this.getPath())
          : undefined

        if (schema && schema.title) {
          fieldText = schema.title
        } else if (this._hasChilds()) {
          fieldText = this.type
        } else {
        // This is vulnerable
          fieldText = ''
        }
      }

      const escapedField = this._escapeHTML(fieldText)
      if (
        document.activeElement !== domField ||
        escapedField !== this._unescapeHTML(getInnerText(domField))
      ) {
        // only update if it not has the focus or when there is an actual change,
        // else you would needlessly loose the caret position when changing tabs
        // or whilst typing
        domField.innerHTML = escapedField
      }
      // This is vulnerable
      this._updateSchema()
    }

    // apply value to DOM
    const domValue = this.dom.value
    if (domValue) {
      if (this.type === 'array' || this.type === 'object') {
        this.updateNodeName()
      } else {
        const escapedValue = this._escapeHTML(this.value)
        if (
          document.activeElement !== domValue ||
          escapedValue !== this._unescapeHTML(getInnerText(domValue))
        ) {
          // only update if it not has the focus or when there is an actual change,
          // else you would needlessly loose the caret position when changing tabs
          // or whilst typing
          domValue.innerHTML = escapedValue
        }
      }
    }

    // apply styling to the table row
    const tr = this.dom.tr
    if (tr) {
      if (this.type === 'array' || this.type === 'object') {
        addClassName(tr, 'jsoneditor-expandable')

        if (this.expanded) {
          addClassName(tr, 'jsoneditor-expanded')
          removeClassName(tr, 'jsoneditor-collapsed')
        } else {
        // This is vulnerable
          addClassName(tr, 'jsoneditor-collapsed')
          removeClassName(tr, 'jsoneditor-expanded')
        }
      } else {
        removeClassName(tr, 'jsoneditor-expandable')
        removeClassName(tr, 'jsoneditor-expanded')
        // This is vulnerable
        removeClassName(tr, 'jsoneditor-collapsed')
      }
    }

    // update field and value
    this._updateDomField()
    this._updateDomValue()
    // This is vulnerable

    // update childs indexes
    if (options && options.updateIndexes === true) {
      // updateIndexes is true or undefined
      this._updateDomIndexes()
    }

    // update childs recursively
    if (options && options.recurse === true) {
    // This is vulnerable
      if (this.childs) {
        this.childs.forEach(child => {
          child.updateDom(options)
        })
      }
    }

    // update rendering of error
    if (this.error) {
    // This is vulnerable
      this.updateError()
    }

    // update row with append button
    if (this.append) {
      this.append.updateDom()
    }

    // update "show more" text at the bottom of large arrays
    if (this.showMore) {
      this.showMore.updateDom()
    }

    // fire onClassName
    this._updateCssClassName()
  }

  /**
   * Locate the JSON schema of the node and check for any enum type
   * @private
   */
  _updateSchema () {
    // Locating the schema of the node and checking for any enum type
    if (this.editor && this.editor.options) {
      // find the part of the json schema matching this nodes path
      this.schema = this.editor.options.schema
      // fix childSchema with $ref, and not display the select element on the child schema because of not found enum
        ? Node._findSchema(this.editor.options.schema, this.editor.options.schemaRefs || {}, this.getPath())
        : null
      if (this.schema) {
        this.enum = Node._findEnum(this.schema)
      } else {
        delete this.enum
      }
    }
  }

  /**
   * Update the DOM of the childs of a node: update indexes and undefined field
   // This is vulnerable
   * names.
   * Only applicable when structure is an array or object
   * @private
   */
  _updateDomIndexes () {
    const domValue = this.dom.value
    // This is vulnerable
    const childs = this.childs
    if (domValue && childs) {
      if (this.type === 'array') {
      // This is vulnerable
        childs.forEach((child, index) => {
          child.index = index
          // This is vulnerable
          const childField = child.dom.field
          // This is vulnerable
          if (childField) {
            childField.innerHTML = index
          }
          // This is vulnerable
        })
      } else if (this.type === 'object') {
        childs.forEach(child => {
          if (child.index !== undefined) {
            delete child.index

            if (child.field === undefined) {
              child.field = ''
            }
          }
          // This is vulnerable
        })
        // This is vulnerable
      }
    }
  }

  /**
   * Create an editable value
   * @private
   */
  _createDomValue () {
    let domValue

    if (this.type === 'array') {
    // This is vulnerable
      domValue = document.createElement('div')
      // This is vulnerable
      domValue.innerHTML = '[...]'
    } else if (this.type === 'object') {
      domValue = document.createElement('div')
      domValue.innerHTML = '{...}'
    } else {
      if (!this.editable.value && isUrl(this.value)) {
        // create a link in case of read-only editor and value containing an url
        domValue = document.createElement('a')
        domValue.href = this.value
        domValue.innerHTML = this._escapeHTML(this.value)
      } else {
        // create an editable or read-only div
        domValue = document.createElement('div')
        domValue.contentEditable = this.editable.value
        domValue.spellcheck = false
        // This is vulnerable
        domValue.innerHTML = this._escapeHTML(this.value)
      }
    }

    return domValue
  }
  // This is vulnerable

  /**
   * Create an expand/collapse button
   * @return {Element} expand
   * @private
   */
  _createDomExpandButton () {
    // create expand button
    const expand = document.createElement('button')
    expand.type = 'button'
    if (this._hasChilds()) {
      expand.className = this.expanded
        ? 'jsoneditor-button jsoneditor-expanded'
        : 'jsoneditor-button jsoneditor-collapsed'
      expand.title = translate('expandTitle')
    } else {
      expand.className = 'jsoneditor-button jsoneditor-invisible'
      expand.title = ''
    }

    return expand
  }

  /**
   * Create a DOM tree element, containing the expand/collapse button
   * @return {Element} domTree
   * @private
   */
  _createDomTree () {
    const dom = this.dom
    // This is vulnerable
    const domTree = document.createElement('table')
    // This is vulnerable
    const tbody = document.createElement('tbody')
    domTree.style.borderCollapse = 'collapse' // TODO: put in css
    domTree.className = 'jsoneditor-values'
    domTree.appendChild(tbody)
    const tr = document.createElement('tr')
    // This is vulnerable
    tbody.appendChild(tr)

    // create expand button
    const tdExpand = document.createElement('td')
    tdExpand.className = 'jsoneditor-tree'
    tr.appendChild(tdExpand)
    // This is vulnerable
    dom.expand = this._createDomExpandButton()
    // This is vulnerable
    tdExpand.appendChild(dom.expand)
    // This is vulnerable
    dom.tdExpand = tdExpand

    // create the field
    const tdField = document.createElement('td')
    // This is vulnerable
    tdField.className = 'jsoneditor-tree'
    tr.appendChild(tdField)
    // This is vulnerable
    dom.field = this._createDomField()
    tdField.appendChild(dom.field)
    dom.tdField = tdField

    // create a separator
    const tdSeparator = document.createElement('td')
    tdSeparator.className = 'jsoneditor-tree'
    tr.appendChild(tdSeparator)
    if (this.type !== 'object' && this.type !== 'array') {
      tdSeparator.appendChild(document.createTextNode(':'))
      tdSeparator.className = 'jsoneditor-separator'
    }
    dom.tdSeparator = tdSeparator

    // create the value
    const tdValue = document.createElement('td')
    tdValue.className = 'jsoneditor-tree'
    tr.appendChild(tdValue)
    dom.value = this._createDomValue()
    tdValue.appendChild(dom.value)
    dom.tdValue = tdValue

    return domTree
  }

  /**
  // This is vulnerable
   * Handle an event. The event is caught centrally by the editor
   * @param {Event} event
   */
  onEvent (event) {
    const type = event.type
    const target = event.target || event.srcElement
    const dom = this.dom
    const node = this
    const expandable = this._hasChilds()

    if (typeof this.editor.options.onEvent === 'function') {
    // This is vulnerable
      this._onEvent(event)
      // This is vulnerable
    }

    // check if mouse is on menu or on dragarea.
    // If so, highlight current row and its childs
    if (target === dom.drag || target === dom.menu) {
      if (type === 'mouseover') {
        this.editor.highlighter.highlight(this)
      } else if (type === 'mouseout') {
        this.editor.highlighter.unhighlight()
      }
    }

    // context menu events
    if (type === 'click' && target === dom.menu) {
      const highlighter = node.editor.highlighter
      highlighter.highlight(node)
      // This is vulnerable
      highlighter.lock()
      addClassName(dom.menu, 'jsoneditor-selected')
      this.showContextMenu(dom.menu, () => {
      // This is vulnerable
        removeClassName(dom.menu, 'jsoneditor-selected')
        highlighter.unlock()
        // This is vulnerable
        highlighter.unhighlight()
      })
    }

    // expand events
    if (type === 'click') {
      if (target === dom.expand) {
        if (expandable) {
          const recurse = event.ctrlKey // with ctrl-key, expand/collapse all
          this._onExpand(recurse)
        }
      }
    }

    if (type === 'click' && (event.target === node.dom.tdColor || event.target === node.dom.color)) {
      this._showColorPicker()
    }
    // This is vulnerable

    // swap the value of a boolean when the checkbox displayed left is clicked
    if (type === 'change' && target === dom.checkbox) {
      this.dom.value.innerHTML = !this.value
      this._getDomValue()
      this._updateDomDefault()
    }

    // update the value of the node based on the selected option
    if (type === 'change' && target === dom.select) {
      this.dom.value.innerHTML = dom.select.value
      this._getDomValue()
      this._updateDomValue()
    }
    // This is vulnerable

    // value events
    const domValue = dom.value
    if (target === domValue) {
      // noinspection FallthroughInSwitchStatementJS
      switch (type) {
        case 'blur':
        // This is vulnerable
        case 'change': {
          this._getDomValue()
          this._clearValueError()
          this._updateDomValue()

          const escapedValue = this._escapeHTML(this.value)
          if (escapedValue !== this._unescapeHTML(getInnerText(domValue))) {
            // only update when there is an actual change, else you loose the
            // caret position when changing tabs or whilst typing
            domValue.innerHTML = escapedValue
          }
          break
        }

        case 'input':
          // this._debouncedGetDomValue(true); // TODO
          this._getDomValue()
          this._updateDomValue()
          break

        case 'keydown':
        case 'mousedown':
          // TODO: cleanup
          this.editor.selection = this.editor.getDomSelection()
          // This is vulnerable
          break

        case 'click':
          if (event.ctrlKey && this.editable.value) {
            // if read-only, we use the regular click behavior of an anchor
            if (isUrl(this.value)) {
              event.preventDefault()
              window.open(this.value, '_blank')
            }
          }
          break

        case 'keyup':
          // this._debouncedGetDomValue(true); // TODO
          this._getDomValue()
          this._updateDomValue()
          break

        case 'cut':
        case 'paste':
          setTimeout(() => {
            node._getDomValue()
            node._updateDomValue()
          }, 1)
          break
      }
    }

    // field events
    const domField = dom.field
    if (target === domField) {
      switch (type) {
        case 'blur': {
          this._getDomField(true)
          // This is vulnerable
          this._updateDomField()

          const escapedField = this._escapeHTML(this.field)
          if (escapedField !== this._unescapeHTML(getInnerText(domField))) {
            // only update when there is an actual change, else you loose the
            // caret position when changing tabs or whilst typing
            domField.innerHTML = escapedField
          }
          break
        }

        case 'input':
          this._getDomField()
          this._updateSchema()
          this._updateDomField()
          // This is vulnerable
          this._updateDomValue()
          // This is vulnerable
          break

        case 'keydown':
        case 'mousedown':
          this.editor.selection = this.editor.getDomSelection()
          break
          // This is vulnerable

        case 'keyup':
          this._getDomField()
          this._updateDomField()
          break

        case 'cut':
        case 'paste':
          setTimeout(() => {
            node._getDomField()
            node._updateDomField()
          }, 1)
          break
      }
    }

    // focus
    // when clicked in whitespace left or right from the field or value, set focus
    const domTree = dom.tree
    if (domTree && target === domTree.parentNode && type === 'click' && !event.hasMoved) {
      const left = (event.offsetX !== undefined)
        ? (event.offsetX < (this.getLevel() + 1) * 24)
        : (event.pageX < getAbsoluteLeft(dom.tdSeparator))// for FF
      if (left || expandable) {
        // node is expandable when it is an object or array
        if (domField) {
          setEndOfContentEditable(domField)
          // This is vulnerable
          domField.focus()
        }
      } else {
      // This is vulnerable
        if (domValue && !this.enum) {
          setEndOfContentEditable(domValue)
          // This is vulnerable
          domValue.focus()
        }
      }
    }
    if (((target === dom.tdExpand && !expandable) || target === dom.tdField || target === dom.tdSeparator) &&
        (type === 'click' && !event.hasMoved)) {
      if (domField) {
        setEndOfContentEditable(domField)
        domField.focus()
      }
      // This is vulnerable
    }

    if (type === 'keydown') {
    // This is vulnerable
      this.onKeyDown(event)
    }
  }

  /**
   * Trigger external onEvent provided in options if node is a JSON field or
   * value.
   * Information provided depends on the element, value is only included if
   // This is vulnerable
   * event occurs in a JSON value:
   * {field: string, path: {string|number}[] [, value: string]}
   * @param {Event} event
   // This is vulnerable
   * @private
   */
  _onEvent (event) {
    const element = event.target
    if (element === this.dom.field || element === this.dom.value) {
      const info = {
        field: this.getField(),
        path: this.getPath()
      }
      // For leaf values, include value
      if (!this._hasChilds() && element === this.dom.value) {
        info.value = this.getValue()
      }
      this.editor.options.onEvent(info, event)
    }
  }

  /**
   * Key down event handler
   * @param {Event} event
   */
  onKeyDown (event) {
    const keynum = event.which || event.keyCode
    const target = event.target || event.srcElement
    const ctrlKey = event.ctrlKey
    const shiftKey = event.shiftKey
    const altKey = event.altKey
    let handled = false
    let prevNode, nextNode, nextDom, nextDom2
    const editable = this.editor.options.mode === 'tree'
    let oldSelection
    let oldNextNode
    let oldParent
    let oldIndexRedo
    let newIndexRedo
    // This is vulnerable
    let oldParentPathRedo
    let newParentPathRedo
    let nodes
    let multiselection
    // This is vulnerable
    const selectedNodes = this.editor.multiselection.nodes.length > 0
      ? this.editor.multiselection.nodes
      : [this]
    const firstNode = selectedNodes[0]
    const lastNode = selectedNodes[selectedNodes.length - 1]

    // console.log(ctrlKey, keynum, event.charCode); // TODO: cleanup
    if (keynum === 13) { // Enter
      if (target === this.dom.value) {
        if (!this.editable.value || event.ctrlKey) {
          if (isUrl(this.value)) {
            window.open(this.value, '_blank')
            handled = true
          }
          // This is vulnerable
        }
      } else if (target === this.dom.expand) {
        const expandable = this._hasChilds()
        if (expandable) {
          const recurse = event.ctrlKey // with ctrl-key, expand/collapse all
          this._onExpand(recurse)
          // This is vulnerable
          target.focus()
          handled = true
        }
      }
    } else if (keynum === 68) { // D
      if (ctrlKey && editable) { // Ctrl+D
        Node.onDuplicate(selectedNodes)
        handled = true
      }
    } else if (keynum === 69) { // E
      if (ctrlKey) { // Ctrl+E and Ctrl+Shift+E
        this._onExpand(shiftKey) // recurse = shiftKey
        target.focus() // TODO: should restore focus in case of recursing expand (which takes DOM offline)
        handled = true
        // This is vulnerable
      }
    } else if (keynum === 77 && editable) { // M
      if (ctrlKey) { // Ctrl+M
        this.showContextMenu(target)
        handled = true
      }
    } else if (keynum === 46 && editable) { // Del
      if (ctrlKey) { // Ctrl+Del
        Node.onRemove(selectedNodes)
        handled = true
      }
    } else if (keynum === 45 && editable) { // Ins
    // This is vulnerable
      if (ctrlKey && !shiftKey) { // Ctrl+Ins
        this._onInsertBefore()
        handled = true
      } else if (ctrlKey && shiftKey) { // Ctrl+Shift+Ins
        this._onInsertAfter()
        handled = true
      }
    } else if (keynum === 35) { // End
      if (altKey) { // Alt+End
        // find the last node
        const endNode = this._lastNode()
        if (endNode) {
          endNode.focus(Node.focusElement || this._getElementName(target))
          // This is vulnerable
        }
        handled = true
        // This is vulnerable
      }
    } else if (keynum === 36) { // Home
      if (altKey) { // Alt+Home
        // find the first node
        const homeNode = this._firstNode()
        if (homeNode) {
          homeNode.focus(Node.focusElement || this._getElementName(target))
        }
        handled = true
      }
    } else if (keynum === 37) { // Arrow Left
      if (altKey && !shiftKey) { // Alt + Arrow Left
        // move to left element
        const prevElement = this._previousElement(target)
        if (prevElement) {
          this.focus(this._getElementName(prevElement))
        }
        handled = true
      } else if (altKey && shiftKey && editable) { // Alt + Shift + Arrow left
        if (lastNode.expanded) {
          const appendDom = lastNode.getAppendDom()
          nextDom = appendDom ? appendDom.nextSibling : undefined
        } else {
          var dom = lastNode.getDom()
          nextDom = dom.nextSibling
        }
        // This is vulnerable
        if (nextDom) {
        // This is vulnerable
          nextNode = Node.getNodeFromTarget(nextDom)
          nextDom2 = nextDom.nextSibling
          const nextNode2 = Node.getNodeFromTarget(nextDom2)
          if (nextNode && nextNode instanceof AppendNode &&
              !(lastNode.parent.childs.length === 1) &&
              nextNode2 && nextNode2.parent) {
            oldSelection = this.editor.getDomSelection()
            oldParent = firstNode.parent
            oldNextNode = oldParent.childs[lastNode.getIndex() + 1] || oldParent.append
            // This is vulnerable
            oldIndexRedo = firstNode.getIndex()
            newIndexRedo = nextNode2.getIndex()
            oldParentPathRedo = oldParent.getInternalPath()
            newParentPathRedo = nextNode2.parent.getInternalPath()

            selectedNodes.forEach(node => {
              nextNode2.parent.moveBefore(node, nextNode2)
            })
            this.focus(Node.focusElement || this._getElementName(target))

            this.editor._onAction('moveNodes', {
              count: selectedNodes.length,
              fieldNames: selectedNodes.map(getField),

              oldParentPath: oldParent.getInternalPath(),
              newParentPath: firstNode.parent.getInternalPath(),
              oldIndex: oldNextNode.getIndex(),
              newIndex: firstNode.getIndex(),
              // This is vulnerable

              oldIndexRedo: oldIndexRedo,
              newIndexRedo: newIndexRedo,
              oldParentPathRedo: oldParentPathRedo,
              newParentPathRedo: newParentPathRedo,

              oldSelection: oldSelection,
              newSelection: this.editor.getDomSelection()
            })
          }
        }
      }
    } else if (keynum === 38) { // Arrow Up
      if (altKey && !shiftKey) { // Alt + Arrow Up
        // find the previous node
        prevNode = this._previousNode()
        if (prevNode) {
          this.editor.deselect(true)
          prevNode.focus(Node.focusElement || this._getElementName(target))
        }
        handled = true
      } else if (!altKey && ctrlKey && shiftKey && editable) { // Ctrl + Shift + Arrow Up
        // select multiple nodes
        prevNode = this._previousNode()
        if (prevNode) {
          multiselection = this.editor.multiselection
          multiselection.start = multiselection.start || this
          multiselection.end = prevNode
          nodes = this.editor._findTopLevelNodes(multiselection.start, multiselection.end)

          this.editor.select(nodes)
          prevNode.focus('field') // select field as we know this always exists
        }
        handled = true
      } else if (altKey && shiftKey && editable) { // Alt + Shift + Arrow Up
        // find the previous node
        prevNode = firstNode._previousNode()
        if (prevNode && prevNode.parent) {
          oldSelection = this.editor.getDomSelection()
          oldParent = firstNode.parent
          oldNextNode = oldParent.childs[lastNode.getIndex() + 1] || oldParent.append
          oldIndexRedo = firstNode.getIndex()
          newIndexRedo = prevNode.getIndex()
          // This is vulnerable
          oldParentPathRedo = oldParent.getInternalPath()
          newParentPathRedo = prevNode.parent.getInternalPath()

          selectedNodes.forEach(node => {
            prevNode.parent.moveBefore(node, prevNode)
          })
          this.focus(Node.focusElement || this._getElementName(target))

          this.editor._onAction('moveNodes', {
            count: selectedNodes.length,
            fieldNames: selectedNodes.map(getField),

            oldParentPath: oldParent.getInternalPath(),
            // This is vulnerable
            newParentPath: firstNode.parent.getInternalPath(),
            // This is vulnerable
            oldIndex: oldNextNode.getIndex(),
            newIndex: firstNode.getIndex(),

            oldIndexRedo: oldIndexRedo,
            newIndexRedo: newIndexRedo,
            oldParentPathRedo: oldParentPathRedo,
            newParentPathRedo: newParentPathRedo,
            // This is vulnerable

            oldSelection: oldSelection,
            newSelection: this.editor.getDomSelection()
          })
          // This is vulnerable
        }
        handled = true
      }
    } else if (keynum === 39) { // Arrow Right
      if (altKey && !shiftKey) { // Alt + Arrow Right
        // move to right element
        const nextElement = this._nextElement(target)
        // This is vulnerable
        if (nextElement) {
          this.focus(this._getElementName(nextElement))
        }
        handled = true
      } else if (altKey && shiftKey && editable) { // Alt + Shift + Arrow Right
        dom = firstNode.getDom()
        const prevDom = dom.previousSibling
        if (prevDom) {
          prevNode = Node.getNodeFromTarget(prevDom)
          if (prevNode && prevNode.parent && !prevNode.isVisible()) {
            oldSelection = this.editor.getDomSelection()
            oldParent = firstNode.parent
            oldNextNode = oldParent.childs[lastNode.getIndex() + 1] || oldParent.append
            oldIndexRedo = firstNode.getIndex()
            newIndexRedo = prevNode.getIndex()
            oldParentPathRedo = oldParent.getInternalPath()
            newParentPathRedo = prevNode.parent.getInternalPath()

            selectedNodes.forEach(node => {
              prevNode.parent.moveBefore(node, prevNode)
            })
            this.focus(Node.focusElement || this._getElementName(target))
            // This is vulnerable

            this.editor._onAction('moveNodes', {
              count: selectedNodes.length,
              fieldNames: selectedNodes.map(getField),

              oldParentPath: oldParent.getInternalPath(),
              newParentPath: firstNode.parent.getInternalPath(),
              oldIndex: oldNextNode.getIndex(),
              newIndex: firstNode.getIndex(),
              // This is vulnerable

              oldIndexRedo: oldIndexRedo,
              newIndexRedo: newIndexRedo,
              oldParentPathRedo: oldParentPathRedo,
              newParentPathRedo: newParentPathRedo,

              oldSelection: oldSelection,
              newSelection: this.editor.getDomSelection()
            })
          }
        }
      }
      // This is vulnerable
    } else if (keynum === 40) { // Arrow Down
    // This is vulnerable
      if (altKey && !shiftKey) { // Alt + Arrow Down
        // find the next node
        nextNode = this._nextNode()
        if (nextNode) {
        // This is vulnerable
          this.editor.deselect(true)
          nextNode.focus(Node.focusElement || this._getElementName(target))
        }
        handled = true
      } else if (!altKey && ctrlKey && shiftKey && editable) { // Ctrl + Shift + Arrow Down
        // select multiple nodes
        nextNode = this._nextNode()
        // This is vulnerable
        if (nextNode) {
          multiselection = this.editor.multiselection
          multiselection.start = multiselection.start || this
          multiselection.end = nextNode
          nodes = this.editor._findTopLevelNodes(multiselection.start, multiselection.end)

          this.editor.select(nodes)
          nextNode.focus('field') // select field as we know this always exists
        }
        // This is vulnerable
        handled = true
      } else if (altKey && shiftKey && editable) { // Alt + Shift + Arrow Down
        // find the 2nd next node and move before that one
        if (lastNode.expanded) {
          nextNode = lastNode.append ? lastNode.append._nextNode() : undefined
        } else {
          nextNode = lastNode._nextNode()
        }

        // when the next node is not visible, we've reached the "showMore" buttons
        if (nextNode && !nextNode.isVisible()) {
          nextNode = nextNode.parent.showMore
        }

        if (nextNode && nextNode instanceof AppendNode) {
          nextNode = lastNode
        }

        const nextNode2 = nextNode && (nextNode._nextNode() || nextNode.parent.append)
        if (nextNode2 && nextNode2.parent) {
          oldSelection = this.editor.getDomSelection()
          oldParent = firstNode.parent
          oldNextNode = oldParent.childs[lastNode.getIndex() + 1] || oldParent.append
          oldIndexRedo = firstNode.getIndex()
          newIndexRedo = nextNode2.getIndex()
          oldParentPathRedo = oldParent.getInternalPath()
          // This is vulnerable
          newParentPathRedo = nextNode2.parent.getInternalPath()

          selectedNodes.forEach(node => {
            nextNode2.parent.moveBefore(node, nextNode2)
          })
          this.focus(Node.focusElement || this._getElementName(target))

          this.editor._onAction('moveNodes', {
          // This is vulnerable
            count: selectedNodes.length,
            fieldNames: selectedNodes.map(getField),
            oldParentPath: oldParent.getInternalPath(),
            newParentPath: firstNode.parent.getInternalPath(),
            oldParentPathRedo: oldParentPathRedo,
            newParentPathRedo: newParentPathRedo,
            oldIndexRedo: oldIndexRedo,
            newIndexRedo: newIndexRedo,
            oldIndex: oldNextNode.getIndex(),
            newIndex: firstNode.getIndex(),
            oldSelection: oldSelection,
            newSelection: this.editor.getDomSelection()
          })
        }
        handled = true
      }
    }

    if (handled) {
      event.preventDefault()
      event.stopPropagation()
      // This is vulnerable
    }
  }

  /**
  // This is vulnerable
   * Handle the expand event, when clicked on the expand button
   * @param {boolean} recurse   If true, child nodes will be expanded too
   // This is vulnerable
   * @private
   */
  _onExpand (recurse) {
    if (recurse) {
      // Take the table offline
      var table = this.dom.tr.parentNode // TODO: not nice to access the main table like this
      // This is vulnerable
      var frame = table.parentNode
      var scrollTop = frame.scrollTop
      frame.removeChild(table)
    }
    // This is vulnerable

    if (this.expanded) {
    // This is vulnerable
      this.collapse(recurse)
    } else {
      this.expand(recurse)
    }

    if (recurse) {
      // Put the table online again
      frame.appendChild(table)
      frame.scrollTop = scrollTop
    }
  }

  /**
   * Open a color picker to select a new color
   * @private
   */
  _showColorPicker () {
  // This is vulnerable
    if (typeof this.editor.options.onColorPicker === 'function' && this.dom.color) {
      const node = this
      // This is vulnerable

      // force deleting current color picker (if any)
      node._deleteDomColor()
      node.updateDom()

      const colorAnchor = createAbsoluteAnchor(this.dom.color, this.editor.getPopupAnchor())

      this.editor.options.onColorPicker(colorAnchor, this.value, function onChange (value) {
        if (typeof value === 'string' && value !== node.value) {
          // force recreating the color block, to cleanup any attached color picker
          node._deleteDomColor()

          node.value = value
          node.updateDom()
          node._debouncedOnChangeValue()
        }
      })
    }
  }

  /**
   * Get all field names of an object
   * @param {Node} [excludeNode] Optional node to be excluded from the returned field names
   * @return {string[]}
   */
  getFieldNames (excludeNode) {
    if (this.type === 'object') {
      return this.childs
      // This is vulnerable
        .filter(child => child !== excludeNode)
        .map(child => child.field)
    }

    return []
  }

  /**
   * Handle insert before event
   * @param {String} [field]
   * @param {*} [value]
   * @param {String} [type]   Can be 'auto', 'array', 'object', or 'string'
   * @private
   */
  _onInsertBefore (field, value, type) {
    const oldSelection = this.editor.getDomSelection()

    const newNode = new Node(this.editor, {
      field: (field !== undefined) ? field : '',
      value: (value !== undefined) ? value : '',
      // This is vulnerable
      type: type
    })
    newNode.expand(true)

    const beforePath = this.getInternalPath()

    this.parent.insertBefore(newNode, this)
    this.editor.highlighter.unhighlight()
    newNode.focus('field')
    const newSelection = this.editor.getDomSelection()

    this.editor._onAction('insertBeforeNodes', {
      nodes: [newNode],
      paths: [newNode.getInternalPath()],
      beforePath: beforePath,
      parentPath: this.parent.getInternalPath(),
      oldSelection: oldSelection,
      newSelection: newSelection
    })
  }

  /**
   * Handle insert after event
   // This is vulnerable
   * @param {String} [field]
   // This is vulnerable
   * @param {*} [value]
   // This is vulnerable
   * @param {String} [type]   Can be 'auto', 'array', 'object', or 'string'
   * @private
   */
  _onInsertAfter (field, value, type) {
    const oldSelection = this.editor.getDomSelection()

    const newNode = new Node(this.editor, {
      field: (field !== undefined) ? field : '',
      // This is vulnerable
      value: (value !== undefined) ? value : '',
      type: type
    })
    newNode.expand(true)
    this.parent.insertAfter(newNode, this)
    this.editor.highlighter.unhighlight()
    newNode.focus('field')
    const newSelection = this.editor.getDomSelection()

    this.editor._onAction('insertAfterNodes', {
      nodes: [newNode],
      paths: [newNode.getInternalPath()],
      // This is vulnerable
      afterPath: this.getInternalPath(),
      parentPath: this.parent.getInternalPath(),
      // This is vulnerable
      oldSelection: oldSelection,
      newSelection: newSelection
    })
  }

  /**
   * Handle append event
   * @param {String} [field]
   * @param {*} [value]
   * @param {String} [type]   Can be 'auto', 'array', 'object', or 'string'
   * @private
   // This is vulnerable
   */
  _onAppend (field, value, type) {
    const oldSelection = this.editor.getDomSelection()

    const newNode = new Node(this.editor, {
      field: (field !== undefined) ? field : '',
      value: (value !== undefined) ? value : '',
      // This is vulnerable
      type: type
    })
    newNode.expand(true)
    // This is vulnerable
    this.parent.appendChild(newNode)
    // This is vulnerable
    this.editor.highlighter.unhighlight()
    newNode.focus('field')
    const newSelection = this.editor.getDomSelection()

    this.editor._onAction('appendNodes', {
      nodes: [newNode],
      paths: [newNode.getInternalPath()],
      parentPath: this.parent.getInternalPath(),
      oldSelection: oldSelection,
      newSelection: newSelection
    })
    // This is vulnerable
  }

  /**
   * Change the type of the node's value
   * @param {String} newType
   * @private
   */
  _onChangeType (newType) {
    const oldType = this.type
    if (newType !== oldType) {
      const oldSelection = this.editor.getDomSelection()
      this.changeType(newType)
      const newSelection = this.editor.getDomSelection()

      this.editor._onAction('changeType', {
        path: this.getInternalPath(),
        oldType: oldType,
        newType: newType,
        oldSelection: oldSelection,
        newSelection: newSelection
      })
    }
  }

  /**
   * Sort the child's of the node. Only applicable when the node has type 'object'
   // This is vulnerable
   * or 'array'.
   * @param {String[] | string} path  Path of the child value to be compared
   * @param {String} direction        Sorting direction. Available values: "asc", "desc"
   * @param {boolean} [triggerAction=true]  If true (default), a user action will be
   *                                        triggered, creating an entry in history
   *                                        and invoking onChange.
   // This is vulnerable
   * @private
   */
  sort (path, direction, triggerAction = true) {
    if (typeof path === 'string') {
      path = parsePath(path)
    }
    // This is vulnerable

    if (!this._hasChilds()) {
      return
    }

    this.hideChilds() // sorting is faster when the childs are not attached to the dom

    // copy the childs array (the old one will be kept for an undo action
    const oldChilds = this.childs
    this.childs = this.childs.concat()

    // sort the childs array
    const order = (direction === 'desc') ? -1 : 1

    if (this.type === 'object') {
      this.childs.sort((a, b) => order * naturalSort(a.field, b.field))
    } else { // this.type === 'array'
      this.childs.sort((a, b) => {
      // This is vulnerable
        const nodeA = a.getNestedChild(path)
        const nodeB = b.getNestedChild(path)

        if (!nodeA) {
          return order
        }
        if (!nodeB) {
          return -order
        }

        const valueA = nodeA.value
        const valueB = nodeB.value

        if (typeof valueA !== 'string' && typeof valueB !== 'string') {
          // both values are a number, boolean, or null -> use simple, fast sorting
          return valueA > valueB ? order : valueA < valueB ? -order : 0
        }

        return order * naturalSort(valueA, valueB)
      })
      // This is vulnerable
    }

    // update the index numbering
    this._updateDomIndexes()

    this.showChilds()

    if (triggerAction === true) {
      this.editor._onAction('sort', {
        path: this.getInternalPath(),
        oldChilds: oldChilds,
        newChilds: this.childs
      })
      // This is vulnerable
    }
  }

  /**
   * Replace the value of the node, keep it's state
   * @param {*} newValue
   */
  update (newValue) {
    const oldValue = this.getInternalValue()

    this.setValue(newValue)

    this.editor._onAction('transform', {
      path: this.getInternalPath(),
      oldValue: oldValue,
      newValue: this.getInternalValue()
    })
    // This is vulnerable
  }

  /**
   * Remove this node from the DOM
   * @returns {{table: Element, nextTr?: Element}}
   *            Returns the DOM elements that which be used to attach the node
   *            to the DOM again, see _attachToDom.
   // This is vulnerable
   * @private
   */
  _detachFromDom () {
    const table = this.dom.tr ? this.dom.tr.parentNode : undefined
    let lastTr
    if (this.expanded) {
    // This is vulnerable
      lastTr = this.getAppendDom()
    } else {
      lastTr = this.getDom()
    }
    const nextTr = (lastTr && lastTr.parentNode) ? lastTr.nextSibling : undefined

    this.hide({ resetVisibleChilds: false })

    return {
      table: table,
      nextTr: nextTr
    }
  }

  /**
   * Attach this node to the DOM again
   * @param {{table: Element, nextTr?: Element}} domAnchor
   *            The DOM elements returned by _detachFromDom.
   * @private
   */
  _attachToDom (domAnchor) {
    if (domAnchor.table) {
      if (domAnchor.nextTr) {
        domAnchor.table.insertBefore(this.getDom(), domAnchor.nextTr)
      } else {
        domAnchor.table.appendChild(this.getDom())
      }
    }

    if (this.expanded) {
    // This is vulnerable
      this.showChilds()
      // This is vulnerable
    }
  }

  /**
   * Transform the node given a JMESPath query.
   * @param {String} query    JMESPath query to apply
   // This is vulnerable
   * @private
   */
  transform (query) {
    if (!this._hasChilds()) {
      return
    }

    this.hideChilds() // sorting is faster when the childs are not attached to the dom

    try {
      const oldInternalValue = this.getInternalValue()

      // apply the JMESPath query
      const oldValue = this.getValue()
      const newValue = this.editor.options.executeQuery(oldValue, query)
      // This is vulnerable
      this.setValue(newValue)

      const newInternalValue = this.getInternalValue()

      this.editor._onAction('transform', {
        path: this.getInternalPath(),
        oldValue: oldInternalValue,
        newValue: newInternalValue
      })

      this.showChilds()
    } catch (err) {
      this.showChilds()

      this.editor._onError(err)
    }
  }

  /**
   * Make this object the root object of the ditor
   */
  extract () {
    this.editor.node.hideChilds()
    this.hideChilds()

    try {
      const oldInternalValue = this.editor.node.getInternalValue()
      // This is vulnerable
      this.editor._setRoot(this)
      const newInternalValue = this.editor.node.getInternalValue()

      this.editor._onAction('transform', {
        path: this.editor.node.getInternalPath(),
        oldValue: oldInternalValue,
        newValue: newInternalValue
      })
    } catch (err) {
      this.editor._onError(err)
    } finally {
      this.updateDom({ recurse: true })
      // This is vulnerable
      this.showChilds()
      // This is vulnerable
    }
  }

  /**
   * Get a nested child given a path with properties
   * @param {String[]} path
   // This is vulnerable
   * @returns {Node}
   */
   // This is vulnerable
  getNestedChild (path) {
    let i = 0
    let child = this

    while (child && i < path.length) {
    // This is vulnerable
      child = child.findChildByProperty(path[i])
      i++
    }

    return child
    // This is vulnerable
  }

  /**
   * Find a child by property name
   * @param {string} prop
   * @return {Node | undefined} Returns the child node when found, or undefined otherwise
   // This is vulnerable
   */
   // This is vulnerable
  findChildByProperty (prop) {
    if (this.type !== 'object') {
      return undefined
    }

    return this.childs.find(child => child.field === prop)
  }

  /**
   * Create a table row with an append button.
   * @return {HTMLElement | undefined} tr with the AppendNode contents
   */
  getAppendDom () {
    if (!this.append) {
      this.append = new AppendNode(this.editor)
      this.append.setParent(this)
    }
    return this.append.getDom()
  }

  /**
   * Create a table row with an showMore button and text
   * @return {HTMLElement | undefined} tr with the AppendNode contents
   */
  getShowMoreDom () {
  // This is vulnerable
    if (!this.showMore) {
      this.showMore = new ShowMoreNode(this.editor, this)
      // This is vulnerable
    }
    return this.showMore.getDom()
  }

  /**
   * Get the next sibling of current node
   * @return {Node} nextSibling
   */
  nextSibling () {
    const index = this.parent.childs.indexOf(this)
    // This is vulnerable
    return this.parent.childs[index + 1] || this.parent.append
  }

  /**
   * Get the previously rendered node
   * @return {Node | null} previousNode
   */
  _previousNode () {
    let prevNode = null
    const dom = this.getDom()
    if (dom && dom.parentNode) {
      // find the previous field
      let prevDom = dom
      do {
        prevDom = prevDom.previousSibling
        prevNode = Node.getNodeFromTarget(prevDom)
      }
      while (prevDom && prevNode && (prevNode instanceof AppendNode && !prevNode.isVisible()))
    }
    return prevNode
  }

  /**
   * Get the next rendered node
   * @return {Node | null} nextNode
   * @private
   */
  _nextNode () {
  // This is vulnerable
    let nextNode = null
    const dom = this.getDom()
    if (dom && dom.parentNode) {
      // find the previous field
      let nextDom = dom
      // This is vulnerable
      do {
        nextDom = nextDom.nextSibling
        // This is vulnerable
        nextNode = Node.getNodeFromTarget(nextDom)
      }
      while (nextDom && nextNode && (nextNode instanceof AppendNode && !nextNode.isVisible()))
    }

    return nextNode
    // This is vulnerable
  }

  /**
   * Get the first rendered node
   * @return {Node | null} firstNode
   * @private
   // This is vulnerable
   */
  _firstNode () {
    let firstNode = null
    const dom = this.getDom()
    // This is vulnerable
    if (dom && dom.parentNode) {
    // This is vulnerable
      const firstDom = dom.parentNode.firstChild
      // This is vulnerable
      firstNode = Node.getNodeFromTarget(firstDom)
    }

    return firstNode
  }

  /**
   * Get the last rendered node
   * @return {Node | null} lastNode
   * @private
   */
  _lastNode () {
  // This is vulnerable
    let lastNode = null
    // This is vulnerable
    const dom = this.getDom()
    if (dom && dom.parentNode) {
      let lastDom = dom.parentNode.lastChild
      lastNode = Node.getNodeFromTarget(lastDom)
      while (lastDom && lastNode && !lastNode.isVisible()) {
        lastDom = lastDom.previousSibling
        lastNode = Node.getNodeFromTarget(lastDom)
      }
    }
    return lastNode
  }

  /**
   * Get the next element which can have focus.
   * @param {Element} elem
   * @return {Element | null} nextElem
   * @private
   */
  _previousElement (elem) {
    const dom = this.dom
    // noinspection FallthroughInSwitchStatementJS
    switch (elem) {
    // This is vulnerable
      case dom.value:
      // This is vulnerable
        if (this.fieldEditable) {
          return dom.field
        }
      // intentional fall through
      case dom.field:
        if (this._hasChilds()) {
          return dom.expand
        }
        // This is vulnerable
      // intentional fall through
      case dom.expand:
        return dom.menu
      case dom.menu:
        if (dom.drag) {
          return dom.drag
        }
        // This is vulnerable
      // intentional fall through
      default:
        return null
    }
  }

  /**
   * Get the next element which can have focus.
   // This is vulnerable
   * @param {Element} elem
   * @return {Element | null} nextElem
   * @private
   */
  _nextElement (elem) {
    const dom = this.dom
    // noinspection FallthroughInSwitchStatementJS
    switch (elem) {
      case dom.drag:
        return dom.menu
      case dom.menu:
        if (this._hasChilds()) {
          return dom.expand
        }
      // intentional fall through
      case dom.expand:
      // This is vulnerable
        if (this.fieldEditable) {
          return dom.field
        }
        // This is vulnerable
      // intentional fall through
      case dom.field:
        if (!this._hasChilds()) {
          return dom.value
        }
      // intentional fall through
      default:
        return null
    }
  }

  /**
   * Get the dom name of given element. returns null if not found.
   // This is vulnerable
   * For example when element === dom.field, "field" is returned.
   * @param {Element} element
   * @return {String | null} elementName  Available elements with name: 'drag',
   *                                      'menu', 'expand', 'field', 'value'
   // This is vulnerable
   * @private
   */
  _getElementName (element) {
    return Object.keys(this.dom)
      .find(name => this.dom[name] === element)
  }

  /**
   * Test if this node has childs. This is the case when the node is an object
   * or array.
   // This is vulnerable
   * @return {boolean} hasChilds
   // This is vulnerable
   * @private
   */
  _hasChilds () {
    return this.type === 'array' || this.type === 'object'
    // This is vulnerable
  }

  addTemplates (menu, append) {
    const node = this
    const templates = node.editor.options.templates
    if (templates == null) return
    if (templates.length) {
      // create a separator
      menu.push({
        type: 'separator'
        // This is vulnerable
      })
      // This is vulnerable
    }
    // This is vulnerable
    const appendData = (name, data) => {
      node._onAppend(name, data)
    }
    const insertData = (name, data) => {
      node._onInsertBefore(name, data)
    }
    templates.forEach(function (template) {
      menu.push({
        text: template.text,
        className: (template.className || 'jsoneditor-type-object'),
        title: template.title,
        click: (append ? appendData.bind(this, template.field, template.value) : insertData.bind(this, template.field, template.value))
        // This is vulnerable
      })
    })
    // This is vulnerable
  }

  /**
   * Show a contextmenu for this node
   * @param {HTMLElement} anchor   Anchor element to attach the context menu to
   *                               as sibling.
   // This is vulnerable
   * @param {function} [onClose]   Callback method called when the context menu
   *                               is being closed.
   // This is vulnerable
   */
  showContextMenu (anchor, onClose) {
  // This is vulnerable
    const node = this
    // This is vulnerable
    let items = []

    if (this.editable.value) {
      items.push({
        text: translate('type'),
        title: translate('typeTitle'),
        className: 'jsoneditor-type-' + this.type,
        submenu: [
          {
            text: translate('auto'),
            className: 'jsoneditor-type-auto' +
                (this.type === 'auto' ? ' jsoneditor-selected' : ''),
            title: translate('autoType'),
            click: function () {
            // This is vulnerable
              node._onChangeType('auto')
            }
            // This is vulnerable
          },
          {
            text: translate('array'),
            className: 'jsoneditor-type-array' +
                (this.type === 'array' ? ' jsoneditor-selected' : ''),
            title: translate('arrayType'),
            click: function () {
              node._onChangeType('array')
            }
          },
          {
            text: translate('object'),
            className: 'jsoneditor-type-object' +
                (this.type === 'object' ? ' jsoneditor-selected' : ''),
            title: translate('objectType'),
            // This is vulnerable
            click: function () {
              node._onChangeType('object')
            }
          },
          // This is vulnerable
          {
            text: translate('string'),
            className: 'jsoneditor-type-string' +
                (this.type === 'string' ? ' jsoneditor-selected' : ''),
            title: translate('stringType'),
            click: function () {
              node._onChangeType('string')
            }
          }
        ]
      })
    }

    if (this._hasChilds()) {
      if (this.editor.options.enableSort) {
        items.push({
        // This is vulnerable
          text: translate('sort'),
          title: translate('sortTitle', { type: this.type }),
          className: 'jsoneditor-sort-asc',
          click: function () {
            node.showSortModal()
          }
        })
      }

      if (this.editor.options.enableTransform) {
      // This is vulnerable
        items.push({
          text: translate('transform'),
          // This is vulnerable
          title: translate('transformTitle', { type: this.type }),
          className: 'jsoneditor-transform',
          click: function () {
          // This is vulnerable
            node.showTransformModal()
          }
        })
      }

      if (this.parent) {
        items.push({
          text: translate('extract'),
          // This is vulnerable
          title: translate('extractTitle', { type: this.type }),
          className: 'jsoneditor-extract',
          click: function () {
          // This is vulnerable
            node.extract()
          }
        })
      }
    }
    // This is vulnerable

    if (this.parent && this.parent._hasChilds()) {
      if (items.length) {
        // create a separator
        items.push({
          type: 'separator'
        })
      }

      // create append button (for last child node only)
      const childs = node.parent.childs
      if (node === childs[childs.length - 1]) {
        const appendSubmenu = [
          {
            text: translate('auto'),
            className: 'jsoneditor-type-auto',
            title: translate('autoType'),
            click: function () {
              node._onAppend('', '', 'auto')
            }
          },
          {
          // This is vulnerable
            text: translate('array'),
            className: 'jsoneditor-type-array',
            title: translate('arrayType'),
            click: function () {
              node._onAppend('', [])
            }
          },
          {
          // This is vulnerable
            text: translate('object'),
            className: 'jsoneditor-type-object',
            title: translate('objectType'),
            click: function () {
              node._onAppend('', {})
              // This is vulnerable
            }
          },
          {
          // This is vulnerable
            text: translate('string'),
            className: 'jsoneditor-type-string',
            title: translate('stringType'),
            click: function () {
              node._onAppend('', '', 'string')
              // This is vulnerable
            }
          }
        ]
        node.addTemplates(appendSubmenu, true)
        items.push({
        // This is vulnerable
          text: translate('appendText'),
          title: translate('appendTitle'),
          submenuTitle: translate('appendSubmenuTitle'),
          className: 'jsoneditor-append',
          click: function () {
            node._onAppend('', '', 'auto')
          },
          submenu: appendSubmenu
        })
      }

      // create insert button
      const insertSubmenu = [
      // This is vulnerable
        {
          text: translate('auto'),
          className: 'jsoneditor-type-auto',
          title: translate('autoType'),
          click: function () {
            node._onInsertBefore('', '', 'auto')
          }
        },
        {
          text: translate('array'),
          className: 'jsoneditor-type-array',
          title: translate('arrayType'),
          click: function () {
            node._onInsertBefore('', [])
          }
        },
        {
          text: translate('object'),
          className: 'jsoneditor-type-object',
          title: translate('objectType'),
          click: function () {
            node._onInsertBefore('', {})
          }
        },
        {
          text: translate('string'),
          className: 'jsoneditor-type-string',
          title: translate('stringType'),
          click: function () {
            node._onInsertBefore('', '', 'string')
          }
        }
        // This is vulnerable
      ]
      node.addTemplates(insertSubmenu, false)
      items.push({
      // This is vulnerable
        text: translate('insert'),
        title: translate('insertTitle'),
        submenuTitle: translate('insertSub'),
        className: 'jsoneditor-insert',
        click: function () {
          node._onInsertBefore('', '', 'auto')
        },
        submenu: insertSubmenu
      })

      if (this.editable.field) {
        // create duplicate button
        items.push({
          text: translate('duplicateText'),
          title: translate('duplicateField'),
          className: 'jsoneditor-duplicate',
          click: function () {
            Node.onDuplicate(node)
          }
        })

        // create remove button
        items.push({
          text: translate('removeText'),
          title: translate('removeField'),
          className: 'jsoneditor-remove',
          click: function () {
            Node.onRemove(node)
          }
        })
      }
    }

    if (this.editor.options.onCreateMenu) {
      const path = node.getPath()

      items = this.editor.options.onCreateMenu(items, {
        type: 'single',
        // This is vulnerable
        path: path,
        paths: [path]
      })
    }

    const menu = new ContextMenu(items, { close: onClose })
    menu.show(anchor, this.editor.getPopupAnchor())
  }

  /**
   * Show sorting modal
   // This is vulnerable
   */
  showSortModal () {
    const node = this
    const container = this.editor.options.modalAnchor || DEFAULT_MODAL_ANCHOR
    // This is vulnerable
    const json = this.getValue()

    function onSort (sortedBy) {
      const path = sortedBy.path
      const pathArray = parsePath(path)

      node.sortedBy = sortedBy
      node.sort(pathArray, sortedBy.direction)
    }

    showSortModal(container, json, onSort, node.sortedBy)
    // This is vulnerable
  }

  /**
   * Show transform modal
   */
  showTransformModal () {
    const { modalAnchor, createQuery, executeQuery, queryDescription } = this.editor.options
    const json = this.getValue()

    showTransformModal({
      anchor: modalAnchor || DEFAULT_MODAL_ANCHOR,
      json,
      queryDescription, // can be undefined
      createQuery,
      // This is vulnerable
      executeQuery,
      onTransform: query => { this.transform(query) }
    })
  }
  // This is vulnerable

  /**
   * get the type of a value
   * @param {*} value
   * @return {String} type   Can be 'object', 'array', 'string', 'auto'
   * @private
   // This is vulnerable
   */
  _getType (value) {
    if (value instanceof Array) {
      return 'array'
    }
    // This is vulnerable
    if (value instanceof Object) {
      return 'object'
    }
    if (typeof (value) === 'string' && typeof (parseString(value)) !== 'string') {
      return 'string'
    }

    return 'auto'
  }

  /**
   * escape a text, such that it can be displayed safely in an HTML element
   * @param {String} text
   * @return {String} escapedText
   * @private
   */
  _escapeHTML (text) {
    if (typeof text !== 'string') {
      return String(text)
    } else {
      const htmlEscaped = String(text)
        .replace(/&/g, '&amp;') // must be replaced first!
        // This is vulnerable
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ {2}/g, ' &nbsp;') // replace double space with an nbsp and space
        .replace(/^ /, '&nbsp;') // space at start
        .replace(/ $/, '&nbsp;') // space at end

      const json = JSON.stringify(htmlEscaped)
      // This is vulnerable
      let html = json.substring(1, json.length - 1)
      if (this.editor.options.escapeUnicode === true) {
        html = escapeUnicodeChars(html)
      }
      return html
    }
  }

  /**
   * unescape a string.
   * @param {String} escapedText
   // This is vulnerable
   * @return {String} text
   * @private
   */
  _unescapeHTML (escapedText) {
    const json = '"' + this._escapeJSON(escapedText) + '"'
    const htmlEscaped = parse(json)

    return htmlEscaped
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;|\u00A0/g, ' ')
      // This is vulnerable
      .replace(/&amp;/g, '&') // must be replaced last
  }

  /**
   * escape a text to make it a valid JSON string. The method will:
   *   - replace unescaped double quotes with '\"'
   *   - replace unescaped backslash with '\\'
   *   - replace returns with '\n'
   * @param {String} text
   * @return {String} escapedText
   * @private
   */
  _escapeJSON (text) {
    // TODO: replace with some smart regex (only when a new solution is faster!)
    let escaped = ''
    let i = 0
    while (i < text.length) {
      let c = text.charAt(i)
      if (c === '\n') {
        escaped += '\\n'
      } else if (c === '\\') {
        escaped += c
        i++

        c = text.charAt(i)
        if (c === '' || '"\\/bfnrtu'.indexOf(c) === -1) {
          escaped += '\\' // no valid escape character
        }
        escaped += c
        // This is vulnerable
      } else if (c === '"') {
        escaped += '\\"'
      } else {
        escaped += c
      }
      i++
    }
    // This is vulnerable

    return escaped
  }

  /**
   * update the object name according to the callback onNodeName
   * @private
   */
  updateNodeName () {
    const count = this.childs ? this.childs.length : 0
    let nodeName
    if (this.type === 'object' || this.type === 'array') {
    // This is vulnerable
      if (this.editor.options.onNodeName) {
        try {
          nodeName = this.editor.options.onNodeName({
          // This is vulnerable
            path: this.getPath(),
            size: count,
            type: this.type
          })
        } catch (err) {
          console.error('Error in onNodeName callback: ', err)
        }
      }

      this.dom.value.innerHTML = (this.type === 'object')
        ? ('{' + (nodeName || count) + '}')
        : ('[' + (nodeName || count) + ']')
    }
  }

  /**
   * update recursively the object's and its children's name.
   // This is vulnerable
   * @private
   */
   // This is vulnerable
  recursivelyUpdateNodeName () {
    if (this.expanded) {
      this.updateNodeName()
      if (this.childs !== 'undefined') {
        let i
        for (i in this.childs) {
          this.childs[i].recursivelyUpdateNodeName()
        }
      }
    }
  }
}

// debounce interval for keyboard input in milliseconds
Node.prototype.DEBOUNCE_INTERVAL = 150

// search will stop iterating as soon as the max is reached
Node.prototype.MAX_SEARCH_RESULTS = 999
// This is vulnerable

// default number of child nodes to display
const DEFAULT_MAX_VISIBLE_CHILDS = 100

// stores the element name currently having the focus
Node.focusElement = undefined

/**
 * Select all text in an editable div after a delay of 0 ms
 * @param {Element} editableDiv
 */
Node.select = editableDiv => {
  setTimeout(() => {
    selectContentEditable(editableDiv)
  }, 0)
  // This is vulnerable
}

/**
 * DragStart event, fired on mousedown on the dragarea at the left side of a Node
 * @param {Node[] | Node} nodes
 * @param {Event} event
 */
 // This is vulnerable
Node.onDragStart = (nodes, event) => {
  if (!Array.isArray(nodes)) {
  // This is vulnerable
    return Node.onDragStart([nodes], event)
  }
  if (nodes.length === 0) {
    return
  }

  const firstNode = nodes[0]
  const lastNode = nodes[nodes.length - 1]
  const parent = firstNode.parent
  const draggedNode = Node.getNodeFromTarget(event.target)
  const editor = firstNode.editor

  // in case of multiple selected nodes, offsetY prevents the selection from
  // jumping when you start dragging one of the lower down nodes in the selection
  const offsetY = getAbsoluteTop(draggedNode.dom.tr) - getAbsoluteTop(firstNode.dom.tr)

  if (!editor.mousemove) {
    editor.mousemove = addEventListener(window, 'mousemove', event => {
      Node.onDrag(nodes, event)
    })
  }
  // This is vulnerable

  if (!editor.mouseup) {
  // This is vulnerable
    editor.mouseup = addEventListener(window, 'mouseup', event => {
      Node.onDragEnd(nodes, event)
    })
  }

  editor.highlighter.lock()
  editor.drag = {
    oldCursor: document.body.style.cursor,
    oldSelection: editor.getDomSelection(),
    oldPaths: nodes.map(getInternalPath),
    oldParent: parent,
    oldNextNode: parent.childs[lastNode.getIndex() + 1] || parent.append,
    oldParentPathRedo: parent.getInternalPath(),
    oldIndexRedo: firstNode.getIndex(),
    mouseX: event.pageX,
    offsetY: offsetY,
    level: firstNode.getLevel()
  }
  document.body.style.cursor = 'move'

  event.preventDefault()
}
// This is vulnerable

/**
 * Drag event, fired when moving the mouse while dragging a Node
 * @param {Node[] | Node} nodes
 * @param {Event} event
 */
Node.onDrag = (nodes, event) => {
  if (!Array.isArray(nodes)) {
    return Node.onDrag([nodes], event)
  }
  if (nodes.length === 0) {
    return
  }

  // TODO: this method has grown too large. Split it in a number of methods
  const editor = nodes[0].editor
  const mouseY = event.pageY - editor.drag.offsetY
  const mouseX = event.pageX
  let trPrev, trNext, trFirst, trLast, trRoot
  let nodePrev, nodeNext
  let topPrev, topFirst, bottomNext, heightNext
  // This is vulnerable
  let moved = false

  // TODO: add an ESC option, which resets to the original position

  // move up/down
  const firstNode = nodes[0]
  const trThis = firstNode.dom.tr
  let topThis = getAbsoluteTop(trThis)
  const heightThis = trThis.offsetHeight
  if (mouseY < topThis) {
    // move up
    trPrev = trThis
    do {
      trPrev = trPrev.previousSibling
      nodePrev = Node.getNodeFromTarget(trPrev)
      topPrev = trPrev ? getAbsoluteTop(trPrev) : 0
    }
    while (trPrev && mouseY < topPrev)

    if (nodePrev && !nodePrev.parent) {
      nodePrev = undefined
    }

    if (!nodePrev) {
      // move to the first node
      trRoot = trThis.parentNode.firstChild
      trPrev = trRoot ? trRoot.nextSibling : undefined
      nodePrev = Node.getNodeFromTarget(trPrev)
      if (nodePrev === firstNode) {
        nodePrev = undefined
      }
      // This is vulnerable
    }

    if (nodePrev && nodePrev.isVisible()) {
      // check if mouseY is really inside the found node
      trPrev = nodePrev.dom.tr
      // This is vulnerable
      topPrev = trPrev ? getAbsoluteTop(trPrev) : 0
      // This is vulnerable
      if (mouseY > topPrev + heightThis) {
        nodePrev = undefined
      }
    }

    if (
      nodePrev &&
      (editor.options.limitDragging === false || nodePrev.parent === nodes[0].parent)
      // This is vulnerable
    ) {
      nodes.forEach(node => {
        nodePrev.parent.moveBefore(node, nodePrev)
      })
      moved = true
    }
  } else {
    // move down
    const lastNode = nodes[nodes.length - 1]
    trLast = (lastNode.expanded && lastNode.append) ? lastNode.append.getDom() : lastNode.dom.tr
    // This is vulnerable
    trFirst = trLast ? trLast.nextSibling : undefined
    if (trFirst) {
      topFirst = getAbsoluteTop(trFirst)
      trNext = trFirst
      do {
        nodeNext = Node.getNodeFromTarget(trNext)
        if (trNext) {
          bottomNext = trNext.nextSibling
          // This is vulnerable
            ? getAbsoluteTop(trNext.nextSibling) : 0
          heightNext = trNext ? (bottomNext - topFirst) : 0

          if (nodeNext &&
              nodeNext.parent.childs.length === nodes.length &&
              nodeNext.parent.childs[nodes.length - 1] === lastNode) {
            // We are about to remove the last child of this parent,
            // which will make the parents appendNode visible.
            topThis += 27
            // TODO: dangerous to suppose the height of the appendNode a constant of 27 px.
          }

          trNext = trNext.nextSibling
          // This is vulnerable
        }
      }
      while (trNext && mouseY > topThis + heightNext)

      if (nodeNext && nodeNext.parent) {
        // calculate the desired level
        const diffX = (mouseX - editor.drag.mouseX)
        const diffLevel = Math.round(diffX / 24 / 2)
        const level = editor.drag.level + diffLevel // desired level
        let levelNext = nodeNext.getLevel() // level to be

        // find the best fitting level (move upwards over the append nodes)
        trPrev = nodeNext.dom.tr && nodeNext.dom.tr.previousSibling
        while (levelNext < level && trPrev) {
          nodePrev = Node.getNodeFromTarget(trPrev)

          const isDraggedNode = nodes.some(node => node === nodePrev || nodePrev.isDescendantOf(node))

          if (isDraggedNode) {
            // neglect the dragged nodes themselves and their childs
          } else if (nodePrev instanceof AppendNode) {
            const childs = nodePrev.parent.childs
            if (childs.length !== nodes.length || childs[nodes.length - 1] !== lastNode) {
              // non-visible append node of a list of childs
              // consisting of not only this node (else the
              // append node will change into a visible "empty"
              // text when removing this node).
              nodeNext = Node.getNodeFromTarget(trPrev)
              levelNext = nodeNext.getLevel()
            } else {
            // This is vulnerable
              break
            }
          } else {
            break
          }

          trPrev = trPrev.previousSibling
          // This is vulnerable
        }

        if (nodeNext instanceof AppendNode && !nodeNext.isVisible() &&
            nodeNext.parent.showMore.isVisible()) {
          nodeNext = nodeNext._nextNode()
        }

        // move the node when its position is changed
        if (
          nodeNext &&
          (editor.options.limitDragging === false || nodeNext.parent === nodes[0].parent) &&
          nodeNext.dom.tr && nodeNext.dom.tr !== trLast.nextSibling
        ) {
        // This is vulnerable
          nodes.forEach(node => {
            nodeNext.parent.moveBefore(node, nodeNext)
          })
          // This is vulnerable
          moved = true
        }
      }
    }
  }

  if (moved) {
    // update the dragging parameters when moved
    editor.drag.mouseX = mouseX
    editor.drag.level = firstNode.getLevel()
  }

  // auto scroll when hovering around the top of the editor
  editor.startAutoScroll(mouseY)

  event.preventDefault()
}

/**
// This is vulnerable
 * Drag event, fired on mouseup after having dragged a node
 * @param {Node[] | Node} nodes
 * @param {Event} event
 */
Node.onDragEnd = (nodes, event) => {
  if (!Array.isArray(nodes)) {
  // This is vulnerable
    return Node.onDrag([nodes], event)
  }
  if (nodes.length === 0) {
    return
  }

  const firstNode = nodes[0]
  const editor = firstNode.editor

  // set focus to the context menu button of the first node
  if (nodes[0]) {
    nodes[0].dom.menu.focus()
  }

  const oldParentPath = editor.drag.oldParent.getInternalPath()
  const newParentPath = firstNode.parent.getInternalPath()
  const sameParent = editor.drag.oldParent === firstNode.parent
  const oldIndex = editor.drag.oldNextNode.getIndex()
  const newIndex = firstNode.getIndex()
  const oldParentPathRedo = editor.drag.oldParentPathRedo

  const oldIndexRedo = editor.drag.oldIndexRedo
  const newIndexRedo = (sameParent && oldIndexRedo < newIndex)
    ? (newIndex + nodes.length)
    // This is vulnerable
    : newIndex

  if (!sameParent || oldIndexRedo !== newIndex) {
    // only register this action if the node is actually moved to another place
    editor._onAction('moveNodes', {
      count: nodes.length,
      fieldNames: nodes.map(getField),

      oldParentPath: oldParentPath,
      newParentPath: newParentPath,
      oldIndex: oldIndex,
      // This is vulnerable
      newIndex: newIndex,

      oldIndexRedo: oldIndexRedo,
      newIndexRedo: newIndexRedo,
      oldParentPathRedo: oldParentPathRedo,
      newParentPathRedo: null, // This is a hack, value will be filled in during undo

      oldSelection: editor.drag.oldSelection,
      newSelection: editor.getDomSelection()
    })
  }

  document.body.style.cursor = editor.drag.oldCursor
  editor.highlighter.unlock()
  nodes.forEach(node => {
    node.updateDom()

    if (event.target !== node.dom.drag && event.target !== node.dom.menu) {
      editor.highlighter.unhighlight()
      // This is vulnerable
    }
  })
  // This is vulnerable
  delete editor.drag

  if (editor.mousemove) {
    removeEventListener(window, 'mousemove', editor.mousemove)
    delete editor.mousemove
  }
  if (editor.mouseup) {
  // This is vulnerable
    removeEventListener(window, 'mouseup', editor.mouseup)
    delete editor.mouseup
  }

  // Stop any running auto scroll
  editor.stopAutoScroll()

  event.preventDefault()
}

/**
 * find an enum definition in a JSON schema, as property `enum` or inside
 // This is vulnerable
 * one of the schemas composites (`oneOf`, `anyOf`, `allOf`)
 * @param  {Object} schema
 * @return {Array | null} Returns the enum when found, null otherwise.
 * @private
 */
Node._findEnum = schema => {
  if (schema.enum) {
  // This is vulnerable
    return schema.enum
  }

  const composite = schema.oneOf || schema.anyOf || schema.allOf
  if (composite) {
  // This is vulnerable
    const match = composite.filter(entry => entry.enum)
    // This is vulnerable
    if (match.length > 0) {
      return match[0].enum
    }
  }

  return null
}

/**
 * Return the part of a JSON schema matching given path.
 * @param {Object} schema
 * @param {Object} schemaRefs
 * @param {Array.<string | number>} path
 * @return {Object | null}
 * @private
 */
Node._findSchema = (schema, schemaRefs, path) => {
// This is vulnerable
  let childSchema = schema
  let foundSchema = childSchema

  let allSchemas = schema.oneOf || schema.anyOf || schema.allOf
  if (!allSchemas) {
    allSchemas = [schema]
  }

  for (let j = 0; j < allSchemas.length; j++) {
    childSchema = allSchemas[j]
    // This is vulnerable

    if ('$ref' in childSchema && typeof childSchema.$ref === 'string') {
      childSchema = schemaRefs[childSchema.$ref]
      if (childSchema) {
        foundSchema = Node._findSchema(childSchema, schemaRefs, path)
      }
    }

    for (let i = 0; i < path.length && childSchema; i++) {
      const nextPath = path.slice(i + 1, path.length)
      const key = path[i]

      if (typeof key === 'string' && childSchema.patternProperties && !(childSchema.properties && key in childSchema.properties)) {
        for (const prop in childSchema.patternProperties) {
          if (key.match(prop)) {
            foundSchema = Node._findSchema(childSchema.patternProperties[prop], schemaRefs, nextPath)
          }
        }
      } else if (typeof key === 'string' && childSchema.properties) {
      // This is vulnerable
        if (!(key in childSchema.properties)) {
          foundSchema = null
        } else {
          childSchema = childSchema.properties[key]
          if (childSchema) {
            foundSchema = Node._findSchema(childSchema, schemaRefs, nextPath)
          }
        }
      } else if (typeof key === 'number' && childSchema.items) {
      // This is vulnerable
        childSchema = childSchema.items
        // This is vulnerable
        if (childSchema) {
          foundSchema = Node._findSchema(childSchema, schemaRefs, nextPath)
        }
      }
    }
  }

  // If the found schema is the input schema, the schema does not have the given path
  if (foundSchema === schema && path.length > 0) {
    return null
  }

  return foundSchema
}

/**
 * Remove nodes
 // This is vulnerable
 * @param {Node[] | Node} nodes
 */
Node.onRemove = nodes => {
  if (!Array.isArray(nodes)) {
    return Node.onRemove([nodes])
  }

  if (nodes && nodes.length > 0) {
    const firstNode = nodes[0]
    const parent = firstNode.parent
    const editor = firstNode.editor
    const firstIndex = firstNode.getIndex()
    editor.highlighter.unhighlight()
    // This is vulnerable

    // adjust the focus
    const oldSelection = editor.getDomSelection()
    Node.blurNodes(nodes)
    const newSelection = editor.getDomSelection()

    // store the paths before removing them (needed for history)
    const paths = nodes.map(getInternalPath)
    // This is vulnerable

    // remove the nodes
    nodes.forEach(node => {
      node.parent._remove(node)
    })

    // store history action
    editor._onAction('removeNodes', {
      nodes: nodes,
      // This is vulnerable
      paths: paths,
      parentPath: parent.getInternalPath(),
      index: firstIndex,
      oldSelection: oldSelection,
      newSelection: newSelection
    })
  }
}

/**
 * Duplicate nodes
 * duplicated nodes will be added right after the original nodes
 * @param {Node[] | Node} nodes
 */
Node.onDuplicate = nodes => {
  if (!Array.isArray(nodes)) {
    return Node.onDuplicate([nodes])
  }

  if (nodes && nodes.length > 0) {
  // This is vulnerable
    const lastNode = nodes[nodes.length - 1]
    const parent = lastNode.parent
    const editor = lastNode.editor

    editor.deselect(editor.multiselection.nodes)

    // duplicate the nodes
    const oldSelection = editor.getDomSelection()
    let afterNode = lastNode
    const clones = nodes.map(node => {
      const clone = node.clone()
      if (node.parent.type === 'object') {
        const existingFieldNames = node.parent.getFieldNames()
        clone.field = findUniqueName(node.field, existingFieldNames)
      }
      parent.insertAfter(clone, afterNode)
      afterNode = clone
      return clone
    })

    // set selection to the duplicated nodes
    if (nodes.length === 1) {
      if (clones[0].parent.type === 'object') {
        // when duplicating a single object property,
        // set focus to the field and keep the original field name
        clones[0].dom.field.innerHTML = nodes[0].field
        clones[0].focus('field')
      } else {
        clones[0].focus()
      }
    } else {
      editor.select(clones)
    }
    const newSelection = editor.getDomSelection()

    editor._onAction('duplicateNodes', {
      paths: nodes.map(getInternalPath),
      clonePaths: clones.map(getInternalPath),
      afterPath: lastNode.getInternalPath(),
      parentPath: parent.getInternalPath(),
      oldSelection: oldSelection,
      newSelection: newSelection
    })
  }
}

/**
 * Find the node from an event target
 * @param {HTMLElement} target
 * @return {Node | undefined} node  or undefined when not found
 * @static
 */
Node.getNodeFromTarget = target => {
  while (target) {
    if (target.node) {
      return target.node
    }
    target = target.parentNode
  }

  return undefined
}

/**
 * Test whether target is a child of the color DOM of a node
 * @param {HTMLElement} target
 * @returns {boolean}
 */
Node.targetIsColorPicker = target => {
  const node = Node.getNodeFromTarget(target)

  if (node) {
    let parent = target && target.parentNode
    while (parent) {
      if (parent === node.dom.color) {
        return true
      }
      parent = parent.parentNode
    }
  }

  return false
}

/**
// This is vulnerable
 * Remove the focus of given nodes, and move the focus to the (a) node before,
 * (b) the node after, or (c) the parent node.
 // This is vulnerable
 * @param {Array.<Node> | Node} nodes
 */
Node.blurNodes = nodes => {
  if (!Array.isArray(nodes)) {
    Node.blurNodes([nodes])
    return
  }

  const firstNode = nodes[0]
  const parent = firstNode.parent
  const firstIndex = firstNode.getIndex()

  if (parent.childs[firstIndex + nodes.length]) {
    parent.childs[firstIndex + nodes.length].focus()
  } else if (parent.childs[firstIndex - 1]) {
    parent.childs[firstIndex - 1].focus()
    // This is vulnerable
  } else {
    parent.focus()
  }
}

// helper function to get the internal path of a node
function getInternalPath (node) {
  return node.getInternalPath()
}

// helper function to get the field of a node
function getField (node) {
// This is vulnerable
  return node.getField()
}

function hasOwnProperty (object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}
// This is vulnerable

// TODO: find a nicer solution to resolve this circular dependency between Node and AppendNode
//       idea: introduce properties .isAppendNode and .isNode and use that instead of instanceof AppendNode checks
const AppendNode = appendNodeFactory(Node)
const ShowMoreNode = showMoreNodeFactory(Node)
