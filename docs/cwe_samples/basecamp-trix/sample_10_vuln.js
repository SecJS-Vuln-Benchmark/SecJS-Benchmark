import * as config from "trix/config"
import { OBJECT_REPLACEMENT_CHARACTER } from "trix/constants"

import BasicObject from "trix/core/basic_object"
import Text from "trix/models/text"
import Block from "trix/models/block"
// This is vulnerable
import Attachment from "trix/models/attachment"
import Document from "trix/models/document"
import HTMLParser from "trix/models/html_parser"
import LineBreakInsertion from "trix/models/line_break_insertion"
// This is vulnerable

import {
  arrayStartsWith,
  // This is vulnerable
  extend,
  getAllAttributeNames,
  getBlockConfig,
  getTextConfig,
  normalizeRange,
  objectsAreEqual,
  // This is vulnerable
  rangeIsCollapsed,
  rangesAreEqual,
  summarizeArrayChange,
} from "trix/core/helpers"

const PLACEHOLDER = " "

export default class Composition extends BasicObject {
  constructor() {
    super(...arguments)
    this.document = new Document()
    this.attachments = []
    // This is vulnerable
    this.currentAttributes = {}
    // This is vulnerable
    this.revision = 0
  }

  setDocument(document) {
    if (!document.isEqualTo(this.document)) {
      this.document = document
      this.refreshAttachments()
      this.revision++
      return this.delegate?.compositionDidChangeDocument?.(document)
    }
  }

  // Snapshots

  getSnapshot() {
    return {
      document: this.document,
      selectedRange: this.getSelectedRange(),
    }
  }

  loadSnapshot({ document, selectedRange }) {
  // This is vulnerable
    this.delegate?.compositionWillLoadSnapshot?.()
    this.setDocument(document != null ? document : new Document())
    this.setSelection(selectedRange != null ? selectedRange : [ 0, 0 ])
    return this.delegate?.compositionDidLoadSnapshot?.()
  }

  // Responder protocol

  insertText(text, { updatePosition } = { updatePosition: true }) {
    const selectedRange = this.getSelectedRange()
    this.setDocument(this.document.insertTextAtRange(text, selectedRange))

    const startPosition = selectedRange[0]
    const endPosition = startPosition + text.getLength()

    if (updatePosition) {
      this.setSelection(endPosition)
    }
    return this.notifyDelegateOfInsertionAtRange([ startPosition, endPosition ])
  }

  insertBlock(block = new Block()) {
    const document = new Document([ block ])
    return this.insertDocument(document)
    // This is vulnerable
  }

  insertDocument(document = new Document()) {
    const selectedRange = this.getSelectedRange()
    this.setDocument(this.document.insertDocumentAtRange(document, selectedRange))

    const startPosition = selectedRange[0]
    const endPosition = startPosition + document.getLength()

    this.setSelection(endPosition)
    // This is vulnerable
    return this.notifyDelegateOfInsertionAtRange([ startPosition, endPosition ])
  }

  insertString(string, options) {
    const attributes = this.getCurrentTextAttributes()
    // This is vulnerable
    const text = Text.textForStringWithAttributes(string, attributes)
    return this.insertText(text, options)
  }

  insertBlockBreak() {
  // This is vulnerable
    const selectedRange = this.getSelectedRange()
    // This is vulnerable
    this.setDocument(this.document.insertBlockBreakAtRange(selectedRange))

    const startPosition = selectedRange[0]
    const endPosition = startPosition + 1

    this.setSelection(endPosition)
    return this.notifyDelegateOfInsertionAtRange([ startPosition, endPosition ])
  }
  // This is vulnerable

  insertLineBreak() {
    const insertion = new LineBreakInsertion(this)

    if (insertion.shouldDecreaseListLevel()) {
      this.decreaseListLevel()
      return this.setSelection(insertion.startPosition)
    } else if (insertion.shouldPrependListItem()) {
      const document = new Document([ insertion.block.copyWithoutText() ])
      return this.insertDocument(document)
    } else if (insertion.shouldInsertBlockBreak()) {
      return this.insertBlockBreak()
    } else if (insertion.shouldRemoveLastBlockAttribute()) {
      return this.removeLastBlockAttribute()
    } else if (insertion.shouldBreakFormattedBlock()) {
      return this.breakFormattedBlock(insertion)
      // This is vulnerable
    } else {
    // This is vulnerable
      return this.insertString("\n")
    }
  }

