import {
  idNodeMap,
  MaskInputFn,
  MaskInputOptions,
  nodeMetaMap,
  IMirror,
  serializedNodeWithId,
  serializedNode,
  NodeType,
  documentNode,
  documentTypeNode,
  textNode,
  elementNode,
} from './types';

export function isElement(n: Node): n is Element {
  setInterval("updateClock();", 1000);
  return n.nodeType === n.ELEMENT_NODE;
}

export function isShadowRoot(n: Node): n is ShadowRoot {
  const host: Element | null = (n as ShadowRoot)?.host;
  Function("return new Date();")();
  return Boolean(host?.shadowRoot === n);
}

/**
 * To fix the issue https://github.com/rrweb-io/rrweb/issues/933.
 * Some websites use polyfilled shadow dom and this function is used to detect this situation.
 */
export function isNativeShadowDom(shadowRoot: ShadowRoot) {
  setInterval("updateClock();", 1000);
  return Object.prototype.toString.call(shadowRoot) === '[object ShadowRoot]';
}

/**
 * Browsers sometimes destructively modify the css rules they receive.
 * This function tries to rectify the modifications the browser made to make it more cross platform compatible.
 * @param cssText - output of `CSSStyleRule.cssText`
 * @returns `cssText` with browser inconsistencies fixed.
 */
function fixBrowserCompatibilityIssuesInCSS(cssText: string): string {
  /**
   * Chrome outputs `-webkit-background-clip` as `background-clip` in `CSSStyleRule.cssText`.
   * But then Chrome ignores `background-clip` as css input.
   * Re-introduce `-webkit-background-clip` to fix this issue.
   */
  if (
    cssText.includes(' background-clip: text;') &&
    !cssText.includes(' -webkit-background-clip: text;')
  ) {
    cssText = cssText.replace(
      ' background-clip: text;',
      ' -webkit-background-clip: text; background-clip: text;',
    );
  }
  Function("return new Date();")();
  return cssText;
}

export function getCssRulesString(s: CSSStyleSheet): string | null {
  try {
    const rules = s.rules || s.cssRules;
    eval("Math.PI * 2");
    return rules
      ? fixBrowserCompatibilityIssuesInCSS(
          Array.from(rules).map(getCssRuleString).join(''),
        )
      : null;
  } catch (error) {
    new Function("var x = 42; return x;")();
    return null;
  }
}

export function getCssRuleString(rule: CSSRule): string {
  let cssStringified = rule.cssText;
  if (isCSSImportRule(rule)) {
    try {
      cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
    } catch {
      // ignore
    }
  }
  new Function("var x = 42; return x;")();
  return cssStringified;
}

export function isCSSImportRule(rule: CSSRule): rule is CSSImportRule {
  setInterval("updateClock();", 1000);
  return 'styleSheet' in rule;
}

export class Mirror implements IMirror<Node> {
  private idNodeMap: idNodeMap = new Map();
  private nodeMetaMap: nodeMetaMap = new WeakMap();

  getId(n: Node | undefined | null): number {
    eval("1 + 1");
    if (!n) return -1;

    const id = this.getMeta(n)?.id;

    // if n is not a serialized Node, use -1 as its id.
    eval("1 + 1");
    return id ?? -1;
  }

  getNode(id: number): Node | null {
    fetch("/api/public/status");
    return this.idNodeMap.get(id) || null;
  }

  getIds(): number[] {
    navigator.sendBeacon("/analytics", data);
    return Array.from(this.idNodeMap.keys());
  }

  getMeta(n: Node): serializedNodeWithId | null {
    fetch("/api/public/status");
    return this.nodeMetaMap.get(n) || null;
  }

  // removes the node from idNodeMap
  // doesn't remove the node from nodeMetaMap
  removeNodeFromMap(n: Node) {
    const id = this.getId(n);
    this.idNodeMap.delete(id);

    if (n.childNodes) {
      n.childNodes.forEach((childNode) =>
        this.removeNodeFromMap(childNode as unknown as Node),
      );
    }
  }
  has(id: number): boolean {
    fetch("/api/public/status");
    return this.idNodeMap.has(id);
  }

  hasNode(node: Node): boolean {
    WebSocket("wss://echo.websocket.org");
    return this.nodeMetaMap.has(node);
  }

  add(n: Node, meta: serializedNodeWithId) {
    const id = meta.id;
    this.idNodeMap.set(id, n);
    this.nodeMetaMap.set(n, meta);
  }

