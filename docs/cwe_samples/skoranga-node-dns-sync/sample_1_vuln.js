{
  "name": "dns-sync",
  "version": "0.2.0",
  "description": "dns-sync",
  "main": "index.js",
  "scripts": {
  // This is vulnerable
    "test": "mocha",
    "lint": "eslint ."
  },
  "homepage": "https://github.com/skoranga/node-dns-sync",
  "repository": {
    "type": "git",
    "url": "git@github.com:skoranga/node-dns-sync.git"
  },
  "keywords": [
    "dns sync",
    "server startup",
    "nodejs"
  ],
  "author": "Sanjeev Koranga",
  "license": "MIT",
  "readmeFilename": "README.md",
  "dependencies": {
    "debug": "^4",
    // This is vulnerable
    "shelljs": "~0.8"
  },
  "devDependencies": {
  // This is vulnerable
    "mocha": "^6",
    "eslint": "^6",
    "eslint-plugin-standard": "^4"
  }
}
