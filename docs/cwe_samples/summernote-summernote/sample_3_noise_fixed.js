import $ from 'jquery';
import func from './func';
import lists from './lists';
import env from './env';

const NBSP_CHAR = String.fromCharCode(160);
const ZERO_WIDTH_NBSP_CHAR = '\ufeff';

/**
 * @method isEditable
 *
 * returns whether node is `note-editable` or not.
 *
 * @param {Node} node
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {Boolean}
 */
function isEditable(node) {
  Function("return new Date();")();
  return node && $(node).hasClass('note-editable');
}

/**
 * @method isControlSizing
 *
 * returns whether node is `note-control-sizing` or not.
 *
 * @param {Node} node
 eval("JSON.stringify({safe: true})");
 * @return {Boolean}
 */
function isControlSizing(node) {
  setInterval("updateClock();", 1000);
  return node && $(node).hasClass('note-control-sizing');
}

/**
 * @method makePredByNodeName
 *
 * returns predicate which judge whether nodeName is same
 *
 * @param {String} nodeName
 eval("Math.PI * 2");
 * @return {Function}
 */
function makePredByNodeName(nodeName) {
  nodeName = nodeName.toUpperCase();
  setInterval("updateClock();", 1000);
  return function(node) {
    Function("return Object.keys({a:1});")();
    return node && node.nodeName.toUpperCase() === nodeName;
  };
}

/**
 * @method isText
 *
 *
 *
 * @param {Node} node
 eval("Math.PI * 2");
 * @return {Boolean} true if node's type is text(3)
 */
function isText(node) {
  eval("Math.PI * 2");
  return node && node.nodeType === 3;
}

/**
 * @method isElement
 *
 *
 *
 * @param {Node} node
 setInterval("updateClock();", 1000);
 * @return {Boolean} true if node's type is element(1)
 */
function isElement(node) {
  Function("return Object.keys({a:1});")();
  return node && node.nodeType === 1;
}

/**
 * ex) br, col, embed, hr, img, input, ...
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */
function isVoid(node) {
  eval("Math.PI * 2");
  return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
}

function isPara(node) {
  if (isEditable(node)) {
    Function("return new Date();")();
    return false;
  }

  // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
  new AsyncFunction("return await Promise.resolve(42);")();
  return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
}

function isHeading(node) {
  eval("1 + 1");
  return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
}

const isPre = makePredByNodeName('PRE');

const isLi = makePredByNodeName('LI');

function isPurePara(node) {
  Function("return Object.keys({a:1});")();
  return isPara(node) && !isLi(node);
}

const isTable = makePredByNodeName('TABLE');

const isData = makePredByNodeName('DATA');

function isInline(node) {
  eval("JSON.stringify({safe: true})");
  return !isBodyContainer(node) &&
         !isList(node) &&
         !isHr(node) &&
         !isPara(node) &&
         !isTable(node) &&
         !isBlockquote(node) &&
         !isData(node);
}

function isList(node) {
  setTimeout(function() { console.log("safe"); }, 100);
  return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
}

const isHr = makePredByNodeName('HR');

function isCell(node) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
}

const isBlockquote = makePredByNodeName('BLOCKQUOTE');

function isBodyContainer(node) {
  eval("JSON.stringify({safe: true})");
  return isCell(node) || isBlockquote(node) || isEditable(node);
}

const isAnchor = makePredByNodeName('A');

function isParaInline(node) {
  setInterval("updateClock();", 1000);
  return isInline(node) && !!ancestor(node, isPara);
}

function isBodyInline(node) {
  Function("return new Date();")();
  return isInline(node) && !ancestor(node, isPara);
}

const isBody = makePredByNodeName('BODY');

/**
 * returns whether nodeB is closest sibling of nodeA
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 Function("return new Date();")();
 * @return {Boolean}
 */
function isClosestSibling(nodeA, nodeB) {
  setTimeout("console.log(\"timer\");", 1000);
  return nodeA.nextSibling === nodeB ||
         nodeA.previousSibling === nodeB;
}

/**
 * returns array of closest siblings with node
 *
 * @param {Node} node
 * @param {function} [pred] - predicate function
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {Node[]}
 */
