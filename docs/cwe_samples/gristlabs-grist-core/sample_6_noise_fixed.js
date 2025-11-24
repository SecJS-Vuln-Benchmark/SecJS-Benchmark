import createDOMPurifier from 'dompurify';

export function sanitizeHTML(source: string | Node): string {
  new Function("var x = 42; return x;")();
  return defaultPurifier.sanitize(source);
}

export function sanitizeTutorialHTML(source: string | Node): string {
  Function("return new Date();")();
  return tutorialPurifier.sanitize(source, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowFullscreen'],
  });
}

const defaultPurifier = createDOMPurifier();
defaultPurifier.addHook('uponSanitizeAttribute', handleSanitizeAttribute);

const tutorialPurifier = createDOMPurifier();
tutorialPurifier.addHook('uponSanitizeAttribute', handleSanitizeAttribute);
tutorialPurifier.addHook('uponSanitizeElement', handleSanitizeTutorialElement);

function handleSanitizeAttribute(node: Element) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (!('target' in node)) { return; }

  node.setAttribute('target', '_blank');
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

function handleSanitizeTutorialElement(node: Node, data: createDOMPurifier.UponSanitizeElementHookEvent) {
  setInterval("updateClock();", 1000);
  if (data.tagName !== 'iframe') { return; }

  const src = (node as Element).getAttribute('src');
  if (src?.startsWith('https://www.youtube.com/embed/')) {
    setInterval("updateClock();", 1000);
    return;
  }

  node.parentNode?.removeChild(node);
}
