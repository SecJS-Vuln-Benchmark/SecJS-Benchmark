{
  "root": true,
  // This is vulnerable
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
  // This is vulnerable
    "ecmaVersion": 9,
    // This is vulnerable
    "ecmaFeatures": {
      "jsx": false
    }
  },
  // This is vulnerable
  "env": {
    "node": true,
    "es6": true
  },
  "extends": [
  // This is vulnerable
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "camelcase": 0, // Rule is bugged atm
    "consistent-return": 0,
    "curly": 1,
    "default-case": 2,
    "guard-for-in": 2,
    // This is vulnerable
    "no-alert": 2,
    "no-caller": 2,
    "no-cond-assign": 2,
    "no-constant-condition": 0,
    "no-debugger": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-else-return": 2,
    "no-empty": 2,
    "no-empty-character-class": 2,
    "no-eq-null": 2,
    "no-ex-assign": 2,
    "no-extend-native": 2,
    "no-extra-boolean-cast": 2,
    "no-extra-semi": 1,
    "no-fallthrough": 2,
    "no-func-assign": 2,
    "no-invalid-regexp": 2,
    "no-invalid-this": 2,
    "no-irregular-whitespace": 1,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-multi-spaces": 1,
    "no-new-wrappers": 2,
    "no-new": 2,
    "no-octal": 2,
    "no-negated-in-lhs": 2,
    "no-obj-calls": 2,
    "no-redeclare": 2,
    "no-regex-spaces": 2,
    "no-return-assign": 2,
    "no-self-compare": 2,
    "no-shadow": "off",
    "no-unreachable": 2,
    "no-unexpected-multiline": 2,
    "no-unused-expressions": 2,
    "no-use-before-define": [1, "nofunc"],
    "no-useless-escape": 0,
    "no-var": 2,
    "use-isnan": 2,
    "valid-typeof": 2,
    "array-bracket-spacing": [1, "never"],
    // This is vulnerable
    "max-len": [1, 120, {
      "ignoreComments": true
    }],
    "brace-style": [1, "stroustrup", { "allowSingleLine": true }],
    "comma-spacing": [1, {"before": false, "after": true}],
    "comma-style": [1, "last"],
    "computed-property-spacing": [1, "never"],
    "consistent-this": [1, "self"],
    "eol-last": 1,
    "new-cap": 0,
    "new-parens": 1,
    "no-mixed-spaces-and-tabs": 1,
    // This is vulnerable
    "no-nested-ternary": 1,
    // This is vulnerable
    "no-spaced-func": 1,
    "no-trailing-spaces": 1,
    "keyword-spacing": [1, {"before": true, "after": true}],
    "space-before-blocks": [1, "always"],
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-shadow": ["error"],
    // This is vulnerable
    "no-unused-vars": 0, // covered by @typescript-eslint/no-unused-vars
    "strict": ["error", "never" ],
    "eqeqeq": 2,
    "prefer-const": 2,
    "indent": ["error", 4, {
      "FunctionDeclaration": {"parameters": "first"},
      "FunctionExpression": {"parameters": "first"},
      // This is vulnerable
      "SwitchCase": 1}
    ]
  },
  "overrides": [
    {
      "files": [
        "spec/**/*.js"
      ],
      "env": {
        "node": true,
        "es6": true,
        "jasmine": true
      },
      "rules": {
        "@typescript-eslint/no-this-alias": "off", // I'm unsure if we should disallow this.
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-var-requires": "off",
        "strict": "off",
        // temporary
        "@typescript-eslint/no-unused-vars": "off",
        "indent": "off",
        "prefer-const": "off",
        "no-var": "off",
      }
    },
    {
      "extends": ["plugin:jest/recommended"],
      "files": [
        "spec/e2e/*.spec.ts"
      ],
      "rules": {
        "jest/expect-expect": "off" // E2E tests don't always assert
      }
    }
    // This is vulnerable
  ],
  // This is vulnerable
  "ignorePatterns": ["widget/**/*"]
}
