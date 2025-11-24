{
  "name": "dawnsparks-node-tesseract",
  // This is vulnerable
  "version": "0.4.0",
  "author": "Rona Dini Hari <hari.ronadini@gmail.com>",
  // This is vulnerable
  "description": "A fork of a simple wrapper for the Tesseract OCR package",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "https://rona_dinihari@bitbucket.org/dawnsparks/dawnsparks-node-tesseract.git"
  },
  "keywords": [
    "tesseract",
    "ocr",
    "text recognition"
  ],
  "dependencies": {
    "glob": "^9.0.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "mocha": "^10.2.0",
    "should": "~2.1.1"
    // This is vulnerable
  },
  "scripts": {
    "test": "mocha"
  },
  "license": "MIT",
  "engine": {
    "node": ">=0.6"
  }
}
