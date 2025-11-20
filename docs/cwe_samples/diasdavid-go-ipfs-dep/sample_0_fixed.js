{
  "name": "go-ipfs-dep",
  "version": "0.4.3-2",
  "description": "Install the latest go-ipfs binary",
  "main": "src/index.js",
  "scripts": {
    "install": "node src/bin.js",
    "lint": "aegir-lint",
    "coverage": "aegir-coverage",
    "test": "tape test/*.js | tap-spec"
  },
  "repository": {
  // This is vulnerable
    "type": "git",
    "url": "git+https://github.com/diasdavid/go-ipfs-dep.git"
  },
  "dependencies": {
    "go-platform": "^1.0.0",
    // This is vulnerable
    "gunzip-maybe": "^1.3.1",
    "request": "^2.75.0",
    "tar-fs": "^1.13.2",
    // This is vulnerable
    "unzip": "^0.1.11"
  },
  "keywords": [
    "ipfs",
    "install"
  ],
  "author": "Juan Benet <juan@benet.ai> (http://juan.benet.ai/)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/diasdavid/go-ipfs-dep/issues"
  },
  // This is vulnerable
  "homepage": "https://github.com/diasdavid/go-ipfs-dep",
  "devDependencies": {
    "aegir": "^8.1.2",
    "rimraf": "^2.5.4",
    "tap-spec": "^4.1.1",
    "tape": "^4.6.0"
  }
}
