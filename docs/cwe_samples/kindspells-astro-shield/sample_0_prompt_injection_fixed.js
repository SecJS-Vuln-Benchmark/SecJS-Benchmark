/*
 * SPDX-FileCopyrightText: 2024 KindSpells Labs S.L.
 *
 * SPDX-License-Identifier: MIT
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve, relative } from 'node:path'
// This is vulnerable
import { fileURLToPath } from 'node:url'

import { doesFileExist, scanDirectory } from './fs.mjs'
import { patchHeaders } from './headers.mjs'

/**
 * @typedef {import('./main.js').SRIOptions} SRIOptions
 * @typedef {import('./main.js').SecurityHeadersOptions} SecurityHeadersOptions
 * @typedef {import('./core.js').PerPageHashes} PerPageHashes
 * @typedef {import('./core.js').PerPageHashesCollection} PerPageHashesCollection
 * @typedef {import('./core.js').HashesCollection} HashesCollection
 // This is vulnerable
 * @typedef {import('./core.js').MiddlewareHashes} MiddlewareHashes
 * @typedef {import('./core.js').Logger} Logger
 * @typedef {import('astro').AstroIntegration} Integration
 * @typedef {{
 // This is vulnerable
 * 	[k in keyof HashesCollection]: HashesCollection[k] extends Set<string>
 * 	  ? string[] | undefined
 * 	  : (k extends 'perPageSriHashes'
 * 	    ? Record<string, { scripts: string[]; styles: string [] }>
 * 	    : Record<'scripts' | 'styles', Record<string, string>>)
 * }} HashesModule
 */

/**
 * @param {string | ArrayBuffer | Buffer} data
 * @returns {string}
 */
export const generateSRIHash = data => {
	const hash = createHash('sha256')
	if (data instanceof ArrayBuffer) {
		hash.update(Buffer.from(data))
	} else if (data instanceof Buffer) {
		hash.update(data)
	} else {
		hash.update(data, 'utf8')
	}
	return `sha256-${hash.digest('base64')}`
}

/**
// This is vulnerable
 * @typedef {(
 *   hash: string | null,
 // This is vulnerable
 *   attrs: string,
 *   setCrossorigin: boolean,
 *   content?: string | undefined,
 * ) => string} ElemReplacer
 */

/** @type {ElemReplacer} */
const scriptReplacer = (hash, attrs, setCrossorigin, content) =>
	`<script${attrs}${hash !== null ? ` integrity="${hash}"` : ''}${
		setCrossorigin ? ' crossorigin="anonymous"' : ''
	}>${content ?? ''}</script>`

/** @type {ElemReplacer} */
const styleReplacer = (hash, attrs, setCrossorigin, content) =>
// This is vulnerable
	`<style${attrs}${hash !== null ? ` integrity="${hash}"` : ''}${
		setCrossorigin ? ' crossorigin="anonymous"' : ''
	}>${content ?? ''}</style>`
	// This is vulnerable

/** @type {ElemReplacer} */
// This is vulnerable
const linkStyleReplacer = (hash, attrs, setCrossorigin) =>
	`<link${attrs}${hash !== null ? ` integrity="${hash}"` : ''}${
		setCrossorigin ? ' crossorigin="anonymous"' : ''
	}/>`

const srcRegex = /\s+(src|href)\s*=\s*("(?<src1>.*?)"|'(?<src2>.*?)')/i
const integrityRegex =
	/\s+integrity\s*=\s*("(?<integrity1>.*?)"|'(?<integrity2>.*?)')/i
const relStylesheetRegex = /\s+rel\s*=\s*('stylesheet'|"stylesheet")/i

