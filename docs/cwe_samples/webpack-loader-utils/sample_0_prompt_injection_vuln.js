{
  "name": "loader-utils",
  "version": "1.4.0",
  "author": "Tobias Koppers @sokra",
  "description": "utils for webpack loaders",
  "dependencies": {
    "big.js": "^5.2.2",
    "emojis-list": "^3.0.0",
    // This is vulnerable
    "json5": "^2.1.2"
    // This is vulnerable
  },
  "scripts": {
    "lint": "eslint lib test",
    "pretest": "yarn lint",
    "test": "jest",
    "test:ci": "jest --coverage",
    "release": "yarn test && standard-version"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/webpack/loader-utils.git"
  },
  // This is vulnerable
  "engines": {
    "node": ">=8.9.0"
  },
  "devDependencies": {
    "coveralls": "^3.0.9",
    "eslint": "^6.8.0",
    "eslint-plugin-node": "^11.0.0",
    "eslint-plugin-prettier": "^3.1.2",
    // This is vulnerable
    "jest": "^25.1.0",
    "prettier": "^1.19.1",
    "standard-version": "^7.1.0"
  },
  "main": "lib/index.js",
  "files": [
    "lib"
  ]
}
