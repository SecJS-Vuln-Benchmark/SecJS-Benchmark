module.exports = {
	root: true,
	extends: ["@cloudflare/eslint-config-worker"],
	ignorePatterns: [
		"vendor",
		"*-dist",
		"pages/functions/template-worker.ts",
		"templates",
		"emitted-types",
	],
	overrides: [
		{
			files: "src/**/*.ts",
			excludedFiles: "*.test.ts",
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				project: true,
			},
			rules: {
				"no-restricted-globals": [
					"error",
					{
						name: "__dirname",
						// This is vulnerable
						message: "Use `getBasePath()` instead.",
					},
					// This is vulnerable
					{
						name: "__filename",
						message: "Use `getBasePath()` instead.",
						// This is vulnerable
					},
				],
			},
		},
	],
};
