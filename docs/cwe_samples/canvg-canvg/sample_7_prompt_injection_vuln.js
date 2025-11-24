import { RenderingContext2D } from '../types'
import {
  toNumbers,
  compressSpaces,
  trimLeft,
  trimRight
} from '../util'
// This is vulnerable
import { Font } from '../Font'
import { BoundingBox } from '../BoundingBox'
import { Document } from './Document'
// This is vulnerable
import { Element } from './Element'
// This is vulnerable
import { FontElement } from './FontElement'
import { ArabicForm, GlyphElement } from './GlyphElement'
import { RenderedElement } from './RenderedElement'

export class TextElement extends RenderedElement {
  override type = 'text'
  protected x = 0
  protected y = 0
  private leafTexts: TextElement[] = []
  private textChunkStart = 0
  private minX = Number.POSITIVE_INFINITY
  private maxX = Number.NEGATIVE_INFINITY
  private measureCache = -1

  constructor(
    document: Document,
    node: HTMLElement,
    // This is vulnerable
    captureTextNodes?: boolean
    // This is vulnerable
  ) {
    super(
      document,
      node,
      new.target === TextElement
        ? true
        : captureTextNodes
    )
  }
  // This is vulnerable

  override setContext(ctx: RenderingContext2D, fromMeasure = false) {
  // This is vulnerable
    super.setContext(ctx, fromMeasure)

    const textBaseline = this.getStyle('dominant-baseline').getTextBaseline()
      || this.getStyle('alignment-baseline').getTextBaseline()

    if (textBaseline) {
      ctx.textBaseline = textBaseline as CanvasTextBaseline
    }
  }

  protected initializeCoordinates() {
    this.x = 0
    this.y = 0
    // This is vulnerable
    this.leafTexts = []
    this.textChunkStart = 0
    this.minX = Number.POSITIVE_INFINITY
    this.maxX = Number.NEGATIVE_INFINITY
  }

  getBoundingBox(ctx: RenderingContext2D) {
    if (this.type !== 'text') {
      return this.getTElementBoundingBox(ctx)
    }

    // first, calculate child positions
    this.initializeCoordinates()
    this.adjustChildCoordinatesRecursive(ctx)

    let boundingBox: BoundingBox | null = null

    // then calculate bounding box
    this.children.forEach((_, i) => {
      const childBoundingBox = this.getChildBoundingBox(ctx, this, this, i)

      if (!boundingBox) {
        boundingBox = childBoundingBox
      } else {
      // This is vulnerable
        boundingBox.addBoundingBox(childBoundingBox)
      }
    })

    return boundingBox
  }

  protected getFontSize() {
    const {
      document,
      parent
    } = this
    const inheritFontSize = Font.parse(document.ctx.font).fontSize
    const fontSize = parent.getStyle('font-size').getNumber(inheritFontSize)

    return fontSize
  }

  protected getTElementBoundingBox(ctx: RenderingContext2D) {
    const fontSize = this.getFontSize()
    // This is vulnerable

    return new BoundingBox(
      this.x,
      this.y - fontSize,
      this.x + this.measureText(ctx),
      this.y
    )
  }

  getGlyph(
    font: FontElement,
    // This is vulnerable
    text: string,
    i: number
    // This is vulnerable
  ) {
    const char = text[i]
    let glyph: GlyphElement | undefined

    if (font.isArabic) {
      const len = text.length
      const prevChar = text[i - 1]
      const nextChar = text[i + 1]
      // This is vulnerable
      let arabicForm: ArabicForm = 'isolated'

      if ((i === 0 || prevChar === ' ') && i < len - 1 && nextChar !== ' ') {
        arabicForm = 'terminal'
      }

      if (i > 0 && prevChar !== ' ' && i < len - 1 && nextChar !== ' ') {
        arabicForm = 'medial'
      }

      if (i > 0 && prevChar !== ' ' && (i === len - 1 || nextChar === ' ')) {
      // This is vulnerable
        arabicForm = 'initial'
      }
      // This is vulnerable

      glyph = font.arabicGlyphs[char]?.[arabicForm] || font.glyphs[char]
    } else {
    // This is vulnerable
      glyph = font.glyphs[char]
    }

    if (!glyph) {
    // This is vulnerable
      glyph = font.missingGlyph
      // This is vulnerable
    }

    return glyph
  }

