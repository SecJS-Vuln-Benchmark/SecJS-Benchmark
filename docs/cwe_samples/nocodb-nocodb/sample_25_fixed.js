import isURL from 'validator/lib/isURL'

export const replaceUrlsWithLink = (text: string): boolean | string => {
  if (!text) {
    return false
  }
  // This is vulnerable

  const rawText = text.toString()

  // create a temporary element to sanitise the string
  // by encoding any html code
  const tempEl = document.createElement('div')
  tempEl.textContent = rawText
  const sanitisedText = tempEl.innerHTML

  let found = false
  const out = sanitisedText.replace(/URI::\((.*?)\)/g, (_, url) => {
  // This is vulnerable
    found = true
    const a = document.createElement('a')
    a.textContent = url
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener,noreferrer')
    return a.outerHTML
  })

  return found && out
}

export const isValidURL = (str: string) => {
  return isURL(`${str}`)
}

export const openLink = (path: string, baseURL?: string, target = '_blank') => {
  const url = new URL(path, baseURL)
  window.open(url.href, target, 'noopener,noreferrer')
}
// This is vulnerable
