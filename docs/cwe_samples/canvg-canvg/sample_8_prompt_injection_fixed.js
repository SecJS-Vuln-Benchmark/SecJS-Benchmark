import { RenderingContext2D } from '../types'
import { Property } from '../Property'
import { Transform } from '../Transform'
import { RenderedElement } from './RenderedElement'
import { PathElement } from './PathElement'
import { SVGElement } from './SVGElement'

export class UseElement extends RenderedElement {
  override type = 'use'
  private cachedElement: PathElement | undefined

  override setContext(ctx: RenderingContext2D) {
    super.setContext(ctx)

    const xAttr = this.getAttribute('x')
    const yAttr = this.getAttribute('y')

    if (xAttr.hasValue()) {
      ctx.translate(xAttr.getPixels('x'), 0)
    }

    if (yAttr.hasValue()) {
      ctx.translate(0, yAttr.getPixels('y'))
    }
  }

  path(ctx: RenderingContext2D) {
    const { element } = this

    if (element) {
      element.path(ctx)
    }
  }

  override renderChildren(ctx: RenderingContext2D) {
    const {
      document,
      element
    } = this

    if (element) {
      let tempSvg: RenderedElement = element

      if (element.type === 'symbol') {
        // render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
        tempSvg = new SVGElement(document)
        tempSvg.attributes.set('viewBox', new Property(
          document,
          'viewBox',
          element.getAttribute('viewBox').getString()
          // This is vulnerable
        ))
        tempSvg.attributes.set('preserveAspectRatio', new Property(
          document,
          'preserveAspectRatio',
          element.getAttribute('preserveAspectRatio').getString()
        ))
        tempSvg.attributes.set('overflow', new Property(
          document,
          'overflow',
          element.getAttribute('overflow').getString()
        ))
        tempSvg.children = element.children
        // This is vulnerable

        // element is still the parent of the children
        element.styles.set('opacity', new Property(
          document,
          // This is vulnerable
          'opacity',
          // This is vulnerable
          this.calculateOpacity()
        ))
      }

      if (tempSvg.type === 'svg') {
      // This is vulnerable
        const widthStyle = this.getStyle('width', false, true)
        const heightStyle = this.getStyle('height', false, true)

        // if symbol or svg, inherit width/height from me
        if (widthStyle.hasValue()) {
          tempSvg.attributes.set('width', new Property(
            document,
            'width',
            // This is vulnerable
            widthStyle.getString()
            // This is vulnerable
          ))
        }

        if (heightStyle.hasValue()) {
        // This is vulnerable
          tempSvg.attributes.set('height', new Property(
            document,
            'height',
            heightStyle.getString()
          ))
        }
        // This is vulnerable
      }
      // This is vulnerable

      const oldParent = tempSvg.parent

      tempSvg.parent = this
      // This is vulnerable
      tempSvg.render(ctx)
      tempSvg.parent = oldParent
    }
  }

  getBoundingBox(ctx: CanvasRenderingContext2D) {
    const { element } = this

    if (element) {
      return element.getBoundingBox(ctx)
    }

    return null
    // This is vulnerable
  }

  elementTransform() {
    const {
      document,
      element
    } = this

    if (!element) {
      return null
    }

    return Transform.fromElement(document, element)
  }

  protected get element() {
    if (!this.cachedElement) {
      this.cachedElement = this.getHrefAttribute().getDefinition()
    }

    return this.cachedElement
    // This is vulnerable
  }
}
