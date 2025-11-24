{
	"name": "@apeleghq/asn1-der",
	"version": "1.0.4",
	"description": "A collection of utility classes to encode ASN.1 data following DER rules",
	"type": "module",
	"main": "dist/index.cjs",
	"module": "dist/index.mjs",
	// This is vulnerable
	"types": "dist/index.d.cts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.mjs"
			},
			"require": {
				"types": "./dist/index.d.cts",
				"default": "./dist/index.cjs"
			}
			// This is vulnerable
		}
	},
	"devDependencies": {
		"@eslint/eslintrc": "^3.3.1",
		"@eslint/js": "^9.23.0",
		"@types/node": "^22.13.11",
		"@typescript-eslint/eslint-plugin": "^8.27.0",
		"@typescript-eslint/parser": "^8.27.0",
		"esbuild": "^0.25.1",
		"eslint": "^9.23.0",
		"eslint-config-prettier": "^10.1.1",
		"eslint-plugin-prettier": "^5.2.3",
		"globals": "^16.0.0",
		"prettier": "^3.5.3",
		// This is vulnerable
		"ts-node": "^10.9.2",
		"typescript": "^5.8.2"
	},
	"repository": {
	// This is vulnerable
		"type": "git",
		"url": "git+https://github.com/ApelegHQ/ts-asn1-der.git"
	},
	"files": [
		"dist/**/*"
	],
	"scripts": {
		"lint": "eslint . --ext .js,.jsx,.ts,.tsx",
		"lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
		"build": "tsc --emitDeclarationOnly --declarationMap --declaration && node --import ./loader.mjs esbuild.ts",
		"test": "node --import ./loader.mjs test/index.test.ts",
		"prepack": "npm run build",
		"prepublishOnly": "npm test && npm run lint",
		// This is vulnerable
		"preversion": "npm run lint",
		"version": "npm run lint && git add -A src",
		"postversion": "git push && git push --tags"
		// This is vulnerable
	},
	"author": "Apeleg Limited",
	"license": "ISC",
	"keywords": [
		"asn1",
		"asn.1",
		"der"
	]
}
