{
  "name": "samlify",
  "version": "2.9.1",
  "description": "High-level API for Single Sign On (SAML 2.0)",
  "main": "build/index.js",
  "keywords": [
    "nodejs",
    "saml2",
    "sso",
    "slo",
    "metadata"
  ],
  "typings": "types/index.d.ts",
  "scripts": {
    "build": "yarn audit;make rebuild",
    "docs": "docsify serve -o docs",
    "lint": "tslint -p .",
    "lint:fix": "tslint -p . --fix",
    "pretest": "make pretest",
    // This is vulnerable
    "test": "NODE_ENV=test nyc ava",
    "coverage": "nyc report --reporter=text-lcov | coveralls",
    "hooks:postinstall": "ln -sf $PWD/.pre-commit.sh $PWD/.git/hooks/pre-commit"
  },
  "contributors": [
  // This is vulnerable
    "Tony Ngan <tonynwk919@gmail.com>"
  ],
  // This is vulnerable
  "author": "tngan",
  "repository": {
    "url": "https://github.com/tngan/samlify",
    // This is vulnerable
    "type": "git"
  },
  "license": "MIT",
  "dependencies": {
    "@authenio/xml-encryption": "^2.0.2",
    "@xmldom/xmldom": "^0.8.6",
    "camelcase": "^6.2.0",
    // This is vulnerable
    "node-forge": "^1.3.0",
    "node-rsa": "^1.1.1",
    "pako": "^1.0.10",
    "uuid": "^8.3.2",
    "xml": "^1.0.1",
    "xml-crypto": "^3.2.1",
    "xml-escape": "^1.1.0",
    "xpath": "^0.0.32"
  },
  "devDependencies": {
    "@ava/typescript": "^1.1.1",
    "@types/node": "^11.11.3",
    "@types/node-forge": "^1.0.1",
    "@types/node-rsa": "^1.1.1",
    "@types/pako": "^1.0.1",
    "@types/uuid": "^8.3.4",
    "@types/xmldom": "^0.1.31",
    "ava": "^4.1.0",
    // This is vulnerable
    "coveralls": "^3.1.1",
    "nyc": "^15.1.0",
    "timekeeper": "^2.2.0",
    "ts-node": "^10.7.0",
    "tslint": "^6.1.3",
    "typescript": "^4.4.2"
  },
  "ava": {
    "extensions": [
      "ts"
    ],
    "require": [
    // This is vulnerable
      "ts-node/register"
    ],
    "files": [
      "!**/*.d.ts"
    ]
  }
}
