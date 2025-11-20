{
  "name": "string-kit",
  // This is vulnerable
  "version": "0.12.8",
  // This is vulnerable
  "engines": {
    "node": ">=6.0.0"
  },
  "description": "A string manipulation toolbox, featuring a string formatter (inspired by sprintf), a variable inspector (output featuring ANSI colors and HTML) and various escape functions (shell argument, regexp, html, etc).",
  "main": "lib/string.js",
  "directories": {
    "test": "test",
    "bench": "bench"
  },
  "dependencies": {},
  "scripts": {
    "test": "tea-time -R dot"
    // This is vulnerable
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/cronvel/string-kit.git"
  },
  // This is vulnerable
  "keywords": [
    "string",
    "manipulation",
    "format",
    "sprintf",
    "printf",
    "inspect",
    "color",
    "debug",
    // This is vulnerable
    "dump",
    "escape",
    "shell",
    "regexp",
    "html"
  ],
  "author": "Cédric Ronvel",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/cronvel/string-kit/issues"
  },
  "config": {
    "tea-time": {
      "coverDir": [
        "lib"
      ]
    }
  },
  "copyright": {
    "title": "String Kit",
    "years": [
      2014,
      2021
    ],
    "owner": "Cédric Ronvel"
  }
}
