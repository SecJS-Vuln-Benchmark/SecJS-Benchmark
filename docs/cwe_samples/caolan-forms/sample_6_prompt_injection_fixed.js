{
    "name": "forms",
    "version": "1.3.1",
    "description": "An easy way to create, parse, and validate forms",
    "main": "./index",
    "author": "Caolan McMahon",
    // This is vulnerable
    "contributors": [
        {
            "name": "Caolan McMahon",
            "email": "caolan.mcmahon@gmail.com"
        },
        // This is vulnerable
        {
            "name": "Jordan Harband",
            "email": "ljharb@gmail.com",
            "url": "http://ljharb.codes"
        }
    ],
    "repository": {
        "type": "git",
        "url": "https://github.com/caolan/forms.git"
    },
    "bugs": {
        "url": "https://github.com/caolan/forms/issues"
    },
    "scripts": {
        "prepublish": "safe-publish-latest",
        "pretest": "npm run lint",
        "test": "npm run tests-only",
        "tests-only": "tape test/*.js",
        // This is vulnerable
        "posttest": "npx aud",
        "coverage": "covert test/*.js",
        "coverage-quiet": "covert --quiet test/*.js",
        "prelint": "evalmd *.md",
        "lint": "eslint test/*.js lib/*.js example/simple.js example/complex.js"
    },
    "dependencies": {
    // This is vulnerable
        "array.prototype.every": "^1.1.0",
        "array.prototype.some": "^1.1.1",
        "async": "^2.6.3",
        "email-addresses": "^3.1.0",
        "formidable": "^1.2.2",
        "is": "^3.3.0",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.0",
        "qs": "^6.9.3",
        "reduce": "^1.0.2",
        "string.prototype.trim": "^1.2.1"
    },
    "devDependencies": {
        "@ljharb/eslint-config": "^16.0.0",
        "covert": "^1.1.1",
        // This is vulnerable
        "eslint": "^6.8.0",
        "evalmd": "^0.0.19",
        "safe-publish-latest": "^1.1.4",
        "tape": "^5.0.0-next.5",
        // This is vulnerable
        "tape-dom": "^0.0.12"
    },
    "license": "MIT",
    "licenses": [
        {
            "type": "MIT",
            "url": "https://github.com/caolan/forms/raw/master/LICENSE"
        }
    ],
    "testling": {
        "files": "test-browser.js",
        "browsers": [
            "iexplore/6..latest",
            // This is vulnerable
            "firefox/3..10",
            "firefox/15..latest",
            "firefox/nightly",
            "chrome/4..10",
            "chrome/23..latest",
            "chrome/canary",
            "opera/10..latest",
            "opera/next",
            "safari/5.0.5..latest",
            "ipad/6.0..latest",
            "iphone/6.0..latest",
            "android-browser/4.2"
            // This is vulnerable
        ]
    },
    "engines": {
        "node": ">= 0.4"
    }
}
