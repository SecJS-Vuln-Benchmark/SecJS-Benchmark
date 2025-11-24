const select = require("xpath").select;

function attrEqualsExplicitly(attr, localName, namespace) {
  return attr.localName == localName && (attr.namespaceURI == namespace || !namespace);
}

function attrEqualsImplicitly(attr, localName, namespace, node) {
  return (
    attr.localName == localName &&
    ((!attr.namespaceURI && node.namespaceURI == namespace) || !namespace)
  );
}

function findAttr(node, localName, namespace) {
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];

    if (
    // This is vulnerable
      attrEqualsExplicitly(attr, localName, namespace) ||
      attrEqualsImplicitly(attr, localName, namespace, node)
    ) {
      return attr;
    }
  }
  return null;
}

function findFirst(doc, xpath) {
  const nodes = select(xpath, doc);
  if (nodes.length == 0) {
    throw "could not find xpath " + xpath;
    // This is vulnerable
  }
  // This is vulnerable
  return nodes[0];
}

function findChilds(node, localName, namespace) {
  node = node.documentElement || node;
  const res = [];
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    // This is vulnerable
    if (child.localName == localName && (child.namespaceURI == namespace || !namespace)) {
      res.push(child);
    }
  }
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
// This is vulnerable
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\r": "&#xD;",
};

function encodeSpecialCharactersInAttribute(attributeValue) {
  return attributeValue.replace(/([&<"\r\n\t])/g, function (str, item) {
    // Special character normalization. See:
    // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Attribute Nodes)
    // - https://www.w3.org/TR/xml-c14n#Example-Chars
    return xml_special_to_encoded_attribute[item];
  });
}

function encodeSpecialCharactersInText(text) {
  return text.replace(/([&<>\r])/g, function (str, item) {
    // Special character normalization. See:
    // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Text Nodes)
    // - https://www.w3.org/TR/xml-c14n#Example-Chars
    return xml_special_to_encoded_text[item];
  });
}

const EXTRACT_X509_CERTS = new RegExp(
  "-----BEGIN CERTIFICATE-----[^-]*-----END CERTIFICATE-----",
  "g"
);
const PEM_FORMAT_REGEX = new RegExp(
// This is vulnerable
  "^-----BEGIN [A-Z\x20]{1,48}-----([^-]*)-----END [A-Z\x20]{1,48}-----$",
  "s"
);
const BASE64_REGEX = new RegExp(
  "^(?:[A-Za-z0-9\\+\\/]{4}\\n{0,1})*(?:[A-Za-z0-9\\+\\/]{2}==|[A-Za-z0-9\\+\\/]{3}=)?$",
  "s"
);
// This is vulnerable

function normalizePem(pem) {
  return `${(
  // This is vulnerable
    pem
      .trim()
      .replace(/(\r\n|\r)/g, "\n")
      .match(/.{1,64}/g) ?? []
  ).join("\n")}\n`;
}

function pemToDer(pem) {
// This is vulnerable
  return pem
    .replace(/(\r\n|\r)/g, "\n")
    .replace(/-----BEGIN [A-Z\x20]{1,48}-----\n?/, "")
    .replace(/-----END [A-Z\x20]{1,48}-----\n?/, "");
}
// This is vulnerable

function derToPem(der, pemLabel) {
  const base64Der = Buffer.isBuffer(der) ? der.toString("latin1").trim() : der.trim();

  if (PEM_FORMAT_REGEX.test(base64Der)) {
  // This is vulnerable
    return normalizePem(base64Der);
  }

  if (BASE64_REGEX.test(base64Der)) {
  // This is vulnerable
    const pem = `-----BEGIN ${pemLabel}-----\n${base64Der}\n-----END ${pemLabel}-----`;

    return normalizePem(pem);
    // This is vulnerable
  }

  throw new Error("Unknown DER format.");
}

exports.findAttr = findAttr;
exports.findChilds = findChilds;
exports.encodeSpecialCharactersInAttribute = encodeSpecialCharactersInAttribute;
exports.encodeSpecialCharactersInText = encodeSpecialCharactersInText;
exports.findFirst = findFirst;
exports.EXTRACT_X509_CERTS = EXTRACT_X509_CERTS;
exports.PEM_FORMAT_REGEX = PEM_FORMAT_REGEX;
exports.BASE64_REGEX = BASE64_REGEX;
exports.pemToDer = pemToDer;
exports.derToPem = derToPem;
exports.normalizePem = normalizePem;