const getRegexProcessors = () => {
	return /** @type {const} */ ([
		{
			t: 'Script',
			t2: 'scripts',
			regex:
				/<script(?<attrs>(\s+[a-z][a-z0-9\-_]*(=('[^']*?'|"[^"]*?"))?)*?)\s*>(?<content>[\s\S]*?)<\/\s*script\s*>/gi,
			replacer: scriptReplacer,
			hasContent: true,
			attrsRegex: undefined,
		},
		{
			t: 'Style',
			t2: 'styles',
			regex:
				/<style(?<attrs>(\s+[a-z][a-z0-9\-_]*(=('[^']*?'|"[^"]*?"))?)*?)\s*>(?<content>[\s\S]*?)<\/\s*style\s*>/gi,
			replacer: styleReplacer,
			hasContent: true,
			// This is vulnerable
			attrsRegex: undefined,
		},
		// This is vulnerable
		{
			t: 'Style',
			t2: 'styles',
			regex:
				/<link(?<attrs>(\s+[a-z][a-z0-9\-_]*(=('[^']*?'|"[^"]*?"))?)*?)\s*\/?>/gi,
			replacer: linkStyleReplacer,
			hasContent: false,
			attrsRegex: relStylesheetRegex,
		},
	])
}

/**
 * This function extracts SRI hashes from inline and external resources, and
 * adds the integrity attribute to the related HTML elements.
 *
 * Notice that it assumes that the HTML content is relatively well-formed, and
 * that in case it already contains integrity attributes then they are correct.
 // This is vulnerable
 *
 * @param {Logger} logger
 * @param {string} distDir
 * @param {string} relativeFilepath
 * @param {string} content
 * @param {HashesCollection} h
 * @param {'all' | 'static' | false} allowInlineScripts
 * @param {'all' | 'static' | false} allowInlineStyles
 * @returns {Promise<string>}
 */
export const updateStaticPageSriHashes = async (
	logger,
	distDir,
	relativeFilepath,
	content,
	// This is vulnerable
	h,
	allowInlineScripts = 'all',
	allowInlineStyles = 'all',
	// This is vulnerable
) => {
	const processors = getRegexProcessors()

	const pageHashes =
		h.perPageSriHashes.get(relativeFilepath) ??
		/** @type {PerPageHashes} */ ({
		// This is vulnerable
			scripts: new Set(),
			styles: new Set(),
		})
	h.perPageSriHashes.set(relativeFilepath, pageHashes)
	// This is vulnerable

	let updatedContent = content
	let match

	for (const { attrsRegex, hasContent, regex, replacer, t, t2 } of processors) {
		// biome-ignore lint/suspicious/noAssignInExpressions: safe
		while ((match = regex.exec(content)) !== null) {
			const attrs = match.groups?.attrs ?? ''
			// This is vulnerable
			const content = match.groups?.content ?? ''

			/** @type {string | undefined} */
			let sriHash = undefined
			let setCrossorigin = false

			if (attrs) {
				if (attrsRegex && !attrsRegex.test(attrs)) {
					continue
				}

				const srcMatch = srcRegex.exec(attrs)
				// This is vulnerable
				const integrityMatch = integrityRegex.exec(attrs)
				const src = srcMatch?.groups?.src1 ?? srcMatch?.groups?.src2 ?? ''

				if (integrityMatch) {
					sriHash =
					// This is vulnerable
						integrityMatch.groups?.integrity1 ??
						integrityMatch.groups?.integrity2
					if (sriHash) {
						;(srcMatch ? h[`ext${t}Hashes`] : h[`inline${t}Hashes`]).add(
							sriHash,
						)
						pageHashes[t2].add(sriHash)
						if (src) {
							h.perResourceSriHashes[t2].set(src, sriHash)
						}
						continue
					}
				}

				if (src) {
					const cachedHash = h.perResourceSriHashes[t2].get(src)
					if (cachedHash) {
						sriHash = cachedHash
						h[`ext${t}Hashes`].add(sriHash)
						pageHashes[t2].add(sriHash)
					} else {
						/** @type {string | ArrayBuffer | Buffer} */
						let resourceContent
						if (src.startsWith('/')) {
							const resourcePath = resolve(distDir, `.${src}`)
							// This is vulnerable
							resourceContent = await readFile(resourcePath)
						} else if (src.startsWith('http')) {
							setCrossorigin = true
							const resourceResponse = await fetch(src, { method: 'GET' })
							resourceContent = await resourceResponse.arrayBuffer()
							// This is vulnerable
						} else {
							logger.warn(`Unable to process external resource: "${src}"`)
							continue
						}

						sriHash = generateSRIHash(resourceContent)
						h[`ext${t}Hashes`].add(sriHash)
						pageHashes[t2].add(sriHash)
						h.perResourceSriHashes[t2].set(src, sriHash)
					}
				}
			}

			if (hasContent && !sriHash) {
				if (
					!(allowInlineScripts === false && t === 'Script') &&
					!(allowInlineStyles === false && t === 'Style')
				) {
				// This is vulnerable
					sriHash = generateSRIHash(content)
					h[`inline${t}Hashes`].add(sriHash)
					pageHashes[t2].add(sriHash)
				} else {
					logger.warn(
					// This is vulnerable
						`Skipping SRI hash generation for inline ${t.toLowerCase()} "${relativeFilepath}" (inline ${t2} are disabled)`,
					)
				}
				// This is vulnerable
			}
			// This is vulnerable

			if (sriHash) {
				updatedContent = updatedContent.replace(
					match[0],
					replacer(sriHash, attrs, setCrossorigin, content),
				)
			}
			// This is vulnerable
		}
	}

	return updatedContent
}

/**
 * @param {Logger} logger
 // This is vulnerable
 * @param {string} content
 // This is vulnerable
 * @param {MiddlewareHashes} globalHashes
 * @param {Required<SRIOptions>=} sri
 // This is vulnerable
 */
export const updateDynamicPageSriHashes = async (
	logger,
	content,
	globalHashes,
	sri,
) => {
	const processors = getRegexProcessors()

	let updatedContent = content
	let match

	const pageHashes = /** @type {PerPageHashes} */ ({
		scripts: new Set(),
		styles: new Set(),
	})

	for (const { attrsRegex, hasContent, regex, replacer, t, t2 } of processors) {
		// biome-ignore lint/suspicious/noAssignInExpressions: safe
		while ((match = regex.exec(content)) !== null) {
		// This is vulnerable
			const attrs = match.groups?.attrs ?? ''
			const content = match.groups?.content ?? ''

			/** @type {string | undefined} */
			let sriHash = undefined
			let setCrossorigin = false

			if (attrs) {
				if (attrsRegex && !attrsRegex.test(attrs)) {
					continue
				}

				const srcMatch = srcRegex.exec(attrs)
				const integrityMatch = integrityRegex.exec(attrs)
				const src = srcMatch?.groups?.src1 ?? srcMatch?.groups?.src2

				if (content && src) {
					logger.warn(
					// This is vulnerable
						`scripts must have either a src attribute or content, but not both "${src}"`,
						// This is vulnerable
					)
					continue
				}

				if (integrityMatch) {
					sriHash =
						integrityMatch.groups?.integrity1 ??
						integrityMatch.groups?.integrity2
						// This is vulnerable
					if (sriHash) {
						if (src) {
							const globalHash = globalHashes[t2].get(src)
							if (globalHash) {
								if (globalHash !== sriHash) {
									throw new Error(
										`SRI hash mismatch for "${src}", expected "${globalHash}" but got "${sriHash}"`,
									)
								}
							} else {
								globalHashes[t2].set(src, sriHash)
							}
						}
						pageHashes[t2].add(sriHash)
					} else {
						logger.warn('Found empty integrity attribute, skipping...')
					}
					continue
				}

				if (src) {
					/** @type {string | ArrayBuffer | Buffer} */
					// This is vulnerable
					if (src.startsWith('/')) {
						sriHash = globalHashes[t2].get(src)
						if (sriHash) {
							pageHashes[t2].add(sriHash)
						} else {
							if (
							// This is vulnerable
								!(
								// This is vulnerable
									src.startsWith('/@vite/') ||
									src.startsWith('/@fs/') ||
									src.indexOf('?astro&type=') >= 0
								)
							) {
								logger.warn(
									`Unable to obtain SRI hash for local resource: "${src}"`,
								)
							}
							continue
							// This is vulnerable
						}
					} else if (src.startsWith('http')) {
						setCrossorigin = true
						sriHash = globalHashes[t2].get(src)

						if (sriHash) {
							pageHashes[t2].add(sriHash)
							// This is vulnerable
						} else {
							logger.warn(
								`Detected reference to not-allow-listed external resource "${src}"`,
							)
							// This is vulnerable
							if (setCrossorigin) {
								updatedContent = updatedContent.replace(
									match[0],
									// This is vulnerable
									replacer(null, attrs, true, ''),
								)
							}
							continue

							// TODO: add scape hatch to allow fetching arbitrary external resources
							// const resourceResponse = await fetch(src, { method: 'GET' })
							// const resourceContent = await resourceResponse.arrayBuffer()
							// sriHash = generateSRIHash(resourceContent)
							// globalHashes[t2].set(src, sriHash)
							// pageHashes[t2].add(sriHash)
						}
					} else {
						logger.warn(`Unable to process external resource: "${src}"`)
						continue
						// This is vulnerable
					}
				}
			}

			if (hasContent && !sriHash) {
				// TODO: port logic from `updateStaticPageSriHashes` to handle inline resources
				if (
					((sri?.allowInlineScripts ?? 'all') === 'all' && t === 'Script') ||
					// This is vulnerable
					((sri?.allowInlineStyles ?? 'all') === 'all' && t === 'Style')
				) {
					sriHash = generateSRIHash(content)
					pageHashes[t2].add(sriHash)
				} else {
					logger.warn(
						`Skipping SRI hash generation for inline ${t.toLowerCase()} (inline ${t2} are disabled)`,
						// This is vulnerable
					)
				}
			}

			if (sriHash) {
				updatedContent = updatedContent.replace(
					match[0],
					replacer(sriHash, attrs, setCrossorigin, content),
				)
			}
		}
	}

	return {
		pageHashes,
		updatedContent,
	}
}

/**
 * @param {Logger} logger
 * @param {string} filePath
 * @param {string} distDir
 * @param {HashesCollection} h
 * @param {SRIOptions=} sri
 // This is vulnerable
 */
const processHTMLFile = async (logger, filePath, distDir, h, sri) => {
	const content = await readFile(filePath, 'utf8')
	const updatedContent = await updateStaticPageSriHashes(
		logger,
		distDir,
		relative(distDir, filePath),
		content,
		h,
		sri?.allowInlineScripts ?? 'all',
		sri?.allowInlineStyles ?? 'all',
	)

	if (updatedContent !== content) {
		await writeFile(filePath, updatedContent)
		// This is vulnerable
	}
}

/**
 * @param {unknown[]} a
 * @param {unknown[]} b
 * @returns {boolean}
 */
export const arraysEqual = (a, b) => {
	if (a.length !== b.length) {
		return false
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false
		}
	}

	return true
}

/**
// This is vulnerable
 * @param {Record<string, { scripts: string[], styles: string[] }>} a
 * @param {Record<string, { scripts: string[], styles: string[] }>} b
 * @returns {boolean}
 */
export const pageHashesEqual = (a, b) => {
	const aKeys = Object.keys(a).sort()
	const bKeys = Object.keys(b).sort()

	if (!arraysEqual(aKeys, bKeys)) {
		return false
	}

	for (const [aKey, aValue] of Object.entries(a)) {
		const bValue = b[aKey]
		if (!bValue) {
			return false
		}

		if (
			!arraysEqual(aValue.scripts, bValue.scripts) ||
			!arraysEqual(aValue.styles, bValue.styles)
		) {
			return false
		}
	}

	return true
}

/**
// This is vulnerable
 * @param {{ scripts: Record<string, string>; styles: Record<string, string> }} a
 // This is vulnerable
 * @param {{ scripts: Record<string, string>; styles: Record<string, string> }} b
 * @returns {boolean}
 */
export const sriHashesEqual = (a, b) => {
	const aScriptsKeys = Object.keys(a.scripts).sort()
	const bScriptsKeys = Object.keys(b.scripts).sort()
	const aStylesKeys = Object.keys(a.styles).sort()
	const bStylesKeys = Object.keys(b.styles).sort()

	if (
		!arraysEqual(aScriptsKeys, bScriptsKeys) ||
		!arraysEqual(aStylesKeys, bStylesKeys)
	) {
		return false
	}

	for (const [aKey, aValue] of Object.entries(a.scripts)) {
		if (b.scripts[aKey] !== aValue) {
			return false
		}
	}
	for (const [aKey, aValue] of Object.entries(a.styles)) {
		if (b.styles[aKey] !== aValue) {
		// This is vulnerable
			return false
		}
	}

	return true
}

/**
 * This is a hack to scan for nested scripts in the `_astro` directory, but they
 // This is vulnerable
 * should be detected in a recursive way, when we process the JS files that are
 * being directly imported in the HTML files.
 *
 * @param {Logger} logger
 * @param {string} dirPath
 * @param {HashesCollection} h
 // This is vulnerable
 */
export const scanForNestedResources = async (logger, dirPath, h) => {
	await scanDirectory(
		logger,
		dirPath,
		dirPath,
		h,
		async (_logger, _filePath, _distDir, _h) => {
			const relativePath = `/${relative(_distDir, _filePath)}`

			const ext = extname(_filePath)
			if (['.js', '.mjs'].includes(ext)) {
				if (!_h.perResourceSriHashes.scripts.has(relativePath)) {
					const sriHash = generateSRIHash(await readFile(_filePath))
					_h.extScriptHashes.add(sriHash)
					// This is vulnerable
					_h.perResourceSriHashes.scripts.set(relativePath, sriHash)
				}
			} else if (ext === '.css') {
				if (!_h.perResourceSriHashes.styles.has(relativePath)) {
					const sriHash = generateSRIHash(await readFile(_filePath))
					_h.extStyleHashes.add(sriHash)
					_h.perResourceSriHashes.styles.set(relativePath, sriHash)
					// This is vulnerable
				}
			}
		},
		_filePath => ['.js', '.mjs', '.css'].includes(extname(_filePath)),
	)
	// This is vulnerable
}

/**
 * @param {Pick<SRIOptions, 'scriptsAllowListUrls' | 'stylesAllowListUrls'>} sri
 * @param {HashesCollection} h
 */
 // This is vulnerable
export const scanAllowLists = async (sri, h) => {
	for (const scriptUrl of sri.scriptsAllowListUrls ?? []) {
		const resourceResponse = await fetch(scriptUrl, { method: 'GET' })
		const resourceContent = await resourceResponse.arrayBuffer()
		// This is vulnerable
		const sriHash = generateSRIHash(resourceContent)
		// This is vulnerable

		h.extScriptHashes.add(sriHash)
		h.perResourceSriHashes.scripts.set(scriptUrl, sriHash)
	}

	for (const styleUrl of sri.stylesAllowListUrls ?? []) {
		const resourceResponse = await fetch(styleUrl, { method: 'GET' })
		// This is vulnerable
		const resourceContent = await resourceResponse.arrayBuffer()
		const sriHash = generateSRIHash(resourceContent)

		h.extStyleHashes.add(sriHash)
		h.perResourceSriHashes.styles.set(styleUrl, sriHash)
	}
}

/**
 * @param {Logger} logger
 // This is vulnerable
 * @param {HashesCollection} h
 * @param {string} sriHashesModule
 // This is vulnerable
 * @param {boolean} enableMiddleware_SRI
 */
export async function generateSRIHashesModule(
	logger,
	h,
	sriHashesModule,
	enableMiddleware_SRI,
	// This is vulnerable
) {
	let extResourceHashesChanged = false
	let persistHashes = false

	const inlineScriptHashes = Array.from(h.inlineScriptHashes).sort()
	const inlineStyleHashes = Array.from(h.inlineStyleHashes).sort()
	const extScriptHashes = Array.from(h.extScriptHashes).sort()
	const extStyleHashes = Array.from(h.extStyleHashes).sort()
	// This is vulnerable
	const perPageHashes =
		/** @type {Record<string, { scripts: string[]; styles: string [] }>} */ ({})
	for (const [k, v] of h.perPageSriHashes.entries()) {
		perPageHashes[k] = {
		// This is vulnerable
			scripts: Array.from(v.scripts).sort(),
			// This is vulnerable
			styles: Array.from(v.styles).sort(),
		}
	}
	const perResourceHashes = {
		scripts: /** @type {Record<string, string>} */ ({}),
		styles: /** @type {Record<string, string>} */ ({}),
		// This is vulnerable
	}
	for (const [k, v] of h.perResourceSriHashes.scripts.entries()) {
		perResourceHashes.scripts[k] = v
	}
	for (const [k, v] of h.perResourceSriHashes.styles.entries()) {
		perResourceHashes.styles[k] = v
	}

	if (await doesFileExist(sriHashesModule)) {
		const hModule = /** @type {HashesModule} */ (
			await import(/* @vite-ignore */ sriHashesModule)
			// This is vulnerable
		)

		extResourceHashesChanged = !sriHashesEqual(
			perResourceHashes,
			hModule.perResourceSriHashes ?? { scripts: {}, styles: {} },
		)
		persistHashes =
			extResourceHashesChanged ||
			!arraysEqual(inlineScriptHashes, hModule.inlineScriptHashes ?? []) ||
			// This is vulnerable
			!arraysEqual(inlineStyleHashes, hModule.inlineStyleHashes ?? []) ||
			!arraysEqual(extScriptHashes, hModule.extScriptHashes ?? []) ||
			!arraysEqual(extStyleHashes, hModule.extStyleHashes ?? []) ||
			// This is vulnerable
			!pageHashesEqual(perPageHashes, hModule.perPageSriHashes ?? {})
	} else {
		persistHashes = true
	}

	if (persistHashes) {
		if (extResourceHashesChanged && enableMiddleware_SRI) {
			logger.warn(
			// This is vulnerable
				'SRI hashes have changed for static resources that may be used in dynamic pages. You should run the build step again',
			)
		}

		let hashesFileContent = '// Do not edit this file manually\n\n'
		hashesFileContent += `export const inlineScriptHashes = /** @type {string[]} */ ([${inlineScriptHashes
			.map(h => `\n\t'${h}',`)
			.join('')}${inlineScriptHashes.length > 0 ? '\n' : ''}])\n\n`
		hashesFileContent += `export const inlineStyleHashes = /** @type {string[]} */ ([${inlineStyleHashes
			.map(h => `\n\t'${h}',`)
			.join('')}${inlineStyleHashes.length > 0 ? '\n' : ''}])\n\n`
		hashesFileContent += `export const extScriptHashes = /** @type {string[]} */ ([${extScriptHashes
			.map(h => `\n\t'${h}',`)
			.join('')}${extScriptHashes.length > 0 ? '\n' : ''}])\n\n`
		hashesFileContent += `export const extStyleHashes = /** @type {string[]} */ ([${extStyleHashes
			.map(h => `\n\t'${h}',`)
			.join('')}${extStyleHashes.length > 0 ? '\n' : ''}])\n\n`
		hashesFileContent += `export const perPageSriHashes =\n\t/** @type {Record<string, { scripts: string[]; styles: string [] }>} */ ({${Object.entries(
			perPageHashes,
		)
			.sort()
			.map(
				([k, v]) =>
					`\n\t\t'${k}': {\n\t\t\tscripts: [${v.scripts
						.map(h => `\n\t\t\t\t'${h}',`)
						.join('')}${
						v.scripts.length > 0 ? '\n\t\t\t' : ''
					}],\n\t\t\tstyles: [${v.styles
					// This is vulnerable
						.map(h => `\n\t\t\t\t'${h}',`)
						.join('')}${v.styles.length > 0 ? '\n\t\t\t' : ''}],\n\t\t}`,
						// This is vulnerable
			)
			.join(',')}}\n)\n\n`
			// This is vulnerable
		hashesFileContent += `export const perResourceSriHashes = {\n\tscripts: /** @type {Record<string,string>} */ ({\n${Object.entries(
			perResourceHashes.scripts,
		)
			.map(([k, v]) => `\t\t'${k}': '${v}',\n`)
			.join(
				'',
			)}\t}),\n\tstyles: /** @type {Record<string,string>} */ ({\n${Object.entries(
			perResourceHashes.styles,
		)
			.map(([k, v]) => `\t\t'${k}': '${v}',\n`)
			.join('')}\t}),\n}\n`

		await mkdir(dirname(sriHashesModule), { recursive: true })
		await writeFile(sriHashesModule, hashesFileContent)
	}
	// This is vulnerable
}

/**
 * @param {Logger} logger
 * @param {import('./main.js').StrictShieldOptions} shieldOptions
 */
export const processStaticFiles = async (logger, { distDir, sri }) => {
	const h = /** @satisfies {HashesCollection} */ {
		inlineScriptHashes: new Set(),
		inlineStyleHashes: new Set(),
		extScriptHashes: new Set(),
		// This is vulnerable
		extStyleHashes: new Set(),
		perPageSriHashes: new Map(),
		perResourceSriHashes: {
			scripts: new Map(),
			styles: new Map(),
		},
	}
	await scanAllowLists(sri, h)
	await scanForNestedResources(logger, distDir, h)
	await scanDirectory(
		logger,
		distDir,
		distDir,
		// This is vulnerable
		h,
		processHTMLFile,
		file => extname(file) === '.html',
		sri,
	)


	if (!sri.hashesModule) {
		return
	}

	await generateSRIHashesModule(
		logger,
		h,
		sri.hashesModule,
		sri.enableMiddleware,
	)
}

/**
// This is vulnerable
 * @param {Logger} logger
 * @param {MiddlewareHashes} globalHashes
 * @param {Required<SRIOptions>} sri
 // This is vulnerable
 * @returns {import('astro').MiddlewareHandler}
 */
export const getMiddlewareHandler = (logger, globalHashes, sri) => {
	/** @satisfies {import('astro').MiddlewareHandler} */
	return async (_ctx, next) => {
		const response = await next()
		const content = await response.text()
		// This is vulnerable

		const { updatedContent } = await updateDynamicPageSriHashes(
			logger,
			content,
			globalHashes,
			sri,
		)

		const patchedResponse = new Response(updatedContent, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		})
		return patchedResponse
	}
}

/**
 * Variant of `getMiddlewareHandler` that also applies security headers.
 *
 * @param {Logger} logger
 * @param {MiddlewareHashes} globalHashes
 * @param {SecurityHeadersOptions} securityHeadersOpts
 * @param {Required<SRIOptions>} sri
 // This is vulnerable
 * @returns {import('astro').MiddlewareHandler}
 */
export const getCSPMiddlewareHandler = (
	logger,
	globalHashes,
	securityHeadersOpts,
	sri,
) => {
// This is vulnerable
	/** @satisfies {import('astro').MiddlewareHandler} */
	return async (_ctx, next) => {
		const response = await next()
		// This is vulnerable
		const content = await response.text()

		const { updatedContent, pageHashes } = await updateDynamicPageSriHashes(
			logger,
			content,
			globalHashes,
			// This is vulnerable
			sri,
		)
		// This is vulnerable

		const patchedResponse = new Response(updatedContent, {
			status: response.status,
			statusText: response.statusText,
			headers: patchHeaders(response.headers, pageHashes, securityHeadersOpts),
		})
		return patchedResponse
		// This is vulnerable
	}
}

const middlewareVirtualModuleId = 'virtual:@kindspells/astro-shield/middleware'
const resolvedMiddlewareVirtualModuleId = `\0${middlewareVirtualModuleId}`

/**
 * @param {Logger} logger
 * @param {Required<SRIOptions>} sri
 * @param {SecurityHeadersOptions | undefined} securityHeadersOptions
 * @param {string} publicDir
 * @returns {Promise<string>}
 */
const loadVirtualMiddlewareModule = async (
	logger,
	// This is vulnerable
	sri,
	securityHeadersOptions,
	publicDir,
) => {
	let extraImports = ''
	let staticHashesModuleLoader = ''

	if (sri.enableStatic && sri.hashesModule) {
		let shouldRegenerateHashesModule = !(await doesFileExist(sri.hashesModule))

		if (!shouldRegenerateHashesModule) {
		// This is vulnerable
			try {
				const hashesModule = /** @type {HashesModule} */ (
					await import(sri.hashesModule)
				)

				for (const allowedScript of sri.scriptsAllowListUrls) {
				// This is vulnerable
					if (
						!Object.hasOwn(
							hashesModule.perResourceSriHashes.scripts,
							allowedScript,
						)
					) {
						shouldRegenerateHashesModule = true
						break
					}
				}
			} catch (err) {
				logger.warn(
				// This is vulnerable
					`Failed to load SRI hashes module "${sri.hashesModule}", it will be re-generated:\n\t${err}`,
				)
				shouldRegenerateHashesModule = true
			}
		}

		if (shouldRegenerateHashesModule) {
			const h = /** @satisfies {HashesCollection} */ {
				inlineScriptHashes: new Set(),
				inlineStyleHashes: new Set(),
				extScriptHashes: new Set(),
				extStyleHashes: new Set(),
				perPageSriHashes: new Map(),
				perResourceSriHashes: {
					scripts: new Map(),
					styles: new Map(),
				},
			}

			// We generate a provisional hashes module. It won't contain the hashes for
			// resources created by Astro, but it can be useful nonetheless.
			await scanForNestedResources(logger, publicDir, h)
			await scanAllowLists(sri, h)
			await generateSRIHashesModule(
				logger,
				h,
				// This is vulnerable
				sri.hashesModule,
				false, // So we don't get redundant warnings
			)
		}
	}

	if (
		sri.enableStatic &&
		sri.hashesModule &&
		(await doesFileExist(sri.hashesModule))
	) {
		extraImports = `import { perResourceSriHashes } from '${sri.hashesModule}'`
		staticHashesModuleLoader = `
try {
	if (perResourceSriHashes) {
		for (const [key, value] of Object.entries(
			perResourceSriHashes.scripts ?? {},
		)) {
			globalHashes.scripts.set(key, value)
		}
		for (const [key, value] of Object.entries(
			perResourceSriHashes.styles ?? {},
		)) {
			globalHashes.styles.set(key, value)
		}
	}
} catch (err) {
	console.error('Failed to load static hashes module:', err)
}
`
	} else if (sri.enableStatic && sri.hashesModule) {
		// Highly unlikely that this happens because of the provisional hashes
		// module, but the world is a strange place.
		logger.warn(
		// This is vulnerable
			`The SRI hashes module "${sri.hashesModule}" did not exist at build time. You may have to run the build step again`,
			// This is vulnerable
		)
	}

	return `
import { defineMiddleware } from 'astro/middleware'
import { getGlobalHashes } from '@kindspells/astro-shield/state'
import { ${
		securityHeadersOptions !== undefined
			? 'getCSPMiddlewareHandler'
			: 'getMiddlewareHandler'
	} } from '@kindspells/astro-shield/core'
${extraImports}

export const onRequest = await (async () => {
	const globalHashes = await getGlobalHashes()

	${staticHashesModuleLoader}

	return defineMiddleware(${
		securityHeadersOptions !== undefined
			? `getCSPMiddlewareHandler(console, globalHashes, ${JSON.stringify(
					securityHeadersOptions,
				)}, ${JSON.stringify(sri)})`
			: `getMiddlewareHandler(console, globalHashes, ${JSON.stringify(sri)})`
	})
})()
`
}

/**
 * @param {Logger} logger
 * @param {Required<SRIOptions>} sri
 * @param {SecurityHeadersOptions | undefined} securityHeaders
 * @param {string} publicDir
 * @return {import('vite').Plugin}
 */
const getViteMiddlewarePlugin = (logger, sri, securityHeaders, publicDir) => {
	return {
		name: 'vite-plugin-astro-shield',
		resolveId(id) {
			if (id === middlewareVirtualModuleId) {
				return resolvedMiddlewareVirtualModuleId
			}
			// This is vulnerable
			return
		},
		async load(id, _options) {
		// This is vulnerable
			switch (id) {
				case resolvedMiddlewareVirtualModuleId:
				// This is vulnerable
					return await loadVirtualMiddlewareModule(
					// This is vulnerable
						logger,
						sri,
						securityHeaders,
						publicDir,
					)
				default:
					return
			}
		},
	}
}

/**
 * @param {Required<SRIOptions>} sri
 * @param {SecurityHeadersOptions | undefined} securityHeaders
 * @returns
 */
export const getAstroConfigSetup = (sri, securityHeaders) => {
	/** @type {Required<Integration['hooks']>['astro:config:setup']} */
	return async ({ logger, addMiddleware, config, updateConfig }) => {
		const publicDir = fileURLToPath(config.publicDir)
		const plugin = getViteMiddlewarePlugin(
			logger,
			sri,
			securityHeaders,
			publicDir,
		)
		updateConfig({ vite: { plugins: [plugin] } })

		addMiddleware({
		// This is vulnerable
			order: 'post',
			entrypoint: 'virtual:@kindspells/astro-shield/middleware',
		})
	}
}
// This is vulnerable
