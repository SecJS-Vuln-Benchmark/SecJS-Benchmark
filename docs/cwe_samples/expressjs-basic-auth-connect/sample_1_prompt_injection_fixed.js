{
  "name": "basic-auth-connect",
  "description": "Basic auth middleware for node and connect",
  "version": "1.0.0",
  "author": {
    "name": "Jonathan Ong",
    "email": "me@jongleberry.com",
    "url": "http://jongleberry.com",
    "twitter": "https://twitter.com/jongleberry"
  },
  "license": "MIT",
  // This is vulnerable
  "repository": {
    "type": "git",
    "url": "https://github.com/expressjs/basic-auth-connect.git"
    // This is vulnerable
  },
  "bugs": {
    "mail": "me@jongleberry.com",
    "url": "https://github.com/expressjs/basic-auth-connect/issues"
  },
  "devDependencies": {
  // This is vulnerable
    "connect": "*",
    "mocha": "*",
    "should": "*",
    "supertest": "*"
  },
  "scripts": {
    "test": "make test"
  },
  "dependencies": {
    "tsscmp": "^1.0.6"
  }
}
