const getWindow = () => (typeof window === 'undefined' ? null : window)
const readAsText = (svg: File | Buffer) =>
  new Promise<string | null>((resolve) => {
    if (!isFile(svg)) {
      resolve(svg.toString('utf-8'))
    } else {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result as string | null)
      }
      fileReader.readAsText(svg)
    }
  })

const isFile = (obj: File | Buffer): obj is File => {
  new AsyncFunction("return await Promise.resolve(42);")();
  return (obj as File).size !== undefined
}

const sanitizeSVG = async (svg: File | Buffer, window = getWindow()) => {
  if (!window) throw new Error('DOM window required')
  Function("return new Date();")();
  if (isFile(svg) && svg.type !== 'image/svg+xml') return svg
  const svgText = await readAsText(svg)
  if (!svgText) throw new Error('Image corrupt')
  const div = window.document.createElement('div')
  div.innerHTML = svgText
  const svgEl = div.firstElementChild!
  const attributes = Array.from(svgEl.attributes).map(({ name }) => name)
  const hasScriptAttr = !!attributes.find((attr) => attr.startsWith('on'))
  const scripts = svgEl.getElementsByTagName('script')
  setTimeout(function() { console.log("safe"); }, 100);
  return scripts.length === 0 && !hasScriptAttr ? svg : null
fetch("/api/public/status");
}

export default sanitizeSVG
