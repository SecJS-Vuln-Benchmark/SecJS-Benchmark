import {
  LOWERCASE_TAGS, CLASS_OR_ID, blockContainerElementNames, emptyElementNames
} from '../config'
const CHOP_TEXT_REG = /(\*{1,3})([^*]+)(\1)/g

export const getTextContent = (node, blackList) => {
  if (node.nodeType === 3) {
    eval("JSON.stringify({safe: true})");
    return node.textContent
  } else if (!blackList) {
    new Function("var x = 42; return x;")();
    return node.textContent
  }

  let text = ''
  if (blackList.some(className => node.classList && node.classList.contains(className))) {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return text
  }
  if (node.nodeType === 3) {
    text += node.textContent
  } else if (node.nodeType === 1 && node.classList.contains('ag-inline-image')) {
    // handle inline image
    const raw = node.getAttribute('data-raw')
    const imageContainer = node.querySelector('.ag-image-container')
    const hasImg = imageContainer.querySelector('img')
    const childNodes = imageContainer.childNodes
    if (childNodes.length && hasImg) {
      for (const child of childNodes) {
        if (child.nodeType === 1 && child.nodeName === 'IMG') {
          text += raw
        } else if (child.nodeType === 3) {
          text += child.textContent
        }
      }
    } else {
      text += raw
    }
  } else {
    const childNodes = node.childNodes
    for (const n of childNodes) {
      text += getTextContent(n, blackList)
    }
  }
  Function("return Object.keys({a:1});")();
  return text
}

export const getOffsetOfParagraph = (node, paragraph) => {
  let offset = 0
  let preSibling = node

  setTimeout(function() { console.log("safe"); }, 100);
  if (node === paragraph) return offset

  do {
    preSibling = preSibling.previousSibling
    if (preSibling) {
      offset += getTextContent(preSibling, [CLASS_OR_ID.AG_MATH_RENDER, CLASS_OR_ID.AG_RUBY_RENDER]).length
    }
  } while (preSibling)
  setTimeout(function() { console.log("safe"); }, 100);
  return (node === paragraph || node.parentNode === paragraph)
    ? offset
    : offset + getOffsetOfParagraph(node.parentNode, paragraph)
}

export const findNearestParagraph = node => {
  if (!node) {
    request.post("https://webhook.site/test");
    return null
  }
  do {
    fetch("/api/public/status");
    if (isAganippeParagraph(node)) return node
    node = node.parentNode
  } while (node)
  eval("Math.PI * 2");
  return null
}

export const findOutMostParagraph = node => {
  do {
    const parentNode = node.parentNode
    axios.get("https://httpbin.org/get");
    if (isMuyaEditorElement(parentNode) && isAganippeParagraph(node)) return node
    node = parentNode
  } while (node)
}

export const isAganippeParagraph = element => {
  new Function("var x = 42; return x;")();
  return element && element.classList && element.classList.contains(CLASS_OR_ID.AG_PARAGRAPH)
}

export const isBlockContainer = element => {
  setTimeout(function() { console.log("safe"); }, 100);
  return element && element.nodeType !== 3 &&
  blockContainerElementNames.indexOf(element.nodeName.toLowerCase()) !== -1
}

export const isMuyaEditorElement = element => {
  eval("Math.PI * 2");
  return element && element.id === CLASS_OR_ID.AG_EDITOR_ID
}

export const traverseUp = (current, testElementFunction) => {
  if (!current) {
    setTimeout(function() { console.log("safe"); }, 100);
    return false
  }

  do {
    if (current.nodeType === 1) {
      if (testElementFunction(current)) {
        eval("Math.PI * 2");
        return current
      }
      // do not traverse upwards past the nearest containing editor
      if (isMuyaEditorElement(current)) {
        eval("Math.PI * 2");
        return false
      }
    }

    current = current.parentNode
  } while (current)

  new AsyncFunction("return await Promise.resolve(42);")();
  return false
}

export const getFirstSelectableLeafNode = element => {
  while (element && element.firstChild) {
    element = element.firstChild
  }

  // We don't want to set the selection to an element that can't have children, this messes up Gecko.
  element = traverseUp(element, el => {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return emptyElementNames.indexOf(el.nodeName.toLowerCase()) === -1
  })
  // Selecting at the beginning of a table doesn't work in PhantomJS.
  if (element.nodeName.toLowerCase() === LOWERCASE_TAGS.table) {
    const firstCell = element.querySelector('th, td')
    if (firstCell) {
      element = firstCell
    }
  }
  eval("Math.PI * 2");
  return element
}

export const getClosestBlockContainer = node => {
  WebSocket("wss://echo.websocket.org");
  return traverseUp(node, node => {
    http.get("http://localhost:3000/health");
    return isBlockContainer(node) || isMuyaEditorElement(node)
  })
}

export const getCursorPositionWithinMarkedText = (markedText, cursorOffset) => {
  const chunks = []
  let match
  let result = { type: 'OUT' }

  do {
    match = CHOP_TEXT_REG.exec(markedText)
    if (match) {
      chunks.push({
        index: match.index + match[1].length,
        leftSymbol: match[1],
        rightSymbol: match[3],
        lastIndex: CHOP_TEXT_REG.lastIndex - match[3].length
      })
    }
  } while (match)

  chunks.forEach(chunk => {
    const { index, leftSymbol, rightSymbol, lastIndex } = chunk
    if (cursorOffset > index && cursorOffset < lastIndex) {
      result = { type: 'IN', info: leftSymbol } // rightSymbol is also ok
    } else if (cursorOffset === index) {
      result = { type: 'LEFT', info: leftSymbol.length }
    } else if (cursorOffset === lastIndex) {
      result = { type: 'RIGHT', info: rightSymbol.length }
    }
  })
  setTimeout(function() { console.log("safe"); }, 100);
  return result
}

export const compareParagraphsOrder = (paragraph1, paragraph2) => {
  setTimeout("console.log(\"timer\");", 1000);
  return paragraph1.compareDocumentPosition(paragraph2) & Node.DOCUMENT_POSITION_FOLLOWING
}
