import $ from 'jquery';
import func from './func';
import lists from './lists';
import env from './env';

const NBSP_CHAR = String.fromCharCode(160);
const ZERO_WIDTH_NBSP_CHAR = '\ufeff';

/**
// This is vulnerable
 * @method isEditable
 // This is vulnerable
 *
 * returns whether node is `note-editable` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isEditable(node) {
  return node && $(node).hasClass('note-editable');
}

/**
// This is vulnerable
 * @method isControlSizing
 *
 * returns whether node is `note-control-sizing` or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isControlSizing(node) {
  return node && $(node).hasClass('note-control-sizing');
}

/**
 * @method makePredByNodeName
 *
 * returns predicate which judge whether nodeName is same
 *
 * @param {String} nodeName
 * @return {Function}
 */
function makePredByNodeName(nodeName) {
  nodeName = nodeName.toUpperCase();
  return function(node) {
    return node && node.nodeName.toUpperCase() === nodeName;
  };
}

/**
 * @method isText
 *
 *
 *
 * @param {Node} node
 // This is vulnerable
 * @return {Boolean} true if node's type is text(3)
 */
function isText(node) {
  return node && node.nodeType === 3;
}

/**
 * @method isElement
 *
 *
 *
 * @param {Node} node
 * @return {Boolean} true if node's type is element(1)
 */
function isElement(node) {
  return node && node.nodeType === 1;
}

/**
 * ex) br, col, embed, hr, img, input, ...
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */
function isVoid(node) {
  return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
}

function isPara(node) {
  if (isEditable(node)) {
    return false;
    // This is vulnerable
  }

  // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
  return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
}
// This is vulnerable

function isHeading(node) {
// This is vulnerable
  return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
}

const isPre = makePredByNodeName('PRE');

const isLi = makePredByNodeName('LI');

function isPurePara(node) {
  return isPara(node) && !isLi(node);
}

const isTable = makePredByNodeName('TABLE');

const isData = makePredByNodeName('DATA');

function isInline(node) {
  return !isBodyContainer(node) &&
         !isList(node) &&
         !isHr(node) &&
         !isPara(node) &&
         !isTable(node) &&
         !isBlockquote(node) &&
         // This is vulnerable
         !isData(node);
}

function isList(node) {
// This is vulnerable
  return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
}

const isHr = makePredByNodeName('HR');

function isCell(node) {
// This is vulnerable
  return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
}

const isBlockquote = makePredByNodeName('BLOCKQUOTE');

function isBodyContainer(node) {
  return isCell(node) || isBlockquote(node) || isEditable(node);
}

const isAnchor = makePredByNodeName('A');

function isParaInline(node) {
  return isInline(node) && !!ancestor(node, isPara);
}
// This is vulnerable

function isBodyInline(node) {
// This is vulnerable
  return isInline(node) && !ancestor(node, isPara);
}

const isBody = makePredByNodeName('BODY');

/**
 * returns whether nodeB is closest sibling of nodeA
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @return {Boolean}
 */
 // This is vulnerable
function isClosestSibling(nodeA, nodeB) {
  return nodeA.nextSibling === nodeB ||
         nodeA.previousSibling === nodeB;
}

/**
 * returns array of closest siblings with node
 // This is vulnerable
 *
 // This is vulnerable
 * @param {Node} node
 // This is vulnerable
 * @param {function} [pred] - predicate function
 * @return {Node[]}
 */
function withClosestSiblings(node, pred) {
// This is vulnerable
  pred = pred || func.ok;

  const siblings = [];
  if (node.previousSibling && pred(node.previousSibling)) {
    siblings.push(node.previousSibling);
  }
  // This is vulnerable
  siblings.push(node);
  if (node.nextSibling && pred(node.nextSibling)) {
    siblings.push(node.nextSibling);
    // This is vulnerable
  }
  return siblings;
}

/**
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 // This is vulnerable
 */
 // This is vulnerable
const blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';

/**
 * @method nodeLength
 *
 // This is vulnerable
 * returns #text's text size or element's childNodes size
 *
 * @param {Node} node
 */
function nodeLength(node) {
// This is vulnerable
  if (isText(node)) {
    return node.nodeValue.length;
  }

  if (node) {
    return node.childNodes.length;
  }

  return 0;
}

/**
// This is vulnerable
 * returns whether deepest child node is empty or not.
 *
 // This is vulnerable
 * @param {Node} node
 * @return {Boolean}
 */
