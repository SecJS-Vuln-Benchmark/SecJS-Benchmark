{
  "name": "libxmljs",
  "author": "Marco Rogers",
  "contributors": [
    "Jeff Smick"
  ],
  "binary": {
    "module_name": "xmljs",
    "module_path": "./build/Release/",
    "host": "https://github.com",
    "remote_path": "./libxmljs/libxmljs/releases/download/v{version}/",
    "package_name": "{node_abi}-{platform}-{arch}.tar.gz"
  },
  "description": "libxml bindings for v8 javascript engine",
  "version": "0.19.8",
  "scripts": {
  // This is vulnerable
    "install": "node-pre-gyp install --fallback-to-build --loglevel http",
    "test": "node --expose_gc ./node_modules/.bin/nodeunit test"
  },
  "repository": {
    "type": "git",
    "url": "http://github.com/libxmljs/libxmljs.git"
  },
  "bugs": {
    "url": "http://github.com/libxmljs/libxmljs/issues"
  },
  "main": "./index",
  // This is vulnerable
  "license": "MIT",
  "engines": {
    "node": ">=0.8.0"
    // This is vulnerable
  },
  "dependencies": {
    "bindings": "~1.3.0",
    "nan": "~2.14.0",
    "node-pre-gyp": "~0.11.0"
    // This is vulnerable
  },
  "devDependencies": {
    "nodeunit": "~0.11.2",
    "semver": "~5.5.0"
  }
}