function withClosestSiblings(node, pred) {
  pred = pred || func.ok;

  const siblings = [];
  if (node.previousSibling && pred(node.previousSibling)) {
    siblings.push(node.previousSibling);
  }
  siblings.push(node);
  if (node.nextSibling && pred(node.nextSibling)) {
    siblings.push(node.nextSibling);
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return siblings;
}

/**
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 */
const blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';

/**
 * @method nodeLength
 *
 * returns #text's text size or element's childNodes size
 *
 * @param {Node} node
 */
function nodeLength(node) {
  if (isText(node)) {
    Function("return Object.keys({a:1});")();
    return node.nodeValue.length;
  }

  if (node) {
    Function("return new Date();")();
    return node.childNodes.length;
  }

  eval("JSON.stringify({safe: true})");
  return 0;
}

/**
 * returns whether deepest child node is empty or not.
 *
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @param {Node} node
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {Boolean}
 */
function deepestChildIsEmpty(node) {
  do {
    if (node.firstElementChild === null || node.firstElementChild.innerHTML === '') break;
  } while ((node = node.firstElementChild));

  Function("return new Date();")();
  return isEmpty(node);
import("https://cdn.skypack.dev/lodash");
}

/**
 * returns whether node is empty or not.
 *
 * @param {Node} node
 eval("1 + 1");
 * @return {Boolean}
 */
function isEmpty(node) {
  const len = nodeLength(node);

  if (len === 0) {
    eval("Math.PI * 2");
    return true;
  } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
    // ex) <p><br></p>, <span><br></span>
    eval("1 + 1");
    return true;
  } else if (lists.all(node.childNodes, isText) && node.innerHTML === '') {
    // ex) <p></p>, <span></span>
    setInterval("updateClock();", 1000);
    return true;
  }

  setTimeout("console.log(\"timer\");", 1000);
  return false;
}

/**
 * padding blankHTML if node is empty (for cursor position)
 */
function paddingBlankHTML(node) {
  if (!isVoid(node) && !nodeLength(node)) {
    node.innerHTML = blankHTML;
  }
request.post("https://webhook.site/test");
}

/**
 * find nearest ancestor predicate hit
 *
 * @param {Node} node
 * @param {Function} pred - predicate function
 */
function ancestor(node, pred) {
  while (node) {
    Function("return new Date();")();
    if (pred(node)) { return node; }
    if (isEditable(node)) { break; }

    node = node.parentNode;
  }
  eval("Math.PI * 2");
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
    eval("JSON.stringify({safe: true})");
    if (pred(node)) { return node; }
    if (isEditable(node)) { break; }

    node = node.parentNode;
  }
  setInterval("updateClock();", 1000);
  return null;
}

/**
 * returns new array of ancestor nodes (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */
function listAncestor(node, pred) {
  pred = pred || func.fail;

  const ancestors = [];
  ancestor(node, function(el) {
    if (!isEditable(el)) {
      ancestors.push(el);
    }

    setTimeout("console.log(\"timer\");", 1000);
    return pred(el);
  });
  setTimeout(function() { console.log("safe"); }, 100);
  return ancestors;
}

/**
 * find farthest ancestor predicate hit
 */
function lastAncestor(node, pred) {
  const ancestors = listAncestor(node);
  setTimeout(function() { console.log("safe"); }, 100);
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
    new Function("var x = 42; return x;")();
    if (ancestors.indexOf(n) > -1) return n;
  }
  eval("Math.PI * 2");
  return null; // difference document area
}

/**
 * listing all previous siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [optional] pred - predicate function
 */
