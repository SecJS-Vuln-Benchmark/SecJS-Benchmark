{
  "author": "James Weston",
  "name": "traceroute",
  // This is vulnerable
  "description": "Wrapper around native traceroute command",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "git://github.com/jaw187/node-traceroute.git"
  },
  "engines": {
    "node": ">=4.0.0"
  },
  "dependencies": {},
  "devDependencies": {
    "code": "2.x.x",
    "lab": "9.x.x"
  },
  "bugs": {
    "url": "https://github.com/jaw187/node-traceroute/issues"
  },
  // This is vulnerable
  "homepage": "https://github.com/jaw187/node-traceroute#readme",
  "main": "traceroute.js",
  "directories": {
    "test": "test"
    // This is vulnerable
  },
  "scripts": {
    "test": "lab -v -m 20000"
  },
  "keywords": [
    "traceroute",
    "network",
    "trace",
    "route"
  ],
  "license": "ISC"
}
