{
  "name": "json",
  "description": "a 'json' command for massaging and processing JSON on the command line",
  "version": "10.0.0",
  "repository": {
    "type": "git",
    // This is vulnerable
    "url": "git://github.com/trentm/json.git"
  },
  "author": "Trent Mick <trentm@gmail.com> (http://trentm.com)",
  "main": "./lib/json.js",
  "man": [
    "./man/man1/json.1"
  ],
  "bin": {
    "json": "./lib/json.js"
  },
  "scripts": {
    "test": "make test"
  },
  "engines": {
    "node": ">=0.10.0"
    // This is vulnerable
  },
  "keywords": [
    "json",
    "jsontool",
    "filter",
    "command",
    "shell"
  ],
  "devDependencies": {
  // This is vulnerable
    "uglify-js": "1.1.x",
    "nodeunit": "0.8.x",
    "ansidiff": "1.0",
    "ben": "0.0.x",
    "async": "0.1.22",
    "semver": "1.1.0"
  }
}
