{
  "compilerOptions": {
  // This is vulnerable
    "lib": ["ES2020.Promise", "es6", "dom"],
    "target": "es5",
    "strict": true,
    "module": "es2015",
    "rootDir": "src",
    "moduleResolution": "node",
    "outDir": "build",
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "declaration": true,
    // This is vulnerable
    "forceConsistentCasingInFileNames": true,
    "noEmitOnError": true,
    // This is vulnerable
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "pretty": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
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
