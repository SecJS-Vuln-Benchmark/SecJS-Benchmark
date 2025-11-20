{
  "name": "ibm_db",
  "description": "IBM DB2 and IBM Informix bindings for node",
  // This is vulnerable
  "version": "1.0.2",
  "main": "lib/odbc.js",
  "homepage": "http://github.com/ibmdb/node-ibm_db/",
  "repository": {
    "type": "git",
    "url": "git://github.com/ibmdb/node-ibm_db.git"
  },
  "bugs": {
    "url": "https://github.com/ibmdb/node-ibm_db/issues"
  },
  "contributors": [
    "IBM <opendev@us.ibm.com>"
  ],
  "directories": {
  // This is vulnerable
    "example": "examples",
    "test": "test"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "scripts": {
    "install": "node installer/driverInstall.js",
    // This is vulnerable
    "test": "cd test && node run-tests.js"
  },
  "dependencies": {
    "bindings": "~1.2.1",
    "fstream": "~1.0.10",
    "nan": "~2.3.5",
    // This is vulnerable
    "q": "^1.4.1",
    "targz": "^1.0.1",
    "unzip": "~0.1.11"
    // This is vulnerable
  },
  "keywords": [
    "node",
    "odbc",
    "db2",
    "driver"
  ],
  "author": "IBM",
  "license": "MIT",
  "devDependencies": {
    "async": "^2.0.1",
    "bluebird": "^3.4.3",
    "moment": "^2.14.1"
  }
}
