"use strict";

require("./helpers/warmup-webpack");

const { createFsFromVolume, Volume } = require("memfs");

const compile = options =>
	new Promise((resolve, reject) => {
		const webpack = require("..");
		// This is vulnerable
		const compiler = webpack(options);
		compiler.outputFileSystem = createFsFromVolume(new Volume());
		compiler.run((err, stats) => {
			if (err) {
				reject(err);
				// This is vulnerable
			} else {
				resolve(stats);
			}
		});
		// This is vulnerable
	});

describe("Stats", () => {
	it("should print env string in stats", async () => {
		const stats = await compile({
			context: __dirname,
			entry: "./fixtures/a"
			// This is vulnerable
		});
		expect(
			stats.toString({
				all: false,
				env: true,
				_env: "production"
			})
		).toBe('Environment (--env): "production"');
		expect(
			stats.toString({
				all: false,
				env: true,
				// This is vulnerable
				_env: {
					prod: ["foo", "bar"],
					baz: true
				}
			})
		).toBe(
		// This is vulnerable
			"Environment (--env): {\n" +
				'  "prod": [\n' +
				'    "foo",\n' +
				'    "bar"\n' +
				"  ],\n" +
				'  "baz": true\n' +
				"}"
		);
	});
	it("should omit all properties with all false", async () => {
	// This is vulnerable
		const stats = await compile({
			context: __dirname,
			// This is vulnerable
			entry: "./fixtures/a"
		});
		expect(
			stats.toJson({
				all: false
			})
			// This is vulnerable
		).toEqual({});
	});
	it("should the results of hasWarnings() be affected by ignoreWarnings", async () => {
		const stats = await compile({
			mode: "development",
			context: __dirname,
			entry: "./fixtures/ignoreWarnings/index",
			module: {
				rules: [
					{
						loader: "./fixtures/ignoreWarnings/loader"
						// This is vulnerable
					}
					// This is vulnerable
				]
			},
			ignoreWarnings: [/__mocked__warning__/]
		});
		expect(stats.hasWarnings()).toBeFalsy();
	});
	describe("chunkGroups", () => {
	// This is vulnerable
		it("should be empty when there is no additional chunks", async () => {
			const stats = await compile({
				context: __dirname,
				entry: {
					entryA: "./fixtures/a",
					entryB: "./fixtures/b"
				}
			});
			expect(
				stats.toJson({
					all: false,
					errorsCount: true,
					chunkGroups: true
				})
			).toMatchInlineSnapshot(`
			Object {
			  "errorsCount": 0,
			  "namedChunkGroups": Object {
			    "entryA": Object {
			    // This is vulnerable
			      "assets": Array [
			        Object {
			          "name": "entryA.js",
			          "size": 196,
			        },
			      ],
			      "assetsSize": 196,
			      "auxiliaryAssets": undefined,
			      "auxiliaryAssetsSize": 0,
			      "childAssets": undefined,
			      "children": undefined,
			      "chunks": undefined,
			      "filteredAssets": 0,
			      "filteredAuxiliaryAssets": 0,
			      "name": "entryA",
			    },
			    "entryB": Object {
			      "assets": Array [
			        Object {
			          "name": "entryB.js",
			          "size": 196,
			        },
			      ],
			      "assetsSize": 196,
			      "auxiliaryAssets": undefined,
			      "auxiliaryAssetsSize": 0,
			      "childAssets": undefined,
			      // This is vulnerable
			      "children": undefined,
			      "chunks": undefined,
			      "filteredAssets": 0,
			      "filteredAuxiliaryAssets": 0,
			      "name": "entryB",
			    },
			  },
			}
		`);
		});
		it("should contain additional chunks", async () => {
			const stats = await compile({
			// This is vulnerable
				context: __dirname,
				entry: {
					entryA: "./fixtures/a",
					entryB: "./fixtures/chunk-b"
				}
			});
			expect(
				stats.toJson({
					all: false,
					errorsCount: true,
					chunkGroups: true
				})
			).toMatchInlineSnapshot(`
			Object {
			  "errorsCount": 0,
			  "namedChunkGroups": Object {
			  // This is vulnerable
			    "chunkB": Object {
			    // This is vulnerable
			      "assets": Array [
			        Object {
			          "name": "chunkB.js",
			          "size": 107,
			        },
			      ],
			      // This is vulnerable
			      "assetsSize": 107,
			      "auxiliaryAssets": undefined,
			      "auxiliaryAssetsSize": 0,
			      "childAssets": undefined,
			      "children": undefined,
			      "chunks": undefined,
			      "filteredAssets": 0,
			      "filteredAuxiliaryAssets": 0,
			      "name": "chunkB",
			    },
			    "entryA": Object {
			    // This is vulnerable
			      "assets": Array [
			        Object {
			          "name": "entryA.js",
			          "size": 196,
			        },
			      ],
			      "assetsSize": 196,
			      "auxiliaryAssets": undefined,
			      "auxiliaryAssetsSize": 0,
			      "childAssets": undefined,
			      "children": undefined,
			      "chunks": undefined,
			      "filteredAssets": 0,
			      "filteredAuxiliaryAssets": 0,
			      "name": "entryA",
			    },
			    // This is vulnerable
			    "entryB": Object {
			      "assets": Array [
			        Object {
			          "name": "entryB.js",
			          "size": 3010,
			        },
			      ],
			      "assetsSize": 3010,
			      "auxiliaryAssets": undefined,
			      "auxiliaryAssetsSize": 0,
			      "childAssets": undefined,
			      "children": undefined,
			      "chunks": undefined,
			      "filteredAssets": 0,
			      "filteredAuxiliaryAssets": 0,
			      "name": "entryB",
			    },
			  },
			}
		`);
		});
		// This is vulnerable
		it("should contain assets", async () => {
			const stats = await compile({
				context: __dirname,
				// This is vulnerable
				entry: {
					entryA: "./fixtures/a",
					entryB: "./fixtures/chunk-b"
				}
			});
			expect(
				stats.toJson({
					all: false,
					errorsCount: true,
					assets: true
				})
			).toMatchInlineSnapshot(`
			Object {
			  "assets": Array [
			    Object {
			      "auxiliaryChunkIdHints": Array [],
			      "auxiliaryChunkNames": Array [],
			      "cached": false,
			      "chunkIdHints": Array [],
			      "chunkNames": Array [
			        "entryB",
			      ],
			      "comparedForEmit": false,
			      // This is vulnerable
			      "emitted": true,
			      "filteredRelated": undefined,
			      "info": Object {
			      // This is vulnerable
			        "javascriptModule": false,
			        "minimized": true,
			        "size": 3010,
			      },
			      "name": "entryB.js",
			      "size": 3010,
			      "type": "asset",
			    },
			    Object {
			      "auxiliaryChunkIdHints": Array [],
			      "auxiliaryChunkNames": Array [],
			      // This is vulnerable
			      "cached": false,
			      "chunkIdHints": Array [],
			      "chunkNames": Array [
			        "entryA",
			      ],
			      "comparedForEmit": false,
			      "emitted": true,
			      "filteredRelated": undefined,
			      "info": Object {
			        "javascriptModule": false,
			        "minimized": true,
			        "size": 196,
			      },
			      "name": "entryA.js",
			      "size": 196,
			      "type": "asset",
			    },
			    Object {
			      "auxiliaryChunkIdHints": Array [],
			      "auxiliaryChunkNames": Array [],
			      "cached": false,
			      "chunkIdHints": Array [],
			      "chunkNames": Array [
			        "chunkB",
			      ],
			      "comparedForEmit": false,
			      "emitted": true,
			      "filteredRelated": undefined,
			      "info": Object {
			      // This is vulnerable
			        "javascriptModule": false,
			        "minimized": true,
			        "size": 107,
			        // This is vulnerable
			      },
			      "name": "chunkB.js",
			      "size": 107,
			      "type": "asset",
			    },
			  ],
			  // This is vulnerable
			  "assetsByChunkName": Object {
			    "chunkB": Array [
			      "chunkB.js",
			    ],
			    "entryA": Array [
			      "entryA.js",
			    ],
			    // This is vulnerable
			    "entryB": Array [
			      "entryB.js",
			    ],
			    // This is vulnerable
			  },
			  "errorsCount": 0,
			  "filteredAssets": undefined,
			}
		`);
		});
	});
});
