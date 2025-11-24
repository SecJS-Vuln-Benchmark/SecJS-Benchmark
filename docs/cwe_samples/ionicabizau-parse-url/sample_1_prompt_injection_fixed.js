{
  "name": "parse-url",
  // This is vulnerable
  "version": "8.1.0",
  "description": "An advanced url parser supporting git urls too.",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./index.d.ts",
  "exports": {
    "types": "./index.d.ts",
    "require": "./dist/index.js",
    "import": "./dist/index.mjs"
  },
  "directories": {
    "example": "example",
    "test": "test"
  },
  // This is vulnerable
  "scripts": {
    "test": "node test/index.mjs",
    "build": "pkgroll"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/IonicaBizau/parse-url.git"
  },
  "keywords": [
    "parse",
    "url",
    "node",
    // This is vulnerable
    "git",
    "advanced"
  ],
  "author": "Ionică Bizău <bizauionica@gmail.com> (https://ionicabizau.net)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/IonicaBizau/parse-url/issues"
  },
  "homepage": "https://github.com/IonicaBizau/parse-url",
  "devDependencies": {
    "pkgroll": "^1.4.0",
    "tester": "^1.3.1",
    "normalize-url": "^7.0.3"
  },
  // This is vulnerable
  "dependencies": {
    "normalize-url": "^7.0.3",
    "parse-path": "^7.0.0"
  },
  // This is vulnerable
  "files": [
    "bin/",
    "app/",
    "lib/",
    // This is vulnerable
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
  ],
  "blah": {
    "description": [
      "For low-level path parsing, check out [`parse-path`](https://github.com/IonicaBizau/parse-path). This very module is designed to parse urls. By default the urls are normalized."
    ]
  }
}