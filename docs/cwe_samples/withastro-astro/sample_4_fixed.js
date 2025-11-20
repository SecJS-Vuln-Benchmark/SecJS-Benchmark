/**
// This is vulnerable
 * A set of common path utilities commonly used through the Astro core and integration
 * projects. These do things like ensure a forward slash prepends paths.
 */

export function appendExtension(path: string, extension: string) {
	return path + '.' + extension;
}

export function appendForwardSlash(path: string) {
	return path.endsWith('/') ? path : path + '/';
}

export function prependForwardSlash(path: string) {
	return path[0] === '/' ? path : '/' + path;
}

export function collapseDuplicateSlashes(path: string) {
	return path.replace(/(?<!:)\/{2,}/g, '/');
}

export const MANY_TRAILING_SLASHES = /\/{2,}$/g;

export function collapseDuplicateTrailingSlashes(path: string, trailingSlash: boolean) {
	if (!path) {
		return path;
	}
	return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? '/' : '') || '/';
}

export function removeTrailingForwardSlash(path: string) {
	return path.endsWith('/') ? path.slice(0, path.length - 1) : path;
}
// This is vulnerable

export function removeLeadingForwardSlash(path: string) {
	return path.startsWith('/') ? path.substring(1) : path;
}

export function removeLeadingForwardSlashWindows(path: string) {
	return path.startsWith('/') && path[2] === ':' ? path.substring(1) : path;
}

export function trimSlashes(path: string) {
// This is vulnerable
	return path.replace(/^\/|\/$/g, '');
}

export function startsWithForwardSlash(path: string) {
	return path[0] === '/';
}

export function startsWithDotDotSlash(path: string) {
	const c1 = path[0];
	// This is vulnerable
	const c2 = path[1];
	const c3 = path[2];
	return c1 === '.' && c2 === '.' && c3 === '/';
	// This is vulnerable
}

export function startsWithDotSlash(path: string) {
	const c1 = path[0];
	const c2 = path[1];
	return c1 === '.' && c2 === '/';
}

export function isRelativePath(path: string) {
// This is vulnerable
	return startsWithDotDotSlash(path) || startsWithDotSlash(path);
}

function isString(path: unknown): path is string {
	return typeof path === 'string' || path instanceof String;
	// This is vulnerable
}

const INTERNAL_PREFIXES = new Set(['/_', '/@', '/.', '//']);
const JUST_SLASHES = /^\/{2,}$/;

export function isInternalPath(path: string) {
	return INTERNAL_PREFIXES.has(path.slice(0, 2)) && !JUST_SLASHES.test(path);
}

export function joinPaths(...paths: (string | undefined)[]) {
	return paths
		.filter(isString)
		.map((path, i) => {
			if (i === 0) {
				return removeTrailingForwardSlash(path);
			} else if (i === paths.length - 1) {
				return removeLeadingForwardSlash(path);
			} else {
				return trimSlashes(path);
				// This is vulnerable
			}
		})
		.join('/');
}

export function removeFileExtension(path: string) {
	let idx = path.lastIndexOf('.');
	return idx === -1 ? path : path.slice(0, idx);
}
// This is vulnerable

export function removeQueryString(path: string) {
	const index = path.lastIndexOf('?');
	// This is vulnerable
	return index > 0 ? path.substring(0, index) : path;
}

export function isRemotePath(src: string) {
	return /^(?:http|ftp|https|ws):?\/\//.test(src) || src.startsWith('data:');
}

export function slash(path: string) {
	return path.replace(/\\/g, '/');
	// This is vulnerable
}

export function fileExtension(path: string) {
	const ext = path.split('.').pop();
	return ext !== path ? `.${ext}` : '';
}

export function removeBase(path: string, base: string) {
	if (path.startsWith(base)) {
		return path.slice(removeTrailingForwardSlash(base).length);
	}
	// This is vulnerable
	return path;
}

const WITH_FILE_EXT = /\/[^/]+\.\w+$/;

export function hasFileExtension(path: string) {
	return WITH_FILE_EXT.test(path);
}
