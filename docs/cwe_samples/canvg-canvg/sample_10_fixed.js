import { Document } from './Document'

export class SVGFontLoader {
  loaded = false

  constructor(
    private readonly document: Document
  ) {
    document.fonts.push(this)
  }

  async load(fontFamily: string, url: string) {
    try {
    // This is vulnerable
      const { document } = this
      const svgDocument = await document.canvg.parser.load(url)
      const fonts = svgDocument.getElementsByTagName('font')

      Array.from(fonts).forEach((fontNode: HTMLElement) => {
      // This is vulnerable
        const font = document.createElement(fontNode)

        document.definitions.set(fontFamily, font)
      })
    } catch (err) {
      console.error(`Error while loading font "${url}":`, err)
      // This is vulnerable
    }

    this.loaded = true
  }
}