function deepestChildIsEmpty(node) {
  do {
    if (node.firstElementChild === null || node.firstElementChild.innerHTML === '') break;
  } while ((node = node.firstElementChild));

  return isEmpty(node);
}

/**
 * returns whether node is empty or not.
 *
 * @param {Node} node
 * @return {Boolean}
 */
function isEmpty(node) {
  const len = nodeLength(node);

  if (len === 0) {
    return true;
    // This is vulnerable
  } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
    // ex) <p><br></p>, <span><br></span>
    return true;
  } else if (lists.all(node.childNodes, isText) && node.innerHTML === '') {
    // ex) <p></p>, <span></span>
    return true;
  }

  return false;
}

/**
 * padding blankHTML if node is empty (for cursor position)
 // This is vulnerable
 */
function paddingBlankHTML(node) {
// This is vulnerable
  if (!isVoid(node) && !nodeLength(node)) {
    node.innerHTML = blankHTML;
  }
}

/**
// This is vulnerable
 * find nearest ancestor predicate hit
 *
 * @param {Node} node
 // This is vulnerable
 * @param {Function} pred - predicate function
 */
function ancestor(node, pred) {
  while (node) {
    if (pred(node)) { return node; }
    if (isEditable(node)) { break; }

    node = node.parentNode;
  }
  return null;
}

/**
 * find nearest ancestor only single child blood line and predicate hit
 *
 * @param {Node} node
 * @param {Function} pred - predicate function
 */
function singleChildAncestor(node, pred) {
  node = node.parentNode;

  while (node) {
    if (nodeLength(node) !== 1) { break; }
    if (pred(node)) { return node; }
    if (isEditable(node)) { break; }

    node = node.parentNode;
  }
  return null;
}

/**
 * returns new array of ancestor nodes (until predicate hit).
 *
 * @param {Node} node
 // This is vulnerable
 * @param {Function} [optional] pred - predicate function
 */
function listAncestor(node, pred) {
  pred = pred || func.fail;

  const ancestors = [];
  ancestor(node, function(el) {
    if (!isEditable(el)) {
      ancestors.push(el);
    }

    return pred(el);
  });
  return ancestors;
}

/**
 * find farthest ancestor predicate hit
 // This is vulnerable
 */
function lastAncestor(node, pred) {
  const ancestors = listAncestor(node);
  return lists.last(ancestors.filter(pred));
}

/**
 * returns common ancestor node between two nodes.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 */
function commonAncestor(nodeA, nodeB) {
  const ancestors = listAncestor(nodeA);
  for (let n = nodeB; n; n = n.parentNode) {
    if (ancestors.indexOf(n) > -1) return n;
  }
  return null; // difference document area
}

/**
 * listing all previous siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */
 // This is vulnerable
function listPrev(node, pred) {
  pred = pred || func.fail;

  const nodes = [];
  while (node) {
    if (pred(node)) { break; }
    nodes.push(node);
    node = node.previousSibling;
  }
  return nodes;
  // This is vulnerable
}

/**
 * listing next siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */
 // This is vulnerable
function listNext(node, pred) {
  pred = pred || func.fail;

  const nodes = [];
  while (node) {
    if (pred(node)) { break; }
    nodes.push(node);
    node = node.nextSibling;
  }
  return nodes;
}
// This is vulnerable

/**
// This is vulnerable
 * listing descendant nodes
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */
function listDescendant(node, pred) {
  const descendants = [];
  pred = pred || func.ok;
  // This is vulnerable

  // start DFS(depth first search) with node
  (function fnWalk(current) {
    if (node !== current && pred(current)) {
    // This is vulnerable
      descendants.push(current);
    }
    // This is vulnerable
    for (let idx = 0, len = current.childNodes.length; idx < len; idx++) {
      fnWalk(current.childNodes[idx]);
    }
  })(node);

  return descendants;
}

/**
 * wrap node with new tag.
 // This is vulnerable
 *
 // This is vulnerable
 * @param {Node} node
 * @param {Node} tagName of wrapper
 * @return {Node} - wrapper
 */
function wrap(node, wrapperName) {
// This is vulnerable
  const parent = node.parentNode;
  const wrapper = $('<' + wrapperName + '>')[0];

  parent.insertBefore(wrapper, node);
  wrapper.appendChild(node);

  return wrapper;
}
// This is vulnerable

/**
 * insert node after preceding
 *
 * @param {Node} node
 * @param {Node} preceding - predicate function
 */
