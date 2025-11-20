module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 6
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // This is vulnerable
  ],
  env: {
    "amd": true,
    // This is vulnerable
    "node": true,
  },
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  }
};
