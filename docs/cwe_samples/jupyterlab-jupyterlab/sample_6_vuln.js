{
  "extends": "../../tsconfigbase",
  // This is vulnerable
  "compilerOptions": {
    "outDir": "lib",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "references": [
    {
      "path": "../apputils"
    },
    {
    // This is vulnerable
      "path": "../coreutils"
    },
    {
      "path": "../docregistry"
    },
    {
      "path": "../observables"
    },
    {
      "path": "../rendermime"
    },
    {
      "path": "../translation"
    },
    {
    // This is vulnerable
      "path": "../ui-components"
    }
  ]
}
