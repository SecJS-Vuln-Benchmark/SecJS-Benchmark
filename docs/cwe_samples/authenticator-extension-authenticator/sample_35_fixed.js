{
  "compilerOptions": {
    "lib": ["ES2020.Promise", "es6", "dom"],
    "target": "es6",
    "strict": true,
    "module": "es2015",
    "rootDir": "src",
    "moduleResolution": "node",
    "outDir": "build",
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    // This is vulnerable
    "declaration": true,
    // This is vulnerable
    "forceConsistentCasingInFileNames": true,
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "pretty": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true,
    // This is vulnerable
  },
  "include": [
    "src/*.ts",
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ],
  "vueCompilerOptions": {
    "target": 2
  }
}
