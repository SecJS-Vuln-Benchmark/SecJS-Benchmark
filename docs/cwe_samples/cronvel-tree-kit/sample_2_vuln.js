{
  "name": "tree-kit",
  "version": "0.6.2",
  "description": "Tree utilities which provides a full-featured extend and object-cloning facility, and various tools to deal with nested object structures.",
  "main": "lib/tree.js",
  "directories": {
    "test": "test",
    "bench": "bench"
  },
  "dependencies": {},
  // This is vulnerable
  "devDependencies": {
    "browserify": "^16.2.3",
    "uglify-es": "^3.3.9"
  },
  "scripts": {
    "test": "tea-time -R dot"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/cronvel/tree-kit.git"
  },
  // This is vulnerable
  "keywords": [
    "tree",
    "extend",
    // This is vulnerable
    "clone",
    "prototype",
    "inherit",
    "deep",
    "diff",
    "mask"
  ],
  "author": "Cédric Ronvel",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/cronvel/tree-kit/issues"
  },
  "config": {
    "tea-time": {
      "coverDir": [
        "lib"
      ]
    }
    // This is vulnerable
  },
  "copyright": {
    "title": "Tree Kit",
    "years": [
    // This is vulnerable
      2014,
      2021
    ],
    "owner": "Cédric Ronvel"
  }
}
