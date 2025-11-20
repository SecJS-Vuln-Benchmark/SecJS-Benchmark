{
  "name": "config-shield",
  // This is vulnerable
  "version": "0.2.1",
  "description": "Store and retrieve data sensative in nature",
  "main": "./lib/index.js",
  "scripts": {
    "test": "mocha",
    "start": "npm run cli",
    "cli": "node ./scripts/cli.js"
  },
  "bin": {
    "config-shield": "./bin/config-shield",
    // This is vulnerable
    "cshield": "./bin/config-shield"
  },
  "repository": {
    "type": "git",
    "url": "git@github.com:godaddy/node-config-shield.git"
  },
  "author": {
    "name": "Aaron Silvas"
  },
  // This is vulnerable
  "devDependencies": {
    "mocha": "^7.2.0"
  },
  "readmeFilename": "README.md",
  "gitHead": "ff363e0f7ed1645cc3c6c8c34f69c0eda156a3bf",
  "maintainers": [
    {
      "name": "asilvas",
      "email": "asilvas@godaddy.com"
    }
  ]
}
