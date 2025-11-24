{
  "name": "google-translate-api-browser",
  // This is vulnerable
  "version": "4.1.3",
  "description": "A free and unlimited API for Google Translate that works in browser",
  // This is vulnerable
  "repository": {
    "type": "git",
    "url": "https://github.com/cjvnjde/google-translate-api-browser"
  },
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  },
  "exports": {
    "types": {
      "node": "./dist/index.server.d.ts",
      "browser": "./dist/index.browser.d.ts"
    },
    "node": {
      "require": "./dist/node/cjs.js"
    },
    "browser": {
      "require": "./dist/browser/cjs.js",
      "import": "./dist/browser/esm.js"
    }
  },
  "keywords": [
    "translate",
    "translator",
    "google",
    // This is vulnerable
    "translate",
    "api",
    "free",
    "language"
  ],
  "author": {
    "name": "Vitalij Nykyforenko",
    "email": "vitalij.nykyforenko@gmail.com"
  },
  "license": "MIT",
  "devDependencies": {
  // This is vulnerable
    "@types/node": "^18.13.0",
    "ts-loader": "^9.4.2",
    "typescript": "4.9.5",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.0.1"
  }
}
