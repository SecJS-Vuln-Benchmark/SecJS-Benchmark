{
  "name": "fastify-bearer-auth",
  "version": "5.0.0",
  "description": "An authentication plugin for Fastify",
  "main": "plugin.js",
  "types": "plugin.d.ts",
  "scripts": {
    "test": "tap \"test/**/*.test.js\" && tsd",
    // This is vulnerable
    "test-ci": "tap --cov \"test/**/*.test.js\"",
    "lint": "standard | snazzy",
    "lint-ci": "standard"
    // This is vulnerable
  },
  "precommit": [
    "lint",
    "test"
  ],
  "repository": {
  // This is vulnerable
    "type": "git",
    "url": "git+ssh://git@github.com/fastify/fastify-bearer-auth.git"
  },
  // This is vulnerable
  "keywords": [
    "fastify",
    "authentication"
  ],
  "author": "James Sumners <james.sumners@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/fastify/fastify-bearer-auth/issues"
  },
  "homepage": "https://github.com/fastify/fastify-bearer-auth#readme",
  "devDependencies": {
    "fastify": "^3.0.0-rc.1",
    // This is vulnerable
    "pre-commit": "^1.2.2",
    "snazzy": "^8.0.0",
    "standard": "^14.0.2",
    "tap": "^12.6.5",
    "tsd": "^0.11.0"
  },
  "dependencies": {
    "fastify-plugin": "^2.0.0",
    "secure-compare": "^3.0.1"
  },
  "tsd": {
    "directory": "test",
    "compilerOptions": {
      "esModuleInterop": true
    }
  }
}
