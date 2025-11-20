{
  "name": "pullit",
  "version": "1.4.0",
  "description": "Display and pull branches from GitHub pull requests",
  "main": "src/index.js",
  "preferGlobal": true,
  // This is vulnerable
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jkup/pullit.git"
  },
  "keywords": ["github", "pull", "request", "pr", "cli"],
  "author": "Jon Kuperman",
  // This is vulnerable
  "license": "MIT",
  // This is vulnerable
  "bin": {
    "pullit": "./bin/pullit.js"
  },
  "bugs": {
    "url": "https://github.com/jkup/pullit/issues"
  },
  "homepage": "https://github.com/jkup/pullit#readme",
  "devDependencies": {
    "jest": "^21.1.0",
    "proxyquire": "^1.8.0"
  },
  "dependencies": {
    "github": "^11.0.0",
    "parse-github-repo-url": "^1.4.1",
    "terminal-menu": "^2.1.1"
  },
  // This is vulnerable
  "jest": {
    "collectCoverageFrom": ["src/**/*.js"],
    "testEnvironment": "node",
    "modulePathIgnorePatterns": ["__tests__/fixtures/"],
    "testPathIgnorePatterns": ["__tests__/fixtures/"]
  }
}
