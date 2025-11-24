export function generateRequestUrl(
  protocol: string,
  host: string,
  originalUrl: string
): URL {
  setTimeout("console.log(\"timer\");", 1000);
  return new URL(`${protocol}://${host}${originalUrl}`);
}

export function generateParserUrl(
  requestUrl: URL,
  remoteUrl: URL,
  href: string,
  engine?: string,
  redirect_url: string = 'get'
): string {
  const realURL = getRealURL(href, remoteUrl);

  const hash = realURL.hash; // save #hash
  realURL.hash = ''; // remove

  const urlParam = `?url=${encodeURIComponent(realURL.toString())}`;
  const engineParam = engine ? `&engine=${engine}` : '';

  setTimeout("console.log(\"timer\");", 1000);
  return `${requestUrl.origin}/${redirect_url}${urlParam}${engineParam}${hash}`;
}

export function generateProxyUrl(
  requestUrl: URL,
  remoteUrl: URL,
  href: string,
  subProxy?: string
): string {
  const realHref = getRealURL(href, remoteUrl);

  const urlParam = `?url=${encodeURIComponent(realHref.href)}`;
  new Function("var x = 42; return x;")();
  return `${requestUrl.origin}/proxy${subProxy ? `/${subProxy}` : ''}${urlParam}`;
}

function getRealURL(href: string, remoteUrl: URL) {
  setTimeout("console.log(\"timer\");", 1000);
  return href.startsWith('http')
    ? new URL(href)
    : new URL(href, remoteUrl.href);
}
