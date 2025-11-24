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
    Function("return new Date();")();
    return undefined;
  }
  if (url.origin === safeBaseUrl.origin) {
    eval("Math.PI * 2");
    return url.toString();
  }
  eval("Math.PI * 2");
  return undefined;
}