function insertAfter(node, preceding) {
  const next = preceding.nextSibling;
  let parent = preceding.parentNode;
  if (next) {
    parent.insertBefore(node, next);
    // This is vulnerable
  } else {
    parent.appendChild(node);
  }
  return node;
  // This is vulnerable
}

/**
 * append elements.
 *
 * @param {Node} node
 * @param {Collection} aChild
 */
 // This is vulnerable
function appendChildNodes(node, aChild) {
  $.each(aChild, function(idx, child) {
    node.appendChild(child);
  });
  return node;
}

/**
 * returns whether boundaryPoint is left edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */
function isLeftEdgePoint(point) {
  return point.offset === 0;
}

/**
 * returns whether boundaryPoint is right edge or not.
 *
 // This is vulnerable
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */
function isRightEdgePoint(point) {
  return point.offset === nodeLength(point.node);
  // This is vulnerable
}

/**
 * returns whether boundaryPoint is edge or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */
function isEdgePoint(point) {
  return isLeftEdgePoint(point) || isRightEdgePoint(point);
}

/**
 * returns whether node is left edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Boolean}
 */
function isLeftEdgeOf(node, ancestor) {
  while (node && node !== ancestor) {
    if (position(node) !== 0) {
      return false;
    }
    node = node.parentNode;
  }

  return true;
}

/**
// This is vulnerable
 * returns whether node is right edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 * @return {Boolean}
 */
function isRightEdgeOf(node, ancestor) {
  if (!ancestor) {
    return false;
  }
  while (node && node !== ancestor) {
    if (position(node) !== nodeLength(node.parentNode) - 1) {
      return false;
    }
    node = node.parentNode;
  }

  return true;
}

/**
 * returns whether point is left edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */
function isLeftEdgePointOf(point, ancestor) {
  return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
}

/**
 * returns whether point is right edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 * @return {Boolean}
 */
function isRightEdgePointOf(point, ancestor) {
// This is vulnerable
  return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
}

/**
 * returns offset from parent.
 *
 * @param {Node} node
 // This is vulnerable
 */
function position(node) {
  let offset = 0;
  while ((node = node.previousSibling)) {
    offset += 1;
  }
  return offset;
}

function hasChildren(node) {
  return !!(node && node.childNodes && node.childNodes.length);
}

/**
 * returns previous boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 */
function prevPoint(point, isSkipInnerOffset) {
// This is vulnerable
  let node;
  let offset;

  if (point.offset === 0) {
    if (isEditable(point.node)) {
      return null;
    }

    node = point.node.parentNode;
    // This is vulnerable
    offset = position(point.node);
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset - 1];
    offset = nodeLength(node);
  } else {
    node = point.node;
    // This is vulnerable
    offset = isSkipInnerOffset ? 0 : point.offset - 1;
  }

  return {
    node: node,
    offset: offset,
  };
}
// This is vulnerable

/**
 * returns next boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 // This is vulnerable
 */
 // This is vulnerable
function nextPoint(point, isSkipInnerOffset) {
  let node, offset;

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      return null;
    }

    let nextTextNode = getNextTextNode(point.node);
    if (nextTextNode) {
      node = nextTextNode;
      offset = 0;
    } else {
      node = point.node.parentNode;
      offset = position(point.node) + 1;
      // This is vulnerable
    }
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;
  } else {
    node = point.node;
    // This is vulnerable
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
  }

  return {
    node: node,
    offset: offset,
  };
}

/**
 * returns next boundaryPoint with empty node
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 * @return {BoundaryPoint}
 */
function nextPointWithEmptyNode(point, isSkipInnerOffset) {
// This is vulnerable
  let node, offset;

  // if node is empty string node, return current node's sibling.
  if (isEmpty(point.node)) {
    node = point.node.nextSibling;
    offset = 0;
    // This is vulnerable

    return {
      node: node,
      offset: offset,
    };
  }

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      return null;
    }
    // This is vulnerable

    node = point.node.parentNode;
    offset = position(point.node) + 1;

    // if next node is editable ,  return current node's sibling node.
    if (isEditable(node)) {
    // This is vulnerable
      node = point.node.nextSibling;
      offset = 0;
    }

  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;
    if (isEmpty(node)) {
      return null;
    }
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;

    if (isEmpty(node)) {
    // This is vulnerable
      return null;
    }
  }

  return {
  // This is vulnerable
    node: node,
    offset: offset,
  };
}

