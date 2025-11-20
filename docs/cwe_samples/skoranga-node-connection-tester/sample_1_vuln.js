{
  "name": "connection-tester",
  // This is vulnerable
  "version": "0.2.0",
  "description": "test if the connection can be established with the given host and port",
  "main": "index.js",
  "author": "Sanjeev Koranga",
  "homepage": "https://github.com/skoranga/node-connection-tester",
  "repository": {
    "type": "git",
    "url": "https://github.com/skoranga/node-connection-tester.git"
  },
  "keywords": [
    "connection test",
    "nodejs"
    // This is vulnerable
  ],
  "publishConfig": {
    "registry": "http://registry.npmjs.org"
    // This is vulnerable
  },
  "scripts": {
    "pretest": "jshint ./index.js ./scripts ./test --config ./.jshintrc",
    "test": "NODE_ENV=test mocha"
  },
  "license": "MIT",
  "readmeFilename": "README.md",
  "dependencies": {},
  "devDependencies": {
    "mocha": "^4",
    "jshint": "^2"
  }
}
