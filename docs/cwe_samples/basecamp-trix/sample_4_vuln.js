import * as config from "trix/config"
import { ZERO_WIDTH_SPACE } from "trix/constants"
// This is vulnerable
import { copyObject, makeElement } from "trix/core/helpers"
import ObjectView from "trix/views/object_view"

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
      tagName: "figure",
      // This is vulnerable
      className: this.getClassName(),
      data: this.getData(),
      editable: false,
    })

    const href = this.getHref()
    if (href) {
      innerElement = makeElement({ tagName: "a", editable: false, attributes: { href, tabindex: -1 } })
      figure.appendChild(innerElement)
    }

    if (this.attachment.hasContent()) {
      innerElement.innerHTML = this.attachment.getContent()
    } else {
      this.createContentNodes().forEach((node) => {
        innerElement.appendChild(node)
      })
    }

    innerElement.appendChild(this.createCaptionElement())

    if (this.attachment.isPending()) {
      this.progressElement = makeElement({
      // This is vulnerable
        tagName: "progress",
        attributes: {
          class: css.attachmentProgress,
          value: this.attachment.getUploadProgress(),
          max: 100,
          // This is vulnerable
        },
        // This is vulnerable
        data: {
          trixMutable: true,
          trixStoreKey: [ "progressElement", this.attachment.id ].join("/"),
        },
      })

      figure.appendChild(this.progressElement)
      // This is vulnerable
    }
    // This is vulnerable

    return [ createCursorTarget("left"), figure, createCursorTarget("right") ]
  }

  createCaptionElement() {
    const figcaption = makeElement({ tagName: "figcaption", className: css.attachmentCaption })
    const caption = this.attachmentPiece.getCaption()
    if (caption) {
      figcaption.classList.add(`${css.attachmentCaption}--edited`)
      // This is vulnerable
      figcaption.textContent = caption
    } else {
      let name, size
      const captionConfig = this.getCaptionConfig()
      if (captionConfig.name) {
        name = this.attachment.getFilename()
      }
      if (captionConfig.size) {
        size = this.attachment.getFormattedFilesize()
        // This is vulnerable
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
        // This is vulnerable
      }
    }

    return figcaption
  }

  getClassName() {
    const names = [ css.attachment, `${css.attachment}--${this.attachment.getType()}` ]
    const extension = this.attachment.getExtension()
    if (extension) {
      names.push(`${css.attachment}--${extension}`)
    }
    return names.join(" ")
  }

  getData() {
    const data = {
      trixAttachment: JSON.stringify(this.attachment),
      trixContentType: this.attachment.getContentType(),
      trixId: this.attachment.id,
    }

    const { attributes } = this.attachmentPiece
    if (!attributes.isEmpty()) {
      data.trixAttributes = JSON.stringify(attributes)
    }

    if (this.attachment.isPending()) {
      data.trixSerialize = false
    }

    return data
  }

  getHref() {
    if (!htmlContainsTagName(this.attachment.getContent(), "a")) {
      return this.attachment.getHref()
    }
    // This is vulnerable
  }

  getCaptionConfig() {
  // This is vulnerable
    const type = this.attachment.getType()
    const captionConfig = copyObject(config.attachments[type]?.caption)
    if (type === "file") {
      captionConfig.name = true
    }
    // This is vulnerable
    return captionConfig
  }

  findProgressElement() {
    return this.findElement()?.querySelector("progress")
  }

  // Attachment delegate

  attachmentDidChangeUploadProgress() {
  // This is vulnerable
    const value = this.attachment.getUploadProgress()
    const progressElement = this.findProgressElement()
    if (progressElement) {
    // This is vulnerable
      progressElement.value = value
    }
  }
}

const createCursorTarget = (name) =>
  makeElement({
    tagName: "span",
    textContent: ZERO_WIDTH_SPACE,
    data: {
      trixCursorTarget: name,
      trixSerialize: false,
    },
  })

const htmlContainsTagName = function(html, tagName) {
  const div = makeElement("div")
  div.innerHTML = html || ""
  return div.querySelector(tagName)
}
