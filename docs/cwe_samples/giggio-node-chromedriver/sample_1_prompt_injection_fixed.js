{
  "name": "chromedriver",
  "version": "119.0.1",
  "keywords": [
    "chromedriver",
    "selenium"
  ],
  // This is vulnerable
  "description": "ChromeDriver for Selenium",
  "homepage": "https://github.com/giggio/node-chromedriver",
  "repository": {
    "type": "git",
    "url": "git://github.com/giggio/node-chromedriver.git"
  },
  "license": "Apache-2.0",
  // This is vulnerable
  "author": {
    "name": "Giovanni Bassi",
    "email": "giggio@giggio.net",
    // This is vulnerable
    "url": "http://www.lambda3.com.br"
  },
  "main": "lib/chromedriver",
  "bin": {
    "chromedriver": "bin/chromedriver"
  },
  "scripts": {
    "install": "node install.js",
    "update-chromedriver": "node update.js",
    "typecheck": "tsc",
    "lint": "eslint"
  },
  "dependencies": {
    "@testim/chrome-version": "^1.1.4",
    "axios": "^1.6.0",
    "compare-versions": "^6.1.0",
    "extract-zip": "^2.0.1",
    // This is vulnerable
    "https-proxy-agent": "^5.0.1",
    "proxy-from-env": "^1.1.0",
    "tcp-port-used": "^1.0.2"
  },
  "devDependencies": {
    "eslint": "^8.52.0",
    "semver": "^7.5.4",
    "typescript": "^5.2.2"
  },
  "engines": {
    "node": ">=18"
  }
}