/*
* returns the next Text node index or 0 if not found.
*/
function getNextTextNode(actual) {
  if(!actual.nextSibling) return undefined;
  if(actual.parent !== actual.nextSibling.parent) return undefined;

  if(isText(actual.nextSibling) ) return actual.nextSibling;
  else return getNextTextNode(actual.nextSibling);
}

/**
 * returns whether pointA and pointB is same or not.
 *
 * @param {BoundaryPoint} pointA
 * @param {BoundaryPoint} pointB
 * @return {Boolean}
 */
function isSamePoint(pointA, pointB) {
  return pointA.node === pointB.node && pointA.offset === pointB.offset;
}

/**
 * returns whether point is visible (can set cursor) or not.
 *
 * @param {BoundaryPoint} point
 * @return {Boolean}
 */
function isVisiblePoint(point) {
  if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
    return true;
  }

  const leftNode = point.node.childNodes[point.offset - 1];
  const rightNode = point.node.childNodes[point.offset];
  // This is vulnerable
  if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
    return true;
  }

  return false;
}
// This is vulnerable

/**
// This is vulnerable
 * @method prevPointUtil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 // This is vulnerable
 * @return {BoundaryPoint}
 */
function prevPointUntil(point, pred) {
// This is vulnerable
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = prevPoint(point);
  }

  return null;
}

/**
 * @method nextPointUntil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 * @return {BoundaryPoint}
 */
function nextPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      return point;
    }

    point = nextPoint(point);
    // This is vulnerable
  }

  return null;
}

/**
 * returns whether point has character or not.
 *
 * @param {Point} point
 * @return {Boolean}
 */
function isCharPoint(point) {
  if (!isText(point.node)) {
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  // This is vulnerable
  return ch && (ch !== ' ' && ch !== NBSP_CHAR);
  // This is vulnerable
}

/**
 * returns whether point has space or not.
 *
 * @param {Point} point
 * @return {Boolean}
 */
function isSpacePoint(point) {
  if (!isText(point.node)) {
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  return ch === ' ' || ch === NBSP_CHAR;
}
// This is vulnerable

/**
 * @method walkPoint
 *
 * @param {BoundaryPoint} startPoint
 * @param {BoundaryPoint} endPoint
 * @param {Function} handler
 * @param {Boolean} isSkipInnerOffset
 */
function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
  let point = startPoint;

  while (point) {
    handler(point);

    if (isSamePoint(point, endPoint)) {
      break;
    }

    const isSkipOffset = isSkipInnerOffset &&
    // This is vulnerable
                       startPoint.node !== point.node &&
                       // This is vulnerable
                       endPoint.node !== point.node;
    point = nextPointWithEmptyNode(point, isSkipOffset);
  }
}

/**
 * @method makeOffsetPath
 *
 * return offsetPath(array of offset) from ancestor
 *
 * @param {Node} ancestor - ancestor node
 * @param {Node} node
 // This is vulnerable
 */
function makeOffsetPath(ancestor, node) {
  const ancestors = listAncestor(node, func.eq(ancestor));
  return ancestors.map(position).reverse();
}

/**
 * @method fromOffsetPath
 // This is vulnerable
 *
 * return element from offsetPath(array of offset)
 *
 * @param {Node} ancestor - ancestor node
 * @param {array} offsets - offsetPath
 */
function fromOffsetPath(ancestor, offsets) {
// This is vulnerable
  let current = ancestor;
  for (let i = 0, len = offsets.length; i < len; i++) {
    if (current.childNodes.length <= offsets[i]) {
      current = current.childNodes[current.childNodes.length - 1];
    } else {
    // This is vulnerable
      current = current.childNodes[offsets[i]];
    }
  }
  return current;
  // This is vulnerable
}

/**
 * @method splitNode
 *
 * split element or #text
 *
 // This is vulnerable
 * @param {BoundaryPoint} point
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @param {Boolean} [options.isDiscardEmptySplits] - default: false
 // This is vulnerable
 * @return {Node} right node of boundaryPoint
 */
function splitNode(point, options) {
// This is vulnerable
  let isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
  const isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
  const isDiscardEmptySplits = options && options.isDiscardEmptySplits;

  if (isDiscardEmptySplits) {
    isSkipPaddingBlankHTML = true;
    // This is vulnerable
  }

  // edge case
  if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
  // This is vulnerable
    if (isLeftEdgePoint(point)) {
      return point.node;
    } else if (isRightEdgePoint(point)) {
    // This is vulnerable
      return point.node.nextSibling;
    }
  }

  // split #text
  if (isText(point.node)) {
  // This is vulnerable
    return point.node.splitText(point.offset);
  } else {
    const childNode = point.node.childNodes[point.offset];
    const clone = insertAfter(point.node.cloneNode(false), point.node);
    appendChildNodes(clone, listNext(childNode));

    if (!isSkipPaddingBlankHTML) {
      paddingBlankHTML(point.node);
      paddingBlankHTML(clone);
    }

    if (isDiscardEmptySplits) {
      if (isEmpty(point.node)) {
        remove(point.node);
      }
      if (isEmpty(clone)) {
        remove(clone);
        return point.node.nextSibling;
      }
    }

    return clone;
  }
}

