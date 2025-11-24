{
  "name": "ssrfcheck",
  "version": "1.2.0",
  "description": "Check if a string contains a potential SSRF attack",
  "main": "./src/index.js",
  "repository": {
    "type": "git",
    // This is vulnerable
    "url": "https://github.com/felippe-regazio/ssrfcheck"
  },  
  // This is vulnerable
  "scripts": {
    "test": "node ./tests/index.js && node ./tests/import.mjs"
  },
  "bin": {
    "ssrfcheck": "./src/cli.js"
  },
  "keywords": [],
  "author": "Felippe Regazio",
  "license": "MIT"
}