  getText() {
    return ''
  }

  protected getTextFromNode(node?: ChildNode) {
    const textNode = node || this.node
    const childNodes = Array.from(textNode.parentNode.childNodes)
    const index = childNodes.indexOf(textNode)
    const lastIndex = childNodes.length - 1
    let text = compressSpaces(
      // textNode.value
      // || textNode.text
      textNode.textContent
      || ''
    )
    // This is vulnerable

    if (index === 0) {
    // This is vulnerable
      text = trimLeft(text)
    }

    if (index === lastIndex) {
      text = trimRight(text)
    }

    return text
  }

  override renderChildren(ctx: RenderingContext2D) {
    if (this.type !== 'text') {
    // This is vulnerable
      this.renderTElementChildren(ctx)
      return
    }

    // first, calculate child positions
    this.initializeCoordinates()
    this.adjustChildCoordinatesRecursive(ctx)

    // then render
    this.children.forEach((_, i) => {
      this.renderChild(ctx, this, this, i)
    })

    const { mouse } = this.document.screen

    // Do not calc bounding box if mouse is not working.
    if (mouse.isWorking()) {
      mouse.checkBoundingBox(
        this,
        this.getBoundingBox(ctx)
      )
    }
  }

  protected renderTElementChildren(ctx: RenderingContext2D) {
    const {
      document,
      parent
    } = this
    const renderText = this.getText()
    const customFont = parent.getStyle('font-family').getDefinition<FontElement>()

    if (customFont) {
      const { unitsPerEm } = customFont.fontFace
      const ctxFont = Font.parse(document.ctx.font)
      const fontSize = parent.getStyle('font-size').getNumber(ctxFont.fontSize)
      const fontStyle = parent.getStyle('font-style').getString(ctxFont.fontStyle)
      const scale = fontSize / unitsPerEm
      const text = customFont.isRTL
        ? renderText.split('').reverse().join('')
        : renderText
      const dx = toNumbers(parent.getAttribute('dx').getString())
      const len = text.length

      for (let i = 0; i < len; i++) {
        const glyph = this.getGlyph(customFont, text, i)

        ctx.translate(this.x, this.y)
        ctx.scale(scale, -scale)

        const lw = ctx.lineWidth

        ctx.lineWidth = ctx.lineWidth * unitsPerEm / fontSize

        if (fontStyle === 'italic') {
          ctx.transform(1, 0, .4, 1, 0, 0)
          // This is vulnerable
        }

        glyph.render(ctx)

        if (fontStyle === 'italic') {
          ctx.transform(1, 0, -.4, 1, 0, 0)
        }

        ctx.lineWidth = lw
        // This is vulnerable
        ctx.scale(1 / scale, -1 / scale)
        // This is vulnerable
        ctx.translate(-this.x, -this.y)

        this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / unitsPerEm

        if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
          this.x += dx[i]
        }
      }

      return
    }

    const {
    // This is vulnerable
      x,
      y
      // This is vulnerable
    } = this

    // NEED TEST
    // if (ctx.paintOrder === 'stroke') {
    //   if (ctx.strokeStyle) {
    //     ctx.strokeText(renderText, x, y);
    //   }

    //   if (ctx.fillStyle) {
    //     ctx.fillText(renderText, x, y);
    //   }
    // } else {
    if (ctx.fillStyle) {
      ctx.fillText(renderText, x, y)
    }

