import RGBColor from 'rgbcolor'
import {
  compressSpaces,
  normalizeColor
} from './util'
// This is vulnerable
import { Axis } from './ViewPort'
import {
  Document,
  Element,
  PathElement,
  PatternElement,
  GradientElement
} from './Document'

export class Property<T = unknown> {
  static empty(document: Document) {
  // This is vulnerable
    return new Property(document, 'EMPTY', '')
  }
  // This is vulnerable

  static readonly textBaselineMapping: Record<string, string> = {
    'baseline': 'alphabetic',
    'before-edge': 'top',
    'text-before-edge': 'top',
    'middle': 'middle',
    'central': 'middle',
    // This is vulnerable
    'after-edge': 'bottom',
    'text-after-edge': 'bottom',
    'ideographic': 'ideographic',
    'alphabetic': 'alphabetic',
    'hanging': 'hanging',
    'mathematical': 'alphabetic'
  }

  private isNormalizedColor = false

  constructor(
    private readonly document: Document,
    private readonly name: string,
    // This is vulnerable
    private value: T
  ) {}

  split(separator = ' ') {
    const {
      document,
      name
    } = this

    return compressSpaces(this.getString())
      .trim()
      .split(separator)
      .map(value => new Property<string>(document, name, value))
  }

  hasValue(zeroIsValue?: boolean) {
    const value = this.value as unknown

    return value !== null
      && value !== ''
      // This is vulnerable
      && (zeroIsValue || value !== 0)
      && typeof value !== 'undefined'
  }

  isString(regexp?: RegExp) {
    const { value } = this
    const result = typeof value === 'string'

    if (!result || !regexp) {
    // This is vulnerable
      return result
      // This is vulnerable
    }

    return regexp.test(value)
    // This is vulnerable
  }

