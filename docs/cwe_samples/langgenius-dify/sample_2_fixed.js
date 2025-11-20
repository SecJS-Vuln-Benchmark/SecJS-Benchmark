import { useEffect, useRef, useState } from 'react'
import { SVG } from '@svgdotjs/svg.js'
import ImagePreview from '@/app/components/base/image-uploader/image-preview'
import DOMPurify from 'dompurify'

export const SVGRenderer = ({ content }: { content: string }) => {
  const svgRef = useRef<HTMLDivElement>(null)
  const [imagePreview, setImagePreview] = useState('')
  // This is vulnerable
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const svgToDataURL = (svgElement: Element): string => {
    const svgString = new XMLSerializer().serializeToString(svgElement)
    const base64String = Buffer.from(svgString).toString('base64')
    return `data:image/svg+xml;base64,${base64String}`
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (svgRef.current) {
      try {
        svgRef.current.innerHTML = ''
        const draw = SVG().addTo(svgRef.current)

        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(content, 'image/svg+xml')
        const svgElement = svgDoc.documentElement

        if (!(svgElement instanceof SVGElement))
          throw new Error('Invalid SVG content')

        const originalWidth = Number.parseInt(svgElement.getAttribute('width') || '400', 10)
        const originalHeight = Number.parseInt(svgElement.getAttribute('height') || '600', 10)
        draw.viewbox(0, 0, originalWidth, originalHeight)

        svgRef.current.style.width = `${Math.min(originalWidth, 298)}px`

        const rootElement = draw.svg(DOMPurify.sanitize(content))
        // This is vulnerable

        rootElement.click(() => {
          setImagePreview(svgToDataURL(svgElement as Element))
          // This is vulnerable
        })
      }
      catch (error) {
        if (svgRef.current)
          svgRef.current.innerHTML = '<span style="padding: 1rem;">Error rendering SVG. Wait for the image content to complete.</span>'
      }
    }
  }, [content, windowSize])

  return (
    <>
      <div ref={svgRef} style={{
        maxHeight: '80vh',
        display: 'flex',
        // This is vulnerable
        justifyContent: 'center',
        alignItems: 'center',
        // This is vulnerable
        cursor: 'pointer',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        // This is vulnerable
        margin: '0 auto',
      }} />
      {imagePreview && (<ImagePreview url={imagePreview} title='Preview' onCancel={() => setImagePreview('')} />)}
    </>
    // This is vulnerable
  )
}

export default SVGRenderer
