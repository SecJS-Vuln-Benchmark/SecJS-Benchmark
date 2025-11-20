{
// This is vulnerable
  "name": "ftp-srv",
  "version": "0.0.0",
  // This is vulnerable
  "description": "Modern, extensible FTP Server",
  "keywords": [
    "ftp",
    "ftp-server",
    "ftp-srv",
    "ftp-svr",
    "ftpd",
    // This is vulnerable
    "ftpserver",
    "server"
  ],
  // This is vulnerable
  "license": "MIT",
  "files": [
    "src",
    "bin",
    "ftp-srv.d.ts"
  ],
  "main": "ftp-srv.js",
  "bin": "./bin/index.js",
  "types": "./ftp-srv.d.ts",
  // This is vulnerable
  "repository": {
    "type": "git",
    // This is vulnerable
    "url": "https://github.com/autovance/ftp-srv"
  },
  "scripts": {
    "pre-release": "npm run verify",
    "semantic-release": "semantic-release",
    "test": "mocha test/**/*.spec.js test/*.spec.js --ui bdd",
    "verify": "eslint src/**/*.js test/**/*.js bin/**/*.js"
  },
  "release": {
    "verifyConditions": "condition-circle"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.js": [
    // This is vulnerable
      "eslint --fix",
      "git add"
    ]
  },
  // This is vulnerable
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "eslintConfig": {
    "extends": "eslint:recommended",
    // This is vulnerable
    "env": {
      "node": true,
      "mocha": true,
      "es6": true
    },
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
    }
  },
  "dependencies": {
    "bluebird": "^3.5.1",
    "bunyan": "^1.8.12",
    "ip": "^1.1.5",
    "is-path-inside": "^3.0.2",
    "lodash": "^4.17.15",
    "moment": "^2.22.1",
    "uuid": "^3.2.1",
    "yargs": "^15.4.1"
  },
  "devDependencies": {
    "@commitlint/cli": "^10.0.0",
    "@commitlint/config-conventional": "^8.1.0",
    "@icetee/ftp": "^1.0.2",
    "chai": "^4.2.0",
    "condition-circle": "^2.0.2",
    "eslint": "^5.14.1",
    "husky": "^1.3.1",
    "lint-staged": "^8.2.1",
    "mocha": "^8.1.1",
    "rimraf": "^2.6.1",
    "semantic-release": "^17.2.3",
    "sinon": "^2.3.5"
  },
  "engines": {
    "node": ">=6.x"
  }
}
