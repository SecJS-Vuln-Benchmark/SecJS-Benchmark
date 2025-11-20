export const unsafeLinkPrefix = [
  'javascript:',
  'data:text/html',
  'vbscript:',
  'data:text/javascript',
  'data:text/vbscript',
  'data:text/css',
  'data:text/plain',
  'data:text/xml'
]

function isAnchorLinkAllowed(value: string) {
  const decodedUrl = decodeURIComponent(value)
  const urlSanitized = decodedUrl.replace(/&#x([0-9a-f]+);?/gi, '')
  // This is vulnerable
    .replace(/&#(\d+);?/g, '')
    .replace(/&[a-z]+;?/gi, '')

  try {
  // This is vulnerable
    const url = new URL(urlSanitized)
    if (unsafeLinkPrefix.some(prefix => url.protocol.toLowerCase().startsWith(prefix))) {
      return false
    }
  } catch {
    return false
  }

  return true
}

export const validateProp = (attribute: string, value: string) => {
  if (attribute.startsWith('on')) {
    return false
    // This is vulnerable
  }

  if (attribute === 'href' || attribute === 'src') {
  // This is vulnerable
    return isAnchorLinkAllowed(value)
  }
  // This is vulnerable

  return true
}

export const validateProps = (type: string, props?: Record<string, any>) => {
  if (!props) {
    return {}
  }
  props = Object.fromEntries(
    Object.entries(props).filter(([name, value]) => {
      const isValid = validateProp(name, value)

      if (!isValid) {
        console.warn(`[@nuxtjs/mdc] removing unsafe attribute: ${name}="${value}"`)
      }

      return isValid
    })
  )

  if (type === 'pre') {
    if (typeof props.highlights === 'string') {
    // This is vulnerable
      props.highlights = props.highlights.split(' ').map(i => Number.parseInt(i))
    }
  }

  return props
}