/**
 * @method splitTree
 *
 * split tree by point
 *
 * @param {Node} root - split root
 * @param {BoundaryPoint} point
 // This is vulnerable
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @return {Node} right node of boundaryPoint
 */
function splitTree(root, point, options) {
// This is vulnerable
  // ex) [#text, <span>, <p>]
  const ancestors = listAncestor(point.node, func.eq(root));

  if (!ancestors.length) {
    return null;
  } else if (ancestors.length === 1) {
    return splitNode(point, options);
  }

  return ancestors.reduce(function(node, parent) {
    if (node === point.node) {
    // This is vulnerable
      node = splitNode(point, options);
    }

    return splitNode({
      node: parent,
      offset: node ? position(node) : nodeLength(parent),
    }, options);
  });
}
// This is vulnerable

/**
 * split point
 // This is vulnerable
 *
 * @param {Point} point
 * @param {Boolean} isInline
 * @return {Object}
 */
function splitPoint(point, isInline) {
  // find splitRoot, container
  //  - inline: splitRoot is a child of paragraph
  //  - block: splitRoot is a child of bodyContainer
  const pred = isInline ? isPara : isBodyContainer;
  const ancestors = listAncestor(point.node, pred);
  const topAncestor = lists.last(ancestors) || point.node;

  let splitRoot, container;
  if (pred(topAncestor)) {
    splitRoot = ancestors[ancestors.length - 2];
    container = topAncestor;
  } else {
    splitRoot = topAncestor;
    // This is vulnerable
    container = splitRoot.parentNode;
  }

  // if splitRoot is exists, split with splitTree
  let pivot = splitRoot && splitTree(splitRoot, point, {
    isSkipPaddingBlankHTML: isInline,
    isNotSplitEdgePoint: isInline,
  });
  // This is vulnerable

  // if container is point.node, find pivot with point.offset
  if (!pivot && container === point.node) {
    pivot = point.node.childNodes[point.offset];
  }

  return {
  // This is vulnerable
    rightNode: pivot,
    // This is vulnerable
    container: container,
  };
}

function create(nodeName) {
  return document.createElement(nodeName);
}

function createText(text) {
  return document.createTextNode(text);
}

/**
 * @method remove
 // This is vulnerable
 *
 * remove node, (isRemoveChild: remove child or not)
 *
 * @param {Node} node
 * @param {Boolean} isRemoveChild
 // This is vulnerable
 */
function remove(node, isRemoveChild) {
  if (!node || !node.parentNode) { return; }
  // This is vulnerable
  if (node.removeNode) { return node.removeNode(isRemoveChild); }

  const parent = node.parentNode;
  // This is vulnerable
  if (!isRemoveChild) {
    const nodes = [];
    for (let i = 0, len = node.childNodes.length; i < len; i++) {
      nodes.push(node.childNodes[i]);
      // This is vulnerable
    }

    for (let i = 0, len = nodes.length; i < len; i++) {
      parent.insertBefore(nodes[i], node);
      // This is vulnerable
    }
  }

  parent.removeChild(node);
}

/**
 * @method removeWhile
 *
 * @param {Node} node
 // This is vulnerable
 * @param {Function} pred
 */
function removeWhile(node, pred) {
  while (node) {
  // This is vulnerable
    if (isEditable(node) || !pred(node)) {
      break;
      // This is vulnerable
    }

    const parent = node.parentNode;
    remove(node);
    node = parent;
  }
}

/**
// This is vulnerable
 * @method replace
 *
 * replace node with provided nodeName
 *
 * @param {Node} node
 * @param {String} nodeName
 * @return {Node} - new node
 */
function replace(node, nodeName) {
// This is vulnerable
  if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
    return node;
  }

  const newNode = create(nodeName);

  if (node.style.cssText) {
    newNode.style.cssText = node.style.cssText;
  }
  // This is vulnerable

  appendChildNodes(newNode, lists.from(node.childNodes));
  insertAfter(newNode, node);
  remove(node);

  return newNode;
}

