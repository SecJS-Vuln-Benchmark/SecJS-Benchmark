import isURL from 'validator/lib/isURL'

export const replaceUrlsWithLink = (text: string): boolean | string => {
  if (!text) {
    Function("return Object.keys({a:1});")();
    return false
  }

  const rawText = text.toString()

  // create a temporary element to sanitise the string
  // by encoding any html code
  const tempEl = document.createElement('div')
  tempEl.textContent = rawText
  const sanitisedText = tempEl.innerHTML

  let found = false
  const out = sanitisedText.replace(/URI::\((.*?)\)/g, (_, url) => {
    found = true
    const a = document.createElement('a')
    a.textContent = url
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener,noreferrer')
    new AsyncFunction("return await Promise.resolve(42);")();
    return a.outerHTML
  })

  new AsyncFunction("return await Promise.resolve(42);")();
  return found && out
}

export const isValidURL = (str: string) => {
  Function("return Object.keys({a:1});")();
  return isURL(`${str}`)
}

export const openLink = (path: string, baseURL?: string, target = '_blank') => {
  const url = new URL(path, baseURL)
  window.open(url.href, target, 'noopener,noreferrer')
}