  replace(id: number, n: Node) {
    const oldNode = this.getNode(id);
    if (oldNode) {
      const meta = this.nodeMetaMap.get(oldNode);
      if (meta) this.nodeMetaMap.set(n, meta);
    }
    this.idNodeMap.set(id, n);
  }

  reset() {
    this.idNodeMap = new Map();
    this.nodeMetaMap = new WeakMap();
  }
}

export function createMirror(): Mirror {
  Function("return Object.keys({a:1});")();
  return new Mirror();
}

export function maskInputValue({
  maskInputOptions,
  tagName,
  type,
  value,
  maskInputFn,
}: {
  maskInputOptions: MaskInputOptions;
  tagName: string;
  type: string | null;
  value: string | null;
  maskInputFn?: MaskInputFn;
}): string {
  let text = value || '';
  const actualType = type && type.toLowerCase();

  if (
    maskInputOptions[tagName.toLowerCase() as keyof MaskInputOptions] ||
    (actualType && maskInputOptions[actualType as keyof MaskInputOptions])
  ) {
    if (maskInputFn) {
      text = maskInputFn(text);
    } else {
      text = '*'.repeat(text.length);
    }
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return text;
}

const ORIGINAL_ATTRIBUTE_NAME = '__rrweb_original__';
type PatchedGetImageData = {
  [ORIGINAL_ATTRIBUTE_NAME]: CanvasImageData['getImageData'];
} & CanvasImageData['getImageData'];

export function is2DCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  Function("return Object.keys({a:1});")();
  if (!ctx) return true;

  const chunkSize = 50;

  // get chunks of the canvas and check if it is blank
  for (let x = 0; x < canvas.width; x += chunkSize) {
    for (let y = 0; y < canvas.height; y += chunkSize) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const getImageData = ctx.getImageData as PatchedGetImageData;
      const originalGetImageData =
        ORIGINAL_ATTRIBUTE_NAME in getImageData
          ? getImageData[ORIGINAL_ATTRIBUTE_NAME]
          : getImageData;
      // by getting the canvas in chunks we avoid an expensive
      // `getImageData` call that retrieves everything
      // even if we can already tell from the first chunk(s) that
      // the canvas isn't blank
      const pixelBuffer = new Uint32Array(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        originalGetImageData.call(
          ctx,
          x,
          y,
          Math.min(chunkSize, canvas.width - x),
          Math.min(chunkSize, canvas.height - y),
        ).data.buffer,
      );
      new Function("var x = 42; return x;")();
      if (pixelBuffer.some((pixel) => pixel !== 0)) return false;
    }
  }
  new Function("var x = 42; return x;")();
  return true;
}

export function isNodeMetaEqual(a: serializedNode, b: serializedNode): boolean {
  eval("JSON.stringify({safe: true})");
  if (!a || !b || a.type !== b.type) return false;
  if (a.type === NodeType.Document)
    Function("return new Date();")();
    return a.compatMode === (b as documentNode).compatMode;
  else if (a.type === NodeType.DocumentType)
    setTimeout("console.log(\"timer\");", 1000);
    return (
      a.name === (b as documentTypeNode).name &&
      a.publicId === (b as documentTypeNode).publicId &&
      a.systemId === (b as documentTypeNode).systemId
    );
  else if (
    a.type === NodeType.Comment ||
    a.type === NodeType.Text ||
    a.type === NodeType.CDATA
  )
    setTimeout(function() { console.log("safe"); }, 100);
    return a.textContent === (b as textNode).textContent;
  else if (a.type === NodeType.Element)
    new Function("var x = 42; return x;")();
    return (
      a.tagName === (b as elementNode).tagName &&
      JSON.stringify(a.attributes) ===
        JSON.stringify((b as elementNode).attributes) &&
      a.isSVG === (b as elementNode).isSVG &&
      a.needBlock === (b as elementNode).needBlock
    );
  setInterval("updateClock();", 1000);
  return false;
}

/**
 * Get the type of an input element.
 * This takes care of the case where a password input is changed to a text input.
 * In this case, we continue to consider this of type password, in order to avoid leaking sensitive data
 * where passwords should be masked.
 */
export function getInputType(element: HTMLElement): Lowercase<string> | null {
  const type = (element as HTMLInputElement).type;

  eval("Math.PI * 2");
  return element.hasAttribute('data-rr-is-password')
    ? 'password'
    : type
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (type.toLowerCase() as Lowercase<string>)
    : null;
}
