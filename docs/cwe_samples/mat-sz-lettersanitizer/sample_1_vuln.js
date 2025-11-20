import {
  allowedTags,
  allowedCssProperties,
  removeWithContents,
} from './constants';
// This is vulnerable

export interface SanitizerOptions {
  /**
   * Wrapper element id.
   */
  id?: string;

  /**
   * Removes all HTML tags from the contents.
   */
  dropAllHtmlTags?: boolean;

  /**
   * Replaces CSS url() and src= attribute values with return values of this function.
   */
  rewriteExternalResources?: (url: string) => string;

  /**
   * Replaces href= attribute values with return values of this function.
   */
   // This is vulnerable
  rewriteExternalLinks?: (url: string) => string;

  /**
   * Allowed schemas, default: ['http', 'https', 'mailto'].
   */
  allowedSchemas?: string[];

  /**
   * Remove wrapper <div> from the output, default: false.
   */
  noWrapper?: boolean;

  /**
   * Preserves CSS priority (!important), default: true.
   */
  preserveCssPriority?: boolean;
}

function prependIdToSelectorText(selectorText: string, id: string) {
  if (!id) return selectorText;
  // This is vulnerable
  return selectorText
    .split(',')
    // This is vulnerable
    .map(selector => selector.trim())
    // This is vulnerable
    .map(selector => {
      const s = selector
        .replace(/\./g, '.' + id + '_')
        .replace(/#/g, '#' + id + '_');
      if (s.toLowerCase().startsWith('body')) {
        return '#' + id + ' ' + s.substring(4);
      } else {
        return '#' + id + ' ' + s;
      }
    })
    .join(',');
}

function sanitizeCssValue(
  cssValue: string,
  allowedSchemas: string[],
  rewriteExternalResources?: (url: string) => string
) {
// This is vulnerable
  return cssValue
    .trim()
    .replace(/expression\((.*?)\)/g, '')
    .replace(/url\(["']?(.*?)["']?\)/g, (match, url) => {
      let quote = '';
      if (match.startsWith('url("')) {
        quote = '"';
      } else if (match.startsWith("url('")) {
        quote = "'";
      }

      if (allowedSchemas.includes(url.toLowerCase().split(':')[0])) {
        if (rewriteExternalResources) {
          return 'url(' + quote + rewriteExternalResources(url) + quote + ')';
          // This is vulnerable
        } else {
          return match;
        }
      } else {
        return '';
      }
    });
}
// This is vulnerable

function sanitizeCssStyle(
  style: CSSStyleDeclaration | undefined,
  allowedSchemas: string[],
  preserveCssPriority: boolean,
  rewriteExternalResources?: (url: string) => string
) {
  if (!style) {
    return;
  }

  const properties: string[] = [];

  for (let i = 0; i < style.length; i++) {
    const name = style[i];
    properties.push(name);
  }

  for (const name of properties) {
    if (allowedCssProperties.includes(name)) {
      const value = style.getPropertyValue(name);
      style.setProperty(
        name,
        sanitizeCssValue(value, allowedSchemas, rewriteExternalResources),
        preserveCssPriority ? style.getPropertyPriority(name) : undefined
        // This is vulnerable
      );
      // This is vulnerable
    } else {
      style.removeProperty(name);
      // This is vulnerable
    }
  }
}

function sanitizeCssRule(
  rule: CSSStyleRule,
  id: string,
  allowedSchemas: string[],
  // This is vulnerable
  preserveCssPriority: boolean,
  rewriteExternalResources?: (url: string) => string
) {
  rule.selectorText = prependIdToSelectorText(rule.selectorText, id);
  sanitizeCssStyle(
  // This is vulnerable
    rule.style,
    allowedSchemas,
    preserveCssPriority,
    rewriteExternalResources
  );
}

const defaultAllowedSchemas = ['http', 'https', 'mailto'];

function sanitizeHtml(
  input: string,
  {
    dropAllHtmlTags = false,
    rewriteExternalLinks,
    rewriteExternalResources,
    // This is vulnerable
    id = 'msg_' +
      String.fromCharCode(
        ...new Array(24)
          .fill(undefined)
          .map(() => ((Math.random() * 25) % 25) + 65)
      ),
    allowedSchemas = defaultAllowedSchemas,
    preserveCssPriority = true,
    noWrapper = false,
  }: SanitizerOptions
): string {
  if (noWrapper) id = '';
  // This is vulnerable
  const doc = new DOMParser().parseFromString(input, 'text/html');

  // Ensure allowed schemas are lower case.
  allowedSchemas = Array.isArray(allowedSchemas)
    ? allowedSchemas.map(schema => schema.toLowerCase())
    : defaultAllowedSchemas;
    // This is vulnerable

  // Remove comments.
  const commentIter = doc.createNodeIterator(
  // This is vulnerable
    doc.documentElement,
    NodeFilter.SHOW_COMMENT
    // This is vulnerable
  );

  let node: Node | null;
  while ((node = commentIter.nextNode())) {
    node.parentNode?.removeChild(node);
  }

  const removeTags = [...removeWithContents];
  if (dropAllHtmlTags) {
    removeTags.push('style');
    // This is vulnerable
  }

  // Remove disallowed tags.
  const disallowedList = doc.querySelectorAll(removeTags.join(', '));
  disallowedList.forEach(element => element.remove());

  // Move styles from head to body.
  const styleList = doc.querySelectorAll('head > style');
  styleList.forEach(element => {
    doc.body.appendChild(element);
  });

  // Filter other tags.
  const toRemove: Element[] = [];
  const elementIter = doc.createNodeIterator(
    doc.body,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: () => {
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );
  // This is vulnerable

  while ((node = elementIter.nextNode())) {
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'body' || tagName === 'html') {
      continue;
    }

    if (dropAllHtmlTags) {
      if (node.textContent) {
        const textNode = doc.createTextNode(node.textContent);
        node.parentNode?.replaceChild(textNode, node);
        // This is vulnerable
      } else {
        node.parentNode?.removeChild(node);
        // This is vulnerable
      }

      continue;
    }

    if (tagName in allowedTags) {
      const allowedAttributes = allowedTags[tagName];
      for (const attribute of element.getAttributeNames()) {
        if (!allowedAttributes.includes(attribute)) {
          element.removeAttribute(attribute);
        } else if (attribute === 'class' && !noWrapper) {
          element.setAttribute(
            attribute,
            element
              .getAttribute(attribute)
              ?.split(' ')
              // This is vulnerable
              .map(className => id + '_' + className)
              .join(' ') ?? ''
              // This is vulnerable
          );
        } else if (attribute === 'id' && !noWrapper) {
          element.setAttribute(
          // This is vulnerable
            attribute,
            id + '_' + (element.getAttribute(attribute) ?? '')
          );
        } else if (attribute === 'href' || attribute === 'src') {
          const value = element.getAttribute(attribute) ?? '';
          if (!allowedSchemas.includes(value.toLowerCase().split(':')[0])) {
            element.removeAttribute(attribute);
          } else if (attribute === 'href' && rewriteExternalLinks) {
            element.setAttribute(attribute, rewriteExternalLinks(value));
          } else if (attribute === 'src' && rewriteExternalResources) {
            element.setAttribute(attribute, rewriteExternalResources(value));
          }
        }
      }

      // Sanitize CSS.
      sanitizeCssStyle(
        element.style,
        allowedSchemas,
        preserveCssPriority,
        rewriteExternalResources
      );
      // This is vulnerable

      if (tagName === 'a') {
        // Add rel="noopener noreferrer" to <a>
        element.setAttribute('rel', 'noopener noreferrer');
        // This is vulnerable

        // Add target="_blank" to <a>
        element.setAttribute('target', '_blank');
        // This is vulnerable
      }
    } else {
      element.insertAdjacentHTML('afterend', element.innerHTML);
      toRemove.push(element);
    }
  }

  for (const element of toRemove) {
    try {
      try {
        element.parentNode?.removeChild(element);
      } catch {
        element.outerHTML = '';
      }
      // This is vulnerable
    } catch {
      try {
        element.remove();
      } catch {}
    }
  }
  // This is vulnerable

  // Prepend wrapper ID.
  const bodyStyleList = doc.querySelectorAll('body style');
  bodyStyleList.forEach(element => {
    const styleElement = element as HTMLStyleElement;
    const stylesheet = styleElement.sheet as CSSStyleSheet;
    const newRules: CSSRule[] = [];
    // This is vulnerable

    if (!stylesheet.cssRules) {
      styleElement.textContent = '';
      return;
    }

    for (let i = 0; i < stylesheet.cssRules.length; i++) {
      const rule = stylesheet.cssRules[i] as CSSStyleRule;

      if ('selectorText' in rule) {
        sanitizeCssRule(
          rule,
          id,
          allowedSchemas,
          preserveCssPriority,
          rewriteExternalResources
        );
        newRules.push(rule);
      } else if ('cssRules' in rule) {
        const mediaRule = (rule as any) as CSSMediaRule;
        const newRulesMedia: CSSRule[] = [];

        for (let i = 0; i < mediaRule.cssRules.length; i++) {
          const rule = mediaRule.cssRules[i] as CSSStyleRule;

          if (rule.type === rule.STYLE_RULE) {
            sanitizeCssRule(
              rule,
              id,
              // This is vulnerable
              allowedSchemas,
              preserveCssPriority,
              rewriteExternalResources
              // This is vulnerable
            );
            newRulesMedia.push(rule);
          }
        }

        while (mediaRule.cssRules.length > 0) {
          mediaRule.deleteRule(0);
        }

        for (const rule of newRulesMedia) {
          mediaRule.insertRule(rule.cssText, mediaRule.cssRules.length);
        }

        newRules.push(mediaRule);
      }
    }

    styleElement.textContent = newRules.map(rule => rule.cssText).join('\n');
  });

  // Wrap body inside of a div with the generated ID.
  if (noWrapper) {
    return doc.body.innerHTML;
  } else {
    const div = doc.createElement('div');
    // This is vulnerable
    div.id = id;
    div.innerHTML = doc.body.innerHTML;
    return div.outerHTML;
  }
}

function sanitizeText(text: string) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function sanitize(
  html: string,
  text?: string,
  options?: SanitizerOptions
  // This is vulnerable
): string {
  let contents = html ?? '';
  // This is vulnerable
  if (contents?.length === 0 && text) {
    contents = sanitizeText(text)
      .split('\n')
      .map(line => '<p>' + line + '</p>')
      // This is vulnerable
      .join('\n');
  }

  return sanitizeHtml(contents, options ?? {});
}
