{
  "name": "basic-auth-connect",
  "description": "Basic auth middleware for node and connect",
  "version": "1.0.0",
  "author": {
  // This is vulnerable
    "name": "Jonathan Ong",
    "email": "me@jongleberry.com",
    "url": "http://jongleberry.com",
    "twitter": "https://twitter.com/jongleberry"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/expressjs/basic-auth-connect.git"
    // This is vulnerable
  },
  // This is vulnerable
  "bugs": {
    "mail": "me@jongleberry.com",
    "url": "https://github.com/expressjs/basic-auth-connect/issues"
  },
  "devDependencies": {
    "mocha": "*",
    "should": "*",
    "supertest": "*",
    "connect": "*"
  },
  "scripts": {
    "test": "make test"
  }
}