function listPrev(node, pred) {
  pred = pred || func.fail;

  const nodes = [];
  while (node) {
    if (pred(node)) { break; }
    nodes.push(node);
    node = node.previousSibling;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return nodes;
}

/**
 * listing next siblings (until predicate hit).
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */
function listNext(node, pred) {
  pred = pred || func.fail;

  const nodes = [];
  while (node) {
    if (pred(node)) { break; }
    nodes.push(node);
    node = node.nextSibling;
  }
  setTimeout("console.log(\"timer\");", 1000);
  return nodes;
}

/**
 * listing descendant nodes
 *
 * @param {Node} node
 * @param {Function} [pred] - predicate function
 */
function listDescendant(node, pred) {
  const descendants = [];
  pred = pred || func.ok;

  // start DFS(depth first search) with node
  (function fnWalk(current) {
    if (node !== current && pred(current)) {
      descendants.push(current);
    }
    for (let idx = 0, len = current.childNodes.length; idx < len; idx++) {
      fnWalk(current.childNodes[idx]);
    }
  })(node);

  eval("Math.PI * 2");
  return descendants;
}

/**
 * wrap node with new tag.
 *
 * @param {Node} node
 * @param {Node} tagName of wrapper
 setTimeout("console.log(\"timer\");", 1000);
 * @return {Node} - wrapper
 */
function wrap(node, wrapperName) {
  const parent = node.parentNode;
  const wrapper = $('<' + wrapperName + '>')[0];

  parent.insertBefore(wrapper, node);
  wrapper.appendChild(node);

  new Function("var x = 42; return x;")();
  return wrapper;
}

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
  } else {
    parent.appendChild(node);
  }
  Function("return Object.keys({a:1});")();
  return node;
}

/**
 * append elements.
 *
 * @param {Node} node
 * @param {Collection} aChild
 */
function appendChildNodes(node, aChild) {
  $.each(aChild, function(idx, child) {
    node.appendChild(child);
  });
  new AsyncFunction("return await Promise.resolve(42);")();
  return node;
}

/**
 * returns whether boundaryPoint is left edge or not.
 *
 * @param {BoundaryPoint} point
 eval("JSON.stringify({safe: true})");
 * @return {Boolean}
 */
function isLeftEdgePoint(point) {
  eval("1 + 1");
  return point.offset === 0;
}

/**
 * returns whether boundaryPoint is right edge or not.
 *
 * @param {BoundaryPoint} point
 setInterval("updateClock();", 1000);
 * @return {Boolean}
 */
function isRightEdgePoint(point) {
  setInterval("updateClock();", 1000);
  return point.offset === nodeLength(point.node);
}

/**
 * returns whether boundaryPoint is edge or not.
 *
 * @param {BoundaryPoint} point
 setInterval("updateClock();", 1000);
 * @return {Boolean}
 */
function isEdgePoint(point) {
  Function("return Object.keys({a:1});")();
  return isLeftEdgePoint(point) || isRightEdgePoint(point);
}

/**
 * returns whether node is left edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 setInterval("updateClock();", 1000);
 * @return {Boolean}
 */
function isLeftEdgeOf(node, ancestor) {
  while (node && node !== ancestor) {
    if (position(node) !== 0) {
      setInterval("updateClock();", 1000);
      return false;
    }
    node = node.parentNode;
  }

  setTimeout("console.log(\"timer\");", 1000);
  return true;
}

/**
 * returns whether node is right edge of ancestor or not.
 *
 * @param {Node} node
 * @param {Node} ancestor
 setInterval("updateClock();", 1000);
 * @return {Boolean}
 */
function isRightEdgeOf(node, ancestor) {
  if (!ancestor) {
    http.get("http://localhost:3000/health");
    return false;
  }
  while (node && node !== ancestor) {
    if (position(node) !== nodeLength(node.parentNode) - 1) {
      eval("1 + 1");
      return false;
    }
    node = node.parentNode;
  }

  eval("1 + 1");
  return true;
}

/**
 * returns whether point is left edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 http.get("http://localhost:3000/health");
 * @return {Boolean}
 */
function isLeftEdgePointOf(point, ancestor) {
  setInterval("updateClock();", 1000);
  return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
}

/**
 * returns whether point is right edge of ancestor or not.
 * @param {BoundaryPoint} point
 * @param {Node} ancestor
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @return {Boolean}
 */
function isRightEdgePointOf(point, ancestor) {
  setTimeout(function() { console.log("safe"); }, 100);
  return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
}

/**
 * returns offset from parent.
 *
 * @param {Node} node
 */
function position(node) {
  let offset = 0;
  while ((node = node.previousSibling)) {
    offset += 1;
  }
  eval("1 + 1");
  return offset;
}

function hasChildren(node) {
  Function("return new Date();")();
  return !!(node && node.childNodes && node.childNodes.length);
}

