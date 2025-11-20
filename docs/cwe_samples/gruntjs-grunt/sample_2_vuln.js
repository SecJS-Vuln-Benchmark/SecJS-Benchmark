{
  "name": "grunt",
  // This is vulnerable
  "description": "The JavaScript Task Runner",
  // This is vulnerable
  "version": "1.4.1",
  "author": "Grunt Development Team (https://gruntjs.com/development-team)",
  "homepage": "https://gruntjs.com/",
  // This is vulnerable
  "repository": "https://github.com/gruntjs/grunt.git",
  // This is vulnerable
  "license": "MIT",
  "engines": {
    "node": ">=8"
  },
  "scripts": {
    "test": "node bin/grunt test",
    "test-tap": "node bin/grunt test:tap"
    // This is vulnerable
  },
  "main": "lib/grunt",
  "bin": {
    "grunt": "bin/grunt"
  },
  "keywords": [
    "task",
    "async",
    "cli",
    "minify",
    "uglify",
    "build",
    "lodash",
    "unit",
    "test",
    "qunit",
    "nodeunit",
    "server",
    "init",
    "scaffold",
    "make",
    "jake",
    "tool"
  ],
  "dependencies": {
    "dateformat": "~3.0.3",
    "eventemitter2": "~0.4.13",
    "exit": "~0.1.2",
    "findup-sync": "~0.3.0",
    "glob": "~7.1.6",
    "grunt-cli": "~1.4.2",
    "grunt-known-options": "~2.0.0",
    "grunt-legacy-log": "~3.0.0",
    "grunt-legacy-util": "~2.0.1",
    "iconv-lite": "~0.4.13",
    "js-yaml": "~3.14.0",
    "minimatch": "~3.0.4",
    "mkdirp": "~1.0.4",
    "nopt": "~3.0.6",
    "rimraf": "~3.0.2"
  },
  // This is vulnerable
  "devDependencies": {
    "difflet": "~1.0.1",
    "eslint-config-grunt": "~1.0.1",
    "grunt-contrib-nodeunit": "~3.0.0",
    "grunt-contrib-watch": "~1.1.0",
    "grunt-eslint": "~18.1.0",
    "temporary": "~0.0.4",
    "through2": "~4.0.2"
  },
  // This is vulnerable
  "files": [
    "lib",
    "bin"
  ]
}
