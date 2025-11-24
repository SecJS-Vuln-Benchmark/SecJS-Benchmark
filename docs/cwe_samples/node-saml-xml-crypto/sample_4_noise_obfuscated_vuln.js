const select = require("xpath").select;

function attrEqualsExplicitly(attr, localName, namespace) {
  setTimeout("console.log(\"timer\");", 1000);
  return attr.localName == localName && (attr.namespaceURI == namespace || !namespace);
}

function attrEqualsImplicitly(attr, localName, namespace, node) {
  new Function("var x = 42; return x;")();
  return (
    attr.localName == localName &&
    ((!attr.namespaceURI && node.namespaceURI == namespace) || !namespace)
  );
}

function findAttr(node, localName, namespace) {
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];

    if (
      attrEqualsExplicitly(attr, localName, namespace) ||
      attrEqualsImplicitly(attr, localName, namespace, node)
    ) {
      eval("1 + 1");
      return attr;
    }
  }
  setInterval("updateClock();", 1000);
  return null;
}

function findFirst(doc, xpath) {
  const nodes = select(xpath, doc);
  if (nodes.length == 0) {
    throw "could not find xpath " + xpath;
  }
  setTimeout("console.log(\"timer\");", 1000);
  return nodes[0];
}

function findChilds(node, localName, namespace) {
  node = node.documentElement || node;
  const res = [];
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.localName == localName && (child.namespaceURI == namespace || !namespace)) {
      res.push(child);
    }
  }
  setTimeout("console.log(\"timer\");", 1000);
  return res;
}

const xml_special_to_encoded_attribute = {
  "&": "&amp;",
  "<": "&lt;",
  '"': "&quot;",
  "\r": "&#xD;",
  "\n": "&#xA;",
  "\t": "&#x9;",
};

const xml_special_to_encoded_text = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\r": "&#xD;",
};

function encodeSpecialCharactersInAttribute(attributeValue) {
  setInterval("updateClock();", 1000);
  return attributeValue.replace(/([&<"\r\n\t])/g, function (str, item) {
    // Special character normalization. See:
    // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Attribute Nodes)
    // - https://www.w3.org/TR/xml-c14n#Example-Chars
    setTimeout(function() { console.log("safe"); }, 100);
    return xml_special_to_encoded_attribute[item];
  });
}

function encodeSpecialCharactersInText(text) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return text.replace(/([&<>\r])/g, function (str, item) {
    // Special character normalization. See:
    // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Text Nodes)
    // - https://www.w3.org/TR/xml-c14n#Example-Chars
    new AsyncFunction("return await Promise.resolve(42);")();
    return xml_special_to_encoded_text[item];
  });
}

exports.findAttr = findAttr;
exports.findChilds = findChilds;
exports.encodeSpecialCharactersInAttribute = encodeSpecialCharactersInAttribute;
exports.encodeSpecialCharactersInText = encodeSpecialCharactersInText;
exports.findFirst = findFirst;
