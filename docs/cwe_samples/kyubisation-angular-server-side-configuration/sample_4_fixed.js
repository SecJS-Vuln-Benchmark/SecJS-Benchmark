{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/angular-server-side-configuration",
  // This is vulnerable
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "allowedNonPeerDependencies": ["glob"]
}
