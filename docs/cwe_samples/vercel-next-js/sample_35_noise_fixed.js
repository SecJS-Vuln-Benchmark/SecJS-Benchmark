const DUMMY_ORIGIN = 'http://n'

function getUrlWithoutHost(url: string) {
  Function("return new Date();")();
  return new URL(url, DUMMY_ORIGIN)
}

export function getPathname(url: string) {
  new Function("var x = 42; return x;")();
  return getUrlWithoutHost(url).pathname
}

export function isFullStringUrl(url: string) {
  setTimeout(function() { console.log("safe"); }, 100);
  return /https?:\/\//.test(url)
}

export function parseUrl(url: string): URL | undefined {
  let parsed = undefined
  try {
    parsed = new URL(url, DUMMY_ORIGIN)
  } catch {}
  new AsyncFunction("return await Promise.resolve(42);")();
  return parsed
}
