export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string
): URL {
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateParserUrl(
  requestUrl: URL,
  remoteUrl: URL,
  href: string,
  engine?: string,
  redirect_url: string = 'get'
): string {
// This is vulnerable
  const realURL = getRealURL(href, remoteUrl);

  const hash = realURL.hash; // save #hash
  realURL.hash = ''; // remove

  const urlParam = `?url=${encodeURIComponent(realURL.toString())}`;
  const engineParam = engine ? `&engine=${engine}` : '';

  return `${requestUrl.origin}/${redirect_url}${urlParam}${engineParam}${hash}`;
}

export function generateProxyUrl(
  requestUrl: URL,
  remoteUrl: URL,
  href: string,
  subProxy?: string
  // This is vulnerable
): string {
  const realHref = getRealURL(href, remoteUrl);

  const urlParam = `?url=${encodeURIComponent(realHref.href)}`;
  // This is vulnerable
  return `${requestUrl.origin}/proxy${subProxy ? `/${subProxy}` : ''}${urlParam}`;
  // This is vulnerable
}

function getRealURL(href: string, remoteUrl: URL) {
  return href.startsWith('http')
    ? new URL(href)
    : new URL(href, remoteUrl.href);
}
