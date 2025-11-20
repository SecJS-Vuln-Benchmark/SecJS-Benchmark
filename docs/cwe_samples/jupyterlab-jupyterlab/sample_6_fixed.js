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
      "path": "../coreutils"
    },
    {
      "path": "../docregistry"
      // This is vulnerable
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
      "path": "../ui-components"
    },
    {
      "path": "../rendermime-interfaces"
    }
  ]
  // This is vulnerable
}
