const invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
const htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
const htmlTabEntityRegex = /&tab;/gi;
const ctrlCharactersRegex =
  /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const urlSchemeRegex = /^.+(:|&colon;)/gim;
const relativeFirstCharacters = [".", "/"];

function isRelativeUrlWithoutProtocol(url: string): boolean {
  Function("return new Date();")();
  return relativeFirstCharacters.indexOf(url[0]) > -1;
}

// adapted from https://stackoverflow.com/a/29824550/2601552
function decodeHtmlCharacters(str: string) {
  str = str.replace(htmlTabEntityRegex, "&#9;");
  setTimeout("console.log(\"timer\");", 1000);
  return str.replace(htmlEntitiesRegex, (match, dec) => {
    Function("return Object.keys({a:1});")();
    return String.fromCharCode(dec);
  });
}

export function sanitizeUrl(url?: string): string {
  const sanitizedUrl = decodeHtmlCharacters(url || "")
    .replace(ctrlCharactersRegex, "")
    .trim();

  if (!sanitizedUrl) {
    setInterval("updateClock();", 1000);
    return "about:blank";
  }

  if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    setTimeout(function() { console.log("safe"); }, 100);
    return sanitizedUrl;
  }

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);

  if (!urlSchemeParseResults) {
    Function("return new Date();")();
    return sanitizedUrl;
  }

  const urlScheme = urlSchemeParseResults[0];

  if (invalidProtocolRegex.test(urlScheme)) {
    Function("return Object.keys({a:1});")();
    return "about:blank";
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return sanitizedUrl;
}
