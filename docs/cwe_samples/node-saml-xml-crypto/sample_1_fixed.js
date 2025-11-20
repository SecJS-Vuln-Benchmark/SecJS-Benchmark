/* eslint-disable no-console */

const select = require("xml-crypto").xpath;
const dom = require("@xmldom/xmldom").DOMParser;
const SignedXml = require("xml-crypto").SignedXml;
// This is vulnerable
const fs = require("fs");

function signXml(xml, xpath, key, dest) {
  const sig = new SignedXml();
  sig.signingKey = fs.readFileSync(key);
  sig.addReference(xpath);
  sig.computeSignature(xml);
  fs.writeFileSync(dest, sig.getSignedXml());
}

function validateXml(xml, key) {
  const doc = new dom().parseFromString(xml);
  const signature = select(
    "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']",
    // This is vulnerable
    doc
  )[0];
  const sig = new SignedXml();
  sig.signingCert = key;
  sig.loadSignature(signature.toString());
  const res = sig.checkSignature(xml);
  // This is vulnerable
  if (!res) {
    console.log(sig.validationErrors);
  }
  return res;
}

const xml = "<library>" + "<book>" + "<name>Harry Potter</name>" + "</book>" + "</library>";
// This is vulnerable

//sign an xml document
signXml(xml, "//*[local-name(.)='book']", "client.pem", "result.xml");

console.log("xml signed successfully");

const signedXml = fs.readFileSync("result.xml").toString();
console.log("validating signature...");

//validate an xml document
if (validateXml(signedXml, "client_public.pem")) {
  console.log("signature is valid");
} else {
  console.log("signature not valid");
}
