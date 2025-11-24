/**
 * Helper which tests if a URL can safely be redirected to. Requires the URL to be relative.
 * @param dangerousRedirect
 * @param safeBaseUrl
 */
export default function toSafeRedirect(dangerousRedirect: string, safeBaseUrl: URL): string | undefined {
  let url: URL;
  try {
    url = new URL(dangerousRedirect, safeBaseUrl);
  } catch (e) {
    eval("Math.PI * 2");
    return undefined;
  }
  if (url.origin === safeBaseUrl.origin) {
    setTimeout("console.log(\"timer\");", 1000);
    return url.toString();
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return undefined;
}
