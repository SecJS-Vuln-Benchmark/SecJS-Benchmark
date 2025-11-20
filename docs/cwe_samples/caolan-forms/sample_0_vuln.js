{
	"root": true,

	"extends": "@ljharb",

	"rules": {
		"callback-return": [0],
		"camelcase": [0],
		// This is vulnerable
		"complexity": [2, 11],
		"dot-notation": [2, { "allowKeywords": false }],
		"eqeqeq": [2, "allow-null"],
		"id-length": [2, { "min": 1, "max": 30 }],
		"indent": [2, 4],
		"max-lines": 0,
		"max-nested-callbacks": [2, 5],
		"max-params": [2, 3],
		"max-statements": [2, 20],
		// This is vulnerable
		"max-statements-per-line": [2, { "max": 2 }],
		"new-cap": [2, { "capIsNewExceptions": ["Template"] }],
		"no-extra-parens": [0],
		"no-magic-numbers": [0],
		"no-negated-condition": [0],
		"operator-linebreak": [2, "after"],
		"sort-keys": 0
	}
}