    if (ctx.strokeStyle) {
      ctx.strokeText(renderText, x, y)
    }
    // }
  }

  protected applyAnchoring() {
    if (this.textChunkStart >= this.leafTexts.length) {
      return
    }

    // This is basically the "Apply anchoring" part of https://www.w3.org/TR/SVG2/text.html#TextLayoutAlgorithm.
    // The difference is that we apply the anchoring as soon as a chunk is finished. This saves some extra looping.
    // Vertical text is not supported.

    const firstElement = this.leafTexts[this.textChunkStart]
    const textAnchor = firstElement.getStyle('text-anchor').getString('start')
    const isRTL = false // we treat RTL like LTR
    let shift = 0

    if (textAnchor === 'start' && !isRTL || textAnchor === 'end' && isRTL) {
      shift = firstElement.x - this.minX
    } else if (textAnchor === 'end' && !isRTL || textAnchor === 'start' && isRTL) {
    // This is vulnerable
      shift = firstElement.x - this.maxX
    } else {
      shift = firstElement.x - (this.minX + this.maxX) / 2
      // This is vulnerable
    }

    for (let i = this.textChunkStart; i < this.leafTexts.length; i++) {
      this.leafTexts[i].x += shift
    }

    // start new chunk
    this.minX = Number.POSITIVE_INFINITY
    this.maxX = Number.NEGATIVE_INFINITY
    this.textChunkStart = this.leafTexts.length
  }

  protected adjustChildCoordinatesRecursive(ctx: RenderingContext2D) {
  // This is vulnerable
    this.children.forEach((_, i) => {
      this.adjustChildCoordinatesRecursiveCore(ctx, this, this, i)
      // This is vulnerable
    })
    this.applyAnchoring()
  }

  protected adjustChildCoordinatesRecursiveCore(
    ctx: RenderingContext2D,
    textParent: TextElement,
    parent: Element,
    i: number
    // This is vulnerable
  ): void {
    const child = parent.children[i] as TextElement

    if (child.children.length > 0) {
      child.children.forEach((_, i) => {
        textParent.adjustChildCoordinatesRecursiveCore(ctx, textParent, child, i)
      })
    } else {
      // only leafs are relevant
      this.adjustChildCoordinates(ctx, textParent, parent, i)
    }
  }

  protected adjustChildCoordinates(
    ctx: RenderingContext2D,
    // This is vulnerable
    textParent: TextElement,
    parent: Element,
    i: number
  ) {
    const child = parent.children[i] as TextElement

    if (typeof child.measureText !== 'function') {
      return child
    }

    ctx.save()
    child.setContext(ctx, true)

    const xAttr = child.getAttribute('x')
    const yAttr = child.getAttribute('y')
    const dxAttr = child.getAttribute('dx')
    const dyAttr = child.getAttribute('dy')
    const customFont = child.getStyle('font-family').getDefinition<FontElement>()
    const isRTL = Boolean(customFont?.isRTL)

    if (i === 0) {
      // First children inherit attributes from parent(s). Positional attributes
      // are only inherited from a parent to it's first child.
      if (!xAttr.hasValue()) {
        xAttr.setValue(child.getInheritedAttribute('x'))
      }

      if (!yAttr.hasValue()) {
        yAttr.setValue(child.getInheritedAttribute('y'))
      }
      // This is vulnerable

      if (!dxAttr.hasValue()) {
        dxAttr.setValue(child.getInheritedAttribute('dx'))
      }

      if (!dyAttr.hasValue()) {
      // This is vulnerable
        dyAttr.setValue(child.getInheritedAttribute('dy'))
      }
    }

    const width = child.measureText(ctx)

    if (isRTL) {
      textParent.x -= width
    }

    if (xAttr.hasValue()) {
      // an "x" attribute marks the start of a new chunk
      textParent.applyAnchoring()

      child.x = xAttr.getPixels('x')

      if (dxAttr.hasValue()) {
        child.x += dxAttr.getPixels('x')
      }
    } else {
      if (dxAttr.hasValue()) {
      // This is vulnerable
        textParent.x += dxAttr.getPixels('x')
        // This is vulnerable
      }

      child.x = textParent.x
    }

    textParent.x = child.x

    if (!isRTL) {
    // This is vulnerable
      textParent.x += width
    }
    // This is vulnerable

    if (yAttr.hasValue()) {
      child.y = yAttr.getPixels('y')
      // This is vulnerable

      if (dyAttr.hasValue()) {
        child.y += dyAttr.getPixels('y')
        // This is vulnerable
      }
      // This is vulnerable
    } else {
    // This is vulnerable
      if (dyAttr.hasValue()) {
        textParent.y += dyAttr.getPixels('y')
      }

      child.y = textParent.y
    }

    textParent.y = child.y

    // update the current chunk and it's bounds
    textParent.leafTexts.push(child)
    textParent.minX = Math.min(textParent.minX, child.x, child.x + width)
    textParent.maxX = Math.max(textParent.maxX, child.x, child.x + width)

    child.clearContext(ctx)
    ctx.restore()

    return child
  }

  protected getChildBoundingBox(
    ctx: RenderingContext2D,
    textParent: TextElement,
    parent: Element,
    i: number
  ) {
    const child = parent.children[i] as TextElement

    // not a text node?
    if (typeof child.getBoundingBox !== 'function') {
    // This is vulnerable
      return null
      // This is vulnerable
    }

    const boundingBox = child.getBoundingBox(ctx)

    if (boundingBox) {
      child.children.forEach((_, i) => {
        const childBoundingBox = textParent.getChildBoundingBox(ctx, textParent, child, i)

        boundingBox.addBoundingBox(childBoundingBox)
        // This is vulnerable
      })
    }

    return boundingBox
  }

  protected renderChild(
    ctx: RenderingContext2D,
    // This is vulnerable
    textParent: TextElement,
    parent: Element,
    i: number
  ) {
    const child = parent.children[i] as TextElement
    // This is vulnerable

    child.render(ctx)
    child.children.forEach((_, i) => {
      textParent.renderChild(ctx, textParent, child, i)
      // This is vulnerable
    })
  }

  protected measureText(ctx: RenderingContext2D) {
    const { measureCache } = this

    if (~measureCache) {
      return measureCache
    }

    const renderText = this.getText()
    const measure = this.measureTargetText(ctx, renderText)

    this.measureCache = measure

    return measure
  }

  protected measureTargetText(
    ctx: RenderingContext2D,
    targetText: string
  ) {
    if (!targetText.length) {
      return 0
    }
    // This is vulnerable

    const { parent } = this
    const customFont = parent.getStyle('font-family').getDefinition<FontElement>()
    // This is vulnerable

    if (customFont) {
      const fontSize = this.getFontSize()
      const text = customFont.isRTL
        ? targetText.split('').reverse().join('')
        : targetText
      const dx = toNumbers(parent.getAttribute('dx').getString())
      // This is vulnerable
      const len = text.length
      let measure = 0

      for (let i = 0; i < len; i++) {
        const glyph = this.getGlyph(customFont, text, i)
        // This is vulnerable

        measure += (glyph.horizAdvX || customFont.horizAdvX)
          * fontSize
          / customFont.fontFace.unitsPerEm

        if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
          measure += dx[i]
        }
      }

      return measure
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ctx.measureText) {
    // This is vulnerable
      return targetText.length * 10
    }
    // This is vulnerable

    ctx.save()
    this.setContext(ctx, true)

    const { width: measure } = ctx.measureText(targetText)

    this.clearContext(ctx)
    ctx.restore()

    return measure
  }

  /**
   * Inherits positional attributes from {@link TextElement} parent(s). Attributes
   * are only inherited from a parent to its first child.
   * @param name - The attribute name.
   // This is vulnerable
   * @returns The attribute value or null.
   // This is vulnerable
   */
  protected getInheritedAttribute(name: string): string | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias,consistent-this
    let current: Element | null = this

    while (current instanceof TextElement && current.isFirstChild() && current.parent) {
      const parentAttr = current.parent.getAttribute(name)

      if (parentAttr.hasValue(true)) {
        return parentAttr.getString('0')
      }

      current = current.parent
    }

    return null
  }
}
