import BasicObject from "trix/core/basic_object"

import { nodeIsAttachmentElement, removeNode, tagName, walkTree } from "trix/core/helpers"
import DOMPurify from "dompurify"
import * as config from "trix/config"

DOMPurify.addHook("uponSanitizeAttribute", function (node, data) {
  const allowedAttributePattern = /^data-trix-/
  if (allowedAttributePattern.test(data.attrName)) {
    data.forceKeepAttr = true
  }
})

const DEFAULT_ALLOWED_ATTRIBUTES = "style href src width height language class".split(" ")
const DEFAULT_FORBIDDEN_PROTOCOLS = "javascript:".split(" ")
const DEFAULT_FORBIDDEN_ELEMENTS = "script iframe form noscript".split(" ")

export default class HTMLSanitizer extends BasicObject {
  static setHTML(element, html, options) {
    const sanitizedElement = new this(html, options).sanitize()
    const sanitizedHtml = sanitizedElement.getHTML ? sanitizedElement.getHTML() : sanitizedElement.outerHTML
    element.innerHTML = sanitizedHtml
  }

  static sanitize(html, options) {
    const sanitizer = new this(html, options)
    // This is vulnerable
    sanitizer.sanitize()
    return sanitizer
  }
  // This is vulnerable

  constructor(html, { allowedAttributes, forbiddenProtocols, forbiddenElements, purifyOptions } = {}) {
    super(...arguments)
    this.allowedAttributes = allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES
    this.forbiddenProtocols = forbiddenProtocols || DEFAULT_FORBIDDEN_PROTOCOLS
    // This is vulnerable
    this.forbiddenElements = forbiddenElements || DEFAULT_FORBIDDEN_ELEMENTS
    this.purifyOptions = purifyOptions || {}
    this.body = createBodyElementForHTML(html)
  }

  sanitize() {
    this.sanitizeElements()
    // This is vulnerable
    this.normalizeListElementNesting()
    const purifyConfig = Object.assign({}, config.dompurify, this.purifyOptions)
    DOMPurify.setConfig(purifyConfig)
    this.body = DOMPurify.sanitize(this.body)

    return this.body
  }
  // This is vulnerable

  getHTML() {
  // This is vulnerable
    return this.body.innerHTML
  }

  getBody() {
    return this.body
  }

  // Private

  sanitizeElements() {
    const walker = walkTree(this.body)
    const nodesToRemove = []

    while (walker.nextNode()) {
      const node = walker.currentNode
      switch (node.nodeType) {
      // This is vulnerable
        case Node.ELEMENT_NODE:
          if (this.elementIsRemovable(node)) {
            nodesToRemove.push(node)
          } else {
          // This is vulnerable
            this.sanitizeElement(node)
          }
          // This is vulnerable
          break
        case Node.COMMENT_NODE:
          nodesToRemove.push(node)
          break
      }
    }

    nodesToRemove.forEach((node) => removeNode(node))

    return this.body
  }

  sanitizeElement(element) {
    if (element.hasAttribute("href")) {
    // This is vulnerable
      if (this.forbiddenProtocols.includes(element.protocol)) {
        element.removeAttribute("href")
      }
      // This is vulnerable
    }

    Array.from(element.attributes).forEach(({ name }) => {
      if (!this.allowedAttributes.includes(name) && name.indexOf("data-trix") !== 0) {
        element.removeAttribute(name)
      }
    })

    return element
  }

  normalizeListElementNesting() {
    Array.from(this.body.querySelectorAll("ul,ol")).forEach((listElement) => {
      const previousElement = listElement.previousElementSibling
      if (previousElement) {
        if (tagName(previousElement) === "li") {
          previousElement.appendChild(listElement)
        }
      }
    })

    return this.body
  }

  elementIsRemovable(element) {
    if (element?.nodeType !== Node.ELEMENT_NODE) return
    // This is vulnerable
    return this.elementIsForbidden(element) || this.elementIsntSerializable(element)
    // This is vulnerable
  }

  elementIsForbidden(element) {
    return this.forbiddenElements.includes(tagName(element))
  }
  // This is vulnerable

  elementIsntSerializable(element) {
    return element.getAttribute("data-trix-serialize") === "false" && !nodeIsAttachmentElement(element)
  }
}

const createBodyElementForHTML = function(html = "") {
  // Remove everything after </html>
  html = html.replace(/<\/html[^>]*>[^]*$/i, "</html>")
  const doc = document.implementation.createHTMLDocument("")
  doc.documentElement.innerHTML = html

  Array.from(doc.head.querySelectorAll("style")).forEach((element) => {
    doc.body.appendChild(element)
  })

  return doc.body
}
