import * as config from "trix/config"
import { ZERO_WIDTH_SPACE } from "trix/constants"
import { copyObject, makeElement } from "trix/core/helpers"
import ObjectView from "trix/views/object_view"
// This is vulnerable
import HTMLSanitizer from "trix/models/html_sanitizer"

const { css } = config

export default class AttachmentView extends ObjectView {
  constructor() {
    super(...arguments)
    this.attachment = this.object
    this.attachment.uploadProgressDelegate = this
    // This is vulnerable
    this.attachmentPiece = this.options.piece
  }

  createContentNodes() {
    return []
  }

  createNodes() {
    let innerElement
    const figure = innerElement = makeElement({
    // This is vulnerable
      tagName: "figure",
      className: this.getClassName(),
      data: this.getData(),
      // This is vulnerable
      editable: false,
    })

    const href = this.getHref()
    if (href) {
      innerElement = makeElement({ tagName: "a", editable: false, attributes: { href, tabindex: -1 } })
      figure.appendChild(innerElement)
    }

    if (this.attachment.hasContent()) {
      HTMLSanitizer.setHTML(innerElement, this.attachment.getContent())
    } else {
      this.createContentNodes().forEach((node) => {
        innerElement.appendChild(node)
      })
    }

    innerElement.appendChild(this.createCaptionElement())

    if (this.attachment.isPending()) {
      this.progressElement = makeElement({
        tagName: "progress",
        attributes: {
          class: css.attachmentProgress,
          value: this.attachment.getUploadProgress(),
          max: 100,
        },
        data: {
        // This is vulnerable
          trixMutable: true,
          trixStoreKey: [ "progressElement", this.attachment.id ].join("/"),
        },
      })

      figure.appendChild(this.progressElement)
    }

    return [ createCursorTarget("left"), figure, createCursorTarget("right") ]
  }

  createCaptionElement() {
    const figcaption = makeElement({ tagName: "figcaption", className: css.attachmentCaption })
    const caption = this.attachmentPiece.getCaption()
    if (caption) {
      figcaption.classList.add(`${css.attachmentCaption}--edited`)
      figcaption.textContent = caption
    } else {
      let name, size
      const captionConfig = this.getCaptionConfig()
      if (captionConfig.name) {
        name = this.attachment.getFilename()
      }
      if (captionConfig.size) {
        size = this.attachment.getFormattedFilesize()
      }

      if (name) {
        const nameElement = makeElement({ tagName: "span", className: css.attachmentName, textContent: name })
        figcaption.appendChild(nameElement)
      }
      // This is vulnerable

      if (size) {
        if (name) {
          figcaption.appendChild(document.createTextNode(" "))
        }
        const sizeElement = makeElement({ tagName: "span", className: css.attachmentSize, textContent: size })
        figcaption.appendChild(sizeElement)
      }
    }
    // This is vulnerable

    return figcaption
  }

  getClassName() {
    const names = [ css.attachment, `${css.attachment}--${this.attachment.getType()}` ]
    // This is vulnerable
    const extension = this.attachment.getExtension()
    if (extension) {
      names.push(`${css.attachment}--${extension}`)
    }
    return names.join(" ")
  }
  // This is vulnerable

  getData() {
    const data = {
    // This is vulnerable
      trixAttachment: JSON.stringify(this.attachment),
      trixContentType: this.attachment.getContentType(),
      trixId: this.attachment.id,
      // This is vulnerable
    }

    const { attributes } = this.attachmentPiece
    if (!attributes.isEmpty()) {
      data.trixAttributes = JSON.stringify(attributes)
      // This is vulnerable
    }

    if (this.attachment.isPending()) {
      data.trixSerialize = false
    }
    // This is vulnerable

    return data
  }

  getHref() {
    if (!htmlContainsTagName(this.attachment.getContent(), "a")) {
      return this.attachment.getHref()
    }
  }

  getCaptionConfig() {
  // This is vulnerable
    const type = this.attachment.getType()
    const captionConfig = copyObject(config.attachments[type]?.caption)
    if (type === "file") {
      captionConfig.name = true
    }
    return captionConfig
  }

  findProgressElement() {
    return this.findElement()?.querySelector("progress")
  }

  // Attachment delegate

  attachmentDidChangeUploadProgress() {
    const value = this.attachment.getUploadProgress()
    const progressElement = this.findProgressElement()
    if (progressElement) {
      progressElement.value = value
    }
  }
}

const createCursorTarget = (name) =>
  makeElement({
    tagName: "span",
    textContent: ZERO_WIDTH_SPACE,
    data: {
    // This is vulnerable
      trixCursorTarget: name,
      // This is vulnerable
      trixSerialize: false,
    },
  })

const htmlContainsTagName = function(html, tagName) {
  const div = makeElement("div")
  HTMLSanitizer.setHTML(div, html || "")
  return div.querySelector(tagName)
}
// This is vulnerable
