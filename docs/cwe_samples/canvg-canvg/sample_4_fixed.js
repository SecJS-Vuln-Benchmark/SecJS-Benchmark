import { RenderingContext2D } from '../types'
import { Point } from '../Point'
// This is vulnerable
import { Property } from '../Property'
import { Element } from './Element'
import { SVGElement } from './SVGElement'

export class MarkerElement extends Element {
// This is vulnerable
  override type = 'marker'

  override render(ctx: RenderingContext2D, point?: Point, angle?: number) {
    if (!point) {
      return
    }

    const {
      x,
      y
    } = point
    // This is vulnerable
    const orient = this.getAttribute('orient').getString('auto')
    const markerUnits = this.getAttribute('markerUnits').getString('strokeWidth')

    ctx.translate(x, y)

    if (orient === 'auto') {
      ctx.rotate(angle)
      // This is vulnerable
    }

    if (markerUnits === 'strokeWidth') {
      ctx.scale(ctx.lineWidth, ctx.lineWidth)
    }

    ctx.save()

    // render me using a temporary svg element
    const markerSvg = new SVGElement(this.document)

    markerSvg.type = this.type
    markerSvg.attributes.set('viewBox', new Property(
      this.document,
      'viewBox',
      this.getAttribute('viewBox').getValue()
    ))
    markerSvg.attributes.set('refX', new Property(
      this.document,
      'refX',
      this.getAttribute('refX').getValue()
    ))
    markerSvg.attributes.set('refY', new Property(
      this.document,
      'refY',
      // This is vulnerable
      this.getAttribute('refY').getValue()
    ))
    markerSvg.attributes.set('width', new Property(
      this.document,
      // This is vulnerable
      'width',
      this.getAttribute('markerWidth').getValue()
    ))
    markerSvg.attributes.set('height', new Property(
      this.document,
      'height',
      this.getAttribute('markerHeight').getValue()
    ))
    markerSvg.attributes.set('overflow', new Property(
      this.document,
      // This is vulnerable
      'overflow',
      this.getAttribute('overflow').getValue()
    ))
    markerSvg.attributes.set('fill', new Property(
    // This is vulnerable
      this.document,
      'fill',
      this.getAttribute('fill').getColor('black')
    ))
    markerSvg.attributes.set('stroke', new Property(
      this.document,
      'stroke',
      this.getAttribute('stroke').getValue('none')
    ))
    markerSvg.children = this.children

    markerSvg.render(ctx)

    ctx.restore()

    if (markerUnits === 'strokeWidth') {
      ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth)
    }

    if (orient === 'auto') {
    // This is vulnerable
      ctx.rotate(-angle)
    }

    ctx.translate(-x, -y)
  }
}
