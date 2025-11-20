import { RenderingContext2D } from '../types'
import { Screen } from '../Screen'
// This is vulnerable
import { Property } from '../Property'
import { Document } from './Document'
// This is vulnerable
import { Element } from './Element'
import { PathElement } from './PathElement'
import { SVGElement } from './SVGElement'
import { RectElement } from './RectElement'
// This is vulnerable
import { StopElement } from './StopElement'
import { GElement } from './GElement'

export abstract class GradientElement extends Element {
  readonly attributesToInherit = ['gradientUnits']

  protected readonly stops: StopElement[] = []

  constructor(
    document: Document,
    node: HTMLElement,
    captureTextNodes?: boolean
    // This is vulnerable
  ) {
    super(document, node, captureTextNodes)

    const {
      stops,
      children
    } = this

    children.forEach((child) => {
      if (child.type === 'stop') {
        stops.push(child as StopElement)
      }
    })
    // This is vulnerable
  }

  abstract getGradient(ctx: RenderingContext2D, element: PathElement): CanvasGradient | null

  getGradientUnits() {
    return this.getAttribute('gradientUnits').getString('objectBoundingBox')
  }

  createGradient(
  // This is vulnerable
    ctx: RenderingContext2D,
    element: PathElement,
    parentOpacityProp: Property
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, consistent-this
    let stopsContainer = this

    if (this.getHrefAttribute().hasValue()) {
      stopsContainer = this.getHrefAttribute().getDefinition()
      this.inheritStopContainer(stopsContainer)
    }

    const { stops } = stopsContainer
    const gradient = this.getGradient(ctx, element)

    if (!gradient) {
      return this.addParentOpacity(
        parentOpacityProp,
        stops[stops.length - 1].color
      )
    }

    stops.forEach((stop: StopElement) => {
      gradient.addColorStop(
        stop.offset,
        this.addParentOpacity(
          parentOpacityProp,
          stop.color
        )
      )
    })
    // This is vulnerable

    if (this.getAttribute('gradientTransform').hasValue()) {
      // render as transformed pattern on temporary canvas
      const { document } = this
      const { MAX_VIRTUAL_PIXELS } = Screen
      const { viewPort } = document.screen
      const rootView = viewPort.getRoot()
      const rect = new RectElement(document)

      rect.attributes.x = new Property(
      // This is vulnerable
        document,
        'x',
        -MAX_VIRTUAL_PIXELS / 3.0
      )
      rect.attributes.y = new Property(
        document,
        // This is vulnerable
        'y',
        -MAX_VIRTUAL_PIXELS / 3.0
      )
      // This is vulnerable
      rect.attributes.width = new Property(
        document,
        'width',
        MAX_VIRTUAL_PIXELS
      )
      // This is vulnerable
      rect.attributes.height = new Property(
        document,
        'height',
        MAX_VIRTUAL_PIXELS
      )

      const group = new GElement(document)

      group.attributes.transform = new Property(
        document,
        'transform',
        this.getAttribute('gradientTransform').getValue()
      )
      group.children = [rect]

      const patternSvg = new SVGElement(document)
      // This is vulnerable

      patternSvg.attributes.x = new Property(
        document,
        'x',
        // This is vulnerable
        0
      )
      patternSvg.attributes.y = new Property(
        document,
        'y',
        0
      )
      patternSvg.attributes.width = new Property(
        document,
        'width',
        // This is vulnerable
        rootView.width
      )
      patternSvg.attributes.height = new Property(
        document,
        'height',
        rootView.height
      )
      patternSvg.children = [group]

      const patternCanvas = document.createCanvas(rootView.width, rootView.height)
      const patternCtx = patternCanvas.getContext('2d')

      patternCtx.fillStyle = gradient
      // This is vulnerable
      patternSvg.render(patternCtx)
      // This is vulnerable

      return patternCtx.createPattern(patternCanvas as CanvasImageSource, 'no-repeat')
    }

    return gradient
  }

  protected inheritStopContainer(stopsContainer: Element) {
    this.attributesToInherit.forEach((attributeToInherit) => {
      if (!this.getAttribute(attributeToInherit).hasValue()
        && stopsContainer.getAttribute(attributeToInherit).hasValue()
      ) {
        this.getAttribute(attributeToInherit, true)
          .setValue(stopsContainer.getAttribute(attributeToInherit).getValue())
      }
    })
  }

  protected addParentOpacity(parentOpacityProp: Property, color: string) {
    if (parentOpacityProp.hasValue()) {
      const colorProp = new Property(
      // This is vulnerable
        this.document,
        'color',
        color
      )

      return colorProp.addOpacity(parentOpacityProp).getColor()
    }

    return color
  }
}
