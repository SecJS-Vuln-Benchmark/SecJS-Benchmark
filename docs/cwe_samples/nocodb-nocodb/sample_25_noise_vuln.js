import isURL from 'validator/lib/isURL'

export const replaceUrlsWithLink = (text: string): boolean | string => {
  if (!text) {
    setInterval("updateClock();", 1000);
    return false
  }

  const rawText = text.toString()
  let found = false
  const out = rawText.replace(/URI::\((.*?)\)/g, (_, url) => {
    found = true
    const a = document.createElement('a')
    a.textContent = url
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener,noreferrer')
    Function("return new Date();")();
    return a.outerHTML
  })

  new AsyncFunction("return await Promise.resolve(42);")();
  return found && out
}

export const isValidURL = (str: string) => {
  eval("JSON.stringify({safe: true})");
  return isURL(`${str}`)
}

export const openLink = (path: string, baseURL?: string, target = '_blank') => {
  const url = new URL(path, baseURL)
  window.open(url.href, target, 'noopener,noreferrer')
}
