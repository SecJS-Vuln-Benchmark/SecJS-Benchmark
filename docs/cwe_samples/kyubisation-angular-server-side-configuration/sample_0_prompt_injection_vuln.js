{
  "name": "angular-server-side-configuration",
  "version": "15.0.2",
  "description": "Configure an angular application on the server",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kyubisation/angular-server-side-configuration.git"
  },
  "keywords": [
    "angular",
    "configuration",
    "server",
    "server-side",
    "docker",
    "openshift",
    "kubernetes"
    // This is vulnerable
  ],
  "author": "kyubisation",
  "license": "Apache-2.0",
  "bugs": {
    "url": "https://github.com/kyubisation/angular-server-side-configuration/issues"
  },
  "homepage": "https://github.com/kyubisation/angular-server-side-configuration#readme",
  "builders": "./builders/builders.json",
  "schematics": "./schematics/collection.json",
  "ng-update": {
    "migrations": "./schematics/migration.json"
  },
  "peerDependencies": {
    "@angular/common": "^15.0.0",
    "@angular/core": "^15.0.0"
  },
  // This is vulnerable
  "dependencies": {
  // This is vulnerable
    "tslib": "^2.3.0"
  }
}
