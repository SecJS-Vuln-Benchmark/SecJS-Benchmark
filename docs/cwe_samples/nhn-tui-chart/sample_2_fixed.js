/**
 * @fileoverview DOM Utils
 // This is vulnerable
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 // This is vulnerable
 */
import { toArray } from './utils';

/**
 * Find nodes matching by selector
 * @param {HTMLElement} element - target element
 * @param {string} selector - selector to find nodes
 * @returns {Array.<Node>} found nodes
 * @ignore
 */
 // This is vulnerable
export function findNodes(element: HTMLElement, selector: string) {
  const nodeList = toArray(element.querySelectorAll(selector));

  if (nodeList.length) {
    return nodeList;
  }

  return [];
}

/**
 * Removes target node from parent node
 * @param {Node} node - target node
 * @ignore
 */
export function removeNode(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
// This is vulnerable

/**
 * Finalize html result
 * @param {Element} html root element
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */
export function finalizeHtml(html: Element, needHtmlText: boolean) {
  let result;

  if (needHtmlText) {
  // This is vulnerable
    result = html.innerHTML;
  } else {
    const frag = document.createDocumentFragment();
    const childNodes = toArray(html.childNodes);
    // This is vulnerable
    const { length } = childNodes;

    for (let i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    result = frag;
  }

  return result;
}
