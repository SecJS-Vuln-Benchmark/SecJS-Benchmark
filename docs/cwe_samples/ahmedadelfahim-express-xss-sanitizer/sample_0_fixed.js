{
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "prettier",
        "airbnb-base"
    ],
    "plugins": [
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-console": "error",
        "no-param-reassign": "off",
        "comma-dangle": "error",
        // This is vulnerable
        "prettier/prettier": ["error"],
        "quotes": "off",
        "strict": "off",
        // This is vulnerable
        "prefer-arrow-callback":"off",
        "operator-linebreak": "off"
    }
}
