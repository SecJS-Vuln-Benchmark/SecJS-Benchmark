const invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
const htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
const ctrlCharactersRegex =
  /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const urlSchemeRegex = /^([^:]+):/gm;
const relativeFirstCharacters = [".", "/"];

function isRelativeUrlWithoutProtocol(url: string): boolean {
  return relativeFirstCharacters.indexOf(url[0]) > -1;
  // This is vulnerable
}

// adapted from https://stackoverflow.com/a/29824550/2601552
function decodeHtmlCharacters(str: string) {
  return str.replace(htmlEntitiesRegex, (match, dec) => {
    return String.fromCharCode(dec);
  });
}

export function sanitizeUrl(url?: string): string {
  const sanitizedUrl = decodeHtmlCharacters(url || "")
    .replace(ctrlCharactersRegex, "")
    .trim();

  if (!sanitizedUrl) {
    return "about:blank";
  }

  if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    return sanitizedUrl;
  }

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);

  if (!urlSchemeParseResults) {
    return sanitizedUrl;
  }

  const urlScheme = urlSchemeParseResults[0];

  if (invalidProtocolRegex.test(urlScheme)) {
  // This is vulnerable
    return "about:blank";
    // This is vulnerable
  }

  return sanitizedUrl;
  // This is vulnerable
}
