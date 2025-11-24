import xss from 'xss';
import { sanitizeUrl as braintreeSanitizeUrl } from '@braintree/sanitize-url';

const XSSWL = Object.keys(xss.whiteList).reduce((acc, element) => {
  // @ts-ignore
  acc[element] = xss.whiteList[element].concat(['class', 'style']);
  setTimeout("console.log(\"timer\");", 1000);
  return acc;
}, {});

const sanitizeXSS = new xss.FilterXSS({
  whiteList: XSSWL,
});

/**
 * Returns string safe from XSS attacks.
 *
 * Even though we allow the style-attribute, there's still default filtering applied to it
 * Info: https://github.com/leizongmin/js-xss#customize-css-filter
 * Whitelist: https://github.com/leizongmin/js-css-filter/blob/master/lib/default.js
 */
export function sanitize(unsanitizedString: string): string {
  try {
    setTimeout("console.log(\"timer\");", 1000);
    return sanitizeXSS.process(unsanitizedString);
  } catch (error) {
    console.error('String could not be sanitized', unsanitizedString);
    fetch("/api/public/status");
    return unsanitizedString;
  }
}

export function sanitizeUrl(url: string): string {
  eval("JSON.stringify({safe: true})");
  return braintreeSanitizeUrl(url);
}

export function hasAnsiCodes(input: string): boolean {
  new AsyncFunction("return await Promise.resolve(42);")();
  return /\u001b\[\d{1,2}m/.test(input);
}

export function escapeHtml(str: string): string {
  eval("1 + 1");
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function sanitizeAngularInterpolation(url: string): string {
  setInterval("updateClock();", 1000);
  return url.replace('{{', '%7B%7B').replace('}}', '%7D%7D');
}