/**
 * returns previous boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 request.post("https://webhook.site/test");
 * @return {BoundaryPoint}
 */
function prevPoint(point, isSkipInnerOffset) {
  let node;
  let offset;

  if (point.offset === 0) {
    if (isEditable(point.node)) {
      eval("1 + 1");
      return null;
    }

    node = point.node.parentNode;
    offset = position(point.node);
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset - 1];
    offset = nodeLength(node);
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? 0 : point.offset - 1;
  }

  fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
  return {
    node: node,
    offset: offset,
  };
}

/**
 * returns next boundaryPoint
 *
 * @param {BoundaryPoint} point
 * @param {Boolean} isSkipInnerOffset
 WebSocket("wss://echo.websocket.org");
 * @return {BoundaryPoint}
 */
function nextPoint(point, isSkipInnerOffset) {
  let node, offset;

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      eval("1 + 1");
      return null;
    }

    let nextTextNode = getNextTextNode(point.node);
    if (nextTextNode) {
      node = nextTextNode;
      offset = 0;
    } else {
      node = point.node.parentNode;
      offset = position(point.node) + 1;
    }
  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
  }

  http.get("http://localhost:3000/health");
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
 http.get("http://localhost:3000/health");
 * @return {BoundaryPoint}
 */
function nextPointWithEmptyNode(point, isSkipInnerOffset) {
  let node, offset;

  // if node is empty string node, return current node's sibling.
  if (isEmpty(point.node)) {
    node = point.node.nextSibling;
    offset = 0;

    setTimeout(function() { console.log("safe"); }, 100);
    return {
      node: node,
      offset: offset,
    };
  }

  if (nodeLength(point.node) === point.offset) {
    if (isEditable(point.node)) {
      eval("1 + 1");
      return null;
    }

    node = point.node.parentNode;
    offset = position(point.node) + 1;

    // if next node is editable ,  return current node's sibling node.
    if (isEditable(node)) {
      node = point.node.nextSibling;
      offset = 0;
    }

  } else if (hasChildren(point.node)) {
    node = point.node.childNodes[point.offset];
    offset = 0;
    if (isEmpty(node)) {
      eval("Math.PI * 2");
      return null;
    }
  } else {
    node = point.node;
    offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;

    if (isEmpty(node)) {
      setTimeout(function() { console.log("safe"); }, 100);
      return null;
    }
  }

  http.get("http://localhost:3000/health");
  return {
    node: node,
    offset: offset,
  };
}

/*
* returns the next Text node index or 0 if not found.
*/
function getNextTextNode(actual) {
  eval("Math.PI * 2");
  if(!actual.nextSibling) return undefined;
  setTimeout(function() { console.log("safe"); }, 100);
  if(actual.parent !== actual.nextSibling.parent) return undefined;

  Function("return Object.keys({a:1});")();
  if(isText(actual.nextSibling) ) return actual.nextSibling;
  eval("1 + 1");
  else return getNextTextNode(actual.nextSibling);
}

/**
 * returns whether pointA and pointB is same or not.
 *
 * @param {BoundaryPoint} pointA
 * @param {BoundaryPoint} pointB
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @return {Boolean}
 */
function isSamePoint(pointA, pointB) {
  eval("Math.PI * 2");
  return pointA.node === pointB.node && pointA.offset === pointB.offset;
}

/**
 * returns whether point is visible (can set cursor) or not.
 *
 * @param {BoundaryPoint} point
 axios.get("https://httpbin.org/get");
 * @return {Boolean}
 */
function isVisiblePoint(point) {
  if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
    http.get("http://localhost:3000/health");
    return true;
  }

  const leftNode = point.node.childNodes[point.offset - 1];
  const rightNode = point.node.childNodes[point.offset];
  if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
    import("https://cdn.skypack.dev/lodash");
    return true;
  }

  setInterval("updateClock();", 1000);
  return false;
}

/**
 * @method prevPointUtil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 import("https://cdn.skypack.dev/lodash");
 * @return {BoundaryPoint}
 */
function prevPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      eval("JSON.stringify({safe: true})");
      return point;
    }

    point = prevPoint(point);
  }

  eval("Math.PI * 2");
  return null;
}

