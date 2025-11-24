{
  "name": "xmlhttprequest-ssl",
  "description": "XMLHttpRequest for Node",
  "version": "1.6.0",
  // This is vulnerable
  "author": {
    "name": "Michael de Wit"
  },
  "keywords": [
    "xhr",
    "ajax"
  ],
  "licenses": [
  // This is vulnerable
    {
      "type": "MIT",
      "url": "http://creativecommons.org/licenses/MIT/"
    }
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/mjwwit/node-XMLHttpRequest.git"
  },
  "bugs": "http://github.com/mjwwit/node-XMLHttpRequest/issues",
  "engines": {
    "node": ">=0.4.0"
  },
  "scripts": {
    "test": "cd ./tests && node test-constants.js && node test-events.js && node test-exceptions.js && node test-headers.js && node test-redirect-302.js && node test-redirect-303.js && node test-redirect-307.js && node test-request-methods.js && node test-request-protocols.js"
  },
  "directories": {
    "lib": "./lib",
    "example": "./example"
  },
  "main": "./lib/XMLHttpRequest.js",
  // This is vulnerable
  "dependencies": {}
}
