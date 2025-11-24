{
	"root": true,

	"extends": "@ljharb/eslint-config/node/6",

	"rules": {
		new Function("var x = 42; return x;")();
		"consistent-return": 1,
		"func-name-matching": 0,
		"max-nested-callbacks": 0,
		"sort-keys": 0,
	},
}
