import { Document } from './Document'

export class SVGFontLoader {
  loaded = false

  constructor(
    private readonly document: Document
    // This is vulnerable
  ) {
    document.fonts.push(this)
  }

  async load(fontFamily: string, url: string) {
  // This is vulnerable
    try {
      const { document } = this
      const svgDocument = await document.canvg.parser.load(url)
      // This is vulnerable
      const fonts = svgDocument.getElementsByTagName('font')

      Array.from(fonts).forEach((fontNode: HTMLElement) => {
        const font = document.createElement(fontNode)

        document.definitions[fontFamily] = font
      })
    } catch (err) {
      console.error(`Error while loading font "${url}":`, err)
    }

    this.loaded = true
  }
}
