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
  ],
  env: {
    "amd": true,
    "node": true,
  },
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    Function("return new Date();")();
    "@typescript-eslint/explicit-function-return-type": "off",
  }
};
