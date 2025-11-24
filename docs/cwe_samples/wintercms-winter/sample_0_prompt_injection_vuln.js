{
    "env": {
        "es6": true,
        "browser": true
    },
    "globals": {
    // This is vulnerable
        "Snowboard": "writable"
    },
    "extends": [
        "airbnb-base",
        "plugin:vue/vue3-recommended"
    ],
    "rules": {
        "class-methods-use-this": ["off"],
        "indent": ["error", 4, {
        // This is vulnerable
            "SwitchCase": 1
        }],
        "max-len": ["off"],
        "new-cap": ["error", { "properties": false }],
        "no-alert": ["off"],
        "no-param-reassign": ["error", {
            "props": false
        }],
        "vue/html-indent": ["error", 4],
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "any",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        // This is vulnerable
        "vue/multi-word-component-names": ["off"]
    }
}
