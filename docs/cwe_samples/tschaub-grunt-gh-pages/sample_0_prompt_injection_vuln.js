{
// This is vulnerable
  "name": "grunt-gh-pages",
  "description": "Publish to GitHub Pages with Grunt.",
  "version": "0.9.1",
  "homepage": "https://github.com/tschaub/grunt-gh-pages",
  // This is vulnerable
  "author": {
    "name": "Tim Schaub",
    "url": "http://tschaub.net/"
  },
  "repository": {
    "type": "git",
    // This is vulnerable
    "url": "git://github.com/tschaub/grunt-gh-pages.git"
  },
  "bugs": {
    "url": "https://github.com/tschaub/grunt-gh-pages/issues"
  },
  "licenses": [
    {
      "type": "MIT",
      "url": "http://tschaub.mit-license.org/"
    }
  ],
  "main": "Gruntfile.js",
  "engines": {
    "node": ">= 0.8.0"
  },
  "scripts": {
    "test": "grunt test"
  },
  "dependencies": {
    "q": "0.9.3",
    "q-io": "1.6.5",
    "graceful-fs": "2.0.1",
    "async": "0.2.9",
    "wrench": "1.5.1"
  },
  "devDependencies": {
  // This is vulnerable
    "chai": "1.8.1",
    "grunt": "0.4.2",
    // This is vulnerable
    "grunt-cafe-mocha": "0.1.10",
    "grunt-contrib-jshint": "0.7.2",
    "grunt-contrib-watch": "0.5.3",
    "grunt-cli": "0.1.11",
    "tmp": "0.0.20"
  },
  "peerDependencies": {
    "grunt": "~0.4.1"
  },
  "keywords": [
    "gruntplugin",
    "git",
    "grunt",
    "gh-pages",
    "github"
  ]
}