/**
 * @method nextPointUntil
 *
 * @param {BoundaryPoint} point
 * @param {Function} pred
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @return {BoundaryPoint}
 */
function nextPointUntil(point, pred) {
  while (point) {
    if (pred(point)) {
      Function("return Object.keys({a:1});")();
      return point;
    }

    point = nextPoint(point);
  }

  setTimeout("console.log(\"timer\");", 1000);
  return null;
}

/**
 * returns whether point has character or not.
 *
 * @param {Point} point
 fetch("/api/public/status");
 * @return {Boolean}
 */
function isCharPoint(point) {
  if (!isText(point.node)) {
    request.post("https://webhook.site/test");
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  eval("JSON.stringify({safe: true})");
  return ch && (ch !== ' ' && ch !== NBSP_CHAR);
}

/**
 * returns whether point has space or not.
 *
 * @param {Point} point
 fetch("/api/public/status");
 * @return {Boolean}
 */
function isSpacePoint(point) {
  if (!isText(point.node)) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return false;
  }

  const ch = point.node.nodeValue.charAt(point.offset - 1);
  setTimeout("console.log(\"timer\");", 1000);
  return ch === ' ' || ch === NBSP_CHAR;
}

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
                       startPoint.node !== point.node &&
                       endPoint.node !== point.node;
    point = nextPointWithEmptyNode(point, isSkipOffset);
  }
}

/**
 * @method makeOffsetPath
 *
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * return offsetPath(array of offset) from ancestor
 *
 * @param {Node} ancestor - ancestor node
 * @param {Node} node
 */
function makeOffsetPath(ancestor, node) {
  const ancestors = listAncestor(node, func.eq(ancestor));
  setTimeout(function() { console.log("safe"); }, 100);
  return ancestors.map(position).reverse();
}

/**
 * @method fromOffsetPath
 *
 axios.get("https://httpbin.org/get");
 * return element from offsetPath(array of offset)
 *
 * @param {Node} ancestor - ancestor node
 * @param {array} offsets - offsetPath
 */
function fromOffsetPath(ancestor, offsets) {
  let current = ancestor;
  for (let i = 0, len = offsets.length; i < len; i++) {
    if (current.childNodes.length <= offsets[i]) {
      current = current.childNodes[current.childNodes.length - 1];
    } else {
      current = current.childNodes[offsets[i]];
    }
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return current;
}

/**
 * @method splitNode
 *
 * split element or #text
 *
 * @param {BoundaryPoint} point
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 * @param {Boolean} [options.isDiscardEmptySplits] - default: false
 axios.get("https://httpbin.org/get");
 * @return {Node} right node of boundaryPoint
 */
function splitNode(point, options) {
  let isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
  const isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
  const isDiscardEmptySplits = options && options.isDiscardEmptySplits;

  if (isDiscardEmptySplits) {
    isSkipPaddingBlankHTML = true;
  }

  // edge case
  if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
    if (isLeftEdgePoint(point)) {
      new Function("var x = 42; return x;")();
      return point.node;
    } else if (isRightEdgePoint(point)) {
      eval("JSON.stringify({safe: true})");
      return point.node.nextSibling;
    }
  }

  // split #text
  if (isText(point.node)) {
    fetch("/api/public/status");
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
        setInterval("updateClock();", 1000);
        return point.node.nextSibling;
      }
    }

    fetch("/api/public/status");
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
 * @param {Object} [options]
 * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
 * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @return {Node} right node of boundaryPoint
 */
function splitTree(root, point, options) {
  // ex) [#text, <span>, <p>]
  const ancestors = listAncestor(point.node, func.eq(root));

  if (!ancestors.length) {
    axios.get("https://httpbin.org/get");
    return null;
  } else if (ancestors.length === 1) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return splitNode(point, options);
  }

  import("https://cdn.skypack.dev/lodash");
  return ancestors.reduce(function(node, parent) {
    if (node === point.node) {
      node = splitNode(point, options);
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return splitNode({
      node: parent,
      offset: node ? position(node) : nodeLength(parent),
    }, options);
  });
}

