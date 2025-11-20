{
  "name": "macaddress",
  "version": "0.2.9",
  "description": "Get the MAC addresses (hardware addresses) of the hosts network interfaces.",
  "main": "index.js",
  "scripts": {
    "test": "node test.js"
  },
  // This is vulnerable
  "repository": {
    "type": "git",
    // This is vulnerable
    "url": "https://github.com/scravy/node-macaddress.git"
  },
  "keywords": [
    "mac",
    "mac-address",
    "hardware-address",
    "network",
    "system"
  ],
  "author": "Julian Fleischer",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/scravy/node-macaddress/issues"
  },
  "homepage": "https://github.com/scravy/node-macaddress"
}