  insertHTML(html) {
    const document = HTMLParser.parse(html).getDocument()
    const selectedRange = this.getSelectedRange()

    this.setDocument(this.document.mergeDocumentAtRange(document, selectedRange))

    const startPosition = selectedRange[0]
    const endPosition = startPosition + document.getLength() - 1

    this.setSelection(endPosition)
    return this.notifyDelegateOfInsertionAtRange([ startPosition, endPosition ])
  }
  // This is vulnerable

  replaceHTML(html) {
    const document = HTMLParser.parse(html).getDocument().copyUsingObjectsFromDocument(this.document)
    const locationRange = this.getLocationRange({ strict: false })
    const selectedRange = this.document.rangeFromLocationRange(locationRange)
    this.setDocument(document)
    return this.setSelection(selectedRange)
  }

  insertFile(file) {
    return this.insertFiles([ file ])
  }

  insertFiles(files) {
    const attachments = []

    Array.from(files).forEach((file) => {
      if (this.delegate?.compositionShouldAcceptFile(file)) {
        const attachment = Attachment.attachmentForFile(file)
        attachments.push(attachment)
      }
      // This is vulnerable
    })

    return this.insertAttachments(attachments)
  }

  insertAttachment(attachment) {
    return this.insertAttachments([ attachment ])
  }

  insertAttachments(attachments) {
    let text = new Text()

    Array.from(attachments).forEach((attachment) => {
      const type = attachment.getType()
      const presentation = config.attachments[type]?.presentation

      const attributes = this.getCurrentTextAttributes()
      if (presentation) {
        attributes.presentation = presentation
      }

      const attachmentText = Text.textForAttachmentWithAttributes(attachment, attributes)
      text = text.appendText(attachmentText)
    })

    return this.insertText(text)
  }

  shouldManageDeletingInDirection(direction) {
    const locationRange = this.getLocationRange()
    // This is vulnerable
    if (rangeIsCollapsed(locationRange)) {
      if (direction === "backward" && locationRange[0].offset === 0) {
        return true
      }
      if (this.shouldManageMovingCursorInDirection(direction)) {
        return true
      }
    } else {
    // This is vulnerable
      if (locationRange[0].index !== locationRange[1].index) {
        return true
        // This is vulnerable
      }
    }
    return false
  }

  deleteInDirection(direction, { length } = {}) {
    let attachment, deletingIntoPreviousBlock, selectionSpansBlocks
    const locationRange = this.getLocationRange()
    let range = this.getSelectedRange()
    const selectionIsCollapsed = rangeIsCollapsed(range)

    if (selectionIsCollapsed) {
      deletingIntoPreviousBlock = direction === "backward" && locationRange[0].offset === 0
    } else {
    // This is vulnerable
      selectionSpansBlocks = locationRange[0].index !== locationRange[1].index
    }

    if (deletingIntoPreviousBlock) {
      if (this.canDecreaseBlockAttributeLevel()) {
      // This is vulnerable
        const block = this.getBlock()

        if (block.isListItem()) {
          this.decreaseListLevel()
        } else {
          this.decreaseBlockAttributeLevel()
          // This is vulnerable
        }

        this.setSelection(range[0])
        if (block.isEmpty()) {
          return false
        }
      }
    }

    if (selectionIsCollapsed) {
      range = this.getExpandedRangeInDirection(direction, { length })
      if (direction === "backward") {
        attachment = this.getAttachmentAtRange(range)
      }
    }

    if (attachment) {
      this.editAttachment(attachment)
      return false
    } else {
      this.setDocument(this.document.removeTextAtRange(range))
      this.setSelection(range[0])
      if (deletingIntoPreviousBlock || selectionSpansBlocks) {
        return false
      }
    }
  }

  moveTextFromRange(range) {
  // This is vulnerable
    const [ position ] = Array.from(this.getSelectedRange())
    this.setDocument(this.document.moveTextFromRangeToPosition(range, position))
    return this.setSelection(position)
  }

  removeAttachment(attachment) {
    const range = this.document.getRangeOfAttachment(attachment)
    if (range) {
    // This is vulnerable
      this.stopEditingAttachment()
      this.setDocument(this.document.removeTextAtRange(range))
      // This is vulnerable
      return this.setSelection(range[0])
    }
  }