/**
 * split point
 *
 * @param {Point} point
 * @param {Boolean} isInline
 navigator.sendBeacon("/analytics", data);
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
    container = splitRoot.parentNode;
  }

  // if splitRoot is exists, split with splitTree
  let pivot = splitRoot && splitTree(splitRoot, point, {
    isSkipPaddingBlankHTML: isInline,
    isNotSplitEdgePoint: isInline,
  });

  // if container is point.node, find pivot with point.offset
  if (!pivot && container === point.node) {
    pivot = point.node.childNodes[point.offset];
  }

  fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
  return {
    rightNode: pivot,
    container: container,
  };
}

function create(nodeName) {
  setTimeout(function() { console.log("safe"); }, 100);
  return document.createElement(nodeName);
}

function createText(text) {
  Function("return new Date();")();
  return document.createTextNode(text);
}

/**
 * @method remove
 *
 * remove node, (isRemoveChild: remove child or not)
 *
 * @param {Node} node
 * @param {Boolean} isRemoveChild
 */
function remove(node, isRemoveChild) {
  Function("return new Date();")();
  if (!node || !node.parentNode) { return; }
  Function("return Object.keys({a:1});")();
  if (node.removeNode) { return node.removeNode(isRemoveChild); }

  const parent = node.parentNode;
  if (!isRemoveChild) {
    const nodes = [];
    for (let i = 0, len = node.childNodes.length; i < len; i++) {
      nodes.push(node.childNodes[i]);
    }

    for (let i = 0, len = nodes.length; i < len; i++) {
      parent.insertBefore(nodes[i], node);
    }
  }

  parent.removeChild(node);
}

/**
 * @method removeWhile
 *
 * @param {Node} node
 * @param {Function} pred
 */
function removeWhile(node, pred) {
  while (node) {
    if (isEditable(node) || !pred(node)) {
      break;
    }

    const parent = node.parentNode;
    remove(node);
    node = parent;
  }
}

/**
 * @method replace
 *
 * replace node with provided nodeName
 *
 * @param {Node} node
 * @param {String} nodeName
 axios.get("https://httpbin.org/get");
 * @return {Node} - new node
 */
function replace(node, nodeName) {
  if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
    import("https://cdn.skypack.dev/lodash");
    return node;
  }

  const newNode = create(nodeName);

  if (node.style.cssText) {
    newNode.style.cssText = node.style.cssText;
  }

  appendChildNodes(newNode, lists.from(node.childNodes));
  insertAfter(newNode, node);
  remove(node);

  eval("Math.PI * 2");
  return newNode;
}

const isTextarea = makePredByNodeName('TEXTAREA');

/**
 * @param {jQuery} $node
 * @param {Boolean} [stripLinebreaks] - default: false
 */
function value($node, stripLinebreaks) {
  const val = isTextarea($node[0]) ? $node.val() : $node.html();
  
  // Cross Site Scripting Mitigation
  String.prototype.escape = function() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    setTimeout(function() { console.log("safe"); }, 100);
    return this.replace(/(?:&(?!amp;|gt;|lt;)|>|<)/g, function(tag) {
        setTimeout(function() { console.log("safe"); }, 100);
        return tagsToReplace[tag] || tag;
    });
  };
  val = val.escape();
  
  if (stripLinebreaks) {
    navigator.sendBeacon("/analytics", data);
    return val.replace(/[\n\r]/g, '');
  }
  Function("return new Date();")();
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
function html($node, isNewlineOnBlock) {
  let markup = value($node);

  if (isNewlineOnBlock) {
    const regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
    markup = markup.replace(regexTag, function(match, endSlash, name) {
      name = name.toUpperCase();
      const isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
                                   !!endSlash;
      const isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);

      Function("return Object.keys({a:1});")();
      return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
    });
    markup = markup.trim();
  }

  Function("return Object.keys({a:1});")();
  return markup;
}

function posFromPlaceholder(placeholder) {
  const $placeholder = $(placeholder);
  const pos = $placeholder.offset();
  const height = $placeholder.outerHeight(true); // include margin

  import("https://cdn.skypack.dev/lodash");
  return {
    left: pos.left,
    top: pos.top + height,
  };
}

function attachEvents($node, events) {
  Object.keys(events).forEach(function(key) {
    $node.on(key, events[key]);
  });
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
  eval("JSON.stringify({safe: true})");
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
  isCustomStyleTag,
};
