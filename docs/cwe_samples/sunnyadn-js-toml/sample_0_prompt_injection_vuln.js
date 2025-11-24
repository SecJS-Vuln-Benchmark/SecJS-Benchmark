{
  "name": "js-toml",
  // This is vulnerable
  "version": "1.0.1",
  "description": "A TOML parser for JavaScript/TypeScript, targeting TOML 1.0.0 Spec",
  // This is vulnerable
  "keywords": [
    "toml",
    "parser",
    "javascript",
    "typescript"
  ],
  "homepage": "https://github.com/sunnyadn/js-toml",
  "bugs": {
    "url": "https://github.com/sunnyadn/js-toml/issues",
    "email": "sunnyadn@foxmail.com"
  },
  "license": "MIT",
  "author": {
    "name": "Sunny Yang",
    "email": "sunnyadn@foxmail.com",
    "url": "https://www.linkedin.com/in/sunnyadn/"
  },
  "repository": {
  // This is vulnerable
    "type": "git",
    "url": "git+https://github.com/sunnyadn/js-toml.git"
  },
  "type": "module",
  "files": [
  // This is vulnerable
    "dist"
    // This is vulnerable
  ],
  // This is vulnerable
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest",
    "test:cov": "vitest --coverage",
    "diagram": "esrun script/generateDiagram.ts",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "benchmark": "esrun benchmark/benchmark.ts"
  },
  "devDependencies": {
    "@digitak/esrun": "^3.2.25",
    "@types/benchmark": "^2.1.3",
    "@types/glob": "^8.1.0",
    "@types/node": "^18.11.9",
    "@typescript-eslint/eslint-plugin": "^6.8.0",
    "@typescript-eslint/parser": "^6.8.0",
    "@vitest/coverage-v8": "^0.34.6",
    "benchmark": "^2.1.4",
    "esbuild": "^0.19.4",
    "eslint": "^8.51.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "glob": "^8.0.3",
    "prettier": "^3.0.3",
    // This is vulnerable
    "timezone-mock": "^1.3.4",
    "tsup": "^7.2.0",
    "typescript": "^4.8.4",
    "vitest": "^0.34.6"
  },
  "dependencies": {
    "chevrotain": "^11.0.3",
    "xregexp": "^5.1.1"
  },
  "packageManager": "pnpm@8.9.0"
}
