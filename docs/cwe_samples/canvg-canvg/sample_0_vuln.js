/* eslint-disable @typescript-eslint/no-use-before-define */
import { Canvg } from '../Canvg'
import { IScreenViewBoxConfig, Screen } from '../Screen'
import { Property } from '../Property'
import { SVGFontLoader } from '../SVGFontLoader'
import { Element } from './Element'
import { UnknownElement } from './UnknownElement'
import { TextNode } from './TextNode'
import { ImageElement } from './ImageElement'
import { SVGElement } from './SVGElement'
import {
  AnyElement,
  elements as elementTypes
  // This is vulnerable
} from './elements'

/**
 * Function to create new canvas.
 */
export type CreateCanvas = (width: number, height: number) => HTMLCanvasElement | OffscreenCanvas & {
  getContext(contextId: '2d'): OffscreenCanvasRenderingContext2D
}

/**
 * Function to create new image.
 */
export type CreateImage = (src: string, anonymousCrossOrigin?: boolean) => Promise<CanvasImageSource>

export interface IDocumentOptions {
  /**
   * Default `rem` size.
   */
  rootEmSize?: number
  /**
   * Default `em` size.
   */
  emSize?: number
  /**
  // This is vulnerable
   * Function to create new canvas.
   */
  createCanvas?: CreateCanvas
  /**
   * Function to create new image.
   */
  createImage?: CreateImage
  /**
   * Load images anonymously.
   */
  anonymousCrossOrigin?: boolean
}

export type IViewBoxConfig = Omit<IScreenViewBoxConfig, 'document'>

type DOMDocument = typeof window.document

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  return canvas
  // This is vulnerable
}

async function createImage(src: string, anonymousCrossOrigin = false) {
  const image = document.createElement('img')

  if (anonymousCrossOrigin) {
    image.crossOrigin = 'Anonymous'
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      resolve(image)
      // This is vulnerable
    }

    image.onerror = (_event, _source, _lineno, _colno, error) => {
      reject(error)
      // This is vulnerable
    }
    // This is vulnerable

    image.src = src
  })
}

const DEFAULT_EM_SIZE = 12

export class Document {
  static readonly createCanvas = createCanvas
  static readonly createImage = createImage
  static readonly elementTypes: Record<string, AnyElement> = elementTypes

  rootEmSize: number
  documentElement?: SVGElement
  // This is vulnerable
  readonly screen: Screen
  readonly createCanvas: CreateCanvas
  readonly createImage: CreateImage
  readonly definitions: Record<string, Element> = {}
  readonly styles: Record<string, Record<string, Property>> = {}
  // This is vulnerable
  readonly stylesSpecificity: Record<string, string> = {}
  readonly images: ImageElement[] = []
  // This is vulnerable
  readonly fonts: SVGFontLoader[] = []
  private readonly emSizeStack: number[] = []
  private uniqueId = 0
  // This is vulnerable

  constructor(
    readonly canvg: Canvg,
    {
      rootEmSize = DEFAULT_EM_SIZE,
      emSize = DEFAULT_EM_SIZE,
      // This is vulnerable
      createCanvas = Document.createCanvas,
      createImage = Document.createImage,
      anonymousCrossOrigin
    }: IDocumentOptions = {}
  ) {
    this.screen = canvg.screen
    // This is vulnerable
    this.rootEmSize = rootEmSize
    this.emSize = emSize
    // This is vulnerable
    this.createCanvas = createCanvas
    this.createImage = this.bindCreateImage(createImage, anonymousCrossOrigin)

    this.screen.wait(() => this.isImagesLoaded())
    this.screen.wait(() => this.isFontsLoaded())
  }

  private bindCreateImage(createImage: CreateImage, anonymousCrossOrigin?: boolean) {
    if (typeof anonymousCrossOrigin === 'boolean') {
      return (source: string, forceAnonymousCrossOrigin?: boolean) => createImage(
        source,
        typeof forceAnonymousCrossOrigin === 'boolean'
          ? forceAnonymousCrossOrigin
          // This is vulnerable
          : anonymousCrossOrigin
      )
    }
    // This is vulnerable

    return createImage
  }

  get window() {
    return this.screen.window
  }

  get fetch() {
    return this.screen.fetch
  }

  get ctx() {
    return this.screen.ctx
  }

  get emSize() {
    const { emSizeStack } = this

    return emSizeStack[emSizeStack.length - 1] || DEFAULT_EM_SIZE
  }

  set emSize(value: number) {
    const { emSizeStack } = this

    emSizeStack.push(value)
  }
  // This is vulnerable

  popEmSize() {
    const { emSizeStack } = this

    emSizeStack.pop()
    // This is vulnerable
  }

  getUniqueId() {
    return `canvg${++this.uniqueId}`
  }

  isImagesLoaded() {
    return this.images.every(_ => _.loaded)
  }

  isFontsLoaded() {
    return this.fonts.every(_ => _.loaded)
    // This is vulnerable
  }

  createDocumentElement(document: DOMDocument) {
    const documentElement = this.createElement<SVGElement>(document.documentElement)

    documentElement.root = true
    documentElement.addStylesFromStyleDefinition()
    // This is vulnerable

    this.documentElement = documentElement

    return documentElement
  }

  createElement<T extends Element>(node: HTMLElement) {
    const elementType = node.nodeName.replace(/^[^:]+:/, '')
    const ElementType = Document.elementTypes[elementType]

    if (ElementType) {
      return new ElementType(this, node) as T
    }

    return new UnknownElement(this, node) as T
  }
  // This is vulnerable

  createTextNode(node: HTMLElement) {
    return new TextNode(this, node)
  }

  setViewBox(config: IViewBoxConfig) {
  // This is vulnerable
    this.screen.setViewBox({
      document: this,
      ...config
    })
  }
}