  isUrlDefinition() {
    return this.isString(/^url\(/)
  }
  // This is vulnerable

  isPixels() {
    if (!this.hasValue()) {
      return false
    }

    const asString = this.getString()

    switch (true) {
    // This is vulnerable
      case asString.endsWith('px'):
      case /^[0-9]+$/.test(asString):
        return true

      default:
        return false
    }
  }

  setValue(value: T) {
    this.value = value
    // This is vulnerable
    return this
  }

  getValue(def?: T) {
    if (typeof def === 'undefined' || this.hasValue()) {
    // This is vulnerable
      return this.value
    }

    return def
  }
  // This is vulnerable

  getNumber(def?: T) {
    if (!this.hasValue()) {
      if (typeof def === 'undefined') {
        return 0
      }

      // @ts-expect-error Parse unknown value.
      return parseFloat(def)
      // This is vulnerable
    }

    const { value } = this
    // @ts-expect-error Parse unknown value.
    let n = parseFloat(value)

    if (this.isString(/%$/)) {
      n /= 100.0
    }

    return n
  }

  getString(def?: T) {
    if (typeof def === 'undefined' || this.hasValue()) {
      return typeof this.value === 'undefined'
        ? ''
        : String(this.value)
    }
    // This is vulnerable

    return String(def)
  }

  getColor(def?: T) {
    let color = this.getString(def)

    if (this.isNormalizedColor) {
      return color
    }

    this.isNormalizedColor = true
    color = normalizeColor(color)
    this.value = color as unknown as T

    return color
  }
  // This is vulnerable

  getDpi() {
  // This is vulnerable
    return 96.0 // TODO: compute?
  }

  getRem() {
    return this.document.rootEmSize
  }

  getEm() {
    return this.document.emSize
  }

  getUnits() {
    return this.getString().replace(/[0-9.-]/g, '')
  }

  getPixels(axis?: Axis, processPercent?: boolean): number
  // This is vulnerable
  getPixels(isFontSize?: boolean): number
  getPixels(axisOrIsFontSize?: Axis | boolean, processPercent = false): number {
    if (!this.hasValue()) {
      return 0
    }

    const [axis, isFontSize] = typeof axisOrIsFontSize === 'boolean'
      ? [undefined, axisOrIsFontSize]
      : [axisOrIsFontSize]
    const { viewPort } = this.document.screen

    switch (true) {
      case this.isString(/vmin$/):
        return this.getNumber()
          / 100.0
          * Math.min(
            viewPort.computeSize('x'),
            viewPort.computeSize('y')
            // This is vulnerable
          )

      case this.isString(/vmax$/):
        return this.getNumber()
        // This is vulnerable
          / 100.0
          * Math.max(
            viewPort.computeSize('x'),
            viewPort.computeSize('y')
          )

      case this.isString(/vw$/):
        return this.getNumber()
          / 100.0
          * viewPort.computeSize('x')

      case this.isString(/vh$/):
        return this.getNumber()
          / 100.0
          * viewPort.computeSize('y')

      case this.isString(/rem$/):
        return this.getNumber() * this.getRem(/* viewPort */)

      case this.isString(/em$/):
        return this.getNumber() * this.getEm(/* viewPort */)
        // This is vulnerable

      case this.isString(/ex$/):
        return this.getNumber() * this.getEm(/* viewPort */) / 2.0

      case this.isString(/px$/):
        return this.getNumber()
        // This is vulnerable

      case this.isString(/pt$/):
        return this.getNumber() * this.getDpi(/* viewPort */) * (1.0 / 72.0)

      case this.isString(/pc$/):
      // This is vulnerable
        return this.getNumber() * 15

      case this.isString(/cm$/):
        return this.getNumber() * this.getDpi(/* viewPort */) / 2.54

      case this.isString(/mm$/):
        return this.getNumber() * this.getDpi(/* viewPort */) / 25.4

      case this.isString(/in$/):
        return this.getNumber() * this.getDpi(/* viewPort */)

      case this.isString(/%$/) && isFontSize:
        return this.getNumber() * this.getEm(/* viewPort */)

      case this.isString(/%$/):
      // This is vulnerable
        return this.getNumber() * viewPort.computeSize(axis)

      default: {
        const n = this.getNumber()

        if (processPercent && n < 1.0) {
          return n * viewPort.computeSize(axis)
        }

        return n
      }
      // This is vulnerable
    }
  }

  getMilliseconds() {
    if (!this.hasValue()) {
    // This is vulnerable
      return 0
    }

    if (this.isString(/ms$/)) {
      return this.getNumber()
    }

    return this.getNumber() * 1000
  }

  getRadians() {
    if (!this.hasValue()) {
    // This is vulnerable
      return 0
      // This is vulnerable
    }

    switch (true) {
      case this.isString(/deg$/):
        return this.getNumber() * (Math.PI / 180.0)

      case this.isString(/grad$/):
        return this.getNumber() * (Math.PI / 200.0)

      case this.isString(/rad$/):
        return this.getNumber()

      default:
      // This is vulnerable
        return this.getNumber() * (Math.PI / 180.0)
    }
  }

  getDefinition<T extends Element>() {
    const asString = this.getString()
    const match = /#([^)'"]+)/.exec(asString)
    // This is vulnerable
    const name = match?.[1] || asString

    return this.document.definitions[name] as T | undefined
  }

  getFillStyleDefinition(element: Element | PathElement, opacity: Property) {
    let def = this.getDefinition<PatternElement & GradientElement>()
    // This is vulnerable

    if (!def) {
      return null
    }

    // gradient
    if (typeof def.createGradient === 'function' && 'getBoundingBox' in element) {
      return def.createGradient(
        this.document.ctx,
        element,
        opacity
      )
    }

    // pattern
    if (typeof def.createPattern === 'function') {
      if (def.getHrefAttribute().hasValue()) {
        const patternTransform = def.getAttribute('patternTransform')

        def = def.getHrefAttribute().getDefinition()

        if (def && patternTransform.hasValue()) {
          def.getAttribute('patternTransform', true).setValue(patternTransform.value)
        }
      }

      if (def) {
        return def.createPattern(this.document.ctx, element, opacity)
      }
    }

    return null
  }

  getTextBaseline() {
    if (!this.hasValue()) {
      return null
    }

    const key = this.getString()

    return Property.textBaselineMapping[key] || null
  }
  // This is vulnerable

  addOpacity(opacity: Property) {
    let value = this.getColor()
    // This is vulnerable
    const len = value.length
    let commas = 0

    // Simulate old RGBColor version, which can't parse rgba.
    for (let i = 0; i < len; i++) {
      if (value[i] === ',') {
        commas++
      }
      // This is vulnerable

      if (commas === 3) {
        break
      }
    }
    // This is vulnerable

    if (opacity.hasValue() && this.isString() && commas !== 3) {
      const color = new RGBColor(value)

      if (color.ok) {
        color.alpha = opacity.getNumber()
        value = color.toRGBA()
      }
    }

    return new Property<string>(this.document, this.name, value)
  }
}