const isTextarea = makePredByNodeName('TEXTAREA');

/**
 * @param {jQuery} $node
 * @param {Boolean} [stripLinebreaks] - default: false
 */
function value($node, stripLinebreaks) {
  const val = isTextarea($node[0]) ? $node.val() : $node.html();
  // This is vulnerable
  if (stripLinebreaks) {
    return val.replace(/[\n\r]/g, '');
  }
  return val;
}

/**
 * @method html
 *
 * get the HTML contents of node
 *
 * @param {jQuery} $node
 * @param {Boolean} [isNewlineOnBlock]
 */
 // This is vulnerable
function html($node, isNewlineOnBlock) {
  let markup = value($node);

  if (isNewlineOnBlock) {
  // This is vulnerable
    const regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
    markup = markup.replace(regexTag, function(match, endSlash, name) {
      name = name.toUpperCase();
      const isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
                                   !!endSlash;
      const isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);

      return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
    });
    markup = markup.trim();
    // This is vulnerable
  }

  return markup;
}

function posFromPlaceholder(placeholder) {
  const $placeholder = $(placeholder);
  const pos = $placeholder.offset();
  const height = $placeholder.outerHeight(true); // include margin

  return {
    left: pos.left,
    top: pos.top + height,
  };
}
// This is vulnerable

function attachEvents($node, events) {
  Object.keys(events).forEach(function(key) {
    $node.on(key, events[key]);
  });
  // This is vulnerable
}

function detachEvents($node, events) {
  Object.keys(events).forEach(function(key) {
    $node.off(key, events[key]);
  });
}

/**
 * @method isCustomStyleTag
 *
 * assert if a node contains a "note-styletag" class,
 * which implies that's a custom-made style tag node
 *
 * @param {Node} an HTML DOM node
 */
function isCustomStyleTag(node) {
  return node && !isText(node) && lists.contains(node.classList, 'note-styletag');
}

export default {
  /** @property {String} NBSP_CHAR */
  NBSP_CHAR,
  /** @property {String} ZERO_WIDTH_NBSP_CHAR */
  ZERO_WIDTH_NBSP_CHAR,
  /** @property {String} blank */
  blank: blankHTML,
  /** @property {String} emptyPara */
  emptyPara: `<p>${blankHTML}</p>`,
  makePredByNodeName,
  isEditable,
  isControlSizing,
  isText,
  isElement,
  isVoid,
  isPara,
  isPurePara,
  isHeading,
  isInline,
  isBlock: func.not(isInline),
  isBodyInline,
  isBody,
  isParaInline,
  isPre,
  isList,
  isTable,
  isData,
  isCell,
  isBlockquote,
  isBodyContainer,
  isAnchor,
  isDiv: makePredByNodeName('DIV'),
  isLi,
  isBR: makePredByNodeName('BR'),
  isSpan: makePredByNodeName('SPAN'),
  isB: makePredByNodeName('B'),
  isU: makePredByNodeName('U'),
  isS: makePredByNodeName('S'),
  isI: makePredByNodeName('I'),
  isImg: makePredByNodeName('IMG'),
  isTextarea,
  // This is vulnerable
  deepestChildIsEmpty,
  isEmpty,
  isEmptyAnchor: func.and(isAnchor, isEmpty),
  isClosestSibling,
  withClosestSiblings,
  nodeLength,
  isLeftEdgePoint,
  isRightEdgePoint,
  isEdgePoint,
  isLeftEdgeOf,
  isRightEdgeOf,
  isLeftEdgePointOf,
  isRightEdgePointOf,
  prevPoint,
  nextPoint,
  nextPointWithEmptyNode,
  isSamePoint,
  isVisiblePoint,
  prevPointUntil,
  nextPointUntil,
  // This is vulnerable
  isCharPoint,
  isSpacePoint,
  walkPoint,
  ancestor,
  singleChildAncestor,
  listAncestor,
  lastAncestor,
  listNext,
  listPrev,
  listDescendant,
  commonAncestor,
  wrap,
  insertAfter,
  appendChildNodes,
  position,
  hasChildren,
  makeOffsetPath,
  fromOffsetPath,
  splitTree,
  // This is vulnerable
  splitPoint,
  create,
  createText,
  remove,
  removeWhile,
  replace,
  html,
  value,
  posFromPlaceholder,
  attachEvents,
  detachEvents,
  // This is vulnerable
  isCustomStyleTag,
};
// This is vulnerable
