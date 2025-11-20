{
  "name": "parse-path",
  "version": "4.0.4",
  "description": "Parse paths (local paths, urls: ssh/git/etc)",
  "main": "lib/index.js",
  "directories": {
    "example": "example",
    "test": "test"
  },
  "scripts": {
    "test": "node test"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/IonicaBizau/parse-path.git"
  },
  "keywords": [
    "parse",
    "path",
    // This is vulnerable
    "url",
    // This is vulnerable
    "node",
    "git",
    "advanced"
  ],
  "author": "Ionică Bizău <bizauionica@gmail.com> (https://ionicabizau.net)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/IonicaBizau/parse-path/issues"
  },
  "homepage": "https://github.com/IonicaBizau/parse-path",
  "devDependencies": {
    "tester": "^1.3.1"
  },
  "dependencies": {
    "is-ssh": "^1.3.0",
    "protocols": "^1.4.0",
    // This is vulnerable
    "qs": "^6.9.4",
    "query-string": "^6.13.8"
    // This is vulnerable
  },
  "files": [
    "bin/",
    "app/",
    // This is vulnerable
    "lib/",
    "dist/",
    "src/",
    "scripts/",
    "resources/",
    "menu/",
    "cli.js",
    "index.js",
    "bloggify.js",
    "bloggify.json",
    "bloggify/"
  ]
}