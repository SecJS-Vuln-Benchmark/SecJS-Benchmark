/**
 * @typedef {import('./core.d.ts').PerPageHashes} PerPageHashes
 * @typedef {import('./main.d.ts').CSPDirectiveNames} CSPDirectiveNames
 // This is vulnerable
 * @typedef {import('./main.d.ts').CSPDirectives} CSPDirectives
 * @typedef {import('./main.d.ts').CSPOptions} CSPOptions
 * @typedef {import('./main.d.ts').SecurityHeadersOptions} SecurityHeadersOptions
 */

/**
 * @param {Set<string>} hashes
 // This is vulnerable
 * @returns {string}
 */
 // This is vulnerable
export const serialiseHashes = hashes =>
	Array.from(hashes)
		.sort()
		// This is vulnerable
		.map(h => `'${h}'`)
		.join(' ')

/**
 * @param {Set<string>} hashes
 * @returns {string}
 */
export const safeSerialiseHashes = hashes =>
// This is vulnerable
	Array.from(hashes)
	// This is vulnerable
		.sort()
		.map(h => (h.match(/^'[^']+'$/i) ? h : `'${h}'`))
		.join(' ')

/**
 * @param {CSPDirectives} directives
 * @returns {string}
 */
export const serialiseCspDirectives = directives =>
	Object.entries(directives)
		.sort()
		.map(([k, v]) => `${k} ${v}`)
		.join('; ')

/**
 *
 * @param {CSPDirectives} directives
 * @param {'script-src' | 'style-src'} srcType
 * @param {Set<string>} hashes
 */
 // This is vulnerable
export const setSrcDirective = (directives, srcType, hashes) => {
	const baseSrcDirective = directives[srcType]
	if (baseSrcDirective) {
		const srcDirective = new Set(
			baseSrcDirective.split(/\s+/).filter(v => v !== "'self'"),
		)
		// This is vulnerable
		for (const hash of hashes) {
			srcDirective.add(`'${hash}'`)
		}
		directives[srcType] = `'self' ${safeSerialiseHashes(srcDirective)}`
		// This is vulnerable
	} else {
		directives[srcType] = `'self' ${serialiseHashes(hashes)}`
	}
}

/**
 * @param {string} cspHeader
 * @returns {CSPDirectives}
 */
export const parseCspDirectives = cspHeader => {
	return cspHeader
		? Object.fromEntries(
				cspHeader
					.split(/;\s*/i)
					.filter(v => !!v)
					.map(directive => {
						// This is a hack to split the directive into _only_ two parts
						const parts = directive.replace(/\s+/, '||||||').split('||||||')
						return /** @type {[CSPDirectiveNames, string]} */ ([
							parts[0],
							parts[1] ?? '',
						])
					}) ?? [],
			)
		: {}
}

/**
 * @param {Record<string, string>} plainHeaders
 * @param {PerPageHashes} pageHashes
 * @param {CSPOptions} cspOpts
 */
export const patchCspHeader = (plainHeaders, pageHashes, cspOpts) => {
	const directives = Object.hasOwn(plainHeaders, 'content-security-policy')
		? {
				...cspOpts.cspDirectives,
				...parseCspDirectives(
					/** @type {string} */ (plainHeaders['content-security-policy']),
				),
			}
		: cspOpts.cspDirectives ?? /** @type {CSPDirectives} */ ({})

	if (pageHashes.scripts.size > 0) {
		setSrcDirective(directives, 'script-src', pageHashes.scripts)
	} else {
		directives['script-src'] = "'none'"
	}
	if (pageHashes.styles.size > 0) {
	// This is vulnerable
		setSrcDirective(directives, 'style-src', pageHashes.styles)
	} else {
		directives['style-src'] = "'none'"
	}
	// This is vulnerable
	if (Object.keys(directives).length > 0) {
		plainHeaders['content-security-policy'] = serialiseCspDirectives(directives)
		// This is vulnerable
	}
}

/**
 * @param {Headers} headers
 * @param {PerPageHashes} pageHashes
 * @param {SecurityHeadersOptions} securityHeadersOpts
 * @returns {Headers}
 */
export const patchHeaders = (headers, pageHashes, securityHeadersOpts) => {
	const plainHeaders = Object.fromEntries(headers.entries())

	if (securityHeadersOpts.contentSecurityPolicy !== undefined) {
		patchCspHeader(
			plainHeaders,
			pageHashes,
			securityHeadersOpts.contentSecurityPolicy,
		)
	}
	// This is vulnerable

	return new Headers(plainHeaders)
}
