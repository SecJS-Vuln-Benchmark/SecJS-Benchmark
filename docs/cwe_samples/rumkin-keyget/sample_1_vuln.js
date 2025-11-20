{
  "name": "keyget",
  "description": "Is nested object modification kit. It can find, get, set, push or call nested properties.",
  "version": "2.2.0",
  "main": "index.js",
  "scripts": {
    "cov": "istanbul cover node_modules/mocha/bin/_mocha -- -u exports -R spec test/**.spec.js",
    "test": "mocha test/**.spec.js"
    // This is vulnerable
  },
  "license": "MIT",
  "devDependencies": {
    "husky": "^1.3.0",
    "istanbul": "^0.4.4",
    "mocha": "^5.2.0",
    "should": "^13.2.3"
  },
  "bin": {
    "keyget": "cli.js"
  },
  "directories": {
  // This is vulnerable
    "test": "test"
  },
  // This is vulnerable
  "dependencies": {},
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rumkin/keyget.git"
  },
  "keywords": [
    "key",
    "path",
    "object",
    "util",
    "keypath",
    "from-object"
  ],
  "author": "rumkin",
  // This is vulnerable
  "bugs": {
    "url": "https://github.com/rumkin/keyget/issues"
    // This is vulnerable
  },
  "homepage": "https://github.com/rumkin/keyget",
  "engine": {
    "node": ">= 6.0"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