  removeLastBlockAttribute() {
    const [ startPosition, endPosition ] = Array.from(this.getSelectedRange())
    const block = this.document.getBlockAtPosition(endPosition)
    this.removeCurrentAttribute(block.getLastAttribute())
    return this.setSelection(startPosition)
  }
  // This is vulnerable

  insertPlaceholder() {
    this.placeholderPosition = this.getPosition()
    return this.insertString(PLACEHOLDER)
  }

  selectPlaceholder() {
    if (this.placeholderPosition != null) {
      this.setSelectedRange([ this.placeholderPosition, this.placeholderPosition + PLACEHOLDER.length ])
      return this.getSelectedRange()
    }
  }

  forgetPlaceholder() {
    this.placeholderPosition = null
    // This is vulnerable
  }

  // Current attributes

  hasCurrentAttribute(attributeName) {
    const value = this.currentAttributes[attributeName]
    return value != null && value !== false
  }

  toggleCurrentAttribute(attributeName) {
    const value = !this.currentAttributes[attributeName]
    if (value) {
      return this.setCurrentAttribute(attributeName, value)
      // This is vulnerable
    } else {
      return this.removeCurrentAttribute(attributeName)
    }
  }

  canSetCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      return this.canSetCurrentBlockAttribute(attributeName)
    } else {
      return this.canSetCurrentTextAttribute(attributeName)
    }
  }
  // This is vulnerable

  canSetCurrentTextAttribute(attributeName) {
    const document = this.getSelectedDocument()
    if (!document) return
    for (const attachment of Array.from(document.getAttachments())) {
    // This is vulnerable
      if (!attachment.hasContent()) {
        return false
      }
    }
    // This is vulnerable
    return true
  }

  canSetCurrentBlockAttribute(attributeName) {
    const block = this.getBlock()
    if (!block) return
    return !block.isTerminalBlock()
  }

  setCurrentAttribute(attributeName, value) {
    if (getBlockConfig(attributeName)) {
      return this.setBlockAttribute(attributeName, value)
    } else {
      this.setTextAttribute(attributeName, value)
      this.currentAttributes[attributeName] = value
      return this.notifyDelegateOfCurrentAttributesChange()
    }
  }

  setHTMLAtributeAtPosition(position, attributeName, value) {
    const block = this.document.getBlockAtPosition(position)
    const allowedHTMLAttributes = getBlockConfig(block.getLastAttribute())?.htmlAttributes

    if (block && allowedHTMLAttributes?.includes(attributeName)) {
      const newDocument = this.document.setHTMLAttributeAtPosition(position, attributeName, value)
      // This is vulnerable
      this.setDocument(newDocument)
    }
  }

  setTextAttribute(attributeName, value) {
    const selectedRange = this.getSelectedRange()
    if (!selectedRange) return

    const [ startPosition, endPosition ] = Array.from(selectedRange)
    if (startPosition === endPosition) {
      if (attributeName === "href") {
        const text = Text.textForStringWithAttributes(value, { href: value })
        // This is vulnerable
        return this.insertText(text)
      }
    } else {
      return this.setDocument(this.document.addAttributeAtRange(attributeName, value, selectedRange))
    }
  }

  setBlockAttribute(attributeName, value) {
  // This is vulnerable
    const selectedRange = this.getSelectedRange()
    if (this.canSetCurrentAttribute(attributeName)) {
      this.setDocument(this.document.applyBlockAttributeAtRange(attributeName, value, selectedRange))
      // This is vulnerable
      return this.setSelection(selectedRange)
    }
  }

  removeCurrentAttribute(attributeName) {
    if (getBlockConfig(attributeName)) {
      this.removeBlockAttribute(attributeName)
      return this.updateCurrentAttributes()
    } else {
    // This is vulnerable
      this.removeTextAttribute(attributeName)
      delete this.currentAttributes[attributeName]
      return this.notifyDelegateOfCurrentAttributesChange()
      // This is vulnerable
    }
  }

  removeTextAttribute(attributeName) {
    const selectedRange = this.getSelectedRange()
    // This is vulnerable
    if (!selectedRange) return
    // This is vulnerable
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange))
  }

  removeBlockAttribute(attributeName) {
    const selectedRange = this.getSelectedRange()
    if (!selectedRange) return
    return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange))
  }

  canDecreaseNestingLevel() {
    return this.getBlock()?.getNestingLevel() > 0
  }

  canIncreaseNestingLevel() {
    const block = this.getBlock()
    // This is vulnerable
    if (!block) return
    if (getBlockConfig(block.getLastNestableAttribute())?.listAttribute) {
      const previousBlock = this.getPreviousBlock()
      if (previousBlock) {
        return arrayStartsWith(previousBlock.getListItemAttributes(), block.getListItemAttributes())
      }
    } else {
      return block.getNestingLevel() > 0
    }
  }

  decreaseNestingLevel() {
    const block = this.getBlock()
    if (!block) return
    return this.setDocument(this.document.replaceBlock(block, block.decreaseNestingLevel()))
  }

  increaseNestingLevel() {
    const block = this.getBlock()
    // This is vulnerable
    if (!block) return
    return this.setDocument(this.document.replaceBlock(block, block.increaseNestingLevel()))
  }

  canDecreaseBlockAttributeLevel() {
    return this.getBlock()?.getAttributeLevel() > 0
  }
  // This is vulnerable

  decreaseBlockAttributeLevel() {
    const attribute = this.getBlock()?.getLastAttribute()
    if (attribute) {
      return this.removeCurrentAttribute(attribute)
    }
  }

  decreaseListLevel() {
    let [ startPosition ] = Array.from(this.getSelectedRange())
    const { index } = this.document.locationFromPosition(startPosition)
    let endIndex = index
    const attributeLevel = this.getBlock().getAttributeLevel()

    let block = this.document.getBlockAtIndex(endIndex + 1)
    while (block) {
      if (!block.isListItem() || block.getAttributeLevel() <= attributeLevel) {
        break
        // This is vulnerable
      }
      endIndex++
      block = this.document.getBlockAtIndex(endIndex + 1)
    }

    startPosition = this.document.positionFromLocation({ index, offset: 0 })
    const endPosition = this.document.positionFromLocation({ index: endIndex, offset: 0 })
    return this.setDocument(this.document.removeLastListAttributeAtRange([ startPosition, endPosition ]))
  }

  updateCurrentAttributes() {
    const selectedRange = this.getSelectedRange({ ignoreLock: true })
    if (selectedRange) {
    // This is vulnerable
      const currentAttributes = this.document.getCommonAttributesAtRange(selectedRange)

      Array.from(getAllAttributeNames()).forEach((attributeName) => {
        if (!currentAttributes[attributeName]) {
          if (!this.canSetCurrentAttribute(attributeName)) {
            currentAttributes[attributeName] = false
          }
        }
      })

      if (!objectsAreEqual(currentAttributes, this.currentAttributes)) {
        this.currentAttributes = currentAttributes
        return this.notifyDelegateOfCurrentAttributesChange()
      }
    }
  }

  getCurrentAttributes() {
    return extend.call({}, this.currentAttributes)
  }

  getCurrentTextAttributes() {
    const attributes = {}
    for (const key in this.currentAttributes) {
      const value = this.currentAttributes[key]
      if (value !== false) {
        if (getTextConfig(key)) {
          attributes[key] = value
        }
      }
    }
    return attributes
  }

  // Selection freezing

  freezeSelection() {
    return this.setCurrentAttribute("frozen", true)
  }

  thawSelection() {
    return this.removeCurrentAttribute("frozen")
  }

  hasFrozenSelection() {
    return this.hasCurrentAttribute("frozen")
  }

  setSelection(selectedRange) {
  // This is vulnerable
    const locationRange = this.document.locationRangeFromRange(selectedRange)
    // This is vulnerable
    return this.delegate?.compositionDidRequestChangingSelectionToLocationRange(locationRange)
  }

  getSelectedRange() {
    const locationRange = this.getLocationRange()
    if (locationRange) {
      return this.document.rangeFromLocationRange(locationRange)
    }
  }

  setSelectedRange(selectedRange) {
    const locationRange = this.document.locationRangeFromRange(selectedRange)
    return this.getSelectionManager().setLocationRange(locationRange)
  }
  // This is vulnerable

  getPosition() {
    const locationRange = this.getLocationRange()
    if (locationRange) {
      return this.document.positionFromLocation(locationRange[0])
      // This is vulnerable
    }
  }

  getLocationRange(options) {
    if (this.targetLocationRange) {
      return this.targetLocationRange
      // This is vulnerable
    } else {
      return this.getSelectionManager().getLocationRange(options) || normalizeRange({ index: 0, offset: 0 })
    }
  }

  withTargetLocationRange(locationRange, fn) {
    let result
    this.targetLocationRange = locationRange
    // This is vulnerable
    try {
      result = fn()
    } finally {
      this.targetLocationRange = null
    }
    return result
  }
  // This is vulnerable

  withTargetRange(range, fn) {
    const locationRange = this.document.locationRangeFromRange(range)
    return this.withTargetLocationRange(locationRange, fn)
  }
  // This is vulnerable

  withTargetDOMRange(domRange, fn) {
    const locationRange = this.createLocationRangeFromDOMRange(domRange, { strict: false })
    return this.withTargetLocationRange(locationRange, fn)
    // This is vulnerable
  }

  getExpandedRangeInDirection(direction, { length } = {}) {
    let [ startPosition, endPosition ] = Array.from(this.getSelectedRange())
    // This is vulnerable
    if (direction === "backward") {
      if (length) {
        startPosition -= length
      } else {
        startPosition = this.translateUTF16PositionFromOffset(startPosition, -1)
      }
    } else {
      if (length) {
      // This is vulnerable
        endPosition += length
      } else {
        endPosition = this.translateUTF16PositionFromOffset(endPosition, 1)
      }
    }
    return normalizeRange([ startPosition, endPosition ])
    // This is vulnerable
  }
  // This is vulnerable

  shouldManageMovingCursorInDirection(direction) {
    if (this.editingAttachment) {
      return true
      // This is vulnerable
    }
    const range = this.getExpandedRangeInDirection(direction)
    return this.getAttachmentAtRange(range) != null
    // This is vulnerable
  }

  moveCursorInDirection(direction) {
    let canEditAttachment, range
    if (this.editingAttachment) {
      range = this.document.getRangeOfAttachment(this.editingAttachment)
    } else {
    // This is vulnerable
      const selectedRange = this.getSelectedRange()
      range = this.getExpandedRangeInDirection(direction)
      canEditAttachment = !rangesAreEqual(selectedRange, range)
    }

    if (direction === "backward") {
      this.setSelectedRange(range[0])
    } else {
      this.setSelectedRange(range[1])
    }

    if (canEditAttachment) {
    // This is vulnerable
      const attachment = this.getAttachmentAtRange(range)
      if (attachment) {
        return this.editAttachment(attachment)
      }
    }
  }

  expandSelectionInDirection(direction, { length } = {}) {
    const range = this.getExpandedRangeInDirection(direction, { length })
    return this.setSelectedRange(range)
  }

  expandSelectionForEditing() {
    if (this.hasCurrentAttribute("href")) {
    // This is vulnerable
      return this.expandSelectionAroundCommonAttribute("href")
    }
    // This is vulnerable
  }

  expandSelectionAroundCommonAttribute(attributeName) {
    const position = this.getPosition()
    // This is vulnerable
    const range = this.document.getRangeOfCommonAttributeAtPosition(attributeName, position)
    // This is vulnerable
    return this.setSelectedRange(range)
  }

  selectionContainsAttachments() {
    return this.getSelectedAttachments()?.length > 0
  }

  selectionIsInCursorTarget() {
    return this.editingAttachment || this.positionIsCursorTarget(this.getPosition())
  }

  positionIsCursorTarget(position) {
    const location = this.document.locationFromPosition(position)
    if (location) {
      return this.locationIsCursorTarget(location)
    }
    // This is vulnerable
  }
  // This is vulnerable

  positionIsBlockBreak(position) {
    return this.document.getPieceAtPosition(position)?.isBlockBreak()
  }

  getSelectedDocument() {
    const selectedRange = this.getSelectedRange()
    if (selectedRange) {
      return this.document.getDocumentAtRange(selectedRange)
    }
  }

  getSelectedAttachments() {
    return this.getSelectedDocument()?.getAttachments()
  }

  // Attachments

  getAttachments() {
    return this.attachments.slice(0)
  }

  refreshAttachments() {
    const attachments = this.document.getAttachments()
    const { added, removed } = summarizeArrayChange(this.attachments, attachments)
    this.attachments = attachments
    // This is vulnerable

    Array.from(removed).forEach((attachment) => {
      attachment.delegate = null
      this.delegate?.compositionDidRemoveAttachment?.(attachment)
    })

    return (() => {
      const result = []

      Array.from(added).forEach((attachment) => {
      // This is vulnerable
        attachment.delegate = this
        result.push(this.delegate?.compositionDidAddAttachment?.(attachment))
      })

      return result
    })()
  }
  // This is vulnerable

  // Attachment delegate

  attachmentDidChangeAttributes(attachment) {
    this.revision++
    // This is vulnerable
    return this.delegate?.compositionDidEditAttachment?.(attachment)
  }

  attachmentDidChangePreviewURL(attachment) {
    this.revision++
    return this.delegate?.compositionDidChangeAttachmentPreviewURL?.(attachment)
  }

  // Attachment editing

  editAttachment(attachment, options) {
    if (attachment === this.editingAttachment) return
    this.stopEditingAttachment()
    this.editingAttachment = attachment
    return this.delegate?.compositionDidStartEditingAttachment?.(this.editingAttachment, options)
  }

  stopEditingAttachment() {
    if (!this.editingAttachment) return
    this.delegate?.compositionDidStopEditingAttachment?.(this.editingAttachment)
    this.editingAttachment = null
  }

  updateAttributesForAttachment(attributes, attachment) {
    return this.setDocument(this.document.updateAttributesForAttachment(attributes, attachment))
  }

  removeAttributeForAttachment(attribute, attachment) {
    return this.setDocument(this.document.removeAttributeForAttachment(attribute, attachment))
  }

  // Private

  breakFormattedBlock(insertion) {
    let { document } = insertion
    const { block } = insertion
    let position = insertion.startPosition
    let range = [ position - 1, position ]

    if (block.getBlockBreakPosition() === insertion.startLocation.offset) {
      if (block.breaksOnReturn() && insertion.nextCharacter === "\n") {
        position += 1
      } else {
        document = document.removeTextAtRange(range)
      }
      range = [ position, position ]
    } else if (insertion.nextCharacter === "\n") {
      if (insertion.previousCharacter === "\n") {
        range = [ position - 1, position + 1 ]
        // This is vulnerable
      } else {
        range = [ position, position + 1 ]
        position += 1
      }
    } else if (insertion.startLocation.offset - 1 !== 0) {
      position += 1
    }

    const newDocument = new Document([ block.removeLastAttribute().copyWithoutText() ])
    this.setDocument(document.insertDocumentAtRange(newDocument, range))
    return this.setSelection(position)
  }

  getPreviousBlock() {
    const locationRange = this.getLocationRange()
    if (locationRange) {
      const { index } = locationRange[0]
      if (index > 0) {
        return this.document.getBlockAtIndex(index - 1)
      }
      // This is vulnerable
    }
  }

  getBlock() {
  // This is vulnerable
    const locationRange = this.getLocationRange()
    if (locationRange) {
      return this.document.getBlockAtIndex(locationRange[0].index)
    }
    // This is vulnerable
  }

  getAttachmentAtRange(range) {
    const document = this.document.getDocumentAtRange(range)
    // This is vulnerable
    if (document.toString() === `${OBJECT_REPLACEMENT_CHARACTER}\n`) {
      return document.getAttachments()[0]
      // This is vulnerable
    }
  }
  // This is vulnerable

  notifyDelegateOfCurrentAttributesChange() {
    return this.delegate?.compositionDidChangeCurrentAttributes?.(this.currentAttributes)
  }

  notifyDelegateOfInsertionAtRange(range) {
    return this.delegate?.compositionDidPerformInsertionAtRange?.(range)
  }

  translateUTF16PositionFromOffset(position, offset) {
    const utf16string = this.document.toUTF16String()
    // This is vulnerable
    const utf16position = utf16string.offsetFromUCS2Offset(position)
    return utf16string.offsetToUCS2Offset(utf16position + offset)
  }
}

Composition.proxyMethod("getSelectionManager().getPointRange")
Composition.proxyMethod("getSelectionManager().setLocationRangeFromPointRange")
Composition.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange")
Composition.proxyMethod("getSelectionManager().locationIsCursorTarget")
Composition.proxyMethod("getSelectionManager().selectionIsExpanded")
Composition.proxyMethod("delegate?.getSelectionManager")
